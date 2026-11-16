import type {Metadata} from "next";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import StoreTestClient from "@/components/StoreTestClient";
import {getContent} from "@/lib/content";
import {getStoreCatalog} from "@/lib/tebex-store";
import {isAdmin} from "@/lib/admin-auth";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Shop – SkyFunity",description:"SkyFunity Minecraft-Shop",robots:{index:true,follow:true}};
export default async function ShopPage(){
 const content=await getContent();
 if(!content.customShopEnabled){
  const original=new URL(content.server.shop);
  const host=headers().get("host")?.split(":")[0]?.toLowerCase();
  // A custom domain may proxy to this app: never redirect to ourselves.
  if(host&&original.hostname.toLowerCase()!==host)redirect(original.toString());
  return <main className="mx-auto max-w-xl px-5 py-24 text-center"><h1 className="text-3xl font-black">Original-Shop</h1><p className="mt-5 text-slate-200">Der selbst gebaute Shop ist derzeit offline. Die hinterlegte Original-Shop-Adresse zeigt auf diese Website. Bitte hinterlege im Adminbereich die eigenständige Original-Shop-URL, damit keine Weiterleitungsschleife entsteht.</p>{isAdmin()&&<a href="/store-test" className="mt-7 inline-block rounded-xl bg-purple-600 px-5 py-3 font-bold">Eigenen Shop als Admin ansehen</a>}</main>;
 }
 const catalog=await getStoreCatalog();
 return <StoreTestClient products={catalog.products} live={catalog.live} notice={catalog.notice} adminView={isAdmin()} publicShop/>;
}
