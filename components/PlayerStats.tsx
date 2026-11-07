"use client";
import {useEffect,useState} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";

type Stats={playtime_seconds:number;balance:number|null;server_rank:string|null;blocks_mined:number|null;mob_kills:number|null;updated_at:string};
type Job={job_key:string;job_level:number;job_xp:number|null};
type Currencies={coins:number|null;funitys:number|null;gems:number|null;updated_at:string};
const number=(v:number)=>new Intl.NumberFormat("de-DE").format(v);
export default function PlayerStats({db,userId,minecraftName}:{db:SupabaseClient;userId:string;minecraftName:string}){
 const [stats,setStats]=useState<Stats|null>(null);
 const [jobs,setJobs]=useState<Job[]>([]);
 const [currencies,setCurrencies]=useState<Currencies|null>(null);
 const [currenciesReady,setCurrenciesReady]=useState(true);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 useEffect(()=>{
  let mounted=true;setLoading(true);setError("");setStats(null);setJobs([]);setCurrencies(null);setCurrenciesReady(true);
  Promise.all([
   db.from("player_stats").select("playtime_seconds,balance,server_rank,blocks_mined,mob_kills,updated_at").eq("user_id",userId).maybeSingle(),
   db.from("player_job_stats").select("job_key,job_level,job_xp").eq("user_id",userId).order("job_level",{ascending:false}),
   db.from("player_currencies").select("coins,funitys,gems,updated_at").eq("user_id",userId).maybeSingle()
  ]).then(([s,j,money])=>{
   if(!mounted)return;
   if(s.error||j.error){setError("Statistiken konnten nicht geladen werden. Bitte prüfe, ob die zusätzliche SQL-Datei eingerichtet wurde.");}
   else{setStats(s.data);setJobs(j.data||[]);}if(money.error){setCurrenciesReady(false);}else{setCurrencies(money.data);}
  }).catch(()=>{if(mounted)setError("Statistiken sind derzeit nicht erreichbar.");}).finally(()=>{if(mounted)setLoading(false);});
  return ()=>{mounted=false;};
 },[db,userId]);
 const cells=[
  {label:"Spielzeit",value:stats?number(Math.floor(stats.playtime_seconds/3600))+" Std.":"—"},
  {label:"Server-Rang",value:stats?.server_rank||"—"},
  {label:"Abgebaute Blöcke",value:stats?.blocks_mined!=null?number(stats.blocks_mined):"—"},
  {label:"Mob-Kills",value:stats?.mob_kills!=null?number(stats.mob_kills):"—"}
 ];
 return <section className="sky-portal-panel sky-player-stats" aria-label="Minecraft-Spielerstatistiken">
  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
   <div><p className="text-xs font-bold uppercase tracking-widest text-purple-200">SkyFunity · Spielerprofil</p><h2 className="mt-1 text-2xl font-black">Meine Minecraft-Statistiken</h2><p className="mt-1 text-sm text-purple-200">Profil: {minecraftName}</p></div>
   <span className="sky-player-stats-badge">{stats?"Serverdaten":"Noch nicht verbunden"}</span>
  </div>
  {loading?<p className="text-purple-200">Statistiken werden geladen…</p>:error?<p role="status" className="sky-portal-notice">{error}</p>:<>
   {!stats&&<p className="mb-5 rounded-xl border border-purple-300/30 bg-purple-300/10 p-3 text-sm text-purple-100">SkyFunityJobs und die Ingame-Wirtschaft sind noch nicht mit den Spielerstatistiken verbunden. Sobald eine sichere Datenübertragung eingerichtet und dein Minecraft-Account verifiziert ist, erscheinen hier deine echten Werte.</p>}
   <div className="mb-5"><h3 className="mb-3 text-lg font-bold">Meine Ingame-Währungen</h3><div className="grid gap-3 sm:grid-cols-3">{([{label:"Coins",value:currencies?.coins,icon:"🪙"},{label:"Funitys",value:currencies?.funitys,icon:"✨"},{label:"Gems",value:currencies?.gems,icon:"💎"}] as const).map(currency=><div key={currency.label} className="sky-player-stat-tile"><p className="text-sm text-purple-200">{currency.icon} {currency.label}</p><p className="mt-2 break-words text-2xl font-black text-white">{currency.value!=null?number(currency.value):"—"}</p></div>)}</div>{!currenciesReady&&<p className="mt-2 text-sm text-purple-200">Die Währungstabellen müssen noch in Supabase eingerichtet werden.</p>}{currenciesReady&&!currencies&&<p className="mt-2 text-sm text-purple-200">Noch keine Coins, Funitys oder Gems vom Minecraft-Server übertragen.</p>}</div>
   <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{cells.map(item=><div key={item.label} className="sky-player-stat-tile"><p className="text-sm text-purple-200">{item.label}</p><p className="mt-2 break-words text-xl font-black text-white">{item.value}</p></div>)}</div>
   <div className="mt-5"><h3 className="mb-3 text-lg font-bold">Meine Jobs</h3>{jobs.length?<div className="grid gap-3 sm:grid-cols-2">{jobs.map(job=><div key={job.job_key} className="sky-player-stat-tile"><p className="font-semibold text-purple-100">{job.job_key}</p><p className="mt-1 text-xl font-bold">Level {number(job.job_level)}</p>{job.job_xp!=null&&<p className="text-sm text-purple-200">{number(job.job_xp)} XP</p>}</div>)}</div>:<p className="text-sm text-purple-200">Noch keine Job-Level von SkyFunityJobs übertragen.</p>}</div>
   {stats&&<p className="mt-4 text-xs text-purple-200">Letzte Datenübertragung: {new Date(stats.updated_at).toLocaleString("de-DE")}</p>}
  </>}
 </section>;
}
