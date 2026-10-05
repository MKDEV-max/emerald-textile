"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { CategorySlug } from "@/lib/types";
import { PRODUCTS } from "@/lib/data/products";
import {
  activeFilterCount,
  applyFilters,
  buildFacets,
  EMPTY_FILTERS,
  filterChipLabel,
  parseFilters,
  serializeFilters,
  SORT_OPTIONS,
  sortProducts,
  type FilterState,
  type SortKey,
} from "@/lib/catalog";
import { countLabel, formatPrice, PRODUCT_FORMS } from "@/lib/format";
import { Button } from "./Button";
import { FilterPanel } from "./FilterPanel";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
import { ProductGrid } from "./ProductGrid";
import { EmptyState } from "./ui";
import s from "./CatalogView.module.css";

const PAGE = 12;
type ListKey = "category" | "type" | "collection" | "material" | "color" | "size";

/** Каталог: фильтры, сортировка, активные фильтры, постраничная подгрузка. Состояние — в URL. */
export function CatalogView({ category, editorial }: { category?: CategorySlug; editorial?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const filters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);
  const base = useMemo(() => (category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS), [category]);
  const results = useMemo(() => sortProducts(applyFilters(base, filters), filters.sort), [base, filters]);
  const facets = useMemo(() => buildFacets(base, filters, category), [base, filters, category]);
  const active = activeFilterCount(filters);

  useEffect(() => setLimit(PAGE), [params]);

  const commit = (next: FilterState) => {
    const qs = serializeFilters(next);
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const toggle = (key: ListKey, value: string) => {
    const cur = filters[key];
    commit({ ...filters, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] });
  };

  const chips: { key: string; label: string; remove: () => void }[] = [];
  (["category", "type", "collection", "material", "color", "size"] as ListKey[]).forEach((k) =>
    filters[k].forEach((v) => chips.push({ key: `${k}-${v}`, label: filterChipLabel(k, v), remove: () => toggle(k, v) })),
  );
  if (filters.priceMin || filters.priceMax) {
    chips.push({
      key: "price",
      label: [filters.priceMin && `от ${formatPrice(filters.priceMin)}`, filters.priceMax && `до ${formatPrice(filters.priceMax)}`]
        .filter(Boolean)
        .join(" "),
      remove: () => commit({ ...filters, priceMin: undefined, priceMax: undefined }),
    });
  }
  if (filters.inStock) chips.push({ key: "stock", label: "В наличии", remove: () => commit({ ...filters, inStock: false }) });
  if (filters.q) chips.push({ key: "q", label: `Поиск: «${filters.q}»`, remove: () => commit({ ...filters, q: "" }) });

  const reset = () => commit({ ...EMPTY_FILTERS, sort: filters.sort });

  const panel = (
    <FilterPanel
      filters={filters}
      facets={facets}
      onToggle={toggle}
      onPrice={(min, max) => commit({ ...filters, priceMin: min, priceMax: max })}
      onStock={(v) => commit({ ...filters, inStock: v })}
      showCategory={!category}
    />
  );

  const shown = results.slice(0, limit);

  return (
    <div className={s.layout}>

      <div className={s.main}>
        <div className={s.toolbar}>
          <button type="button" className={s.filterBtn} onClick={() => setMobileOpen(true)} aria-haspopup="dialog">
            <Icon name="filter" size={20} />
            Фильтр
            {active > 0 && <span className={s.badge}>{active}</span>}
          </button>
          <p className={s.count} aria-live="polite">
            {countLabel(results.length, PRODUCT_FORMS)}
          </p>
          <label className={s.sort}>
            <span className={s.sortLabel}>Сортировка</span>
            <select
              className={s.sortSelect}
              value={filters.sort}
              onChange={(e) => commit({ ...filters, sort: e.target.value as SortKey })}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {chips.length > 0 && (
          <ul className={s.chips} aria-label="Выбранные фильтры">
            {chips.map((c) => (
              <li key={c.key}>
                <button type="button" className={s.chip} onClick={c.remove} aria-label={`Убрать фильтр: ${c.label}`}>
                  {c.label}
                  <Icon name="close" size={12} stroke={1.5} />
                </button>
              </li>
            ))}
            <li>
              <button type="button" className={s.clearAll} onClick={reset}>
                Сбросить все
              </button>
            </li>
          </ul>
        )}

        <div className={`${s.results} ${pending ? s.pending : ""}`} aria-busy={pending}>
          {pending && <span className={s.loadingLine} aria-hidden="true" />}
          {results.length === 0 ? (
            <EmptyState
              icon="search"
              title="Ничего не нашлось"
              text={
                filters.q
                  ? `По запросу «${filters.q}» с выбранными фильтрами товаров нет. Попробуйте изменить запрос или сбросить фильтры.`
                  : "С такими фильтрами товаров нет. Попробуйте убрать часть условий — например, цвет или размер."
              }
              action={{ label: "Сбросить фильтры", onClick: reset }}
            />
          ) : (
            <>
              {editorial && active === 0 && !filters.q && shown.length > 6 ? (
                <>
                  <ProductGrid products={shown.slice(0, 6)} columns={3} priorityCount={3} label="Товары" />
                  <div className={s.editorial}>{editorial}</div>
                  <ProductGrid products={shown.slice(6)} columns={3} label="Товары, продолжение" />
                </>
              ) : (
                <ProductGrid products={shown} columns={3} priorityCount={3} label="Товары" />
              )}
              <div className={s.more}>
                <p className={s.moreText}>
                  Показано {shown.length} из {results.length}
                </p>
                <div className={s.moreBar} aria-hidden="true">
                  <span style={{ transform: `scaleX(${shown.length / results.length})` }} />
                </div>
                {shown.length < results.length && (
                  <Button variant="secondary" arrow={false} onClick={() => setLimit((l) => l + PAGE)}>
                    Показать ещё
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Modal open={mobileOpen} onClose={() => setMobileOpen(false)} label="Фильтр" variant="left" className={s.mobilePanel}>
        <div className={s.mobileHead}>
          <h2 className="t-h3">Фильтр</h2>
          <button type="button" className={s.close} onClick={() => setMobileOpen(false)} aria-label="Закрыть фильтр">
            <Icon name="close" />
          </button>
        </div>
        <div className={s.mobileBody}>{panel}</div>
        <div className={s.mobileFoot}>
          <Button variant="secondary" arrow={false} onClick={reset} disabled={active === 0}>
            Сбросить
          </Button>
          <Button onClick={() => setMobileOpen(false)} arrow={false}>
            Показать {countLabel(results.length, PRODUCT_FORMS)}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
