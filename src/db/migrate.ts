import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import db, { database } from ".";

migrate(db, { migrationsFolder: "drizzle" });

database.close();
