// Bahasa Indonesia — track CS Fundamentals. Contoh kode tetap memakai versi aslinya.
I18N.lessons('cs', {
  git: {
    title: 'Git dan workflow developer',
    why: "Setiap tim profesional memakai Git setiap hari. Git adalah tombol undo-mu, alat kolaborasimu, dan — sebagai riwayat publik dari pekerjaan nyata — hal pertama yang memberi kredibilitas pada developer baru.",
    points: [
      "**Repository** adalah sebuah project beserta seluruh riwayatnya. **Commit** adalah snapshot dengan pesan yang menjelaskan kenapa ada perubahan.",
      "Tiga area: **working directory** (file-mu), **staging area** (`git add` — isi commit berikutnya), dan **history** (`git commit`).",
      "**Branch** adalah pointer yang bisa bergerak ke sebuah commit. Buat satu per fitur supaya `main` selalu jalan: `git switch -c feature/cart`.",
      "`git merge` menggabungkan riwayat; **conflict** hanya berarti Git butuh kamu memilih di antara dua editan pada baris yang sama.",
      "**Remote** (GitHub, GitLab) adalah salinan bersama: `git push` meng-upload commit-mu, `git pull` men-download commit orang lain. **Pull request** meminta rekan tim me-review sebuah branch sebelum di-merge.",
      "Commit kecil-kecil dan sering, dengan pesan berbentuk perintah: 'Add stock check to checkout'. Jangan pernah meng-commit secret — pakai `.gitignore`."
    ],
    practice: "Masukkan project latihanmu saat ini ke Git. Buat tiga commit kecil dengan pesan yang jelas, buat sebuah branch, ubah baris yang sama di kedua branch, merge, lalu selesaikan conflict-nya secara manual. Setelah itu push ke repository GitHub gratis.",
    teach: "Jelaskan perbedaan working directory, staging area, dan commit, serta kenapa branch membuat kerja tim jadi aman.",
    analogy: "Git itu sistem save game untuk kode. Commit adalah save point dengan catatan tentang apa yang baru saja kamu capai. Branch adalah slot save kedua tempat kamu bisa mencoba sesuatu yang berisiko; kalau berhasil kamu merge kembali, kalau gagal save utamamu tidak tersentuh.",
    pitfalls: [
      "Satu commit raksasa bernama 'changes' di penghujung hari — mustahil di-review atau di-undo sebagian.",
      "Takut pada merge conflict. Conflict itu pertanyaan, bukan error.",
      "Meng-commit password atau connection string. Menghapusnya belakangan tidak menghapusnya dari history."
    ],
    quiz: [
      ["Apa yang dilakukan `git add`?", ["Membuat commit", "Men-stage perubahan untuk commit berikutnya", "Meng-upload ke remote", "Membuat branch"], "Ia memindahkan perubahan ke staging area; `git commit` yang kemudian merekamnya."],
      ["Kenapa bekerja di feature branch, bukan di `main`?", ["Lebih cepat", "Pekerjaan yang belum selesai tetap terisolasi, dan `main` tetap jalan serta bisa di-review", "Branch memakai disk lebih sedikit", "Git mewajibkannya"], "Branch mengisolasi perubahan sampai selesai di-review dan siap di-merge."],
      ["Apa itu merge conflict?", ["Repository yang corrupt", "Dua branch mengubah baris yang sama dan Git butuh kamu memilih", "Push yang gagal", "Branch yang terhapus"], "Git me-merge otomatis kalau bisa, dan bertanya ke manusia kalau dua editan bertumpang-tindih."]
    ]
  },
  bigo: {
    title: 'Big-O: bagaimana kode scale',
    why: "Setiap coding interview ditutup dengan 'berapa time dan space complexity-nya?'. Lebih penting lagi, Big-O adalah cara engineer memprediksi apakah kode yang jalan untuk 100 baris akan bertahan di 10 juta.",
    points: [
      "Big-O mendeskripsikan bagaimana **jumlah langkah bertambah** seiring ukuran input n bertambah. Ia mengabaikan konstanta dan suku kecil: 3n + 10 adalah O(n).",
      "Kelas yang umum, dari terbaik ke terburuk: **O(1)** konstan, **O(log n)** logaritmik, **O(n)** linear, **O(n log n)**, **O(n²)** kuadratik, **O(2ⁿ)** eksponensial.",
      "Patokan: satu loop atas input itu O(n); loop di dalam loop itu O(n²); membagi dua masalah di tiap langkah itu O(log n); sorting itu O(n log n).",
      "**Space complexity** menghitung memory tambahan dengan cara yang sama. Banyak optimasi menukar space dengan time — hash set mengubah pengecekan duplikat O(n²) jadi O(n).",
      "Kalau tidak disebutkan lain, analisis **worst case**-nya. 'Amortized O(1)' berarti sesekali mahal tapi rata-ratanya murah, seperti `List.Add`.",
      "Pada n = 1.000.000: O(log n) sekitar 20 langkah, O(n) sejuta, O(n²) satu triliun. Selisih itulah intinya."
    ],
    practice: "Pakai visualisasinya untuk membandingkan tiap kelas pada n = 1.000 dan n = 1.000.000. Lalu ukur waktu `HasDuplicateSlow` dan `HasDuplicateFast` dengan `Stopwatch` untuk 10.000, 20.000, dan 40.000 item. Saat n menjadi dua kali lipat, apa yang terjadi pada masing-masing waktunya?",
    teach: "Jelaskan arti O(n) dan O(n²) ke orang yang belum pernah melihat notasi itu, memakai contoh dari kehidupan nyata.",
    analogy: "Mencari nama di buku telepon. Membaca setiap halaman itu O(n). Membuka di tengah lalu membagi dua terus-menerus itu O(log n). Mengecek apakah ada dua orang di satu ruangan yang ulang tahunnya sama dengan cara semua orang bersalaman dengan semua orang itu O(n²) — tidak masalah untuk 10 orang, mustahil untuk satu stadion.",
    pitfalls: [
      "Menghitung jumlah baris kode, bukan pertumbuhan pekerjaannya. Satu baris yang memanggil `list.Contains` di dalam loop itu O(n²).",
      "Melupakan biaya tersembunyi: sorting, concatenation `string` di dalam loop, `Insert(0, x)` pada list.",
      "Menyebut time complexity tapi lupa space-nya."
    ],
    quiz: [
      ["Berapa complexity loop atas n item yang setiap kali memanggil `list.Contains(x)` pada list berisi n item?", ["O(n)", "O(n log n)", "O(n²)", "O(1)"], "`Contains` pada list sendiri sudah O(n), dan dijalankan n kali."],
      ["Binary search pada 1.000.000 item terurut butuh kira-kira berapa langkah?", ["20", "1.000", "500.000", "1.000.000"], "log₂(1.000.000) ≈ 20: tiap langkah membagi dua yang tersisa."],
      ["5n² + 3n + 100 disederhanakan menjadi…", ["O(n)", "O(5n²)", "O(n²)", "O(n³)"], "Buang konstanta dan suku berorde lebih rendah: suku n² yang mendominasi seiring n membesar."]
    ]
  },
  structures: {
    title: 'Array, hash table, stack, queue, dan linked list',
    why: "Memilih data structure yang tepat biasanya sudah merupakan seluruh solusinya. Kebanyakan soal interview jadi mudah begitu structure yang tepat disebutkan — dan kebanyakan bug performance nyata adalah structure yang salah.",
    points: [
      "**Array / List**: memory yang berurutan. Akses lewat index O(1), append O(1) amortized, insert atau remove di tengah O(n), search O(n).",
      "**Hash table** (`Dictionary`, `HashSet`): hash function memetakan key ke sebuah bucket. Lookup, insert, dan delete rata-rata O(1); tidak ada urutan. Tool pertama yang perlu kamu raih.",
      "**Stack** (LIFO): push dan pop di satu ujung. Undo, rekursi, pencocokan kurung, depth-first search.",
      "**Queue** (FIFO): tambah di belakang, ambil dari depan. Pekerjaan sesuai urutan kedatangan, breadth-first search.",
      "**Linked list**: node yang menunjuk ke node berikutnya. Insert atau remove di node yang sudah diketahui itu O(1), tapi mencapainya O(n) dan cache locality-nya buruk — jarang jadi pilihan tepat dalam praktik, tapi topik favorit interview.",
      "Ajukan tiga pertanyaan: operasi apa yang kubutuhkan, seberapa sering, dan pada data sebanyak apa? Jawabannya yang memilih structure-nya."
    ],
    practice: "Selesaikan tiga soal interview, dengan menyebutkan structure-nya sebelum menulis kode apa pun: 'Pair with target sum' (hash map), 'Valid brackets' (stack), 'Reverse a linked list' (pointer). Untuk masing-masing, jelaskan kenapa alternatif yang paling terpikir justru lebih buruk.",
    teach: "Jelaskan kenapa mencari key di hash table itu O(1) sedangkan mencari di list itu O(n).",
    analogy: "List itu deretan loker bernomor: instan kalau kamu tahu nomornya, jalan jauh kalau kamu hanya tahu isinya. Hash table itu penitipan barang yang nomor tiketnya dihitung dari namamu — kamu langsung menuju gantungan yang tepat. Stack itu tumpukan piring; queue itu antrean di toko.",
    pitfalls: [
      "Memakai list padahal yang dibutuhkan set atau dictionary, lalu mencarinya di dalam loop.",
      "Menganggap dictionary menjaga urutan insert atau urutan terurut.",
      "Memilih linked list demi 'insert cepat' padahal pencarian posisinya tetap O(n)."
    ],
    quiz: [
      ["Structure mana yang memberi lookup berdasarkan key rata-rata O(1)?", ["List", "Linked list", "Hash table", "Queue"], "Hash dari key langsung mengarah ke bucket-nya."],
      ["Structure mana yang cocok untuk 'undo aksi terakhir'?", ["Queue", "Stack", "Dictionary", "Array"], "Undo itu last in, first out."],
      ["Berapa biaya `list.Insert(0, x)` pada List berisi n item?", ["O(1)", "O(log n)", "O(n)", "O(n²)"], "Setiap elemen yang sudah ada harus bergeser satu posisi."]
    ]
  },
  sorting: {
    title: 'Rekursi dan sorting',
    why: "Rekursi adalah alat berpikir di balik tree, graph, backtracking, dan dynamic programming. Sorting adalah langkah preprocessing paling umum di interview — dan paham kenapa ia O(n log n) menjelaskan separuh analisis algoritma.",
    points: [
      "Function rekursif menyelesaikan masalah dengan menyelesaikan **versi lebih kecil dari masalah yang sama**. Ia butuh **base case** yang menghentikan, dan sebuah langkah yang bergerak ke arah base case itu.",
      "Tiap pemanggilan mendapat frame sendiri di call stack. Rekursi yang sangat dalam bisa stack overflow; rekursi apa pun bisa ditulis ulang dengan stack eksplisit.",
      "**Divide and conquer**: pecah masalahnya, selesaikan tiap bagian, gabungkan. Merge sort melakukan persis ini dan selalu O(n log n).",
      "Bubble sort dan insertion sort itu O(n²) — sederhana, dan tidak masalah untuk input yang sangat kecil atau hampir terurut. Quick sort rata-rata O(n log n), worst case-nya O(n²).",
      "Sorting berbasis perbandingan secara umum tidak bisa lebih cepat dari O(n log n). Sort yang **stable** mempertahankan urutan asli item yang nilainya sama.",
      "Di kode nyata pakai yang bawaan (`Array.Sort`, `OrderBy`). Di interview, katakan 'sort dulu' lalu manfaatkan urutannya dengan two pointers atau binary search."
    ],
    practice: "Jalankan tiap algoritma di visualisasi sorting dan catat jumlah perbandingannya. Lalu tulis function rekursif yang menjumlahkan nested list berisi integer, dan telusuri call stack-nya di kertas untuk input tiga level.",
    teach: "Jelaskan rekursi memakai merge sort: apa base case-nya, apa masalah yang lebih kecilnya, dan bagaimana hasilnya digabung?",
    analogy: "Mengurutkan setumpuk kartu dengan merge sort: bagi dua tumpukannya, serahkan tiap bagian ke seorang teman dengan instruksi yang sama, dan saat dua bagian yang sudah terurut kembali, gabungkan dengan terus mengambil kartu teratas yang lebih kecil. Instruksinya sama di setiap level, dan satu kartu saja sudah pasti terurut — itulah base case-nya.",
    pitfalls: [
      "Base case yang tidak ada atau tidak pernah tercapai — rekursi tak berujung dan stack overflow.",
      "Mengira rekursi selalu lebih lambat atau selalu lebih elegan. Rekursi adalah alat untuk masalah yang strukturnya memang rekursif.",
      "Mengimplementasikan ulang sort di kode production alih-alih memakai library."
    ],
    quiz: [
      ["Dua hal apa yang wajib dimiliki setiap function rekursif?", ["Loop dan counter", "Base case dan langkah menuju base case itu", "Dua parameter", "Return type int"], "Tanpa base case ia tidak pernah berhenti; tanpa kemajuan ia tidak pernah mencapai base case."],
      ["Berapa time complexity merge sort?", ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], "Ada log n level pembagian, dengan pekerjaan merge O(n) di tiap level."],
      ["Sort yang 'stable' menjamin bahwa…", ["tidak pernah crash", "elemen yang sama nilainya mempertahankan urutan relatif aslinya", "tidak memakai memory tambahan", "berjalan dalam O(n)"], "Stability penting saat mengurutkan berdasarkan satu key lalu key berikutnya."]
    ]
  },
  trees: {
    title: 'Tree, heap, dan binary search',
    why: "Tree ada di mana-mana: DOM, JSON, file system, index database, component tree milik React. Heap adalah tenaga di balik setiap masalah 'top K' dan scheduling. Keduanya mencakup porsi besar dari pertanyaan interview.",
    points: [
      "**Tree** adalah node dengan children dan tanpa cycle. **Binary tree** punya maksimal dua child per node. Kedalaman tree yang balanced dengan n node kira-kira log₂ n.",
      "**Binary search tree** menjaga kiri < node < kanan, sehingga search, insert, dan delete jadi O(log n) kalau balanced — dan O(n) kalau merosot jadi list. Self-balancing tree (red-black, B-tree) mencegah hal itu.",
      "Traversal: **in-order** (kiri, node, kanan — urutan terurut untuk BST), **pre-order**, **post-order** (depth-first), dan **level-order** (breadth-first dengan queue).",
      "Kebanyakan soal tree selesai dengan satu pertanyaan rekursif: 'kalau aku sudah tahu jawaban untuk subtree kiri dan kananku, apa jawabanku?'",
      "**Heap** adalah tree yang tiap parent-nya lebih kecil (min-heap) daripada children-nya. Mengintip nilai minimum O(1); insert dan remove O(log n). Di .NET: `PriorityQueue<TElement, TPriority>`.",
      "**Binary search** bukan cuma untuk mencari sebuah nilai: kapan pun sebuah kondisi berubah dari false ke true tepat satu kali di sepanjang range yang terurut, kamu bisa binary search titik perubahannya."
    ],
    practice: "Selesaikan 'Maximum depth of a binary tree', 'Level-order traversal', dan 'Top K frequent elements' di bagian interview. Untuk tiap soal tree, tuliskan dulu pertanyaan rekursifnya sebelum coding.",
    teach: "Jelaskan kenapa binary search tree yang balanced menemukan sebuah nilai dalam O(log n), dan apa yang jadi masalah kalau nilainya di-insert dalam urutan terurut.",
    analogy: "Binary search tree itu permainan 'tebak angkaku': tiap pertanyaan — lebih besar atau lebih kecil? — membuang separuh dari yang tersisa. Kalau tree-nya berat sebelah, tiap pertanyaan hanya membuang satu kemungkinan, dan permainannya tidak lebih cepat daripada menghitung satu per satu. Heap itu meja triase rumah sakit: yang paling darurat selalu ditangani berikutnya, apa pun urutan kedatangannya.",
    pitfalls: [
      "Menganggap semua binary tree adalah search tree, atau semua BST itu balanced.",
      "Memakai list terurut dan men-sort ulang setelah tiap insert padahal yang dibutuhkan heap.",
      "Lupa menangani case null di awal function rekursif untuk tree."
    ],
    quiz: [
      ["Traversal mana yang mengunjungi nilai-nilai binary search tree dalam urutan terurut?", ["Pre-order", "In-order", "Post-order", "Level-order"], "Subtree kiri (lebih kecil), node, subtree kanan (lebih besar)."],
      ["Apa yang dijamin min-heap?", ["Semua nilai terurut", "Elemen terkecil ada di root", "Lookup berdasarkan key itu O(1)", "Balanced berdasarkan nilai"], "Yang dijaga hanya urutan parent-child, dan itu cukup untuk menemukan nilai minimum seketika."],
      ["Meng-insert 1, 2, 3, 4, 5 secara berurutan ke BST biasa menghasilkan…", ["Tree yang balanced", "Rantai right child dengan search O(n)", "Sebuah heap", "Error"], "Tiap nilai lebih besar dari yang sebelumnya, jadi tree-nya merosot jadi linked list."]
    ]
  },
  graphs: {
    title: 'Graph: BFS, DFS, dan topological order',
    why: "Jejaring sosial, peta, dependency resolution, build system, state machine, dan grid semuanya adalah graph. Interviewer menyukainya karena bagian tersulitnya justru mengenali graph yang tersembunyi.",
    points: [
      "**Graph** adalah node (vertex) yang dihubungkan oleh edge, directed atau undirected, weighted atau tidak. Tree dan linked list adalah kasus khususnya.",
      "Simpan sebagai **adjacency list** (node → neighbour): ringkas dan cepat di-iterate. Grid adalah graph implisit yang neighbour-nya adalah sel-sel yang bersebelahan.",
      "**BFS** (queue) menjelajah melingkar ke luar dan menemukan **shortest path di unweighted graph**.",
      "**DFS** (rekursi atau stack) menjelajah sedalam mungkin lebih dulu: reachability, connected component, deteksi cycle.",
      "Selalu catat node yang sudah **visited**, kalau tidak cycle akan membuat pencarian berputar selamanya. Kedua pencarian berjalan dalam O(V + E).",
      "**Topological sort** mengurutkan directed acyclic graph supaya setiap dependency muncul lebih dulu — prasyarat mata kuliah, urutan build, migration. Kalau urutan seperti itu tidak ada, berarti graph-nya punya cycle."
    ],
    practice: "Selesaikan 'Number of islands' (DFS pada grid) dan 'Course schedule' (topological sort) di bagian interview. Sebelum coding masing-masing, gambar graph-nya: apa yang jadi node, dan apa yang jadi edge?",
    teach: "Jelaskan kenapa BFS menemukan shortest path di unweighted graph sedangkan DFS tidak.",
    analogy: "BFS itu riak dari batu yang dijatuhkan ke kolam: ia mencapai semua yang berjarak satu langkah, lalu dua langkah, lalu tiga — jadi apa pun yang pertama kali disentuhnya, pasti disentuh lewat rute terpendek. DFS itu menjelajahi labirin dengan selalu mengambil lorong pertama yang belum dijelajahi dan baru mundur saat buntu: kamu akan menemukan pintu keluarnya, tapi belum tentu lewat jalan terpendek.",
    pitfalls: [
      "Lupa visited set lalu berputar selamanya di sebuah cycle.",
      "Memakai DFS padahal soalnya menanyakan jumlah langkah paling sedikit.",
      "Tidak mengenali graph: 'word ladder', 'course prerequisites', dan 'rotting oranges' tidak pernah menyebut kata graph."
    ],
    quiz: [
      ["Algoritma mana yang menemukan shortest path di unweighted graph?", ["DFS", "BFS", "Binary search", "Merge sort"], "BFS mencapai node sesuai urutan jaraknya dari titik awal."],
      ["Berapa time complexity BFS atau DFS dengan adjacency list?", ["O(V)", "O(V + E)", "O(V²)", "O(E log V)"], "Tiap vertex dikunjungi sekali dan tiap edge diperiksa sekali."],
      ["Topological order hanya ada kalau directed graph-nya…", ["connected", "tidak punya cycle", "berupa tree", "punya weight"], "Cycle berarti ada node yang harus muncul sebelum dirinya sendiri."]
    ]
  },
  dp: {
    title: 'Dynamic programming dan strategi problem solving',
    why: "Dynamic programming adalah topik interview yang paling ditakuti sekaligus paling bisa dipelajari: ia prosedur yang tetap, bukan ilham sesaat. Di luar DP, seorang expert selalu membawa strategi untuk menghadapi masalah apa pun yang belum dikenal.",
    points: [
      "DP berlaku ketika sebuah masalah punya **overlapping subproblems** (pertanyaan kecil yang sama ditanyakan berulang-ulang) dan **optimal substructure** (jawaban terbaik disusun dari jawaban terbaik subproblem-nya).",
      "Prosedurnya: (1) definisikan **state** — apa arti `dp[i]` dalam kata-kata? (2) tulis **recurrence**-nya; (3) tetapkan **base case**; (4) tentukan urutan pengisian; (5) optimasi space paling akhir.",
      "**Top-down** (rekursi + memo) paling mudah diturunkan. **Bottom-up** (tabel yang diisi berurutan) menghindari kedalaman rekursi dan sering memungkinkan space O(1).",
      "Keluarga klasik: 1D (climbing stairs, house robber), pilihan tak terbatas (coin change), dua sequence (longest common subsequence, edit distance), grid path, knapsack.",
      "**Greedy** — ambil pilihan terbaik secara lokal — lebih sederhana tapi hanya benar untuk sebagian masalah. Kalau kamu bisa menemukan counter-example, berarti kamu butuh DP.",
      "Untuk masalah apa pun yang belum dikenal: brute force dulu; cari pekerjaan yang berulang; coba sorting, hash map, two pointers, atau heap; selesaikan instance yang lebih kecil dengan tangan lalu generalisasi."
    ],
    practice: "Selesaikan 'Climbing stairs' dan 'Coin change' di bagian interview, dengan menuliskan definisi state sebagai komentar sebelum kode apa pun. Lalu tunjukkan dengan contoh konkret kenapa pendekatan greedy gagal untuk koin [1, 3, 4] dan amount 6.",
    teach: "Jelaskan dynamic programming sebagai 'rekursi plus mengingat', memakai Fibonacci, dan sebutkan lima langkah merancang solusi DP.",
    analogy: "Dynamic programming itu mengerjakan hitungan panjang di kertas sambil menulis tiap hasil antara di pinggir halaman. Lain kali kamu butuh 37 × 12, kamu tinggal melihat pinggir halaman, tidak perlu menghitung ulang. Seluruh tekniknya adalah menyadari bahwa kamu terus membutuhkan hasil antara yang sama — lalu memutuskan apa yang ditulis di pinggir halaman.",
    pitfalls: [
      "Mulai coding sebelum menyatakan dengan kata-kata apa arti `dp[i]`.",
      "Mencoba greedy pada masalah DP tanpa menguji counter-example.",
      "Menghafal solusi, bukan prosedur lima langkahnya."
    ],
    quiz: [
      ["Dua sifat apa yang membuat sebuah masalah cocok untuk dynamic programming?", ["Input terurut dan nilai unik", "Overlapping subproblems dan optimal substructure", "Graph dan queue", "Input kecil dan rekursi"], "Subproblem yang berulang membuat caching sepadan; optimal substructure membuat penggabungan jawaban dari cache jadi benar."],
      ["Apa langkah pertama merancang solusi DP?", ["Optimasi space", "Mendefinisikan dengan presisi apa arti state-nya", "Menulis loop-nya", "Memilih bahasa"], "Tanpa definisi state yang jelas, recurrence-nya tidak bisa ditulis maupun dicek."],
      ["Greedy gagal untuk coin change dengan koin [1, 3, 4] dan amount 6 karena…", ["greedy lebih lambat", "mengambil 4 lebih dulu menghasilkan 4+1+1 (3 koin) padahal 3+3 cukup 2 koin", "tidak ada solusinya", "koinnya tidak terurut"], "Di sini pilihan terbaik secara lokal tidak mengarah ke optimum global."]
    ]
  }
}, { tagline: 'Fondasinya: Git, complexity, data structure, dan algoritma — dasar dari setiap coding interview.' });
