import Link from "next/link";
import {notFound} from "next/navigation";
import {getContent} from "@/lib/content";
export const dynamic="force-dynamic";
export default async function RankDetails({params}:{params:{rank:string}}){
 const {ranks,server}=await getContent();
 if(!/^(0|[1-9][0-9]*)$/.test(params.rank))notFound();
 const i=Number(params.rank);
 if(!Number.isSafeInteger(i)||i>=ranks.length)notFound();
 const rank=ranks[i];
 return <div className="mx-auto max-w-4xl px-5 py-16">
 <Link href="/ranks" className="focus-ring text-sm font-semibold text-purple-300 hover:text-white">← Zurück zu allen Rängen</Link>
 <article className="glass mt-8 overflow-hidden p-7 md:p-12">
 <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
 {rank.image&&<img src={rank.image} alt={`Rangbild für ${rank.name}`} className="h-28 w-28 rounded-2xl object-contain" referrerPolicy="no-referrer"/>}
 <div><p className="section-label">SkyFunity Rang</p><h1 className={`mt-3 break-words text-4xl font-black md:text-5xl ${rank.color}`}>{rank.name}</h1></div>
 </div>
 <div className="mt-10 space-y-9 border-t border-purple-400/20 pt-9">
 {rank.description?.trim()&&<section><h2 className="text-2xl font-black">Über diesen Rang</h2><p className="mt-3 whitespace-pre-wrap break-words leading-8 text-slate-300">{rank.description}</p></section>}
 {(rank.plots?.trim()||rank.warps?.trim()||rank.homes?.trim())&&<section><h2 className="text-xl font-bold">Grundstücke, Warps & Homes</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{rank.plots?.trim()&&<div className="rounded-xl border border-purple-400/20 bg-black/20 p-5"><p className="text-sm text-purple-300">Plots</p><p className="mt-2 text-2xl font-black text-white">{rank.plots}</p></div>}{rank.homes?.trim()&&<div className="rounded-xl border border-purple-400/20 bg-black/20 p-5"><p className="text-sm text-purple-300">Homes</p><p className="mt-2 text-2xl font-black text-white">{rank.homes}</p></div>}{rank.warps?.trim()&&<div className="rounded-xl border border-purple-400/20 bg-black/20 p-5"><p className="text-sm text-purple-300">Warps</p><p className="mt-2 text-2xl font-black text-white">{rank.warps}</p></div>}</div></section>}
 {rank.commands&&rank.commands.length>0&&<section><h2 className="text-xl font-bold">Verfügbare Befehle</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{rank.commands.map((cmd,j)=><li key={j} className="rounded-lg border border-purple-400/20 bg-black/20 px-4 py-3 font-mono text-purple-200 break-all">{cmd}</li>)}</ul></section>}
 {rank.benefits.length>0&&<section><h2 className="text-xl font-bold">Alle Vorteile</h2><ul className="mt-4 space-y-3 text-slate-300">{rank.benefits.map((b,j)=><li key={j}>✦ {b}</li>)}</ul></section>}
 <a href={server.shop} target="_blank" rel="noopener noreferrer" className="inline-block rounded-xl bg-purple-600 px-6 py-3 font-bold text-white hover:bg-purple-500">Zum Shop ↗</a>
 </div></article></div>
}
