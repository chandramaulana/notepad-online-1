import { Server } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import * as Y from "yjs";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { sanitizeSlug } from "@/lib/slug";
import { verifyNoteToken } from "@/lib/auth";

const port = Number(process.env.COLLAB_PORT || 1234);
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

function readDocumentFieldNames(document: Y.Doc): string[] {
  const fields = new Set<string>(["default", DEFAULT_COLLAB_FIELD]);

  try {
    const tabOrder = document.getArray<string>("tab-order").toArray();
    for (const tabId of tabOrder) {
      if (tabId) {
        fields.add(tabId);
      }
    }
  } catch {
    // Ignore tab list read errors.
  }

  return Array.from(fields);
}

function isPrismaAuthError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P1000"
  );
}

async function safeSetRoomPresenceCount(slug: string, activeUsers: number) {
  try {
    await setRoomPresenceCount(slug, activeUsers);
  } catch (error) {
    if (isPrismaAuthError(error)) {
      console.error("[presence] Database authentication failed while updating room presence.");
      return;
    }

    console.error("[presence] Failed to update room presence.", error);
  }
}

async function setRoomPresenceCount(slug: string, activeUsers: number) {
  const safeSlug = sanitizeSlug(slug);
  const nextActiveUsers = Math.max(activeUsers, 0);
  const existing = await prisma.roomPresence.findUnique({ where: { slug: safeSlug } });

  if (!existing) {
    await prisma.roomPresence.create({
      data: {
        slug: safeSlug,
        activeUsers: nextActiveUsers
      }
    });
    return;
  }

  await prisma.roomPresence.update({
    where: { slug: safeSlug },
    data: {
      activeUsers: nextActiveUsers
    }
  });
}

const server = new Server({
  port,
  async onConnect({ documentName }) {
    // Keep room row alive; realtime count is synced by awareness/disconnect hooks.
    await safeSetRoomPresenceCount(documentName, 0);
  },
  async onAwarenessUpdate({ documentName, states }) {
    await safeSetRoomPresenceCount(documentName, states.length);
  },
  async onDisconnect({ documentName, clientsCount }) {
    await safeSetRoomPresenceCount(documentName, clientsCount);
  },
  async onAuthenticate({ documentName, token }) {
    const slug = sanitizeSlug(documentName);
    const note = await prisma.note.findUnique({ where: { slug } });

    if (!note?.locked) {
      return;
    }

    if (!verifyNoteToken(typeof token === "string" ? token : null, slug)) {
      throw new Error("Unauthorized");
    }
  },
  async onLoadDocument({ documentName }) {
    const slug = sanitizeSlug(documentName);

    const note = await prisma.note.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        locked: false
      }
    });

    const stored = parseStoredContent(note.contentJson);

    if (stored && Object.keys(stored.fields).length > 0) {
      const merged = new Y.Doc();
      let loaded = false;

      for (const [field, content] of Object.entries(stored.fields)) {
        if (!field || !content) {
          continue;
        }

        try {
          const fieldDoc = TiptapTransformer.toYdoc(content, field);
          Y.applyUpdate(merged, Y.encodeStateAsUpdate(fieldDoc));
          loaded = true;
        } catch {
          // Ignore invalid field payload and continue with valid fields.
        }
      }

      if (loaded) {
        if (stored.tabOrder?.length) {
          const order = merged.getArray<string>("tab-order");
          if (order.length === 0) {
            order.push(stored.tabOrder);
          }
        }

        if (stored.tabLabels && Object.keys(stored.tabLabels).length > 0) {
          const labels = merged.getMap<string>("tab-labels");
          if (labels.size === 0) {
            for (const [tabId, label] of Object.entries(stored.tabLabels)) {
              labels.set(tabId, label);
            }
          }
        }

        return merged;
      }
    }

    return undefined;
  },
  async onStoreDocument({ documentName, document }) {
    const slug = sanitizeSlug(documentName);

    const fields: Record<string, unknown> = {};

    for (const field of readDocumentFieldNames(document)) {
      try {
        fields[field] = TiptapTransformer.fromYdoc(document, field);
      } catch {
        // Ignore empty/invalid field snapshots.
      }
    }

    const tabOrder = document.getArray<string>("tab-order").toArray();
    const tabLabelsEntries = Array.from(document.getMap<string>("tab-labels").entries());
    const tabLabels = Object.fromEntries(tabLabelsEntries);

    if (Object.keys(fields).length === 0) {
      fields[DEFAULT_COLLAB_FIELD] = TiptapTransformer.fromYdoc(document, DEFAULT_COLLAB_FIELD);
    }

    await prisma.note.update({
      where: { slug },
      data: {
        contentJson: JSON.stringify({
          version: 2,
          fields,
          tabOrder,
          tabLabels
        })
      }
    });
  }
});

// Clear stale online counters from previous process before accepting connections.
prisma.roomPresence.updateMany({
  data: {
    activeUsers: 0
  }
}).catch(() => {
  // Ignore startup reset errors; counters will self-heal from awareness updates.
});

server.listen();

console.log(`Hocuspocus websocket running at ${env.collabUrl} on port ${port}`);
