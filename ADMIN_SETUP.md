# SkyFunity Admin-Dashboard einrichten

Das Dashboard ist unter `/admin` erreichbar. **Ohne die beiden Geheimnisse ist eine Anmeldung nicht möglich.** Es gibt kein Standardpasswort.

1. Lokal `node scripts/generate-admin-secrets.mjs` ausführen und ein starkes Passwort wählen (mindestens 12 Zeichen).
2. Die ausgegebenen Werte als Umgebungsvariablen `ADMIN_PASSWORD_HASH` und `ADMIN_SESSION_SECRET` bei Vercel unter **Project → Settings → Environment Variables** eintragen. Lokal in `.env.local` ablegen.
3. Deployment neu starten, damit die Variablen übernommen werden.
4. `/admin` öffnen und mit dem gewählten Passwort anmelden.

**Sicherheit:** Passwort wird mit PBKDF2-SHA256 und zufälligem Salt geprüft. Die Sitzung nutzt einen HMAC-signierten, HttpOnly-, SameSite=Strict-Cookie mit maximal acht Stunden Laufzeit. Die API prüft den Request-Origin bei Anmeldung/Abmeldung. Keine Zugangsdaten in GitHub speichern. Bei Verdacht auf Missbrauch den Session-Schlüssel ändern, dadurch werden alle Sessions ungültig.

**Aktuelle Einschränkungen:** Es gibt noch keine persistente Login-Versuchsdrosselung, keine Zwei-Faktor-Authentifizierung und keinen browserbasierten Inhaltseditor. Vor öffentlicher produktiver Nutzung mit vielen Administratoren sollten Rate-Limiting und MFA ergänzt werden. Ränge, Team und Features können aktuell über `lib/config.ts` auf GitHub gepflegt werden.
