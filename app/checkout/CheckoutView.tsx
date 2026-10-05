"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Order } from "@/lib/types";
import { getProduct } from "@/lib/data/products";
import { COLORS } from "@/lib/data/colors";
import { priceFor, productGallery } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Button } from "@/components/Button";
import { FREE_SHIPPING } from "@/components/CartLines";
import { Icon } from "@/components/Icon";
import { NumberedModules } from "@/components/editorial";
import { Breadcrumbs, EmptyState, LoadingState, Wave } from "@/components/ui";
import s from "./checkout.module.css";

const DELIVERY = [
  { id: "courier", title: "Курьером", text: "Москва — 1–2 дня, Россия — 2–5 дней", price: 590 },
  { id: "pickup", title: "В пункт выдачи", text: "Более 20 000 пунктов по России, 2–6 дней", price: 290 },
  { id: "showroom", title: "Самовывоз из шоурума", text: "Москва, ежедневно с 10:00 до 21:00", price: 0 },
] as const;

const PAYMENT = [
  { id: "card", title: "Картой онлайн", text: "Visa, Mastercard, «Мир»" },
  { id: "sbp", title: "Через СБП", text: "Оплата по QR-коду в приложении банка" },
  { id: "cash", title: "При получении", text: "Картой или наличными курьеру" },
] as const;

type Field = "firstName" | "lastName" | "phone" | "email" | "city" | "address";

const LABELS: Record<Field, string> = {
  firstName: "Имя",
  lastName: "Фамилия",
  phone: "Телефон",
  email: "Email",
  city: "Город",
  address: "Адрес",
};

function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (!d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);
  const p = d.slice(1);
  let out = "+7";
  if (p.length) out += ` (${p.slice(0, 3)}`;
  if (p.length >= 3) out += ")";
  if (p.length > 3) out += ` ${p.slice(3, 6)}`;
  if (p.length > 6) out += `-${p.slice(6, 8)}`;
  if (p.length > 8) out += `-${p.slice(8, 10)}`;
  return out;
}

function validate(v: Record<Field, string>, delivery: string): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (v.firstName.trim().length < 2) e.firstName = "Укажите имя";
  if (v.lastName.trim().length < 2) e.lastName = "Укажите фамилию";
  if (v.phone.replace(/\D/g, "").length !== 11) e.phone = "Введите телефон полностью: +7 (000) 000-00-00";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Проверьте email — например, name@mail.ru";
  if (delivery !== "showroom") {
    if (v.city.trim().length < 2) e.city = "Укажите город";
    if (v.address.trim().length < 5) e.address = "Укажите улицу, дом и квартиру";
  }
  return e;
}

