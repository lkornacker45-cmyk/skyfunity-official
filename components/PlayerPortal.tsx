"use client";
import {useEffect,useState} from "react";
import {createClient, type SupabaseClient, type User} from "@supabase/supabase-js";
import PlayerStats from "@/components/PlayerStats";
import MinecraftLink from "@/components/MinecraftLink";

type Ticket={id:string;owner_id:string;category:string;subject:string;status:string;created_at:string;updated_at:string};
type Message={id:string;ticket_id:string;author_id:string;body:string;created_at:string};
type Profile={id:string;minecraft_name:string;role:string};
const categories=["Allgemein","Spieler melden","Shop & Ränge","Bug melden","Entbannung","Sonstiges"];
const statusLabel:Record<string,string>={open:"Offen",in_progress:"In Bearbeitung",closed:"Geschlossen"};
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const client=url&&key?createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;

export default function PlayerPortal(){
 const [user,setUser]=useState<User|null>(null);
 const [section,setSection]=useState<"overview"|"stats"|"link"|"tickets">("overview");
 useEffect(()=>{
  const update=()=>{
   const tab=new URLSearchParams(window.location.search).get("tab");
   setSection(tab==="stats"||tab==="link"||tab==="tickets"?tab:"overview");
  };
  update();
  window.addEventListener("popstate",update);
  return ()=>window.removeEventListener("popstate",update);
 },[]);
 const [profile,setProfile]=useState<Profile|null>(null);
 const [linkedUuid,setLinkedUuid]=useState<string|null>(null);
 const [linkStatus,setLinkStatus]=useState<"loading"|"ready"|"unavailable">("loading");
 const [newPassword,setNewPassword]=useState("");
 const [confirmPassword,setConfirmPassword]=useState("");
 const [passwordBusy,setPasswordBusy]=useState(false);
 const [tickets,setTickets]=useState<Ticket[]>([]);
 const [messages,setMessages]=useState<Message[]>([]);
 const [selected,setSelected]=useState<string|null>(null);
 const [mode,setMode]=useState<"login"|"register"|"reset"|"new-password">("login");
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [minecraft,setMinecraft]=useState("");
 const [category,setCategory]=useState(categories[0]);const [subject,setSubject]=useState("");const [firstMessage,setFirstMessage]=useState("");const [reply,setReply]=useState("");
 const [notice,setNotice]=useState("");const [busy,setBusy]=useState(false);
 const staff=profile?.role==="team"||profile?.role==="admin";
 const active=tickets.find(t=>t.id===selected);
 async function refresh(db:SupabaseClient,u:User){
  const [p,t]=await Promise.all([db.from("profiles").select("id,minecraft_name,role").eq("id",u.id).maybeSingle(),db.from("tickets").select("id,owner_id,category,subject,status,created_at,updated_at").order("updated_at",{ascending:false}).limit(100)]);
  if(p.error||t.error){setNotice(p.error?.message||t.error?.message||"Daten konnten nicht geladen werden.");return;}
  setProfile(p.data);setTickets(t.data||[]);
 }
 useEffect(()=>{
  if(!client)return;
  const db=client;
  let alive=true;
  db.auth.getUser().then(({data})=>{if(alive){setUser(data.user);if(data.user)void refresh(db,data.user);}});
  const {data:{subscription}}=db.auth.onAuthStateChange((_event,session)=>{if(!alive)return;if(_event==="PASSWORD_RECOVERY")setMode("new-password");setUser(session?.user||null);if(session?.user)void refresh(db,session.user);else{setTickets([]);setMessages([]);setProfile(null);setSelected(null);}});
  return ()=>{alive=false;subscription.unsubscribe();};
 },[]);
 useEffect(()=>{
  if(!client||!user){setLinkedUuid(null);setLinkStatus("loading");return;}
  const db=client;
  let active=true;
  async function loadLink(){
   const {data,error}=await db.from("minecraft_links").select("minecraft_uuid").eq("user_id",user!.id).maybeSingle();
   if(!active)return;
   setLinkedUuid(error?null:data?.minecraft_uuid||null);
   setLinkStatus(error?"unavailable":"ready");
  }
  void loadLink();
  const interval=setInterval(()=>void loadLink(),15000);
  return ()=>{active=false;clearInterval(interval);};
 },[user?.id]);
 useEffect(()=>{
  if(!client||!selected||!user)return;
  client.from("ticket_messages").select("id,ticket_id,author_id,body,created_at").eq("ticket_id",selected).order("created_at",{ascending:true}).then(({data,error})=>{if(error)setNotice(error.message);else setMessages(data||[]);});
 },[selected,user]);
 async function authenticate(e:React.FormEvent){e.preventDefault();if(!client)return;setBusy(true);setNotice("");
  try{
   if(mode==="new-password"){if(password.length<10){setNotice("Bitte ein neues Passwort mit mindestens 10 Zeichen wählen.");return;}const {error}=await client.auth.updateUser({password});if(error)throw error;setMode("login");setPassword("");setNotice("Passwort erfolgreich geändert.");}
   else if(mode==="reset"){const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+"/account"});if(error)throw error;setNotice("Wenn das Konto existiert, erhältst du eine E-Mail zum Zurücksetzen.");}
   else if(mode==="register"){
    if(!/^[A-Za-z0-9_]{3,16}$/.test(minecraft)){setNotice("Minecraft-Name: 3–16 Zeichen, nur Buchstaben, Zahlen und _.");return;}
    if(password.length<10){setNotice("Bitte ein Passwort mit mindestens 10 Zeichen wählen.");return;}
    const {error}=await client.auth.signUp({email,password,options:{data:{minecraft_name:minecraft},emailRedirectTo:window.location.origin+"/account"}});if(error)throw error;
    setNotice("Registrierung eingereicht! Bitte bestätige deine E-Mail, bevor du dich anmeldest.");
   }else{const {error}=await client.auth.signInWithPassword({email,password});if(error)throw error;setNotice("Angemeldet.");}
  }catch(e){setNotice(e instanceof Error?e.message:"Ein Fehler ist aufgetreten.");}finally{setBusy(false);}
 }
 async function changePassword(e:React.FormEvent){
  e.preventDefault();
  if(!client||!user||passwordBusy)return;
  if(newPassword.length<10){setNotice("Das neue Passwort muss mindestens 10 Zeichen haben.");return;}
  if(newPassword!==confirmPassword){setNotice("Die Passwörter stimmen nicht überein.");return;}
  setPasswordBusy(true);setNotice("");
  try{
   const {error}=await client.auth.updateUser({password:newPassword});
   if(error)throw error;
   setNewPassword("");setConfirmPassword("");
   setNotice("Dein Passwort wurde erfolgreich geändert.");
  }catch(e){setNotice(e instanceof Error?e.message:"Passwort konnte nicht geändert werden.");}
  finally{setPasswordBusy(false);}
 }
 function showTickets(ticketId?:string){
  if(ticketId)setSelected(ticketId);
  setSection("tickets");
  if(typeof window!=="undefined")window.history.pushState(null,"","/account?tab=tickets");
 }
 async function createTicket(e:React.FormEvent){e.preventDefault();if(!client||!user)return;setBusy(true);setNotice("");
  try{
   if(subject.trim().length<5||subject.trim().length>120||!firstMessage.trim()||firstMessage.length>4000){setNotice("Betreff: 5–120 Zeichen. Nachricht: 1–4000 Zeichen.");return;}
   const {data,error}=await client.from("tickets").insert({owner_id:user.id,category,subject:subject.trim()}).select("id").single();if(error)throw error;
   const {error:messageError}=await client.from("ticket_messages").insert({ticket_id:data.id,author_id:user.id,body:firstMessage.trim()});if(messageError)throw messageError;
   setSubject("");setFirstMessage("");await refresh(client,user);setSelected(data.id);setNotice("Ticket erstellt!");
  }catch(e){setNotice(e instanceof Error?e.message:"Ticket konnte nicht erstellt werden.");}finally{setBusy(false);}
 }
 async function sendReply(e:React.FormEvent){e.preventDefault();if(!client||!user||!active||!reply.trim())return;setBusy(true);setNotice("");
  try{const {error}=await client.from("ticket_messages").insert({ticket_id:active.id,author_id:user.id,body:reply.trim()});if(error)throw error;setReply("");
   const {data,error:loadError}=await client.from("ticket_messages").select("id,ticket_id,author_id,body,created_at").eq("ticket_id",active.id).order("created_at");if(loadError)throw loadError;setMessages(data||[]);await refresh(client,user);
  }catch(e){setNotice(e instanceof Error?e.message:"Nachricht konnte nicht gesendet werden.");}finally{setBusy(false);}
 }
 async function changeStatus(status:string){if(!client||!user||!active||!staff)return;setBusy(true);setNotice("");
  const {error}=await client.from("tickets").update({status}).eq("id",active.id);if(error)setNotice(error.message);else await refresh(client,user);setBusy(false);
 }
 if(!client)return <div className="sky-portal-panel"><h2 className="text-xl font-bold">Account-System wird eingerichtet</h2><p className="mt-3 text-slate-300">Die Supabase-Verbindung fehlt noch. Bitte zuerst NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel hinterlegen und das SQL-Schema ausführen. Bis dahin sind Registrierung und Tickets deaktiviert.</p></div>;
 return <div className="sky-portal space-y-6">
  {notice&&<p role="status" className="sky-portal-notice">{notice}</p>}
  {(!user||mode==="new-password")?<section className="sky-portal-panel mx-auto max-w-xl">
   <div className="mb-5 flex flex-wrap gap-2">{([["login","Anmelden"],["register","Registrieren"],["reset","Passwort vergessen"]] as const).map(([id,label])=><button type="button" key={id} onClick={()=>{setMode(id);setNotice("");}} className={"sky-portal-tab "+(mode===id?"sky-portal-tab-active":"")}>{label}</button>)}</div>
   <h2 className="mb-5 text-2xl font-bold">{mode==="register"?"SkyFunity-Account erstellen":mode==="reset"?"Passwort zurücksetzen":mode==="new-password"?"Neues Passwort festlegen":"Willkommen zurück!"}</h2>
   <form onSubmit={authenticate} className="space-y-4">
    {mode!=="new-password"&&<label className="block text-sm">E-Mail<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="sky-portal-input mt-1"/></label>}
    {mode==="register"&&<label className="block text-sm">Minecraft-Name<input required minLength={3} maxLength={16} pattern="[A-Za-z0-9_]{3,16}" autoComplete="nickname" value={minecraft} onChange={e=>setMinecraft(e.target.value)} className="sky-portal-input mt-1"/></label>}
    {mode!=="reset"&&<label className="block text-sm">Passwort<input required type="password" minLength={mode==="register"?10:1} autoComplete={mode==="register"?"new-password":"current-password"} value={password} onChange={e=>setPassword(e.target.value)} className="sky-portal-input mt-1"/></label>}
    <button disabled={busy} className="sky-portal-button">{busy?"Bitte warten…":mode==="register"?"Account erstellen":mode==="reset"?"E-Mail senden":mode==="new-password"?"Passwort speichern":"Anmelden"}</button>
   </form>
  </section>:<>
   <section className="sky-portal-panel flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-bold">Hallo, {profile?.minecraft_name||user.email}!</h2><p className="text-sm text-purple-200">{staff?"Team-Zugang aktiviert":"Spieler-Account"} · {user.email}</p></div><button className="sky-portal-tab" onClick={()=>void client.auth.signOut()}>Abmelden</button></section>
   {section==="overview"&&<div className="space-y-6">
    <section className="sky-portal-panel">
     <h2 className="mb-5 text-2xl font-bold text-cyan-200">Account & Sicherheit</h2>
     <div className="grid gap-4 sm:grid-cols-2">
      <div className="sky-player-stat-tile"><p className="mb-2 text-sm text-purple-200">Minecraft-Benutzername</p><p className="break-words font-bold">{profile?.minecraft_name||"Nicht hinterlegt"}</p></div>
      <div className="sky-player-stat-tile"><p className="mb-2 text-sm text-purple-200">E-Mail-Adresse</p><p className="break-all font-bold">{user.email||"Nicht hinterlegt"}</p></div>
      <div className="sky-player-stat-tile"><p className="mb-2 text-sm text-purple-200">Minecraft-Verknüpfung</p><p className="font-bold">{linkStatus==="loading"?"Wird geprüft…":linkStatus==="unavailable"?"Zurzeit nicht abrufbar":linkedUuid?"✓ Verbunden":"Noch nicht verbunden"}</p>{linkedUuid&&<p className="mt-2 break-all text-xs text-purple-200">UUID: {linkedUuid}</p>}<button type="button" className="sky-portal-tab mt-3" onClick={()=>{setSection("link");window.history.pushState(null,"","/account?tab=link");}}>Minecraft verbinden</button></div>
      <div className="sky-player-stat-tile"><p className="mb-2 text-sm text-purple-200">Letzte Anmeldung</p><p className="font-bold">{user.last_sign_in_at?new Date(user.last_sign_in_at).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"}):"Nicht verfügbar"}</p></div>
     </div>
     <div className="mt-5 border-t border-purple-300/20 pt-5">
      <h3 className="mb-3 text-lg font-bold">Passwort ändern</h3>
      <form onSubmit={changePassword} className="grid gap-3 sm:grid-cols-2">
       <label className="block text-sm text-purple-100">Neues Passwort<input type="password" autoComplete="new-password" minLength={10} required value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="sky-portal-input mt-1"/></label>
       <label className="block text-sm text-purple-100">Passwort wiederholen<input type="password" autoComplete="new-password" minLength={10} required value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="sky-portal-input mt-1"/></label>
       <div className="sm:col-span-2"><button type="submit" disabled={passwordBusy} className="sky-portal-button">{passwordBusy?"Wird gespeichert…":"Passwort speichern"}</button></div>
      </form>
     </div>
    </section>
    <section className="sky-portal-panel">
     <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-cyan-200">{staff?"Offene Support-Tickets":"Meine offenen Tickets"}</h2><p className="mt-1 text-sm text-purple-200">{staff?"Alle für das Team sichtbaren offenen Tickets":"Deine noch nicht geschlossenen Anfragen"}</p></div><span className="rounded-full border border-purple-300/40 bg-purple-500/20 px-4 py-2 text-sm font-bold">{tickets.filter(t=>t.status!=="closed").length} offen</span></div>
     {tickets.filter(t=>t.status!=="closed").length===0?<p className="mb-4 text-purple-200">Aktuell keine offenen Tickets.</p>:<div className="mb-4 space-y-2">{tickets.filter(t=>t.status!=="closed").slice(0,5).map(t=><button type="button" key={t.id} onClick={()=>showTickets(t.id)} className="sky-ticket-item text-left"><span className="font-bold">{t.subject}</span><span className="text-xs text-purple-200">{t.category} · {statusLabel[t.status]||t.status}</span></button>)}</div>}
     <div className="flex flex-wrap gap-3"><button type="button" className="sky-portal-button" onClick={()=>showTickets()}>Neues Ticket erstellen</button><button type="button" className="sky-portal-tab" onClick={()=>showTickets()}>Alle Tickets ansehen</button></div>
    </section>
   </div>}
   {section==="link"&&<MinecraftLink db={client} userId={user.id}/>}
   {section==="stats"&&<PlayerStats db={client} userId={user.id} minecraftName={profile?.minecraft_name||"Spieler"}/>}
   {section==="tickets"&&<div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
    <div className="space-y-6">
     <section className="sky-portal-panel"><h2 className="mb-4 text-xl font-bold">{staff?"Alle Support-Tickets":"Meine Tickets"}</h2>
      {tickets.length===0?<p className="text-slate-300">Noch keine Tickets vorhanden.</p>:<div className="space-y-2">{tickets.map(t=><button key={t.id} type="button" onClick={()=>{setSelected(t.id);setNotice("");}} className={"sky-ticket-item "+(selected===t.id?"sky-ticket-active":"")}><span className="font-bold">{t.subject}</span><span className="text-xs text-purple-200">{t.category} · {statusLabel[t.status]||t.status}</span></button>)}</div>}
     </section>
     <section className="sky-portal-panel"><h2 className="mb-4 text-xl font-bold">Neues Ticket</h2><form onSubmit={createTicket} className="space-y-3">
      <label className="block text-sm">Kategorie<select value={category} onChange={e=>setCategory(e.target.value)} className="sky-portal-input mt-1">{categories.map(c=><option key={c}>{c}</option>)}</select></label>
      <label className="block text-sm">Betreff<input required minLength={5} maxLength={120} value={subject} onChange={e=>setSubject(e.target.value)} className="sky-portal-input mt-1"/></label>
      <label className="block text-sm">Nachricht<textarea required minLength={1} maxLength={4000} rows={4} value={firstMessage} onChange={e=>setFirstMessage(e.target.value)} className="sky-portal-input mt-1"/></label>
      <button disabled={busy} className="sky-portal-button">Ticket erstellen</button>
     </form></section>
    </div>
    <section className="sky-portal-panel">
     {!active?<div><h2 className="text-xl font-bold">Ticket-Verlauf</h2><p className="mt-3 text-slate-300">Wähle links ein Ticket aus, um Nachrichten zu lesen oder zu antworten.</p></div>:<>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold">{active.subject}</h2><p className="text-sm text-purple-200">{active.category} · {statusLabel[active.status]}</p></div>{staff&&<select aria-label="Ticket-Status ändern" value={active.status} disabled={busy} onChange={e=>void changeStatus(e.target.value)} className="sky-portal-input !w-auto"><option value="open">Offen</option><option value="in_progress">In Bearbeitung</option><option value="closed">Geschlossen</option></select>}</div>
      <div className="sky-ticket-messages space-y-3">{messages.map(m=><div key={m.id} className={"sky-ticket-message "+(m.author_id===user.id?"sky-ticket-own":"")}><p className="mb-1 text-xs text-purple-200">{m.author_id===user.id?"Du":"Nachricht von "+m.author_id.slice(0,8)} · {new Date(m.created_at).toLocaleString("de-DE")}</p><p className="whitespace-pre-wrap break-words">{m.body}</p></div>)}</div>
      {active.status!=="closed"?<form onSubmit={sendReply} className="mt-4 space-y-3"><label className="block text-sm">Antwort<textarea required maxLength={4000} rows={3} value={reply} onChange={e=>setReply(e.target.value)} className="sky-portal-input mt-1"/></label><button disabled={busy} className="sky-portal-button">Antwort senden</button></form>:<p className="mt-4 text-sm text-purple-200">Dieses Ticket ist geschlossen.</p>}
     </>}
    </section>
   </div>}
  </>}
 </div>;
}
