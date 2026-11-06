import type {Metadata} from "next";
import {isAdmin} from "@/lib/admin-auth";
import AdminPanel from "@/components/AdminPanel";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Admin-Dashboard",robots:{index:false,follow:false}};
export default function Admin(){return <div className="mx-auto max-w-5xl px-5 py-16"><p className="section-label">SkyFunity Management</p><h1 className="mt-3 text-4xl font-black md:text-5xl">Admin-<span className="text-purple-400">Dashboard</span></h1><p className="mt-4 text-slate-400">Geschützter Verwaltungsbereich für SkyFunity.</p><AdminPanel authenticated={isAdmin()}/></div>}
