import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getOrCreateNote } from "@/lib/notes";
import { sanitizeSlug } from "@/lib/slug";
import { verifyNoteToken } from "@/lib/auth";
import { getBearerToken, getClientIp } from "@/lib/request";
import { lockSchema } from "@/lib/validators";
import { assertRateLimit } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    assertRateLimit(`note:lock:${getClientIp(request)}`);

    const { slug } = await context.params;
    const safeSlug = sanitizeSlug(slug);
    const note = await getOrCreateNote(safeSlug);

    if (note.locked) {
      const token = getBearerToken(request);
      if (!verifyNoteToken(token, note.slug)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }

    const payload = lockSchema.parse(await request.json());
    const pinHash = await bcrypt.hash(payload.pin, 10);

    await prisma.note.update({
      where: { slug: note.slug },
      data: {
        locked: true,
        pinHash,
        unlockFailures: 0,
        unlockBlockedUntil: null
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    return NextResponse.json({ message: "Failed to lock note" }, { status: 400 });
  }
}
