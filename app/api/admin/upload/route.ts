import {NextRequest,NextResponse} from "next/server";
import {randomUUID} from "node:crypto";
import {isAdmin} from "@/lib/admin-auth";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const repo="lkornacker45-cmyk/skyfunity-official";
const maxBytes=2*1024*1024;
export async function POST(req:NextRequest){
 if(!isAdmin())return NextResponse.json({error:"Nicht angemeldet"},{status:401});
 if(req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Ungültige Herkunft"},{status:403});
 const token=process.env.GITHUB_CONTENT_TOKEN;
 if(!token)return NextResponse.json({error:"GitHub-Token fehlt."},{status:503});
 const size=Number(req.headers.get("content-length")||0);
 if(size>maxBytes+100000)return NextResponse.json({error:"Bild darf höchstens 2 MB groß sein."},{status:413});
 let form:FormData;
 try{form=await req.formData()}catch{return NextResponse.json({error:"Ungültiger Upload"},{status:400})}
 const file=form.get("file");
 if(!(file instanceof File))return NextResponse.json({error:"Bitte ein Bild auswählen."},{status:400});
 if(file.size===0||file.size>maxBytes)return NextResponse.json({error:"Bild muss zwischen 1 Byte und 2 MB groß sein."},{status:413});
 const bytes=Buffer.from(await file.arrayBuffer());
 const png=bytes.length>8&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 const jpg=bytes.length>3&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 const webp=bytes.length>12&&bytes.toString("ascii",0,4)==="RIFF"&&bytes.toString("ascii",8,12)==="WEBP";
 const gif=bytes.length>6&&["GIF87a","GIF89a"].includes(bytes.toString("ascii",0,6));
 const ext=png?"png":jpg?"jpg":webp?"webp":gif?"gif":null;
 if(!ext)return NextResponse.json({error:"Nur PNG, JPG, WebP oder GIF sind erlaubt."},{status:400});
 const path=`public/uploads/team/${randomUUID()}.${ext}`;
 try{
 const response=await fetch(`https://api.github.com/repos/${repo}/contents/${path}`,{
 method:"PUT",headers:{Authorization:`Bearer ${token}`,Accept:"application/vnd.github+json","User-Agent":"SkyFunity-Admin","Content-Type":"application/json"},
 body:JSON.stringify({message:"Upload SkyFunity team profile picture",content:bytes.toString("base64"),branch:"main"}),
 signal:AbortSignal.timeout(20000)
 });
 if(!response.ok)return NextResponse.json({error:"Bild konnte nicht bei GitHub gespeichert werden."},{status:502});
 return NextResponse.json({url:`/uploads/team/${path.split("/").pop()}`},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Upload fehlgeschlagen. Bitte erneut versuchen."},{status:502})}
}
