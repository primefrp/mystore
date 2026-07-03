import { loadEnvFile } from "node:process";
import { defineConfig } from "prisma/config";

loadEnvFile(".env");

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/foodstack_commerce";

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  schema: "prisma/schema.prisma",
});
