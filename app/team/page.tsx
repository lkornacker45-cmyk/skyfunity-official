import {getContent} from "@/lib/content";
import Link from "next/link";
export const dynamic="force-dynamic";
export default async function Team(){
 const {team,headings}=await getContent();
 const heading=headings?.team??{before:"Das",highlight:"Team",description:"Die Menschen hinter SkyFunity."};
 return <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
  <header className="mx-auto max-w-3xl text-center">
   <p className="text-xs font-black uppercase tracking-[.25em] text-emerald-300">⛏ SkyFunity · Spielerinventar</p>
   <h1 className="mt-5 text-4xl font-black md:text-6xl">{heading.before} <span className="text-emerald-300">{heading.highlight}</span></h1>
   <p className="mt-5 text-lg text-slate-300">{heading.description}</p>
   <p className="mt-3 text-sm text-emerald-200">Wähle einen Spieler-Kopf, um das Profil zu öffnen.</p>
  </header>
  <section className="sky-inventory mx-auto mt-12 max-w-5xl" aria-label="Minecraft-Team-Inventar">
   <div className="sky-inventory-top flex flex-wrap items-center justify-between gap-3 px-5 py-4">
    <span className="text-lg font-black tracking-wide text-[#39342e]">SkyFunity Team</span>
    <span className="rounded border border-[#777167] bg-[#a7a197] px-3 py-1 text-xs font-bold text-[#39342e]">{team.length} {team.length===1?"Mitglied":"Mitglieder"}</span>
   </div>
   {team.length===0?<p className="px-6 py-12 text-center font-bold text-[#39342e]">Hier erscheinen bald unsere Teammitglieder.</p>:
   <div className="sky-inventory-grid grid grid-cols-3 gap-2 p-4 sm:grid-cols-5 sm:gap-3 sm:p-6 lg:grid-cols-9">
    {team.map((m,i)=><Link key={i} href={`/team/${i}`} aria-label={`Profil von ${m.name}, ${m.role} öffnen`} className="sky-inventory-slot focus-ring group relative flex min-w-0 flex-col items-center justify-center gap-2 p-2 text-center transition-transform duration-200 hover:z-10 hover:-translate-y-1 focus-visible:z-10">
     <span className="sky-inventory-item relative flex h-12 w-12 items-center justify-center overflow-hidden border-2 border-[#504538] bg-[#302a37] text-3xl shadow-md sm:h-16 sm:w-16">
      {m.avatar?<img src={m.avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer"/>:<span aria-hidden="true">👤</span>}
     </span>
     <span className="w-full break-words text-xs font-black leading-tight text-[#25221e] sm:text-sm">{m.name}</span>
     <span className="w-full break-words text-[10px] font-bold leading-tight text-[#5b397b] sm:text-xs">{m.role}</span>
     <span className="sky-inventory-tooltip pointer-events-none absolute -top-12 left-1/2 z-20 hidden w-max max-w-[190px] -translate-x-1/2 border-2 border-[#b78cff] bg-[#1b102b] px-3 py-2 text-xs font-bold text-white shadow-xl group-hover:block group-focus-visible:block">{m.name} · Profil ansehen</span>
    </Link>)}
   </div>}
   <div className="sky-inventory-bottom mx-4 mb-4 flex items-center gap-3 border-t-4 border-[#777167] px-2 py-4 sm:mx-6">
    <span aria-hidden="true" className="text-3xl">🧭</span>
    <div><p className="text-sm font-black text-[#302c27]">Team-Navigation</p><p className="text-xs text-[#514b42]">Klicke auf einen Slot, um mehr zu erfahren.</p></div>
   </div>
  </section>
 </main>;
}
