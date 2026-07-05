"use client";

import { useActionState } from "react";

import { createStoreAction, type StoreSignupState } from "@/app/actions";

const initialState: StoreSignupState = {
  message: "",
  status: "idle",
};

export function StoreSignupForm() {
  const [state, formAction, isPending] = useActionState(createStoreAction, initialState);

  return (
    <form action={formAction} className="mt-6 grid gap-5">
      {state.status === "error" && state.message ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-950" role="alert">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field errors={state.fieldErrors?.ownerName} label="Owner name" name="ownerName" required />
        <Field errors={state.fieldErrors?.email} label="Owner email" name="email" required type="email" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field errors={state.fieldErrors?.storeName} label="Store name" name="storeName" required />
        <Field errors={state.fieldErrors?.phone} label="Phone number" name="phone" required />
      </div>

      <Field errors={state.fieldErrors?.address} label="Store address" name="address" required />
      <label className="grid gap-2">
        <span className="text-sm font-medium">Store description</span>
        <textarea className="min-h-28 rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-700" name="description" />
        <FieldErrors errors={state.fieldErrors?.description} />
      </label>

      <label className="grid gap-2 sm:max-w-48">
        <span className="text-sm font-medium">Store color</span>
        <input className="h-10 rounded-md border border-stone-300 bg-white px-2" defaultValue="#047857" name="themeColor" type="color" />
        <FieldErrors errors={state.fieldErrors?.themeColor} />
      </label>

      <div className="border-t border-stone-200 pt-4">
        <h3 className="font-semibold">Bank transfer details</h3>
        <p className="mt-1 text-sm text-zinc-600">You can add this now or later from admin settings.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Field errors={state.fieldErrors?.bankName} label="Bank name" name="bankName" />
          <Field errors={state.fieldErrors?.accountNumber} label="Account number" name="accountNumber" />
          <Field errors={state.fieldErrors?.accountName} label="Account name" name="accountName" />
        </div>
      </div>

      <button
        className="h-11 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Creating store..." : "Create store"}
      </button>
    </form>
  );
}

function Field({
  errors,
  label,
  name,
  required,
  type = "text",
}: {
  errors?: string[];
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <input className="h-10 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-emerald-700" name={name} required={required} type={type} />
      <FieldErrors errors={errors} />
    </label>
  );
}

function FieldErrors({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <span className="text-sm font-medium text-red-700">{errors[0]}</span>;
}
