import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/account", "/wishlist"] },
    sitemap: "https://emeraldtextile.ru/sitemap.xml",
  };
}
