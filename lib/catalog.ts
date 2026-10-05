import type { CategorySlug, ColorKey, ImageAsset, Product } from "./types";
import { PRODUCTS } from "./data/products";
import { CATEGORIES, categoryName, subcategoryName } from "./data/categories";
import { COLLECTIONS, getCollection } from "./data/collections";
import { MATERIALS } from "./data/materials";
import { COLORS, COLOR_ORDER } from "./data/colors";
import { PHOTOS, textileImage } from "./data/images";

/* ── Товар: изображения и цены ───────────────────────── */

/** Галерея для выбранного цвета: фото (если есть) → макро → крупный план → упаковка */
export function productGallery(p: Product, color?: ColorKey): ImageAsset[] {
  const c = color ?? p.colors[0];
  const photos = c === p.colors[0] ? (p.photos ?? []) : [];
  return [...photos, textileImage(p.weave, c, "detail"), textileImage(p.weave, c, "close"), PHOTOS.packaging];
}

/** Главное изображение для карточки + второе для смены при наведении */
export function productCardImages(p: Product): [ImageAsset, ImageAsset] {
  const g = productGallery(p);
  return [g[0], g[1]];
}

export function priceFor(p: Product, sizeLabel?: string): number {
  const s = p.sizes.find((x) => x.label === sizeLabel);
  return s?.price ?? p.price;
}

export function minPrice(p: Product): number {
  return Math.min(p.price, ...p.sizes.map((s) => s.price ?? p.price));
}

export function productMeta(p: Product): string {
  return [p.material, p.sizes.length === 1 ? p.sizes[0].label : p.short].filter(Boolean).join(" · ");
}

export function productUrl(p: Product, color?: ColorKey): string {
  return color && color !== p.colors[0] ? `/product/${p.slug}?color=${color}` : `/product/${p.slug}`;
}

/* ── Фильтры каталога ────────────────────────────────── */

export type SortKey = "popular" | "new" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "По популярности" },
  { value: "new", label: "По новизне" },
  { value: "price-asc", label: "По цене: сначала дешевле" },
  { value: "price-desc", label: "По цене: сначала дороже" },
];

export interface FilterState {
  category: string[];
  type: string[];
  collection: string[];
  material: string[];
  color: string[];
  size: string[];
  priceMin?: number;
  priceMax?: number;
  inStock: boolean;
  q: string;
  sort: SortKey;
}

export const EMPTY_FILTERS: FilterState = {
  category: [],
  type: [],
  collection: [],
  material: [],
  color: [],
  size: [],
  inStock: false,
  q: "",
  sort: "popular",
};

const LIST_KEYS = ["category", "type", "collection", "material", "color", "size"] as const;

export function parseFilters(sp: URLSearchParams): FilterState {
  const f: FilterState = { ...EMPTY_FILTERS };
  for (const k of LIST_KEYS) {
    const v = sp.get(k);
    f[k] = v ? v.split(",").filter(Boolean) : [];
  }
  const min = Number(sp.get("min"));
  const max = Number(sp.get("max"));
  f.priceMin = Number.isFinite(min) && min > 0 ? min : undefined;
  f.priceMax = Number.isFinite(max) && max > 0 ? max : undefined;
  f.inStock = sp.get("stock") === "1";
  f.q = sp.get("q") ?? "";
  const sort = sp.get("sort") as SortKey | null;
  f.sort = SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : "popular";
  return f;
}

export function serializeFilters(f: FilterState): string {
  const sp = new URLSearchParams();
  for (const k of LIST_KEYS) if (f[k].length) sp.set(k, f[k].join(","));
  if (f.priceMin) sp.set("min", String(f.priceMin));
  if (f.priceMax) sp.set("max", String(f.priceMax));
  if (f.inStock) sp.set("stock", "1");
  if (f.q) sp.set("q", f.q);
  if (f.sort !== "popular") sp.set("sort", f.sort);
  return sp.toString();
}

