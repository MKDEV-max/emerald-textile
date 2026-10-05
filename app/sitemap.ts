import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";
import { COLLECTIONS } from "@/lib/data/collections";
import { ARTICLES } from "@/lib/data/journal";

const BASE = "https://emeraldtextile.ru";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/catalog", "/collections", "/about", "/materials", "/journal", "/delivery", "/contacts"];
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...CATEGORIES.map((c) => ({ url: `${BASE}/catalog/${c.slug}`, lastModified: now, priority: 0.9 })),
    ...COLLECTIONS.map((c) => ({ url: `${BASE}/collections/${c.slug}`, lastModified: now, priority: 0.7 })),
    ...PRODUCTS.map((p) => ({ url: `${BASE}/product/${p.slug}`, lastModified: new Date(p.createdAt), priority: 0.7 })),
    ...ARTICLES.map((a) => ({ url: `${BASE}/journal/${a.slug}`, lastModified: new Date(a.date), priority: 0.5 })),
  ];
}
