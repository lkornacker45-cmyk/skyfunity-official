import type {Metadata} from "next";
import StoreTestClient from "@/components/StoreTestClient";
import {getStoreCatalog} from "@/lib/tebex-store";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Store-Test – Tebex Live-Vorschau",description:"Vorschau des SkyFunity-Stores mit aktuellen Tebex-Preisen. Keine echte Bestellung oder Zahlung möglich.",robots:{index:false,follow:false}};
export default async function StoreTestPage(){
 const catalog=await getStoreCatalog();
 return <StoreTestClient products={catalog.products} live={catalog.live} notice={catalog.notice}/>;
}
