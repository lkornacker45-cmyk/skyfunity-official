"use client";
import {ExternalLink,Info,ShieldCheck} from "lucide-react";
type CartItem={id:number;quantity:number};
export default function TebexConnect({items}:{items:CartItem[];publicShop?:boolean}){
 return <div className="mt-4 space-y-3">
  <div className="rounded-xl border border-amber-300/35 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
   <div className="mb-2 flex items-center gap-2 font-bold"><Info size={18}/> Minecraft-Anmeldung in Vorbereitung</div>
   <p>Unser neuer Shop benötigt noch die sichere Verknüpfung deines Minecraft-Namens mit Tebex. Bei Minecraft gibt es für diesen Store keine externen Anmeldelinks. Das Namensfeld im Shop ist noch keine bestätigte Verknüpfung.</p>
  </div>
  <div className="rounded-xl border border-cyan-300/30 bg-cyan-300/5 p-4">
   <div className="mb-2 flex items-center gap-2 text-sm font-bold text-cyan-100"><ShieldCheck size={18}/> Sicher weiter einkaufen</div>
   <p className="text-xs leading-5 text-slate-300">Der bisherige SkyFunity-Kaufweg über Tebex funktioniert weiterhin. Dort wählst du dein Produkt erneut aus und gibst deinen Minecraft-Namen ein. Die hier ausgewählten Produkte werden noch nicht übertragen.</p>
   <a href="https://skyfunity.de/shop" rel="noopener noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-purple-500">Bisherigen sicheren Shop öffnen <ExternalLink size={16}/></a>
  </div>
  {items.length>0&&<p className="text-xs leading-5 text-slate-400">Deine Auswahl in diesem Vorschau-Warenkorb bleibt auf dieser Seite, kann aber erst nach abgeschlossener Anbindung direkt über SkyFunity bezahlt werden.</p>}
 </div>;
}
