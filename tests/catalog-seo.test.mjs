import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { tsImport } from 'tsx/esm/api';

const routing = await tsImport('../lib/catalog-routing.ts', import.meta.url);
const { products, categories } = await tsImport('../lib/catalog.ts', import.meta.url);
const { IS_DEMO, SITE_URL, pageMeta, articleSocialImage } = await tsImport('../lib/site.ts', import.meta.url);
const { allArticles } = await tsImport('../lib/articles.ts', import.meta.url);
const { tagDefinitions } = await tsImport('../lib/product-tags.ts', import.meta.url);
const { serializeStructuredData } = await tsImport('../components/StructuredData.tsx', import.meta.url);
const { renderCatalog } = await tsImport('./fixtures/catalog-ssr.tsx', import.meta.url);

const stateFor = href => routing.catalogServerState(Object.fromEntries(new URL(href, SITE_URL).searchParams));
const decodeAttribute = value => value.replaceAll('&amp;', '&');

test('base and category pagination have self canonicals; presentation duplicates collapse', () => {
  const base = stateFor('/catalog?page=2');
  assert.equal(base.seo.canonicalPath, '/catalog?page=2');
  assert.equal(base.seo.selectionOnly, false);
  for (const category of categories) {
    const state = stateFor(`/catalog?category=${category.id}&page=2&view=list&sort=name`);
    assert.equal(state.seo.canonicalPath, `/catalog?category=${category.id}${state.filters.page > 1 ? `&page=${state.filters.page}` : ''}`);
    assert.equal(state.seo.heading, category.label);
    assert.ok(state.seo.description.includes(category.description));
    assert.equal(state.seo.selectionOnly, false);
  }
});

test('selection states retain their real collection identity and remain noindex, including demo pages', () => {
  for (const query of ['q=анализ+воды', `grade=${encodeURIComponent(products[0].grade)}`, `tag=${tagDefinitions[0].id}`, 'sort=name-desc']) {
    const state = stateFor(`/catalog?${query}`);
    assert.equal(state.seo.selectionOnly, true);
    assert.match(state.seo.canonicalPath, /q=|grade=|tag=|sort=/);
    const meta = pageMeta(state.seo.title, state.seo.description, state.seo.canonicalPath, { selectionOnly: state.seo.selectionOnly });
    assert.equal(meta.robots.index, false);
  }
  assert.equal(IS_DEMO, true);
  assert.equal(pageMeta('Каталог', 'Описание', '/catalog').robots.index, false);
  const technical = stateFor(`/catalog?grade=${encodeURIComponent(products[0].grade)}`);
  assert.equal(technical.seo.selectionOnly, true);
  assert.ok(!stateFor('/catalog?q=%3Cscript%3E').seo.title.includes('<script>'));
});

test('next/previous hrefs preserve every active selector without tracking or duplicate parameters', () => {
  const filters = { query: 'анализ воды', category: categories[0].id, grade: products[0].grade, tag: tagDefinitions[0].id, sort: 'name-desc', view: 'list', page: 2 };
  const url = new URL(routing.catalogHref(filters, 3, true), SITE_URL);
  assert.equal(url.hash, '#catalog-results');
  assert.deepEqual(Object.fromEntries(url.searchParams), { q: filters.query, category: filters.category, grade: filters.grade, tag: filters.tag, sort: filters.sort, view: filters.view, page: '3' });
});

test('malformed or out-of-range control parameters normalize once, preserving unrelated campaign data', () => {
  for (const input of [{ page: '9999', utm_source: 'test' }, { page: '-2' }, { page: '1.5' }, { page: ['2', '3'] }, { category: 'missing', grade: 'missing', tag: 'missing', sort: 'missing', view: 'missing' }, { q: '  соль  ', page: '01' }]) {
    const state = routing.catalogServerState(input);
    assert.ok(state.redirectPath, JSON.stringify(input));
    const destination = new URL(state.redirectPath, SITE_URL);
    assert.equal(stateFor(destination.href).redirectPath, null);
    if (input.utm_source) assert.equal(destination.searchParams.get('utm_source'), input.utm_source);
    assert.ok(state.filters.page <= state.pageCount);
  }
});

test('actual server-rendered next links reach all 50 products and each category without JavaScript', () => {
  const collections = [{ path: '/catalog', expected: products }, ...categories.map(category => ({ path: `/catalog?category=${category.id}`, expected: products.filter(product => product.category === category.id) }))];
  for (const { path, expected } of collections) {
    const seenPages = new Set(), found = new Set();
    let href = path;
    while (href) {
      const state = stateFor(href);
      assert.equal(state.redirectPath, null, href);
      assert.ok(!seenPages.has(state.filters.page), `pagination loop: ${href}`);
      seenPages.add(state.filters.page);
      const html = renderCatalog(state.filters);
      for (const match of html.matchAll(/<a\b[^>]*href="\/catalog\/([^"#?]+)"[^>]*class="product-image"/g)) found.add(match[1]);
      const next = [...html.matchAll(/<a\b[^>]*>/g)].filter(match => /\brel="next"/.test(match[0]));
      assert.ok(next.length <= 1);
      href = next[0] ? decodeAttribute(next[0][0].match(/\bhref="([^"]+)"/)[1]) : '';
    }
    assert.equal(seenPages.size, Math.max(1, Math.ceil(expected.length / routing.catalogPageSize)));
    assert.deepEqual([...found].sort(), expected.map(product => product.id).sort(), path);
  }
});

test('JSON-LD escaping preserves its exact values and cannot terminate its script element', () => {
  const value = { '@context': 'https://schema.org', name: '</script><script>alert(1)</script>', description: 'строка\u2028другая\u2029строка', nested: { formula: 'H₂O < 3' } };
  const serialized = serializeStructuredData(value);
  assert.equal(serialized.includes('<'), false);
  assert.deepEqual(JSON.parse(serialized), value);
});

test('all six articles have existing 1200×630 PNG social previews and unique section anchors', async () => {
  assert.equal(allArticles.length, 6);
  assert.equal(new Set(allArticles.map(article => article.slug)).size, 6);
  for (const article of allArticles) {
    assert.equal(new Set(article.sections.map(section => section.id)).size, article.sections.length, article.slug);
    const image = articleSocialImage(article.slug, article.title);
    const png = await readFile(new URL(`../public${image.url}`, import.meta.url));
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
  }
});
