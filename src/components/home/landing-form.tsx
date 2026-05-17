"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sanitizeSlug } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { useAppSettings } from "@/components/ui/use-app-settings";
import { MathVerificationGate } from "@/components/verification/math-verification-gate";

const copy = {
  id: {
    label: "Silakan beri nama notepad kalian",
    placeholder: "Contoh: Meeting Team",
    helper: "Spasi akan otomatis menjadi tanda hubung (-).",
    submit: "Buka Notepad"
  },
  en: {
    label: "Name your notepad",
    placeholder: "Example: Team Meeting",
    helper: "Spaces are automatically converted to dashes (-).",
    submit: "Open Notepad"
  }
};

export function LandingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [verifyingSlug, setVerifyingSlug] = useState<string | null>(null);
  const { language } = useAppSettings();
  const text = copy[language];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const slug = sanitizeSlug(name);

    try {
      const response = await fetch(`/api/notes/${encodeURIComponent(slug)}/exists`, {
        method: "GET",
        cache: "no-store"
      });

      const shouldDelay = response.ok
        ? !((await response.json()) as { exists?: boolean }).exists
        : false;

      if (!shouldDelay) {
        router.push(`/${slug}`);
        return;
      }

      setVerifyingSlug(slug);
    } catch {
      router.push(`/${slug}`);
    }
  }

  return (
    <>
      {verifyingSlug ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <MathVerificationGate
              slug={verifyingSlug}
              className="w-full rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-2xl"
              onVerified={() => {
                router.push(`/${verifyingSlug}`);
              }}
            />
            <div className="mt-3 flex justify-end">
              <Button type="button" variant="ghost" onClick={() => setVerifyingSlug(null)}>
                {language === "id" ? "Batal" : "Cancel"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
        <label htmlFor="noteName" className="text-sm font-medium text-[var(--text-soft)]">
          {text.label}
        </label>
        <input
          id="noteName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={text.placeholder}
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 text-base outline-none ring-0 placeholder:text-[var(--text-soft)] focus:border-[var(--accent)]"
          autoComplete="off"
          spellCheck={false}
          disabled={Boolean(verifyingSlug)}
        />
        <p className="text-xs text-[var(--text-soft)]">{text.helper}</p>
        <Button type="submit" className="h-11" disabled={Boolean(verifyingSlug)}>
          {text.submit}
        </Button>
      </form>
    </>
  );
}
