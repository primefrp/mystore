import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { NoActiveStore } from "@/components/admin/no-active-store";
import { formatCurrency, titleCase } from "@/lib/format";
import {
  getAdminBusinessData,
  getOrdersForBusinessData,
} from "@/lib/marketplace";
import { confirmPaymentAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const business = await getAdminBusinessData();

  if (!business) {
    return <NoActiveStore />;
  }

  const orders = await getOrdersForBusinessData(business.id);

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">{business.name}</p>
            <h1 className="mt-2 text-3xl font-semibold">Orders</h1>
          </div>
          <Link className="inline-flex h-10 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold hover:bg-stone-100" href="/admin">
            Dashboard
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-stone-200 bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-stone-50 text-zinc-600">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Total</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-4 font-semibold">{order.orderNumber}</td>
                  <td className="px-5 py-4">
                    <span className="block font-medium">{order.customerName}</span>
                    <span className="block text-zinc-500">{order.customerPhone}</span>
                  </td>
                  <td className="px-5 py-4">{titleCase(order.paymentStatus)}</td>
                  <td className="px-5 py-4">{titleCase(order.orderStatus)}</td>
                  <td className="px-5 py-4 text-right font-semibold">{formatCurrency(order.total, business.currency)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      {order.paymentStatus === "PENDING" ? (
                        <form action={confirmPaymentAction}>
                          <input name="orderId" type="hidden" value={order.id} />
                          <button className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-800 px-3 font-semibold text-white hover:bg-emerald-900" type="submit">
                            <CheckCircle2 size={15} aria-hidden="true" />
                            Mark paid
                          </button>
                        </form>
                      ) : (
                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-900">Paid</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-sm text-zinc-600" colSpan={6}>
                    No orders yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
