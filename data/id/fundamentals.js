// Bahasa Indonesia — track CS Fundamentals. Contoh kode tetap memakai versi aslinya.
I18N.lessons('cs', {
  git: {
    title: 'Git dan alur kerja developer',
    why: "Tim profesional memakai Git setiap hari. Git adalah tombol undo sekaligus alat kolaborasimu, dan riwayat kerja nyata yang bisa dilihat publik adalah salah satu hal pertama yang membuat developer baru dipercaya.",
    points: [
      "**Repository** adalah sebuah project beserta seluruh riwayatnya. **Commit** adalah snapshot dengan pesan yang menjelaskan kenapa ada perubahan.",
      "Ada tiga area: **working directory** (file-filemu), **staging area** (`git add` — isi commit berikutnya), dan **history** (`git commit`).",
      "**Branch** adalah penunjuk yang bisa berpindah ke sebuah commit. Buat satu branch per fitur supaya `main` selalu jalan: `git switch -c feature/cart`.",
      "**Remote** (GitHub, GitLab) adalah salinan bersama: `git push` meng-upload commit-mu, `git pull` men-download commit orang lain.",
      "Dalam tim, kamu push sebuah branch lalu membuka **pull request**; rekan setim me-review-nya, lalu di-merge di GitHub. Kalau kerja sendiri tanpa hosting, `git merge feature/cart` di `main` melakukan merge yang sama secara lokal.",
      "**Conflict** hanya berarti ada dua editan di baris yang sama, dan Git butuh kamu untuk memilih.",
      "Commit kecil dan sering, dengan pesan berbentuk perintah: 'Add stock check to checkout'. Jauhkan hasil build dan secret dengan `.gitignore`."
    ],
    practice: "Masukkan project latihanmu ke Git dengan `git init -b main` dan sebuah `.gitignore`. Buat tiga commit kecil dengan pesan yang jelas. Buat sebuah branch, ubah baris yang sama di kedua branch, merge ke `main` secara lokal, lalu bereskan conflict-nya secara manual. Setelah itu push ke repository GitHub baru dan ulangi alur fitur tadi dengan pull request.",
    teach: "Jelaskan perbedaan working directory, staging area, dan commit, serta kenapa branch membuat kerja tim jadi aman.",
    analogy: "Git itu sistem save game untuk kode. Commit adalah save point dengan catatan tentang apa yang baru saja kamu capai. Branch adalah slot save kedua tempat kamu bisa mencoba sesuatu yang berisiko; kalau berhasil, kamu merge kembali, dan kalau gagal, save utamamu tidak tersentuh.",
    pitfalls: [
      "Satu commit raksasa bernama 'changes' di akhir hari. Tidak ada yang bisa me-review-nya, dan kamu tidak bisa membatalkan sebagian saja.",
      "Menganggap merge conflict sebagai error. Itu sebuah pertanyaan: dari dua editan ini, mana yang kamu mau?",
      "Meng-commit password atau connection string. Menghapusnya di commit berikutnya tidak menghapusnya dari history, jadi anggap saja sudah bocor: ganti password-nya atau cabut key-nya, baru hapus.",
      "Menjalankan `git init` biasa lalu ternyata branch-nya bernama `master`, sehingga tutorial yang memakai `main` tidak jalan. Pakai `git init -b main`, atau ganti namanya dengan `git branch -m main`."
    ],
    quiz: [
      ["Apa yang dilakukan `git add`?", ["Membuat commit", "Memasukkan perubahan ke staging untuk commit berikutnya", "Meng-upload ke remote", "Mulai melacak seluruh repository"], "Perintah ini memindahkan perubahan ke staging area; `git commit` lalu mencatatnya."],
      ["Kenapa bekerja di feature branch, bukan langsung di `main`?", ["Commit di branch tidak mungkin conflict", "Pekerjaan yang belum selesai tetap terisolasi, dan `main` tetap jalan serta bisa di-review", "Branch otomatis di-backup ke GitHub", "Hanya branch yang bisa di-push"], "Branch mengisolasi perubahan sampai sudah di-review dan siap di-merge. Branch tetap bisa conflict, dan tidak ada yang ter-upload sampai kamu push."],
      ["Kamu push commit berisi API key, lalu menghapus key itu di commit berikutnya. Lalu apa?", ["Tidak perlu apa-apa; sudah hilang", "Cabut atau ganti key-nya: key itu masih ada di history", "Jalankan `git revert` pada commit pertama", "Jadikan repository-nya private lagi"], "Setiap clone menyimpan commit lama itu. Begitu secret sudah ter-push, anggap sudah ada orang yang memegangnya."]
    ]
  },
  bigo: {
    title: 'Big-O: bagaimana kode berkembang',
    why: "Interview hampir selalu menanyakan time complexity dan space complexity dari jawabanmu. Tapi alasan sehari-hari untuk belajar Big-O lebih besar: ia membuatmu bisa memperkirakan apakah kode yang jalan untuk 100 baris akan tetap selamat di 10 juta baris.",
    points: [
      "Big-O menggambarkan bagaimana **jumlah langkah bertambah** seiring membesarnya ukuran input n. Konstanta dan suku kecil diabaikan: 3n + 10 adalah O(n).",
      "Kelas yang umum, dari terbaik ke terburuk: **O(1)** konstan, **O(log n)** logaritmik, **O(n)** linear, **O(n log n)**, **O(n²)** kuadratik, **O(2ⁿ)** eksponensial.",
      "Patokan praktis: satu loop atas input itu O(n); loop di dalam loop itu O(n²); membagi dua masalah di setiap langkah itu O(log n); sorting itu O(n log n).",
      "**Space complexity** menghitung memory tambahan dengan cara yang sama. Banyak optimasi menukar space dengan waktu: hash set mengubah pengecekan duplikat O(n²) menjadi O(n).",
      "Kecuali diminta lain, analisis **worst case**. 'Amortized O(1)' berarti sesekali mahal tapi rata-ratanya murah, seperti `List.Add`.",
      "Pada n = 1.000.000: O(log n) sekitar 20 langkah, O(n) sejuta, O(n²) satu triliun."
    ],
    practice: "Pakai visualisasinya untuk membandingkan tiap kelas di n = 1.000 dan n = 1.000.000. Lalu ukur waktu `HasDuplicateSlow` dan `HasDuplicateFast` dengan `Stopwatch` untuk 10.000, 20.000, dan 40.000 item, jalankan tiap ukuran dua kali dan ambil waktu yang kedua (yang pertama ikut menghitung JIT warm-up). Saat n jadi dua kali lipat, apa yang terjadi pada waktu masing-masing?",
    teach: "Jelaskan arti O(n) dan O(n²) ke orang yang belum pernah melihat notasinya, pakai contoh dari kehidupan nyata.",
    analogy: "Mencari nama di buku telepon. Membaca setiap halaman itu O(n). Membuka di tengah lalu terus membagi dua itu O(log n). Menyuruh semua orang di ruangan bersalaman dengan semua orang lain untuk mencari yang ulang tahunnya sama itu O(n²): masih oke untuk 10 orang, mustahil untuk satu stadion.",
    pitfalls: [
      "Menghitung jumlah baris kode, bukan bagaimana pekerjaannya bertambah. Satu baris yang memanggil `list.Contains` di dalam loop itu O(n²).",
      "Melupakan biaya tersembunyi: sorting, concatenation `string` di dalam loop, `Insert(0, x)` pada list.",
      "Menyebutkan time complexity tapi lupa space-nya."
    ],
    quiz: [
      ["Berapa complexity dari loop atas n item yang setiap kali memanggil `list.Contains(x)` pada list berisi n item?", ["O(n)", "O(n log n)", "O(n²)", "O(1), karena `Contains` itu bawaan"], "`Contains` pada list itu sendiri O(n), dan ia dijalankan n kali. Bawaan bukan berarti gratis."],
      ["Binary search pada 1.000.000 item yang sudah terurut butuh sekitar berapa langkah?", ["20", "1.000", "500.000", "1.000.000"], "log₂(1.000.000) ≈ 20: setiap langkah membagi dua sisanya."],
      ["5n² + 3n + 100 disederhanakan menjadi…", ["O(n)", "O(5n²)", "O(n²)", "O(n² + n)"], "Buang konstanta dan suku berorde lebih rendah: suku n² yang mendominasi saat n membesar."]
    ]
  },
  structures: {
    title: 'Array, hash table, stack, queue, dan linked list',
    why: "Memilih data structure yang tepat sering kali sudah jadi sebagian besar solusinya. `Dictionary` di balik cache, queue di balik background job, stack di balik undo: beberapa structure yang sama muncul di codebase dan juga di interview.",
    points: [
      "**Array / List**: memory yang bersebelahan. Akses lewat index O(1), append amortized O(1), insert atau hapus di tengah O(n), pencarian O(n).",
      "**Hash table** (`Dictionary`, `HashSet`): hash function memetakan tiap key ke sebuah bucket. Lookup, insert, dan delete O(1) **rata-rata**; tanpa urutan.",
      "Hash table hanya sebagus key-nya: kalau banyak key jatuh ke bucket yang sama, lookup melambat mendekati O(n), dan key yang berubah saat sedang disimpan tidak akan bisa ditemukan lagi.",
      "**Stack** (masuk terakhir, keluar pertama): push dan pop di satu ujung. Undo, pencocokan kurung, depth-first search, dan call stack itu sendiri.",
      "**Queue** (masuk pertama, keluar pertama): tambah di belakang, ambil dari depan. Pekerjaan sesuai urutan datang, breadth-first search.",
      "**Linked list**: node yang masing-masing menunjuk ke node berikutnya. Insert atau hapus O(1) di node yang sudah kamu pegang, tapi O(n) untuk mencapainya dan cache locality-nya buruk. .NET punya `LinkedList<T>`, tapi soal interview memakai class node buatanmu sendiri dengan pointer `Next`.",
      "Ajukan tiga pertanyaan: operasi apa yang kubutuhkan, seberapa sering, dan untuk data sebanyak apa? Jawabannya yang memilih structure-nya."
    ],
    practice: "Kerjakan tiga soal interview, dan sebutkan structure-nya sebelum menulis kode apa pun: 'Pair with target sum' (hash map), 'Valid brackets' (stack), 'Reverse a linked list' (pointer, memakai `ListNode` seperti contoh di atas). Untuk masing-masing, jelaskan kenapa alternatif yang paling gampang terpikir justru lebih buruk.",
    teach: "Jelaskan kenapa mencari key di hash table itu O(1) rata-rata, sedangkan mencari di list itu O(n).",
    analogy: "List itu deretan loker bernomor: instan kalau kamu tahu nomornya, perjalanan panjang kalau kamu hanya tahu isinya. Hash table itu tempat penitipan jaket yang nomor tiketnya dihitung dari namamu, jadi petugasnya langsung menuju gantungan yang benar.",
    pitfalls: [
      "Memakai list padahal yang dibutuhkan set atau dictionary, lalu mencarinya di dalam loop.",
      "Menganggap dictionary menjaga urutan masuk atau urutan terurut. Pakai `SortedDictionary` atau lakukan sort kalau butuh urutan.",
      "Memilih linked list demi 'insert yang cepat', padahal mencari posisinya tetap O(n).",
      "Kehilangan sisa linked list karena menimpa `Next` sebelum menyimpannya. Gambar dulu kotak dan panahnya."
    ],
    quiz: [
      ["Structure mana yang memberi lookup O(1) rata-rata berdasarkan key?", ["`List<T>` yang dijaga terurut", "`LinkedList<T>`", "Hash table", "`Queue<T>`"], "Hash dari key langsung mengarah ke bucket-nya. List terurut memberi O(log n) dengan binary search."],
      ["Structure mana yang cocok untuk 'batalkan aksi terakhir'?", ["Queue", "Stack", "Dictionary", "List terurut"], "Undo itu masuk terakhir, keluar pertama."],
      ["Berapa biaya `list.Insert(0, x)` pada List berisi n item?", ["O(1)", "O(log n)", "O(n)", "Amortized O(1), seperti `Add`"], "Setiap elemen yang ada harus bergeser satu posisi. Hanya append di ujung yang amortized O(1)."]
    ]
  },
  sorting: {
    title: 'Recursion dan sorting',
    why: "Recursion adalah alat berpikir di balik tree, graph, backtracking, dan dynamic programming. Sorting adalah langkah pertama yang paling umum dalam soal algoritma, dan memahami kenapa biayanya O(n log n) mengajarkan sebagian besar yang kamu perlukan untuk menganalisis algoritma.",
    points: [
      "Function recursive menyelesaikan masalah dengan menyelesaikan **versi lebih kecil dari masalah yang sama**. Ia butuh **base case** yang menghentikannya dan langkah yang bergerak menuju base case itu.",
      "Setiap pemanggilan mendapat frame sendiri di call stack. Recursion yang sangat dalam membuat stack overflow; recursion apa pun bisa ditulis ulang dengan stack eksplisit.",
      "**Divide and conquer**: pecah masalahnya, selesaikan tiap bagian, gabungkan. Merge sort melakukan persis ini dan selalu O(n log n).",
      "Bubble sort dan insertion sort itu O(n²): sederhana, dan cukup untuk input yang sangat kecil atau hampir terurut. Quick sort rata-rata O(n log n), dan O(n²) di worst case.",
      "Comparison sort secara umum tidak bisa lebih cepat dari O(n log n). Sort yang **stable** menjaga item yang sama nilainya tetap di urutan aslinya. Di .NET, `OrderBy` milik LINQ itu stable; `Array.Sort` dan `List.Sort` tidak.",
      "Di kode sungguhan, pakai yang bawaan. Di interview, bilang 'sort dulu', lalu manfaatkan urutannya dengan two pointers atau binary search."
    ],
    practice: "Jalankan tiap algoritma di visualisasi sorting dan catat jumlah perbandingannya. Lalu tulis `Sum(object[] items)` yang recursive untuk list bersarang seperti `[1, new object[] { 2, new object[] { 3, 4 } }, 5]` (jawabannya 15): pakai `item is int n` dan `item is object[] inner` untuk membedakan kasusnya. Telusuri call stack-nya di kertas.",
    teach: "Jelaskan recursion memakai merge sort: apa base case-nya, apa masalah yang lebih kecil, dan bagaimana hasilnya digabungkan?",
    analogy: "Mengurutkan setumpuk kartu dengan merge sort: bagi dua tumpukannya, serahkan masing-masing ke teman dengan instruksi yang sama, dan saat dua tumpukan terurut kembali, gabungkan dengan terus mengambil kartu teratas yang lebih kecil. Instruksinya sama di setiap level, dan satu kartu saja sudah pasti terurut: itulah base case-nya.",
    pitfalls: [
      "Base case yang tidak ada atau tidak pernah tercapai: recursion tanpa akhir dan `StackOverflowException`, yang tidak bisa ditangkap.",
      "Overflow dalam hitungan recursive. Dengan `int`, `Factorial(13)` diam-diam memberi jawaban salah; `long` bertahan sampai 20!, dan blok `checked` membuat overflow melempar exception alih-alih berbohong.",
      "Mengurutkan berdasarkan satu key lalu key lain dengan `Array.Sort` dan berharap urutan sebelumnya bertahan. Pakai `OrderBy(...).ThenBy(...)`.",
      "Menulis sort sendiri di kode production alih-alih memakai library."
    ],
    quiz: [
      ["Dua hal apa yang wajib dimiliki setiap function recursive?", ["Loop dan counter", "Base case dan langkah menuju base case itu", "Memo dan return value", "Dua pemanggilan recursive"], "Tanpa base case ia tidak pernah berhenti; tanpa kemajuan ia tidak pernah mencapai base case."],
      ["Berapa time complexity merge sort?", ["O(n)", "O(n log n)", "O(n²) di worst case", "O(log n)"], "Ada log n level pemecahan, dengan pekerjaan merge O(n) di setiap level, apa pun inputnya. Yang punya worst case O(n²) itu quick sort."],
      ["Kamu mengurutkan order berdasarkan tanggal, lalu mengurutkan hasilnya berdasarkan customer dengan `Array.Sort`. Apakah order tiap customer masih terurut tanggalnya?", ["Ya, selalu", "Tidak dijamin: `Array.Sort` tidak stable", "Hanya untuk array kecil", "Ya, kalau tanggalnya unik"], "Sort yang tidak stable bisa mengacak urutan key yang sama. `OrderBy(o => o.Customer).ThenBy(o => o.Date)` menyatakan maksudmu dengan jelas."]
    ]
  },
  trees: {
    title: 'Tree, heap, dan binary search',
    why: "Tree muncul di seluruh stack: DOM, JSON, file system, component tree milik React, dan B-tree di balik setiap index SQL. Heap menjawab pertanyaan 'apa berikutnya?' seperti top K dan penjadwalan, dan binary search jangkauannya jauh melampaui sekadar mencari angka di array.",
    points: [
      "**Tree** adalah node yang punya child dan tidak punya cycle. **Binary tree** punya paling banyak dua child per node. Tree yang seimbang dengan n node kedalamannya sekitar log₂ n level.",
      "**Binary search tree** menjaga kiri < node < kanan, sehingga search, insert, dan delete jadi O(log n) kalau seimbang, dan O(n) kalau merosot jadi rantai. Self-balancing tree (red-black tree, dan B-tree yang dipakai database) mencegah hal itu.",
      "Traversal: **in-order** (kiri, node, kanan: urutan terurut untuk BST), **pre-order** dan **post-order** (semuanya depth-first), serta **level-order** (breadth-first, dengan queue).",
      "Sebagian besar soal tree bermuara pada satu pertanyaan recursive: 'kalau aku tahu jawaban untuk subtree kiri dan kananku, apa jawabanku?'",
      "**Heap** adalah tree yang setiap parent-nya lebih kecil atau sama dengan child-nya (min-heap). Melihat nilai minimum O(1); insert dan remove O(log n). Di .NET: `PriorityQueue<TElement, TPriority>`.",
      "**Binary search** bisa dipakai untuk kondisi apa pun yang berubah dari false ke true tepat satu kali di sepanjang sebuah rentang: cari titik perubahannya, bukan sebuah nilai."
    ],
    practice: "Kerjakan 'Maximum depth of a binary tree', 'Level-order traversal', dan 'Top K frequent elements' di bagian interview. Untuk tiap soal tree, tulis dulu pertanyaan recursive-nya sebelum coding. Lalu pakai `FirstTrue` untuk mencari kapasitas pengiriman harian terkecil yang bisa mengirim 10 order berukuran [3, 5, 2, 8, 4, 1, 7, 6, 2, 3], sesuai urutan itu, dalam 5 hari. (Jawabannya seharusnya 11.)",
    teach: "Jelaskan kenapa binary search tree yang seimbang bisa menemukan sebuah nilai dalam O(log n), dan apa yang salah kalau nilai-nilainya dimasukkan dalam urutan terurut.",
    analogy: "Binary search tree itu permainan 'tebak angkaku': setiap pertanyaan, lebih besar atau lebih kecil, membuang separuh dari sisanya. Kalau tree-nya berat sebelah, setiap pertanyaan hanya membuang satu kemungkinan, dan permainannya tidak lebih cepat daripada menghitung satu per satu.",
    pitfalls: [
      "Menganggap binary tree apa pun adalah search tree, atau BST apa pun pasti seimbang.",
      "Menyimpan list terurut lalu sort ulang setiap kali insert, padahal yang kamu butuhkan adalah heap.",
      "Lupa menangani kasus null di awal function tree yang recursive.",
      "Berharap `PriorityQueue` mengembalikan item berprioritas sama sesuai urutan masuknya. Itu tidak dijanjikan.",
      "Loop binary search yang tidak pernah berhenti: dengan `lo < hi`, selalu pindahkan `lo` ke `mid + 1` atau `hi` ke `mid`, jangan pernah `lo = mid`."
    ],
    quiz: [
      ["Traversal mana yang mengunjungi nilai binary search tree secara terurut?", ["Pre-order", "In-order", "Post-order", "Level-order"], "Subtree kiri (lebih kecil), node, subtree kanan (lebih besar)."],
      ["Apa yang dijamin oleh min-heap?", ["Setiap level terurut dari kiri ke kanan", "Elemen terkecil ada di root", "Mencari nilai apa pun itu O(log n)", "Prioritas yang sama keluar sesuai urutan masuk"], "Yang dijaga hanya urutan parent-child, dan itu cukup untuk menemukan minimum secara instan. Mencari nilai sembarang tetap O(n)."],
      ["Memasukkan 1, 2, 3, 4, 5 secara berurutan ke BST biasa menghasilkan…", ["Tree yang seimbang", "Rantai child kanan dengan search O(n)", "Tree dengan tinggi 3", "Min-heap"], "Setiap nilai lebih besar dari sebelumnya, jadi tree-nya merosot menjadi linked list."]
    ]
  },
  graphs: {
    title: 'Graph: BFS, DFS, dan topological order',
    why: "Peta, jejaring sosial, build system, dan grid adalah graph, begitu juga kodemu sendiri: DI container yang me-resolve dependency constructor dan EF Core yang mengurutkan migration sama-sama sedang menelusuri graph. Dalam soal, bagian tersulitnya adalah menyadari bahwa ada graph di sana.",
    points: [
      "**Graph** adalah node (vertex) yang dihubungkan oleh edge, bisa directed atau undirected, berbobot atau tidak. Tree dan linked list adalah kasus khususnya.",
      "Simpan sebagai **adjacency list** (node → tetangga): ringkas dan cepat ditelusuri. Grid adalah graph implisit yang tetangganya adalah sel-sel di sebelahnya.",
      "**BFS** (dengan queue) menjelajah melingkar ke luar dan menemukan **shortest path kalau setiap edge biayanya sama**. Kalau biayanya berbeda, seperti jarak jalan, pakai algoritma Dijkstra: BFS dengan priority queue.",
      "**DFS** (recursion atau stack) masuk sedalam mungkin lebih dulu: reachability dan connected component.",
      "Selalu catat node yang sudah **visited**, kalau tidak, cycle membuat pencarian berputar selamanya. Kedua pencarian berjalan dalam O(V + E).",
      "Mencari cycle di graph **directed** butuh lebih dari `visited`: kamu juga mencatat node yang ada di jalur saat ini. Bertemu lagi salah satunya berarti cycle; bertemu node yang sudah selesai sebelumnya tidak.",
      "**Topological sort** mengurutkan graph directed sehingga setiap dependency datang lebih dulu: prasyarat mata kuliah, urutan build, migration. Kalau urutan seperti itu tidak ada, graph-nya punya cycle."
    ],
    practice: "Kerjakan 'Number of islands' (pencarian di grid) dan 'Course schedule' (topological order) di bagian interview. Sebelum coding, gambar graph-nya: apa itu node, dan apa itu edge? Lalu kerjakan 'Number of islands' sekali lagi dengan `Stack<(int, int)>` eksplisit, bukan recursion.",
    teach: "Jelaskan kenapa BFS menemukan shortest path kalau setiap edge biayanya sama, dan kenapa DFS tidak.",
    analogy: "BFS itu riak yang menyebar dari batu yang dijatuhkan ke kolam: ia mencapai semua yang berjarak satu langkah, lalu dua langkah, lalu tiga, jadi apa pun yang pertama kali disentuhnya, pasti disentuh lewat rute terpendek. DFS itu menjelajah labirin dengan selalu mengambil lorong pertama yang belum dijelajahi dan baru mundur di jalan buntu: kamu akan menemukan pintu keluar, tapi belum tentu lewat jalan terpendek.",
    pitfalls: [
      "Lupa visited set lalu berputar selamanya di sebuah cycle.",
      "Memakai DFS padahal soalnya meminta jumlah langkah paling sedikit.",
      "Menganggap 'sudah visited' sama dengan 'ketemu cycle' di graph directed. Dua jalur yang bertemu di node yang sama bukanlah cycle.",
      "DFS recursive di grid besar. Sejuta sel bisa membuat call stack overflow; pakai stack eksplisit atau BFS.",
      "Tidak menyadari ada graph: 'word ladder', 'course prerequisites', dan 'rotting oranges' tidak pernah menyebut kata graph."
    ],
    quiz: [
      ["Algoritma mana yang menemukan shortest path kalau setiap edge biayanya sama?", ["DFS", "BFS", "Topological sort", "Wajib Dijkstra"], "BFS mencapai node sesuai urutan jaraknya dari titik awal. Dijkstra baru dibutuhkan kalau biaya edge-nya berbeda-beda."],
      ["Berapa time complexity BFS atau DFS dengan adjacency list?", ["O(V)", "O(V + E)", "O(V²)", "O(E log V)"], "Setiap vertex dikunjungi sekali dan setiap edge diperiksa sekali. O(E log V) itu Dijkstra dengan heap."],
      ["Topological order hanya ada kalau graph directed-nya…", ["terhubung", "tidak punya cycle", "berupa tree", "hanya punya satu node awal"], "Cycle berarti ada node yang harus datang sebelum dirinya sendiri. Punya beberapa node awal tidak masalah."],
      ["Di graph directed, DFS mencapai node D untuk kedua kalinya. Apa artinya?", ["Ada cycle", "Belum berarti apa-apa: cek apakah D masih ada di jalur saat ini", "Graph-nya undirected", "Visited set-nya rusak"], "Hanya bertemu node yang ada di jalur saat ini yang berarti cycle. Bertemu node yang sudah selesai hanya berarti dua jalur bertemu."]
    ]
  },
  dp: {
    title: 'Dynamic programming dan strategi problem solving',
    why: "Dynamic programming punya reputasi butuh ilham mendadak. Kenyataannya tidak: ia adalah prosedur yang bisa dipelajari. Dan kebiasaan di baliknya — coba kasus kecil, temukan pekerjaan yang berulang, pilih structure yang tepat — berguna untuk soal apa pun yang belum pernah kamu lihat.",
    points: [
      "DP berlaku kalau sebuah masalah punya **overlapping subproblem** (pertanyaan kecil yang sama ditanyakan berulang kali) dan **optimal substructure** (jawaban terbaik dibangun dari jawaban terbaik subproblem-nya).",
      "Tanda-tanda kamu sedang menghadapi DP: 'ada berapa cara…', 'biaya minimum atau maksimum…', 'bisakah kamu mencapai…', di mana setiap pilihan memengaruhi pilihan yang tersisa nanti.",
      "Prosedurnya: (1) definisikan **state**, apa arti `dp[i]` dalam kata-kata; (2) tulis **recurrence**-nya; (3) tentukan **base case**; (4) tentukan urutan pengisiannya; (5) optimasi space paling akhir.",
      "**Top-down** (recursion plus memo) paling mudah diturunkan. **Bottom-up** (tabel yang diisi berurutan) menghindari recursion yang dalam dan kadang hanya butuh space O(1).",
      "Keluarga klasiknya: 1D (climbing stairs, house robber), pilihan tak terbatas (coin change), dua sequence (longest common subsequence, edit distance), jalur di grid, knapsack.",
      "**Greedy**, mengambil pilihan terbaik saat itu, lebih sederhana tapi hanya benar untuk sebagian masalah. Satu counter-example sudah cukup untuk menggugurkannya.",
      "Untuk soal apa pun yang belum dikenal: kerjakan contoh kecil secara manual; tulis brute force beserta complexity-nya; cari pekerjaan yang terbuang (subproblem berulang → memo, scan berulang → hash map atau sorting, 'yang terkecil berikutnya' → heap); lalu cek edge case: input kosong, satu item, duplikat, n yang sangat besar."
    ],
    practice: "Kerjakan 'Climbing stairs' dan 'Coin change' di bagian interview, dan tulis definisi state sebagai komentar sebelum kode apa pun. Lalu cari kombinasi koin dan jumlah di mana selalu mengambil koin terbesar dulu memberi jawaban yang lebih buruk daripada DP-mu. Terakhir, pilih satu soal di bagian interview yang belum pernah kamu lihat dan tulis langkah-langkah strateginya sebelum menulis kode apa pun.",
    teach: "Jelaskan dynamic programming sebagai 'recursion plus mengingat', pakai Fibonacci, lalu sebutkan lima langkah merancang solusi DP.",
    analogy: "Dynamic programming itu seperti mengerjakan hitungan panjang di kertas dan menulis setiap hasil antara di pinggir halaman. Saat kamu butuh 37 × 12 lagi, kamu tinggal melihat pinggir halaman alih-alih menghitung ulang. Tekniknya adalah menyadari hasil antara mana yang terus kamu butuhkan, dan memutuskan apa yang perlu ditulis di pinggir halaman.",
    pitfalls: [
      "Mulai coding sebelum menyatakan dalam kata-kata apa arti `dp[i]`.",
      "Mencoba greedy pada soal DP tanpa mencari counter-example.",
      "Menghafal solusi alih-alih prosedur lima langkahnya.",
      "Recursion top-down yang dalam pada input besar (n ratusan ribu) membuat stack overflow. Pindah ke bottom-up."
    ],
    quiz: [
      ["Dua sifat apa yang membuat sebuah masalah cocok untuk dynamic programming?", ["Input terurut dan nilai yang unik", "Overlapping subproblem dan optimal substructure", "Solusi recursive dan input kecil", "Solusi greedy yang gagal"], "Subproblem yang berulang membuat caching jadi bermanfaat; optimal substructure membuat penggabungan jawaban yang di-cache jadi benar."],
      ["Apa langkah pertama dalam merancang solusi DP?", ["Optimasi space", "Definisikan dengan tepat apa arti state-nya", "Tulis nested loop-nya", "Tulis dictionary memo-nya"], "Tanpa definisi state yang jelas, recurrence-nya tidak bisa ditulis maupun dicek."],
      ["Kapan algoritma greedy aman dipakai?", ["Kapan pun ia lebih cepat dari DP", "Kalau kamu bisa menjelaskan bahwa pilihan terbaik saat itu tidak pernah menghalangi jawaban terbaik secara keseluruhan", "Kapan pun inputnya terurut", "Tidak pernah di interview"], "Greedy butuh alasan kenapa ia selalu benar. Tanpa alasan itu, satu counter-example sudah cukup untuk mengembalikanmu ke DP."]
    ]
  }
}, { tagline: 'Fondasinya: Git, complexity, data structure, dan algoritma — di balik coding interview dan keputusan performance sehari-hari.' });
