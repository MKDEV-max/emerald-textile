"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProduct } from "@/lib/data/products";
import { countLabel, formatPrice, PRODUCT_FORMS } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/editorial";
import { EmptyState, LoadingState, Tag } from "@/components/ui";
import s from "./account.module.css";

interface Profile {
  name: string;
  email: string;
  phone: string;
}

const KEY = "et:profile";
const TABS = [
  { id: "orders", label: "Заказы" },
  { id: "profile", label: "Профиль" },
] as const;

export function AccountView() {
  const { ready, orders, wishlist, notify } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("orders");
  const [profile, setProfile] = useState<Profile>({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      /* нет доступа к хранилищу */
    }
  }, []);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(profile.email)) {
      setError("Проверьте email — например, name@mail.ru");
      return;
    }
    setError("");
    try {
      localStorage.setItem(KEY, JSON.stringify(profile));
    } catch {
      /* приватный режим */
    }
    notify({ title: "Профиль сохранён" });
  };

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const next = TABS[(i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length];
      setTab(next.id);
      document.getElementById(`tab-${next.id}`)?.focus();
    }
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Личный кабинет" }]}
        title={profile.name ? `Здравствуйте, ${profile.name}` : "Личный кабинет"}
        lead="Заказы, контактные данные и избранное. Информация хранится в этом браузере."
      />
      <div className={`container ${s.page}`}>
        <div className={s.layout}>
          <nav className={s.side} aria-label="Разделы кабинета">
            <div role="tablist" aria-orientation="vertical" className={s.tabs}>
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  id={`tab-${t.id}`}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={tab === t.id ? 0 : -1}
                  className={s.tab}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  {t.label}
                  {t.id === "orders" && ready && orders.length > 0 && <span className={s.count}>{orders.length}</span>}
                </button>
              ))}
            </div>
            <Link href="/wishlist" className={s.sideLink}>
              <Icon name="heart" size={18} /> Избранное {ready && wishlist.length > 0 && `(${wishlist.length})`}
            </Link>
            <Link href="/delivery" className={s.sideLink}>
              <Icon name="returns" size={18} /> Доставка и возврат
            </Link>
          </nav>

          <div className={s.main}>
            {tab === "orders" && (
              <section id="panel-orders" role="tabpanel" aria-labelledby="tab-orders">
                {!ready ? (
                  <LoadingState />
                ) : orders.length === 0 ? (
                  <EmptyState
                    icon="package"
                    title="Заказов пока нет"
                    text="Когда вы оформите первый заказ, он появится здесь вместе со статусом доставки."
                    action={{ label: "В каталог", href: "/catalog" }}
                  />
                ) : (
                  <ul className={s.orders}>
                    {orders.map((o) => (
                      <li key={o.number} className={s.order}>
                        <div className={s.orderHead}>
                          <div>
                            <p className="t-label">Заказ {o.number}</p>
                            <p className="t-caption t-muted">
                              {new Date(o.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })} ·{" "}
                              {o.delivery} · {o.payment}
                            </p>
                          </div>
                          <Tag tone="solid">Собираем</Tag>
                        </div>
                        <ul className={s.orderLines}>
                          {o.lines.map((l) => {
                            const p = getProduct(l.slug);
                            return p ? (
                              <li key={l.id}>
                                <Link href={`/product/${p.slug}`} className="link-underline">
                                  {p.name}
                                </Link>{" "}
                                <span className="t-muted">
                                  · {l.size} · {l.qty} шт.
                                </span>
                              </li>
                            ) : null;
                          })}
                        </ul>
                        <p className={s.orderTotal}>
                          {countLabel(
                            o.lines.reduce((n, l) => n + l.qty, 0),
                            PRODUCT_FORMS,
                          )}{" "}
                          · <strong>{formatPrice(o.total)}</strong>
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {tab === "profile" && (
              <section id="panel-profile" role="tabpanel" aria-labelledby="tab-profile">
                <form className={s.form} onSubmit={save} noValidate>
                  <div className="field">
                    <label className="field-label" htmlFor="p-name">
                      Имя
                    </label>
                    <input
                      id="p-name"
                      className="input"
                      autoComplete="given-name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="p-email">
                      Email
                    </label>
                    <input
                      id="p-email"
                      className="input"
                      type="email"
                      autoComplete="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      aria-invalid={!!error}
                      aria-describedby={error ? "p-email-err" : undefined}
                    />
                    {error && (
                      <p id="p-email-err" className="field-error" role="alert">
                        {error}
                      </p>
                    )}
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="p-phone">
                      Телефон
                    </label>
                    <input
                      id="p-phone"
                      className="input"
                      type="tel"
                      autoComplete="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Button type="submit" arrow={false}>
                      Сохранить
                    </Button>
                  </div>
                </form>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
