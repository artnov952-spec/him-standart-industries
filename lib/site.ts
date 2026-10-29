export const SITE_URL = "https://him-standart-industries-demo.lushmorel12.chatgpt.site";
export const IS_DEMO = true;
export function pageMeta(title:string,description:string,path="/"){return {title,description,alternates:{canonical:SITE_URL+path},openGraph:{title,description,url:SITE_URL+path,siteName:"HIM STANDART INDUSTRIES",locale:"ru_UZ",type:"website" as const},robots:{index:!IS_DEMO,follow:true}};}
