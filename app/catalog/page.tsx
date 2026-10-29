import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogClient from "@/components/CatalogClient";
import { pageMeta } from "@/lib/site";
export const metadata = pageMeta("Каталог химических реактивов в Узбекистане", "Растворители, соли, кислоты и щелочи для лабораторий и производств. Поиск по названию и CAS, подбор чистоты и фасовки.", "/catalog");
export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return <div className="container page-section"><Breadcrumbs items={[{ label: "Каталог" }]} /><div className="page-heading"><p className="eyebrow">Подбор по вашей спецификации</p><h1>Химические реактивы</h1><p>Выберите позиции, чистоту и фасовку. Соберем их в один запрос для вашей организации.</p></div><CatalogClient initialQuery={typeof params.q === "string" ? params.q : ""} initialCategory={typeof params.category === "string" ? params.category : ""} initialGrade={typeof params.grade === "string" ? params.grade : ""} /></div>;
}
