import type { Note } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sanitizeSlug } from "@/lib/slug";

export async function getOrCreateNote(rawSlug: string): Promise<Note> {
  const slug = sanitizeSlug(rawSlug);

  const existing = await prisma.note.findUnique({
    where: { slug }
  });

  if (existing) {
    return existing;
  }

  return prisma.note.create({
    data: {
      slug,
      contentJson: null,
      locked: false
    }
  });
}
