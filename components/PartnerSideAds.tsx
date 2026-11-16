"use client";
import {useEffect,useState} from "react";
type Partner={name:string;description:string;url:string;logo?:string;status:"active"|"planned"};
const aitchSlides=[
 {eyebrow:"SERVER-POWER",title:"AMD EPYC & Ryzen",body:"Leistungsstarke KVM-Server mit AMD EPYC und Ryzen Prozessoren.",icon:"⚡",stats:"KVM · AMD"},
 {eyebrow:"GAME HOSTING",title:"Dein Gameserver",body:"GameServer-Cloud auf leistungsstarker AMD-Hardware – ohne Linux-Vorkenntnisse.",icon:"🎮",stats:"GAME · CLOUD"},
 {eyebrow:"WEB & DOMAINS",title:"Alles für dein Web",body:"Webhosting mit E-Mails und Datenbanken sowie über 450 Domain-Endungen.",icon:"🌐",stats:"WEB · DNS"},
 {eyebrow:"EINFACH VERWALTEN",title:"Alles im Griff",body:"Server, Backups und Statistiken über eine benutzerfreundliche Oberfläche verwalten.",icon:"🛡️",stats:"PANEL · BACKUP"}
];
export default function PartnerSideAds({partners}:{partners:Partner[]}){
 const active=partners.filter(p=>p.status==="active"&&/^https:\/\//i.test(p.url));
 const [step,setStep]=useState(0);
 const [hidden,setHidden]=useState(false);
 useEffect(()=>{if(!active.length)return;const timer=window.setInterval(()=>setStep(i=>i+1),6500);return()=>window.clearInterval(timer)},[active.length]);
 if(!active.length||hidden)return null;
 function Card({partner,side}:{partner:Partner;side:"left"|"right"}){
  const aitch=/^(www\.)?aitch\.systems$/i.test(new URL(partner.url).hostname);
  const slide=aitch?aitchSlides[(step+(side==="right"?2:0))%aitchSlides.length]:null;
  const fallback=partner.description.replace(/\*\*/g,"").replace(/https?:\/\/\S+/g,"").replace(/\s+/g," ").trim().slice(0,150);
  return <div className="sky-partner-premium" key={partner.name+"-"+side}>
   <div className="sky-partner-aura" aria-hidden="true"/><div className="sky-partner-beam" aria-hidden="true"/>
   <div className="sky-partner-ad-label">✦ WERBUNG · SKYFUNITY PARTNER</div>
   {partner.logo&&<img src={partner.logo} alt={partner.name+" Logo"} className="sky-partner-premium-logo" loading="lazy" referrerPolicy="no-referrer"/>}
   <div className="sky-partner-premium-display" aria-hidden="true"><span className="sky-partner-orbit orbit-a"/><span className="sky-partner-orbit orbit-b"/><span className="sky-partner-core">{slide?.icon||"✦"}</span><span className="sky-partner-signal s1"/><span className="sky-partner-signal s2"/><span className="sky-partner-signal s3"/></div>
   <div className="sky-partner-premium-copy" key={step+(side==="right"?2:0)}>
    <span className="sky-partner-premium-eyebrow">{slide?.eyebrow||"UNSER PARTNER"}</span>
    <strong className="sky-partner-premium-title">{slide?.title||partner.name}</strong>
    <p className="sky-partner-premium-body">{slide?.body||fallback||"Entdecke unseren Partner."}</p>
    <div className="sky-partner-premium-meta">{slide?.stats||partner.name}</div>
   </div>
   <div className="sky-partner-premium-progress" aria-hidden="true"><span key={step}/></div>
   <a className="sky-partner-premium-cta" href={partner.url} target="_blank" rel="noopener noreferrer sponsored">Jetzt entdecken <span aria-hidden="true">↗</span></a>
  </div>
 }
 return <aside className="sky-partner-ad-rails" aria-label="Werbung unserer Partner"><div className="sky-partner-ad-side sky-partner-ad-left"><Card partner={active[step%active.length]} side="left"/></div><div className="sky-partner-ad-side sky-partner-ad-right"><Card partner={active[(step+(active.length>1?1:0))%active.length]} side="right"/></div><button type="button" className="sky-partner-ad-close" onClick={()=>setHidden(true)} aria-label="Partnerwerbung schließen" title="Partnerwerbung schließen">×</button></aside>
}
