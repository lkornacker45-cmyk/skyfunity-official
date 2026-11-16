"use client";
import {useEffect,useState} from "react";

type Partner={name:string;description:string;url:string;logo?:string;status:"active"|"planned"};
export default function PartnerSideAds({partners}:{partners:Partner[]}){
 const active=partners.filter(p=>p.status==="active"&&/^https:\/\//i.test(p.url));
 const [index,setIndex]=useState(0);
 const [hidden,setHidden]=useState(false);
 useEffect(()=>{if(active.length<2)return;const timer=window.setInterval(()=>setIndex(i=>(i+1)%active.length),9000);return()=>window.clearInterval(timer)},[active.length]);
 if(!active.length||hidden)return null;
 const left=active[index%active.length],right=active[(index+1)%active.length];
 function Card({partner}:{partner:Partner}){return <div className="sky-partner-ad-card"><div className="sky-partner-ad-label">WERBUNG · PARTNER</div>{partner.logo&&<img src={partner.logo} alt={partner.name+" Logo"} className="sky-partner-ad-logo" loading="lazy" referrerPolicy="no-referrer"/>}<strong className="sky-partner-ad-name">{partner.name}</strong><a className="sky-partner-ad-link" href={partner.url} target="_blank" rel="noopener noreferrer sponsored">Partner besuchen ↗</a></div>}
 return <aside className="sky-partner-ad-rails" aria-label="Werbung unserer Partner"><div className="sky-partner-ad-side sky-partner-ad-left"><Card partner={left}/></div>{active.length>1&&<div className="sky-partner-ad-side sky-partner-ad-right"><Card partner={right}/></div>}<button type="button" className="sky-partner-ad-close" onClick={()=>setHidden(true)} aria-label="Partnerwerbung schließen" title="Partnerwerbung schließen">×</button></aside>
}
