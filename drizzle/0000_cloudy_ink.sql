CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'New Account',
	`institutionId` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`institutionId`) REFERENCES `institutions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'New Institution',
	`createdAt` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `transaction_type_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`descriptionRegex` text NOT NULL,
	`transactionTypeId` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`transactionTypeId`) REFERENCES `transaction_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transaction_types` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
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
