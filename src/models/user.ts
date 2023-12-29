import { BaseModel } from "./base";
import { users } from "../db/schema";

export class User extends BaseModel<typeof users> {
  constructor() {
    super(users);
  }
}
