import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { AppSettingsControls } from "@/components/ui/app-settings-controls";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:7800"),
  title: "Chandra Notepad",
  description: "Realtime collaborative online notepad.",
  alternates: {
    canonical: "/"
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION
  },
  openGraph: {
    title: "Chandra Notepad",
    description: "Realtime collaborative online notepad.",
    type: "website",
    url: "/",
    siteName: "Chandra Notepad"
  },
  twitter: {
    card: "summary_large_image",
    title: "Chandra Notepad",
    description: "Realtime collaborative online notepad."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${monoFont.variable}`}>
        <div className="network-bg" aria-hidden="true" />
        <AppSettingsControls />
        <main className="app-shell">{children}</main>
      </body>
    </html>
  );
}
