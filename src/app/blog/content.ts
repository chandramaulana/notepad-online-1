export type BlogLanguage = "id" | "en";

export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogLocalizedContent = {
  title: string;
  description: string;
  excerpt: string;
  sections: BlogSection[];
};

export type BlogEntry = {
  slug: string;
  updatedAt: string;
  keywords: string[];
  content: {
    id: BlogLocalizedContent;
    en: BlogLocalizedContent;
  };
};

export function resolveBlogLanguage(raw?: string): BlogLanguage {
  return raw === "en" ? "en" : "id";
}

export function getLocalizedBlogContent(entry: BlogEntry, language: BlogLanguage): BlogLocalizedContent {
  return entry.content[language];
}

export const BLOG_ENTRIES: BlogEntry[] = [
  {
    slug: "about",
    updatedAt: "2026-05-16T00:00:00.000Z",
    keywords: ["about notepad online", "tentang chandra notepad", "realtime notes app"],
    content: {
      id: {
        title: "About Chandra Notepad",
        description:
          "Pelajari tentang Chandra Notepad, visi produk, dan alasan kenapa notepad online realtime ini dibuat untuk kolaborasi cepat.",
        excerpt:
          "Chandra Notepad dibangun untuk membantu tim menulis catatan bersama secara realtime tanpa proses setup yang rumit.",
        sections: [
          {
            heading: "Visi Produk",
            paragraphs: [
              "Chandra Notepad dibuat dengan tujuan sederhana: membuat kolaborasi catatan menjadi secepat membuka link.",
              "Kami ingin user bisa memulai diskusi, mencatat keputusan, dan menyusun rencana tim secara realtime tanpa login yang membingungkan."
            ]
          },
          {
            heading: "Untuk Siapa Produk Ini",
            paragraphs: [
              "Platform ini cocok untuk tim startup, komunitas belajar, pengajar, dan siapa pun yang butuh ruang catatan bersama.",
              "Use case paling umum adalah meeting notes, brainstorming, quick documentation, dan task planning."
            ]
          }
        ]
      },
      en: {
        title: "About Chandra Notepad",
        description:
          "Learn about Chandra Notepad, the product vision, and why this realtime online notepad is built for fast collaboration.",
        excerpt:
          "Chandra Notepad helps teams write shared notes in realtime without a complex setup process.",
        sections: [
          {
            heading: "Product Vision",
            paragraphs: [
              "Chandra Notepad was created with one simple goal: make note collaboration as fast as opening a link.",
              "We want users to start discussions, capture decisions, and build team plans in realtime without confusing login steps."
            ]
          },
          {
            heading: "Who This Product Is For",
            paragraphs: [
              "This platform is suitable for startup teams, learning communities, educators, and anyone who needs shared notes.",
              "Common use cases include meeting notes, brainstorming, quick documentation, and task planning."
            ]
          }
        ]
      }
    }
  },
  {
    slug: "features",
    updatedAt: "2026-05-16T00:00:00.000Z",
    keywords: ["fitur notepad online", "collaborative notes features", "auto save notes"],
    content: {
      id: {
        title: "Fitur Utama Notepad Online Realtime",
        description:
          "Daftar fitur utama Chandra Notepad: kolaborasi realtime, lock PIN, auto save, multi tab halaman, dan room berbasis URL.",
        excerpt:
          "Temukan fitur kolaborasi modern yang membuat notepad online lebih efektif untuk tim kecil hingga menengah.",
        sections: [
          {
            heading: "Kolaborasi Realtime",
            paragraphs: [
              "Setiap perubahan yang Anda ketik langsung terlihat oleh anggota tim lain dengan sinkronisasi minim delay.",
              "Kehadiran user aktif membantu tim mengetahui siapa saja yang sedang berada di room yang sama."
            ]
          },
          {
            heading: "Produktivitas Harian",
            paragraphs: [
              "Auto save berjalan otomatis sehingga Anda tidak perlu takut kehilangan catatan penting saat meeting berlangsung.",
              "Dukungan multi tab halaman memberi cara kerja seperti notepad desktop, tetapi tetap online dan kolaboratif."
            ]
          }
        ]
      },
      en: {
        title: "Key Features of a Realtime Online Notepad",
        description:
          "Explore Chandra Notepad core features: realtime collaboration, PIN lock, auto-save, multi-page tabs, and URL-based rooms.",
        excerpt: "Discover collaboration features that make online note-taking more effective for small and mid-sized teams.",
        sections: [
          {
            heading: "Realtime Collaboration",
            paragraphs: [
              "Every edit appears instantly to teammates with low-latency synchronization.",
              "Active presence helps teams know who is currently working in the same room."
            ]
          },
          {
            heading: "Daily Productivity",
            paragraphs: [
              "Auto-save runs continuously, so you do not lose important notes during live meetings.",
              "Multi-page tabs provide a desktop-like writing workflow while staying online and collaborative."
            ]
          }
        ]
      }
    }
  },
  {
    slug: "privacy",
    updatedAt: "2026-05-16T00:00:00.000Z",
    keywords: ["privasi notepad online", "keamanan pin notepad", "shared notes privacy"],
    content: {
      id: {
        title: "Privasi dan Keamanan Dasar di Chandra Notepad",
        description:
          "Penjelasan tentang lock PIN, batas percobaan unlock, cooldown keamanan, dan cara menjaga room notepad tetap aman.",
        excerpt:
          "Chandra Notepad menyediakan kontrol privasi dasar agar catatan tim tetap nyaman digunakan untuk kebutuhan internal.",
        sections: [
          {
            heading: "Lock PIN dan Batas Percobaan",
            paragraphs: [
              "Room dapat dilindungi dengan PIN untuk menambah lapisan keamanan saat link dibagikan.",
              "Jika PIN salah berulang, sistem menerapkan batas percobaan dan cooldown sementara untuk mengurangi risiko brute force."
            ]
          },
          {
            heading: "Praktik Aman yang Disarankan",
            paragraphs: [
              "Gunakan PIN unik untuk room sensitif dan ubah PIN secara berkala bila room digunakan lintas tim.",
              "Hindari menaruh data sangat sensitif di ruang kolaborasi umum tanpa kontrol akses tambahan dari organisasi."
            ]
          }
        ]
      },
      en: {
        title: "Basic Privacy and Security in Chandra Notepad",
        description:
          "Understand PIN lock, unlock attempt limits, security cooldown, and best practices to keep shared notepad rooms safer.",
        excerpt:
          "Chandra Notepad includes basic privacy controls so team notes remain practical for internal collaboration.",
        sections: [
          {
            heading: "PIN Lock and Attempt Limits",
            paragraphs: [
              "Rooms can be protected with a PIN to add an extra security layer when links are shared.",
              "When wrong PIN attempts are repeated, the system applies limits and temporary cooldown to reduce brute-force risk."
            ]
          },
          {
            heading: "Recommended Safe Practices",
            paragraphs: [
              "Use unique PINs for sensitive rooms and rotate PINs periodically for cross-team usage.",
              "Avoid storing highly sensitive information in general collaboration rooms without additional organizational controls."
            ]
          }
        ]
      }
    }
  },
  {
    slug: "how-it-works",
    updatedAt: "2026-05-16T00:00:00.000Z",
    keywords: ["cara kerja notepad online", "how collaborative notes works", "panduan realtime notes"],
    content: {
      id: {
        title: "Cara Kerja Notepad Online Realtime",
        description:
          "Panduan singkat cara kerja Chandra Notepad dari membuat room, berbagi link, hingga kolaborasi dan penyimpanan otomatis.",
        excerpt:
          "Tidak perlu setup panjang. Tentukan nama room, bagikan URL, lalu semua orang bisa menulis bersama secara realtime.",
        sections: [
          {
            heading: "Buat Room dalam Beberapa Detik",
            paragraphs: [
              "Masukkan nama room di halaman utama, sistem akan membentuk URL unik dan langsung membuka halaman kolaborasi.",
              "Tidak ada langkah registrasi wajib untuk memulai pencatatan bersama tim."
            ]
          },
          {
            heading: "Kolaborasi dan Simpan Otomatis",
            paragraphs: [
              "Setiap editor yang terhubung ke URL yang sama akan berada di room yang sama dan melihat update secara langsung.",
              "Catatan disimpan otomatis secara berkala agar progres kerja tetap aman saat sesi berlangsung."
            ]
          }
        ]
      },
      en: {
        title: "How Realtime Online Notepad Works",
        description:
          "A short guide to Chandra Notepad workflow: create a room, share the link, collaborate live, and rely on auto-save.",
        excerpt:
          "No complex setup required. Pick a room name, share the URL, and everyone can write together in realtime.",
        sections: [
          {
            heading: "Create a Room in Seconds",
            paragraphs: [
              "Enter a room name on the homepage, and the system generates a unique URL instantly.",
              "No mandatory account creation is needed to start collaborative note-taking."
            ]
          },
          {
            heading: "Collaborate with Auto-Save",
            paragraphs: [
              "Anyone connected to the same URL joins the same room and sees updates immediately.",
              "Notes are saved automatically at intervals to keep progress safe during active sessions."
            ]
          }
        ]
      }
    }
  },
  {
    slug: "realtime-collaborative-notepad",
    updatedAt: "2026-05-16T00:00:00.000Z",
    keywords: ["realtime collaborative notepad", "team collaboration notes", "meeting notes online"],
    content: {
      id: {
        title: "Kenapa Realtime Collaborative Notepad Penting untuk Tim",
        description:
          "Manfaat realtime collaborative notepad untuk meeting cepat, pengambilan keputusan, sinkronisasi tugas, dan dokumentasi yang hidup.",
        excerpt:
          "Kolaborasi realtime mempersingkat koordinasi tim karena semua pihak melihat informasi terbaru pada saat yang sama.",
        sections: [
          {
            heading: "Kecepatan Koordinasi Tim",
            paragraphs: [
              "Dengan editor realtime, keputusan rapat bisa langsung dituangkan dan dikonfirmasi oleh semua peserta tanpa menunggu recap manual.",
              "Ini mengurangi miskomunikasi karena satu sumber kebenaran diperbarui saat diskusi sedang berlangsung."
            ]
          },
          {
            heading: "Dokumentasi yang Selalu Aktif",
            paragraphs: [
              "Dokumen bukan lagi file statis, tetapi ruang kerja hidup yang bisa di-update kapan pun oleh tim.",
              "Untuk organisasi kecil dan menengah, pendekatan ini biasanya lebih ringan dibanding sistem dokumen enterprise yang kompleks."
            ]
          }
        ]
      },
      en: {
        title: "Why Realtime Collaborative Notepad Matters for Teams",
        description:
          "Understand how realtime collaborative notepad improves fast meetings, decision-making, task alignment, and living documentation.",
        excerpt: "Realtime collaboration shortens team coordination because everyone sees the latest information at the same time.",
        sections: [
          {
            heading: "Faster Team Coordination",
            paragraphs: [
              "With a realtime editor, meeting decisions can be captured and confirmed immediately without waiting for manual recap.",
              "This reduces miscommunication because one shared source is updated while discussion is still happening."
            ]
          },
          {
            heading: "Always-Live Documentation",
            paragraphs: [
              "Documents are no longer static files but active workspaces that teams can keep updating.",
              "For small and mid-sized organizations, this is often lighter than complex enterprise documentation systems."
            ]
          }
        ]
      }
    }
  },
  {
    slug: "open-source",
    updatedAt: "2026-05-16T00:00:00.000Z",
    keywords: ["open source notepad", "chandra notepad github", "collaborative editor open source"],
    content: {
      id: {
        title: "Chandra Notepad Open Source dan Komunitas",
        description:
          "Chandra Notepad dikembangkan sebagai proyek open source dengan semangat kolaborasi, transparansi, dan kontribusi komunitas.",
        excerpt:
          "Sebagai proyek open source, pengembangan produk terbuka untuk audit, pembelajaran, dan perbaikan berkelanjutan.",
        sections: [
          {
            heading: "Nilai Open Source",
            paragraphs: [
              "Source code yang terbuka memberi kesempatan bagi komunitas untuk memahami arsitektur, melakukan review, dan memberi masukan.",
              "Model ini membantu produk berkembang lebih cepat sekaligus menjaga akuntabilitas kualitas fitur."
            ]
          },
          {
            heading: "Kontribusi dan Attribution",
            paragraphs: [
              "Kontributor dapat ikut serta dengan perbaikan bug, peningkatan performa, atau dokumentasi yang lebih baik.",
              "Penggunaan kode tetap mengikuti lisensi open source yang berlaku dan wajib menyertakan sumber sesuai ketentuan proyek."
            ]
          }
        ]
      },
      en: {
        title: "Chandra Notepad Open Source and Community",
        description:
          "Chandra Notepad is built as an open source project with collaboration, transparency, and community contribution at its core.",
        excerpt: "As an open source project, the product is open for review, learning, and continuous improvement.",
        sections: [
          {
            heading: "Open Source Value",
            paragraphs: [
              "Open code allows the community to understand the architecture, review implementation, and contribute improvements.",
              "This model helps the product evolve faster while improving accountability for feature quality."
            ]
          },
          {
            heading: "Contribution and Attribution",
            paragraphs: [
              "Contributors can participate through bug fixes, performance improvements, and stronger documentation.",
              "Code usage remains subject to the applicable open source license and proper attribution requirements."
            ]
          }
        ]
      }
    }
  }
];

export const BLOG_ENTRY_BY_SLUG = new Map(BLOG_ENTRIES.map((entry) => [entry.slug, entry]));
