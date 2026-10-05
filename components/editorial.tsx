import Link from "next/link";
import type { ReactNode } from "react";
import type { Article, Category, Collection, ColorKey, ImageAsset, Material } from "@/lib/types";
import { COLORS } from "@/lib/data/colors";
import { CARE } from "@/lib/data/materials";
import { byCategory, byCollection } from "@/lib/catalog";
import { countLabel, formatDate, PRODUCT_FORMS } from "@/lib/format";
import { Button } from "./Button";
import { CareIcon, Icon, type IconName } from "./Icon";
import { Media } from "./Media";
import { Breadcrumbs, type Crumb } from "./ui";
import s from "./editorial.module.css";

/* ── Модули категорий, разделённые линиями ───────────── */
export function CategoryModules({ categories }: { categories: Category[] }) {
  return (
    <nav aria-label="Категории" className={s.modules}>
      <ul className={s.modulesList}>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link href={`/catalog/${c.slug}`} className={s.module}>
              <span className={s.moduleTitle}>{c.name}</span>
              <span className={s.moduleMeta}>
                {countLabel(byCategory(c.slug).length, PRODUCT_FORMS)}
                <Icon name="arrowRight" size={14} stroke={1.5} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── Карточка категории с изображением ───────────────── */
export function CategoryCard({ category, priority }: { category: Category; priority?: boolean }) {
  return (
    <Link href={`/catalog/${category.slug}`} className={`${s.catCard} card-hover`}>
      <Media image={category.hero} ratio="3 / 4" frame zoom priority={priority} sizes="(max-width: 767px) 50vw, 25vw" />
      <span className={s.catCardText}>
        <span className="t-h4">{category.name}</span>
        <span className={s.moduleMeta}>
          {countLabel(byCategory(category.slug).length, PRODUCT_FORMS)}
          <Icon name="arrowRight" size={14} stroke={1.5} />
        </span>
      </span>
    </Link>
  );
}

/* ── Editorial-секция: фото + заголовок + текст + кнопка ─ */
export function EditorialSection({
  eyebrow,
  title,
  children,
  image,
  cta,
  reverse,
  tone = "white",
  ratio = "4 / 5",
  aside,
  headingLevel = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  image: ImageAsset;
  cta?: { label: string; href: string; variant?: "primary" | "secondary" | "link" };
  reverse?: boolean;
  tone?: "white" | "ivory" | "forest";
  ratio?: string;
  aside?: ReactNode;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  return (
    <section className={`${s.editorial} ${s[`tone_${tone}`]} ${tone === "forest" ? "on-dark" : ""}`}>
      <div className={`container ${s.editorialGrid} ${reverse ? s.reverse : ""}`}>
        <div className={s.editorialMedia}>
          <Media image={image} ratio={ratio} frame={tone !== "forest"} sizes="(max-width: 1023px) 100vw, 50vw" />
        </div>
        <div className={s.editorialText}>
          {eyebrow && <p className="t-label">{eyebrow}</p>}
          <H className="t-h1">{title}</H>
          {children && <div className={s.editorialBody}>{children}</div>}
          {cta && (
            <div>
              <Button
                href={cta.href}
                variant={tone === "forest" ? (cta.variant === "primary" ? "inverse" : "outline-light") : (cta.variant ?? "secondary")}
              >
                {cta.label}
              </Button>
            </div>
          )}
          {aside}
        </div>
      </div>
    </section>
  );
}

/* ── Пиктограммы-преимущества ────────────────────────── */
export function Features({ items, tone = "light" }: { items: { icon: IconName; title: string; text: string }[]; tone?: "light" | "dark" }) {
  return (
    <ul className={`${s.features} ${tone === "dark" ? s.featuresDark : ""}`}>
      {items.map((f) => (
        <li key={f.title} className={s.feature}>
          <Icon name={f.icon} size={32} stroke={1.1} />
          <h3 className={s.featureTitle}>{f.title}</h3>
          <p className={s.featureText}>{f.text}</p>
        </li>
      ))}
    </ul>
  );
}

/* ── Палитра коллекции ───────────────────────────────── */
export function Palette({ colors, size = "m" }: { colors: ColorKey[]; size?: "m" | "l" }) {
  return (
    <ul className={`${s.palette} ${size === "l" ? s.paletteL : ""}`} aria-label="Цветовая палитра">
      {colors.map((c) => (
        <li key={c} className={s.paletteItem}>
          <span className={s.paletteChip} style={{ background: COLORS[c].hex }} aria-hidden="true" />
          <span className={s.paletteName}>{COLORS[c].name}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Карточка коллекции ──────────────────────────────── */
export function CollectionCard({ collection: c }: { collection: Collection }) {
  return (
    <Link href={`/collections/${c.slug}`} className={`${s.colCard} card-hover`}>
      <Media image={c.image} ratio="4 / 5" frame zoom sizes="(max-width: 767px) 100vw, 33vw" />
      <span className={s.colCardText}>
        <span className="t-label">{c.season}</span>
        <span className="t-h3">«{c.name}»</span>
        <span className={s.colCardLead}>{c.lead}</span>
        <span className={s.moduleMeta}>
          {countLabel(byCollection(c.slug).length, PRODUCT_FORMS)}
          <Icon name="arrowRight" size={14} stroke={1.5} />
        </span>
      </span>
    </Link>
  );
}

/* ── Карточка материала ──────────────────────────────── */
export function MaterialCard({ material: m }: { material: Material }) {
  return (
    <Link href={`/materials#${m.slug}`} className={`${s.matCard} card-hover`}>
      <Media image={m.image} ratio="1 / 1" frame zoom sizes="(max-width: 767px) 50vw, 25vw" />
      <span className={s.matCardText}>
        <span className="t-h4">{m.name}</span>
        <span className={s.matCardFeel}>{m.feel}</span>
      </span>
    </Link>
  );
}

/* ── Символы ухода ───────────────────────────────────── */
export function CareList({ care, tone = "light" }: { care: Material["care"]; tone?: "light" | "dark" }) {
  return (
    <ul className={`${s.care} ${tone === "dark" ? s.careDark : ""}`}>
      {care.map((c) => (
        <li key={c} className={s.careItem}>
          <CareIcon care={c} />
          <span>{CARE[c]}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Карточка статьи ─────────────────────────────────── */
export function ArticleCard({ article: a, large, priority }: { article: Article; large?: boolean; priority?: boolean }) {
  return (
    <article className={`${s.article} ${large ? s.articleLarge : ""} card-hover`}>
      <Link href={`/journal/${a.slug}`} className={s.articleLink}>
        <Media image={a.image} ratio={large ? "16 / 10" : "4 / 3"} frame zoom priority={priority} sizes={large ? "(max-width: 1023px) 100vw, 60vw" : "(max-width: 767px) 100vw, 33vw"} />
        <span className={s.articleMeta}>
          <span>{a.category}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={a.date}>{formatDate(a.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{a.readTime} мин чтения</span>
        </span>
        <h3 className={large ? "t-h2" : "t-h3"}>{a.title}</h3>
        <p className={s.articleLead}>{a.lead}</p>
      </Link>
    </article>
  );
}

/* ── Сервисная полоса ────────────────────────────────── */
export const SERVICE_ITEMS: { icon: IconName; title: string; text: string; href: string }[] = [
  { icon: "truck", title: "Доставка по России", text: "1–5 дней, бесплатно от 10 000 ₽", href: "/delivery#dostavka" },
  { icon: "returns", title: "Возврат 14 дней", text: "Если вещь не подошла — вернём деньги", href: "/delivery#vozvrat" },
  { icon: "package", title: "Многоразовый мешок", text: "Каждое изделие упаковано в мешок из хлопка", href: "/about#upakovka" },
  { icon: "card", title: "Удобная оплата", text: "Картой, через СБП или при получении", href: "/delivery#oplata" },
];

export function ServiceStrip() {
  return (
    <section aria-label="Сервис" className={s.service}>
      <ul className={`container ${s.serviceList}`}>
        {SERVICE_ITEMS.map((it) => (
          <li key={it.title}>
            <Link href={it.href} className={s.serviceItem}>
              <Icon name={it.icon} size={28} stroke={1.1} />
              <span className={s.serviceTitle}>{it.title}</span>
              <span className={s.serviceText}>{it.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Заголовок внутренней страницы ───────────────────── */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
  size = "h1",
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  size?: "h1" | "display";
}) {
  return (
    <header className={s.pageHeader}>
      <div className="container">
        <Breadcrumbs items={crumbs} />
        <div className={s.pageHeaderBody}>
          <div className={s.pageHeaderText}>
            {eyebrow && <p className="t-label">{eyebrow}</p>}
            <h1 className={size === "display" ? "t-display-l" : "t-h1"}>{title}</h1>
          </div>
          {lead && <p className={`t-body-l ${s.pageHeaderLead}`}>{lead}</p>}
        </div>
        {children}
      </div>
    </header>
  );
}

/* ── Нумерованный модульный список (ценности, этапы) ─── */
export function NumberedModules({
  items,
  columns = 5,
  tone = "light",
}: {
  items: { title: string; caption?: string; text: string }[];
  columns?: 3 | 4 | 5 | 6;
  tone?: "light" | "dark";
}) {
  return (
    <ol className={`${s.numbered} ${tone === "dark" ? s.numberedDark : ""}`} style={{ ["--cols" as string]: columns }}>
      {items.map((it, i) => (
        <li key={it.title} className={s.numberedItem}>
          <span className={s.numberedIndex}>{String(i + 1).padStart(2, "0")}</span>
          {it.caption && <span className={s.numberedCaption}>{it.caption}</span>}
          <h3 className={s.numberedTitle}>{it.title}</h3>
          <p className={s.numberedText}>{it.text}</p>
        </li>
      ))}
    </ol>
  );
}
