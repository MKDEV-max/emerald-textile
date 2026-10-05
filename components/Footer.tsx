import Link from "next/link";
import { DEMO_NOTE, SITE } from "@/lib/site";
import { Logo } from "./Logo";
import { Newsletter } from "./Newsletter";
import { Wave } from "./ui";
import { FooterCartLink } from "./FooterCartLink";
import s from "./Footer.module.css";

const COLUMNS = [
  {
    title: "Каталог",
    links: [
      { href: "/catalog/bathroom", label: "Ванная комната" },
      { href: "/catalog/bedroom", label: "Спальня" },
      { href: "/catalog/dining", label: "Столовая" },
      { href: "/catalog/living", label: "Гостиная" },
    ],
  },
  {
    title: "Информация",
    links: [
      { href: "/about", label: "О бренде" },
      { href: "/materials", label: "Материалы" },
      { href: "/journal", label: "Журнал" },
      { href: "/delivery", label: "Доставка и возврат" },
    ],
  },
  {
    title: "Покупателям",
    links: [
      { href: "/contacts", label: "Связаться с нами" },
      { href: "/account", label: "Личный кабинет" },
      { href: "/wishlist", label: "Избранное" },
    ],
  },
];

/** Футер: Forest, реверсивный логотип, тональная волна («11 · Website»). */
export function Footer() {
  const { email, phone } = SITE.contacts;
  return (
    <footer className={`${s.footer} on-dark`}>
      <div className={`container ${s.inner}`}>
        <div className={s.top}>
          <div className={s.brand}>
            <Link href="/" aria-label="Emerald Textile — на главную">
              <Logo variant="lockup" tone="cream" height={64} />
            </Link>
            <p className={s.tagline}>Тёплый натуральный дом. Постельное бельё, полотенца, скатерти и пледы.</p>
          </div>
          <div className={s.news}>
            <Newsletter />
          </div>
        </div>

        <div className={s.cols}>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className={s.col}>
              <h2 className={s.colTitle}>{col.title}</h2>
              <ul className={s.list}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
                {col.title === "Покупателям" && (
                  <li>
                    <FooterCartLink />
                  </li>
                )}
              </ul>
            </nav>
          ))}
          <div className={s.col}>
            <h2 className={s.colTitle}>Сервис</h2>
            <ul className={s.list}>
              <li>Доставка по России</li>
              <li>Возврат в течение 14 дней</li>
              <li>Многоразовая упаковка</li>
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="link-underline">
                    {email}
                  </a>
                </li>
              )}
              {phone && <li>{phone}</li>}
            </ul>
          </div>
        </div>

        <div className={s.bottom}>
          <span>© 2026 Emerald Textile</span>
          {SITE.demo && <span className={s.demo}>{DEMO_NOTE}</span>}
        </div>
      </div>
      <Wave tone="tonal" className={s.wave} />
    </footer>
  );
}
