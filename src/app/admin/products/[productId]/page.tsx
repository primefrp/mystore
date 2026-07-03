import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getAdminBusinessData,
  getCategoriesForBusinessData,
  getProductByIdData,
} from "@/lib/marketplace";
import { saveProductAction } from "../../actions";

export const dynamic = "force-dynamic";

type EditProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { productId } = await params;
  const business = await getAdminBusinessData();
  const product = await getProductByIdData(productId);

  if (!business || !product || product.businessId !== business.id) {
    notFound();
  }

  const categories = await getCategoriesForBusinessData(business.id);

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <Link className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="/admin/products">
          Back to products
        </Link>
        <div className="mt-4 rounded-lg border border-stone-200 bg-white p-5">
          <h1 className="text-2xl font-semibold">Edit Product</h1>
          <form action={saveProductAction} className="mt-6 grid gap-4">
            <input name="businessSlug" type="hidden" value={business.slug} />
            <input name="productId" type="hidden" value={product.id} />
            <Field defaultValue={product.name} label="Name" name="name" required />
            <label className="grid gap-2">
              <span className="text-sm font-medium">Description</span>
              <textarea className="min-h-28 rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-700" defaultValue={product.description} name="description" required />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field defaultValue={product.price.toString()} label="Price" name="price" required type="number" />
              <Field defaultValue={product.compareAtPrice?.toString() ?? ""} label="Compare at price" name="compareAtPrice" type="number" />
              <Field defaultValue={product.stockQuantity.toString()} label="Stock quantity" name="stockQuantity" required type="number" />
              <Field defaultValue={product.unit} label="Unit" name="unit" required />
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Category</span>
              <select className="h-10 rounded-md border border-stone-300 bg-white px-3 text-sm outline-none focus:border-emerald-700" defaultValue={product.categoryId} name="categoryId">
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
              <select className="h-10 rounded-md border border-stone-300 bg-white px-3 text-sm outline-none focus:border-emerald-700" defaultValue={product.status === "ARCHIVED" ? "DRAFT" : product.status} name="status">
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input defaultChecked={product.isFeatured} name="isFeatured" type="checkbox" />
              Featured product
            </label>
            <button className="h-11 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900" type="submit">
              Save changes
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
