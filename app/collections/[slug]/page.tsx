import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COLLECTIONS, getCollection } from "@/lib/data/collections";
import { byCollection } from "@/lib/catalog";
import { countLabel, PRODUCT_FORMS } from "@/lib/format";
import { Hero } from "@/components/Hero";
import { Media } from "@/components/Media";
import { ProductGrid } from "@/components/ProductGrid";
import { CollectionCard, Palette } from "@/components/editorial";
import { SectionHeader } from "@/components/ui";
import s from "../collections.module.css";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return { title: "Коллекция не найдена" };
  return {
    title: `Коллекция «${c.name}»`,
    description: `${c.lead} ${c.description}`.slice(0, 200),
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { title: `Коллекция «${c.name}» — Emerald Textile`, images: [c.image.src] },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const products = byCollection(c.slug);
  const others = COLLECTIONS.filter((x) => x.slug !== c.slug).slice(0, 3);

  return (
    <>
      <Hero
        crumbs={[{ label: "Коллекции", href: "/collections" }, { label: `«${c.name}»` }]}
        eyebrow={c.season}
        title={`«${c.name}»`}
        lead={c.lead}
        image={c.image}
        primary={{ label: "Смотреть товары", href: "#tovary" }}
      />

      <div className="container">
        <div className={s.intro}>
          <div className={s.introText}>
            <p className="t-label">О коллекции</p>
            <p className="t-h3">{c.description}</p>
          </div>
          <div className={s.introAside}>
            <dl className={s.specs}>
              <div>
                <dt className="t-label">Материалы</dt>
                <dd>{c.materials.join(" · ")}</dd>
              </div>
              <div>
                <dt className="t-label">Предметов</dt>
                <dd>{countLabel(products.length, PRODUCT_FORMS)}</dd>
              </div>
              <div>
                <dt className="t-label">Палитра</dt>
                <dd>
                  <Palette colors={c.palette} size="l" />
                </dd>
              </div>
            </dl>
            <Media image={c.detail} ratio="4 / 3" frame sizes="(max-width: 1023px) 100vw, 40vw" />
          </div>
        </div>

        <section id="tovary" className={s.pageProducts} aria-labelledby="col-products">
          <SectionHeader id="col-products" title="Предметы коллекции" eyebrow={countLabel(products.length, PRODUCT_FORMS)} />
          <ProductGrid products={products} />
        </section>
      </div>

      <section className="section bg-ivory" aria-labelledby="other-cols">
        <div className="container">
          <SectionHeader id="other-cols" title="Другие коллекции" action={{ label: "Все коллекции", href: "/collections" }} />
          <ul className="grid" style={{ rowGap: 48 }}>
            {others.map((o) => (
              <li key={o.slug} style={{ gridColumn: "span 4" }} className="collection-cell">
                <CollectionCard collection={o} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
