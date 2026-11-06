import {getContent} from "@/lib/content";
import Link from "next/link";
export const dynamic="force-dynamic";
export default async function Team(){
 const {team,headings}=await getContent();
 const heading=headings?.team??{before:"Das",highlight:"Team",description:"Die Menschen hinter SkyFunity."};
 return <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
  <header className="mx-auto max-w-3xl text-center">
   <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-5 py-2 text-xs font-black tracking-[.2em] text-cyan-200">✦ DIE CREW HINTER SKYFUNITY ✦</span>
   <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-7xl">{heading.before} <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">{heading.highlight}</span></h1>
   <p className="mt-6 text-lg leading-8 text-slate-300">{heading.description}</p>
   <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border border-purple-400/25 bg-[#1b1230]/70 px-5 py-2 text-sm text-purple-200"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]"/>{team.length} {team.length===1?"Teammitglied":"Teammitglieder"}</div>
  </header>
  {team.length===0?<p className="glass mx-auto mt-12 max-w-xl p-8 text-center text-slate-300">Unser Team wird hier bald vorgestellt.</p>:
  <section aria-label="SkyFunity Teammitglieder" className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
   {team.map((m,i)=><Link href={`/team/${i}`} key={i} className="sky-team-card focus-ring group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-purple-400/25 bg-[#130e25]/90 shadow-2xl shadow-black/30 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300/60 hover:shadow-[0_18px_65px_#22d3ee25]">
    <div className="relative flex h-52 items-center justify-center overflow-hidden border-b border-purple-400/20 bg-gradient-to-br from-purple-950 via-[#261343] to-[#0c263c]">
     <div aria-hidden="true" className="absolute -left-12 top-3 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl"/>
     <div aria-hidden="true" className="absolute -right-8 bottom-0 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl"/>
     <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-bold tracking-wider text-purple-100">CREW #{String(i+1).padStart(2,"0")}</span>
     <div className="relative z-10 flex h-36 w-36 items-center justify-center overflow-hidden rounded-3xl border-2 border-cyan-300/40 bg-purple-900/50 text-6xl shadow-[0_0_45px_#a855f744] transition duration-500 group-hover:scale-110 group-hover:rotate-2 group-hover:border-cyan-200">
      {m.avatar?<img src={m.avatar} alt={`Profilbild von ${m.name}`} className="h-full w-full object-cover" referrerPolicy="no-referrer"/>:<span aria-hidden="true">👑</span>}
     </div>
     <span aria-hidden="true" className="absolute bottom-4 right-6 text-2xl text-cyan-300/60">✦</span>
    </div>
    <div className="flex flex-1 flex-col p-7">
     <p className="text-xs font-extrabold uppercase tracking-[.18em] text-cyan-300">SkyFunity Team</p>
     <h2 className="mt-2 break-words text-3xl font-black text-white">{m.name}</h2>
     <span className="mt-3 w-fit max-w-full break-words rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-4 py-1.5 text-sm font-bold text-fuchsia-200">✦ {m.role}</span>
     {m.bio?.trim()&&<p className="mt-5 line-clamp-3 whitespace-pre-line break-words text-sm leading-7 text-slate-300">{m.bio}</p>}
     <div className="mt-auto flex items-center justify-between border-t border-purple-400/20 pt-5 text-sm font-bold text-cyan-200 group-hover:text-white" style={{marginTop:"auto",paddingTop:20}}>
      <span>Profil entdecken</span><span aria-hidden="true" className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
     </div>
    </div>
   </Link>)}
  </section>}
 </div>;
}
