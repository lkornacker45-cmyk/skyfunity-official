import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
export const dynamic="force-dynamic";
async function players(url:string):Promise<number|null>{
 try{const r=await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(8000)});if(!r.ok)return null;
 const data=await r.json();return typeof data.players?.online==="number"&&data.online===true?data.players.online:data.online===false?0:null;
 }catch{return null;}
}
export async function GET(request:NextRequest){
 const secret=process.env.CRON_SECRET;
 if(!secret||request.headers.get("authorization")!==`Bearer ${secret}`)return NextResponse.json({error:"Unauthorized"},{status:401});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return NextResponse.json({error:"Missing Supabase server credentials"},{status:503});
 const address=encodeURIComponent(process.env.MINECRAFT_SERVER_ADDRESS||"play.skyfunity.net");
 const [java,bedrock]=await Promise.all([
  players(`https://api.mcsrvstat.us/3/${address}`),
  players(`https://api.mcsrvstat.us/bedrock/3/${address}`)
 ]);
 if(java===null&&bedrock===null)return NextResponse.json({error:"No valid measurements"},{status:503});
 const db=createClient(url,key,{auth:{persistSession:false}});
 const {error}=await db.from("skyfunity_player_status_history").insert({java_players:java,bedrock_players:bedrock});
 if(error)return NextResponse.json({error:"Could not store measurement"},{status:500});
 return NextResponse.json({ok:true,java,bedrock});
}
