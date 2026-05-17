import { NextRequest, NextResponse } from "next/server";
import { getNoteBySlug } from "@/lib/notes";
import { sanitizeSlug } from "@/lib/slug";
import { verifyNoteToken } from "@/lib/auth";
import { getBearerToken, getClientIp } from "@/lib/request";
import { assertRateLimit } from "@/lib/rate-limit";
import { jsonToMarkdown, jsonToTextByField } from "@/lib/content";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    assertRateLimit(`note:export:${getClientIp(request)}`);

    const format = request.nextUrl.searchParams.get("format") || "txt";
    const tab = request.nextUrl.searchParams.get("tab") || undefined;
    const { slug } = await context.params;
    const safeSlug = sanitizeSlug(slug);
    const note = await getNoteBySlug(safeSlug);

    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    if (note.locked) {
      const token = getBearerToken(request);
      if (!verifyNoteToken(token, note.slug)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }

    const content = format === "md" ? jsonToMarkdown(note.contentJson, tab) : jsonToTextByField(note.contentJson, tab);
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
