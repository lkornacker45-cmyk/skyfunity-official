import type {Metadata} from "next";
import StoreTestClient from "@/components/StoreTestClient";
export const metadata:Metadata={title:"Store-Test – Shop-Vorschau",description:"Vorschau des neuen SkyFunity-Stores. Keine echte Bestellung oder Zahlung möglich.",robots:{index:false,follow:false}};
export default function StoreTestPage(){return <StoreTestClient/>;}
