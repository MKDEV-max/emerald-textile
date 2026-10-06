import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, getCategory } from "@/lib/data/categories";
import { byCategory } from "@/lib/catalog";
import { countLabel, PRODUCT_FORMS } from "@/lib/format";
import { CatalogView } from "@/components/CatalogView";
import { CatalogEditorial, CatalogNav } from "@/components/CatalogNav";
import { Media } from "@/components/Media";
import { Breadcrumbs, LoadingState } from "@/components/ui";
import s from "../catalog.module.css";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return { title: "Категория не найдена" };
  return {
    title: c.seo.title,
    description: c.seo.description,
    alternates: { canonical: `/catalog/${c.slug}` },
    openGraph: { title: `${c.name} — Emerald Textile`, description: c.seo.description, images: [c.hero.src] },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const products = byCategory(c.slug);

  return (
    <>
      <section className={`${s.catHero} ${s[`tone_${c.slug}`]}`} aria-labelledby="cat-title">
        <div className={s.catHeroText}>
          <Breadcrumbs items={[{ label: "Каталог", href: "/catalog" }, { label: c.name }]} />
          <div className={s.catHeroBody}>
            <p className={s.catTime}>
              <span className="t-index">{c.time}</span>
              <span className="t-eyebrow">{countLabel(products.length, PRODUCT_FORMS)}</span>
            </p>
            <h1 id="cat-title" className={`display ${s.catTitle}`}>
              {c.name}
            </h1>
            <p className={s.catMood}>{c.mood}</p>
            <p className={s.catLead}>{c.description}</p>
          </div>
        </div>
        <div className={s.catHeroMedia}>
          <Media image={c.hero} fill priority sizes="(max-width: 1023px) 100vw, 50vw" />
        </div>
      </section>

      <div className={`container ${s.catBody}`}>
        <CatalogNav active={c.slug} />
        <nav className={s.subnav} aria-label={`Разделы: ${c.name}`}>
          <ul>
            {c.subcategories.map((sub) => (
              <li key={sub.slug}>
                <Link href={`/catalog/${c.slug}?type=${sub.slug}`} scroll={false} className="link-underline">
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="cat-products" className={s.catalog}>
          <h2 id="cat-products" className="visually-hidden">
            Товары: {c.name}
          </h2>
          <Suspense fallback={<LoadingState label="Загружаем товары…" />}>
            <CatalogView
              category={c.slug}
              editorial={<CatalogEditorial label={c.editorial.label} title={c.editorial.title} text={c.editorial.text} image={c.editorial.image} />}
            />
          </Suspense>
        </section>

        <section className={s.seo} aria-labelledby="seo-title">
          <h2 id="seo-title" className={`t-h3 ${s.seoTitle}`}>
            {c.seo.title}
          </h2>
          <div className={s.seoText}>
            {c.seo.text.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
