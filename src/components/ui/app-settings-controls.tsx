"use client";

import { Languages, MoonStar, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppSettings } from "@/components/ui/use-app-settings";

const copy = {
  id: {
    theme: "Tema",
    language: "Bahasa"
  },
  en: {
    theme: "Theme",
    language: "Language"
  }
};

export function AppSettingsControls() {
  const pathname = usePathname();
  const { language, setLanguage, theme, setTheme } = useAppSettings();
  const text = copy[language];

  const shouldSyncLangToUrl =
    pathname === "/" ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/use-cases") ||
    pathname.startsWith("/templates") ||
    pathname.startsWith("/compare");

  function handleLanguageChange(nextLanguage: "id" | "en") {
    setLanguage(nextLanguage);

    if (!shouldSyncLangToUrl) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set("lang", nextLanguage);
    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    window.location.assign(nextUrl);
  }

  return (
    <div className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--card)]/90 p-2 shadow-xl backdrop-blur md:bottom-4 md:left-auto md:right-4 md:translate-x-0">
      <div className="flex items-center gap-1 rounded-xl border border-[var(--line)] p-1">
        <Button
          type="button"
          variant={theme === "light" ? "default" : "ghost"}
          className="h-8 min-w-9 px-2 text-xs"
          onClick={() => setTheme("light")}
          aria-label={`${text.theme} light`}
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={theme === "dark" ? "default" : "ghost"}
          className="h-8 min-w-9 px-2 text-xs"
          onClick={() => setTheme("dark")}
          aria-label={`${text.theme} dark`}
        >
          <MoonStar className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-[var(--line)] p-1">
        <Button
          type="button"
          variant={language === "id" ? "default" : "ghost"}
          className="h-8 min-w-11 px-2 text-xs"
          onClick={() => handleLanguageChange("id")}
          aria-label={`${text.language} Indonesia`}
        >
          <Languages className="mr-1 h-4 w-4" /> ID
        </Button>
        <Button
          type="button"
          variant={language === "en" ? "default" : "ghost"}
          className="h-8 min-w-11 px-2 text-xs"
          onClick={() => handleLanguageChange("en")}
          aria-label={`${text.language} English`}
        >
          EN
        </Button>
      </div>
    </div>
  );
}
