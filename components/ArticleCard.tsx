import { ArrowUpRight, ClipboardList, Droplets, FileCheck2, FlaskConical, Leaf, SlidersHorizontal } from "lucide-react";
import type { Guide } from "@/lib/articles";
const icons = { specification: ClipboardList, "purity-and-packaging": SlidersHorizontal, "coa-and-sds": FileCheck2, "water-analysis": Droplets, "agro-laboratory": Leaf, "buffer-selection": FlaskConical };
export default function ArticleCard({ article, index = 0 }: { article: Guide; index?: number }) {
  const Icon = icons[article.slug as keyof typeof icons] || ClipboardList;
  return <article className="article-preview"><a className="article-visual" href={`/articles/${article.slug}`} aria-label={article.title}><Icon aria-hidden="true" /><span>{String(index + 1).padStart(2, "0")}</span></a><div className="article-meta"><span>{article.topic}</span><span>{article.readTime}</span></div><h2><a href={`/articles/${article.slug}`}>{article.title}</a></h2><p>{article.excerpt}</p><a className="text-link" href={`/articles/${article.slug}`}>Читать материал<ArrowUpRight /></a></article>;
}
