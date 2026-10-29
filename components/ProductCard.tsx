"use client";
import { ArrowUpRight, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { useStore } from "./StoreProvider";
import { useReviews } from "./review-api";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useStore();
  const { data } = useReviews(product.id);
  return <article className="product-card"><a href={`/catalog/${product.id}`} className="product-image" aria-label={`Подробнее: ${product.name}`}><img src={product.image} width="560" height="440" loading="lazy" alt={product.imageAlt || product.name} /><span className="product-image-caption">{product.imageCaption || "Иллюстрация реактива"}</span><span className="product-image-arrow"><ArrowUpRight size={20} strokeWidth={1.5} /></span></a><div className="product-body"><div className="product-meta"><span>{product.sku}</span><span>CAS {product.cas}</span></div><h3><a href={`/catalog/${product.id}`}>{product.name}</a></h3><p className="product-description">{product.description}</p><dl className="product-specs"><div><dt>Квалификация</dt><dd>{product.grade}</dd></div><div><dt>Фасовка</dt><dd>{product.packages.join(" / ")}</dd></div></dl><a className="product-review-link" href={`/catalog/${product.id}#reviews`}><Star size={20} strokeWidth={1.5} /><span>{data ? data.count ? `${Number(data.average).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} · ${data.count} оценок` : "Нет отзывов" : "Отзывы о товаре"}</span></a><div className="product-actions"><div><span className="product-price">Цена по запросу</span><span className="product-availability">Наличие уточняется</span></div><button className="button button-dark" type="button" onClick={() => addItem(product.id, product.packages[0])}>В заявку<Plus size={20} strokeWidth={1.5} /></button></div></div></article>;
}
export { ProductCard };
