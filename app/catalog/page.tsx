import { redirect } from "next/navigation";
import CatalogClient from "@/components/CatalogClient";
import { catalogServerState, type CatalogSearchParams } from "@/lib/catalog-routing";
import { pageMeta } from "@/lib/site";

type Props = { searchParams: Promise<CatalogSearchParams> };

export async function generateMetadata({ searchParams }: Props) {
  const { seo } = catalogServerState(await searchParams);
  return pageMeta(seo.title, seo.description, seo.canonicalPath, { selectionOnly: seo.selectionOnly });
}

export default async function CatalogPage({ searchParams }: Props) {
  const state = catalogServerState(await searchParams);
  if (state.redirectPath) redirect(state.redirectPath);
  const { filters } = state;
  return <div className="container page-section"><CatalogClient initialQuery={filters.query} initialCategory={filters.category} initialGrade={filters.grade} initialTag={filters.tag} initialSort={filters.sort} initialView={filters.view} initialPage={filters.page} /></div>;
}
