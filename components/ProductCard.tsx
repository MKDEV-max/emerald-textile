"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { categoryName } from "@/lib/data/categories";
import { minPrice, productCardImages } from "@/lib/catalog";
import { countLabel, formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Icon } from "./Icon";
import { Media } from "./Media";
import { SwatchRow, Tag } from "./ui";
import s from "./ProductCard.module.css";

/**
 * Карточка товара («08 · Card / Product»): фото в рамке 1 px, теги, название JOURNALISM,
 * мета, линия, цена и «Подробнее →». Плюс избранное и быстрое добавление в корзину.
 */
export function ProductCard({
  product: p,
  priority,
  sizes = "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw",
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
}) {
  const { addToCart, toggleWish, isWished, notify, openPanel, ready } = useStore();
  const [main, hover] = productCardImages(p);
  const wished = ready && isWished(p.slug);
  const out = p.stock <= 0;
  const from = p.sizes.some((x) => x.price && x.price !== p.price) && minPrice(p) < p.price;
  const href = `/product/${p.slug}`;

  const quickAdd = () => {
    addToCart(p.slug, p.colors[0], p.sizes[0].label, 1);
    notify({
      title: "Добавлено в корзину",
      text: `${p.name} · ${p.sizes[0].label}`,
      action: { label: "Открыть корзину", onClick: () => openPanel("cart") },
    });
  };

  const wish = () => {
    toggleWish(p.slug);
    notify({ title: wished ? "Удалено из избранного" : "Добавлено в избранное", text: p.name });
  };

  return (
    <article className={`${s.card} card-hover`}>
      <div className={s.mediaWrap}>
        <Link href={href} className={s.mediaLink} tabIndex={-1} aria-hidden="true">
          <Media image={main} hoverImage={hover} frame zoom ratio="4 / 5" sizes={sizes} priority={priority} />
        </Link>
        <button
          type="button"
          className={`${s.wish} ${wished ? s.wished : ""}`}
          onClick={wish}
          aria-pressed={wished}
          aria-label={wished ? `Убрать «${p.name}» из избранного` : `Добавить «${p.name}» в избранное`}
        >
          <Icon name="heart" size={20} />
        </button>
        <button
          type="button"
          className={s.quick}
          onClick={quickAdd}
          disabled={out}
          aria-label={out ? `${p.name}: нет в наличии` : `Добавить «${p.name}» в корзину`}
        >
          <span className={s.quickText}>{out ? "Нет в наличии" : "В корзину"}</span>
          {!out && <Icon name="plus" size={18} />}
        </button>
      </div>

      <div className={s.body}>
        <div className={s.tags}>
          {p.newArrival && <Tag tone="solid">Новинка</Tag>}
          {p.bestseller && <Tag>Бестселлер</Tag>}
          {p.oldPrice && <Tag tone="cream">Распродажа</Tag>}
          {out && <Tag tone="muted">Нет в наличии</Tag>}
          {!p.newArrival && !p.bestseller && !p.oldPrice && !out && <Tag>{p.material}</Tag>}
        </div>

        <h3 className={s.title}>
          <Link href={href} className={s.titleLink}>
            {p.name}
          </Link>
        </h3>
        <p className={s.meta}>
          {categoryName(p.category)} · {p.material}
        </p>
        <div className={s.colors}>
          <SwatchRow colors={p.colors} />
          <span className={s.colorCount}>
            {countLabel(p.colors.length, ["цвет", "цвета", "цветов"])}
          </span>
        </div>

        <div className={s.footer}>
          <p className={s.price}>
            {from && <span className={s.from}>от </span>}
            {formatPrice(minPrice(p))}
            {p.oldPrice && (
              <s className={s.old}>
                <span className="visually-hidden">Старая цена: </span>
                {formatPrice(p.oldPrice)}
              </s>
            )}
          </p>
          <Link href={href} className={s.more} aria-label={`Подробнее о товаре «${p.name}»`}>
            Подробнее <Icon name="arrowRight" size={14} stroke={1.5} />
          </Link>
        </div>
      </div>
    </article>
  );
}
