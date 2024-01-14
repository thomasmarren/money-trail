import { BaseModel } from "./base";
import { cashBackRules } from "../db/schema";

export class CashBackRule extends BaseModel<typeof cashBackRules> {
  constructor() {
    super(cashBackRules);
  }
}
