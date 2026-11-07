-- SkyFunity optional player statistics extension.
-- Run in Supabase SQL Editor AFTER supabase/schema.sql.
-- All values are supplied by a trusted server-side importer, never by the browser.
-- A Minecraft username alone is NOT proof of account ownership.
create table if not exists public.player_stats (
 user_id uuid primary key references auth.users(id) on delete cascade,
 minecraft_uuid uuid unique,
 playtime_seconds bigint not null default 0 check (playtime_seconds >= 0),
 balance numeric(18,2),
 server_rank text,
 blocks_mined bigint check (blocks_mined >= 0),
 mob_kills bigint check (mob_kills >= 0),
 updated_at timestamptz not null default now()
);
create table if not exists public.player_job_stats (
 user_id uuid not null references auth.users(id) on delete cascade,
 job_key text not null check (char_length(job_key) between 1 and 64),
 job_level integer not null check (job_level >= 0),
 job_xp numeric(18,2),
 updated_at timestamptz not null default now(),
 primary key (user_id,job_key)
);
create index if not exists player_job_stats_user_idx on public.player_job_stats(user_id);
alter table public.player_stats enable row level security;
alter table public.player_job_stats enable row level security;
drop policy if exists "player stats owner read" on public.player_stats;
create policy "player stats owner read" on public.player_stats for select to authenticated
using (user_id = (select auth.uid()));
drop policy if exists "player job stats owner read" on public.player_job_stats;
create policy "player job stats owner read" on public.player_job_stats for select to authenticated
using (user_id = (select auth.uid()));
revoke all on public.player_stats from anon,authenticated;
revoke all on public.player_job_stats from anon,authenticated;
grant select on public.player_stats,public.player_job_stats to authenticated;
-- Inserts/updates: only through a trusted backend with a secret service-role key.
-- Never expose the service-role key in NEXT_PUBLIC_* or browser code.
