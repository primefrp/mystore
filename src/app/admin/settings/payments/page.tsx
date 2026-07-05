import Link from "next/link";
import { Banknote } from "lucide-react";

import { NoActiveStore } from "@/components/admin/no-active-store";
import {
  getAdminBusinessData,
  getDefaultBankAccountData,
} from "@/lib/marketplace";
import { saveBankAccountAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function PaymentSettingsPage() {
  const business = await getAdminBusinessData();

  if (!business) {
    return <NoActiveStore />;
  }

  const bankAccount = await getDefaultBankAccountData(business.id);

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <Link className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="/admin">
          Back to dashboard
        </Link>
        <div className="mt-4 rounded-lg border border-stone-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-800">
              <Banknote size={20} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Seller Payment Account</h1>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                These bank details are shown to customers who choose bank transfer during checkout.
              </p>
            </div>
          </div>

          <form action={saveBankAccountAction} className="mt-6 grid gap-4">
            <input name="businessSlug" type="hidden" value={business.slug} />
            <input name="bankAccountId" type="hidden" value={bankAccount?.id ?? ""} />
            <Field defaultValue={bankAccount?.bankName} label="Bank name" name="bankName" required />
            <Field defaultValue={bankAccount?.accountNumber} label="Account number" name="accountNumber" required />
            <Field defaultValue={bankAccount?.accountName} label="Account name" name="accountName" required />
            <button className="h-11 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900" type="submit">
              Save payment account
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
}: {
  defaultValue?: string;
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <input className="h-10 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-emerald-700" defaultValue={defaultValue} name={name} required={required} />
    </label>
  );
}
