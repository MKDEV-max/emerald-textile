import type { ReactNode } from "react";
import type { ImageAsset } from "@/lib/types";
import { Button } from "./Button";
import { Media } from "./Media";
import { Breadcrumbs, type Crumb } from "./ui";
import s from "./Hero.module.css";

/**
 * Editorial hero («11 · Website»): JOURNALISM 104, фото на 1/2 экрана справа.
 * Варианты: split (главная, категории), panel (тёмная плашка поверх фото).
 */
export function Hero({
  eyebrow,
  title,
  lead,
  image,
  primary,
  secondary,
  crumbs,
  size = "hero",
  children,
  imagePosition,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  image: ImageAsset;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  crumbs?: Crumb[];
  size?: "hero" | "h1";
  children?: ReactNode;
  imagePosition?: string;
}) {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <div className={s.text}>
        <div className={s.textInner}>
          {crumbs && (
            <div className={s.crumbs}>
              <Breadcrumbs items={crumbs} />
            </div>
          )}
          {eyebrow && <p className={`t-label ${s.eyebrow}`}>{eyebrow}</p>}
          <h1 id="hero-title" className={size === "hero" ? "t-hero" : "t-h1"}>
            {title}
          </h1>
          {lead && <p className={`t-body-l ${s.lead}`}>{lead}</p>}
          {(primary || secondary) && (
            <div className={s.ctas}>
              {primary && <Button href={primary.href}>{primary.label}</Button>}
              {secondary && (
                <Button href={secondary.href} variant="link">
                  {secondary.label}
                </Button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
      <div className={s.media}>
        <Media image={image} fill priority sizes="(max-width: 1023px) 100vw, 50vw" position={imagePosition} />
      </div>
    </section>
  );
}
