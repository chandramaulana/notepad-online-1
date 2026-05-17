"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppSettings } from "@/components/ui/use-app-settings";

type MathVerificationGateProps = {
  slug: string;
  onVerified?: () => void;
  className?: string;
};

type ChallengePayload = {
  left: number;
  right: number;
  challengeToken: string;
};

const copy = {
  id: {
    title: "Verifikasi Manusia",
    description: "Selesaikan penjumlahan sederhana untuk memastikan Anda bukan bot.",
    loading: "Menyiapkan soal...",
    answerPlaceholder: "Jawaban",
    submit: "Verifikasi",
    invalid: "Masukkan angka jawaban yang valid.",
    failed: "Verifikasi gagal. Coba lagi.",
    refresh: "Soal Baru"
  },
  en: {
    title: "Human Verification",
    description: "Solve a simple addition question to verify you are not a bot.",
    loading: "Preparing challenge...",
    answerPlaceholder: "Answer",
    submit: "Verify",
    invalid: "Please enter a valid numeric answer.",
    failed: "Verification failed. Please try again.",
    refresh: "New Question"
  }
} as const;

export function MathVerificationGate({ slug, onVerified, className }: MathVerificationGateProps) {
  const router = useRouter();
  const { language } = useAppSettings();
  const text = copy[language];
  const [answer, setAnswer] = useState("");
  const [challenge, setChallenge] = useState<ChallengePayload | null>(null);
  const [loadingChallenge, setLoadingChallenge] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenge = useCallback(async () => {
    setLoadingChallenge(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${encodeURIComponent(slug)}/human`, {
        method: "GET",
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(text.failed);
      }

      const payload = (await response.json()) as ChallengePayload;
      setChallenge(payload);
    } catch {
      setError(text.failed);
    } finally {
      setLoadingChallenge(false);
    }
  }, [slug, text.failed]);

  useEffect(() => {
    fetchChallenge().catch(() => undefined);
  }, [fetchChallenge]);

  async function submitVerification(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challenge || submitting) {
      return;
    }

    const parsedAnswer = Number(answer);
    if (!Number.isFinite(parsedAnswer)) {
      setError(text.invalid);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${encodeURIComponent(slug)}/human`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          answer: parsedAnswer,
          challengeToken: challenge.challengeToken
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message || text.failed);
      }

      if (onVerified) {
        onVerified();
      } else {
        router.refresh();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : text.failed);
      setAnswer("");
      await fetchChallenge();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={className || "mx-auto mt-20 w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6"}>
      <h2 className="mb-2 text-xl font-semibold">{text.title}</h2>
      <p className="mb-4 text-sm text-[var(--text-soft)]">{text.description}</p>

      {loadingChallenge || !challenge ? (
        <p className="text-sm text-[var(--text-soft)]">{text.loading}</p>
      ) : (
        <form className="space-y-3" onSubmit={submitVerification}>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-soft)]/45 px-3 py-2 text-center text-xl font-semibold tracking-wide">
            {challenge.left} + {challenge.right} = ?
          </div>

          <div className="flex gap-2">
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              name="answer"
              inputMode="numeric"
              autoComplete="off"
              className="h-10 flex-1 rounded-xl border border-[var(--line)] bg-transparent px-3 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder={text.answerPlaceholder}
              disabled={submitting}
            />
            <Button type="submit" disabled={submitting}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              {text.submit}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => fetchChallenge()}
            disabled={submitting}
            className="text-xs text-[var(--text-soft)] underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {text.refresh}
          </button>
        </form>
      )}

      {error ? (
        <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
      ) : null}
    </div>
  );
}
