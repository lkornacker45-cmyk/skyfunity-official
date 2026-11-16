import Link from "next/link";
import {communityDb} from "@/lib/community-db";
export const dynamic="force-dynamic";
export const metadata={title:"News & Updates"};
export default async function NewsPage(){
 const db=communityDb();
 const {data,error}=db?await db.from("community_news").select("slug,title,summary,category,published_at").eq("published",true).lte("published_at",new Date().toISOString()).order("published_at",{ascending:false}).limit(60):{data:null,error:null};
 return <main className="mx-auto max-w-6xl px-5 py-16"><p className="section-label">SkyFunity · Community</p><h1 className="mt-3 text-5xl font-black">News <span className="text-purple-400">& Updates</span></h1><p className="mt-4 text-slate-300">Alles Neue aus dem SkyFunity-Netzwerk.</p>{!db||error?<p className="mt-8 text-amber-200">News sind derzeit nicht verfügbar.</p>:!data?.length?<p className="mt-8 text-slate-300">Noch keine News veröffentlicht.</p>:<div className="mt-10 grid gap-5 md:grid-cols-2">{data.map(n=><Link key={n.slug} href={"/news/"+n.slug} className="glass block p-7 hover:border-purple-400"><p className="text-sm font-bold text-purple-300">{n.category} · {n.published_at?new Date(n.published_at).toLocaleDateString("de-DE"):""}</p><h2 className="mt-3 text-2xl font-black">{n.title}</h2><p className="mt-3 text-slate-300">{n.summary}</p><span className="mt-5 inline-block font-bold text-purple-300">Weiterlesen →</span></Link>)}</div>}</main>;
}
