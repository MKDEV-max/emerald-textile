/** 5490 → «5 490 ₽» (неразрывные пробелы, как в брендбуке) */
export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(value).replace(/\s/g, " ")} ₽`;
}

/** Склонение: plural(5, ["товар", "товара", "товаров"]) → «товаров» */
export function plural(n: number, forms: [string, string, string]): string {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

export function countLabel(n: number, forms: [string, string, string]): string {
  return `${n} ${plural(n, forms)}`;
}

export const PRODUCT_FORMS: [string, string, string] = ["товар", "товара", "товаров"];

const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

/** «2026-09-18» → «18 сентября 2026» */
export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function stockLabel(stock: number): { text: string; tone: "ok" | "low" | "out" } {
  if (stock <= 0) return { text: "Нет в наличии", tone: "out" };
  if (stock <= 5) return { text: `Осталось ${countLabel(stock, ["штука", "штуки", "штук"])}`, tone: "low" };
  return { text: "В наличии", tone: "ok" };
}
