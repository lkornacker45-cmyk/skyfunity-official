import type {Metadata} from "next";
import UltimateRankings from "@/components/UltimateRankings";
export const metadata:Metadata={title:"Ranglisten",description:"Erkunde die SkyFunity-Ranglisten in einer interaktiven holografischen 3D-Welt."};
export default function RanglistenPage(){return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><UltimateRankings/></main>}
