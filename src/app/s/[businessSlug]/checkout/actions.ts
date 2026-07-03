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

  const business = await db.business.findUnique({
    where: {
      slug: parsed.businessSlug,
    },
  });

  if (!business) {
    throw new Error("Business not found.");
  }

  const requestedItems = parsed.productIds.map((productId, index) => ({
    productId,
    quantity: parsed.quantities[index] ?? 1,
  }));

  const products = await db.product.findMany({
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

  const subtotal = requestedItems.reduce((total, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);

    if (!product) {
      return total;
    }

    return total + Number(product.price) * item.quantity;
  }, 0);

  const deliveryFee = parsed.deliveryMethod === "LOCAL_DELIVERY" ? 2500 : 0;
  const total = subtotal + deliveryFee;
  const orderCount = await db.order.count({
    where: {
      businessId: business.id,
    },
  });
  const orderNumber = `${orderPrefix(business.name)}-${1001 + orderCount}`;

  const customer = await db.customer.create({
    data: {
      businessId: business.id,
      defaultAddress: parsed.deliveryAddress || undefined,
      email: parsed.customerEmail || undefined,
      name: parsed.customerName,
      phone: parsed.customerPhone,
    },
  });

  const order = await db.order.create({
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

  redirect(`/s/${business.slug}/order-confirmation/${order.id}`);
}
