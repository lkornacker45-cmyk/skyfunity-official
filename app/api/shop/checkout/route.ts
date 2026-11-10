import {isIP} from "node:net";
import {NextRequest,NextResponse} from "next/server";
import {addPackageUrl,basketData,checkedItems,createBasketUrl,fail,noStore,sameOrigin,tebex,type Basket} from "@/lib/tebex-checkout";
export const dynamic="force-dynamic";
type Input={items?:unknown;username?:unknown;edition?:unknown};
const java=/^[a-zA-Z0-9_]{3,16}$/;
const bedrock=/^\.[a-zA-Z0-9_]{1,16}$/;

export async function POST(req:NextRequest){
 if(!sameOrigin(req))return fail("Ungültiger Aufruf.",403);
 let body:Input;
 try{body=await req.json() as Input;}catch{return fail("Ungültige Eingabe.");}
 const edition=body.edition;
 const username=typeof body.username==="string"?body.username.trim():"";
 if((edition!=="Java"&&edition!=="Bedrock")||(edition==="Java"?!java.test(username):!bedrock.test(username)))
   return fail("Bitte gib einen gültigen Minecraft-Namen für Java oder Bedrock ein.");
 const items=await checkedItems(body.items);
 if(!items)return fail("Bitte wähle ausschließlich verfügbare SkyFunity-Pakete aus.");
 try{
  // Official Tebex Headless Template creates Minecraft baskets with {username}.
  // No external identity provider or unverified local player ID is used.
  const returnUrl=req.nextUrl.origin+"/shop";
  const ip=visitorIp(req);
  const country=visitorCountry(req);
  const result=await tebex<{data?:Basket}>(createBasketUrl,"POST",{
   username,
   ...(ip?{ip}:{}),
   ...(country?{country}:{}),
   currency:"EUR",
   complete_url:returnUrl+"?tebex=complete",
   cancel_url:returnUrl+"?tebex=cancel",
   complete_auto_redirect:true
  });
  const basket=result.data;
  const id=basket?.ident;
  if(typeof id!=="string"||!/^[A-Za-z0-9-]{12,100}$/.test(id))
   return fail("Tebex hat keinen gültigen Warenkorb erstellt.",502);
  // Ensure Tebex itself resolved the player name before allowing payment.
  const before=await basketData(id);
  if(typeof before.username!=="string"||before.username.toLowerCase()!==username.toLowerCase()||!before.username_id)
   return fail("Tebex konnte den Minecraft-Account nicht zuordnen. Bitte prüfe den Spielernamen.",422);
  if(before.complete===true)return fail("Der Tebex-Warenkorb ist bereits abgeschlossen.",409);
  for(const item of items){
   await tebex<unknown>(addPackageUrl(id),"POST",{package_id:String(item.id),quantity:item.quantity});
  }
  const verified=await basketData(id);
  if(typeof verified.username!=="string"||verified.username.toLowerCase()!==username.toLowerCase()||!verified.username_id
    ||!Array.isArray(verified.packages)||!verified.packages.length||verified.complete===true)
    return fail("Der Tebex-Warenkorb konnte nicht sicher bestätigt werden.",502);
  if(verified.currency!=="EUR"){
   console.warn("Tebex created non-EUR basket for country",country||"unknown","currency",verified.currency||"unknown");
   return fail("Tebex hat den Warenkorb nicht in Euro erstellt. Bitte versuche es erneut. Der Kauf wurde nicht gestartet.",409);
  }
  return NextResponse.json({
   ident:id,
   username:verified.username,
   total:typeof verified.total_price==="number"?verified.total_price:null,
   currency:typeof verified.currency==="string"?verified.currency:null
  },{headers:noStore});
 }catch(e){
  console.error("SkyFunity embedded checkout preparation",e instanceof Error?e.message:"Unknown error");
  return fail("Tebex konnte den Checkout derzeit nicht vorbereiten. Bitte versuche es später erneut.",503);
 }
}
