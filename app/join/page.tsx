import type {Metadata} from "next";
import CopyAddress from "@/components/CopyAddress";
import {getContent} from "@/lib/content";
import {siteCopyDefaults} from "@/lib/site-copy";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Server beitreten"};
export default async function Join(){
 const {server,copy}=await getContent();
 const t={...siteCopyDefaults,...copy};
 const port=server.bedrockPort||"19132";
 const verified=server.bedrockPortConfirmed===true;
 return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
  <header className="mx-auto max-w-3xl text-center">
   <p className="section-label">✦ {t["join.label"]} ✦</p>
   <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">{t["join.title"]} <span className="bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">{t["join.highlight"]}</span></h1>
   <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-200">{t["join.description"]}</p>
  </header>
  <div className="sky-join-split relative mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
   <section className="sky-join-split-panel sky-join-split-java scroll-mt-24" id="java-anleitung" aria-labelledby="sky-java-title">
    <div className="sky-join-split-glow" aria-hidden="true"/>
    <div className="relative z-10 flex h-full flex-col">
     <div className="flex items-center justify-between gap-3">
      <span className="sky-join-split-edition">PC · Java</span>
      <span className="text-4xl drop-shadow-[0_0_15px_#c084fc]" aria-hidden="true">⛏</span>
     </div>
     <h2 id="sky-java-title" className="mt-5 text-3xl font-black text-white sm:text-4xl">{t["join.javaTitle"]}</h2>
     <p className="mt-2 text-sm text-purple-200">Dein Weg auf SkyFunity mit Minecraft Java.</p>
     <div className="sky-join-split-copy mt-7"><CopyAddress address={server.address} label="Java-Serveradresse kopieren"/></div>
     <div className="sky-join-split-guide mt-7 flex-1">
      <h3 className="text-sm font-black uppercase tracking-[.18em] text-purple-200">So trittst du bei</h3>
      <ol className="sky-join-split-steps mt-5">
       <li>{t["join.javaStep1"]}</li>
       <li>{t["join.javaStep2"]}</li>
       <li>{t["join.javaStep3"]}</li>
       <li><strong className="break-all text-white">{server.address}</strong> {t["join.javaStep4"]}</li>
       <li>{t["join.javaStep5"]}</li>
      </ol>
     </div>
     <div className="sky-join-split-footer mt-7">✦ JAVA EDITION ✦</div>
    </div>
   </section>
   <section className="sky-join-split-panel sky-join-split-bedrock scroll-mt-24" id="bedrock-anleitung" aria-labelledby="sky-bedrock-title">
    <div className="sky-join-split-glow" aria-hidden="true"/>
    <div className="relative z-10 flex h-full flex-col">
     <div className="flex items-center justify-between gap-3">
      <span className="sky-join-split-edition">Bedrock · Crossplay</span>
      <span className="text-4xl drop-shadow-[0_0_15px_#67e8f9]" aria-hidden="true">◆</span>
     </div>
     <h2 id="sky-bedrock-title" className="mt-5 text-3xl font-black text-white sm:text-4xl">{t["join.bedrockTitle"]}</h2>
     <p className="mt-2 text-sm text-cyan-100">Verbinde dich über Minecraft Bedrock.</p>
     <div className="sky-join-split-copy mt-7 space-y-3">
      <CopyAddress address={server.address} label="Bedrock-Serveradresse kopieren"/>
      <CopyAddress address={port} label="Bedrock-Port kopieren"/>
     </div>
     <div className="sky-join-split-guide mt-7 flex-1">
      <h3 className="text-sm font-black uppercase tracking-[.18em] text-cyan-200">So trittst du bei</h3>
      <ol className="sky-join-split-steps mt-5">
       <li>{t["join.bedrockStep1"]}</li>
       <li>{t["join.bedrockStep2"]}</li>
       <li>{t["join.bedrockStep3"]}</li>
       <li><strong className="break-all text-white">{server.address}</strong> {t["join.bedrockStep4"]}</li>
       <li>Bedrock-Port <strong className="text-white">{port}</strong> eingeben – <span className={verified?"text-emerald-300":"text-amber-200"}>{verified?"bestätigt":"noch nicht bestätigt"}</span></li>
      </ol>
      {!verified&&<p className="mt-5 text-sm leading-6 text-amber-200">Der Bedrock-Port {port} ist noch nicht bestätigt. Bitte beim Serverteam nachfragen oder die Verbindung testen.</p>}
     </div>
     <div className="sky-join-split-footer mt-7">◆ BEDROCK EDITION ◆</div>
    </div>
   </section>
   <span className="sky-join-split-versus pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:grid" aria-hidden="true">VS</span>
  </div>
  <div className="mx-auto mt-9 flex max-w-lg flex-col items-center gap-3 text-center">
   <a className="w-full rounded-xl border border-purple-300/40 bg-purple-600 px-6 py-4 font-black text-white shadow-[0_0_30px_#9333ea55] transition hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href={server.discord} target="_blank" rel="noopener noreferrer">{t["join.discordButton"]} ↗</a>
   <p className="text-sm text-slate-200">SkyFunity · Java & Bedrock · Gemeinsam spielen</p>
  </div>
 </main>;
}
