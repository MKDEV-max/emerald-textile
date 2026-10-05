import Link from "next/link";
import { COLLECTIONS } from "@/lib/data/collections";
import { ARTICLES } from "@/lib/data/journal";
import { getProduct } from "@/lib/data/products";
import { PHOTOS, textileImage } from "@/lib/data/images";
import { byCollection, minPrice, newArrivals } from "@/lib/catalog";
import { countLabel, formatDate, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { Media } from "@/components/Media";
import { MaterialAtlas, type AtlasItem } from "@/components/MaterialAtlas";
import { ProductCard } from "@/components/ProductCard";
import { ProductRail } from "@/components/ProductGrid";
import { Wave } from "@/components/ui";
import s from "./home.module.css";

const ATLAS: AtlasItem[] = [
  {
    name: "Сатин",
    feel: "Гладкий и прохладный, с мягким блеском в боковом свете.",
    facts: ["Полисатин и хлопковый сатин", "Постельное бельё"],
    href: "/materials#satin",
    image: PHOTOS.cropBedLinen,
    detail: textileImage("satin", "white", "swatch"),
  },
  {
    name: "Стёжка",
    feel: "Объём, который держит форму волны — та же линия, что на нашем знаке.",
    facts: ["Одеяла и покрывала", "Стёжка «волна»"],
    href: "/materials#satin",
    image: PHOTOS.cropQuilt,
    detail: textileImage("quilt", "milk", "swatch"),
  },
  {
    name: "Вязка",
    feel: "Упругая, тёплая, с рельефом кос, который хочется проследить пальцами.",
    facts: ["Хлопок с шерстью", "Пледы и наволочки"],
    href: "/materials#knit",
    image: PHOTOS.cropKnit,
    detail: textileImage("knit", "walnut", "swatch"),
  },
  {
    name: "Лён",
    feel: "Сухой и чуть шероховатый, с естественными складками.",
    facts: ["Стираный лён", "Бельё, скатерти, салфетки"],
    href: "/materials#linen",
    image: textileImage("linen", "sand", "swatch"),
    detail: textileImage("linen", "sand", "close"),
  },
  {
    name: "Махра",
    feel: "Пышная петля с весом — тёплое прикосновение после воды.",
    facts: ["Хлопковая махра", "Полотенца, халаты, коврики"],
    href: "/materials#terry",
    image: textileImage("terry", "milk", "swatch"),
    detail: textileImage("terry", "milk", "close"),
  },
  {
    name: "Вафля",
    feel: "Лёгкая рельефная ячейка — для бани, кухни и тёплого сезона.",
    facts: ["Вафельное полотно", "Полотенца и халаты"],
    href: "/materials#waffle",
    image: textileImage("waffle", "white", "swatch"),
    detail: textileImage("waffle", "white", "close"),
  },
];

const pick = (slugs: string[]) => slugs.map(getProduct).filter(Boolean) as Product[];

export default function HomePage() {
  const feature = COLLECTIONS[0];
  const seasonLead = getProduct("odeyalo-s-kruzhevom")!;
  const season = pick(["skatert-s-kruzhevom", "vyazaniy-pled-s-kosami"]);
  const others = COLLECTIONS.slice(1);
  const articles = ARTICLES.slice(0, 3);

  return (
    <>
      {/* 01 — HERO: типографика наслаивается на фотографию */}
      <section className={s.hero} aria-labelledby="hero-title">
        <div className={s.heroMedia}>
          <Media image={PHOTOS.bedroomTall} fill priority sizes="(max-width: 1023px) 100vw, 60vw" position="58% 62%" />
        </div>
        <div className={`container-wide ${s.heroGrid}`}>
          <p className={s.heroIndex}>
            <span className="t-index">01</span>
            <span className="t-eyebrow">Новая коллекция · Осень 2026</span>
          </p>
          <h1 id="hero-title" className={s.heroTitle}>
            <span>Текстиль,</span>
            <span className={s.heroIndent}>который создаёт</span>
            <span>ощущение</span>
            <span className={s.heroIndent2}>дома</span>
          </h1>
          <div className={s.heroFoot}>
            <p className={s.heroLead}>
              Натуральные материалы, выразительная фактура и вещи, к которым хочется возвращаться каждый день.
            </p>
            <div className={s.heroCtas}>
              <Button href={`/collections/${feature.slug}`}>Смотреть коллекцию</Button>
              <Button href="/catalog" variant="link" arrow={false}>
                Каталог
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — ТИПОГРАФСКАЯ ПАУЗА */}
      <section className={`container ${s.pause}`} aria-label="Философия">
        <p className={s.pauseIndex}>
          <span className="t-index">02</span>
          <span className="t-eyebrow">Emerald Textile</span>
        </p>
        <p className={`display ${s.pauseText}`}>
          Мягкость приходит из ткани и дневного света, а не из лишних деталей.
        </p>
        <Link href="/about" className={s.pauseLink}>
          О бренде →
        </Link>
      </section>

      {/* 03 — FULL-BLEED */}
      <figure className={s.bleed}>
        <Media image={PHOTOS.bedroomWide} ratio="21 / 9" sizes="100vw" position="50% 55%" />
        <figcaption className={`container ${s.bleedCaption}`}>
          <span className="t-index">03</span>
          <span>Спальня в тонах слоновой кости — сатин, стёжка и тёплый свет из окна.</span>
          <Link href="/collections/slonovaya-kost" className={s.bleedLink}>
            Коллекция «Слоновая кость» →
          </Link>
        </figcaption>
      </figure>

      {/* 04 — ВЫБОР СЕЗОНА: ступенчатая композиция */}
      <section className={`container ${s.season}`} aria-labelledby="season-title">
        <header className={s.seasonHead}>
          <span className="t-index">04</span>
          <h2 id="season-title" className="t-h1">
            Выбор сезона
          </h2>
        </header>
        <div className={s.seasonGrid}>
          <article className={`${s.seasonLead} card-hover`}>
            <Link href={`/product/${seasonLead.slug}`} className={s.seasonLeadLink}>
              <Media image={PHOTOS.bedroomLace} ratio="4 / 5" zoom sizes="(max-width: 1023px) 100vw, 45vw" />
              <span className={s.seasonLeadText}>
                <span className="t-eyebrow">Полисатин · кружево</span>
                <span className="t-h3">{seasonLead.name}</span>
                <span className={s.seasonPrice}>{formatPrice(minPrice(seasonLead))}</span>
              </span>
            </Link>
          </article>
          {season.map((p, i) => (
            <div key={p.slug} className={`${s.seasonItem} ${i === 1 ? s.seasonItemLow : ""}`}>
              <ProductCard product={p} ratio="3 / 4" sizes="(max-width: 1023px) 50vw, 22vw" />
            </div>
          ))}
        </div>
      </section>

      {/* 05 — АТЛАС МАТЕРИАЛОВ */}
      <section className={s.atlasSection} aria-labelledby="atlas-title">
        <div className="container">
          <header className={s.atlasHead}>
            <span className="t-index">05</span>
            <h2 id="atlas-title" className="t-h1">
              Почувствуйте ткань
              <br />
              до прикосновения
            </h2>
            <p className={s.atlasLead}>
              Каждый материал — свой характер. Наведите на название, чтобы увидеть фактуру.
            </p>
          </header>
          <MaterialAtlas items={ATLAS} />
        </div>
      </section>

      {/* 06 — EDITORIAL STORY */}
      <section className={`container ${s.story}`} aria-labelledby="story-title">
        <div className={s.storyMedia}>
          <Media image={PHOTOS.diningTable} ratio="4 / 5" sizes="(max-width: 1023px) 100vw, 55vw" />
        </div>
        <div className={s.storyText}>
          <span className="t-index">06</span>
          <p className="t-eyebrow">О бренде</p>
          <h2 id="story-title" className="t-h1">
            Текстиль, который живёт с вами годами
          </h2>
          <p className={s.storyBody}>
            Мы выбираем дышащие ткани, аккуратную стёжку и тонкое кружево. Каждое изделие упаковано в многоразовый мешок Emerald Textile —
            его удобно оставить для хранения.
          </p>
          <Button href="/about" variant="link" arrow={false}>
            Читать о бренде
          </Button>
          <div className={s.storyDetail}>
            <Media image={PHOTOS.cropLaceTable} ratio="16 / 9" sizes="(max-width: 1023px) 60vw, 25vw" />
            <p className="t-caption t-muted">Скатерть с кружевом · хлопок-дак</p>
          </div>
        </div>
      </section>

      {/* 07 — НОВИНКИ */}
      <section className={`container ${s.news}`} aria-labelledby="new-title">
        <header className={s.rowHead}>
          <span className="t-index">07</span>
          <h2 id="new-title" className="t-h2">
            Новинки
          </h2>
          <Link href="/catalog?sort=new" className={s.rowLink}>
            Все новинки →
          </Link>
        </header>
        <ProductRail products={newArrivals().slice(0, 4)} label="Новинки" />
      </section>

      {/* 08 — BRAND STATEMENT: Forest + тональная волна */}
      <section className={`${s.statement} on-dark`} aria-label="Манифест бренда">
        <div className={`container ${s.statementInner}`}>
          <Logo variant="monogram" tone="cream" height={44} />
          <p className={`display ${s.statementText}`}>
            Тёплый натуральный дом
            <br />и уверенный изумрудный знак
          </p>
          <p className={s.statementSub}>Натуральный · Тёплый · Мастерский · Уверенный · Текучий</p>
        </div>
        <Wave tone="tonal" className={s.statementWave} />
      </section>

      {/* 09 — КОЛЛЕКЦИЯ */}
      <section className={s.collection} aria-labelledby="col-title">
        <div className={s.collectionMedia}>
          <Media image={PHOTOS.cropLaceBed} fill sizes="(max-width: 1023px) 100vw, 58vw" position="50% 50%" />
        </div>
        <div className={s.collectionText}>
          <span className="t-index">09</span>
          <p className="t-eyebrow">{feature.season}</p>
          <h2 id="col-title" className="t-h1">
            Коллекция «{feature.name}»
          </h2>
          <p className={s.collectionBody}>{feature.description}</p>
          <p className={s.collectionMeta}>
            {feature.materials.join(" · ")} — {countLabel(byCollection(feature.slug).length, ["предмет", "предмета", "предметов"])}
          </p>
          <Button href={`/collections/${feature.slug}`}>Смотреть коллекцию</Button>
          <ul className={s.collectionList}>
            {others.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className={s.collectionRow}>
                  <span className={s.collectionName}>«{c.name}»</span>
                  <span className={s.collectionSeason}>{c.season}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 10 — ЖУРНАЛ */}
      <section className={`container ${s.journal}`} aria-labelledby="journal-title">
        <header className={s.rowHead}>
          <span className="t-index">10</span>
          <h2 id="journal-title" className="t-h2">
            Журнал
          </h2>
          <Link href="/journal" className={s.rowLink}>
            Все статьи →
          </Link>
        </header>
        <ul className={s.journalList}>
          {articles.map((a) => (
            <li key={a.slug}>
              <Link href={`/journal/${a.slug}`} className={s.journalRow}>
                <span className={s.journalMeta}>
                  {a.category} · <time dateTime={a.date}>{formatDate(a.date)}</time>
                </span>
                <span className={s.journalTitle}>{a.title}</span>
                <span className={s.journalLead}>{a.lead}</span>
                <span className={s.journalThumb}>
                  <Media image={a.image} ratio="4 / 3" sizes="200px" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
