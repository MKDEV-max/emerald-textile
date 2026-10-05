import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { Wave } from "@/components/ui";
import s from "./status.module.css";

export const metadata: Metadata = { title: "Страница не найдена", robots: { index: false } };

export default function NotFound() {
  return (
    <section className={s.status} aria-labelledby="nf-title">
      <div className={`container ${s.inner}`}>
        <Logo variant="monogram" height={56} />
        <p className="t-label">Ошибка 404</p>
        <h1 id="nf-title" className="t-display-l">
          Страница не найдена
        </h1>
        <p className="t-body-l t-strong">Возможно, ссылка устарела или в адресе опечатка. Начните с каталога или главной страницы.</p>
        <div className={s.ctas}>
          <Button href="/catalog">В каталог</Button>
          <Button href="/" variant="link">
            На главную
          </Button>
        </div>
      </div>
      <Wave tone="emerald" />
    </section>
  );
}
