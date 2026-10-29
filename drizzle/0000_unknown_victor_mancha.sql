CREATE TABLE `form_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `form_rate_limits_expiry_idx` ON `form_rate_limits` (`expires_at`);--> statement-breakpoint
CREATE TABLE `quote_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`payload_hash` text NOT NULL,
	`company` text NOT NULL,
	`contact_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`city` text NOT NULL,
	`comment` text DEFAULT '' NOT NULL,
	`items` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quote_requests_request_id_unique` ON `quote_requests` (`request_id`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`payload_hash` text NOT NULL,
	`subject` text NOT NULL,
	`author_name` text NOT NULL,
	`organization` text DEFAULT '' NOT NULL,
	`rating` integer NOT NULL,
	`review_text` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`moderated_at` text,
	CONSTRAINT "reviews_rating_range" CHECK("reviews"."rating" BETWEEN 1 AND 5),
	CONSTRAINT "reviews_status_allowed" CHECK("reviews"."status" IN ('pending', 'approved', 'rejected'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_request_id_unique` ON `reviews` (`request_id`);--> statement-breakpoint
CREATE INDEX `reviews_public_subject_idx` ON `reviews` (`subject`,`status`,`created_at`);