import type { Metadata } from "next";
import { AccountView } from "./AccountView";

export const metadata: Metadata = {
  title: "Личный кабинет",
  description: "Личный кабинет Emerald Textile: заказы, профиль и избранное.",
  robots: { index: false },
};

export default function AccountPage() {
  return <AccountView />;
}
