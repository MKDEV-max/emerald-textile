"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ImageAsset } from "@/lib/types";
import s from "./MaterialAtlas.module.css";

export interface AtlasItem {
  name: string;
  feel: string;
  facts: string[];
  href: string;
  image: ImageAsset;
  detail: ImageAsset;
  /** тёплый фон-акцент, меняется вместе с материалом */
  tone?: string;
}

/**
 * Атлас материалов: крупные названия тканей слева, большое изображение справа.
 * Наведение или фокус на названии меняет кадр — спокойный crossfade 300 мс.
 * Масштабы разные: большой кадр фактуры + маленький образец поверх.
 */
export function MaterialAtlas({ items }: { items: AtlasItem[] }) {
  const [active, setActive] = useState(0);
  const cur = items[active];

  return (
    <div className={s.atlas} style={{ ["--tone" as string]: cur.tone ?? "#f3efe6" }}>
      <ol className={s.list}>
        {items.map((it, i) => (
          <li key={it.name}>
            <button
              type="button"
              className={`${s.item} ${i === active ? s.active : ""}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-controls="atlas-feel"
            >
              <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={s.name}>{it.name}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className={s.stage}>
        <div className={s.big}>
          {items.map((it, i) => (
            <Image
              key={it.name}
              src={it.image.src}
              alt={i === active ? it.image.alt : ""}
              aria-hidden={i !== active}
              fill
              sizes="(max-width: 1023px) 100vw, 55vw"
              className={`${s.img} ${i === active ? s.imgOn : ""}`}
            />
          ))}
        </div>
        <div className={s.side}>
          <div className={s.small}>
            {items.map((it, i) => (
              <Image
                key={it.name}
                src={it.detail.src}
                alt=""
                aria-hidden="true"
                fill
                sizes="240px"
                className={`${s.img} ${i === active ? s.imgOn : ""}`}
              />
            ))}
          </div>
          <div className={s.caption} id="atlas-feel" aria-live="polite">
            <p className={s.feel}>{cur.feel}</p>
            <ul className={s.facts}>
              {cur.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link href={cur.href} className={s.more}>
              Подробнее
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
