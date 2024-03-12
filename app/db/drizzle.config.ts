import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./app/db/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NUXT_POSTGRES_CONNECTION_STRING!,
  },
});
