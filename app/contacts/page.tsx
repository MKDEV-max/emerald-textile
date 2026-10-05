import type { Metadata } from "next";
import { PHOTOS } from "@/lib/data/images";
import { Icon } from "@/components/Icon";
import { Media } from "@/components/Media";
import { PageHeader } from "@/components/editorial";
import { ContactForm } from "./ContactForm";
import s from "./contacts.module.css";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты Emerald Textile: телефон, email, шоурум в Москве и форма обратной связи.",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Контакты" }]}
        title="Контакты"
        lead="Ответим на вопросы о размерах, материалах и заказах. Ежедневно с 9:00 до 21:00 по московскому времени."
      />
      <div className={`container ${s.layout}`}>
        <div className={s.info}>
          <ul className={s.list}>
            <li>
              <Icon name="phone" size={22} />
              <div>
                <p className="t-label">Телефон</p>
                <a href="tel:+70000000000" className={s.big}>
                  +7 (000) 000-00-00
                </a>
              </div>
            </li>
            <li>
              <Icon name="mail" size={22} />
              <div>
                <p className="t-label">Email</p>
                <a href="mailto:info@emeraldtextile.ru" className={s.big}>
                  info@emeraldtextile.ru
                </a>
              </div>
            </li>
            <li>
              <Icon name="pin" size={22} />
              <div>
                <p className="t-label">Шоурум</p>
                <p className={s.big}>Москва, ул. Садовая, 1</p>
                <p className="t-body-s t-strong">Ежедневно с 10:00 до 21:00. Можно потрогать ткани и забрать заказ.</p>
              </div>
            </li>
          </ul>
          <dl className={s.req}>
            <div>
              <dt>Компания</dt>
              <dd>ООО «Эмеральд Текстиль»</dd>
            </div>
            <div>
              <dt>Оптовые продажи</dt>
              <dd>Анна Изумрудова, менеджер по оптовым продажам</dd>
            </div>
          </dl>
          <Media image={PHOTOS.packaging} ratio="4 / 3" frame sizes="(max-width: 1023px) 100vw, 40vw" position="50% 40%" />
        </div>
        <div className={s.formWrap}>
          <h2 className="t-h2">Напишите нам</h2>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
