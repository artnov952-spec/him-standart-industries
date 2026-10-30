import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import DocumentPreview from "@/components/DocumentPreview";
import { pageMeta } from "@/lib/site";

const samples = {
  quality: { title: "Образец паспорта качества", file: "/assets/docs/quality-sample.svg" },
  license: { title: "Образец раздела разрешительных документов", file: "/assets/docs/license-sample.svg" },
};
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const sample = samples[slug as keyof typeof samples];
  return sample ? pageMeta(sample.title, "Демонстрационный образец оформления. Документ не подтверждает качество продукции или наличие разрешения.", `/documents/samples/${slug}`) : {};
}
export default async function SamplePage({ params }: Props) {
  const { slug } = await params;
  const sample = samples[slug as keyof typeof samples];
  if (!sample) notFound();
  return <div className="container page-section"><Breadcrumbs items={[{ label: "Документы", href: "/documents" }, { label: sample.title }]} /><div className="page-heading"><p className="eyebrow">Демонстрационный образец</p><h1>{sample.title}</h1></div><div className="demo-notice">Это образец оформления. Он не является паспортом качества, сертификатом или разрешением HIM STANDART INDUSTRIES. Подтвержденные файлы будут доступны после предоставления компанией.</div><DocumentPreview file={sample.file} title={sample.title} /><a className="text-link" href="/documents">Вернуться к документам</a></div>;
}
