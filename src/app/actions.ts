"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { ACTIVE_BUSINESS_COOKIE } from "@/lib/auth";
import { db } from "@/lib/db";
import { featureDefinitions } from "@/lib/platform-config";
import { slugify } from "@/lib/slug";

const storeSignupSchema = z.object({
  accountName: z.string().trim().optional().or(z.literal("")),
  accountNumber: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().min(3),
  bankName: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().min(10),
  email: z.string().trim().email(),
  ownerName: z.string().trim().min(2),
  phone: z.string().trim().min(7),
  storeName: z.string().trim().min(2),
  themeColor: z.string().trim().min(4),
});

async function getUniqueBusinessSlug(name: string) {
  const baseSlug = slugify(name);
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await db.business.findUnique({
      select: {
        id: true,
      },
      where: {
        slug: candidate,
      },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function createStoreAction(formData: FormData) {
  const parsed = storeSignupSchema.parse({
    accountName: formData.get("accountName") ?? "",
    accountNumber: formData.get("accountNumber") ?? "",
    address: formData.get("address"),
    bankName: formData.get("bankName") ?? "",
    description: formData.get("description"),
    email: formData.get("email"),
    ownerName: formData.get("ownerName"),
    phone: formData.get("phone"),
    storeName: formData.get("storeName"),
    themeColor: formData.get("themeColor") ?? "#047857",
  });

  const slug = await getUniqueBusinessSlug(parsed.storeName);
  const coreFeatureKeys = featureDefinitions.filter((feature) => feature.isCore).map((feature) => feature.key);

  const business = await db.$transaction(async (tx) => {
    const owner = await tx.user.upsert({
      create: {
        email: parsed.email,
        name: parsed.ownerName,
        platformRole: "USER",
      },
      update: {
        name: parsed.ownerName,
      },
      where: {
        email: parsed.email,
      },
    });

    const createdBusiness = await tx.business.create({
      data: {
        address: parsed.address,
        description: parsed.description,
        email: parsed.email,
        memberships: {
          create: {
            role: "OWNER",
            status: "ACTIVE",
            userId: owner.id,
          },
        },
        name: parsed.storeName,
        phone: parsed.phone,
        slug,
        themeColor: parsed.themeColor,
      },
    });

    await tx.businessFeature.createMany({
      data: coreFeatureKeys.map((featureKey) => ({
        businessId: createdBusiness.id,
        enabled: true,
        featureKey,
        source: "PLAN" as const,
      })),
      skipDuplicates: true,
    });

    const starterPlan = await tx.subscriptionPlan.findUnique({
      select: {
        id: true,
      },
      where: {
        name: "Starter",
      },
    });

    if (starterPlan) {
      await tx.businessSubscription.create({
        data: {
          businessId: createdBusiness.id,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          planId: starterPlan.id,
          status: "ACTIVE",
        },
      });
    }

    if (parsed.bankName && parsed.accountName && parsed.accountNumber) {
      await tx.bankAccount.create({
        data: {
          accountName: parsed.accountName,
          accountNumber: parsed.accountNumber,
          bankName: parsed.bankName,
          businessId: createdBusiness.id,
          isDefault: true,
        },
      });
    }

    return createdBusiness;
  });

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_BUSINESS_COOKIE, business.slug, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/admin");
}
