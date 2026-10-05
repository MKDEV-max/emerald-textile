"use client";

import { getProduct } from "@/lib/data/products";
import { bestsellers } from "@/lib/catalog";
import { countLabel, PRODUCT_FORMS } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { ProductRail } from "@/components/ProductGrid";
import { PageHeader } from "@/components/editorial";
import { EmptyState, LoadingState, SectionHeader } from "@/components/ui";
import s from "./wishlist.module.css";

export function WishlistView() {
  const { ready, wishlist, toggleWish, addToCart, notify, openPanel } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean) as Product[];

  const moveToCart = (p: Product) => {
    addToCart(p.slug, p.colors[0], p.sizes[0].label, 1);
    toggleWish(p.slug);
    notify({
      title: "Перенесено в корзину",
      text: p.name,
      action: { label: "Открыть корзину", onClick: () => openPanel("cart") },
    });
  };

  const moveAll = () => {
    const available = items.filter((p) => p.stock > 0);
    available.forEach((p) => {
      addToCart(p.slug, p.colors[0], p.sizes[0].label, 1);
      toggleWish(p.slug);
    });
    notify({
      title: "Перенесено в корзину",
      text: countLabel(available.length, PRODUCT_FORMS),
      action: { label: "Открыть корзину", onClick: () => openPanel("cart") },
    });
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Избранное" }]}
        title="Избранное"
        eyebrow={ready && items.length ? countLabel(items.length, PRODUCT_FORMS) : undefined}
        lead="Вещи, к которым хочется вернуться. Список сохраняется в этом браузере."
      />
      <div className={`container ${s.page}`}>
        {!ready ? (
          <LoadingState label="Загружаем избранное…" />
        ) : items.length === 0 ? (
          <EmptyState
            icon="heart"
            title="В избранном пока ничего нет"
            text="Нажмите на сердце на карточке товара, чтобы сохранить его здесь."
            action={{ label: "В каталог", href: "/catalog" }}
          />
        ) : (
          <>
            <div className={s.toolbar}>
              <p className="t-body-s t-muted">{countLabel(items.length, PRODUCT_FORMS)}</p>
              {items.some((p) => p.stock > 0) && (
                <Button variant="secondary" size="s" onClick={moveAll}>
                  Перенести всё в корзину
                </Button>
              )}
            </div>
            <ul className={s.grid}>
              {items.map((p) => (
                <li key={p.slug} className={s.item}>
                  <ProductCard product={p} />
                  <div className={s.actions}>
                    <Button size="s" block onClick={() => moveToCart(p)} disabled={p.stock <= 0} arrow={false}>
                      {p.stock > 0 ? "Перенести в корзину" : "Нет в наличии"}
                    </Button>
                    <button
                      type="button"
                      className={s.remove}
                      onClick={() => {
                        toggleWish(p.slug);
                        notify({ title: "Удалено из избранного", text: p.name, action: { label: "Вернуть", onClick: () => toggleWish(p.slug) } });
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <section className="section bg-ivory" aria-labelledby="wish-reco">
        <div className="container">
          <SectionHeader id="wish-reco" title="Вам может понравиться" />
          <ProductRail products={bestsellers().filter((p) => !wishlist.includes(p.slug)).slice(0, 4)} label="Рекомендации" />
        </div>
      </section>
    </>
  );
}
