import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_ENTRIES, BLOG_ENTRY_BY_SLUG } from "@/app/blog/content";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";

export async function generateStaticParams() {
  return BLOG_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = BLOG_ENTRY_BY_SLUG.get(slug);

  if (!entry) {
    return {
      title: "Article Not Found | Aitonomous Notepad"
    };
  }

  const canonicalUrl = `${appUrl}/blog/${entry.slug}`;

  return {
    title: `${entry.title} | Aitonomous Notepad Blog`,
    description: entry.description,
    keywords: entry.keywords,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: canonicalUrl,
      type: "article",
      publishedTime: entry.updatedAt,
      modifiedTime: entry.updatedAt
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description
    }
  };
}

export default async function BlogArticlePage({ params }: BlogPageProps) {
  const { slug } = await params;
  const entry = BLOG_ENTRY_BY_SLUG.get(slug);

  if (!entry) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.description,
    dateModified: entry.updatedAt,
    datePublished: entry.updatedAt,
    mainEntityOfPage: `${appUrl}/blog/${entry.slug}`,
    author: {
      "@type": "Organization",
      name: "Aitonomous Notepad"
    },
    publisher: {
      "@type": "Organization",
      name: "Aitonomous Notepad"
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xl shadow-black/10 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Aitonomous Notepad Blog</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{entry.title}</h1>
        <p className="mt-3 text-sm text-[var(--text-soft)] md:text-base">{entry.description}</p>
        <p className="mt-4 text-xs uppercase tracking-wide text-[var(--text-soft)]">
          Updated {new Date(entry.updatedAt).toLocaleDateString("id-ID")}
        </p>

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

        <footer className="mt-10 border-t border-[var(--line)] pt-5">
          <p className="text-sm text-[var(--text-soft)]">
            Baca juga halaman lain di <Link href="/blog" className="font-medium text-[var(--accent)]">blog Aitonomous Notepad</Link>
            .
          </p>
        </footer>
      </article>
    </section>
  );
}
