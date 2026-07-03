import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Banknote, Bike, MapPin } from "lucide-react";
import { notFound } from "next/navigation";

import { formatCurrency } from "@/lib/format";
import {
  getBusinessBySlugData,
  getDefaultBankAccountData,
  getProductsForBusinessData,
} from "@/lib/marketplace";
import { createOrderAction } from "./actions";

export const dynamic = "force-dynamic";

type CheckoutPageProps = {
  params: Promise<{
    businessSlug: string;
  }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { businessSlug } = await params;
  const business = await getBusinessBySlugData(businessSlug);

  if (!business) {
    notFound();
  }

  const cartItems = (await getProductsForBusinessData(business.id)).slice(0, 3);
  const bankAccount = await getDefaultBankAccountData(business.id);
  const subtotal = cartItems.reduce((total, product) => total + product.price, 0);
  const deliveryFee = 2500;

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <Link className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-950" href={`/s/${business.slug}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to store
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <form action={createOrderAction} className="rounded-lg border border-stone-200 bg-white p-5" id="checkout-form">
            <input name="businessSlug" type="hidden" value={business.slug} />
            {cartItems.map((product) => (
              <div key={product.id}>
                <input name="productId" type="hidden" value={product.id} />
                <input name="quantity" type="hidden" value="1" />
              </div>
            ))}
            <h1 className="text-2xl font-semibold">Checkout</h1>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="name">Customer name</label>
                <input className="h-10 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-emerald-700" id="name" name="customerName" placeholder="Full name" required />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="phone">Phone number</label>
                  <input className="h-10 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-emerald-700" id="phone" name="customerPhone" placeholder="+234" required />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="email">Email</label>
                  <input className="h-10 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-emerald-700" id="email" name="customerEmail" placeholder="name@example.com" type="email" />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="address">Delivery address</label>
                <textarea className="min-h-24 rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-700" id="address" name="deliveryAddress" placeholder="Street, area, city" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <Option icon={<Bike size={18} aria-hidden="true" />} name="deliveryMethod" title="Local delivery" text="Delivery fee is added to the order." value="LOCAL_DELIVERY" />
              <Option icon={<MapPin size={18} aria-hidden="true" />} name="deliveryMethod" title="Pickup" text="Customer picks up from the store." value="PICKUP" />
              <Option defaultChecked icon={<Banknote size={18} aria-hidden="true" />} name="paymentMethod" title="Bank transfer" text="Pay into the seller account shown below." value="BANK_TRANSFER" />
              <Option icon={<Banknote size={18} aria-hidden="true" />} name="paymentMethod" title="Pay on delivery" text="Payment is collected at delivery." value="PAY_ON_DELIVERY" />
            </div>

            {bankAccount ? (
              <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
                  <Banknote size={18} aria-hidden="true" />
                  Seller bank transfer details
                </div>
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
                  The seller confirms bank transfers manually before processing the order. Paystack will replace or complement this step later.
                </p>
              </div>
            ) : null}
          </form>

          <aside className="rounded-lg border border-stone-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="mt-4 divide-y divide-stone-200">
              {cartItems.map((product) => (
                <div className="flex justify-between gap-4 py-3 text-sm" key={product.id}>
                  <span>
                    <span className="block font-medium">{product.name}</span>
                    <span className="block text-zinc-500">{product.unit}</span>
                  </span>
                  <span className="font-semibold">{formatCurrency(product.price, business.currency)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <SummaryRow label="Subtotal" value={formatCurrency(subtotal, business.currency)} />
              <SummaryRow label="Delivery" value={formatCurrency(deliveryFee, business.currency)} />
              <SummaryRow label="Total" value={formatCurrency(subtotal + deliveryFee, business.currency)} strong />
            </div>
            <button className="mt-6 h-11 w-full rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900" form="checkout-form" type="submit">
              Place order
            </button>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Option({
  defaultChecked,
  icon,
  name,
  text,
  title,
  value,
}: {
  defaultChecked?: boolean;
  icon: ReactNode;
  name: string;
  text: string;
  title: string;
  value: string;
}) {
  return (
    <label className="rounded-lg border border-stone-300 p-4 text-left hover:border-emerald-700 hover:bg-emerald-50">
      <input className="sr-only" defaultChecked={defaultChecked} name={name} required type="radio" value={value} />
      <span className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </span>
      <span className="mt-2 block text-sm leading-6 text-zinc-600">{text}</span>
    </label>
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
