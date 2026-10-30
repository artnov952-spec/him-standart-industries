import { productSearchMetadata, tagDefinitions, type TagId } from "./product-tags";

export type SearchableProduct = {
  id: string;
  name: string;
  cas?: string;
  formula?: string;
  sku?: string;
  categoryName?: string;
  description?: string;
  usage?: readonly string[];
  grade?: string;
};
export type SearchOptions = { tagIds?: readonly string[] };
export type ParsedSearchQuery = { normalized: string; tokens: string[]; tagIds: TagId[]; cas?: string; notice?: string };

/** NFKC also converts chemical subscript digits to ordinary digits. */
export function normalizeSearchText(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("ru-RU").replace(/ё/g, "е")
    .replace(/([\p{Script=Cyrillic}])(\d)/gu, "$1 $2")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}

const lemma: Record<string, string> = {
  натрия: "натрий", калия: "калий", кальция: "кальций", магния: "магний", аммония: "аммоний",
  меди: "медь", железа: "железо", алюминия: "алюминий", цинка: "цинк", кислоты: "кислота",
  кислота: "кислота", растворители: "растворитель", растворов: "раствор", растворы: "раствор",
};
const stopWords = new Set(["для", "и", "или", "в", "на", "по", "из", "с", "со", "реактив", "реактивы", "реактивов", "купить", "найти", "нужен", "нужна", "нужны", "пожалуйста", "узбекистан", "узбекистане", "ташкент", "ташкенте", "for", "and", "the", "of", "reagent", "reagents"]);
const hydrateWords: Record<string, number> = {
  моногидрат: 1, monohydrate: 1, одноводный: 1,
  дигидрат: 2, dihydrate: 2, двухводный: 2,
  тригидрат: 3, trihydrate: 3, трехводный: 3,
  тетрагидрат: 4, tetrahydrate: 4, четырехводный: 4,
  пентагидрат: 5, pentahydrate: 5, пятиводный: 5,
  гексагидрат: 6, hexahydrate: 6, шестиводный: 6,
  гептагидрат: 7, heptahydrate: 7, семиводный: 7,
  октагидрат: 8, octahydrate: 8, восьмиводный: 8,
  нонагидрат: 9, nonahydrate: 9, девятиводный: 9,
  декагидрат: 10, decahydrate: 10, десятиводный: 10,
  додекагидрат: 12, dodecahydrate: 12, двенадцативодный: 12,
  октадекагидрат: 18, octadecahydrate: 18, восемнадцативодный: 18,
};
function canonicalWord(word: string): string {
  if (/^безводн\p{L}*$/u.test(word) || word === "anhydrous") return "anhydrous";
  if (/^водн\p{L}*$/u.test(word)) return "водный";
  if (/^гидрат\p{L}*$/u.test(word) || word === "hydrate") return "hydrate";
  const exactHydrate = hydrateWords[word];
  if (exactHydrate) return `hydrate${exactHydrate}`;
  // Russian inflections: моногидрата, двухводная, шестиводное, etc.
  const inflected = Object.entries(hydrateWords).find(([term]) => /[а-я]/u.test(term)
    && (term.endsWith("ый") ? word.startsWith(term.slice(0, -2)) : word.startsWith(term)));
  return inflected ? `hydrate${inflected[1]}` : lemma[word] ?? word;
}
const tokensOf = (value: string) => normalizeSearchText(value).split(" ").filter(Boolean).map(canonicalWord);
const compact = (value: string) => normalizeSearchText(value).replace(/ /g, "");

function hydrationCounts(value: string): number[] {
  const normalized = normalizeSearchText(value);
  const counts = new Set<number>();
  for (const match of normalized.matchAll(/(?:^| )(\d+) водн\p{L}*(?= |$)/gu)) counts.add(Number(match[1]));
  for (const token of tokensOf(value)) if (/^hydrate\d+$/.test(token)) counts.add(Number(token.slice(7)));
  // The dot distinguishes water of crystallization from atoms in the base formula.
  for (const match of value.normalize("NFKC").matchAll(/[·•.*]\s*(\d*)\s*H2O/gi)) counts.add(Number(match[1] || 1));
  return [...counts];
}
const isIdentityMarker = (token: string) => token === "anhydrous" || token === "водный" || /^hydrate\d*$/.test(token);

/** Intent phrases become topic constraints; all remaining meaningful words use AND. */
export function parseSearchQuery(query: string): ParsedSearchQuery {
  const normalized = normalizeSearchText(query);
  const identifier = normalized.replace(/^(?:cas|кас)\s*/, "");
  if (/^\d[\d ]*$/.test(identifier) && /^\d{5,10}$/.test(identifier.replace(/ /g, ""))) {
    return { normalized, tokens: [], tagIds: [], cas: identifier.replace(/ /g, "") };
  }
  let remaining = ` ${normalized} `;
  // Keep a labeled CAS as an exact constraint while the other words still
  // refine the result. It must not become a fuzzy word or override a name.
  const labeledCas = remaining.match(/ (?:cas|кас)\s*((?:\d{2,7} +\d{2} +\d)|\d{5,10})(?= |$)/);
  const cas = labeledCas?.[1].replace(/ /g, "");
  if (labeledCas) remaining = remaining.replace(labeledCas[0], " ");
  const tagIds: TagId[] = [];
  // Longest phrases first so "реактивы для растений" is consumed as one intent.
  const phrases = tagDefinitions.flatMap((tag) => tag.aliases.map((alias) => ({ id: tag.id, phrase: normalizeSearchText(alias) })))
    .sort((a, b) => b.phrase.length - a.phrase.length);
  for (const { id, phrase } of phrases) {
    const needle = ` ${phrase} `;
    if (remaining.includes(needle)) {
      if (!tagIds.includes(id)) tagIds.push(id);
      while (remaining.includes(needle)) remaining = remaining.replace(needle, " ");
    }
  }
  const tokens = [...new Set(tokensOf(remaining).filter((token) => !stopWords.has(token)))];
  return {
    normalized, tokens, tagIds, ...(cas ? { cas } : {}),
    ...(tagIds.includes("agrochemistry") ? { notice: "Подбор для анализа почв и питательных элементов. Пригодность для внесения в почву, удобрения или обработки растений не подтверждается." }
      : normalized.includes("медицинск") ? { notice: "Подбор для лабораторных аналитических методик. Медицинский допуск, диагностическое применение и применение к пациенту не подтверждаются." } : {}),
  };
}

