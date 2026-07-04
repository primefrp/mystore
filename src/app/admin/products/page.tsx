import Image from "next/image";
import Link from "next/link";
import { Archive, Plus } from "lucide-react";

import { formatCurrency, titleCase } from "@/lib/format";
import {
  getAdminBusinessData,
  getCategoriesForBusinessData,
  getProductsForBusinessData,
} from "@/lib/marketplace";
import { archiveProductAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const business = await getAdminBusinessData();

  if (!business) {
    return null;
  }

  const products = await getProductsForBusinessData(business.id);
  const categories = await getCategoriesForBusinessData(business.id);
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">{business.name}</p>
            <h1 className="mt-2 text-3xl font-semibold">Products</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="inline-flex h-10 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold hover:bg-stone-100" href="/admin">
              Dashboard
            </Link>
            <Link className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900" href="/admin/products/new">
              <Plus size={16} aria-hidden="true" />
              Add product
            </Link>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-stone-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-stone-50 text-zinc-600">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Price</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-14 overflow-hidden rounded-md bg-stone-100">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={`${product.name} thumbnail`}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <span className="block font-semibold">{product.name}</span>
                        <span className="block text-zinc-500">{product.unit}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">{categoryById.get(product.categoryId) ?? "Uncategorized"}</td>
                  <td className="px-5 py-4">{product.stockQuantity}</td>
                  <td className="px-5 py-4">{titleCase(product.status)}</td>
                  <td className="px-5 py-4 text-right font-semibold">{formatCurrency(product.price, business.currency)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link className="inline-flex h-9 items-center rounded-md border border-stone-300 px-3 font-semibold hover:bg-stone-100" href={`/admin/products/${product.id}`}>
                        Edit
                      </Link>
                      <form action={archiveProductAction}>
                        <input name="productId" type="hidden" value={product.id} />
                        <button className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-300 px-3 font-semibold hover:bg-stone-100" type="submit">
                          <Archive size={15} aria-hidden="true" />
                          Archive
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
