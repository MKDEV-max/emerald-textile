"use client";

import { useStore } from "@/lib/store";
import { formatPrice, countLabel } from "@/lib/format";
import { Button } from "./Button";
import { CartLines, ShippingProgress } from "./CartLines";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
import { EmptyState } from "./ui";
import s from "./Drawer.module.css";

/** Корзина-drawer: модульная панель справа с рамкой 1 px. */
export function CartDrawer() {
  const { panel, closePanel, cart, cartCount, cartTotal } = useStore();
  const open = panel === "cart";

  return (
    <Modal open={open} onClose={closePanel} labelledBy="cart-title" variant="right">
      <div className={s.head}>
        <h2 id="cart-title" className="t-h3">
          Корзина
          {cartCount > 0 && <span className={s.count}> {countLabel(cartCount, ["товар", "товара", "товаров"])}</span>}
        </h2>
        <button type="button" className={s.close} onClick={closePanel} aria-label="Закрыть корзину">
          <Icon name="close" />
        </button>
      </div>

      {cart.length === 0 ? (
        <div className={s.body}>
          <EmptyState
            compact
            icon="bag"
            title="В корзине пока пусто"
            text="Загляните в каталог — там полотенца, бельё, скатерти и пледы из натуральных тканей."
          >
            <Button href="/catalog" onClick={closePanel}>
              В каталог
            </Button>
          </EmptyState>
        </div>
      ) : (
        <>
          <div className={s.notice}>
            <ShippingProgress total={cartTotal} />
          </div>
          <div className={s.body}>
            <CartLines onNavigate={closePanel} compact />
          </div>
          <div className={s.foot}>
            <div className={s.totalRow}>
              <span className="t-label">Итого</span>
              <span className={s.total}>{formatPrice(cartTotal)}</span>
            </div>
            <p className={s.hint}>Стоимость доставки рассчитаем при оформлении заказа.</p>
            <Button href="/checkout" block onClick={closePanel}>
              Оформить заказ
            </Button>
            <Button href="/cart" variant="secondary" block arrow={false} onClick={closePanel}>
              Перейти в корзину
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
