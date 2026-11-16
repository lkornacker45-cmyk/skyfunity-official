import {NextRequest,NextResponse} from "next/server";
import {isAdmin} from "@/lib/admin-auth";
import {communityDb,safeName} from "@/lib/community-db";
export const dynamic="force-dynamic";
export const runtime="nodejs";
const fail=(message:string,status:number)=>NextResponse.json({error:message},{status});
export async function GET(){
 if(!isAdmin())return fail("Nicht angemeldet",401);
 const db=communityDb();if(!db)return fail("Supabase-Service-Key fehlt",503);
 const [news,achievements]=await Promise.all([
  db.from("community_news").select("id,slug,title,summary,body,category,published,published_at").order("created_at",{ascending:false}).limit(100),
  db.from("community_achievements").select("*").order("id")
 ]);
 if(news.error||achievements.error)return fail("Datenbanktabellen fehlen oder sind nicht erreichbar",503);
 return NextResponse.json({news:news.data,achievements:achievements.data},{headers:{"Cache-Control":"no-store"}});
}
export async function POST(req:NextRequest){
 if(!isAdmin())return fail("Nicht angemeldet",401);
 if(req.headers.get("origin")!==req.nextUrl.origin)return fail("Ungültige Herkunft",403);
 const db=communityDb();if(!db)return fail("Supabase-Service-Key fehlt",503);
 let v:any;try{const raw=await req.text();if(raw.length>16000)return fail("Zu groß",413);v=JSON.parse(raw)}catch{return fail("Ungültiges JSON",400)}
 if(v.action==="news"){
  if(typeof v.title!=="string"||v.title.trim().length<3||v.title.length>120||typeof v.slug!=="string"||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.slug)||v.slug.length>100||typeof v.body!=="string"||!v.body.trim()||v.body.length>12000||typeof v.summary!=="string"||v.summary.length>300||!["Update","Event","Ankündigung","Wartung"].includes(v.category)||typeof v.published!=="boolean")return fail("News-Eingaben ungültig",400);
  const payload={slug:v.slug,title:v.title.trim(),summary:v.summary,body:v.body,category:v.category,published:v.published,published_at:v.published?new Date().toISOString():null};
  const result=v.id?await db.from("community_news").update(payload).eq("id",v.id).select("id").maybeSingle():await db.from("community_news").insert(payload).select("id").single();
  if(result.error)return fail("Speichern fehlgeschlagen: "+result.error.message,400);
  return NextResponse.json({ok:true});
 }
 if(v.action==="delete-news"){
  if(typeof v.id!=="string"||!/^[0-9a-f-]{36}$/i.test(v.id))return fail("Ungültige ID",400);
  const result=await db.from("community_news").delete().eq("id",v.id);return result.error?fail("Löschen fehlgeschlagen",400):NextResponse.json({ok:true});
 }
 if(v.action==="create-badge"){
  if(typeof v.id!=="string"||!/^[a-z0-9_-]{2,40}$/.test(v.id)||typeof v.title!=="string"||v.title.length<2||v.title.length>80||typeof v.description!=="string"||v.description.length>250||typeof v.icon!=="string"||v.icon.length>16)return fail("Ungültiges Abzeichen",400);
  const result=await db.from("community_achievements").insert({id:v.id,title:v.title,description:v.description,icon:v.icon,kind:"manual"});
  return result.error?fail("Abzeichen konnte nicht angelegt werden",400):NextResponse.json({ok:true});
 }
 if(v.action==="award"||v.action==="revoke"){
  if(!safeName(v.name||"")||typeof v.achievement_id!=="string")return fail("Ungültige Angaben",400);
  const {data:achievement}=await db.from("community_achievements").select("kind").eq("id",v.achievement_id).maybeSingle();
  if(achievement?.kind!=="manual")return fail("Nur Team-Abzeichen dürfen manuell vergeben werden",403);
  const {data:profiles}=await db.from("profiles").select("id,minecraft_name").ilike("minecraft_name",v.name).limit(5);
  const profile=profiles?.find(p=>p.minecraft_name.toLowerCase()===v.name.toLowerCase());if(!profile)return fail("Spieler nicht gefunden",404);
  const result=v.action==="award"?await db.from("community_awards").upsert({user_id:profile.id,achievement_id:v.achievement_id}):await db.from("community_awards").delete().eq("user_id",profile.id).eq("achievement_id",v.achievement_id);
  return result.error?fail("Änderung fehlgeschlagen",400):NextResponse.json({ok:true});
 }
 return fail("Unbekannte Aktion",400);
}
