import jwt from "jsonwebtoken";
import { env } from "@/lib/env";

type NoteTokenPayload = {
  slug: string;
};

const NOTE_TOKEN_TTL = "12h";

export function signNoteToken(slug: string): string {
  const payload: NoteTokenPayload = { slug };

  return jwt.sign(payload, env.noteAuthSecret, {
    expiresIn: NOTE_TOKEN_TTL
  });
}

export function verifyNoteToken(token: string | null, slug: string): boolean {
  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, env.noteAuthSecret) as NoteTokenPayload;
    return decoded.slug === slug;
  } catch {
    return false;
  }
}
