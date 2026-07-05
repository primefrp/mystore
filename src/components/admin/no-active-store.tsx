import Link from "next/link";
import { Store } from "lucide-react";

export function NoActiveStore() {
  return (
    <main className="min-h-screen bg-stone-50">
      <section className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-800">
              <Store size={20} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Create your store first</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Sign up your business, then you can add products, prices, quantities, payment account, and store details.
              </p>
            </div>
          </div>
          <Link className="mt-6 inline-flex h-10 items-center rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900" href="/">
            Set up store
          </Link>
        </div>
      </section>
    </main>
  );
}
