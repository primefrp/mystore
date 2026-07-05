import type { ReactNode } from "react";
import Link from "next/link";
import {
  Banknote,
  Boxes,
  LayoutDashboard,
  PackagePlus,
  Palette,
  Store,
} from "lucide-react";

import { createStoreAction } from "@/app/actions";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-emerald-800 text-white">
              <Boxes size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-base font-semibold">FoodStack Commerce</p>
              <p className="text-sm text-zinc-600">Create your foodstuff store</p>
            </div>
          </div>
          <Link className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-medium hover:bg-stone-100" href="/admin">
            <LayoutDashboard size={16} aria-hidden="true" />
            Go to admin
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <aside className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Seller setup</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-zinc-950">
              Start your own foodstuff storefront.
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Create your store, add products with prices and quantities, add your bank account, then share your storefront link with customers.
            </p>
          </div>
          <div className="grid gap-3">
            <SetupStep icon={<Store size={18} aria-hidden="true" />} title="Create store" text="Add your business name, contact details, and address." />
            <SetupStep icon={<PackagePlus size={18} aria-hidden="true" />} title="Add items" text="Create products, define unit, price, quantity, and image URL." />
            <SetupStep icon={<Banknote size={18} aria-hidden="true" />} title="Collect payment" text="Add your seller bank account for manual transfer checkout." />
            <SetupStep icon={<Palette size={18} aria-hidden="true" />} title="Share storefront" text="Your storefront is created from your store name and can be opened from admin." />
          </div>
        </aside>

        <section className="rounded-lg border border-stone-200 bg-white p-5">
          <div>
            <h2 className="text-2xl font-semibold">Sign up your store</h2>
            <p className="mt-1 text-sm text-zinc-600">This creates your active admin workspace.</p>
          </div>

          <form action={createStoreAction} className="mt-6 grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Owner name" name="ownerName" required />
              <Field label="Owner email" name="email" required type="email" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Store name" name="storeName" required />
              <Field label="Phone number" name="phone" required />
            </div>

            <Field label="Store address" name="address" required />
            <label className="grid gap-2">
              <span className="text-sm font-medium">Store description</span>
              <textarea className="min-h-28 rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-700" name="description" required />
            </label>

            <label className="grid gap-2 sm:max-w-48">
              <span className="text-sm font-medium">Store color</span>
              <input className="h-10 rounded-md border border-stone-300 bg-white px-2" defaultValue="#047857" name="themeColor" type="color" />
            </label>

            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <h3 className="font-semibold">Bank transfer details</h3>
              <p className="mt-1 text-sm text-zinc-600">You can add this now or later from admin settings.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Field label="Bank name" name="bankName" />
                <Field label="Account number" name="accountNumber" />
                <Field label="Account name" name="accountName" />
              </div>
            </div>

            <button className="h-11 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900" type="submit">
              Create store
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

function SetupStep({
  icon,
  text,
  title,
}: {
  icon: ReactNode;
  text: string;
  title: string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-800">{icon}</span>
        <span>
          <span className="block font-semibold">{title}</span>
          <span className="mt-1 block text-sm leading-6 text-zinc-600">{text}</span>
        </span>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <input className="h-10 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-emerald-700" name={name} required={required} type={type} />
    </label>
  );
}
