export type SeoClusterKey = "learn" | "use-cases" | "templates" | "compare";

export type SeoSection = {
  heading: string;
  paragraphs: string[];
};

export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoEntry = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  updatedAt: string;
  keywords: string[];
  sections: SeoSection[];
  faqs: SeoFaq[];
};

export type SeoHub = {
  cluster: SeoClusterKey;
  path: `/${SeoClusterKey}`;
  title: string;
  description: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
};

const UPDATED_AT = "2026-05-16T00:00:00.000Z";

export const SEO_HUBS: SeoHub[] = [
  {
    cluster: "learn",
    path: "/learn",
    title: "Panduan Notepad Online",
    description: "Panduan lengkap notepad online, collaborative note-taking, dan praktik optimasi produktivitas tim.",
    changeFrequency: "weekly",
    priority: 0.9
  },
  {
    cluster: "use-cases",
    path: "/use-cases",
    title: "Use Cases Realtime Notepad",
    description: "Kumpulan use case notepad online untuk meeting notes, kelas online, dokumentasi, dan koordinasi tim.",
    changeFrequency: "weekly",
    priority: 0.88
  },
  {
    cluster: "templates",
    path: "/templates",
    title: "Template Catatan Online",
    description: "Template catatan siap pakai untuk rapat, sprint planning, retrospektif, dan kebutuhan dokumentasi cepat.",
    changeFrequency: "monthly",
    priority: 0.86
  },
  {
    cluster: "compare",
    path: "/compare",
    title: "Perbandingan Online Notepad",
    description: "Perbandingan online notepad dengan tools populer untuk memilih workflow pencatatan yang paling sesuai.",
    changeFrequency: "monthly",
    priority: 0.85
  }
];

