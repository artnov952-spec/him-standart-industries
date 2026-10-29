"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { products } from "@/lib/catalog";
import { useStore } from "./StoreProvider";
import { getProductPhoto } from "./ProductImage";

export default function CartClient() {
  const { items, hydrated, setQuantity, removeItem, clearCart, addItem } = useStore();
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "success">("idle");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<{ id: string; message: string } | null>(null);
  const attempt = useRef<{ signature: string; id: string } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const clearButton = useRef<HTMLButtonElement>(null);
  const cancelClearButton = useRef<HTMLButtonElement>(null);
  const emptyHeading = useRef<HTMLHeadingElement>(null);
  const focusEmpty = useRef(false);
  const packagingFields = useRef(new Map<string, HTMLSelectElement>());
  const pendingPackagingFocus = useRef<string | null>(null);
  useEffect(() => {
    if (!confirmClear) return;
    cancelClearButton.current?.focus();
    const cancel = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setConfirmClear(false);
      clearButton.current?.focus();
    };
    window.addEventListener("keydown", cancel);
    return () => window.removeEventListener("keydown", cancel);
  }, [confirmClear]);
  useEffect(() => {
    if (pendingPackagingFocus.current) {
      packagingFields.current.get(pendingPackagingFocus.current)?.focus();
      pendingPackagingFocus.current = null;
    }
    if (!items.length && focusEmpty.current) {
      emptyHeading.current?.focus();
      focusEmpty.current = false;
    }
  }, [items]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || !items.length) return;
    const fields = new FormData(event.currentTarget);
    const payload = { company: String(fields.get("company") || "").trim(), name: String(fields.get("name") || "").trim(), phone: String(fields.get("phone") || "").trim(), email: String(fields.get("email") || "").trim(), city: String(fields.get("city") || "").trim(), comment: String(fields.get("comment") || "").trim(), website: String(fields.get("website") || ""), items };
    const signature = JSON.stringify(payload);
    if (attempt.current?.signature !== signature) attempt.current = { signature, id: crypto.randomUUID() };
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, requestId: attempt.current.id }) });
      const body = await response.json() as { error?: string; id: string; message?: string };
      if (!response.ok) throw new Error(body.error || "Не удалось сохранить заявку. Попробуйте еще раз.");
      if (typeof body.id !== "string") throw new Error("Сервер не подтвердил сохранение. Попробуйте еще раз: состав заявки сохранен.");
      setSaved({ id: body.id, message: body.message || "Тестовая заявка сохранена. Менеджеру она не отправлена." });
      clearCart(); attempt.current = null; setStatus("success");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Не удалось связаться с сервером. Заявка осталась в корзине."); setStatus("error"); }
  }
  if (!hydrated) return <div className="cart-loading" role="status">Загружаем состав заявки...</div>;
  if (status === "success" && saved) return <div className="cart-success" role="status"><Check size={20} strokeWidth={1.5} /><h2>Тестовая заявка сохранена</h2><p>{saved.message}</p><dl><div><dt>Номер заявки</dt><dd>{saved.id}</dd></div></dl><p>Этот сайт работает в демонстрационном режиме. Отправка менеджеру и Telegram пока не подключены.</p><a href="/catalog" className="button button-dark">Вернуться в каталог<ArrowRight size={20} strokeWidth={1.5} /></a></div>;
  if (!items.length) return <div className="cart-empty"><ShoppingBag size={20} strokeWidth={1.5} /><h2 ref={emptyHeading} tabIndex={-1}>В заявке пока нет позиций</h2><p>Выберите реактивы в каталоге, укажите фасовку и количество. Мы соберем их в один запрос.</p><a href="/catalog" className="button button-dark">Выбрать реактивы<ArrowRight size={20} strokeWidth={1.5} /></a></div>;
  return <div className="cart-layout"><section className="cart-items" aria-label="Состав заявки"><div className="cart-items-heading"><h2>Состав заявки <span>{items.length}</span></h2><button ref={clearButton} type="button" className="text-button" disabled={status === "sending"} onClick={() => setConfirmClear(true)}>Очистить</button></div>{confirmClear ? <div className="cart-clear-confirm" role="group" aria-label="Подтверждение очистки заявки"><p>Удалить все позиции из заявки?</p><button type="button" className="button" disabled={status === "sending"} onClick={() => { focusEmpty.current = true; clearCart(); setConfirmClear(false); }}>Удалить позиции</button><button ref={cancelClearButton} type="button" className="text-button" onClick={() => { setConfirmClear(false); clearButton.current?.focus(); }}>Оставить</button></div> : null}{items.map(item => { const product = products.find(p => p.id === item.productId); if (!product) return null; const photo = getProductPhoto(product); return <article className="cart-item" key={`${item.productId}:${item.packaging}`}><a className="cart-item-image" href={`/catalog/${product.id}`}><img src={photo.src} width="120" height="120" alt={photo.alt} /></a><div className="cart-item-info"><a href={`/catalog/${product.id}`} className="cart-item-name">{product.name}</a><span className="cart-item-meta">{product.sku} · CAS {product.cas}</span><label className="cart-packaging"><span>Фасовка</span><select ref={node => { const key = `${item.productId}:${item.packaging}`; if (node) packagingFields.current.set(key, node); else packagingFields.current.delete(key); }} aria-label={`Фасовка: ${product.name}`} value={item.packaging} disabled={status === "sending"} onChange={event => { pendingPackagingFocus.current = `${item.productId}:${event.target.value}`; removeItem(item.productId, item.packaging); addItem(item.productId, event.target.value, item.quantity); }}>{product.packages.map(p => <option key={p}>{p}</option>)}</select></label></div><div className="cart-item-controls"><div className="quantity-control"><button type="button" className="icon-button" aria-label={`Уменьшить количество: ${product.name}, ${item.packaging}`} disabled={item.quantity <= 1 || status === "sending"} onClick={() => setQuantity(item.productId, item.packaging, item.quantity - 1)}><Minus size={20} strokeWidth={1.5} /></button><label className="sr-only" htmlFor={`qty-${item.productId}-${item.packaging}`}>Количество: {product.name}, {item.packaging}</label><input id={`qty-${item.productId}-${item.packaging}`} type="number" min="1" max="999" inputMode="numeric" value={item.quantity} disabled={status === "sending"} onChange={event => setQuantity(item.productId, item.packaging, Number(event.target.value))} /><button type="button" className="icon-button" aria-label={`Увеличить количество: ${product.name}, ${item.packaging}`} disabled={item.quantity >= 999 || status === "sending"} onClick={() => setQuantity(item.productId, item.packaging, item.quantity + 1)}><Plus size={20} strokeWidth={1.5} /></button></div><span>Цена по запросу</span></div><button type="button" className="icon-button cart-item-remove" aria-label={`Удалить из заявки: ${product.name}, ${item.packaging}`} disabled={status === "sending"} onClick={() => removeItem(item.productId, item.packaging)}><Trash2 size={20} strokeWidth={1.5} /></button></article>; })}<a className="cart-continue text-button" href="/catalog">Добавить еще позиции<Plus size={20} strokeWidth={1.5} /></a><p className="field-hint">Наличие, стоимость, срок поставки и комплект документов уточняются по каждой позиции.</p></section><section className="cart-request"><h2>Запросить предложение</h2><p>Укажите организацию и контакт для ответа.</p><div className="demo-notice">Тестовый режим. Заявка сохранится на сервере, но не будет отправлена менеджеру.</div><form className="request-form" onSubmit={submit}><div className="form-grid"><label>Организация<input name="company" autoComplete="organization" required maxLength={160} placeholder="Название вашей организации" /></label><label>Контактное лицо<input name="name" autoComplete="name" required maxLength={100} placeholder="Как к вам обращаться" /></label><label>Телефон<input name="phone" type="tel" autoComplete="tel" required minLength={9} maxLength={30} placeholder="+998 90 123 45 67" /></label><label>Электронная почта<input name="email" type="email" autoComplete="email" maxLength={160} placeholder="Для коммерческого предложения" /></label><label className="form-full">Город в Узбекистане<input name="city" autoComplete="address-level2" required maxLength={100} placeholder="Например, Ташкент" /></label><label className="form-full">Комментарий<textarea name="comment" rows={4} maxLength={3000} placeholder="Требования к чистоте, объем закупки или список дополнительных позиций" /></label></div><label className="honeypot" aria-hidden="true">Ваш сайт<input name="website" tabIndex={-1} autoComplete="off" /></label><label className="form-consent"><input name="consent" type="checkbox" required /><span>Согласен с <a href="/privacy">условиями обработки данных</a></span></label>{error ? <p className="form-error" role="alert">{error}</p> : null}<button className="button button-dark" disabled={status === "sending"} type="submit">{status === "sending" ? "Сохраняем заявку..." : "Запросить коммерческое предложение"}<ArrowRight size={20} strokeWidth={1.5} /></button><p className="field-hint">Без онлайн-оплаты. Условия обсуждаются после уточнения состава заявки.</p></form></section></div>;
}
export { CartClient };
