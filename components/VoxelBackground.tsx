"use client";
import {useEffect,useState} from "react";
import type {CSSProperties} from "react";

type Palette={sky:string;horizon:string;mountain:string;hill:string;ground:string;grass:string;trunk:string;leaf:string;accent:string;light:string;night?:boolean;snow?:boolean;trees?:boolean};
const worlds:Record<string,Palette>={
 minecraft:{sky:"#172f57",horizon:"#755b91",mountain:"#536477",hill:"#305e55",ground:"#243b31",grass:"#5a9652",trunk:"#604631",leaf:"#37784b",accent:"#a3c96d",light:"#f8d8a1",trees:true},
 halloween:{sky:"#1c1035",horizon:"#6b2e59",mountain:"#47334f",hill:"#3c3447",ground:"#201b2c",grass:"#48543b",trunk:"#342637",leaf:"#51324c",accent:"#f18a36",light:"#f6bd79",night:true,trees:true},
 christmas:{sky:"#102e48",horizon:"#55778c",mountain:"#6b8295",hill:"#577b81",ground:"#29454c",grass:"#c2e8e7",trunk:"#524c4d",leaf:"#386e63",accent:"#f4cf7b",light:"#f6f6e9",snow:true,trees:true},
 easter:{sky:"#344c83",horizon:"#ad88b3",mountain:"#8c8daa",hill:"#6a987e",ground:"#3c755d",grass:"#a7d993",trunk:"#755b66",leaf:"#78bd8b",accent:"#f5b1db",light:"#fff1c1",trees:true},
 winter:{sky:"#15324e",horizon:"#6289aa",mountain:"#7796b0",hill:"#5a7c95",ground:"#304c63",grass:"#d0e9f1",trunk:"#5d6068",leaf:"#477787",accent:"#a9dbff",light:"#e8f5ff",snow:true,trees:true},
 summer:{sky:"#14527c",horizon:"#e6a276",mountain:"#547d84",hill:"#3b866c",ground:"#27634e",grass:"#8bc66b",trunk:"#6a4b2c",leaf:"#36865a",accent:"#f7dc73",light:"#fff0a7",trees:true},
 autumn:{sky:"#3a344e",horizon:"#b16e67",mountain:"#75636c",hill:"#786451",ground:"#453b30",grass:"#9b7846",trunk:"#61422e",leaf:"#ba6838",accent:"#e9a94e",light:"#ffcf94",trees:true},
 nether:{sky:"#2a0915",horizon:"#8a2329",mountain:"#622028",hill:"#4c1823",ground:"#310e18",grass:"#a53a2a",trunk:"#4d1927",leaf:"#9c372c",accent:"#ff7b2f",light:"#ff9b59",night:true},
 end:{sky:"#0d1025",horizon:"#41385d",mountain:"#51496b",hill:"#37304d",ground:"#242038",grass:"#746e91",trunk:"#332e43",leaf:"#7661a6",accent:"#b8a3ff",light:"#d9c7ff",night:true},
 cave:{sky:"#091725",horizon:"#174354",mountain:"#1d3444",hill:"#1c2b38",ground:"#101f2c",grass:"#315b67",trunk:"#273945",leaf:"#2f6870",accent:"#65d6e3",light:"#9defff",night:true},
 newyear:{sky:"#0e1736",horizon:"#3b3d75",mountain:"#353f69",hill:"#29385a",ground:"#1c2b48",grass:"#5a638b",trunk:"#343a56",leaf:"#536b8c",accent:"#f9c866",light:"#ffe7a4",night:true,trees:true},
 skyblock:{sky:"#195476",horizon:"#7799b7",mountain:"#8ba7b3",hill:"#537c79",ground:"#385c53",grass:"#7bbf72",trunk:"#6b4c34",leaf:"#4e9866",accent:"#e1e8b0",light:"#fbe4ad",trees:true}
};
function Blocks({fill,y,step=28}:{fill:string;y:number;step?:number}){return <g fill={fill}>{Array.from({length:48},(_,i)=><rect key={i} x={i*step-10} y={y+((i*7)%4)*9} width={step+1} height={180}/>)}</g>}
function Tree({x,y,s=1,p,snow=false}:{x:number;y:number;s?:number;p:Palette;snow?:boolean}){return <g transform={`translate(${x} ${y}) scale(${s})`} shapeRendering="crispEdges"><rect x="-8" y="-22" width="16" height="69" fill={p.trunk}/><rect x="-33" y="-83" width="66" height="40" fill={p.leaf}/><rect x="-43" y="-57" width="86" height="34" fill={p.leaf}/><rect x="-24" y="-103" width="48" height="26" fill={p.leaf}/><rect x="-33" y="-83" width="17" height="17" fill={p.grass} opacity=".3"/>{snow&&<><rect x="-24" y="-103" width="48" height="9" fill={p.grass}/><rect x="-33" y="-83" width="66" height="8" fill={p.grass}/><rect x="-43" y="-57" width="86" height="7" fill={p.grass}/></>}</g>}
export default function VoxelBackground({preset}:{preset:string}){
 const [world,style="shader"]=preset.split(/-(?=shader$|nature$|fantasy$)/);
 const p=worlds[world]||worlds.minecraft;
 const photos:Record<string,string>={
 minecraft:"photo-1441974231531-c6227db76b6e",
 halloween:"photo-1511497584788-876760111969",
 christmas:"photo-1457269449834-928af64c684d",
 easter:"photo-1490750967868-88aa4486c946",
 winter:"photo-1457269449834-928af64c684d",
 summer:"photo-1500534623283-312aade485b7",
 autumn:"photo-1473448912268-2022ce9509d8",
 nether:"photo-1500530855697-b586d89ba3ee",
 end:"photo-1470770841072-f978cf4d019e",
 cave:"photo-1519681393784-d120267933ba",
 newyear:"photo-1519681393784-d120267933ba",
 skyblock:"photo-1500534623283-312aade485b7"
 };
 const photoUrl="https://images.unsplash.com/"+photos[world]+"?auto=format&fit=crop&w=1920&q=82";
 const [offset,setOffset]=useState(0);
 useEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let frame=0;const onScroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>setOffset(Math.min(window.scrollY,4500)))};onScroll();window.addEventListener("scroll",onScroll,{passive:true});return()=>{window.removeEventListener("scroll",onScroll);cancelAnimationFrame(frame)}},[]);
 const stars=p.night||world==="christmas";
 return <div className="voxel-scene voxel-landscape" aria-hidden="true" data-voxel={world} data-voxel-style={style} style={{background:p.sky}}>
 <div className="voxel-photo" style={{backgroundImage:`url("${photoUrl}")`,"--photo-scroll":`${Math.min(offset*.045,170)}px`} as CSSProperties}/><div className="voxel-panorama">
 <svg className="voxel-layer voxel-sky" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" style={{transform:`translate3d(0,${offset*.035}px,0)`}}>
 <defs><linearGradient id="voxel-sky-gradient" x1="0" y1="0" x2="0" y2="1"><stop stopColor={p.sky}/><stop offset="1" stopColor={p.horizon}/></linearGradient></defs>
 <rect width="1200" height="700" fill="url(#voxel-sky-gradient)"/>
 {stars&&Array.from({length:46},(_,i)=><rect key={i} x={(i*137+29)%1200} y={(i*71+11)%380} width={i%5===0?4:2} height={i%5===0?4:2} fill={p.light} opacity={.3+(i%5)*.13}/>)}
 <rect x={world==="halloween"?900:780} y="100" width="90" height="90" fill={p.light} opacity=".85"/>
 {world==="halloween"&&<rect x="828" y="110" width="90" height="90" fill={p.sky} opacity=".95"/>}
 {Array.from({length:6},(_,i)=><g key={i} fill={p.light} opacity=".14"><rect x={(i*251+90)%1200} y={140+(i%3)*62} width="120" height="28"/><rect x={(i*251+112)%1200} y={120+(i%3)*62} width="70" height="22"/></g>)}
 </svg>
 <svg className="voxel-layer voxel-far" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" style={{transform:`translate3d(0,${offset*.085}px,0)`}}>
 <path d="M0 500 L0 390 L105 390 L105 355 L165 355 L165 300 L245 300 L245 350 L315 350 L315 420 L395 420 L395 365 L475 365 L475 310 L550 310 L550 265 L610 265 L610 340 L690 340 L690 390 L765 390 L765 330 L840 330 L840 285 L910 285 L910 355 L1010 355 L1010 395 L1100 395 L1100 340 L1200 340 L1200 700 L0 700Z" fill={p.mountain}/>
 <path d="M0 530 H90 V475 H165 V450 H260 V490 H365 V420 H440 V465 H540 V430 H650 V480 H735 V415 H815 V445 H910 V400 H1020 V460 H1100 V425 H1200 V700 H0Z" fill={p.hill}/>
 {p.snow&&<path d="M165 300 H245 V323 H165Z M550 265 H610 V290 H550Z M840 285 H910 V308 H840Z" fill={p.grass}/>}
 </svg>
 <svg className="voxel-layer voxel-mid" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" style={{transform:`translate3d(0,${-offset*.065}px,0)`}} shapeRendering="crispEdges">
 <path d="M0 700 V545 H95 V510 H200 V535 H300 V490 H405 V530 H500 V480 H610 V515 H720 V465 H810 V505 H920 V470 H1010 V525 H1110 V490 H1200 V700Z" fill={p.ground}/>
 <path d="M0 545 H95 V510 H200 V535 H300 V490 H405 V530 H500 V480 H610 V515 H720 V465 H810 V505 H920 V470 H1010 V525 H1110 V490 H1200" fill="none" stroke={p.grass} strokeWidth="18" strokeLinejoin="miter"/>
 {p.trees&&[70,220,365,530,690,840,1030,1150].map((x,i)=><Tree key={x} x={x} y={505+(i%3)*19} s={.62+(i%3)*.17} p={p} snow={p.snow}/>)}
 {world==="halloween"&&[175,780,1050].map((x,i)=><g key={x}><rect x={x} y={538+i*6} width="35" height="31" fill={p.accent}/><rect x={x+13} y={530+i*6} width="8" height="10" fill={p.trunk}/><rect x={x+7} y={548+i*6} width="5" height="6" fill={p.sky}/><rect x={x+23} y={548+i*6} width="5" height="6" fill={p.sky}/></g>)}
 {world==="easter"&&[140,460,935].map((x,i)=><g key={x}><rect x={x} y={540+i*8} width="18" height="25" fill={i===1?"#f4d5a8":p.accent}/><rect x={x+4} y={548+i*8} width="10" height="5" fill="#e9f3bb"/></g>)}
 {world==="nether"&&[160,580,980].map(x=><path key={x} d={`M${x} 700 V540 H${x+28} V700Z`} fill={p.accent} opacity=".7"/>)}
 {world==="end"&&[250,750,1050].map(x=><g key={x}><rect x={x} y="420" width="30" height="130" fill="#171326"/><rect x={x+9} y="430" width="5" height="5" fill={p.accent}/></g>)}
 {world==="cave"&&[180,560,970].map(x=><g key={x} fill={p.accent}><path d={`M${x} 545 l22 -60 22 60Z`}/></g>)}
 </svg>
 <svg className="voxel-layer voxel-near" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" style={{transform:`translate3d(0,${-offset*.14}px,0)`}} shapeRendering="crispEdges">
 <path d="M0 700 V640 H130 V615 H265 V650 H420 V615 H590 V660 H740 V625 H900 V650 H1030 V610 H1200 V700Z" fill={p.ground}/>
 <path d="M0 640 H130 V615 H265 V650 H420 V615 H590 V660 H740 V625 H900 V650 H1030 V610 H1200" stroke={p.grass} strokeWidth="18" fill="none"/>
 {p.trees&&<><Tree x={35} y={648} s={1.5} p={p} snow={p.snow}/><Tree x={1150} y={628} s={1.6} p={p} snow={p.snow}/></>}
 </svg>
 </div>
 <div className="voxel-vignette"/>
 </div>
}
