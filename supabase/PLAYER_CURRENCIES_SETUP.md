# SkyFunity Coins, Funitys and Gems

1. In Supabase SQL Editor run `supabase/player-currencies.sql`. This creates `public.player_currencies` with read access restricted to the signed-in owner via RLS. It does not modify existing accounts or tickets.
2. The website at `/account` displays Coins, Funitys and Gems as three separate cards. A dash means the balance has not been imported, **not zero**.
3. A trusted Minecraft server-side integration must read the authoritative balance of each currency from the relevant economy plugin and synchronize `coins`, `funitys`, `gems`, `updated_at` for the correct verified Supabase `user_id`.
4. Verify ownership of the Minecraft UUID through an in-game one-time challenge before linking a Minecraft player to a website user. Do not trust the registration nickname alone.
5. The synchronization process must keep any Supabase service-role credential on the server only, never in GitHub, the client, or any `NEXT_PUBLIC_*` environment variable.
6. Currency plugins, their API and storage formats still need to be inspected before implementing a live importer. SkyFunityJobs is a jobs plugin and does not establish the authoritative storage for all three currencies.

Example importer record shape (documentation only, not a client API):
`{user_id: verifiedAuthUserId, coins: coinsBalance, funitys: funitysBalance, gems: gemsBalance, updated_at: currentTimestamp}`


## Verified SkyFunityCoins 1.0.3 source (JAR inspection)

The plugin itself owns the authoritative MySQL ledger; it does not require separate economy plugins for Coins, Funitys and Gems. Its default configuration declares `waehrungen.coins`, `waehrungen.funitys`, and `waehrungen.gems`. The plugin creates:
- `sf_coins_konten(uuid CHAR(36), waehrung VARCHAR(32), betrag DECIMAL(36,8), geaendert BIGINT, PRIMARY KEY(uuid,waehrung))`
- `sf_coins_spieler(uuid CHAR(36), name VARCHAR(16), zuletzt BIGINT, ...)`

The JAR reads balances using `SELECT waehrung, betrag FROM sf_coins_konten WHERE uuid = ?`. A read-only importer can use the following parameterized query after a verified UUID link:

```sql
SELECT waehrung, betrag
FROM sf_coins_konten
WHERE uuid = ?
  AND waehrung IN ('coins','funitys','gems');
```

Map rows to `public.player_currencies.coins`, `.funitys`, `.gems` by their `waehrung` key; if a currency row is absent, confirm whether the plugin's configured starting balance applies before writing a numeric zero. The MySQL user used by the importer should have SELECT permission only. Never put MySQL credentials or the Supabase service-role key in the frontend.

**Important precision:** MySQL `betrag` is DECIMAL(36,8), whereas the current Supabase display table is NUMERIC(20,2). If fractional precision beyond two decimals is used, migrate Supabase currency columns to NUMERIC(36,8) before import.

The importer cannot be activated without (1) verified account-to-Minecraft-UUID links, (2) secure access to the actual MySQL host, and (3) a trusted execution environment. No credentials or server connection are bundled.
