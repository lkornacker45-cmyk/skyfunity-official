import Link from "next/link";
import type {Metadata} from "next";
export const metadata:Metadata={title:"Ranglisten",description:"Entdecke die SkyFunity-Ranglisten und wähle deine Kategorie."};
const categories=[
 {id:"coins",title:"Coins",icon:"🪙",description:"Wer hat die meisten Coins auf SkyFunity?"},
 {id:"gems",title:"Gems",icon:"💎",description:"Die reichsten Spieler nach Gems."},
 {id:"jobs",title:"Jobs",icon:"🛠️",description:"Die höchsten Job-Level im Netzwerk."},
 {id:"funitys",title:"Funitys",icon:"✨",description:"Wer führt bei den Funitys?"},
 {id:"spielzeit",title:"Spielzeit",icon:"⏱️",description:"Unsere aktivsten Spieler."},
 {id:"votes",title:"Votes",icon:"🗳️",description:"Wer unterstützt SkyFunity mit den meisten Votes?"}
] as const;
export default function RanglistenPage(){return <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
 <header className="mx-auto mb-12 max-w-3xl text-center">
  <p className="text-xs font-extrabold uppercase tracking-[.25em] text-purple-300">✦ SkyFunity Netzwerk ✦</p>
  <h1 className="mt-5 text-4xl font-black text-white sm:text-6xl">🏆 Unsere <span className="text-purple-400">Ranglisten</span></h1>
  <p className="mt-5 text-lg text-slate-300">Wer gehört zu den Besten auf SkyFunity? Entdecke unsere Top-Spieler in verschiedenen Kategorien. Wähle eine Rangliste aus, um die Top 10 zu sehen.</p>
 </header>
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
  {categories.map(category=><Link key={category.id} href={`/ranglisten/${category.id}`} className="glass group flex flex-col items-start rounded-2xl border border-purple-300/25 p-6 transition-all hover:-translate-y-1 hover:border-cyan-300/70 hover:shadow-[0_0_28px_#a855f733]">
   <span aria-hidden="true" className="mb-4 text-4xl">{category.icon}</span>
   <h2 className="text-2xl font-black text-white">{category.title}</h2>
   <p className="mt-2 flex-1 text-sm leading-6 text-slate-300">{category.description}</p>
   <span className="mt-5 text-sm font-bold text-cyan-200 group-hover:text-white">Top 10 ansehen →</span>
  </Link>)}
 </div>
 <p className="mt-10 text-center text-sm text-slate-400">Die Ranglisten zeigen echte Daten, sobald die entsprechenden Datenquellen verbunden sind.</p>
 </main>}
