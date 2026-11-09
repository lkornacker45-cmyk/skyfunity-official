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
  const entries = (rows[selected.id] ?? []).slice(0,10);
  const top = [entries[1],entries[0],entries[2]];
  const ranks = [2,1,3] as const;
  return <main className="sky-orbital-page mx-auto w-full max-w-7xl px-3 py-10 sm:px-6 sm:py-14">
    <section id={`rangliste-${selected.id}`} className={`sky-orbital sky-orbital-${selected.id}`}>
      <div className="sky-orbital-scene" aria-hidden="true"/>
      <div className="sky-orbital-stardust" aria-hidden="true"/>
      <div className="sky-orbital-beam" aria-hidden="true"/>
      <header className="sky-orbital-header">
        <Link href="/ranglisten" className="sky-orbital-back">← Alle Ranglisten</Link>
        <p className="sky-orbital-eyebrow">{selected.id === "coins" ? "✦ SKYFUNITY · GOLD INDUSTRIES · COIN FACTORY ✦" : "✦ SKYFUNITY · ORBITAL WORKS · SPACE SHIPYARD ✦"}</p>
        <h1><span>{selected.icon}</span> {selected.title.toUpperCase()} <em>TOP 10</em></h1>
        <p className="sky-orbital-description">{selected.id === "coins" ? "Die reichsten Spieler des SkyFunity-Netzwerks" : `Die besten ${selected.title}-Spieler des SkyFunity-Netzwerks`}</p>
        <div className="sky-orbital-signal"><i aria-hidden="true"/> {selected.id === "coins" ? "GOLD FACTORY // LIVE-RANGLISTE" : "ORBITAL COMMAND // LIVE-RANGLISTE"} <span>·</span> {selected.unit.toUpperCase()}</div>
      </header>
      {entries.length ? <>
        <div className="sky-orbital-stage" aria-label={`Die drei besten Spieler für ${selected.title}`}>
          <div className="sky-orbital-core" aria-hidden="true"><span/><span/><span/></div>
          <div className="sky-orbital-podium">
            {top.map((entry,index)=>entry?<article key={entry.minecraft_uuid} className={`sky-orbital-capsule sky-orbital-place-${ranks[index]}`}>
              <div className="sky-orbital-capsule-top"><span>{ranks[index]===1?"CAPTAIN'S BRIDGE":ranks[index]===2?"DOCKING BAY A":"DOCKING BAY B"}</span><i aria-hidden="true"/></div>
              <div className="sky-orbital-medal">{ranks[index]===1?"👑":ranks[index]===2?"🥈":"🥉"}</div>
              <span className="sky-orbital-position">PLATZ {String(ranks[index]).padStart(2,"0")}</span>
              <div className="sky-orbital-avatar-shell"><img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/128`} alt={`Minecraft-Spielerkopf von ${entry.player_name}`} width="100" height="100" loading={ranks[index]===1?"eager":"lazy"}/></div>
              <strong title={entry.player_name} className="sky-orbital-name">{entry.player_name}</strong>
              <div className="sky-orbital-score">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})}<small>{selected.unit}</small></div>
              <div className="sky-orbital-capsule-bottom" aria-hidden="true"><span/><span/><span/><span/><span/></div>
            </article>:<div key={index} className="sky-orbital-blank" aria-hidden="true"/>)}
          </div>
        </div>
        <div className="sky-orbital-board">
          <div className="sky-orbital-board-title"><div><p>✦ {selected.id === "coins" ? "GOLD FACTORY LEADERBOARD" : "ORBITAL PERSONNEL DATABASE"}</p><h2>Weitere Champions</h2></div><span>RANG 04 — 10</span></div>
          <ol start={4} className="sky-orbital-list">{entries.slice(3).map((entry,index)=><li key={entry.minecraft_uuid} className="sky-orbital-row">
            <span className="sky-orbital-row-rank">{String(index+4).padStart(2,"0")}</span>
            <img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/48`} alt="" width="42" height="42" loading="lazy" className="sky-orbital-row-head"/>
            <strong title={entry.player_name} className="sky-orbital-row-name">{entry.player_name}</strong>
            <span className="sky-orbital-row-score">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})} <small>{selected.unit}</small></span>
          </li>)}</ol>
        </div>
      </>:<div className="sky-orbital-empty"><strong>{error?"Datenquelle noch nicht erreichbar":"Noch keine Werte vorhanden"}</strong><p>Die {selected.title}-Rangliste erscheint, sobald öffentliche Daten verfügbar sind.</p></div>}
      <footer className="sky-orbital-footer">✦ SKYFUNITY · {selected.id === "coins" ? "GOLD INDUSTRIES" : "ORBITAL WORKS"} · {selected.title.toUpperCase()} ✦</footer>
    </section>
    <p className="mt-8 text-center text-sm text-slate-400">Öffentliche Ranglisten zeigen ausschließlich Spielernamen und aggregierte Werte. Veraltete Test-Server-IDs werden nicht mitgezählt.</p>
  </main>;
}
