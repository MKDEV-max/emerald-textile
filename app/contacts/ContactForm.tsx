"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import s from "./contacts.module.css";

type F = "name" | "email" | "topic" | "message";

export function ContactForm() {
  const [v, setV] = useState<Record<F, string>>({ name: "", email: "", topic: "Вопрос о заказе", message: "" });
  const [errors, setErrors] = useState<Partial<Record<F, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Partial<Record<F, string>> = {};
    if (v.name.trim().length < 2) err.name = "Как к вам обращаться?";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) err.email = "Проверьте email — например, name@mail.ru";
    if (v.message.trim().length < 10) err.message = "Напишите сообщение — хотя бы пару слов";
    setErrors(err);
    if (Object.keys(err).length) {
      document.getElementById(`c-${Object.keys(err)[0]}`)?.focus();
      return;
    }
    setState("sending");
    window.setTimeout(() => setState("done"), 900);
  };

  if (state === "done") {
    return (
      <div className={s.done} role="status">
        <span className={s.doneIcon}>
          <Icon name="check" size={28} />
        </span>
        <h3 className="t-h3">Сообщение принято</h3>
        <p className="t-body t-strong">Спасибо, {v.name}! Это демонстрационная витрина — сообщение не отправляется, но форма работает так же, как будет работать в магазине.</p>
        <Button
          variant="link"
          arrow={false}
          onClick={() => {
            setV({ name: "", email: "", topic: "Вопрос о заказе", message: "" });
            setState("idle");
          }}
        >
          Написать ещё
        </Button>
      </div>
    );
  }

  const field = (k: F, label: string, input: React.ReactNode) => (
    <div className="field">
      <label className="field-label" htmlFor={`c-${k}`}>
        {label}
      </label>
      {input}
      {errors[k] && (
        <p id={`ce-${k}`} className="field-error">
          {errors[k]}
        </p>
      )}
    </div>
  );

  const common = (k: F) => ({
    id: `c-${k}`,
    value: v[k],
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `ce-${k}` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV({ ...v, [k]: e.target.value }),
  });

  return (
    <form className={s.form} onSubmit={submit} noValidate>
      <div className={s.row}>
        {field("name", "Имя", <input className="input" autoComplete="name" {...common("name")} />)}
        {field("email", "Email", <input className="input" type="email" autoComplete="email" {...common("email")} />)}
      </div>
      {field(
        "topic",
        "Тема",
        <select className="select" {...common("topic")}>
          <option>Вопрос о заказе</option>
          <option>Подбор размера и материала</option>
          <option>Возврат и обмен</option>
          <option>Оптовое сотрудничество</option>
          <option>Другое</option>
        </select>,
      )}
      {field("message", "Сообщение", <textarea className="textarea" rows={6} {...common("message")} />)}
      <div>
        <Button type="submit" loading={state === "sending"} disabled={state === "sending"}>
          Отправить
        </Button>
      </div>
    </form>
  );
}
