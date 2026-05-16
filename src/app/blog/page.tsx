import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_ENTRIES } from "@/app/blog/content";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";

export const metadata: Metadata = {
  title: "Blog | Aitonomous Notepad",
  description:
    "Artikel resmi Aitonomous Notepad tentang fitur, privasi, cara kerja, dan kolaborasi realtime untuk mempercepat kerja tim.",
  alternates: {
    canonical: `${appUrl}/blog`
  },
  openGraph: {
    title: "Blog Aitonomous Notepad",
    description:
      "Baca panduan dan insight seputar notepad online realtime, collaborative notes, dan best practice produktivitas tim.",
    url: `${appUrl}/blog`,
    type: "website"
  }
};

export default function BlogIndexPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Blog Aitonomous Notepad</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)] md:text-base">
          Kumpulan artikel untuk memahami notepad online realtime, cara kerja kolaborasi, fitur, dan praktik penggunaan yang aman.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {BLOG_ENTRIES.map((entry) => (
          <article
            key={entry.slug}
            className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-lg shadow-black/5"
          >
            <h2 className="text-xl font-semibold">
              <Link href={`/blog/${entry.slug}`} className="hover:text-[var(--accent)]">
                {entry.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-[var(--text-soft)]">{entry.excerpt}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-[var(--text-soft)]">
              Updated {new Date(entry.updatedAt).toLocaleDateString("id-ID")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
