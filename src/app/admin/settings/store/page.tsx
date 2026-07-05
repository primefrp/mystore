import Link from "next/link";
import { Store } from "lucide-react";

import { NoActiveStore } from "@/components/admin/no-active-store";
import { getAdminBusinessData } from "@/lib/marketplace";
import { saveBusinessSettingsAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function StoreSettingsPage() {
  const business = await getAdminBusinessData();

  if (!business) {
    return <NoActiveStore />;
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <Link className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="/admin">
          Back to dashboard
        </Link>
        <div className="mt-4 rounded-lg border border-stone-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-800">
              <Store size={20} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Store Details</h1>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                These details appear on your storefront and checkout pages.
              </p>
            </div>
          </div>

          <form action={saveBusinessSettingsAction} className="mt-6 grid gap-4">
            <input name="businessSlug" type="hidden" value={business.slug} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field defaultValue={business.name} label="Store name" name="name" required />
              <Field defaultValue={business.email} label="Store email" name="email" required type="email" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field defaultValue={business.phone} label="Phone number" name="phone" required />
              <label className="grid gap-2">
                <span className="text-sm font-medium">Store color</span>
                <input className="h-10 rounded-md border border-stone-300 bg-white px-2" defaultValue={business.themeColor} name="themeColor" type="color" />
              </label>
            </div>
            <Field defaultValue={business.address} label="Store address" name="address" required />
            <label className="grid gap-2">
              <span className="text-sm font-medium">Store description</span>
              <textarea
                className="min-h-28 rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-700"
                defaultValue={business.description}
                name="description"
              />
            </label>
            <button className="h-11 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900" type="submit">
              Save store details
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  defaultValue,
  label,
  name,
  required,
  type = "text",
}: {
  defaultValue?: string;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <input className="h-10 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-emerald-700" defaultValue={defaultValue} name={name} required={required} type={type} />
    </label>
  );
}
