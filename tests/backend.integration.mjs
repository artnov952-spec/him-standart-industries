// Run only against this demo's local preview: HIM_TEST_URL=http://127.0.0.1:PORT node --test tests/backend.integration.mjs
// Test requests contain fictional contacts, stay in demo storage, and never invoke Telegram.
import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.HIM_TEST_URL;
const enabled = !!base && ['127.0.0.1', 'localhost', '[::1]'].includes(new URL(base).hostname);
// A stable demo fixture keeps HTTP checks independent of the app bundler's TS imports.
const product = { id: 'ethanol-96', packages: ['1 л', '5 л'] };
const post = async (path, body, extra = {}) => {
  const response = await fetch(new URL(path, base), { method: 'POST', headers: { 'content-type': 'application/json', ...extra }, body: JSON.stringify(body) });
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { error: text }; }
  return { response, data };
};

test('quote persistence, stable retry and invalid input through HTTP', { skip: !enabled }, async () => {
  const body = {
    requestId: crypto.randomUUID(), company: 'Тестовая организация (проверка сайта)', name: 'Тестовый закупщик',
    phone: '+998900000000', city: 'Ташкент', email: 'demo-test@example.invalid', comment: 'Тест сквозного сохранения заявки. Реальная поставка не требуется.', website: '',
    items: [{ productId: product.id, packaging: product.packages[0], quantity: 2 }],
  };
  const first = await post('/api/requests', body);
  assert.equal(first.response.status, 201, JSON.stringify(first.data));
  assert.equal(first.data.ok, true);
  assert.equal(first.data.mode, 'demo');
  assert.match(first.data.id, /^HSI-/);
  assert.equal(first.response.headers.get('cache-control'), 'no-store');
  assert.equal(JSON.stringify(first.data).includes(body.phone), false);
  const repeated = await post('/api/requests', body);
  assert.equal(repeated.response.status, 200);
  assert.equal(repeated.data.id, first.data.id);
  const changed = await post('/api/requests', { ...body, company: 'Другая организация' });
  assert.equal(changed.response.status, 409);
  const invalid = await post('/api/requests', { ...body, requestId: crypto.randomUUID(), items: [{ ...body.items[0], quantity: 0 }] });
  assert.equal(invalid.response.status, 400);
  const crossOrigin = await post('/api/requests', { ...body, requestId: crypto.randomUUID() }, { origin: 'https://unrelated.invalid' });
  assert.equal(crossOrigin.response.status, 403);
  const free = await post('/api/requests', { ...body, requestId: crypto.randomUUID(), items: [], comment: 'Нужен расчет по перечню реактивов, которых пока нет в демонстрационном каталоге.' });
  assert.equal(free.response.status, 201, JSON.stringify(free.data));
  const noPublicRead = await fetch(new URL('/api/requests', base));
  assert.equal(noPublicRead.status, 405);
});

test('review persistence, pending privacy and company/product separation through HTTP', { skip: !enabled }, async () => {
  const body = { requestId: crypto.randomUUID(), subject: product.id, name: 'Тестовый автор', organization: 'Тестовая лаборатория', rating: 3, text: 'Тестовый отзыв для проверки модерации. Это не отзыв реального покупателя.', website: '' };
  const first = await post('/api/reviews', body);
  assert.equal(first.response.status, 201, JSON.stringify(first.data));
  assert.equal(first.data.status, 'pending');
  const repeated = await post('/api/reviews', body);
  assert.equal(repeated.response.status, 200);
  assert.equal(repeated.data.id, first.data.id);
  const changed = await post('/api/reviews', { ...body, rating: 1 });
  assert.equal(changed.response.status, 409);
  for (const subject of [product.id, 'company']) {
    const response = await fetch(new URL(`/api/reviews?subject=${encodeURIComponent(subject)}`, base));
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.reviews.some(review => review.id === first.data.id), false);
    assert.equal(typeof data.count, 'number');
    assert.equal(Object.values(data.distribution).reduce((sum, n) => sum + n, 0), data.count);
  }
  const unauthorizedModeration = await post('/api/moderate', { reviewId: first.data.id, status: 'approved' });
  assert.equal(unauthorizedModeration.response.status, 403);
  const unknown = await fetch(new URL('/api/reviews?subject=unknown-product', base));
  assert.equal(unknown.status, 404);
});
