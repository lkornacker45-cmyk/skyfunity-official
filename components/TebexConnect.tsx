"use client";
import {useState} from "react";
import {CreditCard,Loader2,ShieldCheck,AlertTriangle} from "lucide-react";
type CartItem={id:number;quantity:number};
type Edition="Java"|"Bedrock";
type CheckoutResponse={error?:string;ident?:string;username?:string;total?:number|null;currency?:string|null};
type TebexCheckout={checkout:{init:(args:{ident:string;theme:"dark";locale:"de_DE"})=>void;launch:()=>void}};
declare global {interface Window {Tebex?:TebexCheckout}}
let loadingScript:Promise<void>|null=null;
function loadCheckout():Promise<void>{
 if(typeof window==="undefined")return Promise.reject(Error("Browser nicht verfügbar."));
 if(window.Tebex)return Promise.resolve();
 if(loadingScript)return loadingScript;
 loadingScript=new Promise<void>((resolve,reject)=>{
  const element=document.createElement("script");
  element.src="https://js.tebex.io/v/1.js";
  element.async=true;
  element.onload=()=>window.Tebex?resolve():reject(Error("Tebex.js konnte nicht geladen werden."));
  element.onerror=()=>reject(Error("Der Tebex-Zahlungsdialog konnte nicht geladen werden."));
  document.head.appendChild(element);
 }).catch(error=>{loadingScript=null;throw error});
 return loadingScript;
}
export default function TebexConnect({items,username,edition}:{items:CartItem[];username:string;edition:Edition;publicShop?:boolean}){
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [status,setStatus]=useState("");
 const valid=edition==="Java"?/^[a-zA-Z0-9_]{3,16}$/.test(username.trim()):/^\.[a-zA-Z0-9_]{1,16}$/.test(username.trim());
 async function checkout(){
  setError("");setStatus("");
  if(!valid){setError("Bitte gib oben einen gültigen Minecraft-Namen ein.");return;}
  if(!items.length){setError("Bitte wähle zuerst ein Produkt aus.");return;}
  setBusy(true);
  try{
   const response=await fetch("/api/shop/checkout",{
    method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({items,username:username.trim(),edition})
   });
   const result=await response.json() as CheckoutResponse;
   if(!response.ok||!result.ident)throw Error(result.error||"Tebex hat keinen Checkout erstellt.");
   if(!result.username||result.username.toLowerCase()!==username.trim().toLowerCase())throw Error("Der Tebex-Spielername stimmt nicht mit deiner Eingabe überein.");
   setStatus("Warenkorb für "+result.username+" bestätigt. Der Tebex-Zahlungsdialog wird geöffnet.");
   await loadCheckout();
   if(!window.Tebex)throw Error("Der Checkout ist nicht verfügbar.");
   window.Tebex.checkout.init({ident:result.ident,theme:"dark",locale:"de_DE"});
   window.Tebex.checkout.launch();
  }catch(err){setError(err instanceof Error?err.message:"Der Checkout konnte nicht gestartet werden.");}
  finally{setBusy(false);}
 }
 return <div className="mt-4 space-y-3">
  <div className="rounded-xl border border-cyan-300/30 bg-cyan-300/5 p-3 text-xs leading-5 text-slate-200">
   <p className="flex items-center gap-2 font-bold text-cyan-100"><ShieldCheck size={17}/> Direkt im SkyFunity-Shop bezahlen</p>
   <p className="mt-2">Wir übernehmen deinen oben eingegebenen Minecraft-Namen und die ausgewählten Produkte in den offiziellen Tebex-Warenkorb. Die Zahlung öffnet sich als Tebex-Dialog auf dieser Website (auf mobilen Geräten ggf. in einem neuen Tab).</p>
  </div>
  <button type="button" onClick={()=>void checkout()} disabled={busy||!items.length||!valid} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-4 text-sm font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
   {busy?<Loader2 size={19} className="animate-spin"/>:<CreditCard size={19}/>}
   {busy?"Tebex-Warenkorb wird geprüft …":"Jetzt hier zur Kasse"}
  </button>
  {!valid&&<p className="text-xs text-amber-200">Bitte gib oben den {edition==="Java"?"Java-Spielernamen":"Bedrock-Spielernamen mit führendem Punkt"} ein.</p>}
  {status&&<p role="status" className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 p-3 text-xs text-emerald-100">{status}</p>}
  {error&&<p role="alert" className="flex items-start gap-2 rounded-lg border border-rose-300/30 bg-rose-300/10 p-3 text-xs text-rose-100"><AlertTriangle size={16} className="mt-0.5 shrink-0"/>{error}</p>}
  <p className="text-xs leading-5 text-slate-400">Der finale Preis wird von Tebex im Checkout angezeigt. Eine Bestellung entsteht erst, wenn du die Zahlung dort bestätigst.</p>
 </div>;
}
