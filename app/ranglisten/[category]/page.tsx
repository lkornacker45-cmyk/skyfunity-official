import type { Metadata } from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
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

export default async function RanglistenCategoryPage({params}:{params:{category:string}}) {
  const selected=categories.find(item=>item.id===params.category);
  if(!selected)notFound();
  const { rows, error } = await getLeaderboard();
  return <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
    <div className="mb-10 text-center">
      <p className="text-xs font-extrabold uppercase tracking-[.25em] text-purple-300">✦ SkyFunity Netzwerk ✦</p>
      <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">{selected.icon} <span className="text-purple-400">{selected.title}</span>-Rangliste</h1>
      <p className="mx-auto mt-4 max-w-2xl text-slate-300">Die Top 10 aus dem SkyFunity-Netzwerk für {selected.title}.</p>
      <Link href="/ranglisten" className="mt-5 inline-block text-sm font-bold text-cyan-200 hover:text-white">← Zur Ranglisten-Übersicht</Link>
    </div>
    <div className="mx-auto w-full max-w-3xl">
      {categories.filter(category=>category.id===selected.id).map(category => {
        const entries = (rows[category.id] ?? []).slice(0,10);
        if (category.id === "coins") {
          const podium = [entries[1], entries[0], entries[2]];
          const positions = [2, 1, 3];
          const frame = [
            "border-slate-300/50 from-slate-300/20 via-purple-950/95 to-slate-950/95",
            "border-amber-300/70 from-amber-400/25 via-purple-950/95 to-slate-950/95",
            "border-orange-300/50 from-orange-400/15 via-purple-950/95 to-slate-950/95"
          ];
          return <section id="rangliste-coins" key="coins" className="glass relative mx-auto w-full max-w-4xl overflow-hidden rounded-[28px] border border-purple-300/30 bg-[#170c2b]/90 px-3 py-7 shadow-2xl shadow-purple-950/50 sm:px-8 sm:py-10">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-purple-600/25 via-fuchsia-500/5 to-transparent"/>
            <div className="relative mb-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-[.28em] text-amber-300 sm:text-xs">✦ SkyFunity · Hall of Champions ✦</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">🪙 Coins <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent">Top 10</span></h2>
              <p className="mt-3 text-sm text-purple-200">Die reichsten Spieler auf SkyFunity</p>
            </div>
            {entries.length > 0 ? <>
              <div className="relative grid grid-cols-3 items-end gap-2 pb-10 sm:gap-5" aria-label="Die drei besten Coins-Spieler">
                {podium.map((entry,index) => entry ? <article key={entry.minecraft_uuid} className={`group relative flex min-w-0 flex-col items-center overflow-hidden rounded-2xl border bg-gradient-to-b px-2 pb-4 pt-5 text-center shadow-xl transition-transform duration-300 hover:-translate-y-2 sm:px-4 sm:pb-6 ${frame[index]} ${index===1?"min-h-[265px] shadow-amber-400/15 sm:min-h-[345px]":"min-h-[240px] sm:min-h-[300px]"}`}>
                  <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent"/>
                  <span className="mb-2 text-2xl sm:text-4xl" aria-label={`Platz ${positions[index]}`}>{index===1?"👑":index===0?"🥈":"🥉"}</span>
                  <span className="mb-3 rounded-full border border-white/20 bg-black/30 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white/90 sm:text-xs">Platz {positions[index]}</span>
                  <img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/96`} width="80" height="80" loading="lazy" alt={`Minecraft-Kopf von ${entry.player_name}`} className={`aspect-square w-12 rounded-xl border-2 bg-purple-950 object-cover shadow-lg sm:w-20 ${index===1?"border-amber-300 shadow-amber-400/30":"border-purple-300/70"}`} style={{imageRendering:"pixelated"}}/>
                  <strong className="mt-3 w-full truncate text-xs font-black text-white sm:text-lg" title={entry.player_name}>{entry.player_name}</strong>
                  <div className="mt-auto w-full pt-4">
                    <p className="break-words text-sm font-black tabular-nums text-amber-200 sm:text-xl">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-purple-200 sm:text-xs">Coins</p>
                  </div>
                </article> : <div key={index} aria-hidden="true" className="min-w-0"/>)}
              </div>
              <div className="relative mx-auto max-w-2xl">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-purple-300/20 pb-3">
                  <h3 className="text-sm font-black text-white sm:text-lg">⚔️ Weitere Champions</h3>
                  <span className="text-[10px] font-bold tracking-widest text-purple-300 sm:text-xs">PLATZ 4–10</span>
                </div>
                <ol start={4} className="space-y-2.5">{entries.slice(3).map((entry,index)=><li key={entry.minecraft_uuid} className="flex min-w-0 items-center gap-2 rounded-xl border border-purple-300/20 bg-purple-500/10 px-3 py-3 transition-colors duration-200 hover:border-amber-300/50 hover:bg-purple-500/20 sm:gap-4 sm:px-4">
                  <span className="w-6 shrink-0 text-center text-sm font-black tabular-nums text-purple-200 sm:w-9">{String(index+4).padStart(2,"0")}</span>
                  <img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/48`} width="42" height="42" loading="lazy" alt="" className="h-9 w-9 shrink-0 rounded-lg border border-purple-300/30 bg-purple-950 object-cover sm:h-11 sm:w-11" style={{imageRendering:"pixelated"}}/>
                  <strong className="min-w-0 flex-1 truncate text-xs font-bold text-white sm:text-base">{entry.player_name}</strong>
                  <div className="shrink-0 text-right"><span className="block text-xs font-black tabular-nums text-amber-200 sm:text-base">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})}</span><span className="text-[10px] text-purple-300">Coins</span></div>
                </li>)}</ol>
              </div>
            </>:<div className="rounded-xl border border-dashed border-purple-300/30 bg-purple-500/10 px-4 py-10 text-center"><p className="font-bold text-white">{error?"Datenquelle noch nicht erreichbar":"Noch keine Werte vorhanden"}</p><p className="mt-2 text-sm text-purple-200">Sobald öffentliche Coins-Daten vorliegen, erscheint hier die Top 10.</p></div>}
          </section>;
        }
        const podium = [entries[1],entries[0],entries[2]];
        const podiumRanks = [2,1,3] as const;
        return <section id={`rangliste-${category.id}`} key={category.id} className="sky-ultimate-board glass scroll-mt-32 rounded-3xl border border-purple-300/20 p-4 sm:p-8">
          <div className="sky-ultimate-heading">
            <span className="sky-ultimate-eyebrow">✦ SKYFUNITY HALL OF CHAMPIONS ✦</span>
            <h2 className="text-2xl font-black text-white sm:text-3xl">{category.icon} {category.title} <span className="text-purple-300">Top 10</span></h2>
            <p className="mt-2 text-sm text-purple-200">Die besten Spieler des Netzwerks</p>
          </div>
          {entries.length > 0 ? <>
            <div className="sky-ultimate-podium" aria-label="Die drei besten Spieler">
              {podium.map((entry,index)=>entry?<article key={entry.minecraft_uuid} className={`sky-ultimate-champion sky-ultimate-place-${podiumRanks[index]}`}>
                <div className="sky-ultimate-halo" aria-hidden="true"/>
                <div className="sky-ultimate-medal" aria-label={`Platz ${podiumRanks[index]}`}>{podiumRanks[index]===1?"👑":podiumRanks[index]===2?"🥈":"🥉"}</div>
                <span className="sky-ultimate-rank">PLATZ {podiumRanks[index]}</span>
                <img className="sky-ultimate-head" src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/96`} alt={`Minecraft-Spielerkopf von ${entry.player_name}`} width="84" height="84" loading="lazy"/>
                <strong className="sky-ultimate-name" title={entry.player_name}>{entry.player_name}</strong>
                <div className="sky-ultimate-value">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})}<small>{category.unit}</small></div>
                <div className="sky-ultimate-card-foot" aria-hidden="true"><span>✦</span><span>SKYFUNITY</span><span>✦</span></div>
              </article>:<div key={index} className="sky-ultimate-empty" aria-hidden="true"/>)}
            </div>
            <div className="sky-ultimate-list">
              <div className="sky-ultimate-list-heading"><h3>⚔️ Weitere Champions</h3><span>PLATZ 4–10</span></div>
              <ol start={4} className="space-y-3">{entries.slice(3).map((entry,index)=><li key={entry.minecraft_uuid} className="sky-ultimate-row">
                <span className="sky-ultimate-number">{String(index+4).padStart(2,"0")}</span>
                <img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/48`} alt="" loading="lazy" width="42" height="42" className="sky-ultimate-row-head"/>
                <strong className="min-w-0 flex-1 truncate text-slate-100">{entry.player_name}</strong>
                <span className="sky-ultimate-row-score">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})} <small>{category.unit}</small></span>
              </li>)}</ol>
            </div>
          </>:<div className="rounded-xl border border-dashed border-purple-300/20 bg-white/5 px-4 py-10 text-center">
            <p className="font-semibold text-slate-200">{error?"Datenquelle noch nicht erreichbar":"Noch keine Werte vorhanden"}</p>
            <p className="mt-2 text-sm text-slate-400">Die Rangliste erscheint, sobald die öffentliche Supabase-Ansicht eingerichtet ist und Daten liefert.</p>
          </div>}
        </section>;
      })}
    </div>
    <p className="mt-8 text-center text-sm text-slate-400">Öffentliche Ranglisten zeigen ausschließlich Spielernamen und aggregierte Werte. Veraltete Test-Server-IDs werden nicht mitgezählt.</p>
  </div>;
}
