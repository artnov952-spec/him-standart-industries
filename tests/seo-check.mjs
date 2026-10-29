import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const base = new URL(process.env.HIM_SITE_URL || "http://127.0.0.1:5173");
if (!["http:", "https:"].includes(base.protocol)) throw new Error("HIM_SITE_URL must be HTTP or HTTPS");
const pagePaths = ["/", "/catalog", "/catalog/ethanol-96", "/articles", "/articles/specification", "/about", "/documents", "/contacts", "/reviews", "/privacy", "/not-a-real-page-him"];
const budget = { fixedPages: pagePaths.length, auxiliaryFiles: 2, media: 10, discoveredLinks: 8, redirectHops: 5 };
const report = { startedAt: new Date().toISOString(), baseUrl: base.href, scope: "Bounded GET-only SEO prelaunch sample; not a complete crawl or search-engine account audit", demoPolicy: "Intentional noindex while demonstration content is present", budget, pages: [], auxiliary: [], media: [], discoveredLinks: [], issues: [], limitations: ["No POST, form submission, indexing submission, account changes or analytics events", "No Search Console, Webmaster, analytics, tag-manager or field Core Web Vitals evidence", "HTTP HTML sampling does not replace rendered browser checks or external structured-data validators", "Only same-origin media and a small sample of links are requested"] };
const attr = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match ? (match[1] ?? match[2] ?? match[3] ?? "") : null;
};
const clean = value => (value || "").replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, " ").trim();
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(m => m[0]);
const namedMeta = (html, key) => tags(html, "meta").filter(tag => (attr(tag, "name") || "").toLowerCase() === key).map(tag => attr(tag, "content") || "");
const canonicalLinks = html => tags(html, "link").filter(tag => (attr(tag, "rel") || "").toLowerCase().split(/\s+/).includes("canonical")).map(tag => attr(tag, "href"));
const mediaCandidates = new Map();
const internalCandidates = new Set();
const visited = new Set(pagePaths.map(path => new URL(path, base).href));
let crawlStopped = false;

async function get(url, { body = true } = {}) {
  let current = new URL(url, base);
  const chain = [];
  const start = performance.now();
  for (let hop = 0; hop <= budget.redirectHops; hop++) {
    if (current.origin !== base.origin) return { url: String(url), finalUrl: current.href, skipped: "Cross-origin redirect", chain };
    try {
      const response = await fetch(current, { method: "GET", redirect: "manual", signal: AbortSignal.timeout(15000), headers: { "user-agent": "HIM-Prelaunch-Check/1.0" } });
      chain.push({ url: current.href, status: response.status });
      if ([301, 302, 303, 307, 308].includes(response.status) && response.headers.get("location")) {
        current = new URL(response.headers.get("location"), current);
        continue;
      }
      const bytes = body ? new Uint8Array(await response.arrayBuffer()) : new Uint8Array();
      return { url: String(url), finalUrl: current.href, status: response.status, contentType: response.headers.get("content-type") || "", xRobotsTag: response.headers.get("x-robots-tag"), chain, durationMs: Math.round(performance.now() - start), bytes: bytes.byteLength, text: body ? new TextDecoder().decode(bytes) : "" };
    } catch (error) { return { url: String(url), finalUrl: current.href, chain, error: String(error?.message || error), durationMs: Math.round(performance.now() - start) }; }
  }
  return { url: String(url), finalUrl: current.href, chain, error: "Redirect hop budget exceeded" };
}

