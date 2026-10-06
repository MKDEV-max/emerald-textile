import type { Metadata } from "next";
import { Suspense } from "react";
import { PHOTOS } from "@/lib/data/images";
import { CatalogView } from "@/components/CatalogView";
import { CatalogEditorial, CatalogNav } from "@/components/CatalogNav";
import { Breadcrumbs, LoadingState } from "@/components/ui";
import s from "./catalog.module.css";

export const metadata: Metadata = {
  title: "Каталог домашнего текстиля",
  description:
    "Каталог Emerald Textile: полотенца, халаты, постельное бельё, одеяла, скатерти, пледы и декоративные наволочки из хлопка и льна.",
  alternates: { canonical: "/catalog" },
  openGraph: { title: "Каталог — Emerald Textile", images: ["/images/brand/bedroom-wide.jpg"] },
};

export default function CatalogPage() {
  return (
    <div className={`container ${s.page}`}>
      <Breadcrumbs items={[{ label: "Каталог" }]} />
      <header className={s.intro}>
        <h1 className={`display ${s.title}`}>Каталог</h1>
        <p className={s.lead}>
          Текстиль для четырёх пространств дома — от утренней ванной до вечерней гостиной. Натуральные ткани и спокойные цвета, которые легко
          сочетать между собой.
        </p>
      </header>
      <CatalogNav />
      <section aria-label="Товары каталога">
        <Suspense fallback={<LoadingState label="Загружаем каталог…" />}>
          <CatalogView
            editorial={
              <CatalogEditorial
                label="Коллекция «С кружевом»"
                title="Деталь, которую замечаешь не сразу"
                text="Тонкая кружевная кайма на скатертях и одеялах — главная коллекция сезона."
                image={PHOTOS.cropLaceTable}
                href="/collections/s-kruzhevom"
                linkLabel="Смотреть коллекцию"
              />
            }
          />
        </Suspense>
      </section>
    </div>
  );
}
