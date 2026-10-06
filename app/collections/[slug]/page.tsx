import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COLLECTIONS, getCollection } from "@/lib/data/collections";
import { PHOTOS, textileImage } from "@/lib/data/images";
import { MATERIALS } from "@/lib/data/materials";
import { byCollection } from "@/lib/catalog";
import { countLabel, PRODUCT_FORMS } from "@/lib/format";
import type { ImageAsset } from "@/lib/types";
import { Button } from "@/components/Button";
import { Media } from "@/components/Media";
import { ProductGrid } from "@/components/ProductGrid";
import { Palette } from "@/components/editorial";
import { Breadcrumbs } from "@/components/ui";
import s from "./campaign.module.css";

/** Настроение кампании: три кадра разного масштаба и деталь */
const MOOD: Record<string, { images: [ImageAsset, ImageAsset, ImageAsset]; detail: ImageAsset; detailText: string; material: string }> = {
  "s-kruzhevom": {
    images: [PHOTOS.diningTable, PHOTOS.cropLaceBed, PHOTOS.bedroomTall],
    detail: PHOTOS.cropLaceTable,
    detailText: "Тонкая хлопковая кайма проходит по краю скатерти, одеяла и наволочек — одна линия на всю коллекцию.",
    material: "satin",
  },
  "slonovaya-kost": {
    images: [PHOTOS.bedroomQuilt, PHOTOS.cropPillows, PHOTOS.bedroomWide],
    detail: PHOTOS.cropQuilt,
    detailText: "Объёмная стёжка «волна» повторяет линию фирменного знака и мягко держит форму покрывала.",
    material: "satin",
  },
  "teply-len": {
    images: [PHOTOS.diningVertical, textileImage("linen", "sand", "close"), textileImage("linen", "taupe", "swatch")],
    detail: textileImage("linen", "beige", "close"),
    detailText: "Матовая фактура стираного льна и естественные складки — то, ради чего выбирают лён.",
    material: "linen",
  },
  volna: {
    images: [textileImage("terry", "emerald", "swatch"), textileImage("waffle", "white", "close"), textileImage("terry", "milk", "swatch")],
    detail: PHOTOS.packaging,
    detailText: "Комплекты собраны в многоразовый тёмно-зелёный мешок на шнурке — готовый подарок без обёрточной бумаги.",
    material: "terry",
  },
  "lesnoy-vecher": {
    images: [PHOTOS.knitThrow, textileImage("herringbone", "emerald", "swatch"), PHOTOS.cropKnit],
    detail: PHOTOS.cropKnit,
    detailText: "Рельеф кос и плетение «ёлочка» — фактуры, которые лучше всего видны в мягком вечернем свете.",
    material: "knit",
  },
};

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
  const mood = MOOD[c.slug];
  const material = MATERIALS.find((m) => m.slug === mood.material)!;
  const index = COLLECTIONS.findIndex((x) => x.slug === c.slug) + 1;
  const others = COLLECTIONS.filter((x) => x.slug !== c.slug);

  return (
    <>
      {/* Hero кампании */}
      <section className={s.hero} aria-labelledby="col-title">
        <div className={s.heroMedia}>
          <Media image={c.image} fill priority sizes="100vw" />
        </div>
        <div className={`container ${s.heroText}`}>
          <Breadcrumbs items={[{ label: "Коллекции", href: "/collections" }, { label: `«${c.name}»` }]} />
          <div className={s.heroBody}>
            <p className={s.heroLabel}>
              <span className="t-index">Коллекция {String(index).padStart(2, "0")}</span>
              <span className="t-eyebrow">{c.season}</span>
            </p>
            <h1 id="col-title" className={`display ${s.heroTitle}`}>
              «{c.name}»
            </h1>
            <p className={s.heroLead}>{c.lead}</p>
          </div>
        </div>
      </section>

      {/* Настроение */}
      <section className={`container ${s.mood}`} aria-label="Настроение коллекции">
        <div className={s.mood0}>
          <Media image={mood.images[0]} ratio="4 / 5" sizes="(max-width: 767px) 100vw, 40vw" />
        </div>
        <p className={`display ${s.moodText}`}>{c.description.split(". ")[0]}.</p>
        <div className={s.mood1}>
          <Media image={mood.images[1]} ratio="1 / 1" sizes="(max-width: 767px) 50vw, 25vw" />
        </div>
        <div className={s.mood2}>
          <Media image={mood.images[2]} ratio="3 / 4" sizes="(max-width: 767px) 50vw, 25vw" />
        </div>
      </section>

      {/* Материал */}
      <section className={s.material} aria-labelledby="col-mat">
        <div className={`container ${s.materialInner}`}>
          <div className={s.materialText}>
            <span className="t-index">Материал</span>
            <h2 id="col-mat" className="t-h1">
              {c.materials.join(", ")}
            </h2>
            <p>{material.lead} {material.feel}</p>
            <Palette colors={c.palette} />
            <Link href={`/materials#${material.slug}`} className={s.textLink}>
              О материале
            </Link>
          </div>
          <div className={s.materialMedia}>
            <Media image={material.image} ratio="4 / 5" sizes="(max-width: 1023px) 100vw, 45vw" />
          </div>
        </div>
      </section>

      {/* Предметы */}
      <section id="tovary" className={`container ${s.products}`} aria-labelledby="col-products">
        <header className={s.productsHead}>
          <h2 id="col-products" className="t-h2">
            Предметы коллекции
          </h2>
          <span className="t-eyebrow">{countLabel(products.length, PRODUCT_FORMS)}</span>
        </header>
        <ProductGrid products={products} columns={3} />
      </section>

      {/* Деталь */}
      <section className={`container ${s.detail}`} aria-labelledby="col-detail">
        <div className={s.detailMedia}>
          <Media image={mood.detail} ratio="16 / 10" sizes="(max-width: 1023px) 100vw, 60vw" />
        </div>
        <div className={s.detailText}>
          <span className="t-index">Деталь</span>
          <h2 id="col-detail" className="t-h2">
            То, что замечаешь не сразу
          </h2>
          <p>{mood.detailText}</p>
        </div>
      </section>

      {/* История */}
      <section className={`container ${s.story}`} aria-label="История коллекции">
        <p className={`display ${s.storyText}`}>{c.description}</p>
        <Button href="/catalog" variant="secondary">
          Весь каталог
        </Button>
      </section>

      {/* Другие коллекции */}
      <section className={`container ${s.others}`} aria-labelledby="col-others">
        <h2 id="col-others" className="t-eyebrow">
          Другие коллекции
        </h2>
        <ul className={s.othersList}>
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/collections/${o.slug}`} className={s.otherRow}>
                <span className={s.otherName}>«{o.name}»</span>
                <span className={s.otherLead}>{o.lead}</span>
                <span className="t-eyebrow">{o.season}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
