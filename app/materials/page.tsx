import type { Metadata } from "next";
import { MATERIALS } from "@/lib/data/materials";
import { byMaterial } from "@/lib/catalog";
import { countLabel, PRODUCT_FORMS } from "@/lib/format";
import { Media } from "@/components/Media";
import { ProductRail } from "@/components/ProductGrid";
import { CareList, PageHeader } from "@/components/editorial";
import s from "./materials.module.css";

export const metadata: Metadata = {
  title: "Материалы",
  description:
    "Материалы Emerald Textile: хлопок, лён, махра, вафельное полотно, сатин и полисатин, крэп-жатка, вязаное полотно. Свойства, ощущения и уход.",
  alternates: { canonical: "/materials" },
};

export default function MaterialsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Материалы" }]}
        eyebrow={`${MATERIALS.length} материалов`}
        title="Материалы"
        size="display"
        lead="Ткань — главный герой каждого изделия. Здесь — из чего мы шьём, как это ощущается и как сделать так, чтобы вещь служила годами."
      >
        <nav aria-label="Материалы на странице" className={s.index}>
          <ul>
            {MATERIALS.map((m, i) => (
              <li key={m.slug}>
                <a href={`#${m.slug}`} className={s.indexLink}>
                  <span className={s.indexNum}>{String(i + 1).padStart(2, "0")}</span>
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      {MATERIALS.map((m, i) => {
        const products = byMaterial(m.slug);
        return (
          <section key={m.slug} id={m.slug} className={`${s.material} ${i % 2 ? s.alt : ""}`} aria-labelledby={`m-${m.slug}`}>
            <div className={`container ${s.grid}`}>
              <div className={s.media}>
                <Media image={m.image} ratio="4 / 5" sizes="(max-width: 1023px) 100vw, 42vw" priority={i === 0} />
              </div>
              <div className={s.body}>
                <p className={s.num}>{String(i + 1).padStart(2, "0")}</p>
                <h2 id={`m-${m.slug}`} className="t-h1">
                  {m.name}
                </h2>
                <p className="t-h3">{m.lead}</p>
                <p className="t-body-l t-strong">{m.description}</p>
                <blockquote className={s.feel}>
                  <span className="t-label">Ощущение</span>
                  <p>{m.feel}</p>
                </blockquote>
                <dl className={s.props}>
                  {m.properties.map((p) => (
                    <div key={p.label}>
                      <dt>{p.label}</dt>
                      <dd>{p.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className={s.care}>
                  <p className="t-label">Уход</p>
                  <CareList care={m.care} />
                  <p className="t-body-s t-strong">{m.careText}</p>
                </div>
              </div>
            </div>
            {products.length > 0 && (
              <div className={`container ${s.products}`}>
                <div className={s.productsHead}>
                  <h3 className="t-h3">Изделия: {m.name.toLowerCase()}</h3>
                  <span className="t-label">{countLabel(products.length, PRODUCT_FORMS)}</span>
                </div>
                <ProductRail products={products.slice(0, 4)} label={`Изделия из материала «${m.name}»`} />
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
