import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { CheckoutCart } from "@/components/storefront/checkout-cart";
import {
  getBusinessBySlugData,
  getDefaultBankAccountData,
  getProductsForBusinessData,
} from "@/lib/marketplace";
import { createOrderAction } from "./actions";

export const dynamic = "force-dynamic";

type CheckoutPageProps = {
  params: Promise<{
    businessSlug: string;
  }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { businessSlug } = await params;
  const business = await getBusinessBySlugData(businessSlug);

  if (!business) {
    notFound();
  }

  const products = await getProductsForBusinessData(business.id);
  const bankAccount = await getDefaultBankAccountData(business.id);

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <Link className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-950" href={`/s/${business.slug}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to store
        </Link>

        <CheckoutCart action={createOrderAction} bankAccount={bankAccount} business={business} products={products} />
      </div>
    </main>
  );
}
