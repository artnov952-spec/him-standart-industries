import { env } from "cloudflare:workers";
import { lt, sql } from "drizzle-orm";
import { getDb } from "../db";
import { rateLimits } from "../db/schema";
import { InputError, sha256 } from "./server-validation";

export async function enforceRateLimit(request: Request, scope: "request" | "review"): Promise<void> {
  const db = getDb();
  const windowMs = 600000;
  const now = Date.now();
  const bucket = Math.floor(now / windowMs);
  const ip = request.headers.get("cf-connecting-ip") ?? "unavailable";
  const hash = await sha256(`him-standart:forms:v1:${ip}`);
  const key = `${scope}:${hash}:${bucket}`;
  const expiresAt = (bucket + 1) * windowMs;
  const [row] = await db.insert(rateLimits).values({ key, count: 1, expiresAt })
    .onConflictDoUpdate({ target: rateLimits.key, set: { count: sql`${rateLimits.count} + 1` } }).returning({ count: rateLimits.count });
  await db.delete(rateLimits).where(lt(rateLimits.expiresAt, now - windowMs));
  if (!row || row.count > (scope === "request" ? 8 : 5)) throw new InputError("Слишком много отправок. Повторите через 10 минут.", 429);
}
export async function authorizeModerator(request: Request): Promise<void> {
  const secret = (env as Cloudflare.Env & { ADMIN_TOKEN?: string }).ADMIN_TOKEN;
  const authorization = request.headers.get("authorization") ?? "";
  if (!secret || secret.length < 32 || !authorization.startsWith("Bearer ")) throw new InputError("Нет доступа.", 403);
  const provided = authorization.slice(7);
  if (provided.length > 256) throw new InputError("Нет доступа.", 403);
  const [expectedHash, receivedHash] = await Promise.all([sha256(secret), sha256(provided)]);
  let difference = 0;
  for (let index = 0; index < expectedHash.length; index++) difference |= expectedHash.charCodeAt(index) ^ receivedHash.charCodeAt(index);
  if (difference !== 0) throw new InputError("Нет доступа.", 403);
}
