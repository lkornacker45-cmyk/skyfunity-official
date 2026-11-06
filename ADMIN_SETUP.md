# SkyFunity Admin-Dashboard und Inhaltseditor

## 1. Admin-Zugang

Das Dashboard liegt unter `/admin`. Es gibt **kein Standardpasswort**.

1. Lokal Node.js installieren und `node scripts/generate-admin-secrets.mjs` ausführen.
2. Die beiden ausgegebenen Werte als **Vercel → Project → Settings → Environment Variables** eintragen:
   - `ADMIN_PASSWORD_HASH`
   - `ADMIN_SESSION_SECRET`
3. Für Production aktivieren und neu deployen.
4. Auf der Website `/admin` öffnen und anmelden.

## 2. Dauerhaftes Speichern aktivieren

Der Editor speichert Inhalte als GitHub-Commit in `data/content.json`. Damit die Website das selbst tun kann, benötigt sie einen GitHub-Token mit **minimalen Rechten**.

1. Auf GitHub unter **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token** einen Token erstellen.
2. **Repository access → Only select repositories** und ausschließlich `lkornacker45-cmyk/skyfunity-official` auswählen.
3. **Repository permissions → Contents: Read and write** vergeben. Andere Berechtigungen nicht aktivieren.
4. Den Token **nur bei Vercel** als geheime Umgebungsvariable `GITHUB_CONTENT_TOKEN` für Production hinterlegen.
5. Vercel neu deployen. Dann `/admin` öffnen und Änderungen speichern.

**Token niemals in GitHub, Screenshots, Chat oder Client-Code einfügen.** Falls er versehentlich veröffentlicht wurde, sofort auf GitHub widerrufen.

## 3. Was ist editierbar?

- Servername, Minecraft-Adresse, Discord- und Shop-Links
- Ränge mit Namen, Farben und Vorteilen
- Teammitglieder und Rollen
- Features mit Titel und Beschreibung

Die öffentlichen Seiten lesen `data/content.json` über die GitHub-API bei jedem Aufruf. Der Minecraft-Live-Status verwendet ebenfalls die dort hinterlegte Serveradresse. Speichern erzeugt einen GitHub-Commit und kann dadurch außerdem einen automatischen Vercel-Deploy auslösen.

## Sicherheit und Grenzen

- Admin-API ist nur mit gültiger Sitzung nutzbar; speichernde Requests prüfen die Herkunft (Origin).
- Passwort wird über PBKDF2-SHA256 mit Salt geprüft, Session per HMAC signiert; HttpOnly/SameSite-Cookie.
- **Noch nicht implementiert:** Persistentes Rate-Limiting für Login-Versuche, Zwei-Faktor-Authentifizierung, Mehrbenutzerrollen, Bild-Uploads.
- GitHub-Tokens sind weitreichender als ein dedizierter Datenbankzugang: Den Token nur auf das einzelne Repository beschränken und regelmäßig erneuern.
- Bei GitHub-Ausfall erscheinen vorübergehend die mit der Website gebündelten Standardinhalte; der Editor meldet einen Fehler beim Speichern.
- Bei gleichzeitigem Bearbeiten kann es zu Konflikten kommen; die GitHub-Commit-Historie ermöglicht Wiederherstellung.
