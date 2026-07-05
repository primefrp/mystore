"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { ACTIVE_BUSINESS_COOKIE } from "@/lib/auth";
import { getDatabaseUrlSetupIssue } from "@/lib/database-url";
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

function getSignupErrorMessage(error: unknown) {
  const setupIssue = getDatabaseUrlSetupIssue(process.env.DATABASE_URL);

  if (setupIssue) {
    return setupIssue;
  }

  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  const message = error instanceof Error ? error.message : String(error);

  if (code === "P1000" || message.toLowerCase().includes("authentication failed") || message.toLowerCase().includes("password authentication failed")) {
    return "Supabase rejected the database login. Check the DATABASE_URL password in Vercel, then redeploy.";
  }

  if (code === "P1001" || message.includes("ENOTFOUND") || message.includes("ETIMEDOUT") || message.includes("ECONNREFUSED") || message.toLowerCase().includes("network")) {
    return "Vercel cannot reach the database. Use the Supabase pooler DATABASE_URL in Vercel, not the direct db URL, then redeploy.";
  }

  if (code === "P2021" || message.toLowerCase().includes("does not exist")) {
    return "The Supabase database tables are missing. Run prisma db push against Supabase, then try signup again.";
  }

  if (message.includes("Unable to start a transaction")) {
    return "This deployment is still using the older transaction code. Wait for Vercel to finish redeploying the latest commit, then try again.";
  }

  return "We could not create your store. Open the latest Vercel Function log and check the Store signup failed entry.";
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
    const setupIssue = getDatabaseUrlSetupIssue(process.env.DATABASE_URL);

    if (setupIssue) {
      return {
        message: setupIssue,
        status: "error",
      };
    }

    const slug = await getUniqueBusinessSlug(signup.storeName);
    const owner = await db.user.upsert({
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

    const business = await db.business.create({
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

    await db.businessFeature.createMany({
      data: coreFeatureKeys.map((featureKey) => ({
        businessId: business.id,
        enabled: true,
        featureKey,
        source: "PLAN" as const,
      })),
      skipDuplicates: true,
    });

    const starterPlan = await db.subscriptionPlan.findUnique({
      select: {
        id: true,
      },
      where: {
        name: "Starter",
      },
    });

    if (starterPlan) {
      await db.businessSubscription.create({
        data: {
          businessId: business.id,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          planId: starterPlan.id,
          status: "ACTIVE",
        },
      });
    }

    if (signup.bankName && signup.accountName && signup.accountNumber) {
      await db.bankAccount.create({
        data: {
          accountName: signup.accountName,
          accountNumber: signup.accountNumber,
          bankName: signup.bankName,
          businessId: business.id,
          isDefault: true,
        },
      });
    }

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
      message: getSignupErrorMessage(error),
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
