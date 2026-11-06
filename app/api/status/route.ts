import {NextResponse} from "next/server";
import {getContent} from "@/lib/content";
export const dynamic="force-dynamic";
const TWELVE_HOURS=43200;
type Edition={online:boolean|null;players:number|null;maxPlayers:number|null};
async function getEdition(url:string):Promise<Edition>{try{const r=await fetch(url,{next:{revalidate:TWELVE_HOURS},signal:AbortSignal.timeout(6000)});if(!r.ok)return{online:null,players:null,maxPlayers:null};const d=await r.json();return{online:typeof d.online==="boolean"?d.online:null,players:typeof d.players?.online==="number"?d.players.online:null,maxPlayers:typeof d.players?.max==="number"?d.players.max:null}}catch{return{online:null,players:null,maxPlayers:null}}}
async function getDiscord(guild:string|undefined){
 if(!guild||!/^\d{17,20}$/.test(guild))return{online:null,reason:"missing" as const};
 try{const r=await fetch(`https://discord.com/api/guilds/${guild}/widget.json`,{cache:"no-store",signal:AbortSignal.timeout(6000)});
  if(r.status===403||r.status===404)return{online:null,reason:"widget" as const};
  if(!r.ok)return{online:null,reason:"unavailable" as const};
  const d=await r.json();return typeof d.presence_count==="number"?{online:d.presence_count,reason:null}:{online:null,reason:"unavailable" as const};
 }catch{return{online:null,reason:"unavailable" as const}}
}
export async function GET(){
 const {server}=await getContent();
 const guild=server.discordGuildId||process.env.DISCORD_GUILD_ID;
 const address=encodeURIComponent(server.address);
 const [java,bedrock,discord]=await Promise.all([getEdition(`https://api.mcsrvstat.us/3/${address}`),getEdition(`https://api.mcsrvstat.us/bedrock/3/${address}`),getDiscord(guild)]);
 return NextResponse.json({java,bedrock,discordOnline:discord.online,discordReason:discord.reason,checkedAt:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}});
}
