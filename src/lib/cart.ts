export type StoredCartItem = {
  productId: string;
  quantity: number;
};

export function getCartStorageKey(businessSlug: string) {
  return `foodstack-cart:${businessSlug}`;
}

export function normalizeCartQuantity(quantity: number, stockQuantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.min(Math.floor(quantity), Math.max(stockQuantity, 1)));
}
