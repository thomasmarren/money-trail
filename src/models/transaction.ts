import { eq } from "drizzle-orm";
import { BaseModel } from "./base";
import { accounts, transactions } from "../db/schema";

export class Transaction extends BaseModel<typeof transactions> {
  constructor() {
    super(transactions);
  }

  public async allWithAccount() {
    const all = await this.db
      .select()
      .from(transactions)
      .leftJoin(accounts, eq(accounts.id, transactions.accountId))
      .all();

    const result = all.map((row) => {
      const transaction = row.transactions;
      const account = row.accounts as typeof accounts.$inferSelect;
      return { ...transaction, account };
    }, {});

    return result;
  }
}
