import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = { title: "Ranglisten", description: "Die offiziellen SkyFunity Top-10-Ranglisten." };
export const dynamic = "force-dynamic";

type Entry = { name: string; value: number; uuid?: string };
type Category = { title: string; icon: string; unit: string; table: string; field: string };
const categories: Category[] = [
  { title: "Coins", icon: "🪙", unit: "Coins", table: "player_currencies", field: "coins" },
  { title: "Gems", icon: "💎", unit: "Gems", table: "player_currencies", field: "gems" },
  { title: "Jobs", icon: "🛠️", unit: "Level", table: "player_jobs", field: "total_level" },
  { title: "Funitys", icon: "✨", unit: "Funitys", table: "player_currencies", field: "funitys" },
  { title: "Spielzeit", icon: "⏱️", unit: "Minuten", table: "minecraft_network_stats", field: "playtime_minutes" },
  { title: "Votes", icon: "🗳️", unit: "Votes", table: "player_votes", field: "all_time_total" },
  { title: "Questliga", icon: "🏆", unit: "Punkte", table: "player_questliga", field: "points" },
  { title: "Erntefarm", icon: "🌾", unit: "Ernte", table: "player_farm", field: "harvest_total" }
];

async function load(category: Category): Promise<Entry[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    // Only public, RLS-approved rows are accessible with the anonymous key.
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase.from(category.table).select("*").order(category.field, { ascending: false }).limit(10);
    if (error || !data) return [];
    return data.map((row: Record<string, unknown>) => ({
      name: String(row.minecraft_name ?? row.player_name ?? row.username ?? row.name ?? "Spieler"),
      uuid: typeof row.minecraft_uuid === "string" ? row.minecraft_uuid : undefined,
      value: Number(row[category.field] ?? 0)
    })).filter(row => Number.isFinite(row.value) && row.value > 0);
  } catch { return []; }
}

export default async function RanglistenPage() {
  const lists = await Promise.all(categories.map(load));
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[.25em] text-purple-300">✦ SkyFunity Netzwerk ✦</p>
        <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">🏆 Offizielle <span className="text-purple-400">Ranglisten</span></h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">Die Top 10 aus dem gesamten SkyFunity-Netzwerk. Alle acht Bestenlisten auf einer Seite.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category, index) => (
          <section key={category.title} className="glass overflow-hidden rounded-2xl border border-purple-300/15 p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-white"><span aria-hidden="true">{category.icon}</span> {category.title}</h2>
              <span className="rounded-full border border-purple-400/25 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-200">TOP 10</span>
            </div>
            {lists[index].length ? (
              <ol className="space-y-2">
                {lists[index].map((entry, rank) => (
                  <li key={entry.uuid ?? entry.name + rank} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-3">
                    <span className="w-8 text-center text-lg font-black text-purple-200">{rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : rank + 1 + "."}</span>
                    <span className="min-w-0 flex-1 truncate font-semibold text-slate-100">{entry.name}</span>
                    <span className="text-right text-sm font-bold tabular-nums text-purple-200">{entry.value.toLocaleString("de-DE")} <span className="text-xs font-normal text-slate-400">{category.unit}</span></span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="rounded-xl border border-dashed border-purple-300/20 bg-white/5 px-4 py-10 text-center">
                <p className="font-semibold text-slate-200">Noch keine Ranglistendaten verfügbar</p>
                <p className="mt-2 text-sm text-slate-400">Sobald die Datenquelle verbunden ist und öffentliche Werte liefert, erscheinen hier die Top 10.</p>
              </div>
            )}
          </section>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-slate-400">Die Ranglisten zeigen nur Daten, die über die öffentliche Supabase-Schnittstelle freigegeben sind.</p>
    </div>
  );
}
