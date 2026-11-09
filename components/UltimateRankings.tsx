"use client";
import {useCallback,useRef,useState} from "react";
import Link from "next/link";

const categories=[
 {id:"coins",title:"Coins",icon:"🪙",description:"Die reichsten Spieler",tone:"gold"},
 {id:"gems",title:"Gems",icon:"💎",description:"Die meisten Gems",tone:"cyan"},
 {id:"jobs",title:"Jobs",icon:"🛠️",description:"Die höchsten Job-Level",tone:"violet"},
 {id:"funitys",title:"Funitys",icon:"✨",description:"Die meisten Funitys",tone:"pink"},
 {id:"spielzeit",title:"Spielzeit",icon:"⏱️",description:"Die längste Spielzeit",tone:"mint"},
 {id:"votes",title:"Votes",icon:"🗳️",description:"Die meisten Votes",tone:"orange"}
] as const;
export default function UltimateRankings(){
 const [tilt,setTilt]=useState({x:0,y:0});
 const [active,setActive]=useState("gems");
 const [paused,setPaused]=useState(false);
 const pointer=useRef<number|null>(null);
 const move=useCallback((x:number,y:number,rect:DOMRect)=>{
  const nx=Math.max(-1,Math.min(1,(x-rect.left)/rect.width*2-1));
  const ny=Math.max(-1,Math.min(1,(y-rect.top)/rect.height*2-1));
  setTilt({x:-ny*10,y:nx*14});
 },[]);
 const current=categories.find(c=>c.id===active)||categories[1];
 return <div className="sky-ultimate">
  <header className="sky-ultimate-heading">
   <p>✦ SKYFUNITY NETWORK // HOLOGRAPHIC EDITION ✦</p>
   <h1>🏆 Unsere <span>Ranglisten</span></h1>
   <p className="sky-ultimate-intro">Erkunde die sechs Ranglisten in einer interaktiven 3D-Welt. Ziehe die Szene mit Maus oder Finger und wähle eine Kategorie.</p>
  </header>
  <section className="sky-ultimate-stage" aria-label="Interaktive holografische 3D-Ranglistenwelt"
   onPointerDown={e=>{if((e.target as HTMLElement).closest("a,button"))return;pointer.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);setPaused(true);}}
   onPointerMove={e=>{if(pointer.current===e.pointerId)move(e.clientX,e.clientY,e.currentTarget.getBoundingClientRect());}}
   onPointerUp={e=>{if(pointer.current===e.pointerId){pointer.current=null;setPaused(false);}}}
   onPointerCancel={()=>{pointer.current=null;setPaused(false);}}
   onPointerLeave={()=>{if(pointer.current===null)setTilt({x:0,y:0});}}>
   <div className="sky-ultimate-stars" aria-hidden="true"/>
   <div className="sky-ultimate-scene" style={{transform:`rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`}}>
    <div className="sky-ultimate-island" aria-hidden="true">
     <div className="sky-ultimate-island-top"/>
     <div className="sky-ultimate-island-side"/>
     <div className="sky-ultimate-island-bottom"/>
    </div>
    <div className="sky-ultimate-portal" aria-hidden="true"><div className="sky-ultimate-portal-inner"/></div>
    <div className={`sky-ultimate-crystal ${paused?"is-paused":""}`} aria-hidden="true"><div className="sky-ultimate-crystal-core">✦</div></div>
    <div className="sky-ultimate-beam" aria-hidden="true"/>
    <div className="sky-ultimate-podiums" aria-hidden="true">
     <div className="sky-ultimate-podium silver"><span>Ⅱ</span></div>
     <div className="sky-ultimate-podium gold"><span>Ⅰ</span></div>
     <div className="sky-ultimate-podium bronze"><span>Ⅲ</span></div>
    </div>
   </div>
   <div className="sky-ultimate-overlay">
    <span className="sky-ultimate-live">✧ HOLOGRAMM AKTIV</span>
    <div className="sky-ultimate-selected"><span>{current.icon}</span><div><small>AUSGEWÄHLTE KATEGORIE</small><strong>{current.title}</strong></div></div>
    <span className="sky-ultimate-hint">↔ Ziehen zum Drehen</span>
   </div>
  </section>
  <nav className="sky-ultimate-grid" aria-label="Ranglisten-Kategorien">
   {categories.map(c=><Link href={`/ranglisten/${c.id}`} key={c.id} className={`sky-ultimate-card sky-ultimate-${c.tone}`}
    onMouseEnter={()=>setActive(c.id)} onFocus={()=>setActive(c.id)} onTouchStart={()=>setActive(c.id)}>
    <span className="sky-ultimate-card-icon" aria-hidden="true">{c.icon}</span>
    <span className="sky-ultimate-card-title">{c.title}</span>
    <span className="sky-ultimate-card-desc">{c.description}</span>
    <span className="sky-ultimate-card-link">Top 10 ansehen ↗</span>
   </Link>)}
  </nav>
  <p className="sky-ultimate-footer">Die Podeste sind dekorativ. Echte Platzierungen erscheinen in den einzelnen Ranglisten, sobald ihre Datenquellen verbunden sind.</p>
 </div>;
}
