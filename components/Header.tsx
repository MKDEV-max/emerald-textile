"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/lib/data/categories";
import { byCategory } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Media } from "./Media";
import s from "./Header.module.css";

export const NAV = [
  { href: "/catalog", label: "Каталог", mega: true },
  { href: "/collections", label: "Коллекции" },
  { href: "/materials", label: "Материалы" },
  { href: "/about", label: "О бренде" },
  { href: "/journal", label: "Журнал" },
];

/**
 * Шапка: логотип по центру — главный якорь; навигация разделена на две спокойные
 * группы; поиск, избранное и корзина — вторичные текстовые действия.
 */
export function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, ready, openPanel } = useStore();
  const [mega, setMega] = useState(false);
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMega(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
  const cat = CATEGORIES[active];

  const navLink = (item: (typeof NAV)[number]) =>
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
    );

  return (
    <header className={`${s.header} ${scrolled ? s.scrolled : ""} ${mega ? s.megaOpen : ""}`}>
      <div className={`container-wide ${s.bar}`}>
        <button type="button" className={s.menuBtn} onClick={() => openPanel("menu")} aria-label="Открыть меню">
          <Icon name="menu" />
        </button>

        <nav className={s.navLeft} aria-label="Основная навигация">
          <ul className={s.navList}>{NAV.slice(0, 3).map(navLink)}</ul>
        </nav>

        <Link href="/" className={s.logo} aria-label="Emerald Textile — на главную">
          <Logo variant="lockup" height={56} priority className={s.logoFull} />
          <Logo variant="monogram" height={30} priority className={s.logoMono} />
        </Link>

        <div className={s.right}>
          <nav aria-label="О бренде" className={s.navRight}>
            <ul className={s.navList}>{NAV.slice(3).map(navLink)}</ul>
          </nav>
          <span className={s.divider} aria-hidden="true" />
          <div className={s.actions}>
            <button type="button" className={s.action} onClick={() => openPanel("search")} aria-label="Поиск по каталогу">
              <Icon name="search" size={18} />
              <span className={s.actionLabel}>Поиск</span>
            </button>
            <Link href="/wishlist" className={`${s.action} ${s.wishAction}`} aria-label={`Избранное${wishCount ? `, ${wishCount}` : ""}`}>
              <Icon name="heart" size={18} />
              {wishCount > 0 && <span className={s.count}>{wishCount}</span>}
            </Link>
            <button
              type="button"
              className={s.action}
              onClick={() => openPanel("cart")}
              aria-label={`Корзина${count ? `, товаров: ${count}` : ", пусто"}`}
            >
              <Icon name="bag" size={18} className={s.bagIcon} />
              <span className={s.actionLabel}>Корзина</span>
              <span className={s.count}>{count > 0 ? count : ""}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Мега-меню: крупные категории, подразделы и превью */}
      <div id="mega-menu" ref={megaRef} className={s.mega} hidden={!mega}>
        <div className={`container-wide ${s.megaInner}`}>
          <ul className={s.megaCats}>
            {CATEGORIES.map((c, i) => (
              <li key={c.slug}>
                <Link
                  href={`/catalog/${c.slug}`}
                  className={`${s.megaCat} ${i === active ? s.megaCatActive : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className={s.megaNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.megaCatName}>{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className={s.megaSubs}>
            <p className="t-eyebrow">{cat.shortName}</p>
            <ul className={s.megaList}>
              {cat.subcategories.map((sub) => (
                <li key={sub.slug}>
                  <Link href={`/catalog/${cat.slug}?type=${sub.slug}`} className="link-underline">
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={`/catalog/${cat.slug}`} className={s.megaAll}>
              Все {byCategory(cat.slug).length} предметов <Icon name="arrowRight" size={14} stroke={1.5} />
            </Link>
            <div className={s.megaQuick}>
              <Link href="/catalog" className="link-underline">
                Весь каталог
              </Link>
              <Link href="/catalog?sort=new" className="link-underline">
                Новинки
              </Link>
              <Link href="/collections" className="link-underline">
                Коллекции
              </Link>
            </div>
          </div>

          <Link href={`/catalog/${cat.slug}`} className={s.megaPreview} tabIndex={-1} aria-hidden="true">
            <Media key={cat.slug} image={cat.hero} ratio="4 / 5" sizes="320px" />
            <span className={s.megaCaption}>{cat.lead}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
