"use client";

import { useCallback, useEffect, useState } from "react";

export type AppLanguage = "id" | "en";
export type AppTheme = "light" | "dark";

const STORAGE_KEYS = {
  language: "notepad-language",
  theme: "notepad-theme"
};

const SETTINGS_EVENT = "notepad-settings-change";

function getSystemTheme(): AppTheme {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return "id";
  }
  const saved = localStorage.getItem(STORAGE_KEYS.language);
  return saved === "en" ? "en" : "id";
}

function getStoredTheme(): AppTheme {
  if (typeof window === "undefined") {
    return "light";
  }
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  return getSystemTheme();
}

function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.setAttribute("data-theme", theme);
}

function emitSettingsChange(payload: { language?: AppLanguage; theme?: AppTheme }) {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: payload }));
}

export function useAppSettings() {
  const [language, setLanguageState] = useState<AppLanguage>("id");
  const [theme, setThemeState] = useState<AppTheme>("light");

  useEffect(() => {
    const currentLanguage = getStoredLanguage();
    const currentTheme = getStoredTheme();
    setLanguageState(currentLanguage);
    setThemeState(currentTheme);
    applyTheme(currentTheme);
  }, []);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEYS.language && event.newValue) {
        setLanguageState(event.newValue === "en" ? "en" : "id");
      }
      if (event.key === STORAGE_KEYS.theme && (event.newValue === "light" || event.newValue === "dark")) {
        setThemeState(event.newValue);
        applyTheme(event.newValue);
      }
    }

    function onCustomEvent(event: Event) {
      const customEvent = event as CustomEvent<{ language?: AppLanguage; theme?: AppTheme }>;
      if (customEvent.detail?.language) {
        setLanguageState(customEvent.detail.language);
      }
      if (customEvent.detail?.theme) {
        setThemeState(customEvent.detail.theme);
        applyTheme(customEvent.detail.theme);
      }
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener(SETTINGS_EVENT, onCustomEvent as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SETTINGS_EVENT, onCustomEvent as EventListener);
    };
  }, []);

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    localStorage.setItem(STORAGE_KEYS.language, nextLanguage);
    emitSettingsChange({ language: nextLanguage });
  }, []);

  const setTheme = useCallback((nextTheme: AppTheme) => {
    setThemeState(nextTheme);
    localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
    applyTheme(nextTheme);
    emitSettingsChange({ theme: nextTheme });
  }, []);

  return {
    language,
    setLanguage,
    theme,
    setTheme
  };
}
