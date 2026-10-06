import Link from "next/link";
import { COLLECTIONS } from "@/lib/data/collections";
import { ARTICLES } from "@/lib/data/journal";
import { getProduct } from "@/lib/data/products";
import { PHOTOS, textileImage, textureImage } from "@/lib/data/images";
import { byCategory, newArrivals } from "@/lib/catalog";
import { countLabel, formatDate, PRODUCT_FORMS } from "@/lib/format";
import type { CategorySlug, ImageAsset, Product } from "@/lib/types";
import { Button } from "@/components/Button";
import { Media } from "@/components/Media";
import { MaterialAtlas, type AtlasItem } from "@/components/MaterialAtlas";
import { ProductCard } from "@/components/ProductCard";
import { ProductRail } from "@/components/ProductGrid";
import { Palette } from "@/components/editorial";
import { Wave } from "@/components/ui";
import s from "./home.module.css";

/* Пространства дома — каждое со своим временем суток и настроением */
const SPACES: { slug: CategorySlug; name: string; time: string; mood: string; image: ImageAsset; ratio: string; position?: string }[] = [
  {
    slug: "bathroom",
    name: "Ванная комната",
    time: "Утро",
    mood: "Вода, махра, камень и первый свет",
    image: textureImage("terry-milk", "Махровое полотенце молочного цвета крупным планом"),
    ratio: "3 / 4",
  },
  {
    slug: "dining",
    name: "Столовая",
    time: "День",
    mood: "Дерево, лён и неторопливая сервировка",
    image: PHOTOS.diningVertical,
    ratio: "2 / 3",
  },
  {
    slug: "living",
    name: "Гостиная",
    time: "Вечер",
    mood: "Плед, диван и мягкий вечерний свет",
    image: PHOTOS.cropKnit,
    ratio: "1 / 1",
  },
  {
    slug: "bedroom",
    name: "Спальня",
    time: "Ночь",
    mood: "Хлопок, кружево и тишина",
    image: PHOTOS.bedroomStory,
    ratio: "4 / 5",
    position: "50% 70%",
  },
];

const ATLAS: AtlasItem[] = [
  {
    name: "Сатин",
    feel: "Гладкий и прохладный, с мягким блеском в боковом свете.",
    facts: ["Полисатин и хлопковый сатин", "Постельное бельё"],
    href: "/materials#satin",
    image: PHOTOS.cropBedLinen,
    detail: textileImage("satin", "white", "swatch"),
    tone: "#f4f1e8",
  },
  {
    name: "Стёжка",
    feel: "Объём, который держит линию волны — ту же, что в фирменном знаке.",
    facts: ["Одеяла и покрывала", "Стёжка «волна»"],
    href: "/materials#satin",
    image: PHOTOS.cropQuilt,
    detail: textileImage("quilt", "milk", "swatch"),
    tone: "#eef0ea",
  },
  {
    name: "Вязка",
    feel: "Упругая и тёплая, с рельефом кос, который хочется проследить пальцами.",
    facts: ["Хлопок с шерстью", "Пледы и наволочки"],
    href: "/materials#knit",
    image: PHOTOS.cropKnit,
    detail: textileImage("knit", "walnut", "swatch"),
    tone: "#efe8df",
  },
  {
    name: "Кружево",
    feel: "Тонкая кайма по краю — деталь, которую замечаешь не сразу.",
    facts: ["Хлопковое кружево", "Скатерти и одеяла"],
    href: "/collections/s-kruzhevom",
    image: PHOTOS.cropLaceTable,
    detail: PHOTOS.cropLaceBed,
    tone: "#f3efe6",
  },
  {
    name: "Лён",
    feel: "Сухой и чуть шероховатый, с естественными складками.",
    facts: ["Стираный лён", "Бельё, скатерти, салфетки"],
    href: "/materials#linen",
    image: textileImage("linen", "sand", "swatch"),
    detail: textileImage("linen", "sand", "close"),
    tone: "#efe9de",
  },
];

const pick = (slugs: string[]) => slugs.map(getProduct).filter(Boolean) as Product[];

