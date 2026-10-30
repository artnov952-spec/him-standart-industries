"use client";
import { useEffect, useState } from "react";
export type PublicReview = { id: string; name: string; organization?: string | null; rating: number; text: string; createdAt: string | number };
export type ReviewSummary = { reviews: PublicReview[]; count: number; average: number | null; distribution?: Record<string, number> };
export type RatingSummary = Pick<ReviewSummary, "count" | "average">;

// Only aggregate ratings are fetched for cards. Share one request between the
// cards mounted in the same render, without caching names or review text.
const summaryCache = new Map<string, { value: RatingSummary; expires: number }>();
const pending = new Map<string, { resolve: (value: RatingSummary) => void; reject: (reason: Error) => void }[]>();
let scheduled = false;
async function flushSummaries() {
  scheduled = false;
  const batch = new Map(pending);
  pending.clear();
  const subjects = [...batch.keys()];
  for (let offset = 0; offset < subjects.length; offset += 30) {
    const ids = subjects.slice(offset, offset + 30);
    try {
      const response = await fetch(`/api/reviews?subjects=${encodeURIComponent(ids.join(","))}`, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error("Оценки временно недоступны.");
      const body = await response.json() as { summaries?: Record<string, RatingSummary> };
      if (!body.summaries) throw new Error("Оценки временно недоступны.");
      for (const id of ids) {
        const value = body.summaries[id];
        if (!value || !Number.isInteger(value.count) || value.count < 0 || (value.average !== null && (typeof value.average !== "number" || !Number.isFinite(value.average)))) throw new Error("Оценки временно недоступны.");
      }
      for (const id of ids) {
        const value = body.summaries[id];
        summaryCache.set(id, { value, expires: Date.now() + 30000 });
        for (const listener of batch.get(id) ?? []) listener.resolve(value);
      }
    } catch {
      for (const id of ids) for (const listener of batch.get(id) ?? []) listener.reject(new Error("Не удалось загрузить оценки."));
    }
  }
}
function requestSummary(subject: string) {
  const cached = summaryCache.get(subject);
  if (cached && cached.expires > Date.now()) return Promise.resolve(cached.value);
  return new Promise<RatingSummary>((resolve, reject) => {
    pending.set(subject, [...(pending.get(subject) ?? []), { resolve, reject }]);
    if (!scheduled) { scheduled = true; setTimeout(() => { void flushSummaries(); }, 0); }
  });
}
export function useReviewSummary(subject: string) {
  const [data, setData] = useState<RatingSummary | null>(null);
  useEffect(() => {
    let active = true;
    setData(null);
    void requestSummary(subject).then(value => { if (active) setData(value); }).catch(() => {});
    return () => { active = false; };
  }, [subject]);
  return { data };
}
export function useReviews(subject: string) {
  const [data, setData] = useState<ReviewSummary | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => {
      controller.abort();
      if (active) setError("Загрузка отзывов заняла слишком много времени. Попробуйте еще раз.");
    }, 15000);
    setData(null); setError("");
    fetch(`/api/reviews?subject=${encodeURIComponent(subject)}`, { signal: controller.signal })
      .then(async response => { const body = await response.json() as ReviewSummary & { error?: string }; if (!response.ok) throw new Error(body.error || "Отзывы временно недоступны"); return body; })
      .then(value => { if (active) setData(value); }).catch(error => { if (active && error.name !== "AbortError") setError("Не удалось загрузить отзывы. Попробуйте еще раз."); }).finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [subject, retry]);
  return { data, error, reload: () => setRetry(p => p + 1) };
}
