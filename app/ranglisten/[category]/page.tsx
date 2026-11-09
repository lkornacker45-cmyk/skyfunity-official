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
        const podium = [entries[1],entries[0],entries[2]];
        const podiumRanks = [2,1,3];
        return <section id={`rangliste-${category.id}`} key={category.id} className="sky-islands-board glass scroll-mt-32 rounded-3xl border border-purple-300/20 p-4 sm:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-center">
            <h2 className="text-2xl font-extrabold text-white">{category.icon} {category.title}</h2>
            <span className="rounded-full border border-purple-400/40 bg-purple-500/15 px-3 py-1 text-xs font-bold text-purple-200">TOP 10</span>
          </div>
          {entries.length > 0 ? <>
            <div className="sky-islands-podium" aria-label="Die drei besten Spieler">
              {podium.map((entry,index)=>entry?<article key={entry.minecraft_uuid} className={`sky-island-champion sky-island-place-${podiumRanks[index]}`}>
                <div className="sky-island-aura" aria-hidden="true"/>
                <span className="sky-island-medal" aria-label={`Platz ${podiumRanks[index]}`}>{podiumRanks[index]===1?"👑":podiumRanks[index]===2?"🥈":"🥉"}</span>
                <img className="sky-island-head" src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/96`} alt={`Minecraft-Kopf von ${entry.player_name}`} loading="lazy" width="80" height="80"/>
                <strong className="sky-island-name" title={entry.player_name}>{entry.player_name}</strong>
                <span className="sky-island-score">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})} <small>{category.unit}</small></span>
                <div className="sky-island-grass" aria-hidden="true"><span className="sky-island-rank">{podiumRanks[index]}</span></div>
                <div className="sky-island-dirt" aria-hidden="true"/>
              </article>:<div key={index} className="sky-island-empty" aria-hidden="true"/>)}
            </div>
            <div className="sky-islands-rest">
              <h3 className="mb-4 text-center text-sm font-black uppercase tracking-[.2em] text-purple-200">Weitere Top-Spieler</h3>
              <ol start={4} className="space-y-3">{entries.slice(3).map((entry,index)=><li key={entry.minecraft_uuid} className="sky-islands-row">
                <span className="sky-islands-number">{index+4}.</span>
                <img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/48`} alt="" loading="lazy" width="40" height="40" className="sky-islands-row-head"/>
                <strong className="min-w-0 flex-1 truncate text-slate-100">{entry.player_name}</strong>
                <span className="text-right text-sm font-bold tabular-nums text-purple-100">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})} <span className="text-xs font-normal text-slate-400">{category.unit}</span></span>
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
