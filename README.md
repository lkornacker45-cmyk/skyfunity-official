# SkyFunity

Minecraft Java & Bedrock Community-Website mit Next.js 14, TypeScript und Tailwind CSS.

## Lokal starten

```bash
npm install
npm run dev
```

Öffne http://localhost:3000.

## Deployment

Repository in Vercel importieren und mit Next.js-Standardkonfiguration deployen.

## Live-Daten

`/api/status` fragt Minecraft Java über `api.mcsrvstat.us` ab. Discord-Widget-Daten sind nur verfügbar, wenn das Server-Widget aktiviert und die Guild-ID in `DISCORD_GUILD_ID` hinterlegt ist. Statistiken über 24 Stunden benötigen später einen Cron-Job und eine Datenbank. Keine Zugangsdaten ins Repository committen.

## Anpassen

Ränge, Teammitglieder und Spielmodi sind derzeit Beispieldaten in `lib/config.ts`. Server-IP: `skyfunity.de`. Discord: https://discord.gg/BFrhHMYgrV. Shop: https://skyfunity.de/shop.
