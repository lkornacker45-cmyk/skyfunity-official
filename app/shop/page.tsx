import type {Metadata} from "next";
import StoreTestClient from "@/components/StoreTestClient";
import {isAdmin} from "@/lib/admin-auth";
import {getStoreCatalog} from "@/lib/tebex-store";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Shop – Ränge, Gems & Bundles",description:"Entdecke Ränge, Gems und Bundles im SkyFunity Minecraft-Shop. Zahlung und Zustellung über Tebex.",robots:{index:true,follow:true}};
export default async function ShopPage(){
 const catalog=await getStoreCatalog();
 return <StoreTestClient products={catalog.products} live={catalog.live} notice={catalog.notice} adminView={isAdmin()} publicShop/>;
}
