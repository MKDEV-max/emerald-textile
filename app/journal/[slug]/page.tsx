import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/lib/data/journal";
import { getProduct } from "@/lib/data/products";
import type { Product } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Media } from "@/components/Media";
import { ProductRail } from "@/components/ProductGrid";
import { ArticleCard } from "@/components/editorial";
import { Breadcrumbs, SectionHeader } from "@/components/ui";
import { Button } from "@/components/Button";
import s from "../journal.module.css";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Статья не найдена" };
  return {
    title: a.title,
    description: a.lead,
    alternates: { canonical: `/journal/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.lead, images: [a.image.src], publishedTime: a.date },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const products = a.related.map(getProduct).filter(Boolean) as Product[];
  const more = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.lead,
    datePublished: a.date,
    image: `https://emeraldtextile.ru${a.image.src}`,
    author: { "@type": "Organization", name: "Emerald Textile" },
    publisher: { "@type": "Organization", name: "Emerald Textile" },
  };

  return (
    <article className={s.article}>
      <div className="container">
        <Breadcrumbs items={[{ label: "Журнал", href: "/journal" }, { label: a.title }]} />
        <header className={s.articleHead}>
          <p className={s.articleMeta}>
            <span>{a.category}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={a.date}>{formatDate(a.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{a.readTime} мин чтения</span>
          </p>
          <h1 className="t-h1">{a.title}</h1>
          <p className={`t-body-l ${s.articleLead}`}>{a.lead}</p>
        </header>
        <Media image={a.image} ratio="21 / 9" priority sizes="100vw" />

        <div className={s.articleBody}>
          <aside className={s.articleAside} aria-label="Об этой статье">
            <p className="t-label">Журнал Emerald Textile</p>
            <p className="t-body-s t-strong">{a.lead}</p>
            <Button href="/journal" variant="link" size="s">
              Все статьи
            </Button>
          </aside>
          <div className={`prose ${s.articleText}`}>
            {a.body.map((b, i) => {
              switch (b.type) {
                case "h2":
                  return <h2 key={i}>{b.text}</h2>;
                case "h3":
                  return <h3 key={i}>{b.text}</h3>;
                case "quote":
                  return <blockquote key={i}>{b.text}</blockquote>;
                case "list":
                  return (
                    <ul key={i}>
                      {b.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  );
                default:
                  return <p key={i}>{b.text}</p>;
              }
            })}
          </div>
        </div>
      </div>

      {products.length > 0 && (
        <section className="section bg-ivory" aria-labelledby="article-products">
          <div className="container">
            <SectionHeader id="article-products" eyebrow="Из статьи" title="Изделия, о которых шла речь" />
            <ProductRail products={products} label="Товары из статьи" />
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="more-articles">
        <div className="container">
          <SectionHeader id="more-articles" title="Читать дальше" action={{ label: "Все статьи", href: "/journal" }} />
          <ul className={s.grid}>
            {more.map((m) => (
              <li key={m.slug}>
                <ArticleCard article={m} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
