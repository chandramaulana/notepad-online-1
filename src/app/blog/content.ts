export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogEntry = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  updatedAt: string;
  keywords: string[];
  sections: BlogSection[];
};

export const BLOG_ENTRIES: BlogEntry[] = [
  {
    slug: "about",
    title: "About Aitonomous Notepad",
    description:
      "Pelajari tentang Aitonomous Notepad, visi produk, dan alasan kenapa notepad online realtime ini dibuat untuk kolaborasi cepat.",
    excerpt:
      "Aitonomous Notepad dibangun untuk membantu tim menulis catatan bersama secara realtime tanpa proses setup yang rumit.",
    updatedAt: "2026-05-16T00:00:00.000Z",
    keywords: ["about notepad online", "tentang aitonomous notepad", "realtime notes app"],
    sections: [
      {
        heading: "Visi Produk",
        paragraphs: [
          "Aitonomous Notepad dibuat dengan tujuan sederhana: membuat kolaborasi catatan menjadi secepat membuka link.",
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
  {
    slug: "features",
    title: "Fitur Utama Notepad Online Realtime",
    description:
      "Daftar fitur utama Aitonomous Notepad: kolaborasi realtime, lock PIN, auto save, multi tab halaman, dan room berbasis URL.",
    excerpt:
      "Temukan fitur kolaborasi modern yang membuat notepad online lebih efektif untuk tim kecil hingga menengah.",
    updatedAt: "2026-05-16T00:00:00.000Z",
    keywords: ["fitur notepad online", "collaborative notes features", "auto save notes"],
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
  {
    slug: "privacy",
    title: "Privasi dan Keamanan Dasar di Aitonomous Notepad",
    description:
      "Penjelasan tentang lock PIN, batas percobaan unlock, cooldown keamanan, dan cara menjaga room notepad tetap aman.",
    excerpt:
      "Aitonomous Notepad menyediakan kontrol privasi dasar agar catatan tim tetap nyaman digunakan untuk kebutuhan internal.",
    updatedAt: "2026-05-16T00:00:00.000Z",
    keywords: ["privasi notepad online", "keamanan pin notepad", "shared notes privacy"],
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
  {
    slug: "how-it-works",
    title: "Cara Kerja Notepad Online Realtime",
    description:
      "Panduan singkat cara kerja Aitonomous Notepad dari membuat room, berbagi link, hingga kolaborasi dan penyimpanan otomatis.",
    excerpt:
      "Tidak perlu setup panjang. Tentukan nama room, bagikan URL, lalu semua orang bisa menulis bersama secara realtime.",
    updatedAt: "2026-05-16T00:00:00.000Z",
    keywords: ["cara kerja notepad online", "how collaborative notes works", "panduan realtime notes"],
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
  {
    slug: "realtime-collaborative-notepad",
    title: "Kenapa Realtime Collaborative Notepad Penting untuk Tim",
    description:
      "Manfaat realtime collaborative notepad untuk meeting cepat, pengambilan keputusan, sinkronisasi tugas, dan dokumentasi yang hidup.",
    excerpt:
      "Kolaborasi realtime mempersingkat koordinasi tim karena semua pihak melihat informasi terbaru pada saat yang sama.",
    updatedAt: "2026-05-16T00:00:00.000Z",
    keywords: ["realtime collaborative notepad", "team collaboration notes", "meeting notes online"],
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
  {
    slug: "open-source",
    title: "Aitonomous Notepad Open Source dan Komunitas",
    description:
      "Aitonomous Notepad dikembangkan sebagai proyek open source dengan semangat kolaborasi, transparansi, dan kontribusi komunitas.",
    excerpt:
      "Sebagai proyek open source, pengembangan produk terbuka untuk audit, pembelajaran, dan perbaikan berkelanjutan.",
    updatedAt: "2026-05-16T00:00:00.000Z",
    keywords: ["open source notepad", "aitonomous notepad github", "collaborative editor open source"],
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
  }
];

export const BLOG_ENTRY_BY_SLUG = new Map(BLOG_ENTRIES.map((entry) => [entry.slug, entry]));
