import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
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
  return <div className="container page-section"><Breadcrumbs items={[{ label: "Контакты" }]} /><div className="page-heading"><p className="eyebrow">Ташкент · Узбекистан</p><h1>Обсудим вашу закупку</h1><p>Передайте список реактивов или спецификацию. Для предметного расчета нужны чистота, фасовка и количество.</p></div><div className="info-grid"><div className="info-panel"><h2>Связаться с компанией</h2><a className="contact-link" href={company.phoneHref}><Phone size={20} strokeWidth={1.5} />{company.phone}</a><a className="contact-link" href={`mailto:${company.email}`}><Mail size={20} strokeWidth={1.5} />{company.email}</a><p className="contact-address"><MapPin size={20} strokeWidth={1.5} />{company.address}</p><a className="text-link" target="_blank" rel="noopener" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`}>Показать адрес на карте<ArrowUpRight size={20} strokeWidth={1.5} /></a><p className="field-help">{company.contactNote}</p><div className="section"><h3>Что указать в запросе</h3><ul><li>Название реактива или CAS</li><li>Квалификацию и требования к примесям</li><li>Фасовку и объем закупки</li><li>Город и контакт для ответа</li></ul></div></div><InquiryForm key={`${product?.id || "general"}:${intent}`} product={product ? { id: product.id, name: product.name, cas: product.cas } : undefined} intent={intent} contextNotice={contextNotice} /></div></div>; }
