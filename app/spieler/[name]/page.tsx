import {notFound} from "next/navigation";
import {communityDb,safeName} from "@/lib/community-db";
export const dynamic="force-dynamic";
export default async function PublicPlayer({params}:{params:{name:string}}){
 const name=decodeURIComponent(params.name);if(!safeName(name))notFound();
 const db=communityDb();if(!db)notFound();
 const {data:profiles}=await db.from("profiles").select("id,minecraft_name").ilike("minecraft_name",name).limit(5);
 const profile=profiles?.find(p=>p.minecraft_name.toLowerCase()===name.toLowerCase());if(!profile)notFound();
 const {data:visibility}=await db.from("community_profile_settings").select("public_enabled").eq("user_id",profile.id).maybeSingle();
 if(!visibility?.public_enabled)notFound();
 const [{data:link},{data:awards},{data:stats}]=await Promise.all([
  db.from("minecraft_links").select("minecraft_uuid").eq("user_id",profile.id).maybeSingle(),
  db.from("community_awards").select("achievement_id,awarded_at").eq("user_id",profile.id).order("awarded_at",{ascending:false}),
  db.from("player_stats").select("server_rank").eq("user_id",profile.id).maybeSingle()
 ]);
 const ids=(awards||[]).map(a=>a.achievement_id);
 const {data:definitions}=ids.length?await db.from("community_achievements").select("id,title,description,icon").in("id",ids):{data:[]};
 return <main className="mx-auto max-w-4xl px-5 py-16"><p className="section-label">SkyFunity · Spielerprofil</p><h1 className="mt-4 text-4xl font-black">{profile.minecraft_name}</h1><p className="mt-3 text-purple-200">{stats?.server_rank||"Spieler"} · {link?"Minecraft verknüpft":"Nicht verknüpft"}</p><h2 className="mt-12 text-2xl font-black">Erfolge & Team-Abzeichen</h2>{!definitions?.length?<p className="mt-5 text-slate-300">Noch keine Erfolge freigeschaltet.</p>:<div className="mt-6 grid gap-4 sm:grid-cols-2">{definitions.map(a=><article key={a.id} className="glass p-6"><span className="text-3xl">{a.icon}</span><h3 className="mt-3 text-xl font-bold">{a.title}</h3><p className="mt-2 text-slate-300">{a.description}</p></article>)}</div>}</main>;
}
