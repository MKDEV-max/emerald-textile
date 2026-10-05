"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import s from "./Modal.module.css";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Доступное модальное окно: role="dialog", aria-modal, ловушка фокуса,
 * закрытие по Esc и по подложке, возврат фокуса. Варианты: правый/левый
 * drawer, верхняя панель (поиск), окно по центру.
 */
export function Modal({
  open,
  onClose,
  label,
  labelledBy,
  variant = "right",
  children,
  initialFocus,
  className,
}: {
  open: boolean;
  onClose: () => void;
  label?: string;
  labelledBy?: string;
  variant?: "right" | "left" | "top" | "center";
  children: ReactNode;
  initialFocus?: React.RefObject<HTMLElement | null>;
  className?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const restore = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  /* монтирование с анимацией появления и исчезновения */
  useEffect(() => {
    if (open) {
      restore.current = document.activeElement as HTMLElement;
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), 320);
    restore.current?.focus?.();
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    const target = initialFocus?.current ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panel.current;
    target?.focus({ preventScroll: true });
  }, [visible, initialFocus]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      if (e.key === "Tab" && panel.current) {
        const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => el.offsetParent !== null || el === document.activeElement,
        );
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || typeof document === "undefined") return null;

  // портал в body: модальные окна не зависят от stacking context страницы
  return createPortal(
    <div className={`${s.root} ${s[variant]} ${visible ? s.visible : ""}`}>
      <div className={s.scrim} onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        className={`${s.panel} ${className ?? ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
