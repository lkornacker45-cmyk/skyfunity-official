import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(){
 let online=false,players:null|number=null,maxPlayers:null|number=null,discordMembers:null|number=null,discordOnline:null|number=null;
 try {const r=await fetch("https://api.mcsrvstat.us/3/skyfunity.de",{next:{revalidate:45},signal:AbortSignal.timeout(6000)});if(r.ok){const d=await r.json();online=Boolean(d.online);players=typeof d.players?.online==="number"?d.players.online:null;maxPlayers=typeof d.players?.max==="number"?d.players.max:null}}catch{}
 const guild=process.env.DISCORD_GUILD_ID;
 if(guild&&/^\d{17,20}$/.test(guild)){try{const r=await fetch(`https://discord.com/api/guilds/${guild}/widget.json`,{next:{revalidate:45},signal:AbortSignal.timeout(6000)});if(r.ok){const d=await r.json();discordOnline=typeof d.presence_count==="number"?d.presence_count:null}}catch{}}
 return NextResponse.json({online,players,maxPlayers,discordMembers,discordOnline,checkedAt:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}});
}
