import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { articles, company } from "@/lib/catalog";
import { pageMeta, SITE_URL } from "@/lib/site";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  return article ? pageMeta(article.title, article.excerpt, `/articles/${article.slug}`) : pageMeta("Материал не найден", "Материалы о закупке химических реактивов.", `/articles/${slug}`);
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  if (!article) notFound();
  return <div className="container page-section"><Breadcrumbs items={[{ label: "Статьи", href: "/articles" }, { label: article.title }]} /><StructuredData value={{ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.excerpt, datePublished: `${article.date}T12:00:00+05:00`, dateModified: `${article.date}T12:00:00+05:00`, image: `${SITE_URL}/assets/hero-matte.webp`, author: { "@type": "Organization", name: company.name }, publisher: { "@type": "Organization", name: company.name }, mainEntityOfPage: `${SITE_URL}/articles/${article.slug}`, inLanguage: "ru" }} /><article className="article-detail"><header className="page-heading"><div className="article-meta"><time dateTime={article.date}>{new Date(article.date).toLocaleDateString("ru-RU")}</time><span>{article.readTime}</span></div><h1>{article.title}</h1><p>{article.excerpt}</p></header><div className="prose">{article.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="document-section"><div><h2>Подготовили список реактивов?</h2><p>Укажите наименование или CAS, чистоту, фасовку и объем закупки.</p></div><a className="button button-dark" href="/contacts">Запросить расчет<ArrowRight size={20} strokeWidth={1.5} /></a></div></article><section className="section"><div className="section-heading"><h2>Другие материалы</h2></div><div className="info-grid">{articles.filter(item => item.slug !== article.slug).map(item => <a className="info-panel" key={item.slug} href={`/articles/${item.slug}`}><h3>{item.title}</h3><p>{item.excerpt}</p><span className="text-link">Читать<ArrowRight size={20} strokeWidth={1.5} /></span></a>)}</div></section></div>;
}
