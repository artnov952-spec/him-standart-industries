import Breadcrumbs from "@/components/Breadcrumbs";
import CartClient from "@/components/CartClient";
import { pageMeta } from "@/lib/site";
export const metadata = pageMeta("Ваша заявка на химические реактивы", "Уточните фасовку и количество реактивов, укажите контакт организации и сохраните запрос коммерческого предложения.", "/cart");
export default function CartPage() { return <div className="container page-section"><Breadcrumbs items={[{ label: "Заявка" }]} /><div className="page-heading"><p className="eyebrow">Для организаций Узбекистана</p><h1>Ваша заявка</h1><p>Проверьте список реактивов и укажите объем закупки. Цена и срок поставки уточняются по запросу.</p></div><CartClient /></div>; }
