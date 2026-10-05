"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ImageAsset } from "@/lib/types";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
import s from "./ProductGallery.module.css";

const KIND_LABEL: Record<ImageAsset["kind"], string> = {
  interior: "Интерьер",
  lifestyle: "В интерьере",
  macro: "Фактура",
  detail: "Деталь",
  packshot: "Упаковка",
};

/**
 * Галерея товара. Десктоп — крупные кадры колонкой (первый на всю ширину, далее по два),
 * мобильный — горизонтальная лента со snap и счётчиком. Клик открывает просмотр.
 */
export function ProductGallery({ images, name }: { images: ImageAsset[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIndex(0);
    track.current?.scrollTo({ left: 0 });
  }, [images]);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const step = (d: number) => setZoom((z) => (z === null ? z : (z + d + images.length) % images.length));

  useEffect(() => {
    if (zoom === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  return (
    <div className={s.gallery}>
      <div className={s.track} ref={track} onScroll={onScroll}>
        {images.map((img, i) => (
          <figure key={img.src + i} className={`${s.item} ${i === 0 ? s.first : ""}`}>
            <button type="button" className={s.open} onClick={() => setZoom(i)} aria-label={`Открыть фото ${i + 1} из ${images.length}: ${img.alt}`}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                preload={i === 0}
                sizes={i === 0 ? "(max-width: 1023px) 100vw, 58vw" : "(max-width: 1023px) 100vw, 29vw"}
                className={s.img}
              />
            </button>
            <figcaption className={s.caption}>{KIND_LABEL[img.kind]}</figcaption>
          </figure>
        ))}
      </div>
      <div className={s.counter} aria-hidden="true">
        {index + 1} / {images.length}
      </div>
      <div className={s.dots} aria-hidden="true">
        {images.map((_, i) => (
          <span key={i} className={i === index ? s.dotActive : ""} />
        ))}
      </div>

      <Modal open={zoom !== null} onClose={() => setZoom(null)} label={`Фотографии: ${name}`} variant="center" className={s.lightbox}>
        {zoom !== null && (
          <>
            <div className={s.lbImage}>
              <Image src={images[zoom].src} alt={images[zoom].alt} fill sizes="90vw" />
            </div>
            <div className={s.lbBar}>
              <span className="t-label">
                {zoom + 1} / {images.length} · {KIND_LABEL[images[zoom].kind]}
              </span>
              <div className={s.lbNav}>
                <button type="button" onClick={() => step(-1)} aria-label="Предыдущее фото">
                  <Icon name="arrowLeft" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Следующее фото">
                  <Icon name="arrowRight" />
                </button>
                <button type="button" onClick={() => setZoom(null)} aria-label="Закрыть просмотр">
                  <Icon name="close" />
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
