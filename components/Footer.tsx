import Link from "next/link";
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
      { href: "/contacts", label: "Контакты" },
      { href: "/account", label: "Личный кабинет" },
      { href: "/wishlist", label: "Избранное" },
    ],
  },
];

/** Футер: Forest, реверсивный логотип, тональная волна («11 · Website»). */
export function Footer() {
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
            <h2 className={s.colTitle}>Контакты</h2>
            <ul className={s.list}>
              <li>
                <a href="mailto:info@emeraldtextile.ru" className="link-underline">
                  info@emeraldtextile.ru
                </a>
              </li>
              <li>
                <a href="tel:+70000000000" className="link-underline">
                  +7 (000) 000-00-00
                </a>
              </li>
              <li>Москва</li>
              <li className={s.hours}>Ежедневно с 9:00 до 21:00</li>
            </ul>
          </div>
        </div>

        <div className={s.bottom}>
          <span>© 2026 Emerald Textile</span>
          <span className={s.legal}>
            <Link href="/delivery#vozvrat" className="link-underline">
              Условия возврата
            </Link>
            <Link href="/contacts" className="link-underline">
              Реквизиты
            </Link>
          </span>
        </div>
      </div>
      <Wave tone="tonal" className={s.wave} />
    </footer>
  );
}
