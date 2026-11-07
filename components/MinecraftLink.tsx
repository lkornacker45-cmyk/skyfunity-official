"use client";
import {useCallback,useEffect,useState} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";

export default function MinecraftLink({db,userId}:{db:SupabaseClient;userId:string}){
 const [uuid,setUuid]=useState<string|null>(null);
 const [code,setCode]=useState("");
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [ready,setReady]=useState(false);
 const refresh=useCallback(async()=>{
  const {data,error}=await db.from("minecraft_links").select("minecraft_uuid").eq("user_id",userId).maybeSingle();
  if(error){setMessage("Minecraft-Verknüpfung noch nicht eingerichtet. Bitte zuerst supabase/minecraft-link.sql ausführen.");}
  else {setUuid(data?.minecraft_uuid||null);if(data?.minecraft_uuid)setCode("");}
  setReady(true);
 },[db,userId]);
 useEffect(()=>{void refresh();const interval=setInterval(()=>void refresh(),15000);return ()=>clearInterval(interval);},[refresh]);
 async function createCode(){
  setBusy(true);setMessage("");
  const {data,error}=await db.rpc("create_minecraft_link_code");
  if(error)setMessage(error.message);
  else{setCode(String(data));setMessage("Code ist 10 Minuten gültig. Gib ihn im Minecraft-Chat ein.");}
  setBusy(false);
 }
 return <section className="sky-portal-panel" aria-label="Minecraft-Account verbinden">
  <h2 className="mb-2 text-xl font-bold">Minecraft-Account verbinden</h2>
  {!ready?<p className="text-purple-200">Verknüpfung wird geladen…</p>:uuid?
   <p className="text-purple-100">✓ Dein Minecraft-Account ist sicher verknüpft. UUID: <span className="break-all font-mono text-sm">{uuid}</span></p>:
   <><p className="mb-4 text-sm text-purple-200">Erstelle einen einmaligen Code und gib ihn auf dem SkyFunity-Folia-Server mit <strong>/websitelink CODE</strong> ein. Dein Minecraft-Name allein reicht nicht als Nachweis.</p>
    {code&&<div className="sky-player-stat-tile mb-3"><p className="text-sm text-purple-200">Dein einmaliger Verbindungscode</p><p className="my-2 select-all break-all font-mono text-2xl font-bold tracking-widest">{code}</p><p className="text-sm">/websitelink {code}</p></div>}
    <button type="button" disabled={busy} onClick={()=>void createCode()} className="sky-portal-button">{busy?"Bitte warten…":code?"Neuen Code erstellen":"Verbindungscode erstellen"}</button>
    <button type="button" className="sky-portal-tab ml-3" onClick={()=>void refresh()}>Verbindung prüfen</button>
   </>}
  {message&&<p role="status" className="mt-3 text-sm text-purple-200">{message}</p>}
 </section>;
}
