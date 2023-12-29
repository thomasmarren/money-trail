import "dotenv/config";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./src/db/money_trail.db",
  },
};
