import type { Metadata } from "next";
import { CARE } from "@/lib/data/materials";
import type { CareKey } from "@/lib/types";
import { CareIcon, Icon } from "@/components/Icon";
import { PageHeader } from "@/components/editorial";
import { Button } from "@/components/Button";
import s from "./delivery.module.css";

export const metadata: Metadata = {
  title: "Доставка и возврат",
  description:
    "Доставка Emerald Textile по Москве и России, способы оплаты, возврат и обмен в течение 14 дней, сроки и рекомендации по уходу за текстилем.",
  alternates: { canonical: "/delivery" },
};

const SECTIONS = [
  { id: "dostavka", title: "Доставка" },
  { id: "oplata", title: "Оплата" },
  { id: "vozvrat", title: "Возврат" },
  { id: "obmen", title: "Обмен" },
  { id: "sroki", title: "Сроки" },
  { id: "uhod", title: "Уход за текстилем" },
];

const CARE_ALL: CareKey[] = ["wash30", "wash40", "noBleach", "dryFlat", "tumbleLow", "noTumble", "ironLow", "ironMid", "noDryClean"];

export default function DeliveryPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Доставка и возврат" }]}
        title="Доставка и возврат"
        lead="Доставляем по всей России, бесплатно — от 10 000 ₽. Если вещь не подошла, вернём деньги или обменяем в течение 14 дней."
      />
      <div className={`container ${s.layout}`}>
        <nav className={s.nav} aria-label="Разделы страницы">
          <ol>
            {SECTIONS.map((x, i) => (
              <li key={x.id}>
                <a href={`#${x.id}`} className={s.navLink}>
                  <span className={s.navNum}>{String(i + 1).padStart(2, "0")}</span>
                  {x.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={s.content}>
          <section id="dostavka" className={s.section} aria-labelledby="h-dostavka">
            <h2 id="h-dostavka" className="t-h2">
              Доставка
            </h2>
            <div className={s.table} role="table" aria-label="Способы доставки">
              <div className={s.tr} role="row">
                <span role="columnheader">Способ</span>
                <span role="columnheader">Срок</span>
                <span role="columnheader">Стоимость</span>
              </div>
              {[
                ["Курьером по Москве и области", "1–2 дня", "590 ₽"],
                ["Курьером по России", "2–5 дней", "от 590 ₽"],
                ["В пункт выдачи", "2–6 дней", "290 ₽"],
                ["Самовывоз из шоурума в Москве", "через 2 часа", "Бесплатно"],
              ].map((r) => (
                <div key={r[0]} className={s.tr} role="row">
                  {r.map((c, i) => (
                    <span key={i} role="cell">
                      {c}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <p className={s.highlight}>
              <Icon name="truck" size={22} /> При заказе от 10 000 ₽ доставка курьером и в пункт выдачи — бесплатно.
            </p>
            <div className="prose">
              <p>
                Курьер позвонит за час до приезда. Вы можете осмотреть изделия при получении и сразу отказаться от того, что не подошло, —
                оплачиваются только выбранные вещи.
              </p>
            </div>
          </section>

          <section id="oplata" className={s.section} aria-labelledby="h-oplata">
            <h2 id="h-oplata" className="t-h2">
              Оплата
            </h2>
            <ul className={s.cards}>
              {[
                { icon: "card" as const, t: "Картой онлайн", d: "Visa, Mastercard, «Мир». Деньги списываются после подтверждения заказа." },
                { icon: "phone" as const, t: "Через СБП", d: "Оплата по QR-коду в приложении вашего банка без комиссии." },
                { icon: "package" as const, t: "При получении", d: "Картой или наличными курьеру и в пункте выдачи." },
              ].map((c) => (
                <li key={c.t} className={s.card}>
                  <Icon name={c.icon} size={28} stroke={1.1} />
                  <h3 className="t-h4">{c.t}</h3>
                  <p className="t-body-s t-strong">{c.d}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="vozvrat" className={s.section} aria-labelledby="h-vozvrat">
            <h2 id="h-vozvrat" className="t-h2">
              Возврат
            </h2>
            <div className="prose">
              <p>
                Вы можете вернуть изделие в течение 14 дней после получения, если оно не было в использовании, сохранило товарный вид,
                ярлыки и фирменную упаковку.
              </p>
              <ul>
                <li>Напишите нам через форму обратной связи — мы пришлём бланк возврата.</li>
                <li>Передайте изделие курьеру или принесите в шоурум.</li>
                <li>Деньги вернутся тем же способом, которым был оплачен заказ, в течение 10 дней.</li>
              </ul>
              <p>
                Постельное бельё, наволочки и полотенца во вскрытой упаковке не подлежат возврату по закону, если на них нет дефектов. Если
                вы обнаружили брак — мы заменим изделие или вернём деньги без условий.
              </p>
            </div>
          </section>

          <section id="obmen" className={s.section} aria-labelledby="h-obmen">
            <h2 id="h-obmen" className="t-h2">
              Обмен
            </h2>
            <div className="prose">
              <p>
                Не подошёл размер или цвет? Обменяем изделие на другой вариант в течение 14 дней. Доставка нового варианта при обмене —
                за наш счёт.
              </p>
            </div>
          </section>

          <section id="sroki" className={s.section} aria-labelledby="h-sroki">
            <h2 id="h-sroki" className="t-h2">
              Сроки
            </h2>
            <ol className={s.timeline}>
              {[
                ["День 0", "Заказ оформлен — пришлём подтверждение на email."],
                ["1–2 дня", "Собираем заказ и упаковываем в многоразовый мешок."],
                ["2–5 дней", "Доставка курьером или в пункт выдачи."],
                ["14 дней", "Срок, в течение которого можно вернуть или обменять изделие."],
              ].map(([t, d]) => (
                <li key={t} className={s.step}>
                  <span className="t-label">{t}</span>
                  <p className="t-body-s t-strong">{d}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="uhod" className={s.section} aria-labelledby="h-uhod">
            <h2 id="h-uhod" className="t-h2">
              Уход за текстилем
            </h2>
            <div className="prose">
              <p>
                На каждом изделии есть вшивной ярлык с символами ухода. Вот что они означают — и как сохранить мягкость ткани на годы.
              </p>
            </div>
            <ul className={s.care}>
              {CARE_ALL.map((c) => (
                <li key={c} className={s.careItem}>
                  <CareIcon care={c} size={36} />
                  <span>{CARE[c]}</span>
                </li>
              ))}
            </ul>
            <Button href="/journal/kak-uhazhivat-za-naturalnym-tekstilem" variant="secondary">
              Подробнее об уходе
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
