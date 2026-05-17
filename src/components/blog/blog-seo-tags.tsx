import { SEO_KEYWORDS_EN } from "@/lib/seo-keywords";

type Props = {
  language: "id" | "en";
};

export function BlogSeoTags({ language }: Props) {
  const keywords = language === "en" ? SEO_KEYWORDS_EN : SEO_KEYWORDS_EN;

  return (
    <section className="mt-8 border-t border-[var(--line)] pt-6">
      <h2 className="text-xl font-semibold">SEO Tags</h2>
      <p className="mt-2 text-sm text-[var(--text-soft)] md:text-base">
        A keyword cluster section to support Google and AI-search discoverability while keeping the interface clean.
      </p>

      <details className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--bg-soft)]/35 p-3">
        <summary className="cursor-pointer text-sm font-medium text-[var(--text-soft)]">View SEO tags</summary>
        <div className="mt-3 flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-[var(--line)] bg-[var(--card)] px-2.5 py-1 text-xs text-[var(--text-soft)]"
            >
              {keyword}
            </span>
          ))}
        </div>
      </details>
    </section>
  );
}
