import type { Metadata } from "next";
import Link from "next/link";
import AnimatedCoinValue from "./AnimatedCoinValue";
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
  if (selected.id === "coins") {
  const entries = (rows[selected.id] ?? []).slice(0,10);
  const top = [entries[1],entries[0],entries[2]];
  const ranks = [2,1,3] as const;
  return <main className="sky-orbital-page sky-gold-factory-page mx-auto w-full max-w-7xl px-3 py-10 sm:px-6 sm:py-14">
    <div className="sky-gold-factory-backdrop" aria-hidden="true"><div className="sky-gold-factory-backdrop-grid"/><div className="sky-gold-factory-backdrop-towers"/><div className="sky-gold-factory-backdrop-glow"/></div>
    <section id={`rangliste-${selected.id}`} className={`sky-orbital sky-orbital-${selected.id}`}>
      <div className="sky-orbital-scene" aria-hidden="true"/>
      <div className="sky-gold-factory-rays" aria-hidden="true"/>
      <div className="sky-gold-factory-dust" aria-hidden="true">{Array.from({length: 18}, (_, i) => <i key={i} style={{"--particle-index": i} as React.CSSProperties}/>)}</div>
      <div className="sky-orbital-stardust" aria-hidden="true"/>
      <div className="sky-orbital-beam" aria-hidden="true"/>
      <header className="sky-orbital-header">
        <Link href="/ranglisten" className="sky-orbital-back">← Alle Ranglisten</Link>
        <p className="sky-orbital-eyebrow">{"✦ SKYFUNITY · GOLD INDUSTRIES · COIN FACTORY ✦"}</p>
        <h1><span>{selected.icon}</span> {selected.title.toUpperCase()} <em>TOP 10</em></h1>
        <p className="sky-orbital-description">{"Die reichsten Spieler des SkyFunity-Netzwerks"}</p>
        <div className="sky-orbital-signal"><i aria-hidden="true"/> {"GOLD FACTORY // LIVE-RANGLISTE"} <span>·</span> {selected.unit.toUpperCase()}</div>
      </header>
      {entries.length ? <>
        <div className="sky-orbital-stage" aria-label={`Die drei besten Spieler für ${selected.title}`}>
          <div className="sky-orbital-core" aria-hidden="true"><span/><span/><span/></div>
          <div className="sky-gold-factory-reactor" aria-hidden="true"><span/><span/><span/></div>
          <div className="sky-orbital-podium">
            {top.map((entry,index)=>entry?<article key={entry.minecraft_uuid} className={`sky-orbital-capsule sky-orbital-place-${ranks[index]} sky-gold-factory-champion`}>
              <div className="sky-orbital-capsule-top"><span>{ranks[index]===1?"CAPTAIN'S BRIDGE":ranks[index]===2?"DOCKING BAY A":"DOCKING BAY B"}</span><i aria-hidden="true"/></div>
              <div className="sky-orbital-medal">{ranks[index]===1?"👑":ranks[index]===2?"🥈":"🥉"}</div>
              <span className="sky-orbital-position">PLATZ {String(ranks[index]).padStart(2,"0")}</span>
              <div className="sky-orbital-avatar-shell"><img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/128`} alt={`Minecraft-Spielerkopf von ${entry.player_name}`} width="100" height="100" loading={ranks[index]===1?"eager":"lazy"}/></div>
              <strong title={entry.player_name} className="sky-orbital-name">{entry.player_name}</strong>
              <div className="sky-orbital-score"><AnimatedCoinValue value={entry.score}/><small>{selected.unit}</small></div>
              <div className="sky-orbital-capsule-bottom" aria-hidden="true"><span/><span/><span/><span/><span/></div>
            </article>:<div key={index} className="sky-orbital-blank" aria-hidden="true"/>)}
          </div>
        </div>
        <div className="sky-orbital-board">
          <div className="sky-orbital-board-title"><div><p>✦ {"GOLD FACTORY LEADERBOARD"}</p><h2>Weitere Champions</h2></div><span>RANG 04 — 10</span></div>
          <ol start={4} className="sky-orbital-list">{entries.slice(3).map((entry,index)=><li key={entry.minecraft_uuid} className="sky-orbital-row sky-gold-factory-row">
            <span className="sky-orbital-row-rank">{String(index+4).padStart(2,"0")}</span>
            <img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/48`} alt="" width="42" height="42" loading="lazy" className="sky-orbital-row-head"/>
            <strong title={entry.player_name} className="sky-orbital-row-name">{entry.player_name}</strong>
            <span className="sky-orbital-row-score"><AnimatedCoinValue value={entry.score}/> <small>{selected.unit}</small></span>
          </li>)}</ol>
        </div>
      </>:<div className="sky-orbital-empty"><strong>{error?"Datenquelle noch nicht erreichbar":"Noch keine Werte vorhanden"}</strong><p>Die {selected.title}-Rangliste erscheint, sobald öffentliche Daten verfügbar sind.</p></div>}
      <footer className="sky-orbital-footer">✦ SKYFUNITY · {"GOLD INDUSTRIES"} · {selected.title.toUpperCase()} ✦</footer>
    </section>
    <p className="mt-8 text-center text-sm text-slate-400">Öffentliche Ranglisten zeigen ausschließlich Spielernamen und aggregierte Werte. Veraltete Test-Server-IDs werden nicht mitgezählt.</p>
  </main>;
  }
  return <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
    <div className={selected.id === "gems" || selected.id === "jobs" ? "hidden" : "mb-10 text-center"}>
      <p className="text-xs font-extrabold uppercase tracking-[.25em] text-purple-300">✦ SkyFunity Netzwerk ✦</p>
      <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">{selected.icon} <span className="text-purple-400">{selected.title}</span>-Rangliste</h1>
      <p className="mx-auto mt-4 max-w-2xl text-slate-300">Die Top 10 aus dem SkyFunity-Netzwerk für {selected.title}.</p>
      <Link href="/ranglisten" className="mt-5 inline-block text-sm font-bold text-cyan-200 hover:text-white">← Zur Ranglisten-Übersicht</Link>
    </div>
    <div className={selected.id === "gems" || selected.id === "jobs" ? "mx-auto w-full max-w-6xl" : "mx-auto w-full max-w-3xl"}>
      {categories.filter(category=>category.id===selected.id).map(category => {
        const entries = (rows[category.id] ?? []).slice(0,10);
        if (category.id === "gems") {
          const top = entries.slice(0, 3);
          return <section id="rangliste-gems" className="sky-infinity sky-diamond-44 relative isolate mx-auto w-full overflow-hidden rounded-[28px]">
            <div className="sky-diamond-44-vault" aria-hidden="true" /><div className="sky-diamond-44-prisms" aria-hidden="true" /><div className="sky-infinity-stars" aria-hidden="true" />
            <div className="sky-infinity-beams" aria-hidden="true" />
            <header className="sky-infinity-header relative z-10">
              <Link href="/ranglisten" className="sky-infinity-back">← Alle Ranglisten</Link>
              <p className="sky-infinity-eyebrow">✦ SKYFUNITY · DIAMOND INFINITY · EDITION 44 ✦</p>
              <h2>DIAMOND <span>INFINITY</span></h2>
              <p className="sky-infinity-subtitle">💎 Gems Top 10 · Die wertvollsten Spieler des Netzwerks</p>
            </header>
            {entries.length > 0 ? <>
              <div className="sky-infinity-stage" aria-label="Die drei besten Gems-Spieler">
                <div className="sky-infinity-energy" aria-hidden="true" />
                <div className="sky-infinity-orbit sky-infinity-orbit-outer" aria-hidden="true" />
                <div className="sky-infinity-orbit sky-infinity-orbit-inner" aria-hidden="true" />
                <div className="sky-infinity-diamond" aria-hidden="true">
                  <svg viewBox="0 0 220 250" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M110 8 199 70 181 170 110 238 39 170 21 70Z" fill="#9D69FF" fillOpacity=".13" stroke="#D7C2FF" strokeWidth="3"/><path d="M21 70H199L110 238 21 70ZM110 8 75 70 110 238 145 70 110 8ZM39 170H181M21 70 110 8 199 70" stroke="#B8F2FF" strokeOpacity=".75" strokeWidth="2"/><path d="M75 70H145L110 238Z" fill="#A5F3FC" fillOpacity=".16"/></svg>
                </div>
                <div className="sky-infinity-sparks" aria-hidden="true" /><div className="sky-diamond-44-radiance" aria-hidden="true" /><div className="sky-diamond-44-shard sky-diamond-44-shard-a" aria-hidden="true" /><div className="sky-diamond-44-shard sky-diamond-44-shard-b" aria-hidden="true" /><div className="sky-diamond-44-shard sky-diamond-44-shard-c" aria-hidden="true" />
                <div className="sky-infinity-winners">
                  {[1,0,2].map((entryIndex) => {
                    const entry = top[entryIndex];
                    const rank = entryIndex + 1;
                    return entry ? <article key={entry.minecraft_uuid} className={`sky-infinity-champion sky-infinity-rank-${rank}`}>
                      <div className="sky-infinity-champion-glow" aria-hidden="true" />
                      <div className="sky-infinity-medal" aria-label={`Platz ${rank}`}>{rank === 1 ? "👑" : rank === 2 ? "🥈" : "🥉"}</div>
                      <span className="sky-infinity-rank-label">PLATZ {rank}</span>
                      <img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/128`} alt={`Minecraft-Spielerkopf von ${entry.player_name}`} width="100" height="100" loading={rank === 1 ? "eager" : "lazy"} className="sky-infinity-head" />
                      <strong className="sky-infinity-player" title={entry.player_name}>{entry.player_name}</strong>
                      <p className="sky-infinity-score">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})}<span>💎 GEMS</span></p>
                      <div className="sky-infinity-platform" aria-hidden="true" />
                    </article> : <div key={rank} className="sky-infinity-champion-empty" aria-hidden="true" />;
                  })}
                </div>
              </div>
              <div className="sky-infinity-ranking">
                <div className="sky-infinity-ranking-heading"><div><span>✦ DIAMOND INFINITY · TOP 10</span><h3>Weitere Champions</h3></div><span>RANG 04 — 10</span></div>
                <ol start={4} className="sky-infinity-rows">{entries.slice(3).map((entry,index)=><li key={entry.minecraft_uuid} className="sky-infinity-row">
                  <span className="sky-infinity-position">{String(index+4).padStart(2,"0")}</span>
                  <img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/48`} alt="" width="42" height="42" loading="lazy" className="sky-infinity-row-head"/>
                  <strong className="sky-infinity-row-name" title={entry.player_name}>{entry.player_name}</strong>
                  <span className="sky-infinity-row-value">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})} <small>💎</small></span>
                </li>)}</ol>
              </div>
            </> : <div className="sky-infinity-empty"><strong>{error ? "Datenquelle noch nicht erreichbar" : "Noch keine Werte vorhanden"}</strong><p>Die Gems-Rangliste erscheint, sobald öffentliche Daten verfügbar sind.</p></div>}
            <footer className="sky-infinity-footer">✦ SKYFUNITY · DIAMOND INFINITY · FOREVER ✦</footer>
          </section>;
        }
        if (category.id === "jobs") {
          const top = entries.slice(0,3);
          return <section id="rangliste-jobs" className="sky-job-hq sky-mecha-industries" aria-label="SkyFunity Jobs Top 10">
            <div className="sky-mecha-scene" aria-hidden="true"/><div className="sky-mecha-haze" aria-hidden="true"/><div className="sky-mecha-lights" aria-hidden="true"/>
            <header className="sky-job-hq-header">
              <Link href="/ranglisten" className="sky-job-hq-back">← Alle Ranglisten</Link>
              <p className="sky-job-hq-kicker">SKYFUNITY ✦ MECHA INDUSTRIES ✦ ROBOT FACTORY</p>
              <h2>JOBS <span>RANGLISTE</span></h2>
              <p className="sky-job-hq-description">🛠️ Jobs Top 10 · Die fleißigsten Arbeiter des Netzwerks</p>
              <div className="sky-job-hq-system"><span className="sky-job-hq-live-dot"/> FACTORY SYSTEM ONLINE <span aria-hidden="true">/</span> ECHTE JOBS-LEVEL</div>
            </header>
            {entries.length ? <>
              <div className="sky-job-hq-stage" aria-label="Jobs Top 3 Kommandozentrale">
                <div className="sky-job-hq-hologram sky-mecha-reactor" aria-hidden="true"><div className="sky-job-hq-hologram-ring"/><div className="sky-job-hq-hologram-gear">⚙</div></div>
                {[1,0,2].map((entryIndex)=>{
                  const entry=top[entryIndex];
                  const rank=entryIndex+1;
                  return entry?<article key={entry.minecraft_uuid} className={`sky-job-hq-station sky-job-hq-station-${rank}`}>
                    <div className="sky-job-hq-station-top"><span>{rank===1?"MECHA COMMANDER":rank===2?"CYBER STATION A":"CYBER STATION B"}</span><span className="sky-job-hq-status-light"/></div>
                    <div className="sky-job-hq-scan" aria-hidden="true"/>
                    <div className="sky-job-hq-rank">{rank===1?"👑":rank===2?"🥈":"🥉"} <span>PLATZ {String(rank).padStart(2,"0")}</span></div>
                    <div className="sky-job-hq-avatar-frame"><img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/128`} alt={`Minecraft-Spielerkopf von ${entry.player_name}`} width="100" height="100" loading={rank===1?"eager":"lazy"} className="sky-job-hq-avatar"/></div>
                    <strong className="sky-job-hq-name" title={entry.player_name}>{entry.player_name}</strong>
                    <p className="sky-job-hq-level">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})}<small>JOBS-LEVEL</small></p>
                    <div className="sky-job-hq-console" aria-hidden="true"><i/><i/><i/><i/><i/></div>
                  </article>:<div key={rank} className="sky-job-hq-empty-station" aria-hidden="true"/>;
                })}
              </div>
              <div className="sky-job-hq-dashboard">
                <div className="sky-job-hq-dashboard-title"><div><p>MECHA INDUSTRIES / PERSONNEL TOP 10</p><h3>Top 10 · Jobs</h3></div><span>RANG 04 — 10</span></div>
                <ol start={4} className="sky-job-hq-list">{entries.slice(3).map((entry,index)=><li key={entry.minecraft_uuid} className="sky-job-hq-row">
                  <span className="sky-job-hq-row-rank">{String(index+4).padStart(2,"0")}</span>
                  <img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/48`} alt="" width="42" height="42" loading="lazy" className="sky-job-hq-row-avatar"/>
                  <strong title={entry.player_name} className="sky-job-hq-row-name">{entry.player_name}</strong>
                  <span className="sky-job-hq-row-level">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})} <small>LEVEL</small></span>
                </li>)}</ol>
              </div>
            </>:<div className="sky-job-hq-no-data"><strong>{error?"Datenquelle noch nicht erreichbar":"Noch keine Werte vorhanden"}</strong><p>Die Jobs-Rangliste erscheint, sobald öffentliche Daten verfügbar sind.</p></div>}
            <footer className="sky-job-hq-footer">SKYFUNITY · MECHA INDUSTRIES · ROBOT FACTORY</footer>
          </section>;
        }
        if (category.id === "coins") {
          const podium = [entries[1],entries[0],entries[2]];
          const ranks = [2,1,3];
          return <section id="rangliste-coins" className="sky-mine-board relative isolate mx-auto w-full overflow-hidden rounded-[28px] border border-fuchsia-400/40 p-4 shadow-2xl shadow-purple-950/70 sm:p-8 lg:p-10">
            <div className="sky-mine-scenery" aria-hidden="true"/>
            <div className="relative z-10">
              <header className="mb-8 text-center sm:mb-12">
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-amber-200 sm:text-sm">👑 SkyFunity Hall of Champions 👑</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white drop-shadow-lg sm:text-5xl">🪙 Coins <span className="bg-gradient-to-r from-fuchsia-300 via-purple-200 to-violet-400 bg-clip-text text-transparent">Top 10</span></h2>
                <p className="mt-3 text-sm font-medium text-purple-100">Die reichsten Spieler des Netzwerks</p>
              </header>
              {entries.length > 0 ? <>
                <div className="mx-auto grid max-w-4xl grid-cols-3 items-end gap-2 sm:gap-5" aria-label="Coins Siegerpodest">
                  {podium.map((entry,index)=>entry?<article key={entry.minecraft_uuid} className={`sky-mine-card sky-mine-place-${ranks[index]} group relative flex min-w-0 flex-col items-center rounded-2xl border px-2 pb-4 pt-5 text-center backdrop-blur-xl transition-transform duration-300 hover:-translate-y-2 sm:rounded-3xl sm:px-5 sm:pb-6 sm:pt-7`}>
                    <span className="sky-mine-crown" aria-label={`Platz ${ranks[index]}`}>{index===1?"👑":index===0?"♛":"♛"}</span>
                    <img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/128`} alt={`Minecraft-Spielerkopf von ${entry.player_name}`} width="96" height="96" loading="lazy" className="sky-mine-avatar mt-2 aspect-square w-14 rounded-lg border-2 object-cover sm:mt-4 sm:w-24 sm:rounded-xl" style={{imageRendering:"pixelated"}}/>
                    <span className="sky-mine-rank mt-3 rounded-lg px-3 py-1 text-sm font-black sm:text-lg">{ranks[index]}</span>
                    <strong className="mt-3 block w-full truncate text-xs font-black text-white sm:text-xl" title={entry.player_name}>{entry.player_name}</strong>
                    <p className="mt-auto pt-3 text-sm font-black tabular-nums text-amber-200 sm:pt-5 sm:text-xl">{entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})}</p>
                    <p className="text-[10px] font-semibold text-purple-100 sm:text-sm">🪙 Coins</p>
                    <p className="mt-3 hidden text-[10px] font-bold uppercase tracking-[.14em] text-purple-200 sm:block">✦ SkyFunity ✦</p>
                  </article>:<div key={index} aria-hidden="true"/>)}
                </div>
                <div className="sky-mine-table mx-auto mt-9 max-w-4xl overflow-hidden rounded-2xl border border-fuchsia-400/50 p-2 shadow-xl shadow-purple-950/60 backdrop-blur-xl sm:mt-12 sm:p-4">
                  <div className="grid grid-cols-[32px_minmax(0,1fr)_auto] gap-2 px-3 py-3 text-xs font-black text-purple-200 sm:grid-cols-[55px_minmax(0,1fr)_auto] sm:text-sm"><span>#</span><span>Spieler</span><span>Coins</span></div>
                  <ol start={4} className="space-y-1.5">{entries.slice(3).map((entry,index)=><li key={entry.minecraft_uuid} className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2 rounded-xl bg-purple-200/10 px-3 py-2.5 transition-colors hover:bg-purple-300/20 sm:grid-cols-[55px_minmax(0,1fr)_auto]">
                    <span className="text-sm font-black tabular-nums text-white">{index+4}</span>
                    <span className="flex min-w-0 items-center gap-2 sm:gap-3"><img src={`https://mc-heads.net/avatar/${encodeURIComponent(entry.minecraft_uuid)}/48`} alt="" width="36" height="36" loading="lazy" className="h-8 w-8 shrink-0 rounded-md object-cover sm:h-10 sm:w-10" style={{imageRendering:"pixelated"}}/><strong className="truncate text-xs text-white sm:text-base">{entry.player_name}</strong></span>
                    <span className="whitespace-nowrap text-right text-xs font-black tabular-nums text-amber-200 sm:text-base">🪙 {entry.score.toLocaleString("de-DE",{maximumFractionDigits:1})}</span>
                  </li>)}</ol>
                </div>
              </>:<div className="mx-auto max-w-xl rounded-2xl border border-purple-300/30 bg-purple-950/80 p-10 text-center"><p className="font-bold text-white">{error?"Datenquelle noch nicht erreichbar":"Noch keine Werte vorhanden"}</p><p className="mt-2 text-sm text-purple-200">Die Coins-Rangliste erscheint, sobald öffentliche Daten verfügbar sind.</p></div>}
            </div>
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
