"use client";

import { useMemo, useSyncExternalStore } from "react";

import { getCartStorageKey, type StoredCartItem } from "@/lib/cart";

type CartStockLabelProps = {
  businessSlug: string;
  productId: string;
  stockQuantity: number;
};

function getCartQuantity(rawCart: string, productId: string) {
  try {
    const cartItems = JSON.parse(rawCart) as StoredCartItem[];

    return cartItems
      .filter((item) => item.productId === productId)
      .reduce((total, item) => total + item.quantity, 0);
  } catch {
    return 0;
  }
}

export function useCartQuantity(businessSlug: string, productId: string) {
  const storageKey = getCartStorageKey(businessSlug);
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
  return useMemo(() => getCartQuantity(rawCart, productId), [productId, rawCart]);
}

export function CartStockLabel({ businessSlug, productId, stockQuantity }: CartStockLabelProps) {
  const selectedQuantity = useCartQuantity(businessSlug, productId);
  const remainingQuantity = Math.max(stockQuantity - selectedQuantity, 0);

  return (
    <span>
      {remainingQuantity} left
      {selectedQuantity > 0 ? " after cart" : ""}
    </span>
  );
}
