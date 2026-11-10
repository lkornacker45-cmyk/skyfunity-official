"use client";
import {useEffect,useState} from "react";
import {CheckCircle2,ExternalLink,Link2,Loader2,ShieldCheck,Wallet} from "lucide-react";
type CartItem={id:number;quantity:number};
type AuthLink={name:string;url:string};
type Session={connected?:boolean;username?:string|null;error?:string};
type ResponseData={error?:string;links?:AuthLink[];url?:string;total?:number|null;currency?:string};
const api="/api/store-test";
export default function TebexConnect({items}:{items:CartItem[]}){
 const [session,setSession]=useState<Session|null>(null);
 const [links,setLinks]=useState<AuthLink[]>([]);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState("");
 const [checkout,setCheckout]=useState<{url:string;total:number|null;currency:string}|null>(null);
 useEffect(()=>{let active=true;fetch(api+"/session",{credentials:"same-origin",cache:"no-store"}).then(r=>r.json()).then((d:Session)=>{if(active)setSession(d)}).catch(()=>{if(active)setSession({error:"Sitzung konnte nicht geladen werden."})});return()=>{active=false}},[]);
 const post=async(path:string,data:object)=>{
  const response=await fetch(api+path,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify(data)});
  const json=await response.json() as ResponseData;
  if(!response.ok)throw Error(json.error||"Tebex ist momentan nicht erreichbar.");
  return json;
 };
 const authenticate=async()=>{
  setLoading(true);setError("");setLinks([]);setCheckout(null);
  try{
   const response=await post("/session",{});
   if(!response.links?.length)throw Error("Keine Minecraft-Anmeldelinks verfügbar.");
   setLinks(response.links);
  }catch(e){setError(e instanceof Error?e.message:"Tebex-Anmeldung fehlgeschlagen.");}
  finally{setLoading(false)}
 };
 const prepare=async()=>{
  if(!items.length)return;
  setLoading(true);setError("");setCheckout(null);
  try{
   const response=await post("/checkout",{items});
   if(!response.url)throw Error("Tebex hat keinen Checkout-Link zurückgegeben.");
   setCheckout({url:response.url,total:response.total??null,currency:response.currency||"EUR"});
  }catch(e){setError(e instanceof Error?e.message:"Warenkorb konnte nicht vorbereitet werden.");}
  finally{setLoading(false)}
 };
 return <div className="mt-4 space-y-3">
  {session?.connected?<div className="flex items-start gap-2 rounded-xl border border-emerald-300/35 bg-emerald-300/10 p-3 text-sm text-emerald-100"><CheckCircle2 size={18} className="mt-0.5 shrink-0"/><span>Minecraft-Account über Tebex verbunden: <strong>{session.username}</strong></span></div>:<div className="rounded-xl border border-purple-300/25 bg-purple-300/5 p-3 text-sm text-slate-200">Verbinde deinen Minecraft-Account über Tebex, bevor du zur Kasse gehst. Das Namensfeld auf dieser Seite ist nur eine Formatvorschau.</div>}
  {!session?.connected&&<button type="button" disabled={loading} onClick={()=>void authenticate()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 font-black text-white hover:bg-cyan-500 disabled:opacity-50">{loading?<Loader2 size={18} className="animate-spin"/>:<Link2 size={18}/>} Minecraft über Tebex verbinden</button>}
  {!!links.length&&!session?.connected&&<div className="space-y-2 rounded-xl border border-cyan-300/30 p-3"><p className="text-xs font-bold text-cyan-100">Wähle deine Minecraft-Anmeldung:</p>{links.map((item,i)=><a href={item.url} key={i} rel="nofollow" className="flex items-center justify-between rounded-lg border border-purple-300/30 bg-purple-500/15 p-3 text-sm font-bold text-white hover:bg-purple-500/30">{item.name}<ExternalLink size={16}/></a>)}<p className="text-xs text-slate-400">Nach der Anmeldung gelangst du zu diesem Testshop zurück. Dein Warenkorb bleibt im Browser gespeichert.</p></div>}
  {session?.connected&&<button type="button" disabled={loading||!items.length||!!checkout} onClick={()=>void prepare()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-4 font-black text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50">{loading?<Loader2 className="animate-spin" size={18}/>:<Wallet size={18}/>} Warenkorb bei Tebex vorbereiten</button>}
  {checkout&&<div className="space-y-3 rounded-xl border border-cyan-300/35 bg-cyan-300/10 p-4"><div className="flex items-center gap-2 font-bold text-cyan-100"><ShieldCheck size={19}/> Tebex-Warenkorb erstellt</div><p className="text-xs text-slate-200">Prüfe die Artikel und den endgültigen Preis auf der offiziellen Tebex-Zahlungsseite. Durch das Öffnen wird noch keine Zahlung abgeschlossen.</p>{checkout.total!==null&&<p className="font-bold">Tebex-Summe: {new Intl.NumberFormat("de-DE",{style:"currency",currency:checkout.currency}).format(checkout.total)}</p>}<a href={checkout.url} rel="nofollow" className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-center font-black text-white hover:bg-emerald-500">Offiziellen Tebex-Checkout öffnen <ExternalLink size={18}/></a></div>}
  {error&&<p role="alert" className="rounded-xl border border-rose-300/30 bg-rose-300/10 p-3 text-sm text-rose-200">{error}</p>}
  <p className="text-xs leading-5 text-slate-400">Testshop: Zahlungen und Zustellung erfolgen ausschließlich bei Tebex. Der bisherige Shop bleibt unverändert. Es gibt keine automatische Bestellung.</p>
 </div>;
}
