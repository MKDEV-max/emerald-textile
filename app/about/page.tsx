import type { Metadata } from "next";
import { PHOTOS, textureImage } from "@/lib/data/images";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { Media } from "@/components/Media";
import { EditorialSection, Features, NumberedModules } from "@/components/editorial";
import { Breadcrumbs, Wave } from "@/components/ui";
import s from "./about.module.css";

export const metadata: Metadata = {
  title: "О бренде",
  description:
    "Emerald Textile — бренд домашнего текстиля. Натуральные материалы, тактильность, внимание к деталям и дом как пространство ощущений.",
  alternates: { canonical: "/about" },
  openGraph: { title: "О бренде — Emerald Textile", images: ["/images/brand/bedroom-story.jpg"] },
};

export default function AboutPage() {
  return (
    <>
      {/* Открытие: монограмма, Display, волна у нижнего края */}
      <section className={s.opening} aria-labelledby="about-title">
        <div className="container">
          <Breadcrumbs items={[{ label: "О бренде" }]} />
          <div className={s.openingBody}>
            <Logo variant="monogram" height={72} className={s.mono} />
            <h1 id="about-title" className="t-display-xl">
              О бренде
            </h1>
            <p className={`t-h3 ${s.openingLead}`}>
              Мы делаем текстиль для дома, в котором хочется оставаться: спокойный, тёплый и настоящий на ощупь.
            </p>
          </div>
        </div>
        <Wave tone="emerald" className={s.wave} />
      </section>

      {/* Философия */}
      <section className="section" aria-labelledby="philosophy">
        <div className={`container ${s.columns}`}>
          <p className={`t-label ${s.colLabel}`}>Философия</p>
          <div className={s.colText}>
            <h2 id="philosophy" className="t-h1">
              Тёплый натуральный дом и уверенный изумрудный знак
            </h2>
            <div className="prose">
              <p>
                Emerald Textile держится на контрасте. С одной стороны — мягкие бежевые интерьеры, дневной свет, хлопок, кружево и дерево. С
                другой — строгий изумрудный знак с гравюрной волной. Мягкость приходит из ткани и света, уверенность — из формы и цвета.
              </p>
              <p>
                Мы не стремимся удивлять. Мы делаем вещи, которые незаметно меняют ритм дня: полотенце, которое тяжело и тепло ложится на
                плечи; бельё, под которым не бывает душно; скатерть, ради которой хочется накрыть стол даже в будний вечер.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <Media image={PHOTOS.bedroomWide} ratio="21 / 9" frame sizes="100vw" />
      </div>

      {/* Материалы */}
      <EditorialSection
        eyebrow="Натуральные материалы"
        title="Начинается с волокна"
        image={textureImage("linen-sand", "Стираный лён песочного цвета крупным планом")}
        cta={{ label: "О материалах", href: "/materials" }}
      >
        <p>
          Хлопок с длинным волокном, стираный лён, плотная махра и вафельное полотно. Мы выбираем ткани, которые дышат, не электризуются
          и с годами становятся только мягче.
        </p>
        <p>Никаких лишних пропиток там, где они не нужны, и спокойные красители, которые не вымываются после первых стирок.</p>
      </EditorialSection>

      {/* Тактильность — Forest */}
      <section className={`section bg-forest on-dark ${s.tactile}`} aria-labelledby="tactile">
        <div className={`container ${s.columns}`}>
          <p className={`t-label ${s.colLabel}`}>Тактильность</p>
          <div className={s.colText}>
            <h2 id="tactile" className="t-display-l">
              Почувствовать раньше, чем увидеть
            </h2>
            <p className={`t-body-l ${s.tactileText}`}>
              Текстиль — единственное в доме, к чему мы прикасаемся всем телом. Поэтому мы оцениваем ткань руками: вес, гриф, то, как она
              ложится складками и как звучит, когда её разворачиваешь. Если вещь не хочется потрогать ещё раз — она не попадает в коллекцию.
            </p>
            <Features
              tone="dark"
              items={[
                { icon: "weave", title: "Плетение", text: "Плотность и переплетение подбираем под задачу: впитывать, согревать или охлаждать." },
                { icon: "feather", title: "Вес", text: "Тяжёлая махра, лёгкий сатин, воздушная вафля — вес ткани чувствуется сразу." },
                { icon: "cloud", title: "Мягкость", text: "Каждое изделие стирается перед упаковкой, чтобы прийти к вам уже мягким." },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Производство */}
      <section className="section" aria-labelledby="production">
        <div className="container">
          <div className={s.columns} style={{ marginBottom: "var(--space-8)" }}>
            <p className={`t-label ${s.colLabel}`}>Производство</p>
            <div className={s.colText}>
              <h2 id="production" className="t-h1">
                Шесть шагов до вашего дома
              </h2>
              <p className="t-body-l t-strong">
                Мы работаем с проверенными фабриками и контролируем каждый этап — от выбора волокна до того, как изделие окажется в мешке.
              </p>
            </div>
          </div>
          <NumberedModules
            columns={3}
            items={[
              { title: "Волокно", text: "Выбираем хлопок с длинным волокном и лён без пестицидной обработки." },
              { title: "Ткачество", text: "Задаём плотность и переплетение под каждое изделие — от сатина до махры." },
              { title: "Отделка", text: "Энзимная стирка для льна, мягкая отделка для махры, пропитка для скатертей." },
              { title: "Пошив", text: "Двойные швы, обработанные срезы, кружевная кайма ручной работы." },
              { title: "Контроль", text: "Проверяем размер, плотность и цвет каждой партии после пробной стирки." },
              { title: "Упаковка", text: "Складываем в многоразовый мешок из хлопка — без лишнего пластика." },
            ]}
          />
        </div>
      </section>

      {/* Внимание к деталям */}
      <EditorialSection
        tone="ivory"
        eyebrow="Внимание к деталям"
        title="Деталь, которую замечаешь не сразу"
        image={PHOTOS.diningVertical}
        reverse
      >
        <p>
          Кружевная кайма по краю скатерти. Тканый бордюр на махровом полотенце. Потайные пуговицы на пододеяльнике. Петля для подвеса,
          которую не видно на крючке.
        </p>
        <p>Мы любим детали, которые не требуют внимания — но делают вещь законченной.</p>
      </EditorialSection>

      {/* Упаковка */}
      <section id="upakovka" className="section" aria-labelledby="pack">
        <div className={`container ${s.pack}`}>
          <div className={s.packMedia}>
            <Media image={PHOTOS.packaging} ratio="2 / 3" frame sizes="(max-width: 1023px) 100vw, 33vw" />
          </div>
          <div className={s.packText}>
            <p className="t-label">Упаковка</p>
            <h2 className="t-h1">Мешок, который остаётся с вами</h2>
            <p className="t-body-l t-strong">
              Каждое изделие Emerald Textile упаковано в многоразовый тёмно-зелёный мешок на шнурке. В нём удобно хранить сезонное одеяло,
              брать плед в поездку или дарить текстиль — без обёрточной бумаги.
            </p>
          </div>
        </div>
      </section>

      {/* Дом как пространство ощущений */}
      <section className={`section bg-ivory ${s.closing}`} aria-labelledby="home-feel">
        <div className={`container ${s.closingInner}`}>
          <p className="t-label">Дом как пространство ощущений</p>
          <h2 id="home-feel" className="t-display-l">
            Дом — это то, что мы чувствуем, когда закрываем дверь
          </h2>
          <p className="t-body-l t-strong" style={{ maxWidth: "60ch" }}>
            Тепло полотенца после душа, прохлада льна летней ночью, тяжесть пледа в октябре. Мы делаем текстиль, чтобы эти ощущения были
            точнее — и повторялись каждый день.
          </p>
          <div className={s.closingCtas}>
            <Button href="/catalog">В каталог</Button>
            <Button href="/collections" variant="link">
              Коллекции
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
