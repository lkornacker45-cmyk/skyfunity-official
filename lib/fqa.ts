export const fqaCategories=["Allgemein","Erste Schritte","Gameplay","Wirtschaft","Ranglisten","Technik & Support"] as const;
export type FqaCategory=typeof fqaCategories[number];
export type FqaEntry={question:string;answer:string;category?:FqaCategory};
export function getFqaCategory(item:FqaEntry):FqaCategory{
 if(item.category&&fqaCategories.includes(item.category))return item.category;
 const text=(item.question+" "+item.answer).toLocaleLowerCase("de");
 if(/rangliste|top.?10|top.?3|leaderboard|platzierung/.test(text))return "Ranglisten";
 if(/coin|gem|shop|kaufen|geld|wirtschaft/.test(text)&&!/kostenlos|kostet das spielen/.test(text))return "Wirtschaft";
 if(/grundstück|plot|spawn|startpaket|willkommensgeschenk|beitreten|verbinden/.test(text))return "Erste Schritte";
 if(/version|bedrock|java|handy|konsole|port|discord|support|hilfe|report/.test(text))return "Technik & Support";
 if(/spiel|server|event|job|funity|vote/.test(text))return "Gameplay";
 return "Allgemein";
}
