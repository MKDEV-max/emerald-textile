"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ImageAsset } from "@/lib/types";
import s from "./Media.module.css";

/**
 * Блок изображения («07 · Image block»): обводка 1 px Emerald / Deep Emerald,
 * R0, спокойное появление (fade + лёгкий масштаб) при попадании в экран.
 * Изображение — заменяемый ассет: компонент не зависит от конкретной картинки.
 */
export function Media({
  image,
  ratio = "4 / 5",
  sizes = "(max-width: 767px) 100vw, 50vw",
  frame = false,
  priority = false,
  hoverImage,
  zoom = false,
  className,
  fill = false,
  position,
}: {
  image: ImageAsset;
  ratio?: string;
  sizes?: string;
  frame?: boolean;
  priority?: boolean;
  hoverImage?: ImageAsset;
  zoom?: boolean;
  className?: string;
  /** растянуть по родителю вместо фиксированного соотношения */
  fill?: boolean;
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(priority);
  const [loaded, setLoaded] = useState(false);

  // изображение могло загрузиться из кэша до гидратации — onLoad тогда не сработает
  useEffect(() => {
    const img = ref.current?.querySelector("img");
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, [image.src]);

  useEffect(() => {
    if (priority || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [priority]);

  const cls = [
    s.media,
    frame && s.frame,
    zoom && s.zoom,
    hoverImage && s.hasHover,
    fill && s.fill,
    shown && s.shown,
    loaded && s.loaded,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={cls} style={fill ? undefined : { aspectRatio: ratio }}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={priority}
        className={s.img}
        style={position ? { objectPosition: position } : undefined}
        onLoad={() => setLoaded(true)}
      />
      {hoverImage && <Image src={hoverImage.src} alt="" aria-hidden="true" fill sizes={sizes} className={`${s.img} ${s.hover}`} />}
    </div>
  );
}
