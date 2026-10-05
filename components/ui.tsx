import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ColorKey } from "@/lib/types";
import { COLORS } from "@/lib/data/colors";
import { Icon, type IconName } from "./Icon";
import { Button } from "./Button";
import s from "./ui.module.css";

/* ── Tag ─────────────────────────────────────────────── */
export function Tag({ children, tone = "outline" }: { children: ReactNode; tone?: "outline" | "solid" | "cream" | "muted" }) {
  const cls = { outline: "", solid: s.tagSolid, cream: s.tagCream, muted: s.tagMuted }[tone];
  return <span className={`${s.tag} ${cls}`}>{children}</span>;
}

export function Tags({ children }: { children: ReactNode }) {
  return <div className={s.tags}>{children}</div>;
}

/* ── Wave ────────────────────────────────────────────── */
/**
 * Гравюрная волна: всегда во всю ширину и прижата к нижнему краю,
 * высота полосы — не более 45% высоты носителя. Не используется как фон под текстом.
 */
export function Wave({
  tone = "emerald",
  pinned = false,
  className,
}: {
  tone?: "emerald" | "tonal" | "deep";
  pinned?: boolean;
  className?: string;
}) {
  return (
    <div className={[s.wave, pinned && s.waveBottom, className].filter(Boolean).join(" ")} aria-hidden="true">
      <Image src={`/brand/wave-${tone}.png`} alt="" width={1672} height={341} sizes="100vw" />
    </div>
  );
}

/* ── Breadcrumbs ─────────────────────────────────────── */
export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Главная", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `https://emeraldtextile.ru${c.href}` } : {}),
    })),
  };
  return (
    <nav aria-label="Навигационная цепочка">
      <ol className={s.crumbs}>
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={i} style={{ display: "contents" }}>
              {c.href && !last ? <Link href={c.href}>{c.label}</Link> : <span aria-current={last ? "page" : undefined}>{c.label}</span>}
              {!last && (
                <span className={s.crumbSep} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}

/* ── Section header ──────────────────────────────────── */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
  as: As = "h2",
  size = "h2",
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: { label: string; href: string };
  as?: "h1" | "h2" | "h3";
  size?: "h1" | "h2" | "h3";
  id?: string;
}) {
  return (
    <div className={s.sectionHead}>
      <div className={s.sectionHeadText}>
        {eyebrow && <span className={s.eyebrow}>{eyebrow}</span>}
        <As className={`t-${size}`} id={id}>
          {title}
        </As>
        {lead && <p className={`t-body-l ${s.sectionHeadLead}`}>{lead}</p>}
      </div>
      {action && (
        <Button href={action.href} variant="link" size="s">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className={s.eyebrow}>{children}</span>;
}

/* ── Color swatches ──────────────────────────────────── */
export function SwatchRow({ colors, max = 5 }: { colors: ColorKey[]; max?: number }) {
  const shown = colors.slice(0, max);
  return (
    <span className={s.swatches} style={{ gap: 4 }} aria-label={`Цвета: ${colors.map((c) => COLORS[c].name.toLowerCase()).join(", ")}`}>
      {shown.map((c) => (
        <span key={c} className={`${s.swatch} ${s.swatchS}`} style={{ ["--swatch" as string]: COLORS[c].hex }} aria-hidden="true" />
      ))}
      {colors.length > max && (
        <span className="t-caption t-muted" aria-hidden="true">
          +{colors.length - max}
        </span>
      )}
    </span>
  );
}

export function ColorSwatch({
  color,
  selected,
  onSelect,
  name,
}: {
  color: ColorKey;
  selected: boolean;
  onSelect: () => void;
  name: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={COLORS[color].name}
      title={COLORS[color].name}
      name={name}
      className={s.swatch}
      style={{ ["--swatch" as string]: COLORS[color].hex }}
      onClick={onSelect}
    />
  );
}

export function ColorSwatchGroup({
  colors,
  value,
  onChange,
  label,
}: {
  colors: ColorKey[];
  value: ColorKey;
  onChange: (c: ColorKey) => void;
  label: string;
}) {
  const onKey = (e: React.KeyboardEvent) => {
    const i = colors.indexOf(value);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(colors[(i + 1) % colors.length]);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(colors[(i - 1 + colors.length) % colors.length]);
    }
  };
  return (
    <div role="radiogroup" aria-label={label} className={s.swatches} onKeyDown={onKey}>
      {colors.map((c) => (
        <ColorSwatch key={c} color={c} name={label} selected={c === value} onSelect={() => onChange(c)} />
      ))}
    </div>
  );
}

/* ── Quantity selector ───────────────────────────────── */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 20,
  size = "m",
  label = "Количество",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  size?: "m" | "s";
  label?: string;
}) {
  return (
    <div className={`${s.qty} ${size === "s" ? s.qtyS : ""}`} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Уменьшить количество">
        <Icon name="minus" size={16} />
      </button>
      <output aria-live="polite" aria-label={`${label}: ${value}`}>
        {value}
      </output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Увеличить количество">
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

/* ── Empty / Loading states ──────────────────────────── */
export function EmptyState({
  icon = "bag",
  title,
  text,
  action,
  compact,
  children,
}: {
  icon?: IconName;
  title: string;
  text?: ReactNode;
  action?: { label: string; href?: string; onClick?: () => void };
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`${s.empty} ${compact ? s.emptyCompact : ""}`} role="status">
      <span className={s.emptyIcon}>
        <Icon name={icon} size={28} />
      </span>
      <h2 className="t-h3">{title}</h2>
      {text && <p className={`t-body ${s.emptyText}`}>{text}</p>}
      {action &&
        (action.href ? (
          <Button href={action.href}>{action.label}</Button>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        ))}
      {children}
    </div>
  );
}

export function LoadingState({ label = "Загружаем…" }: { label?: string }) {
  return (
    <div className={s.loading} role="status" aria-live="polite">
      <span className={s.loadingBar} />
      <span className="t-label">{label}</span>
    </div>
  );
}

export function Skeleton({ style }: { style?: React.CSSProperties }) {
  return <div className={s.skeleton} style={style} aria-hidden="true" />;
}

/* ── Checkbox ────────────────────────────────────────── */
export function Checkbox({
  checked,
  onChange,
  children,
  count,
  disabled,
  type = "checkbox",
  name,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  count?: number;
  disabled?: boolean;
  type?: "checkbox" | "radio";
  name?: string;
}) {
  return (
    <label className={s.check}>
      <input type={type} name={name} checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className={s.checkBox} aria-hidden="true">
        <Icon name="check" size={14} stroke={1.75} />
      </span>
      <span>{children}</span>
      {count !== undefined && <span className={s.checkCount}>{count}</span>}
    </label>
  );
}
