import { TransactionTypeId, transactionTypes } from "./../db/schema";
import { TransactionTypeRule } from "./transaction-type-rule";
import { eq, desc, and } from "drizzle-orm";
import { BaseModel } from "./base";
import { accounts, transactions } from "../db/schema";
import { TransactionType, TTransactionType } from "./transaction-type";
import { TAccount } from "./account";

export type TTransaction = typeof transactions.$inferSelect & {
  account: TAccount;
  type: TTransactionType;
};

export class Transaction extends BaseModel<typeof transactions> {
  constructor() {
    super(transactions);
  }

  public async all() {
    const rules = await new TransactionTypeRule().allWithType();
    const types = await new TransactionType().all();

    const incomeType = types.find(
      (type) => type.id === TransactionTypeId.Income
    );

    const all = await this.db
      .select()
      .from(transactions)
      .leftJoin(accounts, eq(accounts.id, transactions.accountId))
      .leftJoin(
        transactionTypes,
        eq(transactionTypes.id, transactions.transactionTypeId)
      )
      .where(and(eq(accounts.hidden, false), eq(transactions.hidden, false)))
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

      const type = types.find(
        (type) => type.id === transaction.transactionTypeId
      );

      return {
        ...transaction,
        account,
        type: type || rule?.type || { id: null },
      };
    }, {});

    return result;
  }
}
