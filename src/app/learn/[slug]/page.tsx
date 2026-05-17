import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeoEntries, getSeoEntry } from "@/lib/programmatic-seo";
import { ContentPageToolbar } from "@/components/content/content-page-toolbar";
import { BlogSeoTags } from "@/components/blog/blog-seo-tags";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";

export async function generateStaticParams() {
  return getSeoEntries("learn").map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const language = lang === "en" ? "en" : "id";
  const entry = getSeoEntry("learn", slug);

  if (!entry) {
    return {
      title: "Panduan Tidak Ditemukan | Chandra Notepad"
    };
  }

  return {
    title: `${entry.title} | Chandra Notepad`,
    description: entry.description,
    keywords: entry.keywords,
    alternates: {
      canonical: `${appUrl}/learn/${entry.slug}?lang=${language}`,
      languages: {
        id: `${appUrl}/learn/${entry.slug}?lang=id`,
        en: `${appUrl}/learn/${entry.slug}?lang=en`
      }
    },
    openGraph: {
      title: entry.title,
      description: entry.description,
      type: "article",
      url: `${appUrl}/learn/${entry.slug}?lang=${language}`,
      modifiedTime: entry.updatedAt,
      publishedTime: entry.updatedAt
    }
  };
}

export default async function LearnArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const language = lang === "en" ? "en" : "id";
  const isEnglish = language === "en";
  const entry = getSeoEntry("learn", slug);

  if (!entry) {
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: entry.title,
        description: entry.description,
        datePublished: entry.updatedAt,
        dateModified: entry.updatedAt,
        mainEntityOfPage: `${appUrl}/learn/${entry.slug}?lang=${language}`,
        author: {
          "@type": "Organization",
          name: "Chandra Notepad"
        },
        publisher: {
          "@type": "Organization",
          name: "Chandra Notepad"
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: entry.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      }
    ]
  };

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xl shadow-black/10 md:p-8">
        <ContentPageToolbar currentPath={`/learn/${entry.slug}`} language={language} />
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Learn</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{entry.title}</h1>
        <p className="mt-3 text-sm text-[var(--text-soft)] md:text-base">{entry.description}</p>

        <div className="mt-8 space-y-7">
          {entry.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--text-soft)] md:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 border-t border-[var(--line)] pt-5">
          <h2 className="text-xl font-semibold">{isEnglish ? "FAQ" : "FAQ"}</h2>
          <div className="mt-4 space-y-4">
            {entry.faqs.map((faq) => (
              <article key={faq.question} className="rounded-xl border border-[var(--line)] bg-black/10 p-4">
                <h3 className="text-sm font-semibold md:text-base">{faq.question}</h3>
                <p className="mt-2 text-sm text-[var(--text-soft)] md:text-base">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <BlogSeoTags language={language} />

        <footer className="mt-10 border-t border-[var(--line)] pt-5">
          <p className="text-sm text-[var(--text-soft)]">
            {isEnglish ? "Explore more articles in the " : "Jelajahi artikel lainnya di "}
            <Link href={`/learn?lang=${language}`} className="font-medium text-[var(--accent)]">
              {isEnglish ? "guide hub" : "hub panduan"}
            </Link>
            .
          </p>
        </footer>
      </article>
    </section>
  );
}
