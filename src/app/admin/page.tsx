import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Boxes,
  ClipboardList,
  Package,
  PackagePlus,
  Settings,
  ShieldCheck,
  Store,
  TrendingUp,
} from "lucide-react";

import { NoActiveStore } from "@/components/admin/no-active-store";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency, titleCase } from "@/lib/format";
import {
  getAdminBusinessData,
  getDefaultBankAccountData,
  getOrdersForBusinessData,
  getProductsForBusinessData,
} from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const business = await getAdminBusinessData();

  if (!business) {
    return <NoActiveStore />;
  }

  const products = await getProductsForBusinessData(business.id);
  const orders = await getOrdersForBusinessData(business.id);
  const bankAccount = await getDefaultBankAccountData(business.id);
  const revenue = orders.reduce((total, order) => total + order.total, 0);
  const pendingPayments = orders.filter((order) => order.paymentStatus === "PENDING").length;

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <div>
            <p className="text-sm text-zinc-600">Signed in as {user.name}</p>
            <h1 className="text-2xl font-semibold">{business.name} Admin</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-medium hover:bg-stone-100" href="/admin/products">
              <Package size={16} aria-hidden="true" />
              Products
            </Link>
            <Link className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-medium hover:bg-stone-100" href="/admin/orders">
              <ClipboardList size={16} aria-hidden="true" />
              Orders
            </Link>
            <Link className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-medium hover:bg-stone-100" href="/admin/settings/store">
              <Settings size={16} aria-hidden="true" />
              Store settings
            </Link>
            <Link className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-medium hover:bg-stone-100" href={`/s/${business.slug}`}>
              <ArrowRight size={16} aria-hidden="true" />
              Storefront
            </Link>
            <Link className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800" href="/super-admin">
              <ShieldCheck size={16} aria-hidden="true" />
              Platform
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric icon={<TrendingUp size={19} aria-hidden="true" />} label="Revenue" value={formatCurrency(revenue, business.currency)} />
          <Metric icon={<ClipboardList size={19} aria-hidden="true" />} label="Orders" value={orders.length.toString()} />
          <Metric icon={<Package size={19} aria-hidden="true" />} label="Products" value={products.length.toString()} />
          <Metric icon={<Banknote size={19} aria-hidden="true" />} label="Pending payments" value={pendingPayments.toString()} />
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Store Setup</h2>
              <p className="mt-1 text-sm text-zinc-600">Set the pieces customers need before you share your storefront.</p>
            </div>
            <Link className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900" href="/admin/products/new">
              <PackagePlus size={16} aria-hidden="true" />
              Add product
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <SetupLink icon={<Store size={17} aria-hidden="true" />} label="Store details" text="Name, contact, address, color, and description." href="/admin/settings/store" />
            <SetupLink icon={<Package size={17} aria-hidden="true" />} label="Products" text="Items, prices, units, quantities, and images." href="/admin/products" />
            <SetupLink icon={<Banknote size={17} aria-hidden="true" />} label="Payment account" text="Bank details shown to buyers at checkout." href="/admin/settings/payments" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-lg border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <p className="text-sm text-zinc-600">Manual payment and delivery statuses are tracked here.</p>
              </div>
              <Link className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="/admin/orders">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-stone-50 text-zinc-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Payment</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Total</th>
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
                    </tr>
                  ))}
                  {orders.length === 0 ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-sm text-zinc-600" colSpan={5}>
                        No orders yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-lg border border-stone-200 bg-white">
            <div className="border-b border-stone-200 px-5 py-4">
              <h2 className="text-lg font-semibold">Enabled Modules</h2>
              <p className="text-sm text-zinc-600">{business.plan}</p>
            </div>
            <div className="grid gap-3 p-5">
              {business.enabledFeatures.map((feature) => (
                <div className="flex items-center justify-between rounded-md bg-stone-50 px-3 py-2" key={feature}>
                  <span className="text-sm font-medium">{titleCase(feature)}</span>
                  <span className="size-2 rounded-full bg-emerald-700" />
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-6 rounded-lg border border-stone-200 bg-white">
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold">Seller Payment Account</h2>
              <p className="text-sm text-zinc-600">Customers see these details when they choose bank transfer at checkout.</p>
            </div>
            <Banknote size={20} className="text-zinc-500" aria-hidden="true" />
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
            {bankAccount ? (
              <dl className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-stone-50 p-4">
                  <dt className="text-sm text-zinc-600">Bank</dt>
                  <dd className="mt-1 font-semibold">{bankAccount.bankName}</dd>
                </div>
                <div className="rounded-lg bg-stone-50 p-4">
                  <dt className="text-sm text-zinc-600">Account number</dt>
                  <dd className="mt-1 font-semibold">{bankAccount.accountNumber}</dd>
                </div>
                <div className="rounded-lg bg-stone-50 p-4">
                  <dt className="text-sm text-zinc-600">Account name</dt>
                  <dd className="mt-1 font-semibold">{bankAccount.accountName}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-zinc-600">No bank account has been added yet.</p>
            )}
            <Link className="inline-flex h-10 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold hover:bg-stone-100" href="/admin/settings/payments">
              Edit account
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-stone-200 bg-white">
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold">Product Inventory</h2>
              <p className="text-sm text-zinc-600">Initial product management surface for the MVP.</p>
            </div>
            <Link className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-300 px-3 text-sm font-semibold hover:bg-stone-100" href="/admin/products">
              <Boxes size={16} aria-hidden="true" />
              Manage
            </Link>
          </div>
          <div className="grid gap-3 p-5 md:grid-cols-3">
            {products.length > 0 ? (
              products.slice(0, 6).map((product) => (
                <div className="rounded-lg border border-stone-200 p-4" key={product.id}>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="mt-1 text-sm text-zinc-600">{product.unit}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{formatCurrency(product.price, business.currency)}</span>
                    <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">{product.stockQuantity} left</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-stone-300 p-5 md:col-span-3">
                <p className="text-sm text-zinc-600">No products yet. Add your first item with price, unit, and quantity.</p>
                <Link className="mt-3 inline-flex h-9 items-center rounded-md bg-emerald-800 px-3 text-sm font-semibold text-white hover:bg-emerald-900" href="/admin/products/new">
                  Add first product
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function SetupLink({
  href,
  icon,
  label,
  text,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  text: string;
}) {
  return (
    <Link className="rounded-lg border border-stone-200 p-4 hover:bg-stone-50" href={href}>
      <span className="flex items-center gap-2 font-semibold">
        <span className="text-emerald-800">{icon}</span>
        {label}
      </span>
      <span className="mt-2 block text-sm leading-6 text-zinc-600">{text}</span>
    </Link>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-600">{label}</p>
        <span className="text-emerald-800">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}
