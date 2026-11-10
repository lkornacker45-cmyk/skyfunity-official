import type {Metadata} from "next";
import StoreTestClient from "@/components/StoreTestClient";
import {isAdmin} from "@/lib/admin-auth";
import {getStoreCatalog} from "@/lib/tebex-store";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Store-Test – Tebex Integration",description:"SkyFunity-Testshop mit Minecraft-Anmeldung und offizieller Tebex-Kasse.",robots:{index:false,follow:false}};
export default async function StoreTestPage(){
 const catalog=await getStoreCatalog();
 return <StoreTestClient products={catalog.products} live={catalog.live} notice={catalog.notice} adminView={isAdmin()}/>;
}
