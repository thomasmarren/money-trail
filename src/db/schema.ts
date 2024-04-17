import { isNotNull, sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

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
  AnnualFee = "annual_fee",
  Bill = "bill",
  CCPayment = "cc_payment",
  Spend = "spend",
  Income = "income",
  Transfer = "transfer",
}

const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull().default("New Account"),
  cashBackPercent: integer("cashBackPercent").default(0),
  institutionId: text("institutionId")
    .references(() => institutions.id)
    .notNull(),
  hidden: boolean("hidden").default(false),
  type: text("type").notNull().default("unknown"),
  color: text("color").notNull().default("#000"),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

const cashBackRules = pgTable("cash_back_rules", {
  id: serial("id").primaryKey(),
  category: text("category"),
  descriptionRegex: text("descriptionRegex"),
  cashBackPercent: integer("cashBackPercent").notNull().default(0),
  accountId: text("accountId")
    .references(() => accounts.id)
    .notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

const institutions = pgTable("institutions", {
  id: text("id").primaryKey(),
  name: text("name").default("New Institution"),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  amount: integer("amount").notNull(),
  // category: text("category").default("Unknown"),
  cashBackAmount: integer("cashBackAmount").default(0),
  cashBackPercent: integer("cashBackPercent"),
  payload: jsonb("payload").$type<RawTransaction>().notNull(),
  accountId: text("accountId")
    .references(() => accounts.id)
    .notNull(),
  hidden: boolean("hidden").default(false),
  transactionTypeId: text("transactionTypeId").references(
    () => transactionTypes.id
  ),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

const transactionTypeRules = pgTable("transaction_type_rules", {
  id: serial("id").primaryKey(),
  descriptionRegex: text("descriptionRegex").notNull(),
  transactionTypeId: text("transactionTypeId")
    .references(() => transactionTypes.id)
    .notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

const transactionTypes = pgTable("transaction_types", {
  id: text("id").$type<TransactionTypeId>().primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
});

export {
  accounts,
  cashBackRules,
  institutions,
  transactions,
  transactionTypeRules,
  transactionTypes,
  users,
};
