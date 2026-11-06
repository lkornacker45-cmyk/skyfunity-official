"use client";
import {useRef,useState} from "react";
export default function BackgroundGallery({images,onChange,onSelect,selected}:{images:string[];onChange:(images:string[])=>void;onSelect:(url:string)=>void;selected:string}){
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 const input=useRef<HTMLInputElement>(null);
 async function upload(files:FileList|null){
 if(!files?.length)return;setBusy(true);setError("");
 try{
 const next=[...images];
 for(const file of Array.from(files)){
 if(next.length>=12)throw Error("Maximal 12 Hintergrundbilder.");
 if(file.size>5*1024*1024)throw Error("Bitte Bilder unter 5 MB verwenden.");
 const form=new FormData();form.append("file",file);form.append("kind","background");
 const response=await fetch("/api/admin/upload",{method:"POST",body:form});
 const data=await response.json();
 if(!response.ok||!data.url)throw Error(data.error||"Upload fehlgeschlagen");
 next.push(data.url);
 }
 onChange(next);onSelect(next[next.length-1]);
 }catch(e){setError(e instanceof Error?e.message:"Upload fehlgeschlagen")}finally{setBusy(false);if(input.current)input.current.value=""}
 }
 return <div className="space-y-4">
 <p className="text-sm text-purple-200">Deine Hintergrundbilder ({images.length}/12)</p>
 <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
 {images.map((url,i)=><div key={url+i} className="overflow-hidden rounded-xl border border-purple-400/30 bg-black/30">
 <button type="button" onClick={()=>onSelect(url)} className={`block w-full border-2 ${selected===url?"border-purple-400":"border-transparent"}`} aria-label={`Hintergrund ${i+1} auswählen`}><img src={url} alt={`Hintergrund ${i+1}`} className="h-28 w-full object-cover"/><span className="block p-2 text-xs text-white">{selected===url?"✓ Ausgewählt":`Bild ${i+1} auswählen`}</span></button>
 <button type="button" className="w-full border-t border-purple-400/20 px-2 py-2 text-xs text-rose-200 hover:bg-rose-500/10" onClick={()=>onChange(images.filter((_,j)=>j!==i))}>Aus Galerie entfernen</button>
 </div>)}
 </div>
 <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();void upload(e.dataTransfer.files)}} className="rounded-xl border-2 border-dashed border-purple-400/40 p-5 text-center">
 <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple className="hidden" onChange={e=>void upload(e.target.files)}/>
 <button type="button" disabled={busy||images.length>=12} onClick={()=>input.current?.click()} className="rounded-xl bg-purple-600 px-4 py-3 font-bold text-white disabled:opacity-50">{busy?"Bilder werden hochgeladen …":"Bilder auswählen oder hierher ziehen"}</button>
 <p className="mt-2 text-xs text-slate-400">JPG, PNG, WebP · max. 5 MB pro Bild. Danach unten alle Änderungen speichern.</p>
 </div>
 {error&&<p role="alert" className="text-sm text-rose-300">{error}</p>}
 </div>;
}
