import type { Metadata } from "next";
import { CartPageView } from "./CartPageView";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Корзина Emerald Textile: проверьте товары, цвета и размеры перед оформлением заказа.",
  robots: { index: false },
};

export default function CartPage() {
  return <CartPageView />;
}
