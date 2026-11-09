-- SkyFunity: remove the premature Top-10 cutoff for Spielzeit and Votes.
-- The website already filters sett_camo, chriss and tobixv3 and slices to ten.
-- Preserve the original view's playtime aggregation, existing exclusions and grants.
DO $migration$
DECLARE
  original_definition text;
  unlimited_definition text;
BEGIN
  SELECT pg_get_viewdef('public.skyfunity_public_leaderboards'::regclass, true)
    INTO original_definition;

  -- Match only the final Top-10 predicate, not any nested condition.
  IF original_definition !~* 'WHERE[[:space:]]+("position"|pos)[[:space:]]*<=[[:space:]]*10[[:space:]]*;?[[:space:]]*$' THEN
    RAISE EXCEPTION 'View definition differs from the reviewed version; no changes made.';
  END IF;

  unlimited_definition := regexp_replace(
    original_definition,
    'WHERE[[:space:]]+("position"|pos)[[:space:]]*<=[[:space:]]*10[[:space:]]*;?[[:space:]]*$',
    '',
    'i'
  );

  EXECUTE 'CREATE OR REPLACE VIEW public.skyfunity_public_leaderboards AS ' || unlimited_definition;
END
$migration$;

-- Verify that the view now contains enough candidates for a complete public Top 10.
SELECT category,
       count(*) FILTER (
         WHERE lower(btrim(player_name)) NOT IN ('sett_camo','chriss','tobixv3')
       ) AS eligible_players
FROM public.skyfunity_public_leaderboards
GROUP BY category
ORDER BY category;
