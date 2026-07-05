import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LogIn, Package, Search, ShoppingCart } from "lucide-react";
import { notFound } from "next/navigation";

import { CartStockLabel } from "@/components/storefront/cart-stock-label";
import { formatCurrency } from "@/lib/format";
import {
  getBusinessBySlugData,
  getCategoriesForBusinessData,
  getProductsForBusinessData,
} from "@/lib/marketplace";

export const dynamic = "force-dynamic";

type StorefrontPageProps = {
  params: Promise<{
    businessSlug: string;
  }>;
};

export default async function StorefrontPage({ params }: StorefrontPageProps) {
  const { businessSlug } = await params;
  const business = await getBusinessBySlugData(businessSlug);

  if (!business) {
    notFound();
  }

  const products = await getProductsForBusinessData(business.id);
  const categories = await getCategoriesForBusinessData(business.id);
  const heroImage = products.find((product) => product.slug === "family-food-bundle")?.imageUrl ?? "/images/products/family-food-bundle.webp";

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-3" href={`/s/${business.slug}`}>
            <span className="grid size-10 place-items-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: business.themeColor }}>
              {business.name.slice(0, 2).toUpperCase()}
            </span>
            <span>
              <span className="block font-semibold">{business.name}</span>
              <span className="block text-sm text-zinc-600">{business.address}</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            <Link className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-3 text-sm font-medium hover:bg-stone-100" href="/admin">
              <LogIn size={16} aria-hidden="true" />
              Seller Login
            </Link>
            <Link className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 px-3 text-sm font-medium hover:bg-stone-100" href="/admin/products">
              <Package size={16} aria-hidden="true" />
              Update items
            </Link>
            <Link className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800" href={`/s/${business.slug}/checkout`}>
              <ShoppingCart size={16} aria-hidden="true" />
              Cart
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_460px] lg:px-10">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Foodstuff storefront</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              Rice, beans, garri, oils, spices, and household food bundles.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">{business.description}</p>
            <div className="mt-6 flex max-w-xl items-center gap-2 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2">
              <Search size={18} className="text-zinc-500" aria-hidden="true" />
              <span className="text-sm text-zinc-500">Search products, categories, and food bundles</span>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
            <Image
              src={heroImage}
              alt="Nigerian foodstuff bundle arranged for sale"
              width={960}
              height={540}
              priority
              className="aspect-video h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Shop Products</h2>
            <p className="mt-1 text-sm text-zinc-600">Browse by Nigerian foodstuff category and unit size.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium" key={category.id}>
                {category.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link className="group rounded-lg border border-stone-200 bg-white p-4 hover:border-emerald-700" href={`/s/${business.slug}/products/${product.slug}`} key={product.id}>
              <div className="aspect-[4/3] overflow-hidden rounded-md bg-stone-100">
                <Image
                  src={product.imageUrl ?? "/images/products/family-food-bundle.webp"}
                  alt={`${product.name} product display`}
                  width={640}
                  height={480}
                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="mt-1 text-sm text-zinc-600">{product.unit}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-800">
                    <CartStockLabel businessSlug={business.slug} productId={product.id} stockQuantity={product.stockQuantity} />
                  </p>
                </div>
                <p className="text-base font-semibold">{formatCurrency(product.price, business.currency)}</p>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">{product.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
                View product
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
