import http from 'node:http';
import {timingSafeEqual} from 'node:crypto';
import mysql from 'mysql2/promise';
import {createClient} from '@supabase/supabase-js';

const required=['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','LINK_SHARED_SECRET','MYSQL_HOST','MYSQL_USER','MYSQL_PASSWORD','MYSQL_DATABASE'];
for(const key of required)if(!process.env[key]||process.env[key].startsWith('REPLACE_'))throw new Error('Missing '+key);
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const pool=mysql.createPool({host:process.env.MYSQL_HOST,port:Number(process.env.MYSQL_PORT||3307),user:process.env.MYSQL_USER,password:process.env.MYSQL_PASSWORD,database:process.env.MYSQL_DATABASE,connectionLimit:2,decimalNumbers:false});
const interval=Math.max(15000,Number(process.env.SYNC_INTERVAL_MS||60000));
const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let syncing=false;
async function sync(){
 if(syncing)return;
 syncing=true;
 try{
  // Service-role query bypasses RLS; do not expose this API to players.
  const {data:links,error}=await db.from('minecraft_links').select('user_id,minecraft_uuid');
  if(error)throw error;
  for(const link of links||[]){
   try{
    const [rows]=await pool.execute("SELECT waehrung, betrag FROM sf_coins_konten WHERE uuid = ? AND waehrung IN ('coins','funitys','gems')",[link.minecraft_uuid]);
    const values={};
    for(const row of rows)if(['coins','funitys','gems'].includes(row.waehrung))values[row.waehrung]=String(row.betrag);
    // Missing currency rows are left as null, not invented as zero.
    const {error:writeError}=await db.from('player_currencies').upsert({user_id:link.user_id,coins:values.coins??null,funitys:values.funitys??null,gems:values.gems??null,updated_at:new Date().toISOString()},{onConflict:'user_id'});
    if(writeError)throw writeError;
   }catch(error){console.error('Sync failed for one linked account:',error.message);}
  }
 }catch(error){console.error('Sync cycle failed:',error.message);}finally{syncing=false;}
}
const server=http.createServer(async(req,res)=>{
 const send=(status,obj)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(obj));};
 if(req.method!=='POST'||req.url!=='/claim')return send(404,{error:'Not found'});
 const auth=req.headers.authorization||'';
 const expected='Bearer '+process.env.LINK_SHARED_SECRET;
 const a=Buffer.from(auth),b=Buffer.from(expected);
 if(a.length!==b.length||!timingSafeEqual(a,b))return send(401,{error:'Unauthorized'});
 let body='';
 try{
  for await(const chunk of req){body+=chunk;if(body.length>1024)return send(413,{error:'Too large'});}
  const {code,uuid}=JSON.parse(body);
  if(typeof code!=='string'||!/^[A-F0-9]{12}$/.test(code)||typeof uuid!=='string'||!uuidPattern.test(uuid))return send(400,{error:'Invalid input'});
  const {error}=await db.rpc('redeem_minecraft_link_code',{p_code:code,p_minecraft_uuid:uuid});
  if(error)return send(400,{error:'Invalid or expired code, or account already linked'});
  void sync();
  return send(200,{ok:true});
 }catch(error){console.error('Claim failed:',error.message);return send(500,{error:'Server error'});}
});
server.requestTimeout=10000;
server.listen(Number(process.env.PORT||8787),process.env.HOST||'127.0.0.1',()=>console.log('SkyFunitySync ready'));
setInterval(()=>void sync(),interval).unref();
void sync();
