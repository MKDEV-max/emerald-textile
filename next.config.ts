import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=1 — статический экспорт для GitHub Pages:
 * сайт живёт по адресу https://<user>.github.io/emerald-textile/,
 * поэтому нужен basePath и загрузчик изображений без серверной оптимизации.
 */
const pages = process.env.GITHUB_PAGES === "1";
const basePath = pages ? "/emerald-textile" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(pages ? { output: "export", trailingSlash: true } : {}),
  images: pages
    ? { loader: "custom", loaderFile: "./lib/image-loader.ts" }
    : { formats: ["image/avif", "image/webp"], deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920] },
};

export default nextConfig;
