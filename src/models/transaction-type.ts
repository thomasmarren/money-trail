import { BaseModel } from "./base";
import { transactionTypes } from "../db/schema";

export type TTransactionType = typeof transactionTypes.$inferSelect;

export class TransactionType extends BaseModel<typeof transactionTypes> {
  constructor() {
    super(transactionTypes);
  }
}
