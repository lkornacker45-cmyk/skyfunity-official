import type {Metadata} from "next";
import JoinSpaceStation from "@/components/JoinSpaceStation";
import {getContent} from "@/lib/content";
import {siteCopyDefaults} from "@/lib/site-copy";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Server beitreten"};
export default async function Join(){
 const {server,copy}=await getContent();
 const t={...siteCopyDefaults,...copy};
 return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
  <header className="mx-auto max-w-3xl text-center">
   <p className="section-label">✦ {t["join.label"]} ✦</p>
   <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">{t["join.title"]} <span className="bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">{t["join.highlight"]}</span></h1>
   <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-200">{t["join.description"]}</p>
  </header>
  <JoinSpaceStation
   address={server.address}
   port={server.bedrockPort||"19132"}
   verified={server.bedrockPortConfirmed===true}
   javaTitle={t["join.javaTitle"]}
   bedrockTitle={t["join.bedrockTitle"]}
   javaSteps={[t["join.javaStep1"],t["join.javaStep2"],t["join.javaStep3"],t["join.javaStep4"],t["join.javaStep5"]]}
   bedrockSteps={[t["join.bedrockStep1"],t["join.bedrockStep2"],t["join.bedrockStep3"],t["join.bedrockStep4"]]}
   discord={server.discord}
   discordLabel={t["join.discordButton"]}
  />
 </main>;
}
