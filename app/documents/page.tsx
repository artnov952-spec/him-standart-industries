import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { documentSamples } from "@/lib/document-samples";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("Документы на продукцию HIM STANDART", "Какие документы запросить для согласования химических реактивов: паспорт качества, SDS и документы поставщика. В демоверсии показаны образцы оформления.", "/documents");

export default function DocumentsPage() {
  return <div className="container page-section documents-page">
    <Breadcrumbs items={[{ label: "Документы" }]} />
    <div className="page-heading documents-heading"><p className="eyebrow">Для согласования закупки</p><h1>Документы на продукцию</h1><p>Выберите нужный тип документа. Файлы на конкретную продукцию и партию запрашиваются при подготовке предложения.</p></div>
    <div className="documents-status" role="note"><FileText size={20} strokeWidth={1.5} aria-hidden="true" /><p><strong>Сейчас показаны образцы оформления.</strong> Подтвержденные документы будут добавлены после предоставления компанией.</p></div>
    <div className="document-library">{documentSamples.map(sample => <article className="document-type-card" key={sample.slug}>
      <a className="document-type-preview" href={`/documents/samples/${sample.slug}`} aria-label={`Посмотреть образец: ${sample.title}`}><span className="document-sample-label">Образец</span><img src={sample.file} width={840} height={1080} loading="lazy" decoding="async" alt={`Макет: ${sample.title}. Недействующий документ.`} /></a>
      <div className="document-type-body"><p className="document-type-purpose">{sample.eyebrow}</p><h2>{sample.title}</h2><p>{sample.description}</p><ul>{sample.checks.map(check => <li key={check}>{check}</li>)}</ul><a className="text-link document-type-open" href={`/documents/samples/${sample.slug}`} aria-label={`Посмотреть образец: ${sample.title}`}>Посмотреть образец<ArrowUpRight size={20} strokeWidth={1.5} /></a></div>
    </article>)}</div>
    <section className="documents-request"><div><h2>Нужны документы на вашу позицию?</h2><p>Укажите название или CAS, производителя, если он важен, и перечень необходимых файлов.</p></div><a className="button button-dark" href="/contacts?intent=documents#request">Запросить документы<ArrowRight size={20} strokeWidth={1.5} /></a></section>
    <div className="documents-reading"><p>Паспорт качества относится к партии, SDS описывает безопасное обращение с продуктом. Один документ не заменяет другой.</p><a className="text-link" href="/articles/coa-and-sds">Подробнее о паспорте качества и SDS<ArrowRight size={20} strokeWidth={1.5} /></a></div>
  </div>;
}
