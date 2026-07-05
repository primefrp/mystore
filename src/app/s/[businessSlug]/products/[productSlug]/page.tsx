import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { AddToCartPanel } from "@/components/storefront/add-to-cart-panel";
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
              src={product.imageUrl ?? "/images/products/family-food-bundle.webp"}
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

            <AddToCartPanel
              businessSlug={business.slug}
              checkoutHref={`/s/${business.slug}/checkout`}
              product={{
                id: product.id,
                name: product.name,
                stockQuantity: product.stockQuantity,
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
