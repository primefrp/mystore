import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Boxes,
  Building2,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  Store,
} from "lucide-react";

import {
  featureDefinitions,
  sampleBusinesses,
  subscriptionPlans,
} from "@/lib/sample-data";

export default function Home() {
  const primaryBusiness = sampleBusinesses[0];
  const moduleCount = featureDefinitions.filter((feature) => !feature.isCore).length;

  return (
    <main className="min-h-screen">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-emerald-800 text-white">
                <Boxes size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="text-base font-semibold">FoodStack Commerce</p>
                <p className="text-sm text-zinc-600">Modular food commerce SaaS</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-medium hover:bg-stone-100" href="/admin">
                <LayoutDashboard size={16} aria-hidden="true" />
                Admin
              </Link>
              <Link className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800" href={`/s/${primaryBusiness.slug}`}>
                <Store size={16} aria-hidden="true" />
                Storefront
              </Link>
            </div>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Platform workspace</p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
                Multi-business foodstuff commerce, ready for optional modules.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
                The foundation is scoped for Nigerian food sellers, wholesalers, trainers, and agribusiness brands that need separate storefronts with plan-based features.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Businesses" value={sampleBusinesses.length.toString()} />
              <Metric label="Optional modules" value={moduleCount.toString()} />
              <Metric label="Plans" value={subscriptionPlans.length.toString()} />
              <Metric label="Payment mode" value="Bank transfer" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10">
        <div className="space-y-6">
          <div className="rounded-lg border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold">Tenant Preview</h2>
                <p className="text-sm text-zinc-600">Sample businesses seeded for storefront and admin flows.</p>
              </div>
              <Link className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-300 px-3 text-sm font-medium hover:bg-stone-100" href="/super-admin">
                <ShieldCheck size={16} aria-hidden="true" />
                Super Admin
              </Link>
            </div>
            <div className="divide-y divide-stone-200">
              {sampleBusinesses.map((business) => (
                <div className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center" key={business.id}>
                  <div className="flex items-start gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: business.themeColor }}>
                      <Building2 size={20} className="text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{business.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-600">{business.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {business.enabledFeatures.slice(0, 5).map((feature) => (
                          <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-zinc-700" key={feature}>
                            {feature.replaceAll("_", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 text-sm font-medium text-white hover:bg-emerald-900" href={`/s/${business.slug}`}>
                    Open
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ModuleCard icon={<Store size={20} aria-hidden="true" />} title="Marketplace Core" text="Seller storefronts, products, categories, checkout, delivery, and order statuses." />
            <ModuleCard icon={<Banknote size={20} aria-hidden="true" />} title="Seller Bank Details" text="Each seller can provide bank account details for manual transfer payments." />
            <ModuleCard icon={<CreditCard size={20} aria-hidden="true" />} title="Paystack Later" text="The payment layer is prepared so online card and transfer checkout can be added later." />
          </div>
        </div>

        <aside className="rounded-lg border border-stone-200 bg-white">
          <div className="border-b border-stone-200 px-5 py-4">
            <h2 className="text-lg font-semibold">Build Order</h2>
            <p className="text-sm text-zinc-600">Current implementation milestones.</p>
          </div>
          <ol className="space-y-4 px-5 py-5">
            {[
              "Project foundation",
              "Tenant-aware storefront",
              "Business admin dashboard",
              "Prisma schema",
              "Feature toggle layer",
              "Seller bank account settings",
            ].map((item, index) => (
              <li className="flex gap-3" key={item}>
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-amber-100 text-sm font-semibold text-amber-900">{index + 1}</span>
                <span className="pt-1 text-sm font-medium text-zinc-800">{item}</span>
              </li>
            ))}
          </ol>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <p className="text-sm text-zinc-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function ModuleCard({
  icon,
  text,
  title,
}: {
  icon: ReactNode;
  text: string;
  title: string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="grid size-10 place-items-center rounded-lg bg-stone-100 text-zinc-800">{icon}</div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
    </div>
  );
}
