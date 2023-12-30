import { TransactionTypeRule } from "./transaction-type-rule";
import { eq, desc } from "drizzle-orm";
import { BaseModel } from "./base";
import { accounts, transactions } from "../db/schema";

export type TTransaction = typeof transactions.$inferSelect;

export class Transaction extends BaseModel<typeof transactions> {
  constructor() {
    super(transactions);
  }

  public async allWithAccount() {
    const rules = await new TransactionTypeRule().allWithType();

    const all = await this.db
      .select()
      .from(transactions)
      .leftJoin(accounts, eq(accounts.id, transactions.accountId))
      .orderBy(desc(transactions.date))
      .all();

    const result = all.map((row) => {
      const transaction = row.transactions;
      const account = row.accounts as typeof accounts.$inferSelect;

      const rule = rules.find((rule) =>
        transaction.payload.Description.match(new RegExp(rule.descriptionRegex))
      );

      return { ...transaction, account, type: rule?.type || { id: null } };
    }, {});

    return result;
  }
}
