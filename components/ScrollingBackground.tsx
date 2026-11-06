"use client";
import {useEffect,useState} from "react";
export default function ScrollingBackground({images}:{images:string[]}){
 const [progress,setProgress]=useState(0);
 useEffect(()=>{
 let frame=0;
 const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
 const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
 setProgress(Math.max(0,Math.min(1,window.scrollY/max)));
 });};
 update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);
 return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",update);window.removeEventListener("resize",update)};
 },[]);
 if(images.length<2)return null;
 const position=progress*(images.length-1);
 const index=Math.min(images.length-1,Math.floor(position));
 const fraction=position-index;
 return <div className="sky-scroll-background" aria-hidden="true">
 {images.map((url,i)=>{
 const opacity=i===index?1-fraction:i===index+1?fraction:0;
 const distance=(position-i)*24;
 return <div key={url+i} className="sky-scroll-background-image" style={{backgroundImage:`url("${url.replace(/["\\]/g,"")}")`,opacity,transform:`scale(1.11) translate3d(0,${distance}px,0)`}}/>;
 })}
 <div className="sky-scroll-background-shade"/>
 </div>;
}
