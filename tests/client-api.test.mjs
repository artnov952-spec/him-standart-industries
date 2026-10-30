import test from 'node:test';
import assert from 'node:assert/strict';
import { postJson } from '../lib/client-api.ts';
const fallback = 'Не удалось сохранить данные. Повторите отправку позже.';

test('postJson returns confirmed JSON and sends the exact request id', async t => {
  let sent;
  t.mock.method(globalThis, 'fetch', async (_url, options) => { sent = JSON.parse(options.body); return Response.json({ ok: true, id: 'HSI-test' }); });
  assert.deepEqual(await postJson('/api/requests', { requestId: 'fixed-id' }, fallback), { ok: true, id: 'HSI-test' });
  assert.equal(sent.requestId, 'fixed-id');
});
test('network and non-JSON errors are localized and do not leak raw English or HTML', async t => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch private detail'); });
  await assert.rejects(postJson('/api/requests', {}, fallback), error => /Нет связи/.test(error.message) && !/Failed/.test(error.message));
  t.mock.method(globalThis, 'fetch', async () => new Response('<html>Internal stack</html>', { status: 502 }));
  await assert.rejects(postJson('/api/requests', {}, fallback), error => /временно недоступен/.test(error.message) && !/html|stack/.test(error.message));
});
test('Russian validation errors are retained, unknown English server messages use fallback', async t => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ error: 'Проверьте количество.' }, { status: 400 }));
  await assert.rejects(postJson('/api/requests', {}, fallback), { message: 'Проверьте количество.' });
  t.mock.method(globalThis, 'fetch', async () => Response.json({ error: 'Database connection private stack' }, { status: 503 }));
  await assert.rejects(postJson('/api/requests', {}, fallback), { message: fallback });
  t.mock.method(globalThis, 'fetch', async () => Response.json({ error: 'Ошибка Database private stack' }, { status: 503 }));
  await assert.rejects(postJson('/api/requests', {}, fallback), { message: fallback });
});
test('oversized UTF-8 requests are blocked before fetch and invalid success JSON is rejected', async t => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => { calls++; return Response.json(null); });
  await assert.rejects(postJson('/api/requests', { comment: 'я'.repeat(17000) }, fallback), error => /слишком большой/.test(error.message));
  assert.equal(calls, 0);
  await assert.rejects(postJson('/api/requests', {}, fallback), error => /не подтвердил/.test(error.message));
});
test('a timeout gives a localized retry message and aborts the request', async t => {
  t.mock.method(globalThis, 'setTimeout', callback => { queueMicrotask(callback); return 0; });
  t.mock.method(globalThis, 'fetch', async (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))));
  await assert.rejects(postJson('/api/requests', {}, fallback), error => /дольше обычного/.test(error.message) && !/Aborted/.test(error.message));
});
