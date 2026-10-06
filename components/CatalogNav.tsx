import Link from "next/link";
import type { CategorySlug, ImageAsset } from "@/lib/types";
import { CATEGORIES } from "@/lib/data/categories";
import { PRODUCTS } from "@/lib/data/products";
import { byCategory } from "@/lib/catalog";
import { Media } from "./Media";
import s from "./CatalogNav.module.css";

/** Editorial-навигация по пространствам: крупные текстовые ссылки, время суток и счётчик. */
export function CatalogNav({ active }: { active?: CategorySlug }) {
  return (
    <nav aria-label="Пространства каталога" className={s.nav}>
      <ul className={s.list}>
        <li>
          <Link href="/catalog" className={`${s.link} ${!active ? s.on : ""}`} aria-current={!active ? "page" : undefined}>
            <span className={s.time}>Весь дом</span>
            <span className={s.name}>Всё</span>
            <sup className={s.count}>{PRODUCTS.length}</sup>
          </Link>
        </li>
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/catalog/${c.slug}`}
              className={`${s.link} ${active === c.slug ? s.on : ""}`}
              aria-current={active === c.slug ? "page" : undefined}
            >
              <span className={s.time}>{c.time}</span>
              <span className={s.name}>{c.shortName}</span>
              <sup className={s.count}>{byCategory(c.slug).length}</sup>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Вставка в сетку товаров: кадр + короткий текст, чтобы каталог читался как подборка. */
export function CatalogEditorial({
  label,
  title,
  text,
  image,
  href,
  linkLabel,
}: {
  label: string;
  title: string;
  text: string;
  image: ImageAsset;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <aside className={s.editorial} aria-label={title}>
      <div className={s.editorialMedia}>
        <Media image={image} ratio="16 / 9" sizes="(max-width: 1023px) 100vw, 60vw" />
      </div>
      <div className={s.editorialText}>
        <p className="t-eyebrow">{label}</p>
        <p className="t-h2">{title}</p>
        <p className={s.editorialBody}>{text}</p>
        {href && (
          <Link href={href} className={s.editorialLink}>
            {linkLabel}
          </Link>
        )}
      </div>
    </aside>
  );
}
