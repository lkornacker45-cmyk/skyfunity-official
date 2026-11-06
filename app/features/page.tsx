import {getContent} from "@/lib/content";
export const dynamic="force-dynamic";

export default async function Features(){
 const {features,headings}=await getContent();
 const heading=headings?.features??{before:"Entdecke",highlight:"SkyFunity",description:"Das bietet unsere Community."};
 return <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
  <div className="mx-auto max-w-3xl text-center">
   <p className="section-label">✦ SkyFunity Schatzkammer ✦</p>
   <h1 className="mt-4 text-4xl font-black md:text-6xl">{heading.before} <span className="text-purple-400">{heading.highlight}</span></h1>
   <p className="mt-5 text-lg leading-8 text-slate-300">{heading.description}</p>
   <p className="mt-4 text-sm text-purple-200">Klicke auf eine Schatztruhe und entdecke, was sich darin verbirgt.</p>
  </div>
  {features.length===0?<p className="glass mt-12 p-8 text-center text-slate-300">Noch keine Schätze eingetragen.</p>:
  <div className="mt-12 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
   {features.map((feature,i)=><details key={i} className="sky-treasure group relative overflow-hidden rounded-3xl border border-amber-300/25 bg-[#150e25]/90 shadow-xl shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-amber-300/60 open:border-amber-300/60">
    <summary className="focus-ring sky-treasure-trigger flex cursor-pointer list-none flex-col items-center px-6 pb-6 pt-8 text-center [&::-webkit-details-marker]:hidden">
     <span className="sky-treasure-sparkle absolute right-6 top-5 text-amber-200/80" aria-hidden="true">✦</span>
     <span className="sky-treasure-chest" aria-hidden="true">
      <span className="sky-treasure-lid"><span className="sky-treasure-lid-edge"/></span>
      <span className="sky-treasure-light"/>
      <span className="sky-treasure-base"><span className="sky-treasure-lock"/></span>
     </span>
     <span className="mt-6 block break-words text-2xl font-black text-cyan-300">{feature.title}</span>
     <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold tracking-wide text-amber-100"><span className="sky-treasure-closed-label">✦ Schatz öffnen</span><span className="sky-treasure-open-label">✕ Schatz schließen</span></span>
    </summary>
    <div className="sky-treasure-content border-t border-amber-300/20 bg-gradient-to-b from-amber-300/[0.07] to-transparent px-6 pb-7 pt-6">
     <p className="whitespace-pre-line break-words text-left text-sm leading-7 text-slate-100 sm:text-base">{feature.description}</p>
    </div>
   </details>)}
  </div>}
 </div>;
}
