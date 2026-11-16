"use client";
import {useEffect,useState} from "react";
import {siteCopyDefaults,type SiteCopy} from "@/lib/site-copy";
type Edition={online:boolean|null;players:number|null;maxPlayers:number|null};
type Status={java:Edition;bedrock:Edition;discordOnline:number|null;discordReason?:"missing"|"widget"|"unavailable"|null;checkedAt:string|null};
export default function ServerStatus({copy}:{copy?:SiteCopy}){const t={...siteCopyDefaults,...copy};
 const [status,setStatus]=useState<Status|null>(null);
 const [error,setError]=useState(false);
 useEffect(()=>{let active=true;async function load(){try{const r=await fetch("/api/status",{cache:"no-store"});if(!r.ok)throw Error();const d:Status=await r.json();if(active){setStatus(d);setError(false)}}catch{if(active)setError(true)}}void load();const timer=setInterval(()=>void load(),43200000);return()=>{active=false;clearInterval(timer)}},[]);
 const cards=[{name:t["status.javaTitle"],icon:"⛏",data:status?.java},{name:t["status.bedrockTitle"],icon:"◆",data:status?.bedrock}];
 return <div>
 <section aria-label="Live-Serverstatus" className="grid gap-4 md:grid-cols-2">{cards.map(c=><article key={c.name} className="glass p-7"><div className="flex items-center justify-between"><p className="font-semibold text-purple-200">{c.name}</p><span aria-hidden className="text-2xl">{c.icon}</span></div><p className="mt-5 text-3xl font-black text-white">{!status?"Lädt …":c.data?.online===null?"Nicht verfügbar":c.data?.online?"Online":"Offline"}</p><p className="mt-3 text-sm text-slate-400">{c.data?.players==null?"Spielerzahl derzeit nicht verfügbar":`${c.data.players} / ${c.data.maxPlayers ?? "?"} Spieler online`}</p>{c.data?.players!=null&&c.data.maxPlayers!=null&&c.data.maxPlayers>0&&<div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label={`${c.name} Auslastung`} aria-valuenow={c.data.players} aria-valuemin={0} aria-valuemax={c.data.maxPlayers}><div className="h-full rounded-full bg-purple-500" style={{width:`${Math.min(100,Math.max(0,c.data.players/c.data.maxPlayers*100))}%`}}/></div>}</article>)}</section>

 {error&&<p role="status" className="mt-3 text-sm text-amber-300">Live-Daten vorübergehend nicht erreichbar.</p>}<p className="mt-4 text-xs text-slate-500">Letzte Netzwerk-Abfrage: {status?.checkedAt?new Date(status.checkedAt).toLocaleTimeString("de-DE"):"—"}</p></div>
}
