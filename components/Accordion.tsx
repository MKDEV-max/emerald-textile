"use client";

import { useId, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import s from "./Accordion.module.css";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

/** Аккордеон: разделы, разделённые линиями 1 px; заголовки — caps-лейблы. */
export function Accordion({
  items,
  defaultOpen = [],
  multiple = true,
  size = "m",
}: {
  items: AccordionItem[];
  defaultOpen?: string[];
  multiple?: boolean;
  size?: "m" | "s";
}) {
  const uid = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const toggle = (id: string) =>
    setOpen((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : multiple ? [...cur, id] : [id]));

  return (
    <div className={`${s.acc} ${size === "s" ? s.small : ""}`}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const btnId = `${uid}-${item.id}-btn`;
        const panelId = `${uid}-${item.id}-panel`;
        return (
          <div key={item.id} className={s.item}>
            <h3 className={s.heading}>
              <button
                type="button"
                id={btnId}
                className={s.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span>{item.title}</span>
                <Icon name={isOpen ? "minus" : "plus"} size={18} />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className={s.panel} data-open={isOpen}>
              <div className={s.inner}>
                <div className={s.content}>{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
