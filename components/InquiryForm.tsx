"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { FORM_LIMITS } from "@/lib/form-contract.mjs";
import { postJson } from "@/lib/client-api";

type ProductContext = { id: string; name: string; cas: string };
export default function InquiryForm({ title = "Запросить расчет по спецификации", product, intent = "quote", contextNotice }: { title?: string; product?: ProductContext; intent?: "quote" | "documents"; contextNotice?: string }) {
  const initialComment = product ? `${intent === "documents" ? "Запрос документов на" : "Запрос по позиции"} ${product.name}, CAS ${product.cas}. ` : "";
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "success">("idle");
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState("");
  const [comment, setComment] = useState(initialComment);
  const attempt = useRef<{ signature: string; id: string } | null>(null);
  useEffect(() => setReady(true), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || status === "sending") return;
    const form = event.currentTarget, fields = new FormData(form);
    const payload = { company: String(fields.get("company") || "").trim(), name: String(fields.get("name") || "").trim(), phone: String(fields.get("phone") || "").trim(), email: String(fields.get("email") || "").trim(), city: String(fields.get("city") || "").trim(), comment: comment.trim(), website: String(fields.get("website") || ""), items: [], intent, productId: product?.id || null };
    const signature = JSON.stringify(payload);
    if (attempt.current?.signature !== signature) attempt.current = { signature, id: crypto.randomUUID() };
    setStatus("sending"); setError("");
    try {
      const body = await postJson<{ ok?: boolean; id?: string }>("/api/requests", { ...payload, requestId: attempt.current.id }, "Не удалось сохранить запрос. Введенные данные остались в форме.");
      if (body.ok !== true || typeof body.id !== "string") throw new Error("Сервер не подтвердил сохранение запроса. Введенные данные остались в форме.");
      setSavedId(body.id); setStatus("success"); attempt.current = null; form.reset(); setComment(initialComment);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Нет связи с сервером. Введенные данные остались в форме."); setStatus("error"); }
  }
  if (status === "success") return <section className="inquiry-success cart-success" role="status"><Check size={20} strokeWidth={1.5} /><h2>Тестовый запрос сохранен</h2><p>Номер запроса: <span className="mono">{savedId}</span></p><p>Он сохранен на сервере демосайта. Отправка менеджеру и Telegram пока не подключены.</p><button className="button" type="button" onClick={() => setStatus("idle")}>Создать новый запрос</button></section>;
  return <section className="inquiry-section" id="request"><h2>{intent === "documents" ? "Запросить документы на продукцию" : title}</h2><p>{intent === "documents" ? "Укажите, какие документы нужны и требования к партии. Наличие документов подтвердим в ответе." : "Пришлите перечень реактивов: название или CAS, чистоту, фасовку и объем закупки."}</p>{product ? <p className="inquiry-context">{product.name} · CAS {product.cas}</p> : null}{contextNotice ? <p className="demo-notice">{contextNotice}</p> : null}<div className="demo-notice">Демонстрационный режим. Запрос сохранится на сервере, но не будет отправлен менеджеру.</div><noscript><p className="demo-notice">Для отправки формы включите JavaScript или свяжитесь с компанией по указанным контактам.</p></noscript><form className="request-form" method="post" action="/api/requests" onSubmit={submit} aria-busy={status === "sending"}><fieldset className="form-fieldset" disabled={!ready || status === "sending"}><input type="hidden" name="intent" value={intent} readOnly />{product ? <input type="hidden" name="productId" value={product.id} readOnly /> : null}<div className="form-grid"><label>Организация<input name="company" autoComplete="organization" required minLength={FORM_LIMITS.companyMin} maxLength={FORM_LIMITS.companyMax} placeholder="Название организации" /></label><label>Контактное лицо<input name="name" autoComplete="name" required minLength={FORM_LIMITS.nameMin} maxLength={FORM_LIMITS.nameMax} placeholder="Как к вам обращаться" /></label><label>Телефон<input name="phone" type="tel" autoComplete="tel" required minLength={FORM_LIMITS.phoneMin} maxLength={FORM_LIMITS.phoneMax} placeholder="+998 90 123 45 67" /></label><label>Электронная почта<input name="email" type="email" autoComplete="email" maxLength={FORM_LIMITS.emailMax} placeholder="Для коммерческого предложения" /></label><label className="form-full">Город в Узбекистане<input name="city" autoComplete="address-level2" required minLength={FORM_LIMITS.cityMin} maxLength={FORM_LIMITS.cityMax} placeholder="Например, Ташкент" /></label><label className="form-full">{intent === "documents" ? "Какие документы и требования нужны" : "Список реактивов и требования"}<textarea name="comment" aria-label={intent === "documents" ? "Какие документы и требования нужны" : "Список реактивов и требования"} required minLength={10} maxLength={FORM_LIMITS.quoteCommentMax} rows={5} value={comment} onChange={event => setComment(event.target.value)} aria-describedby="inquiry-comment-count" placeholder="Название или CAS, квалификация, фасовка, количество. Укажите, допустимы ли аналоги." /><span className="field-counter" id="inquiry-comment-count">{comment.length} из {FORM_LIMITS.quoteCommentMax} символов</span></label></div><label className="honeypot" aria-hidden="true">Ваш сайт<input name="website" tabIndex={-1} autoComplete="off" /></label><label className="form-consent"><input name="consent" type="checkbox" required /><span>Согласен с <a href="/privacy">условиями обработки данных</a></span></label><button className="button button-dark" type="submit">{status === "sending" ? "Сохраняем запрос..." : intent === "documents" ? "Запросить документы" : "Запросить расчет по списку"}<ArrowRight size={20} strokeWidth={1.5} /></button></fieldset>{error ? <p className="form-error" role="alert">{error}</p> : null}</form></section>;
}
export { InquiryForm };
