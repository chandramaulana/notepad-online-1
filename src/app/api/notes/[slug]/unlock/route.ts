import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getNoteBySlug } from "@/lib/notes";
import { sanitizeSlug } from "@/lib/slug";
import { signNoteToken } from "@/lib/auth";
import { getClientIp } from "@/lib/request";
import { assertRateLimit } from "@/lib/rate-limit";
import { unlockSchema } from "@/lib/validators";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    assertRateLimit(`note:unlock:${getClientIp(request)}`);

    const { slug } = await context.params;
    const safeSlug = sanitizeSlug(slug);
    const note = await getNoteBySlug(safeSlug);

    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    if (!note.locked || !note.pinHash) {
      return NextResponse.json({ token: signNoteToken(note.slug) });
    }

    const now = new Date();
    if (note.unlockBlockedUntil && note.unlockBlockedUntil > now) {
      const retryAfterSeconds = Math.ceil((note.unlockBlockedUntil.getTime() - now.getTime()) / 1000);
      return NextResponse.json(
        {
          message: `Terlalu banyak percobaan. Coba lagi dalam ${retryAfterSeconds} detik.`
        },
        { status: 429 }
      );
    }

    const payload = unlockSchema.parse(await request.json());
    const ok = await bcrypt.compare(payload.pin, note.pinHash);

    if (!ok) {
      const nextFailures = note.unlockFailures + 1;

      if (nextFailures >= 5) {
        const blockedUntil = new Date(Date.now() + 60 * 1000);
        await prisma.note.update({
          where: { slug: note.slug },
          data: {
            unlockFailures: 0,
            unlockBlockedUntil: blockedUntil
          }
        });

        return NextResponse.json(
          {
            message: "PIN salah 5 kali. Tunggu 1 menit sebelum mencoba lagi."
          },
          { status: 429 }
        );
      }

      await prisma.note.update({
        where: { slug: note.slug },
        data: {
          unlockFailures: nextFailures,
          unlockBlockedUntil: null
        }
      });

      return NextResponse.json(
        {
          message: `PIN salah. Sisa percobaan ${5 - nextFailures}x.`
        },
        { status: 401 }
      );
    }

    await prisma.note.update({
      where: { slug: note.slug },
      data: {
        unlockFailures: 0,
        unlockBlockedUntil: null
      }
    });

    const token = signNoteToken(note.slug);

    return NextResponse.json({ token });
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    return NextResponse.json({ message: "Failed to unlock note" }, { status: 400 });
  }
}
