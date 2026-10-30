import { and, avg, count, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../db";
import { reviews } from "../../../db/schema";
import { products } from "../../../lib/catalog";
import { enforceRateLimit } from "../../../lib/server-forms";
import { assertSameOrigin, errorResponse, normalizeReview, normalizeSubject, payloadHash, publicJson, readJson, samePayloadOrThrow } from "../../../lib/server-validation";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const requestedSubjects = params.get("subjects");
    if (requestedSubjects !== null) {
      const raw = requestedSubjects.split(",");
      if (raw.length < 1 || raw.length > 30 || raw.some(value => !value)) return publicJson({ error: "Можно запросить оценки не более 30 позиций." }, 400);
      const subjects = [...new Set(raw.map(value => normalizeSubject(value, products)))];
      const db = getDb();
      const rows = await db.select({ subject: reviews.subject, count: count(), average: avg(reviews.rating) }).from(reviews).where(and(inArray(reviews.subject, subjects), eq(reviews.status, "approved"))).groupBy(reviews.subject);
      const summaries: Record<string, { count: number; average: number | null }> = Object.fromEntries(subjects.map(subject => [subject, { count: 0, average: null }]));
      for (const row of rows) summaries[row.subject] = { count: Number(row.count), average: Math.round(Number(row.average) * 10) / 10 };
      return publicJson({ summaries });
    }
    const subject = normalizeSubject(params.get("subject"), products);
    const db = getDb();
    const where = and(eq(reviews.subject, subject), eq(reviews.status, "approved"));
    const [rows, summary, grouped] = await Promise.all([
      db.select({ id: reviews.id, name: reviews.name, organization: reviews.organization, rating: reviews.rating, text: reviews.text, createdAt: reviews.createdAt }).from(reviews).where(where).orderBy(desc(reviews.createdAt)).limit(100),
      db.select({ count: count(), average: avg(reviews.rating) }).from(reviews).where(where),
      db.select({ rating: reviews.rating, count: count() }).from(reviews).where(where).groupBy(reviews.rating),
    ]);
    const total = Number(summary[0]?.count ?? 0);
    const distribution: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    for (const row of grouped) distribution[String(row.rating)] = Number(row.count);
    return publicJson({ reviews: rows, count: total, average: total ? Math.round(Number(summary[0]?.average) * 10) / 10 : null, distribution });
  } catch (error) { return errorResponse(error); }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = normalizeReview(await readJson(request), products);
    const hash = await payloadHash(input);
    const db = getDb();
    const [existing] = await db.select({ id: reviews.id, payloadHash: reviews.payloadHash, status: reviews.status }).from(reviews).where(eq(reviews.requestId, input.requestId)).limit(1);
    if (existing) { samePayloadOrThrow(existing.payloadHash, hash); return publicJson({ ok: true, id: existing.id, status: existing.status, message: existing.status === "pending" ? "Отзыв получен и ожидает проверки." : "Этот отзыв уже получен и проверен." }); }
    await enforceRateLimit(request, "review");
    const id = crypto.randomUUID();
    await db.insert(reviews).values({ ...input, id, payloadHash: hash, status: "pending", createdAt: new Date().toISOString() }).onConflictDoNothing({ target: reviews.requestId });
    const [saved] = await db.select({ id: reviews.id, payloadHash: reviews.payloadHash }).from(reviews).where(eq(reviews.requestId, input.requestId)).limit(1);
    if (!saved) throw new Error("Review was not persisted");
    samePayloadOrThrow(saved.payloadHash, hash);
    return publicJson({ ok: true, id: saved.id, status: "pending", message: "Отзыв получен и ожидает проверки." }, saved.id === id ? 201 : 200);
  } catch (error) { return errorResponse(error); }
}
