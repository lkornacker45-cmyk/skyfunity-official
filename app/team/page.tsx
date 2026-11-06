import Link from "next/link";
import {getContent} from "@/lib/content";
export const dynamic="force-dynamic";

function tierFor(role:string){
 const r=role.toLowerCase();
 if(/owner|inhaber|gründer|founder|besitzer/.test(r))return 0;
 if(/co.?owner|leitung|management|manager|head|leitungsteam/.test(r))return 1;
 if(/admin|administrator|developer|entwickler|dev\b/.test(r))return 2;
 if(/moderator|mod\b|support|helper|teamler|builder|designer|content|media/.test(r))return 3;
 return 4;
}
const tierNames=["Serverleitung","Management","Administration & Entwicklung","Moderation & Support","Weitere Teammitglieder"];
const tierIcons=["♛","✦","⚒","✧","◆"];
export default async function Team(){
 const {team,headings}=await getContent();
 const heading=headings?.team??{before:"Das",highlight:"Team",description:"Die Menschen hinter SkyFunity."};
 const groups=tierNames.map((title,tier)=>({title,tier,members:team.map((member,index)=>({member,index})).filter(({member})=>tierFor(member.role)===tier)})).filter(g=>g.members.length);
 return <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
  <header className="mx-auto max-w-3xl text-center">
   <span className="inline-flex items-center rounded-full border border-violet-400/40 bg-violet-500/10 px-5 py-2 text-xs font-black tracking-[.2em] text-violet-200">✦ SKYFUNITY · TEAM SKILLTREE ✦</span>
   <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">{heading.before} <span className="bg-gradient-to-r from-amber-200 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">{heading.highlight}</span></h1>
   <p className="mt-6 text-lg leading-8 text-slate-300">{heading.description}</p>
   <p className="mt-4 text-sm text-purple-200">Entdecke unsere Team-Ebenen und klicke auf ein Profil, um mehr zu erfahren.</p>
   <div className="mx-auto mt-6 w-fit rounded-full border border-violet-400/30 bg-[#170f2a]/80 px-5 py-2 text-sm font-semibold text-violet-100">{team.length} {team.length===1?"Teammitglied":"Teammitglieder"} · {groups.length} {groups.length===1?"Ebene":"Ebenen"}</div>
  </header>
  {team.length===0?<p className="glass mx-auto mt-12 max-w-xl p-8 text-center text-slate-300">Unser Team wird hier bald vorgestellt.</p>:
  <section className="sky-skilltree relative mx-auto mt-14 max-w-6xl rounded-3xl border border-purple-400/25 bg-[#0c091b]/80 px-3 py-12 shadow-2xl shadow-black/40 sm:px-8" aria-label="Team-Skilltree">
   <div className="sky-skilltree-spine" aria-hidden="true"/>
   {groups.map((group,g)=><div key={group.tier} className="sky-skilltree-level relative z-10 flex flex-col items-center">
    {g>0&&<div className="sky-skilltree-connector" aria-hidden="true"><span>✦</span></div>}
    <div className="relative z-10 mb-7 flex items-center gap-3 rounded-full border border-purple-300/40 bg-[#211238] px-5 py-2 shadow-[0_0_22px_#a855f744]">
     <span className="text-lg text-amber-200" aria-hidden="true">{tierIcons[group.tier]}</span>
     <h2 className="text-sm font-black uppercase tracking-widest text-purple-100 sm:text-base">{group.title}</h2>
    </div>
    <div className="flex w-full flex-wrap items-stretch justify-center gap-4 sm:gap-6">
     {group.members.map(({member,index})=><Link href={`/team/${index}`} key={index} className="sky-skilltree-node focus-ring group relative flex w-[calc(50%-8px)] min-w-0 max-w-[230px] flex-col items-center rounded-2xl border border-purple-400/40 bg-gradient-to-b from-[#2a1748] to-[#110d26] px-3 py-6 text-center shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300/80 hover:shadow-[0_0_35px_#a855f766] sm:w-52">
      <span className="absolute -top-3 rounded-full border border-purple-300/50 bg-[#201137] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-200">Level {group.tier+1}</span>
      <span className="sky-skilltree-avatar mt-2 flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-2 border-fuchsia-300/70 bg-purple-900/60 text-4xl shadow-[0_0_24px_#c084fc66] sm:h-24 sm:w-24">
       {member.avatar?<img src={member.avatar} alt={`Profilbild von ${member.name}`} className="h-full w-full object-cover" referrerPolicy="no-referrer"/>:<span aria-hidden="true">👤</span>}
      </span>
      <span className="mt-4 w-full break-words text-lg font-black text-white">{member.name}</span>
      <span className="mt-2 max-w-full break-words rounded-full border border-fuchsia-300/30 bg-fuchsia-400/10 px-3 py-1 text-xs font-bold text-fuchsia-200">{member.role}</span>
      <span className="mt-auto pt-5 text-xs font-bold text-cyan-200 group-hover:text-white">Profil ansehen →</span>
     </Link>)}
    </div>
   </div>)}
  </section>}
 </main>;
}
