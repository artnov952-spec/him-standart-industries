import type { Metadata } from "next";
import "./globals.css";
import "./refinements.css";
import "./product-cards.css";
import "./contacts-page.css";
import "./documents-page.css";
import "./home-sections.css";
import "./home-faq.css";
import "./catalog-request.css";
import {StoreProvider} from "@/components/StoreProvider";
import HeaderActions from "@/components/HeaderActions";
import {ArrowUpRight,Mail,Phone} from "lucide-react";
import {company} from "@/lib/catalog";
import {SITE_URL,IS_DEMO,BRAND_SOCIAL_IMAGE,SITE_MARK} from "@/lib/site";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  metadataBase:new URL(SITE_URL),
  title:{default:"HIM STANDART INDUSTRIES | Реактивы в Узбекистане",template:"%s"},
  description:"Химические реактивы для лабораторий и производств Узбекистана. Каталог, подбор по CAS и запрос коммерческого предложения.",
  robots:{index:!IS_DEMO,follow:true},
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body><StructuredData value={{"@context":"https://schema.org","@type":"Organization","@id":SITE_URL+"/#organization",name:company.name,legalName:company.legalName,url:SITE_URL,telephone:company.phone,email:company.email,taxID:company.inn,logo:{"@type":"ImageObject",url:SITE_URL+SITE_MARK,width:512,height:512,name:"Знак демонстрационного сайта HIM STANDART Industries"},image:{"@type":"ImageObject",url:SITE_URL+BRAND_SOCIAL_IMAGE.url,width:1200,height:630},address:{"@type":"PostalAddress",streetAddress:company.address,addressLocality:"Ташкент",addressCountry:"UZ"}}}/><StoreProvider><a className="skip-link" href="#main">Перейти к содержимому</a><header className="site-header"><div className="container header-inner"><a className="brand" href="/" aria-label="HIM STANDART INDUSTRIES, главная"><span>HIM STANDART</span><small>Industries</small></a><nav className="desktop-nav" aria-label="Главная навигация"><a href="/catalog">Каталог</a><a href="/about">Компания</a><a href="/documents">Документы</a><a href="/articles">Статьи</a><a href="/contacts">Контакты</a></nav><HeaderActions/></div></header><main id="main">{children}</main><footer className="site-footer"><div className="container"><div className="footer-grid"><div><a className="brand" href="/"><span>HIM STANDART</span><small>Industries</small></a><p>Реактивы для лабораторий<br/>и производств Узбекистана.<br/>Подбор по вашей спецификации.</p></div><div><h2>Продукция</h2><a href="/catalog?category=solvents">Растворители</a><a href="/catalog?category=salts">Соли и соединения</a><a href="/catalog?category=acids-bases">Кислоты и щелочи</a><a href="/contacts#request">Запрос по спецификации</a></div><div><h2>Компания</h2><a href="/about">О компании</a><a href="/documents">Документы</a><a href="/articles">Полезные статьи</a><a href="/reviews">Отзывы о компании</a></div><div className="footer-contact"><h2>Обсудим вашу закупку</h2><a className="footer-phone" href={company.phoneHref}><Phone/>{company.phone}</a><a href={`mailto:${company.email}`}><Mail/>{company.email}</a><p>{company.address}</p><a className="text-link" href="/contacts">Связаться с нами <ArrowUpRight/></a></div></div><div className="footer-bottom"><span>© 2026 {company.legalName}</span><a href="/privacy">Обработка персональных данных</a><span>Демонстрационный сайт</span></div><p className="demo-footnote">Демо-каталог: ассортимент и упаковка показаны для примера. Заявки сохраняются в тестовом режиме, Telegram пока не подключен.</p></div></footer></StoreProvider></body>
    </html>
  );
}
