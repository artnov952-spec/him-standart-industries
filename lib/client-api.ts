import { FORM_LIMITS } from "./form-contract.mjs";

function serverMessage(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 300 || !/[А-Яа-я]/.test(value) || /[<>\u0000-\u001f]/.test(value)) return null;
  if ((value.match(/[A-Za-z]{2,}/g) || []).some(word => !["JSON", "CSV", "TSV", "CAS", "SKU", "HTTP", "UTF"].includes(word))) return null;
  return value;
}
export async function postJson<T>(url: string, payload: unknown, fallback: string): Promise<T> {
  const safeFallback = serverMessage(fallback) || "Не удалось сохранить данные. Повторите отправку позже.";
  let body: string;
  try { body = JSON.stringify(payload); } catch { throw new Error("Не удалось подготовить запрос. Проверьте введенные данные."); }
  if (new TextEncoder().encode(body).byteLength > FORM_LIMITS.bodyBytesMax) throw new Error("Список слишком большой для одной заявки. Сократите комментарий или разделите запрос; состав заявки сохранен.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, signal: controller.signal });
    let result: unknown;
    try { result = JSON.parse(await response.text()); } catch { throw new Error(response.ok ? "Сервер не подтвердил сохранение. Повторите отправку: введенные данные сохранены на странице." : "Сервис временно недоступен. Введенные данные сохранены на странице."); }
    if (!response.ok) {
      const message = result && typeof result === "object" && "error" in result ? serverMessage(result.error) : null;
      throw new Error(message || (response.status === 429 ? "Слишком много отправок. Повторите позже." : safeFallback));
    }
    if (!result || typeof result !== "object" || Array.isArray(result)) throw new Error("Сервер не подтвердил сохранение. Введенные данные сохранены на странице.");
    return result as T;
  } catch (error) {
    if (controller.signal.aborted) throw new Error("Сервер отвечает дольше обычного. Повторите отправку позже: введенные данные сохранены на странице.");
    if (error instanceof TypeError) throw new Error("Нет связи с сервером. Проверьте подключение и повторите отправку: введенные данные сохранены на странице.");
    if (error instanceof Error && serverMessage(error.message)) throw error;
    throw new Error(safeFallback);
  } finally { clearTimeout(timeout); }
}
