export type CategorySlug = "bathroom" | "bedroom" | "dining" | "living";

export type Weave =
  | "terry"
  | "waffle"
  | "linen"
  | "satin"
  | "knit"
  | "quilt"
  | "crinkle"
  | "herringbone";

export type ColorKey =
  | "white"
  | "milk"
  | "beige"
  | "sand"
  | "taupe"
  | "walnut"
  | "sage"
  | "emerald";

export type CareKey =
  | "wash30"
  | "wash40"
  | "noBleach"
  | "dryFlat"
  | "noTumble"
  | "tumbleLow"
  | "ironLow"
  | "ironMid"
  | "noDryClean";

export interface ImageAsset {
  src: string;
  alt: string;
  /** Тип кадра по брендбуку: интерьер, лайфстайл, фактура, пакшот, деталь */
  kind: "interior" | "lifestyle" | "macro" | "packshot" | "detail";
}

export interface SubCategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  lead: string;
  description: string;
  hero: ImageAsset;
  seo: { title: string; description: string; text: string[] };
  subcategories: SubCategory[];
  editorial: { label: string; title: string; text: string; image: ImageAsset };
}

export interface Collection {
  slug: string;
  name: string;
  season: string;
  lead: string;
  description: string;
  materials: string[];
  palette: ColorKey[];
  image: ImageAsset;
  detail: ImageAsset;
}

export interface Material {
  slug: string;
  name: string;
  /** Значение фильтра «Материал» в каталоге */
  filterNames: string[];
  lead: string;
  description: string;
  feel: string;
  properties: { label: string; value: string }[];
  care: CareKey[];
  careText: string;
  image: ImageAsset;
}

export interface ProductColor {
  key: ColorKey;
}

export interface ProductSize {
  label: string;
  /** Цена для размера; если не указана — базовая цена товара */
  price?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  subcategory: string;
  collection: string;
  /** Отображаемое название материала и значение фильтра */
  material: string;
  /** Ключ на странице «Материалы» */
  materialSlug: string;
  composition: string;
  weave: Weave;
  price: number;
  oldPrice?: number;
  colors: ColorKey[];
  sizes: ProductSize[];
  short: string;
  description: string;
  features: { label: string; value: string }[];
  care: CareKey[];
  stock: number;
  bestseller?: boolean;
  newArrival?: boolean;
  /** Реальные фотографии из брендбука, которые показываются первыми */
  photos?: ImageAsset[];
  popularity: number;
  createdAt: string;
}

export interface CartLine {
  id: string; // slug|color|size
  slug: string;
  color: ColorKey;
  size: string;
  qty: number;
}

export interface Article {
  slug: string;
  title: string;
  lead: string;
  category: string;
  readTime: number;
  date: string;
  image: ImageAsset;
  body: ArticleBlock[];
  related: string[];
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export interface Order {
  number: string;
  createdAt: string;
  lines: CartLine[];
  total: number;
  delivery: string;
  payment: string;
  name: string;
  city: string;
}
