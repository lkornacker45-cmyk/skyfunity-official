"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";

/** Refreshes server-rendered leaderboard data without a full page navigation.
 * Only refresh visible tabs so inactive visitors don't create unnecessary database traffic.
 */
export default function LeaderboardAutoRefresh(){
 const router=useRouter();
 const [lastRefresh,setLastRefresh]=useState<Date|null>(null);
 useEffect(()=>{
  let active=true;
  const refresh=()=>{
   if(!active||document.visibilityState!=="visible"||!navigator.onLine)return;
   router.refresh();
   setLastRefresh(new Date());
  };
  const interval=window.setInterval(refresh,60_000);
  const onFocus=()=>refresh();
  document.addEventListener("visibilitychange",onFocus);
  return ()=>{active=false;window.clearInterval(interval);document.removeEventListener("visibilitychange",onFocus)};
 },[router]);
 return <p className="mt-4 text-center text-xs text-slate-400" role="status" aria-live="off">
   <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true"/>
   Automatische Ranglisten-Aktualisierung alle 60 Sekunden
   {lastRefresh&&<> · Zuletzt abgefragt: {lastRefresh.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}</>}
 </p>;
}
