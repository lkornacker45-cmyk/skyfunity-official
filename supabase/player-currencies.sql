-- Run AFTER supabase/schema.sql. Independent of player-stats.sql.
-- Private balances for the three SkyFunity in-game currencies.
-- Values must be synchronized by a trusted server process after verifying Minecraft UUID ownership.
create table if not exists public.player_currencies (
 user_id uuid primary key references auth.users(id) on delete cascade,
 coins numeric(20,2),
 funitys numeric(20,2),
 gems numeric(20,2),
 updated_at timestamptz not null default now()
);
alter table public.player_currencies enable row level security;
drop policy if exists "player currencies owner read" on public.player_currencies;
create policy "player currencies owner read" on public.player_currencies
for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.player_currencies from anon, authenticated;
grant select on public.player_currencies to authenticated;
-- Never add client-side insert/update policies: only trusted backend may sync balances.
