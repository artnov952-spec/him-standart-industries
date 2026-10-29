"use client";
import { useEffect, useState } from "react";
export type PublicReview = { id: string; name: string; organization?: string | null; rating: number; text: string; createdAt: string | number };
export type ReviewSummary = { reviews: PublicReview[]; count: number; average: number | null; distribution?: Record<string, number> };
export function useReviews(subject: string) {
  const [data, setData] = useState<ReviewSummary | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setData(null); setError("");
    fetch(`/api/reviews?subject=${encodeURIComponent(subject)}`, { signal: controller.signal })
      .then(async response => { const body = await response.json() as ReviewSummary & { error?: string }; if (!response.ok) throw new Error(body.error || "Отзывы временно недоступны"); return body; })
      .then(setData).catch(error => { if (error.name !== "AbortError") setError("Не удалось загрузить отзывы. Попробуйте еще раз."); });
    return () => controller.abort();
  }, [subject, retry]);
  return { data, error, reload: () => setRetry(p => p + 1) };
}
