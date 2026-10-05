"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CartLine, ColorKey, Order } from "./types";
import { getProduct } from "./data/products";
import { priceFor } from "./catalog";

/* ── Типы ─────────────────────────────────────────────── */

export interface Toast {
  id: number;
  title: string;
  text?: string;
  action?: { label: string; onClick: () => void };
}

type Panel = "cart" | "search" | "menu" | null;

interface StoreValue {
  ready: boolean;
  /* корзина */
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (slug: string, color: ColorKey, size: string, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  changeVariant: (id: string, color: ColorKey, size: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  /* избранное */
  wishlist: string[];
  isWished: (slug: string) => boolean;
  toggleWish: (slug: string) => void;
  /* заказы */
  orders: Order[];
  saveOrder: (o: Order) => void;
  /* панели */
  panel: Panel;
  openPanel: (p: Exclude<Panel, null>) => void;
  closePanel: () => void;
  /* уведомления */
  toasts: Toast[];
  notify: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const KEYS = { cart: "et:cart", wish: "et:wishlist", orders: "et:orders" };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* приватный режим — состояние живёт только в памяти */
  }
}

const lineId = (slug: string, color: string, size: string) => `${slug}|${color}|${size}`;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [panel, setPanel] = useState<Panel>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  /* загрузка из localStorage после монтирования (без рассинхрона SSR) */
  useEffect(() => {
    setCart(read<CartLine[]>(KEYS.cart, []).filter((l) => getProduct(l.slug)));
    setWishlist(read<string[]>(KEYS.wish, []).filter((s) => getProduct(s)));
    setOrders(read<Order[]>(KEYS.orders, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) write(KEYS.cart, cart);
  }, [cart, ready]);
  useEffect(() => {
    if (ready) write(KEYS.wish, wishlist);
  }, [wishlist, ready]);
  useEffect(() => {
    if (ready) write(KEYS.orders, orders);
  }, [orders, ready]);

  /* синхронизация между вкладками */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEYS.cart) setCart(read(KEYS.cart, []));
      if (e.key === KEYS.wish) setWishlist(read(KEYS.wish, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* блокировка прокрутки под панелями */
  useEffect(() => {
    document.body.classList.toggle("is-locked", panel !== null);
  }, [panel]);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const notify = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++toastId.current;
      setToasts((list) => [...list.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const addToCart = useCallback((slug: string, color: ColorKey, size: string, qty = 1) => {
    const id = lineId(slug, color, size);
    setCart((lines) => {
      const found = lines.find((l) => l.id === id);
      if (found) return lines.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + qty, 20) } : l));
      return [...lines, { id, slug, color, size, qty }];
    });
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setCart((lines) =>
      qty <= 0 ? lines.filter((l) => l.id !== id) : lines.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 20) } : l)),
    );
  }, []);

  const changeVariant = useCallback((id: string, color: ColorKey, size: string) => {
    setCart((lines) => {
      const line = lines.find((l) => l.id === id);
      if (!line) return lines;
      const nextId = lineId(line.slug, color, size);
      if (nextId === id) return lines;
      const existing = lines.find((l) => l.id === nextId);
      if (existing) {
        return lines
          .filter((l) => l.id !== id)
          .map((l) => (l.id === nextId ? { ...l, qty: Math.min(l.qty + line.qty, 20) } : l));
      }
      return lines.map((l) => (l.id === id ? { ...l, id: nextId, color, size } : l));
    });
  }, []);

  const removeFromCart = useCallback((id: string) => setCart((lines) => lines.filter((l) => l.id !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWish = useCallback((slug: string) => {
    setWishlist((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list]));
  }, []);

  const saveOrder = useCallback((o: Order) => setOrders((list) => [o, ...list]), []);

  const value = useMemo<StoreValue>(() => {
    const cartCount = cart.reduce((n, l) => n + l.qty, 0);
    const cartTotal = cart.reduce((sum, l) => {
      const p = getProduct(l.slug);
      return p ? sum + priceFor(p, l.size) * l.qty : sum;
    }, 0);
    return {
      ready,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      updateQty,
      changeVariant,
      removeFromCart,
      clearCart,
      wishlist,
      isWished: (slug) => wishlist.includes(slug),
      toggleWish,
      orders,
      saveOrder,
      panel,
      openPanel: (p) => setPanel(p),
      closePanel: () => setPanel(null),
      toasts,
      notify,
      dismiss,
    };
  }, [ready, cart, wishlist, orders, panel, toasts, addToCart, updateQty, changeVariant, removeFromCart, clearCart, toggleWish, saveOrder, notify, dismiss]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore должен вызываться внутри StoreProvider");
  return ctx;
}
