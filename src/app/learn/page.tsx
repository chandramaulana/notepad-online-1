import type { Metadata } from "next";
import Link from "next/link";
import { getSeoEntries } from "@/lib/programmatic-seo";
import { ContentPageToolbar } from "@/components/content/content-page-toolbar";
import { BlogSeoTags } from "@/components/blog/blog-seo-tags";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";
const entries = getSeoEntries("learn");

export const metadata: Metadata = {
  title: "Panduan Notepad Online | Chandra Notepad",
  description:
    "Panduan notepad online untuk kolaborasi realtime, keamanan dasar shared notes, dan strategi dokumentasi tim modern.",
  alternates: {
    canonical: `${appUrl}/learn`
  },
  keywords: [
    "online notepad guide",
    "realtime collaborative notes guide",
    "programmatic seo notepad"
  ],
  openGraph: {
    title: "Panduan Notepad Online",
    description: "Pelajari cara menggunakan notepad online untuk workflow kolaboratif dan produktif.",
    url: `${appUrl}/learn`,
    type: "website"
  }
};

type LearnHubProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function LearnHubPage({ searchParams }: LearnHubProps) {
  const { lang } = await searchParams;
  const language = lang === "en" ? "en" : "id";
  const ui =
    language === "en"
      ? {
          heading: "Online Notepad Guides",
          subtitle:
            "Explore educational articles about online notepad workflows, realtime collaboration, shared-note security, and SaaS content strategy."
        }
      : {
          heading: "Panduan Notepad Online",
          subtitle:
            "Jelajahi artikel edukasi seputar online notepad, realtime collaboration, keamanan catatan bersama, dan strategi konten SaaS."
        };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <header className="mb-8">
        <ContentPageToolbar currentPath="/learn" language={language} />
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">SEO Learn Hub</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{ui.heading}</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)] md:text-base">{ui.subtitle}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <article
            key={entry.slug}
            className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-lg shadow-black/5"
          >
            <h2 className="text-xl font-semibold">
              <Link href={`/learn/${entry.slug}?lang=${language}`} className="hover:text-[var(--accent)]">
                {entry.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-[var(--text-soft)]">{entry.excerpt}</p>
          </article>
        ))}
      </div>

      <BlogSeoTags language={language} />
    </section>
  );
}
