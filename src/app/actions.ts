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
  description: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email(),
  ownerName: z.string().trim().min(2),
  phone: z.string().trim().min(7),
  storeName: z.string().trim().min(2),
  themeColor: z.string().trim().min(4),
});

type StoreSignupValues = z.infer<typeof storeSignupSchema>;

export type StoreSignupState = {
  fieldErrors?: Partial<Record<keyof StoreSignupValues, string[]>>;
  message: string;
  status: "idle" | "error";
};

async function getUniqueBusinessSlug(name: string) {
  const baseSlug = slugify(name) || `store-${Date.now()}`;
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

export async function createStoreAction(_previousState: StoreSignupState, formData: FormData): Promise<StoreSignupState> {
  const parsed = storeSignupSchema.safeParse({
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

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as StoreSignupState["fieldErrors"],
      message: "Please check the highlighted fields and try again.",
      status: "error",
    };
  }

  const signup = parsed.data;
  const coreFeatureKeys = featureDefinitions.filter((feature) => feature.isCore).map((feature) => feature.key);

  let businessSlug = "";

  try {
    const slug = await getUniqueBusinessSlug(signup.storeName);
    const business = await db.$transaction(async (tx) => {
      const owner = await tx.user.upsert({
        create: {
          email: signup.email,
          name: signup.ownerName,
          platformRole: "USER",
        },
        update: {
          name: signup.ownerName,
        },
        where: {
          email: signup.email,
        },
      });

      const createdBusiness = await tx.business.create({
        data: {
          address: signup.address,
          description: signup.description || null,
          email: signup.email,
          memberships: {
            create: {
              role: "OWNER",
              status: "ACTIVE",
              userId: owner.id,
            },
          },
          name: signup.storeName,
          phone: signup.phone,
          slug,
          themeColor: signup.themeColor,
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

      if (signup.bankName && signup.accountName && signup.accountNumber) {
        await tx.bankAccount.create({
          data: {
            accountName: signup.accountName,
            accountNumber: signup.accountNumber,
            bankName: signup.bankName,
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

    businessSlug = business.slug;
  } catch (error) {
    console.error("Store signup failed", error);

    return {
      message: "We could not create your store. Please check the database connection and try again.",
      status: "error",
    };
  }

  if (!businessSlug) {
    return {
      message: "We could not finish store setup. Please try again.",
      status: "error",
    };
  }

  redirect("/admin");
}
