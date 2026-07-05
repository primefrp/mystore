"use client";

import Link from "next/link";
import { Banknote, Bike, MapPin, Minus, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useFormStatus } from "react-dom";

import { getCartStorageKey, normalizeCartQuantity, type StoredCartItem } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import type { BankAccount, Business, Product } from "@/lib/types";

type CheckoutCartProps = {
  action: (formData: FormData) => void;
  bankAccount?: BankAccount;
  business: Business;
  products: Product[];
};

type CartRow = StoredCartItem & {
  product: Product;
};

function writeCart(storageKey: string, items: StoredCartItem[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("foodstack-cart-updated"));
}

export function CheckoutCart({ action, bankAccount, business, products }: CheckoutCartProps) {
  const storageKey = getCartStorageKey(business.slug);
  const [deliveryMethod, setDeliveryMethod] = useState<"LOCAL_DELIVERY" | "PICKUP">("LOCAL_DELIVERY");

  const productById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);

  const rawCart = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("foodstack-cart-updated", onStoreChange);

      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("foodstack-cart-updated", onStoreChange);
      };
    },
    () => window.localStorage.getItem(storageKey) ?? "[]",
    () => "[]",
  );

  const cartItems = useMemo(() => {
    try {
      return (JSON.parse(rawCart) as StoredCartItem[])
      .map((item) => {
        const product = productById.get(item.productId);

        if (!product || product.stockQuantity <= 0) {
          return null;
        }

        return {
          productId: item.productId,
          quantity: normalizeCartQuantity(item.quantity, product.stockQuantity),
        };
      })
      .filter((item): item is StoredCartItem => Boolean(item));
    } catch {
      return [];
    }
  }, [productById, rawCart]);

  const rows = cartItems
    .map((item) => {
      const product = productById.get(item.productId);

      return product ? { ...item, product } : null;
    })
    .filter((item): item is CartRow => Boolean(item));

  const subtotal = rows.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === "LOCAL_DELIVERY" && rows.length > 0 ? 2500 : 0;
  const total = subtotal + deliveryFee;

  function commitCart(items: StoredCartItem[]) {
    writeCart(storageKey, items);
  }

  function updateQuantity(productId: string, quantity: number) {
    const product = productById.get(productId);

    if (!product) {
      return;
    }

    commitCart(
      cartItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: normalizeCartQuantity(quantity, product.stockQuantity) }
          : item,
      ),
    );
  }

  function removeItem(productId: string) {
    commitCart(cartItems.filter((item) => item.productId !== productId));
  }

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
      <form action={action} className="rounded-lg border border-stone-200 bg-white p-5" id="checkout-form">
        <input name="businessSlug" type="hidden" value={business.slug} />
        {rows.map((item) => (
          <div key={item.productId}>
            <input name="productId" type="hidden" value={item.productId} />
            <input name="quantity" type="hidden" value={item.quantity} />
          </div>
        ))}
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="name">
              Customer name
            </label>
            <input className="h-10 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-emerald-700" id="name" name="customerName" placeholder="Full name" required />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="phone">
                Phone number
              </label>
              <input className="h-10 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-emerald-700" id="phone" name="customerPhone" placeholder="+234" required />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input className="h-10 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-emerald-700" id="email" name="customerEmail" placeholder="name@example.com" type="email" />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="address">
              Delivery address
            </label>
            <textarea className="min-h-24 rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-700" id="address" name="deliveryAddress" placeholder="Street, area, city" />
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Option
            checked={deliveryMethod === "LOCAL_DELIVERY"}
            icon={<Bike size={18} aria-hidden="true" />}
            name="deliveryMethod"
            onChange={() => setDeliveryMethod("LOCAL_DELIVERY")}
            title="Local delivery"
            text="Delivery fee is added to the order."
            value="LOCAL_DELIVERY"
          />
          <Option
            checked={deliveryMethod === "PICKUP"}
            icon={<MapPin size={18} aria-hidden="true" />}
            name="deliveryMethod"
            onChange={() => setDeliveryMethod("PICKUP")}
            title="Pickup"
            text="Customer picks up from the store."
            value="PICKUP"
          />
          <Option defaultChecked icon={<Banknote size={18} aria-hidden="true" />} name="paymentMethod" title="Bank transfer" text="Pay into the seller account shown below." value="BANK_TRANSFER" />
          <Option icon={<Banknote size={18} aria-hidden="true" />} name="paymentMethod" title="Pay on delivery" text="Payment is collected at delivery." value="PAY_ON_DELIVERY" />
        </div>

        {bankAccount ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
              <Banknote size={18} aria-hidden="true" />
              Seller bank transfer details
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-emerald-900/75">Bank</dt>
                <dd className="mt-1 font-semibold text-emerald-950">{bankAccount.bankName}</dd>
              </div>
              <div>
                <dt className="text-emerald-900/75">Account number</dt>
                <dd className="mt-1 font-semibold text-emerald-950">{bankAccount.accountNumber}</dd>
              </div>
              <div>
                <dt className="text-emerald-900/75">Account name</dt>
                <dd className="mt-1 font-semibold text-emerald-950">{bankAccount.accountName}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-6 text-emerald-950">
              The seller confirms bank transfers manually before processing the order. Paystack will replace or complement this step later.
            </p>
          </div>
        ) : null}
      </form>

      <aside className="rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Cart Summary</h2>
        {rows.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-stone-300 p-4 text-sm text-zinc-600">
            <p>Your cart is empty.</p>
            <Link className="mt-3 inline-flex font-semibold text-emerald-800 hover:text-emerald-950" href={`/s/${business.slug}`}>
              Continue shopping
            </Link>
          </div>
        ) : null}
        <div className="mt-4 divide-y divide-stone-200">
          {rows.map((item) => (
            <div className="grid gap-3 py-4 text-sm" key={item.productId}>
              <div className="flex justify-between gap-4">
                <span>
                  <span className="block font-medium">{item.product.name}</span>
                  <span className="block text-zinc-500">{item.product.unit}</span>
                  <span className="mt-1 block text-xs font-medium text-emerald-800">{item.product.stockQuantity} left</span>
                </span>
                <span className="font-semibold">{formatCurrency(item.product.price * item.quantity, business.currency)}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center rounded-md border border-stone-300">
                  <button
                    aria-label={`Reduce ${item.product.name} quantity`}
                    className="grid size-9 place-items-center hover:bg-stone-100"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    type="button"
                  >
                    <Minus size={15} aria-hidden="true" />
                  </button>
                  <input
                    aria-label={`${item.product.name} quantity`}
                    className="h-9 w-14 border-x border-stone-300 text-center text-sm outline-none"
                    max={item.product.stockQuantity}
                    min="1"
                    onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                    type="number"
                    value={item.quantity}
                  />
                  <button
                    aria-label={`Increase ${item.product.name} quantity`}
                    className="grid size-9 place-items-center hover:bg-stone-100"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    type="button"
                  >
                    <Plus size={15} aria-hidden="true" />
                  </button>
                </div>
                <button
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-300 px-3 font-semibold text-zinc-700 hover:bg-stone-100"
                  onClick={() => removeItem(item.productId)}
                  type="button"
                >
                  <Trash2 size={15} aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <SummaryRow label="Subtotal" value={formatCurrency(subtotal, business.currency)} />
          <SummaryRow label="Delivery" value={formatCurrency(deliveryFee, business.currency)} />
          <SummaryRow label="Total" value={formatCurrency(total, business.currency)} strong />
        </div>
        <SubmitButton disabled={rows.length === 0} />
      </aside>
    </section>
  );
}

function Option({
  checked,
  defaultChecked,
  icon,
  name,
  onChange,
  text,
  title,
  value,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  icon: ReactNode;
  name: string;
  onChange?: () => void;
  text: string;
  title: string;
  value: string;
}) {
  return (
    <label className="rounded-lg border border-stone-300 p-4 text-left hover:border-emerald-700 hover:bg-emerald-50">
      <input
        checked={checked}
        className="sr-only"
        defaultChecked={defaultChecked}
        name={name}
        onChange={onChange}
        required
        type="radio"
        value={value}
      />
      <span className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </span>
      <span className="mt-2 block text-sm leading-6 text-zinc-600">{text}</span>
    </label>
  );
}

function SummaryRow({ label, strong, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "border-t border-stone-200 pt-3 text-base font-semibold" : "text-zinc-700"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="mt-6 h-11 w-full rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-zinc-400"
      disabled={disabled || pending}
      form="checkout-form"
      type="submit"
    >
      {pending ? "Placing order..." : "Place order"}
    </button>
  );
}
