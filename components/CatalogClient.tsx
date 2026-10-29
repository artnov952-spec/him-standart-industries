"use client";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronDown, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { categories, products } from "@/lib/catalog";
import ProductCard from "./ProductCard";

const normalize = (text: string) => text.toLocaleLowerCase("ru").replace(/[\s–—-]/g, "");
export default function CatalogClient({ initialQuery = "", initialCategory = "", initialGrade = "" }: { initialQuery?: string; initialCategory?: string; initialGrade?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState(initialCategory);
  const [grade, setGrade] = useState(initialGrade);
  const [sort, setSort] = useState("name");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const filterButton = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const grades = useMemo(() => Array.from(new Set(products.map(p => p.grade))), []);
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setQuery(search.get("q") || initialQuery);
    setCategory(search.get("category") || initialCategory);
    setGrade(search.get("grade") || initialGrade);
    const requestedPage = search.get("page") || "1";
    setPage(/^\d+$/.test(requestedPage) ? Math.max(1, Math.min(1000, Number(requestedPage))) : 1);
    setReady(true);
  }, [initialQuery, initialCategory, initialGrade]);
  useEffect(() => {
    if (!open) return;
    sidebar.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); filterButton.current?.focus(); }
      if (event.key === "Tab") {
        const controls = sidebar.current?.querySelectorAll<HTMLElement>("button:not([disabled]),a[href],input:not([disabled]),select:not([disabled])");
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", escape);
    return () => { window.removeEventListener("keydown", escape); document.body.style.overflow = previousOverflow; };
  }, [open]);
  const shown = useMemo(() => {
    const term = normalize(deferredQuery);
    return products.filter(product => (!category || product.category === category) && (!grade || product.grade === grade) && (!term || normalize(`${product.name} ${product.sku} ${product.cas} ${product.formula}`).includes(term))).sort((a, b) => sort === "name-desc" ? b.name.localeCompare(a.name, "ru") : a.name.localeCompare(b.name, "ru"));
  }, [deferredQuery, category, grade, sort]);
  const pageCount = Math.max(1, Math.ceil(shown.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * pageSize;
  const pageProducts = shown.slice(firstIndex, firstIndex + pageSize);
  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    for (const [key, value] of [["q", query], ["category", category], ["grade", grade]]) { if (value) url.searchParams.set(key, value); else url.searchParams.delete(key); }
    if (currentPage > 1) url.searchParams.set("page", String(currentPage)); else url.searchParams.delete("page");
    window.history.replaceState(null, "", url);
  }, [query, category, grade, ready, currentPage]);
  const reset = () => { setQuery(""); setCategory(""); setGrade(""); setPage(1); };
  const changePage = (value: number) => { setPage(Math.max(1, Math.min(pageCount, value))); document.getElementById("catalog-results")?.scrollIntoView({ block: "start", behavior: "auto" }); };
  const close = () => { setOpen(false); filterButton.current?.focus(); };
  return <div className="catalog"><div className="catalog-search"><Search size={20} strokeWidth={1.5} /><label className="sr-only" htmlFor="catalog-search">Название реактива, CAS или артикул</label><input id="catalog-search" type="search" placeholder="Название реактива, CAS или артикул" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} />{query ? <button className="icon-button" type="button" aria-label="Очистить поиск" onClick={() => { setQuery(""); setPage(1); }}><X size={20} strokeWidth={1.5} /></button> : null}</div><div className="catalog-layout">{open ? <button className="catalog-backdrop" type="button" aria-label="Закрыть фильтры" onClick={close} /> : null}<aside ref={sidebar} role={open ? "dialog" : undefined} aria-modal={open ? true : undefined} className={`catalog-sidebar${open ? " is-open" : ""}`} aria-label="Категории и фильтры"><div className="catalog-sidebar-title"><span>Каталог</span><button className="catalog-mobile-close icon-button" type="button" aria-label="Закрыть фильтры" onClick={close}><X size={20} strokeWidth={1.5} /></button></div><div className="catalog-categories"><button className={!category ? "is-active" : ""} type="button" onClick={() => { setCategory(""); setPage(1); }}><span>Все реактивы</span><span className="catalog-count">{products.length}</span></button>{categories.map(item => <button key={item.id} className={category === item.id ? "is-active" : ""} type="button" onClick={() => { setCategory(item.id); setPage(1); }}><span>{item.label}</span><span className="catalog-count">{products.filter(p => p.category === item.id).length}</span></button>)}</div><fieldset className="catalog-filter"><legend>Квалификация</legend><label><input type="radio" name="grade" checked={!grade} onChange={() => { setGrade(""); setPage(1); }} /><span>Все квалификации</span></label>{grades.map(value => <label key={value}><input type="radio" name="grade" checked={grade === value} onChange={() => { setGrade(value); setPage(1); }} /><span>{value}</span></label>)}</fieldset>{category || grade || query ? <button className="text-button catalog-reset" type="button" onClick={reset}>Сбросить фильтры</button> : null}<div className="catalog-sidebar-help"><p>Есть спецификация?</p><span>Добавьте список и объем закупки в комментарий к заявке.</span><a href="/contacts">Запросить расчет<ArrowRight size={20} strokeWidth={1.5} /></a></div><button className="button button-dark catalog-mobile-apply" type="button" onClick={close}>Показать позиции ({shown.length})</button></aside><div className="catalog-results" id="catalog-results"><div className="catalog-toolbar"><button ref={filterButton} type="button" className="button catalog-filter-toggle" aria-expanded={open} onClick={() => setOpen(true)}><SlidersHorizontal size={20} strokeWidth={1.5} />Фильтры</button><p className="catalog-result-count" aria-live="polite">Найдено позиций: {shown.length}</p><div className="catalog-sort"><label className="sr-only" htmlFor="catalog-sort">Сортировка</label><select id="catalog-sort" value={sort} onChange={event => { setSort(event.target.value); setPage(1); }}><option value="name">По названию: А–Я</option><option value="name-desc">По названию: Я–А</option></select><ChevronDown size={20} strokeWidth={1.5} /></div><div className="catalog-view" aria-label="Вид каталога"><button className="icon-button" type="button" aria-label="Карточки" aria-pressed={view === "grid"} onClick={() => setView("grid")}><LayoutGrid size={20} strokeWidth={1.5} /></button><button className="icon-button" type="button" aria-label="Список" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={20} strokeWidth={1.5} /></button></div></div>{shown.length ? <div className={`catalog-grid${view === "list" ? " is-list" : ""}`}>{pageProducts.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="catalog-empty"><Search size={20} strokeWidth={1.5} /><h2>По вашему запросу ничего не найдено</h2><p>Проверьте название или CAS. Можно сбросить фильтры или отправить спецификацию на подбор.</p><button type="button" className="button button-dark" onClick={reset}>Показать все реактивы</button><a href="/contacts">Отправить спецификацию</a></div>}{shown.length ? <nav className="catalog-pagination" aria-label="Страницы каталога"><p aria-live="polite">Показано {firstIndex + 1}-{Math.min(firstIndex + pageSize, shown.length)} из {shown.length}</p><div><button type="button" className="button button-secondary" disabled={currentPage <= 1} onClick={() => changePage(currentPage - 1)}>Назад</button><span>Страница {currentPage} из {pageCount}</span><button type="button" className="button button-secondary" disabled={currentPage >= pageCount} onClick={() => changePage(currentPage + 1)}>Далее</button></div></nav> : null}<div className="catalog-bottom-note"><span>Не нашли нужную позицию в демокаталоге?</span><a href="/contacts">Запросить расчет по списку<ArrowRight size={20} strokeWidth={1.5} /></a></div></div></div></div>;
}
export { CatalogClient };
