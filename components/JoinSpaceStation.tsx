"use client";
import {useState} from "react";
import CopyAddress from "@/components/CopyAddress";

type Props={
 address:string;port:string;verified:boolean;
 javaTitle:string;bedrockTitle:string;
 javaSteps:string[];bedrockSteps:string[];
 discord:string;discordLabel:string;
};
export default function JoinSpaceStation(p:Props){
 const [edition,setEdition]=useState<"java"|"bedrock">("java");
 const bedrock=edition==="bedrock";
 const steps=bedrock?p.bedrockSteps:p.javaSteps;
 return <section className="sky-station relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-3xl" aria-label="SkyFunity-Raumstation">
  <div className="sky-station-stars pointer-events-none absolute inset-0" aria-hidden="true"/>
  <div className="relative z-10">
   <div className="sky-station-bar flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
    <span className="font-mono text-xs font-black uppercase tracking-[.18em] text-cyan-100">✦ SKYFUNITY SPACE STATION</span>
    <span className="flex items-center gap-2 font-mono text-[11px] font-bold text-emerald-200"><span className="sky-station-beacon"/> NAVIGATION ONLINE</span>
   </div>
   <div className="px-4 py-8 sm:px-9 sm:py-11">
    <div className="sky-station-cockpit mx-auto max-w-3xl text-center">
     <div className="sky-station-planet mx-auto grid h-24 w-24 place-items-center rounded-full text-5xl sm:h-28 sm:w-28" aria-hidden="true">🌍</div>
     <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[.24em] text-cyan-200">Zielkoordinaten · Minecraft Multiplayer</p>
     <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">SKYFUNITY</h2>
     <p className="mt-3 break-all font-mono text-lg font-black text-cyan-100 sm:text-2xl">{p.address}</p>
     <p className="mt-3 text-sm text-slate-300">Wähle eine Landebucht, um deine Verbindung vorzubereiten.</p>
    </div>
    <div className="sky-station-hangars mt-8 grid gap-4 sm:grid-cols-2" role="group" aria-label="Minecraft-Edition wählen">
     <button type="button" aria-pressed={!bedrock} onClick={()=>setEdition("java")} className={"sky-station-hangar sky-station-java "+(!bedrock?"sky-station-selected":"")}>
      <span className="text-4xl" aria-hidden="true">⛏</span><span className="block text-xl font-black">LANDEBUCHT 01</span><span className="block text-sm font-bold text-purple-100">JAVA EDITION</span><span className="sky-station-hangar-status">{!bedrock?"● AUSGEWÄHLT":"○ AUSWÄHLEN"}</span>
     </button>
     <button type="button" aria-pressed={bedrock} onClick={()=>setEdition("bedrock")} className={"sky-station-hangar sky-station-bedrock "+(bedrock?"sky-station-selected":"")}>
      <span className="text-4xl" aria-hidden="true">◆</span><span className="block text-xl font-black">LANDEBUCHT 02</span><span className="block text-sm font-bold text-cyan-100">BEDROCK EDITION</span><span className="sky-station-hangar-status">{bedrock?"● AUSGEWÄHLT":"○ AUSWÄHLEN"}</span>
     </button>
    </div>
    <div className="sky-station-console mt-7 rounded-2xl p-4 sm:p-8">
     <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/20 pb-5">
      <div><p className="font-mono text-[11px] font-bold uppercase tracking-[.2em] text-cyan-300">▸ Verbindungskonsole</p><h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">{bedrock?p.bedrockTitle:p.javaTitle}</h3></div>
      <span className="sky-station-console-chip">{bedrock?"DOCK 02":"DOCK 01"} · READY</span>
     </div>
     <div className={"mt-6 grid gap-3 "+(bedrock?"md:grid-cols-2":"")}>
      <CopyAddress address={p.address} label="Serveradresse kopieren"/>
      {bedrock&&<CopyAddress address={p.port} label="Bedrock-Port kopieren"/>}
     </div>
     <h4 className="mt-8 font-mono text-xs font-black uppercase tracking-[.18em] text-cyan-200">Flugplan · Verbindungsschritte</h4>
     <ol className="sky-station-steps mt-5 space-y-3">
      {steps.map((step,i)=><li key={i}><span className="sky-station-stepnum">{String(i+1).padStart(2,"0")}</span><span>{i===3?<><strong className="break-all text-white">{p.address}</strong> {step}</>:step}</span></li>)}
      {bedrock&&<li><span className="sky-station-stepnum">05</span><span>Bedrock-Port <strong className="text-white">{p.port}</strong> eingeben – <span className={p.verified?"text-emerald-300":"text-amber-200"}>{p.verified?"bestätigt":"noch nicht bestätigt"}</span></span></li>}
     </ol>
     {bedrock&&!p.verified&&<p className="mt-5 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">Der Bedrock-Port {p.port} ist noch nicht bestätigt. Bitte beim Serverteam nachfragen oder die Verbindung testen.</p>}
    </div>
    <div className="mx-auto mt-8 max-w-md text-center">
     <a href={p.discord} target="_blank" rel="noopener noreferrer" className="sky-station-discord block rounded-xl px-6 py-4 font-black text-white">{p.discordLabel} ↗</a>
     <p className="mt-4 font-mono text-xs tracking-widest text-cyan-100/80">✦ MISSION: SKYFUNITY ✦</p>
    </div>
   </div>
  </div>
 </section>;
}
