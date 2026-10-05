import type { ColorKey } from "../types";

/** Цвета изделий: натуральная палитра бренда. hex — образец для свотча. */
export const COLORS: Record<ColorKey, { name: string; hex: string }> = {
  white: { name: "Белый", hex: "#F2EFE8" },
  milk: { name: "Молочный", hex: "#ECE4D4" },
  beige: { name: "Бежевый", hex: "#DACBB2" },
  sand: { name: "Песочный", hex: "#C7B392" },
  taupe: { name: "Тауп", hex: "#8A765C" },
  walnut: { name: "Ореховый", hex: "#685446" },
  sage: { name: "Шалфей", hex: "#98A38C" },
  emerald: { name: "Изумрудный", hex: "#1C563E" },
};

export const COLOR_ORDER: ColorKey[] = [
  "white",
  "milk",
  "beige",
  "sand",
  "taupe",
  "walnut",
  "sage",
  "emerald",
];
