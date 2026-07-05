"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

import { getCartStorageKey } from "@/lib/cart";

type OrderPlacedNoticeProps = {
  businessSlug: string;
  orderNumber: string;
};

export function OrderPlacedNotice({ businessSlug, orderNumber }: OrderPlacedNoticeProps) {
  useEffect(() => {
    window.localStorage.removeItem(getCartStorageKey(businessSlug));
  }, [businessSlug]);

  return (
    <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950" role="status">
      <div className="flex items-center gap-2 font-semibold">
        <CheckCircle2 size={18} aria-hidden="true" />
        Buyer notification
      </div>
      <p className="mt-2 text-sm leading-6">
        Your order {orderNumber} has been placed successfully. Keep this page as your receipt while the seller confirms payment and prepares your order.
      </p>
    </div>
  );
}
