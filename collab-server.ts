import { Server } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { sanitizeSlug } from "@/lib/slug";
import { verifyNoteToken } from "@/lib/auth";

const port = Number(process.env.COLLAB_PORT || 1234);

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
    await setRoomPresenceCount(documentName, 0);
  },
  async onAwarenessUpdate({ documentName, states }) {
    await setRoomPresenceCount(documentName, states.length);
  },
  async onDisconnect({ documentName, clientsCount }) {
    await setRoomPresenceCount(documentName, clientsCount);
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

    if (note.contentJson) {
      try {
        return TiptapTransformer.toYdoc(JSON.parse(note.contentJson), "default");
      } catch {
        return undefined;
      }
    }

    return undefined;
  },
  async onStoreDocument({ documentName, document }) {
    const slug = sanitizeSlug(documentName);
    const json = TiptapTransformer.fromYdoc(document, "default");

    await prisma.note.update({
      where: { slug },
      data: {
        contentJson: JSON.stringify(json)
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
