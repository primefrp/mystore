"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { getCartStorageKey, normalizeCartQuantity, type StoredCartItem } from "@/lib/cart";
import { CartStockLabel, useCartQuantity } from "@/components/storefront/cart-stock-label";

type AddToCartPanelProps = {
  businessSlug: string;
  checkoutHref: string;
  product: {
    id: string;
    name: string;
    stockQuantity: number;
  };
};

function readCart(storageKey: string): StoredCartItem[] {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as StoredCartItem[];
  } catch {
    return [];
  }
}

function writeCart(storageKey: string, items: StoredCartItem[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("foodstack-cart-updated"));
}

export function AddToCartPanel({ businessSlug, checkoutHref, product }: AddToCartPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const selectedQuantity = useCartQuantity(businessSlug, product.id);
  const remainingQuantity = Math.max(product.stockQuantity - selectedQuantity, 0);
  const isOutOfStock = remainingQuantity <= 0;

  function addToCart() {
    const storageKey = getCartStorageKey(businessSlug);
    const cart = readCart(storageKey);
    const existingItem = cart.find((item) => item.productId === product.id);
    const existingQuantity = existingItem?.quantity ?? 0;
    const availableQuantity = Math.max(product.stockQuantity - existingQuantity, 0);
    const requestedQuantity = normalizeCartQuantity(quantity, availableQuantity);
    const nextQuantity = Math.min(existingQuantity + requestedQuantity, product.stockQuantity);

    if (nextQuantity <= existingQuantity) {
      setNotice(`You already have all available ${product.name} in your cart.`);
      return;
    }

    const nextCart = existingItem
      ? cart.map((item) => (item.productId === product.id ? { ...item, quantity: nextQuantity } : item))
      : [...cart, { productId: product.id, quantity: nextQuantity }];

    writeCart(storageKey, nextCart);
    setQuantity(1);
    setNotice(`${product.name} added to cart. ${Math.max(product.stockQuantity - nextQuantity, 0)} left after cart.`);
  }

  return (
    <div className="mt-6 grid gap-4 rounded-lg bg-stone-50 p-4">
      <p className="text-sm font-medium text-zinc-800">
        <CartStockLabel businessSlug={businessSlug} productId={product.id} stockQuantity={product.stockQuantity} />
      </p>
      <div className="grid grid-cols-[96px_1fr] gap-3">
        <label className="pt-2 text-sm font-medium text-zinc-700" htmlFor="quantity">
          Quantity
        </label>
        <input
          className="h-10 rounded-md border border-stone-300 bg-white px-3 text-sm outline-none focus:border-emerald-700"
          disabled={isOutOfStock}
          id="quantity"
          max={Math.max(remainingQuantity, 1)}
          min="1"
          onChange={(event) => setQuantity(normalizeCartQuantity(Number(event.target.value), remainingQuantity))}
          type="number"
          value={quantity}
        />
      </div>
      <button
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={isOutOfStock}
        onClick={addToCart}
        type="button"
      >
        <ShoppingCart size={17} aria-hidden="true" />
        {isOutOfStock ? "All selected" : "Add to cart"}
      </button>
      {notice ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950" role="status">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} aria-hidden="true" />
            Added
          </div>
          <p className="mt-1">{notice}</p>
          <Link className="mt-2 inline-flex font-semibold text-emerald-800 hover:text-emerald-950" href={checkoutHref}>
            View cart
          </Link>
        </div>
      ) : null}
    </div>
  );
}
