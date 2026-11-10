import "server-only";
import {cookies} from "next/headers";
import {NextRequest,NextResponse} from "next/server";
import {getStoreCatalog} from "@/lib/tebex-store";
const token="14hvr-a5771d4a6b64705c39fbde42c027d3eabfdabe76";
const base="https://headless.tebex.io/api";
const cookieName="skyfunity_tebex_preview_basket";
const idPattern=/^[A-Za-z0-9-]{12,100}$/;
const getPath=(id:string)=>base+"/accounts/"+token+"/baskets/"+encodeURIComponent(id);
export const noStore={"Cache-Control":"no-store"};
export const fail=(message:string,status=400)=>NextResponse.json({error:message},{status,headers:noStore});
export function sameOrigin(request:NextRequest):boolean{
 const origin=request.headers.get("origin");
 return !!origin&&origin===request.nextUrl.origin;
}
export function savedBasket():string|null{
 const id=cookies().get(cookieName)?.value||"";
 return idPattern.test(id)?id:null;
}
export function setBasket(response:NextResponse,id:string){
 response.cookies.set(cookieName,id,{httpOnly:true,secure:true,sameSite:"lax",path:"/api/store-test",maxAge:60*60});
}
export type Basket={ident?:unknown;username?:unknown;username_id?:unknown;complete?:unknown;total_price?:unknown;currency?:unknown;packages?:unknown;links?:unknown};
export async function tebex<T>(url:string,method:"GET"|"POST",body?:object):Promise<T>{
 const response=await fetch(url,{method,cache:"no-store",headers:{Accept:"application/json",...(body?{"Content-Type":"application/json"}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(9500)});
 if(!response.ok)throw Error("Tebex HTTP "+response.status);
 return await response.json() as T;
}
export async function basketData(id:string):Promise<Basket>{
 const result=await tebex<{data?:Basket}>(getPath(id),"GET");
 if(!result.data||typeof result.data!=="object")throw Error("Ungültige Warenkorbantwort");
 return result.data;
}
export async function checkedItems(raw:unknown):Promise<{id:number;quantity:number}[]|null>{
 if(!Array.isArray(raw)||!raw.length||raw.length>10)return null;
 const {products,live}=await getStoreCatalog();
 if(!live)return null;
 const distinct=new Set<number>();
 const items:{id:number;quantity:number}[]=[];
 for(const item of raw){
  if(!item||typeof item!=="object")return null;
  const v=item as {id?:unknown;quantity?:unknown};
  if(typeof v.id!=="number"||!Number.isInteger(v.id)||distinct.has(v.id)||typeof v.quantity!=="number"||!Number.isInteger(v.quantity))return null;
  distinct.add(v.id);
  const product=products.find(p=>p.id===v.id&&p.available);
  if(!product||v.quantity<1||v.quantity>(product.single?1:99))return null;
  items.push({id:v.id,quantity:v.quantity});
 }
 return items;
}
export const checkoutUrl=(value:unknown):string|null=>{
 if(typeof value!=="string")return null;
 try{const u=new URL(value);return u.protocol==="https:"&&(u.hostname==="pay.tebex.io"||u.hostname==="checkout.tebex.io")?u.href:null;}catch{return null;}
};
export const authenticatingUrl=(value:unknown):string|null=>{
 if(typeof value!=="string")return null;
 try{const u=new URL(value);return u.protocol==="https:"&&(u.hostname==="tebex.io"||u.hostname.endsWith(".tebex.io"))?u.href:null;}catch{return null;}
};
export function checkoutLink(data:Basket):string|null{
 const links=data.links;
 if(!links||typeof links!=="object")return null;
 return checkoutUrl((links as {checkout?:unknown}).checkout);
}
export const createBasketUrl=base+"/accounts/"+token+"/baskets";
export const authLinkUrl=(id:string)=>getPath(id)+"/auth";
export const addPackageUrl=(id:string)=>base+"/baskets/"+encodeURIComponent(id)+"/packages";
