import {NextResponse} from "next/server";
import {getContent} from "@/lib/content";
export const dynamic="force-dynamic";
type Edition={online:boolean|null;players:number|null;maxPlayers:number|null};
async function getEdition(url:string):Promise<Edition>{try{const r=await fetch(url,{next:{revalidate:45},signal:AbortSignal.timeout(6000)});if(!r.ok)return{online:null,players:null,maxPlayers:null};const d=await r.json();return{online:typeof d.online==="boolean"?d.online:null,players:typeof d.players?.online==="number"?d.players.online:null,maxPlayers:typeof d.players?.max==="number"?d.players.max:null}}catch{return{online:null,players:null,maxPlayers:null}}}
export async function GET(){
 const {server}=await getContent();
 const guild=process.env.DISCORD_GUILD_ID;
 const address=encodeURIComponent(server.address);
 const [java,bedrock,discordOnline]=await Promise.all([getEdition(`https://api.mcsrvstat.us/3/${address}`),getEdition(`https://api.mcsrvstat.us/bedrock/3/${address}`),(async()=>{if(!guild||!/^\d{17,20}$/.test(guild))return null;try{const r=await fetch(`https://discord.com/api/guilds/${guild}/widget.json`,{next:{revalidate:45},signal:AbortSignal.timeout(6000)});if(!r.ok)return null;const d=await r.json();return typeof d.presence_count==="number"?d.presence_count:null}catch{return null}})()]);
 return NextResponse.json({java,bedrock,discordOnline,checkedAt:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}});
}
