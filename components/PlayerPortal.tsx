"use client";
import {useEffect,useState} from "react";
import {createClient, type SupabaseClient, type User} from "@supabase/supabase-js";

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
 const [profile,setProfile]=useState<Profile|null>(null);
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
    {mode!=="new-password"&&<label className="block text-sm">E-Mail<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="sky-portal-input mt-1"/></label>
    {mode==="register"&&<label className="block text-sm">Minecraft-Name<input required minLength={3} maxLength={16} pattern="[A-Za-z0-9_]{3,16}" autoComplete="nickname" value={minecraft} onChange={e=>setMinecraft(e.target.value)} className="sky-portal-input mt-1"/></label>}
    {mode!=="reset"&&<label className="block text-sm">Passwort<input required type="password" minLength={mode==="register"?10:1} autoComplete={mode==="register"?"new-password":"current-password"} value={password} onChange={e=>setPassword(e.target.value)} className="sky-portal-input mt-1"/></label>}
    <button disabled={busy} className="sky-portal-button">{busy?"Bitte warten…":mode==="register"?"Account erstellen":mode==="reset"?"E-Mail senden":mode==="new-password"?"Passwort speichern":"Anmelden"}</button>
   </form>
  </section>:<>
   <section className="sky-portal-panel flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-bold">Hallo, {profile?.minecraft_name||user.email}!</h2><p className="text-sm text-purple-200">{staff?"Team-Zugang aktiviert":"Spieler-Account"} · {user.email}</p></div><button className="sky-portal-tab" onClick={()=>void client.auth.signOut()}>Abmelden</button></section>
   <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
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
   </div>
  </>}
 </div>;
}
