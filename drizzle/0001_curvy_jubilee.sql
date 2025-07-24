ALTER TABLE `posts` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `posts` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `updated_at` integer NOT NULL;