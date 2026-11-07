package de.skyfunity.link;

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.entity.Player;
import org.bukkit.command.PluginCommand;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Pattern;
import java.util.logging.Level;

public final class SkyFunityLink extends JavaPlugin {
    private static final Pattern CODE = Pattern.compile("[A-F0-9]{12}");
    private HttpClient http;
    @Override public void onEnable() {
        saveDefaultConfig();
        http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
        PluginCommand command = getCommand("websitelink");
        if (command == null) throw new IllegalStateException("websitelink command missing");
        command.setExecutor((sender, cmd, label, args) -> {
            if (!(sender instanceof Player player)) {sender.sendMessage("Nur im Spiel nutzbar."); return true;}
            if (args.length != 1 || !CODE.matcher(args[0].toUpperCase(java.util.Locale.ROOT)).matches()) {
                player.sendMessage("§dBenutzung: /websitelink <CODE>"); return true;
            }
            String url = getConfig().getString("sync-url", "");
            String secret = getConfig().getString("shared-secret", "");
            if (!url.startsWith("https://") || secret.isBlank() || secret.equals("CHANGE_ME")) {
                player.sendMessage("§cSkyFunityLink ist noch nicht eingerichtet."); return true;
            }
            UUID uuid = player.getUniqueId();
            String code = args[0].toUpperCase(java.util.Locale.ROOT);
            player.sendMessage("§dSkyFunity: Verbindung wird geprüft…");
            String payload = "{\"code\":\"" + code + "\",\"uuid\":\"" + uuid + "\"}";
            try {
                HttpRequest request = HttpRequest.newBuilder(URI.create(url + "/claim"))
                    .timeout(Duration.ofMillis(getConfig().getLong("timeout-ms",7000)))
                    .header("Content-Type","application/json")
                    .header("Authorization","Bearer " + secret)
                    .POST(HttpRequest.BodyPublishers.ofString(payload)).build();
                http.sendAsync(request,HttpResponse.BodyHandlers.discarding())
                    .whenComplete((response,error) -> {
                        boolean ok = error == null && response.statusCode() == 200;
                        if (error != null) getLogger().log(Level.WARNING,"Website linking failed",error);
                        // Folia: send player messages on their entity scheduler, never on an HTTP thread.
                        player.getScheduler().run(this, task -> player.sendMessage(ok
                            ? "§aDein Minecraft-Account wurde mit SkyFunity verbunden!"
                            : "§cCode ungültig, abgelaufen oder Account bereits verbunden."), null);
                    });
            } catch (Exception ex) {
                getLogger().log(Level.WARNING,"Invalid sync configuration",ex);
                player.sendMessage("§cVerbindungsdienst nicht erreichbar.");
            }
            return true;
        });
    }
}
