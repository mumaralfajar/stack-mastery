// Bahasa Indonesia — capstone project.
I18N.projects = [
  {
    title: 'Capstone 1 — Katalog produk, empat cara',
    brief: "Kenali tiap teknologi satu per satu dengan domain kecil yang sama: daftar produk. Belum ada yang saling terhubung; tujuannya merasakan apa yang dikerjakan tiap layer.",
    build: [
      "**C#**: console app dengan class `Product` dan `List<Product>`; tambah, tampilkan, dan jumlahkan produk lewat menu loop.",
      "**SQL**: tulis `CREATE TABLE` untuk products dan lima query: semua, difilter, diurutkan, dihitung per kategori, yang termahal.",
      "**ASP.NET Core**: minimal API dengan `GET /api/products` dan `GET /api/products/{id}` di atas list in-memory, yang mengembalikan 404 dengan benar.",
      "**React + TypeScript**: komponen `ProductList` ber-type yang me-render produk hard-code, lengkap dengan pesan empty state.",
      "**CSS**: beri style daftar produknya dengan grid responsif dan komponen card — belum pakai framework, dan tanpa scroll horizontal di 360px.",
      "Jelaskan dengan lantang apa itu request, row, object, komponen, dan rule CSS — masing-masing satu kalimat.",
      "**Dart + Flutter**: daftar produk hard-code yang sama sebagai satu layar Flutter yang disusun dari `StatelessWidget`, dijalankan di target web."
    ],
    stretch: [
      "Tambahkan `POST` ke API dan panggil dengan `curl`.",
      "Tambahkan search box di list React yang memfilter saat kamu mengetik."
    ],
    teach: "Sudut pandang mengajar: jadikan ini workshop hari pertama. Dari keempat bagian, mana yang kamu tunjukkan lebih dulu, dan apa yang sengaja kamu sembunyikan?"
  },
  {
    title: 'Capstone 2 — Task manager full-stack',
    brief: "Aplikasi sungguhan pertamamu: React bicara dengan ASP.NET Core, yang bicara dengan database lewat EF Core. Setiap layer di stack membawa satu aksi user dari klik sampai jadi row.",
    build: [
      "Schema dengan `projects` dan `tasks` (one-to-many), foreign key, constraint `NOT NULL` dan `CHECK`, dibuat lewat migration EF Core.",
      "REST API: list, get, create, update, dan delete task, dengan DTO request/response dan status code yang benar.",
      "Validasi di setiap endpoint write yang mengembalikan ProblemDetails; global exception handler.",
      "Service didaftarkan dengan lifetime yang dipilih secara sadar; kamu bisa mempertanggungjawabkan masing-masing.",
      "Aplikasi React: daftar task, form create dengan controlled input, toggle done, delete — lengkap dengan state loading dan error.",
      "Type TypeScript untuk setiap response API; tanpa `any`.",
      "Di-style dengan Tailwind: layout responsif, komponen `Button` dan `Input` reusable dengan variant ber-type, focus state yang terlihat.",
      "Endpoint dengan query JOIN: projects beserta jumlah task yang masih open, ditulis sedemikian rupa sehingga menghasilkan tepat satu statement SQL.",
      "Client Flutter untuk API yang sama: daftar task, form create dengan validasi, toggle done — lengkap dengan state loading, kosong, dan error."
    ],
    stretch: [
      "Filter dan sort task lewat parameter query string yang tercermin di URL.",
      "Ganti fetching tulisan tangan dengan TanStack Query."
    ],
    teach: "Sudut pandang mengajar: telusuri satu klik 'add task' melewati keempat layer di whiteboard, sambil menyebutkan baris kode persisnya di tiap perhentian."
  },
  {
    title: 'Capstone 3 — Toko multi-user dengan auth dan test',
    brief: "Buat aplikasinya aman, tetap benar di bawah concurrency, dan terbukti berfungsi. Di level inilah software menjadi sesuatu yang bisa diandalkan orang lain.",
    build: [
      "Authentication dengan JWT atau cookie; user hanya bisa melihat dan mengubah order miliknya sendiri (resource-based authorization).",
      "Role admin dengan area pengelolaan produk yang dilindungi policy.",
      "Membuat order mengurangi stok secara atomic di dalam transaction; overselling mustahil terjadi walaupun request-nya paralel — buktikan dengan test.",
      "Optimistic concurrency pada edit produk yang mengembalikan 409 saat conflict, dan ditampilkan di UI.",
      "Index dipilih berdasarkan query plan sungguhan; satu pengukuran sebelum/sesudah dicatat.",
      "Endpoint laporan penjualan yang memakai window function (running total atau top-N per kategori).",
      "Integration test dengan `WebApplicationFactory` terhadap database sungguhan untuk setiap endpoint; test React Testing Library untuk alur checkout.",
      "Cart diimplementasikan dengan reducer dan context; server state lewat query library dengan invalidation.",
      "Design system kecil: token lewat `@theme`, dark mode, dan komponen yang tidak memiliki margin luar.",
      "Aplikasi Flutter-nya bisa sign in, menyimpan token di secure storage, dan mengelola cart serta order dengan Bloc/Cubit, dilengkapi test untuk cubit dan widget."
    ],
    stretch: [
      "Options pattern dengan validasi saat startup untuk semua setting.",
      "Structured logging dengan correlation ID yang terlihat di setiap baris log dalam satu request."
    ],
    teach: "Sudut pandang mengajar: pilih satu bug yang dicegah project ini — overselling, IDOR, lost update — lalu rancang demo 15 menit yang pertama-tama menunjukkan bug-nya, baru perbaikannya."
  },
  {
    title: 'Capstone 4 — Platform kelas production',
    brief: "Bawa Capstone 3 ke standar production. Yang diserahkan bukan cuma kode, tapi juga bukti: pengukuran, dashboard, dan keputusan yang bisa kamu pertahankan.",
    build: [
      "Load test dengan target p95 yang dinyatakan; satu bottleneck ditemukan lewat profiling dan diperbaiki, lengkap dengan angka sebelum/sesudah.",
      "Caching (output cache atau HybridCache) dengan strategi invalidation yang eksplisit dan jaminan staleness yang tertulis.",
      "Rate limiting, health check yang dipisah jadi liveness dan readiness, graceful shutdown.",
      "Trace, metric, dan log dengan OpenTelemetry; satu trace diikuti dari klik di React sampai statement SQL.",
      "Background worker dengan outbox pattern yang mengirim konfirmasi order exactly-once dari sudut pandang user.",
      "Perubahan schema tanpa downtime yang dieksekusi dengan expand → migrate → contract selagi aplikasinya berjalan.",
      "Frontend: code splitting berbasis route, list panjang yang di-virtualize, Core Web Vitals sesuai budget, sepenuhnya bisa diakses lewat keyboard.",
      "Di-containerize, di-deploy lewat CI dengan test, migration, dan rencana rollback yang benar-benar pernah kamu jalankan.",
      "Aplikasi Flutter di-build di CI sebagai release yang di-sign, dengan flavor dev dan prod, crash reporting, dan jalur upgrade dari versi sebelumnya yang sudah diuji."
    ],
    stretch: [
      "Tulis architecture decision record untuk tiga pilihanmu yang paling berdampak.",
      "Adakan game day: rusak database-nya, sebuah dependency, dan sebuah deploy, lalu dokumentasikan apa yang dilakukan sistem dan dashboard-nya."
    ],
    teach: "Sudut pandang mengajar: presentasikan sistem ini sebagai architecture review 30 menit di depan audiens senior. Mereka akan bertanya 'kenapa bukan alternatifnya?' untuk setiap pilihan — siapkan jawabannya."
  }
];
