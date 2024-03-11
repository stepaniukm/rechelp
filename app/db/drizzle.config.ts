import type { Config } from "drizzle-kit";
export default {
  schema: "./app/db/schema.ts",
  out: "./app/db/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NUXT_POSTGRES_CONNECTION_STRING!,
  },
} satisfies Config;
