// Verified against the user-provided Tebex Headless packages response (snapshot).
// This allowlist intentionally excludes disabled/internal Tebex packages.
export type StoreCategory = "Ränge" | "Gems" | "Bundles";
export type StoreProduct = {
  id: number;
  name: string;
  category: StoreCategory;
  price: number;
  image: string;
  teaser: string;
  perks: string[];
  single: boolean;
  accent: "gold" | "purple" | "green" | "pink" | "cyan";
};
export const storeProducts: StoreProduct[] = [
  {id:7653830,name:"Gold Rang",category:"Ränge",price:2,image:"https://dunb17ur4ymx4.cloudfront.net/packages/images/de28229d754481c49e2465599c3b52df5b004149.webp",teaser:"Dein Einstieg in die Premium-Ränge – dauerhaft.",perks:["2 Plots","3 Homes","2 Vote-Keys pro Woche"],single:true,accent:"gold"},
  {id:7653835,name:"Galaxy Rang",category:"Ränge",price:4,image:"https://dunb17ur4ymx4.cloudfront.net/packages/images/6e7f9cd387c5f37f7075126418e87a4467c02c1d.webp",teaser:"Mehr Bauplatz, Teleport und Reparatur.",perks:["4 Plots","6 Homes","/repair und /ptp"],single:true,accent:"purple"},
  {id:7653836,name:"Toxic Rang",category:"Ränge",price:8,image:"https://dunb17ur4ymx4.cloudfront.net/packages/images/911a7560e52a48c3dce02c5569db4b542b0835e9.webp",teaser:"Deine Werkstatt immer dabei.",perks:["6 Plots","12 Homes","/wb, /anvil und /stonecutter"],single:true,accent:"green"},
  {id:7653852,name:"1.000 Gems",category:"Gems",price:2,image:"https://dunb17ur4ymx4.cloudfront.net/packages/images/d03ae5083e2d5f46f77ca201532897e6b72047a6.webp",teaser:"Dein Einstieg in den Gem-Shop.",perks:["1.000 Gems","Für Keys, Ränge und Booster"],single:false,accent:"pink"},
  {id:7653853,name:"2.500 Gems",category:"Gems",price:4,image:"https://dunb17ur4ymx4.cloudfront.net/packages/images/0456364abb11b47b9eef13d026ef4ba914f5fe4c.webp",teaser:"Mehr Gems pro Euro als beim Starterpaket.",perks:["2.500 Gems","+25 % Gems pro Euro"],single:false,accent:"pink"},
  {id:7653854,name:"6.000 Gems",category:"Gems",price:8,image:"https://dunb17ur4ymx4.cloudfront.net/packages/images/02e0a3093a8554db223144b9492adada4b1af732.webp",teaser:"Viel Platz für Keys und Booster.",perks:["6.000 Gems","+50 % Gems pro Euro"],single:false,accent:"pink"},
  {id:7653855,name:"13.000 Gems",category:"Gems",price:16,image:"https://dunb17ur4ymx4.cloudfront.net/packages/images/e3b4dffbf3084317b279f10cef436ba94b5d56bc.webp",teaser:"Großes Gem-Paket für aktive Spieler.",perks:["13.000 Gems","+62 % Gems pro Euro laut Tebex"],single:false,accent:"pink"},
  {id:7653856,name:"30.000 Gems",category:"Gems",price:32,image:"https://dunb17ur4ymx4.cloudfront.net/packages/images/b34e05e386866b6c98395abcb4a1aa435b652d24.webp",teaser:"Das größte Gem-Paket im Katalog.",perks:["30.000 Gems","375 Gems pro Euro"],single:false,accent:"pink"},
  {id:7653862,name:"Toxic Bundle",category:"Bundles",price:12,image:"https://dunb17ur4ymx4.cloudfront.net/packages/images/94f0a19bed47b651b485aec4b73ef87a8bfb9558.webp",teaser:"Toxic Rang und 6.000 Gems zusammen.",perks:["Toxic Rang, dauerhaft","6.000 Gems","Bundle-Details vor Kauf prüfen"],single:true,accent:"green"},
  {id:7653865,name:"Hero Bundle",category:"Bundles",price:34,image:"https://dunb17ur4ymx4.cloudfront.net/packages/images/087c64a09325f9f67e5b1694b0bfa1fc66142509.webp",teaser:"Ein komplettes Upgrade für dein Citybuild-Abenteuer.",perks:["Hero Rang, dauerhaft","6.000 Gems","20 Funity Keys"],single:true,accent:"cyan"}
];
export const euro=(value:number)=>new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(value);
