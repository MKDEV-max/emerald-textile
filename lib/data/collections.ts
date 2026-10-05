import type { Collection } from "../types";
import { PHOTOS, textureImage } from "./images";

export const COLLECTIONS: Collection[] = [
  {
    slug: "s-kruzhevom",
    name: "С кружевом",
    season: "Осень 2026",
    lead: "Полисатин и тонкое кружево по краю.",
    description:
      "Главная коллекция сезона. Одеяла, бельё и скатерти с кружевной каймой ручной работы — мягкий свет, спокойные складки и деталь, которую замечаешь не сразу. Каждый предмет упакован в многоразовый мешок Emerald Textile.",
    materials: ["Полисатин", "Хлопок-дак", "Хлопковое кружево"],
    palette: ["white", "milk", "beige"],
    image: PHOTOS.bedroomLace,
    detail: PHOTOS.diningTable,
  },
  {
    slug: "slonovaya-kost",
    name: "Слоновая кость",
    season: "Базовая коллекция",
    lead: "Спальня в тонах слоновой кости.",
    description:
      "Сатин с мягким блеском, объёмная стёжка и покрывала, в которых тонет ладонь. Тёплые белые и молочные оттенки собирают спальню в одно спокойное целое.",
    materials: ["Сатин", "Хлопок", "Стёганое полотно"],
    palette: ["white", "milk", "beige", "sand"],
    image: PHOTOS.bedroomStory,
    detail: PHOTOS.bedroomQuilt,
  },
  {
    slug: "teply-len",
    name: "Тёплый лён",
    season: "Весна — лето 2026",
    lead: "Лён, который становится мягче с каждой стиркой.",
    description:
      "Постельное бельё, скатерти, салфетки и простыни из стираного льна. Естественные складки, матовая фактура и песочные оттенки — для дома, где ценят живые материалы.",
    materials: ["Лён", "Лён с хлопком"],
    palette: ["white", "sand", "taupe", "sage"],
    image: textureImage("linen-sand", "Стираный лён песочного цвета: матовая фактура и мягкие складки"),
    detail: textureImage("linen-beige", "Льняное полотно бежевого цвета крупным планом"),
  },
  {
    slug: "volna",
    name: "Волна",
    season: "Ванная комната",
    lead: "Махра и вафля для ежедневного ритуала.",
    description:
      "Коллекция для ванной, названная в честь фирменной гравюрной волны. Плотная махра 600 г/м², лёгкое вафельное полотно и коврики с глубокой петлёй — от белого до изумрудного.",
    materials: ["Махра", "Вафельное полотно"],
    palette: ["white", "milk", "sage", "emerald"],
    image: textureImage("terry-emerald", "Изумрудная махровая ткань крупным планом"),
    detail: textureImage("waffle-sage", "Вафельное полотно цвета шалфея"),
  },
  {
    slug: "lesnoy-vecher",
    name: "Лесной вечер",
    season: "Осень — зима 2026",
    lead: "Пледы и наволочки в тонах ореха и изумруда.",
    description:
      "Крупная вязка с косами, хлопковая «ёлочка» и плотный лён. Тёплые, глубокие оттенки для долгих вечеров в гостиной — с книгой, чаем и тишиной.",
    materials: ["Хлопок", "Лён", "Хлопок с шерстью"],
    palette: ["walnut", "taupe", "sand", "emerald"],
    image: PHOTOS.knitThrow,
    detail: textureImage("herringbone-emerald", "Плед «ёлочка» изумрудного цвета"),
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
