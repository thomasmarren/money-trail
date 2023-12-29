import { BaseModel } from "./base";
import { institutions } from "../db/schema";

export class Institution extends BaseModel<typeof institutions> {
  constructor() {
    super(institutions);
  }
}
