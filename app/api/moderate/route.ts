import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { reviews } from "../../../db/schema";
import { authorizeModerator } from "../../../lib/server-forms";
import { errorResponse, InputError, publicJson, readJson } from "../../../lib/server-validation";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    await authorizeModerator(request);
    const status = new URL(request.url).searchParams.get("status") ?? "pending";
    if (status !== "pending" && status !== "approved" && status !== "rejected") throw new InputError("Неизвестный статус отзывов.");
    const rows = await getDb().select({ id: reviews.id, subject: reviews.subject, name: reviews.name, organization: reviews.organization, rating: reviews.rating, text: reviews.text, status: reviews.status, createdAt: reviews.createdAt })
      .from(reviews).where(eq(reviews.status, status)).orderBy(desc(reviews.createdAt)).limit(100);
    return publicJson({ reviews: rows });
  } catch (error) { return errorResponse(error); }
}
export async function POST(request: Request) {
  try {
    await authorizeModerator(request);
    const value = await readJson(request);
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new InputError("Некорректный формат запроса.");
    const data = value as Record<string, unknown>;
    if (typeof data.reviewId !== "string" || data.reviewId.length > 64 || (data.status !== "approved" && data.status !== "rejected")) throw new InputError("Укажите отзыв и решение: approved или rejected.");
    const [changed] = await getDb().update(reviews).set({ status: data.status, moderatedAt: new Date().toISOString() }).where(eq(reviews.id, data.reviewId)).returning({ id: reviews.id, status: reviews.status });
    if (!changed) throw new InputError("Отзыв не найден.", 404);
    return publicJson({ ok: true, ...changed });
  } catch (error) { return errorResponse(error); }
}
