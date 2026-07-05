"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/lib/db";
import { orderPrefix } from "@/lib/slug";

const checkoutSchema = z.object({
  businessSlug: z.string().min(1),
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerName: z.string().min(2),
  customerPhone: z.string().min(7),
  deliveryAddress: z.string().optional().or(z.literal("")),
  deliveryMethod: z.enum(["LOCAL_DELIVERY", "PICKUP"]),
  notes: z.string().optional().or(z.literal("")),
  paymentMethod: z.enum(["BANK_TRANSFER", "PAY_ON_DELIVERY"]),
  productIds: z.array(z.string()).min(1),
  quantities: z.array(z.coerce.number().int().min(1)).min(1),
});

export async function createOrderAction(formData: FormData) {
  const parsed = checkoutSchema.parse({
    businessSlug: formData.get("businessSlug"),
    customerEmail: formData.get("customerEmail") ?? "",
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    deliveryAddress: formData.get("deliveryAddress") ?? "",
    deliveryMethod: formData.get("deliveryMethod"),
    notes: formData.get("notes") ?? "",
    paymentMethod: formData.get("paymentMethod"),
    productIds: formData.getAll("productId"),
    quantities: formData.getAll("quantity"),
  });

  if (parsed.productIds.length !== parsed.quantities.length) {
    throw new Error("Cart item quantities are invalid.");
  }

  const requestedItems = Array.from(
    parsed.productIds.reduce((items, productId, index) => {
      items.set(productId, (items.get(productId) ?? 0) + (parsed.quantities[index] ?? 1));
      return items;
    }, new Map<string, number>()),
  ).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));

  const redirectPath = await db.$transaction(async (tx) => {
    const business = await tx.business.findUnique({
      where: {
        slug: parsed.businessSlug,
      },
    });

    if (!business) {
      throw new Error("Business not found.");
    }

    const products = await tx.product.findMany({
      where: {
        businessId: business.id,
        id: {
          in: requestedItems.map((item) => item.productId),
        },
        status: "ACTIVE",
      },
    });

    if (products.length !== requestedItems.length) {
      throw new Error("One or more products are no longer available.");
    }

    for (const item of requestedItems) {
      const product = products.find((candidate) => candidate.id === item.productId);

      if (!product) {
        throw new Error("Product not found.");
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error(`${product.name} has only ${product.stockQuantity} units left.`);
      }
    }

    const subtotal = requestedItems.reduce((total, item) => {
      const product = products.find((candidate) => candidate.id === item.productId);

      if (!product) {
        return total;
      }

      return total + Number(product.price) * item.quantity;
    }, 0);

    const deliveryFee = parsed.deliveryMethod === "LOCAL_DELIVERY" ? 2500 : 0;
    const total = subtotal + deliveryFee;
    const orderCount = await tx.order.count({
      where: {
        businessId: business.id,
      },
    });
    const orderNumber = `${orderPrefix(business.name)}-${1001 + orderCount}`;

    const customer = await tx.customer.create({
      data: {
        businessId: business.id,
        defaultAddress: parsed.deliveryAddress || undefined,
        email: parsed.customerEmail || undefined,
        name: parsed.customerName,
        phone: parsed.customerPhone,
      },
    });

    const order = await tx.order.create({
      data: {
        businessId: business.id,
        customerId: customer.id,
        customerEmail: parsed.customerEmail || undefined,
        customerName: parsed.customerName,
        customerPhone: parsed.customerPhone,
        deliveryAddress: parsed.deliveryAddress || undefined,
        deliveryFee,
        deliveryMethod: parsed.deliveryMethod,
        items: {
          create: requestedItems.map((item) => {
            const product = products.find((candidate) => candidate.id === item.productId);

            if (!product) {
              throw new Error("Product not found.");
            }

            const unitPrice = Number(product.price);

            return {
              productId: product.id,
              productName: product.name,
              quantity: item.quantity,
              total: unitPrice * item.quantity,
              unit: product.unit,
              unitPrice,
            };
          }),
        },
        notes: parsed.notes || undefined,
        orderNumber,
        orderStatus: "PENDING",
        paymentMethod: parsed.paymentMethod,
        paymentStatus: "PENDING",
        payments: {
          create: {
            amount: total,
            businessId: business.id,
            method: parsed.paymentMethod,
            status: "PENDING",
          },
        },
        subtotal,
        total,
      },
    });

    for (const item of requestedItems) {
      const result = await tx.product.updateMany({
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
        where: {
          businessId: business.id,
          id: item.productId,
          stockQuantity: {
            gte: item.quantity,
          },
        },
      });

      if (result.count !== 1) {
        throw new Error("Product stock changed before the order could be placed.");
      }
    }

    return `/s/${business.slug}/order-confirmation/${order.id}`;
  });

  redirect(redirectPath);
}
