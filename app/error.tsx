"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";
import s from "./status.module.css";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className={s.status} aria-labelledby="err-title">
      <div className={`container ${s.inner}`}>
        <p className="t-label">Что-то пошло не так</p>
        <h1 id="err-title" className="t-h1">
          Не удалось загрузить страницу
        </h1>
        <p className="t-body-l t-strong">Попробуйте обновить её — обычно это помогает. Если ошибка повторится, напишите нам.</p>
        <div className={s.ctas}>
          <Button onClick={reset} arrow={false}>
            Попробовать снова
          </Button>
          <Button href="/contacts" variant="link">
            Написать нам
          </Button>
        </div>
      </div>
    </section>
  );
}
