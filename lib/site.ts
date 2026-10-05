/**
 * Настройки сайта.
 *
 * DEMO: это демонстрационная витрина. Реальных контактов, шоурума и приёма
 * платежей нет, поэтому поля контактов пустые — соответствующие блоки
 * не выводятся вовсе, вместо того чтобы показывать шаблонные «+7 (000)…».
 * Для запуска заполните значения и подключите API в lib/api/orders.ts.
 */
export const SITE = {
  name: "Emerald Textile",
  demo: true,
  contacts: {
    email: null as string | null,
    phone: null as string | null,
    showroom: null as string | null,
  },
  freeShippingFrom: 10000,
};

export const DEMO_NOTE =
  "Демонстрационная витрина: товары, цены и характеристики иллюстративные, заказы и оплата не обрабатываются.";
