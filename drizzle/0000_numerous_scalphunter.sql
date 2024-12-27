CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL
);
