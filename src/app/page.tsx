import type { Metadata } from "next";
import { HomePageClient } from "@/components/home/home-page-client";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";

export const metadata: Metadata = {
  title: "Chandra Notepad | Notepad Online Realtime Untuk Kolaborasi Tim",
  description:
    "Chandra Notepad adalah notepad online realtime untuk catatan meeting, brainstorming, checklist, dan dokumentasi tim. Buat room dari URL unik dan langsung kolaborasi.",
  keywords: [
    "notepad online",
    "catatan online",
    "realtime collaborative notes",
    "catatan meeting tim",
    "shared notes",
    "online notes"
  ],
  alternates: {
    canonical: appUrl
  },
  openGraph: {
    title: "Chandra Notepad | Realtime Collaborative Notes",
    description:
      "Notepad online realtime untuk meeting notes, project planning, dan kolaborasi tim dari browser.",
    url: appUrl,
    siteName: "Chandra Notepad",
    type: "website",
    locale: "id_ID"
  },
  twitter: {
    card: "summary_large_image",
    title: "Chandra Notepad | Realtime Collaborative Notes",
    description:
      "Notepad online realtime untuk meeting notes, project planning, dan kolaborasi tim dari browser."
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Chandra Notepad",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: appUrl,
  description:
    "Realtime online notepad for teams to collaborate on meeting notes, plans, and documentation.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Apakah bisa dipakai tanpa login?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bisa. Buka halaman utama, masukkan nama room, lalu langsung mulai menulis dan berbagi link room."
      }
    },
    {
      "@type": "Question",
      name: "Apakah cocok untuk tim kerja?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cocok untuk catatan meeting, brainstorming, checklist tugas, dan dokumentasi kolaboratif realtime."
      }
    }
  ]
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePageClient />
    </>
  );
}
