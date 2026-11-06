"use client";
import CopyAddress from "@/components/CopyAddress";

type Props={
 address:string;port:string;verified:boolean;
 javaTitle:string;bedrockTitle:string;
 javaSteps:string[];bedrockSteps:string[];
 discord:string;discordLabel:string;
};
export default function JoinNoticeBoard(p:Props){
 return <section className="sky-board mx-auto mt-10 max-w-5xl" aria-label="SkyFunity Minecraft-Infotafel">
  <div className="sky-board-posts" aria-hidden="true"><span/><span/></div>
  <div className="sky-board-frame relative">
   <div className="sky-board-corner sky-board-corner-tl" aria-hidden="true"/>
   <div className="sky-board-corner sky-board-corner-tr" aria-hidden="true"/>
   <div className="sky-board-corner sky-board-corner-bl" aria-hidden="true"/>
   <div className="sky-board-corner sky-board-corner-br" aria-hidden="true"/>
   <header className="relative z-10 text-center">
    <p className="text-xs font-black uppercase tracking-[.25em] text-amber-200">✦ SKYFUNITY · SERVER-INFO ✦</p>
    <h2 className="sky-board-heading mt-3 text-3xl font-black text-amber-50 sm:text-5xl">🪧 Minecraft-Infotafel</h2>
    <p className="mt-3 text-sm text-amber-100/85">Alles, was du zum Beitreten brauchst.</p>
   </header>
   <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-2">
    <div className="sky-board-sign min-w-0">
     <div className="mb-3 flex items-center gap-2 text-sm font-black text-amber-100">⛏ Serveradresse</div>
     <CopyAddress address={p.address} label="Server-IP kopieren"/>
    </div>
    <div className="sky-board-sign min-w-0">
     <div className="mb-3 flex items-center gap-2 text-sm font-black text-amber-100">◆ Bedrock-Port</div>
     <CopyAddress address={p.port} label="Bedrock-Port kopieren"/>
     <p className={"mt-3 text-xs font-semibold "+(p.verified?"text-emerald-200":"text-amber-200")}>{p.verified?"✓ Bedrock-Port bestätigt":"⚠ Bedrock-Port noch nicht bestätigt"}</p>
    </div>
   </div>
   <div className="relative z-10 mt-8 space-y-4">
    <p className="text-center text-xs font-black uppercase tracking-[.2em] text-amber-100">▼ Anleitung auswählen ▼</p>
    <details className="sky-board-details group" open>
     <summary className="sky-board-summary cursor-pointer select-none">
      <span className="flex items-center gap-3"><span aria-hidden="true">⛏</span><span>{p.javaTitle}</span></span>
      <span className="sky-board-chevron" aria-hidden="true">⌄</span>
     </summary>
     <div className="sky-board-instructions">
      <ol className="sky-board-steps">
       {p.javaSteps.map((step,i)=><li key={i}><span className="sky-board-stepnum">{i+1}</span><span>{i===3?<><strong className="break-all text-amber-50">{p.address}</strong> {step}</>:step}</span></li>)}
      </ol>
     </div>
    </details>
    <details className="sky-board-details group">
     <summary className="sky-board-summary cursor-pointer select-none">
      <span className="flex items-center gap-3"><span aria-hidden="true">◆</span><span>{p.bedrockTitle}</span></span>
      <span className="sky-board-chevron" aria-hidden="true">⌄</span>
     </summary>
     <div className="sky-board-instructions">
      <ol className="sky-board-steps">
       {p.bedrockSteps.map((step,i)=><li key={i}><span className="sky-board-stepnum">{i+1}</span><span>{i===3?<><strong className="break-all text-amber-50">{p.address}</strong> {step}</>:step}</span></li>)}
       <li><span className="sky-board-stepnum">5</span><span>Bedrock-Port <strong className="text-amber-50">{p.port}</strong> eingeben – <span className={p.verified?"text-emerald-200":"text-amber-200"}>{p.verified?"bestätigt":"noch nicht bestätigt"}</span></span></li>
      </ol>
      {!p.verified&&<p className="mt-5 rounded-lg border border-amber-300/40 bg-amber-950/50 p-3 text-sm text-amber-100">Der Bedrock-Port {p.port} ist noch nicht bestätigt. Bitte beim Serverteam nachfragen oder die Verbindung testen.</p>}
     </div>
    </details>
   </div>
   <div className="relative z-10 mx-auto mt-8 max-w-md text-center">
    <a className="sky-board-discord block rounded-lg px-6 py-4 font-black text-white" href={p.discord} target="_blank" rel="noopener noreferrer">{p.discordLabel} ↗</a>
    <p className="mt-4 text-xs text-amber-100/80">✦ SKYFUNITY · JAVA & BEDROCK ✦</p>
   </div>
  </div>
 </section>;
}
