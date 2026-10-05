"use client";

import { useId, useState } from "react";
import { Icon } from "./Icon";
import s from "./Newsletter.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Подписка на рассылку: валидация, состояния отправки и успеха. */
export function Newsletter({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError("Введите email");
    if (!EMAIL_RE.test(email.trim())) return setError("Проверьте адрес: например, name@mail.ru");
    setError("");
    setState("sending");
    window.setTimeout(() => setState("done"), 700);
  };

  return (
    <div className={`${s.wrap} ${tone === "light" ? s.light : ""}`}>
      <h2 className={`t-h3 ${s.title}`} id={`${id}-title`}>
        Будьте в курсе новых коллекций
      </h2>
      <p className={s.lead}>Раз в месяц: новинки, советы по уходу и закрытые предложения.</p>
      {state === "done" ? (
        <p className={s.done} role="status">
          <Icon name="check" size={18} /> Спасибо! Подтверждение придёт на {email}.
        </p>
      ) : (
        <form className={s.form} onSubmit={submit} noValidate aria-labelledby={`${id}-title`}>
          <label htmlFor={`${id}-email`} className="visually-hidden">
            Ваш email
          </label>
          <input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            className={s.input}
            placeholder="Ваш email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-err` : undefined}
          />
          <button type="submit" className={s.button} disabled={state === "sending"}>
            {state === "sending" ? "Отправляем…" : "Подписаться"}
            {state !== "sending" && <Icon name="arrowRight" size={16} stroke={1.5} />}
          </button>
          {error && (
            <p id={`${id}-err`} className={s.error} role="alert">
              {error}
            </p>
          )}
        </form>
      )}
      <p className={s.note}>Подписываясь, вы соглашаетесь с политикой конфиденциальности.</p>
    </div>
  );
}
