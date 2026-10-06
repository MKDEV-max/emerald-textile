import type { Metadata } from "next";
import { COLLECTIONS } from "@/lib/data/collections";
import { byCollection } from "@/lib/catalog";
import { countLabel, PRODUCT_FORMS } from "@/lib/format";
import { Button } from "@/components/Button";
import { Media } from "@/components/Media";
import { ProductRail } from "@/components/ProductGrid";
import { PageHeader, Palette } from "@/components/editorial";
import { Tag } from "@/components/ui";
import s from "./collections.module.css";

export const metadata: Metadata = {
  title: "Коллекции",
  description:
    "Коллекции Emerald Textile: «С кружевом», «Слоновая кость», «Тёплый лён», «Волна» и «Лесной вечер». Материалы, палитры и предметы каждой коллекции.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Коллекции" }]}
        eyebrow={`${COLLECTIONS.length} коллекций`}
        title="Коллекции"
        lead="Каждая коллекция — это материал, палитра и настроение. Предметы внутри неё сочетаются между собой, поэтому дом собирается в одно спокойное целое."
      />

      {COLLECTIONS.map((c, i) => {
        const products = byCollection(c.slug);
        return (
          <section key={c.slug} className={`${s.block} ${i % 2 ? s.alt : ""}`} aria-labelledby={`c-${c.slug}`}>
            <div className={`container ${s.grid}`}>
              <div className={s.media}>
                <Media image={c.image} ratio="4 / 5" sizes="(max-width: 1023px) 100vw, 50vw" priority={i === 0} />
              </div>
              <div className={s.text}>
                <span className={s.index}>{String(i + 1).padStart(2, "0")}</span>
                <div className={s.tags}>
                  <Tag tone={i === 0 ? "solid" : "outline"}>{c.season}</Tag>
                  <Tag tone="muted">{countLabel(products.length, PRODUCT_FORMS)}</Tag>
                </div>
                <h2 id={`c-${c.slug}`} className="t-h1">
                  «{c.name}»
                </h2>
                <p className="t-body-l t-strong">{c.description}</p>
                <dl className={s.specs}>
                  <div>
                    <dt className="t-label">Материалы</dt>
                    <dd>{c.materials.join(" · ")}</dd>
                  </div>
                  <div>
                    <dt className="t-label">Палитра</dt>
                    <dd>
                      <Palette colors={c.palette} />
                    </dd>
                  </div>
                </dl>
                <div>
                  <Button href={`/collections/${c.slug}`}>Смотреть коллекцию</Button>
                </div>
              </div>
            </div>
            <div className={`container ${s.products}`}>
              <ProductRail products={products.slice(0, 4)} label={`Товары коллекции «${c.name}»`} />
            </div>
          </section>
        );
      })}
    </>
  );
}