export default function HomePage() {
  const feature = COLLECTIONS[0];
  const curated = pick(["skatert-s-kruzhevom", "vyazaniy-pled-s-kosami", "satinovye-navolochki", "lyogkoe-odeyalo"]);
  const [lead, ...more] = ARTICLES.slice(0, 3);

  return (
    <>
      {/* 01 — ВСТУПЛЕНИЕ: воздух, метка, крупная капитель */}
      <section className={s.intro} aria-labelledby="hero-title">
        <div className={`container ${s.introGrid}`}>
          <p className={s.introLabel}>
            <span className="t-index">Коллекция 01</span>
            <span className="t-eyebrow">«С кружевом» · Осень 2026</span>
          </p>
          <h1 id="hero-title" className={s.introTitle}>
            <span>Текстиль, который</span>
            <span className={s.introShift}>создаёт ощущение</span>
            <span className={s.introLast}>дома</span>
          </h1>
          <div className={s.introSide}>
            <p>Хлопок, лён и кружево — для дома, в котором хочется оставаться.</p>
            <Button href={`/collections/${feature.slug}`}>Смотреть коллекцию</Button>
          </div>
        </div>
        {/* Волна — переход от типографики к фотографии */}
        <Wave tone="emerald" className={s.introWave} />
      </section>

      {/* 02 — HERO: большой образ с нестандартным кадром */}
      <figure className={s.hero}>
        <div className={s.heroImage}>
          <Media image={PHOTOS.bedroomTall} fill priority sizes="100vw" position="50% 66%" />
        </div>
        <figcaption className={`container ${s.heroCaption}`}>
          <span className="t-index">02</span>
          <span>Одеяло с кружевом, полисатин. Тёплый дневной свет, хлопок, дерево.</span>
          <Link href="/catalog" className={s.textLink}>
            Весь каталог
          </Link>
        </figcaption>
      </figure>

      {/* 03 — ПРОСТРАНСТВА: утро, день, вечер, ночь */}
      <section className={`container ${s.spaces}`} aria-labelledby="spaces-title">
        <header className={s.sectionHead}>
          <span className="t-index">03</span>
          <h2 id="spaces-title" className="t-h2">
            Четыре пространства, четыре времени дня
          </h2>
        </header>
        <ul className={s.spacesList}>
          {SPACES.map((sp, i) => (
            <li key={sp.slug} className={`${s.space} ${s[`space${i}`]}`}>
              <Link href={`/catalog/${sp.slug}`} className={`${s.spaceLink} card-hover`}>
                <Media image={sp.image} ratio="3 / 4" zoom sizes="(max-width: 767px) 100vw, 25vw" position={sp.position} />
                <span className={s.spaceTime}>{sp.time}</span>
                <span className={s.spaceName}>{sp.name}</span>
                <span className={s.spaceMood}>{sp.mood}</span>
                <span className={s.spaceCount}>{countLabel(byCategory(sp.slug).length, PRODUCT_FORMS)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 04 — МАНИФЕСТ: короткая пауза */}
      <section className={s.manifesto} aria-label="Манифест">
        <p className={`display ${s.manifestoText}`}>Главный герой — ткань</p>
        <p className={s.manifestoNote}>Ни людей, ни лишних деталей: свет, складки и фактура.</p>
      </section>

      {/* 05 — ПОДБОРКА */}
      <section className={`container ${s.curated}`} aria-labelledby="curated-title">
        <header className={s.sectionHead}>
          <span className="t-index">05</span>
          <h2 id="curated-title" className="t-h2">
            Выбор сезона
          </h2>
          <Link href="/catalog" className={s.headLink}>
            Каталог
          </Link>
        </header>
        <ul className={s.curatedGrid}>
          {curated.map((p, i) => (
            <li key={p.slug} className={s[`cur${i}`]}>
              <ProductCard product={p} ratio="3 / 4" sizes="(max-width: 767px) 50vw, 25vw" />
            </li>
          ))}
        </ul>
      </section>

      {/* 06 — МАТЕРИАЛ: огромная фактура */}
      <section className={s.material} aria-labelledby="atlas-title">
        <div className="container">
          <header className={s.sectionHead}>
            <span className="t-index">06</span>
            <h2 id="atlas-title" className="t-h2">
              Почувствуйте ткань до прикосновения
            </h2>
          </header>
          <MaterialAtlas items={ATLAS} />
        </div>
      </section>

      {/* 07 — КОЛЛЕКЦИЯ: разворот как в печатном каталоге */}
      <section className={s.spread} aria-labelledby="col-title">
        <div className={s.spreadLeft}>
          <Media image={PHOTOS.bedroomLace} fill sizes="(max-width: 1023px) 100vw, 50vw" position="50% 60%" />
        </div>
        <div className={s.spreadRight}>
          <span className="t-index">07</span>
          <p className="t-eyebrow">Спальня · Столовая · {feature.season}</p>
          <h2 id="col-title" className={`display ${s.spreadTitle}`}>
            Коллекция
            <br />«{feature.name}»
          </h2>
          <p className={s.spreadText}>{feature.description}</p>
          <Palette colors={feature.palette} />
          <div className={s.spreadDetail}>
            <Media image={PHOTOS.cropLaceTable} ratio="16 / 9" sizes="(max-width: 1023px) 100vw, 30vw" />
          </div>
          <Button href={`/collections/${feature.slug}`} variant="secondary">
            Смотреть коллекцию
          </Button>
        </div>
      </section>

      {/* 08 — МАСТЕРСТВО: шов, кружево, упаковка (как упаковка бренда — Forest и волна) */}
      <section className={`${s.craft} on-dark`} aria-labelledby="craft-title">
        <div className={`container ${s.craftGrid}`}>
          <header className={s.craftHead}>
            <span className="t-index" style={{ color: "var(--color-cream)", opacity: 0.7 }}>
              08
            </span>
            <h2 id="craft-title" className={`display ${s.craftTitle}`}>
              Детали, которые замечаешь не сразу
            </h2>
          </header>
          <figure className={s.craft0}>
            <Media image={PHOTOS.cropQuilt} ratio="4 / 3" sizes="(max-width: 767px) 100vw, 50vw" />
            <figcaption>
              <span>Стёжка</span> Линия волны — как на фирменном знаке
            </figcaption>
          </figure>
          <figure className={s.craft1}>
            <Media image={PHOTOS.cropLaceBed} ratio="2 / 3" sizes="(max-width: 767px) 100vw, 25vw" />
            <figcaption>
              <span>Кайма</span> Тонкое хлопковое кружево по краю
            </figcaption>
          </figure>
          <figure className={s.craft2}>
            <Media image={PHOTOS.packaging} ratio="2 / 3" sizes="(max-width: 767px) 100vw, 25vw" />
            <figcaption>
              <span>Упаковка</span> Многоразовый мешок на шнурке
            </figcaption>
          </figure>
        </div>
        <Wave tone="tonal" className={s.craftWave} />
      </section>

      {/* 09 — НОВИНКИ */}
      <section className={`container ${s.news}`} aria-labelledby="new-title">
        <header className={s.sectionHead}>
          <span className="t-index">09</span>
          <h2 id="new-title" className="t-h2">
            Новинки
          </h2>
          <Link href="/catalog?sort=new" className={s.headLink}>
            Все новинки
          </Link>
        </header>
        <ProductRail products={newArrivals().slice(0, 4)} label="Новинки" />
      </section>

      {/* 10 — ИСТОРИЯ БРЕНДА */}
      <section className={`container ${s.story}`} aria-labelledby="story-title">
        <div className={s.storyText}>
          <span className="t-index">10</span>
          <h2 id="story-title" className="t-h2">
            Тёплый натуральный дом и&nbsp;уверенный изумрудный знак
          </h2>
          <p>
            Emerald Textile держится на контрасте: мягкие бежевые интерьеры с дневным светом — и строгий изумрудный знак с гравюрной
            волной.
          </p>
          <Link href="/about" className={s.textLink}>
            О бренде
          </Link>
        </div>
        <div className={s.storyMedia}>
          <Media image={PHOTOS.bedroomWide} ratio="3 / 2" sizes="(max-width: 1023px) 100vw, 55vw" />
        </div>
      </section>

      {/* 11 — ЖУРНАЛ */}
      <section className={`container ${s.journal}`} aria-labelledby="journal-title">
        <header className={s.sectionHead}>
          <span className="t-index">11</span>
          <h2 id="journal-title" className="t-h2">
            Журнал
          </h2>
          <Link href="/journal" className={s.headLink}>
            Все статьи
          </Link>
        </header>
        <div className={s.journalGrid}>
          <Link href={`/journal/${lead.slug}`} className={`${s.journalLead} card-hover`}>
            <Media image={lead.image} ratio="4 / 3" zoom sizes="(max-width: 1023px) 100vw, 55vw" />
            <span className={s.journalMeta}>
              {lead.category} · <time dateTime={lead.date}>{formatDate(lead.date)}</time> · {lead.readTime} мин
            </span>
            <span className={`t-h2 ${s.journalTitle}`}>{lead.title}</span>
            <span className={s.journalText}>{lead.lead}</span>
          </Link>
          <ul className={s.journalSide}>
            {more.map((a) => (
              <li key={a.slug}>
                <Link href={`/journal/${a.slug}`} className={`${s.journalItem} card-hover`}>
                  <Media image={a.image} ratio="3 / 2" zoom sizes="(max-width: 1023px) 100vw, 30vw" />
                  <span className={s.journalMeta}>
                    {a.category} · {a.readTime} мин
                  </span>
                  <span className={`t-h3 ${s.journalTitle}`}>{a.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
