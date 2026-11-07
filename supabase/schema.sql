-- SkyFunity: run in Supabase SQL Editor after creating the project.
-- Never put a service_role key in the browser or in NEXT_PUBLIC_ variables.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 minecraft_name text not null check (minecraft_name ~ '^[A-Za-z0-9_]{3,16}$'),
 role text not null default 'player' check (role in ('player','team','admin')),
 created_at timestamptz not null default now()
);

create table if not exists public.tickets (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
 category text not null check (category in ('Allgemein','Spieler melden','Shop & Ränge','Bug melden','Entbannung','Sonstiges')),
 subject text not null check (char_length(subject) between 5 and 120),
 status text not null default 'open' check (status in ('open','in_progress','closed')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.ticket_messages (
 id uuid primary key default gen_random_uuid(),
 ticket_id uuid not null references public.tickets(id) on delete cascade,
 author_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
 body text not null check (char_length(body) between 1 and 4000),
 created_at timestamptz not null default now()
);

create index if not exists tickets_owner_created_idx on public.tickets(owner_id,created_at desc);
create index if not exists ticket_messages_ticket_created_idx on public.ticket_messages(ticket_id,created_at);

create or replace function public.is_support_staff()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.profiles where id = (select auth.uid()) and role in ('team','admin')); $$;

create or replace function public.create_player_profile()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
 insert into public.profiles(id,minecraft_name)
 values(new.id,coalesce(nullif(new.raw_user_meta_data ->> 'minecraft_name',''), 'Player_' || left(replace(new.id::text,'-',''),8)));
 return new;
end;
$$;

drop trigger if exists on_skyfunity_user_created on auth.users;
create trigger on_skyfunity_user_created after insert on auth.users
for each row execute function public.create_player_profile();

create or replace function public.touch_ticket()
returns trigger language plpgsql set search_path = ''
as $$
begin
 update public.tickets set updated_at = now() where id = new.ticket_id;
 return new;
end;
$$;
drop trigger if exists on_skyfunity_ticket_message on public.ticket_messages;
create trigger on_skyfunity_ticket_message after insert on public.ticket_messages
for each row execute function public.touch_ticket();

alter table public.profiles enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;

drop policy if exists "profiles self or team read" on public.profiles;
create policy "profiles self or team read" on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_support_staff()));

drop policy if exists "tickets owner or team read" on public.tickets;
create policy "tickets owner or team read" on public.tickets for select to authenticated
using (owner_id = (select auth.uid()) or (select public.is_support_staff()));

drop policy if exists "tickets player create" on public.tickets;
create policy "tickets player create" on public.tickets for insert to authenticated
with check (owner_id = (select auth.uid()) and status = 'open');

drop policy if exists "tickets team update" on public.tickets;
create policy "tickets team update" on public.tickets for update to authenticated
using ((select public.is_support_staff())) with check ((select public.is_support_staff()));

drop policy if exists "messages owner or team read" on public.ticket_messages;
create policy "messages owner or team read" on public.ticket_messages for select to authenticated
using (exists(select 1 from public.tickets t where t.id = ticket_id and (t.owner_id = (select auth.uid()) or (select public.is_support_staff()))));

drop policy if exists "messages participant create" on public.ticket_messages;
create policy "messages participant create" on public.ticket_messages for insert to authenticated
with check (
 author_id = (select auth.uid()) and exists(
  select 1 from public.tickets t where t.id = ticket_id
  and t.status <> 'closed'
  and (t.owner_id = (select auth.uid()) or (select public.is_support_staff()))
 )
);

-- Do not allow players to update their profile role or modify messages.
revoke insert, update, delete on public.profiles from anon, authenticated;
revoke delete on public.tickets from anon, authenticated;
revoke update, delete on public.ticket_messages from anon, authenticated;
grant select on public.profiles, public.tickets, public.ticket_messages to authenticated;
grant insert on public.tickets, public.ticket_messages to authenticated;
grant update(status) on public.tickets to authenticated;
grant execute on function public.is_support_staff() to authenticated;

-- Promote a verified staff user manually in SQL Editor (replace with real user UUID):
-- update public.profiles set role='team' where id='REPLACE-WITH-USER-UUID';
-- Never let players choose their own role at registration.
