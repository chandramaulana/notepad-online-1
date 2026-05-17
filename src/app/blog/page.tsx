import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_ENTRIES, getLocalizedBlogContent, resolveBlogLanguage } from "@/app/blog/content";
import { BlogSeoTags } from "@/components/blog/blog-seo-tags";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";

type BlogIndexProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: BlogIndexProps): Promise<Metadata> {
  const params = await searchParams;
  const language = resolveBlogLanguage(params.lang);
  const isEnglish = language === "en";
  const canonical = `${appUrl}/blog?lang=${language}`;

  return {
    title: isEnglish ? "Blog | Chandra Notepad" : "Blog | Chandra Notepad",
    description: isEnglish
      ? "Official Chandra Notepad articles on features, privacy, workflow, and realtime collaboration for fast-moving teams."
      : "Artikel resmi Chandra Notepad tentang fitur, privasi, cara kerja, dan kolaborasi realtime untuk mempercepat kerja tim.",
    alternates: {
      canonical,
      languages: {
        id: `${appUrl}/blog?lang=id`,
        en: `${appUrl}/blog?lang=en`
      }
    },
    openGraph: {
      title: isEnglish ? "Chandra Notepad Blog" : "Blog Chandra Notepad",
      description: isEnglish
        ? "Guides and insights on realtime online notepad, collaborative notes, and practical team productivity."
        : "Baca panduan dan insight seputar notepad online realtime, collaborative notes, dan best practice produktivitas tim.",
      url: canonical,
      type: "website"
    }
  };
}

export default async function BlogIndexPage({ searchParams }: BlogIndexProps) {
  const params = await searchParams;
  const language = resolveBlogLanguage(params.lang);
  const isEnglish = language === "en";

  const title = isEnglish ? "Chandra Notepad Blog" : "Blog Chandra Notepad";
  const subtitle = isEnglish
    ? "A collection of articles about realtime online notepad workflows, collaboration features, and practical security tips."
    : "Kumpulan artikel untuk memahami notepad online realtime, cara kerja kolaborasi, fitur, dan praktik penggunaan yang aman.";
  const getStartedLabel = isEnglish ? "Get Started" : "Mulai Sekarang";
  const switchToEnglish = "/blog?lang=en";
  const switchToIndonesian = "/blog?lang=id";

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <header className="mb-8 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-lg shadow-black/5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={switchToIndonesian}
            className={`rounded-md border px-3 py-1 text-xs ${
              !isEnglish ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)] text-[var(--text-soft)]"
            }`}
          >
            Indonesia
          </Link>
          <Link
            href={switchToEnglish}
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

        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)] md:text-base">{subtitle}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {BLOG_ENTRIES.map((entry) => (
          <article
            key={entry.slug}
            className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-lg shadow-black/5"
          >
            {(() => {
              const localized = getLocalizedBlogContent(entry, language);

              return (
                <>
                  <h2 className="text-xl font-semibold">
                    <Link href={`/blog/${entry.slug}?lang=${language}`} className="hover:text-[var(--accent)]">
                      {localized.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-[var(--text-soft)]">{localized.excerpt}</p>
                </>
              );
            })()}
            <p className="mt-4 text-xs uppercase tracking-wide text-[var(--text-soft)]">
              Updated {new Date(entry.updatedAt).toLocaleDateString("id-ID")}
            </p>
          </article>
        ))}
      </div>

      <BlogSeoTags language={language} />
    </section>
  );
}
