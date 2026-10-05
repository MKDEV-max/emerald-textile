"use client";

import { useEffect, useId, useState } from "react";
import type { Facets, FilterState } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { Icon } from "./Icon";
import { Checkbox } from "./ui";
import s from "./FilterPanel.module.css";

type ListKey = "category" | "type" | "collection" | "material" | "color" | "size";

function Group({
  title,
  children,
  defaultOpen = true,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: number;
}) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={s.group}>
      <h3 className={s.groupHead}>
        <button type="button" className={s.groupBtn} aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
          <span>
            {title}
            {badge ? <span className={s.groupBadge}>{badge}</span> : null}
          </span>
          <Icon name={open ? "minus" : "plus"} size={16} />
        </button>
      </h3>
      <div id={id} className={s.groupBody} hidden={!open}>
        {children}
      </div>
    </div>
  );
}

/** Панель фильтров каталога. Используется в сайдбаре (десктоп) и в модальном окне (мобильный). */
export function FilterPanel({
  filters,
  facets,
  onToggle,
  onPrice,
  onStock,
  showCategory,
  typeTitle = "Вид изделия",
}: {
  filters: FilterState;
  facets: Facets;
  onToggle: (key: ListKey, value: string) => void;
  onPrice: (min?: number, max?: number) => void;
  onStock: (v: boolean) => void;
  showCategory: boolean;
  typeTitle?: string;
}) {
  const [min, setMin] = useState(filters.priceMin ? String(filters.priceMin) : "");
  const [max, setMax] = useState(filters.priceMax ? String(filters.priceMax) : "");
  const priceId = useId();
  const [allSizes, setAllSizes] = useState(false);

  useEffect(() => {
    setMin(filters.priceMin ? String(filters.priceMin) : "");
    setMax(filters.priceMax ? String(filters.priceMax) : "");
  }, [filters.priceMin, filters.priceMax]);

  const applyPrice = () => {
    const a = Number(min.replace(/\D/g, "")) || undefined;
    const b = Number(max.replace(/\D/g, "")) || undefined;
    if (a && b && a > b) onPrice(b, a);
    else onPrice(a, b);
  };

  const list = (key: ListKey, options: Facets["type"]) =>
    options.map((o) => (
      <Checkbox
        key={o.value}
        checked={filters[key].includes(o.value)}
        onChange={() => onToggle(key, o.value)}
        count={o.count}
        disabled={o.count === 0 && !filters[key].includes(o.value)}
      >
        {o.label}
      </Checkbox>
    ));

  return (
    <div className={s.panel}>
      {showCategory && facets.category.length > 0 && (
        <Group title="Категория" badge={filters.category.length}>
          {list("category", facets.category)}
        </Group>
      )}

      {facets.type.length > 0 && (
        <Group title={typeTitle} badge={filters.type.length} defaultOpen={!showCategory}>
          {list("type", facets.type)}
        </Group>
      )}

      <Group title="Коллекция" badge={filters.collection.length} defaultOpen={false}>
        {list("collection", facets.collection)}
      </Group>

      <Group title="Материал" badge={filters.material.length}>
        {list("material", facets.material)}
      </Group>

      <Group title="Цвет" badge={filters.color.length}>
        <div className={s.colors}>
          {facets.color.map((c) => {
            const active = filters.color.includes(c.value);
            return (
              <button
                key={c.value}
                type="button"
                className={s.color}
                aria-pressed={active}
                onClick={() => onToggle("color", c.value)}
                disabled={c.count === 0 && !active}
              >
                <span className={s.colorChip} style={{ background: c.swatch }} aria-hidden="true" />
                <span className={s.colorName}>{c.label}</span>
                <span className={s.colorCount}>{c.count}</span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Размер" badge={filters.size.length} defaultOpen={false}>
        <div className={s.sizes}>
          {(allSizes ? facets.size : facets.size.filter((o, i) => i < 8 || filters.size.includes(o.value))).map((o) => {
            const active = filters.size.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                className={s.size}
                aria-pressed={active}
                onClick={() => onToggle("size", o.value)}
                disabled={o.count === 0 && !active}
              >
                {o.label}
              </button>
            );
          })}
          {facets.size.length > 8 && (
            <button type="button" className={s.more} onClick={() => setAllSizes((v) => !v)} aria-expanded={allSizes}>
              {allSizes ? "Свернуть" : `Все размеры (${facets.size.length})`}
            </button>
          )}
        </div>
      </Group>

      <Group title="Цена" badge={(filters.priceMin ? 1 : 0) + (filters.priceMax ? 1 : 0)}>
        <form
          className={s.price}
          onSubmit={(e) => {
            e.preventDefault();
            applyPrice();
          }}
        >
          <div className={s.priceFields}>
            <label className={s.priceField}>
              <span className={s.priceLabel}>от</span>
              <input
                id={`${priceId}-min`}
                className={s.priceInput}
                inputMode="numeric"
                placeholder={String(facets.price.min)}
                value={min}
                onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))}
                onBlur={applyPrice}
                aria-label="Цена от, рублей"
              />
            </label>
            <label className={s.priceField}>
              <span className={s.priceLabel}>до</span>
              <input
                id={`${priceId}-max`}
                className={s.priceInput}
                inputMode="numeric"
                placeholder={String(facets.price.max)}
                value={max}
                onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))}
                onBlur={applyPrice}
                aria-label="Цена до, рублей"
              />
            </label>
          </div>
          <div className={s.presets}>
            {[
              { label: `до ${formatPrice(2000)}`, min: undefined, max: 2000 },
              { label: `${formatPrice(2000)} — ${formatPrice(5000)}`, min: 2000, max: 5000 },
              { label: `от ${formatPrice(5000)}`, min: 5000, max: undefined },
            ].map((p) => {
              const active = filters.priceMin === p.min && filters.priceMax === p.max;
              return (
                <button
                  key={p.label}
                  type="button"
                  className={s.size}
                  aria-pressed={active}
                  onClick={() => (active ? onPrice(undefined, undefined) : onPrice(p.min, p.max))}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <button type="submit" className="visually-hidden">
            Применить цену
          </button>
        </form>
      </Group>

      <Group title="Наличие" badge={filters.inStock ? 1 : 0}>
        <Checkbox checked={filters.inStock} onChange={onStock}>
          Только в наличии
        </Checkbox>
      </Group>
    </div>
  );
}
