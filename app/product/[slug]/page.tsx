import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct } from "@/lib/data/products";
import { categoryName, subcategoryName } from "@/lib/data/categories";
import { getCollection } from "@/lib/data/collections";
import { getMaterial } from "@/lib/data/materials";
import { COLORS } from "@/lib/data/colors";
import { minPrice, productGallery, related, sameCollection } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { DetailsTable, ProductView } from "@/components/ProductView";
import { ProductRail } from "@/components/ProductGrid";
import { CareList, EditorialSection } from "@/components/editorial";
import { Breadcrumbs, SectionHeader } from "@/components/ui";
import s from "./product.module.css";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Товар не найден" };
  const description = `${p.name} — ${p.short.toLowerCase()}. ${p.composition}. Цена от ${formatPrice(minPrice(p))}. ${p.description.split(". ")[0]}.`;
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
  const fromCollection = sameCollection(p);
  const similar = related(p);

  const details = [
    {
      id: "description",
      title: "Описание",
      content: <p>{p.description}</p>,
    },
    {
      id: "specs",
      title: "Характеристики",
      content: (
        <DetailsTable
          rows={[
            { label: "Категория", value: subcategoryName(p.category, p.subcategory) },
            { label: "Состав", value: p.composition },
            { label: "Материал", value: p.material },
            { label: "Размеры", value: p.sizes.map((x) => x.label).join("; ") },
            { label: "Цвета", value: p.colors.map((c) => COLORS[c].name).join(", ") },
            ...p.features,
            { label: "Артикул", value: p.id.toUpperCase() },
          ]}
        />
      ),
    },
    {
      id: "material",
      title: "Материал",
      content: material ? (
        <div className={s.stack}>
          <p>{material.description}</p>
          <p>
            <strong>Ощущение:</strong> {material.feel}
          </p>
          <Link href={`/materials#${material.slug}`} className="link-underline">
            Подробнее о материале «{material.name}» →
          </Link>
        </div>
      ) : (
        <p>{p.composition}</p>
      ),
    },
    {
      id: "care",
      title: "Уход",
      content: (
        <div className={s.stack}>
          <CareList care={p.care} />
          {material && <p>{material.careText}</p>}
        </div>
      ),
    },
    {
      id: "delivery",
      title: "Доставка и возврат",
      content: (
        <div className={s.stack}>
          <p>Курьером по Москве — 1–2 дня, по России — 2–5 дней. Пункты выдачи и самовывоз из шоурума. Бесплатно при заказе от 10 000 ₽.</p>
          <p>Если изделие не подошло, его можно вернуть или обменять в течение 14 дней — в оригинальной упаковке и без следов использования.</p>
          <Link href="/delivery" className="link-underline">
            Условия доставки и возврата →
          </Link>
        </div>
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
            { label: subcategoryName(p.category, p.subcategory), href: `/catalog/${p.category}?type=${p.subcategory}` },
            { label: p.name },
          ]}
        />
        <div className={s.view}>
          <ProductView product={p} details={details} />
        </div>
      </div>

      {material && (
        <EditorialSection
          tone="ivory"
          eyebrow="Материал"
          title={material.name}
          image={material.image}
          ratio="1 / 1"
          cta={{ label: "Все материалы", href: "/materials" }}
          reverse
        >
          <p>{material.lead}</p>
          <p>{material.feel}</p>
        </EditorialSection>
      )}

      {fromCollection.length > 0 && collection && (
        <section className="section" aria-labelledby="col-title">
          <div className="container">
            <SectionHeader
              id="col-title"
              eyebrow="Из той же коллекции"
              title={`Коллекция «${collection.name}»`}
              action={{ label: "Вся коллекция", href: `/collections/${collection.slug}` }}
            />
            <ProductRail products={fromCollection} label={`Другие товары коллекции «${collection.name}»`} />
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className={`section ${s.similar}`} aria-labelledby="sim-title">
          <div className="container">
            <SectionHeader id="sim-title" title="Похожие товары" action={{ label: categoryName(p.category), href: `/catalog/${p.category}` }} />
            <ProductRail products={similar} label="Похожие товары" />
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
