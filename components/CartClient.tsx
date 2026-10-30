"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { products } from "@/lib/catalog";
import { FORM_LIMITS } from "@/lib/form-contract.mjs";
import { postJson } from "@/lib/client-api";
import { useStore } from "./StoreProvider";
import { getProductPhoto } from "./ProductImage";
import CartDraftTools from "./CartDraftTools";

export default function CartClient() {
  const { items, hydrated, setQuantity, removeItem, clearCart, clearSubmittedIfUnchanged, changePackaging, setRequirements } = useStore();
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "success">("idle");
  const [error, setError] = useState("");
  const [lineError, setLineError] = useState("");
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState<{ id: string; message: string; draftRetained: boolean } | null>(null);
  const attempt = useRef<{ signature: string; id: string } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const clearButton = useRef<HTMLButtonElement>(null);
  const cancelClearButton = useRef<HTMLButtonElement>(null);
  const emptyHeading = useRef<HTMLHeadingElement>(null);
  const draftHeading = useRef<HTMLHeadingElement>(null);
  const focusEmpty = useRef(false);
  const focusDraft = useRef(false);
  const packagingFields = useRef(new Map<string, HTMLSelectElement>());
  const pendingPackagingFocus = useRef<string | null>(null);
  const sending = status === "sending";
  useEffect(() => {
    if (!confirmClear) return;
    cancelClearButton.current?.focus();
    const cancel = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); setConfirmClear(false); clearButton.current?.focus(); } };
    window.addEventListener("keydown", cancel);
    return () => window.removeEventListener("keydown", cancel);
  }, [confirmClear]);
  useEffect(() => {
    if (pendingPackagingFocus.current) { packagingFields.current.get(pendingPackagingFocus.current)?.focus(); pendingPackagingFocus.current = null; }
    if (!items.length && focusEmpty.current) { emptyHeading.current?.focus(); focusEmpty.current = false; }
    if (status === "idle" && focusDraft.current && draftHeading.current) { draftHeading.current.focus(); focusDraft.current = false; }
  }, [items, status]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hydrated || sending || !items.length) return;
    const fields = new FormData(event.currentTarget);
    const payload = { company: String(fields.get("company") || "").trim(), name: String(fields.get("name") || "").trim(), phone: String(fields.get("phone") || "").trim(), email: String(fields.get("email") || "").trim(), city: String(fields.get("city") || "").trim(), comment: comment.trim(), website: String(fields.get("website") || ""), items, intent: "quote", productId: null };
    const signature = JSON.stringify(payload);
    if (attempt.current?.signature !== signature) attempt.current = { signature, id: crypto.randomUUID() };
    setStatus("sending"); setError("");
    try {
      const body = await postJson<{ ok?: boolean; id?: string; message?: string }>("/api/requests", { ...payload, requestId: attempt.current.id }, "Не удалось сохранить заявку. Состав и введенные данные остались на странице.");
      if (body.ok !== true || typeof body.id !== "string") throw new Error("Сервер не подтвердил сохранение. Попробуйте еще раз: состав заявки сохранен.");
      const cleared = clearSubmittedIfUnchanged(payload.items);
      setSaved({ id: body.id, message: body.message || "Тестовая заявка сохранена. Менеджеру она не отправлена.", draftRetained: !cleared });
      attempt.current = null; setStatus("success");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Не удалось связаться с сервером. Заявка осталась в корзине."); setStatus("error"); }
  }
  if (!hydrated) return <div className="cart-loading" role="status">Загружаем состав заявки...</div>;
  if (status === "success" && saved) return <div className="cart-success" role="status"><Check size={20} strokeWidth={1.5} /><h2>Тестовая заявка сохранена</h2><p>{saved.message}</p><dl><div><dt>Номер заявки</dt><dd>{saved.id}</dd></div></dl>{saved.draftRetained ? <><p>Текущий список не очищен. Перед следующим запросом проверьте, какие позиции уже вошли в сохраненную заявку.</p>{items.length ? <button type="button" className="button button-secondary" onClick={() => { focusDraft.current = true; setSaved(null); setStatus("idle"); setComment(""); }}>Проверить текущий список</button> : null}</> : null}<p>Этот сайт работает в демонстрационном режиме. Отправка менеджеру и Telegram пока не подключены.</p><a href="/catalog" className="button button-dark">Вернуться в каталог<ArrowRight size={20} strokeWidth={1.5} /></a></div>;
  if (!items.length) return <><div className="cart-empty"><ShoppingBag size={20} strokeWidth={1.5} /><h2 ref={emptyHeading} tabIndex={-1}>В заявке пока нет позиций</h2><p>Выберите реактивы в каталоге или загрузите ранее сохраненный CSV/TSV.</p><a href="/catalog" className="button button-dark">Выбрать реактивы<ArrowRight size={20} strokeWidth={1.5} /></a></div><CartDraftTools /></>;
  return <div className="cart-layout"><section className="cart-items" aria-label="Состав заявки"><div className="cart-items-heading"><h2 ref={draftHeading} tabIndex={-1}>Состав заявки <span>{items.length} / {FORM_LIMITS.linesMax}</span></h2><button ref={clearButton} type="button" className="text-button" disabled={sending} onClick={() => setConfirmClear(true)}>Очистить</button></div>
    {confirmClear ? <div className="cart-clear-confirm" role="group" aria-label="Подтверждение очистки заявки"><p>Удалить все позиции из заявки?</p><button type="button" className="button" disabled={sending} onClick={() => { focusEmpty.current = true; clearCart(); setConfirmClear(false); }}>Удалить позиции</button><button ref={cancelClearButton} type="button" className="text-button" onClick={() => { setConfirmClear(false); clearButton.current?.focus(); }}>Оставить</button></div> : null}
    {lineError ? <p className="form-error" role="alert">{lineError}</p> : null}
    {items.map(item => {
      const product = products.find(candidate => candidate.id === item.productId); if (!product) return null;
      const photo = getProductPhoto(product);
      const requirements = item.requirements || { purity: "", alternatives: "", neededBy: "" };
      return <article className="cart-item" key={`${item.productId}:${item.packaging}`}>
        <a className="cart-item-image" href={`/catalog/${product.id}`}><img src={photo.src} srcSet={photo.srcSet} sizes="(max-width: 520px) 72px, 96px" width="120" height="120" loading="lazy" decoding="async" alt={photo.alt} /></a>
        <div className="cart-item-info"><a href={`/catalog/${product.id}`} className="cart-item-name">{product.name}</a><span className="cart-item-meta">{product.sku} · CAS {product.cas}</span>
          <label className="cart-packaging"><span>Фасовка</span><select ref={node => { const key = `${item.productId}:${item.packaging}`; if (node) packagingFields.current.set(key, node); else packagingFields.current.delete(key); }} aria-label={`Фасовка: ${product.name}`} value={item.packaging} disabled={sending} onChange={event => { const to = event.target.value; const failure = changePackaging(item.productId, item.packaging, to); setLineError(failure || ""); if (failure) { event.currentTarget.value = item.packaging; return; } pendingPackagingFocus.current = `${item.productId}:${to}`; }}>{product.packages.map(packaging => <option key={packaging}>{packaging}</option>)}</select></label>
        </div>
        <div className="cart-item-controls"><div className="quantity-control"><button type="button" className="icon-button" aria-label={`Уменьшить количество: ${product.name}, ${item.packaging}`} disabled={item.quantity <= 1 || sending} onClick={() => setQuantity(item.productId, item.packaging, item.quantity - 1)}><Minus size={20} strokeWidth={1.5} /></button><label className="sr-only" htmlFor={`qty-${item.productId}-${item.packaging}`}>Количество: {product.name}, {item.packaging}</label><input id={`qty-${item.productId}-${item.packaging}`} type="number" min="1" max={FORM_LIMITS.quantityMax} inputMode="numeric" value={item.quantity} disabled={sending} onChange={event => setQuantity(item.productId, item.packaging, Number(event.target.value))} /><button type="button" className="icon-button" aria-label={`Увеличить количество: ${product.name}, ${item.packaging}`} disabled={item.quantity >= FORM_LIMITS.quantityMax || sending} onClick={() => setQuantity(item.productId, item.packaging, item.quantity + 1)}><Plus size={20} strokeWidth={1.5} /></button></div><span>Цена по запросу</span></div>
        <button type="button" className="icon-button cart-item-remove" aria-label={`Удалить из заявки: ${product.name}, ${item.packaging}`} disabled={sending} onClick={() => { focusEmpty.current = items.length === 1; removeItem(item.productId, item.packaging); }}><Trash2 size={20} strokeWidth={1.5} /></button>
        <details className="cart-line-requirements"><summary>Требования к позиции</summary><fieldset className="form-fieldset" disabled={sending}><label>Чистота и примеси<input form="quote-request-form" aria-label={`Чистота: ${product.name}, ${item.packaging}`} maxLength={FORM_LIMITS.purityMax} value={requirements.purity} onChange={event => setRequirements(item.productId, item.packaging, { ...requirements, purity: event.target.value })} placeholder="Например, квалификация по вашей методике" /></label><label>Аналоги<select form="quote-request-form" aria-label={`Аналоги: ${product.name}, ${item.packaging}`} value={requirements.alternatives} onChange={event => setRequirements(item.productId, item.packaging, { ...requirements, alternatives: event.target.value })}><option value="">Не указано</option><option value="allowed">Разрешены</option><option value="not-allowed">Не разрешены</option><option value="discuss">Согласовать отдельно</option></select></label><label>Нужный срок<input form="quote-request-form" aria-label={`Нужный срок: ${product.name}, ${item.packaging}`} type="date" value={requirements.neededBy} onChange={event => setRequirements(item.productId, item.packaging, { ...requirements, neededBy: event.target.value })} /></label><p className="field-hint">Это требования к запросу, а не подтверждение доступности или срока поставки.</p></fieldset></details>
      </article>;
    })}
    <a className="cart-continue text-button" href="/catalog">Добавить еще позиции<Plus size={20} strokeWidth={1.5} /></a><p className="field-hint">Наличие, стоимость, срок поставки и комплект документов уточняются по каждой позиции.</p><CartDraftTools disabled={sending} />
  </section>
  <section className="cart-request"><h2>Запросить предложение</h2><p>Укажите организацию и контакт для ответа.</p><div className="demo-notice">Тестовый режим. Заявка сохранится на сервере, но не будет отправлена менеджеру.</div><noscript><p>Для отправки формы включите JavaScript.</p></noscript><form id="quote-request-form" className="request-form" method="post" action="/api/requests" onSubmit={submit} aria-busy={sending}><fieldset className="form-fieldset" disabled={!hydrated || sending}><div className="form-grid"><label>Организация<input name="company" autoComplete="organization" required minLength={FORM_LIMITS.companyMin} maxLength={FORM_LIMITS.companyMax} placeholder="Название вашей организации" /></label><label>Контактное лицо<input name="name" autoComplete="name" required minLength={FORM_LIMITS.nameMin} maxLength={FORM_LIMITS.nameMax} placeholder="Как к вам обращаться" /></label><label>Телефон<input name="phone" type="tel" autoComplete="tel" required minLength={FORM_LIMITS.phoneMin} maxLength={FORM_LIMITS.phoneMax} placeholder="+998 90 123 45 67" /></label><label>Электронная почта<input name="email" type="email" autoComplete="email" maxLength={FORM_LIMITS.emailMax} placeholder="Для коммерческого предложения" /></label><label className="form-full">Город в Узбекистане<input name="city" autoComplete="address-level2" required minLength={FORM_LIMITS.cityMin} maxLength={FORM_LIMITS.cityMax} placeholder="Например, Ташкент" /></label><label className="form-full">Комментарий<textarea name="comment" aria-label="Комментарий" rows={4} maxLength={FORM_LIMITS.quoteCommentMax} value={comment} onChange={event => setComment(event.target.value)} aria-describedby="cart-comment-count" placeholder="Дополнительные требования или список позиций" /><span className="field-counter" id="cart-comment-count">{comment.length} из {FORM_LIMITS.quoteCommentMax} символов</span></label></div><label className="honeypot" aria-hidden="true">Ваш сайт<input name="website" tabIndex={-1} autoComplete="off" /></label><label className="form-consent"><input name="consent" type="checkbox" required /><span>Согласен с <a href="/privacy">условиями обработки данных</a></span></label><button className="button button-dark" type="submit">{sending ? "Сохраняем заявку..." : "Запросить коммерческое предложение"}<ArrowRight size={20} strokeWidth={1.5} /></button><p className="field-hint">Без онлайн-оплаты. Условия обсуждаются после уточнения состава заявки.</p></fieldset>{error ? <p className="form-error" role="alert">{error}</p> : null}</form></section></div>;
}
export { CartClient };
