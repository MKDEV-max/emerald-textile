"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { minPrice, productCardImages } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Icon } from "./Icon";
import { Media } from "./Media";
import s from "./ProductCard.module.css";

/**
 * Editorial-карточка: фото → название → материал → цена.
 * Избранное и быстрое добавление — деликатные, проявляются при наведении и фокусе.
 * Статус — одна тихая подпись, без бейджей.
 */
export function ProductCard({
  product: p,
  priority,
  sizes = "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw",
  ratio = "4 / 5",
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  ratio?: string;
}) {
  const { addToCart, toggleWish, isWished, notify, openPanel, ready } = useStore();
  const [main, hover] = productCardImages(p);
  const wished = ready && isWished(p.slug);
  const out = p.stock <= 0;
  const from = p.sizes.some((x) => x.price && x.price !== p.price) && minPrice(p) < p.price;
  const href = `/product/${p.slug}`;
  const status = out ? "Нет в наличии" : p.newArrival ? "Новинка" : p.oldPrice ? "Специальная цена" : null;

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
          <Media image={main} hoverImage={hover} zoom ratio={ratio} sizes={sizes} priority={priority} />
        </Link>
        <button
          type="button"
          className={`${s.wish} ${wished ? s.wished : ""}`}
          onClick={wish}
          aria-pressed={wished}
          aria-label={wished ? `Убрать «${p.name}» из избранного` : `Добавить «${p.name}» в избранное`}
        >
          <Icon name="heart" size={18} />
        </button>
        {!out && (
          <button type="button" className={s.quick} onClick={quickAdd} aria-label={`Добавить «${p.name}» в корзину`}>
            <span className={s.quickText}>В корзину</span>
            <Icon name="plus" size={16} />
          </button>
        )}
      </div>

      <div className={s.body}>
        {status && <p className={`${s.status} ${out ? s.statusOut : ""}`}>{status}</p>}
        <h3 className={s.title}>
          <Link href={href} className={s.titleLink}>
            {p.name}
          </Link>
        </h3>
        <p className={s.meta}>{p.material}</p>
        <p className={s.price}>
          {from && <span className={s.from}>от </span>}
          {formatPrice(minPrice(p))}
          {p.oldPrice && (
            <s className={s.old}>
              <span className="visually-hidden">Прежняя цена: </span>
              {formatPrice(p.oldPrice)}
            </s>
          )}
        </p>
      </div>
    </article>
  );
}
