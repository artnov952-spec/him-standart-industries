import Breadcrumbs from "@/components/Breadcrumbs";
import Reviews from "@/components/Reviews";
import { pageMeta } from "@/lib/site";
export const metadata = pageMeta("Отзывы о HIM STANDART INDUSTRIES", "Поделитесь опытом подбора реактивов и сотрудничества с HIM STANDART. Отзывы о компании учитываются отдельно от оценок товаров.", "/reviews");
export default function ReviewsPage() { return <div className="container page-section"><Breadcrumbs items={[{ label: "Отзывы о компании" }]} /><div className="page-heading"><p className="eyebrow">Обратная связь</p><h1>Опыт сотрудничества</h1><p>Расскажите, что было важно при подборе продукции и согласовании закупки.</p></div><Reviews subject="company" /></div>; }
