import "server-only";
import {createHmac, pbkdf2Sync, randomBytes, timingSafeEqual} from "node:crypto";
import {cookies} from "next/headers";
const COOKIE="skyfunity_admin";
function secret(){return process.env.ADMIN_SESSION_SECRET||""}
function digest(value:string){return createHmac("sha256",secret()).update(value).digest("hex")}
export function validPassword(password:string){
 const raw=process.env.ADMIN_PASSWORD_HASH||"";
 const parts=raw.split(":");
 if(parts.length!==2||!secret()||!/^([a-f0-9]{32})$/.test(parts[0])||!/^([a-f0-9]{64})$/.test(parts[1]))return false;
 const expected=Buffer.from(parts[1],"hex");
 const actual=pbkdf2Sync(password,Buffer.from(parts[0],"hex"),210000,32,"sha256");
 return timingSafeEqual(actual,expected);
}
export function newSession(){
 const payload=Buffer.from(JSON.stringify({expires:Date.now()+8*60*60*1000,nonce:randomBytes(16).toString("hex")})).toString("base64url");
 return payload+"."+digest(payload);
}
export function isAdmin(){
 if(!secret())return false;
 const value=cookies().get(COOKIE)?.value||"";
 const [payload,signature,...extra]=value.split(".");
 if(!payload||!signature||extra.length||!/^[a-f0-9]{64}$/.test(signature))return false;
 const actual=Buffer.from(digest(payload),"hex"),provided=Buffer.from(signature,"hex");
 if(!timingSafeEqual(actual,provided))return false;
 try{const data=JSON.parse(Buffer.from(payload,"base64url").toString());return typeof data.expires==="number"&&data.expires>Date.now()&&data.expires<Date.now()+8*60*60*1000}catch{return false}
}
export const adminCookie=COOKIE;
