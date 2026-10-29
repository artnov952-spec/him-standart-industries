import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import { allArticles } from "@/lib/articles";
import { pageMeta } from "@/lib/site";
export const metadata = pageMeta("Материалы о закупке химических реактивов", "Как составить заявку, выбрать чистоту и фасовку, проверить документы. Реактивы для контроля воды, агрохимического анализа и буферных систем.", "/articles");
export default function ArticlesPage() {
  return <div className="container page-section"><Breadcrumbs items={[{ label: "Статьи" }]} /><div className="page-heading"><p className="eyebrow">Для лабораторий и отделов закупок</p><h1>Перед закупкой реактивов</h1><p>Практические материалы для организаций Узбекистана: от технической задачи до списка позиций в заявке.</p></div><div className="article-grid">{allArticles.map((article, index) => <ArticleCard article={article} index={index} key={article.slug} />)}</div></div>;
}
