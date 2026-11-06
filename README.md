# SkyFunity

Minecraft Java & Bedrock Website mit Next.js 14, TypeScript und Tailwind CSS.

## Lokal starten

```bash
npm install
npm run dev
```

Danach http://localhost:3000 öffnen.

## Deployment

Repository in Vercel importieren und Next.js als Framework auswählen. Die Website wurde bisher noch nicht live gebaut oder getestet.

## Geschütztes Admin-Dashboard

Unter `/admin` gibt es einen passwortgeschützten Verwaltungsbereich. Ohne Konfiguration ist der Login deaktiviert; ein Standardpasswort existiert nicht. **Die Einrichtung ist in [ADMIN_SETUP.md](ADMIN_SETUP.md) beschrieben.**

## Live-Daten

`/api/status` fragt Java und Bedrock über `api.mcsrvstat.us` ab. Für Discord-Onlinezahlen muss die Server-ID als `DISCORD_GUILD_ID` gesetzt und das Discord-Widget aktiviert sein. Eine 24-Stunden-Historie benötigt eine Datenbank und regelmäßige Messungen.

## Inhalte

Beispielränge, Team und Features in `lib/config.ts` anpassen. Der Adminbereich verlinkt die GitHub-Konfiguration; ein Web-Editor ist noch nicht vorhanden.

Server-IP: `skyfunity.de` · Discord: https://discord.gg/BFrhHMYgrV · Shop: https://skyfunity.de/shop

**Keine Passwörter, Tokens oder Secret-Werte ins öffentliche Repository committen.**
