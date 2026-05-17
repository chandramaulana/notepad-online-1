import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { signRoomCreationToken } from "@/lib/auth";
import { env } from "@/lib/env";
import { sanitizeSlug } from "@/lib/slug";
import { getClientIp } from "@/lib/request";
import { assertRateLimit } from "@/lib/rate-limit";

const CHALLENGE_COOKIE = "room_creation_verified";
const CHALLENGE_ANSWER_TTL_SECONDS = 5 * 60;
const CHALLENGE_TOKEN_TTL = "2m";

type ChallengePayload = {
  slug: string;
  left: number;
  right: number;
  answer: number;
  type: "human-check";
};

function encodeChallenge(payload: ChallengePayload): string {
  return jwt.sign(payload, env.noteAuthSecret, {
    expiresIn: CHALLENGE_TOKEN_TTL
  });
}

function decodeChallenge(token: string): ChallengePayload | null {
  try {
    const parsed = jwt.verify(token, env.noteAuthSecret) as Partial<ChallengePayload>;

    if (
      parsed.type !== "human-check" ||
      typeof parsed.slug !== "string" ||
      typeof parsed.left !== "number" ||
      typeof parsed.right !== "number" ||
      typeof parsed.answer !== "number"
    ) {
      return null;
    }

    return {
      slug: parsed.slug,
      left: parsed.left,
      right: parsed.right,
      answer: parsed.answer,
      type: "human-check"
    };
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    assertRateLimit(`note:human:get:${getClientIp(request)}`);

    const { slug } = await context.params;
    const safeSlug = sanitizeSlug(slug);
    const left = Math.floor(Math.random() * 11);
    const right = Math.floor(Math.random() * 11);
    const answer = left + right;
    const challengeToken = encodeChallenge({
      slug: safeSlug,
      left,
      right,
      answer,
      type: "human-check"
    });

    return NextResponse.json({
      slug: safeSlug,
      left,
      right,
      challengeToken
    });
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    return NextResponse.json({ message: "Failed to generate challenge" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    assertRateLimit(`note:human:post:${getClientIp(request)}`);

    const { slug } = await context.params;
    const safeSlug = sanitizeSlug(slug);

    const payload = (await request.json()) as {
      answer?: number;
      challengeToken?: string;
    };

    const challengeToken = String(payload.challengeToken || "");
    const challenge = decodeChallenge(challengeToken);

    if (!challenge || challenge.slug !== safeSlug) {
      return NextResponse.json({ message: "Invalid challenge" }, { status: 400 });
    }

    if (Number(payload.answer) !== challenge.answer) {
      return NextResponse.json({ message: "Jawaban salah. Coba lagi." }, { status: 400 });
    }

    const roomToken = signRoomCreationToken(safeSlug);
    const response = NextResponse.json({ ok: true });

    response.cookies.set(CHALLENGE_COOKIE, roomToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: CHALLENGE_ANSWER_TTL_SECONDS
    });

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    return NextResponse.json({ message: "Failed to verify challenge" }, { status: 500 });
  }
}