export const SEO_ENTRIES: Record<SeoClusterKey, SeoEntry[]> = {
  learn: [
    {
      slug: "what-is-online-notepad",
      title: "Apa Itu Online Notepad dan Kapan Sebaiknya Digunakan",
      description:
        "Penjelasan konsep online notepad, manfaat praktis, dan skenario penggunaan untuk kolaborasi cepat berbasis browser.",
      excerpt: "Online notepad mempermudah pencatatan cepat tanpa instalasi dan bisa diakses lintas perangkat.",
      updatedAt: UPDATED_AT,
      keywords: ["what is online notepad", "online memo pad", "browser text editor"],
      sections: [
        {
          heading: "Definisi Sederhana",
          paragraphs: [
            "Online notepad adalah editor teks berbasis browser yang bisa dibuka tanpa instalasi aplikasi desktop.",
            "Untuk tim kecil, format ini ideal karena proses mulai pakainya sangat cepat dan minim hambatan teknis."
          ]
        },
        {
          heading: "Manfaat untuk Kerja Harian",
          paragraphs: [
            "Anda bisa membuat catatan rapat, daftar keputusan, dan ringkasan tugas langsung saat diskusi berlangsung.",
            "Ketika tool mendukung kolaborasi realtime, anggota tim melihat konteks yang sama pada waktu yang sama."
          ]
        }
      ],
      faqs: [
        {
          question: "Apakah online notepad cocok untuk catatan sementara?",
          answer:
            "Ya, online notepad sangat cocok untuk catatan sementara karena bisa dibuka cepat, langsung dipakai, dan dibagikan lewat URL."
        },
        {
          question: "Apa beda online notepad dengan dokumen tradisional?",
          answer:
            "Online notepad biasanya lebih ringan dan fokus ke pencatatan cepat, sedangkan dokumen tradisional menawarkan format dokumen yang lebih kompleks."
        }
      ]
    },
    {
      slug: "realtime-note-taking-guide",
      title: "Panduan Realtime Note Taking untuk Tim Remote",
      description:
        "Cara menerapkan realtime note taking agar meeting lebih terstruktur, keputusan lebih jelas, dan tindak lanjut lebih cepat.",
      excerpt: "Realtime note taking membantu tim remote menyatukan informasi saat rapat masih berlangsung.",
      updatedAt: UPDATED_AT,
      keywords: ["realtime note taking", "collaborative meeting notes", "team documentation"],
      sections: [
        {
          heading: "Alur Dasar Rapat",
          paragraphs: [
            "Siapkan satu room catatan untuk agenda, keputusan, dan action items sebelum rapat dimulai.",
            "Gunakan struktur heading yang konsisten supaya isi catatan mudah dipindai setelah meeting selesai."
          ]
        },
        {
          heading: "Tindak Lanjut",
          paragraphs: [
            "Tandai keputusan final di akhir sesi agar tidak tertukar dengan diskusi awal.",
            "Bagikan ulang link yang sama untuk review asynchronous sehingga dokumen tetap menjadi sumber kebenaran tunggal."
          ]
        }
      ],
      faqs: [
        {
          question: "Bagaimana menjaga notulen tetap ringkas?",
          answer:
            "Gunakan format poin keputusan dan action items, lalu batasi detail hanya pada hal yang berdampak langsung ke eksekusi."
        },
        {
          question: "Apakah format realtime note taking cocok untuk daily standup?",
          answer: "Cocok, karena tim bisa memperbarui progress secara sinkron dan langsung menyepakati prioritas hari itu."
        }
      ]
    },
    {
      slug: "secure-shared-notes-basics",
      title: "Dasar Keamanan Shared Notes untuk Tim",
      description:
        "Prinsip dasar menjaga shared notes tetap aman dengan PIN lock, pembagian akses, dan kebiasaan kerja yang sehat.",
      excerpt: "Keamanan shared notes dimulai dari kebiasaan akses yang tepat dan kontrol room sederhana.",
      updatedAt: UPDATED_AT,
      keywords: ["shared notes security", "notepad pin lock", "secure collaborative notes"],
      sections: [
        {
          heading: "Kontrol Akses Praktis",
          paragraphs: [
            "Gunakan PIN lock pada room yang memuat data internal agar akses lebih terkontrol.",
            "Hindari menyebarkan link room sensitif di kanal publik yang mudah diteruskan tanpa kontrol."
          ]
        },
        {
          heading: "Higiene Operasional",
          paragraphs: [
            "Evaluasi ulang siapa saja yang masih butuh akses setelah proyek atau meeting selesai.",
            "Pisahkan room untuk topik sensitif dan non-sensitif agar manajemen risiko lebih sederhana."
          ]
        }
      ],
      faqs: [
        {
          question: "Apakah PIN room sudah cukup untuk semua kebutuhan keamanan?",
          answer:
            "PIN room membantu meningkatkan keamanan dasar, tetapi untuk data sangat sensitif tetap dibutuhkan kontrol tambahan di level organisasi."
        },
        {
          question: "Kapan harus mengganti PIN room?",
          answer:
            "Ganti PIN saat anggota tim berubah, link room terlanjur tersebar luas, atau room dipakai lintas proyek dalam jangka panjang."
        }
      ]
    },
    {
      slug: "programmatic-seo-for-saas-content",
      title: "Programmatic SEO untuk SaaS Kolaborasi Catatan",
      description:
        "Strategi membangun halaman skala besar berbasis intent, cluster semantik, dan internal linking untuk SaaS notepad.",
      excerpt: "Programmatic SEO membantu menambah cakupan long-tail tanpa kehilangan kualitas informasi.",
      updatedAt: UPDATED_AT,
      keywords: ["programmatic seo saas", "seo cluster architecture", "long tail content strategy"],
      sections: [
        {
          heading: "Struktur Cluster",
          paragraphs: [
            "Pisahkan konten menjadi cluster edukasi, use case, template, dan perbandingan agar intent pengguna lebih terwakili.",
            "Setiap cluster memiliki hub page sebagai entry point crawler dan pengarah internal linking."
          ]
        },
        {
          heading: "Kualitas di Skala Besar",
          paragraphs: [
            "Gunakan kerangka konten yang konsisten tetapi tetap beri konteks spesifik di setiap halaman long-tail.",
            "Sisipkan FAQ yang relevan untuk memperbesar peluang muncul di AI Overview dan jawaban mesin generatif."
          ]
        }
      ],
      faqs: [
        {
          question: "Apa risiko terbesar saat membuat programmatic pages?",
          answer:
            "Risiko utamanya adalah thin content. Solusinya, pastikan tiap halaman memiliki konteks unik, contoh praktis, dan jawaban intent yang jelas."
        },
        {
          question: "Apakah semua halaman programmatic harus diindex?",
          answer:
            "Tidak selalu. Halaman yang belum memiliki nilai informatif unik lebih baik ditunda sampai kualitas kontennya memadai."
        }
      ]
    }
  ],
  "use-cases": [
    {
      slug: "meeting-notes-online",
      title: "Use Case: Meeting Notes Online untuk Tim Produk",
      description:
        "Contoh implementasi meeting notes online untuk tim produk agar keputusan, blocker, dan action items terdokumentasi cepat.",
      excerpt: "Meeting notes online mengurangi ketergantungan pada recap manual setelah rapat selesai.",
      updatedAt: UPDATED_AT,
      keywords: ["meeting notes online", "product team notes", "realtime meeting documentation"],
      sections: [
        {
          heading: "Skenario Tim Produk",
          paragraphs: [
            "Gunakan satu room khusus untuk sprint planning, review, dan retrospective agar histori diskusi mudah dilacak.",
            "Beri struktur catatan per agenda sehingga tim engineering, design, dan PM punya konteks yang seragam."
          ]
        },
        {
          heading: "Output yang Diharapkan",
          paragraphs: [
            "Setiap meeting menghasilkan daftar keputusan, owner, dan deadline yang langsung siap dieksekusi.",
            "Tim tidak perlu menunggu notulen terpisah karena dokumen sudah final saat rapat berakhir."
          ]
        }
      ],
      faqs: [
        {
          question: "Apakah cocok untuk meeting lintas divisi?",
          answer:
            "Cocok, selama format catatan disepakati di awal dan setiap bagian punya pemilik yang memastikan kejelasan poin keputusan."
        },
        {
          question: "Bagaimana membuat meeting notes tetap actionable?",
          answer: "Tambahkan kolom owner, due date, dan status pada setiap action item agar bisa ditindaklanjuti tanpa ambigu."
        }
      ]
    },
    {
      slug: "online-class-collaborative-notes",
      title: "Use Case: Catatan Kelas Online Kolaboratif",
      description:
        "Pemakaian collaborative notepad untuk kelas online, diskusi kelompok, dan ringkasan materi belajar bersama.",
      excerpt: "Kelas online jadi lebih interaktif ketika siswa bisa menulis dan merangkum materi secara bersama.",
      updatedAt: UPDATED_AT,
      keywords: ["online class notes", "collaborative study notes", "catatan kelas online"],
      sections: [
        {
          heading: "Kolaborasi Saat Belajar",
          paragraphs: [
            "Instruktur dapat menyiapkan kerangka materi, lalu peserta menambahkan poin penting selama sesi berlangsung.",
            "Model ini membantu peserta yang terlambat tetap mengejar konteks dari catatan yang terus diperbarui."
          ]
        },
        {
          heading: "Ringkasan Pasca Kelas",
          paragraphs: [
            "Setelah kelas selesai, catatan bisa langsung menjadi rangkuman untuk review mandiri.",
            "Satu dokumen kolaboratif mengurangi duplikasi file ringkasan antar peserta."
          ]
        }
      ],
      faqs: [
        {
          question: "Apakah cocok untuk kelompok belajar kecil?",
          answer: "Sangat cocok, karena setiap anggota bisa menambahkan insight tanpa perlu mengirim versi dokumen terpisah."
        },
        {
          question: "Bagaimana membagi materi per topik?",
          answer: "Gunakan heading per topik dan daftar poin inti agar proses review lebih cepat saat ujian atau diskusi lanjutan."
        }
      ]
    },
    {
      slug: "incident-response-live-notes",
      title: "Use Case: Live Notes untuk Incident Response",
      description:
        "Workflow live notes untuk tim incident response agar kronologi, keputusan mitigasi, dan update status tercatat rapi.",
      excerpt: "Live notes membantu tim insiden menjaga kronologi kejadian dalam satu dokumen real time.",
      updatedAt: UPDATED_AT,
      keywords: ["incident response notes", "live incident log", "realtime troubleshooting notes"],
      sections: [
        {
          heading: "Saat Insiden Berjalan",
          paragraphs: [
            "Satu editor bertanggung jawab menulis timeline, sementara anggota lain menambahkan data observasi dan langkah mitigasi.",
            "Dengan catatan realtime, handover antar shift menjadi lebih cepat dan minim kehilangan konteks."
          ]
        },
        {
          heading: "Setelah Insiden",
          paragraphs: [
            "Dokumen yang sama bisa dipakai untuk postmortem awal sebelum dipindah ke dokumentasi formal.",
            "Ini mengurangi waktu rekonstruksi kejadian karena data utama sudah terkumpul saat insiden berlangsung."
          ]
        }
      ],
      faqs: [
        {
          question: "Apakah live notes cocok untuk high-pressure scenario?",
          answer: "Ya, selama tim menetapkan format timeline yang sederhana dan satu orang bertugas menjaga struktur catatan."
        },
        {
          question: "Apa informasi minimal yang harus dicatat?",
          answer: "Waktu kejadian, gejala, aksi mitigasi, hasil aksi, dan keputusan berikutnya."
        }
      ]
    },
    {
      slug: "content-brief-collaboration",
      title: "Use Case: Kolaborasi Content Brief untuk Tim Marketing",
      description:
        "Cara menggunakan online notepad untuk menyusun content brief lintas role: SEO, writer, editor, dan designer.",
      excerpt: "Content brief kolaboratif mempercepat sinkronisasi strategi konten dan eksekusi tim marketing.",
      updatedAt: UPDATED_AT,
      keywords: ["content brief collaboration", "seo writer collaboration", "marketing notes online"],
      sections: [
        {
          heading: "Sinkronisasi Role",
          paragraphs: [
            "SEO dapat menulis keyword intent, writer mengembangkan angle, dan editor memberi batasan gaya dalam satu room.",
            "Designer juga bisa menambahkan kebutuhan visual tanpa menunggu dokumen final terpisah."
          ]
        },
        {
          heading: "Manfaat untuk Kecepatan Produksi",
          paragraphs: [
            "Mengurangi bolak-balik file dan komentar tersebar di banyak kanal komunikasi.",
            "Setiap perubahan brief tercatat live sehingga semua role bekerja dengan versi informasi yang sama."
          ]
        }
      ],
      faqs: [
        {
          question: "Apakah content brief di online notepad bisa jadi final source?",
          answer: "Bisa, terutama untuk fase awal produksi konten sebelum dipindah ke sistem editorial yang lebih formal."
        },
        {
          question: "Bagaimana menjaga brief tidak melebar?",
          answer: "Gunakan template section tetap seperti objective, audience, keyword, outline, dan deliverable."
        }
      ]
    }
  ],
  templates: [
    {
      slug: "meeting-notes-template",
      title: "Template Meeting Notes Online",
      description:
        "Template meeting notes siap pakai untuk agenda, keputusan, action items, dan PIC pada notepad kolaboratif realtime.",
      excerpt: "Gunakan template meeting notes ini untuk membuat rapat lebih fokus dan hasilnya langsung actionable.",
      updatedAt: UPDATED_AT,
      keywords: ["meeting notes template", "template notulen rapat", "realtime meeting template"],
      sections: [
        {
          heading: "Struktur Template",
          paragraphs: [
            "Bagian utama meliputi objective meeting, agenda, keputusan, action items, dan next checkpoint.",
            "Struktur ini membantu tim langsung tahu apa yang diputuskan dan siapa eksekutornya."
          ]
        },
        {
          heading: "Tips Penggunaan",
          paragraphs: [
            "Isi objective secara singkat di awal untuk menjaga diskusi tetap on-track.",
            "Gunakan format action item: tugas, owner, deadline, dan status agar tindak lanjut mudah dimonitor."
          ]
        }
      ],
      faqs: [
        {
          question: "Apakah template ini bisa dipakai daily standup?",
          answer: "Bisa, cukup sederhanakan bagian agenda dan fokus pada update, blocker, serta prioritas hari ini."
        },
        {
          question: "Bagaimana membuat template lebih cepat diisi?",
          answer: "Simpan section default tetap sama di setiap room agar anggota tim sudah terbiasa dengan formatnya."
        }
      ]
    },
    {
      slug: "sprint-planning-template",
      title: "Template Sprint Planning untuk Notepad Kolaboratif",
      description:
        "Template sprint planning untuk menuliskan objective sprint, capacity, backlog prioritas, dan risiko eksekusi.",
      excerpt: "Template sprint planning membantu tim produk menyelaraskan prioritas dan kapasitas kerja sprint.",
      updatedAt: UPDATED_AT,
      keywords: ["sprint planning template", "agile notes template", "product sprint notes"],
      sections: [
        {
          heading: "Komponen Sprint Planning",
          paragraphs: [
            "Cantumkan goal sprint, daftar item prioritas, estimasi effort, dan dependency utama.",
            "Beri penanda risiko untuk item yang memerlukan validasi lintas tim."
          ]
        },
        {
          heading: "Eksekusi yang Lebih Jelas",
          paragraphs: [
            "Pisahkan item must-have dan nice-to-have agar keputusan scope lebih mudah saat kapasitas terbatas.",
            "Catat asumsi penting sejak awal untuk mengurangi revisi mendadak saat sprint berjalan."
          ]
        }
      ],
      faqs: [
        {
          question: "Apakah template ini cocok untuk tim kecil?",
          answer: "Cocok, karena struktur sederhana tetap bisa memberikan kejelasan prioritas dan beban kerja."
        },
        {
          question: "Bagaimana mengelola perubahan scope?",
          answer: "Tambahkan section change log agar semua keputusan perubahan terdokumentasi dan mudah diaudit."
        }
      ]
    },
    {
      slug: "retrospective-template",
      title: "Template Retrospective untuk Tim Agile",
      description:
        "Template retrospective online untuk menuliskan apa yang berjalan baik, kendala, ide perbaikan, dan action plan.",
      excerpt: "Retrospective template membantu tim membuat evaluasi sprint yang lebih terarah dan terukur.",
      updatedAt: UPDATED_AT,
      keywords: ["retrospective template", "agile retro notes", "sprint review template"],
      sections: [
        {
          heading: "Kerangka Evaluasi",
          paragraphs: [
            "Pisahkan area positif, hambatan, dan eksperimen perbaikan agar diskusi tidak bercampur.",
            "Tambahkan indikator keberhasilan untuk setiap eksperimen agar hasilnya bisa diukur pada sprint berikutnya."
          ]
        },
        {
          heading: "Dari Diskusi ke Aksi",
          paragraphs: [
            "Ubah hasil retrospective menjadi 1-3 action plan realistis agar perubahan benar-benar terjadi.",
            "Tunjuk owner action plan dan tentukan waktu evaluasi agar akuntabilitas terjaga."
          ]
        }
      ],
      faqs: [
        {
          question: "Berapa action plan ideal dari satu retrospective?",
          answer: "Biasanya 1-3 action plan utama agar fokus eksekusi tetap realistis dalam satu sprint."
        },
        {
          question: "Apakah retrospective perlu format baku?",
          answer: "Disarankan iya, karena format baku memudahkan tim membandingkan progres perbaikan lintas sprint."
        }
      ]
    },
    {
      slug: "brainstorm-template",
      title: "Template Brainstorming Online untuk Ide Cepat",
      description:
        "Template brainstorming kolaboratif untuk menggali ide, mengelompokkan tema, dan memilih prioritas implementasi.",
      excerpt: "Gunakan template brainstorming untuk mengubah ide mentah menjadi kandidat rencana yang bisa dijalankan.",
      updatedAt: UPDATED_AT,
      keywords: ["brainstorm template", "online ideation notes", "collaborative brainstorming"],
      sections: [
        {
          heading: "Fase Ideasi",
          paragraphs: [
            "Mulai dari sesi ide bebas tanpa filtering, lalu kelompokkan ide berdasarkan tema atau tujuan bisnis.",
            "Pisahkan area ide cepat dieksekusi dan ide jangka panjang untuk memudahkan prioritisasi."
          ]
        },
        {
          heading: "Fase Seleksi",
          paragraphs: [
            "Gunakan kriteria impact, effort, dan urgensi untuk memilih ide yang layak dibawa ke tahap eksekusi.",
            "Catat alasan pemilihan agar keputusan bisa dipahami anggota yang tidak hadir."
          ]
        }
      ],
      faqs: [
        {
          question: "Bagaimana menghindari brainstorming yang terlalu melebar?",
          answer: "Tetapkan objective sesi dan batas waktu tiap fase agar diskusi tetap fokus pada tujuan utama."
        },
        {
          question: "Apakah template ini cocok untuk tim non-teknis?",
          answer: "Cocok, karena struktur ideasi dan prioritisasi bisa diterapkan di berbagai fungsi kerja."
        }
      ]
    }
  ],
  compare: [
    {
      slug: "online-notepad-vs-google-docs",
      title: "Online Notepad vs Google Docs untuk Catatan Cepat",
      description:
        "Perbandingan online notepad dan Google Docs berdasarkan kecepatan mulai, kompleksitas fitur, dan use case terbaik.",
      excerpt: "Online notepad unggul untuk speed, Google Docs unggul untuk format dokumen kompleks.",
      updatedAt: UPDATED_AT,
      keywords: ["online notepad vs google docs", "quick notes tool", "collaboration editor comparison"],
      sections: [
        {
          heading: "Kecepatan dan Kesederhanaan",
          paragraphs: [
            "Online notepad biasanya lebih cepat dibuka untuk sesi catatan spontan dan koordinasi singkat.",
            "Google Docs menawarkan fitur format kaya, namun tidak selalu diperlukan untuk meeting notes ringan."
          ]
        },
        {
          heading: "Kapan Memilih Masing-Masing",
          paragraphs: [
            "Pilih online notepad jika fokus pada real-time note taking dengan setup minimum.",
            "Pilih Google Docs jika Anda butuh formatting lanjutan, komentar mendalam, dan struktur dokumen formal."
          ]
        }
      ],
      faqs: [
        {
          question: "Apakah online notepad bisa menggantikan dokumen formal?",
          answer:
            "Untuk kebutuhan pencatatan cepat iya, tetapi untuk dokumen formal panjang biasanya tetap lebih nyaman memakai editor dokumen lengkap."
        },
        {
          question: "Mana yang lebih baik untuk meeting harian?",
          answer: "Untuk meeting harian, online notepad sering lebih efisien karena alur akses dan editing yang lebih ringkas."
        }
      ]
    },
    {
      slug: "online-notepad-vs-etherpad",
      title: "Online Notepad vs Etherpad",
      description:
        "Perbandingan platform online notepad modern dengan Etherpad untuk kolaborasi realtime dan kebutuhan tim kecil-menengah.",
      excerpt: "Kedua tool sama-sama realtime, pilihan terbaik tergantung kebutuhan UI, workflow, dan pengelolaan room.",
      updatedAt: UPDATED_AT,
      keywords: ["online notepad vs etherpad", "etherpad alternative", "realtime notes comparison"],
      sections: [
        {
          heading: "Pengalaman Pengguna",
          paragraphs: [
            "Online notepad modern biasanya menawarkan antarmuka lebih minimal untuk adopsi cepat tim non-teknis.",
            "Etherpad dikenal fleksibel dan matang untuk kolaborasi teks realtime berbasis komunitas."
          ]
        },
        {
          heading: "Faktor Pemilihan",
          paragraphs: [
            "Pertimbangkan kemudahan penggunaan harian, fitur keamanan dasar, dan kebutuhan integrasi tim.",
            "Jika prioritas Anda adalah workflow ringan, online notepad bisa lebih mudah diterapkan secara langsung."
          ]
        }
      ],
      faqs: [
        {
          question: "Apakah Etherpad masih relevan untuk kolaborasi?",
          answer: "Ya, Etherpad tetap relevan, terutama untuk organisasi yang membutuhkan solusi kolaborasi berbasis open source."
        },
        {
          question: "Kapan memilih online notepad modern?",
          answer: "Saat Anda butuh pengalaman penggunaan yang lebih sederhana dengan alur akses cepat untuk tim operasional."
        }
      ]
    },
    {
      slug: "online-notepad-vs-pastebin",
      title: "Online Notepad vs Pastebin",
      description:
        "Analisis perbedaan online notepad dan Pastebin dari sisi use case, kolaborasi realtime, dan manajemen catatan tim.",
      excerpt: "Pastebin cocok untuk snippet, online notepad lebih cocok untuk kolaborasi catatan yang terus berkembang.",
      updatedAt: UPDATED_AT,
      keywords: ["online notepad vs pastebin", "pastebin alternative", "shared notes tool"],
      sections: [
        {
          heading: "Orientasi Produk",
          paragraphs: [
            "Pastebin berfokus pada sharing potongan teks atau kode secara cepat.",
            "Online notepad berfokus pada proses menulis kolaboratif yang aktif dan berkelanjutan."
          ]
        },
        {
          heading: "Konteks Tim",
          paragraphs: [
            "Untuk catatan proyek, meeting, dan koordinasi tim, online notepad biasanya lebih relevan.",
            "Untuk berbagi snippet sekali pakai, Pastebin bisa menjadi opsi yang lebih sederhana."
          ]
        }
      ],
      faqs: [
        {
          question: "Apakah Pastebin mendukung kolaborasi realtime?",
          answer: "Pastebin umumnya tidak didesain sebagai editor kolaborasi realtime untuk tim kerja harian."
        },
        {
          question: "Mana yang cocok untuk catatan rapat?",
          answer: "Online notepad lebih cocok karena mendukung pembaruan bersama saat rapat berlangsung."
        }
      ]
    },
    {
      slug: "online-notepad-vs-local-notes-app",
      title: "Online Notepad vs Aplikasi Catatan Lokal",
      description:
        "Perbandingan online notepad dan aplikasi catatan lokal untuk akses lintas perangkat, kolaborasi, dan kontrol data.",
      excerpt: "Aplikasi lokal unggul untuk offline, online notepad unggul untuk kolaborasi cepat lintas perangkat.",
      updatedAt: UPDATED_AT,
      keywords: ["online notepad vs local notes app", "browser notes vs desktop notes", "collaborative note app"],
      sections: [
        {
          heading: "Kelebihan Akses",
          paragraphs: [
            "Online notepad bisa diakses langsung dari browser di berbagai perangkat tanpa instalasi.",
            "Aplikasi lokal lebih cocok jika prioritas Anda adalah akses offline dan integrasi sistem lokal tertentu."
          ]
        },
        {
          heading: "Kolaborasi Tim",
          paragraphs: [
            "Untuk kerja tim, online notepad mempermudah sinkronisasi catatan secara realtime.",
            "Aplikasi lokal biasanya memerlukan proses tambahan agar catatan bisa dikolaborasikan secara efisien."
          ]
        }
      ],
      faqs: [
        {
          question: "Apakah aplikasi lokal selalu lebih aman?",
          answer:
            "Tidak selalu. Keamanan bergantung pada implementasi kontrol akses, kebijakan organisasi, dan perilaku penggunaan."
        },
        {
          question: "Mana yang lebih praktis untuk tim remote?",
          answer: "Online notepad umumnya lebih praktis untuk tim remote karena berbasis link dan realtime collaboration."
        }
      ]
    }
  ]
};

export function getSeoEntries(cluster: SeoClusterKey): SeoEntry[] {
  return SEO_ENTRIES[cluster];
}

export function getSeoEntry(cluster: SeoClusterKey, slug: string): SeoEntry | undefined {
  return SEO_ENTRIES[cluster].find((entry) => entry.slug === slug);
}
