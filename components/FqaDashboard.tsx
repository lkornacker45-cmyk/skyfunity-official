"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {BookOpen,ChevronDown,ChevronRight,CircleHelp,Compass,Gamepad2,Coins,Trophy,LifeBuoy,Search,Send,Sparkles,X} from "lucide-react";
import {fqaCategories,getFqaCategory,type FqaCategory,type FqaEntry} from "@/lib/fqa";
const categoryInfo=[
 {id:"Alle Fragen",icon:BookOpen,description:"Alle Antworten auf einen Blick"},
 {id:"Allgemein",icon:CircleHelp,description:"Wissenswertes über SkyFunity"},
 {id:"Erste Schritte",icon:Compass,description:"Dein Start auf dem Server"},
 {id:"Gameplay",icon:Gamepad2,description:"Spielmodi und Befehle"},
 {id:"Wirtschaft",icon:Coins,description:"Coins, Gems und mehr"},
 {id:"Ranglisten",icon:Trophy,description:"Deine Platzierungen"},
 {id:"Technik & Support",icon:LifeBuoy,description:"Verbindung und Hilfe"}
] as const;
type Filter="Alle Fragen"|FqaCategory;
export default function FqaDashboard({items,discord}:{items:FqaEntry[];discord:string}){
 const [search,setSearch]=useState("");
 const [category,setCategory]=useState<Filter>("Alle Fragen");
 const [opened,setOpened]=useState<number|null>(null);
 const term=search.trim().toLocaleLowerCase("de");
 const result=useMemo(()=>items.map((item,index)=>({...item,index,group:getFqaCategory(item)})).filter(item=>(category==="Alle Fragen"||item.group===category)&&(!term||(item.question+" "+item.answer).toLocaleLowerCase("de").includes(term))),[items,term,category]);
 return <div className="sky-fqa-dashboard mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
  <header className="sky-fqa-hero relative overflow-hidden rounded-[2rem] border border-cyan-300/25 px-6 py-10 sm:px-10 sm:py-12">
   <div className="sky-fqa-hero-glow" aria-hidden="true"/>
   <div className="relative z-10 max-w-3xl">
    <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[.24em] text-cyan-200"><Sparkles size={15}/> SkyFunity Support Center</p>
    <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">Wie können wir <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">dir helfen?</span></h1>
    <p className="mt-4 max-w-xl leading-relaxed text-slate-200">Hier findest du Antworten auf deine Fragen zu SkyFunity – einfach suchen oder ein Thema auswählen.</p>
    <label className="sky-fqa-search mt-8 flex items-center gap-3 rounded-2xl border border-white/20 bg-[#110f2b]/85 px-4 py-4 focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-300/25">
     <Search className="shrink-0 text-cyan-300" size={22}/>
     <span className="sr-only">Fragen durchsuchen</span>
     <input type="search" value={search} onChange={e=>{setSearch(e.target.value);setOpened(null)}} placeholder="Wonach suchst du? z. B. Grundstück, Coins, Bedrock ..." className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-400 sm:text-base"/>
     {search&&<button type="button" onClick={()=>setSearch("")} className="rounded-lg p-1 text-slate-200 hover:text-white" aria-label="Suche löschen"><X size={19}/></button>}
    </label>
    <p className="mt-3 text-xs font-medium text-slate-300">{items.length} Fragen im Hilfe-Center · Antworten direkt vom SkyFunity-Team</p>
   </div>
   <div className="sky-fqa-orb" aria-hidden="true"><span>?</span></div>
  </header>
  <div className="mt-8 grid items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
   <aside className="sky-fqa-sidebar rounded-3xl border border-purple-300/25 p-4 lg:sticky lg:top-28" aria-label="Hilfethemen">
    <div className="px-3 pb-3 pt-2"><h2 className="text-sm font-black uppercase tracking-[.16em] text-purple-200">Themen entdecken</h2><p className="mt-1 text-xs text-slate-400">Wähle eine Kategorie</p></div>
    <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1" aria-label="FQA-Kategorien">
     {categoryInfo.map(info=>{const Icon=info.icon;const active=category===info.id;const count=info.id==="Alle Fragen"?items.length:items.filter(item=>getFqaCategory(item)===info.id).length;return <button type="button" key={info.id} aria-pressed={active} onClick={()=>{setCategory(info.id);setOpened(null)}} className={`sky-fqa-category flex min-w-0 items-center gap-2 rounded-xl px-3 py-3 text-left transition-colors ${active?"sky-fqa-category-active text-white":"text-slate-300 hover:bg-purple-400/10 hover:text-white"}`}><Icon size={18} className={active?"text-cyan-200":"text-purple-300"}/><span className="min-w-0 flex-1 text-xs font-bold sm:text-sm">{info.id}</span><span className="text-xs tabular-nums text-slate-400">{count}</span></button>})}
    </nav>
    <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4"><LifeBuoy className="text-cyan-300" size={23}/><h3 className="mt-3 text-base font-black text-white">Noch Fragen?</h3><p className="mt-2 text-sm text-slate-300">Unser Team hilft dir auf Discord gerne weiter.</p><a href={discord} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-purple-500"><Send size={15}/> Discord öffnen</a></div>
   </aside>
   <main className="min-w-0">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Wissensdatenbank</p><h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">{category}</h2></div><span role="status" aria-live="polite" className="rounded-full border border-purple-300/30 bg-purple-950/50 px-4 py-2 text-xs font-semibold text-purple-100">{result.length} {result.length===1?"Ergebnis":"Ergebnisse"}</span></div>
    {result.length>0?<div className="space-y-3">{result.map(item=>{const isOpen=opened===item.index;return <article key={item.index} className={`sky-fqa-question overflow-hidden rounded-2xl border transition-all ${isOpen?"border-cyan-300/60 shadow-[0_0_30px_#67e8f925]":"border-purple-300/25"}`}><h3><button type="button" aria-expanded={isOpen} aria-controls={`fqa-answer-${item.index}`} onClick={()=>setOpened(isOpen?null:item.index)} className="flex w-full items-center gap-3 px-5 py-5 text-left sm:px-6 sm:py-6"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-sm font-black text-cyan-300">{String(item.index+1).padStart(2,"0")}</span><span className="min-w-0 flex-1"><span className="block text-base font-bold text-white sm:text-lg">{item.question}</span><span className="mt-1 block text-xs text-purple-200">{item.group}</span></span><ChevronDown className={`shrink-0 text-purple-200 transition-transform duration-200 ${isOpen?"rotate-180 text-cyan-300":""}`} size={20}/></button></h3>{isOpen&&<div id={`fqa-answer-${item.index}`} className="sky-fqa-answer whitespace-pre-wrap border-t border-purple-300/20 px-5 pb-6 pt-5 leading-7 text-slate-200 sm:px-6">{item.answer}</div>}</article>})}</div>:<div className="sky-fqa-question rounded-2xl border border-purple-300/25 p-9 text-center"><Search size={34} className="mx-auto text-purple-300"/><h3 className="mt-4 text-xl font-bold text-white">{items.length===0?"Noch keine Fragen hinterlegt":"Keine passenden Fragen gefunden"}</h3><p className="mt-2 text-sm text-slate-300">{items.length===0?"Unser Team ergänzt hier bald Antworten.":"Versuche einen anderen Suchbegriff oder wähle alle Fragen."}</p><button type="button" onClick={()=>{setSearch("");setCategory("Alle Fragen")}} className="mt-5 rounded-xl border border-cyan-300/40 px-4 py-2 text-sm font-bold text-cyan-200">Alle Fragen anzeigen</button></div>}
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-300/20 bg-[#1a1031]/70 px-5 py-4 text-sm text-slate-300"><span>Entdecke auch die SkyFunity-Ranglisten.</span><Link href="/ranglisten" className="inline-flex items-center gap-1 font-bold text-cyan-200 hover:text-white">Zu den Ranglisten <ChevronRight size={16}/></Link></div>
   </main>
  </div>
 </div>
}
