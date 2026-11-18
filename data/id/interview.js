// Bahasa Indonesia — konten persiapan interview. Kode, test case, dan solusi tetap memakai versi aslinya.
I18N.iv = {
  method: [
    ['Klarifikasi', 'Ulangi soalnya dengan kata-katamu sendiri. Tanyakan ukuran input, rentang nilai, duplikat, input kosong, dan apa yang dikembalikan kalau tidak ada jawaban.'],
    ['Contoh', 'Kerjakan satu contoh normal dan satu edge case dengan tangan, sambil bicara. Di sinilah kebanyakan salah paham muncul ke permukaan.'],
    ['Brute force', 'Sebutkan solusi yang paling jelas beserta complexity-nya dalam satu kalimat. Ini membuktikan kamu paham soalnya dan memberi baseline.'],
    ['Optimasi', 'Sebutkan bottleneck-nya, lalu pattern yang menghilangkannya (hash map, two pointers, sorting, heap…). Sepakati pendekatannya sebelum coding.'],
    ['Coding', 'Tulis kode yang rapi sambil menjelaskan. Nama yang bermakna, helper function kecil, dan jangan diam lebih dari satu menit.'],
    ['Test', 'Telusuri kodemu dengan contoh tadi, lalu dengan edge case — seperti seorang reviewer, baris demi baris. Perbaiki bug dengan tenang.'],
    ['Analisis', 'Sebutkan time dan space complexity, plus satu trade-off atau perbaikan lanjutan.']
  ],
  bigO: [
    ['Index array / hash lookup', 'O(1)'],
    ['Binary search, operasi pada balanced tree', 'O(log n)'],
    ['Single pass, two pointers, sliding window', 'O(n)'],
    ['Sorting, heap berisi n item', 'O(n log n)'],
    ['Nested loop atas input', 'O(n²)'],
    ['Semua subset / semua permutasi', 'O(2ⁿ) / O(n!)']
  ],
  plan: [
    ['Minggu 1 — Fondasi', [
      'Selesaikan materi Pemula di CS Fundamentals, C#, dan SQL',
      'Kerjakan 7 soal coding yang easy, sambil menjelaskan dengan lantang',
      'Tulis résumé-mu dengan impact formula',
      'Daftar 10 pengalaman yang bisa dijadikan cerita'
    ]],
    ['Minggu 2 — Pattern inti', [
      'Pelajari pattern hash map, two pointers, sliding window, dan stack',
      'Kerjakan 5 soal medium (masing-masing 30 menit, pakai timer)',
      'Selesaikan materi Pemula di ASP.NET Core, CSS, React, Angular, dan Flutter',
      'Tulis 3 cerita STAR di bank cerita'
    ]],
    ['Minggu 3 — Tree, graph, search', [
      'Pelajari binary search, tree, graph, dan interval',
      'Kerjakan 5 soal medium lagi; ulangi soal yang tadi butuh hint',
      'Selesaikan materi Menengah di C#, SQL, dan ASP.NET Core',
      'Mulai Capstone 2 — project portofoliomu'
    ]],
    ['Minggu 4 — DP, backtracking, dasar design', [
      'Pelajari backtracking dan dynamic programming',
      'Kerjakan soal yang tersisa, termasuk yang hard',
      'Pelajari framework system design dan building block-nya',
      'Mock coding interview pertama, dinilai dengan rubrik',
      'Selesaikan materi Menengah di CSS, React, Angular, dan Flutter'
    ]],
    ['Minggu 5 — System design', [
      'Kerjakan keenam kasus design: coba dulu, baru bandingkan',
      'Presentasikan satu kasus secara lisan dalam 35 menit, sambil direkam',
      'Materi Mahir: async, transaction, index, auth',
      'Lengkapi bank cerita: semua tema terisi'
    ]],
    ['Minggu 6 — Kedalaman full-stack', [
      'Tanya jawab kilat: nilai semua pertanyaan, ulangi yang masih goyah',
      'Selesaikan Capstone 2 dan deploy; mulai Capstone 3',
      'Mock system design interview',
      'Mock behavioral interview'
    ]],
    ['Minggu 7 — Mock loop', [
      'Dua mock coding interview dengan timer',
      'Satu loop penuh dalam sehari: coding, design, behavioral, tanya jawab kilat',
      'Review setiap skor rubrik di bawah 3 dan latih area itu',
      'Latihan bersama orang lain minimal sekali'
    ]],
    ['Minggu 8 — Melamar dan mengasah', [
      'Melamar ke banyak tempat; minta referral; jadwalkan interview yang lebih mudah lebih dulu',
      'Kerjakan ulang 8 soal tanpa persiapan, masing-masing 20 menit',
      'Siapkan pertanyaan untuk tiap interviewer',
      'Setiap selesai interview sungguhan, catat semua pertanyaan yang diajukan'
    ]]
  ],
  hiring: [
    "**Apa yang diukur interview.** Loop di big tech umumnya menilai empat hal: problem solving dan coding, system design (mulai mid-level ke atas), bukti behavioral, dan kedalaman di stack-mu sendiri. Tiap interviewer menulis penilaian hire / no-hire secara independen berdasarkan rubrik.",
    "**Poin di résumé memakai impact formula:** mencapai X, diukur dengan Y, dengan melakukan Z. “Menurunkan latency p95 API checkout dari 900 ms ke 180 ms dengan menambah covering index dan output caching.” Angka, bukan daftar tugas.",
    "**Belum punya nama perusahaan besar? Bangun bukti.** Capstone 3 dan 4 di program ini berkelas portofolio: di-deploy, dites, diukur. Sistem nyata dengan angka nyata mengalahkan daftar teknologi.",
    "**Referral melipatgandakan peluang lamaranmu direspons.** Hubungi engineer di perusahaan incaranmu dengan pesan singkat yang spesifik dan link ke karyamu. Berkontribusilah ke project open source yang mereka pakai.",
    "**Level.** Junior: menyelesaikan masalah yang sudah terdefinisi dengan kode yang rapi. Mid: memegang fitur dari ujung ke ujung dan mendesain komponen. Senior: memegang sistem, menangani ambiguitas, dan membuat orang lain jadi lebih baik. Arahkan cerita dan kedalaman design-mu ke level yang kamu lamar.",
    "**Atur urutan interview-mu.** Jadwalkan perusahaan yang kurang kamu incar lebih dulu sebagai latihan, dan kumpulkan final round berdekatan supaya offer-nya datang bersamaan.",
    "**Bukti mengalahkan jabatan.** Project yang sudah dirilis, hasil yang terukur, tulisan atau talk publik, dan karya open source adalah bukti yang bisa dicek siapa saja. Nama perusahaan besar membantumu mendapat panggilan pertama; yang bisa kamu tunjukkanlah yang membuatmu lolos loop-nya.",
    "**Perusahaan remote dan perusahaan Indonesia punya cara interview yang berbeda — siapkan keduanya.** Persiapan big tech adalah standar yang lebih ketat dan sudah mencakup sebagian besarnya, tapi banyak perusahaan melewatkan soal algoritma dan menggantinya dengan take-home assignment atau live coding fitur yang realistis, lalu interview HR dan interview “user” dengan team lead.",
    "**Take-home dinilai seperti pull request.** Baca brief-nya dua kali, bertanya sejak awal, dan tetap dalam batas waktu yang disebutkan. README yang menjelaskan cara menjalankannya, apa yang kamu pilih dan apa yang sengaja ditinggalkan, beberapa test yang bermakna, dan commit yang rapi sama pentingnya dengan fiturnya.",
    "**Ketahui angkamu sebelum interview HR.** Untuk posisi remote yang dibayar dari luar negeri, tanyakan juga apakah kamu karyawan atau kontraktor, bagaimana dan dalam mata uang apa kamu dibayar, dan siapa yang mengurus pajak — sebagai kontraktor, biasanya kamu sendiri yang melapor dan membayarnya."
  ],
  ui: [
    ['Autocomplete search box', 'Fetch saran saat user mengetik, tampilkan dalam list, pilih dengan mouse atau keyboard.', 'Request di-debounce; response basi diabaikan atau di-abort; tombol panah, Enter, dan Escape berfungsi; ada state loading, kosong, dan error; role combobox yang accessible.'],
    ['Modal dialog', 'Modal reusable yang dibuka lewat sebuah button, dengan judul, isi, dan aksi untuk menutup.', 'Focus pindah ke dalam dan terkurung di sana; Escape dan klik backdrop menutupnya; focus kembali ke pemicunya; scroll body dikunci; memakai `<dialog>` atau ARIA yang benar.'],
    ['Data table', 'Render baris dari API dengan kolom yang bisa di-sort, pagination, dan kotak filter.', 'State dijaga minimal dan diturunkan; sort dan halaman tercermin di URL; key yang stabil; ada state loading dan kosong; tidak fetch ulang di setiap ketukan tombol.'],
    ['Todo list dengan filter', 'Tambah, toggle, edit, dan hapus item; filter berdasarkan all / active / done; tetap tersimpan setelah reload.', 'Update yang immutable; list hasil filter diturunkan; controlled input; reducer atau handler yang rapi; proses edit yang ramah keyboard.'],
    ['Star rating', 'Komponen rating lima bintang yang bisa dipakai sebagai input form.', 'Bisa dipakai controlled maupun uncontrolled; preview saat hover; dukungan keyboard dengan tombol panah; semantik radio group; props ber-type.'],
    ['Infinite scroll feed', 'Muat halaman item berikutnya saat user mendekati bagian bawah.', 'IntersectionObserver, bukan scroll event; cursor pagination; tidak ada request duplikat; virtualization dibahas untuk list panjang.'],
    ['Angular: pencarian live & tabel dengan filter', 'Component Angular yang memuat produk dari API, memfilter berdasarkan kata kunci dan kategori di URL, serta menghindari race condition pencarian.', '`httpResource` atau `toObservable` + `debounceTime` + `switchMap`; `withComponentInputBinding()` untuk query param; `computed()` untuk baris terfilter; `@for (...; track p.id)` dengan `@empty`; `@defer` atau live region ARIA untuk status update.'],
    ['Angular: form checkout multi-langkah (Signal Forms)', 'Component form dengan kolom pengiriman/penagihan, validasi diskon kondisional, verifikasi promo asinkron, dan pemetaan ProblemDetails server.', 'Signal Forms (`form()`, `[formField]`, `applyWhen()`, `submit()`); membaca state lewat `field().touched()` / `errors()`; `exhaustMap` atau state disabled saat submit; memetakan `ProblemDetails.errors` server dengan `aria-describedby` dan `role="alert"`.'],
    ['Flutter: daftar produk dengan pencarian', 'Layar yang memuat produk dari API, memfilternya saat user mengetik, dan mendukung pull-to-refresh.', 'Ada state loading, kosong, dan error; pencarian di-debounce; logic ada di cubit atau bloc, bukan di widget; `ListView.builder` dengan key; tidak ada pekerjaan yang dimulai di dalam `build`.'],
    ['Flutter: cart dengan tombol quantity', 'Layar cart yang tiap barisnya punya tombol plus dan minus, total yang terus ter-update, dan aksi swipe untuk menghapus.', 'State immutable dengan `copyWith`; rebuild yang sempit (`BlocSelector` atau widget kecil); key pada baris yang dismissible; tombol minus nonaktif di angka nol; semantics label pada icon button.']
  ],
  patterns: {
    hashing: { signal: 'Kamu perlu tahu “apakah ini sudah pernah muncul?” atau perlu menghitung sesuatu, dan nested loop akan jadi O(n²).', cost: 'Time O(n), space O(n)' },
    'two-pointers': { signal: 'Input-nya terurut (atau bisa diurutkan), atau kamu membandingkan elemen dari kedua ujung sambil bergerak ke tengah.', cost: 'Time O(n), space O(1)' },
    'sliding-window': { signal: 'Soalnya menanyakan subarray atau substring berurutan yang terpanjang / terpendek / terbaik.', cost: 'Time O(n) — tiap elemen masuk dan keluar window satu kali' },
    stack: { signal: 'Pasangan yang harus cocok, undo, atau “elemen berikutnya yang lebih besar / lebih kecil” untuk tiap posisi.', cost: 'Time O(n), space O(n)' },
    'binary-search': { signal: 'Data terurut, atau pertanyaan ya/tidak yang jawabannya berubah tepat satu kali seiring sebuah nilai membesar (“search on the answer”).', cost: 'Time O(log n)' },
    'linked-list': { signal: 'Reversal, mencari titik tengah, mendeteksi cycle, me-merge list — menyambung ulang pointer dengan space tambahan O(1).', cost: 'Time O(n), space O(1)' },
    trees: { signal: 'Data hierarkis. DFS (rekursi) untuk kedalaman, path, dan sifat subtree; BFS (queue) untuk level dan jumlah langkah terpendek.', cost: 'Time O(n); space O(height) untuk DFS, O(width) untuk BFS' },
    heap: { signal: '“K terbesar”, “K paling sering muncul”, “terkecil berikutnya” secara berulang, atau me-merge beberapa stream terurut.', cost: 'Time O(n log k), space O(k)' },
    graphs: { signal: 'Koneksi, grid, dependency, “apakah bisa sampai”, “ada berapa kelompok”, “dengan urutan apa”.', cost: 'Time O(V + E)' },
    intervals: { signal: 'Range yang bisa bertumpang-tindih: meeting, booking, merge. Hampir selalu: sort berdasarkan start lebih dulu.', cost: 'Time O(n log n) untuk sort-nya' },
    backtracking: { signal: '“Semua kombinasi / permutasi / subset”, atau puzzle yang diselesaikan dengan mencoba pilihan lalu membatalkannya.', cost: 'Eksponensial — O(2ⁿ) atau O(n!) — dan memang begitu seharusnya' },
    dp: { signal: 'Nilai optimal atau jumlah cara, yang jawabannya disusun dari jawaban subproblem lebih kecil yang saling tumpang-tindih.', cost: 'Biasanya O(state × transisi)' }
  }
};
// Judul soal sengaja dibiarkan dalam bahasa Inggris, seperti nama soal yang biasa dipakai saat interview.
I18N.iv.problems = {
  'two-sum': {
    prompt: 'Diberikan array integer dan sebuah target, kembalikan index [i, j] (i < j) dari dua angka yang jumlahnya sama dengan target. Dijamin ada tepat satu pasangan yang valid.',
    hints: ['Untuk tiap angka x, angka lain mana yang sedang kamu cari?', 'Simpan setiap angka yang sudah dilewati ke dalam map dari value ke index, lalu cari target − x.'],
    complexity: 'Time O(n), space O(n). Brute force dengan mengecek setiap pasangan itu O(n²).',
    follow: ['Bagaimana kalau array-nya terurut? (Two pointers, space O(1).)', 'Bagaimana kalau pasangannya bisa lebih dari satu dan semuanya harus dikembalikan?']
  },
  'group-anagrams': {
    prompt: 'Kelompokkan kata-kata yang merupakan anagram satu sama lain. Group dan kata di dalamnya boleh dikembalikan dengan urutan apa pun.',
    hints: ['Dua kata adalah anagram kalau bentuk kanoniknya identik.', 'Pakai huruf-hurufnya yang sudah diurutkan (atau signature jumlah huruf) sebagai key map.'],
    complexity: 'Time O(n · k log k) untuk n kata dengan panjang k; space O(n · k).',
    follow: ['Bagaimana menghindari sorting tiap kata? (Hitungan 26 slot sebagai key: O(n · k).)', 'Bagaimana kalau kata-katanya tidak muat di memory?']
  },
  'top-k-frequent': {
    prompt: 'Kembalikan k nilai yang paling sering muncul di array, dengan urutan apa pun. Jawabannya dijamin unik.',
    hints: ['Hitung dulu. Setelah itu kamu butuh k hitungan terbesar.', 'Frekuensi tidak mungkin melebihi n — jadi hitungannya bisa jadi index untuk array of bucket.'],
    complexity: 'Time dan space O(n) dengan bucket sort. Min-heap berukuran k memberi O(n log k).',
    follow: ['Kapan solusi heap lebih baik daripada bucket? (Data streaming, atau k jauh lebih kecil dari n.)', 'Bagaimana cara kerjanya kalau dijalankan di banyak mesin?']
  },
  'valid-palindrome': {
    prompt: 'Kembalikan true kalau string-nya terbaca sama dari depan maupun dari belakang, dengan hanya memperhitungkan huruf dan angka serta mengabaikan besar-kecil huruf.',
    hints: ['Bandingkan karakter dari kedua ujung sambil bergerak ke tengah.', 'Majukan pointer setiap kali ia berada di karakter yang bukan huruf atau angka.'],
    complexity: 'Time O(n), space O(1) — tidak membuat salinan string yang sudah dibersihkan.',
    follow: ['Bagaimana kalau kamu boleh menghapus maksimal satu karakter?', 'Bagaimana Unicode mengubah definisi “huruf” versimu?']
  },
  'container-water': {
    prompt: 'Tiap nilai array adalah tinggi sebuah garis vertikal di index itu. Pilih dua garis yang, bersama sumbu x, menampung air paling banyak. Kembalikan luasnya.',
    hints: ['Mulai dari container terlebar: satu pointer di tiap ujung.', 'Menggeser garis yang lebih tinggi ke dalam tidak akan pernah membantu. Geser yang lebih pendek.'],
    complexity: 'Time O(n), space O(1).',
    follow: ['Buktikan kenapa menggeser sisi yang lebih pendek itu aman.', 'Apa bedanya dengan soal trapping rain water?']
  },
  'longest-substring': {
    prompt: 'Kembalikan panjang substring terpanjang yang tidak mengandung karakter berulang.',
    hints: ['Jaga sebuah window [left, right] yang tidak pernah berisi duplikat.', 'Ingat index terakhir tiap karakter; saat bertemu karakter berulang di dalam window, lompatkan left melewatinya.'],
    complexity: 'Time O(n), space O(min(n, ukuran alfabet)).',
    follow: ['Kembalikan substring-nya, bukan cuma panjangnya.', 'Izinkan maksimal k karakter berbeda.']
  },
  'best-trade': {
    prompt: 'prices[i] adalah harga di hari ke-i. Beli di satu hari dan jual di hari sesudahnya. Kembalikan profit maksimum, atau 0 kalau tidak mungkin untung.',
    hints: ['Untuk tiap hari, penjualan terbaik memakai harga terendah yang pernah muncul sebelumnya.', 'Catat running minimum dalam satu kali pass.'],
    complexity: 'Time O(n), space O(1).',
    follow: ['Transaksi tidak dibatasi.', 'Maksimal dua transaksi.']
  },
  'valid-brackets': {
    prompt: 'Diberikan string berisi karakter ( ) [ ] { }, kembalikan true kalau setiap kurung ditutup oleh jenis yang sama dengan urutan yang benar.',
    hints: ['Kurung yang paling terakhir dibuka harus jadi yang pertama ditutup.', 'Push kurung buka ke stack; saat bertemu kurung tutup, elemen teratas stack harus cocok.'],
    complexity: 'Time O(n), space O(n).',
    follow: ['Kembalikan index karakter pertama yang tidak valid.', 'Jumlah minimum penghapusan supaya jadi valid.']
  },
  'daily-temperatures': {
    prompt: 'Untuk tiap hari, kembalikan berapa hari kamu harus menunggu sampai suhunya lebih hangat, atau 0 kalau tidak pernah.',
    hints: ['Hari yang belum menemukan hari yang lebih hangat sedang “menunggu”. Hari menunggu mana yang selesai lebih dulu?', 'Simpan stack berisi index dengan suhu menurun; hari yang lebih hangat mem-pop semua yang lebih dingin darinya.'],
    complexity: 'Time O(n) — tiap index di-push dan di-pop maksimal sekali. Space O(n).',
    follow: ['Kenapa ini O(n) padahal ada nested loop?', 'Selesaikan dengan scan dari kanan ke kiri.']
  },
  'search-rotated': {
    prompt: 'Sebuah array terurut berisi integer unik sudah dirotasi di pivot yang tidak diketahui. Kembalikan index target, atau -1. Targetkan O(log n).',
    hints: ['Di titik tengah mana pun, minimal satu sisinya masih terurut sempurna.', 'Tentukan sisi yang terurut, cek apakah target ada di dalam rentangnya, lalu buang sisi satunya.'],
    complexity: 'Time O(log n), space O(1).',
    follow: ['Apa yang berubah kalau duplikat diperbolehkan?', 'Cari pivot rotasinya.']
  },
  'reverse-list': {
    prompt: 'Balik sebuah singly linked list dan kembalikan head barunya. Sebuah node berbentuk { val, next }.',
    hints: ['Telusuri list-nya sekali, sambil membalik arah tiap panah.', 'Kamu butuh tiga reference: previous, current, dan next (disimpan sebelum kamu menimpanya).'],
    complexity: 'Time O(n), space O(1).',
    follow: ['Kerjakan secara rekursif. Berapa biaya space-nya?', 'Balik hanya node di antara posisi m dan n.']
  },
  'merge-intervals': {
    prompt: 'Diberikan interval [start, end], merge semua yang overlap (interval yang bersentuhan dihitung overlap) dan kembalikan terurut berdasarkan start.',
    hints: ['Setelah diurutkan berdasarkan start, sebuah interval hanya mungkin overlap dengan interval tepat sebelumnya.', 'Bandingkan start tiap interval dengan end dari interval hasil merge terakhir.'],
    complexity: 'Time O(n log n) untuk sort-nya, space O(n).',
    follow: ['Sisipkan satu interval baru ke list yang sudah di-merge dalam O(n).', 'Jumlah minimum ruang meeting yang dibutuhkan.']
  },
  'tree-depth': {
    prompt: 'Kembalikan jumlah node pada path terpanjang dari root sampai ke sebuah leaf. Sebuah node berbentuk { val, left, right }.',
    hints: ['Berapa kedalaman tree yang kosong?', 'Kedalaman sebuah node adalah satu lebih banyak dari subtree-nya yang lebih dalam.'],
    complexity: 'Time O(n), space O(height) untuk recursion stack.',
    follow: ['Kerjakan tanpa rekursi.', 'Apakah tree-nya height-balanced?']
  },
  'level-order': {
    prompt: 'Kembalikan nilai-nilai sebuah binary tree level demi level, dari kiri ke kanan, sebagai array of array.',
    hints: ['Breadth-first search mengunjungi node persis dengan urutan ini.', 'Di awal tiap putaran, panjang queue adalah jumlah node di level saat itu.'],
    complexity: 'Time O(n), space O(width).',
    follow: ['Urutan zigzag (arah berganti tiap level).', 'Right-side view dari tree-nya.']
  },
  islands: {
    prompt: 'Sebuah grid berisi "1" (daratan) dan "0" (air). Sebuah pulau adalah daratan yang terhubung secara horizontal atau vertikal. Kembalikan jumlah pulaunya.',
    hints: ['Setiap kali menemukan daratan yang belum dikunjungi, kamu menemukan satu pulau baru.', 'Dari sel itu, lakukan flood fill (DFS atau BFS) untuk menandai seluruh pulau sebagai sudah dikunjungi.'],
    complexity: 'Time O(rows × cols); space O(rows × cols) di worst case untuk rekursinya.',
    follow: ['Kamu tidak boleh mengubah input-nya.', 'Grid-nya sangat besar dan datang sebagai stream baris (union-find).']
  },
  'course-schedule': {
    prompt: 'Ada n course bernomor 0…n−1. Tiap pasangan [a, b] berarti kamu harus mengambil b sebelum a. Kembalikan true kalau semua course bisa diselesaikan.',
    hints: ['Soal ini menanyakan apakah sebuah directed graph punya cycle.', 'Terus ambil course mana pun yang sudah tidak punya prasyarat tersisa (algoritma Kahn). Kalau tidak semuanya bisa diambil, berarti ada cycle.'],
    complexity: 'Time dan space O(V + E).',
    follow: ['Kembalikan satu urutan course yang valid.', 'Bagaimana mendeteksi cycle-nya dengan DFS colouring?']
  },
  'climb-stairs': {
    prompt: 'Kamu menaiki tangga dengan n anak tangga, sekali melangkah 1 atau 2 anak tangga. Kembalikan jumlah cara berbeda untuk sampai ke puncak.',
    hints: ['Bagaimana kamu bisa sampai di anak tangga n? Dari anak tangga mana saja?', 'ways(n) = ways(n − 1) + ways(n − 2). Kamu hanya butuh dua nilai terakhir.'],
    complexity: 'Time O(n), space O(1). Rekursi biasa tanpa memoization itu O(2ⁿ).',
    follow: ['Boleh melangkah 1, 2, atau 3 anak tangga.', 'Tiap anak tangga punya biaya; cari cara naik yang paling murah.']
  },
  'coin-change': {
    prompt: 'Diberikan pecahan koin (persediaan tiap pecahan tidak terbatas) dan sebuah amount, kembalikan jumlah koin paling sedikit untuk mencapai amount itu, atau -1 kalau mustahil.',
    hints: ['Greedy (koin terbesar dulu) gagal: coba koin [1,3,4] dan amount 6.', 'Misalkan dp[a] adalah jumlah koin paling sedikit untuk amount a. dp[a] = 1 + min(dp[a − coin]) untuk semua koin.'],
    complexity: 'Time O(amount × coins), space O(amount).',
    follow: ['Hitung jumlah kombinasinya, bukan jumlah minimumnya.', 'Kembalikan koin mana saja yang dipakai.']
  },
  subsets: {
    prompt: 'Diberikan array berisi integer unik, kembalikan semua subset yang mungkin (power set), dengan urutan apa pun.',
    hints: ['Untuk tiap angka ada dua pilihan: diikutkan atau tidak.', 'Lakukan rekursi dengan start index; simpan salinan path saat ini di setiap pemanggilan.'],
    complexity: 'Time dan space O(n · 2ⁿ) — ada 2ⁿ subset yang harus dihasilkan.',
    follow: ['Input-nya bisa mengandung duplikat; kembalikan subset yang unik.', 'Hanya subset berukuran k.']
  },
  'lru-cache': {
    prompt: 'Desain sebuah cache dengan kapasitas tetap. get(key) mengembalikan value-nya atau -1. put(key, value) menyisipkan atau meng-update; kalau melebihi kapasitas, key yang paling lama tidak dipakai dibuang. Kedua operasi harus O(1). Membaca atau menulis sebuah key menjadikannya yang paling baru dipakai.',
    hints: ['Kamu butuh lookup O(1) dan “pindahkan ke paling baru” O(1) — hash map plus sebuah struktur yang menjaga urutan.', 'Jawaban klasiknya hash map plus doubly linked list. Di JavaScript, Map sudah mengingat urutan insert: hapus lalu sisipkan ulang untuk menyegarkan sebuah key.'],
    complexity: 'O(1) per operasi, space O(capacity).',
    follow: ['Implementasikan dengan hash map dan doubly linked list, seperti yang akan kamu lakukan di C#.', 'Buat jadi thread-safe. Tambahkan time-to-live per entry.']
  },
  'trap-water': {
    prompt: 'Tiap nilai adalah tinggi sebuah batang selebar 1. Kembalikan berapa unit air yang terjebak di antara batang-batang itu setelah hujan.',
    hints: ['Air di atas sebuah batang = min(batang tertinggi di kirinya, tertinggi di kanannya) − tingginya sendiri.', 'Pakai two pointers. Sisi dengan maksimum yang lebih kecil adalah sisi pembatas, jadi airnya bisa langsung dihitung.'],
    complexity: 'Time O(n), space O(1). Versi prefix/suffix maximum memakai space O(n) dan lebih mudah dijelaskan lebih dulu.',
    follow: ['Selesaikan dengan monotonic stack.', 'Bagaimana dengan height map 2D?']
  }
};
I18N.iv.design = {
  framework: [
    ['Requirement', '5 menit', 'Functional: cukup 3–4 fitur inti. Non-functional: skala, latency, availability, consistency. Sebutkan apa yang di luar scope.'],
    ['Estimasi', '5 menit', 'Jumlah user, request per detik, rasio read:write, storage per tahun. Pakai angka bulat; tujuannya mencari apa yang paling dominan.'],
    ['API dan data model', '5 menit', 'Endpoint utama beserta input dan output-nya. Entity inti, key-nya, dan store mana yang cocok untuk masing-masing.'],
    ['High-level design', '10 menit', 'Gambar kotak-kotaknya: client, load balancer, service, database, cache, queue. Telusuri satu request dari ujung ke ujung.'],
    ['Deep dive', '15 menit', 'Dalami dua bagian tersulit — biasanya hot path dan data store. Di sinilah senioritas terlihat.'],
    ['Trade-off dan penutup', '5 menit', 'Bottleneck, failure mode, monitoring, dan apa yang akan kamu ubah kalau skalanya 10×.']
  ],
  blocks: [
    ['Load balancer', 'Menyebar request ke beberapa server stateless dan menyingkirkan server yang tidak sehat.'],
    ['Cache', 'Menyimpan data yang sering diakses di memory (Redis). Tentukan key, expiry, invalidation, dan apa yang terjadi saat miss datang bertubi-tubi.'],
    ['CDN', 'Menyajikan content statis dan yang bisa di-cache dari lokasi yang dekat dengan user.'],
    ['Message queue', 'Memisahkan producer dari consumer, menyerap lonjakan, memungkinkan retry. Consumer harus idempotent.'],
    ['Replication', 'Salinan data untuk scaling read dan failover. Replica yang asynchronous selalu tertinggal sedikit.'],
    ['Sharding / partitioning', 'Memecah data ke beberapa node berdasarkan sebuah key. Pilih key yang menghindari hot shard dan query lintas shard.'],
    ['Consistent hashing', 'Memetakan key ke node sedemikian rupa sehingga menambah atau membuang satu node hanya memindahkan sebagian kecil key.'],
    ['SQL vs NoSQL', 'SQL: relasi, transaction, query yang fleksibel. NoSQL: pola akses sederhana dalam skala sangat besar, consistency yang bisa diatur.'],
    ['CAP dalam praktik', 'Saat terjadi network partition, kamu memilih consistency atau availability. Sebutkan mana yang dibutuhkan tiap bagian sistemmu.'],
    ['Idempotency key', 'Id dari client yang membuat write yang di-retry aman untuk diterapkan hanya sekali.']
  ],
  cases: {
    'url-shortener': {
      prompt: 'Desain service yang mengubah URL panjang jadi link pendek dan me-redirect pengunjungnya — sistem yang jauh lebih sering dibaca daripada ditulis.',
      req: [
        'Membuat link pendek untuk sebuah URL panjang; custom alias dan expiry bersifat opsional.',
        'Me-redirect link pendek ke URL aslinya dengan latency sangat rendah.',
        'Non-functional: redirect yang highly available, link tidak pernah bentrok, analytics klik sederhana.',
        'Di luar scope: akun user, preview link.'
      ],
      est: [
        '100 juta link baru per bulan ≈ 40 write/detik; rasio read 100:1 ≈ 4.000 redirect/detik rata-rata, lebih banyak saat peak.',
        '500 byte per record × 1,2 miliar link per tahun ≈ 600 GB per tahun.',
        'Kode base-62 sepanjang 7 karakter memberi 62⁷ ≈ 3,5 triliun kombinasi.'
      ],
      deep: [
        ['Menghasilkan kode', 'Meng-hash URL berisiko collision dan butuh check-and-retry. Counter yang di-encode ke base 62 menjamin keunikan: beri tiap server rentang ID yang sudah dialokasikan lebih dulu supaya tidak ada bottleneck terpusat. Tambahkan unsur acak atau enkripsi pada counter kalau kodenya tidak boleh bisa ditebak.'],
        ['Redirect yang cepat', 'Cek cache dulu, kalau tidak ada baru ke store, lalu isi cache-nya. Sebagian besar traffic mengenai sebagian kecil link, jadi cache berukuran sedang pun punya hit rate tinggi. Pilih 302 kalau setiap klik harus terhitung; 301 membuat browser meng-cache dan melewati servermu.'],
        ['Analytics tanpa memperlambat redirect', 'Publish event klik ke queue lalu langsung return; lakukan agregasi secara asynchronous.'],
        ['Storage', 'Aksesnya berupa lookup satu key, jadi key-value store atau wide-column store yang dipartisi berdasarkan kode bisa scale secara horizontal. Relational database pun tidak masalah untuk skala yang lebih kecil.']
      ],
      follow: ['Bagaimana menangani link yang tiba-tiba viral?', 'Bagaimana link yang sudah expired dihapus?', 'Bagaimana mencegah penyalahgunaan untuk phishing?']
    },
    'rate-limiter': {
      prompt: 'Desain rate limiter yang melindungi API dari terlalu banyak request per client, dan tetap bekerja dengan benar di banyak server.',
      req: [
        'Membatasi request per client key (user, API key, atau IP) per time window; limit berbeda per endpoint.',
        'Menolak request yang berlebih dengan 429 dan header Retry-After.',
        'Non-functional: hanya menambah beberapa milidetik, bekerja di semua server API, gagal dengan aman.',
        'Di luar scope: perlindungan DDoS di network layer.'
      ],
      est: [
        'Kalau API melayani 10.000 request/detik, limiter melakukan 10.000 pengecekan/detik — masing-masing satu read-modify-write kecil.',
        'State per client sangat kecil (satu counter dan satu timestamp), jadi 10 juta client aktif muat di beberapa GB memory.'
      ],
      deep: [
        ['Memilih algoritma', 'Fixed window paling sederhana tapi membolehkan burst ganda di tepi window. Sliding window log itu presisi tapi menyimpan setiap timestamp. Sliding window counter memberi pendekatan yang bagus dengan biaya murah. Token bucket membolehkan burst yang terkendali dan biasanya jadi default; sebutkan pilihanmu dan alasannya.'],
        ['Correctness di banyak server', 'Counter harus tinggal di store bersama. Read-then-write dari beberapa server akan race, jadi lakukan check-and-decrement secara atomic — Lua script atau atomic increment dengan expiry di Redis.'],
        ['Latency dan kegagalan', 'Taruh store-nya dekat dengan server API. Putuskan failure mode-nya secara eksplisit: fail open (loloskan traffic kalau limiter mati) demi availability, fail closed untuk endpoint yang dilindungi seperti login.'],
        ['Skala', 'Shard counter berdasarkan client key. Untuk volume yang sangat tinggi, biarkan tiap server memegang satu batch token lokal dan sinkron secara berkala, menukar ketepatan dengan kecepatan.']
      ],
      follow: ['Bagaimana rate limit berdasarkan cost, bukan jumlah request?', 'Bagaimana client mengetahui sisa kuotanya?', 'Bagaimana membatasi penyerang terdistribusi yang memakai banyak IP?']
    },
    'news-feed': {
      title: 'News feed media sosial',
      prompt: 'Desain home feed sebuah aplikasi sosial: user mem-follow user lain dan melihat post terbaru mereka, dari yang terbaru atau yang paling relevan.',
      req: [
        'Mem-publish post; follow dan unfollow user; memuat home feed dengan pagination.',
        'Non-functional: feed termuat di bawah 200 ms; eventual consistency beberapa detik masih bisa diterima; highly available.',
        'Di luar scope: detail model ranking, iklan, direct message.'
      ],
      est: [
        '200 juta user harian × 5 kali buka feed ≈ 12.000 read feed/detik; 20 juta post per hari ≈ 230 write/detik.',
        'Read mendominasi sekitar 50:1, jadi optimasi read path-nya.',
        'Rata-rata user mem-follow 200 akun; seorang selebritas bisa punya 50 juta follower.'
      ],
      deep: [
        ['Fan-out on write vs on read', 'On write: saat seseorang mem-post, push id post-nya ke feed tiap follower yang sudah dihitung lebih dulu — read cukup satu lookup ke cache, tapi satu post selebritas berarti jutaan write. On read: susun feed saat request dengan me-merge post terbaru dari akun yang di-follow — write murah, read lambat. Pakai hybrid: push untuk user biasa, pull lalu merge untuk akun selebritas.'],
        ['Feed cache', 'Simpan hanya id post per user (misalnya 500 terbaru) lalu ambil isi post-nya dari post cache. User yang tidak aktif tidak butuh feed yang dihitung lebih dulu; susun saat diminta ketika mereka kembali.'],
        ['Pagination', 'Pakai cursor (keyset) pagination pada (created_at, id). Offset pagination menampilkan duplikat dan celah saat post baru terus berdatangan.'],
        ['Media', 'Upload media langsung ke object storage dengan pre-signed URL dan sajikan lewat CDN; API hanya menangani metadata.']
      ],
      follow: ['Bagaimana unfollow atau post yang dihapus dikeluarkan dari feed?', 'Bagaimana ranking berdasarkan relevansi mengubah desainnya?', 'Apa yang terjadi kalau fan-out queue tertinggal?']
    },
    chat: {
      prompt: 'Desain service messaging dengan chat satu lawan satu dan group kecil, pengiriman real time ke user yang online, dan history untuk user yang offline.',
      req: [
        'Mengirim dan menerima pesan secara real time; group chat sampai beberapa ratus anggota; history pesan; tanda delivered/read.',
        'Non-functional: pengiriman di bawah 500 ms, pesan tidak pernah hilang, berurutan di dalam satu percakapan.',
        'Di luar scope: voice dan video, detail end-to-end encryption.'
      ],
      est: [
        '50 juta user harian, masing-masing 40 pesan ≈ 2 miliar pesan per hari ≈ 23.000 pesan/detik rata-rata.',
        '10 juta koneksi concurrent; dengan sekitar 100.000 koneksi per server, itu kira-kira 100 server gateway.',
        '2 miliar × 200 byte ≈ 400 GB pesan per hari.'
      ],
      deep: [
        ['Koneksi dan routing', 'Client memegang satu WebSocket ke sebuah gateway. Session registry memetakan user → gateway. Untuk mengirim, message service mencari gateway milik penerima lalu meneruskan lewat pub/sub. Di ASP.NET Core, SignalR dengan Redis backplane mengimplementasikan pola ini.'],
        ['Tidak pernah kehilangan pesan', 'Simpan dulu pesannya sebelum memberi acknowledge ke pengirim. Client mengirim clientMsgId supaya retry bersifat idempotent. Penerima memberi acknowledge; pesan yang belum di-acknowledge dikirim ulang saat reconnect dengan sinkronisasi dari id pesan terakhir yang terlihat.'],
        ['Ordering', 'Berikan id yang selalu naik per percakapan di sisi server (bukan timestamp dari client). Urutan dijamin di dalam satu percakapan, dan hanya itu yang bisa dirasakan user.'],
        ['User offline dan group', 'Kalau penerima tidak punya session, simpan pesannya dan kirim push notification. Untuk group, fan out ke device tiap anggota; untuk group yang sangat besar, beralih ke pull.']
      ],
      follow: ['Bagaimana menampilkan presence (online / sedang mengetik) dengan murah?', 'Bagaimana cara kerja sinkronisasi multi-device?', 'Apa yang terjadi kalau sebuah server gateway crash?']
    },
    'flash-sale': {
      title: 'Checkout flash sale',
      prompt: 'Desain checkout untuk flash sale e-commerce: 1.000 unit sebuah barang, sejuta user mengklik Buy dalam menit yang sama. Tidak boleh oversell dan tidak boleh menagih dua kali.',
      req: [
        'Me-reserve stok, menerima pembayaran, membuat order; menampilkan “sold out” yang akurat.',
        'Non-functional: tidak pernah oversell, tidak pernah menagih dua kali, tetap responsif saat traffic melonjak 100×, adil bagi user.',
        'Di luar scope: browsing katalog, rekomendasi.'
      ],
      est: [
        '1 juta user di menit pertama ≈ 17.000 request/detik di edge, berbanding 1.000 unit: 99,9% request harus ditolak dengan murah.',
        'Database hanya perlu memproses write kira-kira sebanyak jumlah unit — kalau layer-layer di depannya membuang sisanya.'
      ],
      deep: [
        ['Tidak pernah oversell', 'Pengurangan stok harus atomic: UPDATE inventory SET available = available - 1 WHERE item_id = @itemId AND available > 0, lalu pastikan tepat satu baris yang terpengaruh. Demi kecepatan, muat stok ke Redis lebih dulu dan kurangi secara atomic di sana sebagai gerbang; hanya yang lolos yang lanjut ke database, yang tetap jadi source of truth.'],
        ['Membuang beban', 'Sajikan halamannya dari CDN, tempatkan user di waiting room atau queue, rate-limit per user, dan langsung tolak begitu counter menyentuh nol. Lindungi database supaya ia hanya melihat traffic yang sanggup ditanganinya.'],
        ['Reservation dan pembayaran', 'Pengurangan stok yang berhasil membuat reservation dengan expiry (misalnya 10 menit). Pembayaran berjalan asynchronous dari sebuah queue; kalau gagal atau timeout, reservation dilepas dan stok dikembalikan.'],
        ['Tidak pernah menagih dua kali', 'Client mengirim Idempotency-Key; unique constraint pada key itu membuat retry mengembalikan hasil yang pertama. Pakai outbox pattern supaya record order dan message “charge” ditulis dalam satu transaction.']
      ],
      follow: ['Bagaimana mencegah bot memborong semua stok?', 'Bagaimana kalau Redis dan database tidak sepakat soal stok?', 'Bagaimana mengetes ini sebelum sale yang sesungguhnya?']
    },
    'savings-ledger': {
      title: 'Ledger simpan pinjam',
      prompt: 'Desain ledger inti aplikasi koperasi simpan pinjam: anggota menabung, menarik, meminjam, dan membayar angsuran, dan setiap saldo harus benar persis — sampai rupiah terakhir, selamanya.',
      req: [
        'Setor, tarik, dan transfer antar-rekening milik seorang anggota; mencatat pencairan pinjaman dan pembayaran angsuran; menampilkan saldo dan riwayat mutasi.',
        'Job akhir bulan: bunga simpanan, denda keterlambatan, dan laporan yang cocok dengan rekening bank.',
        'Non-functional: uang tidak pernah tercipta atau hilang, setiap perubahan bisa diaudit, request yang di-retry tidak pernah diterapkan dua kali; ketepatan jauh lebih penting daripada throughput.',
        'Di luar scope: credit scoring, onboarding anggota (KYC).'
      ],
      est: [
        '200.000 anggota × 30 transaksi sebulan ≈ 6 juta transaksi sebulan ≈ 2–3 write/detik rata-rata, dengan puncak saat gajian mungkin 20× lebih tinggi — masih kecil untuk satu SQL Server.',
        'Double-entry berarti minimal dua entry per transaksi: sekitar 12 juta baris sebulan, kira-kira 150 juta setahun. Aman untuk satu tabel, asalkan mutasi tidak pernah men-scan seluruhnya.',
        'Bagian tersulitnya adalah ketepatan, concurrency, dan batch akhir bulan, bukan skala.'
      ],
      tiers: [['Aplikasi anggota', 'Web app teller'], ['API gateway'], ['Ledger service', 'Worker batch akhir bulan'], ['SQL Server (source of truth)', 'Outbox / queue', 'Notification service']],
      deep: [
        ['Double-entry, append-only', 'Setiap transaksi menulis entry yang jumlahnya nol: rekening simpanan anggota +100.000 dan rekening kas −100.000. Entry tidak pernah di-update atau dihapus; kesalahan diperbaiki dengan transaksi pembalik. Hasilnya jejak audit yang lengkap dan pengecekan yang bisa dijalankan kapan saja: total semua entry sama dengan nol.'],
        ['Saldo di bawah concurrency', 'Dua penarikan di saat yang sama tidak boleh sama-sama lolos cek saldo. Jadikan pengecekan dan perubahannya satu statement — UPDATE accounts SET balance = balance - @amount WHERE id = @id AND balance >= @amount — dan insert entry-nya di transaction yang sama; nol baris terpengaruh berarti saldo tidak cukup. Saldo yang disimpan hanyalah cache dari entry, jadi job malam menghitung ulang dan memberi alert kalau ada selisih.'],
        ['Tipe data uang dan pembulatan', 'Simpan nominal sebagai DECIMAL(19,4), atau rupiah utuh dalam BIGINT — jangan pernah float. Tentukan aturan pembulatan sekali, sesuai aturan koperasi, dan terapkan di satu tempat supaya batch, mutasi, dan laporan selalu sama.'],
        ['Retry dan batch akhir bulan', 'Idempotency key yang unik pada transaksi membuat request yang di-retry dari koneksi mobile yang putus-sambung mengembalikan hasil yang pertama. Batch bunga juga idempotent: satu transaksi per rekening per periode, dijaga unique key (account_id, period), jadi menjalankan ulang batch yang setengah jadi hanya mengisi yang belum ada. Notifikasi lewat outbox, jadi “setoran diterima” hanya dikirim untuk transaksi yang sudah di-commit.']
      ],
      follow: ['Teller memasukkan setoran yang sama dua kali. Bagaimana memperbaikinya?', 'Bagaimana mutasi tetap cepat setelah lima tahun entry?', 'Bagaimana merekonsiliasi ledger dengan rekening koran bank setiap hari?']
    }
  }
};
I18N.iv.behavioral = {
  ownership: {
    name: 'Ownership',
    looks: 'Kamu bertindak melampaui job description, menelusuri masalah sampai ke akarnya, dan bertahan sampai masalahnya benar-benar tuntas.',
    qs: ['Ceritakan saat kamu mengerjakan sesuatu di luar tanggung jawabmu.', 'Jelaskan sebuah masalah yang kamu sadari padahal tidak ada yang memintamu memperbaikinya.', 'Ceritakan sebuah project yang kamu pimpin dari awal sampai selesai.', 'Kapan kamu tetap menekuni sebuah masalah lama setelah orang lain beralih?']
  },
  conflict: {
    name: 'Konflik dan perbedaan pendapat',
    looks: 'Kamu tidak setuju dengan berbekal data, bukan emosi; mau mendengarkan; dan berkomitmen penuh setelah keputusan diambil — bahkan kalau keputusannya tidak berpihak padamu.',
    qs: ['Ceritakan saat kamu tidak sependapat dengan rekan tim atau manajer.', 'Jelaskan saat kamu harus menolak atau mempertanyakan sebuah requirement.', 'Ceritakan saat kamu menerima feedback yang tidak kamu setujui.', 'Kapan kamu berubah pikiran setelah sebuah perbedaan pendapat?']
  },
  failure: {
    name: 'Kegagalan dan pembelajaran',
    looks: 'Kegagalan nyata dengan konsekuensi nyata, diakui tanpa menyalahkan siapa pun, dan ada perubahan spesifik dalam cara kerjamu sejak itu.',
    qs: ['Ceritakan kesalahan profesional terbesarmu.', 'Jelaskan sebuah project yang tidak mencapai targetnya.', 'Ceritakan saat kamu melewatkan deadline.', 'Feedback kritis apa yang mengubah cara kerjamu?']
  },
  ambiguity: {
    name: 'Ambiguitas',
    looks: 'Kamu menciptakan kejelasan: menemukan pertanyaan yang tepat, menyatakan asumsi yang wajar secara eksplisit, mulai dari yang kecil, lalu menyesuaikan.',
    qs: ['Ceritakan saat kamu harus bekerja dengan requirement yang tidak jelas.', 'Jelaskan keputusan yang kamu ambil tanpa memiliki semua informasinya.', 'Ceritakan saat kamu memulai sesuatu di bidang yang benar-benar baru bagimu.', 'Kapan prioritas berubah mendadak, dan bagaimana responsmu?']
  },
  impact: {
    name: 'Impact dan hasil',
    looks: 'Hasil terukur yang berarti bagi user atau bisnis, dan garis yang jelas dari tindakanmu ke hasil itu.',
    qs: ['Pencapaian apa yang paling kamu banggakan?', 'Ceritakan saat kamu memperbaiki sebuah sistem atau proses secara signifikan.', 'Jelaskan masalah paling menantang secara teknis yang pernah kamu selesaikan.', 'Ceritakan saat kamu memberikan lebih dari yang diharapkan.']
  },
  leadership: {
    name: 'Leadership dan pengaruh',
    looks: 'Kamu menggerakkan orang tanpa otoritas: meyakinkan dengan bukti, menyelaraskan kepentingan yang berbeda, dan membuat orang lain lebih efektif.',
    qs: ['Ceritakan saat kamu memimpin tanpa menjadi pemimpin formalnya.', 'Jelaskan bagaimana kamu meyakinkan tim untuk memakai idemu.', 'Ceritakan pengalamanmu membimbing atau mengajari seseorang.', 'Kapan kamu menaikkan standar kualitas timmu?']
  },
  collaboration: {
    name: 'Kolaborasi',
    looks: 'Kamu bekerja lintas role dan tim, berkomunikasi sejak awal, dan menempatkan tujuan bersama di atas preferensi pribadimu.',
    qs: ['Ceritakan pengalaman bekerja dengan rekan yang sulit.', 'Jelaskan sebuah project yang bergantung pada tim lain.', 'Ceritakan saat kamu membantu rekan tim yang sedang kesulitan.', 'Bagaimana kamu menghadapi rekan tim yang tidak menyelesaikan bagiannya?']
  },
  customer: {
    name: 'Fokus pada customer dan prioritas',
    looks: 'Kamu berangkat dari masalah user, mengambil trade-off secara sadar di tengah keterbatasan, dan bisa menjelaskan apa yang sengaja tidak kamu kerjakan.',
    qs: ['Ceritakan saat pekerjaanmu terlalu banyak dan bagaimana kamu menentukan prioritas.', 'Jelaskan trade-off antara kualitas dan kecepatan yang pernah kamu ambil.', 'Ceritakan saat kamu memperjuangkan kepentingan user.', 'Kapan kamu menolak sebuah permintaan, dan kenapa?']
  }
};

