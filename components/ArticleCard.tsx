import { ArrowUpRight } from "lucide-react";
import type { Guide } from "@/lib/articles";
import ArticleCover from "./ArticleCover";

export default function ArticleCard({ article, headingLevel = 2 }: { article: Guide; index?: number; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return <article className="article-preview"><a className="article-visual" href={`/articles/${article.slug}`} aria-label={article.title}><ArticleCover slug={article.slug} /></a><div className="article-meta"><span>{article.topic}</span><span>{article.readTime}</span></div><Heading><a href={`/articles/${article.slug}`}>{article.title}</a></Heading><p>{article.excerpt}</p><a className="text-link" href={`/articles/${article.slug}`}>Читать материал<ArrowUpRight /></a></article>;
}
