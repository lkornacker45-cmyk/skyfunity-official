import {getContent} from "@/lib/content";
import Link from "next/link";
export const dynamic="force-dynamic";
export default async function Team(){
 const {team,headings}=await getContent();
 const heading=headings?.team??{before:"Das",highlight:"Team",description:"Die Menschen hinter SkyFunity."};
 return <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
  <header className="mx-auto max-w-3xl text-center">
   <span className="inline-flex items-center rounded-full border border-violet-300/35 bg-violet-500/10 px-5 py-2 text-xs font-black tracking-[.2em] text-violet-200">✦ SKYFUNITY · PORTAL-HALLE ✦</span>
   <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">{heading.before} <span className="bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">{heading.highlight}</span></h1>
   <p className="mt-6 text-lg leading-8 text-slate-300">{heading.description}</p>
   <p className="mt-4 text-sm text-violet-200">Betritt ein Portal und lerne unsere Crew kennen.</p>
   <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border border-purple-400/25 bg-[#1b1230]/70 px-5 py-2 text-sm text-purple-200"><span className="h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_12px_#e879f9]"/>{team.length} {team.length===1?"Teammitglied":"Teammitglieder"}</div>
  </header>
  {team.length===0?<p className="glass mx-auto mt-12 max-w-xl p-8 text-center text-slate-300">Unser Team wird hier bald vorgestellt.</p>:
  <section aria-label="SkyFunity Teammitglieder" className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
   {team.map((m,i)=><Link href={`/team/${i}`} key={i} className="sky-portal-card focus-ring group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-violet-400/30 bg-[#100b20]/90 shadow-2xl shadow-black/40 transition duration-300 hover:-translate-y-2 hover:border-fuchsia-300/70">
    <div className="sky-portal-scene relative flex h-72 items-center justify-center overflow-hidden">
     <span className="absolute left-5 top-5 z-20 rounded-full border border-violet-200/25 bg-black/40 px-3 py-1 text-xs font-bold tracking-wider text-violet-100">PORTAL #{String(i+1).padStart(2,"0")}</span>
     <div className="sky-portal-frame" aria-hidden="true"><div className="sky-portal-field"/><div className="sky-portal-sparks"/></div>
     <div className="sky-portal-avatar relative z-10 flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-fuchsia-200/60 bg-[#2b164a]/80 text-6xl shadow-[0_0_35px_#c084fc88]">
      {m.avatar?<img src={m.avatar} alt={`Profilbild von ${m.name}`} className="h-full w-full object-cover" referrerPolicy="no-referrer"/>:<span aria-hidden="true">👤</span>}
     </div>
     <span aria-hidden="true" className="absolute bottom-4 z-10 text-xs font-black tracking-[.25em] text-fuchsia-100/80">✦ ENTER PORTAL ✦</span>
    </div>
    <div className="flex flex-1 flex-col border-t border-fuchsia-400/20 bg-gradient-to-b from-violet-950/60 to-[#100b20] p-7">
     <p className="text-xs font-extrabold uppercase tracking-[.2em] text-fuchsia-300">SkyFunity Crew</p>
     <h2 className="mt-2 break-words text-3xl font-black text-white">{m.name}</h2>
     <span className="mt-3 w-fit max-w-full break-words rounded-full border border-fuchsia-400/35 bg-fuchsia-500/15 px-4 py-1.5 text-sm font-bold text-fuchsia-100">✦ {m.role}</span>
     {m.bio?.trim()&&<p className="mt-5 line-clamp-3 whitespace-pre-line break-words text-sm leading-7 text-slate-300">{m.bio}</p>}
     <div className="mt-auto flex items-center justify-between border-t border-violet-400/20 pt-5 text-sm font-bold text-cyan-200 group-hover:text-white" style={{marginTop:"auto",paddingTop:20}}>
      <span>Durchs Portal zum Profil</span><span aria-hidden="true" className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
     </div>
    </div>
   </Link>)}
  </section>}
 </div>;
}
