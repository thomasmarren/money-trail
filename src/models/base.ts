import { SQLiteTable } from "drizzle-orm/sqlite-core";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import db from "../db";

export class BaseModel<
  TModel extends { id: any; $inferInsert: any; $inferSelect: any }
> {
  db: BetterSQLite3Database<Record<string, never>>;
  model: TModel;

  constructor(model: TModel) {
    this.model = model;
    this.db = db;
  }

  public async all() {
    const all = await db.select().from(this.model as unknown as SQLiteTable);

    return all as TModel["$inferSelect"][];
  }

  public async create(data: TModel["$inferInsert"]) {
    const insert = await db
      .insert(this.model as unknown as SQLiteTable)
      .values(data)
      .returning();
    return insert[0] as TModel["$inferSelect"];
  }

  public async upsert(data: TModel["$inferInsert"]) {
    const insert = await db
      .insert(this.model as unknown as SQLiteTable)
      .values(data)
      .onConflictDoUpdate({
        target: this.model.id,
        set: data,
      })
      .returning();
    return insert[0] as TModel["$inferSelect"];
  }
}
