import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

import { OrderPlacedNotice } from "@/components/storefront/order-placed-notice";
import { formatCurrency, titleCase } from "@/lib/format";
import {
  getBusinessBySlugData,
  getDefaultBankAccountData,
  getOrderDetailsByIdData,
} from "@/lib/marketplace";

export const dynamic = "force-dynamic";

type OrderConfirmationPageProps = {
  params: Promise<{
    businessSlug: string;
    orderId: string;
  }>;
};

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { businessSlug, orderId } = await params;
  const business = await getBusinessBySlugData(businessSlug);
  const order = await getOrderDetailsByIdData(orderId);

  if (!business || !order || order.businessId !== business.id) {
    notFound();
  }

  const bankAccount = await getDefaultBankAccountData(business.id);
  const isBankTransfer = order.paymentMethod === "BANK_TRANSFER";

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 text-emerald-800" size={26} aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Order created</p>
              <h1 className="mt-2 text-3xl font-semibold">{order.orderNumber}</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {business.name} has received this order. Payment status is {titleCase(order.paymentStatus)}.
              </p>
            </div>
          </div>

          <OrderPlacedNotice businessSlug={business.slug} orderNumber={order.orderNumber} />

          <div className="mt-6 divide-y divide-stone-200 rounded-lg border border-stone-200">
            {order.items.map((item) => (
              <div className="flex justify-between gap-4 p-4 text-sm" key={item.id}>
                <span>
                  <span className="block font-medium">{item.productName}</span>
                  <span className="block text-zinc-500">
                    {item.quantity} x {item.unit}
                  </span>
                </span>
                <span className="font-semibold">{formatCurrency(item.total, business.currency)}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 text-sm">
            <SummaryRow label="Subtotal" value={formatCurrency(order.subtotal, business.currency)} />
            <SummaryRow label="Delivery" value={formatCurrency(order.deliveryFee, business.currency)} />
            <SummaryRow label="Total" value={formatCurrency(order.total, business.currency)} strong />
          </div>

          {isBankTransfer && bankAccount ? (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h2 className="font-semibold text-emerald-950">Bank transfer details</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-emerald-900/75">Bank</dt>
                  <dd className="mt-1 font-semibold text-emerald-950">{bankAccount.bankName}</dd>
                </div>
                <div>
                  <dt className="text-emerald-900/75">Account number</dt>
                  <dd className="mt-1 font-semibold text-emerald-950">{bankAccount.accountNumber}</dd>
                </div>
                <div>
                  <dt className="text-emerald-900/75">Account name</dt>
                  <dd className="mt-1 font-semibold text-emerald-950">{bankAccount.accountName}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm leading-6 text-emerald-950">
                Send the exact total and include {order.orderNumber} in your transfer narration if your bank supports it.
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800" href={`/s/${business.slug}`}>
              Continue shopping
            </Link>
            <Link className="inline-flex h-10 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold hover:bg-stone-100" href="/admin/orders">
              View in admin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function SummaryRow({ label, strong, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "border-t border-stone-200 pt-3 text-base font-semibold" : "text-zinc-700"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
