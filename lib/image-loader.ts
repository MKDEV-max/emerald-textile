/** Загрузчик для статического экспорта: отдаёт исходный файл с учётом basePath. */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}?w=${width}`;
}
