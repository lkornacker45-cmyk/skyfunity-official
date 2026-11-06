import Link from "next/link";
import {getContent} from "@/lib/content";
export const dynamic="force-dynamic";
export default async function Team(){
 const {team,headings}=await getContent();
 const heading=headings?.team??{before:"Das",highlight:"Team",description:"Die Menschen hinter SkyFunity."};
 const points=team.map((m,i)=>({m,i,x:m.treeX??(20+(i%4)*20),y:m.treeY??Math.min(90,12+Math.floor(i/4)*19)}));
 return <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
  <header className="mx-auto max-w-3xl text-center">
   <span className="inline-flex items-center rounded-full border border-violet-400/40 bg-violet-500/10 px-5 py-2 text-xs font-black tracking-[.2em] text-violet-200">✦ SKYFUNITY · TEAM SKILLTREE ✦</span>
   <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">{heading.before} <span className="bg-gradient-to-r from-amber-200 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">{heading.highlight}</span></h1>
   <p className="mt-6 text-lg leading-8 text-slate-300">{heading.description}</p>
   <p className="mt-4 text-sm text-purple-200">Entdecke unseren frei gestalteten Team-Skilltree. Klicke auf einen Spieler für das Profil.</p>
  </header>
  {team.length===0?<p className="glass mx-auto mt-12 max-w-xl p-8 text-center text-slate-300">Unser Team wird hier bald vorgestellt.</p>:
  <section className="sky-skilltree relative mx-auto mt-14 max-w-6xl overflow-hidden rounded-3xl border border-purple-400/25 bg-[#0c091b]/80 shadow-2xl shadow-black/40" aria-label="Team-Skilltree">
   <div className="relative h-[600px] sm:h-[760px]">
    <div className="pointer-events-none absolute inset-0 opacity-15" style={{backgroundImage:"radial-gradient(#c084fc 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{points.slice(1).map((p,j)=>{const prev=points[j];return <line key={p.i} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y} stroke="#a78bfa" strokeWidth=".45" opacity=".75"/>})}</svg>
    {points.map(({m,i,x,y})=><Link key={i} href={`/team/${i}`} aria-label={`Profil von ${m.name} öffnen`} style={{left:x+"%",top:y+"%"}} className="sky-skilltree-node focus-ring group absolute z-10 flex w-[100px] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl border border-purple-400/50 bg-[#24133d]/95 px-2 py-3 text-center shadow-[0_0_25px_#a855f744] transition duration-300 hover:z-20 hover:scale-110 hover:border-cyan-300 sm:w-[150px] sm:p-4">
     <span className="sky-skilltree-avatar flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border-2 border-fuchsia-300/60 bg-purple-900 text-3xl sm:h-20 sm:w-20">{m.avatar?<img src={m.avatar} alt={`Profilbild von ${m.name}`} className="h-full w-full object-cover" referrerPolicy="no-referrer"/>:"👤"}</span>
     <span className="mt-2 w-full break-words text-xs font-black text-white sm:text-base">{m.name}</span>
     <span className="mt-1 w-full break-words text-[10px] font-semibold text-fuchsia-200 sm:text-xs">{m.role}</span>
    </Link>)}
   </div>
  </section>}
 </main>;
}
