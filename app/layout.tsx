import type { Metadata, Viewport } from "next";
import { Inter, Oranienbaum } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";
import { MobileMenu } from "@/components/MobileMenu";
import { Toaster } from "@/components/Toaster";

/*
 * Шрифты бренда — JOURNALISM (заголовки) и SF Pro Display (текст).
 * Их нет в открытом доступе, поэтому подключены фолбэки, которые указывает
 * сам брендбук: Oranienbaum — «ближайший доступный аналог JOURNALISM»,
 * Inter — «метрически близок к SF Pro». На устройствах Apple текст
 * отображается системным SF Pro. При появлении лицензионных файлов их
 * достаточно подключить через @font-face — токены уже ссылаются на них.
 */
const oranienbaum = Oranienbaum({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-oranienbaum",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://emeraldtextile.ru"),
  title: {
    default: "Emerald Textile — премиальный домашний текстиль",
    template: "%s — Emerald Textile",
  },
  description:
    "Постельное бельё, полотенца, скатерти и пледы из хлопка и льна. Натуральные материалы, выразительная фактура и спокойные цвета для дома.",
  applicationName: "Emerald Textile",
  keywords: ["домашний текстиль", "постельное бельё", "полотенца", "скатерти", "пледы", "лён", "хлопок", "махра"],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Emerald Textile",
    title: "Emerald Textile — премиальный домашний текстиль",
    description: "Текстиль, который создаёт ощущение дома. Натуральные материалы и выразительная фактура.",
    images: [{ url: "/images/brand/bedroom-wide.jpg", width: 1802, height: 873, alt: "Спальня с текстилем Emerald Textile" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/monogram-emerald.png` },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#024429",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Emerald Textile",
  url: "https://emeraldtextile.ru",
  logo: "https://emeraldtextile.ru/brand/lockup-emerald.png",
  email: "info@emeraldtextile.ru",
  address: { "@type": "PostalAddress", addressLocality: "Москва", addressCountry: "RU" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${oranienbaum.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Перейти к содержимому
        </a>
        <StoreProvider>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <MobileMenu />
          <Toaster />
        </StoreProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
