import jwt from "jsonwebtoken";
import { env } from "@/lib/env";

type NoteTokenPayload = {
  slug: string;
};

type RoomCreationTokenPayload = {
  slug: string;
  type: "room-creation";
};

const NOTE_TOKEN_TTL = "12h";
const ROOM_CREATION_TOKEN_TTL = "10m";

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

export function signRoomCreationToken(slug: string): string {
  const payload: RoomCreationTokenPayload = {
    slug,
    type: "room-creation"
  };

  return jwt.sign(payload, env.noteAuthSecret, {
    expiresIn: ROOM_CREATION_TOKEN_TTL
  });
}

export function verifyRoomCreationToken(token: string | null, slug: string): boolean {
  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, env.noteAuthSecret) as RoomCreationTokenPayload;
    return decoded.type === "room-creation" && decoded.slug === slug;
  } catch {
    return false;
  }
}
