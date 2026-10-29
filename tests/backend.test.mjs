import test from 'node:test';
import assert from 'node:assert/strict';
import { assertSameOrigin, errorResponse, InputError, normalizeQuote, normalizeReview, normalizeSubject, payloadHash, readJson, samePayloadOrThrow } from '../lib/server-validation.ts';

const products = [
  { id: 'ethanol', packages: ['1 л', '5 л'] },
  { id: 'sodium-chloride', packages: ['1 кг'] },
];
const id = 'e6bbeded-15de-44c1-833f-e51728c75db8';
const quote = () => ({ requestId: id, company: ' Тестовая организация ', name: ' Анвар ', phone: '+998 (90) 123-45-67', email: 'BUYER@EXAMPLE.COM', city: 'Ташкент', comment: '', website: '', items: [{ productId: 'ethanol', packaging: '1 л', quantity: 2 }] });
const review = () => ({ requestId: id, subject: 'ethanol', name: 'Анвар', organization: 'Лаборатория', rating: 4, text: 'Полезный отзыв о качестве выбранной продукции.', website: '' });

test('quote normalizes fields and accepts Uzbekistan phone', () => {
  const result = normalizeQuote(quote(), products);
  assert.equal(result.company, 'Тестовая организация');
  assert.equal(result.name, 'Анвар');
  assert.equal(result.phone, '+998901234567');
  assert.equal(result.email, 'buyer@example.com');
  assert.equal(result.items[0].quantity, 2);
});
test('unknown product and unknown packaging are rejected', () => {
  for (const item of [{ productId: 'unknown', packaging: '1 л', quantity: 1 }, { productId: 'ethanol', packaging: '100 л', quantity: 1 }]) {
    assert.throws(() => normalizeQuote({ ...quote(), items: [item] }, products), InputError);
  }
});
test('quantities must be integer numbers within bounds', () => {
  for (const quantity of [0, -1, 1000, 1.5, '2', Number.NaN]) {
    assert.throws(() => normalizeQuote({ ...quote(), items: [{ productId: 'ethanol', packaging: '1 л', quantity }] }, products), InputError);
  }
});
test('duplicate cart lines merge, but combined overflow is rejected', () => {
  const items = [{ productId: 'ethanol', packaging: '1 л', quantity: 2 }, { productId: 'ethanol', packaging: '1 л', quantity: 3 }];
  assert.deepEqual(normalizeQuote({ ...quote(), items }, products).items, [{ productId: 'ethanol', packaging: '1 л', quantity: 5 }]);
  assert.throws(() => normalizeQuote({ ...quote(), items: items.map(i => ({ ...i, quantity: 600 })) }, products), InputError);
});
test('free specification request works without catalog lines only with meaningful comment', () => {
  assert.deepEqual(normalizeQuote({ ...quote(), items: [], comment: 'Требуются стандартные растворы, список направим менеджеру.' }, products).items, []);
  assert.throws(() => normalizeQuote({ ...quote(), items: [], comment: 'нет' }, products), InputError);
});
test('line limit, contact fields, email and honeypot are validated', () => {
  for (const changed of [{ items: Array(31).fill(quote().items[0]) }, { company: '' }, { name: 'a' }, { city: '' }, { email: 'bad email' }, { phone: 'call-me-please' }, { website: 'https://spam.test' }, { requestId: '' }]) {
    assert.throws(() => normalizeQuote({ ...quote(), ...changed }, products), InputError);
  }
});
test('same semantic cart hashes equally despite request id and line ordering', async () => {
  const one = normalizeQuote({ ...quote(), items: [...quote().items, { productId: 'sodium-chloride', packaging: '1 кг', quantity: 1 }] }, products);
  const two = normalizeQuote({ ...quote(), requestId: 'f6bbeded-15de-44c1-833f-e51728c75db8', items: [...one.items].reverse() }, products);
  const firstHash = await payloadHash(one);
  const secondHash = await payloadHash(two);
  assert.equal(firstHash, secondHash);
  assert.doesNotThrow(() => samePayloadOrThrow(firstHash, secondHash));
  assert.throws(() => samePayloadOrThrow(firstHash, 'changed'), error => error.status === 409);
});
test('product and company review subjects are distinct', () => {
  assert.equal(normalizeReview(review(), products).subject, 'ethanol');
  assert.equal(normalizeReview({ ...review(), subject: 'company' }, products).subject, 'company');
  assert.throws(() => normalizeSubject('not-a-product', products), error => error.status === 404);
});
test('review rating, author, text and spam trap reject invalid input', () => {
  for (const changed of [{ rating: 0 }, { rating: 6 }, { rating: 1.5 }, { rating: '5' }, { name: '' }, { text: 'short' }, { website: 'spam' }]) {
    assert.throws(() => normalizeReview({ ...review(), ...changed }, products), InputError);
  }
  const untrusted = '<script>alert("test")</script>';
  assert.equal(normalizeReview({ ...review(), text: untrusted }, products).text, untrusted);
});
test('cross-origin browser requests are rejected; same-origin and no-origin clients allowed', () => {
  const request = origin => new Request('https://him.example/api/requests', { headers: origin ? { origin } : {} });
  assert.doesNotThrow(() => assertSameOrigin(request('https://him.example')));
  assert.doesNotThrow(() => assertSameOrigin(request()));
  assert.throws(() => assertSameOrigin(request('https://other.example')), error => error.status === 403);
  assert.throws(() => assertSameOrigin(request('null')), error => error.status === 403);
  assert.throws(() => assertSameOrigin(new Request('https://him.example/api/requests', { headers: { 'sec-fetch-site': 'cross-site' } })), error => error.status === 403);
});
test('JSON parser enforces content type, valid JSON and byte limit', async () => {
  const make = (body, contentType = 'application/json') => new Request('https://him.example/api/requests', { method: 'POST', headers: { 'content-type': contentType }, body });
  assert.deepEqual(await readJson(make('{"ok":true}')), { ok: true });
  await assert.rejects(readJson(make('{bad json}')), error => error.status === 400);
  await assert.rejects(readJson(make('{}', 'text/plain')), error => error.status === 415);
  await assert.rejects(readJson(make(JSON.stringify({ text: 'я'.repeat(17000) }))), error => error.status === 413);
});
test('API errors contain no internal database details and are not cached', async () => {
  const response = errorResponse(new Error('SQL_ERROR private field phone +998...'));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(JSON.stringify(await response.json()).includes('SQL_ERROR'), false);
});
