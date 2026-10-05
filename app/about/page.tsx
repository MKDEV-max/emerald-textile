import type { Metadata } from "next";
import { PHOTOS, textileImage } from "@/lib/data/images";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { Media } from "@/components/Media";
import { Breadcrumbs, Wave } from "@/components/ui";
import s from "./about.module.css";

export const metadata: Metadata = {
  title: "О бренде",
  description:
    "Emerald Textile — бренд домашнего текстиля: натуральные материалы, тактильность, внимание к деталям и дом как пространство ощущений.",
  alternates: { canonical: "/about" },
  openGraph: { title: "О бренде — Emerald Textile", images: ["/images/brand/bedroom-story.jpg"] },
};

const PRINCIPLES = [
  { title: "Натуральный", text: "Хлопок, лён, фактуры, дерево и растения. Тёплый дневной свет вместо студийного." },
  { title: "Тёплый", text: "Бежевые и сливочные тона, мягкие складки, ощущение обжитого дома." },
  { title: "Мастерский", text: "Гравюрная волна, кружево, детали шва и аккуратная стёжка." },
  { title: "Уверенный", text: "Монограмма ET и плотный изумрудный цвет — без крика и лишнего декора." },
  { title: "Текучий", text: "Волна как метафора ткани: движение, мягкость, ритм." },
];

export default function AboutPage() {
  return (
    <>
      {/* Открытие: монограмма и крупная капитель, волна у нижнего края */}
      <section className={s.opening} aria-labelledby="about-title">
        <div className="container">
          <Breadcrumbs items={[{ label: "О бренде" }]} />
          <div className={s.openingBody}>
            <Logo variant="monogram" height={64} />
            <h1 id="about-title" className={`display ${s.openingTitle}`}>
              Тёплый натуральный дом
            </h1>
            <p className={s.openingLead}>
              Emerald Textile — бренд домашнего текстиля: постельное бельё, полотенца, скатерти и пледы. Визуально он держится на
              контрасте: мягкие бежевые интерьеры с дневным светом — и строгий изумрудный знак с гравюрной волной.
            </p>
          </div>
        </div>
        <Wave tone="emerald" className={s.wave} />
      </section>

      {/* Философия — асимметрия, вертикальная линия */}
      <section className={`container ${s.split}`} aria-labelledby="philosophy">
        <div className={s.splitMedia}>
          <Media image={PHOTOS.bedroomStory} ratio="3 / 4" sizes="(max-width: 1023px) 100vw, 45vw" />
        </div>
        <div className={s.splitText}>
          <span className="t-index">01</span>
          <h2 id="philosophy" className="t-h1">
            Мягкость — из ткани и света
          </h2>
          <p>
            Мы не стремимся удивлять. Нам важны вещи, которые незаметно меняют ритм дня: полотенце, которое тяжело и тепло ложится на
            плечи; бельё с живой фактурой; скатерть, ради которой хочется накрыть стол даже в будний вечер.
          </p>
          <p>Мягкость приходит из ткани и дневного света. Уверенность — из формы, линии и цвета.</p>
        </div>
      </section>

      {/* Тактильность — Forest */}
      <section className={`${s.tactile} on-dark`} aria-labelledby="tactile">
        <div className={`container ${s.tactileInner}`}>
          <span className="t-index" style={{ color: "var(--color-cream)", opacity: 0.7 }}>
            02
          </span>
          <h2 id="tactile" className={`display ${s.tactileTitle}`}>
            Почувствовать раньше, чем увидеть
          </h2>
          <p className={s.tactileText}>
            Текстиль — то, к чему в доме прикасаются всем телом. Поэтому мы смотрим на ткань руками: вес, гриф, то, как она ложится
            складками. Если вещь не хочется потрогать ещё раз — она не подходит Emerald Textile.
          </p>
        </div>
        <div className={`container ${s.tactileImages}`}>
          <Media image={PHOTOS.cropQuilt} ratio="1 / 1" sizes="(max-width: 767px) 50vw, 30vw" />
          <Media image={PHOTOS.cropKnit} ratio="3 / 4" sizes="(max-width: 767px) 50vw, 22vw" />
          <Media image={textileImage("linen", "sand", "close")} ratio="4 / 5" sizes="(max-width: 767px) 50vw, 26vw" />
        </div>
      </section>

      {/* Принципы бренда */}
      <section className={`container ${s.principles}`} aria-labelledby="principles">
        <header className={s.principlesHead}>
          <span className="t-index">03</span>
          <h2 id="principles" className="t-h1">
            Пять качеств
          </h2>
          <p className={s.principlesLead}>Так бренд описывает себя в фирменном руководстве — и так мы проверяем каждое решение: от ткани до упаковки.</p>
        </header>
        <ol className={s.principlesList}>
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className={s.principle}>
              <span className="t-index">{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.principleTitle}>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Внимание к деталям */}
      <section className={`container ${s.split} ${s.splitReverse}`} aria-labelledby="details">
        <div className={s.splitMedia}>
          <Media image={PHOTOS.cropLaceTable} ratio="16 / 10" sizes="(max-width: 1023px) 100vw, 50vw" />
        </div>
        <div className={s.splitText}>
          <span className="t-index">04</span>
          <h2 id="details" className="t-h1">
            Деталь, которую замечаешь не сразу
          </h2>
          <p>
            Кружевная кайма по краю скатерти. Тканый бордюр на полотенце. Потайные пуговицы на пододеяльнике. Петля для подвеса, которую не
            видно на крючке. Детали, которые не требуют внимания — но делают вещь законченной.
          </p>
        </div>
      </section>

      {/* Упаковка */}
      <section id="upakovka" className={`container ${s.pack}`} aria-labelledby="pack">
        <div className={s.packText}>
          <span className="t-index">05</span>
          <h2 id="pack" className="t-h1">
            Мешок, который остаётся с вами
          </h2>
          <p>
            Изделия Emerald Textile упакованы в многоразовый тёмно-зелёный мешок на шнурке. В нём удобно хранить сезонное одеяло, брать
            плед в поездку или дарить текстиль — без обёрточной бумаги.
          </p>
        </div>
        <div className={s.packMedia}>
          <Media image={PHOTOS.packaging} ratio="2 / 3" sizes="(max-width: 1023px) 70vw, 30vw" />
        </div>
      </section>

      {/* Дом как пространство ощущений */}
      <section className={`container ${s.closing}`} aria-labelledby="home-feel">
        <p className={`display ${s.closingTitle}`} id="home-feel">
          Дом — это то, что мы чувствуем, когда закрываем дверь
        </p>
        <div className={s.closingSide}>
          <p>Тепло полотенца после душа, прохлада льна летней ночью, тяжесть пледа в октябре.</p>
          <div className={s.closingCtas}>
            <Button href="/catalog">Каталог</Button>
            <Button href="/materials" variant="link" arrow={false}>
              Материалы
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