/** One insertion/deletion/substitution or adjacent transposition, only for long words. */
function oneTypo(a: string, b: string): boolean {
  if (a.length < 5 || b.length < 5 || !/^\p{L}+$/u.test(a) || !/^\p{L}+$/u.test(b) || Math.abs(a.length - b.length) > 1) return false;
  if (a === b) return true;
  if (a.length === b.length) {
    const mismatches: number[] = [];
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) mismatches.push(i);
    if (mismatches.length === 1) return true;
    return mismatches.length === 2 && mismatches[1] === mismatches[0] + 1
      && a[mismatches[0]] === b[mismatches[1]] && a[mismatches[1]] === b[mismatches[0]];
  }
  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a];
  let index = 0;
  while (index < shorter.length && shorter[index] === longer[index]) index++;
  return shorter.slice(index) === longer.slice(index + 1);
}

function wordScore(token: string, words: readonly string[], weight: number): number {
  if (words.includes(token)) return weight;
  // Prefixes serve incomplete typing; numeric identifiers and formulas stay exact.
  if (token.length >= 3 && /^\p{L}+$/u.test(token) && words.some((word) => /^\p{L}+$/u.test(word) && word.startsWith(token))) return weight * 0.65;
  if (words.some((word) => oneTypo(token, word))) return weight * 0.35;
  return 0;
}

/**
 * Returns original objects in relevance order without changing input data.
 * Explicit tagIds AND recognized intent tags must all match. Unknown tags return [].
 * Empty queries preserve input order. CAS/formulas/SKU are exact, case-insensitive.
 */
export function searchProducts<T extends SearchableProduct>(products: readonly T[], query: string, options: SearchOptions = {}): T[] {
  const parsed = parseSearchQuery(query);
  const requiredTags = [...new Set([...(options.tagIds ?? []), ...parsed.tagIds])];
  if (requiredTags.some((id) => !tagDefinitions.some((tag) => tag.id === id))) return [];
  const queryCompact = compact(query);
  // CAS digits are not hydration counts when followed by a word like "водный".
  const requestedHydrates = hydrationCounts(parsed.cas ? parsed.tokens.join(" ") : query);
  const ranked: { product: T; score: number; index: number }[] = [];
  products.forEach((product, index) => {
    const metadata = productSearchMetadata[product.id];
    if (requiredTags.some((tag) => !metadata?.tags.some((id) => id === tag))) return;
    if (parsed.cas && compact(product.cas ?? "") !== parsed.cas) return;
    if (!parsed.normalized || !parsed.tokens.length) {
      ranked.push({ product, score: parsed.cas ? 1000 : 0, index });
      return;
    }
    // Exact chemical identifiers bypass token splitting (hydrates may contain dots).
    if (queryCompact === compact(product.formula ?? "") || queryCompact === compact(product.sku ?? "")) {
      ranked.push({ product, score: 1000, index });
      return;
    }
    const name = tokensOf(product.name);
    const aliases = (metadata?.aliases ?? []).flatMap(tokensOf);
    const identityText = [product.name, ...(metadata?.aliases ?? []), product.formula ?? ""].join(" ");
    const hydrates = hydrationCounts(identityText);
    if (requestedHydrates.some((count) => !hydrates.includes(count))) return;
    const hydrationWords = hydrates.flatMap((count) => [`hydrate${count}`, "hydrate", String(count), "водный"]);
    const identifiers = [...tokensOf([product.cas, product.formula, product.sku].filter(Boolean).join(" ")), ...hydrationWords];
    const details = tokensOf([product.categoryName, product.description, ...(product.usage ?? []), product.grade].filter(Boolean).join(" "));
    let score = 0;
    for (const token of parsed.tokens) {
      // A comparison such as "отличайте от безводного хлорида" cannot identify
      // the hydrate as an anhydrous product. Ordinary usage words still use body.
      const identityMarker = isIdentityMarker(token);
      const markerScore = identityMarker ? [name, aliases, identifiers].some((words) => words.includes(token)) ? 25 : 0 : null;
      const termScore = markerScore ?? Math.max(wordScore(token, name, 30), wordScore(token, aliases, 25), wordScore(token, identifiers, 20), wordScore(token, details, 4));
      if (!termScore) return;
      score += termScore;
    }
    const phrase = parsed.tokens.join(" ");
    if (tokensOf(product.name).join(" ") === phrase) score += 100;
    if ((metadata?.aliases ?? []).some((alias) => tokensOf(alias).join(" ") === phrase)) score += 80;
    ranked.push({ product, score, index });
  });
  return ranked.sort((a, b) => b.score - a.score || a.index - b.index).map(({ product }) => product);
}
