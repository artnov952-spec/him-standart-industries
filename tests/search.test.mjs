import test from "node:test";
import assert from "node:assert/strict";
import { tsImport } from "tsx/esm/api";

// Run directly: node --test tests/search.test.mjs. Load actual TS/catalog modules.
const { searchProducts, normalizeSearchText, parseSearchQuery } = await tsImport("../lib/search.ts", import.meta.url);
const { products } = await tsImport("../lib/catalog.ts", import.meta.url);
const { productSearchMetadata, tagDefinitions, applicationEvidence } = await tsImport("../lib/product-tags.ts", import.meta.url);
const ids = (query, options) => searchProducts(products, query, options).map((item) => item.id);

test("all 50 products have explicit nonempty metadata and valid tag IDs", () => {
  assert.equal(products.length, 50);
  assert.deepEqual(Object.keys(productSearchMetadata).sort(), products.map(({ id }) => id).sort());
  const allowed = new Set(tagDefinitions.map(({ id }) => id));
  for (const product of products) {
    assert.ok(productSearchMetadata[product.id].aliases.length > 0, product.id);
    assert.ok(productSearchMetadata[product.id].tags.length > 0, product.id);
    assert.ok(productSearchMetadata[product.id].tags.every((tag) => allowed.has(tag)), product.id);
  }
});

test("normalization handles Cyrillic, punctuation, spacing and formula subscripts", () => {
  assert.equal(normalizeSearchText("  ЕДКОЕ / КАЛИ,  Na₂CO₃  "), "едкое кали na2co3");
  assert.equal(normalizeSearchText("трёхводный"), "трехводный");
});

test("Russian names and multiword queries use AND, independent of word order", () => {
  assert.equal(ids("хлорид натрия")[0], "sodium-chloride");
  assert.equal(ids("натрия хлорид")[0], "sodium-chloride");
  assert.deepEqual(ids("хлорид натрия ацетон"), []);
  assert.equal(ids("лимонная кислота безводная")[0], "citric-acid-anhydrous");
  assert.ok(!ids("лимонная кислота безводная").includes("citric-acid-monohydrate"));
  assert.equal(ids("спирт этиловый 96")[0], "ethanol-96");
  assert.equal(ids("спирт этиловый96")[0], "ethanol-96");
});

test("Russian and English synonyms resolve chemical identities", () => {
  for (const [query, expected] of [["каустическая сода", "sodium-hydroxide"], ["медный купорос", "copper-sulfate-pentahydrate"], ["трилон Б", "edta-disodium-dihydrate"], ["ethyl alcohol", "ethanol-96"], ["potassium chloride", "potassium-chloride"], ["dextrose", "d-glucose"], ["DMSO", "dimethyl-sulfoxide"]]) {
    assert.equal(ids(query)[0], expected, query);
  }
});

test("CAS accepts hyphens, spaces and compact digits without fuzzy numeric matches", () => {
  for (const query of ["64-17-5", "64 17 5", "64175", "CAS 64-17-5"]) assert.deepEqual(ids(query), ["ethanol-96"], query);
  assert.deepEqual(ids("10035 04 8"), ["calcium-chloride-dihydrate"]);
  assert.deepEqual(ids("64176"), []);
});

test("formulas and hydrate forms preserve identity; SKU is searchable", () => {
  assert.deepEqual(ids("NaOH"), ["sodium-hydroxide"]);
  assert.deepEqual(ids("Na₂CO₃"), ["sodium-carbonate"]);
  assert.deepEqual(ids("CaCl2 · 2H2O"), ["calcium-chloride-dihydrate"]);
  assert.equal(ids("CH3COOH")[0], "acetic-acid");
  assert.deepEqual(ids("HIM-041"), ["d-glucose"]);
  assert.deepEqual(ids("NaOH2"), []);
});

test("a single long-word typo is tolerated, short identifiers stay exact", () => {
  assert.equal(ids("глицерн")[0], "glycerol");
  assert.equal(ids("ацтеон")[0], "acetone");
  assert.equal(ids("ацитон")[0], "acetone");
  assert.equal(ids("potassum chloride")[0], "potassium-chloride");
  assert.deepEqual(ids("NACLX"), []);
  assert.deepEqual(ids("эдтб"), []);
});

