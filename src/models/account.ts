import { BaseModel } from "./base";
import { accounts } from "../db/schema";

export type TAccount = typeof accounts.$inferSelect;
export class Account extends BaseModel<typeof accounts> {
  constructor() {
    super(accounts);
  }
}
