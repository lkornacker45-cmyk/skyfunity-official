"use client";
import {useRef,useState} from "react";
type Member={name:string;role:string;avatar?:string;treeX?:number;treeY?:number};
export default function SkilltreePositionEditor({members,onChange}:{members:Member[];onChange:(index:number,x:number,y:number)=>void}){
 const area=useRef<HTMLDivElement>(null);
 const [active,setActive]=useState<number|null>(null);
 function coords(i:number){const m=members[i];return {x:m.treeX??(20+(i%4)*20),y:m.treeY??Math.min(90,12+Math.floor(i/4)*19)}}
 function move(e:React.PointerEvent<HTMLButtonElement>,i:number){
  const rect=area.current?.getBoundingClientRect();if(!rect)return;
  const x=Math.round(Math.max(6,Math.min(94,(e.clientX-rect.left)/rect.width*100)));
  const y=Math.round(Math.max(7,Math.min(93,(e.clientY-rect.top)/rect.height*100)));
  onChange(i,x,y);
 }
 return <div className="space-y-3">
  <p className="text-sm text-slate-300">Ziehe die Köpfe frei an die gewünschte Position. Auf dem Handy funktioniert das mit dem Finger. Anschließend unten <strong>Alle Änderungen speichern</strong> klicken.</p>
  <div ref={area} className="relative h-[420px] touch-none overflow-hidden rounded-2xl border border-purple-400/40 bg-[#0e0921] sm:h-[550px]" aria-label="Team-Skilltree frei anordnen">
   <div className="pointer-events-none absolute inset-0 opacity-25" style={{backgroundImage:"linear-gradient(#a78bfa44 1px,transparent 1px),linear-gradient(90deg,#a78bfa44 1px,transparent 1px)",backgroundSize:"10% 10%"}}/>
   <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{members.slice(1).map((_,i)=>{const a=coords(i),b=coords(i+1);return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#c084fc" strokeWidth=".35" opacity=".65"/>})}</svg>
   {members.map((m,i)=>{const p=coords(i);return <button key={i} type="button" style={{left:p.x+"%",top:p.y+"%",touchAction:"none"}} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);setActive(i);move(e,i)}} onPointerMove={e=>{if(active===i&&e.buttons)move(e,i)}} onPointerUp={()=>setActive(null)} onPointerCancel={()=>setActive(null)} className="absolute z-10 flex w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-xl border border-purple-300/60 bg-[#2b184b] p-2 text-center shadow-[0_0_15px_#a855f766] cursor-grab active:cursor-grabbing sm:w-24" aria-label={m.name+" verschieben"}>
    <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-purple-900 text-xl">{m.avatar?<img src={m.avatar} alt="" className="h-full w-full object-cover"/>:"👤"}</span>
    <span className="w-full truncate text-[10px] font-bold text-white">{m.name}</span>
   </button>})}
  </div>
  <p className="text-xs text-slate-400">Die Linien verbinden die Mitglieder in ihrer Listenreihenfolge. Du kannst Positionen jederzeit wieder verändern.</p>
  <div className="flex flex-wrap gap-2"><button type="button" className="rounded-lg border border-purple-400/40 px-4 py-2 text-sm text-purple-100" onClick={()=>members.forEach((_,i)=>onChange(i,20+(i%4)*20,Math.min(90,12+Math.floor(i/4)*19)))}>Gleichmäßig anordnen</button></div>
 </div>;
}
