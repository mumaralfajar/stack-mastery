// Bahasa Indonesia — capstone project.
export const projectsId = [
  {
    title: 'Capstone 1: Katalog produk lintas stack',
    brief: "Kenali tiap teknologi lewat satu contoh sederhana yaitu daftar produk. Belum ada yang perlu dihubungkan agar fokus ke peran masing-masing layer.",
    build: [
      "Buat aplikasi console **C#** dengan class `Product` dan menu loop `List<Product>` untuk menambah, menampilkan, dan menjumlahkan produk.",
      "Tulis query **SQL** `CREATE TABLE` produk beserta lima query: tampilkan semua, filter, urutkan, hitung per kategori, dan cari yang termahal.",
      "Buat minimal API **ASP.NET Core** dengan endpoint `GET /api/products` dan `GET /api/products/{id}` di memori yang membalas 404 saat tak ketemu.",
      "Buat komponen **React + TypeScript** `ProductList` ber-type yang menampilkan daftar produk hard-code beserta pesan kosongnya.",
      "Rapikan daftar produk dengan **CSS** biasa memakai grid responsif dan komponen card tanpa scroll horizontal di lebar 360px.",
      "Jelaskan pakai suaramu sendiri apa tugas request, row, object, komponen, dan rule CSS dalam satu kalimat tiap istilah.",
      "Bangun daftar produk yang sama di **Angular** dengan standalone component, `@for (...; track p.id)`, empty state, dan interface TypeScript.",
      "Buat tampilan produk serupa di **Dart + Flutter** memakai `StatelessWidget` lalu jalankan di target Chrome."
    ],
    stretch: [
      "Tambahkan endpoint `POST` di API dan tes lewat `curl`.",
      "Tambahkan kotak cari di React agar daftar tersaring saat mengetik."
    ],
    teach: "Sudut pandang mengajar: jadikan ini workshop hari pertama. Tentukan bagian stack mana yang dibuka dulu dan detail mana yang disimpan belakangan."
  },
  {
    title: 'Capstone 2: Task manager full-stack',
    brief: "Aplikasi pertamamu yang saling terhubung dari UI ke ASP.NET Core hingga tabel database lewat EF Core. Satu klik berpindah mulus sampai ke baris SQL.",
    build: [
      "Buat schema `projects` dan `tasks` (one-to-many) lengkap dengan foreign key, constraint `NOT NULL`, dan `CHECK` lewat migration EF Core.",
      "Bangun REST API untuk list, detail, buat, ubah, dan hapus task memakai DTO yang pas serta status code akurat.",
      "Validasi semua endpoint penulisan dengan response ProblemDetails dan pasang global exception handler.",
      "Daftarkan service DI dengan lifetime yang dipilih sengaja dan siap kamu jelaskan alasannya.",
      "Bangun aplikasi React dengan controlled input, tambah task, toggle selesai, hapus, plus tampilan loading dan error.",
      "Tulis type TypeScript untuk tiap response API tanpa memakai jalan pintas `any`.",
      "Beri style Tailwind dengan layout responsif, komponen `Button` dan `Input` ber-variant, serta focus state keyboard yang jelas.",
      "Tambahkan endpoint JOIN yang mengembalikan tiap project beserta jumlah task terbuka dalam satu perintah SQL.",
      "Buat client Angular ke API yang sama memakai `httpResource`, validasi Signal Forms, toggle, hapus, dan state loading/error.",
      "Buat client Flutter ke API yang sama dengan form tambah tervalidasi, toggle selesai, serta tampilan loading, kosong, dan error."
    ],
    stretch: [
      "Filter dan urutkan task lewat query string yang tersinkron di URL.",
      "Ganti kode fetch manual dengan TanStack Query."
    ],
    teach: "Sudut pandang mengajar: telusuri satu klik 'tambah task' melewati tiap layer di papan tulis sambil menunjuk kode persis di tiap langkah."
  },
  {
    title: 'Capstone 3: Toko multi-user dengan auth dan test',
    brief: "Buat aplikasinya aman saat dipakai bersamaan dan terjamin test. Di titik inilah kode kamu siap diandalkan oleh engineer lain.",
    build: [
      "Pasang auth JWT atau cookie agar user hanya melihat dan mengubah order miliknya lewat cek otorisasi per resource.",
      "Lindungi area pengelolaan produk admin dengan policy khusus.",
      "Kurangi stok di dalam transaction saat checkout agar request paralel tak bisa bikin overselling, lalu buktikan dengan concurrency test.",
      "Terapkan optimistic concurrency di edit produk yang membalas 409 Conflict dan memunculkan infonya di UI.",
      "Pilih index dari query plan sungguhan lalu catat satu hasil perbandingan sebelum dan sesudahnya.",
      "Buat endpoint laporan penjualan memakai window function untuk running total atau produk terlaris tiap kategori.",
      "Tulis integration test `WebApplicationFactory` ke database asli plus test React Testing Library untuk alur checkout.",
      "Kelola cart dengan reducer dan context sambil mengatur server state memakai query cache serta invalidasi.",
      "Buat design system ringkas memakai token `@theme`, dark mode, dan komponen yang tak membocorkan margin luar.",
      "Bangun storefront Angular dengan route guard, interceptor `ProblemDetails`, signal cart di `@Service()`, dan test Vitest HTTP.",
      "Lengkapi aplikasi Flutter dengan login di secure storage, manajemen cart lewat Bloc/Cubit, serta test cubit dan widget."
    ],
    stretch: [
      "Pakai Options pattern dengan validasi startup untuk semua konfigurasi.",
      "Terapkan structured logging yang menempelkan correlation ID di tiap baris log request."
    ],
    teach: "Sudut pandang mengajar: pilih satu bug berat seperti overselling, IDOR, atau lost update, lalu siapkan demo 15 menit dari bug hingga solusinya."
  },
  {
    title: 'Capstone 4: Platform kelas production',
    brief: "Angkat Capstone 3 ke standar production. Bukti kerjamu bukan cuma kode, melainkan juga metrik latensi, telemetry, dan alasan desain yang matang.",
    build: [
      "Jalankan load test sesuai target p95, temukan satu bottleneck lewat profiler, dan catat angka sebelum/sesudahnya.",
      "Pasang output cache atau HybridCache lengkap dengan strategi invalidasi dan batas waktu data basi yang terukur.",
      "Tambahkan rate limiting, health check liveness dan readiness yang terpisah, serta graceful shutdown.",
      "Pasang OpenTelemetry untuk trace, metric, dan log, lalu ikuti satu trace dari klik React hingga statement SQL-nya.",
      "Pindahkan pengiriman email konfirmasi ke background worker memakai outbox pattern agar tetap aman walau server restart.",
      "Lakukan migrasi schema tanpa downtime memakai pola expand, migrate, dan contract saat aplikasi tetap melayani traffic.",
      "Jaga kecepatan frontend lewat route splitting, virtualisasi daftar panjang, target Core Web Vitals, dan dukungan penuh keyboard.",
      "Bungkus aplikasi ke container lalu deploy lewat CI/CD dengan test otomatis, migrasi, dan skenario rollback teruji.",
      "Atur chunk `@defer`, hybrid SSR (`ServerRoute`), serta validasi tipe OpenAPI di runtime pada aplikasi Angular.",
      "Bangun rilis Flutter ter-sign lewat CI lengkap dengan flavor dev/prod, crash reporting, dan uji upgrade dari versi sebelumnya."
    ],
    stretch: [
      "Tulis Architecture Decision Record (ADR) untuk tiga keputusan arsitektur terpenting.",
      "Lakukan simulasi gangguan (game day) dengan memutus database, dependensi, atau deploy untuk menguji alert dashboard."
    ],
    teach: "Sudut pandang mengajar: presentasikan arsitektur ini selama 30 menit ke tim senior dan jawab kenapa alternatif lain tidak kamu pilih."
  }
];

export default projectsId;
