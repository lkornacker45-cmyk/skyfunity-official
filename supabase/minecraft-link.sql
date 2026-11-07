-- Run AFTER supabase/schema.sql. Secure one-time Minecraft account linking.
create extension if not exists pgcrypto;
create table if not exists public.minecraft_links (
 user_id uuid primary key references auth.users(id) on delete cascade,
 minecraft_uuid uuid not null unique,
 linked_at timestamptz not null default now()
);
create table if not exists public.minecraft_link_codes (
 user_id uuid primary key references auth.users(id) on delete cascade,
 code_hash text not null unique,
 expires_at timestamptz not null,
 created_at timestamptz not null default now()
);
create index if not exists minecraft_link_codes_expiry_idx on public.minecraft_link_codes(expires_at);
alter table public.minecraft_links enable row level security;
alter table public.minecraft_link_codes enable row level security;
drop policy if exists "minecraft links owner read" on public.minecraft_links;
create policy "minecraft links owner read" on public.minecraft_links for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.minecraft_links from anon,authenticated;
revoke all on public.minecraft_link_codes from anon,authenticated;
grant select on public.minecraft_links to authenticated;

-- Authenticated players can request a short-lived code; codes are never stored in plaintext.
create or replace function public.create_minecraft_link_code()
returns text language plpgsql security definer set search_path = ''
as $$
declare
 uid uuid := auth.uid();
 new_code text;
 last_created timestamptz;
begin
 if uid is null then raise exception 'Not authenticated'; end if;
 if exists(select 1 from public.minecraft_links where user_id=uid) then
   raise exception 'Minecraft account already linked';
 end if;
 select created_at into last_created from public.minecraft_link_codes where user_id=uid;
 if last_created is not null and last_created > now()-interval '60 seconds' then
   raise exception 'Please wait 60 seconds before requesting a new code';
 end if;
 new_code := upper(encode(gen_random_bytes(6),'hex'));
 insert into public.minecraft_link_codes(user_id,code_hash,expires_at,created_at)
 values(uid,encode(digest(new_code,'sha256'),'hex'),now()+interval '10 minutes',now())
 on conflict (user_id) do update
 set code_hash=excluded.code_hash,expires_at=excluded.expires_at,created_at=excluded.created_at;
 return new_code;
end;
$$;
revoke all on function public.create_minecraft_link_code() from public,anon;
grant execute on function public.create_minecraft_link_code() to authenticated;

-- Only the backend with service_role may redeem a code. Plugin itself never gets this credential.
create or replace function public.redeem_minecraft_link_code(p_code text,p_minecraft_uuid uuid)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare linked_user uuid;
begin
 if auth.role() <> 'service_role' then raise exception 'Service role required'; end if;
 if p_code !~ '^[A-F0-9]{12}$' then raise exception 'Invalid code'; end if;
 select user_id into linked_user from public.minecraft_link_codes
 where code_hash=encode(digest(p_code,'sha256'),'hex') and expires_at>now()
 for update;
 if linked_user is null then raise exception 'Invalid or expired code'; end if;
 if exists(select 1 from public.minecraft_links where user_id=linked_user or minecraft_uuid=p_minecraft_uuid) then
   raise exception 'Account or Minecraft UUID already linked';
 end if;
 insert into public.minecraft_links(user_id,minecraft_uuid) values(linked_user,p_minecraft_uuid);
 delete from public.minecraft_link_codes where user_id=linked_user;
 return linked_user;
end;
$$;
revoke all on function public.redeem_minecraft_link_code(text,uuid) from public,anon,authenticated;
grant execute on function public.redeem_minecraft_link_code(text,uuid) to service_role;
