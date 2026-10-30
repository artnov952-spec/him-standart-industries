import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import DocumentPreview from "@/components/DocumentPreview";
import { pageMeta } from "@/lib/site";
import { getDocumentSample } from "@/lib/document-samples";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const sample = getDocumentSample(slug);
  return sample ? pageMeta(`Образец: ${sample.title}`, "Демонстрационный образец оформления. Документ не подтверждает качество продукции или наличие разрешения.", `/documents/samples/${slug}`) : {};
}
export default async function SamplePage({ params }: Props) {
  const { slug } = await params;
  const sample = getDocumentSample(slug);
  if (!sample) notFound();
  return <div className="container page-section"><Breadcrumbs items={[{ label: "Документы", href: "/documents" }, { label: sample.title }]} /><div className="page-heading"><p className="eyebrow">Демонстрационный образец</p><h1>{sample.title}</h1></div><div className="demo-notice">Это недействующий макет для демонстрации оформления. Он не подтверждает качество, безопасность или разрешения на продукцию HIM STANDART INDUSTRIES. Подтвержденные файлы будут доступны после предоставления компанией.</div><DocumentPreview file={sample.file} title={sample.title} /><a className="text-link" href="/documents">Вернуться к документам</a></div>;
}
