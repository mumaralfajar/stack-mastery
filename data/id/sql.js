// Bahasa Indonesia — track SQL. Contoh kode tetap memakai versi aslinya.
I18N.lessons('sql', {
  select: {
    title: 'Tabel, baris, dan SELECT',
    why: "Hampir semua aplikasi pada dasarnya adalah user interface di atas sebuah database. `SELECT` adalah statement paling berharga yang bisa dipelajari developer, dan cukup mudah dibaca untuk diajarkan sejak hari pertama.",
    points: [
      "Relational database menyimpan data dalam **tabel**. Tiap **baris** adalah satu hal (seorang customer); tiap **kolom** adalah satu atribut (kotanya).",
      "**Primary key** mengidentifikasi tiap baris secara unik — biasanya sebuah `id`.",
      "`SELECT columns FROM table` memilih kolom; `WHERE` memilih baris; `ORDER BY` mengurutkan; `LIMIT` (atau `TOP` / `OFFSET FETCH` di SQL Server) membatasi jumlahnya.",
      "SQL itu **deklaratif**: kamu mendeskripsikan hasil yang kamu mau, bukan langkah-langkah untuk mendapatkannya. Database yang menentukan caranya.",
      "Teks ditulis dalam tanda kutip tunggal: `'Jakarta'`. `LIKE 'A%'` mencocokkan pola. `IN (...)` dan `BETWEEN` meringkas kondisi.",
      "Hindari `SELECT *` di kode aplikasi: sebutkan kolom yang kamu butuhkan."
    ],
    practice: "Buka SQL playground dan selesaikan tiga challenge pertama. Lalu tulis query-mu sendiri: lima produk termahal yang bukan kategori 'Tech'.",
    teach: "Jelaskan apa itu tabel, baris, kolom, dan primary key ke orang yang selama ini hanya pernah memakai spreadsheet.",
    analogy: "Tabel itu spreadsheet dengan aturan ketat: tiap kolom punya satu type dan tiap baris punya ID unik. `SELECT … WHERE` itu seperti meminta ke pustakawan 'tolong bawakan judul dan pengarang semua buku terbitan setelah 2020, dari yang terbaru' — kamu menyebut apa yang kamu mau, bukan rak mana saja yang harus dilewati.",
    pitfalls: [
      "Tanda kutip ganda untuk teks. String memakai kutip tunggal; kutip ganda berarti identifier.",
      "Menganggap baris kembali sesuai urutan insert. Tanpa `ORDER BY`, urutannya tidak dijamin.",
      "Mengira SQL dieksekusi dari atas ke bawah seperti program."
    ],
    quiz: [
      ["Clause mana yang menentukan **baris** mana yang dikembalikan?", ["`SELECT`", "`WHERE`", "`ORDER BY`", "`FROM`"], "`WHERE` memfilter baris; `SELECT` memilih kolom."],
      ["Tanpa `ORDER BY`, urutan barisnya…", ["berdasarkan primary key", "berdasarkan waktu insert", "tidak dijamin", "alfabetis"], "Engine boleh mengembalikan baris dengan urutan apa pun yang paling murah."],
      ["`WHERE name LIKE 'A%'` cocok dengan apa?", ["Nama yang mengandung %", "Nama yang diawali A", "Nama yang diakhiri A", "Persis nama 'A%'"], "`%` adalah wildcard untuk rangkaian karakter apa pun."]
    ]
  },
  dml: {
    title: 'Mengubah data, type, dan NULL',
    why: "`UPDATE` tanpa `WHERE` sudah mengakhiri banyak karier. Mengajarkan kebiasaan aman saat menulis data — dan logika NULL yang aneh — mencegah kesalahan yang tidak bisa dibatalkan.",
    points: [
      "`INSERT INTO t (cols) VALUES (…)` menambah baris; `UPDATE t SET … WHERE …` mengubah baris; `DELETE FROM t WHERE …` menghapus baris.",
      "`UPDATE` atau `DELETE` tanpa `WHERE` mengenai **semua baris**. Tulis `WHERE`-nya dulu, dan tes sebagai `SELECT`.",
      "Pilih type yang presisi: `INT`, `DECIMAL(10,2)` untuk uang, `VARCHAR/NVARCHAR(n)` untuk teks, `DATE`/`DATETIME2`, `BIT`/`BOOLEAN`.",
      "`NULL` berarti **tidak diketahui / tidak ada**, bukan nol dan bukan string kosong.",
      "Perbandingan apa pun dengan NULL menghasilkan unknown: `NULL = NULL` tidak bernilai true. Pakai `IS NULL` / `IS NOT NULL`.",
      "`COALESCE(a, b)` mengembalikan value pertama yang tidak null — cara standar untuk memberi nilai default."
    ],
    practice: "Di playground, insert dirimu sebagai customer, buat satu order untukmu, lalu hapus hanya order itu. Sebelum tiap operasi write, jalankan `SELECT` yang setara dan catat berapa baris yang akan terkena.",
    teach: "Jelaskan kenapa `WHERE city = NULL` tidak mengembalikan baris apa pun, dan apa yang seharusnya ditulis.",
    analogy: "NULL itu amplop tersegel: kamu tidak tahu isinya. Apakah amplop tersegel yang ini sama dengan amplop tersegel yang itu? Kamu tidak bisa menjawab ya atau tidak — jawaban jujurnya 'tidak tahu'. SQL hanya menyimpan baris yang jawabannya pasti ya.",
    pitfalls: [
      "Menjalankan `DELETE FROM orders;` dan baru sadar `WHERE`-nya tidak ada setelahnya.",
      "Memperlakukan NULL sebagai nol dalam aritmetika: `price + NULL` hasilnya NULL.",
      "`NOT IN (subquery)` tidak mengembalikan apa pun karena subquery-nya mengandung NULL."
    ],
    quiz: [
      ["Apa yang dilakukan `UPDATE products SET price = 0;`?", ["Tidak ada, karena tanpa WHERE", "Mengubah harga semua produk jadi 0", "Meminta konfirmasi", "Hanya meng-update baris pertama"], "Tanpa `WHERE`, semua baris cocok."],
      ["Hasil `NULL = NULL` di SQL adalah…", ["true", "false", "unknown", "error"], "Membandingkan dua hal yang tidak diketahui hasilnya unknown; pakai `IS NULL`."],
      ["Apa yang dikembalikan `COALESCE(nickname, name, 'N/A')`?", ["Selalu 'N/A'", "Yang pertama dari ketiganya yang tidak NULL", "Ketiganya digabung", "NULL kalau salah satunya NULL"], "`COALESCE` memeriksa dari kiri ke kanan dan mengembalikan argumen pertama yang tidak null."]
    ]
  },
  aggregate: {
    title: 'GROUP BY, aggregate, dan urutan query',
    why: "Laporan, dashboard, dan analytics semuanya adalah agregasi. Di sini pula murid pertama kali bertanya 'kenapa alias saya tidak bisa dipakai di WHERE?' — jawabannya ada di urutan eksekusi logis.",
    points: [
      "Aggregate melebur banyak baris jadi satu nilai: `COUNT(*)`, `SUM`, `AVG`, `MIN`, `MAX`.",
      "`GROUP BY` membentuk group; tiap group menjadi **satu baris output**.",
      "Setiap kolom yang di-select harus ada di `GROUP BY` atau berada di dalam aggregate.",
      "`WHERE` memfilter baris **sebelum** grouping; `HAVING` memfilter group **setelah** agregasi.",
      "Urutan logis: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`. Itulah kenapa alias dari `SELECT` bisa dipakai di `ORDER BY` tapi tidak di `WHERE`.",
      "`COUNT(*)` menghitung baris; `COUNT(col)` menghitung nilai yang tidak null; `COUNT(DISTINCT col)` menghitung nilai unik."
    ],
    practice: "Di playground, cari total quantity terjual per produk, hanya untuk produk yang terjual lebih dari 3 unit, dari yang tertinggi. Lalu telusuri visualisasinya dan ucapkan dengan lantang apa yang dilakukan tiap clause terhadap baris-barisnya.",
    teach: "Jelaskan perbedaan `WHERE` dan `HAVING`, dan kenapa SQL tidak dijalankan sesuai urutan penulisannya.",
    analogy: "Menyortir koin. Pertama, buang koin asing (`WHERE`). Lalu buat tumpukan per pecahan (`GROUP BY`). Lalu simpan hanya tumpukan yang lebih dari sepuluh koin (`HAVING`). Lalu catat label dan total tiap tumpukan (`SELECT`). Terakhir, urutkan catatannya berdasarkan total (`ORDER BY`).",
    pitfalls: [
      "Menaruh kondisi aggregate di `WHERE`: `WHERE COUNT(*) > 2` itu error.",
      "Men-select kolom yang tidak di-group dan tidak di-aggregate.",
      "Mengira `SELECT` dijalankan pertama karena ditulis pertama."
    ],
    quiz: [
      ["Clause mana yang bisa memfilter berdasarkan `SUM(amount) > 100`?", ["`WHERE`", "`HAVING`", "`ORDER BY`", "`FROM`"], "Aggregate baru ada setelah grouping; `HAVING` dijalankan setelah `GROUP BY`."],
      ["Secara logis, mana yang dijalankan pertama?", ["`SELECT`", "`ORDER BY`", "`FROM`", "`HAVING`"], "Engine harus tahu dulu baris sumbernya sebelum melakukan hal lain."],
      ["Sebuah kolom berisi 5, NULL, 7. Berapa `COUNT(col)`?", ["3", "2", "12", "NULL"], "`COUNT(col)` mengabaikan NULL; `COUNT(*)` hasilnya 3."]
    ]
  },
  joins: {
    title: 'JOIN: menggabungkan tabel',
    why: "Data relasional memang sengaja dipecah ke beberapa tabel. JOIN menyatukannya kembali, dan salah memilih jenis join diam-diam membuang atau menggandakan baris — jenis bug yang paling sulit disadari.",
    points: [
      "Join memasangkan baris dari dua tabel ketika sebuah kondisi terpenuhi, biasanya `foreign key = primary key`.",
      "`INNER JOIN`: hanya pasangan yang cocok di kedua sisi.",
      "`LEFT JOIN`: semua baris dari tabel kiri; kolom kanan yang tidak punya pasangan jadi NULL. Pakai untuk 'semua customer, beserta order-nya kalau ada'.",
      "`RIGHT` dan `FULL OUTER` mempertahankan baris tanpa pasangan dari sisi kanan atau dari kedua sisi. `CROSS JOIN` menghasilkan semua kombinasi.",
      "Join bisa **melipatgandakan baris**: satu customer dengan tiga order muncul tiga kali. Hati-hati saat meng-aggregate setelahnya.",
      "Cari baris yang **tidak** punya pasangan dengan `LEFT JOIN … WHERE right.id IS NULL` atau `NOT EXISTS`."
    ],
    practice: "Pakai visualisasi join untuk menebak jumlah baris tiap jenis join sebelum kamu menggantinya. Lalu, di playground, tampilkan semua customer beserta total belanjanya, dengan 0 untuk customer yang tidak punya order paid.",
    teach: "Jelaskan perbedaan `INNER JOIN` dan `LEFT JOIN` memakai customers dan orders, termasuk apa yang terjadi pada customer yang tidak punya order.",
    analogy: "Dua daftar tamu pernikahan: yang diundang dan yang sudah membalas. INNER JOIN itu 'diundang dan membalas'. LEFT JOIN itu 'semua yang diundang, beserta balasannya kalau ada — kosong kalau belum'. Yang kosong itulah orang-orang yang masih perlu kamu telepon.",
    pitfalls: [
      "Memfilter tabel kanan di `WHERE` setelah `LEFT JOIN`, yang diam-diam mengubahnya kembali jadi inner join. Taruh kondisi itu di `ON`.",
      "`COUNT(*)` setelah left join menghitung baris NULL sebagai 1; hitung kolom dari sisi kanan saja.",
      "Menjumlahkan setelah join ke dua tabel one-to-many sehingga terhitung dobel."
    ],
    quiz: [
      ["Customers punya 4 baris; 1 customer tidak punya order; Orders punya 5 baris, semuanya dengan customer yang valid. Berapa baris yang dikembalikan `customers LEFT JOIN orders`?", ["4", "5", "6", "9"], "Lima pasangan yang cocok ditambah satu customer tanpa order, yang diisi NULL."],
      ["Bagaimana cara mencari customer yang tidak punya order?", ["`INNER JOIN … WHERE o.id = 0`", "`LEFT JOIN … WHERE o.id IS NULL`", "`CROSS JOIN`", "`WHERE orders = NULL`"], "Baris kiri tanpa pasangan membawa NULL di sisi kanan; filter yang itu."],
      ["Setelah `LEFT JOIN orders o`, apa efek menambahkan `WHERE o.status = 'paid'`?", ["Tidak ada", "Membuang customer tanpa order, jadi berperilaku seperti inner join", "Menambah baris NULL", "Menyebabkan error"], "NULL = 'paid' hasilnya unknown, jadi baris tanpa pasangan ikut terbuang. Pindahkan kondisinya ke `ON`."]
    ]
  },
  subqueries: {
    title: 'Subquery dan CTE',
    why: "Pertanyaan nyata datang bertahap: 'dari customer yang belanjanya di atas rata-rata, mana yang…'. Subquery dan CTE membuatmu bisa menyusun jawaban berlapis, yang bisa dibaca, dites, dan diajarkan selapis demi selapis.",
    points: [
      "**Subquery** adalah query di dalam query lain: di `WHERE` (filter berdasarkan nilai atau set hasil hitungan), di `FROM` (derived table), atau di `SELECT` (scalar).",
      "Subquery **correlated** merujuk ke baris di query luar dan secara logis dievaluasi per baris. `EXISTS` adalah pemakaian klasiknya.",
      "`EXISTS` bertanya 'apakah ada minimal satu?' dan berhenti lebih awal; `IN` membandingkan dengan sebuah daftar. Pilih `NOT EXISTS` daripada `NOT IN` karena masalah NULL.",
      "**CTE** (`WITH name AS (…)`) memberi nama pada subquery supaya query utamanya terbaca dari atas ke bawah. Tujuannya readability; ia tidak otomatis meng-cache hasil.",
      "Rangkai beberapa CTE untuk menyusun query selangkah demi selangkah — dan jalankan tiap langkah sendiri saat debugging.",
      "Recursive CTE menelusuri hierarki seperti struktur organisasi dan pohon kategori."
    ],
    practice: "Di playground, cari customer yang total belanjanya di atas rata-rata total belanja customer. Tulis dengan CTE, dan jalankan dulu tiap CTE secara terpisah untuk mengecek baris-baris antaranya.",
    teach: "Jelaskan apa itu CTE dan kenapa kamu memakainya alih-alih subquery bersarang.",
    analogy: "CTE itu memberi nama pada hasil antara di sebuah resep: 'pertama buat sausnya; sebut saja *saus*. Lalu tuang *saus* ke atas pasta.' Subquery bersarang adalah resep yang sama tapi ditulis sebagai satu kalimat tanpa tanda baca.",
    pitfalls: [
      "`NOT IN` dengan subquery yang mengembalikan NULL — seluruh predicate jadi unknown dan tidak ada baris yang dikembalikan.",
      "Menganggap CTE yang dirujuk dua kali hanya dihitung sekali. Di banyak engine, CTE di-expand setiap kali dirujuk.",
      "Scalar subquery di `SELECT` yang jalan per baris padahal join saja sudah cukup."
    ],
    quiz: [
      ["Apa itu correlated subquery?", ["Yang mengembalikan beberapa kolom", "Yang merujuk kolom dari query luar", "Yang ada di dalam CTE", "Yang memakai JOIN"], "Ia bergantung pada baris luar yang sedang diproses, jadi secara logis dievaluasi untuk tiap baris."],
      ["Kenapa `NOT EXISTS` lebih baik daripada `NOT IN (subquery)`?", ["Lebih pendek", "`NOT IN` tidak mengembalikan baris apa pun kalau subquery-nya menghasilkan NULL", "`NOT IN` bukan SQL standar", "`EXISTS` mengurutkan hasil"], "`x NOT IN (1, NULL)` hasilnya unknown untuk setiap x, jadi tidak ada baris yang lolos."],
      ["Tujuan utama CTE adalah…", ["Eksekusi lebih cepat, selalu", "Readability: memberi nama pada satu langkah query", "Membuat tabel permanen", "Me-lock baris"], "CTE adalah expression bernama yang hanya berlaku di dalam query itu. Performance-nya bergantung pada engine."]
    ]
  },
  design: {
    title: 'Desain schema: key, constraint, dan normalisasi',
    why: "Schema yang buruk tidak bisa diperbaiki dengan kode yang bagus. Desain adalah skill database dengan leverage tertinggi, dan harus diajarkan lewat pertanyaan 'apa yang bisa salah kalau kita menyimpannya seperti ini?'",
    points: [
      "Satu tabel per **entity**; satu baris per instance; satu fakta disimpan tepat di **satu tempat**.",
      "**Foreign key** membuat relationship jadi nyata: database menolak order yang menunjuk ke customer yang tidak ada.",
      "Relationship: one-to-many (FK di sisi 'many'), many-to-many (junction table seperti `order_items`), one-to-one (jarang).",
      "**Normalisasi**: 1NF — nilai atomic, tidak ada daftar di dalam satu sel. 2NF/3NF — setiap kolom non-key bergantung pada key, seluruh key, dan hanya key.",
      "Constraint adalah test gratis yang berjalan di setiap write: `NOT NULL`, `UNIQUE`, `CHECK (price >= 0)`, `DEFAULT`.",
      "Lakukan denormalisasi secara sengaja (misalnya menyimpan `unit_price` saat penjualan terjadi) dan pahami alasannya."
    ],
    practice: "Desain schema untuk perpustakaan: buku, pengarang (satu buku bisa punya beberapa), member, dan peminjaman. Tuliskan key dan constraint tiap tabel. Lalu sebutkan satu fakta yang sengaja kamu simpan dua kali, atau jelaskan kenapa itu tidak perlu.",
    teach: "Jelaskan kenapa kita tidak menyimpan nama dan alamat customer di setiap baris order, dan apa yang jadi masalah kalau kita melakukannya.",
    analogy: "Normalisasi itu aturan 'tulis tiap nomor telepon di satu buku alamat, bukan di sticky note yang ditempel di seantero rumah'. Saat temanmu ganti nomor, kamu cukup meng-update satu tempat. Dengan sticky note, kamu memperbaiki tiga dan melewatkan yang keempat — dan sekarang ada dua versi kebenaran.",
    pitfalls: [
      "Daftar yang dipisah koma di dalam satu kolom ('tags: red,blue'). Tidak bisa di-index, di-join, maupun diberi constraint.",
      "Melewatkan foreign key 'demi fleksibilitas' lalu menumpuk orphan row.",
      "Normalisasi yang menghapus histori: sebuah order harus mengingat harga yang dikenakan saat itu."
    ],
    quiz: [
      ["Orders dan products itu many-to-many. Bagaimana memodelkannya?", ["Kolom berisi list di `orders`", "Junction table dengan foreign key ke masing-masing", "Baris product yang diduplikasi", "Field teks `product_ids`"], "Junction table punya satu baris per pasangan dan bisa membawa atribut seperti quantity."],
      ["Apa yang dicegah oleh foreign key constraint?", ["Query lambat", "Baris yang merujuk ke parent row yang tidak ada", "Primary key yang duplikat", "Nilai NULL"], "Ia menegakkan referential integrity di setiap insert, update, dan delete."],
      ["Kenapa `unit_price` disimpan di `order_items` padahal `products` sudah punya `price`?", ["Kesalahan desain", "Penjualan harus menyimpan harga saat pembelian terjadi", "Supaya tidak perlu join", "Foreign key mewajibkannya"], "Itu fakta yang berbeda: harga historis yang dikenakan, bukan harga daftar saat ini."]
    ]
  },
  indexes: {
    title: 'Index: cara database menemukan baris dengan cepat',
    why: "Selisih antara query 5 ms dan query 50 detik biasanya cuma satu index. Inilah konsep performance paling berharga di seluruh stack.",
    points: [
      "Tanpa index, engine membaca semua baris — **scan**, O(n). Dengan index B-tree, engine cukup menuruni beberapa level — **seek**, O(log n).",
      "Index adalah salinan terurut dari beberapa kolom, dengan pointer kembali ke barisnya. Index mempercepat read dan **memperlambat write**, serta memakan storage.",
      "**Clustered index** (secara default primary key di SQL Server) adalah tabel itu sendiri, disimpan sesuai urutan key. Index lainnya non-clustered.",
      "**Composite index** `(a, b)` membantu filter pada `a` atau pada `a AND b`, tapi tidak pada `b` saja — aturan leftmost-prefix. Taruh kolom equality di depan, kolom range sesudahnya.",
      "**Covering index** memuat semua kolom yang dibutuhkan query (kolom `INCLUDE`), sehingga engine tidak perlu mengunjungi tabelnya.",
      "Index-kan kolom di `WHERE`, `JOIN`, dan `ORDER BY` dari query yang sering dijalankan — terutama foreign key. Jangan meng-index semuanya."
    ],
    practice: "Jalankan visualisasi index untuk beberapa target dan catat jumlah read pada scan versus seek. Lalu perkirakan: untuk 1.000.000 baris, kira-kira berapa perbandingan yang dibutuhkan masing-masing? Di playground, pakai `EXPLAIN QUERY PLAN` sebelum dan sesudah membuat index.",
    teach: "Jelaskan kenapa index membuat lookup jadi cepat tapi insert jadi lebih lambat, tanpa memakai kata 'B-tree'.",
    analogy: "Indeks di halaman belakang buku pelajaran: kata kunci terurut beserta nomor halamannya. Mencari 'transaction' cukup beberapa detik, tidak perlu membaca tiap halaman. Tapi setiap kali penulis menambah halaman, indeksnya ikut harus diperbarui — dan indeks untuk setiap kata akan lebih tebal dari bukunya sendiri.",
    pitfalls: [
      "Meng-index semua kolom 'buat jaga-jaga' sehingga semua write jadi lambat.",
      "Berharap index pada `(last_name, first_name)` membantu pencarian berdasarkan `first_name` saja.",
      "Lupa meng-index foreign key, sehingga join dan cascading delete harus scan."
    ],
    quiz: [
      ["Ada index pada `(country, city)`. Filter mana yang bisa seek di index itu?", ["`WHERE city = 'Bandung'`", "`WHERE country = 'ID'`", "Tidak dua-duanya", "`WHERE population > 1000`"], "Composite index bisa dipakai mulai dari kolom paling kirinya; `city` saja bukan prefix."],
      ["Apa biaya utama menambah sebuah index?", ["Read jadi lebih lambat", "Setiap insert, update, dan delete juga harus memelihara index itu", "Query mengembalikan lebih sedikit baris", "Constraint jadi nonaktif"], "Index adalah struktur tambahan yang dijaga tetap sinkron di tiap write, plus storage."],
      ["Index yang 'covering' artinya…", ["Mencakup semua kolom di tabel", "Memuat semua kolom yang dibutuhkan query, jadi tabelnya tidak dibaca", "Dienkripsi", "Itu clustered index"], "Query-nya dijawab dari index saja, tanpa lookup."]
    ]
  },
  transactions: {
    title: 'Transaction, ACID, dan isolation',
    why: "Transfer uang, pengurangan stok, dan pembuatan order harus all-or-nothing dan tetap benar di bawah concurrency. Setiap developer yang menulis ke database butuh model ini.",
    points: [
      "**Transaction** menggabungkan beberapa statement jadi satu unit: `BEGIN` … `COMMIT`, atau `ROLLBACK` untuk membatalkan semuanya.",
      "**ACID**: Atomic (semua atau tidak sama sekali), Consistent (constraint tetap terpenuhi), Isolated (transaction yang concurrent tidak saling merusak), Durable (data yang sudah di-commit selamat dari crash).",
      "Anomali concurrency: **dirty read** (melihat data yang belum di-commit), **non-repeatable read** (baris berubah di antara dua kali baca), **phantom** (muncul baris baru), **lost update** (dua writer saling menimpa).",
      "**Isolation level** menukar keamanan dengan concurrency: Read Uncommitted → Read Committed (default yang umum) → Repeatable Read → Serializable; plus Snapshot (row versioning).",
      "Jaga transaction tetap **singkat**: jangan ada waktu tunggu user dan jangan ada panggilan HTTP di dalamnya.",
      "Hindari race read-then-write dengan statement yang atomic (`UPDATE … SET stock = stock - 1 WHERE stock > 0`) atau optimistic concurrency."
    ],
    practice: "Buka dua sesi database. Di sesi pertama, mulai transaction dan update satu baris tanpa commit. Di sesi kedua, coba baca lalu update baris yang sama. Catat apa yang terjadi di isolation level default engine-mu, lalu commit dan amati.",
    teach: "Jelaskan arti 'atomic' di ACID memakai contoh transfer bank, dan apa yang akan dilihat user tanpa itu.",
    analogy: "Transaction itu membeli di vending machine: kamu dapat snack-nya dan mesin menyimpan uangmu, atau uangmu kembali dan snack-nya tetap di mesin. Tidak ada kondisi di mana uangmu hilang dan snack-nya nyangkut. Isolation adalah aturan bahwa dua orang tidak bisa sama-sama membeli snack terakhir.",
    pitfalls: [
      "Baca nilai di aplikasi, hitung, lalu tulis balik — lost update klasik.",
      "Membiarkan transaction terbuka selagi memanggil API eksternal.",
      "Menganggap isolation level default mencegah semua anomali. Read Committed masih membolehkan non-repeatable read dan phantom."
    ],
    quiz: [
      ["Sebuah transfer mendebit rekening A, lalu server crash sebelum mengkredit B. Dengan transaction, apa hasilnya setelah restart?", ["A terdebit, B tidak terkredit", "Tidak satu pun perubahan diterapkan", "B terkredit dua kali", "Database-nya corrupt"], "Atomicity: transaction yang belum di-commit di-rollback seluruhnya saat recovery."],
      ["Anomali mana yang berarti 'membaca data yang belum di-commit transaction lain'?", ["Phantom", "Dirty read", "Lost update", "Deadlock"], "Dirty read hanya mungkin terjadi di Read Uncommitted."],
      ["Cara paling aman mengurangi stok di bawah concurrency?", ["`SELECT` lalu `UPDATE` dengan nilai hasil hitungan", "`UPDATE … SET stock = stock - 1 WHERE stock > 0` lalu cek jumlah baris yang terpengaruh", "Cache stok di memory", "Pakai `SELECT *`"], "Satu statement atomic tidak bisa disela oleh read-modify-write milik writer lain."]
    ]
  },
  window: {
    title: 'Window function',
    why: "Ranking, running total, perbandingan dengan 'baris sebelumnya', dan top-N per group adalah kebutuhan reporting sehari-hari yang menyiksa tanpa window function dan cukup satu baris dengan window function.",
    points: [
      "Window function menghitung lintas baris yang berkaitan **tanpa meleburnya** — beda dengan `GROUP BY`, setiap baris input tetap ada.",
      "`OVER (PARTITION BY x ORDER BY y)` mendefinisikan window-nya: partition adalah group-nya, order menentukan urutan di dalam tiap partition.",
      "Ranking: `ROW_NUMBER()` (unik 1, 2, 3), `RANK()` (nilai seri mendapat rank sama, lalu ada lompatan), `DENSE_RANK()` (nilai seri mendapat rank sama, tanpa lompatan).",
      "Aggregate sebagai window: `SUM(amount) OVER (ORDER BY date)` adalah running total; tanpa `ORDER BY`, hasilnya total partition di setiap baris.",
      "`LAG` dan `LEAD` membaca baris sebelumnya dan sesudahnya — ideal untuk perubahan antar-periode.",
      "Top-N per group: nomori baris di dalam CTE dengan `ROW_NUMBER()`, lalu filter `WHERE rn <= N` di luarnya."
    ],
    practice: "Di playground, tampilkan dua produk termahal di tiap kategori. Lalu tambahkan kolom yang menunjukkan harga tiap produk sebagai persentase dari total kategorinya.",
    teach: "Jelaskan apa bedanya `SUM(x) OVER (PARTITION BY c)` dengan `SUM(x) … GROUP BY c`.",
    analogy: "`GROUP BY` memasukkan murid tiap kelas ke satu bus lalu melaporkan satu angka per bus. Window function membiarkan setiap murid tetap di bangkunya dan membagikan secarik catatan ke masing-masing: 'kamu tertinggi ke-3 di kelasmu; rata-rata kelas 160 cm'.",
    pitfalls: [
      "Mencoba memfilter hasil window function di `WHERE`. Window dihitung setelah `WHERE`; bungkus dalam CTE.",
      "Memakai `RANK()` padahal butuh tepat satu baris per group — nilai seri mengembalikan beberapa baris. Pakai `ROW_NUMBER()`.",
      "Lupa `ORDER BY` di running total sehingga yang muncul grand total di setiap baris."
    ],
    quiz: [
      ["Nilai 90, 90, 80. Apa yang diberikan `RANK()` (descending)?", ["1, 2, 3", "1, 1, 2", "1, 1, 3", "1, 2, 2"], "`RANK` memberi rank yang sama untuk nilai seri lalu melompat; `DENSE_RANK` akan memberi 1, 1, 2."],
      ["Berapa baris yang dikembalikan window function dibanding input-nya?", ["Satu per partition", "Jumlahnya sama", "Satu", "Dua kali lipat"], "Window function menambah kolom; ia tidak melebur baris."],
      ["Function mana yang membaca nilai baris sebelumnya?", ["`LEAD`", "`LAG`", "`FIRST_VALUE`", "`NTILE`"], "`LAG` melihat ke belakang; `LEAD` melihat ke depan."]
    ]
  },
  plans: {
    title: 'Execution plan dan query tuning',
    why: "Tuning itu bukan tebak-tebakan: execution plan memberitahumu persis apa yang dikerjakan engine dan kenapa. Seorang expert membaca plan seperti dokter membaca hasil rontgen.",
    points: [
      "**Optimizer** memilih plan berdasarkan **statistics** tentang distribusi data. Statistics yang basi menghasilkan estimasi baris yang buruk dan plan yang buruk.",
      "Baca plan dengan membandingkan **estimated rows versus actual rows** dan mencari operator termahal: scan, key lookup, sort, hash spill.",
      "Algoritma join: **nested loops** (outer input kecil, inner ber-index), **hash join** (input besar yang tidak terurut), **merge join** (kedua input terurut).",
      "Predicate yang **sargable** bisa memakai index seek. Membungkus kolom dengan function (`WHERE YEAR(order_date) = 2026`) atau wildcard di depan (`LIKE '%x'`) memaksa scan.",
      "Implicit conversion (membandingkan kolom `VARCHAR` dengan parameter `NVARCHAR`) diam-diam mematikan seek.",
      "**Parameter sniffing**: plan yang di-compile untuk satu nilai parameter dipakai ulang untuk nilai yang sangat berbeda. Diagnosis dengan Query Store; atasi dengan index yang lebih baik, `OPTION (RECOMPILE)`, atau plan guide — dengan urutan itu."
    ],
    practice: "Ambil query paling lambat di salah satu project-mu. Tangkap actual plan dan I/O statistics-nya, tuliskan hipotesismu, ubah tepat satu hal (index atau rewrite), lalu ukur lagi. Sajikan sebagai sebelum / perubahan / sesudah.",
    teach: "Jelaskan arti 'sargable' dan kenapa `WHERE YEAR(order_date) = 2026` tidak bisa memakai index pada `order_date`.",
    analogy: "Buku telepon diurutkan berdasarkan nama belakang. 'Semua yang bernama Smith' cukup sekali buka (seek). 'Semua yang nama belakangnya berakhiran -son' atau 'semua yang nama belakangnya, kalau dibalik, diawali N' berarti membaca setiap halaman — urutannya tidak lagi membantu, karena yang kamu tanyakan adalah hasil transformasi dari key, bukan key-nya.",
    pitfalls: [
      "Menambah index berdasarkan intuisi, bukan dengan membaca plan.",
      "Mempercayai estimated plan padahal jumlah baris aktualnya jauh berbeda.",
      "Pagination `OFFSET` yang dalam, yang membaca lalu membuang ribuan baris per halaman."
    ],
    quiz: [
      ["Predicate mana yang bisa memakai index seek pada `order_date`?", ["`WHERE YEAR(order_date) = 2026`", "`WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'`", "`WHERE CAST(order_date AS TEXT) LIKE '2026%'`", "`WHERE order_date + 1 > '2026-01-01'`"], "Hanya range pada kolom polosnya yang sargable; yang lain menerapkan function atau expression ke kolom itu."],
      ["Estimated rows: 10. Actual rows: 900.000. Penyebab paling mungkin?", ["Terlalu banyak index", "Statistics yang basi atau menyesatkan, atau parameter sniffing", "Latency network", "RAM terlalu besar"], "Optimizer memilih plan untuk input yang sangat kecil; perbaiki estimasinya, plan-nya akan mengikuti."],
      ["Algoritma join mana yang cocok untuk outer input kecil dengan index di tabel inner?", ["Hash join", "Nested loops", "Merge join", "Cross join"], "Nested loops melakukan satu index seek yang murah untuk tiap baris outer."]
    ]
  },
  locking: {
    title: 'Locking, deadlock, dan MVCC',
    why: "Ketika aplikasi timeout 'secara acak' saat beban tinggi, penyebabnya biasanya blocking. Seorang expert bisa menjelaskan siapa menunggu siapa, lalu mendesain ulang pola aksesnya supaya tidak saling menunggu.",
    points: [
      "Engine yang pessimistic memakai **lock**: shared (S) untuk read, exclusive (X) untuk write. Writer mem-block reader dan reader mem-block writer, di level row, page, atau table.",
      "**MVCC** (multi-version concurrency control) menyimpan versi lama sebuah baris sehingga reader melihat snapshot yang konsisten dan **tidak pernah mem-block writer**. PostgreSQL selalu bekerja seperti ini; SQL Server juga kalau `READ_COMMITTED_SNAPSHOT` dinyalakan.",
      "**Deadlock** adalah sebuah siklus: T1 memegang A dan menginginkan B, T2 memegang B dan menginginkan A. Engine mematikan salah satunya sebagai victim (error 1205 di SQL Server).",
      "Cegah deadlock: sentuh tabel dan baris dengan **urutan yang konsisten**, jaga transaction tetap singkat, tambahkan index supaya statement me-lock lebih sedikit baris, dan retry victim-nya.",
      "Lock escalation dan scan menyebabkan blocking yang tidak terduga: `UPDATE … WHERE` tanpa index bisa me-lock jauh lebih banyak baris daripada yang diubahnya.",
      "Diagnosis dengan deadlock graph, blocked-process report, `sys.dm_tran_locks` / `pg_locks`."
    ],
    practice: "Reproduksi deadlock di atas dengan dua sesi. Tangkap error dan deadlock graph-nya. Lalu perbaiki dengan mengatur urutan, dan secara terpisah dengan menambah retry di kode aplikasi. Perbaikan mana yang akan kamu rilis, dan kenapa dua-duanya?",
    teach: "Jelaskan bagaimana deadlock terjadi memakai dua transfer di antara dua rekening yang sama, dan satu cara mencegahnya.",
    analogy: "Dua orang berpapasan di lorong sempit, masing-masing memegang separuh dari kunci dua bagian dan meraih separuh milik lawannya. Tidak ada yang mau melepas duluan. Database adalah manajer yang menepuk pundak salah satunya: 'taruh punyamu, mundur, coba lagi.' Kalau semua sepakat selalu mengambil bagian kiri dulu, hal itu tidak akan pernah terjadi.",
    pitfalls: [
      "Menganggap deadlock sebagai bug database, padahal itu bug urutan akses.",
      "Menebar hint `NOLOCK` untuk menyembunyikan blocking, dengan konsekuensi dirty read dan hasil yang tidak konsisten.",
      "Tidak me-retry deadlock victim — deadlock adalah error sementara yang memang sudah diperkirakan."
    ],
    quiz: [
      ["Apa cara standar mencegah deadlock antar-transaction yang meng-update baris yang sama?", ["Pakai `NOLOCK`", "Akses baris-barisnya dengan urutan yang konsisten", "Pakai transaction yang lebih panjang", "Hapus index"], "Kalau semua mengambil lock dengan urutan yang sama, siklus tidak mungkin terbentuk."],
      ["Dengan MVCC / read committed berbasis snapshot, read yang berjalan lama…", ["mem-block semua writer", "melihat versi yang konsisten dan tidak mem-block writer", "melihat data yang belum di-commit", "me-lock tabel"], "Reader memakai row version, bukan shared lock."],
      ["Apa yang seharusnya dilakukan kode aplikasi ketika terpilih jadi deadlock victim?", ["Crash", "Retry seluruh transaction", "Abaikan error-nya", "Ganti database"], "Transaction-nya sudah di-rollback dengan bersih; retry itu aman dan memang diharapkan."]
    ]
  },
  scale: {
    title: 'Scaling dan mengembangkan database',
    why: "Schema berubah dan data bertambah sementara sistem harus tetap online. Seorang expert merencanakan migration yang tidak mungkin menyebabkan downtime, dan bisa menjelaskan trade-off tiap opsi scaling sebelum memakainya.",
    points: [
      "Scaling secara berurutan: perbaiki query dan index → cache → scale up → **read replica** → **partitioning** → **sharding**. Tiap langkah menambah biaya operasional.",
      "Read replica mengambil alih beban read, tapi selalu tertinggal sedikit: read-your-own-writes perlu perhatian khusus.",
      "**Partitioning** memecah satu tabel berdasarkan key (sering kali tanggal) demi kemudahan pengelolaan dan partition elimination; **sharding** menyebar data ke beberapa server dan membuat query serta transaction lintas shard jadi sulit.",
      "**Zero-downtime migration** memakai **expand → migrate → contract**: tambahkan kolom baru yang nullable, tulis ke keduanya, backfill secara bertahap per batch, pindahkan read, dan baru belakangan hapus kolom lama.",
      "Setiap deploy harus bisa bekerja dengan schema **sebelum dan sesudah** migration, karena versi lama dan versi baru aplikasi berjalan berdampingan.",
      "Kenali tool di luar baris biasa: kolom JSON, full-text search, materialized view, dan kapan store lain (cache, search index, queue) adalah jawaban yang tepat."
    ],
    practice: "Tulis rencana migration lengkap — SQL beserta rilis aplikasi yang sepadan — untuk memecah kolom `name` menjadi `first_name` dan `last_name` pada tabel berisi 50 juta baris tanpa maintenance window. Tentukan langkah mana yang paling sulit di-rollback.",
    teach: "Jelaskan pola expand–migrate–contract dan kenapa me-rename kolom dalam satu langkah merusak aplikasi yang sedang berjalan.",
    analogy: "Mengganti jembatan tanpa menutup jalan: bangun jembatan baru di samping yang lama (expand), pindahkan lalu lintas lajur demi lajur (migrate), dan bongkar jembatan lama hanya setelah tidak ada lagi yang memakainya (contract). Meledakkan jembatan lama lebih dulu memang lebih cepat, tapi semua orang tercebur ke sungai.",
    pitfalls: [
      "Sharding sebelum index, caching, dan replica dimanfaatkan habis.",
      "Satu `UPDATE` backfill raksasa yang me-lock tabel bermenit-menit dan membengkakkan log.",
      "Menganggap read dari replica sudah terkini sesaat setelah write."
    ],
    quiz: [
      ["Langkah pertama rename kolom tanpa downtime?", ["Hapus kolom lama", "Tambahkan kolom baru berdampingan dengan yang lama", "Rename langsung di tempat", "Hentikan aplikasinya"], "Expand dulu supaya versi lama dan versi baru aplikasi tetap bisa jalan."],
      ["User menyimpan profil, halaman berikutnya membaca dari replica dan menampilkan nilai lama. Kenapa?", ["Bug di SQL", "Replication lag: replica belum menerapkan write itu", "Cache-nya penuh", "Deadlock"], "Replica yang asynchronous itu eventually consistent; arahkan read-your-writes ke primary."],
      ["Apa yang membuat sharding mahal dibanding partitioning di dalam satu server?", ["Index berhenti bekerja", "Join dan transaction lintas shard sulit atau mustahil", "Butuh RAM lebih banyak", "Backup dilarang"], "Data di server yang berbeda tidak bisa di-join atau di-commit secara atomic oleh engine."]
    ]
  }
}, { tagline: 'Datanya: query, modelling, indexing, transaction, dan tuning.' });
