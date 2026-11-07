# SkyFunity Coins, Funitys and Gems

1. In Supabase SQL Editor run `supabase/player-currencies.sql`. This creates `public.player_currencies` with read access restricted to the signed-in owner via RLS. It does not modify existing accounts or tickets.
2. The website at `/account` displays Coins, Funitys and Gems as three separate cards. A dash means the balance has not been imported, **not zero**.
3. A trusted Minecraft server-side integration must read the authoritative balance of each currency from the relevant economy plugin and synchronize `coins`, `funitys`, `gems`, `updated_at` for the correct verified Supabase `user_id`.
4. Verify ownership of the Minecraft UUID through an in-game one-time challenge before linking a Minecraft player to a website user. Do not trust the registration nickname alone.
5. The synchronization process must keep any Supabase service-role credential on the server only, never in GitHub, the client, or any `NEXT_PUBLIC_*` environment variable.
6. Currency plugins, their API and storage formats still need to be inspected before implementing a live importer. SkyFunityJobs is a jobs plugin and does not establish the authoritative storage for all three currencies.

Example importer record shape (documentation only, not a client API):
`{user_id: verifiedAuthUserId, coins: coinsBalance, funitys: funitysBalance, gems: gemsBalance, updated_at: currentTimestamp}`
