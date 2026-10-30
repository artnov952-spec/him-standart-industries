import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import ProductCard from "@/components/ProductCard";
import ArticleCard from "@/components/ArticleCard";
import { company, products } from "@/lib/catalog";
import { allArticles } from "@/lib/articles";
import { productSearchMetadata } from "@/lib/product-tags";
import { articleSocialImage, pageMeta, SITE_URL, SITE_MARK } from "@/lib/site";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = allArticles.find(item => item.slug === slug);
  return article ? pageMeta(article.title, article.excerpt, `/articles/${article.slug}`, { type: "article", image: articleSocialImage(article.slug, article.title) }) : pageMeta("Материал не найден", "Материалы о закупке химических реактивов.", `/articles/${slug}`);
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = allArticles.find(item => item.slug === slug);
  if (!article) notFound();
  const relevant = article.tagId ? products.filter(product => productSearchMetadata[product.id]?.tags.some(tag => tag === article.tagId)).slice(0, 2) : [];
  return <div className="container page-section"><Breadcrumbs items={[{ label: "Статьи", href: "/articles" }, { label: article.title }]} /><StructuredData value={{ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.excerpt, datePublished: `${article.date}T12:00:00+05:00`, dateModified: `${article.updated || article.date}T12:00:00+05:00`, image: SITE_URL + articleSocialImage(article.slug, article.title).url, author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: company.name }, publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: company.name, logo: { "@type": "ImageObject", url: SITE_URL + SITE_MARK, width: 512, height: 512 } }, mainEntityOfPage: `${SITE_URL}/articles/${article.slug}`, inLanguage: "ru" }} /><article className="article-detail"><header className="page-heading"><div className="article-meta"><span>{article.topic}</span><span>{article.readTime}</span><time dateTime={article.updated || article.date}>{article.updated ? "Обновлено " : ""}{new Date(article.updated || article.date).toLocaleDateString("ru-RU")}</time></div><h1>{article.title}</h1><p>{article.excerpt}</p></header>
    {article.sections ? <nav className="article-contents" aria-label="Содержание статьи"><span>В этом материале</span>{article.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav> : null}
    <div className="prose article-content">{article.sections ? article.sections.map(section => <section id={section.id} key={section.id}><h2>{section.title}</h2>{section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}{section.checklist ? <ul>{section.checklist.map(item => <li key={item}>{item}</li>)}</ul> : null}</section>) : article.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    {article.sources ? <aside className="article-sources"><h2>Дополнительные материалы</h2><ul>{article.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul><p className="field-help">Общие справочные материалы. Применимую методику и требования к закупке определяет ваша организация.</p></aside> : null}
    {relevant.length ? <section className="article-related-products"><h2>Начать подбор по этой задаче</h2><div className="product-grid">{relevant.map(product => <ProductCard key={product.id} product={product} />)}</div><a className="text-link" href={`/catalog?tag=${article.tagId}`}>Все позиции по задаче<ArrowRight /></a></section> : null}
    <div className="document-section"><div><h2>Подготовили список реактивов?</h2><p>Укажите наименование или CAS, чистоту, фасовку и объем закупки.</p></div><a className="button button-dark" href="/contacts#request">Запросить расчет<ArrowRight /></a></div></article><section className="section"><div className="section-heading"><h2>Другие материалы</h2></div><div className="article-grid">{allArticles.filter(item => item.slug !== article.slug).slice(0, 3).map((item, index) => <ArticleCard key={item.slug} article={item} index={index} />)}</div></section></div>;
}
