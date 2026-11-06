import {NextResponse} from "next/server";
import {getContent} from "@/lib/content";
export const dynamic="force-dynamic";
export async function GET(){
 const {server}=await getContent();
 const guild=server.discordGuildId||process.env.DISCORD_GUILD_ID;
 if(!guild||!/^\d{17,20}$/.test(guild))return NextResponse.json({discordOnline:null,discordReason:"missing"},{headers:{"Cache-Control":"no-store"}});
 try{
  const r=await fetch(`https://discord.com/api/guilds/${guild}/widget.json`,{cache:"no-store",signal:AbortSignal.timeout(6000)});
  if(r.status===403||r.status===404)return NextResponse.json({discordOnline:null,discordReason:"widget"},{headers:{"Cache-Control":"no-store"}});
  if(!r.ok)throw Error("Discord API unavailable");
  const d=await r.json();
  const discordOnline=typeof d.presence_count==="number"?d.presence_count:null;
  return NextResponse.json({discordOnline,discordReason:discordOnline===null?"unavailable":null},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({discordOnline:null,discordReason:"unavailable"},{headers:{"Cache-Control":"no-store"}})}
}
