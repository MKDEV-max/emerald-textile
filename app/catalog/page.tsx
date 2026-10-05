import type { Metadata } from "next";
import { Suspense } from "react";
import { CATEGORIES } from "@/lib/data/categories";
import { PRODUCTS } from "@/lib/data/products";
import { countLabel, PRODUCT_FORMS } from "@/lib/format";
import { CatalogView } from "@/components/CatalogView";
import { CategoryCard, PageHeader } from "@/components/editorial";
import { LoadingState } from "@/components/ui";
import s from "./catalog.module.css";

export const metadata: Metadata = {
  title: "Каталог домашнего текстиля",
  description:
    "Каталог Emerald Textile: полотенца, халаты, постельное бельё, одеяла, скатерти, пледы и декоративные наволочки из хлопка и льна. Фильтры по материалу, цвету и размеру.",
  alternates: { canonical: "/catalog" },
  openGraph: { title: "Каталог — Emerald Textile", images: ["/images/brand/bedroom-wide.jpg"] },
};

export default function CatalogPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Каталог" }]}
        eyebrow={countLabel(PRODUCTS.length, PRODUCT_FORMS)}
        title="Каталог"
        lead="Текстиль для четырёх пространств дома: ванной, спальни, столовой и гостиной. Натуральные ткани и спокойные цвета, которые легко сочетать между собой."
      >
        <ul className={s.cats}>
          {CATEGORIES.map((c, i) => (
            <li key={c.slug}>
              <CategoryCard category={c} priority={i < 2} />
            </li>
          ))}
        </ul>
      </PageHeader>

      <section className={`container ${s.catalog}`} aria-label="Товары каталога">
        <Suspense fallback={<LoadingState label="Загружаем каталог…" />}>
          <CatalogView />
        </Suspense>
      </section>
    </>
  );
}
