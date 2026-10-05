# Emerald Textile — сайт-каталог домашнего текстиля

Next.js 16 (App Router) · React 19 · TypeScript · CSS Modules + дизайн-токены.
Визуальная система перенесена из брендбука Emerald Textile v1.0 (2026).

## Запуск

```bash
npm install
npm run dev      # разработка: http://localhost:3000
npm run build    # production-сборка (70 статических страниц)
npm run start    # production-сервер
```

## Структура

```
app/                 страницы (App Router)
  tokens.css         дизайн-токены: цвета, типографика, отступы, линии, сетка, motion
  globals.css        база, типографические классы, сетка 12/8/4, формы
  catalog/           /catalog и /catalog/[category]
  product/[slug]/    страница товара
  collections/       /collections и /collections/[slug]
  checkout/ cart/ wishlist/ account/
  about/ materials/ journal/ delivery/ contacts/
components/          переиспользуемые компоненты (Header, Footer, Hero, Button,
                     ProductCard, ProductGrid/Rail, ProductGallery, FilterPanel,
                     CatalogView, SearchOverlay, CartDrawer, Modal, Accordion,
                     Toaster, Newsletter, editorial-блоки, ui.tsx …)
lib/
  data/              демо-данные: 38 товаров, 4 категории, 5 коллекций,
                     7 материалов, 6 статей, цвета, реестр изображений
  catalog.ts         фильтры, сортировка, фасеты, поиск, подборки
  store.tsx          корзина, избранное, заказы, панели, уведомления (localStorage)
public/brand/        логотип и гравюрная волна из брендбука (PNG с прозрачностью)
public/images/       фото из брендбука + временные фактуры тканей
scripts/             генератор временных фактур (Python)
```

## Изображения

- `public/images/brand/` — фотографии из брендбука (спальня, столовая, упаковка, плед).
- `public/images/products/*-detail.jpg`, `*-close.jpg` и `public/images/textures/` —
  **временные** процедурные макро-кадры тканей (`scripts/generate_textiles.py`).
  Чтобы заменить их съёмкой, положите файл с тем же именем — код менять не нужно.
- Реальные фото конкретного товара добавляются в поле `photos` в `lib/data/products.ts`.

## Шрифты

Брендбук задаёт JOURNALISM (заголовки) и SF Pro Display (текст). Подключены
фолбэки, которые указывает сам брендбук: **Oranienbaum** и **Inter**; на устройствах
Apple текст выводится системным SF Pro. Установленный локально JOURNALISM —
капительный и намеренно не стоит в стеке, чтобы сайт выглядел одинаково у всех.
Чтобы включить лицензионный веб-шрифт: добавьте `@font-face` и имя шрифта в начало
`--font-display` в `app/tokens.css`.

## Что демо

Оплата, отправка писем, подписка и личный кабинет работают на клиенте:
корзина, избранное, профиль и заказы хранятся в `localStorage` браузера.
Для боевого запуска нужно подключить API заказов, платёжный шлюз и авторизацию.
