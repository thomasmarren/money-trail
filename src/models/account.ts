import { eq } from "drizzle-orm";
import { BaseModel } from "./base";
import { accounts } from "../db/schema";

export type TAccount = typeof accounts.$inferSelect;
export class Account extends BaseModel<typeof accounts> {
  constructor() {
    super(accounts);
  }

  public async all() {
    const records = await this.db
      .select()
      .from(this.model)
      .where(eq(this.model.hidden, false));

    return records as TAccount[];
  }
}
