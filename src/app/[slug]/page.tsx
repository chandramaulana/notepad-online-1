import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getNoteBySlug, getOrCreateNote } from "@/lib/notes";
import { sanitizeSlug } from "@/lib/slug";
import { verifyRoomCreationToken } from "@/lib/auth";
import { NotepadEditor } from "@/components/editor/notepad-editor";
import { MathVerificationGate } from "@/components/verification/math-verification-gate";

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

  const existingNote = await getNoteBySlug(safeSlug);

  if (!existingNote) {
    const cookieStore = await cookies();
    const creationToken = cookieStore.get("room_creation_verified")?.value || null;
    const canCreateRoom = verifyRoomCreationToken(creationToken, safeSlug);

    if (!canCreateRoom) {
      return (
        <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 py-4 md:px-6 md:py-6">
          <MathVerificationGate slug={safeSlug} />
        </section>
      );
    }
  }

  const note = existingNote || (await getOrCreateNote(safeSlug));

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 py-4 md:px-6 md:py-6">
      <NotepadEditor slug={note.slug} initiallyLocked={note.locked} />
    </section>
  );
}
