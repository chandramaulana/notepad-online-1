"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LandingForm } from "@/components/home/landing-form";
import { useAppSettings } from "@/components/ui/use-app-settings";

const copy = {
  id: {
    badge: "Aitonomous Notepad",
    title: "Catatan Kolaborasi Realtime",
    subtitle:
      "Buka URL unik apa pun dan langsung kolaborasi realtime untuk menulis catatan meeting, rencana proyek, checklist, atau dokumentasi tim.",
    activeUsers: "User Aktif",
    roomsCreated: "Room Dibuat",
    sectionTitle: "Kenapa Aitonomous Notepad Mudah Dipakai",
    sectionDescription:
      "Notepad online ini dirancang cepat, ringan, dan siap dipakai dari browser tanpa instalasi tambahan.",
    points: [
      "Kolaborasi realtime: perubahan terlihat langsung oleh semua anggota tim.",
      "Link room sederhana: buat dan bagikan URL notepad dalam hitungan detik.",
      "Auto save dan riwayat update: cocok untuk meeting notes dan koordinasi harian.",
      "Privasi dasar dengan lock PIN agar room penting tidak mudah diakses."
    ],
    faqTitle: "Pertanyaan Umum",
    blogTitle: "Artikel Populer",
    blogLinks: [
      {
        href: "/blog/how-it-works" as BlogHref,
        label: "Cara Kerja Notepad Online Realtime"
      },
      {
        href: "/blog/features" as BlogHref,
        label: "Fitur Utama Notepad Online"
      },
      {
        href: "/blog/privacy" as BlogHref,
        label: "Privasi dan Keamanan Dasar"
      }
    ],
    faq: [
      {
        q: "Apakah bisa dipakai tanpa login?",
        a: "Bisa. Cukup buka halaman utama, masukkan nama room, lalu mulai menulis dan bagikan link room tersebut."
      },
      {
        q: "Apakah notepad ini cocok untuk tim kerja?",
        a: "Ya. Cocok untuk catatan meeting, brainstorming, task list, dokumentasi singkat, dan koordinasi realtime."
      }
    ]
  },
  en: {
    badge: "Aitonomous Notepad",
    title: "Realtime Collaborative Notes",
    subtitle:
      "Open any unique URL and instantly collaborate in realtime for meeting notes, project plans, checklists, and team documentation.",
    activeUsers: "Active Users",
    roomsCreated: "Rooms Created",
    sectionTitle: "Why Aitonomous Notepad Is Easy To Use",
    sectionDescription:
      "This online notepad is built to be fast, lightweight, and ready from any browser without extra setup.",
    points: [
      "Realtime collaboration so every edit appears instantly for teammates.",
      "Simple room links to create and share notes in seconds.",
      "Auto-save and update tracking for daily meetings and planning.",
      "Basic privacy lock with PIN for sensitive collaboration rooms."
    ],
    faqTitle: "Frequently Asked Questions",
    blogTitle: "Popular Articles",
    blogLinks: [
      {
        href: "/blog/how-it-works" as BlogHref,
        label: "How Realtime Online Notepad Works"
      },
      {
        href: "/blog/features" as BlogHref,
        label: "Top Features of Collaborative Notes"
      },
      {
        href: "/blog/privacy" as BlogHref,
        label: "Basic Privacy and Security"
      }
    ],
    faq: [
      {
        q: "Can I use it without creating an account?",
        a: "Yes. Open the homepage, enter a room name, and start writing right away."
      },
      {
        q: "Is it suitable for team collaboration?",
        a: "Yes. It works well for meeting notes, brainstorming, task tracking, and lightweight team documentation."
      }
    ]
  }
};

type StatsPayload = {
  activeUsers: number;
  roomsCreated: number;
};

type BlogHref = "/blog/how-it-works" | "/blog/features" | "/blog/privacy";

type HomeCopy = {
  badge: string;
  title: string;
  subtitle: string;
  activeUsers: string;
  roomsCreated: string;
  sectionTitle: string;
  sectionDescription: string;
  points: string[];
  faqTitle: string;
  blogTitle: string;
  blogLinks: Array<{ href: BlogHref; label: string }>;
  faq: Array<{ q: string; a: string }>;
};

const typedCopy: Record<"id" | "en", HomeCopy> = copy;

export function HomePageClient() {
  const { language } = useAppSettings();
  const text = typedCopy[language];
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
        // Keep existing values when request fails.
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
      <div className="w-full max-w-3xl rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-2xl shadow-black/10 backdrop-blur-sm md:p-8">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">{text.badge}</p>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight md:text-4xl">{text.title}</h1>
        <p className="mb-7 text-sm text-[var(--text-soft)] md:text-base">{text.subtitle}</p>

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

        <div className="mt-8 border-t border-[var(--line)] pt-6">
          <h2 className="text-xl font-semibold">{text.sectionTitle}</h2>
          <p className="mt-2 text-sm text-[var(--text-soft)] md:text-base">{text.sectionDescription}</p>
          <ul className="mt-4 space-y-2 text-sm md:text-base">
            {text.points.map((point) => (
              <li key={point} className="rounded-lg border border-[var(--line)] bg-[var(--bg-soft)]/45 px-3 py-2">
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-[var(--line)] pt-6">
          <h2 className="text-xl font-semibold">{text.blogTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm md:text-base">
            {text.blogLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-lg border border-[var(--line)] bg-[var(--bg-soft)]/45 px-3 py-2 text-[var(--text-soft)] transition-colors hover:text-[var(--accent)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-[var(--line)] pt-6">
          <h2 className="text-xl font-semibold">{text.faqTitle}</h2>
          <div className="mt-3 space-y-3">
            {text.faq.map((item) => (
              <article key={item.q} className="rounded-xl border border-[var(--line)] bg-[var(--bg-soft)]/45 p-3">
                <h3 className="text-sm font-semibold md:text-base">{item.q}</h3>
                <p className="mt-1 text-sm text-[var(--text-soft)] md:text-base">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
