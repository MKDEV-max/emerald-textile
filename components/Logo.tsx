import Image from "next/image";

/**
 * Логотип используется только из исходного файла (брендбук, «03 · Logo»):
 * растры извлечены из мастер-макета, перекрашены строго в Emerald / Cream.
 * Минимальный размер: lockup — 96 px, монограмма — 16 px.
 */
const ASSETS = {
  lockup: { w: 707, h: 349 },
  monogram: { w: 309, h: 266 },
  wordmark: { w: 2283, h: 160, file: "wordmark-hd" },
} as const;

export function Logo({
  variant = "lockup",
  tone = "emerald",
  height,
  priority,
  className,
}: {
  variant?: keyof typeof ASSETS;
  tone?: "emerald" | "cream";
  height: number;
  priority?: boolean;
  className?: string;
}) {
  const a = ASSETS[variant];
  const file = "file" in a ? a.file : variant;
  const width = Math.round((a.w / a.h) * height);
  return (
    <Image
      className={className}
      src={`/brand/${file}-${tone}.png`}
      alt="Emerald Textile"
      width={width}
      height={height}
      preload={priority}
      style={{ width, height }}
    />
  );
}
