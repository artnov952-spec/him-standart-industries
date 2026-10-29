import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { requests } from "../../../db/schema";
import { products } from "../../../lib/catalog";
import { enforceRateLimit } from "../../../lib/server-forms";
import { assertSameOrigin, errorResponse, normalizeQuote, payloadHash, publicJson, readJson, samePayloadOrThrow } from "../../../lib/server-validation";
export const dynamic = "force-dynamic";
const message = "Тестовая заявка сохранена. Менеджеру она не отправлена.";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = normalizeQuote(await readJson(request), products);
    const hash = await payloadHash(input);
    const db = getDb();
    const [existing] = await db.select({ id: requests.id, payloadHash: requests.payloadHash }).from(requests).where(eq(requests.requestId, input.requestId)).limit(1);
    if (existing) { samePayloadOrThrow(existing.payloadHash, hash); return publicJson({ ok: true, id: existing.id, mode: "demo", message }); }
    await enforceRateLimit(request, "request");
    const id = `HSI-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    await db.insert(requests).values({ ...input, id, payloadHash: hash, createdAt: new Date().toISOString() }).onConflictDoNothing({ target: requests.requestId });
    const [saved] = await db.select({ id: requests.id, payloadHash: requests.payloadHash }).from(requests).where(eq(requests.requestId, input.requestId)).limit(1);
    if (!saved) throw new Error("Request was not persisted");
    samePayloadOrThrow(saved.payloadHash, hash);
    return publicJson({ ok: true, id: saved.id, mode: "demo", message }, saved.id === id ? 201 : 200);
  } catch (error) { return errorResponse(error); }
}
