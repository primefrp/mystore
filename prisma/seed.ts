import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import {
  featureDefinitions,
  subscriptionPlans,
} from "../src/lib/platform-config";
import { normalizeDatabaseUrl } from "../src/lib/database-url";

const connectionString = normalizeDatabaseUrl(
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/foodstack_commerce",
);

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const feature of featureDefinitions) {
    await prisma.featureDefinition.upsert({
      create: feature,
      update: feature,
      where: { key: feature.key },
    });
  }

  for (const plan of subscriptionPlans) {
    const savedPlan = await prisma.subscriptionPlan.upsert({
      create: {
        interval: "monthly",
        name: plan.name,
        price: plan.price,
        status: "ACTIVE",
      },
      update: {
        price: plan.price,
        status: "ACTIVE",
      },
      where: { name: plan.name },
    });

    for (const featureKey of plan.features) {
      await prisma.subscriptionPlanFeature.upsert({
        create: {
          featureKey,
          planId: savedPlan.id,
        },
        update: {},
        where: {
          planId_featureKey: {
            featureKey,
            planId: savedPlan.id,
          },
        },
      });
    }
  }

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
