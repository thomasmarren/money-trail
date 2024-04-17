ALTER TABLE "accounts" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cash_back_rules" ALTER COLUMN "cashBackPercent" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "hidden" boolean DEFAULT false;