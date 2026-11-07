# SkyFunityLink + SkyFunitySync (Folia)

This repository contains **source code**, not an installed plugin or a running sync service. Neither the Pterodactyl panel nor the root server was modified.

## 1. Supabase SQL (run manually)
Run in order in Supabase SQL Editor:
1. `supabase/schema.sql` (already present for existing accounts)
2. `supabase/player-stats.sql` and `supabase/player-currencies.sql` (if not already applied)
3. `supabase/minecraft-link.sql`

The linking SQL creates an authenticated, rate-limited 12-character hex code (10-minute expiry), stores only its SHA-256 digest, and allows redemption only by the Supabase service role. A verified Minecraft UUID can be linked to at most one website user. This first version intentionally does **not** permit self-service unlinking or relinking.

## 2. Build the Folia plugin
Requires JDK 21 and Maven:
```sh
cd skyfunity-link
mvn -B package
```
Upload `target/skyfunity-link-1.0.0.jar` to your Folia server's `plugins/` folder and restart it. Configure `plugins/SkyFunityLink/config.yml` with the public **HTTPS** URL of the sync service and the same long random shared secret as `LINK_SHARED_SECRET`. Do not upload your configured secret to GitHub.

Players use `/websitelink <CODE>` (the command is only accepted from an actual player). The plugin uses Folia's entity scheduler for chat responses and asynchronous HTTP requests.

## 3. SkyFunitySync service
Use a Node.js 20+ Pterodactyl Egg (or systemd service on the root server). In `skyfunity-sync` run `npm install --omit=dev` and `npm start`. Provide environment variables listed in `.env.example` privately through Pterodactyl. Never put Supabase service-role keys in the website, browser, public config, GitHub, or a `NEXT_PUBLIC_` variable.

The service connects to your **internal** MariaDB `172.18.0.1:3307` (verify connectivity from the actual service container), queries `sf_coins_konten` with a read-only MariaDB user, and updates Supabase `player_currencies` every 60 seconds. It imports **only verified linked UUIDs**. Coins, Funitys and Gems are separate; missing rows stay null. It does not change Minecraft balances. Job stats and other player stats are **not yet imported**.

Create a MariaDB user with only SELECT on the necessary table, e.g. have your DBA configure an appropriate account and host restriction, then:
```sql
GRANT SELECT ON skyfunity.sf_coins_konten TO 'skyfunity_sync_readonly'@'%';
```
The example assumes that the user already exists; restrict the host to the Docker network where possible. Avoid using the main `skyfunity` database account.

### HTTPS requirement
The Minecraft plugin must call the sync service through HTTPS. The Node service listens on `127.0.0.1:8787` by default; expose only `POST /claim` via a reverse proxy with TLS, or use a private network + TLS proxy. If running in a Pterodactyl container, `127.0.0.1` is *inside that container*: set `HOST=0.0.0.0` only when the endpoint is protected by a correctly configured reverse proxy and firewall. Do **not** publicly expose the raw HTTP port.

Use a random 32+ byte secret (for example generated with `openssl rand -hex 32`) in the plugin config and the service environment. Protect the plugin config from other users. Never reuse database credentials as the shared secret.

## 4. Test
1. Log into `/account` and click **Verbindungscode erstellen**.
2. Join the Folia server with the Minecraft account to be linked.
3. Enter `/websitelink ABCDEF123456` using your **actual** generated code.
4. The account page should display your verified UUID within ~15 seconds.
5. Check Coins, Funitys and Gems after the next sync cycle (up to 60 seconds).
6. Test invalid/expired codes, a second website account using the same UUID, and a second Minecraft UUID attempting to link an already-linked website account.

**No deployment has been performed automatically.** The website changes are committed, but the SQL, Maven build, Pterodactyl server, reverse proxy, and secret configuration require manual deployment.
