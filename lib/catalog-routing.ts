import { categories, products } from "./catalog";
import { tagDefinitions } from "./product-tags";
import { searchProducts } from "./search";

export type CatalogFilters = { query: string; category: string; grade: string; tag: string; sort: string; view: string; page: number };
export type CatalogSearchParams = Record<string, string | string[] | undefined>;
export const catalogPageSize = 12;
export const catalogGrades = Array.from(new Set(products.map(product => product.grade)));
const controlledKeys = ["q", "category", "grade", "tag", "sort", "view", "page"] as const;

export function readCatalogFilters(params: URLSearchParams, fallback: Partial<CatalogFilters> = {}): CatalogFilters {
  const pick = (key: string, value = "") => params.get(key) ?? value;
  const category = pick("category", fallback.category), grade = pick("grade", fallback.grade), tag = pick("tag", fallback.tag);
  const rawPage = pick("page", String(fallback.page || 1));
  return {
    query: pick("q", fallback.query),
    category: categories.some(item => item.id === category) ? category : "",
    grade: catalogGrades.includes(grade) ? grade : "",
    tag: tagDefinitions.some(item => item.id === tag) ? tag : "",
    sort: ["relevance", "name", "name-desc"].includes(pick("sort", fallback.sort)) ? pick("sort", fallback.sort) : "relevance",
    view: pick("view", fallback.view) === "list" ? "list" : "grid",
    page: /^\d+$/.test(rawPage) ? Math.max(1, Math.min(1000, Number(rawPage) || 1)) : 1,
  };
}

export function catalogSearchParams(filters: CatalogFilters, page = filters.page): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of [["q", filters.query.trim()], ["category", filters.category], ["grade", filters.grade], ["tag", filters.tag], ["sort", filters.sort === "relevance" ? "" : filters.sort], ["view", filters.view === "grid" ? "" : filters.view], ["page", page > 1 ? String(page) : ""]]) {
    if (value) params.set(key, value);
  }
  return params;
}

export function catalogHref(filters: CatalogFilters, page = filters.page, fragment = false): string {
  const query = catalogSearchParams(filters, page).toString();
  return `/catalog${query ? `?${query}` : ""}${fragment ? "#catalog-results" : ""}`;
}

export function catalogSeo(filters: CatalogFilters, page = filters.page) {
  const category = categories.find(item => item.id === filters.category);
  const canonicalFilters = { ...filters, view: "grid" };
  // A list/grid switch is the same collection. Without a query, name order is
  // already the default. These presentation variants share one canonical.
  if (!filters.query.trim() && filters.sort === "name") canonicalFilters.sort = "relevance";
  // Searches, technical facets and alternative ordering are useful selection
  // states, not automatically generated SEO landing pages. Keep their distinct
  // content URL truthful, but exclude them from indexing. Global demo noindex
  // is applied by pageMeta as well and is never relaxed here.
  const selectionOnly = Boolean(filters.query.trim() || filters.grade || filters.tag || canonicalFilters.sort !== "relevance");
  const heading = category?.label || "Химические реактивы";
  const title = `${category?.label || "Каталог химических реактивов"} в Узбекистане${page > 1 ? `: страница ${page}` : ""}`;
  const description = category
    ? `${category.description} Сверьте наименование, CAS, квалификацию и фасовку. Запрос стоимости и условий поставки для организаций Узбекистана.`
    : "Химические реактивы для лабораторий и производств Узбекистана. Поиск по словам, синонимам, CAS и формуле, подбор по задаче и запрос предложения.";
  return { heading, title, description, canonicalPath: catalogHref(canonicalFilters, page), selectionOnly, category };
}

export function catalogServerState(input: CatalogSearchParams) {
  const source = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) source.append(key, item);
  const filters = readCatalogFilters(source);
  const matched = searchProducts(products, filters.query, { tagIds: filters.tag ? [filters.tag] : [] })
    .filter(product => (!filters.category || product.category === filters.category) && (!filters.grade || product.grade === filters.grade));
  const pageCount = Math.max(1, Math.ceil(matched.length / catalogPageSize));
  const page = Math.min(filters.page, pageCount);
  const normalized = catalogSearchParams(filters, page);
  const needsRedirect = controlledKeys.some(key => source.getAll(key).length > 1 || (source.get(key) || "") !== (normalized.get(key) || ""));
  // Preserve unrelated campaign parameters when normalizing a malformed page
  // or invalid filter. They do not enter canonical URLs or UI pagination.
  const redirectParams = new URLSearchParams(source);
  for (const key of controlledKeys) { redirectParams.delete(key); const value = normalized.get(key); if (value) redirectParams.set(key, value); }
  const redirectQuery = redirectParams.toString();
  return { filters: { ...filters, page }, count: matched.length, pageCount, seo: catalogSeo(filters, page), redirectPath: needsRedirect ? `/catalog${redirectQuery ? `?${redirectQuery}` : ""}` : null };
}
