"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sanitizeSlug } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { useAppSettings } from "@/components/ui/use-app-settings";

const copy = {
  id: {
    label: "Silakan beri nama notepad kalian",
    placeholder: "Contoh: Meeting Team",
    helper: "Spasi akan otomatis menjadi tanda hubung (-).",
    submit: "Buka Notepad",
    creatingSubmit: "Membuat Room...",
    creatingTitle: "Membuat Room Baru",
    creatingDescription: "Sedang menyiapkan ruang kolaborasi aman untuk mengurangi spam room otomatis.",
    creatingHint: "Mohon tunggu sebentar"
  },
  en: {
    label: "Name your notepad",
    placeholder: "Example: Team Meeting",
    helper: "Spaces are automatically converted to dashes (-).",
    submit: "Open Notepad",
    creatingSubmit: "Creating Room...",
    creatingTitle: "Creating New Room",
    creatingDescription: "Preparing a safe collaboration space to reduce automated room spam.",
    creatingHint: "Please wait"
  }
};

function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    const timeoutId = window.setTimeout(() => {
      window.clearTimeout(timeoutId);
      resolve();
    }, duration);
  });
}

export function LandingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { language } = useAppSettings();
  const text = copy[language];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isCreating) {
      return;
    }

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

      setIsCreating(true);
      setProgress(0);

      const delay = 5000 + Math.floor(Math.random() * 5001);
      const startedAt = Date.now();
      const intervalId = window.setInterval(() => {
        const elapsed = Date.now() - startedAt;
        const ratio = Math.min(1, elapsed / delay);
        setProgress(Math.round(ratio * 100));
      }, 90);

      await sleep(delay);
      window.clearInterval(intervalId);
      setProgress(100);
      router.push(`/${slug}`);
    } catch {
      router.push(`/${slug}`);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <>
      {isCreating && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 backdrop-blur-sm">
          <div className="create-room-loader w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-2xl shadow-black/20">
            <div className="mx-auto mb-4 grid h-24 w-24 place-items-center">
              <div className="loader-orbit loader-orbit-a" aria-hidden="true" />
              <div className="loader-orbit loader-orbit-b" aria-hidden="true" />
              <div className="loader-core" aria-hidden="true" />
            </div>

            <h3 className="text-center text-lg font-semibold">{text.creatingTitle}</h3>
            <p className="mt-2 text-center text-sm text-[var(--text-soft)]">{text.creatingDescription}</p>

            <div className="mt-5 overflow-hidden rounded-full border border-[var(--line)] bg-[var(--bg-soft)]/60">
              <div className="loader-progress" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-center text-xs uppercase tracking-wide text-[var(--text-soft)]">
              {text.creatingHint} • {progress}%
            </p>
          </div>
        </div>
      )}

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
          disabled={isCreating}
        />
        <p className="text-xs text-[var(--text-soft)]">{text.helper}</p>
        <Button type="submit" className="h-11" disabled={isCreating}>
          {isCreating ? text.creatingSubmit : text.submit}
        </Button>
      </form>
    </>
  );
}
