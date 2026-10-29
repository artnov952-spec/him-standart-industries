"use client";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function InquiryForm({ title = "Запросить расчет по спецификации" }: { title?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "success">("idle");
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState("");
  const attempt = useRef<{ signature: string; id: string } | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const payload = { company: String(fields.get("company") || "").trim(), name: String(fields.get("name") || "").trim(), phone: String(fields.get("phone") || "").trim(), email: String(fields.get("email") || "").trim(), city: String(fields.get("city") || "").trim(), comment: String(fields.get("comment") || "").trim(), website: String(fields.get("website") || ""), items: [] };
    const signature = JSON.stringify(payload);
    if (attempt.current?.signature !== signature) attempt.current = { signature, id: crypto.randomUUID() };
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, requestId: attempt.current.id }) });
      const body = await response.json() as { error?: string; id?: string };
      if (!response.ok) throw new Error(body.error || "Не удалось сохранить запрос. Попробуйте еще раз.");
      if (typeof body.id !== "string") throw new Error("Сервер не подтвердил сохранение запроса. Попробуйте еще раз.");
      setSavedId(body.id); setStatus("success"); attempt.current = null; form.reset();
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Нет связи с сервером. Введенные данные остались в форме."); setStatus("error"); }
  }
  if (status === "success") return <section className="inquiry-success cart-success" role="status"><Check size={20} strokeWidth={1.5} /><h2>Тестовый запрос сохранен</h2><p>Номер запроса: <span className="mono">{savedId}</span></p><p>Он сохранен на сервере демосайта. Отправка менеджеру и Telegram пока не подключены.</p><button className="button" type="button" onClick={() => setStatus("idle")}>Создать новый запрос</button></section>;
  return <section className="inquiry-section" id="request"><h2>{title}</h2><p>Пришлите перечень реактивов: название или CAS, чистоту, фасовку и объем закупки.</p><div className="demo-notice">Демонстрационный режим. Запрос сохранится на сервере, но не будет отправлен менеджеру.</div><form className="request-form" onSubmit={submit}><div className="form-grid"><label>Организация<input name="company" autoComplete="organization" required maxLength={160} placeholder="Название организации" /></label><label>Контактное лицо<input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Как к вам обращаться" /></label><label>Телефон<input name="phone" type="tel" autoComplete="tel" required minLength={9} maxLength={30} placeholder="+998 90 123 45 67" /></label><label>Электронная почта<input name="email" type="email" autoComplete="email" maxLength={160} placeholder="Для коммерческого предложения" /></label><label className="form-full">Город в Узбекистане<input name="city" autoComplete="address-level2" required maxLength={100} placeholder="Например, Ташкент" /></label><label className="form-full">Список реактивов и требования<textarea name="comment" required minLength={10} maxLength={3000} rows={5} placeholder="Название или CAS, требуемая квалификация, фасовка, количество. Укажите, допустимы ли аналоги." /></label></div><label className="honeypot" aria-hidden="true">Ваш сайт<input name="website" tabIndex={-1} autoComplete="off" /></label><label className="form-consent"><input name="consent" type="checkbox" required /><span>Согласен с <a href="/privacy">условиями обработки данных</a></span></label>{error ? <p className="form-error" role="alert">{error}</p> : null}<button className="button button-dark" type="submit" disabled={status === "sending"}>{status === "sending" ? "Сохраняем запрос..." : "Запросить расчет по списку"}<ArrowRight size={20} strokeWidth={1.5} /></button></form></section>;
}
export { InquiryForm };
