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
 return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
  <div className="sky-join-menu mx-auto max-w-5xl">
   <div className="sky-join-menu-header text-center">
    <p className="text-xs font-black uppercase tracking-[.25em] text-[#eee4c5]">✦ {t["join.label"]} ✦</p>
    <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">{t["join.title"]} <span className="text-[#f7d981]">{t["join.highlight"]}</span></h1>
    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#e5decc] sm:text-base">{t["join.description"]}</p>
   </div>
   <div className="sky-join-menu-body space-y-7 px-4 py-7 sm:px-8 sm:py-10">
    <div className="sky-join-status mx-auto flex max-w-lg items-center justify-center gap-3 text-center text-sm font-bold sm:text-base"><span aria-hidden="true" className="text-xl">⛏</span> SKYFUNITY MULTIPLAYER SERVER <span aria-hidden="true" className="text-xl">⛏</span></div>
    <nav className="mx-auto grid max-w-2xl grid-cols-2 gap-3" aria-label="Edition auswählen">
     <a href="#java-anleitung" className="sky-join-pixel-button text-center">⛏ Java Edition</a>
     <a href="#bedrock-anleitung" className="sky-join-pixel-button text-center">◆ Bedrock Edition</a>
    </nav>
    <section aria-label="Serveradresse und Bedrock-Port" className="sky-join-addresses grid gap-4 sm:grid-cols-2">
     <div className="min-w-0"><p className="mb-2 text-xs font-black uppercase tracking-widest text-[#e8dbb8]">🌐 Server-IP</p><CopyAddress address={server.address} label="Serveradresse kopieren"/></div>
     <div className="min-w-0"><p className="mb-2 text-xs font-black uppercase tracking-widest text-[#e8dbb8]">◆ Bedrock-Port</p><CopyAddress address={port} label="Bedrock-Port kopieren"/></div>
    </section>
    <div className="sky-join-divider" aria-hidden="true"><span>✦ SPIELANLEITUNG ✦</span></div>
    <div className="grid gap-5 lg:grid-cols-2">
     <section id="java-anleitung" className="sky-join-instruction scroll-mt-24">
      <div className="sky-join-instruction-heading"><span aria-hidden="true">⛏</span><h2>{t["join.javaTitle"]}</h2></div>
      <ol className="sky-join-steps">
       <li>{t["join.javaStep1"]}</li><li>{t["join.javaStep2"]}</li><li>{t["join.javaStep3"]}</li>
       <li><strong className="break-all text-white">{server.address}</strong> {t["join.javaStep4"]}</li>
       <li>{t["join.javaStep5"]}</li>
      </ol>
     </section>
     <section id="bedrock-anleitung" className="sky-join-instruction scroll-mt-24">
      <div className="sky-join-instruction-heading"><span aria-hidden="true">◆</span><h2>{t["join.bedrockTitle"]}</h2></div>
      <ol className="sky-join-steps">
       <li>{t["join.bedrockStep1"]}</li><li>{t["join.bedrockStep2"]}</li><li>{t["join.bedrockStep3"]}</li>
       <li><strong className="break-all text-white">{server.address}</strong> {t["join.bedrockStep4"]}</li>
       <li>Bedrock-Port <strong className="text-white">{port}</strong> eingeben – <span className={verified?"text-emerald-300":"text-amber-200"}>{verified?"bestätigt":"noch nicht bestätigt"}</span></li>
      </ol>
      {!verified&&<p className="mt-5 text-sm text-amber-200">Der Bedrock-Port {port} ist noch nicht bestätigt. Bitte beim Serverteam nachfragen oder die Verbindung testen.</p>}
     </section>
    </div>
    <div className="flex flex-col items-center gap-3 pt-3">
     <a className="sky-join-pixel-button sky-join-discord w-full max-w-md text-center" href={server.discord} target="_blank" rel="noopener noreferrer">{t["join.discordButton"]} ↗</a>
     <p className="text-center text-xs text-[#d8cfb9]">SkyFunity · Java & Bedrock · Viel Spaß beim Spielen!</p>
    </div>
   </div>
  </div>
 </main>;
}
