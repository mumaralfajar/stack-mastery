// Bahasa Indonesia — track CS Fundamentals. Contoh kode tetap memakai versi aslinya.
export const trackId = {
  id: 'cs',
  tagline: 'Fondasinya: Git, complexity, data structure, dan algoritma di balik coding interview serta keputusan performa sehari-hari.',
  lessons: {
  git: {
    terms: [
      ['Staging area (`git add`)', 'Menampung perubahan persis yang mau masuk ke commit berikutnya, terpisah dari file yang masih diedit di working directory.'],
      ['Branch & merge PR', 'Penunjuk terisolasi supaya fitur dikerjakan terpisah sebelum direview dan digabung ke `main`.'],
      ['`.gitignore`', 'Mencegah rahasia API, `node_modules/`, `bin/`, dan `.env` tanpa sengaja ikut naik ke Git.']
    ],
    title: 'Git dan alur kerja developer',
    why: "Tim developer pakai Git setiap hari. Git jadi tombol undo sekaligus alat kerja bareng, dan riwayat commit publik sering jadi bukti kerja nyata pertama yang bikin developer baru dipercaya.",
    points: [
      "**Repository** menyimpan folder proyek beserta seluruh riwayatnya. **Commit** adalah snapshot yang disertai catatan singkat soal alasan perubahannya.",
      "Ada tiga area kerja: **working directory** (file di disk), **staging area** (`git add` memilih isi commit berikutnya), dan **history** (`git commit`).",
      "**Branch** adalah penunjuk yang mengarah ke sebuah commit. Buat satu branch per fitur supaya `main` tetap aman dijalankan: `git switch -c feature/cart`.",
      "**Remote** (GitHub, GitLab) adalah salinan bersama. `git push` mengirim commit ke server, sementara `git pull` mengambil commit orang lain.",
      "Dalam tim, push branch-mu lalu buka **pull request** supaya direview rekan sebelum di-merge di GitHub. Kalau kerja sendirian tanpa server hosting, `git merge feature/cart` di branch `main` langsung menggabungkannya di laptop.",
      "**Conflict** cuma berarti ada dua editan di baris yang sama dan Git memintamu memilih salah satu.",
      "Buat commit kecil dan sering dengan pesan bergaya perintah, seperti 'Add stock check to checkout'. Jauhkan file build dan secret dengan `.gitignore`."
    ],
    practice: "Masukkan proyek latihanmu ke Git dengan `git init -b main` dan `.gitignore`. Buat tiga commit kecil dengan pesan yang jelas. Lalu bikin satu branch baru, ubah baris yang sama di kedua branch, merge ke `main` di mesinmu, dan bereskan conflict-nya sendiri. Terakhir, push ke repo GitHub baru dan ulangi alurnya lewat pull request.",
    teach: "Jelaskan bedanya working directory, staging area, dan commit, lalu kenapa branch bikin kerja tim lebih aman.",
    analogy: "Git itu seperti sistem save game buat kode. Commit adalah checkpoint dengan catatan soal apa yang baru kamu bereskan. Branch itu slot save kedua tempat kamu bebas mencoba hal nekat. Kalau berhasil tinggal di-merge, dan kalau gagal save utamamu aman.",
    pitfalls: [
      "Satu commit raksasa bernama 'changes' di akhir hari. Tidak ada yang kuat me-review, dan kamu tidak bisa membatalkan sebagian saja.",
      "Mengira merge conflict itu error. Itu sebenarnya pertanyaan: dari dua perubahan ini, mana yang kamu pilih?",
      "Terlanjur meng-commit password atau connection string. Menghapusnya di commit berikutnya tidak menghilangkan dari history, jadi anggap sudah bocor: ganti password atau cabut key-nya, baru hapus.",
      "Menjalankan `git init` polos lalu branch-nya ternyata bernama `master`, bikin tutorial yang memakai `main` macet. Pakai `git init -b main`, atau ubah namanya lewat `git branch -m main`."
    ],
    quiz: [
      ["Apa yang dilakukan `git add`?", ["Membuat commit", "Memasukkan perubahan ke staging untuk commit berikutnya", "Meng-upload ke remote", "Mulai melacak seluruh repository"], "Perintah ini memindahkan perubahan ke staging area, lalu `git commit` yang mencatatnya."],
      ["Kenapa bekerja di feature branch, bukan langsung di `main`?", ["Commit di branch tidak mungkin conflict", "Pekerjaan yang belum selesai tetap terisolasi, dan `main` tetap jalan serta bisa di-review", "Branch otomatis di-backup ke GitHub", "Hanya branch yang bisa di-push"], "Branch mengisolasi pekerjaan sampai selesai direview dan siap di-merge. Branch tetap bisa conflict, dan belum ada yang naik sebelum kamu push."],
      ["Kamu push commit berisi API key, lalu menghapus key itu di commit berikutnya. Lalu apa?", ["Tidak perlu apa-apa, sudah hilang", "Cabut atau ganti key-nya karena masih ada di history", "Jalankan `git revert` pada commit pertama", "Jadikan repository-nya private lagi"], "Setiap clone menyimpan commit lama itu. Begitu secret sudah ter-push, anggap sudah ada yang menyalinnya."]
    ]
  },
  bigo: {
    terms: [
      ['Kompleksitas waktu (`O(n)`, `O(log n)`)', 'Mengukur seberapa cepat jumlah langkah bertambah terhadap ukuran input `n`, bukan sekadar hitungan milidetik di satu laptop.'],
      ['Jebakan loop bersarang `O(n²)`', 'Menyisir seluruh array untuk tiap item membengkak kuadratis (`1.000` item jadi `1.000.000` langkah). `HashSet` memangkasnya ke `O(n)`.'],
      ['Trade-off memori vs waktu', 'Membayar RAM ekstra `O(n)` untuk hash table atau tabel memo demi mengubah kerja `O(n²)` atau `O(2ⁿ)` menjadi waktu linear cepat.']
    ],
    title: 'Big-O: bagaimana kode berkembang',
    predict: {
      prompt: '`BinarySearch` menemukan sebuah nilai di antara 1.000.000 item terurut dalam sekitar 20 langkah. Kira-kira berapa langkah yang dibutuhkan setelah array membesar menjadi 2.000.000 item?',
      options: ['Sekitar `40`: data dua kali lipat, kerja dua kali lipat', 'Sekitar `21`: menggandakan `n` hanya menambah satu langkah pembagian dua', 'Sekitar `400`: binary search bernilai `O(n²)` pada kasus terburuk'],
      answer: 1,
      explain: 'Binary search bernilai `O(log n)`: setiap perbandingan membelah dua rentang yang tersisa. `log₂(1,000,000)` sekitar `20` dan `log₂(2,000,000)` sekitar `21`, jadi menggandakan input hanya menambah satu langkah. Bandingkan dengan `HasDuplicateSlow` yang `O(n²)`: menggandakan `n` di sana membuat perbandingan kira-kira empat kali lipat.'
    },
    why: "Interview hampir selalu menanyakan time dan space complexity jawabanmu. Di dunia kerja, Big-O membantumu menebak apakah kode yang lancar untuk 100 baris bakal bertahan saat datanya naik ke 10 juta baris.",
    points: [
      "Big-O melihat bagaimana **jumlah langkah tumbuh** saat ukuran input n membesar. Konstanta dan suku kecil dibuang, jadi 3n + 10 cukup ditulis O(n).",
      "Kelas yang sering ketemu dari tercepat ke terlambat: **O(1)** konstan, **O(log n)** logaritmik, **O(n)** linear, **O(n log n)**, **O(n²)** kuadratik, dan **O(2ⁿ)** eksponensial.",
      "Patokan praktis: satu loop menyusuri input itu O(n), dan loop di dalam loop itu O(n²). Membelah masalah tiap langkah memberi O(log n), sedangkan sorting memakan O(n log n).",
      "**Space complexity** menghitung memory tambahan dengan cara yang sama. Banyak optimasi menukar memory dengan waktu, misalnya hash set mengubah cek duplikat O(n²) menjadi O(n).",
      "Kecuali diminta lain, analisis **worst case**-nya. 'Amortized O(1)' artinya sesekali agak mahal tapi rata-ratanya murah, seperti `List.Add`.",
      "Di n = 1.000.000: O(log n) butuh sekitar 20 langkah, O(n) sejuta langkah, dan O(n²) tembus satu triliun."
    ],
    practice: "Pakai visualisasinya untuk membandingkan tiap kelas di n = 1.000 dan n = 1.000.000. Lalu ukur waktu `HasDuplicateSlow` dan `HasDuplicateFast` dengan `Stopwatch` pada 10.000, 20.000, dan 40.000 item. Jalankan tiap ukuran dua kali dan catat hasil kedua supaya bebas dari warm-up JIT. Saat n digandakan, apa yang terjadi ke durasinya?",
    teach: "Jelaskan arti O(n) dan O(n²) memakai contoh sehari-hari ke orang yang belum pernah melihat notasinya.",
    analogy: "Bayangkan mencari nama di buku telepon. Membaca halaman satu per satu itu O(n), sementara membuka bagian tengah lalu terus membelah dua itu O(log n). Menyuruh semua orang di ruangan bersalaman satu sama lain buat cari tanggal lahir yang sama itu O(n²): masih masuk akal untuk 10 orang, mustahil untuk satu stadion.",
    pitfalls: [
      "Menghitung jumlah baris kode, bukan pertumbuhan kerjanya. Satu baris memanggil `list.Contains` di dalam loop tetap berbiaya O(n²).",
      "Lupa biaya tersembunyi seperti sorting, concatenation `string` di dalam loop, dan `Insert(0, x)` pada list.",
      "Menyebutkan time complexity tapi lupa space-nya."
    ],
    quiz: [
      ["Berapa complexity dari loop atas n item yang setiap kali memanggil `list.Contains(x)` pada list berisi n item?", ["O(n)", "O(n log n)", "O(n²)", "O(1), karena `Contains` itu bawaan"], "`Contains` pada list itu sendiri O(n), dan ia dijalankan n kali. Fungsi bawaan bukan berarti gratis."],
      ["Binary search pada 1.000.000 item yang sudah terurut butuh sekitar berapa langkah?", ["20", "1.000", "500.000", "1.000.000"], "log₂(1.000.000) ≈ 20 karena setiap langkah membuang separuh sisanya."],
      ["5n² + 3n + 100 disederhanakan menjadi…", ["O(n)", "O(5n²)", "O(n²)", "O(n² + n)"], "Buang konstanta dan suku kecil. Suku n² yang paling menentukan saat n membesar."]
    ]
  },
  numbers: {
    terms: [
      ['Binary float IEEE-754 (`double`)', 'Menyimpan pecahan basis 2 dengan cepat untuk grafis dan fisika, jadi angka desimal seperti `0.1` berulang terus lalu terbulatkan tipis.'],
      ['Integer overflow', 'Melewati batas maks `int` 32-bit (`~2,14 miliar`) langsung berputar balik tanpa error kecuali dicek atau dipindah ke `long` / `Int64`.'],
      ['Unit kode UTF-8 vs klaster grafem', 'Emoji seperti `"👍🏽"` memakan banyak byte UTF-8 dan unit `char` UTF-16. Hitung karakter utuh dengan `StringInfo` / `Intl.Segmenter`.']
    ],
    predict: {
      prompt: 'Di C# (`double`), JavaScript (`number`), atau Dart (`double`), apa hasil evaluasi `0.1 + 0.2 === 0.3`?',
      options: ['`true` (`0.3` persis)', '`false` (bernilai `0.30000000000000004` di binary IEEE-754)', 'Muncul peringatan overflow'],
      explain: '`1/10` dan `1/5` tidak pernah habis di pecahan basis 2 (`0.000110011...`), jadi binary floating point membulatkan kedua angkanya sedikit. Pakai `decimal` atau sen bulat untuk uang.'
    },
    title: "Angka dan teks: biner, floating point, dan Unicode",
    why: "Uang yang selisih satu sen, nama tampil sebagai 'Ã©', atau id rusak sesudah 2,1 miliar berasal dari cara komputer menyimpan angka dan teks. Masalah yang sama muncul di tiap track: `DECIMAL` di SQL, `decimal` di C#, `NVARCHAR`, dan satu-satunya type angka JavaScript.",
    points: [
      "Semuanya disimpan dalam **biner**. `int` 32-bit menampung sekitar ±2,1 miliar, sementara `long` 64-bit menampung ±9,2 × 10¹⁸. Lewat dari batasnya nilainya **overflow**: di C# nilainya memutar balik tanpa error kecuali jalan di dalam blok `checked`.",
      "`double` (dan semua `number` JavaScript) memakai **floating point** biner. Kebanyakan pecahan desimal seperti 0,1 tidak punya bentuk biner yang pas, makanya `0.1 + 0.2` menjadi `0.30000000000000004`.",
      "Untuk uang, pakai type desimal yang presisi: `decimal` di C#, `DECIMAL(19,4)` di SQL Server, atau simpan dalam rupiah atau sen bulat pakai integer. Jangan bandingkan hasil float memakai `==`, melainkan pakai batas toleransi kecil.",
      "JavaScript cuma punya satu type angka, dan integer-nya hanya akurat sampai 2⁵³ − 1 (`Number.MAX_SAFE_INTEGER`). Id database 64-bit di atas batas itu kehilangan digit di browser, jadi kirim id besar sebagai string atau pakai `BigInt`.",
      "Teks adalah deretan **code point Unicode** yang diubah ke byte. **UTF-8**, default di web, memakai 1 sampai 4 byte per karakter, sedangkan string di C#, JavaScript, dan Java memakai **UTF-16** yang butuh dua unit 16-bit untuk satu emoji.",
      "Jadi 'panjang' tergantung apa yang dihitung: `\"👍\".Length` bernilai 2 di C# dan JavaScript padahal mata melihat satu huruf. Teks rusak seperti 'Ã©' artinya byte ditulis memakai satu encoding lalu dibaca dengan encoding lain.",
      "Di SQL Server, `NVARCHAR` menyimpan Unicode. `VARCHAR` cuma menyimpan satu code page kecuali kolomnya ber-collation UTF-8, jadi nama dalam aksara lain bisa berubah jadi '?'."
    ],
    practice: "Di console browser, jalankan `0.1 + 0.2`, `9007199254740993`, dan `\"👍\".length`, lalu jelaskan tiap hasilnya. Kemudian di C#, jumlahkan harga order berisi 1.000 baris memakai `double` lalu `decimal`, dan cetak selisihnya. Terakhir di SQL Server, insert `N'Đặng Thị Hà'` ke kolom `VARCHAR(50)` dan `NVARCHAR(50)`, lalu bandingkan output-nya.",
    teach: "Jelaskan kenapa `0.1 + 0.2` tidak persis `0.3`, dan type apa yang pas untuk saldo rekening.",
    analogy: "Tulis 1/3 dalam desimal: 0,3333… tidak pernah habis, jadi sepanjang apa pun digitnya tetap sedikit meleset. Biner punya masalah yang persis sama dengan 1/10. Type desimal menghitung per sepuluh dan per seratus seperti kasir menghitung koin, jadi 0,10 tetap utuh 0,10.",
    pitfalls: [
      "Menyimpan uang di `double`, `float`, atau `REAL` / `FLOAT` SQL. Tiap selisihnya kecil, tapi menumpuk setelah ribuan baris.",
      "Mengirim id 64-bit ke JavaScript sebagai angka. Lewat 2⁵³, digit paling belakang berubah tanpa peringatan.",
      "Memotong string berdasarkan jumlah `char` yang kaku karena bisa membelah emoji jadi dua.",
      "Mendeklarasikan kolom nama dengan `VARCHAR` lalu kaget muncul '?' untuk huruf di luar code page."
    ],
    quiz: [
      ["Kenapa `0.1 + 0.2 == 0.3` bernilai false untuk `double` di C#?", ["Compiler membulatkan sisi kanannya", "0,1 dan 0,2 tidak punya bentuk biner yang persis, jadi jumlahnya sedikit meleset", "`==` membandingkan reference untuk double", "Double hanya menyimpan dua angka di belakang koma"], "Floating point biner menyimpan pecahan terdekat, membuat jumlahnya 0.30000000000000004. Pakai `decimal` untuk nominal eksak."],
      ["Type mana yang cocok untuk saldo rekening di SQL Server?", ["`FLOAT`", "`REAL`", "`DECIMAL(19,4)`", "`NVARCHAR(20)`"], "`DECIMAL` eksak di basis 10. `FLOAT` dan `REAL` memakai biner, sedangkan teks tidak bisa dijumlahkan sebagai angka."],
      ["`\"👍\".Length` bernilai 2 di C#. Kenapa?", ["String C# memakai UTF-16, dan emoji ini butuh dua unit 16 bit", "Windows menyimpan setiap emoji sebagai dua karakter", "`Length` menghitung byte dalam UTF-8", "Itu bug di .NET"], "Karakter di luar 65.536 code point pertama butuh surrogate pair di UTF-16. Pakai `EnumerateRunes()` untuk menghitung code point."]
    ]
  },
  structures: {
    terms: [
      ['Array vs Linked List', 'Array tersimpan rapat berdampingan di RAM (cache CPU kencang + index `O(1)`), sedangkan linked list mengejar pointer terpencar (`O(n)` scan).'],
      ['Hash table (`Dictionary` / `Map`)', 'Memetakan key ke slot bucket array untuk pencarian rata-rata `O(1)`, andalan di mayoritas optimasi soal interview.'],
      ['Stack (LIFO) vs Queue (FIFO)', 'Stack melayani undo dan rekursi DFS, sementara Queue menjaga urutan kedatangan untuk BFS dan worker antrean tugas.']
    ],
    title: 'Array, hash table, stack, queue, dan linked list',
    why: "Memilih data structure yang pas sering kali sudah menyelesaikan separuh soal. `Dictionary` dipakai buat cache, queue di balik background job, dan stack di balik tombol undo. Beberapa pola yang sama terus muncul di aplikasi nyata maupun interview.",
    points: [
      "**Array / List** menempati memory yang berdampingan. Akses lewat index itu O(1) dan append rata-rata O(1), tapi menyisipkan di tengah atau mencari butuh O(n).",
      "**Hash table** (`Dictionary`, `HashSet`) memetakan tiap key ke bucket lewat hash function. Lookup, insert, dan delete O(1) **rata-rata**, tanpa urutan.",
      "Hash table sangat bergantung pada key-nya. Kalau banyak key jatuh ke bucket yang sama, lookup melambat menuju O(n), dan key yang berubah setelah disimpan tak akan ketemu lagi.",
      "**Stack** memakai aturan masuk terakhir keluar lebih dulu, jadi tambah dan ambil terjadi di satu ujung. Dipakai untuk undo, pencocokan kurung, DFS, dan call stack.",
      "**Queue** bekerja masuk pertama keluar pertama: tambah di belakang dan ambil dari depan, cocok untuk antrean tugas dan BFS.",
      "**Linked list** merangkai node lewat pointer. Insert atau hapus di node yang sudah dipegang cuma O(1), tapi mencari node itu makan O(n) dan cache locality-nya buruk. Soal interview memakai class node bikinan sendiri dengan pointer `Next`, bukan `LinkedList<T>` bawaan .NET.",
      "Tanyakan tiga hal: operasi apa yang dibutuhkan, seberapa sering jalan, dan datanya sebesar apa? Jawabannya langsung menunjuk structure yang tepat."
    ],
    practice: "Kerjakan tiga soal interview sambil menyebutkan structure-nya sebelum mulai ngoding: 'Pair with target sum' (hash map), 'Valid brackets' (stack), dan 'Reverse a linked list' (pointer memakai `ListNode`). Untuk tiap soal, jelaskan kenapa cara yang paling gampang terpikir lebih lambat.",
    teach: "Jelaskan kenapa mencari key di hash table itu O(1) rata-rata, sedangkan mencari di list itu O(n).",
    analogy: "List itu deretan loker bernomor: cepat kalau tahu nomornya, tapi harus buka satu per satu kalau cuma tahu isinya. Hash table itu tempat penitipan jaket yang nomor tiketnya langsung dihitung dari namamu, jadi petugas tinggal menuju gantungan yang benar.",
    pitfalls: [
      "Memakai list padahal yang dibutuhkan set atau dictionary, lalu mencarinya di dalam loop.",
      "Menganggap dictionary menjaga urutan masuk atau urutan terurut. Pakai `SortedDictionary` atau urutkan kalau butuh urutan.",
      "Memilih linked list demi 'insert cepat', padahal mencari posisinya tetap O(n).",
      "Kehilangan sisa linked list karena menimpa `Next` sebelum menyimpannya. Gambar dulu kotak dan panahnya."
    ],
    quiz: [
      ["Structure mana yang memberi lookup O(1) rata-rata berdasarkan key?", ["`List<T>` yang dijaga terurut", "`LinkedList<T>`", "Hash table", "`Queue<T>`"], "Hash dari key langsung menunjuk bucket-nya. List terurut memberi O(log n) lewat binary search."],
      ["Structure mana yang cocok untuk 'batalkan aksi terakhir'?", ["Queue", "Stack", "Dictionary", "List terurut"], "Undo itu masuk terakhir, keluar pertama."],
      ["Berapa biaya `list.Insert(0, x)` pada List berisi n item?", ["O(1)", "O(log n)", "O(n)", "Amortized O(1), seperti `Add`"], "Setiap elemen yang sudah ada harus digeser satu posisi. Hanya append di ujung yang amortized O(1)."]
    ]
  },
  sorting: {
    terms: [
      ['Base case & stack frame', 'Setiap fungsi rekursif wajib punya kondisi berhenti, atau stack frame menumpuk sampai `StackOverflowException` menjatuhkan program.'],
      ['Divide-and-conquer (`O(n log n)`)', 'Merge sort dan Quick sort terus membelah input (`log n` level × kerja `n` per level), bukan menukar tetangga `O(n²)`.'],
      ['Stable sort', 'Mempertahankan urutan asli di antara item yang nilainya seri (`sort` di C#/JS `.toSorted()` berdasar `key`).']
    ],
    title: 'Recursion dan sorting',
    why: "Recursion adalah cara berpikir di balik tree, graph, backtracking, dan DP. Sorting sering jadi langkah pertama dalam soal algoritma, dan memahami kenapa biayanya O(n log n) menjadi bekal menganalisis banyak algoritma lain.",
    points: [
      "Function recursive menyelesaikan masalah dengan memecahkan **versi lebih kecil dari masalah yang sama**. Ia butuh **base case** untuk berhenti dan langkah yang makin mendekatinya.",
      "Setiap pemanggilan mendapat frame sendiri di call stack. Recursion yang terlalu dalam bikin stack overflow, meski recursion apa pun bisa ditulis ulang memakai stack.",
      "Merge sort memakai pola **divide and conquer**: pecah input jadi dua, urutkan tiap bagian, lalu gabungkan sehingga waktunya selalu O(n log n).",
      "Bubble dan insertion sort itu O(n²): sederhana dan cukup untuk input kecil atau hampir urut. Quick sort rata-rata O(n log n), dan O(n²) di worst case.",
      "Umumnya comparison sort tidak bisa lebih cepat dari O(n log n). Sort yang **stable** menjaga item bernilai sama tetap di urutan aslinya, seperti `OrderBy` di LINQ, tidak seperti `Array.Sort` dan `List.Sort`.",
      "Di kode proyek, pakai fungsi bawaan. Di interview, coba bilang 'sort dulu', lalu manfaatkan urutannya dengan two pointers atau binary search."
    ],
    practice: "Jalankan semua algoritma di visualisasi sorting dan catat jumlah perbandingannya. Lalu tulis fungsi rekursif `Sum(object[] items)` untuk list bersarang seperti `[1, new object[] { 2, new object[] { 3, 4 } }, 5]` (hasilnya 15), memakai `item is int n` dan `item is object[] inner`. Gambar call stack-nya di kertas.",
    teach: "Jelaskan recursion memakai merge sort: apa base case-nya, apa masalah yang lebih kecil, dan bagaimana hasilnya digabungkan?",
    analogy: "Bayangkan mengurutkan setumpuk kartu dengan merge sort. Bagi dua tumpukannya dan suruh dua teman melakukan instruksi yang sama, lalu saat kembali gabungkan kartu dengan terus mengambil yang teratas lebih kecil. Sampai tersisa satu kartu yang sudah pasti urut sebagai base case.",
    pitfalls: [
      "Base case tidak ada atau tidak pernah tersentuh: recursion berputar selamanya dan memicu `StackOverflowException` yang tidak bisa di-catch.",
      "Overflow saat menghitung rekursif. Pakai `int`, `Factorial(13)` diam-diam memberi hasil salah. Pakai `long` (muat sampai 20!) atau blok `checked` supaya langsung error.",
      "Mengurutkan berdasarkan satu key lalu key lain dengan `Array.Sort` dan berharap urutan sebelumnya bertahan. Pakai `OrderBy(...).ThenBy(...)`.",
      "Menulis sort sendiri di proyek produksi ketimbang memakai library."
    ],
    quiz: [
      ["Dua hal apa yang wajib dimiliki setiap function recursive?", ["Loop dan counter", "Base case dan langkah menuju base case itu", "Memo dan return value", "Dua pemanggilan recursive"], "Tanpa base case ia berputar terus, dan tanpa langkah mendekat ia tak akan pernah sampai ke base case."],
      ["Berapa time complexity merge sort?", ["O(n)", "O(n log n)", "O(n²) di worst case", "O(log n)"], "Ada log n level pemecahan dengan kerja merge O(n) di tiap level apa pun input-nya. Yang punya worst case O(n²) itu quick sort."],
      ["Kamu mengurutkan order berdasarkan tanggal, lalu mengurutkan hasilnya berdasarkan customer dengan `Array.Sort`. Apakah order tiap customer masih terurut tanggalnya?", ["Ya, selalu", "Tidak dijamin: `Array.Sort` tidak stable", "Hanya untuk array kecil", "Ya, kalau tanggalnya unik"], "Sort yang tidak stable bisa mengacak urutan key yang sama. `OrderBy(o => o.Customer).ThenBy(o => o.Date)` lebih jelas maksudnya."]
    ]
  },
  trees: {
    splits: ['1 · Insert & traversal BST', '2 · Membangun pohon & heap', '3 · Binary search pada kondisi', '4 · Class Node'],
    terms: [
      ['Invariant binary search (`lo <= hi`)', 'Memangkas separuh rentang terurut di tiap langkah dalam `O(log n)`, termasuk untuk soal "binary search jawaban kapasitas".'],
      ['Heap (`PriorityQueue`)', 'Tree semi-terurut yang mengambil nilai terkecil atau terbesar dalam `O(log n)`, inti Top-K, timer, dan Dijkstra.'],
      ['Penelusuran pohon (`DFS` pre/in/post vs `BFS`)', 'DFS menelusuri akar sampai ujung cabang lewat rekursi, sedangkan BFS menyapu level demi level memakai queue.']
    ],
    title: 'Tree, heap, dan binary search',
    predict: {
      prompt: 'Kode ini menyisipkan `8, 3, 10, 1, 6` dan `Height(root)` mencetak `3`. Apa yang dicetak `Height(root)` jika kamu menyisipkan `1, 3, 6, 8, 10` yang sudah terurut ke pohon kosong?',
      options: ['`3`: nilai yang sama selalu membentuk pohon yang sama', '`5`: setiap nilai menjadi anak kanan, sehingga pohon berubah menjadi linked list', '`1`: input terurut menghasilkan pohon yang benar-benar datar'],
      answer: 1,
      explain: 'BST ini tidak pernah menyeimbangkan diri. Setiap nilai baru lebih besar dari semua nilai sebelumnya, jadi selalu masuk ke kanan dan pohon merosot menjadi rantai setinggi `5`. Pencarian pun menjadi `O(n)` alih-alih `O(log n)`. Pohon yang menyeimbangkan diri (red-black atau AVL) memutar node agar tingginya tetap logaritmik; `SortedDictionary` dibangun di atas red-black tree justru karena alasan ini.'
    },
    why: "Tree muncul di seluruh stack: DOM, JSON, file system, component tree React, dan B-tree di balik index SQL. Heap menjawab pertanyaan 'apa berikutnya?' seperti top K dan penjadwalan, dan binary search berguna jauh melampaui mencari angka di array.",
    points: [
      "**Tree** adalah node bercabang tanpa cycle, dan **binary tree** maksimal punya dua child per node. Tree seimbang dengan n node dalamnya sekitar log₂ n level.",
      "**Binary search tree** menjaga kiri < node < kanan, sehingga search, insert, dan delete jalan di O(log n) saat seimbang, dan O(n) kalau berat sebelah jadi rantai. Red-black tree dan B-tree database mencegah ketimpangan itu.",
      "Traversal punya empat jenis: **in-order** (kiri, node, kanan: urut menaik untuk BST), **pre-order** dan **post-order** (depth-first), serta **level-order** (breadth-first memakai queue).",
      "Kebanyakan soal tree berawal dari satu pertanyaan rekursif: 'kalau aku tahu jawaban subtree kiri dan kananku, apa jawabanku?'",
      "**Heap** adalah tree yang setiap parent-nya lebih kecil atau sama dengan child-nya (min-heap). Mengintip minimum O(1), insert dan pop O(log n). Di .NET ada `PriorityQueue<TElement, TPriority>`.",
      "**Binary search** bekerja pada kondisi apa saja yang berubah dari false ke true satu kali di sebuah rentang. Cari titik perubahannya, bukan cuma mencari sebuah nilai."
    ],
    practice: "Kerjakan 'Maximum depth of a binary tree', 'Level-order traversal', dan 'Top K frequent elements' di bagian interview, lalu tulis pertanyaan rekursifnya sebelum ngoding. Setelah itu pakai `FirstTrue` untuk mencari kapasitas pengiriman harian terkecil yang mengangkut 10 order [3, 5, 2, 8, 4, 1, 7, 6, 2, 3] sesuai urutan dalam 5 hari (jawabannya 11).",
    teach: "Jelaskan kenapa binary search tree yang seimbang bisa menemukan nilai dalam O(log n), dan apa yang terjadi kalau nilai dimasukkan dalam urutan menaik.",
    analogy: "Binary search tree itu permainan tebak angka: setiap jawaban 'lebih besar' atau 'lebih kecil' langsung membuang separuh sisanya. Kalau tree-nya timpang ke satu sisi, tiap tebakan cuma membuang satu angka dan kecepatannya turun jadi menghitung satu per satu.",
    pitfalls: [
      "Menganggap binary tree apa pun adalah search tree, atau BST apa pun pasti seimbang.",
      "Menjaga list selalu terurut dan sort ulang tiap insert, padahal yang kamu butuhkan itu heap.",
      "Lupa menangani kasus null di paling atas fungsi tree rekursif.",
      "Berharap `PriorityQueue` mengembalikan item berprioritas sama sesuai urutan masuk. Itu tidak dijamin.",
      "Loop binary search yang macet selamanya. Saat memakai `lo < hi`, selalu pindah `lo` ke `mid + 1` atau `hi` ke `mid`, jangan pernah `lo = mid`."
    ],
    quiz: [
      ["Traversal mana yang membaca isi binary search tree dari nilai terkecil ke terbesar?", ["Pre-order", "In-order", "Post-order", "Level-order"], "Subtree kiri (lebih kecil), node, lalu subtree kanan (lebih besar)."],
      ["Apa yang dijamin oleh min-heap?", ["Setiap level terurut dari kiri ke kanan", "Elemen terkecil ada di root", "Mencari nilai apa pun itu O(log n)", "Prioritas yang sama keluar sesuai urutan masuk"], "Heap hanya menjaga urutan parent-child sehingga minimum langsung ketemu di root. Mencari nilai acak lain tetap O(n)."],
      ["Memasukkan 1, 2, 3, 4, 5 berurutan ke BST biasa menghasilkan…", ["Tree yang seimbang", "Rantai child kanan dengan search O(n)", "Tree dengan tinggi 3", "Min-heap"], "Setiap nilai lebih besar dari sebelumnya, jadi tree-nya memanjang seperti linked list."]
    ]
  },
  graphs: {
    splits: ['1 · Adjacency list & pemanggil', '2 · Jalur terpendek BFS', '3 · DFS', '4 · Urutan topologis'],
    terms: [
      ['Set `seen` (sudah dikunjungi)', 'Mencatat simpul *begitu masuk queue* supaya siklus tidak berputar tanpa henti atau mengunjungi simpul dua kali.'],
      ['Jalur terpendek BFS (tanpa bobot)', 'Menyapu lingkaran jarak `0, 1, 2...` berurutan, menjamin jalur pertama yang menyentuh tujuan adalah yang terpendek.'],
      ['Topological sort (`in-degree`)', 'Mengurutkan dependensi searah tanpa siklus (`DAG`, seperti build pipeline, migrasi, atau installer) agar prasyarat selalu jalan lebih dulu.']
    ],
    title: 'Graph: BFS, DFS, dan topological order',
    predict: {
      prompt: 'Dimulai dari `A`, dalam urutan apa `Dfs` menambahkan node ke `seen`?',
      options: ['`A B C D E`', '`A B D E C`', '`A B D E C D E`'],
      answer: 1,
      explain: 'DFS menyusuri satu cabang sedalam mungkin sebelum mundur: `A`, `B`, `D`, `E`, lalu kembali ke `A` untuk mencoba `C`. Saat `C` melihat `D`, `visited.Add` mengembalikan false, jadi `D` tidak dikunjungi dua kali dan tidak ada cycle yang terlibat. `A B C D E` adalah urutan per level yang akan dihasilkan BFS dari `A`.'
    },
    why: "Peta, jejaring sosial, build system, dan grid itu graph, sama halnya kodemu sendiri. DI container yang merangkai dependency constructor dan EF Core yang mengurutkan migration sama-sama menelusuri graph, jadi tantangannya adalah sadar bahwa soalnya berbentuk graph.",
    points: [
      "**Graph** adalah node (vertex) yang dihubungkan edge, bisa berarah atau berbobot. Tree dan linked list adalah kasus khususnya.",
      "Simpan sebagai **adjacency list** (node → tetangga) karena ringkas dan cepat ditelusuri. Grid itu graph implisit dengan tetangga berupa sel di sebelahnya.",
      "**BFS** memakai queue untuk menyebar per lapisan dan menemukan **shortest path saat semua edge biayanya sama**. Kalau biayanya beda-beda seperti jarak jalan, pakai algoritma Dijkstra (BFS dengan priority queue).",
      "**DFS** (rekursi atau stack) menyelam sedalam mungkin lebih dulu, pas buat cek keterjangkauan dan connected component.",
      "Selalu catat node **visited**, kalau tidak, cycle membuat pencarian berputar terus. Keduanya berjalan dalam O(V + E).",
      "Mencari cycle di graph **directed** butuh lebih dari `visited`: catat juga node di jalur aktif. Bertemu node di jalur aktif berarti cycle, sedangkan bertemu node yang sudah beres sebelumnya tidak.",
      "**Topological sort** mengurutkan graph directed supaya setiap prasyarat jalan duluan: jadwal mata kuliah, urutan build, atau migration. Kalau urutan itu mustahil dibuat, berarti graph punya cycle."
    ],
    practice: "Kerjakan 'Number of islands' (pencarian grid) dan 'Course schedule' (topological order) di bagian interview. Sebelum coding, gambar dulu node dan edge-nya, lalu kerjakan 'Number of islands' lagi memakai `Stack<(int, int)>` sebagai pengganti rekursi.",
    teach: "Jelaskan kenapa BFS menemukan shortest path saat biaya semua edge sama, dan kenapa DFS tidak.",
    analogy: "BFS itu riak air saat batu jatuh ke kolam: ia menyentuh semua titik berjarak satu langkah, lalu dua, lalu tiga, jadi yang pertama disentuh pasti lewat jalur terpendek. DFS itu menyusuri labirin dengan selalu mengambil belokan baru dan baru mundur waktu mentok: pintu keluar pasti ketemu, cuma rutenya belum tentu paling singkat.",
    pitfalls: [
      "Lupa set visited lalu berputar selamanya di sebuah cycle.",
      "Memakai DFS padahal soalnya minta jumlah langkah paling sedikit.",
      "Mengira 'sudah visited' berarti 'ketemu cycle' di graph directed. Dua jalur yang bertemu di node sama bukan cycle.",
      "DFS rekursif di grid besar. Sejuta sel bisa membuat call stack penuh, jadi pakai stack eksplisit atau BFS.",
      "Tidak sadar soalnya berbentuk graph: 'word ladder', 'course prerequisites', dan 'rotting oranges' tidak pernah menyebut kata graph."
    ],
    quiz: [
      ["Algoritma mana yang menemukan shortest path kalau setiap edge biayanya sama?", ["DFS", "BFS", "Topological sort", "Wajib Dijkstra"], "BFS mencapai node urut sesuai jarak dari titik awal. Dijkstra baru perlu kalau biaya edge berbeda."],
      ["Berapa time complexity BFS atau DFS dengan adjacency list?", ["O(V)", "O(V + E)", "O(V²)", "O(E log V)"], "Tiap vertex dikunjungi sekali dan tiap edge dicek sekali. O(E log V) itu Dijkstra dengan heap."],
      ["Topological order hanya ada kalau graph directed-nya…", ["terhubung", "tidak punya cycle", "berupa tree", "hanya punya satu node awal"], "Cycle artinya ada node yang harus datang sebelum dirinya sendiri. Punya beberapa node awal tidak masalah."],
      ["Di graph directed, DFS mencapai node D untuk kedua kalinya. Apa artinya?", ["Ada cycle", "Belum tentu: cek apakah D masih di jalur aktif saat ini", "Graph-nya undirected", "Visited set-nya rusak"], "Hanya bertemu node yang masih di jalur aktif berarti cycle. Bertemu node yang sudah selesai cuma berarti dua jalur bertemu."]
    ]
  },
  backtracking: {
    splits: ['1 · Pemanggil', '2 · Subset', '3 · Combination sum', '4 · Permutasi & Show'],
    terms: [
      ['Pohon keputusan', 'Memetakan kandidat parsial, yang tiap cabangnya mengambil satu pilihan sah (`sertakan`, `lewati`, atau angka berikutnya).'],
      ['Pilih → Telusuri → Batalkan pilihan', 'Masukkan kandidat ke `path`, lanjut rekursi ke bawah, lalu `pop()` (`undo`) supaya cabang lain mulai bersih.'],
      ['Pruning (pemangkasan)', 'Membuang cabang mustahil lebih awal (`remaining < 0`) memangkas kerja pencarian eksponensial sangat jauh.']
    ],
    title: "Backtracking: menjelajahi setiap pilihan",
    why: "Kalau soal minta 'semua kombinasi' atau 'setiap susunan valid', biasanya tidak ada rumus pintas. Kamu coba satu pilihan, telusuri kelanjutannya, lalu tarik kembali pilihan itu. Itulah backtracking, dan pruning menjaganya tetap kencang.",
    points: [
      "Backtracking membangun solusi **satu pilihan demi satu pilihan**. Di tiap langkah, **pilih** satu opsi, **telusuri** lewat rekursi, lalu **batalkan** supaya cabang berikutnya mulai dari kondisi awal.",
      "Pilihan-pilihan itu membentuk **pohon keputusan**, dan backtracking menelusurinya dengan depth-first search. Recursion stack menyimpan solusi parsial saat itu.",
      "Begitu solusi lengkap tercapai, simpan **salinan** path-nya. Path itu terus berubah waktu rekursi mundur, jadi menyimpan list aslinya bakal berakhir kosong.",
      "**Pruning** menghentikan cabang begitu jelas tak mungkin valid, seperti jumlah sudah kegedean atau posisi ratu sudah diserang. Worst-case Big-O tetap eksponensial, tapi di praktik sebagian besar pohon langsung dibuang.",
      "Tiga bentuk mencakup mayoritas soal. Pakai **subset** untuk memilih atau melewati item, **kombinasi** dengan start index agar item sebelumnya tak dipakai lagi, dan **permutasi** untuk melacak item yang sudah terpakai.",
      "Biayanya memang eksponensial: 2ⁿ subset, n! permutasi. Itu wajar, sebutkan di interview lalu tunjukkan cara pruning atau sorting memangkas kerjanya.",
      "Kalau sub-pertanyaan yang sama terus muncul ulang dengan input yang persis sama, berarti kamu butuh dynamic programming: cache hasilnya daripada menelusuri ulang."
    ],
    practice: "Kerjakan 'All subsets' di bagian interview, lalu ubah supaya hanya mengembalikan subset berukuran k dengan pruning begitu path tidak mungkin lagi mencapai k. Terakhir, selesaikan N-Queens untuk n = 6 dan hitung jumlah solusinya (ada 4).",
    teach: "Jelaskan pilih, telusuri, dan batalkan memakai subset [1, 2, 3], serta kenapa kodenya menyimpan salinan path.",
    analogy: "Menelusuri labirin membawa segulung benang. Di tiap persimpangan kamu pilih satu lorong sambil mengulur benang, dan saat mentok kamu menggulungnya balik ke persimpangan terakhir untuk mencoba belokan lain. Benang itu path-mu, dan menggulungnya balik adalah membatalkan pilihan.",
    pitfalls: [
      "Menambahkan `path` aslinya ke hasil, bukan salinannya. Semua hasil akhirnya menunjuk ke list yang sama yang ujungnya kosong.",
      "Lupa membatalkan pilihan sehingga sisa state dari satu cabang bocor ke cabang sebelahnya.",
      "Mengirim `i + 1` saat item boleh diulang, atau `i` saat tidak boleh. Start index menentukan apakah pengulangan diizinkan.",
      "Menghasilkan semua kemungkinan lalu memfilter di akhir, padahal cek di tengah jalan sudah bisa membuang hampir seluruh cabang."
    ],
    quiz: [
      ["Kenapa item terakhir dihapus dari `path` setelah pemanggilan rekursif?", ["Untuk menghemat memory", "Supaya pilihan berikutnya mulai dari state yang sama dengan pilihan ini", "Karena list C# tidak bisa menampung duplikat", "Supaya rekursinya berhenti"], "Membatalkan pilihan mengembalikan kondisi ke awal cabang, jadi tiap cabang saudara mulai dari titik persis sama."],
      ["Kandidatnya sudah terurut, dan kandidat berikutnya sudah lebih besar dari sisa jumlahnya. Apa yang harus dilakukan loop-nya?", ["Lewati dan coba kandidat berikutnya", "Break: semua kandidat setelahnya juga lebih besar", "Tetap tambahkan dan cek di akhir", "Mulai lagi dari kandidat pertama"], "Itulah pruning. Karena sudah terurut, loop bisa langsung berhenti tanpa mengecek sisa kandidat."],
      ["Berapa banyak subset dari sebuah himpunan berisi 20 item berbeda?", ["400", "20!", "2²⁰, sekitar satu juta", "190"], "Tiap item punya dua opsi, masuk atau tidak, jadi ada 2ⁿ subset. 2²⁰ adalah 1.048.576 dan masih aman dihasilkan, sedangkan 2⁴⁰ tidak."]
    ]
  },
  dp: {
    terms: [
      ['Subproblem tumpang tindih', 'Submasalah yang dihitung berulang (`dp[3]` muncul berkali-kali) di-cache per state agar tiap state unik cukup dihitung sekali.'],
      ['State & rumus transisi (recurrence)', 'Parameter tepat yang mendefinisikan submasalah (`dp[amount]`) dan rumus penghubungnya ke jawaban yang lebih kecil.'],
      ['Memoization (top-down) vs Tabulasi (bottom-up)', 'Top-down meng-cache panggilan rekursif otomatis, sementara bottom-up mengisi array datar `0..n` bebas batas call stack.']
    ],
    predict: {
      prompt: 'Kamu ingin menukar uang `amount = 6` dengan koin `[1, 3, 4]`. Berapa koin yang dipakai Greedy (ambil koin terbesar dulu) dibanding DP optimal?',
      options: ['Keduanya memakai 2 koin', 'Greedy memakai 3 koin (`4 + 1 + 1`), sedangkan DP menemukan 2 koin (`3 + 3`)', 'Greedy gagal menyusun angka 6'],
      explain: 'Mengambil koin terbesar duluan (`4`) menjebak Greedy ke `4 + 1 + 1` (3 koin). DP mengecek `min(dp[5], dp[3], dp[2]) + 1` lalu menemukan `3 + 3 = 2` koin.'
    },
    title: 'Dynamic programming dan strategi problem solving',
    why: "Dynamic programming bukan soal menunggu ilham mendadak. Ia adalah prosedur yang bisa dilatih. Kebiasaan di baliknya: coba kasus kecil, temukan kerja yang berulang, lalu pilih struktur data yang pas untuk soal apa pun.",
    points: [
      "DP berlaku kalau sebuah masalah punya **overlapping subproblem** (pertanyaan kecil yang sama muncul berkali-kali) dan **optimal substructure** (jawaban terbaik dirakit dari jawaban terbaik subproblem-nya).",
      "Ciri khas DP muncul pada soal 'berapa banyak cara…', 'biaya terkecil atau terbesar…', atau 'bisakah mencapai…' ketika tiap pilihan memengaruhi opsi setelahnya.",
      "Prosedurnya ada lima langkah: (1) definisikan arti `dp[i]` dalam kata-kata, (2) tulis **recurrence**-nya, dan (3) tentukan **base case**. Sesudah itu pilih urutan pengisian dan optimasi space paling akhir.",
      "**Top-down** (rekursi plus memo) paling gampang diturunkan. **Bottom-up** (isi tabel berurutan) bebas dari rekursi dalam dan kadang cuma perlu space O(1).",
      "Keluarga klasiknya meliputi 1D (climbing stairs, house robber), pilihan bebas ulang (coin change), dua sequence (LCS, edit distance), jalur grid, dan knapsack.",
      "**Greedy**, mengambil opsi paling menguntungkan saat itu, jauh lebih simpel tapi cuma benar untuk masalah tertentu. Satu counter-example cukup buat menggugurkannya.",
      "Saat menghadapi soal baru, kerjakan dulu contoh kecil di kertas lalu tulis brute force beserta kompleksitasnya. Setelah itu pangkas kerja terbuang: subproblem berulang masuk memo, scan ulang diganti hash map atau sorting, dan 'terkecil berikutnya' pakai heap. Terakhir, cek edge case seperti input kosong, satu item, duplikat, dan n besar."
    ],
    practice: "Kerjakan 'Climbing stairs' dan 'Coin change' di bagian interview, lalu tulis definisi state sebagai komentar sebelum coding. Cari juga kombinasi nominal koin dan target saat strategi greedy selalu ambil koin terbesar menghasilkan lebih banyak koin dari DP-mu. Terakhir, pilih soal interview yang belum pernah kamu lihat dan tulis dulu langkah strateginya sebelum ngoding.",
    teach: "Jelaskan dynamic programming sebagai 'recursion plus mengingat' memakai Fibonacci, lalu sebutkan lima langkah merancang solusi DP.",
    analogy: "Dynamic programming seperti mengerjakan hitungan panjang di kertas dan menulis tiap hasil sementara di pinggir halaman. Waktu kamu perlu 37 × 12 lagi, tinggal intip catatan pinggir tanpa menghitung ulang. Kuncinya ada pada memilih hasil sementara mana yang layak dicatat.",
    pitfalls: [
      "Mulai ngoding sebelum menjelaskan dengan kata-kata apa arti `dp[i]`.",
      "Memakai greedy pada soal DP tanpa mencari counter-example.",
      "Menghafalkan kode jawaban daripada prosedur lima langkahnya.",
      "Rekursi top-down yang terlalu dalam untuk input ratusan ribu sampai stack overflow. Pindah ke bottom-up."
    ],
    quiz: [
      ["Dua sifat apa yang membuat sebuah masalah cocok untuk dynamic programming?", ["Input terurut dan nilai yang unik", "Overlapping subproblem dan optimal substructure", "Solusi recursive dan input kecil", "Solusi greedy yang gagal"], "Subproblem yang berulang membuat cache berguna, dan optimal substructure membuat penggabungan hasilnya sah."],
      ["Apa langkah pertama dalam merancang solusi DP?", ["Optimasi space", "Definisikan dengan tepat apa arti state-nya", "Tulis nested loop-nya", "Tulis dictionary memo-nya"], "Tanpa definisi state yang jelas, recurrence tidak bisa ditulis atau dicek."],
      ["Kapan algoritma greedy aman dipakai?", ["Kapan pun ia lebih cepat dari DP", "Kalau kamu bisa menjelaskan bahwa pilihan terbaik saat ini tidak pernah menghalangi jawaban terbaik ujungnya", "Kapan pun inputnya terurut", "Tidak pernah di interview"], "Greedy butuh bukti kenapa ia tetap optimal. Tanpa alasan kuat, satu counter-example mengembalikanmu ke DP."]
    ]
  },
  concurrency: {
    terms: [
      ['Konkurensi vs Paralelisme', 'Konkurensi menyelingi beberapa tugas agar jalan bersama bahkan di 1 inti CPU, sedangkan paralelisme mengeksekusinya serentak di multi-core.'],
      ['Mutex / Lock eksklusif', 'Hanya mengizinkan satu thread masuk area kritis pada satu waktu, dan urutan lock terbalik memicu deadlock persis seperti di SQL.'],
      ['Event loop single-thread', 'Menghindari rebutan lock memory bersama di JS dan Dart dengan memproses satu giliran UI sekaligus sambil mendelegasikan I/O.']
    ],
    title: "Concurrency: thread, lock, dan event loop",
    why: "Lost update di SQL, thread-pool starvation di ASP.NET Core, layar Flutter yang macet, dan state React yang seakan tidak berubah sebenarnya berasal dari masalah yang sama. Banyak tugas berjalan bersamaan menyentuh state bersama, jadi memahami model intinya membuat semuanya lebih gampang dinalar.",
    points: [
      "Sebuah **process** punya memory terpisah, sedangkan **thread** di dalamnya berbagi memory yang sama. Berbagi bikin koordinasi cepat, sekaligus gampang bikin bug.",
      "**Concurrency** berarti beberapa tugas sedang berjalan bersama, sementara **parallelism** berarti tugas itu dieksekusi di saat yang persis sama pada core berbeda. Event loop memberi concurrency di satu thread.",
      "**Race condition** bikin hasil program bergantung pada timing. `count++` melakukan baca, tambah, tulis: dua thread bisa sama-sama baca 5 dan sama-sama tulis 6 sehingga satu hitungan lenyap.",
      "Solusinya dari yang paling simpel: **jangan berbagi** dengan memberi tiap task datanya sendiri lalu digabung di akhir. Opsi lain adalah operasi **atomic** (`Interlocked.Increment` atau `UPDATE … SET x = x + 1` di SQL) atau membungkusnya dengan **lock**.",
      "Lock memicu **deadlock** saat dua thread mengambil lock yang sama dengan urutan terbalik. Obatnya sama seperti SQL: ambil dalam urutan tetap dan pegang sesingkat mungkin.",
      "**Event loop** di JavaScript, Dart, atau UI thread menjalankan satu callback sekali jalan, jadi kode sinkron di antara dua `await` tak bisa tersela. Namun task lain bisa menyelip di tiap `await`, alasan yang sama kenapa Cubit mengecek `isClosed`.",
      "Kerja CPU berat memblokir event loop sampai macet total. Pindahkan ke Web Worker, `compute` di Flutter, atau `Task.Run` di aplikasi desktop, dan jaga request ASP.NET Core tetap async agar thread pool lancar."
    ],
    practice: "Jalankan contoh counter beberapa kali dan catat berapa hitungan yang hilang. Lalu buat keranjang in-memory di C# memakai `Dictionary<int, int>`, jalankan dari 1.000 task paralel, dan amankan dua kali: pakai lock lalu `ConcurrentDictionary.AddOrUpdate`. Terakhir, hapus `SemaphoreSlim` dari `BuyAsync` agar kedua pembelian sama-sama lolos.",
    teach: "Jelaskan kenapa `count++` di dua thread bisa kehilangan satu update, dan tiga cara mencegahnya.",
    analogy: "Bayangkan dua kasir mencatat ke satu buku kas kertas yang sama. Keduanya membaca saldo 500, menambah penjualan masing-masing, lalu menulis totalnya, membuat satu penjualan lenyap. Lock adalah aturan bahwa cuma pemegang pena yang boleh menulis, sedangkan operasi atomic itu mesin kasir yang menjumlahkannya dalam satu tekan.",
    pitfalls: [
      "Mengira `count++` atau `List<T>.Add` aman dipakai dari banyak thread. Keduanya tidak aman, jadi pakai `Interlocked`, concurrent collection, atau lock.",
      "Mencoba `await` di dalam `lock`. Compiler melarangnya, jadi pakai `SemaphoreSlim.WaitAsync`.",
      "Mengecek kondisi, melakukan `await`, lalu menganggap kondisinya masih berlaku. Cek lagi sesudah `await`, atau kunci dua-duanya dengan async lock.",
      "Memblokir kode async memakai `.Result` sambil memegang lock atau di UI thread: cara klasik memicu deadlock."
    ],
    quiz: [
      ["Dua thread masing-masing menjalankan `count++` 1.000 kali pada `int` bersama yang dimulai dari 0. Berapa nilai akhirnya?", ["Selalu 2.000", "Berapa pun sampai 2.000: penambahan bisa hilang", "Selalu 1.000", "Program error dan crash"], "`count++` terdiri dari baca, tambah, dan tulis. Dua thread bisa membaca angka sama lalu menulis hasil yang sama."],
      ["Kenapa kode JavaScript yang synchronous tidak pernah disela callback lain?", ["Browser me-lock setiap variabel", "Event loop menjalankan satu callback pada satu waktu, di satu thread", "`await` menyalin semua variabel", "JavaScript tidak punya concurrency sama sekali"], "Callback lain menunggu sampai callback yang aktif selesai atau menemui `await`. State bisa berubah melewati `await`, bukan di tengah blok sinkron."],
      ["Di C#, kamu perlu melindungi bagian kode yang berisi `await`. Apa yang dipakai?", ["`lock (gate) { … }`", "`SemaphoreSlim` dengan `await WaitAsync()` dan `Release()`", "`Thread.Sleep` sebelum bagian itu", "`volatile` pada field-nya"], "`lock` tidak bisa menampung `await`. Pakai `SemaphoreSlim(1, 1)` sebagai async lock dan lepaskan di blok `finally`."]
    ]
  }
}
};

export default trackId;
