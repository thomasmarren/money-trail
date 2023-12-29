import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").default("New Account"),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

const institutions = sqliteTable("institutions", {
  id: text("id").primaryKey(),
  name: text("name").default("New Institution"),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  amount: integer("amount").notNull(),
  payload: text("payload", { mode: "json" }).notNull(),
  accountId: text("accountId")
    .references(() => accounts.id)
    .notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

export { accounts, institutions, transactions, users };
