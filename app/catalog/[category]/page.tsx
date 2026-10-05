import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, getCategory } from "@/lib/data/categories";
import { byCategory } from "@/lib/catalog";
import { countLabel, PRODUCT_FORMS } from "@/lib/format";
import { CatalogView } from "@/components/CatalogView";
import { Hero } from "@/components/Hero";
import { EditorialSection } from "@/components/editorial";
import { LoadingState } from "@/components/ui";
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
    openGraph: {
      title: `${c.name} — Emerald Textile`,
      description: c.seo.description,
      images: [c.hero.src],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const products = byCategory(c.slug);

  return (
    <>
      <Hero
        crumbs={[{ label: "Каталог", href: "/catalog" }, { label: c.name }]}
        eyebrow={countLabel(products.length, PRODUCT_FORMS)}
        title={c.name}
        lead={c.lead}
        image={c.hero}
        size="h1"
      >
        <p className="t-body t-strong" style={{ maxWidth: "52ch" }}>
          {c.description}
        </p>
      </Hero>

      <nav className={s.subnav} aria-label={`Разделы: ${c.name}`}>
        <ul className={`container ${s.subnavList}`}>
          {c.subcategories.map((sub) => (
            <li key={sub.slug}>
              <Link href={`/catalog/${c.slug}?type=${sub.slug}`} className={s.subnavLink} scroll={false}>
                {sub.name}
                <span className={s.subnavCount}>{products.filter((p) => p.subcategory === sub.slug).length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className={`container ${s.catalog} ${s.catalogTop}`} aria-labelledby="cat-products">
        <h2 id="cat-products" className="visually-hidden">
          Товары: {c.name}
        </h2>
        <Suspense fallback={<LoadingState label="Загружаем товары…" />}>
          <CatalogView category={c.slug} />
        </Suspense>
      </section>

      <EditorialSection tone="ivory" eyebrow={c.editorial.label} title={c.editorial.title} image={c.editorial.image} reverse>
        <p>{c.editorial.text}</p>
      </EditorialSection>

      <section className="container" aria-labelledby="seo-title">
        <div className={s.seo}>
          <h2 id="seo-title" className={`t-h3 ${s.seoTitle}`}>
            {c.seo.title}
          </h2>
          <div className={s.seoText}>
            {c.seo.text.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
