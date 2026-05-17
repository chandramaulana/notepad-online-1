import type { Metadata } from "next";
import Link from "next/link";
import { getSeoEntries } from "@/lib/programmatic-seo";
import { ContentPageToolbar } from "@/components/content/content-page-toolbar";
import { BlogSeoTags } from "@/components/blog/blog-seo-tags";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";
const entries = getSeoEntries("templates");

export const metadata: Metadata = {
  title: "Template Catatan Online | Chandra Notepad",
  description:
    "Template catatan online untuk meeting notes, sprint planning, retrospective, dan brainstorming kolaboratif realtime.",
  alternates: {
    canonical: `${appUrl}/templates`
  },
  keywords: ["online notes template", "meeting template", "collaborative note template"],
  openGraph: {
    title: "Template Catatan Online",
    description: "Koleksi template siap pakai untuk pencatatan tim berbasis online notepad.",
    url: `${appUrl}/templates`,
    type: "website"
  }
};

type TemplatesHubProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function TemplatesHubPage({ searchParams }: TemplatesHubProps) {
  const { lang } = await searchParams;
  const language = lang === "en" ? "en" : "id";

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <header className="mb-8">
        <ContentPageToolbar currentPath="/templates" language={language} />
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Templates Hub</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Template Online Memo Pad dan Shared Notes</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)] md:text-base">
          Gunakan template siap pakai agar tim lebih cepat membuat catatan yang rapi, terstruktur, dan mudah ditindaklanjuti.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <article
            key={entry.slug}
            className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-lg shadow-black/5"
          >
            <h2 className="text-xl font-semibold">
              <Link href={`/templates/${entry.slug}?lang=${language}`} className="hover:text-[var(--accent)]">
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
