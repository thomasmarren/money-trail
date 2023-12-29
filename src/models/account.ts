import { BaseModel } from "./base";
import { accounts } from "../db/schema";

export class Account extends BaseModel<typeof accounts> {
  constructor() {
    super(accounts);
  }
}
