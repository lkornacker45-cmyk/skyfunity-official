import {NextRequest,NextResponse} from "next/server";
import {addPackageUrl,basketData,checkedItems,checkoutLink,fail,noStore,sameOrigin,savedBasket,tebex,type Basket} from "@/lib/tebex-checkout";
export const dynamic="force-dynamic";
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return fail("Ungültiger Aufruf.",403);
 const id=savedBasket();
 if(!id)return fail("Bitte verbinde zuerst deinen Minecraft-Account.",401);
 let body:unknown;
 try{body=await req.json();}catch{return fail("Ungültige Warenkorbdaten.");}
 const items=await checkedItems(body&&typeof body==="object"&&"items" in body?body.items:null);
 if(!items)return fail("Ein Produkt ist nicht freigegeben oder zurzeit nicht verfügbar.",400);
 try{
  const current=await basketData(id);
  if(current.complete===true)return fail("Dieser Warenkorb wurde bereits abgeschlossen. Bitte neu verbinden.");
  if(typeof current.username!=="string"||!current.username.trim())return fail("Bitte schließe die Minecraft-Anmeldung über Tebex ab.",401);
  if(!Array.isArray(current.packages))return fail("Der Tebex-Warenkorb konnte nicht überprüft werden.",502);
  if(current.packages.length)return fail("Dieser Warenkorb enthält bereits Pakete. Bitte neu verbinden, um doppelte Käufe zu verhindern.",409);
  let latest:Basket=current;
  for(const item of items){
   const result=await tebex<{data?:Basket}|Basket>(addPackageUrl(id),"POST",{package_id:String(item.id),quantity:item.quantity});
   const data=("data" in result?result.data:result) as Basket|undefined;
   if(!data||typeof data!=="object")throw Error("Invalid basket response");
   latest=data;
  }
  // Re-fetch the actual Tebex cart, which owns the payable total and package validation.
  const verified=await basketData(id);
  if(!Array.isArray(verified.packages)||!verified.packages.length)return fail("Die Pakete wurden nicht übernommen. Bitte neu verbinden.",502);
  const url=checkoutLink(verified)||checkoutLink(latest);
  if(!url)return fail("Tebex hat keinen gültigen Checkout-Link zurückgegeben.",502);
  return NextResponse.json({url,username:verified.username,total:typeof verified.total_price==="number"?verified.total_price:null,currency:verified.currency},{headers:noStore});
 }catch{
  return fail("Tebex konnte den Warenkorb nicht vollständig vorbereiten. Bitte erneut verbinden, bevor du es wieder versuchst.",503);
 }
}
