import slugify from "slugify";

const FALLBACK_SLUG = "catatan-baru";

export function sanitizeSlug(input: string): string {
  const cleaned = slugify(input, {
    lower: true,
    strict: true,
    trim: true
  })
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 120);

  return cleaned || FALLBACK_SLUG;
}
