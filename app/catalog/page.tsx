import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogClient from "@/components/CatalogClient";
import { pageMeta } from "@/lib/site";
export const metadata = pageMeta("Каталог химических реактивов в Узбекистане", "Растворители, соли, кислоты и щелочи для лабораторий и производств. Поиск по словам, синонимам, CAS и формуле. Подбор по задаче, чистоте и фасовке.", "/catalog");
export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return <div className="container page-section"><Breadcrumbs items={[{ label: "Каталог" }]} /><div className="page-heading"><p className="eyebrow">Подбор по вашей спецификации</p><h1>Химические реактивы</h1><p>Выберите позиции, чистоту и фасовку. Соберем их в один запрос для вашей организации.</p></div><CatalogClient initialQuery={typeof params.q === "string" ? params.q : ""} initialCategory={typeof params.category === "string" ? params.category : ""} initialGrade={typeof params.grade === "string" ? params.grade : ""} initialTag={typeof params.tag === "string" ? params.tag : ""} initialSort={typeof params.sort === "string" ? params.sort : "relevance"} initialView={typeof params.view === "string" ? params.view : "grid"} initialPage={typeof params.page === "string" ? Number.parseInt(params.page, 10) || 1 : 1} /></div>;
}
