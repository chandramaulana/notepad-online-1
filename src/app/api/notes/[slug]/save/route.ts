import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateNote } from "@/lib/notes";
import { sanitizeSlug } from "@/lib/slug";
import { verifyNoteToken } from "@/lib/auth";
import { getBearerToken, getClientIp } from "@/lib/request";
import { saveSchema } from "@/lib/validators";
import { assertRateLimit } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    assertRateLimit(`note:save:${getClientIp(request)}`);

    const { slug } = await context.params;
    const safeSlug = sanitizeSlug(slug);
    const note = await getOrCreateNote(safeSlug);
    const token = getBearerToken(request);

    if (note.locked && !verifyNoteToken(token, note.slug)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = saveSchema.parse(await request.json());

    const updated = await prisma.note.update({
      where: { slug: note.slug },
      data: {
        contentJson: payload.contentJson
      }
    });

    return NextResponse.json({ ok: true, updatedAt: updated.updatedAt });
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    return NextResponse.json({ message: "Failed to save note" }, { status: 500 });
  }
}
