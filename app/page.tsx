import Link from "next/link";
import { countLabel } from "@/lib/format";
import { CATEGORIES } from "@/lib/data/categories";
import { COLLECTIONS } from "@/lib/data/collections";
import { MATERIALS } from "@/lib/data/materials";
import { ARTICLES } from "@/lib/data/journal";
import { PHOTOS } from "@/lib/data/images";
import { bestsellers, byCollection, newArrivals } from "@/lib/catalog";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/Button";
import { Media } from "@/components/Media";
import { ProductRail } from "@/components/ProductGrid";
import { SectionHeader, Tag } from "@/components/ui";
import {
  ArticleCard,
  CategoryModules,
  EditorialSection,
  Features,
  MaterialCard,
  NumberedModules,
  Palette,
  ServiceStrip,
} from "@/components/editorial";
import s from "./home.module.css";

export default function HomePage() {
  const feature = COLLECTIONS[0];
  const featureCount = byCollection(feature.slug).length;
  const tactile = ["terry", "waffle", "linen", "satin"].map((slug) => MATERIALS.find((m) => m.slug === slug)!);

  return (
    <>
      {/* 1 · Hero */}
      <Hero
        eyebrow="Новая коллекция · Осень 2026"
        title="Текстиль, который создаёт ощущение дома"
        lead="Натуральные материалы, выразительная фактура и вещи, к которым хочется возвращаться каждый день."
        image={PHOTOS.bedroomTall}
        primary={{ label: "Смотреть коллекцию", href: `/collections/${feature.slug}` }}
        secondary={{ label: "В каталог", href: "/catalog" }}
        imagePosition="50% 60%"
      />
      <CategoryModules categories={CATEGORIES} />

      {/* 2 · Философия */}
      <section className={`section ${s.manifesto}`} aria-labelledby="manifesto-title">
        <div className={`container ${s.manifestoGrid}`}>
          <p className={`t-label ${s.manifestoLabel}`}>Emerald Textile</p>
          <h2 id="manifesto-title" className={`t-display-l ${s.manifestoTitle}`}>
            Тёплый натуральный дом и уверенный изумрудный знак
          </h2>
          <div className={s.manifestoText}>
            <p className="t-body-l">
              Мы делаем постельное бельё, полотенца, скатерти и пледы для дома, в котором хочется оставаться. Мягкость приходит из ткани и
              дневного света, а не из лишних деталей.
            </p>
            <Button href="/about" variant="link">
              О бренде
            </Button>
          </div>
        </div>
        <div className="container">
          <NumberedModules
            items={[
              { caption: "Натуральный", title: "Хлопок и лён", text: "Фактуры, дерево, растения и тёплый дневной свет." },
              { caption: "Тёплый", title: "Сливочные тона", text: "Бежевые интерьеры, мягкие складки, уют." },
              { caption: "Мастерский", title: "Детали шва", text: "Гравюрная волна, кружево, аккуратная стёжка." },
              { caption: "Уверенный", title: "Изумрудный знак", text: "Монограмма ET и плотный глубокий цвет." },
              { caption: "Текучий", title: "Волна", text: "Метафора ткани: движение, мягкость, ритм." },
            ]}
          />
        </div>
      </section>

      {/* 3 · Бестселлеры */}
      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="best-title">
        <div className="container">
          <SectionHeader
            id="best-title"
            eyebrow="Выбор покупателей"
            title="Бестселлеры"
            action={{ label: "Смотреть все", href: "/catalog?sort=popular" }}
          />
          <ProductRail products={bestsellers().slice(0, 4)} label="Бестселлеры" />
        </div>
      </section>

      {/* 4 · Коллекция */}
      <section className={s.feature} aria-labelledby="feature-title">
        <div className={s.featureMedia}>
          <Media image={feature.image} fill sizes="(max-width: 1023px) 100vw, 58vw" />
        </div>
        <div className={s.featurePanel}>
          <div className={s.featureInner}>
            <div className={s.featureTags}>
              <Tag tone="solid">Новинка</Tag>
              <Tag>{feature.season}</Tag>
            </div>
            <h2 id="feature-title" className="t-h1">
              Коллекция «{feature.name}»
            </h2>
            <p className="t-body-l t-strong">{feature.description}</p>
            <dl className={s.featureSpecs}>
              <div>
                <dt className="t-label">Материалы</dt>
                <dd>{feature.materials.join(", ")}</dd>
              </div>
              <div>
                <dt className="t-label">В коллекции</dt>
                <dd>{countLabel(featureCount, ["предмет", "предмета", "предметов"])} для спальни и столовой</dd>
              </div>
            </dl>
            <Palette colors={feature.palette} />
            <div className={s.featureCtas}>
              <Button href={`/collections/${feature.slug}`}>Смотреть коллекцию</Button>
              <Button href="/collections" variant="link">
                Все коллекции
              </Button>
            </div>
          </div>
          <div className={s.featureDetail}>
            <Media image={feature.detail} ratio="4 / 3" frame sizes="(max-width: 1023px) 50vw, 20vw" />
            <p className="t-caption t-muted">Скатерть с кружевом · хлопок, дак</p>
          </div>
        </div>
      </section>

      {/* 5 · Тактильность */}
      <section className="section" aria-labelledby="tactile-title">
        <div className="container">
          <SectionHeader
            id="tactile-title"
            eyebrow="Материалы"
            title="Почувствуйте ткань до прикосновения"
            lead="Махра с пышной петлёй, рельефная вафля, живой лён и гладкий сатин. Каждый материал — свой характер и своё ощущение."
            action={{ label: "Все материалы", href: "/materials" }}
          />
          <ul className={s.tactile}>
            {tactile.map((m) => (
              <li key={m.slug}>
                <MaterialCard material={m} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6 · О бренде */}
      <EditorialSection
        tone="ivory"
        eyebrow="О бренде"
        title="Текстиль, который живёт с вами годами"
        image={PHOTOS.diningTable}
        cta={{ label: "О бренде", href: "/about" }}
        aside={
          <Features
            items={[
              { icon: "weave", title: "Натуральные ткани", text: "Хлопок, полисатин, дак — дышат и не электризуются." },
              { icon: "feather", title: "Лёгкость", text: "Воздушные наполнители для всесезонных одеял." },
              { icon: "cloud", title: "Мягкий уход", text: "Машинная стирка 30°, без отбеливания." },
            ]}
          />
        }
      >
        <p>
          Мы выбираем дышащие ткани, аккуратную стёжку и кружево ручной работы. Каждое изделие стирается перед упаковкой и приходит к вам
          мягким — в многоразовом мешке Emerald Textile.
        </p>
      </EditorialSection>

      {/* 7 · Новинки */}
      <section className="section" aria-labelledby="new-title">
        <div className="container">
          <SectionHeader
            id="new-title"
            eyebrow="Осень 2026"
            title="Новинки"
            action={{ label: "Смотреть все", href: "/catalog?sort=new" }}
          />
          <ProductRail products={newArrivals().slice(0, 4)} label="Новинки" />
        </div>
      </section>

      {/* 8 · Коллекции — короткий список */}
      <section className={`section bg-forest on-dark ${s.collections}`} aria-labelledby="cols-title">
        <div className="container">
          <div className={s.collectionsHead}>
            <h2 id="cols-title" className="t-h1">
              Коллекции
            </h2>
            <Button href="/collections" variant="outline-light">
              Все коллекции
            </Button>
          </div>
          <ul className={s.collectionsList}>
            {COLLECTIONS.map((c, i) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className={s.collectionRow}>
                  <span className={s.collectionIndex}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.collectionName}>«{c.name}»</span>
                  <span className={s.collectionLead}>{c.lead}</span>
                  <span className={s.collectionSeason}>{c.season}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9 · Журнал */}
      <section className="section" aria-labelledby="journal-title">
        <div className="container">
          <SectionHeader
            id="journal-title"
            eyebrow="Журнал"
            title="Об уходе, материалах и доме"
            action={{ label: "Все статьи", href: "/journal" }}
          />
          <ul className={s.journal}>
            {ARTICLES.slice(0, 3).map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 10 · Сервис */}
      <ServiceStrip />
    </>
  );
}
