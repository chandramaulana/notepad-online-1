"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LandingForm } from "@/components/home/landing-form";
import { useAppSettings } from "@/components/ui/use-app-settings";
import { SEO_KEYWORDS_EN } from "@/lib/seo-keywords";

const copy = {
  id: {
    badge: "Chandra Notepad",
    topHint: "Realtime Collaborative Workspace",
    title: "Mulai Notepad Anda",
    subtitle: "Fokus pada ide. Buat room, bagikan link, lalu kolaborasi realtime tanpa setup rumit.",
    activeUsers: "User Aktif",
    roomsCreated: "Room Dibuat",
    bottomTagline: "Simple, fast, and built for focused collaboration.",
    blogLabel: "Baca Blog",
    guideLabel: "Panduan",
    compareLabel: "Perbandingan"
  },
  en: {
    badge: "Chandra Notepad",
    topHint: "Realtime Collaborative Workspace",
    title: "Start Your Notepad",
    subtitle: "Stay focused. Create a room, share the link, and collaborate instantly without complex setup.",
    activeUsers: "Active Users",
    roomsCreated: "Rooms Created",
    bottomTagline: "Simple, fast, and built for focused collaboration.",
    blogLabel: "Blog",
    guideLabel: "Guides",
    compareLabel: "Compare"
  }
};

type StatsPayload = {
  activeUsers: number;
  roomsCreated: number;
};

type HomeCopy = {
  badge: string;
  topHint: string;
  title: string;
  subtitle: string;
  activeUsers: string;
  roomsCreated: string;
  bottomTagline: string;
  blogLabel: string;
  guideLabel: string;
  compareLabel: string;
};

const typedCopy: Record<"id" | "en", HomeCopy> = copy;

export function HomePageClient() {
  const { language } = useAppSettings();
  const text = typedCopy[language];
  const seoKeywords = SEO_KEYWORDS_EN;
  const [stats, setStats] = useState<StatsPayload>({
    activeUsers: 0,
    roomsCreated: 0
  });

  useEffect(() => {
    let active = true;

    async function fetchStats() {
      try {
        const response = await fetch("/api/stats", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as StatsPayload;
        if (active) {
          setStats({
            activeUsers: payload.activeUsers,
            roomsCreated: payload.roomsCreated
          });
        }
      } catch {
        // Keep previous values on network failures.
      }
    }

    fetchStats();
    const intervalId = setInterval(fetchStats, 3000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="flex min-h-[calc(100vh-3rem)] flex-col md:min-h-[calc(100vh-4rem)]">
        <header className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)]/90 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-soft)]">{text.badge}</p>
            <p className="mt-1 text-xs text-[var(--text-soft)] md:text-sm">{text.topHint}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)]/65 px-3 py-1 text-xs text-[var(--text-soft)] md:text-sm">
              {text.activeUsers}: <strong className="text-[var(--text)]">{stats.activeUsers}</strong>
            </span>
            <span className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)]/65 px-3 py-1 text-xs text-[var(--text-soft)] md:text-sm">
              {text.roomsCreated}: <strong className="text-[var(--text)]">{stats.roomsCreated}</strong>
            </span>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-2xl rounded-3xl border border-[var(--line)] bg-[var(--card)] px-5 py-8 text-center shadow-2xl shadow-black/10 md:px-8 md:py-10">
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{text.title}</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-soft)] md:text-base">{text.subtitle}</p>

            <div className="mx-auto mt-7 max-w-xl rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)]/45 p-4 text-left md:p-5">
              <LandingForm />
            </div>
          </div>
        </main>

        <footer className="rounded-2xl border border-[var(--line)] bg-[var(--card)]/90 p-4 shadow-lg shadow-black/5 backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[var(--text-soft)]">{text.bottomTagline}</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)]/45 px-3 py-1 text-xs text-[var(--text-soft)] transition-colors hover:text-[var(--accent)] md:text-sm"
              >
                {text.blogLabel}
              </Link>
              <Link
                href="/learn"
                className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)]/45 px-3 py-1 text-xs text-[var(--text-soft)] transition-colors hover:text-[var(--accent)] md:text-sm"
              >
                {text.guideLabel}
              </Link>
              <Link
                href="/compare"
                className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)]/45 px-3 py-1 text-xs text-[var(--text-soft)] transition-colors hover:text-[var(--accent)] md:text-sm"
              >
                {text.compareLabel}
              </Link>
            </div>
          </div>

          <details className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--bg-soft)]/35 p-3">
            <summary className="cursor-pointer text-sm font-medium text-[var(--text-soft)]">SEO keywords</summary>
            <div className="mt-3 flex flex-wrap gap-2">
              {seoKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-[var(--line)] bg-[var(--card)] px-2.5 py-1 text-xs text-[var(--text-soft)]"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </details>
        </footer>
      </div>
    </section>
  );
}
