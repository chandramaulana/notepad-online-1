import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOrCreateNote } from "@/lib/notes";
import { sanitizeSlug } from "@/lib/slug";
import { NotepadEditor } from "@/components/editor/notepad-editor";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const safeSlug = sanitizeSlug(slug);

  return {
    title: `Notepad - ${safeSlug}`,
    description: `Realtime note untuk ${safeSlug}`,
    openGraph: {
      title: `Notepad - ${safeSlug}`,
      description: `Realtime note untuk ${safeSlug}`,
      type: "article"
    }
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const safeSlug = sanitizeSlug(slug);

  if (safeSlug !== slug) {
    redirect(`/${safeSlug}`);
  }

  const note = await getOrCreateNote(safeSlug);

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 py-4 md:px-6 md:py-6">
      <NotepadEditor slug={note.slug} initiallyLocked={note.locked} />
    </section>
  );
}
