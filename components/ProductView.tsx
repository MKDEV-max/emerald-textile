"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ColorKey, Product } from "@/lib/types";
import { COLORS } from "@/lib/data/colors";
import { categoryName } from "@/lib/data/categories";
import { getCollection } from "@/lib/data/collections";
import { priceFor, productGallery } from "@/lib/catalog";
import { formatPrice, stockLabel } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Accordion, type AccordionItem } from "./Accordion";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
import { ProductGallery } from "./ProductGallery";
import { ColorSwatchGroup, QuantitySelector, Tag } from "./ui";
import s from "./ProductView.module.css";

export function ProductView({ product: p, details }: { product: Product; details: AccordionItem[] }) {
  const { addToCart, toggleWish, isWished, notify, openPanel, ready } = useStore();
  const [color, setColor] = useState<ColorKey>(p.colors[0]);
  const [size, setSize] = useState(p.sizes[0].label);
  const [qty, setQty] = useState(1);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);

  /* цвет из ссылки ?color=… */
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("color") as ColorKey | null;
    if (c && p.colors.includes(c)) setColor(c);
  }, [p.colors]);

  /* мобильная sticky-панель, когда основная кнопка ушла из вида */
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const images = useMemo(() => productGallery(p, color), [p, color]);
  const price = priceFor(p, size);
  const stock = stockLabel(p.stock);
  const out = p.stock <= 0;
  const wished = ready && isWished(p.slug);
  const collection = getCollection(p.collection);

  const changeColor = (c: ColorKey) => {
    setColor(c);
    const url = new URL(window.location.href);
    if (c === p.colors[0]) url.searchParams.delete("color");
    else url.searchParams.set("color", c);
    window.history.replaceState(null, "", url);
  };

  const add = () => {
    addToCart(p.slug, color, size, qty);
    notify({
      title: "Добавлено в корзину",
      text: `${p.name} · ${COLORS[color].name.toLowerCase()} · ${size}${qty > 1 ? ` · ${qty} шт.` : ""}`,
      action: { label: "Открыть корзину", onClick: () => openPanel("cart") },
    });
  };

  const wish = () => {
    toggleWish(p.slug);
    notify({ title: wished ? "Удалено из избранного" : "Добавлено в избранное", text: p.name });
  };

  return (
    <div className={s.layout}>
      <div className={s.gallery}>
        <ProductGallery images={images} name={p.name} />
      </div>

      <div className={s.info}>
        <div className={s.sticky}>
          <div className={s.tags}>
            {p.newArrival && <Tag tone="solid">Новинка</Tag>}
            {p.bestseller && <Tag>Бестселлер</Tag>}
            {p.oldPrice && <Tag tone="cream">Распродажа</Tag>}
            <Tag tone="muted">Арт. {p.id.toUpperCase()}</Tag>
          </div>

          <h1 className={`t-h2 ${s.title}`}>{p.name}</h1>
          <p className={s.meta}>
            <Link href={`/catalog/${p.category}`} className="link-underline">
              {categoryName(p.category)}
            </Link>
            {collection && (
              <>
                {" · "}
                <Link href={`/collections/${collection.slug}`} className="link-underline">
                  Коллекция «{collection.name}»
                </Link>
              </>
            )}
          </p>

          <p className={s.price}>
            <span>{formatPrice(price)}</span>
            {p.oldPrice && size === p.sizes[0].label && (
              <s className={s.oldPrice}>
                <span className="visually-hidden">Старая цена: </span>
                {formatPrice(p.oldPrice)}
              </s>
            )}
          </p>
          <p className={s.short}>
            {p.short} · {p.composition}
          </p>

          <div className={s.option}>
            <p className={s.optionLabel} id="color-label">
              Цвет: <strong>{COLORS[color].name}</strong>
            </p>
            <ColorSwatchGroup colors={p.colors} value={color} onChange={changeColor} label="Цвет" />
          </div>

          <div className={s.option}>
            <p className={s.optionLabel} id="size-label">
              Размер{p.sizes.length > 1 ? "" : `: ${p.sizes[0].label}`}
            </p>
            {p.sizes.length > 1 && (
              <div className={s.sizes} role="radiogroup" aria-labelledby="size-label">
                {p.sizes.map((sz) => (
                  <button
                    key={sz.label}
                    type="button"
                    role="radio"
                    aria-checked={size === sz.label}
                    className={s.size}
                    onClick={() => setSize(sz.label)}
                  >
                    {sz.label}
                    {sz.price && sz.price !== p.price && <span className={s.sizePrice}>{formatPrice(sz.price)}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className={`${s.stock} ${s[`stock_${stock.tone}`]}`}>
            <span className={s.stockDot} aria-hidden="true" />
            {stock.text}
            {!out && <span className={s.stockNote}> · отправим в течение 1–2 дней</span>}
          </p>

          <div className={s.buy} ref={buyRef}>
            {!out && <QuantitySelector value={qty} onChange={setQty} max={Math.min(20, p.stock)} />}
            {out ? (
              <Button variant="secondary" block onClick={() => setNotifyOpen(true)} arrow={false}>
                Сообщить о поступлении
              </Button>
            ) : (
              <Button block onClick={add}>
                Добавить в корзину
              </Button>
            )}
            <button
              type="button"
              className={`${s.wish} ${wished ? s.wished : ""}`}
              onClick={wish}
              aria-pressed={wished}
              aria-label={wished ? "Убрать из избранного" : "Добавить в избранное"}
            >
              <Icon name="heart" size={22} />
            </button>
          </div>

          <ul className={s.service}>
            <li>
              <Icon name="truck" size={20} /> Доставка по России 1–5 дней · бесплатно от 10 000 ₽
            </li>
            <li>
              <Icon name="returns" size={20} /> Возврат и обмен в течение 14 дней
            </li>
            <li>
              <Icon name="package" size={20} /> В многоразовом мешке Emerald Textile
            </li>
          </ul>

          <Accordion items={details} defaultOpen={["description"]} />
        </div>
      </div>

      {/* Мобильная sticky-панель покупки */}
      <div className={`${s.stickyBar} ${showSticky ? s.stickyBarVisible : ""}`} aria-hidden={!showSticky}>
        <div className={s.stickyText}>
          <span className={s.stickyName}>{p.name}</span>
          <span className={s.stickyPrice}>
            {formatPrice(price)} · {COLORS[color].name.toLowerCase()} · {size}
          </span>
        </div>
        {out ? (
          <Button size="s" variant="secondary" arrow={false} onClick={() => setNotifyOpen(true)} tabIndex={showSticky ? 0 : -1}>
            Сообщить
          </Button>
        ) : (
          <Button size="s" onClick={add} arrow={false} tabIndex={showSticky ? 0 : -1}>
            В корзину
          </Button>
        )}
      </div>

      <Modal open={notifyOpen} onClose={() => setNotifyOpen(false)} labelledBy="notify-title" variant="center">
        <NotifyForm productName={p.name} onDone={() => setNotifyOpen(false)} />
      </Modal>
    </div>
  );
}

function NotifyForm({ productName, onDone }: { productName: string; onDone: () => void }) {
  const { notify } = useStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Введите корректный email — например, name@mail.ru");
      return;
    }
    notify({ title: "Запрос сохранён", text: "В демо-витрине уведомления не отправляются" });
    onDone();
  };
  return (
    <form className={s.notify} onSubmit={submit} noValidate>
      <h2 id="notify-title" className="t-h3">
        Сообщить о поступлении
      </h2>
      <p className="t-body-s t-strong">
        «{productName}» временно нет в наличии. Оставьте email — в рабочей версии магазина мы напишем, когда изделие вернётся.
      </p>
      <div className="field">
        <label className="field-label" htmlFor="notify-email">
          Email
        </label>
        <input
          id="notify-email"
          className="input"
          type="email"
          autoComplete="email"
          placeholder="name@mail.ru"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          aria-invalid={!!error}
          aria-describedby={error ? "notify-err" : undefined}
        />
        {error && (
          <p id="notify-err" className="field-error" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className={s.notifyActions}>
        <Button type="submit">Подписаться</Button>
        <Button variant="link" arrow={false} onClick={onDone}>
          Отмена
        </Button>
      </div>
    </form>
  );
}

export function DetailsTable({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className={s.table}>
      {rows.map((r) => (
        <div key={r.label} className={s.row}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
