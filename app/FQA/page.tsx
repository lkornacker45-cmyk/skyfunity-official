import type {Metadata} from "next";
import Link from "next/link";
import {getContent} from "@/lib/content";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"FQA – Häufige Fragen",description:"Antworten auf häufig gestellte Fragen rund um SkyFunity, Minecraft und die Community."};
export default async function FqaPage(){
 const {faq,server}=await getContent();
 return <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
  <header className="mb-12 text-center"><p className="section-label">✦ SKYFUNITY SUPPORT ✦</p><h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">❓ <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">FQA</span></h1><p className="mx-auto mt-4 max-w-2xl text-slate-200">Häufig gestellte Fragen und Antworten rund um SkyFunity.</p></header>
  <section aria-label="Häufige Fragen" className="space-y-4">
   {faq&&faq.length>0?faq.map((item,i)=><details key={i} className="group glass overflow-hidden rounded-2xl border border-purple-300/30 p-0 open:border-cyan-300/60"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-lg font-bold text-white sm:p-6"><span><span className="mr-3 text-cyan-300">{String(i+1).padStart(2,"0")}.</span>{item.question}</span><span aria-hidden="true" className="text-2xl text-purple-300 transition-transform group-open:rotate-45">+</span></summary><div className="whitespace-pre-wrap border-t border-purple-300/20 px-5 pb-6 pt-4 leading-7 text-slate-200 sm:px-6">{item.answer}</div></details>):<div className="glass rounded-2xl p-8 text-center"><h2 className="text-xl font-bold text-white">Noch keine Fragen hinterlegt</h2><p className="mt-3 text-slate-300">Unser Team ergänzt hier bald Antworten. Bis dahin helfen wir dir gerne auf Discord weiter.</p></div>}
  </section>
  <aside className="glass mt-12 rounded-2xl border border-cyan-300/30 p-7 text-center"><h2 className="text-2xl font-black text-white">Noch Fragen?</h2><p className="mt-2 text-slate-200">Frag unsere Community oder das Support-Team auf Discord.</p><a href={server.discord} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-xl bg-purple-600 px-6 py-3 font-bold text-white hover:bg-purple-500">Discord öffnen ↗</a><p className="mt-5 text-sm text-slate-400"><Link href="/" className="text-cyan-300 hover:underline">← Zur Startseite</Link></p></aside>
 </div>
}
