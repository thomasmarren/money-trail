ALTER TABLE "accounts" ALTER COLUMN "color" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "transactionTypeId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transactionTypeId_transaction_types_id_fk" FOREIGN KEY ("transactionTypeId") REFERENCES "transaction_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
