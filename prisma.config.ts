import { loadEnvFile } from "node:process";
import { defineConfig } from "prisma/config";

import { normalizeDatabaseUrl } from "./src/lib/database-url";

try {
  loadEnvFile(".env");
} catch (error) {
  if ((error as { code?: string }).code !== "ENOENT") {
    throw error;
  }
}

const databaseUrl = normalizeDatabaseUrl(
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/foodstack_commerce",
);

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  schema: "prisma/schema.prisma",
});
