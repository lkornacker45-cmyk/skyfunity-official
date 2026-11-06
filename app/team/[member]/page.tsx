import Link from "next/link";
import {notFound} from "next/navigation";
import {getContent} from "@/lib/content";
export const dynamic="force-dynamic";
export default async function MemberProfile({params}:{params:{member:string}}){
 const {team}=await getContent();
 if(!/^(0|[1-9][0-9]*)$/.test(params.member))notFound();
 const index=Number(params.member);
 if(!Number.isSafeInteger(index)||index>=team.length)notFound();
 const member=team[index];
 const previousIndex=(index-1+team.length)%team.length;
 const nextIndex=(index+1)%team.length;
 return <div className="mx-auto max-w-4xl px-5 py-16">
 <Link href="/team" className="focus-ring text-sm font-semibold text-purple-300 hover:text-white">← Zurück zum Team</Link>
 <article className="glass mt-8 overflow-hidden border border-cyan-300/25 p-0 shadow-2xl shadow-purple-950/40">
 <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/90 via-[#21103b] to-[#102b3d] p-7 md:p-12"><div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl"/>
 <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-center">
 <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-2 border-cyan-300/40 bg-purple-800/30 text-6xl shadow-[0_0_45px_#a855f744]">
 {member.avatar?<img src={member.avatar} alt={`Profilbild von ${member.name}`} className="h-full w-full object-cover" referrerPolicy="no-referrer"/>:"👤"}
 </div>
 <div><p className="section-label">SkyFunity Teammitglied</p><h1 className="mt-3 break-words text-4xl font-black text-white md:text-5xl">{member.name}</h1><p className="mt-4 inline-block rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-5 py-2 text-lg font-bold text-fuchsia-200">✦ {member.role}</p></div>
 </div>
 </div>
 <div className="space-y-8 p-7 md:p-12">
 <section><h2 className="text-2xl font-black text-white">Über mich</h2><p className="mt-3 whitespace-pre-wrap break-words leading-8 text-slate-300">{member.bio?.trim()||"Dieses Teammitglied hat noch keine Vorstellung hinterlegt."}</p></section>
 {member.tasks?.trim()&&<section><h2 className="text-xl font-bold text-white">Meine Aufgaben</h2><p className="mt-3 whitespace-pre-wrap break-words text-slate-300">{member.tasks}</p></section>}
 {member.since?.trim()&&<section><h2 className="text-xl font-bold text-white">Im Team seit</h2><p className="mt-3 text-slate-300">{member.since}</p></section>}
 </div></article>
 {team.length>1&&<nav aria-label="Zwischen Teammitgliedern wechseln" className="mt-6 grid grid-cols-2 gap-3">
 <Link href={`/team/${previousIndex}`} rel="prev" className="focus-ring flex items-center gap-3 rounded-2xl border border-purple-400/30 bg-purple-950/50 px-4 py-4 text-left text-white transition hover:border-purple-400 hover:bg-purple-800/40 sm:px-6"><span aria-hidden="true" className="text-3xl text-purple-300">←</span><span className="min-w-0"><span className="block text-xs text-purple-300">Vorheriges Mitglied</span><span className="block truncate font-bold">{team[previousIndex].name}</span></span></Link>
 <Link href={`/team/${nextIndex}`} rel="next" className="focus-ring flex items-center justify-end gap-3 rounded-2xl border border-purple-400/30 bg-purple-950/50 px-4 py-4 text-right text-white transition hover:border-purple-400 hover:bg-purple-800/40 sm:px-6"><span className="min-w-0"><span className="block text-xs text-purple-300">Nächstes Mitglied</span><span className="block truncate font-bold">{team[nextIndex].name}</span></span><span aria-hidden="true" className="text-3xl text-purple-300">→</span></Link>
 </nav>}
 </div>
}
