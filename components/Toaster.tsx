"use client";

import { useStore } from "@/lib/store";
import { Icon } from "./Icon";
import s from "./Toaster.module.css";

/** Уведомления: тёмная плашка Night Forest, рамка Cream, без теней и скруглений. */
export function Toaster() {
  const { toasts, dismiss } = useStore();
  return (
    <div className={s.region} role="region" aria-label="Уведомления" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`${s.toast} on-dark`} role="status">
          <Icon name="check" size={18} className={s.icon} />
          <div className={s.text}>
            <p className={s.title}>{t.title}</p>
            {t.text && <p className={s.sub}>{t.text}</p>}
          </div>
          {t.action && (
            <button
              type="button"
              className={s.action}
              onClick={() => {
                t.action?.onClick();
                dismiss(t.id);
              }}
            >
              {t.action.label}
            </button>
          )}
          <button type="button" className={s.close} onClick={() => dismiss(t.id)} aria-label="Закрыть уведомление">
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
