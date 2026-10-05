"use client";

import { useStore } from "@/lib/store";

export function FooterCartLink() {
  const { openPanel, cartCount, ready } = useStore();
  return (
    <button type="button" className="link-underline" onClick={() => openPanel("cart")}>
      Корзина{ready && cartCount > 0 ? ` (${cartCount})` : ""}
    </button>
  );
}
