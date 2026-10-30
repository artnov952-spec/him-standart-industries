import test from 'node:test';
import assert from 'node:assert/strict';
import { changeDraftPackaging, combineDraft, exportQuoteFile, parseQuoteFile, restoreDraft } from '../lib/quote-draft.ts';
import { normalizeQuote, payloadHash, sha256 } from '../lib/server-validation.ts';
import { FORM_LIMITS } from '../lib/form-contract.mjs';

const products = [{ id: 'salt', sku: 'HIM-002', name: 'Натрий хлористый', packages: ['1 кг', '5 кг'] }, { id: 'ethanol', sku: 'HIM-001', packages: ['1 л', '5 л'] }];
const line = (packaging, quantity, requirements) => ({ productId: 'salt', packaging, quantity, ...(requirements ? { requirements } : {}) });
const quote = patch => ({ requestId: 'e6bbeded-15de-44c1-833f-e51728c75db8', company: 'Организация', name: 'Закупщик', phone: '+998900000000', email: '', city: 'Ташкент', comment: '', website: '', items: [line('1 кг', 1)], ...patch });

test('packaging overflow preserves both original lines and quantities', () => {
  const original = [line('1 кг', 600), line('5 кг', 600)];
  const result = changeDraftPackaging(original, 'salt', '1 кг', '5 кг', products);
  assert.equal(result.ok, false); assert.deepEqual(result.items, original); assert.match(result.error, /999/);
  assert.deepEqual(original, [line('1 кг', 600), line('5 кг', 600)]);
});
test('ordinary packaging merge is atomic and exact, adding past 999 is rejected', () => {
  assert.deepEqual(changeDraftPackaging([line('1 кг', 2), line('5 кг', 3)], 'salt', '1 кг', '5 кг', products), { ok: true, items: [line('5 кг', 5)] });
  const original = [line('1 кг', 999)];
  assert.deepEqual(combineDraft(original, [line('1 кг', 1)], products).items, original);
  assert.equal(combineDraft(original, [line('1 кг', 1)], products).ok, false);
});
test('merging different technical requirements cannot silently overwrite them', () => {
  const one = { purity: 'ч.д.а.', alternatives: 'not-allowed', neededBy: '' }, two = { purity: 'х.ч.', alternatives: 'allowed', neededBy: '' };
  const original = [line('1 кг', 2, one), line('5 кг', 3, two)];
  assert.deepEqual(changeDraftPackaging(original, 'salt', '1 кг', '5 кг', products).items, original);
  assert.equal(changeDraftPackaging(original, 'salt', '1 кг', '5 кг', products).ok, false);
});
test('CSV and TSV round-trip quantities, requirements, quotes and safe formula text', () => {
  for (const purity of ['ч.д.а.; "по методике"', '=SUM(1,2)', "'=буквальный текст", "  =не формула"]) {
    const input = [line('1 кг', 12, { purity, alternatives: 'discuss', neededBy: '2028-02-29' })];
    for (const format of ['csv', 'tsv']) {
      const exported = exportQuoteFile(input, products, format);
      const parsed = parseQuoteFile(exported, format, products);
      assert.deepEqual(parsed.errors, []);
      assert.deepEqual(parsed.items, [line('1 кг', 12, { purity: purity.trim(), alternatives: 'discuss', neededBy: '2028-02-29' })]);
      if (purity.trimStart().startsWith('=')) assert.match(exported, /'=|\x27  =/);
    }
  }
});
test('invalid file rows never return a partially accepted request', () => {
  const header = 'Артикул;Фасовка;Количество\n';
  for (const row of ['UNKNOWN;1 кг;1', 'HIM-002;100 кг;1', 'HIM-002;1 кг;1.5', 'HIM-002;1 кг;1000', 'HIM-002;1 кг;1e2']) {
    const result = parseQuoteFile(header + 'HIM-002;1 кг;2\n' + row, 'csv', products);
    assert.deepEqual(result.items, []); assert.ok(result.errors.length);
  }
  assert.ok(parseQuoteFile(header + '"HIM-002;1 кг;1', 'csv', products).errors.length);
});
test('duplicate file rows merge exactly; overflow, conflicts, 31 rows and huge files reject', () => {
  const header = 'Артикул;Фасовка;Количество\n';
  assert.deepEqual(parseQuoteFile(header + 'HIM-002;1 кг;2\nHIM-002;1 кг;3', 'csv', products).items, [line('1 кг', 5)]);
  for (const text of [header + 'HIM-002;1 кг;600\nHIM-002;1 кг;600', header + Array(31).fill('HIM-002;1 кг;1').join('\n'), 'а'.repeat(FORM_LIMITS.importBytesMax)]) {
    const result = parseQuoteFile(text, 'csv', products); assert.deepEqual(result.items, []); assert.ok(result.errors.length);
  }
});
test('restore rejects overflow instead of truncating to 999 or the first 30 records', () => {
  const result = restoreDraft([line('1 кг', 600), line('1 кг', 600)], products);
  assert.deepEqual(result.items, []); assert.ok(result.warning);
  assert.ok(restoreDraft(Array(31).fill(line('1 кг', 1)), products).warning);
});
test('request comment boundary and optional requirements share the client contract', () => {
  assert.equal(normalizeQuote(quote({ comment: 'а'.repeat(FORM_LIMITS.quoteCommentMax) }), products).comment.length, 2000);
  assert.throws(() => normalizeQuote(quote({ comment: 'а'.repeat(2001) }), products), error => error.status === 400);
  const requirements = { purity: ' ч.д.а. ', alternatives: 'not-allowed', neededBy: '2028-02-29' };
  assert.equal(normalizeQuote(quote({ items: [line('1 кг', 1, requirements)] }), products).items[0].requirements.purity, 'ч.д.а.');
  assert.throws(() => normalizeQuote(quote({ items: [line('1 кг', 1, { ...requirements, neededBy: '2027-02-29' })] }), products), error => error.status === 400);
  assert.throws(() => normalizeQuote(quote({ items: [line('1 кг', 1, { ...requirements, alternatives: 'anything' })] }), products), error => error.status === 400);
});
test('documents intent preserves identity, rejects unknown products, and defaults legacy calls', async () => {
  const docs = normalizeQuote(quote({ items: [], comment: 'Запрос паспорта качества на реактив.', intent: 'documents', productId: 'salt' }), products);
  assert.equal(docs.intent, 'documents'); assert.equal(docs.productId, 'salt'); assert.deepEqual(docs.items, []);
  assert.throws(() => normalizeQuote(quote({ productId: 'unknown' }), products), error => error.status === 400);
  const normalized = normalizeQuote(quote(), products);
  assert.equal(normalized.intent, 'quote'); assert.equal(normalized.productId, null);
  const { requestId, intent, productId, ...legacy } = normalized;
  assert.equal(await payloadHash(normalized), await sha256(JSON.stringify(legacy)));
  assert.notEqual(await payloadHash(docs), await payloadHash(normalized));
});
test('30 maximum-length technical rows and a 2000-character comment fit the shared body limit', () => {
  const catalog = Array.from({ length: 30 }, (_, index) => ({ id: `product-${index}-${'a'.repeat(80)}`, packages: ['1 кг'] }));
  const input = quote({ company: '界'.repeat(160), name: '界'.repeat(100), city: '界'.repeat(100), comment: '界'.repeat(2000), items: catalog.map(product => ({ productId: product.id, packaging: '1 кг', quantity: 999, requirements: { purity: '界'.repeat(120), alternatives: 'not-allowed', neededBy: '2028-02-29' } })) });
  assert.ok(new TextEncoder().encode(JSON.stringify(input)).byteLength < FORM_LIMITS.bodyBytesMax);
  assert.equal(normalizeQuote(input, catalog).items.length, 30);
});
