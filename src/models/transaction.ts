import { TransactionTypeId, transactionTypes } from "./../db/schema";
import { TransactionTypeRule } from "./transaction-type-rule";
import { eq, desc } from "drizzle-orm";
import { BaseModel } from "./base";
import { accounts, transactions } from "../db/schema";
import { TransactionType } from "./transaction-type";

export type TTransaction = typeof transactions.$inferSelect;

type Include = {
  account: string;
  rules: string;
};

export class Transaction extends BaseModel<typeof transactions> {
  constructor() {
    super(transactions);
  }

  public async all() {
    const rules = await new TransactionTypeRule().allWithType();
    const incomeType = await new TransactionType().findBy(
      eq(transactionTypes.id, TransactionTypeId.Income)
    );

    const all = await this.db
      .select()
      .from(transactions)
      .leftJoin(accounts, eq(accounts.id, transactions.accountId))
      .orderBy(desc(transactions.date), desc(transactions.amount));

    const result = all.map((row) => {
      const transaction = row.transactions;
      const account = row.accounts as typeof accounts.$inferSelect;

      const rule = rules.find((rule) =>
        transaction.payload.Description.match(new RegExp(rule.descriptionRegex))
      );

      if (!rule && transaction.amount < 0) {
        return {
          ...transaction,
          account,
          type: incomeType,
        };
      }

      return { ...transaction, account, type: rule?.type || { id: null } };
    }, {});

    return result;
  }
}
