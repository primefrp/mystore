import { loadEnvFile } from "node:process";
import { defineConfig } from "prisma/config";

try {
  loadEnvFile(".env");
} catch (error) {
  if ((error as { code?: string }).code !== "ENOENT") {
    throw error;
  }
}

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
