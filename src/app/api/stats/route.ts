import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/request";
import { assertRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    assertRateLimit(`stats:get:${getClientIp(request)}`);

    const [roomsCreated, aggregate] = await Promise.all([
      prisma.note.count(),
      prisma.roomPresence.aggregate({
        _sum: {
          activeUsers: true
        }
      })
    ]);

    return NextResponse.json({
      roomsCreated,
      activeUsers: aggregate._sum.activeUsers || 0,
      refreshedAt: new Date().toISOString()
    });
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
  }
}
