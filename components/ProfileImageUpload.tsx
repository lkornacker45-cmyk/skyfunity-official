"use client";
import {useState} from "react";
type Props={value:string;onChange:(url:string)=>void;kind?:"team"|"rank"};
export default function ProfileImageUpload({value,onChange,kind="team"}:Props){
 const title=kind==="rank"?"Rangbild":"Profilbild";
 const [dragging,setDragging]=useState(false);
 const [uploading,setUploading]=useState(false);
 const [error,setError]=useState("");
 async function upload(file?:File){
 if(!file)return;
 setError("");
 if(file.size>2*1024*1024){setError("Das Bild darf maximal 2 MB groß sein.");return}
 if(!["image/png","image/jpeg","image/webp","image/gif"].includes(file.type)){setError("Bitte PNG, JPG, WebP oder GIF auswählen.");return}
 setUploading(true);
 try{
 const form=new FormData();form.append("file",file);form.append("kind",kind);
 const r=await fetch("/api/admin/upload",{method:"POST",body:form});
 const result=await r.json();
 if(!r.ok||typeof result.url!=="string")throw Error(result.error||"Upload fehlgeschlagen");
 onChange(result.url);
 }catch(e){setError(e instanceof Error?e.message:"Upload fehlgeschlagen")}
 finally{setUploading(false)}
 }
 return <div className="space-y-3 md:col-span-2">
 <p className="text-sm text-purple-200">{title} hochladen (max. 2 MB)</p>
 <label onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={e=>{e.preventDefault();setDragging(false)}} onDrop={e=>{e.preventDefault();setDragging(false);void upload(e.dataTransfer.files[0])}} className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition ${dragging?"border-purple-300 bg-purple-500/20":"border-purple-400/40 bg-black/20 hover:border-purple-300"}`}>
 {value?<img src={value} alt={`${title}-Vorschau`} className="h-24 w-24 rounded-2xl object-cover"/>:<span aria-hidden="true" className="text-4xl">🖼️</span>}
 <span className="text-sm font-semibold text-white">{uploading?"Bild wird hochgeladen …":"Bild hierher ziehen oder klicken"}</span>
 <span className="text-xs text-slate-400">PNG, JPG, WebP oder GIF · maximal 2 MB</span>
 <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} className="sr-only" onChange={e=>{void upload(e.target.files?.[0]);e.target.value=""}}/>
 </label>
 {error&&<p role="alert" className="text-sm text-rose-300">{error}</p>}
 {value&&<button type="button" className="text-sm text-rose-300" onClick={()=>onChange("")}>{title} entfernen</button>}
 <p className="text-xs text-slate-400">Das Bild wird sofort zu GitHub hochgeladen. Anschließend unten „Alle Änderungen speichern“ klicken, um es dem Profil zuzuordnen.</p>
 </div>
}
