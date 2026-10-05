import type { CareKey } from "@/lib/types";

/**
 * Монолинейные пиктограммы (брендбук, «10 · Pictograms»):
 * линейные, один цвет — Emerald на светлом, Cream на тёмном (currentColor).
 */
const PATHS = {
  search: <><circle cx="10.5" cy="10.5" r="6.25" /><path d="M15.2 15.2 20 20" /></>,
  heart: <path d="M12 19.5s-7.25-4.4-7.25-9.6A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.25 2.5c0 5.2-7.25 9.6-7.25 9.6Z" />,
  bag: <><path d="M5.25 8.25h13.5l-1 11.5H6.25l-1-11.5Z" /><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" /></>,
  menu: <><path d="M3.5 8.5h17" /><path d="M3.5 15.5h17" /></>,
  close: <><path d="M5.5 5.5l13 13" /><path d="M18.5 5.5l-13 13" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  arrowRight: <><path d="M4 12h15.5" /><path d="M14 6.5 19.5 12 14 17.5" /></>,
  arrowLeft: <><path d="M20 12H4.5" /><path d="M10 6.5 4.5 12l5.5 5.5" /></>,
  chevronDown: <path d="M6 9.5l6 6 6-6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  user: <><circle cx="12" cy="8.5" r="3.75" /><path d="M4.75 20c.9-3.6 3.8-5.5 7.25-5.5s6.35 1.9 7.25 5.5" /></>,
  filter: <><path d="M4 7h10" /><path d="M18 7h2" /><circle cx="16" cy="7" r="2" /><path d="M4 17h3" /><path d="M11 17h9" /><circle cx="9" cy="17" r="2" /></>,
  truck: <><path d="M3 6.5h11v10H3z" /><path d="M14 10h4l3 3v3.5h-7" /><circle cx="7" cy="17.5" r="1.75" /><circle cx="17.5" cy="17.5" r="1.75" /></>,
  returns: <><path d="M4.5 9.5h11a4.5 4.5 0 0 1 0 9H9" /><path d="M8 5.5 4 9.5l4 4" /></>,
  package: <><path d="M8 5.5c0-1.4 1.8-2 4-2s4 .6 4 2" /><path d="M6.5 6.5c-.8 3-1 8 0 13h11c1-5 .8-10 0-13" /><path d="M8 5.5c1 .8 2.4 1.2 4 1.2s3-.4 4-1.2" /><path d="M9 10.5h6v5H9z" /></>,
  card: <><rect x="3" y="6" width="18" height="12" /><path d="M3 10h18" /><path d="M6.5 14.5h4" /></>,
  phone: <path d="M7.5 3.5h3l1.25 4-2 1.5a10.5 10.5 0 0 0 5.25 5.25l1.5-2 4 1.25v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 5.5 5.5a2 2 0 0 1 2-2Z" />,
  mail: <><rect x="3" y="5.5" width="18" height="13" /><path d="M3 6l9 7 9-7" /></>,
  pin: <><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.25" /></>,
  /* фирменные пиктограммы из карточек товаров */
  weave: <><path d="M3.5 6.5h17" /><path d="M3.5 12h17" /><path d="M3.5 17.5h17" /><path d="M6.5 3.5v17" /><path d="M12 3.5v17" /><path d="M17.5 3.5v17" /><path d="M5 5l3 3M10.5 10.5l3 3M16 16l3 3M10.5 5l3 3M16 10.5l3 3M5 10.5l3 3M5 16l3 3M10.5 16l3 3M16 5l3 3" opacity=".7" /></>,
  feather: <><path d="M19.5 4.5c-6 .5-11 4.5-12.5 11l-.5 4" /><path d="M19.5 4.5c.5 5-2.5 10-9 11.5L7 15.5" /><path d="M12 11l-5 9" /></>,
  cloud: <path d="M7.5 18.5h9.5a3.75 3.75 0 0 0 .4-7.48 5.25 5.25 0 0 0-10.1-1.4A4.5 4.5 0 0 0 7.5 18.5Z" />,
  leaf: <><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" /><path d="M5 19l8-8" /></>,
  ruler: <><rect x="3" y="8" width="18" height="8" /><path d="M7 8v3M11 8v4M15 8v3M19 8v2" /></>,
  /* символы ухода ISO 3758 */
  wash: <><path d="M3.5 7.5l2 11h13l2-11" /><path d="M3.5 7.5c1.5 1.3 2.8 1.3 4.25 0s2.8-1.3 4.25 0 2.8 1.3 4.25 0 2.8-1.3 4.25 0" /></>,
  noBleach: <><path d="M12 4.5 20.5 19h-17L12 4.5Z" /><path d="M5.5 5.5l13 14M18.5 5.5l-13 14" /></>,
  dryFlat: <><rect x="4" y="4" width="16" height="16" /><path d="M7.5 12h9" /></>,
  noTumble: <><rect x="4" y="4" width="16" height="16" /><circle cx="12" cy="12" r="5" /><path d="M4 4l16 16M20 4 4 20" /></>,
  tumble: <><rect x="4" y="4" width="16" height="16" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r=".6" fill="currentColor" /></>,
  iron: <><path d="M4 17.5h16c0-4.5-2.5-8-7-8H8.5" /><path d="M8.5 9.5V7h7" /><path d="M4 17.5c0-2.5 1-4.5 3-6" /></>,
  noDryClean: <><circle cx="12" cy="12" r="7.5" /><path d="M5.5 5.5l13 13M18.5 5.5l-13 13" /></>,
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 24,
  stroke = 1.25,
  label,
  className,
}: {
  name: IconName;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="square"
      strokeLinejoin="miter"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

/** Символ ухода с подписью температуры/точек */
export function CareIcon({ care, size = 28 }: { care: CareKey; size?: number }) {
  const map: Record<CareKey, { icon: IconName; extra?: React.ReactNode }> = {
    wash30: { icon: "wash", extra: <text x="12" y="15.8" textAnchor="middle" fontSize="5.4" fill="currentColor" stroke="none" fontFamily="inherit">30</text> },
    wash40: { icon: "wash", extra: <text x="12" y="15.8" textAnchor="middle" fontSize="5.4" fill="currentColor" stroke="none" fontFamily="inherit">40</text> },
    noBleach: { icon: "noBleach" },
    dryFlat: { icon: "dryFlat" },
    noTumble: { icon: "noTumble" },
    tumbleLow: { icon: "tumble" },
    ironLow: { icon: "iron", extra: <circle cx="12" cy="14.2" r=".7" fill="currentColor" stroke="none" /> },
    ironMid: { icon: "iron", extra: <><circle cx="10.6" cy="14.2" r=".7" fill="currentColor" stroke="none" /><circle cx="13.4" cy="14.2" r=".7" fill="currentColor" stroke="none" /></> },
    noDryClean: { icon: "noDryClean" },
  };
  const { icon, extra } = map[care];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.1} aria-hidden="true" focusable="false">
      {PATHS[icon]}
      {extra}
    </svg>
  );
}
