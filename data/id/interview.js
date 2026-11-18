// Bahasa Indonesia — konten persiapan interview. Kode, test case, dan solusi tetap memakai versi aslinya.
I18N.iv = {
  method: [
    ['Klarifikasi', 'Ulangi soalnya dengan kata-katamu sendiri. Tanyakan ukuran input, rentang nilai, duplikat, input kosong, dan apa yang dikembalikan kalau tidak ada jawaban.'],
    ['Contoh', 'Kerjakan satu contoh normal dan satu edge case dengan tangan, sambil bicara. Di sinilah kebanyakan salah paham muncul ke permukaan.'],
    ['Brute force', 'Sebutkan solusi yang paling jelas beserta complexity-nya dalam satu kalimat. Ini membuktikan kamu paham soalnya dan memberi baseline.'],
    ['Optimasi', 'Sebutkan bottleneck-nya, lalu pattern yang menghilangkannya (hash map, two pointers, sorting, heap…). Sepakati pendekatannya sebelum coding.'],
    ['Coding', 'Tulis kode yang rapi sambil menjelaskan. Nama yang bermakna, helper function kecil, dan jangan diam lebih dari satu menit.'],
    ['Test', 'Telusuri kodemu lewat contoh lalu edge case, baris per baris seperti reviewer. Perbaiki bug dengan tenang.'],
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
    ['Minggu 1: Fondasi', [
      'Selesaikan materi Pemula di CS Fundamentals, C#, dan SQL',
      'Kerjakan 7 soal coding yang easy, sambil menjelaskan dengan lantang',
      'Tulis résumé-mu dengan impact formula',
      'Daftar 10 pengalaman yang bisa dijadikan cerita'
    ]],
    ['Minggu 2: Pattern inti', [
      'Pelajari pattern hash map, two pointers, sliding window, dan stack',
      'Kerjakan 5 soal medium (masing-masing 30 menit, pakai timer)',
      'Selesaikan materi Pemula di ASP.NET Core, CSS, React, Angular, dan Flutter',
      'Tulis 3 cerita STAR di bank cerita'
    ]],
    ['Minggu 3: Tree, graph, dan search', [
      'Pelajari binary search, tree, graph, dan interval',
      'Kerjakan 5 soal medium lagi dan ulangi soal yang tadi butuh hint',
      'Selesaikan materi Menengah di C#, SQL, dan ASP.NET Core',
      'Mulai Capstone 2 sebagai app portofoliomu'
    ]],
    ['Minggu 4: DP, backtracking, dan dasar design', [
      'Pelajari backtracking dan dynamic programming',
      'Kerjakan soal yang tersisa, termasuk yang hard',
      'Pelajari framework system design dan building block-nya',
      'Mock coding interview pertama, dinilai dengan rubrik',
      'Selesaikan materi Menengah di CSS, React, Angular, dan Flutter'
    ]],
    ['Minggu 5: System design', [
      'Kerjakan keenam kasus design: coba dulu, baru bandingkan',
      'Presentasikan satu kasus 35 menit penuh sambil direkam',
      'Materi Mahir: async, transaction, index, auth',
      'Lengkapi bank cerita: semua tema terisi'
    ]],
    ['Minggu 6: Kedalaman full-stack', [
      'Tanya jawab kilat: nilai semua pertanyaan, ulangi yang masih goyah',
      'Selesaikan dan deploy Capstone 2, lalu mulai Capstone 3',
      'Mock system design interview',
      'Mock behavioral interview'
    ]],
    ['Minggu 7: Mock loop', [
      'Dua mock coding interview dengan timer',
      'Satu loop penuh dalam sehari: coding, design, behavioral, tanya jawab kilat',
      'Review setiap skor rubrik di bawah 3 dan latih area itu',
      'Latihan bersama orang lain minimal sekali'
    ]],
    ['Minggu 8: Melamar dan mengasah', [
      'Lamar ke banyak perusahaan, minta referral, dan jadwalkan latihan lebih dulu',
      'Kerjakan ulang 8 soal tanpa persiapan, masing-masing 20 menit',
      'Siapkan pertanyaan untuk tiap interviewer',
      'Setiap selesai interview sungguhan, catat semua pertanyaan yang diajukan'
    ]]
  ],
  hiring: [
    "**Yang diukur interviewer.** Loop big tech menilai empat hal: coding, system design (mid-level+), cerita behavioral, dan kedalaman stack. Tiap interviewer menulis penilaian rubrik terpisah.",
    "**Poin di résumé memakai impact formula.** Tulis pencapaian X, terukur oleh Y, lewat langkah Z. Contohnya, “Menurunkan latency p95 API checkout dari 900 ms ke 180 ms dengan covering index dan output caching.”",
    "**Belum punya nama perusahaan besar? Bangun bukti.** Capstone 3 dan 4 di program ini berkelas portofolio: di-deploy, dites, diukur. Sistem nyata dengan angka nyata mengalahkan daftar teknologi.",
    "**Referral melipatgandakan peluang lamaranmu direspons.** Hubungi engineer di perusahaan incaranmu dengan pesan singkat yang spesifik dan link ke karyamu. Berkontribusilah ke project open source yang mereka pakai.",
    "**Level.** Junior: menyelesaikan masalah yang sudah terdefinisi dengan kode yang rapi. Mid: memegang fitur dari ujung ke ujung dan mendesain komponen. Senior: memegang sistem, menangani ambiguitas, dan membuat orang lain jadi lebih baik. Arahkan cerita dan kedalaman design-mu ke level yang kamu lamar.",
    "**Atur urutan interview-mu.** Jadwalkan perusahaan yang kurang kamu incar lebih dulu sebagai latihan, dan kumpulkan final round berdekatan supaya offer-nya datang bersamaan.",
    "**Bukti lebih bernilai daripada jabatan.** Aplikasi live, metrik nyata, tulisan teknis, atau open source mudah diverifikasi. Nama perusahaan besar mengantar ke panggilan pertama, tapi karya nyata meloloskanmu.",
    "**Format tim remote dan lokal berbeda.** Banyak perusahaan mengganti soal algoritma dengan take-home atau pairing praktis. Prosesnya biasa ditutup sesi HR dan lead.",
    "**Tugas take-home dinilai layaknya pull request.** Baca brief dua kali, tanya lebih awal bila ragu, dan patuhi batas waktunya. README cara run, catatan trade-off, test penting, dan commit rapi bernilai setara dengan fiturnya.",
    "**Siapkan ekspektasi gajimu sebelum bertemu HR.** Untuk kerja remote lintas negara, tanyakan status kontrak, mata uang transfer, dan urusan pajaknya. Status kontraktor biasanya menuntut kamu mengurus lapor pajak sendiri."
  ],
  ui: [
    ['Autocomplete search box', 'Ambil saran saat user mengetik, tampilkan daftarnya, dan dukung klik maupun keyboard.', 'Debounce request, abaikan atau batalkan respons basi, dan dukung panah/Enter/Escape. Sediakan state loading, kosong, dan error dengan role combobox aksesibel.'],
    ['Modal dialog', 'Modal reusable yang dibuka lewat tombol, berisi judul, konten, dan tombol tutup.', 'Kurung fokus di dalam, tutup lewat Escape atau klik luar, lalu kembalikan fokus ke pemicunya. Kunci scroll halaman dan pakai `<dialog>` atau ARIA yang tepat.'],
    ['Data table', 'Tampilkan baris dari API dengan kolom urut, pagination, dan input filter.', 'Simpan state seperlunya sambil sinkronkan urut dan halaman ke URL. Pasang key stabil, state loading/kosong, dan hindari fetch tiap ketukan.'],
    ['Todo list dengan filter', 'Tambah, toggle, ubah, dan hapus item, filter all/active/done, lalu simpan saat reload.', 'Ubah state tanpa mutasi, turunkan daftar filter, pakai controlled input dan handler bersih yang ramah keyboard.'],
    ['Star rating', 'Komponen rating lima bintang yang bisa dipakai di dalam form.', 'Dukung mode controlled dan uncontrolled, pratinjau hover, navigasi panah, semantik radio group, serta props bertipe.'],
    ['Infinite scroll feed', 'Muat halaman baru saat user mendekati ujung bawah daftar.', 'Pakai IntersectionObserver pengganti scroll listener, pagination cursor, cegah request ganda, dan bahas virtualisasi list panjang.'],
    ['Angular: pencarian live & tabel dengan filter', 'Component Angular pemuat produk dari API dengan filter URL bebas race pencarian.', 'Pakai `httpResource` atau `toObservable` + `debounceTime` + `switchMap`, `withComponentInputBinding()`, dan `computed()`. Render pakai `@for (...; track p.id)`, `@empty`, plus `@defer` atau live region.'],
    ['Angular: form checkout multi-langkah (Signal Forms)', 'Form pengiriman/tagihan dengan diskon bersyarat, cek promo async, dan mapping ProblemDetails.', 'Pakai Signal Forms (`form()`, `[formField]`, `applyWhen()`, `submit()`) lalu cek `field().touched()` dan `errors()`. Cegah double submit lewat `exhaustMap` dan tampilkan `ProblemDetails.errors` dengan `aria-describedby` dan `role="alert"`.'],
    ['Flutter: daftar produk dengan pencarian', 'Layar pemuat produk API yang menyaring saat diketik plus mendukung pull-to-refresh.', 'Siapkan state loading, kosong, dan error dengan search debounced di cubit atau bloc. Bangun list pakai `ListView.builder` ber-key tanpa memulai kerja di `build`.'],
    ['Flutter: cart dengan tombol quantity', 'Layar cart dengan tombol tambah-kurang tiap baris, total berjalan, dan swipe hapus.', 'Jaga state immutable lewat `copyWith`, batasi rebuild pakai `BlocSelector` atau widget kecil. Pasang key di baris swipe, matikan minus di nol, dan beri label tombol ikon.']
  ],
  patterns: {
    hashing: { signal: 'Kamu perlu tahu “apakah ini sudah pernah muncul?” atau perlu menghitung sesuatu, dan nested loop akan jadi O(n²).', cost: 'Time O(n), space O(n)' },
    'two-pointers': { signal: 'Input-nya terurut (atau bisa diurutkan), atau kamu membandingkan elemen dari kedua ujung sambil bergerak ke tengah.', cost: 'Time O(n), space O(1)' },
    'sliding-window': { signal: 'Soalnya menanyakan subarray atau substring berurutan yang terpanjang / terpendek / terbaik.', cost: 'Time O(n) karena tiap elemen masuk dan keluar window sekali' },
    stack: { signal: 'Pasangan yang harus cocok, undo, atau “elemen berikutnya yang lebih besar / lebih kecil” untuk tiap posisi.', cost: 'Time O(n), space O(n)' },
    'binary-search': { signal: 'Data terurut, atau pertanyaan ya/tidak yang jawabannya berubah tepat satu kali seiring sebuah nilai membesar (“search on the answer”).', cost: 'Time O(log n)' },
    'linked-list': { signal: 'Reversal, mencari titik tengah, cek cycle, dan merge list lewat penyambungan pointer dengan space O(1).', cost: 'Time O(n), space O(1)' },
    trees: { signal: 'Data hierarkis. Pakai rekursi DFS untuk kedalaman dan path, atau queue BFS untuk level dan rute terpendek.', cost: 'Time O(n), dengan space O(height) DFS atau O(width) BFS' },
    heap: { signal: '“K terbesar”, “K tersering muncul”, “terkecil berikutnya” berulang-ulang, atau menggabung stream terurut.', cost: 'Time O(n log k), space O(k)' },
    graphs: { signal: 'Koneksi, grid, dependency, “apakah bisa sampai”, “ada berapa kelompok”, “dengan urutan apa”.', cost: 'Time O(V + E)' },
    intervals: { signal: 'Range yang bisa bertumpang-tindih: meeting, booking, merge. Hampir selalu: sort berdasarkan start lebih dulu.', cost: 'Time O(n log n) untuk sort-nya' },
    backtracking: { signal: '“Semua kombinasi / permutasi / subset”, atau puzzle yang diselesaikan dengan mencoba pilihan lalu membatalkannya.', cost: 'Eksponensial, O(2ⁿ) atau O(n!), yang memang wajar di sini' },
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
    complexity: 'Time O(n · k log k) untuk n kata berpanjang k, dan space O(n · k).',
    follow: ['Bagaimana menghindari sorting tiap kata? (Hitungan 26 slot sebagai key: O(n · k).)', 'Bagaimana kalau kata-katanya tidak muat di memory?']
  },
  'top-k-frequent': {
    prompt: 'Kembalikan k nilai yang paling sering muncul di array, dengan urutan apa pun. Jawabannya dijamin unik.',
    hints: ['Hitung dulu. Setelah itu kamu butuh k hitungan terbesar.', 'Frekuensi tak pernah melebihi n, jadi jumlahnya bisa dipakai mengindeks array bucket.'],
    complexity: 'Time dan space O(n) dengan bucket sort. Min-heap berukuran k memberi O(n log k).',
    follow: ['Kapan solusi heap lebih baik daripada bucket? (Data streaming, atau k jauh lebih kecil dari n.)', 'Bagaimana cara kerjanya kalau dijalankan di banyak mesin?']
  },
  'valid-palindrome': {
    prompt: 'Kembalikan true kalau string-nya terbaca sama dari depan maupun dari belakang, dengan hanya memperhitungkan huruf dan angka serta mengabaikan besar-kecil huruf.',
    hints: ['Bandingkan karakter dari kedua ujung sambil bergerak ke tengah.', 'Majukan pointer setiap kali ia berada di karakter yang bukan huruf atau angka.'],
    complexity: 'Time O(n) dan space O(1) tanpa menyalin string baru.',
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
    hints: ['Jaga sebuah window [left, right] yang tidak pernah berisi duplikat.', 'Simpan indeks terakhir tiap karakter, lalu lompatkan left melewati pengulangan di window.'],
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
    hints: ['Kurung yang paling terakhir dibuka harus jadi yang pertama ditutup.', 'Masukkan kurung buka ke stack, lalu pastikan tiap kurung tutup cocok dengan elemen teratas.'],
    complexity: 'Time O(n), space O(n).',
    follow: ['Kembalikan index karakter pertama yang tidak valid.', 'Jumlah minimum penghapusan supaya jadi valid.']
  },
  'daily-temperatures': {
    prompt: 'Untuk tiap hari, kembalikan berapa hari kamu harus menunggu sampai suhunya lebih hangat, atau 0 kalau tidak pernah.',
    hints: ['Hari yang belum menemukan hari yang lebih hangat sedang “menunggu”. Hari menunggu mana yang selesai lebih dulu?', 'Simpan stack indeks dengan suhu menurun agar hari hangat langsung mem-pop suhu lebih dingin.'],
    complexity: 'Time O(n) karena tiap indeks masuk dan keluar maksimal sekali, dengan space O(n).',
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
    follow: ['Kerjakan lewat rekursi. Berapa pemakaian space-nya?', 'Balik hanya node di antara posisi m dan n.']
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
    prompt: 'Sebuah grid berisi "1" (daratan) dan "0" (air), dengan pulau sebagai daratan terhubung mendatar atau tegak. Hitung jumlah pulaunya.',
    hints: ['Setiap kali menemukan daratan yang belum dikunjungi, kamu menemukan satu pulau baru.', 'Dari sel itu, lakukan flood fill (DFS atau BFS) untuk menandai seluruh pulau sebagai sudah dikunjungi.'],
    complexity: 'Time O(rows × cols), dan space O(rows × cols) terburuk untuk rekursi.',
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
    follow: ['Boleh melangkah 1, 2, atau 3 anak tangga.', 'Setiap anak tangga punya biaya, jadi cari jalur termurah sampai puncak.']
  },
  'coin-change': {
    prompt: 'Diberikan pecahan koin (persediaan tiap pecahan tidak terbatas) dan sebuah amount, kembalikan jumlah koin paling sedikit untuk mencapai amount itu, atau -1 kalau mustahil.',
    hints: ['Greedy (koin terbesar dulu) gagal: coba koin [1,3,4] dan amount 6.', 'Misalkan dp[a] adalah jumlah koin paling sedikit untuk amount a. dp[a] = 1 + min(dp[a − coin]) untuk semua koin.'],
    complexity: 'Time O(amount × coins), space O(amount).',
    follow: ['Hitung jumlah kombinasinya, bukan jumlah minimumnya.', 'Kembalikan koin mana saja yang dipakai.']
  },
  subsets: {
    prompt: 'Diberikan array berisi integer unik, kembalikan semua subset yang mungkin (power set), dengan urutan apa pun.',
    hints: ['Untuk tiap angka ada dua pilihan: diikutkan atau tidak.', 'Rekursi memakai start index dan simpan salinan path saat ini di setiap cabang.'],
    complexity: 'Time dan space O(n · 2ⁿ) untuk menyalin seluruh 2ⁿ subset.',
    follow: ['Bagaimana jika input mengandung duplikat dan output harus unik?', 'Hanya subset berukuran k.']
  },
  'lru-cache': {
    prompt: 'Rancang cache berkapasitas tetap dengan get(key) (kembali nilai atau -1) dan put(key, value) dalam O(1). Buang key paling lama menganggur saat penuh, lalu tandai key yang diakses sebagai terbaru.',
    hints: ['Gabungkan hash map untuk lookup O(1) dengan struktur terurut guna memindah ke posisi terbaru dalam O(1).', 'Jawaban klasiknya hash map plus doubly linked list. Di JavaScript, Map sudah mengingat urutan insert: hapus lalu sisipkan ulang untuk menyegarkan sebuah key.'],
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
    ['Estimasi', '5 menit', 'User, request per detik, rasio read:write, dan storage tahunan. Bulatkan angka untuk melihat beban paling dominan.'],
    ['API dan data model', '5 menit', 'Endpoint utama beserta input dan output-nya. Entity inti, key-nya, dan store mana yang cocok untuk masing-masing.'],
    ['High-level design', '10 menit', 'Gambar kotak-kotaknya: client, load balancer, service, database, cache, queue. Telusuri satu request dari ujung ke ujung.'],
    ['Deep dive', '15 menit', 'Dalami dua bagian paling sulit, biasanya hot path dan data store. Di sinilah level seniormu tampak.'],
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
      prompt: 'Desain pemendek URL yang mengubah URL panjang jadi kode singkat lalu mengarahkan pengunjung pada sistem dominan baca.',
      req: [
        'Membuat link pendek dari URL panjang dengan dukungan custom alias dan masa berlaku.',
        'Me-redirect link pendek ke URL aslinya dengan latency sangat rendah.',
        'Non-functional: redirect yang highly available, link tidak pernah bentrok, analytics klik sederhana.',
        'Di luar scope: akun user, preview link.'
      ],
      est: [
        '100 juta link/bulan berarti ~40 write/detik. Rasio baca 100:1 menghasilkan rata-rata ~4.000 redirect/detik dan jauh lebih tinggi saat peak.',
        '500 byte per record × 1,2 miliar link per tahun ≈ 600 GB per tahun.',
        'Kode base-62 sepanjang 7 karakter memberi 62⁷ ≈ 3,5 triliun kombinasi.'
      ],
      deep: [
        ['Menghasilkan kode', 'Meng-hash URL berisiko collision dan butuh check-and-retry. Counter yang di-encode ke base 62 menjamin keunikan: beri tiap server rentang ID yang sudah dialokasikan lebih dulu supaya tidak ada bottleneck terpusat. Tambahkan unsur acak atau enkripsi pada counter kalau kodenya tidak boleh bisa ditebak.'],
        ['Redirect yang cepat', 'Cek cache sebelum database dan isi saat miss karena link populer mendominasi traffic. Pakai 302 bila perlu menghitung klik, atau 301 agar browser langsung cache redirect-nya.'],
        ['Analytics tanpa memperlambat redirect', 'Kirim event klik ke queue, langsung balas user, lalu hitung statistiknya di background.'],
        ['Storage', 'Akses cuma butuh lookup satu key, jadi key-value atau wide-column store terpartisi kode mudah di-scale horizontal. Relational database tetap memadai untuk skala kecil.']
      ],
      follow: ['Bagaimana menangani link yang tiba-tiba viral?', 'Bagaimana link yang sudah expired dihapus?', 'Bagaimana mencegah penyalahgunaan untuk phishing?']
    },
    'rate-limiter': {
      prompt: 'Desain rate limiter yang melindungi API dari terlalu banyak request per client, dan tetap bekerja dengan benar di banyak server.',
      req: [
        'Batasi request tiap client key (user, API key, atau IP) per rentang waktu dengan aturan berbeda per endpoint.',
        'Menolak request yang berlebih dengan 429 dan header Retry-After.',
        'Non-functional: hanya menambah beberapa milidetik, bekerja di semua server API, gagal dengan aman.',
        'Di luar scope: perlindungan DDoS di network layer.'
      ],
      est: [
        'Bila API melayani 10.000 request/detik, limiter memproses 10.000 operasi kecil read-modify-write per detik.',
        'State per client sangat kecil (satu counter dan satu timestamp), jadi 10 juta client aktif muat di beberapa GB memory.'
      ],
      deep: [
        ['Memilih algoritma', 'Fixed window rentan lonjakan ganda di batas waktu, sedangkan sliding log boros memori. Sliding counter hemat mendekatinya, sementara token bucket jadi standar umum karena meredam burst.'],
        ['Correctness di banyak server', 'Simpan counter di store terpusat. Langkah read-then-write lintas server rawan race, jadi gabung cek dan kurang memakai Lua script atau atomic increment ber-TTL di Redis.'],
        ['Latency dan kegagalan', 'Tempatkan store sedekat mungkin dengan API server. Tentukan sikap saat limiter tumbang: fail open demi kelancaran layanan, atau fail closed di endpoint sensitif seperti login.'],
        ['Skala', 'Shard counter memakai client key. Untuk traffic sangat padat, izinkan server menahan stok token lokal lalu sinkron berkala demi mengejar kecepatan.']
      ],
      follow: ['Bagaimana rate limit berdasarkan cost, bukan jumlah request?', 'Bagaimana client mengetahui sisa kuotanya?', 'Bagaimana membatasi penyerang terdistribusi yang memakai banyak IP?']
    },
    'news-feed': {
      title: 'News feed media sosial',
      prompt: 'Desain home feed sebuah aplikasi sosial: user mem-follow user lain dan melihat post terbaru mereka, dari yang terbaru atau yang paling relevan.',
      req: [
        'Membuat post, follow atau unfollow akun lain, serta memuat home feed bertahap.',
        'Non-functional: feed terbuka di bawah 200 ms, ketersediaan tinggi, dan delay sinkron beberapa detik masih aman.',
        'Di luar scope: detail model ranking, iklan, direct message.'
      ],
      est: [
        '200 juta user harian × 5 buka feed menghasilkan ~12.000 read/detik, sedangkan 20 juta post harian sekitar ~230 write/detik.',
        'Read mendominasi sekitar 50:1, jadi optimasi read path-nya.',
        'Rata-rata user mem-follow 200 akun, namun selebritas bisa diikuti 50 juta follower.'
      ],
      deep: [
        ['Fan-out on write vs on read', 'Fan-out on write mendorong id post ke cache follower agar baca cepat, tapi post selebritas memicu jutaan write. Pull on read menggabungnya saat request. Pakai hybrid: push akun biasa, pull akun selebritas.'],
        ['Feed cache', 'Simpan hanya ~500 id post per user lalu muat isinya dari post cache. User pasif tidak perlu disiapkan feed di depan karena bisa disusun saat ia login lagi.'],
        ['Pagination', 'Pakai cursor (keyset) pagination pada (created_at, id). Offset pagination menampilkan duplikat dan celah saat post baru terus berdatangan.'],
        ['Media', 'Upload media langsung ke object storage lewat pre-signed URL dan sajikan via CDN agar API mengurus metadata saja.']
      ],
      follow: ['Bagaimana unfollow atau post yang dihapus dikeluarkan dari feed?', 'Bagaimana ranking berdasarkan relevansi mengubah desainnya?', 'Apa yang terjadi kalau fan-out queue tertinggal?']
    },
    chat: {
      prompt: 'Desain service messaging dengan chat satu lawan satu dan group kecil, pengiriman real time ke user yang online, dan history untuk user yang offline.',
      req: [
        'Kirim dan terima chat seketika, grup beranggota ratusan orang, riwayat pesan, dan status delivered/read.',
        'Non-functional: pengiriman di bawah 500 ms, pesan tidak pernah hilang, berurutan di dalam satu percakapan.',
        'Di luar scope: voice dan video, detail end-to-end encryption.'
      ],
      est: [
        '50 juta user harian, masing-masing 40 pesan ≈ 2 miliar pesan per hari ≈ 23.000 pesan/detik rata-rata.',
        '10 juta koneksi bersamaan dengan kapasitas ~100.000 per mesin membutuhkan sekitar 100 gateway server.',
        '2 miliar × 200 byte ≈ 400 GB pesan per hari.'
      ],
      deep: [
        ['Koneksi dan routing', 'Client memegang satu WebSocket ke sebuah gateway. Session registry memetakan user → gateway. Untuk mengirim, message service mencari gateway milik penerima lalu meneruskan lewat pub/sub. Di ASP.NET Core, SignalR dengan Redis backplane mengimplementasikan pola ini.'],
        ['Tidak pernah kehilangan pesan', 'Simpan pesan lebih dulu sebelum mengirim ack, lalu sertakan clientMsgId agar retry tak menggandakan data. Pesan yang belum di-ack akan dikirim ulang saat reconnect berpatokan id terakhir.'],
        ['Ordering', 'Berikan id yang selalu naik per percakapan di sisi server (bukan timestamp dari client). Urutan dijamin di dalam satu percakapan, dan hanya itu yang bisa dirasakan user.'],
        ['User offline dan group', 'Jika penerima sedang offline, simpan pesan dan kirim push notification. Sebarkan chat grup ke tiap device anggota, lalu ubah ke mode pull untuk grup super besar.']
      ],
      follow: ['Bagaimana menampilkan presence (online / sedang mengetik) dengan murah?', 'Bagaimana cara kerja sinkronisasi multi-device?', 'Apa yang terjadi kalau sebuah server gateway crash?']
    },
    'flash-sale': {
      title: 'Checkout flash sale',
      prompt: 'Desain checkout untuk flash sale e-commerce: 1.000 unit sebuah barang, sejuta user mengklik Buy dalam menit yang sama. Tidak boleh oversell dan tidak boleh menagih dua kali.',
      req: [
        'Menahan stok, memproses bayar, mencatat order, dan menampilkan status habis dengan tepat.',
        'Non-functional: tidak pernah oversell, tidak pernah menagih dua kali, tetap responsif saat traffic melonjak 100×, adil bagi user.',
        'Di luar scope: browsing katalog, rekomendasi.'
      ],
      est: [
        '1 juta user di menit pertama ≈ 17.000 request/detik di edge, berbanding 1.000 unit: 99,9% request harus ditolak dengan murah.',
        'Database cukup memproses penulisan sebanyak jumlah barang asalkan layer terdepan menyaring sisanya.'
      ],
      deep: [
        ['Tidak pernah oversell', 'Jalankan UPDATE inventory SET available = available - 1 WHERE item_id = @itemId AND available > 0 dan pastikan tepat satu baris berubah. Saring antrean lewat decrement atomic di Redis dulu agar cuma pembeli sah yang masuk database.'],
        ['Membuang beban', 'Sajikan halamannya dari CDN, tempatkan user di waiting room atau queue, rate-limit per user, dan langsung tolak begitu counter menyentuh nol. Lindungi database supaya ia hanya melihat traffic yang sanggup ditanganinya.'],
        ['Reservation dan pembayaran', 'Stok terkunci selama 10 menit sementara pembayaran diproses lewat queue latar belakang. Kalau bayar gagal atau habis waktu, kunci dilepas agar stok kembali tersedia.'],
        ['Tidak pernah menagih dua kali', 'Client mengirim Idempotency-Key dengan unique constraint supaya retry membalas hasil pertama. Pakai outbox pattern untuk menulis order dan pesan tagihan dalam satu transaction.']
      ],
      follow: ['Bagaimana mencegah bot memborong semua stok?', 'Bagaimana kalau Redis dan database tidak sepakat soal stok?', 'Bagaimana mengetes ini sebelum sale yang sesungguhnya?']
    },
    'savings-ledger': {
      title: 'Ledger simpan pinjam',
      prompt: 'Desain ledger inti koperasi simpan pinjam untuk setor, tarik, pinjaman, dan angsuran. Semua saldo harus presisi hingga rupiah terakhir tanpa selisih.',
      req: [
        'Mencatat setor, tarik, transfer antar-rekening, pencairan pinjaman, angsuran, saldo, serta riwayat mutasi.',
        'Job akhir bulan: bunga simpanan, denda keterlambatan, dan laporan yang cocok dengan rekening bank.',
        'Non-functional: uang tak pernah hilang, semua jejak dapat diaudit, dan retry dilarang memproses dua kali. Akurasi jauh di atas kecepatan mentah.',
        'Di luar scope: credit scoring, onboarding anggota (KYC).'
      ],
      est: [
        '200.000 anggota × 30 transaksi/bulan memberi ~6 juta write/bulan (~2–3 write/detik). Bahkan lonjakan 20× saat gajian tetap enteng bagi satu SQL Server.',
        'Double-entry berarti minimal dua entry per transaksi: sekitar 12 juta baris sebulan, kira-kira 150 juta setahun. Aman untuk satu tabel, asalkan mutasi tidak pernah men-scan seluruhnya.',
        'Bagian tersulitnya adalah ketepatan, concurrency, dan batch akhir bulan, bukan skala.'
      ],
      tiers: [['Aplikasi anggota', 'Web app teller'], ['API gateway'], ['Ledger service', 'Worker batch akhir bulan'], ['SQL Server (source of truth)', 'Outbox / queue', 'Notification service']],
      deep: [
        ['Double-entry, append-only', 'Tiap transaksi menulis entri berpasangan (+100.000 tabungan, −100.000 kas) yang selalu impas nol. Perbaiki kesalahan lewat jurnal balik ketimbang mengedit data lama agar total mutasi tetap nol.'],
        ['Saldo di bawah concurrency', 'Gabung cek dan debit dalam satu query UPDATE accounts SET balance = balance - @amount WHERE id = @id AND balance >= @amount. Anggap saldo kurang bila 0 baris terubah, lalu catat jurnal di transaction yang sama dan audit tiap malam.'],
        ['Tipe data uang dan pembulatan', 'Simpan uang memakai DECIMAL(19,4) atau rupiah utuh di BIGINT, jangan pernah float. Tetapkan satu aturan pembulatan tunggal supaya batch, mutasi, dan laporan selalu sinkron.'],
        ['Retry dan batch akhir bulan', 'Unique idempotency key memastikan retry koneksi mobile mengembalikan hasil pertama. Batch bunga berjalan per rekening dan periode berkunci unik (account_id, period) agar rerun mengisi sisanya saja. Kirim notifikasi via outbox setelah transaction commit.']
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
    looks: 'Kamu berargumen memakai data bukan ego, mau mendengar, lalu ikut mendukung keputusan final meski usulmu kalah.',
    qs: ['Ceritakan saat kamu tidak sependapat dengan rekan tim atau manajer.', 'Jelaskan saat kamu harus menolak atau mempertanyakan sebuah requirement.', 'Ceritakan saat kamu menerima feedback yang tidak kamu setujui.', 'Kapan kamu berubah pikiran setelah sebuah perbedaan pendapat?']
  },
  failure: {
    name: 'Kegagalan dan pembelajaran',
    looks: 'Kegagalan nyata dengan konsekuensi nyata, diakui tanpa menyalahkan siapa pun, dan ada perubahan spesifik dalam cara kerjamu sejak itu.',
    qs: ['Ceritakan kesalahan profesional terbesarmu.', 'Jelaskan sebuah project yang tidak mencapai targetnya.', 'Ceritakan saat kamu melewatkan deadline.', 'Feedback kritis apa yang mengubah cara kerjamu?']
  },
  ambiguity: {
    name: 'Ambiguitas',
    looks: 'Kamu merapikan situasi kabur dengan mengajukan pertanyaan tepat, menyebut asumsi terus terang, dan mulai dari langkah kecil.',
    qs: ['Ceritakan saat kamu harus bekerja dengan requirement yang tidak jelas.', 'Jelaskan keputusan yang kamu ambil tanpa memiliki semua informasinya.', 'Ceritakan saat kamu memulai sesuatu di bidang yang benar-benar baru bagimu.', 'Kapan prioritas berubah mendadak, dan bagaimana responsmu?']
  },
  impact: {
    name: 'Impact dan hasil',
    looks: 'Hasil terukur yang berarti bagi user atau bisnis, dan garis yang jelas dari tindakanmu ke hasil itu.',
    qs: ['Pencapaian apa yang paling kamu banggakan?', 'Ceritakan saat kamu memberi peningkatan besar pada sistem atau proses kerja.', 'Jelaskan masalah teknis tersulit yang pernah kamu pecahkan.', 'Ceritakan saat kamu memberikan lebih dari yang diharapkan.']
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
    looks: 'Kamu berangkat dari kebutuhan user, sadar memilih trade-off di tengah keterbatasan, dan jelas memaparkan bagian yang ditunda.',
    qs: ['Ceritakan saat pekerjaanmu terlalu banyak dan bagaimana kamu menentukan prioritas.', 'Jelaskan trade-off antara kualitas dan kecepatan yang pernah kamu ambil.', 'Ceritakan saat kamu memperjuangkan kepentingan user.', 'Kapan kamu menolak sebuah permintaan, dan kenapa?']
  }
};

// Urutan area dan pertanyaan harus sama dengan data/interview.js (penilaian disimpan berdasarkan posisi).
I18N.iv.rapid = [
  { qs: [
    ['Apa perbedaan value type dan reference type?', 'Value type menyimpan nilainya langsung lalu disalin saat di-assign, sedangkan reference type memegang alamat object di heap jadi variabel berbagi instance yang sama. Dahulukan arti salin vs berbagi sebelum membahas stack dan heap, serta ingat field struct di dalam class ikut berada di heap.'],
    ['Jelaskan async/await. Apa yang terjadi di sebuah await?', 'Kalau task yang di-await belum rampung, method mengembalikan Task belum selesai dan melepas thread ke pool hingga continuation melanjutkannya. Kalau sudah selesai, eksekusi lanjut tanpa menjeda thread. Pola async meningkatkan kapasitas saat menunggu I/O, bukan mempercepat satu panggilan tunggal.'],
    ['IEnumerable vs IQueryable?', 'IEnumerable menjalankan delegate di memori atas object C#. IQueryable membawa expression tree agar provider seperti EF Core bisa menerjemahkannya menjadi query SQL. Memanggil ToList terlalu cepat menarik penyaringan dari database ke memori aplikasi.'],
    ['Apa perbedaan interface dan abstract class?', 'Satu class bisa memakai banyak interface (kontrak kemampuan), tapi hanya boleh mewarisi satu abstract class (implementasi dasar bersama, state, dan constructor). Gunakan interface untuk kapabilitas dan abstract class untuk logika induk bersama.'],
    ['Bagaimana garbage collection bekerja di .NET?', '.NET memakai GC bertingkat. Object sementara cepat beres di Gen 0, yang awet naik ke Gen 1–2, dan buffer 85 KB+ masuk LOH. Pangkas alokasi di jalur panas ketimbang memanggil GC.Collect.'],
    ['Apa perbedaan record, class, dan struct?', 'Class adalah reference type yang dibandingkan lewat referensi. Struct adalah value type yang disalin. Record (class maupun struct) memberi perbandingan berdasar isi nilai dan salinan with, pas untuk DTO immutable maupun pesan data.']
  ] },
  { qs: [
    ['Jelaskan middleware pipeline.', 'Request masuk melewati middleware sesuai urutan pendaftaran, lalu response keluar dengan urutan terbalik. Tiap komponen boleh jalan sebelum dan sesudah memanggil next, atau memutus aliran lebih awal. Urutannya penting: exception handler dulu, baru routing, authentication, authorization, dan endpoint.'],
    ['Singleton, scoped, dan transient: apa itu captive dependency?', 'Singleton hidup sepanjang aplikasi, scoped per HTTP request, dan transient baru tiap diminta. Captive dependency muncul saat service jangka panjang (seperti singleton) menahan DbContext scoped, memicu data basi dan race.'],
    ['Bagaimana mencegah masalah N+1 query di EF Core?', 'Gunakan Select untuk mengambil kolom yang memang dibutuhkan dalam satu query, atau Include untuk data relasinya dan hindari lazy loading di dalam loop. Cek langsung SQL yang tercetak di log.'],
    ['Authentication vs authorization, dan 401 vs 403?', 'Authentication memastikan siapa penggunanya, sedangkan authorization mengecek hak aksesnya. 401 artinya belum login dan 403 artinya sudah login tapi dilarang masuk. Cek juga kepemilikan datanya, bukan hanya role.'],
    ['Bagaimana menangani error di API biar konsisten?', 'Validasi input di awal lalu balas 400 pakai ProblemDetails. Balas 404 atau 409 untuk gagal terduga, lalu tangkap error tak terduga di satu global handler untuk mencatat log dan mengirim 500 generik.'],
    ['Bagaimana membuat endpoint aman saat di-retry?', 'Buat operasinya idempotent. GET, PUT, dan DELETE memang idempotent, sedangkan POST butuh idempotency key dengan unique constraint supaya request ulang mengembalikan hasil pertama.']
  ] },
  { qs: [
    ['INNER JOIN vs LEFT JOIN?', 'INNER cuma mengembalikan pasangan yang cocok. LEFT mengambil semua baris kiri dan mengisi kolom kanan yang kosong dengan NULL. Menaruh filter tabel kanan di WHERE mengubah LEFT JOIN balik menjadi inner join.'],
    ['Apa itu index dan apa biayanya?', 'Struktur B-tree terurut yang mengubah table scan menjadi seek cepat. Ongkosnya berupa tambahan ruang disk dan write yang lebih lambat. Composite index mengikuti aturan kolom paling kiri, dan covering index menghindari lookup ekstra.'],
    ['Jelaskan ACID.', 'Atomic (berhasil semua atau batal total), Consistent (constraint tetap terjaga), Isolated (transaksi paralel tak saling merusak), dan Durable (data yang ter-commit tahan crash).'],
    ['WHERE vs HAVING?', 'WHERE menyaring baris sebelum dikelompokkan, sedangkan HAVING menyaring hasil grup sesudah agregasi. Urutan eksekusinya adalah FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.'],
    ['Apa itu isolation level?', 'Read uncommitted, read committed, repeatable read, serializable, plus snapshot. Level lebih ketat mencegah anomali seperti dirty read atau phantom, walau antrean lock bertambah. Default SQL Server adalah read committed dengan shared lock kecuali READ_COMMITTED_SNAPSHOT menyala (bawaan Azure SQL) sehingga pembaca cukup membaca snapshot versi commit terakhir.'],
    ['Bagaimana menginvestigasi query yang lambat?', 'Buka actual execution plan lalu bandingkan perkiraan dan baris asli. Cek scan, lookup, filter non-sargable, dan kesegaran statistics sebelum mengubah satu hal lalu ukur lagi.'],
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
    ['StatelessWidget vs StatefulWidget?', 'Keduanya konfigurasi immutable. StatelessWidget cuma punya build(), sedangkan StatefulWidget menjaga object State awet lintas rebuild dan menandainya lewat setState().'],
    ['Jelaskan widget tree, element tree, dan render object tree.', 'Widget adalah deskripsi immutable yang murah dibangun ulang. Element adalah instance tahan lama yang mencocokkan widget lama dengan baru berdasar type dan key serta menyimpan State. Render object menghitung layout dan menggambar layar hanya bila ada perubahan.'],
    ['Untuk apa key?', 'Key membantu Flutter mengenali sibling bertipe sama saat urutan berubah, ditambah, atau dihapus agar State menempel ke item tepat. Tanpa key, state dicocokkan berdasar posisi.'],
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
    ['Bagaimana membuat service net/http Go aman saat trafik tinggi dan shutdown?', 'Pasang ReadHeaderTimeout, ReadTimeout, WriteTimeout, dan IdleTimeout di http.Server bukan lewat http.ListenAndServe polos. Batasi worker dengan errgroup.SetLimit, tangkap SIGINT atau SIGTERM lewat signal.NotifyContext, lalu tunggu request selesai lewat server.Shutdown(ctx).']
  ] }
];
