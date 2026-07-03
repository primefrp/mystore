import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, PackageCheck, ShoppingCart } from "lucide-react";
import { notFound } from "next/navigation";

import { formatCurrency } from "@/lib/format";
import { getBusinessBySlugData, getProductBySlugData } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    businessSlug: string;
    productSlug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { businessSlug, productSlug } = await params;
  const business = await getBusinessBySlugData(businessSlug);

  if (!business) {
    notFound();
  }

  const product = await getProductBySlugData(business.id, productSlug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <Link className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-950" href={`/s/${business.slug}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to store
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
            <Image
              src="/images/nigerian-food-market.png"
              alt={`${product.name} product display`}
              width={1100}
              height={825}
              priority
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">{business.name}</p>
            <h1 className="mt-3 text-3xl font-semibold">{product.name}</h1>
            <p className="mt-2 text-sm text-zinc-600">{product.unit}</p>
            <div className="mt-5 flex flex-wrap items-end gap-3">
              <p className="text-3xl font-semibold">{formatCurrency(product.price, business.currency)}</p>
              {product.compareAtPrice ? (
                <p className="pb-1 text-base text-zinc-500 line-through">
                  {formatCurrency(product.compareAtPrice, business.currency)}
                </p>
              ) : null}
            </div>
            <p className="mt-5 text-base leading-7 text-zinc-600">{product.description}</p>

            <div className="mt-6 grid gap-3 rounded-lg bg-stone-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-800">
                <PackageCheck size={18} className="text-emerald-800" aria-hidden="true" />
                {product.stockQuantity} units in stock
              </div>
              <div className="grid grid-cols-[96px_1fr] gap-3">
                <label className="pt-2 text-sm font-medium text-zinc-700" htmlFor="quantity">Quantity</label>
                <input
                  className="h-10 rounded-md border border-stone-300 bg-white px-3 text-sm outline-none focus:border-emerald-700"
                  defaultValue="1"
                  id="quantity"
                  min="1"
                  type="number"
                />
              </div>
            </div>

            <button className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900">
              <ShoppingCart size={17} aria-hidden="true" />
              Add to cart
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
