-- Apply in Supabase SQL Editor AFTER schema.sql, minecraft-link.sql and player-stats.sql.
-- Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
create table if not exists public.community_news (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
 title text not null check (char_length(title) between 3 and 120),
 summary text not null default '' check (char_length(summary)<=300),
 body text not null check (char_length(body) between 1 and 12000),
 category text not null default 'Update' check (category in ('Update','Event','Ankündigung','Wartung')),
 published boolean not null default false,
 published_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists community_news_public_idx on public.community_news(published,published_at desc);
create table if not exists public.community_achievements (
 id text primary key check (id ~ '^[a-z0-9_-]{2,40}$'),
 title text not null check (char_length(title) between 2 and 80),
 description text not null default '' check (char_length(description)<=250),
 icon text not null default '🏆' check (char_length(icon)<=16),
 kind text not null check (kind in ('automatic','manual')),
 threshold_seconds bigint check (threshold_seconds is null or threshold_seconds>=0)
);
create table if not exists public.community_awards (
 user_id uuid not null references auth.users(id) on delete cascade,
 achievement_id text not null references public.community_achievements(id) on delete cascade,
 awarded_at timestamptz not null default now(),
 primary key(user_id,achievement_id)
);
create table if not exists public.community_profile_settings (
 user_id uuid primary key references auth.users(id) on delete cascade,
 public_enabled boolean not null default false
);
alter table public.community_news enable row level security;
alter table public.community_achievements enable row level security;
alter table public.community_awards enable row level security;
alter table public.community_profile_settings enable row level security;
-- Public can read only published news; drafts require server-side admin access.
drop policy if exists "community published news" on public.community_news;
create policy "community published news" on public.community_news for select to anon,authenticated using (published and published_at<=now());
drop policy if exists "community achievement definitions" on public.community_achievements;
create policy "community achievement definitions" on public.community_achievements for select to anon,authenticated using (true);
drop policy if exists "community own awards" on public.community_awards;
create policy "community own awards" on public.community_awards for select to authenticated using (user_id=auth.uid());
drop policy if exists "community own visibility read" on public.community_profile_settings;
create policy "community own visibility read" on public.community_profile_settings for select to authenticated using (user_id=auth.uid());
drop policy if exists "community own visibility insert" on public.community_profile_settings;
create policy "community own visibility insert" on public.community_profile_settings for insert to authenticated with check (user_id=auth.uid());
drop policy if exists "community own visibility update" on public.community_profile_settings;
create policy "community own visibility update" on public.community_profile_settings for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
revoke all on public.community_news,public.community_achievements,public.community_awards,public.community_profile_settings from anon,authenticated;
grant select on public.community_news,public.community_achievements to anon,authenticated;
grant select on public.community_awards to authenticated;
grant select,insert,update(public_enabled) on public.community_profile_settings to authenticated;
insert into public.community_achievements(id,title,description,icon,kind,threshold_seconds) values
 ('linked','Verbunden','Minecraft-Account erfolgreich verknüpft','🔗','automatic',null),
 ('playtime_1h','Erste Stunde','Mindestens eine Stunde auf SkyFunity gespielt','⏱️','automatic',3600),
 ('playtime_24h','Stammspieler','Mindestens 24 Stunden gespielt','⭐','automatic',86400),
 ('playtime_100h','Veteran','Mindestens 100 Stunden gespielt','🏆','automatic',360000)
on conflict(id) do nothing;
-- Trigger only reacts to trusted imports in player_stats and verified link redemption.
create or replace function public.community_award_linked() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 insert into public.community_awards(user_id,achievement_id) values(new.user_id,'linked') on conflict do nothing;
 return new;
end $$;
drop trigger if exists community_link_award on public.minecraft_links;
create trigger community_link_award after insert on public.minecraft_links for each row execute function public.community_award_linked();
create or replace function public.community_award_playtime() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 insert into public.community_awards(user_id,achievement_id)
 select new.user_id,id from public.community_achievements
 where kind='automatic' and threshold_seconds is not null and new.playtime_seconds>=threshold_seconds
 on conflict do nothing;
 return new;
end $$;
drop trigger if exists community_playtime_award on public.player_stats;
create trigger community_playtime_award after insert or update of playtime_seconds on public.player_stats
for each row execute function public.community_award_playtime();
-- Backfill existing verified accounts and existing imported playtime.
insert into public.community_awards(user_id,achievement_id)
select user_id,'linked' from public.minecraft_links on conflict do nothing;
insert into public.community_awards(user_id,achievement_id)
select s.user_id,a.id from public.player_stats s join public.community_achievements a
on a.kind='automatic' and a.threshold_seconds is not null and s.playtime_seconds>=a.threshold_seconds
on conflict do nothing;
