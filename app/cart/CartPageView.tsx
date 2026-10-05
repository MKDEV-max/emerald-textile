"use client";

import { useStore } from "@/lib/store";
import { bestsellers } from "@/lib/catalog";
import { countLabel, formatPrice, PRODUCT_FORMS } from "@/lib/format";
import { Button } from "@/components/Button";
import { CartLines, FREE_SHIPPING, ShippingProgress } from "@/components/CartLines";
import { ProductRail } from "@/components/ProductGrid";
import { PageHeader } from "@/components/editorial";
import { EmptyState, LoadingState, SectionHeader } from "@/components/ui";
import s from "../checkout/checkout.module.css";

export function CartPageView() {
  const { ready, cart, cartCount, cartTotal, clearCart, notify } = useStore();
  const delivery = cartTotal >= FREE_SHIPPING ? 0 : 590;

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Корзина" }]}
        title="Корзина"
        eyebrow={ready && cartCount ? countLabel(cartCount, PRODUCT_FORMS) : undefined}
      />
      <div className={`container ${s.page}`}>
        {!ready ? (
          <LoadingState label="Загружаем корзину…" />
        ) : cart.length === 0 ? (
          <EmptyState
            icon="bag"
            title="В корзине пока пусто"
            text="Добавьте товары из каталога — корзина сохранится, даже если вы закроете страницу."
            action={{ label: "В каталог", href: "/catalog" }}
          />
        ) : (
          <div className={s.layout}>
            <div className={s.form}>
              <CartLines />
              <button
                type="button"
                className={s.textBtn}
                onClick={() => {
                  clearCart();
                  notify({ title: "Корзина очищена" });
                }}
              >
                Очистить корзину
              </button>
            </div>
            <aside className={s.summary} aria-label="Сумма заказа">
              <div className={s.summaryInner}>
                <h2 className="t-h3">Ваш заказ</h2>
                <ShippingProgress total={cartTotal} />
                <dl className={s.totals}>
                  <div>
                    <dt>Товары ({cartCount})</dt>
                    <dd>{formatPrice(cartTotal)}</dd>
                  </div>
                  <div>
                    <dt>Доставка курьером</dt>
                    <dd>{delivery ? `от ${formatPrice(delivery)}` : "Бесплатно"}</dd>
                  </div>
                  <div className={s.grand}>
                    <dt>Итого</dt>
                    <dd>{formatPrice(cartTotal)}</dd>
                  </div>
                </dl>
                <Button href="/checkout" block>
                  Оформить заказ
                </Button>
                <Button href="/catalog" variant="link" arrow={false}>
                  Продолжить покупки
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>

      <section className="section bg-ivory" aria-labelledby="cart-reco">
        <div className="container">
          <SectionHeader id="cart-reco" title="Может пригодиться" action={{ label: "Все бестселлеры", href: "/catalog?sort=popular" }} />
          <ProductRail products={bestsellers().slice(0, 4)} label="Рекомендации" />
        </div>
      </section>
    </>
  );
}
