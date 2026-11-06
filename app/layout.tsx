import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
export const metadata: Metadata = { title: "SkyFunity | Minecraft Server", description: "SkyFunity – Minecraft Java & Bedrock Community, Ränge, Team, Shop und Live-Status." };
const links = [{href:"/",label:"Startseite"},{href:"/ranks",label:"Ränge"},{href:"/features",label:"Features"},{href:"/team",label:"Team"}];
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="de"><body className="min-h-screen"><header className="sticky top-0 z-30 border-b border-purple-900/50 bg-[#0c0818]/95 backdrop-blur"><nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5"><Link href="/" className="text-2xl font-black tracking-tight text-purple-300">✦ SkyFunity</Link><div className="flex flex-wrap items-center gap-4 text-sm font-medium">{links.map(l=><Link key={l.href} href={l.href}>{l.label}</Link>)}<a href="https://discord.gg/BFrhHMYgrV" target="_blank" rel="noopener noreferrer">Discord</a><a className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500" href="https://skyfunity.de/shop" target="_blank" rel="noopener noreferrer">Shop ↗</a></div></nav></header><main>{children}</main><footer className="mt-24 border-t border-purple-900/30 px-5 py-8 text-center text-sm text-purple-200/60">© {new Date().getFullYear()} SkyFunity · Nicht mit Mojang oder Microsoft verbunden.</footer></body></html>
}
