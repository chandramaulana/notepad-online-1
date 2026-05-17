import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BLOG_ENTRIES,
  BLOG_ENTRY_BY_SLUG,
  getLocalizedBlogContent,
  resolveBlogLanguage
} from "@/app/blog/content";
import { BlogSeoTags } from "@/components/blog/blog-seo-tags";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";

export async function generateStaticParams() {
  return BLOG_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params, searchParams }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const language = resolveBlogLanguage(lang);
  const entry = BLOG_ENTRY_BY_SLUG.get(slug);

  if (!entry) {
    return {
      title: "Article Not Found | Chandra Notepad"
    };
  }

  const localized = getLocalizedBlogContent(entry, language);
  const canonicalUrl = `${appUrl}/blog/${entry.slug}?lang=${language}`;

  return {
    title: `${localized.title} | Chandra Notepad Blog`,
    description: localized.description,
    keywords: entry.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        id: `${appUrl}/blog/${entry.slug}?lang=id`,
        en: `${appUrl}/blog/${entry.slug}?lang=en`
      }
    },
    openGraph: {
      title: localized.title,
      description: localized.description,
      url: canonicalUrl,
      type: "article",
      publishedTime: entry.updatedAt,
      modifiedTime: entry.updatedAt
    },
    twitter: {
      card: "summary_large_image",
      title: localized.title,
      description: localized.description
    }
  };
}

export default async function BlogArticlePage({ params, searchParams }: BlogPageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const language = resolveBlogLanguage(lang);
  const isEnglish = language === "en";
  const entry = BLOG_ENTRY_BY_SLUG.get(slug);

  if (!entry) {
    notFound();
  }

  const localized = getLocalizedBlogContent(entry, language);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: localized.title,
    description: localized.description,
    dateModified: entry.updatedAt,
    datePublished: entry.updatedAt,
    mainEntityOfPage: `${appUrl}/blog/${entry.slug}?lang=${language}`,
    author: {
      "@type": "Organization",
      name: "Chandra Notepad"
    },
    publisher: {
      "@type": "Organization",
      name: "Chandra Notepad"
    }
  };

  const getStartedLabel = isEnglish ? "Get Started" : "Mulai Sekarang";

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xl shadow-black/10 md:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/blog/${entry.slug}?lang=id`}
            className={`rounded-md border px-3 py-1 text-xs ${
              !isEnglish ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)] text-[var(--text-soft)]"
            }`}
          >
            Indonesia
          </Link>
          <Link
            href={`/blog/${entry.slug}?lang=en`}
            className={`rounded-md border px-3 py-1 text-xs ${
              isEnglish ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)] text-[var(--text-soft)]"
            }`}
          >
            English
          </Link>
          <Link
            href="https://notepad.iote.my.id/"
            className="ml-auto rounded-md border border-[var(--line)] bg-[var(--bg-soft)]/45 px-3 py-1.5 text-xs text-[var(--text-soft)] transition-colors hover:text-[var(--accent)]"
          >
            {getStartedLabel}
          </Link>
        </div>

        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Chandra Notepad Blog</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{localized.title}</h1>
        <p className="mt-3 text-sm text-[var(--text-soft)] md:text-base">{localized.description}</p>
        <p className="mt-4 text-xs uppercase tracking-wide text-[var(--text-soft)]">
          Updated {new Date(entry.updatedAt).toLocaleDateString("id-ID")}
        </p>

        <div className="mt-8 space-y-7">
          {localized.sections.map((section) => (
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

        <BlogSeoTags language={language} />

        <footer className="mt-10 border-t border-[var(--line)] pt-5">
          <p className="text-sm text-[var(--text-soft)]">
            {isEnglish ? "Read more in the " : "Baca juga halaman lain di "}
            <Link href={`/blog?lang=${language}`} className="font-medium text-[var(--accent)]">
              {isEnglish ? "Chandra Notepad blog" : "blog Chandra Notepad"}
            </Link>
            .
          </p>
        </footer>
      </article>
    </section>
  );
}
