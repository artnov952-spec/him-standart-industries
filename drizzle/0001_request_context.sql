ALTER TABLE `quote_requests` ADD `intent` text DEFAULT 'quote' NOT NULL;--> statement-breakpoint
ALTER TABLE `quote_requests` ADD `product_id` text;