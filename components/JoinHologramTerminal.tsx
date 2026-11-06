"use client";
import {useState} from "react";
import CopyAddress from "@/components/CopyAddress";
type Props={address:string;port:string;verified:boolean;javaTitle:string;bedrockTitle:string;javaSteps:string[];bedrockSteps:string[];javaStep4:string;bedrockStep4:string;discord:string;discordLabel:string};
export default function JoinHologramTerminal(p:Props){
 const [edition,setEdition]=useState<"java"|"bedrock">("java");
 const bedrock=edition==="bedrock";
 const steps=bedrock?p.bedrockSteps:p.javaSteps;
 return <section className="sky-holo-shell relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl" aria-label="SkyFunity Hologramm-Terminal">
  <div className="sky-holo-scan pointer-events-none absolute inset-0 z-10" aria-hidden="true"/>
  <div className="relative z-20">
   <div className="sky-holo-topbar flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
    <div className="flex items-center gap-3"><span className="sky-holo-led"/><span className="font-mono text-xs font-black tracking-[.2em] text-cyan-100 sm:text-sm">SKYFUNITY // CONNECT</span></div>
    <span className="font-mono text-[10px] tracking-widest text-cyan-300">TERMINAL · V1.0</span>
   </div>
   <div className="px-4 py-7 sm:px-9 sm:py-10">
    <div className="text-center">
     <div className="sky-holo-orbit mx-auto mb-5 grid h-20 w-20 place-items-center rounded-2xl text-4xl" aria-hidden="true">⌘</div>
     <p className="font-mono text-xs font-bold uppercase tracking-[.25em] text-cyan-300">Server-Verbindung</p>
     <p className="sky-holo-ip mt-3 break-all font-mono text-2xl font-black tracking-wide text-white sm:text-4xl">{p.address}</p>
     <p className="mt-3 font-mono text-xs text-slate-300">Wähle deine Edition und folge den Verbindungsschritten.</p>
    </div>
    <div className="sky-holo-tabs mx-auto mt-8 grid max-w-xl grid-cols-2 gap-3" role="tablist" aria-label="Minecraft-Edition">
     <button type="button" role="tab" id="sky-holo-java-tab" aria-controls="sky-holo-content" aria-selected={!bedrock} onClick={()=>setEdition("java")} className={"sky-holo-tab "+(!bedrock?"sky-holo-tab-active":"")}>⛏ JAVA EDITION</button>
     <button type="button" role="tab" id="sky-holo-bedrock-tab" aria-controls="sky-holo-content" aria-selected={bedrock} onClick={()=>setEdition("bedrock")} className={"sky-holo-tab "+(bedrock?"sky-holo-tab-active":"")}>◆ BEDROCK EDITION</button>
    </div>
    <div id="sky-holo-content" role="tabpanel" aria-labelledby={bedrock?"sky-holo-bedrock-tab":"sky-holo-java-tab"} className="sky-holo-display mt-7 rounded-2xl p-4 sm:p-7">
     <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/20 pb-5">
      <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">Verbindungsprotokoll</p><h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">{bedrock?p.bedrockTitle:p.javaTitle}</h2></div>
      <span className="sky-holo-chip">{bedrock?"BEDROCK":"JAVA"} // READY</span>
     </div>
     <div className={"mt-6 grid gap-3 "+(bedrock?"md:grid-cols-2":"")}>
      <CopyAddress address={p.address} label="Serveradresse kopieren"/>
      {bedrock&&<CopyAddress address={p.port} label="Bedrock-Port kopieren"/>}
     </div>
     <h3 className="mt-8 font-mono text-xs font-black uppercase tracking-[.2em] text-cyan-300">▸ Verbindung herstellen</h3>
     <ol className="sky-holo-steps mt-5 space-y-3">
      {steps.slice(0,3).map((step,i)=><li key={i}><span className="sky-holo-stepnum">{String(i+1).padStart(2,"0")}</span><span>{step}</span></li>)}
      <li><span className="sky-holo-stepnum">04</span><span><strong className="break-all text-white">{p.address}</strong> {bedrock?p.bedrockStep4:p.javaStep4}</span></li>
      <li><span className="sky-holo-stepnum">05</span><span>{bedrock?<>Bedrock-Port <strong className="text-white">{p.port}</strong> eingeben – <span className={p.verified?"text-emerald-300":"text-amber-200"}>{p.verified?"bestätigt":"noch nicht bestätigt"}</span></>:steps[4]}</span></li>
     </ol>
     {bedrock&&!p.verified&&<p className="mt-6 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">Der Bedrock-Port {p.port} ist noch nicht bestätigt. Bitte beim Serverteam nachfragen oder die Verbindung testen.</p>}
    </div>
    <div className="mt-8 flex flex-col items-center gap-3">
     <a href={p.discord} target="_blank" rel="noopener noreferrer" className="sky-holo-discord w-full max-w-md rounded-xl px-6 py-4 text-center font-black text-white">{p.discordLabel} ↗</a>
     <p className="font-mono text-xs text-cyan-100/75">✦ SKYFUNITY · JAVA & BEDROCK ✦</p>
    </div>
   </div>
  </div>
 </section>;
}
