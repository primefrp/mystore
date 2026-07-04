import type { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import {
  getBankAccountsForBusiness,
  getBusinessBySlug,
  getCategoriesForBusiness,
  getDefaultBankAccount,
  getOrdersForBusiness,
  getProductBySlug,
  getProductsForBusiness,
  sampleBusinesses,
} from "@/lib/sample-data";
import type {
  BankAccount,
  Business,
  Category,
  FeatureKey,
  Order,
  PaymentStatus,
  Product,
} from "@/lib/types";

type PrismaBusiness = Prisma.BusinessGetPayload<{
  include: {
    features: true;
    subscriptions: {
      include: {
        plan: true;
      };
    };
  };
}>;

type PrismaProduct = Prisma.ProductGetPayload<{
  include: {
    images: true;
  };
}>;

type PrismaOrder = Prisma.OrderGetPayload<Record<string, never>>;

type OrderDetails = Order & {
  customerEmail?: string | null;
  deliveryAddress?: string | null;
  deliveryMethod: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  notes?: string | null;
  items: {
    id: string;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
  }[];
};

function toNumber(value: Prisma.Decimal | number | string | null | undefined) {
  return Number(value ?? 0);
}

function normalizeBusiness(business: PrismaBusiness): Business {
  return {
    address: business.address,
    currency: business.currency,
    description: business.description ?? "",
    email: business.email,
    enabledFeatures: business.features
      .filter((feature) => feature.enabled)
      .map((feature) => feature.featureKey as FeatureKey),
    id: business.id,
    name: business.name,
    phone: business.phone,
    plan: business.subscriptions[0]?.plan.name ?? "Marketplace Pro",
    slug: business.slug,
    status: business.status,
    themeColor: business.themeColor,
  };
}

function normalizeProduct(product: PrismaProduct): Product {
  return {
    businessId: product.businessId,
    categoryId: product.categoryId ?? "",
    compareAtPrice: product.compareAtPrice ? toNumber(product.compareAtPrice) : undefined,
    description: product.description,
    id: product.id,
    imageUrl: product.images[0]?.url,
    isFeatured: product.isFeatured,
    name: product.name,
    price: toNumber(product.price),
    slug: product.slug,
    status: product.status,
    stockQuantity: product.stockQuantity,
    unit: product.unit,
  };
}

function normalizeCategory(category: {
  businessId: string;
  id: string;
  name: string;
  slug: string;
}): Category {
  return {
    businessId: category.businessId,
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

function normalizeBankAccount(account: {
  accountName: string;
  accountNumber: string;
  bankName: string;
  businessId: string;
  id: string;
  isActive: boolean;
  isDefault: boolean;
}): BankAccount {
  return {
    accountName: account.accountName,
    accountNumber: account.accountNumber,
    bankName: account.bankName,
    businessId: account.businessId,
    id: account.id,
    isActive: account.isActive,
    isDefault: account.isDefault,
  };
}

function normalizeOrder(order: PrismaOrder): Order {
  return {
    businessId: order.businessId,
    createdAt: order.createdAt.toISOString(),
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    id: order.id,
    orderNumber: order.orderNumber,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus as PaymentStatus,
    total: toNumber(order.total),
  };
}

async function withFallback<T>(query: () => Promise<T>, fallback: () => T) {
  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Using sample marketplace data because the database is unavailable.", error);
    }

    return fallback();
  }
}

export async function getBusinessBySlugData(slug: string) {
  return withFallback(
    async () => {
      const business = await db.business.findUnique({
        include: {
          features: true,
          subscriptions: {
            include: {
              plan: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
        where: {
          slug,
        },
      });

      return business ? normalizeBusiness(business) : undefined;
    },
    () => getBusinessBySlug(slug),
  );
}

export async function getAdminBusinessData() {
  return getBusinessBySlugData("ajibola-food-market");
}

export async function getProductsForBusinessData(businessId: string) {
  return withFallback(
    async () => {
      const products = await db.product.findMany({
        include: {
          images: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        where: {
          businessId,
          status: {
            not: "ARCHIVED",
          },
        },
      });

      return products.map(normalizeProduct);
    },
    () => getProductsForBusiness(businessId),
  );
}

export async function getProductBySlugData(businessId: string, slug: string) {
  return withFallback(
    async () => {
      const product = await db.product.findUnique({
        include: {
          images: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
          },
        },
        where: {
          businessId_slug: {
            businessId,
            slug,
          },
        },
      });

      return product ? normalizeProduct(product) : undefined;
    },
    () => getProductBySlug(businessId, slug),
  );
}

export async function getProductByIdData(productId: string) {
  return withFallback(
    async () => {
      const product = await db.product.findUnique({
        include: {
          images: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            take: 1,
          },
        },
        where: {
          id: productId,
        },
      });

      return product ? normalizeProduct(product) : undefined;
    },
    () => getProductsForBusiness(sampleBusinesses[0].id).find((product) => product.id === productId),
  );
}

export async function getCategoriesForBusinessData(businessId: string) {
  return withFallback(
    async () => {
      const categories = await db.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        where: {
          businessId,
          isActive: true,
        },
      });

      return categories.map(normalizeCategory);
    },
    () => getCategoriesForBusiness(businessId),
  );
}

export async function getOrdersForBusinessData(businessId: string) {
  return withFallback(
    async () => {
      const orders = await db.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          businessId,
        },
      });

      return orders.map(normalizeOrder);
    },
    () => getOrdersForBusiness(businessId),
  );
}

export async function getBankAccountsForBusinessData(businessId: string) {
  return withFallback(
    async () => {
      const accounts = await db.bankAccount.findMany({
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        where: {
          businessId,
          isActive: true,
        },
      });

      return accounts.map(normalizeBankAccount);
    },
    () => getBankAccountsForBusiness(businessId),
  );
}

export async function getDefaultBankAccountData(businessId: string) {
  return withFallback(
    async () => {
      const account = await db.bankAccount.findFirst({
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        where: {
          businessId,
          isActive: true,
        },
      });

      return account ? normalizeBankAccount(account) : undefined;
    },
    () => getDefaultBankAccount(businessId),
  );
}

export async function getOrderDetailsByIdData(orderId: string) {
  return withFallback(
    async () => {
      const order = await db.order.findUnique({
        include: {
          items: true,
        },
        where: {
          id: orderId,
        },
      });

      if (!order) {
        return undefined;
      }

      return {
        ...normalizeOrder(order),
        customerEmail: order.customerEmail,
        deliveryAddress: order.deliveryAddress,
        deliveryFee: toNumber(order.deliveryFee),
        deliveryMethod: order.deliveryMethod,
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.productName,
          quantity: item.quantity,
          total: toNumber(item.total),
          unit: item.unit,
          unitPrice: toNumber(item.unitPrice),
        })),
        notes: order.notes,
        paymentMethod: order.paymentMethod,
        subtotal: toNumber(order.subtotal),
      } satisfies OrderDetails;
    },
    () => undefined,
  );
}
