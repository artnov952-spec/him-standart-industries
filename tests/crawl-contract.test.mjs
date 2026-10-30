import test from "node:test";
import assert from "node:assert/strict";
import { sourceTitles, expectedCanonicalUrl } from "./crawl-contract.mjs";

test("streamed React title strings are excluded, real duplicate elements are detected", () => {
  const html = '<title>Реактив</title><script>window.payload="<title>Реактив</title>"</script>';
  assert.deepEqual(sourceTitles(html), ["Реактив"]);
  assert.deepEqual(sourceTitles(html + '<title>Настоящий дубль</title>'), ["Реактив", "Настоящий дубль"]);
});
test("crawl acceptance preserves page and selection canonicals without presentation or tracking", () => {
  const origin = "https://example.invalid";
  assert.equal(expectedCanonicalUrl(origin + "/catalog?page=2&utm_source=test", origin), origin + "/catalog?page=2");
  assert.equal(expectedCanonicalUrl(origin + "/catalog?category=salts&view=list&sort=name", origin), origin + "/catalog?category=salts");
  assert.equal(expectedCanonicalUrl(origin + "/catalog?tag=buffers&page=2", origin), origin + "/catalog?tag=buffers&page=2");
  assert.equal(expectedCanonicalUrl(origin + "/catalog?q=NaCl&sort=name", origin), origin + "/catalog?q=NaCl&sort=name");
  assert.equal(expectedCanonicalUrl(origin + "/about?utm_source=test", origin), origin + "/about");
});
