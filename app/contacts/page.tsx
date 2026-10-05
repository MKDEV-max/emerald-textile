import type { Metadata } from "next";
import Link from "next/link";
import { PHOTOS } from "@/lib/data/images";
import { SITE } from "@/lib/site";
import { Media } from "@/components/Media";
import { Breadcrumbs } from "@/components/ui";
import { ContactForm } from "./ContactForm";
import s from "./contacts.module.css";

export const metadata: Metadata = {
  title: "Связаться с нами",
  description: "Вопросы о размерах, материалах и заказах Emerald Textile — форма обратной связи.",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  const { email, phone, showroom } = SITE.contacts;
  return (
    <div className={`container ${s.page}`}>
      <Breadcrumbs items={[{ label: "Связаться с нами" }]} />
      <div className={s.layout}>
        <div className={s.intro}>
          <p className="t-eyebrow">Связаться с нами</p>
          <h1 className="t-h1">Спросите о ткани, размере или заказе</h1>
          <p className={s.lead}>
            Подскажем, какая плотность махры подойдёт для ежедневного душа, как выбрать размер пододеяльника и чем лён отличается от
            сатина на ощупь.
          </p>
          {(email || phone || showroom) && (
            <ul className={s.list}>
              {email && (
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              )}
              {phone && <li>{phone}</li>}
              {showroom && <li>{showroom}</li>}
            </ul>
          )}
          <p className={s.note}>
            Сейчас это демонстрационная витрина: сообщения из формы никуда не отправляются. Ответы на частые вопросы — на странице{" "}
            <Link href="/delivery" className="link-underline">
              доставки и возврата
            </Link>
            .
          </p>
          <div className={s.media}>
            <Media image={PHOTOS.packaging} ratio="4 / 5" sizes="(max-width: 1023px) 60vw, 25vw" position="50% 40%" />
          </div>
        </div>
        <div className={s.formWrap}>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
