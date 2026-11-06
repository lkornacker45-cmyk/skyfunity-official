import {randomBytes,pbkdf2Sync} from "node:crypto";
import {createInterface} from "node:readline/promises";
import {stdin as input,stdout as output} from "node:process";
const rl=createInterface({input,output});
try{
 const password=await rl.question("Neues Admin-Passwort (mindestens 12 Zeichen):");
 if(password.length<12)throw Error("Mindestens 12 Zeichen erforderlich.");
 const salt=randomBytes(16);
 const hash=pbkdf2Sync(password,salt,210000,32,"sha256");
 console.log("\nADMIN_PASSWORD_HASH="+salt.toString("hex")+":"+hash.toString("hex"));
 console.log("ADMIN_SESSION_SECRET="+randomBytes(48).toString("hex"));
 console.log("\nDiese Werte ausschließlich in die Hosting-Umgebungsvariablen eintragen. Nicht committen.");
}finally{rl.close()}
