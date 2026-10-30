import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tsImport } from 'tsx/esm/api';

const { products } = await tsImport('../lib/catalog.ts', import.meta.url);
const { getProductPhoto } = await tsImport('../components/ProductImage.tsx', import.meta.url);

// Fixed delivery contract: lossy VP8X with alpha, 320/480/720/960 square variants.
// Container fields: https://developers.google.com/speed/webp/docs/riff_container
function assertWebp(bytes, size, path) {
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', path);
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', path);
  assert.equal(bytes.toString('ascii', 12, 16), 'VP8X', path);
  assert.ok(bytes[20] & 0x10, `missing alpha: ${path}`);
  assert.equal(bytes.readUIntLE(24, 3) + 1, size, path);
  assert.equal(bytes.readUIntLE(27, 3) + 1, size, path);
}

test('all 50 product images and their four alpha WebP sizes have distinct content', async () => {
  const seenPaths = new Map(), seenHashes = new Map(), seenResponsive = new Map(), seenSources = new Map();
  for (const product of products) {
    const photo = getProductPhoto(product);
    assert.ok(!seenPaths.has(photo.src), `${product.id} repeats ${seenPaths.get(photo.src)}: ${photo.src}`);
    seenPaths.set(photo.src, product.id);
    const bytes = await readFile(new URL(`../public${photo.src}`, import.meta.url));
    const hash = createHash('sha256').update(bytes).digest('hex');
    assert.ok(!seenHashes.has(hash), `${product.id} copies image bytes from ${seenHashes.get(hash)}`);
    seenHashes.set(hash, product.id);
    assert.ok(photo.alt?.trim(), product.id);
    assert.ok(photo.credit?.url?.startsWith('https://'), product.id);
    assert.ok(!seenSources.has(photo.credit.url), `${product.id} reuses source from ${seenSources.get(photo.credit.url)}`);
    seenSources.set(photo.credit.url, product.id);
    assert.ok(photo.credit?.license, product.id);
    assert.equal(photo.width, photo.height, product.id);
    assert.ok(photo.srcSet, product.id);
    const widths = [];
    for (const entry of photo.srcSet.split(',')) {
      const [path, width] = entry.trim().split(/\s+/);
      assert.match(width, /^(320|480|720|960)w$/);
      const size = Number.parseInt(width, 10);
      widths.push(size);
      const variant = await readFile(new URL(`../public${path}`, import.meta.url));
      assertWebp(variant, size, path);
      const contentKey = `${size}:${createHash('sha256').update(variant).digest('hex')}`;
      assert.ok(!seenResponsive.has(contentKey), `${product.id} repeats ${width} image from ${seenResponsive.get(contentKey)}`);
      seenResponsive.set(contentKey, product.id);
    }
    assert.deepEqual(widths.sort((a,b) => a-b), [320,480,720,960], product.id);
  }
  assert.equal(seenPaths.size, 50);
});
