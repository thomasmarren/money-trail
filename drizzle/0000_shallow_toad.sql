CREATE TABLE IF NOT EXISTS "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text DEFAULT 'New Account',
	"cashBackPercent" integer DEFAULT 0,
	"institutionId" text NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cash_back_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text,
	"descriptionRegex" text,
	"cashBackPercent" integer DEFAULT 0,
	"accountId" text NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "institutions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text DEFAULT 'New Institution',
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_type_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"descriptionRegex" text NOT NULL,
	"transactionTypeId" text NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_types" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"amount" integer NOT NULL,
	"cashBackAmount" integer DEFAULT 0,
	"payload" jsonb NOT NULL,
	"accountId" text NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_institutionId_institutions_id_fk" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cash_back_rules" ADD CONSTRAINT "cash_back_rules_accountId_accounts_id_fk" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_type_rules" ADD CONSTRAINT "transaction_type_rules_transactionTypeId_transaction_types_id_fk" FOREIGN KEY ("transactionTypeId") REFERENCES "transaction_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_accounts_id_fk" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
