import "server-only";
import {storeProducts,type StoreProduct} from "@/lib/store-preview";

// Tebex's Headless public token is explicitly intended for public storefront API access.
// Never use a Tebex private key or the Minecraft plugin secret here.
const publicToken="14hvr-a5771d4a6b64705c39fbde42c027d3eabfdabe76";
const endpoint="https://headless.tebex.io/api/accounts/"+publicToken+"/packages";
export type SyncedStoreProduct=StoreProduct & {price:number|null;currency:string;available:boolean};
export type StoreCatalog={products:SyncedStoreProduct[];live:boolean;notice:string|null};
type TebexProduct={id?:unknown;name?:unknown;description?:unknown;image?:unknown;media?:unknown;total_price?:unknown;currency?:unknown;disable_quantity?:unknown};
const allowed=new Set(storeProducts.map(p=>p.id));

function cleanDescription(raw:unknown):string|null{
 if(typeof raw!=="string")return null;
 // Tebex product descriptions contain HTML. Display text only; never render HTML from the API.
 const firstParagraph=raw.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1]||raw;
 const plain=firstParagraph.replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/\s+/g," ").trim();
 if(!plain)return null;
 return plain.length>205?plain.slice(0,202).trimEnd()+"…":plain;
}
function safeImage(src:unknown):string|null{
 if(typeof src!=="string")return null;
 try{const url=new URL(src);return url.protocol==="https:"&&url.hostname==="dunb17ur4ymx4.cloudfront.net"?url.toString():null;}catch{return null;}
}
function unavailable():StoreCatalog{return {live:false,notice:"Tebex ist aktuell nicht erreichbar. Preise und Warenkorb sind vorübergehend nicht verfügbar.",products:storeProducts.map(p=>({...p,price:null,currency:"EUR",available:false}))};}
export async function getStoreCatalog():Promise<StoreCatalog>{
 try{
  const response=await fetch(endpoint,{method:"GET",headers:{Accept:"application/json"},next:{revalidate:60},signal:AbortSignal.timeout(6500)});
  if(!response.ok)throw new Error("Tebex HTTP "+response.status);
  const json:unknown=await response.json();
  if(!json||typeof json!=="object"||!("data" in json)||!Array.isArray(json.data))throw new Error("Invalid Tebex response");
  const records=new Map<number,TebexProduct>();
  for(const value of json.data){
   if(!value||typeof value!=="object")continue;
   const p=value as TebexProduct;
   if(typeof p.id==="number"&&allowed.has(p.id))records.set(p.id,p);
  }
  // Fail closed if a package disappears or its price cannot be validated.
  const products=storeProducts.map(p=>{
   const current=records.get(p.id);
   const currency=current?.currency;
   const price=current?.total_price;
   const valid=!!current&&typeof price==="number"&&Number.isFinite(price)&&price>=0&&typeof currency==="string"&&currency==="EUR";
   const image=safeImage(current?.image);
   return {...p,name:typeof current?.name==="string"?current.name:p.name,teaser:cleanDescription(current?.description)||p.teaser,image:image||p.image,price:valid?price:null,currency:valid?"EUR":"EUR",available:valid};
  });
  const missing=products.filter(p=>!p.available).length;
  return {products,live:true,notice:missing?missing+" Paket(e) bei Tebex derzeit nicht verfügbar.":null};
 }catch(e){
  console.error("Tebex catalog sync failed",e instanceof Error?e.message:"Unexpected error");
  return unavailable();
 }
}
