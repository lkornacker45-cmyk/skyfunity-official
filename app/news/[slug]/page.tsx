import Link from "next/link";
import {notFound} from "next/navigation";
import {communityDb} from "@/lib/community-db";
export const dynamic="force-dynamic";
export default async function NewsArticle({params}:{params:{slug:string}}){
 if(!/^[a-z0-9-]{1,100}$/.test(params.slug))notFound();
 const db=communityDb();if(!db)notFound();
 const {data}=await db.from("community_news").select("title,body,category,published_at").eq("slug",params.slug).eq("published",true).lte("published_at",new Date().toISOString()).maybeSingle();
 if(!data)notFound();
 return <main className="mx-auto max-w-3xl px-5 py-16"><Link href="/news" className="text-purple-300">← Alle News</Link><p className="section-label mt-10">{data.category} · {data.published_at?new Date(data.published_at).toLocaleDateString("de-DE"):""}</p><h1 className="mt-4 text-4xl font-black">{data.title}</h1><div className="glass mt-8 whitespace-pre-wrap break-words p-8 leading-8 text-slate-200">{data.body}</div></main>;
}
