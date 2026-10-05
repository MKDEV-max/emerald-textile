import type { ColorKey, ImageAsset, Weave } from "../types";
import { COLORS } from "./colors";

/**
 * Реестр изображений.
 * Фотографии в /images/brand взяты из брендбука Emerald Textile.
 * Фактуры в /images/products и /images/textures — временные процедурные
 * рендеры (scripts/generate_textiles.py). Чтобы заменить их финальной
 * съёмкой, достаточно положить файл с тем же именем.
 */
export const PHOTOS = {
  bedroomTall: {
    src: "/images/brand/bedroom-tall.jpg",
    alt: "Светлая спальня с деревянной кроватью и кремовым бельём с кружевом в дневном свете",
    kind: "interior",
  },
  bedroomStory: {
    src: "/images/brand/bedroom-story.jpg",
    alt: "Кровать с бельём цвета слоновой кости и растения у окна",
    kind: "interior",
  },
  bedroomWide: {
    src: "/images/brand/bedroom-wide.jpg",
    alt: "Спальня в тёплых тонах: деревянная мебель, лён на окнах, мягкий свет",
    kind: "interior",
  },
  bedroomLace: {
    src: "/images/brand/bedroom-lace-vertical.jpg",
    alt: "Одеяло с кружевным краем на деревянной кровати",
    kind: "lifestyle",
  },
  bedroomQuilt: {
    src: "/images/brand/bedroom-quilt.jpg",
    alt: "Стёганое одеяло молочного цвета на кровати у стены",
    kind: "lifestyle",
  },
  diningTable: {
    src: "/images/brand/dining-lace-table.jpg",
    alt: "Сервированный стол со скатертью с кружевом в светлой столовой",
    kind: "lifestyle",
  },
  diningVertical: {
    src: "/images/brand/dining-vertical.jpg",
    alt: "Белая скатерть с кружевной каймой, бокалы и зелень на столе",
    kind: "lifestyle",
  },
  pillows: {
    src: "/images/brand/pillows-stack.jpg",
    alt: "Стопка белых подушек на деревянном полу",
    kind: "packshot",
  },
  knitThrow: {
    src: "/images/brand/knit-throw.jpg",
    alt: "Сложенный вязаный плед орехового цвета на светлом фоне",
    kind: "packshot",
  },
  packaging: {
    src: "/images/brand/packaging-bag.jpg",
    alt: "Фирменная упаковка — многоразовый тёмно-зелёный мешок на шнурке",
    kind: "packshot",
  },
  cloud: {
    src: "/images/brand/cloud-closeup.jpg",
    alt: "Облако хлопкового волокна на тёплом бежевом фоне",
    kind: "detail",
  },
} satisfies Record<string, ImageAsset>;

const WEAVE_NAMES: Record<Weave, string> = {
  terry: "махровой ткани",
  waffle: "вафельного полотна",
  linen: "льняного полотна",
  satin: "сатина",
  knit: "крупной вязки",
  quilt: "стёганой ткани",
  crinkle: "крэп-жатки",
  herringbone: "плетения «ёлочка»",
};

/** Макро-кадр ткани в выбранном цвете */
export function textileImage(weave: Weave, color: ColorKey, variant: "detail" | "close" = "detail"): ImageAsset {
  return {
    src: `/images/products/${weave}-${color}-${variant}.jpg`,
    alt:
      variant === "detail"
        ? `Фактура ${WEAVE_NAMES[weave]}, цвет «${COLORS[color].name.toLowerCase()}»`
        : `Крупный план ${WEAVE_NAMES[weave]}: плетение и нить`,
    kind: variant === "detail" ? "macro" : "detail",
  };
}

export function textureImage(name: string, alt: string): ImageAsset {
  return { src: `/images/textures/${name}.jpg`, alt, kind: "macro" };
}