test("topic filters intersect explicit tags and natural phrase intents", () => {
  const buffers = ids("", { tagIds: ["buffers"] });
  assert.ok(buffers.includes("tris-base"));
  assert.ok(!buffers.includes("acetone"));
  assert.deepEqual(ids("ацетон", { tagIds: ["buffers"] }), []);
  assert.deepEqual(ids("", { tagIds: ["buffers", "water-treatment"] }), ["edta-disodium-dihydrate"]);
  assert.deepEqual(ids("натрий", { tagIds: ["nonexistent"] }), []);
  assert.equal(ids("трис для буферных растворов")[0], "tris-base");
  assert.deepEqual(ids("контроль воды"), ids("", { tagIds: ["water-treatment"] }));
  for (const query of ["для анализа воды", "реактивы для воды", "для воды"]) assert.deepEqual(ids(query), ids("контроль воды"), query);
  assert.equal(ids("вода")[0], "deionized-water");
  for (const query of ["для лаборатории", "медицинская лаборатория", "для медицинской лаборатории"]) assert.deepEqual(ids(query), ids("", { tagIds: ["analytics"] }), query);
  assert.match(parseSearchQuery("для медицинской лаборатории").notice, /не подтверждаются/);
  assert.deepEqual(ids("медицина"), []);
});

test("plant/fertilizer queries mean soil analytics, not agricultural-grade approval", () => {
  assert.deepEqual(ids("реактивы для растений"), ["potassium-chloride", "calcium-chloride-dihydrate", "ammonium-acetate"]);
  assert.deepEqual(ids("для удобрений"), ids("анализ почв"));
  assert.deepEqual(ids("для почвы"), ids("анализ почв"));
  assert.deepEqual(ids("для анализа почвы"), ids("анализ почв"));
  assert.equal(ids("хлорид кальция для растений")[0], "calcium-chloride-dihydrate");
  assert.ok(!ids("для растений").includes("urea"));
  assert.match(parseSearchQuery("для растений").notice, /не подтверждается/);
  for (const productId of ids("для растений")) assert.ok(applicationEvidence.some((evidence) => evidence.tagId === "agrochemistry" && evidence.productIds.includes(productId)));
});

test("empty, negative and hostile-looking strings are deterministic and do not mutate data", () => {
  const before = products.map(({ id }) => id);
  const results = searchProducts(products, "");
  assert.deepEqual(results.map(({ id }) => id), before);
  assert.notEqual(results, products);
  assert.equal(results[0], products[0]);
  assert.deepEqual(ids("несуществующийреактив"), []);
  assert.deepEqual(ids("<script>alert(1)</script>"), []);
  assert.deepEqual(ids("сахароза медный купорос"), []);
  assert.deepEqual(products.map(({ id }) => id), before);
});

test("exact names and aliases rank above incidental description mentions", () => {
  const fixtures = [
    { id: "incidental", name: "Стандарт", description: "Содержит ацетон для аналитики" },
    { id: "acetone", name: "Ацетон", description: "Растворитель" },
  ];
  assert.deepEqual(searchProducts(fixtures, "ацетон").map(({ id }) => id), ["acetone", "incidental"]);
  assert.deepEqual(searchProducts(fixtures, "ацетон стандарт").map(({ id }) => id), ["incidental"]);
});

test("hydrate identity cannot come from negative comparisons in descriptions", () => {
  assert.deepEqual(ids("безводного хлорида железа"), []);
  assert.deepEqual(ids("сульфата меди безводного"), []);
  assert.deepEqual(ids("железа безводный"), []);
  assert.deepEqual(ids("безводный сульфат меди"), []);
  for (const query of ["безводная лимонная кислота", "лимонная кислота безводный", "citric acid anhydrous"]) assert.deepEqual(ids(query), ["citric-acid-anhydrous"], query);
  for (const query of ["лимонная кислота моногидрат", "лимонная кислота моногидрата", "лимонная кислота 1 водная"]) assert.deepEqual(ids(query), ["citric-acid-monohydrate"], query);
  assert.deepEqual(ids("сульфат магния 7 водный"), ["magnesium-sulfate-heptahydrate"]);
  assert.deepEqual(ids("сульфат магния 2 водный"), []);
  assert.deepEqual(ids("хлорид кальция дигидрат"), ["calcium-chloride-dihydrate"]);
  assert.deepEqual(ids("хлорид кальция гексагидрат"), []);
  assert.equal(ids("гидроксид натрия")[0], "sodium-hydroxide");
  assert.equal(ids("сода каустическая")[0], "sodium-hydroxide");
  const ordinaryUsage = [{ id: "demo", name: "Образец", description: "Производственный контроль" }];
  assert.equal(searchProducts(ordinaryUsage, "производственный контроль")[0]?.id, "demo");
});
