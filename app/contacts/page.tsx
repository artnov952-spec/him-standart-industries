import { ArrowUpRight, ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import InquiryForm from "@/components/InquiryForm";
import { company, products } from "@/lib/catalog";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("Контакты HIM STANDART INDUSTRIES в Ташкенте", "Запросить расчет по списку химических реактивов для лабораторий и производств Узбекистана. Телефон, почта и адрес компании.", "/contacts");

export default async function ContactsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const productId = typeof params.productId === "string" ? params.productId : "";
  const legacyName = typeof params.product === "string" ? params.product : "";
  const product = products.find(item => productId ? item.id === productId : legacyName ? item.name === legacyName : false);
  const intent = params.intent === "documents" || legacyName ? "documents" : "quote";
  const contextNotice = (productId || legacyName) && !product ? "Позиция не найдена. Укажите название или CAS в тексте запроса." : undefined;

  return <div className="container page-section contacts-page">
    <Breadcrumbs items={[{ label: "Контакты" }]} />
    <div className="contacts-layout">
      <header className="page-heading contacts-intro">
        <p className="eyebrow">Ташкент · Узбекистан</p>
        <h1>Обсудим вашу закупку</h1>
        <p>Передайте список реактивов или спецификацию. Для предметного расчета нужны чистота, фасовка и количество.</p>
      </header>
      <section className="info-panel contacts-details" aria-labelledby="contact-details-title">
        <h2 id="contact-details-title">Связаться с компанией</h2>
        <div className="contact-channels">
          <a className="contact-link" href={company.phoneHref}><Phone size={20} strokeWidth={1.5} aria-hidden="true" /><span>{company.phone}</span></a>
          <a className="contact-link" href={`mailto:${company.email}`}><Mail size={20} strokeWidth={1.5} aria-hidden="true" /><span>{company.email}</span></a>
        </div>
        <p className="contact-address"><MapPin size={20} strokeWidth={1.5} aria-hidden="true" /><span>{company.address}</span></p>
        <a className="text-link contact-map-link" target="_blank" rel="noopener" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`}>Показать адрес на карте<ArrowUpRight size={20} strokeWidth={1.5} /></a>
        <p className="field-help contact-source-note">{company.contactNote}</p>
        <details className="contact-request-guide">
          <summary><span>Что указать в запросе</span><ChevronDown size={20} strokeWidth={1.5} aria-hidden="true" /></summary>
          <ul><li>Название реактива или CAS</li><li>Квалификацию и требования к примесям</li><li>Фасовку и объем закупки</li><li>Город и контакт для ответа</li></ul>
        </details>
      </section>
      <InquiryForm key={`${product?.id || "general"}:${intent}`} product={product ? { id: product.id, name: product.name, cas: product.cas } : undefined} intent={intent} contextNotice={contextNotice} />
    </div>
  </div>;
}
