import { ArrowUpRight, ChevronDown } from "lucide-react";
import { reagentFaq } from "@/lib/reagent-faq";

export default function HomeFAQ() {
  return <section className="section home-faq" aria-labelledby="reagent-faq-title">
    <div className="container home-faq-inner">
      <div className="home-faq-intro"><p className="eyebrow">Для лабораторий и производств</p><h2 id="reagent-faq-title">Вопросы о реактивах</h2><p>Квалификация, назначение и документы: что учесть при подборе продукции для вашей организации в Узбекистане.</p><a className="text-link" href="/catalog">Перейти к подбору<ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" /></a></div>
      <div className="home-faq-list">{reagentFaq.map((item, index) => <details key={item.id} id={`faq-${item.id}`}>
        <summary><span className="home-faq-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{item.question}</span><ChevronDown size={20} strokeWidth={1.5} aria-hidden="true" /></summary>
        <div className="home-faq-answer"><p>{item.answer}</p><div className="home-faq-links">{item.links.map(link => <a href={link.href} key={link.href}>{link.label}<ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" /></a>)}</div></div>
      </details>)}</div>
    </div>
  </section>;
}
