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
  const { language } = useAppSettings();
  const text = copy[language];

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const slug = sanitizeSlug(name);
        router.push(`/${slug}`);
      }}
      className="flex w-full flex-col gap-3"
    >
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
      />
      <p className="text-xs text-[var(--text-soft)]">{text.helper}</p>
      <Button type="submit" className="h-11">
        {text.submit}
      </Button>
    </form>
  );
}
