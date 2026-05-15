import { NextRequest, NextResponse } from "next/server";
import { getOrCreateNote } from "@/lib/notes";
import { sanitizeSlug } from "@/lib/slug";
import { verifyNoteToken } from "@/lib/auth";
import { getBearerToken, getClientIp } from "@/lib/request";
import { assertRateLimit } from "@/lib/rate-limit";
import { jsonToMarkdown, jsonToText } from "@/lib/content";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    assertRateLimit(`note:export:${getClientIp(request)}`);

    const format = request.nextUrl.searchParams.get("format") || "txt";
    const { slug } = await context.params;
    const safeSlug = sanitizeSlug(slug);
    const note = await getOrCreateNote(safeSlug);

    if (note.locked) {
      const token = getBearerToken(request);
      if (!verifyNoteToken(token, note.slug)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }

    const content = format === "md" ? jsonToMarkdown(note.contentJson) : jsonToText(note.contentJson);
    const extension = format === "md" ? "md" : "txt";

    return new NextResponse(content, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "content-disposition": `attachment; filename=\"${safeSlug}.${extension}\"`
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    return NextResponse.json({ message: "Failed to export note" }, { status: 400 });
  }
}
