import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import type { RequestLine } from "../lib/server-validation";

export const requests = sqliteTable("quote_requests", {
  id: text("id").primaryKey(),
  requestId: text("request_id").notNull(),
  payloadHash: text("payload_hash").notNull(),
  company: text("company").notNull(),
  name: text("contact_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  city: text("city").notNull(),
  comment: text("comment").notNull().default(""),
  items: text("items", { mode: "json" }).$type<RequestLine[]>().notNull(),
  intent: text("intent", { enum: ["quote", "documents"] }).notNull().default("quote"),
  productId: text("product_id"),
  createdAt: text("created_at").notNull(),
}, (table) => [uniqueIndex("quote_requests_request_id_unique").on(table.requestId)]);

export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(), requestId: text("request_id").notNull(), payloadHash: text("payload_hash").notNull(),
  subject: text("subject").notNull(), name: text("author_name").notNull(), organization: text("organization").notNull().default(""),
  rating: integer("rating").notNull(), text: text("review_text").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: text("created_at").notNull(), moderatedAt: text("moderated_at"),
}, (table) => [
  uniqueIndex("reviews_request_id_unique").on(table.requestId),
  index("reviews_public_subject_idx").on(table.subject, table.status, table.createdAt),
  check("reviews_rating_range", sql`${table.rating} BETWEEN 1 AND 5`),
  check("reviews_status_allowed", sql`${table.status} IN ('pending', 'approved', 'rejected')`),
]);

export const rateLimits = sqliteTable("form_rate_limits", {
  key: text("key").primaryKey(), count: integer("count").notNull(), expiresAt: integer("expires_at").notNull(),
}, (table) => [index("form_rate_limits_expiry_idx").on(table.expiresAt)]);
