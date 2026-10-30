import { FORM_LIMITS, normalizeLineRequirements } from "./form-contract.mjs";
export type ProductLike = { id: string; packages: readonly string[] };
export type RequestLine = { productId: string; packaging: string; quantity: number; requirements?: NonNullable<ReturnType<typeof normalizeLineRequirements>> };
export type QuoteInput = { requestId: string; company: string; name: string; phone: string; email: string; city: string; comment: string; items: RequestLine[]; intent: "quote" | "documents"; productId: string | null };
export type ReviewInput = { requestId: string; subject: string; name: string; organization: string; rating: number; text: string };

export class InputError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.name = "InputError"; this.status = status; }
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new InputError("Некорректный формат запроса.");
  return value as Record<string, unknown>;
}
function text(value: unknown, label: string, min: number, max: number): string {
  if (typeof value !== "string") throw new InputError(`Укажите ${label}.`);
  const result = value.trim().replace(/\r\n?/g, "\n");
  if (result.length < min || result.length > max) throw new InputError(`Поле «${label}»: от ${min} до ${max} символов.`);
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(result)) throw new InputError(`Поле «${label}» содержит недопустимые символы.`);
  return result;
}
function optionalText(value: unknown, label: string, max: number): string {
  return value === undefined || value === null || value === "" ? "" : text(value, label, 0, max);
}
function requestId(value: unknown): string {
  if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    throw new InputError("Не удалось определить запрос. Обновите страницу и повторите отправку.");
  }
  return value.toLowerCase();
}
function checkHoneypot(data: Record<string, unknown>): void {
  if (data.website !== undefined && data.website !== "") throw new InputError("Отправка не выполнена. Попробуйте еще раз.");
}
export function normalizeQuote(value: unknown, products: readonly ProductLike[]): QuoteInput {
  const data = record(value); checkHoneypot(data);
  const id = requestId(data.requestId);
  const company = text(data.company, "название организации", FORM_LIMITS.companyMin, FORM_LIMITS.companyMax);
  const name = text(data.name, "контактное лицо", FORM_LIMITS.nameMin, FORM_LIMITS.nameMax);
  const city = text(data.city, "город", FORM_LIMITS.cityMin, FORM_LIMITS.cityMax);
  const phoneText = text(data.phone, "телефон", FORM_LIMITS.phoneMin, FORM_LIMITS.phoneMax);
  if (!/^\+?[0-9\s().-]+$/.test(phoneText)) throw new InputError("Укажите корректный номер телефона.");
  const phone = phoneText.replace(/[\s().-]/g, "");
  const digits = phone.replace(/\D/g, "").length;
  if (digits < 9 || digits > 15) throw new InputError("Укажите телефон с кодом страны, например +998 90 123 45 67.");
  const email = optionalText(data.email, "электронная почта", FORM_LIMITS.emailMax).toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError("Проверьте адрес электронной почты.");
  const comment = optionalText(data.comment, "комментарий", FORM_LIMITS.quoteCommentMax);
  const intent = data.intent === undefined ? "quote" : data.intent;
  if (intent !== "quote" && intent !== "documents") throw new InputError("Выберите вид запроса.");
  const productId = data.productId === undefined || data.productId === null || data.productId === "" ? null : data.productId;
  if (productId !== null && (typeof productId !== "string" || !products.some(product => product.id === productId))) throw new InputError("Позиция запроса не найдена. Выберите ее в каталоге.");
  if (!Array.isArray(data.items) || data.items.length > FORM_LIMITS.linesMax || (!data.items.length && comment.length < 10)) {
    throw new InputError("Добавьте позиции в заявку или опишите список реактивов в комментарии. Не более 30 позиций.");
  }
  const catalog = new Map(products.map((product) => [product.id, product]));
  const combined = new Map<string, RequestLine>();
  for (const value of data.items) {
    const item = record(value);
    const product = typeof item.productId === "string" ? catalog.get(item.productId) : undefined;
    if (!product || typeof item.packaging !== "string" || !product.packages.includes(item.packaging)) throw new InputError("Проверьте товар и фасовку в заявке. Возможно, каталог изменился.");
    if (typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > FORM_LIMITS.quantityMax) throw new InputError("Количество каждой позиции должно быть целым числом от 1 до 999.");
    let requirements: RequestLine["requirements"];
    try { requirements = normalizeLineRequirements(item.requirements); }
    catch (error) { throw new InputError(error instanceof Error ? error.message : "Проверьте требования к позиции."); }
    const key = `${product.id}\u0000${item.packaging}`;
    const existing = combined.get(key);
    if (existing && JSON.stringify(existing.requirements || null) !== JSON.stringify(requirements || null)) throw new InputError("У одной фасовки разные требования. Уточните их в одной строке.");
    const quantity = (existing?.quantity ?? 0) + item.quantity;
    if (quantity > FORM_LIMITS.quantityMax) throw new InputError("Общее количество одной фасовки не должно превышать 999.");
    combined.set(key, { productId: product.id, packaging: item.packaging, quantity, ...(requirements ? { requirements } : {}) });
  }
  const items = [...combined.values()].sort((a, b) => a.productId.localeCompare(b.productId) || a.packaging.localeCompare(b.packaging));
  return { requestId: id, company, name, phone, email, city, comment, items, intent, productId };
}
export function normalizeSubject(value: unknown, products: readonly ProductLike[]): string {
  if (value === "company" || (typeof value === "string" && products.some((product) => product.id === value))) return value;
  throw new InputError("Такой товар не найден.", 404);
}
export function normalizeReview(value: unknown, products: readonly ProductLike[]): ReviewInput {
  const data = record(value); checkHoneypot(data);
  const id = requestId(data.requestId);
  const subject = normalizeSubject(data.subject, products);
  const name = text(data.name, "имя", 2, 100);
  const organization = optionalText(data.organization, "организация", 160);
  if (typeof data.rating !== "number" || !Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) throw new InputError("Выберите оценку от 1 до 5.");
  return { requestId: id, subject, name, organization, rating: data.rating, text: text(data.text, "отзыв", 10, 3000) };
}
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") throw new InputError("Отправляйте форму со страницы сайта.", 403);
}
export async function readJson(request: Request): Promise<unknown> {
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) throw new InputError("Ожидается JSON-запрос.", 415);
  const maxBytes = FORM_LIMITS.bodyBytesMax;
  const declared = request.headers.get("content-length");
  if (declared && Number(declared) > maxBytes) throw new InputError("Запрос слишком большой.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new InputError("Пустой запрос.");
  let length = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBytes) { await reader.cancel(); throw new InputError("Запрос слишком большой.", 413); }
    chunks.push(value);
  }
  const buffer = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(buffer)); }
  catch { throw new InputError("Некорректный JSON-запрос."); }
}
export async function sha256(value: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
export async function payloadHash(value: QuoteInput | ReviewInput): Promise<string> {
  const { requestId: ignored, ...payload } = value;
  void ignored;
  if ("items" in payload && payload.intent === "quote" && payload.productId === null) {
    const { intent, productId, ...legacy } = payload;
    void intent; void productId;
    return sha256(JSON.stringify(legacy));
  }
  return sha256(JSON.stringify(payload));
}
export function samePayloadOrThrow(existingHash: string, incomingHash: string): void {
  if (existingHash !== incomingHash) throw new InputError("Этот запрос уже использован с другими данными. Начните новую отправку.", 409);
}
export function publicJson(value: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return Response.json(value, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...extraHeaders } });
}
export function errorResponse(error: unknown): Response {
  if (error instanceof InputError) return publicJson({ error: error.message }, error.status);
  return publicJson({ error: "Сервис временно недоступен. Данные формы сохранены на странице, попробуйте отправить позже." }, 503);
}
