import { eq } from "drizzle-orm";
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
    const records = await db
      .select()
      .from(this.model as unknown as SQLiteTable);

    return records as TModel["$inferSelect"][];
  }

  public async findOrCreate(id: string, data: TModel["$inferInsert"]) {
    let [record] = await db
      .select()
      .from(this.model as unknown as SQLiteTable)
      .where(eq(this.model.id, id));

    if (record) return record;

    record = await this.create({ id, ...data });

    return record;
  }

  public async create(data: TModel["$inferInsert"]) {
    const records = await db
      .insert(this.model as unknown as SQLiteTable)
      .values(data)
      .returning();
    return records[0] as TModel["$inferSelect"];
  }

  public async upsert(data: TModel["$inferInsert"]) {
    const records = await db
      .insert(this.model as unknown as SQLiteTable)
      .values(data)
      .onConflictDoUpdate({
        target: this.model.id,
        set: data,
      })
      .returning();
    return records[0] as TModel["$inferSelect"];
  }

  public async createOrUpdate({
    id,
    create,
    update,
  }: {
    id: string;
    create: TModel["$inferInsert"];
    update: Partial<TModel["$inferInsert"]>;
  }) {
    let [record] = await db
      .select()
      .from(this.model as unknown as SQLiteTable)
      .where(eq(this.model.id, id));

    if (record) {
      record = await this.update(id, update);
      return record;
    }

    record = await this.create({ id, ...create });

    return record;
  }

  public async update(id: string, data: Partial<TModel["$inferInsert"]>) {
    const record = await db
      .update(this.model as unknown as SQLiteTable)
      .set(data)
      .where(eq(this.model.id, id))
      .returning({ id: this.model.id });

    return record as TModel["$inferSelect"];
  }
}
