import Link from "next/link";
import { Building2, ShieldCheck, ToggleLeft } from "lucide-react";

import { db } from "@/lib/db";
import { formatCurrency, titleCase } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SuperAdminPage() {
  const [businesses, plans, features] = await Promise.all([
    db.business.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.subscriptionPlan.findMany({
      include: {
        features: true,
      },
      orderBy: {
        price: "asc",
      },
    }),
    db.featureDefinition.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-zinc-950 text-white">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Super Admin</h1>
              <p className="text-sm text-zinc-600">Tenant, plan, and module controls.</p>
            </div>
          </div>
          <Link className="inline-flex h-10 items-center rounded-md border border-stone-300 px-4 text-sm font-medium hover:bg-stone-100" href="/">
            Store signup
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10">
        <div className="rounded-lg border border-stone-200 bg-white">
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold">Businesses</h2>
              <p className="text-sm text-zinc-600">Each tenant has isolated data and feature access.</p>
            </div>
            <Building2 size={20} className="text-zinc-500" aria-hidden="true" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-stone-50 text-zinc-600">
                <tr>
                  <th className="px-5 py-3 font-medium">Business</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Modules</th>
                  <th className="px-5 py-3 font-medium">Store</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {businesses.map((business) => (
                  <tr key={business.id}>
                    <td className="px-5 py-4">
                      <span className="block font-semibold">{business.name}</span>
                      <span className="block text-zinc-500">{business.slug}</span>
                    </td>
                    <td className="px-5 py-4">{business.subscriptions[0]?.plan.name ?? "No plan"}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-900">
                        {titleCase(business.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">{business.features.filter((feature) => feature.enabled).length}</td>
                    <td className="px-5 py-4">
                      <Link className="font-semibold text-emerald-800 hover:text-emerald-950" href={`/s/${business.slug}`}>
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
                {businesses.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-center text-sm text-zinc-600" colSpan={5}>
                      No businesses have signed up yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-stone-200 bg-white">
            <div className="border-b border-stone-200 px-5 py-4">
              <h2 className="text-lg font-semibold">Subscription Plans</h2>
            </div>
            <div className="grid gap-3 p-5">
              {plans.map((plan) => (
                <div className="rounded-lg border border-stone-200 p-4" key={plan.id}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="text-sm font-semibold">{formatCurrency(Number(plan.price))}</p>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">{plan.features.length} enabled features</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <h2 className="text-lg font-semibold">Feature Registry</h2>
              <ToggleLeft size={20} className="text-zinc-500" aria-hidden="true" />
            </div>
            <div className="grid gap-2 p-5">
              {features.map((feature) => (
                <div className="rounded-md bg-stone-50 px-3 py-2" key={feature.key}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{feature.name}</span>
                    <span className="text-xs font-medium text-zinc-500">{feature.isCore ? "Core" : "Optional"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
