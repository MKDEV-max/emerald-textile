import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct } from "@/lib/data/products";
import { categoryName, subcategoryName } from "@/lib/data/categories";
import { getCollection } from "@/lib/data/collections";
import { CARE, getMaterial } from "@/lib/data/materials";
import { COLORS } from "@/lib/data/colors";
import { detailImage, minPrice, productGallery, related, sameCollection } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { DetailsTable, ProductView } from "@/components/ProductView";
import { ProductRail } from "@/components/ProductGrid";
import { CareIcon } from "@/components/Icon";
import { Media } from "@/components/Media";
import { Breadcrumbs, Wave } from "@/components/ui";
import s from "./product.module.css";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Товар не найден" };
  const description = `${p.name} — ${p.material.toLowerCase()}, ${p.short.toLowerCase()}. ${p.description.split(". ")[0]}. Цена от ${formatPrice(minPrice(p))}.`;
  const img = productGallery(p)[0];
  return {
    title: `${p.name} — ${categoryName(p.category).toLowerCase()}`,
    description,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: `${p.name} — Emerald Textile`, description, images: [{ url: img.src, alt: img.alt }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const collection = getCollection(p.collection);
  const material = getMaterial(p.materialSlug);
  const fromCollection = sameCollection(p, 3);
  const similar = related(p);
  const close = detailImage(p);

  // В панели — только компактные справочные разделы; история, материал и уход — ниже, крупно
  const details = [
    {
      id: "specs",
      title: "Характеристики",
      content: (
        <DetailsTable
          rows={[
            { label: "Вид", value: subcategoryName(p.category, p.subcategory) },
            { label: "Состав", value: p.composition },
            { label: "Размеры", value: p.sizes.map((x) => x.label).join("; ") },
            { label: "Цвета", value: p.colors.map((c) => COLORS[c].name).join(", ") },
            ...p.features,
            { label: "Артикул", value: p.id.toUpperCase() },
          ]}
        />
      ),
    },
    {
      id: "delivery",
      title: "Доставка и возврат",
      content: (
        <p>
          Курьером или в пункт выдачи по России; возврат и обмен — в течение 14 дней.{" "}
          <Link href="/delivery" className="link-underline">
            Условия
          </Link>
          . В демо-витрине заказы не обрабатываются.
        </p>
      ),
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.id.toUpperCase(),
    description: p.description,
    image: productGallery(p).map((i) => `https://emeraldtextile.ru${i.src}`),
    brand: { "@type": "Brand", name: "Emerald Textile" },
    material: p.composition,
    color: p.colors.map((c) => COLORS[c].name).join(", "),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "RUB",
      lowPrice: minPrice(p),
      highPrice: Math.max(p.price, ...p.sizes.map((x) => x.price ?? p.price)),
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <div className={`container ${s.top}`}>
        <Breadcrumbs
          items={[
            { label: "Каталог", href: "/catalog" },
            { label: categoryName(p.category), href: `/catalog/${p.category}` },
            { label: p.name },
          ]}
        />
        <div className={s.view}>
          <ProductView product={p} details={details} />
        </div>
      </div>

      {/* История изделия */}
      <section className={`container ${s.story}`} aria-labelledby="story">
        <span className="t-index">01</span>
        <h2 id="story" className="t-eyebrow">
          Об изделии
        </h2>
        <p className={`display ${s.storyText}`}>{p.description}</p>
      </section>

      {/* Материал — крупный кадр */}
      {material && (
        <section className={s.material} aria-labelledby="mat">
          <div className={s.materialMedia}>
            <Media image={material.image} fill sizes="(max-width: 1023px) 100vw, 58vw" />
          </div>
          <div className={s.materialText}>
            <span className="t-index">02</span>
            <p className="t-eyebrow">Материал</p>
            <h2 id="mat" className="t-h1">
              {material.name}
            </h2>
            <p className={s.feel}>{material.feel}</p>
            <dl className={s.props}>
              {material.properties.map((pr) => (
                <div key={pr.label}>
                  <dt>{pr.label}</dt>
                  <dd>{pr.value}</dd>
                </div>
              ))}
            </dl>
            <Link href={`/materials#${material.slug}`} className={s.textLink}>
              О материале
            </Link>
          </div>
        </section>
      )}

      {/* Деталь — крупный план плетения */}
      <section className={`container ${s.detail}`} aria-labelledby="detail">
        <div className={s.detailText}>
          <span className="t-index">03</span>
          <p className="t-eyebrow">Деталь</p>
          <h2 id="detail" className="t-h2">
            Плетение крупным планом
          </h2>
          <p>
            {p.material}, цвет «{COLORS[p.colors[0]].name.toLowerCase()}». {p.short}.
          </p>
        </div>
        <div className={s.detailMedia}>
          <Media image={close} ratio="16 / 10" sizes="(max-width: 1023px) 100vw, 60vw" />
        </div>
      </section>

      {/* Уход — как информационная страница каталога: Forest, символы, волна */}
      <section className={`${s.care} on-dark`} aria-labelledby="care">
        <div className={`container ${s.careInner}`}>
          <div className={s.careHead}>
            <span className="t-index" style={{ color: "var(--color-cream)", opacity: 0.7 }}>
              04
            </span>
            <h2 id="care" className="t-h2">
              Уход за изделием
            </h2>
            {material && <p className={s.careNote}>{material.careText}</p>}
          </div>
          <ul className={s.careList}>
            {p.care.map((c) => (
              <li key={c}>
                <CareIcon care={c} size={44} />
                <span>{CARE[c]}</span>
              </li>
            ))}
          </ul>
        </div>
        <Wave tone="tonal" className={s.careWave} />
      </section>

      {/* Коллекция — связанная история */}
      {collection && fromCollection.length > 0 && (
        <section className={`container ${s.collection}`} aria-labelledby="col">
          <div className={s.collectionHead}>
            <span className="t-index">05</span>
            <p className="t-eyebrow">{collection.season}</p>
            <h2 id="col" className="t-h2">
              Коллекция «{collection.name}»
            </h2>
            <p className={s.collectionLead}>{collection.lead}</p>
            <Link href={`/collections/${collection.slug}`} className={s.textLink}>
              Смотреть коллекцию
            </Link>
          </div>
          <div className={s.collectionRail}>
            <ProductRail products={fromCollection} label={`Другие предметы коллекции «${collection.name}»`} />
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className={`container ${s.similar}`} aria-labelledby="sim">
          <div className={s.similarHead}>
            <h2 id="sim" className="t-h3">
              Похожие предметы
            </h2>
            <Link href={`/catalog/${p.category}`} className={s.textLink}>
              {categoryName(p.category)}
            </Link>
          </div>
          <ProductRail products={similar} label="Похожие предметы" />
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
