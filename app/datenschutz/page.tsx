import type {Metadata} from "next";
import Link from "next/link";

export const metadata:Metadata={title:"Datenschutzerklärung",description:"Informationen zum Datenschutz auf der SkyFunity-Website."};

export default function Datenschutz(){
return <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
<article className="sky-privacy-content">
<p className="section-label">SkyFunity · Rechtliches</p>
<h1 className="mt-3 text-4xl font-black text-white">Datenschutzerklärung</h1>
<p className="mt-4 text-sm text-amber-200"><strong>Wichtiger Hinweis:</strong> Dies ist ein Entwurf, der vor der rechtlichen Verwendung vervollständigt und anhand der tatsächlichen Dienste und Datenverarbeitungen geprüft werden muss. Insbesondere fehlen noch die Kontaktdaten des Verantwortlichen.</p>
<h2>1. Verantwortliche Stelle</h2>
<p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
<p><strong>[Name bzw. rechtlich verantwortliche Person/Organisation ergänzen]</strong><br/>[Postanschrift ergänzen]<br/>[Kontakt-E-Mail-Adresse ergänzen]</p>
<h2>2. Aufruf der Website und Hosting</h2>
<p>Beim Besuch der Website werden technisch notwendige Verbindungsdaten verarbeitet, insbesondere IP-Adresse, Zeitpunkt des Zugriffs, angefragte URL und technische Browserinformationen, soweit sie vom Hostinganbieter erfasst werden. Dies dient der Auslieferung, Sicherheit und Stabilität der Website. Die Website wird über Vercel bereitgestellt. Dabei können personenbezogene Daten durch den Hostinganbieter verarbeitet werden. Angaben zu Speicherdauer, etwaigen Drittlandübermittlungen und der vertraglichen Einbindung von Vercel müssen vom Betreiber anhand der tatsächlichen Konfiguration ergänzt und geprüft werden.</p>
<p>Als Rechtsgrundlage kommt, soweit anwendbar, Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren Betrieb) in Betracht.</p>
<h2>3. Minecraft-Serverstatus und Spielerzahlen</h2>
<p>Zur Anzeige der Minecraft-Serververfügbarkeit und aggregierter Spielerzahlen fragt die Website den Dienst mcsrvstat.us serverseitig ab. Dabei wird die Minecraft-Serveradresse übermittelt. Die angezeigten Zahlen sind zusammengefasste Statusdaten. Für diese Abfragen wird nach der derzeitigen Implementierung nicht gezielt die IP-Adresse des Websitebesuchers an mcsrvstat.us gesendet.</p>
<h2>4. Discord-Status und Discord-Link</h2>
<p>Zur Anzeige der Zahl aktuell online angezeigter Discord-Mitglieder fragt die Website serverseitig die Discord-Widget-Schnittstelle unter Angabe der Discord-Server-ID ab. Beim bloßen Aufruf der Website erfolgt dafür nach der derzeitigen Implementierung keine direkte Browseranfrage an Discord. Wenn du auf einen Discord-Link klickst, verlässt du unsere Website. Für die Datenverarbeitung auf Discord ist Discord nach seinen eigenen Datenschutzbestimmungen verantwortlich.</p>
<h2>5. Externe Links und Shop</h2>
<p>Diese Website enthält Links zu externen Angeboten, insbesondere Discord und dem Shop. Erst wenn du solche Links öffnest, können die jeweiligen Anbieter personenbezogene Daten wie deine IP-Adresse verarbeiten. Es gelten deren Datenschutzinformationen. Der konkrete Shopanbieter und seine Datenverarbeitung müssen vom Betreiber noch geprüft und gegebenenfalls hier ergänzt werden.</p>
<h2>6. Bilder und externe Inhalte</h2>
<p>Die Website kann Bilder und Hintergrundbilder aus externen Quellen einbinden, darunter Dateien über GitHub bzw. dessen Auslieferungsinfrastruktur und vom Betreiber im Admin-Bereich hinterlegte Bildadressen. Beim Laden extern eingebundener Bilder können Verbindungsdaten an den jeweiligen Anbieter übertragen werden. Die tatsächlich verwendeten Bildquellen sollten regelmäßig geprüft werden.</p>
<h2>7. Administrationsbereich</h2>
<p>Der Administrationsbereich ist zugangsbeschränkt. Für Anmeldung und Sitzungsverwaltung können technisch erforderliche Cookies verwendet werden. Weitere Angaben zu Cookie-Name, Speicherdauer und zur konkreten Authentifizierung müssen anhand der eingesetzten Konfiguration ergänzt werden. Für die Speicherung bearbeiteter Website-Inhalte wird GitHub verwendet.</p>
<h2>8. Cookies und Tracking</h2>
<p>Die öffentlich zugänglichen Funktionen der Website verwenden nach der derzeitigen Codebasis keine eigene Werbe- oder Analyse-Trackinglösung. Technisch notwendige Cookies können insbesondere im Administrationsbereich zum Einsatz kommen. Falls zukünftig Analyse-, Marketing- oder andere einwilligungspflichtige Dienste eingebunden werden, müssen diese Erklärung und gegebenenfalls die Einwilligungsverwaltung angepasst werden.</p>
<h2>9. Speicherdauer</h2>
<p>Personenbezogene Daten werden grundsätzlich nur so lange verarbeitet, wie dies für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Konkrete Aufbewahrungsfristen des Hostings und gegebenenfalls weiterer Dienstleister sind vom Betreiber zu prüfen und zu ergänzen.</p>
<h2>10. Deine Rechte</h2>
<p>Sofern die DSGVO anwendbar ist, hast du nach den gesetzlichen Voraussetzungen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Soweit eine Verarbeitung auf Einwilligung beruht, kannst du diese für die Zukunft widerrufen. Außerdem kannst du dich bei einer zuständigen Datenschutzaufsichtsbehörde beschweren. Zur Ausübung deiner Rechte nutze bitte die oben noch zu ergänzenden Kontaktdaten.</p>
<h2>11. Änderungen</h2>
<p>Diese Datenschutzerklärung wird aktualisiert, wenn sich Dienste, Datenverarbeitungen oder rechtliche Anforderungen ändern.</p>
<p className="mt-8 text-sm text-slate-400">Stand: November 2026 · Entwurf, noch nicht rechtlich finalisiert.</p>
<div className="mt-8"><Link href="/" className="focus-ring inline-flex rounded-xl border border-purple-300/40 px-5 py-3 font-semibold text-purple-100 hover:bg-purple-500/15">← Zur Startseite</Link></div>
</article>
</main>;
}
