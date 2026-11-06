import {NextRequest,NextResponse} from "next/server";
import {adminCookie} from "@/lib/admin-auth";
export async function POST(req:NextRequest){
 if(req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Ungültige Anfrage"},{status:403});
 const response=NextResponse.json({ok:true});response.cookies.set(adminCookie,"",{path:"/",maxAge:0,httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV==="production"});return response;
}
