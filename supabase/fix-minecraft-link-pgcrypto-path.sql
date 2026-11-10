-- One-time fix for existing SkyFunity Supabase databases.
-- The pgcrypto extension often resides in the 'extensions' schema,
-- while the SECURITY DEFINER functions were created with search_path = ''.
-- Discover the actual schema instead of assuming it.
-- No tables, existing accounts, or codes are removed.
DO $fix$
DECLARE
  crypto_schema text;
BEGIN
  SELECT n.nspname INTO crypto_schema
  FROM pg_extension AS e
  JOIN pg_namespace AS n ON n.oid = e.extnamespace
  WHERE e.extname = 'pgcrypto';

  IF crypto_schema IS NULL THEN
    RAISE EXCEPTION 'pgcrypto extension is not installed. Enable pgcrypto in Supabase Database > Extensions before running this fix.';
  END IF;

  EXECUTE format(
    'ALTER FUNCTION public.create_minecraft_link_code() SET search_path = pg_catalog, %I',
    crypto_schema
  );
  EXECUTE format(
    'ALTER FUNCTION public.redeem_minecraft_link_code(text, uuid) SET search_path = pg_catalog, %I',
    crypto_schema
  );

  RAISE NOTICE 'Minecraft link functions can now resolve pgcrypto in schema %.', crypto_schema;
END
$fix$;

-- Inspection only: verify both functions have the new search_path.
SELECT p.proname, p.proconfig
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('create_minecraft_link_code', 'redeem_minecraft_link_code');
