import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import styles from "./Button.module.css";
import { Icon } from "./Icon";

/**
 * Кнопки по брендбуку («07 · Elements»): 52 px высоты, padding 18/32,
 * без скругления, SF Pro Semibold 14 / +8% / CAPS, стрелка →.
 */
type Variant = "primary" | "secondary" | "link" | "inverse" | "outline-light";
type Size = "m" | "s";

interface Common {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  block?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

type AsLink = Common & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

export function buttonClass({ variant = "primary", size = "m", block, className }: Partial<Common> = {}) {
  return [styles.button, styles[variant], styles[size], block && styles.block, className].filter(Boolean).join(" ");
}

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "m", arrow = true, block, loading, children, className } = props;
  const cls = buttonClass({ variant, size, block, className });
  const content = (
    <>
      <span className={styles.label}>{loading ? "Подождите…" : children}</span>
      {arrow && !loading && <Icon name="arrowRight" size={16} stroke={1.5} className={styles.arrow} />}
      {loading && <span className={styles.spinner} aria-hidden="true" />}
    </>
  );

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variant: _v, size: _s, arrow: _a, block: _b, loading: _l, children: _c, className: _cn, ...rest } = props;
    return (
      <Link {...rest} className={cls}>
        {content}
      </Link>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, arrow: _a, block: _b, loading: _l, children: _c, className: _cn, type, ...rest } = props as AsButton;
  return (
    <button {...rest} type={type ?? "button"} className={cls} aria-busy={loading || undefined}>
      {content}
    </button>
  );
}
