"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartLine, ColorKey } from "@/lib/types";
import { getProduct } from "@/lib/data/products";
import { COLORS } from "@/lib/data/colors";
import { priceFor, productGallery } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import { QuantitySelector } from "./ui";
import s from "./CartLines.module.css";

export const FREE_SHIPPING = 10000;

/** Строки корзины: изменение варианта, количества, удаление. */
export function CartLines({ onNavigate, compact }: { onNavigate?: () => void; compact?: boolean }) {
  const { cart, updateQty, removeFromCart, changeVariant, notify, addToCart } = useStore();

  const remove = (line: CartLine, name: string) => {
    removeFromCart(line.id);
    notify({
      title: "Товар удалён",
      text: name,
      action: { label: "Вернуть", onClick: () => addToCart(line.slug, line.color, line.size, line.qty) },
    });
  };

  return (
    <ul className={`${s.lines} ${compact ? s.compact : ""}`}>
      {cart.map((line) => {
        const p = getProduct(line.slug);
        if (!p) return null;
        const img = productGallery(p, line.color).find((i) => i.kind === "macro") ?? productGallery(p, line.color)[0];
        const unit = priceFor(p, line.size);
        const href = `/product/${p.slug}${line.color !== p.colors[0] ? `?color=${line.color}` : ""}`;
        return (
          <li key={line.id} className={s.line}>
            <Link href={href} className={s.thumb} onClick={onNavigate} tabIndex={-1} aria-hidden="true">
              <Image src={img.src} alt="" fill sizes="96px" />
            </Link>
            <div className={s.info}>
              <div className={s.head}>
                <Link href={href} className={s.name} onClick={onNavigate}>
                  {p.name}
                </Link>
                <span className={s.price}>{formatPrice(unit * line.qty)}</span>
              </div>

              <div className={s.variants}>
                {p.colors.length > 1 ? (
                  <label className={s.variant}>
                    <span className="visually-hidden">Цвет</span>
                    <select
                      className={s.select}
                      value={line.color}
                      onChange={(e) => changeVariant(line.id, e.target.value as ColorKey, line.size)}
                      aria-label={`Цвет для «${p.name}»`}
                    >
                      {p.colors.map((c) => (
                        <option key={c} value={c}>
                          {COLORS[c].name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <span className={s.static}>{COLORS[line.color].name}</span>
                )}
                {p.sizes.length > 1 ? (
                  <label className={s.variant}>
                    <span className="visually-hidden">Размер</span>
                    <select
                      className={s.select}
                      value={line.size}
                      onChange={(e) => changeVariant(line.id, line.color, e.target.value)}
                      aria-label={`Размер для «${p.name}»`}
                    >
                      {p.sizes.map((sz) => (
                        <option key={sz.label} value={sz.label}>
                          {sz.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <span className={s.static}>{line.size}</span>
                )}
              </div>

              <div className={s.actions}>
                <QuantitySelector
                  size="s"
                  value={line.qty}
                  onChange={(n) => updateQty(line.id, n)}
                  max={Math.max(1, Math.min(20, p.stock || 20))}
                  label={`Количество «${p.name}»`}
                />
                {line.qty > 1 && <span className={s.unit}>{formatPrice(unit)} / шт.</span>}
                <button type="button" className={s.remove} onClick={() => remove(line, p.name)}>
                  Удалить
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function ShippingProgress({ total }: { total: number }) {
  const left = Math.max(0, FREE_SHIPPING - total);
  const pct = Math.min(100, (total / FREE_SHIPPING) * 100);
  return (
    <div className={s.progress}>
      <p className={s.progressText}>
        {left > 0 ? (
          <>
            До бесплатной доставки — <strong>{formatPrice(left)}</strong>
          </>
        ) : (
          <>Доставка по России — бесплатно</>
        )}
      </p>
      <div
        className={s.bar}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label="Прогресс до бесплатной доставки"
      >
        <span style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
    </div>
  );
}
