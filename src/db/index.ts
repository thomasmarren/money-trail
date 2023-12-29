import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as config from "../../drizzle.config";

export const database = new Database(config.default.dbCredentials.url);

const db = drizzle(database);

export default db;
