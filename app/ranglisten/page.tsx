import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = { title: "Ranglisten", description: "Die SkyFunity Top-10-Ranglisten aus dem gesamten Netzwerk." };
export const dynamic = "force-dynamic";

type Entry = { minecraft_uuid: string; player_name: string; score: number };
const excludedPlayers = new Set(["sett_camo", "chriss", "tobixv3"]);

const categories = [
  { id: "coins", title: "Coins", icon: "🪙", unit: "Coins" },
  { id: "gems", title: "Gems", icon: "💎", unit: "Gems" },
  { id: "jobs", title: "Jobs", icon: "🛠️", unit: "Level" },
  { id: "funitys", title: "Funitys", icon: "✨", unit: "Funitys" },
  { id: "spielzeit", title: "Spielzeit", icon: "⏱️", unit: "Stunden" },
  { id: "votes", title: "Votes", icon: "🗳️", unit: "Votes" }
] as const;

async function getLeaderboard(): Promise<{ rows: Record<string, Entry[]>; error: boolean }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { rows: {}, error: true };
  try {
    const db = createClient(url, key, { auth: { persistSession: false } });
    const sources = [
      { view: "skyfunity_public_leaderboards", categories: ["spielzeit", "votes"] },
      { view: "skyfunity_public_economy_jobs_top10", categories: ["coins", "gems", "funitys", "jobs"] }
    ];
    const results = await Promise.all(sources.map(async source => {
      const { data, error } = await db.from(source.view)
        .select("category,minecraft_uuid,player_name,score")
        .in("category", source.categories)
        .order("score", { ascending: false })
        .limit(100);
      return { data, error };
    }));
    const rows: Record<string, Entry[]> = {};
    let hasError = false;
    for (const result of results) {
      if (result.error) {
        hasError = true;
        console.error("SkyFunity Ranglisten: Supabase-Abfrage fehlgeschlagen", result.error.message);
        continue;
      }
      for (const item of result.data ?? []) {
        if (typeof item.category !== "string" || typeof item.minecraft_uuid !== "string") continue;
        if (excludedPlayers.has(String(item.player_name ?? "").trim().toLowerCase())) continue;
        const score = Number(item.score);
        if (!Number.isFinite(score) || score <= 0) continue;
        (rows[item.category] ??= []).push({
          minecraft_uuid: item.minecraft_uuid,
          player_name: String(item.player_name || "Spieler"),
          score
        });
      }
    }
    for (const list of Object.values(rows)) list.sort((a,b) => b.score - a.score);
    return { rows, error: hasError };
  } catch { return { rows: {}, error: true }; }
}

export default async function RanglistenPage() {
  const { rows, error } = await getLeaderboard();
  return <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
    <div className="mb-10 text-center">
      <p className="text-xs font-extrabold uppercase tracking-[.25em] text-purple-300">✦ SkyFunity Netzwerk ✦</p>
      <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">🏆 Offizielle <span className="text-purple-400">Ranglisten</span></h1>
      <p className="mx-auto mt-4 max-w-2xl text-slate-300">Die Top 10 aus Citybuild, Welten und Farmwelten – Spieler werden anhand ihrer UUID zusammengeführt.</p>
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      {categories.map(category => {
        const entries = (rows[category.id] ?? []).slice(0,10);
        return <section id={`rangliste-${category.id}`} key={category.id} className="glass scroll-mt-32 overflow-hidden rounded-2xl border border-purple-300/15 p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-white"><span aria-hidden="true">{category.icon}</span> {category.title}</h2>
            <span className="rounded-full border border-purple-400/25 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-200">TOP 10</span>
          </div>
          {entries.length > 0 ? <ol className="space-y-2">{entries.map((entry, rank) =>
            <li key={entry.minecraft_uuid} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-3">
              <span className="w-8 text-center text-lg font-black text-purple-200">{rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : rank + 1 + "."}</span>
              <span className="min-w-0 flex-1 truncate font-semibold text-slate-100">{entry.player_name}</span>
              <span className="text-right text-sm font-bold tabular-nums text-purple-200">{entry.score.toLocaleString("de-DE", { maximumFractionDigits: 1 })} <span className="text-xs font-normal text-slate-400">{category.unit}</span></span>
            </li>)}</ol> :
            <div className="rounded-xl border border-dashed border-purple-300/20 bg-white/5 px-4 py-10 text-center">
              <p className="font-semibold text-slate-200">{error ? "Datenquelle noch nicht erreichbar" : "Noch keine Werte vorhanden"}</p>
              <p className="mt-2 text-sm text-slate-400">{"Die Rangliste erscheint, sobald die öffentliche Supabase-Ansicht eingerichtet ist und Daten liefert."}</p>
            </div>}
        </section>;
      })}
    </div>
    <p className="mt-8 text-center text-sm text-slate-400">Öffentliche Ranglisten zeigen ausschließlich Spielernamen und aggregierte Werte. Veraltete Test-Server-IDs werden nicht mitgezählt.</p>
  </div>;
}
