# SkyFunity player statistics – connection guide

## Already implemented
- Private `player_stats` and `player_job_stats` tables with RLS: signed-in users can read only their own statistics.
- `/account` shows a pastel-lilac statistics panel with playtime, balance, rank, blocks mined, mob kills, and all imported jobs and levels.
- Empty values are shown as missing, not fabricated.
- Existing Supabase account/ticket system remains unchanged.

## Required setup
1. Run `supabase/player-stats.sql` in the Supabase SQL Editor **once**. This migration is separate from the earlier `schema.sql`.
2. Identify Minecraft host, server software (Paper/Purpur/Spigot/Velocity etc.), jobs plugin name/version, economy plugin and permissions plugin. For proxy networks, identify which backend stores each statistic.
3. Build a trusted server-side sync bridge that reads player UUIDs and plugin APIs or database. Do **not** query Minecraft plugin databases from the browser.
4. Verify that each website account really owns its Minecraft UUID, e.g. with a one-time code shown on the website and entered in-game, then record the verified mapping. A typed Minecraft name is insufficient and may change.
5. The bridge should write `player_stats` and `player_job_stats` using a service-role key held **only on the trusted backend**. Do not put the service-role key in `NEXT_PUBLIC_*`, GitHub or public files. Restrict bridge access, add rate limiting and monitoring, and rotate secrets when needed.
6. Update the website privacy notice to explain statistics collection, Minecraft identity linkage, purposes, retention, and deletion. Test with two separate player accounts that RLS prevents access to another player's stats.

## Data shape
`player_stats`: `user_id` (Supabase auth UUID), `minecraft_uuid` (verified Mojang/player UUID), `playtime_seconds`, `balance`, `server_rank`, `blocks_mined`, `mob_kills`, `updated_at`.

`player_job_stats`: `user_id`, `job_key` (plugin job identifier), `job_level`, `job_xp`, `updated_at`. The composite primary key is `(user_id,job_key)`.

No importer or Minecraft plugin bridge is included because the server host and exact plugin are still unknown. Do not mistake the UI for live synchronization.
