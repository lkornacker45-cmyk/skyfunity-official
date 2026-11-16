import "server-only";
import {createClient} from "@supabase/supabase-js";
export function communityDb(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return null;
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
export function safeName(value:string){return /^[A-Za-z0-9_]{3,16}$/.test(value);}
