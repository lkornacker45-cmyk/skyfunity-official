import {NextRequest,NextResponse} from "next/server";
import {authenticatingUrl,authLinkUrl,basketData,createBasketUrl,fail,noStore,sameOrigin,savedBasket,setBasket,tebex,type Basket} from "@/lib/tebex-checkout";
export const dynamic="force-dynamic";
export async function GET(){
 const id=savedBasket();
 if(!id)return NextResponse.json({connected:false},{headers:noStore});
 try{
  const b=await basketData(id);
  return NextResponse.json({connected:typeof b.username==="string"&&!!b.username,username:typeof b.username==="string"?b.username:null,complete:b.complete===true},{headers:noStore});
 }catch{return fail("Tebex-Sitzung nicht erreichbar. Bitte erneut verbinden.",503);}
}
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return fail("Ungültiger Aufruf.",403);
 try{
  const raw:unknown=await req.json().catch(()=>({}));
  const returnPath=raw&&typeof raw==="object"&&"returnPath" in raw&&raw.returnPath==="/shop"?"/shop":"/store-test";
  const origin=req.nextUrl.origin;
  const back=origin+returnPath+"?tebex=returned";
  const result=await tebex<{data?:Basket}>(createBasketUrl,"POST",{complete_url:origin+returnPath+"?tebex=complete",cancel_url:origin+returnPath+"?tebex=cancel",complete_auto_redirect:true});
  const id=result.data?.ident;
  if(typeof id!=="string"||!/^[A-Za-z0-9-]{12,100}$/.test(id))return fail("Tebex hat keinen gültigen Warenkorb zurückgegeben.",502);
  const auth=await tebex<unknown>(authLinkUrl(id)+"?returnUrl="+encodeURIComponent(back),"GET");
  const options=Array.isArray(auth)?auth:typeof auth==="object"&&auth!==null&&"data" in auth&&Array.isArray(auth.data)?auth.data:[];
  const links:{name:string;url:string}[]=[];
  for(const value of options){if(!value||typeof value!=="object")continue;const x=value as {name?:unknown;url?:unknown};const url=authenticatingUrl(x.url);if(url)links.push({name:typeof x.name==="string"?x.name:"Minecraft verbinden",url});}
  if(!links.length)return fail("Für diesen Store sind keine Minecraft-Anmeldelinks verfügbar.",502);
  const response=NextResponse.json({links},{headers:noStore});
  setBasket(response,id);
  return response;
 }catch{return fail("Tebex konnte keine Anmeldung starten. Versuche es später erneut.",503);}
}
