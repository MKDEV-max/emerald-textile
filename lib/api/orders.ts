import type { CartLine, Order } from "../types";
import { SITE } from "../site";

/**
 * Слой заказов. Сейчас — DEMO-реализация: заказ не уходит на сервер,
 * а сохраняется в браузере (через store). Чтобы подключить реальный бэкенд,
 * замените тело submitOrder на запрос к API и верните номер заказа и статус.
 */
export interface OrderPayload {
  lines: CartLine[];
  total: number;
  customer: { firstName: string; lastName: string; phone: string; email: string };
  delivery: { method: string; city: string; address: string };
  payment: string;
  comment?: string;
}

export interface OrderResult {
  ok: boolean;
  order?: Order;
  error?: string;
  demo: boolean;
}

export async function submitOrder(payload: OrderPayload): Promise<OrderResult> {
  if (!SITE.demo) {
    // Здесь будет запрос к API, например:
    // const res = await fetch("/api/orders", { method: "POST", body: JSON.stringify(payload) });
    return { ok: false, error: "API заказов не подключено", demo: false };
  }
  await new Promise((r) => setTimeout(r, 900));
  return {
    ok: true,
    demo: true,
    order: {
      number: `ДЕМО-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toISOString(),
      lines: payload.lines,
      total: payload.total,
      delivery: payload.delivery.method,
      payment: payload.payment,
      name: payload.customer.firstName,
      city: payload.delivery.city,
    },
  };
}

/** Заявки из форм (контакты, подписка, «сообщить о поступлении»). DEMO: никуда не отправляются. */
export async function submitRequest(_kind: "contact" | "newsletter" | "restock", _data: Record<string, string>) {
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true, demo: SITE.demo };
}
