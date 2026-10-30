import { ArrowRight, FileText } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import DocumentLibrary from "@/components/DocumentLibrary";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("Документы на продукцию HIM STANDART", "Какие документы запросить для согласования химических реактивов: паспорт качества, SDS и документы поставщика. В демоверсии показаны образцы оформления.", "/documents");

export default function DocumentsPage() {
  return <div className="container page-section documents-page">
    <Breadcrumbs items={[{ label: "Документы" }]} />
    <div className="page-heading documents-heading"><p className="eyebrow">Для согласования закупки</p><h1>Документы на продукцию</h1><p>Паспорта качества, SDS и документы поставщика. Выберите тип, чтобы посмотреть образец.</p></div>
    <DocumentLibrary />
    <div className="documents-status" role="note"><FileText size={20} strokeWidth={1.5} aria-hidden="true" /><p>Сейчас доступны демонстрационные образцы. Подтвержденные файлы будут добавлены после предоставления компанией.</p></div>
    <section className="documents-request"><div><h2>Нужны документы на вашу позицию?</h2><p>Укажите название или CAS, производителя, если он важен, и перечень необходимых файлов.</p></div><a className="button button-dark" href="/contacts?intent=documents#request">Запросить документы<ArrowRight size={20} strokeWidth={1.5} /></a></section>
    <div className="documents-reading"><p>Паспорт качества относится к партии, SDS описывает безопасное обращение с продуктом. Один документ не заменяет другой.</p><a className="text-link" href="/articles/coa-and-sds">Подробнее о паспорте качества и SDS<ArrowRight size={20} strokeWidth={1.5} /></a></div>
  </div>;
}
