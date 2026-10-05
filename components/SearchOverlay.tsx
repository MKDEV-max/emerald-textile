"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS } from "@/lib/data/products";
import { CATEGORIES, categoryName } from "@/lib/data/categories";
import { COLLECTIONS } from "@/lib/data/collections";
import { MATERIALS } from "@/lib/data/materials";
import { matchesQuery, minPrice, productGallery, sortProducts } from "@/lib/catalog";
import { countLabel, formatPrice, PRODUCT_FORMS } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
import s from "./SearchOverlay.module.css";

const POPULAR = ["Полотенца", "Лён", "Плед", "Халат", "Скатерть", "Постельное бельё"];

function norm(v: string) {
  return v.toLowerCase().replace(/ё/g, "е").trim();
}

export function SearchOverlay() {
  const { panel, closePanel } = useStore();
  const router = useRouter();
  const open = panel === "search";
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const query = q.trim();

  const results = useMemo(() => {
    if (query.length < 2) return null;
    const n = norm(query);
    const products = sortProducts(PRODUCTS.filter((p) => matchesQuery(p, query)), "popular");
    const cats = CATEGORIES.filter((c) => norm(c.name).includes(n) || c.subcategories.some((x) => norm(x.name).includes(n)));
    const cols = COLLECTIONS.filter((c) => norm(c.name).includes(n) || c.materials.some((m) => norm(m).includes(n)));
    const mats = MATERIALS.filter((m) => norm(m.name).includes(n) || m.filterNames.some((f) => norm(f).includes(n)));
    return { products, cats, cols, mats };
  }, [query]);

  const go = (href: string) => {
    closePanel();
    router.push(href);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) go(`/catalog?q=${encodeURIComponent(query)}`);
  };

  return (
    <Modal open={open} onClose={closePanel} label="Поиск по каталогу" variant="top" initialFocus={input}>
      <div className={`container ${s.inner}`}>
        <form role="search" className={s.form} onSubmit={submit}>
          <label htmlFor="site-search" className="visually-hidden">
            Поиск по названию, категории, коллекции или материалу
          </label>
          <Icon name="search" size={28} className={s.formIcon} />
          <input
            ref={input}
            id="site-search"
            className={s.input}
            type="search"
            placeholder="Что вы ищете?"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-describedby="search-status"
          />
          {q && (
            <button type="button" className={s.clear} onClick={() => setQ("")}>
              Очистить
            </button>
          )}
          <button type="button" className={s.close} onClick={closePanel} aria-label="Закрыть поиск">
            <Icon name="close" />
          </button>
        </form>

        <p id="search-status" className="visually-hidden" aria-live="polite">
          {results ? (results.products.length ? `Найдено: ${countLabel(results.products.length, PRODUCT_FORMS)}` : "Ничего не найдено") : ""}
        </p>

        <div className={s.content}>
          {!results && (
            <div className={s.idle}>
              <div>
                <h2 className={s.groupTitle}>Часто ищут</h2>
                <ul className={s.chips}>
                  {POPULAR.map((p) => (
                    <li key={p}>
                      <button type="button" className={s.chip} onClick={() => setQ(p)}>
                        {p}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className={s.groupTitle}>Категории</h2>
                <ul className={s.linkList}>
                  {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/catalog/${c.slug}`} onClick={closePanel} className={s.bigLink}>
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className={s.groupTitle}>Коллекции</h2>
                <ul className={s.linkList}>
                  {COLLECTIONS.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/collections/${c.slug}`} onClick={closePanel} className={s.bigLink}>
                        «{c.name}»
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {results && results.products.length === 0 && results.cats.length + results.cols.length + results.mats.length === 0 && (
            <div className={s.nothing}>
              <h2 className="t-h3">По запросу «{query}» ничего не найдено</h2>
              <p className="t-body t-strong">Проверьте написание или попробуйте более общий запрос — например, «полотенце» или «лён».</p>
              <ul className={s.chips}>
                {POPULAR.slice(0, 4).map((p) => (
                  <li key={p}>
                    <button type="button" className={s.chip} onClick={() => setQ(p)}>
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results && (results.products.length > 0 || results.cats.length + results.cols.length + results.mats.length > 0) && (
            <div className={s.results}>
              <div className={s.side}>
                {results.cats.length > 0 && (
                  <div>
                    <h2 className={s.groupTitle}>Категории</h2>
                    <ul className={s.linkList}>
                      {results.cats.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/catalog/${c.slug}`} onClick={closePanel} className="link-underline">
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.cols.length > 0 && (
                  <div>
                    <h2 className={s.groupTitle}>Коллекции</h2>
                    <ul className={s.linkList}>
                      {results.cols.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/collections/${c.slug}`} onClick={closePanel} className="link-underline">
                            «{c.name}»
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.mats.length > 0 && (
                  <div>
                    <h2 className={s.groupTitle}>Материалы</h2>
                    <ul className={s.linkList}>
                      {results.mats.map((m) => (
                        <li key={m.slug}>
                          <Link href={`/materials#${m.slug}`} onClick={closePanel} className="link-underline">
                            {m.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={s.main}>
                <div className={s.mainHead}>
                  <h2 className={s.groupTitle}>Товары · {results.products.length}</h2>
                  {results.products.length > 0 && (
                    <button type="button" className={s.all} onClick={() => go(`/catalog?q=${encodeURIComponent(query)}`)}>
                      Все результаты <Icon name="arrowRight" size={14} stroke={1.5} />
                    </button>
                  )}
                </div>
                {results.products.length === 0 ? (
                  <p className="t-body-s t-muted">Товаров с таким названием нет — посмотрите разделы слева.</p>
                ) : (
                  <ul className={s.productList}>
                    {results.products.slice(0, 6).map((p) => {
                      const img = productGallery(p)[0];
                      return (
                        <li key={p.slug}>
                          <Link href={`/product/${p.slug}`} onClick={closePanel} className={s.product}>
                            <span className={s.thumb}>
                              <Image src={img.src} alt="" fill sizes="64px" />
                            </span>
                            <span className={s.productText}>
                              <span className={s.productName}>{p.name}</span>
                              <span className={s.productMeta}>
                                {categoryName(p.category)} · {p.material}
                              </span>
                            </span>
                            <span className={s.productPrice}>{formatPrice(minPrice(p))}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
