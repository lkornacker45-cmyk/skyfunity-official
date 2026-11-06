import Link from "next/link";
import {getContent} from "@/lib/content";

export const dynamic="force-dynamic";

export default async function Ranks(){
 const {ranks,headings}=await getContent();
 const heading=headings?.ranks??{before:"Unsere",highlight:"Ränge",description:"Entdecke unsere Ränge und Vorteile."};
 const rows=[
  {label:"Plots",key:"plots"},
  {label:"Warps",key:"warps"},
  {label:"Homes",key:"homes"},
  {label:"Auktionshaus",key:"auctionHouse"}
 ] as const;
 return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
  <div className="mx-auto max-w-3xl text-center">
   <p className="section-label">SkyFunity · Rangübersicht</p>
   <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">{heading.before} <span className="text-purple-400">{heading.highlight}</span></h1>
   <p className="mt-5 text-base leading-7 text-slate-300">{heading.description}</p>
   <p className="mt-3 text-sm text-purple-200">Vergleiche alle Vorteile und finde den passenden Rang für dich.</p>
  </div>
  {ranks.length===0?<p className="glass mt-12 p-8 text-center text-slate-300">Zurzeit sind keine Ränge eingetragen.</p>:<>
   <div className="mt-12 flex items-center justify-between gap-3">
    <h2 className="text-xl font-black text-white sm:text-2xl">Alle Ränge im Vergleich</h2>
    <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-200">{ranks.length} {ranks.length===1?"Rang":"Ränge"}</span>
   </div>
   <p className="mt-2 text-sm text-slate-400 sm:hidden">← Tabelle nach links und rechts schieben →</p>
   <div className="mt-5 overflow-x-auto rounded-3xl border border-purple-400/25 bg-[#120e23]/90 shadow-2xl shadow-purple-950/30" role="region" aria-label="Rangvergleich" tabIndex={0}>
    <table className="w-full border-separate border-spacing-0 text-left" style={{minWidth:Math.max(640,200+ranks.length*210)}}>
     <thead>
      <tr>
       <th scope="col" className="sticky left-0 z-20 w-44 min-w-44 border-b border-r border-purple-400/20 bg-[#1b1430] px-5 py-6 align-bottom text-sm font-bold text-purple-200">Vergleich</th>
       {ranks.map((rank,i)=><th scope="col" key={i} className="min-w-52 border-b border-r border-purple-400/15 bg-[#1b1430]/90 px-5 py-6 text-center align-top last:border-r-0">
        <div className="flex flex-col items-center gap-3">
         {rank.image?<img src={rank.image} alt={`Bild für Rang ${rank.name}`} className="h-20 w-20 rounded-2xl object-contain drop-shadow-lg" referrerPolicy="no-referrer"/>:<div aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-500/10 text-4xl">✦</div>}
         <span className={`break-words text-2xl font-black ${rank.color}`}>{rank.name}</span>
         <Link href={`/ranks/${i}`} className="focus-ring rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-purple-500">Details ansehen →</Link>
        </div>
       </th>)}
      </tr>
     </thead>
     <tbody>
      {rows.map((row,index)=><tr key={row.key}>
       <th scope="row" className={`sticky left-0 z-10 border-b border-r border-purple-400/15 px-5 py-5 text-sm font-bold text-purple-100 ${index%2===0?"bg-[#1b1430]":"bg-[#171126]"}`}>{row.label}</th>
       {ranks.map((rank,i)=><td key={i} className={`border-b border-r border-purple-400/10 px-4 py-5 text-center text-base font-bold text-white last:border-r-0 ${index%2===0?"bg-white/[0.025]":"bg-transparent"}`}>{rank[row.key]?.trim()||<span className="text-sm font-normal text-slate-500" aria-label="Keine Angabe">—</span>}</td>)}
      </tr>)}
      <tr>
       <th scope="row" className="sticky left-0 z-10 border-r border-purple-400/15 bg-[#1b1430] px-5 py-5 align-top text-sm font-bold text-purple-100">Vorteile &amp; Befehle</th>
       {ranks.map((rank,i)=><td key={i} className="border-r border-purple-400/10 px-4 py-5 align-top last:border-r-0">
        {rank.benefits.length||rank.commands?.length?<ul className="space-y-2">
         {rank.benefits.map((benefit,j)=><li key={`benefit-${j}`} className="flex items-start gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.045] px-3 py-2.5 text-sm leading-6 text-slate-200"><span className="shrink-0 font-bold text-emerald-300" aria-hidden="true">✓</span><span className="break-words">{benefit}</span></li>)}
         {(rank.commands||[]).map((cmd,j)=><li key={`command-${j}`} className="flex items-start gap-2 rounded-xl border border-purple-400/15 bg-purple-500/[0.08] px-3 py-2.5 text-sm leading-6 text-purple-100"><span className="shrink-0 font-bold text-purple-300" aria-hidden="true">⌘</span><code className="break-all font-mono text-xs leading-6">{cmd}</code></li>)}
        </ul>:<span className="block text-center text-sm text-slate-500">—</span>}
       </td>)}
      </tr>
     </tbody>
    </table>
   </div>
   <p className="mt-4 text-center text-sm text-slate-400">Ein Strich (—) bedeutet, dass für diesen Rang noch keine Angabe hinterlegt ist.</p>
  </>}
 </div>;
}
