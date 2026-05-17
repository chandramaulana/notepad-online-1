import { NextRequest, NextResponse } from "next/server";
import { getNoteBySlug } from "@/lib/notes";
import { sanitizeSlug } from "@/lib/slug";
import { verifyNoteToken } from "@/lib/auth";
import { getBearerToken, getClientIp } from "@/lib/request";
import { assertRateLimit } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    assertRateLimit(`note:get:${getClientIp(request)}`);

    const { slug } = await context.params;
    const safeSlug = sanitizeSlug(slug);
    const note = await getNoteBySlug(safeSlug);

    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    const token = getBearerToken(request);
    const canReadLockedContent = !note.locked || verifyNoteToken(token, note.slug);

    return NextResponse.json({
      slug: note.slug,
      locked: note.locked,
      contentJson: canReadLockedContent ? note.contentJson : null,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    });
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    return NextResponse.json({ message: "Failed to fetch note" }, { status: 500 });
  }
}
