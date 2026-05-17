import type { Metadata } from "next";
import Link from "next/link";
import { getSeoEntries } from "@/lib/programmatic-seo";
import { ContentPageToolbar } from "@/components/content/content-page-toolbar";
import { BlogSeoTags } from "@/components/blog/blog-seo-tags";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";
const entries = getSeoEntries("compare");

export const metadata: Metadata = {
  title: "Perbandingan Online Notepad | Chandra Notepad",
  description:
    "Perbandingan online notepad dengan berbagai tools populer untuk menentukan platform catatan kolaboratif yang paling sesuai.",
  alternates: {
    canonical: `${appUrl}/compare`
  },
  keywords: ["online notepad comparison", "notepad alternative", "best collaborative notes app"],
  openGraph: {
    title: "Perbandingan Online Notepad",
    description: "Bandingkan online notepad dengan platform lain berdasarkan kebutuhan tim Anda.",
    url: `${appUrl}/compare`,
    type: "website"
  }
};

type CompareHubProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function CompareHubPage({ searchParams }: CompareHubProps) {
  const { lang } = await searchParams;
  const language = lang === "en" ? "en" : "id";

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <header className="mb-8">
        <ContentPageToolbar currentPath="/compare" language={language} />
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Comparison Hub</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Online Notepad Comparison Pages</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)] md:text-base">
          Pahami perbedaan tiap tool agar Anda bisa memilih workflow catatan online yang paling efisien.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <article
            key={entry.slug}
            className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-lg shadow-black/5"
          >
            <h2 className="text-xl font-semibold">
              <Link href={`/compare/${entry.slug}?lang=${language}`} className="hover:text-[var(--accent)]">
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
