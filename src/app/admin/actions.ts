"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

const productSchema = z.object({
  businessSlug: z.string().min(1),
  categoryId: z.string().optional().or(z.literal("")),
  compareAtPrice: z.coerce.number().nonnegative().optional().or(z.nan()),
  description: z.string().trim().optional().or(z.literal("")),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  isFeatured: z.boolean(),
  name: z.string().min(2),
  price: z.coerce.number().nonnegative(),
  productId: z.string().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "DRAFT"]),
  stockQuantity: z.coerce.number().int().min(0),
  unit: z.string().min(1),
});

const bankAccountSchema = z.object({
  accountName: z.string().min(2),
  accountNumber: z.string().min(5),
  bankAccountId: z.string().optional().or(z.literal("")),
  bankName: z.string().min(2),
  businessSlug: z.string().min(1),
});

const businessSettingsSchema = z.object({
  address: z.string().trim().min(3),
  businessSlug: z.string().min(1),
  description: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email(),
  name: z.string().trim().min(2),
  phone: z.string().trim().min(7),
  themeColor: z.string().trim().min(4),
});

async function getBusinessIdBySlug(slug: string) {
  const business = await db.business.findUnique({
    select: {
      id: true,
    },
    where: {
      slug,
    },
  });

  if (!business) {
    throw new Error("Business not found.");
  }

  return business.id;
}

async function getUniqueProductSlug(businessId: string, name: string, productId?: string) {
  const baseSlug = slugify(name);
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await db.product.findUnique({
      select: {
        id: true,
      },
      where: {
        businessId_slug: {
          businessId,
          slug: candidate,
        },
      },
    });

    if (!existing || existing.id === productId) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

async function savePrimaryProductImage(productId: string, productName: string, imageUrl?: string) {
  await db.productImage.deleteMany({
    where: {
      productId,
    },
  });

  if (!imageUrl) {
    return;
  }

  await db.productImage.create({
    data: {
      altText: `${productName} product display`,
      productId,
      sortOrder: 0,
      url: imageUrl,
    },
  });
}

export async function saveProductAction(formData: FormData) {
  const parsed = productSchema.parse({
    businessSlug: formData.get("businessSlug"),
    categoryId: formData.get("categoryId") ?? "",
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl") ?? "",
    isFeatured: formData.get("isFeatured") === "on",
    name: formData.get("name"),
    price: formData.get("price"),
    productId: formData.get("productId") ?? "",
    status: formData.get("status"),
    stockQuantity: formData.get("stockQuantity"),
    unit: formData.get("unit"),
  });

  const businessId = await getBusinessIdBySlug(parsed.businessSlug);
  const productId = parsed.productId || undefined;
  const slug = await getUniqueProductSlug(businessId, parsed.name, productId);
  const compareAtPrice = Number.isNaN(parsed.compareAtPrice) ? undefined : parsed.compareAtPrice;
  const imageUrl = parsed.imageUrl?.trim();

  let savedProduct: { id: string };
  if (productId) {
    savedProduct = await db.product.update({
      data: {
        categoryId: parsed.categoryId || null,
        compareAtPrice,
        description: parsed.description || "",
        isFeatured: parsed.isFeatured,
        name: parsed.name,
        price: parsed.price,
        slug,
        status: parsed.status,
        stockQuantity: parsed.stockQuantity,
        unit: parsed.unit,
      },
      where: {
        id: productId,
      },
      select: {
        id: true,
      },
    });
  } else {
    savedProduct = await db.product.create({
      data: {
        businessId,
        categoryId: parsed.categoryId || null,
        compareAtPrice,
        description: parsed.description || "",
        isFeatured: parsed.isFeatured,
        name: parsed.name,
        price: parsed.price,
        slug,
        status: parsed.status,
        stockQuantity: parsed.stockQuantity,
        unit: parsed.unit,
      },
      select: {
        id: true,
      },
    });
  }

  await savePrimaryProductImage(savedProduct.id, parsed.name, imageUrl);

  redirect("/admin/products");
}

export async function archiveProductAction(formData: FormData) {
  const productId = z.string().min(1).parse(formData.get("productId"));

  await db.product.update({
    data: {
      status: "ARCHIVED",
    },
    where: {
      id: productId,
    },
  });

  redirect("/admin/products");
}

export async function saveBankAccountAction(formData: FormData) {
  const parsed = bankAccountSchema.parse({
    accountName: formData.get("accountName"),
    accountNumber: formData.get("accountNumber"),
    bankAccountId: formData.get("bankAccountId") ?? "",
    bankName: formData.get("bankName"),
    businessSlug: formData.get("businessSlug"),
  });

  const businessId = await getBusinessIdBySlug(parsed.businessSlug);

  await db.bankAccount.updateMany({
    data: {
      isDefault: false,
    },
    where: {
      businessId,
    },
  });

  if (parsed.bankAccountId) {
    await db.bankAccount.update({
      data: {
        accountName: parsed.accountName,
        accountNumber: parsed.accountNumber,
        bankName: parsed.bankName,
        isActive: true,
        isDefault: true,
      },
      where: {
        id: parsed.bankAccountId,
      },
    });
  } else {
    await db.bankAccount.create({
      data: {
        accountName: parsed.accountName,
        accountNumber: parsed.accountNumber,
        bankName: parsed.bankName,
        businessId,
        isDefault: true,
      },
    });
  }

  redirect("/admin/settings/payments");
}

export async function saveBusinessSettingsAction(formData: FormData) {
  const parsed = businessSettingsSchema.parse({
    address: formData.get("address"),
    businessSlug: formData.get("businessSlug"),
    description: formData.get("description") ?? "",
    email: formData.get("email"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    themeColor: formData.get("themeColor") ?? "#047857",
  });

  await db.business.update({
    data: {
      address: parsed.address,
      description: parsed.description || null,
      email: parsed.email,
      name: parsed.name,
      phone: parsed.phone,
      themeColor: parsed.themeColor,
    },
    where: {
      slug: parsed.businessSlug,
    },
  });

  redirect("/admin/settings/store");
}

export async function confirmPaymentAction(formData: FormData) {
  const orderId = z.string().min(1).parse(formData.get("orderId"));

  await db.order.update({
    data: {
      orderStatus: "CONFIRMED",
      paymentStatus: "PAID",
      payments: {
        updateMany: {
          data: {
            confirmedAt: new Date(),
            status: "PAID",
          },
          where: {
            orderId,
          },
        },
      },
    },
    where: {
      id: orderId,
    },
  });

  redirect("/admin/orders");
}
