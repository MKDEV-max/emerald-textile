"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/lib/data/categories";
import { COLLECTIONS } from "@/lib/data/collections";
import { useStore } from "@/lib/store";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Media } from "./Media";
import s from "./Header.module.css";

export const NAV = [
  { href: "/catalog", label: "Каталог", mega: true },
  { href: "/collections", label: "Коллекции" },
  { href: "/about", label: "О бренде" },
  { href: "/materials", label: "Материалы" },
  { href: "/journal", label: "Журнал" },
];

export function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, ready, openPanel } = useStore();
  const [mega, setMega] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const feature = COLLECTIONS[0];

  useEffect(() => setMega(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!megaRef.current?.contains(t) && !triggerRef.current?.contains(t)) setMega(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [mega]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const count = ready ? cartCount : 0;
  const wishCount = ready ? wishlist.length : 0;

  return (
    <header className={`${s.header} ${scrolled ? s.scrolled : ""} ${mega ? s.megaOpen : ""}`}>
      <div className={`container-wide ${s.bar}`}>
        {/* Мобильная кнопка меню */}
        <button type="button" className={`${s.iconBtn} ${s.menuBtn}`} onClick={() => openPanel("menu")} aria-label="Открыть меню">
          <Icon name="menu" />
        </button>

        <Link href="/" className={s.logo} aria-label="Emerald Textile — на главную">
          <Logo variant="lockup" height={52} priority className={s.logoFull} />
          <Logo variant="monogram" height={34} priority className={s.logoMono} />
        </Link>

        <nav className={s.nav} aria-label="Основная навигация">
          <ul className={s.navList}>
            {NAV.map((item) =>
              item.mega ? (
                <li key={item.href}>
                  <button
                    ref={triggerRef}
                    type="button"
                    className={`${s.navLink} ${isActive(item.href) ? s.active : ""}`}
                    aria-expanded={mega}
                    aria-controls="mega-menu"
                    onClick={() => setMega((v) => !v)}
                  >
                    {item.label}
                    <Icon name="chevronDown" size={14} className={s.chev} />
                  </button>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${s.navLink} ${isActive(item.href) ? s.active : ""}`}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className={s.actions}>
          <button type="button" className={s.action} onClick={() => openPanel("search")} aria-label="Поиск по каталогу">
            <Icon name="search" size={20} />
            <span className={s.actionLabel}>Поиск</span>
          </button>
          <Link
            href="/wishlist"
            className={`${s.action} ${s.wishAction}`}
            aria-label={`Избранное${wishCount ? `, ${wishCount}` : ""}`}
          >
            <Icon name="heart" size={20} />
            <span className={s.actionLabel}>Избранное</span>
            {wishCount > 0 && <span className={s.badge}>{wishCount}</span>}
          </Link>
          <button
            type="button"
            className={s.action}
            onClick={() => openPanel("cart")}
            aria-label={`Корзина${count ? `, товаров: ${count}` : ", пусто"}`}
          >
            <Icon name="bag" size={20} />
            <span className={s.actionLabel}>Корзина</span>
            {count > 0 && <span className={s.badge}>{count}</span>}
          </button>
        </div>
      </div>

      {/* Мега-меню каталога */}
      <div id="mega-menu" ref={megaRef} className={s.mega} hidden={!mega}>
        <div className={`container-wide ${s.megaInner}`}>
          <div className={s.megaCols}>
            {CATEGORIES.map((c) => (
              <div key={c.slug} className={s.megaCol}>
                <Link href={`/catalog/${c.slug}`} className={s.megaTitle}>
                  {c.name}
                </Link>
                <ul className={s.megaList}>
                  {c.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link href={`/catalog/${c.slug}?type=${sub.slug}`} className="link-underline">
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className={`${s.megaCol} ${s.megaQuick}`}>
              <span className={s.megaTitleSmall}>Подборки</span>
              <ul className={s.megaList}>
                <li>
                  <Link href="/catalog" className="link-underline">
                    Весь каталог
                  </Link>
                </li>
                <li>
                  <Link href="/catalog?sort=new" className="link-underline">
                    Новинки
                  </Link>
                </li>
                <li>
                  <Link href="/catalog?sort=popular" className="link-underline">
                    Бестселлеры
                  </Link>
                </li>
                <li>
                  <Link href="/collections" className="link-underline">
                    Коллекции
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Link href={`/collections/${feature.slug}`} className={s.megaFeature}>
            <Media image={feature.image} ratio="4 / 5" sizes="280px" frame />
            <span className={s.megaFeatureText}>
              <span className="t-label">{feature.season}</span>
              <span className="t-h4">Коллекция «{feature.name}»</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
