"use client";

import { useEffect, useState } from "react";
import { LandingForm } from "@/components/home/landing-form";
import { useAppSettings } from "@/components/ui/use-app-settings";

const copy = {
  id: {
    badge: "Aitonomous Notepad",
    title: "Catatan Kolaborasi Realtime",
    subtitle: "Buka URL unik apa pun dan langsung kolaborasi realtime tanpa setup room manual.",
    activeUsers: "User Aktif",
    roomsCreated: "Room Dibuat"
  },
  en: {
    badge: "Aitonomous Notepad",
    title: "Realtime Collaborative Notes",
    subtitle: "Open any unique URL and instantly collaborate in realtime with no manual room setup.",
    activeUsers: "Active Users",
    roomsCreated: "Rooms Created"
  }
};

type StatsPayload = {
  activeUsers: number;
  roomsCreated: number;
};

export default function HomePage() {
  const { language } = useAppSettings();
  const text = copy[language];
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
        // keep previous stats when request fails
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
    <section className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-[var(--line)] bg-[var(--card)] p-8 shadow-2xl shadow-black/10 backdrop-blur-sm">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">{text.badge}</p>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">{text.title}</h1>
        <p className="mb-7 text-sm text-[var(--text-soft)]">{text.subtitle}</p>

        <div className="mb-7 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)]/55 p-3">
            <p className="text-xs uppercase tracking-wider text-[var(--text-soft)]">{text.activeUsers}</p>
            <p className="mt-1 text-2xl font-semibold">{stats.activeUsers}</p>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)]/55 p-3">
            <p className="text-xs uppercase tracking-wider text-[var(--text-soft)]">{text.roomsCreated}</p>
            <p className="mt-1 text-2xl font-semibold">{stats.roomsCreated}</p>
          </div>
        </div>

        <LandingForm />
      </div>
    </section>
  );
}