function issue(path, code, message, severity = "error") { report.issues.push({ path, code, message, severity }); }
function safeSameOrigin(value, from = base) {
  if (!value || /^(?:data:|mailto:|tel:|javascript:|#)/i.test(value)) return null;
  try { const url = new URL(value.replace(/&amp;/g, "&"), from); return url.origin === base.origin ? url : null; } catch { return null; }
}

for (const path of pagePaths) {
  const response = await get(path);
  const { text: html = "", ...http } = response;
  const row = { path, ...http };
  const missing = path === "/not-a-real-page-him";
  if (response.error) issue(path, "request-failed", response.error);
  else if (response.status !== (missing ? 404 : 200)) issue(path, "unexpected-status", `Expected ${missing ? 404 : 200}, received ${response.status}`);
  if (!missing && response.status === 200) {
    const htmlTag = tags(html, "html")[0] || "";
    const imageTags = tags(html, "img");
    row.title = clean(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
    row.description = namedMeta(html, "description");
    row.canonical = canonicalLinks(html);
    row.lang = attr(htmlTag, "lang");
    row.robots = [...namedMeta(html, "robots"), response.xRobotsTag || ""].filter(Boolean);
    row.noindex = row.robots.some(value => /(?:^|[\s,])noindex(?:$|[\s,])/i.test(value));
    row.h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => clean(m[1]));
    row.headingCounts = Object.fromEntries([1, 2, 3, 4, 5, 6].map(level => [`h${level}`, (html.match(new RegExp(`<h${level}\\b`, "gi")) || []).length]));
    row.images = { count: imageTags.length, missingAlt: imageTags.filter(tag => attr(tag, "alt") === null).length, decorativeEmptyAlt: imageTags.filter(tag => attr(tag, "alt") === "").length, missingSrc: imageTags.filter(tag => !attr(tag, "src")).length };
    row.jsonLd = [];
    for (const match of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try { const data = JSON.parse(match[1]); const objects = Array.isArray(data) ? data : data["@graph"] || [data]; row.jsonLd.push({ validJson: true, types: objects.map(item => item?.["@type"]).filter(Boolean) }); }
      catch (error) { row.jsonLd.push({ validJson: false, error: error.message }); issue(path, "invalid-jsonld", error.message); }
    }
    if (!row.title) issue(path, "missing-title", "No title in source HTML");
    if (!row.description.length || !row.description[0]) issue(path, "missing-description", "No meta description in source HTML");
    if (row.canonical.length !== 1 || !/^https?:\/\//.test(row.canonical[0] || "")) issue(path, "canonical", "Expected one absolute canonical URL");
    if (!row.h1.length) issue(path, "missing-h1", "No main heading in source HTML");
    if (row.h1.length > 1) issue(path, "multiple-h1", "Review semantic heading structure; multiple H1 is not an automatic ranking penalty", "review");
    if (row.lang !== "ru") issue(path, "html-lang", `Expected ru language, received ${row.lang}`);
    if (!row.noindex) issue(path, "demo-noindex", "Demonstration route does not expose intentional noindex");
    if (row.images.missingAlt) issue(path, "missing-alt", `${row.images.missingAlt} img tags lack alt attributes`);
    if (row.images.missingSrc) issue(path, "missing-img-src", `${row.images.missingSrc} img tags lack src`);
    for (const tag of imageTags) {
      const url = safeSameOrigin(attr(tag, "src"), response.finalUrl);
      if (url) mediaCandidates.set(url.href, "image");
    }
    for (const tag of tags(html, "a")) {
      const url = safeSameOrigin(attr(tag, "href"), response.finalUrl);
      if (!url) continue;
      url.hash = "";
      if (/\.pdf$/i.test(url.pathname)) mediaCandidates.set(url.href, "pdf");
      else if (!/^\/(?:api|cart|signin|signout|logout)(?:\/|$)/i.test(url.pathname) && !url.search && !visited.has(url.href)) internalCandidates.add(url.href);
    }
  }
  report.pages.push(row);
  if (response.status === 429 || (response.status >= 500 && !missing)) { issue(path, "crawl-stopped", "Stopped bounded crawl after throttling or server error"); crawlStopped = true; break; }
}

for (const path of (crawlStopped ? [] : ["/robots.txt", "/sitemap.xml"])) {
  const response = await get(path);
  const { text = "", ...http } = response;
  const row = { path, ...http };
  if (response.status !== 200) issue(path, "auxiliary-file", `Expected 200, received ${response.status || response.error}`);
  if (path === "/robots.txt") {
    row.hasUserAgent = /^\s*User-agent:/im.test(text);
    row.disallowAll = /^\s*Disallow:\s*\/\s*$/im.test(text);
    row.sitemaps = [...text.matchAll(/^\s*Sitemap:\s*(\S+)/gim)].map(m => m[1]);
    if (!row.hasUserAgent) issue(path, "robots-format", "No User-agent group in robots.txt");
  } else {
    row.xmlLike = /<(?:urlset|sitemapindex)\b/i.test(text);
    row.locations = [...text.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map(m => clean(m[1]));
    row.absoluteLocations = row.locations.every(url => /^https?:\/\//.test(url));
    row.note = "URLs in a sitemap do not prove indexing; the demo remains noindex";
    if (!row.xmlLike) issue(path, "sitemap-format", "No sitemap urlset or sitemapindex");
    if (!row.absoluteLocations) issue(path, "sitemap-relative-url", "Relative sitemap location found");
  }
  report.auxiliary.push(row);
}
for (const [url, kind] of (crawlStopped ? [] : [...mediaCandidates].slice(0, budget.media))) {
  const response = await get(url);
  const { text, ...row } = response;
  report.media.push({ kind, ...row });
  if (response.status !== 200) issue(url, "broken-resource", `${kind} GET returned ${response.status || response.error}`);
  else if (kind === "image" && !/^image\//i.test(response.contentType)) issue(url, "image-mime", `Unexpected ${response.contentType}`);
  else if (kind === "pdf" && !/application\/pdf/i.test(response.contentType)) issue(url, "pdf-mime", `Unexpected ${response.contentType}`);
}
for (const url of (crawlStopped ? [] : [...internalCandidates].slice(0, budget.discoveredLinks))) {
  const { text, ...row } = await get(url);
  report.discoveredLinks.push(row);
  if (row.status !== 200) issue(url, "broken-internal-link", `GET returned ${row.status || row.error}`);
}
const titles = new Map();
for (const page of report.pages) {
  if (!page.title) continue;
  if (titles.has(page.title)) issue(page.path, "duplicate-title", `Same title as ${titles.get(page.title)}`, "review");
  else titles.set(page.title, page.path);
}
report.finishedAt = new Date().toISOString();
report.summary = { pageCount: report.pages.length, auxiliaryCount: report.auxiliary.length, mediaCount: report.media.length, discoveredLinkCount: report.discoveredLinks.length, errors: report.issues.filter(issue => issue.severity === "error").length, reviewItems: report.issues.filter(issue => issue.severity === "review").length };
await mkdir(resolve("outputs"), { recursive: true });
await writeFile(resolve("outputs/seo-runtime.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ ...report.summary, report: "outputs/seo-runtime.json", baseUrl: base.href, intentionalNoindex: true }));
if (report.summary.errors) process.exitCode = 1;
