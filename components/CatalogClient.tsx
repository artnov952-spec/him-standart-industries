"use client";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { categories, products } from "@/lib/catalog";
import { parseSearchQuery, searchProducts } from "@/lib/search";
import { tagDefinitions } from "@/lib/product-tags";
import ProductCard from "./ProductCard";
import Breadcrumbs from "./Breadcrumbs";
import { catalogGrades, catalogHref, catalogPageSize, catalogSearchParams, catalogSeo, readCatalogFilters, type CatalogFilters } from "@/lib/catalog-routing";
import { IS_DEMO, SITE_URL } from "@/lib/site";

type Filters = CatalogFilters;
type Props = { initialQuery?: string; initialCategory?: string; initialGrade?: string; initialTag?: string; initialSort?: string; initialView?: string; initialPage?: number };
const pageSize = catalogPageSize;
const grades = catalogGrades;
const readFilters = readCatalogFilters;
export default function CatalogClient({ initialQuery = "", initialCategory = "", initialGrade = "", initialTag = "", initialSort = "relevance", initialView = "grid", initialPage = 1 }: Props) {
  const [filters, setFilters] = useState<Filters>(() => readFilters(new URLSearchParams(), { query: initialQuery, category: initialCategory, grade: initialGrade, tag: initialTag, sort: initialSort, view: initialView, page: initialPage }));
  const { query, category, grade, tag, sort, view } = filters;
  const deferredQuery = useDeferredValue(query);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [ready, setReady] = useState(false);
  const filterButton = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const historyMode = useRef<"replace" | "push" | "pop">("replace");
  useEffect(() => {
    setFilters(readFilters(new URLSearchParams(window.location.search)));
    setReady(true);
    const restore = () => { historyMode.current = "pop"; setFilters(readFilters(new URLSearchParams(window.location.search))); setOpen(false); };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  const update = (patch: Partial<Filters>, push = true) => {
    historyMode.current = push ? "push" : "replace";
    setFilters(previous => ({ ...previous, page: 1, ...patch }));
  };
  const interpretation = useMemo(() => parseSearchQuery(deferredQuery), [deferredQuery]);
  const ranked = useMemo(() => searchProducts(products, deferredQuery, { tagIds: tag ? [tag] : [] }), [deferredQuery, tag]);
  const shown = useMemo(() => {
    const filtered = ranked.filter(product => (!category || product.category === category) && (!grade || product.grade === grade));
    if (sort === "name-desc") return [...filtered].sort((a, b) => b.name.localeCompare(a.name, "ru"));
    if (sort === "name" || !deferredQuery.trim()) return [...filtered].sort((a, b) => a.name.localeCompare(b.name, "ru"));
    return filtered;
  }, [ranked, category, grade, sort, deferredQuery]);
  const categoryCounts = useMemo(() => Object.fromEntries(categories.map(item => [item.id, ranked.filter(product => product.category === item.id && (!grade || product.grade === grade)).length])), [ranked, grade]);
  const pageCount = Math.max(1, Math.ceil(shown.length / pageSize));
  const currentPage = Math.min(filters.page, pageCount);
  const firstIndex = (currentPage - 1) * pageSize;
  const pageProducts = shown.slice(firstIndex, firstIndex + pageSize);
  useEffect(() => {
    if (!ready) return;
    if (historyMode.current === "pop") { historyMode.current = "replace"; return; }
    const url = new URL(window.location.href);
    const normalized = catalogSearchParams(filters, currentPage);
    for (const key of ["q", "category", "grade", "tag", "sort", "view", "page"]) {
      const value = normalized.get(key);
      if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    }
    if (url.href !== window.location.href) window.history[historyMode.current === "push" ? "pushState" : "replaceState"](null, "", url);
    historyMode.current = "replace";
  }, [query, category, grade, tag, sort, view, currentPage, ready]);
  const finishClose = useCallback(() => { setOpen(false); setClosing(false); filterButton.current?.focus(); }, []);
  const close = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finishClose();
    else setClosing(true);
  }, [finishClose]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebar.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const controls = Array.from(sidebar.current?.querySelectorAll<HTMLElement>("button:not([disabled]),a[href],input:not([disabled]),select:not([disabled])") || []).filter(element => element.getClientRects().length > 0);
      const first = controls[0], last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const resize = () => { if (window.innerWidth > 800) setOpen(false); };
    window.addEventListener("keydown", keydown); window.addEventListener("resize", resize);
    return () => { window.removeEventListener("keydown", keydown); window.removeEventListener("resize", resize); document.body.style.overflow = previousOverflow; };
  }, [open, close]);
  const reset = () => update({ query: "", category: "", grade: "", tag: "" });
  const selectedCategory = categories.find(item => item.id === category);
  const selectedTag = tagDefinitions.find(item => item.id === tag);
  const hasFilters = Boolean(category || grade || query || tag);
  const seo = catalogSeo(filters, currentPage);
  useEffect(() => {
    if (!ready) return;
    const current = catalogSeo(filters, currentPage);
    document.title = current.title;
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", SITE_URL + current.canonicalPath);
    for (const [selector, content] of [
      ['meta[name="description"]', current.description],
      ['meta[name="robots"]', `${IS_DEMO || current.selectionOnly ? "noindex" : "index"}, follow`],
      ['meta[property="og:title"]', current.title],
      ['meta[property="og:description"]', current.description],
      ['meta[property="og:url"]', SITE_URL + current.canonicalPath],
      ['meta[name="twitter:title"]', current.title],
      ['meta[name="twitter:description"]', current.description],
    ]) document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
  }, [query, category, grade, tag, sort, view, currentPage, ready]);
  return <div className="catalog" data-ready={ready} aria-busy={!ready}>
    <Breadcrumbs items={selectedCategory ? [{ label: "Каталог", href: "/catalog" }, { label: selectedCategory.label }] : [{ label: "Каталог" }]} />
    <div className="page-heading"><p className="eyebrow">Подбор по вашей спецификации</p><h1>{seo.heading}</h1><p>{selectedCategory ? selectedCategory.description : "Выберите позиции, квалификацию и фасовку. Соберите один запрос для вашей организации."}</p></div>
    <div className="catalog-search-area"><div className="catalog-search"><Search aria-hidden="true" /><label className="sr-only" htmlFor="catalog-search">Название, CAS, формула или задача</label><input disabled={!ready} id="catalog-search" type="search" autoComplete="off" placeholder="Название, CAS, формула или задача" aria-describedby="catalog-search-hint" value={query} onChange={event => update({ query: event.target.value }, false)} />{query ? <button disabled={!ready} className="icon-button" type="button" aria-label="Очистить поиск" onClick={() => update({ query: "" }, false)}><X /></button> : null}</div><p id="catalog-search-hint" className="catalog-search-hint">Можно искать по нескольким словам, синониму или назначению. Например: <button disabled={!ready} type="button" onClick={() => update({ query: "анализ воды", category: "", grade: "", tag: "" })}>анализ воды</button>, <button disabled={!ready} type="button" onClick={() => update({ query: "этиловый спирт", category: "", grade: "", tag: "" })}>этиловый спирт</button> или <button disabled={!ready} type="button" onClick={() => update({ query: "NaCl", category: "", grade: "", tag: "" })}>NaCl</button></p></div>
    {interpretation.notice ? <p className="catalog-application-note" role="note">{interpretation.notice}</p> : null}
    <div className="catalog-quick-tags" aria-label="Быстрый подбор по задаче"><span>По задаче</span>{tagDefinitions.slice(0, 6).map(item => <button disabled={!ready} key={item.id} type="button" aria-pressed={tag === item.id} onClick={() => update({ tag: tag === item.id ? "" : item.id })}>{item.label}</button>)}</div>
    <p className="catalog-application-note">Теги помогают сузить поиск по лабораторной задаче. Они не подтверждают пригодность конкретного продукта для медицинской диагностики или вашей методики: требуется проверить квалификацию и документы.</p>
    <div className="catalog-layout">{open ? <button disabled={!ready} className={`catalog-backdrop${closing ? " is-closing" : ""}`} type="button" aria-label="Закрыть панель фильтров" tabIndex={-1} onClick={close} /> : null}
      <aside ref={sidebar} id="catalog-filters" role={open ? "dialog" : undefined} aria-modal={open ? true : undefined} className={`catalog-sidebar${open ? " is-open" : ""}${closing ? " is-closing" : ""}`} onAnimationEnd={event => { if (closing && event.target === event.currentTarget) finishClose(); }} aria-label="Категории и фильтры"><div className="catalog-sidebar-title"><span>Подбор реактивов</span><button disabled={!ready} className="catalog-mobile-close icon-button" type="button" aria-label="Закрыть фильтры" onClick={close}><X /></button></div>
        <div className="catalog-sidebar-content"><div className="catalog-categories"><button disabled={!ready} className={!category ? "is-active" : ""} type="button" aria-pressed={!category} onClick={() => update({ category: "" })}><span>Все реактивы</span><span className="catalog-count">{ranked.filter(product => !grade || product.grade === grade).length}</span></button>{categories.map(item => <button disabled={!ready} key={item.id} className={category === item.id ? "is-active" : ""} type="button" aria-pressed={category === item.id} onClick={() => update({ category: item.id })}><span>{item.label}</span><span className="catalog-count">{categoryCounts[item.id]}</span></button>)}</div>
        <fieldset className="catalog-filter"><legend>Область применения</legend><label><input disabled={!ready} type="radio" name="application" checked={!tag} onChange={() => update({ tag: "" })} /><span>Все задачи</span></label>{tagDefinitions.map(item => <label key={item.id}><input disabled={!ready} type="radio" name="application" checked={tag === item.id} onChange={() => update({ tag: item.id })} /><span>{item.label}</span></label>)}</fieldset>
        <fieldset className="catalog-filter"><legend>Квалификация</legend><label><input disabled={!ready} type="radio" name="grade" checked={!grade} onChange={() => update({ grade: "" })} /><span>Все квалификации</span></label>{grades.map(value => <label key={value}><input disabled={!ready} type="radio" name="grade" checked={grade === value} onChange={() => update({ grade: value })} /><span>{value}</span></label>)}</fieldset>
        {hasFilters ? <button disabled={!ready} className="text-button catalog-reset" type="button" onClick={reset}>Сбросить все фильтры</button> : null}<div className="catalog-sidebar-help"><p>Есть спецификация?</p><span>Добавьте список и объем закупки в комментарий к заявке.</span><a href="/contacts#request">Запросить расчет<ArrowRight /></a></div></div><button disabled={!ready} className="button button-dark catalog-mobile-apply" type="button" onClick={close}>Показать позиции ({shown.length})</button>
      </aside>
      <div ref={results} className="catalog-results" id="catalog-results" tabIndex={-1} role="region" aria-label="Результаты подбора реактивов" aria-busy={query !== deferredQuery}><div className="catalog-toolbar"><button disabled={!ready} ref={filterButton} type="button" className="button catalog-filter-toggle" aria-controls="catalog-filters" aria-expanded={open} onClick={() => { setClosing(false); setOpen(true); }}><SlidersHorizontal />Фильтры{hasFilters ? <span className="mono">{[category, grade, tag].filter(Boolean).length || ""}</span> : null}</button><p className="catalog-result-count" role="status">Найдено позиций: {shown.length}</p><div className="catalog-sort"><label className="sr-only" htmlFor="catalog-sort">Сортировка</label><select disabled={!ready} id="catalog-sort" value={sort} onChange={event => update({ sort: event.target.value })}><option value="relevance">По соответствию</option><option value="name">По названию: А-Я</option><option value="name-desc">По названию: Я-А</option></select></div><div className="catalog-view" aria-label="Вид каталога"><button disabled={!ready} className="icon-button" type="button" aria-label="Карточки" aria-pressed={view === "grid"} onClick={() => update({ view: "grid", page: currentPage })}><LayoutGrid /></button><button disabled={!ready} className="icon-button" type="button" aria-label="Список" aria-pressed={view === "list"} onClick={() => update({ view: "list", page: currentPage })}><List /></button></div></div>
        {hasFilters ? <div className="catalog-active-filters" aria-label="Выбранные фильтры">{query ? <button disabled={!ready} type="button" onClick={() => update({ query: "" })}>Поиск: {query}<X /></button> : null}{selectedCategory ? <button disabled={!ready} type="button" onClick={() => update({ category: "" })}>{selectedCategory.label}<X /></button> : null}{selectedTag ? <button disabled={!ready} type="button" onClick={() => update({ tag: "" })}>{selectedTag.label}<X /></button> : null}{grade ? <button disabled={!ready} type="button" onClick={() => update({ grade: "" })}>{grade}<X /></button> : null}<button disabled={!ready} className="catalog-clear-all" type="button" onClick={reset}>Сбросить все</button></div> : null}
        {selectedTag ? <p className="catalog-application-note">{selectedTag.description} Квалификацию реактива для вашей методики уточняем по спецификации.</p> : null}
        {shown.length ? <div className={`catalog-grid${view === "list" ? " is-list" : ""}`}>{pageProducts.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="catalog-empty"><Search /><h2>По этому сочетанию ничего не найдено</h2><p>Попробуйте другое название, синоним или задачу. Можно снять один из выбранных фильтров или передать список на подбор.</p><button disabled={!ready} type="button" className="button button-dark" onClick={reset}>Показать все 50 реактивов</button><a href="/contacts#request">Отправить спецификацию</a></div>}
        {shown.length ? <nav className="catalog-pagination" aria-label="Страницы каталога"><p>Показано {firstIndex + 1}-{Math.min(firstIndex + pageSize, shown.length)} из {shown.length}</p><div>{currentPage > 1 ? <a className="button button-secondary" href={catalogHref(filters, currentPage - 1, true)} rel="prev">Назад</a> : <span className="button button-secondary" aria-disabled="true">Назад</span>}<span>Страница {currentPage} из {pageCount}</span>{currentPage < pageCount ? <a className="button button-secondary" href={catalogHref(filters, currentPage + 1, true)} rel="next">Далее</a> : <span className="button button-secondary" aria-disabled="true">Далее</span>}</div></nav> : null}
        <div className="catalog-bottom-note"><span>Не нашли нужную позицию в демо-каталоге?</span><a href="/contacts#request">Запросить расчет по списку<ArrowRight /></a></div>
      </div>
    </div>
  </div>;
}
export { CatalogClient };
