import type { Metadata } from "next";
import { ARTICLES } from "@/lib/data/journal";
import { ArticleCard, PageHeader } from "@/components/editorial";
import s from "./journal.module.css";

export const metadata: Metadata = {
  title: "Журнал",
  description:
    "Журнал Emerald Textile: как выбрать полотенца и плед, как ухаживать за натуральным текстилем, лён в интерьере и уютная спальня.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const [featured, ...rest] = ARTICLES;
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Журнал" }]}
        eyebrow="Гиды · Уход · Интерьер"
        title="Журнал"
        size="display"
        lead="Спокойные тексты о материалах, уходе и доме. Без спешки — так, как мы сами выбираем текстиль."
      />
      <div className={`container ${s.page}`}>
        <div className={s.top}>
          <div className={s.featured}>
            <ArticleCard article={featured} large priority />
          </div>
          <ul className={s.secondary}>
            {rest.slice(0, 2).map((a) => (
              <li key={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </div>
        <ul className={s.grid}>
          {rest.slice(2).map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
