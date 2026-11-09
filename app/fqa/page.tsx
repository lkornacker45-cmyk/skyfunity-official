import type {Metadata} from "next";
import {getContent} from "@/lib/content";
import FqaDashboard from "@/components/FqaDashboard";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"FQA – SkyFunity Help Center",description:"Durchsuche die häufigsten Fragen zu SkyFunity, Minecraft, Ranglisten und Support."};
export default async function FqaPage(){
 const {fqa,server}=await getContent();
 return <FqaDashboard items={fqa||[]} discord={server.discord}/>;
}
