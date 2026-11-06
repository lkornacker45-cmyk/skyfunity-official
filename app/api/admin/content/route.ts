import {NextRequest,NextResponse} from "next/server";
import {isAdmin} from "@/lib/admin-auth";
import {getContent,validateContent} from "@/lib/content";
export const dynamic="force-dynamic";
export const runtime="nodejs";
const url="https://api.github.com/repos/lkornacker45-cmyk/skyfunity-official/contents/data/content.json";
function headers(token:string){return{"Authorization":`Bearer ${token}`,"Accept":"application/vnd.github+json","User-Agent":"SkyFunity-Admin","X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"}}
export async function GET(){
 if(!isAdmin())return NextResponse.json({error:"Nicht angemeldet"},{status:401});
 return NextResponse.json({content:await getContent(),configured:Boolean(process.env.GITHUB_CONTENT_TOKEN)},{headers:{"Cache-Control":"no-store"}});
}
export async function PUT(req:NextRequest){
 if(!isAdmin())return NextResponse.json({error:"Nicht angemeldet"},{status:401});
 if(req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Ungültige Herkunft"},{status:403});
 const token=process.env.GITHUB_CONTENT_TOKEN;
 if(!token)return NextResponse.json({error:"GITHUB_CONTENT_TOKEN ist bei Vercel noch nicht eingerichtet."},{status:503});
 const raw=await req.text();
 if(raw.length>50000)return NextResponse.json({error:"Daten zu groß"},{status:413});
 let parsed:unknown;try{parsed=JSON.parse(raw)}catch{return NextResponse.json({error:"Ungültiges JSON"},{status:400})}
 const content=validateContent(parsed);
 if(!content)return NextResponse.json({error:"Bitte Eingaben prüfen: Adressen, Links und Feldlängen."},{status:400});
 try{
 const current=await fetch(url,{headers:headers(token),cache:"no-store",signal:AbortSignal.timeout(10000)});
 if(!current.ok)return NextResponse.json({error:"GitHub-Datei konnte nicht gelesen werden."},{status:502});
 const metadata=await current.json();
 if(typeof metadata.sha!=="string")return NextResponse.json({error:"GitHub-Datei hat keinen gültigen SHA."},{status:502});
 const result=await fetch(url,{method:"PUT",headers:headers(token),body:JSON.stringify({message:"Update SkyFunity content via admin editor",content:Buffer.from(JSON.stringify(content,null,2)+"\n").toString("base64"),sha:metadata.sha,branch:"main"}),signal:AbortSignal.timeout(12000)});
 if(result.status===409)return NextResponse.json({error:"Inhalt wurde parallel geändert. Bitte neu laden."},{status:409});
 if(!result.ok)return NextResponse.json({error:"GitHub konnte nicht speichern. Token-Berechtigungen prüfen."},{status:502});
 return NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"GitHub ist gerade nicht erreichbar."},{status:502})}
}
