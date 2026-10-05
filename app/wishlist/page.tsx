import type { Metadata } from "next";
import { WishlistView } from "./WishlistView";

export const metadata: Metadata = {
  title: "Избранное",
  description: "Избранные товары Emerald Textile.",
  robots: { index: false },
};

export default function WishlistPage() {
  return <WishlistView />;
}
