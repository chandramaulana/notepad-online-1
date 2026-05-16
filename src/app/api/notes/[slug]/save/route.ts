import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateNote } from "@/lib/notes";
import { sanitizeSlug } from "@/lib/slug";
import { verifyNoteToken } from "@/lib/auth";
import { getBearerToken, getClientIp } from "@/lib/request";
import { saveSchema } from "@/lib/validators";
import { assertRateLimit } from "@/lib/rate-limit";

const DEFAULT_COLLAB_FIELD = "tab-main";

type StoredNoteContentV2 = {
  version: 2;
  fields: Record<string, unknown>;
  tabOrder?: string[];
  tabLabels?: Record<string, string>;
};

function parseStoredContent(contentJson: string | null): StoredNoteContentV2 | null {
  if (!contentJson) {
    return null;
  }

  try {
    const parsed = JSON.parse(contentJson) as unknown;

    if (
      parsed &&
      typeof parsed === "object" &&
      "version" in parsed &&
      (parsed as { version?: number }).version === 2 &&
      "fields" in parsed &&
      typeof (parsed as { fields?: unknown }).fields === "object" &&
      (parsed as { fields?: unknown }).fields !== null
    ) {
      const parsedObject = parsed as {
        fields: Record<string, unknown>;
        tabOrder?: unknown;
        tabLabels?: unknown;
      };

      return {
        version: 2,
        fields: { ...(parsedObject.fields || {}) },
        tabOrder: Array.isArray(parsedObject.tabOrder)
          ? parsedObject.tabOrder.filter((value): value is string => typeof value === "string")
          : undefined,
        tabLabels:
          parsedObject.tabLabels && typeof parsedObject.tabLabels === "object"
            ? Object.fromEntries(
                Object.entries(parsedObject.tabLabels as Record<string, unknown>).filter(
                  (entry): entry is [string, string] =>
                    typeof entry[0] === "string" && typeof entry[1] === "string"
                )
              )
            : undefined
      };
    }

    return {
      version: 2,
      fields: {
        [DEFAULT_COLLAB_FIELD]: parsed
      }
    };
  } catch {
    return null;
  }
}

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
    const activeField = payload.activeTabId || DEFAULT_COLLAB_FIELD;
    const existing = parseStoredContent(note.contentJson);

    let parsedIncoming: unknown;
    try {
      parsedIncoming = JSON.parse(payload.contentJson);
    } catch {
      return NextResponse.json({ message: "Invalid content payload" }, { status: 400 });
    }

    const nextContent: StoredNoteContentV2 = {
      version: 2,
      fields: {
        ...(existing?.fields || {}),
        [activeField]: parsedIncoming
      },
      tabOrder: existing?.tabOrder,
      tabLabels: existing?.tabLabels
    };

    const updated = await prisma.note.update({
      where: { slug: note.slug },
      data: {
        contentJson: JSON.stringify(nextContent)
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
