// Bounded GET-only acceptance crawl. Run: HIM_SITE_URL=http://127.0.0.1:5173 node tests/site-crawl.mjs
// Node 24 native fetch; no browser automation, POST, API endpoints, credentials, or external requests.
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { sourceMarkup, sourceTitles, expectedCanonicalUrl } from "./crawl-contract.mjs";

const base = new URL(process.env.HIM_SITE_URL || "http://127.0.0.1:5173");
if (!["http:", "https:"].includes(base.protocol) || base.username || base.password || base.search || base.hash || base.pathname !== "/") throw new Error("HIM_SITE_URL must be an HTTP(S) origin without credentials, path, query, or hash");
const siteSource = await readFile(resolve("lib/site.ts"), "utf8");
const configuredSite = new URL(siteSource.match(/export\s+const\s+SITE_URL\s*=\s*["']([^"']+)["']/)?.[1] || base.origin);
const local = ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname);
const output = resolve(`outputs/qa/refinement-crawl-${local ? "local" : "public"}.json`);
const budget = { html: 80, additionalUrls: 30, assets: 25, concurrency: 3, redirects: 4, htmlBytes: 4 * 1024 * 1024, timeoutMs: 20000 };
const report = {
  startedAt: new Date().toISOString(), baseUrl: base.origin, configuredCanonicalOrigin: configuredSite.origin,
  client: { userAgent: "HIM-Acceptance-Check", node: process.version, method: "GET", concurrency: budget.concurrency }, budget,
  scope: "Sitemap-led, bounded HTTP source-HTML checks. No POST, scripts, browser events, API endpoints, account access, or cross-origin requests.",
  sitemap: null, pages: [], additionalUrls: [], assets: [], hashLinks: [], issues: [], stopped: null,
  dynamicHashExceptions: [],
  limitations: [
    "Source-HTML token inspection is not a browser DOM or full HTML/schema.org validator.",
    "JSON-LD checks parse JSON and basic object/type/context shape; search-engine rich-result eligibility is not validated.",
    "Dynamic client-only fragments have no blanket exception. Any future exception must be explicit in dynamicHashExceptions with route, fragment, and reason.",
    "Asset checks verify GET response status and MIME only. Bodies are canceled after headers; image decoding/loading is checked separately in a browser.",
    "Requests already in flight at a 429/5xx response may finish, but no new requests or redirect hops start after the stop flag.",
    "Local sitemap URLs on the configured SITE_URL are explicitly remapped by path/query to HIM_SITE_URL; only HIM_SITE_URL is requested. Canonicals remain compared with configured SITE_URL.",
    "Additional URL coverage may stop below 30 when the global 80 HTML budget is exhausted. Skipped URLs are listed."
  ]
};
const issues = (url, code, detail, severity = "error") => report.issues.push({ url, code, detail, severity });
const decode = (value = "") => value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (match, entity) => {
  const names = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  if (entity[0] !== "#") return names[entity.toLowerCase()] || match;
  const code = entity[1]?.toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "\ufffd";
});
const clean = value => decode(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
function attributes(source) {
  const values = {};
  for (const match of source.matchAll(/([^\s=<>/'"]+)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) values[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4] ?? "");
  return values;
}
function tokens(html) {
  const source = sourceMarkup(html);
  return [...source.matchAll(/<(\/?)([a-z][\w:-]*)(?=\s|\/?>)((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].filter(match => !match[1]).map(match => ({ name: match[2].toLowerCase(), attrs: attributes(match[3]) }));
}
function sameOrigin(value, from) {
  if (!value || /^(?:mailto:|tel:|javascript:|data:|blob:)/i.test(value)) return null;
  try { const url = new URL(value, from); return url.origin === base.origin ? url : null; } catch { return null; }
}
const withoutHash = value => { const url = new URL(value); url.hash = ""; return url.href; };
const pageDocuments = new Map();
const linkCandidates = new Set();
const assetCandidates = new Map();
const attempted = new Set();
let requests = 0;
let scheduledHtml = 0;
function stop(url, status) { if (!report.stopped) report.stopped = { url, status, timestamp: new Date().toISOString(), reason: "Stopped on 429 or 5xx without retry or bypass" }; }
async function get(input, { text = true } = {}) {
  const url = new URL(input, base); let current = url; const chain = []; const start = performance.now();
  if (url.origin !== base.origin) return { url: url.href, skipped: "Different origin" };
  for (let hop = 0; hop <= budget.redirects; hop++) {
    if (report.stopped) return { url: url.href, chain, skipped: "Crawl stopped" };
    if (current.origin !== base.origin) return { url: url.href, chain, skipped: "Cross-origin redirect blocked", finalUrl: current.href };
    try {
      requests++;
      const response = await fetch(current, { method: "GET", redirect: "manual", headers: { "User-Agent": "HIM-Acceptance-Check", Accept: text ? "text/html,application/xml;q=0.9,*/*;q=0.5" : "*/*" }, signal: AbortSignal.timeout(budget.timeoutMs) });
      chain.push({ url: current.href, status: response.status });
      const result = { url: url.href, finalUrl: current.href, status: response.status, mime: response.headers.get("content-type") || "", durationMs: Math.round(performance.now() - start), chain };
      if (response.status === 429 || response.status >= 500) { stop(current.href, response.status); await response.body?.cancel(); return result; }
      if ([301, 302, 303, 307, 308].includes(response.status) && response.headers.get("location")) { await response.body?.cancel(); current = new URL(response.headers.get("location"), current); continue; }
      if (!text) { await response.body?.cancel(); return result; }
      const reader = response.body?.getReader(); let body = "", bytes = 0; const decoder = new TextDecoder();
      if (reader) for (;;) { const next = await reader.read(); if (next.done) break; bytes += next.value.byteLength; if (bytes > budget.htmlBytes) { await reader.cancel(); throw new Error("HTML byte budget exceeded"); } body += decoder.decode(next.value, { stream: true }); }
      body += decoder.decode();
      return { ...result, bytes, durationMs: Math.round(performance.now() - start), body };
    } catch (error) { return { url: url.href, finalUrl: current.href, chain, error: String(error?.message || error), cause: error?.cause ? { code: error.cause.code, message: String(error.cause.message || error.cause) } : undefined, durationMs: Math.round(performance.now() - start) }; }
  }
  return { url: url.href, chain, error: "Redirect budget exceeded" };
}
async function pool(items, task) {
  let next = 0;
  await Promise.all(Array.from({ length: budget.concurrency }, async () => { while (next < items.length && !report.stopped) { const index = next++; await task(items[index], index); } }));
}
function analyze(response, kind) {
  const { body = "", ...http } = response;
  const row = { kind, ...http };
  if (response.error || response.skipped) { issues(response.url, "request", response.error || response.skipped); return row; }
  if (response.status !== 200) { issues(response.url, "status", `Expected 200; received ${response.status}`); return row; }
  if (!/^text\/html(?:;|$)/i.test(response.mime)) { row.nonHtml = true; issues(response.url, "html-mime", response.mime); return row; }
  const tags = tokens(body);
  const ids = new Set(tags.flatMap(tag => [tag.attrs.id, tag.name === "a" ? tag.attrs.name : undefined]).filter(Boolean));
  const titleParts = sourceTitles(body).map(clean);
  const h1 = [...sourceMarkup(body).matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/gi)].map(match => clean(match[1]));
  const canonical = tags.filter(tag => tag.name === "link" && tag.attrs.rel?.toLowerCase().split(/\s+/).includes("canonical")).map(tag => tag.attrs.href);
  const canonicalNormalized = canonical.map(value => { try { return new URL(value).href; } catch { return null; } });
  const mainCount = tags.filter(tag => tag.name === "main").length;
  const expectedCanonical = expectedCanonicalUrl(response.finalUrl, configuredSite);
  const jsonLd = [];
  for (const match of body.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (attributes(match[1]).type?.toLowerCase() !== "application/ld+json") continue;
    try {
      const data = JSON.parse(match[2]);
      const roots = Array.isArray(data) ? data : [data];
      const objects = roots.flatMap(item => Array.isArray(item?.["@graph"]) ? item["@graph"] : [item]);
      const validShape = objects.length > 0 && objects.every(item => item && typeof item === "object" && !Array.isArray(item) && (typeof item["@type"] === "string" || Array.isArray(item["@type"])));
      const context = roots.some(item => item && typeof item === "object" && item["@context"]);
      jsonLd.push({ validJson: true, validShape: !!validShape && !!context, types: objects.map(item => item?.["@type"]).filter(Boolean) });
      if (!validShape || !context) issues(response.url, "jsonld-shape", "JSON-LD needs object/type and root context");
    } catch (error) { jsonLd.push({ validJson: false, error: error.message }); issues(response.url, "jsonld-json", error.message); }
  }
  Object.assign(row, { title: titleParts, h1, canonical, canonicalNormalized, expectedCanonical, mainCount, jsonLd, idCount: ids.size });
  if (titleParts.length !== 1 || !titleParts[0]) issues(response.url, "title", `Expected one nonempty title; found ${titleParts.length}`);
  if (h1.length !== 1 || !h1[0]) issues(response.url, "h1", `Expected one nonempty H1; found ${h1.length}`);
  if (mainCount !== 1) issues(response.url, "main", `Expected one main; found ${mainCount}`);
  if (canonical.length !== 1 || canonicalNormalized[0] !== expectedCanonical) issues(response.url, "canonical", { expected: expectedCanonical, actual: canonical });
  if (!jsonLd.length) issues(response.url, "jsonld-missing", "No JSON-LD script");
  pageDocuments.set(withoutHash(response.url), { ids, row });
  pageDocuments.set(withoutHash(response.finalUrl), { ids, row });
  for (const tag of tags) {
    if (tag.name === "img" && tag.attrs.src) { const asset = sameOrigin(tag.attrs.src, response.finalUrl); if (asset) assetCandidates.set(withoutHash(asset), "image"); }
    if (tag.name !== "a") continue;
    const link = sameOrigin(tag.attrs.href, response.finalUrl); if (!link) continue;
    if (/^\/(?:api|logout|signout|signin)(?:\/|$)/i.test(link.pathname)) continue;
    if (link.hash) report.hashLinks.push({ source: response.url, target: withoutHash(link), fragment: link.hash.slice(1) });
    if (/\.(?:webp|png|jpe?g|gif|avif|svg|ico|pdf)$/i.test(link.pathname)) { assetCandidates.set(withoutHash(link), /\.pdf$/i.test(link.pathname) ? "pdf" : "image"); continue; }
    linkCandidates.add(withoutHash(link));
  }
  return row;
}

const sitemapResponse = await get(new URL("/sitemap.xml", base));
const { body: xml = "", ...sitemapHttp } = sitemapResponse;
report.sitemap = { ...sitemapHttp, remapped: [] };
const sitemapUrls = [];
if (sitemapResponse.status !== 200) issues(sitemapResponse.url, "sitemap-status", sitemapResponse.status || sitemapResponse.error || sitemapResponse.skipped);
else if (!/<urlset\b/i.test(xml)) issues(sitemapResponse.url, "sitemap-format", "Expected urlset");
else for (const match of xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)) {
  try {
    const declared = new URL(decode(match[1]));
    if (![base.origin, configuredSite.origin].includes(declared.origin) || declared.username || declared.password) { issues(sitemapResponse.url, "sitemap-origin", declared.origin); continue; }
    const target = new URL(declared.pathname + declared.search, base);
    sitemapUrls.push(target.href);
    if (declared.origin !== base.origin) report.sitemap.remapped.push({ declared: declared.href, requested: target.href });
  } catch { issues(sitemapResponse.url, "sitemap-url", match[1]); }
}
const uniqueSitemapUrls = [...new Set(sitemapUrls)];
report.sitemap.urlCount = uniqueSitemapUrls.length;
report.sitemap.productCount = uniqueSitemapUrls.filter(url => /^\/catalog\/[^/]+$/.test(new URL(url).pathname)).length;
report.sitemap.articleCount = uniqueSitemapUrls.filter(url => /^\/articles\/[^/]+$/.test(new URL(url).pathname)).length;
if (sitemapResponse.status === 200 && report.sitemap.productCount !== 50) issues("/sitemap.xml", "product-coverage", `Expected 50; found ${report.sitemap.productCount}`);
if (sitemapResponse.status === 200 && report.sitemap.articleCount !== 6) issues("/sitemap.xml", "article-coverage", `Expected 6; found ${report.sitemap.articleCount}`);
const required = ["/", "/catalog", "/about", "/documents", "/articles", "/contacts", "/reviews", "/privacy"];
for (const path of (sitemapResponse.status === 200 ? required : [])) if (!uniqueSitemapUrls.includes(new URL(path, base).href)) issues("/sitemap.xml", "main-page-coverage", path);
if (uniqueSitemapUrls.length > budget.html) issues("/sitemap.xml", "html-budget", `Only ${budget.html} of ${uniqueSitemapUrls.length} sitemap pages can be checked`);
const initial = uniqueSitemapUrls.slice(0, budget.html); scheduledHtml += initial.length;
await pool(initial, async url => { attempted.add(url); report.pages.push(analyze(await get(url), "sitemap")); });
let additionalScheduled = 0;
while (!report.stopped && scheduledHtml < budget.html && additionalScheduled < budget.additionalUrls) {
  const candidates = [...linkCandidates].filter(url => !attempted.has(url)).slice(0, Math.min(budget.concurrency, budget.html - scheduledHtml, budget.additionalUrls - additionalScheduled));
  if (!candidates.length) break;
  scheduledHtml += candidates.length; additionalScheduled += candidates.length;
  await pool(candidates, async url => { attempted.add(url); report.additionalUrls.push(analyze(await get(url), "discovered")); });
}
report.skippedAdditionalUrls = [...linkCandidates].filter(url => !attempted.has(url)).map(url => ({ url, reason: report.stopped ? "Stopped on response" : "HTML/additional URL budget" }));
const uniqueHashes = [...new Map(report.hashLinks.map(link => [`${link.source}|${link.target}|${link.fragment}`, link])).values()];
report.hashLinks = uniqueHashes.map(link => {
  let fragment; try { fragment = decodeURIComponent(link.fragment); } catch { fragment = link.fragment; }
  const target = pageDocuments.get(link.target);
  if (!target) return { ...link, status: "not-checked", reason: "Target HTML not loaded within budget" };
  if (fragment === "" || fragment.toLowerCase() === "top" || target.ids.has(fragment)) return { ...link, status: "ok" };
  const exception = report.dynamicHashExceptions.find(item => item.pathname === new URL(link.target).pathname && item.fragment === fragment);
  if (exception) return { ...link, status: "dynamic-exception", reason: exception.reason };
  issues(link.source, "missing-hash-target", { target: link.target, fragment });
  return { ...link, status: "missing" };
});
const selectedAssets = [...assetCandidates].sort((a, b) => a[0].localeCompare(b[0])).slice(0, budget.assets);
await pool(selectedAssets, async ([url, kind]) => {
  const result = await get(url, { text: false }); report.assets.push({ kind, ...result });
  if (result.status !== 200) issues(url, "asset-status", result.status || result.error || result.skipped);
  else if (kind === "image" ? !/^image\//i.test(result.mime) : !/^application\/pdf(?:;|$)/i.test(result.mime)) issues(url, "asset-mime", { kind, mime: result.mime });
});
report.skippedAssets = Math.max(0, assetCandidates.size - selectedAssets.length);
report.finishedAt = new Date().toISOString();
report.summary = {
  sitemapPagesChecked: report.pages.length, productPagesChecked: report.pages.filter(row => /^\/catalog\/[^/]+$/.test(new URL(row.url).pathname)).length,
  articlePagesChecked: report.pages.filter(row => /^\/articles\/[^/]+$/.test(new URL(row.url).pathname)).length,
  additionalUrlsChecked: report.additionalUrls.length, htmlPagesChecked: report.pages.filter(row => row.status === 200 && !row.nonHtml).length + report.additionalUrls.filter(row => row.status === 200 && !row.nonHtml).length,
  assetsChecked: report.assets.length, hashLinksChecked: report.hashLinks.filter(row => row.status === "ok").length, hashLinksMissing: report.hashLinks.filter(row => row.status === "missing").length,
  hashLinksNotChecked: report.hashLinks.filter(row => row.status === "not-checked").length, errors: report.issues.filter(issue => issue.severity === "error").length,
  getRequestsIncludingRedirects: requests, stopped: !!report.stopped
};
await mkdir(resolve("outputs/qa"), { recursive: true });
try {
  const history = resolve("outputs/qa/crawl-history");
  await mkdir(history, { recursive: true });
  await copyFile(output, resolve(history, `${local ? "local" : "public"}-${report.startedAt.replace(/[:.]/g, "-")}.json`));
} catch (error) { if (error.code !== "ENOENT") throw error; }
await writeFile(output, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ ...report.summary, report: output, baseUrl: base.origin }));
if (report.summary.errors || report.stopped) process.exitCode = 1;