/** Нормализованный размер для фильтра: «Евро · 200 × 220» → «Евро» */
export function sizeGroup(label: string): string {
  return label.split(" · ")[0].trim();
}

export function matchesQuery(p: Product, q: string): boolean {
  const query = normalize(q);
  if (!query) return true;
  const hay = normalize(
    [
      p.name,
      categoryName(p.category),
      subcategoryName(p.category, p.subcategory),
      getCollection(p.collection)?.name ?? "",
      p.material,
      p.composition,
      p.short,
      p.colors.map((c) => COLORS[c].name).join(" "),
    ].join(" "),
  );
  return query.split(/\s+/).every((word) => hay.includes(stem(word)));
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/ё/g, "е").replace(/[«»"().,·×]/g, " ");
}

/** Простейший стемминг: «полотенца» → «полотен», «льняная» → «льнян» */
function stem(word: string): string {
  if (word.length <= 4) return word;
  return word.replace(/(ами|ями|ого|его|ому|ему|ая|яя|ое|ее|ые|ие|ый|ий|ой|ам|ям|ах|ях|ов|ев|ей|ом|ем|а|я|ы|и|у|ю|е|о)$/u, "");
}

export function applyFilters(products: Product[], f: FilterState, opts: { ignore?: keyof FilterState } = {}): Product[] {
  const ig = opts.ignore;
  return products.filter((p) => {
    if (ig !== "category" && f.category.length && !f.category.includes(p.category)) return false;
    if (ig !== "type" && f.type.length && !f.type.includes(p.subcategory)) return false;
    if (ig !== "collection" && f.collection.length && !f.collection.includes(p.collection)) return false;
    if (ig !== "material" && f.material.length && !f.material.includes(p.material)) return false;
    if (ig !== "color" && f.color.length && !p.colors.some((c) => f.color.includes(c))) return false;
    if (ig !== "size" && f.size.length && !p.sizes.some((s) => f.size.includes(sizeGroup(s.label)))) return false;
    if (ig !== "priceMin" && f.priceMin && minPrice(p) < f.priceMin) return false;
    if (ig !== "priceMax" && f.priceMax && minPrice(p) > f.priceMax) return false;
    if (ig !== "inStock" && f.inStock && p.stock <= 0) return false;
    if (f.q && !matchesQuery(p, f.q)) return false;
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case "new":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return list.sort((a, b) => minPrice(a) - minPrice(b));
    case "price-desc":
      return list.sort((a, b) => minPrice(b) - minPrice(a));
    default:
      // товары в наличии — выше
      return list.sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || b.popularity - a.popularity);
  }
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
  swatch?: string;
}

export interface Facets {
  category: FacetOption[];
  type: FacetOption[];
  collection: FacetOption[];
  material: FacetOption[];
  color: FacetOption[];
  size: FacetOption[];
  price: { min: number; max: number };
}

/** Опции фильтров со счётчиками (каждый фасет считается без учёта самого себя) */
export function buildFacets(base: Product[], f: FilterState, scopeCategory?: CategorySlug): Facets {
  const count = (key: keyof FilterState, test: (p: Product) => boolean) =>
    applyFilters(base, f, { ignore: key }).filter(test).length;

  const cats = scopeCategory ? CATEGORIES.filter((c) => c.slug === scopeCategory) : CATEGORIES;
  const typeSeen = new Map<string, string>();
  for (const c of cats) for (const s of c.subcategories) if (!typeSeen.has(s.slug)) typeSeen.set(s.slug, s.name);

  const materialNames = Array.from(new Set(base.map((p) => p.material)));
  const sizeNames = Array.from(new Set(base.flatMap((p) => p.sizes.map((s) => sizeGroup(s.label)))));
  const prices = base.map(minPrice);

  const nonEmpty = (o: FacetOption[]) => o.filter((x) => x.count > 0 || isActive(f, x.value));

  return {
    category: scopeCategory
      ? []
      : CATEGORIES.map((c) => ({
          value: c.slug,
          label: c.name,
          count: count("category", (p) => p.category === c.slug),
        })),
    type: nonEmpty(
      Array.from(typeSeen, ([value, label]) => ({
        value,
        label,
        count: count("type", (p) => p.subcategory === value),
      })),
    ),
    collection: nonEmpty(
      COLLECTIONS.map((c) => ({
        value: c.slug,
        label: c.name,
        count: count("collection", (p) => p.collection === c.slug),
      })),
    ),
    material: nonEmpty(
      MATERIALS.flatMap((m) => m.filterNames)
        .filter((n) => materialNames.includes(n))
        .map((n) => ({ value: n, label: n, count: count("material", (p) => p.material === n) })),
    ),
    color: nonEmpty(
      COLOR_ORDER.map((c) => ({
        value: c,
        label: COLORS[c].name,
        swatch: COLORS[c].hex,
        count: count("color", (p) => p.colors.includes(c)),
      })),
    ),
    size: nonEmpty(
      sizeNames
        .sort(sizeCompare)
        .map((s) => ({ value: s, label: s, count: count("size", (p) => p.sizes.some((x) => sizeGroup(x.label) === s)) })),
    ),
    price: { min: Math.min(...prices), max: Math.max(...prices) },
  };
}

function isActive(f: FilterState, value: string) {
  return LIST_KEYS.some((k) => f[k].includes(value));
}

const LETTER_SIZES = ["S", "M", "L", "XL"];
function sizeCompare(a: string, b: string) {
  const la = LETTER_SIZES.indexOf(a);
  const lb = LETTER_SIZES.indexOf(b);
  if (la >= 0 && lb >= 0) return la - lb;
  if (la >= 0) return 1;
  if (lb >= 0) return -1;
  const na = parseFloat(a.replace(",", "."));
  const nb = parseFloat(b.replace(",", "."));
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  if (!Number.isNaN(na)) return 1;
  if (!Number.isNaN(nb)) return -1;
  return a.localeCompare(b, "ru");
}

export function activeFilterCount(f: FilterState): number {
  return LIST_KEYS.reduce((n, k) => n + f[k].length, 0) + (f.priceMin ? 1 : 0) + (f.priceMax ? 1 : 0) + (f.inStock ? 1 : 0);
}

/** Подписи для чипсов активных фильтров */
export function filterChipLabel(key: string, value: string): string {
  switch (key) {
    case "category":
      return categoryName(value as CategorySlug);
    case "type": {
      for (const c of CATEGORIES) {
        const s = c.subcategories.find((x) => x.slug === value);
        if (s) return s.name;
      }
      return value;
    }
    case "collection":
      return `«${getCollection(value)?.name ?? value}»`;
    case "color":
      return COLORS[value as ColorKey]?.name ?? value;
    default:
      return value;
  }
}

/* ── Подборки ────────────────────────────────────────── */

export const bestsellers = () => sortProducts(PRODUCTS.filter((p) => p.bestseller), "popular");
export const newArrivals = () => sortProducts(PRODUCTS.filter((p) => p.newArrival), "new");
export const byCategory = (c: CategorySlug) => PRODUCTS.filter((p) => p.category === c);
export const byCollection = (slug: string) => sortProducts(PRODUCTS.filter((p) => p.collection === slug), "popular");
export const byMaterial = (slug: string) => sortProducts(PRODUCTS.filter((p) => p.materialSlug === slug), "popular");

export function related(p: Product, limit = 4): Product[] {
  return sortProducts(
    PRODUCTS.filter((x) => x.slug !== p.slug && x.category === p.category && x.collection !== p.collection),
    "popular",
  )
    .concat(PRODUCTS.filter((x) => x.slug !== p.slug && x.category !== p.category && x.materialSlug === p.materialSlug))
    .slice(0, limit);
}

export function sameCollection(p: Product, limit = 4): Product[] {
  return byCollection(p.collection)
    .filter((x) => x.slug !== p.slug)
    .slice(0, limit);
}
