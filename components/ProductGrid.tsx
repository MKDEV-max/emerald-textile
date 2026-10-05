import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import s from "./ProductGrid.module.css";

/** Сетка товаров: 4 / 3 / 2 колонки */
export function ProductGrid({
  products,
  columns = 4,
  priorityCount = 0,
  label,
}: {
  products: Product[];
  columns?: 3 | 4;
  priorityCount?: number;
  label?: string;
}) {
  return (
    <ul className={`${s.grid} ${columns === 3 ? s.three : ""}`} aria-label={label}>
      {products.map((p, i) => (
        <li key={p.slug} className={s.item}>
          <ProductCard
            product={p}
            priority={i < priorityCount}
            sizes={columns === 3 ? "(max-width: 767px) 50vw, (max-width: 1023px) 50vw, 30vw" : undefined}
          />
        </li>
      ))}
    </ul>
  );
}

/** Ряд товаров: сетка на десктопе, горизонтальная лента со snap на мобильном */
export function ProductRail({ products, label }: { products: Product[]; label?: string }) {
  return (
    <div className={s.railWrap}>
      <ul className={s.rail} aria-label={label}>
        {products.map((p) => (
          <li key={p.slug} className={s.railItem}>
            <ProductCard product={p} sizes="(max-width: 767px) 72vw, (max-width: 1023px) 40vw, 25vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}
