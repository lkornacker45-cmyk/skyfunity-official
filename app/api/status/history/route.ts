import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
export const dynamic = "force-dynamic";
export async function GET(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return NextResponse.json({samples:[],configured:false});
 try{
  const db=createClient(url,key,{auth:{persistSession:false}});
  const {data,error}=await db.rpc("skyfunity_status_last_24h");
  if(error)throw error;
  return NextResponse.json({samples:data??[],configured:true},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({samples:[],configured:false},{status:503});}
}
