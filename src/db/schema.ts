import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export type RawTransaction = {
  Date: string; //"MM/DD/YYYY";
  Description: string; // "DESCRIPTION";
  Institution: string; //"Name";
  Account: string; //"Account";
  Category: string; //"Transfers";
  "Is Hidden": "No" | "Yes"; // "No";
  "Is Pending": "No" | "Yes"; //"No";
  Amount: string; // "$XX.XX";
};

export enum TransactionTypeId {
  Bill = "bill",
  CCPayment = "cc_payment",
  Spend = "spend",
  Income = "income",
}

const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").default("New Account"),
  institutionId: text("institutionId")
    .references(() => institutions.id)
    .notNull(),
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
  payload: text("payload", { mode: "json" }).$type<RawTransaction>().notNull(),
  accountId: text("accountId")
    .references(() => accounts.id)
    .notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

const transactionTypeRules = sqliteTable("transaction_type_rules", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  descriptionRegex: text("descriptionRegex").notNull(),
  transactionTypeId: text("transactionTypeId")
    .references(() => transactionTypes.id)
    .notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

const transactionTypes = sqliteTable("transaction_types", {
  id: text("id").$type<TransactionTypeId>().primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

export {
  accounts,
  institutions,
  transactions,
  transactionTypeRules,
  transactionTypes,
  users,
};
