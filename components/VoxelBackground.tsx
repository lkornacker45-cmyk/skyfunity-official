"use client";
import {useEffect,useState} from "react";
const sets:Record<string,string[]>={minecraft:["🟩","🟫","🌳","⛏️","🧱","💎"],halloween:["🎃","🟪","👻","🕸️","🧱","🦇"],christmas:["🎄","❄️","🎁","🧊","🌲","⛄"],easter:["🐣","🥚","🌷","🟩","🐰","🌼"],winter:["❄️","🧊","🌲","⛄","💎","🧱"],summer:["🌴","🌻","🟩","☀️","🌳","💧"],autumn:["🍂","🍁","🎃","🟫","🌳","🍄"],nether:["🔥","🟥","🧱","🌋","💀","🟠"],end:["🟪","✨","💜","🪨","🌌","💎"],cave:["💎","🪨","⛏️","🧱","🔮","🟫"],newyear:["🎆","✨","🎇","💎","🟪","⭐"],skyblock:["☁️","🟩","🌳","🧱","💎","☁️"]};
export default function VoxelBackground({preset}:{preset:string}){
 const [scroll,setScroll]=useState(0);
 useEffect(()=>{let raf=0;const update=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>setScroll(window.scrollY))};window.addEventListener("scroll",update,{passive:true});return()=>{window.removeEventListener("scroll",update);cancelAnimationFrame(raf)}},[]);
 const symbols=sets[preset]||sets.minecraft;
 return <div aria-hidden="true" className="voxel-scene" data-voxel={preset}>
 <div className="voxel-horizon" style={{transform:`translate3d(0,${Math.min(scroll*.12,180)}px,0)`}}/>
 {Array.from({length:28},(_,i)=>{const depth=i%4;const x=(i*37+13)%100;const y=(i*29+7)%100;return <span key={i} className={`voxel-item voxel-depth-${depth}`} style={{left:`${x}%`,top:`${y}%`,fontSize:`${22+depth*11}px`,opacity:.12+depth*.08,transform:`translate3d(0,${-scroll*(.03+depth*.08)}px,0) rotate(${(i%5-2)*10}deg)`}}>{symbols[i%symbols.length]}</span>})}
 </div>
}
