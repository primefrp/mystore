import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import {
  featureDefinitions,
  sampleBankAccounts,
  sampleBusinesses,
  sampleCategories,
  sampleProducts,
  subscriptionPlans,
} from "../src/lib/sample-data";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/foodstack_commerce";

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

  for (const business of sampleBusinesses) {
    const savedBusiness = await prisma.business.upsert({
      create: {
        address: business.address,
        currency: business.currency,
        description: business.description,
        email: business.email,
        name: business.name,
        phone: business.phone,
        slug: business.slug,
        status: business.status,
        themeColor: business.themeColor,
      },
      update: {
        address: business.address,
        currency: business.currency,
        description: business.description,
        email: business.email,
        name: business.name,
        phone: business.phone,
        status: business.status,
        themeColor: business.themeColor,
      },
      where: { slug: business.slug },
    });

    for (const featureKey of business.enabledFeatures) {
      await prisma.businessFeature.upsert({
        create: {
          businessId: savedBusiness.id,
          enabled: true,
          featureKey,
          source: "PLAN",
        },
        update: {
          enabled: true,
        },
        where: {
          businessId_featureKey: {
            businessId: savedBusiness.id,
            featureKey,
          },
        },
      });
    }

    for (const account of sampleBankAccounts.filter((item) => item.businessId === business.id)) {
      await prisma.bankAccount.upsert({
        create: {
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bankName: account.bankName,
          businessId: savedBusiness.id,
          id: account.id,
          isActive: account.isActive,
          isDefault: account.isDefault,
        },
        update: {
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bankName: account.bankName,
          isActive: account.isActive,
          isDefault: account.isDefault,
        },
        where: { id: account.id },
      });
    }

    for (const category of sampleCategories.filter((item) => item.businessId === business.id)) {
      await prisma.category.upsert({
        create: {
          businessId: savedBusiness.id,
          name: category.name,
          slug: category.slug,
        },
        update: {
          name: category.name,
        },
        where: {
          businessId_slug: {
            businessId: savedBusiness.id,
            slug: category.slug,
          },
        },
      });
    }

    for (const product of sampleProducts.filter((item) => item.businessId === business.id)) {
      const category = sampleCategories.find((item) => item.id === product.categoryId);
      const savedCategory = category
        ? await prisma.category.findUnique({
            where: {
              businessId_slug: {
                businessId: savedBusiness.id,
                slug: category.slug,
              },
            },
          })
        : null;

      const savedProduct = await prisma.product.upsert({
        create: {
          businessId: savedBusiness.id,
          categoryId: savedCategory?.id,
          compareAtPrice: product.compareAtPrice,
          description: product.description,
          isFeatured: product.isFeatured,
          name: product.name,
          price: product.price,
          slug: product.slug,
          status: product.status,
          stockQuantity: product.stockQuantity,
          unit: product.unit,
        },
        update: {
          categoryId: savedCategory?.id,
          compareAtPrice: product.compareAtPrice,
          description: product.description,
          isFeatured: product.isFeatured,
          name: product.name,
          price: product.price,
          status: product.status,
          stockQuantity: product.stockQuantity,
          unit: product.unit,
        },
        where: {
          businessId_slug: {
            businessId: savedBusiness.id,
            slug: product.slug,
          },
        },
      });

      await prisma.productImage.deleteMany({
        where: {
          productId: savedProduct.id,
        },
      });

      if (product.imageUrl) {
        await prisma.productImage.create({
          data: {
            altText: `${product.name} product display`,
            productId: savedProduct.id,
            sortOrder: 0,
            url: product.imageUrl,
          },
        });
      }
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
