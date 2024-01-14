import { BaseModel } from "./base";
import { transactionTypeRules, transactionTypes } from "../db/schema";
import { eq } from "drizzle-orm";

export class TransactionTypeRule extends BaseModel<
  typeof transactionTypeRules
> {
  constructor() {
    super(transactionTypeRules);
  }

  public async allWithType() {
    const all = await this.db
      .select()
      .from(transactionTypeRules)
      .leftJoin(
        transactionTypes,
        eq(transactionTypes.id, transactionTypeRules.transactionTypeId)
      );

    const result = all.map((row) => {
      const rule = row.transaction_type_rules;
      const type =
        row.transaction_types as typeof transactionTypes.$inferSelect;

      return { ...rule, type };
    });

    return result;
  }
}
