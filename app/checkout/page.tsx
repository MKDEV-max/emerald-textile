import type { Metadata } from "next";
import { CheckoutView } from "./CheckoutView";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description: "Оформление заказа Emerald Textile: контакты, доставка и оплата.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
