CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'New Account',
	`createdAt` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'New Institution',
	`createdAt` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`amount` integer NOT NULL,
	`payload` text NOT NULL,
	`accountId` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP
);
