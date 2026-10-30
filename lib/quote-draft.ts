import { FORM_LIMITS, normalizeLineRequirements } from "./form-contract.mjs";

export type LineRequirements = NonNullable<ReturnType<typeof normalizeLineRequirements>>;
export type CartItem = { productId: string; packaging: string; quantity: number; requirements?: LineRequirements };
export type DraftProduct = { id: string; sku?: string; name?: string; packages: readonly string[] };
export type DraftResult = { ok: true; items: CartItem[] } | { ok: false; items: CartItem[]; error: string };
const lineKey = (item: Pick<CartItem, "productId" | "packaging">) => `${item.productId}\u0000${item.packaging}`;
const sameRequirements = (one?: LineRequirements, two?: LineRequirements) => JSON.stringify(one || null) === JSON.stringify(two || null);
function checkedLine(value: unknown, products: readonly DraftProduct[]): CartItem {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Проверьте строку списка.");
  const input = value as Partial<CartItem>;
  const product = products.find(item => item.id === input.productId);
  if (!product || typeof input.packaging !== "string" || !product.packages.includes(input.packaging)) throw new Error("Неизвестный товар или фасовка. Проверьте артикул и упаковку.");
  if (typeof input.quantity !== "number" || !Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > FORM_LIMITS.quantityMax) throw new Error("Количество должно быть целым числом от 1 до 999.");
  const requirements = normalizeLineRequirements(input.requirements);
  return { productId: product.id, packaging: input.packaging, quantity: input.quantity, ...(requirements ? { requirements } : {}) };
}
export function combineDraft(current: readonly CartItem[], incoming: readonly CartItem[], products: readonly DraftProduct[]): DraftResult {
  const original = current.map(item => ({ ...item }));
  try {
    if (current.length > FORM_LIMITS.linesMax || incoming.length > FORM_LIMITS.linesMax) throw new Error("В одной заявке не более 30 строк. Список не изменен.");
    const result: CartItem[] = [];
    for (const value of [...current, ...incoming]) {
      const line = checkedLine(value, products), existing = result.find(item => lineKey(item) === lineKey(line));
      if (existing) {
        if (!sameRequirements(existing.requirements, line.requirements)) throw new Error("У одной фасовки разные требования. Согласуйте их в одной строке; список не изменен.");
        if (existing.quantity + line.quantity > FORM_LIMITS.quantityMax) throw new Error("После объединения получится больше 999 упаковок. Исходные позиции сохранены; разделите запрос или уточните количество.");
        existing.quantity += line.quantity;
      } else {
        if (result.length >= FORM_LIMITS.linesMax) throw new Error("В заявке уже 30 строк. Список не изменен; дополнительный перечень можно указать в комментарии.");
        result.push(line);
      }
    }
    return { ok: true, items: result };
  } catch (error) { return { ok: false, items: original, error: error instanceof Error ? error.message : "Не удалось изменить список." }; }
}
export function changeDraftPackaging(items: readonly CartItem[], productId: string, from: string, to: string, products: readonly DraftProduct[]): DraftResult {
  const source = items.find(item => item.productId === productId && item.packaging === from);
  if (!source || from === to) return { ok: true, items: [...items] };
  const result = combineDraft(items.filter(item => item !== source), [{ ...source, packaging: to }], products);
  return result.ok ? result : { ...result, items: [...items] };
}
export function restoreDraft(value: unknown, products: readonly DraftProduct[]): { items: CartItem[]; warning?: string } {
  if (!Array.isArray(value)) return { items: [], warning: "Не удалось прочитать сохраненный список. Загрузите свой CSV или TSV." };
  const valid: CartItem[] = []; let dropped = 0;
  for (const item of value.slice(0, 1000)) { try { valid.push(checkedLine(item, products)); } catch { dropped++; } }
  const combined = combineDraft([], valid, products);
  if (!combined.ok || value.length > 1000) return { items: [], warning: "Сохраненный список превышает ограничения или содержит конфликт. Он не перезаписан; используйте сохраненный CSV или TSV." };
  return { items: combined.items, ...(dropped ? { warning: "Часть сохраненных позиций больше не соответствует каталогу. Проверьте состав перед отправкой." } : {}) };
}

