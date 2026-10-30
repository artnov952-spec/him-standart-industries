export const FORM_LIMITS = Object.freeze({ companyMin: 2, companyMax: 160, nameMin: 2, nameMax: 100, cityMin: 2, cityMax: 100, phoneMin: 9, phoneMax: 30, emailMax: 160, quoteCommentMax: 2000, reviewTextMax: 3000, linesMax: 30, quantityMax: 999, purityMax: 120, bodyBytesMax: 32768, importBytesMax: 65536 });

/** @param {unknown} value */
export function normalizeLineRequirements(value) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) throw new Error("Проверьте требования к позиции.");
  const input = /** @type {Record<string, unknown>} */ (value);
  /** @param {string} key @param {number} max */
  const field = (key, max) => {
    const item = input[key];
    if (item === undefined || item === null || item === "") return "";
    if (typeof item !== "string") throw new Error("Проверьте требования к позиции.");
    const text = item.trim();
    if (text.length > max || /[\u0000-\u001f]/.test(text)) throw new Error("Требования к чистоте: не более 120 символов, без служебных символов.");
    return text;
  };
  const purity = field("purity", FORM_LIMITS.purityMax), alternatives = field("alternatives", 16), neededBy = field("neededBy", 10);
  if (!["", "allowed", "not-allowed", "discuss"].includes(alternatives)) throw new Error("Выберите условие по аналогам.");
  if (neededBy && (!/^\d{4}-\d{2}-\d{2}$/.test(neededBy) || Number.isNaN(Date.parse(neededBy + "T00:00:00Z")) || new Date(neededBy + "T00:00:00Z").toISOString().slice(0, 10) !== neededBy)) throw new Error("Укажите существующую дату в формате ГГГГ-ММ-ДД.");
  return purity || alternatives || neededBy ? { purity, alternatives, neededBy } : undefined;
}