// Urutan area dan pertanyaan harus sama dengan data/interview.js (penilaian disimpan berdasarkan posisi).
I18N.iv.rapid = [
  { qs: [
    ['Apa perbedaan value type dan reference type?', 'Value type menyimpan datanya langsung dan disalin saat assignment; reference type menyimpan reference ke object di heap, jadi assignment berbagi object yang sama. Sebutkan semantics-nya dulu sebelum lokasi memory, dan bahwa struct di dalam class tinggal di heap.'],
    ['Jelaskan async/await. Apa yang terjadi di sebuah await?', 'Kalau task yang di-await belum selesai, method-nya mengembalikan Task yang belum selesai ke pemanggilnya dan thread-nya kembali mengerjakan hal lain; saat operasinya selesai, sebuah continuation melanjutkan method itu. Kalau sudah selesai, method-nya langsung lanjut tanpa melepas thread. Ini meningkatkan scalability untuk pekerjaan I/O-bound; tidak membuat satu operasi jadi lebih cepat.'],
    ['IEnumerable vs IQueryable?', 'IEnumerable dieksekusi di memory dengan delegate. IQueryable membawa expression tree yang diterjemahkan sebuah provider (misalnya EF Core) ke bahasa lain, biasanya SQL. Memanggil ToList terlalu awal memindahkan evaluasi dari server ke client.'],
    ['Apa perbedaan interface dan abstract class?', 'Interface adalah kontrak yang bisa diimplementasikan banyak sekaligus oleh sebuah class; abstract class adalah implementasi parsial yang hanya bisa diwarisi satu, dan bisa menyimpan state serta constructor. Pilih interface untuk kapabilitas, abstract class untuk implementasi bersama.'],
    ['Bagaimana garbage collection bekerja di .NET?', 'Collector yang generational dan tracing: object baru di Gen 0, yang selamat dipromosikan ke Gen 1 lalu Gen 2; object besar masuk LOH. Kebanyakan object mati muda, jadi collection Gen 0 itu murah. Kurangi alokasi di hot path, jangan memanggil GC.Collect.'],
    ['Apa perbedaan record, class, dan struct?', 'Class: reference type dengan reference equality. Struct: value type, disalin. Record: class (atau record struct) dengan value-based equality dan with-expression. Positional record class mendapat property init-only; positional record struct bisa diubah kecuali dideklarasikan readonly record struct. Ideal untuk DTO dan message.']
  ] },
  { qs: [
    ['Jelaskan middleware pipeline.', 'Request masuk melewati middleware sesuai urutan pendaftaran, lalu response keluar dengan urutan terbalik. Tiap komponen boleh jalan sebelum dan sesudah memanggil next, atau memutus aliran lebih awal. Urutannya penting: exception handler dulu, baru routing, authentication, authorization, dan endpoint.'],
    ['Singleton, scoped, dan transient: apa itu captive dependency?', 'Singleton hidup selama aplikasi jalan, scoped per HTTP request, dan transient selalu baru setiap kali diminta. Captive dependency terjadi saat service dengan masa hidup lebih lama menahan service yang masa hidupnya lebih singkat, misalnya singleton memegang DbContext scoped, yang bikin datanya basi dan rawan race condition.'],
    ['Bagaimana mencegah masalah N+1 query di EF Core?', 'Gunakan Select untuk mengambil kolom yang memang dibutuhkan dalam satu query, atau Include untuk data relasinya dan hindari lazy loading di dalam loop. Cek langsung SQL yang tercetak di log.'],
    ['Authentication vs authorization, dan 401 vs 403?', 'Authentication memastikan siapa penggunanya, sedangkan authorization mengecek hak aksesnya. 401 artinya belum login dan 403 artinya sudah login tapi dilarang masuk. Cek juga kepemilikan datanya, bukan hanya role.'],
    ['Bagaimana menangani error di API biar konsisten?', 'Validasi input di awal lalu balas 400 pakai ProblemDetails. Kembalikan kode jelas seperti 404 atau 409 untuk gagal yang terduga, dan tangkap error tak terduga di satu global handler yang mencatat detail di log lalu membalas 500 generik.'],
    ['Bagaimana membuat endpoint aman saat di-retry?', 'Buat operasinya idempotent. GET, PUT, dan DELETE memang idempotent, sedangkan POST butuh idempotency key dengan unique constraint supaya request ulang mengembalikan hasil pertama.']
  ] },
  { qs: [
    ['INNER JOIN vs LEFT JOIN?', 'INNER cuma mengembalikan pasangan yang cocok. LEFT mengambil semua baris kiri dan mengisi kolom kanan yang kosong dengan NULL. Menaruh filter tabel kanan di WHERE mengubah LEFT JOIN balik menjadi inner join.'],
    ['Apa itu index dan apa biayanya?', 'Struktur B-tree terurut yang mengubah table scan menjadi seek cepat. Ongkosnya berupa tambahan ruang disk dan write yang lebih lambat. Composite index mengikuti aturan kolom paling kiri, dan covering index menghindari lookup ekstra.'],
    ['Jelaskan ACID.', 'Atomic (berhasil semua atau batal total), Consistent (constraint tetap terjaga), Isolated (transaksi paralel tak saling merusak), dan Durable (data yang ter-commit tahan crash).'],
    ['WHERE vs HAVING?', 'WHERE menyaring baris sebelum dikelompokkan, sedangkan HAVING menyaring hasil grup sesudah agregasi. Urutan eksekusinya adalah FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.'],
    ['Apa itu isolation level?', 'Read uncommitted, read committed, repeatable read, serializable, plus snapshot. Level lebih ketat mencegah anomali seperti dirty read atau phantom, walau antrean lock bertambah. Default SQL Server adalah read committed dengan shared lock kecuali READ_COMMITTED_SNAPSHOT menyala (bawaan Azure SQL) sehingga pembaca cukup membaca snapshot versi commit terakhir.'],
    ['Bagaimana menginvestigasi query yang lambat?', 'Ambil actual execution plan, bandingkan baris perkiraan vs aktual, cari scan, lookup, dan sort, cek filter apakah sudah sargable serta statistics masih segar, lalu ubah satu hal dan ukur ulang.'],
    ['Clustered vs nonclustered index di SQL Server?', 'Clustered index itu sendiri yang menyimpan isi tabel terurut menurut key, jadi satu tabel cuma punya satu (umumnya primary key). Nonclustered index adalah B-tree terpisah berisi kolom key beserta clustered key. Kolom ekstra butuh key lookup per baris kecuali ikut dimasukkan lewat INCLUDE.']
  ] },
  { qs: [
    ['interface vs type?', 'Keduanya menjelaskan bentuk data. Interface bisa di-extend dan digabung, sementara type alias juga bisa menulis union, tuple, serta mapped atau conditional type. Pilih satu gaya untuk bentuk object dan pakai type untuk sisanya.'],
    ['any vs unknown vs never?', 'any mematikan pengecekan tipe sama sekali. unknown menerima nilai apa pun, tapi harus dipersempit dulu sebelum dipakai. never adalah tipe kosong yang nilainya tak pernah ada, berguna untuk memastikan semua kasus sudah tertangani.'],
    ['Apa itu discriminated union dan kenapa dipakai?', 'Union dari beberapa tipe object yang punya satu field penanda literal yang sama. Mengecek penanda ini mempersempit tipenya otomatis, jadi kondisi invalid seperti data dan error muncul bersamaan tak bisa terjadi.'],
    ['Jelaskan generics dengan contoh.', 'Parameter tipe yang menjaga hubungan antara input dan output, misalnya function first<T>(items: T[]): T. Gunakan extends kalau isi fungsi butuh member tertentu.'],
    ['Apakah TypeScript mengecek tipe saat runtime?', 'Tidak. Semua tipe dihapus saat dikompilasi ke JavaScript. Data yang melintasi batas sistem seperti API, storage, atau input user tetap wajib divalidasi saat runtime, misalnya memakai library schema.'],
    ['Apa arti structural typing?', 'Kecocokan ditentukan oleh bentuk datanya, bukan nama tipenya. Object apa pun yang punya properti yang disyaratkan langsung diterima, berbeda dari C# yang umumnya memeriksa nama tipe.']
  ] },
  { qs: [
    ['Apa yang memicu re-render?', 'Komponen re-render saat state-nya berubah, parent-nya re-render, atau context yang dibacanya diperbarui. Re-render cuma berarti React memanggil ulang fungsinya. DOM hanya diubah di bagian output yang memang berbeda.'],
    ['Untuk apa useEffect, dan kapan sebaiknya tidak dipakai?', 'Sinkronisasi dengan sistem di luar React seperti jaringan, subscription, atau DOM. Jangan memakainya untuk menghitung nilai dari props atau state (hitung saat render) atau menanggapi aksi user (pakai event handler).'],
    ['Kenapa list butuh key?', 'Key memberi identitas stabil antar-render supaya React tahu elemen mana yang perlu diubah, dipindah, atau dihapus. Memakai index array sebagai key bikin masalah saat item diurutkan ulang, disisipi, atau dihapus.'],
    ['Controlled vs uncontrolled input?', 'Pada controlled input, state React memasok value dan menangani perubahan lewat onChange sebagai satu sumber data. Pada uncontrolled input, DOM menyimpan nilainya sendiri lalu kamu membacanya lewat ref atau form data.'],
    ['Kapan useMemo, useCallback, dan memo benar-benar membantu?', 'Saat profiling membuktikan render memang lambat atau child yang di-memo butuh props yang stabil. Memberi object atau fungsi baru tiap render langsung menggagalkan memo. Ukur dulu, karena memindah state ke komponen yang butuh sering lebih ampuh daripada memoization. Jika React Compiler aktif, proses build otomatis menambahkannya sehingga useMemo dan useCallback manual makin jarang perlu.'],
    ['Bagaimana mengelola state di aplikasi React yang besar?', 'Kelompokkan sesuai asalnya. Simpan server state di query cache, URL state di router, dan state UI lokal di komponen. Hanya client state yang benar-benar perlu dibagi ke banyak layar yang masuk ke context atau store.']
  ] },
  { qs: [
    ['Jelaskan specificity.', 'Saat rule bertabrakan, cascade mengecek origin dan !important, lalu inline style, cascade layer, skor specificity (id, class, element), lalu urutan baris. Satu id selalu menang melawan berapa pun class. Usahakan selector tetap rendah dan datar.'],
    ['Flexbox vs Grid?', 'Flexbox menata satu dimensi (baris atau kolom) mengikuti ukuran konten. Grid menata dua dimensi dengan baris dan kolom pasti. Pakai Grid untuk struktur halaman dan flexbox di dalam komponen.'],
    ['Apa yang dilakukan box-sizing: border-box?', 'Memasukkan padding dan border ke dalam width dan height, jadi elemen 300px tetap berukuran 300px meski ditambah padding berapa pun.'],
    ['Kenapa z-index: 9999 bisa muncul di belakang z-index: 2?', 'z-index cuma mengurutkan elemen di dalam stacking context yang sama. Leluhur dengan transform, opacity, filter, atau z-index sendiri menciptakan batas yang tak bisa ditembus elemen di bawahnya.'],
    ['Bagaimana cara men-center sebuah element?', 'Pasang display: grid dan place-items: center di parent, atau display: flex dengan justify-content dan align-items ke center. Untuk block berlebar tetap, margin-inline: auto menengahkan ke kiri-kanan.'],
    ['Kenapa memakai Tailwind, dan apa kekurangannya?', 'Menyusun UI jadi cepat, skala desain seragam, tak perlu pusing menamai class, dan output CSS kecil. Kekurangannya meliputi HTML tampak padat, ada kurva belajar, dan harus rajin memecah komponen agar class tak berulang. Dasar CSS tetap wajib dikuasai.']
  ] },
  { area: 'Fundamental web', qs: [
    ['Apa yang terjadi saat kamu mengetik URL lalu menekan Enter?', 'Browser mencari alamat lewat DNS, membuka koneksi dengan handshake TLS (TCP untuk HTTP/1.1 dan HTTP/2, QUIC di atas UDP untuk HTTP/3), lalu mengirim HTTP request. Setelah server membalas, browser mem-parsing HTML, mengunduh aset, menyusun DOM dan CSSOM, menghitung layout, menggambar layar, dan menjalankan script.'],
    ['Apa itu CORS?', 'CORS adalah aturan browser yang melarang halaman membaca response dari origin lain kecuali server mengirim header Access-Control-Allow-*. Fungsinya melindungi user, bukan pengaman API di server.'],
    ['Cookie vs token di localStorage untuk auth?', 'Cookie berflag HttpOnly, Secure, dan SameSite tidak bisa dibaca JavaScript sehingga lebih aman dari XSS, walau butuh proteksi CSRF. Token di localStorage praktis dipakai tapi langsung bocor kalau ada celah XSS.'],
    ['Jelaskan XSS dan CSRF.', 'XSS terjadi saat script asing ikut berjalan di halamanmu, dicegah lewat output escaping dan Content Security Policy. CSRF terjadi saat situs lain diam-diam mengirim request atas nama sesi login-mu, dicegah dengan cookie SameSite dan token anti-forgery.'],
    ['Apa yang membuat API disebut RESTful?', 'URL menunjuk resource, HTTP method jadi kata kerjanya, status code tepat sasaran, request tetap stateless, dan datanya berbentuk JSON atau format sejenis. Sifat idempotent pada GET, PUT, dan DELETE penting untuk retry dan caching.'],
    ['Bagaimana HTTP caching bekerja?', 'Cache-Control menentukan berapa lama response dianggap segar, sementara ETag atau Last-Modified dipakai mengecek ulang lewat status 304. Browser dan CDN bisa langsung memakai hasil cache tanpa membebani server asal.']
  ] },
  { qs: [
    ['StatelessWidget vs StatefulWidget?', 'Keduanya adalah konfigurasi immutable. StatelessWidget hanya memiliki build(). StatefulWidget membuat object State terpisah yang bertahan melewati rebuild untuk menyimpan data mutable; setState() menandainya dirty supaya build() berjalan ulang.'],
    ['Jelaskan widget tree, element tree, dan render object tree.', 'Widget adalah deskripsi immutable yang murah dibangun ulang. Element adalah instance tahan lama yang mencocokkan widget lama dengan baru berdasar type dan key serta menyimpan State. Render object menghitung layout dan menggambar layar hanya bila ada perubahan.'],
    ['Untuk apa key?', 'Key memberi tahu Flutter widget mana milik item yang mana saat sibling bertipe sama bertukar posisi, disisipkan, atau dihapus agar tiap State tetap menempel ke item yang tepat. Tanpa key, state dicocokkan berdasar posisi.'],
    ['Cubit vs Bloc, dan bagaimana perbandingannya dengan Provider dan Riverpod?', 'Cubit membuka method yang langsung memancarkan state, sedangkan Bloc memetakan event ke state sehingga riwayat aksinya mudah dilacak dan diolah walau kodenya lebih banyak. Provider memadukan dependency injection dengan ChangeNotifier yang mutable. Riverpod bekerja tanpa context dan dicek saat compile dengan dependensi yang lebih halus.'],
    ['Bagaimana layout bekerja di Flutter?', 'Constraint turun, size naik, parent menentukan posisi. Parent menurunkan ukuran minimum dan maksimum, child memilih ukuran dalam rentang itu, lalu parent menempatkannya. Error overflow dan unbounded height bersumber dari aturan ini.'],
    ['Bagaimana menjaga aplikasi Flutter tetap mulus?', 'Tiap frame punya jatah sekitar 16 ms di 60 Hz dan 8 ms di layar 120 Hz. Kurangi rebuild dengan widget const, state yang ditaruh sedekat mungkin ke widget pemakainya, dan selector. Bangun list panjang lewat builder lazy, pindahkan komputasi berat ke luar UI isolate dengan compute(), lalu ukur di profile mode memakai DevTools.']
  ] },
  { qs: [
    ['computed() vs linkedSignal() vs effect()?', 'computed() adalah state turunan read-only yang lazy dan tersimpan di cache. linkedSignal() membuat state writable yang otomatis reset saat signal sumber berubah tanpa memicu loop effect. Pakai effect() hanya untuk sinkronisasi ke sistem luar seperti localStorage, canvas, atau logging, jangan untuk menyalin antar-signal.'],
    ['Bagaimana cara kerja @Component({ imports }) di Angular modern?', 'Component bersifat standalone sejak awal tanpa perlu NgModule. Tiap component mendaftarkan directive, pipe, dan child component yang dipakai di template ke dalam imports, sehingga compiler membuang kode tak terpakai per component saat build.'],
    ['Apa perbedaan element provider dan environment injector?', 'Pencarian dependensi menelusuri ElementInjector pada host element leluhur lebih dulu, lalu lanjut ke EnvironmentInjector dari provider route sampai root. Menaruh service di @Component({ providers }) memberi satu instance per instance component, sedangkan @Service() berbagi satu singleton di root.'],
    ['Kapan memakai switchMap vs exhaustMap vs concatMap?', 'switchMap membatalkan inner observable yang sedang berjalan dan cuma mempertahankan yang terbaru, pas untuk kotak pencarian typeahead. exhaustMap mengabaikan pemicu baru selagi request masih jalan agar form tidak terkirim ganda. concatMap mengantrekan request berurutan untuk penulisan serial.'],
    ['Bagaimana change detection zoneless OnPush dengan Signal menentukan apa yang di-render ulang?', 'Signal hanya memberi tahu view template yang membacanya saat render. View parent dan sibling yang tidak terkait dilewati begitu saja tanpa Zone.js mencegat event atau menyapu dari root ke bawah.'],
    ['Bagaimana seharusnya client Angular menangani auth guard dan error server bersama ASP.NET Core?', 'Guard fungsional CanActivateFn dan CanMatchFn mengurus redirect UX lewat RedirectCommand, sementara API ASP.NET Core tetap wajib menegakkan policy otorisasi di tiap endpoint. Interceptor memasang token atau header XSRF di satu tempat lalu memetakan RFC 9457 ProblemDetails ke error per field.']
  ] },
  { qs: [
    ['Value receiver vs pointer receiver, dan kenapa jangan dicampur?', 'Value receiver menerima salinan struct, jadi perubahan tidak memengaruhi data pemanggil. Pointer receiver menerima alamatnya supaya perubahan tersimpan dan struct besar tidak disalin. Pakai satu jenis saja di satu struct, karena method *T tidak ikut terbawa pada value T dan pencampuran rawan data race.'],
    ['Bagaimana cara kerja header slice Go, dan apa jebakan aliasing pada append()?', 'Header slice menyimpan 3 word: pointer ke backing array, panjang (len), dan kapasitas (cap). Mengiris b := a[0:2] mempertahankan sisa kapasitas, sehingga append(b, x) menimpa a[2] tanpa menyalin array baru. Batasi kapasitas lewat a[0:2:2] atau salin dulu dengan slices.Clone.'],
    ['Unbuffered vs buffered channel, dan siapa yang boleh menutupnya?', 'Unbuffered channel membuat pengirim dan penerima saling menunggu sampai bertemu. Buffered channel menampung kiriman sampai batas cap sebelum memblokir pengirim. Selalu tutup channel dari sisi pengirim, sebab menulis ke channel tertutup memicu panic sedangkan penerima mengeceknya lewat v, ok := <-ch.'],
    ['Kenapa mengembalikan pointer typed nil sebagai error bisa membuat err != nil bernilai true?', 'Nilai interface berisi dua word: dynamic type dan pointer data. Mengembalikan typed nil seperti var e *MyError = nil mengisi word type dengan *MyError, jadi interface dihitung tidak nil meski pointernya nil. Kembalikan nil langsung tanpa tipe saat tidak ada error.'],
    ['Kenapa context.Context harus lewat parameter fungsi, bukan field struct?', 'Context mewakili pembatalan, batas waktu, dan data per request, bukan state objek jangka panjang. Mengirim ctx sebagai parameter pertama membuat setiap query atau call (*Context) di bawahnya ikut berhenti saat client putus. Untuk log audit setelah respons dikirim, pakai context.WithoutCancel (Go 1.21+).'],
    ['Bagaimana membuat service net/http Go aman saat trafik tinggi dan shutdown?', 'Pasang ReadHeaderTimeout, ReadTimeout, WriteTimeout, dan IdleTimeout di http.Server alih-alih memakai http.ListenAndServe biasa. Batasi jumlah worker dengan errgroup.SetLimit, dengarkan SIGINT atau SIGTERM lewat signal.NotifyContext, dan tunggu request aktif selesai dengan server.Shutdown(ctx).']
  ] }
];
