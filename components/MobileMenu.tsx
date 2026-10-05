"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/data/categories";
import { useStore } from "@/lib/store";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Modal } from "./Modal";
import { NAV } from "./Header";
import s from "./MobileMenu.module.css";

export function MobileMenu() {
  const { panel, closePanel, openPanel, wishlist, ready } = useStore();
  const pathname = usePathname();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const open = panel === "menu";

  useEffect(() => {
    if (open) closePanel();
    // закрываем меню при переходе на другую страницу
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Modal open={open} onClose={closePanel} label="Меню" variant="left">
      <div className={s.head}>
        <Logo variant="lockup" height={40} />
        <button type="button" className={s.close} onClick={closePanel} aria-label="Закрыть меню">
          <Icon name="close" />
        </button>
      </div>

      <nav className={s.nav} aria-label="Мобильная навигация">
        <ul>
          {NAV.map((item) =>
            item.mega ? (
              <li key={item.href} className={s.item}>
                <button
                  type="button"
                  className={s.link}
                  aria-expanded={catalogOpen}
                  aria-controls="mobile-catalog"
                  onClick={() => setCatalogOpen((v) => !v)}
                >
                  {item.label}
                  <Icon name={catalogOpen ? "minus" : "plus"} size={20} />
                </button>
                <div id="mobile-catalog" className={s.sub} hidden={!catalogOpen}>
                  <Link href="/catalog" className={s.subAll}>
                    Весь каталог <Icon name="arrowRight" size={14} stroke={1.5} />
                  </Link>
                  {CATEGORIES.map((c) => (
                    <div key={c.slug} className={s.subGroup}>
                      <Link href={`/catalog/${c.slug}`} className={s.subTitle}>
                        {c.name}
                      </Link>
                      <ul className={s.subList}>
                        {c.subcategories.map((x) => (
                          <li key={x.slug}>
                            <Link href={`/catalog/${c.slug}?type=${x.slug}`}>{x.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </li>
            ) : (
              <li key={item.href} className={s.item}>
                <Link href={item.href} className={s.link} aria-current={pathname.startsWith(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>

      <div className={s.service}>
        <button type="button" className={s.serviceLink} onClick={() => openPanel("search")}>
          <Icon name="search" size={20} /> Поиск
        </button>
        <Link href="/wishlist" className={s.serviceLink}>
          <Icon name="heart" size={20} /> Избранное{ready && wishlist.length ? ` (${wishlist.length})` : ""}
        </Link>
        <Link href="/account" className={s.serviceLink}>
          <Icon name="user" size={20} /> Личный кабинет
        </Link>
        <Link href="/delivery" className={s.serviceLink}>
          <Icon name="truck" size={20} /> Доставка и возврат
        </Link>
      </div>

    </Modal>
  );
}
