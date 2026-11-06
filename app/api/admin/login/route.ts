import {NextRequest,NextResponse} from "next/server";
import {adminCookie,newSession,validPassword} from "@/lib/admin-auth";
export const runtime="nodejs";
export async function POST(req:NextRequest){
 if(req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Ungültige Anfrage"},{status:403});
 const body=await req.json().catch(()=>null);
 if(typeof body?.password!=="string"||body.password.length>256||!validPassword(body.password))return NextResponse.json({error:"Anmeldung fehlgeschlagen"},{status:401,headers:{"Cache-Control":"no-store"}});
 const response=NextResponse.json({ok:true});
 response.cookies.set(adminCookie,newSession(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:8*60*60});
 response.headers.set("Cache-Control","no-store");return response;
}