function readRows(text: string, delimiter: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], cell = "", quoted = false, closed = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) { if (char === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else { quoted = false; closed = true; } } else cell += char; continue; }
    if (char === '"') { if (cell || closed) throw new Error("Некорректные кавычки в файле."); quoted = true; continue; }
    if (char === delimiter) { row.push(cell); cell = ""; closed = false; continue; }
    if (char === "\r" || char === "\n") { if (char === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; closed = false; continue; }
    if (closed && char !== " " && char !== "\t") throw new Error("После закрывающей кавычки должен быть разделитель.");
    if (!closed) cell += char;
  }
  if (quoted) throw new Error("В файле не закрыта кавычка.");
  if (cell || row.length || closed) { row.push(cell); rows.push(row); }
  return rows.filter(cells => cells.some(value => value.trim()));
}
const columns = ["sku", "packaging", "quantity", "purity", "alternatives", "neededBy"] as const;
const headers: Record<string, typeof columns[number]> = { sku: "sku", артикул: "sku", код: "sku", packaging: "packaging", фасовка: "packaging", упаковка: "packaging", quantity: "quantity", количество: "quantity", purity: "purity", чистота: "purity", alternatives: "alternatives", аналоги: "alternatives", needed_by: "neededBy", neededby: "neededBy", "нужная дата": "neededBy", срок: "neededBy" };
const unescapeSpreadsheet = (value: string) => /^'(?=\s*[=+\-@']|[\t\r])/.test(value) ? value.slice(1) : value;
export function parseQuoteFile(text: string, format: "csv" | "tsv", products: readonly DraftProduct[]): { items: CartItem[]; errors: string[] } {
  try {
    if (new TextEncoder().encode(text).byteLength > FORM_LIMITS.importBytesMax) throw new Error("Файл больше 64 КБ. Разделите список на части.");
    const source = text.replace(/^\uFEFF/, "");
    const first = source.split(/\r?\n/, 1)[0];
    const delimiter = format === "tsv" ? "\t" : (first.match(/;/g)?.length || 0) > (first.match(/,/g)?.length || 0) ? ";" : ",";
    const matrix = readRows(source, delimiter);
    if (matrix.length < 2) throw new Error("Нужны заголовки и хотя бы одна строка. Скачайте CSV или TSV для примера.");
    if (matrix.length - 1 > FORM_LIMITS.linesMax) throw new Error("В одном файле не более 30 строк товаров. Список не изменен.");
    const mapped = matrix[0].map(value => headers[value.trim().toLowerCase()]);
    if (mapped.some(value => !value) || new Set(mapped).size !== mapped.length || !["sku", "packaging", "quantity"].every(value => mapped.includes(value as typeof columns[number]))) throw new Error("Заголовки: Артикул, Фасовка, Количество. Допустимы также Чистота, Аналоги, Нужная дата.");
    const lines: CartItem[] = [], errors: string[] = [];
    matrix.slice(1).forEach((values, index) => {
      try {
        if (values.length !== mapped.length) throw new Error("Количество колонок не совпадает с заголовком.");
        const row = Object.fromEntries(mapped.map((name, position) => [name, unescapeSpreadsheet(values[position].trim())]));
        const product = products.find(item => item.sku?.toLowerCase() === row.sku.toLowerCase());
        if (!product) throw new Error(`Артикул ${row.sku || "не указан"} не найден в демо-каталоге.`);
        if (!/^\d{1,3}$/.test(row.quantity)) throw new Error("Количество: целое число от 1 до 999.");
        const alternative = (row.alternatives || "").toLowerCase();
        const alternatives: Record<string, string> = { "": "", да: "allowed", разрешены: "allowed", allowed: "allowed", нет: "not-allowed", "не разрешены": "not-allowed", "not-allowed": "not-allowed", уточнить: "discuss", discuss: "discuss" };
        if (!(alternative in alternatives)) throw new Error("Аналоги: Разрешены, Не разрешены или Уточнить.");
        lines.push(checkedLine({ productId: product.id, packaging: row.packaging, quantity: Number(row.quantity), requirements: { purity: row.purity || "", alternatives: alternatives[alternative], neededBy: row.neededBy || "" } }, products));
      } catch (error) { errors.push(`Строка ${index + 2}: ${error instanceof Error ? error.message : "Проверьте данные."}`); }
    });
    if (errors.length) return { items: [], errors };
    const merged = combineDraft([], lines, products);
    return merged.ok ? { items: merged.items, errors: [] } : { items: [], errors: [merged.error] };
  } catch (error) { return { items: [], errors: [error instanceof Error ? error.message : "Не удалось прочитать файл."] }; }
}
export function exportQuoteFile(items: readonly CartItem[], products: readonly DraftProduct[], format: "csv" | "tsv"): string {
  const delimiter = format === "tsv" ? "\t" : ";";
  const escape = (input: string) => { let value = input; if (/^(?:\s*[=+\-@]|['\t\r])/.test(value)) value = "'" + value; return '"' + value.replaceAll('"', '""') + '"'; };
  const alternatives: Record<string, string> = { allowed: "Разрешены", "not-allowed": "Не разрешены", discuss: "Уточнить" };
  const rows = [["Артикул", "Фасовка", "Количество", "Чистота", "Аналоги", "Нужная дата"], ...items.map(item => [products.find(product => product.id === item.productId)?.sku || item.productId, item.packaging, String(item.quantity), item.requirements?.purity || "", alternatives[item.requirements?.alternatives || ""] || "", item.requirements?.neededBy || ""])];
  return "\uFEFF" + rows.map(row => row.map(escape).join(delimiter)).join("\r\n") + "\r\n";
}