export function CheckoutView() {
  const { ready, cart, cartTotal, clearCart, saveOrder } = useStore();
  const [values, setValues] = useState<Record<Field, string>>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "Москва",
    address: "",
  });
  const [comment, setComment] = useState("");
  const [delivery, setDelivery] = useState<(typeof DELIVERY)[number]["id"]>("courier");
  const [payment, setPayment] = useState<(typeof PAYMENT)[number]["id"]>("card");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Order | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const d = DELIVERY.find((x) => x.id === delivery)!;
  const deliveryPrice = cartTotal >= FREE_SHIPPING || d.price === 0 ? 0 : d.price;
  const total = cartTotal + deliveryPrice;

  const set = (k: Field, v: string) => {
    const next = { ...values, [k]: k === "phone" ? formatPhone(v) : v };
    setValues(next);
    if (touched) setErrors(validate(next, delivery));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(values, delivery);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      const order: Order = {
        number: `ET-${String(Date.now()).slice(-6)}`,
        createdAt: new Date().toISOString(),
        lines: cart,
        total,
        delivery: d.title,
        payment: PAYMENT.find((p) => p.id === payment)!.title,
        name: values.firstName.trim(),
        city: delivery === "showroom" ? "Москва" : values.city.trim(),
      };
      saveOrder(order);
      clearCart();
      setSending(false);
      setDone(order);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  if (done) return <Success order={done} email={values.email} />;

  return (
    <div className={`container ${s.page}`}>
      <div className={s.head}>
        <Breadcrumbs items={[{ label: "Корзина", href: "/cart" }, { label: "Оформление заказа" }]} />
        <h1 className="t-h1">Оформление заказа</h1>
      </div>

      {!ready ? (
        <LoadingState label="Загружаем корзину…" />
      ) : cart.length === 0 ? (
        <EmptyState
          icon="bag"
          title="Корзина пуста"
          text="Чтобы оформить заказ, добавьте товары из каталога."
          action={{ label: "В каталог", href: "/catalog" }}
        />
      ) : (
        <form ref={formRef} className={s.layout} onSubmit={submit} noValidate>
          <div className={s.form}>
            {touched && Object.keys(errors).length > 0 && (
              <div className={s.errorSummary} role="alert">
                <p className="t-label">Проверьте форму</p>
                <ul>
                  {Object.entries(errors).map(([k, msg]) => (
                    <li key={k}>
                      <a href={`#f-${k}`}>
                        {LABELS[k as Field]}: {msg}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <fieldset className={s.fieldset}>
              <legend className={s.legend}>
                <span className={s.step}>01</span> Контактные данные
              </legend>
              <div className={s.fields}>
                {(["firstName", "lastName", "phone", "email"] as Field[]).map((k) => (
                  <div key={k} className="field">
                    <label className="field-label" htmlFor={`f-${k}`}>
                      {LABELS[k]}
                    </label>
                    <input
                      id={`f-${k}`}
                      name={k}
                      className="input"
                      value={values[k]}
                      onChange={(e) => set(k, e.target.value)}
                      type={k === "email" ? "email" : k === "phone" ? "tel" : "text"}
                      inputMode={k === "phone" ? "tel" : k === "email" ? "email" : undefined}
                      autoComplete={{ firstName: "given-name", lastName: "family-name", phone: "tel", email: "email", city: "address-level2", address: "street-address" }[k]}
                      placeholder={{ firstName: "Анна", lastName: "Изумрудова", phone: "+7 (000) 000-00-00", email: "name@mail.ru", city: "", address: "" }[k]}
                      aria-invalid={!!errors[k]}
                      aria-describedby={errors[k] ? `e-${k}` : undefined}
                      required
                    />
                    {errors[k] && (
                      <p id={`e-${k}`} className="field-error">
                        {errors[k]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className={s.fieldset}>
              <legend className={s.legend}>
                <span className={s.step}>02</span> Способ доставки
              </legend>
              <div className={s.options} role="radiogroup">
                {DELIVERY.map((o) => {
                  const price = o.price === 0 || cartTotal >= FREE_SHIPPING ? "Бесплатно" : formatPrice(o.price);
                  return (
                    <label key={o.id} className={s.option}>
                      <input type="radio" name="delivery" value={o.id} checked={delivery === o.id} onChange={() => setDelivery(o.id)} />
                      <span className={s.optionMark} aria-hidden="true" />
                      <span className={s.optionText}>
                        <span className={s.optionTitle}>{o.title}</span>
                        <span className={s.optionSub}>{o.text}</span>
                      </span>
                      <span className={s.optionPrice}>{price}</span>
                    </label>
                  );
                })}
              </div>
              {delivery !== "showroom" ? (
                <div className={s.fields}>
                  {(["city", "address"] as Field[]).map((k) => (
                    <div key={k} className={`field ${k === "address" ? s.wide : ""}`}>
                      <label className="field-label" htmlFor={`f-${k}`}>
                        {LABELS[k]}
                      </label>
                      <input
                        id={`f-${k}`}
                        name={k}
                        className="input"
                        value={values[k]}
                        onChange={(e) => set(k, e.target.value)}
                        autoComplete={k === "city" ? "address-level2" : "street-address"}
                        placeholder={k === "address" ? "Улица, дом, квартира" : "Город"}
                        aria-invalid={!!errors[k]}
                        aria-describedby={errors[k] ? `e-${k}` : undefined}
                        required
                      />
                      {errors[k] && (
                        <p id={`e-${k}`} className="field-error">
                          {errors[k]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={s.note}>
                  <Icon name="pin" size={20} /> Шоурум Emerald Textile: Москва, ул. Садовая, 1. Заказ будет готов к выдаче через 2 часа — мы пришлём
                  сообщение.
                </p>
              )}
            </fieldset>

            <fieldset className={s.fieldset}>
              <legend className={s.legend}>
                <span className={s.step}>03</span> Способ оплаты
              </legend>
              <div className={s.options} role="radiogroup">
                {PAYMENT.map((o) => (
                  <label key={o.id} className={s.option}>
                    <input type="radio" name="payment" value={o.id} checked={payment === o.id} onChange={() => setPayment(o.id)} />
                    <span className={s.optionMark} aria-hidden="true" />
                    <span className={s.optionText}>
                      <span className={s.optionTitle}>{o.title}</span>
                      <span className={s.optionSub}>{o.text}</span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="field">
                <label className="field-label" htmlFor="f-comment">
                  Комментарий к заказу
                </label>
                <textarea
                  id="f-comment"
                  className="textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Например, удобное время доставки"
                  rows={3}
                />
              </div>
            </fieldset>
          </div>

          <aside className={s.summary} aria-label="Ваш заказ">
            <div className={s.summaryInner}>
              <div className={s.summaryHead}>
                <h2 className="t-h3">Ваш заказ</h2>
                <Link href="/cart" className={s.textBtn}>
                  Изменить
                </Link>
              </div>
              <ul className={s.mini}>
                {cart.map((l) => {
                  const p = getProduct(l.slug);
                  if (!p) return null;
                  const img = productGallery(p, l.color).find((i) => i.kind === "macro")!;
                  return (
                    <li key={l.id} className={s.miniLine}>
                      <span className={s.miniThumb}>
                        <Image src={img.src} alt="" fill sizes="56px" />
                        <span className={s.miniQty}>{l.qty}</span>
                      </span>
                      <span className={s.miniText}>
                        <span className={s.miniName}>{p.name}</span>
                        <span className={s.miniMeta}>
                          {COLORS[l.color].name} · {l.size}
                        </span>
                      </span>
                      <span className={s.miniPrice}>{formatPrice(priceFor(p, l.size) * l.qty)}</span>
                    </li>
                  );
                })}
              </ul>
              <dl className={s.totals}>
                <div>
                  <dt>Товары</dt>
                  <dd>{formatPrice(cartTotal)}</dd>
                </div>
                <div>
                  <dt>Доставка</dt>
                  <dd>{deliveryPrice ? formatPrice(deliveryPrice) : "Бесплатно"}</dd>
                </div>
                <div className={s.grand}>
                  <dt>Итого</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>
              <Button type="submit" block loading={sending} disabled={sending}>
                Оформить заказ
              </Button>
              <p className={s.legal}>Нажимая кнопку, вы соглашаетесь с условиями продажи и обработкой персональных данных.</p>
            </div>
          </aside>
        </form>
      )}
    </div>
  );
}

function Success({ order, email }: { order: Order; email: string }) {
  return (
    <div className={s.success}>
      <div className={`container ${s.successInner}`}>
        <span className={s.successIcon}>
          <Icon name="check" size={32} />
        </span>
        <p className="t-label">Заказ {order.number}</p>
        <h1 className="t-display-l">Спасибо, {order.name}!</h1>
        <p className="t-body-l t-strong" style={{ maxWidth: "56ch" }}>
          Заказ оформлен. Мы отправили подтверждение на {email} и свяжемся с вами, чтобы уточнить детали доставки.
        </p>
        <dl className={s.successSpecs}>
          <div>
            <dt className="t-label">Сумма</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
          <div>
            <dt className="t-label">Доставка</dt>
            <dd>{order.delivery}</dd>
          </div>
          <div>
            <dt className="t-label">Оплата</dt>
            <dd>{order.payment}</dd>
          </div>
        </dl>
        <div className={s.successSteps}>
          <NumberedModules
            columns={3}
            items={[
              { title: "Собираем заказ", text: "Проверяем каждое изделие и складываем в многоразовый мешок." },
              { title: "Передаём в доставку", text: "Пришлём номер отправления в течение 1–2 дней." },
              { title: "Встречайте", text: "Постирайте текстиль перед первым использованием — он станет ещё мягче." },
            ]}
          />
        </div>
        <div className={s.successCtas}>
          <Button href="/catalog">Продолжить покупки</Button>
          <Button href="/account" variant="secondary" arrow={false}>
            Мои заказы
          </Button>
        </div>
      </div>
      <Wave tone="emerald" />
    </div>
  );
}
