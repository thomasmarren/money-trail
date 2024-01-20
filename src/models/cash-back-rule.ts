import { TAccount } from "./account";
import { RawTransaction } from "./../db/schema";
import { BaseModel } from "./base";
import { cashBackRules } from "../db/schema";

export type TCashBackRule = typeof cashBackRules.$inferSelect;
export class CashBackRule extends BaseModel<typeof cashBackRules> {
  constructor() {
    super(cashBackRules);
  }

  static calculateAmountForTransaction({
    account,
    amount,
    cashBackRules,
    transaction,
  }: {
    account: TAccount;
    amount: number;
    cashBackRules: TCashBackRule[];
    transaction: RawTransaction;
  }) {
    let cashBackAmount = 0;
    let cashBackPercent = null;

    if (amount <= 0) {
      return {
        cashBackAmount,
        cashBackPercent,
      };
    }

    const rule = cashBackRules.find(
      (rule) =>
        rule.descriptionRegex &&
        transaction.Description.match(new RegExp(rule.descriptionRegex))
    );

    if (rule) {
      cashBackAmount = Math.round(amount * (rule.cashBackPercent * 0.01));
      cashBackPercent = rule.cashBackPercent;
    } else if (account.cashBackPercent) {
      cashBackAmount = Math.round(amount * (account.cashBackPercent * 0.01));
      cashBackPercent = account.cashBackPercent;
    }

    return {
      cashBackAmount,
      cashBackPercent,
    };
  }
}
