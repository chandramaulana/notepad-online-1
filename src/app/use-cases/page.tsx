import type { Metadata } from "next";
import Link from "next/link";
import { getSeoEntries } from "@/lib/programmatic-seo";
import { ContentPageToolbar } from "@/components/content/content-page-toolbar";
import { BlogSeoTags } from "@/components/blog/blog-seo-tags";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";
const entries = getSeoEntries("use-cases");

export const metadata: Metadata = {
  title: "Use Cases Notepad Online | Chandra Notepad",
  description:
    "Kumpulan use case notepad online untuk meeting notes, kelas online, incident response, dan workflow tim modern.",
  alternates: {
    canonical: `${appUrl}/use-cases`
  },
  keywords: ["notepad use cases", "meeting notes workflow", "collaborative notes examples"],
  openGraph: {
    title: "Use Cases Notepad Online",
    description: "Contoh implementasi online notepad di berbagai kebutuhan kerja tim.",
    url: `${appUrl}/use-cases`,
    type: "website"
  }
};

type UseCasesHubProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function UseCasesHubPage({ searchParams }: UseCasesHubProps) {
  const { lang } = await searchParams;
  const language = lang === "en" ? "en" : "id";

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <header className="mb-8">
        <ContentPageToolbar currentPath="/use-cases" language={language} />
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Use Cases Hub</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Use Cases Realtime Collaborative Notepad</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)] md:text-base">
          Pelajari skenario penggunaan notepad online untuk tim produk, pendidikan, operasional, hingga marketing.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <article
            key={entry.slug}
            className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-lg shadow-black/5"
          >
            <h2 className="text-xl font-semibold">
              <Link href={`/use-cases/${entry.slug}?lang=${language}`} className="hover:text-[var(--accent)]">
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
