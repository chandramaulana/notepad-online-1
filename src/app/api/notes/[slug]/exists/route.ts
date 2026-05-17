import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeSlug } from "@/lib/slug";
import { getClientIp } from "@/lib/request";
import { assertRateLimit } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    assertRateLimit(`note:exists:${getClientIp(request)}`);

    const { slug } = await context.params;
    const safeSlug = sanitizeSlug(slug);
    const note = await prisma.note.findUnique({
      where: {
        slug: safeSlug
      },
      select: {
        slug: true
      }
    });

    return NextResponse.json({
      slug: safeSlug,
      exists: Boolean(note)
    });
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    return NextResponse.json({ message: "Failed to check room" }, { status: 500 });
  }
}
