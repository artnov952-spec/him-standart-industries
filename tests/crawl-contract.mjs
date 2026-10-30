// Inspect actual markup, not literal tags in the streamed React payload.
export function sourceMarkup(html) {
  return html.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
}
export function sourceTitles(html) {
  return [...sourceMarkup(html).matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)].map(match => match[1]);
}
// Independent acceptance policy: identity/selection and page survive; tracking
// and presentation-only view/default order do not create canonical duplicates.
export function expectedCanonicalUrl(finalUrl, configuredSite) {
  const current = new URL(finalUrl);
  const canonical = new URL(current.pathname, configuredSite);
  if (current.pathname === "/catalog") {
    for (const key of ["q", "category", "grade", "tag"]) {
      const value = current.searchParams.get(key)?.trim();
      if (value) canonical.searchParams.set(key, value);
    }
    const sort = current.searchParams.get("sort");
    if (sort && sort !== "relevance" && (sort !== "name" || canonical.searchParams.has("q"))) canonical.searchParams.set("sort", sort);
    const page = Number(current.searchParams.get("page"));
    if (Number.isInteger(page) && page > 1) canonical.searchParams.set("page", String(page));
  }
  return canonical.href;
}
