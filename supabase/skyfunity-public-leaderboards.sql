-- SkyFunity: öffentliche Ranglistenansicht (nur Spielzeit + Votes).
-- In Supabase SQL Editor ausführen. Löscht keine Spielerdaten.
-- Erwartet die bestehenden Tabellen public.minecraft_server_stats und public.minecraft_vote_totals.
-- Die alte Test-Server-ID 159ef25f wird absichtlich nicht berücksichtigt.
-- Achtung: Spielername und aggregierter Score werden öffentlich lesbar.
CREATE OR REPLACE VIEW public.skyfunity_public_leaderboards AS
WITH server_totals AS (
  SELECT
    minecraft_uuid,
    MAX(player_name) AS player_name,
    SUM(playtime_ticks)::numeric AS ticks
  FROM public.minecraft_server_stats
  WHERE LOWER(server_id) IN ('stadtbau','citybuild','welten','farmwelten')
  GROUP BY minecraft_uuid
),
combined AS (
  SELECT 'spielzeit'::text AS category,
         minecraft_uuid,
         player_name,
         ROUND(ticks / 72000.0, 1) AS score
  FROM server_totals
  UNION ALL
  SELECT 'votes'::text AS category,
         minecraft_uuid,
         player_name,
         all_time_votes::numeric AS score
  FROM public.minecraft_vote_totals
),
ranked AS (
  SELECT category, minecraft_uuid, player_name, score,
         ROW_NUMBER() OVER (PARTITION BY category ORDER BY score DESC, minecraft_uuid) AS position
  FROM combined
  WHERE score > 0
)
SELECT category, minecraft_uuid, player_name, score
FROM ranked
WHERE position <= 10;

REVOKE ALL ON public.skyfunity_public_leaderboards FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.skyfunity_public_leaderboards TO anon, authenticated;

-- Prüfen:
SELECT category, player_name, score
FROM public.skyfunity_public_leaderboards
ORDER BY category, score DESC;
