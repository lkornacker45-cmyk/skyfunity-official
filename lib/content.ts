import "server-only";
import defaults from "@/data/content.json";
import {siteCopyDefaults,type SiteCopy} from "@/lib/site-copy";
export type Content={appearance?:{background:string;backgroundImage:string;particles:string;intensity:number};copy?:SiteCopy;theme?:"default"|"christmas"|"easter"|"halloween"|"newyear"|"summer"|"winter";headings?:Record<"team"|"ranks"|"features",{before:string;highlight:string;description:string}>;server:{name:string;address:string;discord:string;shop:string};ranks:{name:string;color:string;benefits:string[];image?:string}[];team:{name:string;role:string;avatar?:string;bio?:string;tasks?:string;since?:string}[];features:{title:string;description:string}[]};
export const defaultContent:Content=validateContent(defaults)!;
const OWNER="lkornacker45-cmyk",REPO="skyfunity-official",PATH="data/content.json";
export function validateContent(value:unknown):Content|null{
 if(!value||typeof value!=="object")return null;
 const v=value as Record<string,unknown>,s=v.server as Record<string,unknown>;
 const str=(x:unknown,max:number)=>typeof x==="string"&&x.trim().length>0&&x.length<=max;
 if(!s||!str(s.name,60)||!str(s.address,255)||!str(s.discord,300)||!str(s.shop,300))return null;
 if(!/^[a-z0-9.-]+(?::\d{1,5})?$/i.test(s.address as string))return null;
 for(const key of ["discord","shop"]){try{const url=new URL(s[key] as string);if(url.protocol!=="https:"||url.username||url.password)return null}catch{return null}}
 if(!Array.isArray(v.ranks)||v.ranks.length>25||!v.ranks.every((x:Record<string,unknown>)=>x&&str(x.name,60)&&typeof x.color==="string"&&["text-fuchsia-300","text-violet-300","text-amber-300","text-purple-300","text-emerald-300","text-sky-300"].includes(x.color)&&Array.isArray(x.benefits)&&x.benefits.length<=20&&x.benefits.every((b:unknown)=>str(b,160))&&(x.image===undefined||x.image===""||(typeof x.image==="string"&&x.image.length<=500&&/^https:\/\/[^\s]+$/i.test(x.image)&&(()=>{try{const u=new URL(x.image as string);return !u.username&&!u.password}catch{return false}})()))))return null;
 if(!Array.isArray(v.team)||v.team.length>50||!v.team.every((x:Record<string,unknown>)=>x&&str(x.name,60)&&str(x.role,80)&&(x.bio===undefined||typeof x.bio==="string"&&x.bio.length<=1200)&&(x.tasks===undefined||typeof x.tasks==="string"&&x.tasks.length<=300)&&(x.since===undefined||typeof x.since==="string"&&x.since.length<=80)&&(x.avatar===undefined||x.avatar===""||(typeof x.avatar==="string"&&x.avatar.length<=500&&/^https:\/\/[^\s]+$/i.test(x.avatar)&&(()=>{try{const u=new URL(x.avatar as string);return !u.username&&!u.password}catch{return false}})()))))return null;
 if(!Array.isArray(v.features)||v.features.length>30||!v.features.every((x:Record<string,unknown>)=>x&&str(x.title,80)&&str(x.description,600)))return null;
 const headings:Content["headings"]={team:{before:"Das",highlight:"Team",description:"Die Menschen hinter SkyFunity."},ranks:{before:"Unsere",highlight:"Ränge",description:"Entdecke unsere Ränge und Vorteile."},features:{before:"Entdecke",highlight:"SkyFunity",description:"Das bietet unsere Community."}};
 if(v.headings!==undefined){if(!v.headings||typeof v.headings!=="object")return null;const h=v.headings as Record<string,unknown>;for(const key of ["team","ranks","features"] as const){const item=h[key] as Record<string,unknown>|undefined;if(!item||!str(item.before,80)||!str(item.highlight,80)||!str(item.description,300))return null;headings[key]={before:item.before as string,highlight:item.highlight as string,description:item.description as string}}}
 const copy:SiteCopy={...siteCopyDefaults};
 if(v.copy!==undefined){if(!v.copy||typeof v.copy!=="object"||Array.isArray(v.copy))return null;const values=v.copy as Record<string,unknown>;for(const key of Object.keys(siteCopyDefaults) as (keyof SiteCopy)[]){if(values[key]!==undefined){if(!str(values[key],600))return null;copy[key]=values[key] as string}}}
 const theme=v.theme===undefined?"default":v.theme;
 if(!["default","christmas","easter","halloween","newyear","summer","winter"].includes(theme as string))return null;
 const appearance={background:"theme",backgroundImage:"",particles:"off",intensity:12};
 if(v.appearance!==undefined){if(!v.appearance||typeof v.appearance!=="object"||Array.isArray(v.appearance))return null;const a=v.appearance as Record<string,unknown>;
 if(typeof a.background!=="string"||!["theme","stars","gradient","solid","image"].includes(a.background))return null;
 if(typeof a.backgroundImage!=="string"||a.backgroundImage.length>500)return null;
 if(a.backgroundImage&&(!/^https:\/\/[^\s]+$/i.test(a.backgroundImage)||(()=>{try{const u=new URL(a.backgroundImage as string);return !!u.username||!!u.password}catch{return true}})()))return null;
 if(typeof a.particles!=="string"||!["off","snow","stars","hearts","pumpkins","leaves","eggs","sparkles"].includes(a.particles))return null;
 if(typeof a.intensity!=="number"||!Number.isInteger(a.intensity)||a.intensity<3||a.intensity>30)return null;
 Object.assign(appearance,a)}
 return {appearance,copy,theme:theme as Content["theme"],headings,server:{name:s.name as string,address:s.address as string,discord:s.discord as string,shop:s.shop as string},ranks:v.ranks,team:v.team,features:v.features} as Content;
}
export async function getContent():Promise<Content>{
 try{
 const r=await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,{headers:{"Accept":"application/vnd.github.raw+json","User-Agent":"SkyFunity-Website"},cache:"no-store",signal:AbortSignal.timeout(5000)});
 if(!r.ok)return defaultContent;
 const body=await r.text();
 const parsed=JSON.parse(body);
 // GitHub may return JSON content envelope rather than raw file.
 const data=parsed&&typeof parsed.content==="string"?JSON.parse(Buffer.from(parsed.content.replace(/\s/g,""),"base64").toString("utf8")):parsed;
 return validateContent(data)||defaultContent;
 }catch{return defaultContent}
}
