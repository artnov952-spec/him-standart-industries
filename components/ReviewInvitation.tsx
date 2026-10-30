import { ArrowUpRight } from "lucide-react";

export default function ReviewInvitation() {
  return <section className="review-invitation" aria-labelledby="review-invitation-title">
    <div className="container review-invitation-inner">
      <div className="review-invitation-copy">
        <p className="review-invitation-eyebrow">Отзывы о компании</p>
        <h2 id="review-invitation-title">Уже работали с HIM STANDART?</h2>
        <p>Расскажите о подборе продукции, поставке и взаимодействии с компанией.</p>
      </div>
      <a className="button button-light review-invitation-action" href="/reviews">Оставить отзыв<ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" /></a>
    </div>
  </section>;
}
