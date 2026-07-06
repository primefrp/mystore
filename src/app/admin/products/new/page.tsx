import Link from "next/link";

import { NoActiveStore } from "@/components/admin/no-active-store";
import { getAdminBusinessData, getCategoriesForBusinessData } from "@/lib/marketplace";
import { saveProductAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const business = await getAdminBusinessData();

  if (!business) {
    return <NoActiveStore />;
  }

  const categories = await getCategoriesForBusinessData(business.id);

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <Link className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="/admin/products">
          Back to products
        </Link>
        <div className="mt-4 rounded-lg border border-stone-200 bg-white p-5">
          <h1 className="text-2xl font-semibold">Add Product</h1>
          <ProductForm businessSlug={business.slug} categories={categories} />
        </div>
      </section>
    </main>
  );
}

function ProductForm({
  businessSlug,
  categories,
}: {
  businessSlug: string;
  categories: { id: string; name: string }[];
}) {
  return (
    <form action={saveProductAction} className="mt-6 grid gap-4">
      <input name="businessSlug" type="hidden" value={businessSlug} />
      <Field label="Name" name="name" required />
      <Field label="Product image URL (optional)" name="imageUrl" />
      <label className="grid gap-2">
        <span className="text-sm font-medium">Description (optional)</span>
        <textarea className="min-h-28 rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-700" name="description" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price" name="price" required type="number" />
        <Field label="Compare at price" name="compareAtPrice" type="number" />
        <Field label="Stock quantity" name="stockQuantity" required type="number" />
        <Field label="Unit" name="unit" required />
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Category</span>
        <select className="h-10 rounded-md border border-stone-300 bg-white px-3 text-sm outline-none focus:border-emerald-700" name="categoryId">
          <option value="">Uncategorized</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Status</span>
        <select className="h-10 rounded-md border border-stone-300 bg-white px-3 text-sm outline-none focus:border-emerald-700" name="status" defaultValue="ACTIVE">
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input name="isFeatured" type="checkbox" />
        Featured product
      </label>
      <button className="h-11 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900" type="submit">
        Save product
      </button>
    </form>
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
