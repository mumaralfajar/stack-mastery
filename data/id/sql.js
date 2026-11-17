// Bahasa Indonesia — track SQL. Contoh kode tetap memakai versi aslinya.
I18N.lessons('sql', {
  select: {
    title: 'Tabel, baris, dan SELECT',
    why: "Kebanyakan aplikasi adalah antarmuka di atas sebuah database, dan `SELECT` adalah cara mengambil datanya kembali. Bacaannya hampir seperti bahasa Inggris biasa, jadi cocok sebagai cara pertama untuk 'berbicara' dengan data. Contoh di track ini memakai SQL Server, pasangan yang umum untuk ASP.NET Core.",
    points: [
      "Database relasional menyimpan data dalam **tabel**. Setiap **baris** adalah satu hal (seorang customer); setiap **kolom** adalah satu atribut (kotanya).",
      "**Primary key** mengidentifikasi setiap baris secara unik, biasanya berupa `id`.",
      "`SELECT columns FROM table` memilih kolom; `WHERE` memilih baris; `ORDER BY` mengurutkan; `TOP (n)` mengambil n baris pertama. `OFFSET … FETCH` dipakai untuk paging.",
      "SQL itu **deklaratif**: kamu menjelaskan hasil yang kamu mau, bukan langkah-langkah untuk mendapatkannya. Database yang memutuskan caranya.",
      "Teks ditulis dalam tanda kutip tunggal: `'Jakarta'`. `LIKE 'A%'` mencocokkan pola; `IN (...)` dan `BETWEEN` mempersingkat kondisi.",
      "Kamu akan sering melihat `N'Jakarta'` di kode SQL Server. Huruf `N` menandai teks Unicode untuk kolom `NVARCHAR`; tanpa itu, karakter di luar code page database bisa berubah jadi `?`.",
      "Apakah `LIKE` dan `=` membedakan huruf besar dan kecil tergantung pada **collation** kolomnya. Kebanyakan database SQL Server secara default tidak membedakannya.",
      "Playground menjalankan SQLite, yang menulis `LIMIT 3` di akhir query, sedangkan SQL Server menulis `TOP (3)` setelah `SELECT`."
    ],
    practice: "Buka SQL playground dan selesaikan tiga challenge pertama, pakai `LIMIT` di tempat contoh di sini memakai `TOP`. Lalu tulis query-mu sendiri: lima produk termahal yang bukan kategori 'Tech'. Di playground, `price * 1.11` menampilkan `1332.0000000000002`, karena SQLite tidak punya type desimal yang persis; di sana, bungkus dengan `ROUND(…, 2)`.",
    teach: "Jelaskan apa itu tabel, baris, kolom, dan primary key ke orang yang selama ini hanya pernah memakai spreadsheet.",
    analogy: "`SELECT … WHERE … ORDER BY` itu seperti meminta ke pustakawan: 'tolong ambilkan judul dan pengarang semua buku yang terbit setelah 2020, yang terbaru dulu.' Kamu menyebutkan apa yang kamu mau, bukan rak mana saja yang harus dilewati.",
    pitfalls: [
      "Memakai tanda kutip ganda untuk teks. Di SQL Server (dengan setting standar `QUOTED_IDENTIFIER ON` yang dipakai SSMS dan .NET) dan di PostgreSQL, `\"Tech\"` berarti kolom bernama Tech, dan query-nya gagal. SQLite diam-diam menerimanya, jadi playground tidak akan memperingatkanmu.",
      "Menganggap baris kembali sesuai urutan dimasukkan. Tanpa `ORDER BY`, urutannya tidak dijamin.",
      "`TOP (3)` tanpa `ORDER BY`. Yang kamu dapat adalah tiga baris sembarang, bukan tiga teratas.",
      "Membaca SQL seolah-olah dijalankan dari atas ke bawah seperti program. Materi GROUP BY menunjukkan urutan sebenarnya."
    ],
    quiz: [
      ["Clause mana yang memilih **baris** mana saja yang dikembalikan?", ["`SELECT`", "`WHERE`", "`ORDER BY`", "`TOP`"], "`WHERE` memfilter baris; `SELECT` memilih kolom; `TOP` hanya memotong daftar setelah diurutkan."],
      ["Tanpa `ORDER BY`, urutan barisnya…", ["sesuai primary key", "sesuai waktu dimasukkan", "tidak dijamin", "selalu sesuai clustered index"], "Di tabel kecil, urutannya sering terlihat seperti urutan primary key, dan karena itulah orang mengandalkannya. Plan paralel atau index baru bisa mengubahnya kapan saja."],
      ["Apa yang dicocokkan oleh `WHERE name LIKE 'A%'`?", ["Nama yang mengandung karakter %", "Nama yang diawali huruf A", "Nama yang diakhiri huruf A", "Persis nama 'A%'"], "`%` adalah wildcard untuk urutan karakter apa pun, termasuk kosong."],
      ["`SELECT TOP (3) name FROM products;` tanpa `ORDER BY` mengembalikan…", ["3 produk termahal", "3 produk termurah", "3 baris sembarang", "3 produk yang paling baru ditambahkan"], "`TOP` mengambil baris pertama dari urutan apa pun yang dimiliki hasilnya, dan tanpa `ORDER BY` tidak ada urutan yang dijanjikan."]
    ]
  },
  dml: {
    title: 'Mengubah data, type, dan NULL',
    why: "Membaca data tidak bisa merugikan siapa pun; menulisnya bisa. Materi ini tentang kebiasaan yang mencegah `UPDATE` yang keliru sampai mengenai semua baris, dan tentang `NULL`, yang aturannya berbeda dari semua value lain.",
    points: [
      "`INSERT INTO t (cols) VALUES (…)` menambah baris; `UPDATE t SET … WHERE …` mengubah baris; `DELETE FROM t WHERE …` menghapus baris.",
      "`UPDATE` atau `DELETE` tanpa `WHERE` mengenai **semua baris**. Tulis `WHERE`-nya dulu, lalu jalankan sebagai `SELECT` untuk melihat baris mana yang kena.",
      "Untuk perubahan yang berisiko, bungkus dengan transaction: `BEGIN TRANSACTION`, lakukan perubahannya, cek jumlah barisnya, lalu `COMMIT` atau `ROLLBACK`.",
      "Pilih type yang tepat: `INT`, `DECIMAL(10,2)` untuk uang, `NVARCHAR(n)` untuk teks, `DATE` atau `DATETIME2` untuk waktu, `BIT` untuk true/false.",
      "`NULL` berarti **tidak diketahui atau tidak ada**: bukan nol, dan bukan string kosong.",
      "Perbandingan apa pun dengan NULL menghasilkan unknown: `NULL = NULL` tidak bernilai true. Pakai `IS NULL` dan `IS NOT NULL`.",
      "`COALESCE(a, b)` mengembalikan value pertama yang tidak NULL, cara standar untuk memberi nilai default."
    ],
    practice: "Di playground, masukkan dirimu sebagai customer, buat satu order dengan satu item, lalu hapus order itu. Sebelum setiap perubahan, jalankan `SELECT` yang sepadan dan catat berapa baris yang akan terkena. Kamu harus menghapus item-nya dulu sebelum order-nya: itulah foreign key yang sedang bekerja.",
    teach: "Jelaskan kenapa `WHERE city = NULL` tidak mengembalikan baris apa pun, dan apa yang seharusnya ditulis.",
    analogy: "NULL itu amplop tertutup: kamu tidak tahu isinya. Apakah amplop tertutup ini sama dengan amplop tertutup yang itu? Kamu tidak bisa menjawab ya atau tidak; jawaban jujurnya adalah 'tidak tahu'. SQL hanya menyimpan baris yang jawabannya pasti ya.",
    pitfalls: [
      "Menjalankan `DELETE FROM orders;` lalu baru sadar `WHERE`-nya lupa. Di dalam transaction, kamu masih bisa me-rollback-nya.",
      "Memperlakukan NULL seperti nol dalam aritmetika: `price + NULL` hasilnya NULL.",
      "`NOT IN (subquery)` tidak mengembalikan apa-apa karena subquery-nya mengandung NULL.",
      "Berharap `DELETE` pada baris parent ikut menghapus child-nya. Foreign key memblokirnya, kecuali relasinya dibuat dengan `ON DELETE CASCADE`."
    ],
    quiz: [
      ["Apa yang dilakukan `UPDATE products SET price = 0;`?", ["Tidak ada; `UPDATE` wajib pakai `WHERE`", "Mengubah harga semua produk jadi 0", "Hanya mengubah baris yang harganya NULL", "Hanya mengubah baris pertama"], "Tanpa `WHERE`, semua baris cocok."],
      ["Hasil `NULL = NULL` di SQL adalah…", ["true", "false", "unknown", "error"], "Membandingkan dua hal yang tidak diketahui hasilnya juga tidak diketahui; pakai `IS NULL`."],
      ["Apa yang dikembalikan `COALESCE(nickname, name, 'N/A')`?", ["Selalu 'N/A'", "Yang pertama dari ketiganya yang tidak NULL", "Ketiganya digabung jadi satu", "NULL kalau salah satunya NULL"], "`COALESCE` memeriksa dari kiri ke kanan dan mengembalikan argumen pertama yang tidak NULL."]
    ]
  },
  aggregate: {
    title: 'GROUP BY, aggregate, dan urutan query',
    why: "Laporan dan dashboard sebagian besar isinya aggregation: total, jumlah, dan rata-rata per sesuatu. Di sini juga kamu pertama kali bertemu pertanyaan 'kenapa alias-ku tidak bisa dipakai di `WHERE`?', dan jawabannya, urutan SQL yang sebenarnya, menjelaskan banyak kejutan berikutnya.",
    points: [
      "Aggregate merangkum banyak baris jadi satu value: `COUNT(*)`, `SUM`, `AVG`, `MIN`, `MAX`.",
      "`GROUP BY` membentuk kelompok; setiap kelompok menjadi **satu baris output**.",
      "Setiap kolom yang di-select harus ada di `GROUP BY` atau berada di dalam aggregate.",
      "`WHERE` memfilter baris **sebelum** pengelompokan; `HAVING` memfilter kelompok **setelah** aggregation.",
      "Urutan logisnya: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `TOP`/`OFFSET`. Itulah kenapa alias dari `SELECT` bisa dipakai di `ORDER BY` tapi tidak di `WHERE`.",
      "`COUNT(*)` menghitung baris; `COUNT(col)` menghitung value yang tidak NULL; `COUNT(DISTINCT col)` menghitung value yang unik.",
      "SQLite di playground lebih longgar daripada SQL Server: ia menerima alias di `WHERE` dan kolom polos di sebelah aggregate. SQL Server menolak keduanya, begitu juga PostgreSQL."
    ],
    practice: "Pakai playground untuk mencari total quantity yang terjual per produk, hanya untuk produk yang terjual lebih dari 3 unit, dari yang terbanyak. Lalu jalankan visualisasinya langkah demi langkah dan ucapkan dengan lantang apa yang dilakukan tiap clause terhadap baris-barisnya.",
    teach: "Jelaskan perbedaan `WHERE` dan `HAVING`, dan kenapa SQL tidak dijalankan sesuai urutan penulisannya.",
    analogy: "Menyortir koin. Pertama, buang koin asing (`WHERE`). Lalu buat tumpukan per pecahan (`GROUP BY`). Lalu simpan hanya tumpukan yang lebih tinggi dari sepuluh koin (`HAVING`). Lalu catat label dan total tiap tumpukan (`SELECT`). Terakhir, urutkan catatannya berdasarkan total (`ORDER BY`).",
    pitfalls: [
      "Menaruh kondisi aggregate di `WHERE`: `WHERE COUNT(*) > 2` itu error.",
      "Men-select kolom yang tidak dikelompokkan dan tidak di-aggregate. SQL Server menghentikanmu; SQLite diam-diam mengambil value dari baris sembarang, dan itu lebih buruk.",
      "`AVG` pada kolom `INT` mengembalikan `INT` di SQL Server: rata-rata 1 dan 2 adalah 1. Cast dulu: `AVG(CAST(quantity AS DECIMAL(10,2)))`."
    ],
    quiz: [
      ["Clause mana yang bisa memfilter `SUM(amount) > 100`?", ["`WHERE`", "`HAVING`", "`ORDER BY`", "`GROUP BY`"], "Aggregate baru ada setelah pengelompokan; `HAVING` dijalankan setelah `GROUP BY`."],
      ["Secara logis, mana yang dijalankan pertama?", ["`SELECT`", "`WHERE`", "`FROM`", "`GROUP BY`"], "Engine harus tahu baris sumbernya dulu sebelum bisa memfilter atau mengelompokkannya."],
      ["Sebuah kolom berisi value 5, NULL, 7. Berapa `COUNT(col)`?", ["3", "2", "12", "NULL"], "`COUNT(col)` mengabaikan NULL; `COUNT(*)` akan menghasilkan 3."],
      ["`quantity` adalah kolom `INT` berisi 1 dan 2. Apa yang dikembalikan `AVG(quantity)` di SQL Server?", ["1.5", "1", "2", "NULL"], "Rata-rata dari integer adalah integer di SQL Server, dan pecahannya dibuang. Cast ke `DECIMAL` dulu untuk mendapat 1.5."]
    ]
  },
  joins: {
    title: 'JOIN: menggabungkan tabel',
    why: "Data relasional sengaja dipecah ke beberapa tabel, dan join menyatukannya kembali. Salah memilih jenis join tidak menimbulkan error: baris diam-diam hilang atau terduplikasi, dan angkanya jadi salah begitu saja.",
    points: [
      "Join memasangkan baris dari dua tabel yang memenuhi sebuah kondisi, biasanya `foreign key = primary key`.",
      "`INNER JOIN`: hanya pasangan yang cocok di kedua sisi.",
      "`LEFT JOIN`: semua baris dari tabel kiri; kolom kanan yang tidak punya pasangan menjadi NULL. Pakai untuk 'semua customer, beserta order-nya kalau ada'.",
      "`RIGHT` dan `FULL OUTER` menyimpan baris tanpa pasangan dari sisi kanan atau dari kedua sisi. `CROSS JOIN` menghasilkan semua kombinasi.",
      "Join bisa **melipatgandakan baris**: satu customer dengan tiga order muncul tiga kali. Hati-hati saat meng-aggregate setelahnya.",
      "Cari baris yang **tidak** punya pasangan dengan `LEFT JOIN … WHERE right.id IS NULL` atau `NOT EXISTS`."
    ],
    practice: "Pakai join visualizer untuk menebak jumlah baris tiap jenis join sebelum berpindah ke join itu. Lalu, di playground, tampilkan setiap customer beserta total belanjanya, dengan angka 0 untuk customer yang tidak punya order berstatus paid.",
    teach: "Jelaskan perbedaan `INNER JOIN` dan `LEFT JOIN` memakai customer dan order, termasuk apa yang terjadi pada customer yang tidak punya order.",
    analogy: "Dua daftar tamu pernikahan: orang yang diundang dan orang yang sudah membalas. INNER JOIN adalah 'diundang dan sudah membalas'. LEFT JOIN adalah 'semua yang diundang, beserta balasannya kalau ada, kosong kalau tidak'. Yang kosong itulah orang-orang yang masih perlu kamu telepon.",
    pitfalls: [
      "Memfilter tabel kanan di `WHERE` setelah `LEFT JOIN`, yang diam-diam mengubahnya kembali jadi inner join. Taruh kondisi itu di `ON`.",
      "`COUNT(*)` setelah left join ikut menghitung baris NULL sebagai 1; hitung kolom dari sisi kanan saja.",
      "Menggabungkan dua tabel one-to-many (misalnya order dan payment) ke parent yang sama, lalu menjumlahkannya. Setiap order dipasangkan dengan setiap payment, dan totalnya jadi berlipat."
    ],
    quiz: [
      ["Customers punya 4 baris; 1 customer tidak punya order; Orders punya 5 baris, semuanya dengan customer yang valid. Berapa baris yang dikembalikan `customers LEFT JOIN orders`?", ["4", "5", "6", "9"], "Lima pasangan yang cocok ditambah satu customer tanpa order, yang diisi NULL."],
      ["Bagaimana cara mencari customer yang tidak punya order?", ["`INNER JOIN … WHERE o.id IS NULL`", "`LEFT JOIN … WHERE o.id IS NULL`", "`LEFT JOIN … ON o.customer_id = c.id AND o.id IS NULL`", "`RIGHT JOIN … WHERE c.id IS NULL`"], "Baris kiri yang tidak punya pasangan membawa NULL di sisi kanan, jadi filter baris-baris itu setelah join. Menaruh pengecekannya di `ON` malah menyimpan semua customer."],
      ["Setelah `LEFT JOIN orders o`, menambahkan `WHERE o.status = 'paid'` berakibat apa?", ["Tidak ada yang berubah", "Customer tanpa order ikut terbuang, jadi berperilaku seperti inner join", "Semua customer tetap ada, tapi order yang belum dibayar dikosongkan", "Menyebabkan error"], "NULL = 'paid' bernilai unknown, jadi baris tanpa pasangan tersaring. Mengosongkan order yang belum dibayar adalah hasil dari memindahkan kondisinya ke `ON`."]
    ]
  },
  subqueries: {
    title: 'Subquery dan CTE',
    why: "Pertanyaan sungguhan datang bertahap: 'dari customer yang belanjanya di atas rata-rata, mana yang…'. Subquery dan CTE membuatmu bisa membangun jawabannya lapis demi lapis, dan tiap lapisnya bisa dibaca dan dicek satu per satu.",
    points: [
      "**Subquery** adalah query di dalam query lain: di `WHERE` (filter berdasarkan value atau himpunan hasil hitungan), di `FROM` (derived table), atau di `SELECT` (satu value).",
      "Subquery **correlated** merujuk ke baris luar dan secara logis dievaluasi per baris. `EXISTS` adalah pemakaian klasiknya.",
      "`EXISTS` bertanya 'apakah ada minimal satu?' dan berhenti lebih awal; `IN` membandingkan dengan sebuah daftar. Utamakan `NOT EXISTS` daripada `NOT IN` karena masalah NULL.",
      "**CTE** (`WITH name AS (…)`) memberi nama pada subquery supaya query utamanya terbaca dari atas ke bawah. SQL Server tidak menyimpannya: CTE yang dipakai dua kali dihitung dua kali. Pakai temporary table kalau hasilnya perlu dipakai ulang.",
      "Rangkai beberapa CTE untuk membangun query bertahap, dan jalankan tiap tahap sendiri-sendiri saat debugging.",
      "CTE **recursive** merujuk ke dirinya sendiri, untuk menelusuri hierarki seperti pohon kategori atau struktur organisasi."
    ],
    practice: "Di playground, cari customer yang total belanjanya di atas rata-rata total belanja per customer. Tulis dengan CTE, dan jalankan tiap CTE sendiri dulu untuk mengecek baris-baris di tahap tengahnya.",
    teach: "Jelaskan apa itu CTE dan kenapa kamu memakainya alih-alih subquery bersarang.",
    analogy: "CTE itu seperti memberi nama pada hasil antara di sebuah resep: 'pertama buat saus; sebut saja *saus*. Lalu siramkan *saus* ke pasta.' Subquery bersarang adalah resep yang sama, ditulis sebagai satu kalimat panjang tanpa tanda baca.",
    pitfalls: [
      "`NOT IN` dengan subquery yang mengembalikan NULL. Seluruh kondisinya jadi unknown dan tidak ada yang dikembalikan.",
      "Berharap CTE yang dipakai dua kali hanya dihitung sekali. Di SQL Server, ia dijalankan setiap kali dirujuk.",
      "Lupa bahwa di SQL Server statement **sebelum** `WITH` harus diakhiri titik koma. Tanpa itu, kamu akan mendapat 'Incorrect syntax near the keyword with'.",
      "Subquery di `SELECT` yang jalan sekali per baris padahal join sudah cukup."
    ],
    quiz: [
      ["Apa itu correlated subquery?", ["Subquery yang mengembalikan banyak kolom", "Subquery yang merujuk ke kolom dari query luar", "Subquery yang memakai `IN`", "Subquery yang muncul di `FROM`"], "Hasilnya bergantung pada baris luar yang sedang diproses, jadi secara logis ia dievaluasi untuk setiap baris."],
      ["Kenapa lebih baik memakai `NOT EXISTS` daripada `NOT IN (subquery)`?", ["`NOT EXISTS` selalu lebih cepat", "`NOT IN` tidak mengembalikan baris apa pun kalau subquery-nya menghasilkan NULL", "`NOT IN` tidak didukung di SQL Server", "`NOT IN` tidak bisa memakai index"], "`x NOT IN (1, NULL)` bernilai unknown untuk x berapa pun, jadi tidak ada baris yang lolos."],
      ["Tujuan utama CTE adalah…", ["Eksekusi yang selalu lebih cepat", "Keterbacaan: memberi nama pada satu tahap query", "Membuat temporary table yang bertahan selama session", "Meng-cache hasil supaya hanya dihitung sekali"], "CTE adalah ekspresi bernama yang hanya ada untuk satu statement. SQL Server tidak meng-cache-nya."]
    ]
  },
  design: {
    title: 'Desain schema: key, constraint, dan normalisasi',
    why: "Schema yang buruk tidak bisa diperbaiki dengan kode yang bagus: setiap query harus mengakalinya, selamanya. Kebiasaan yang membantu adalah bertanya, untuk setiap tabel dan kolom, 'apa yang bisa salah kalau kita menyimpannya dengan cara ini?'",
    points: [
      "Satu tabel per **entity**; satu baris per instance; satu fakta disimpan di tepat **satu tempat**.",
      "**Foreign key** membuat relasi jadi nyata: database menolak order yang menunjuk ke customer yang tidak ada.",
      "Jenis relasi: one-to-many (foreign key di sisi 'many'), many-to-many (junction table seperti `order_items`), one-to-one (jarang).",
      "**Normalisasi**: 1NF berarti value yang atomik, tanpa daftar di dalam satu sel. 2NF dan 3NF berarti setiap kolom non-key bergantung pada key, seluruh key, dan tidak ada yang lain selain key.",
      "Constraint adalah test gratis yang jalan di setiap penulisan: `NOT NULL`, `UNIQUE`, `CHECK (price >= 0)`, `DEFAULT`.",
      "Tentukan apa akibatnya kalau parent dihapus. Secara default foreign key menolak; `ON DELETE CASCADE` ikut menghapus child-nya.",
      "Kekhasan SQL Server: `IDENTITY` membuat id otomatis, `NVARCHAR(n)` adalah type teks yang umum (`TEXT` sudah deprecated), dan kolom foreign key **tidak** otomatis di-index.",
      "Lakukan denormalisasi dengan sengaja (misalnya menyimpan `unit_price` saat penjualan) dan pahami alasannya.",
      "**Kolom JSON** cocok untuk data yang disimpan dan dikembalikan utuh, seperti pengaturan yang bentuknya tidak tetap atau payload dari sistem lain. `CHECK (ISJSON(col) = 1)` menjaganya tetap valid, `JSON_VALUE` membaca satu nilai, dan `OPENJSON` mengubah array menjadi baris. Apa pun yang kamu filter, join, atau beri constraint tempatnya di kolom sungguhan. (SQL Server 2025 juga menambahkan type `json` bawaan.)"
    ],
    practice: "Rancang schema untuk perpustakaan: buku, pengarang (satu buku bisa punya beberapa pengarang), anggota, dan peminjaman. Daftarkan key dan constraint tiap tabel, dan tentukan apa yang harus terjadi pada data peminjaman kalau seorang anggota dihapus. Lalu sebutkan satu fakta yang sengaja kamu simpan dua kali, atau jelaskan kenapa tidak ada yang perlu.",
    teach: "Jelaskan kenapa kita tidak menyimpan nama dan alamat customer di setiap baris order, dan apa yang salah kalau kita melakukannya.",
    analogy: "Normalisasi itu aturan 'tulis setiap nomor telepon di satu buku alamat, bukan di sticky note yang tersebar di seluruh rumah'. Saat teman ganti nomor, kamu cukup mengubah satu tempat. Dengan sticky note, kamu memperbaiki tiga, melewatkan yang keempat, dan sekarang ada dua versi kebenaran.",
    pitfalls: [
      "Daftar yang dipisah koma di satu kolom ('tags: red,blue'). Tidak bisa di-index, di-join, maupun diberi constraint.",
      "Melewatkan foreign key 'demi fleksibilitas' lalu menimbun baris yatim.",
      "Menormalisasi sampai riwayat hilang: sebuah order harus ingat harga yang dikenakan saat itu.",
      "Menyimpan uang dalam `FLOAT` atau `REAL`. Pakai `DECIMAL`, kalau tidak, sen-nya akan bergeser.",
      "Menyembunyikan nilai yang sering dicari di dalam JSON. `WHERE JSON_VALUE(preferences, '$.language') = 'id'` tidak bisa memakai index biasa; jadikan kolom sendiri, atau beri index pada computed column di atasnya."
    ],
    quiz: [
      ["Order dan produk berelasi many-to-many. Bagaimana memodelkannya?", ["Kolom `product_ids` berisi daftar yang dipisah koma di `orders`", "Junction table dengan foreign key ke masing-masing tabel", "Kolom `order_id` di `products`", "Satu baris `orders` per produk, dengan detail order yang diulang"], "Junction table punya satu baris per pasangan dan bisa membawa atribut seperti quantity."],
      ["Apa yang dicegah oleh constraint foreign key?", ["Join yang lambat", "Baris yang merujuk ke baris parent yang tidak ada", "Value yang duplikat di kolom itu", "Value NULL di kolom itu"], "Foreign key menegakkan referential integrity di setiap insert, update, dan delete. Duplikat dicegah oleh `UNIQUE`, dan kolom foreign key tetap bisa NULL kecuali diberi `NOT NULL`."],
      ["Kenapa `unit_price` disimpan di `order_items` padahal `products` sudah punya `price`?", ["Itu kesalahan; seharusnya diambil lewat join", "Penjualan harus menyimpan harga saat pembelian terjadi", "Supaya join ke `products` lebih cepat", "Foreign key mewajibkan salinan"], "Itu fakta yang berbeda: harga historis yang dikenakan, bukan harga katalog hari ini."],
      ["Data mana yang paling cocok untuk kolom JSON?", ["Email customer, yang harus unik", "Pengaturan notifikasi yang field-nya berbeda-beda tiap customer", "`customer_id` pemilik sebuah order", "Harga produk, yang dipakai di laporan setiap hari"], "Data yang bentuknya tidak tetap, dibaca dan ditulis utuh, memang untuk JSON. Nilai yang diberi constraint, di-join, atau dilaporkan butuh kolom sungguhan dengan type dan constraint."]
    ]
  },
  indexes: {
    title: 'Index: cara database menemukan baris dengan cepat',
    why: "Query yang sama bisa butuh 5 ms atau 50 detik, dan bedanya sering cuma satu index. Index adalah hal pertama yang perlu dicek saat sebuah halaman makin lambat seiring bertambahnya data.",
    points: [
      "Tanpa index, engine membaca setiap baris: sebuah **scan**, O(n). Dengan index B-tree, ia menelusuri beberapa level saja: sebuah **seek**, O(log n).",
      "Index adalah salinan terurut dari beberapa kolom dengan pointer kembali ke barisnya. Ia mempercepat pembacaan, **memperlambat penulisan**, dan memakan storage.",
      "Di SQL Server, **clustered index** adalah tabel itu sendiri, disimpan sesuai urutan key; secara default, ia adalah primary key. Index lain bersifat non-clustered dan menunjuk kembali ke clustered index. (PostgreSQL tidak punya clustered index; tabelnya berupa heap yang tidak berurutan.)",
      "**Composite index** `(a, b)` membantu filter pada `a`, atau pada `a AND b`, tapi SQL Server tidak bisa seek pada `b` saja: aturan leftmost prefix. Taruh kolom equality di depan, kolom range di belakang.",
      "**Covering index** memuat setiap kolom yang dibutuhkan query (kolom tambahan masuk `INCLUDE`), jadi engine tidak perlu mengunjungi tabelnya sama sekali.",
      "Index baru bermanfaat kalau ia mempersempit pencarian secara signifikan. Pada kolom seperti `status` yang hanya punya tiga value, SQL Server sering mengabaikan index-nya dan tetap scan.",
      "Buat index untuk kolom di `WHERE`, `JOIN`, dan `ORDER BY` dari query yang sering dijalankan, terutama foreign key. Di EF Core, deklarasikan dengan `HasIndex(o => new { o.CustomerId, o.OrderDate })` dan index-nya ikut terbawa di migration."
    ],
    practice: "Jalankan index visualizer untuk beberapa target dan catat jumlah pembacaan untuk scan versus seek. Untuk 1.000.000 baris, kira-kira berapa perbandingan yang dibutuhkan masing-masing? Lalu, di SQL Server Management Studio, aktifkan Include Actual Execution Plan (Ctrl+M) dan bandingkan query pada tabel besar sebelum dan sesudah membuat index. Di playground, `EXPLAIN QUERY PLAN` menunjukkan ide yang sama di SQLite: `SCAN` versus `SEARCH … USING INDEX`.",
    teach: "Jelaskan kenapa index membuat pencarian cepat tapi insert jadi lebih lambat, tanpa memakai kata 'B-tree'.",
    analogy: "Indeks di bagian belakang buku pelajaran: kata kunci yang terurut beserta nomor halamannya. Mencari 'transaction' cukup beberapa detik, bukan membaca setiap halaman. Tapi setiap kali penulis menambah halaman, indeksnya juga harus diperbarui, dan indeks untuk setiap kata akan lebih tebal daripada bukunya.",
    pitfalls: [
      "Membuat index di setiap kolom 'jaga-jaga' dan membuat setiap penulisan jadi lambat.",
      "Berharap index pada `(last_name, first_name)` membantu pencarian berdasarkan `first_name` saja.",
      "Lupa membuat index di foreign key, sehingga join dan delete pada parent jadi men-scan tabel child.",
      "Membuat index di kolom yang value-nya cuma sedikit, lalu bingung kenapa plan-nya tetap scan."
    ],
    quiz: [
      ["Ada index pada `(country, city)`. Filter mana yang bisa melakukan seek dengan index itu?", ["`WHERE city = 'Bandung'`", "`WHERE country = 'ID'`", "`WHERE city = 'Bandung' OR country = 'ID'`", "Dua pilihan pertama"], "Composite index bisa dipakai mulai dari kolom paling kirinya; `city` saja bukan prefix."],
      ["Apa biaya utama dari menambah index?", ["Pembacaan jadi lebih lambat", "Setiap insert, update, dan delete juga harus memperbarui index-nya, dan ia memakan storage", "Tabelnya tidak bisa di-alter lagi", "Tabelnya ter-lock selama index itu ada"], "Index adalah struktur tambahan yang dijaga tetap sinkron di setiap penulisan."],
      ["Index yang 'covering' artinya…", ["Ia mencakup setiap kolom di tabel", "Ia memuat semua kolom yang dibutuhkan sebuah query, jadi tabelnya tidak dibaca", "Ia adalah clustered index", "Ia mempercepat semua query pada tabel itu"], "Query-nya dijawab dari index saja, tanpa lookup kembali ke tabel."]
    ]
  },
  transactions: {
    title: 'Transaction, ACID, dan isolation',
    why: "Transfer uang, pengurangan stok, dan pembuatan order harus terjadi semua atau tidak sama sekali, dan tetap benar saat banyak user beraksi bersamaan. Kalau kodemu menulis ke database, kamu butuh model ini.",
    points: [
      "**Transaction** mengelompokkan beberapa statement jadi satu unit: `BEGIN TRANSACTION` … `COMMIT`, atau `ROLLBACK` untuk membatalkan semuanya.",
      "**ACID**: Atomic (semua atau tidak sama sekali), Consistent (constraint tetap terjaga), Isolated (transaction yang berjalan bersamaan tidak saling merusak), Durable (data yang sudah di-commit tetap ada meski server crash).",
      "Anomali concurrency: **dirty read** (melihat data yang belum di-commit), **non-repeatable read** (sebuah baris berubah di antara dua pembacaan), **phantom** (muncul baris baru), **lost update** (dua penulis saling menimpa).",
      "**Isolation level** menukar keamanan dengan concurrency: Read Uncommitted → Read Committed → Repeatable Read → Serializable, ditambah Snapshot (row version). Default SQL Server adalah Read Committed; default MySQL adalah Repeatable Read.",
      "`SET XACT_ABORT ON` membuat SQL Server me-rollback seluruh transaction saat ada error apa pun, alih-alih lanjut ke statement berikutnya.",
      "Jaga transaction tetap **singkat**: jangan menunggu user dan jangan ada panggilan HTTP di dalamnya.",
      "Hindari race baca-lalu-tulis dengan satu statement yang atomic (`UPDATE … SET stock = stock - 1 WHERE stock > 0`), atau dengan **optimistic concurrency**: kolom `rowversion` yang berubah di setiap update, lalu dicek di `WHERE`. EF Core melakukannya dengan `[Timestamp]`."
    ],
    practice: "Kamu butuh dua jendela query ke database yang sama: dua tab di SQL Server Management Studio, atau dua terminal yang menjalankan `sqlcmd`. (Playground hanya punya satu koneksi, jadi tidak bisa menunjukkan ini.) Di jendela pertama, jalankan `BEGIN TRANSACTION; UPDATE accounts SET balance = balance - 10 WHERE id = 1;` dan jangan di-commit. Di jendela kedua, jalankan `SELECT balance FROM accounts WHERE id = 1;`. Apakah ia menunggu atau langsung menjawab? Commit di jendela pertama dan amati. Lalu aktifkan `READ_COMMITTED_SNAPSHOT` di database test dan ulangi.",
    teach: "Jelaskan arti 'atomic' dalam ACID memakai contoh transfer bank, dan apa yang akan dilihat user tanpa itu.",
    analogy: "Transaction itu seperti membeli di vending machine: kamu dapat snack-nya dan mesin menyimpan uangmu, atau mesin mengembalikan uangmu dan tetap menyimpan snack-nya. Tidak ada keadaan di mana uangmu hilang dan snack-nya tersangkut.",
    pitfalls: [
      "Membaca value di aplikasi, menghitung, lalu menulisnya kembali: lost update klasik. Membungkusnya dalam transaction Read Committed tidak memperbaikinya.",
      "Membiarkan transaction terbuka selama memanggil API eksternal.",
      "Menganggap isolation level default mencegah semua anomali. Read Committed masih membolehkan non-repeatable read, phantom, dan lost update.",
      "Membiarkan `XACT_ABORT` mati. Setelah beberapa jenis error SQL Server tetap lanjut, dan transaction yang baru setengah jadi masih bisa ter-commit."
    ],
    quiz: [
      ["Sebuah transfer mendebit rekening A, lalu server crash sebelum mengkredit B. Dengan transaction, apa hasilnya setelah restart?", ["A terdebit, B tidak terkredit", "Tidak ada perubahan yang diterapkan", "B dikredit saat server menyala lagi", "Database harus di-restore dari backup"], "Atomicity: transaction yang belum di-commit di-rollback seluruhnya saat recovery."],
      ["Anomali mana yang berarti 'membaca data yang belum di-commit oleh transaction lain'?", ["Phantom", "Dirty read", "Lost update", "Non-repeatable read"], "Dirty read hanya mungkin terjadi di Read Uncommitted, atau dengan hint `NOLOCK`."],
      ["Cara paling aman mengurangi stok di bawah concurrency?", ["`SELECT`, lalu `UPDATE` dengan value hasil hitungan, di dalam transaction", "`UPDATE … SET stock = stock - 1 WHERE stock > 0`, lalu cek jumlah baris yang terkena", "Simpan jumlah stok di memory aplikasi", "Baca dengan `NOLOCK` dulu supaya tidak memblokir siapa pun"], "Di Read Committed, dua transaction tetap bisa membaca stok yang sama sebelum salah satunya menulis. Satu statement yang atomic tidak bisa diselingi penulis lain."]
    ]
  },
  window: {
    title: 'Window function',
    why: "Peringkat, running total, 'dibandingkan bulan lalu', dan top-N per kelompok muncul di hampir setiap laporan. Tanpa window function, semuanya butuh self-join dan subquery; dengan window function, cukup satu ekspresi.",
    points: [
      "Window function menghitung di antara baris-baris yang berkaitan **tanpa merangkumnya**. Tidak seperti `GROUP BY`, setiap baris input tetap ada.",
      "`OVER (PARTITION BY x ORDER BY y)` mendefinisikan window-nya: partition adalah kelompoknya, dan order menentukan urutan di dalam tiap kelompok.",
      "Peringkat: `ROW_NUMBER()` (unik 1, 2, 3), `RANK()` (yang seri berbagi peringkat, lalu ada lompatan), `DENSE_RANK()` (yang seri berbagi peringkat, tanpa lompatan).",
      "Aggregate sebagai window: `SUM(amount) OVER (ORDER BY date)` adalah running total; tanpa `ORDER BY`, ia adalah total partition yang diulang di setiap baris.",
      "Dengan `ORDER BY`, frame default-nya mencakup semua baris yang **seri** dengan baris saat ini, jadi order di tanggal yang sama berbagi satu running total. Tambahkan pemecah seri (`ORDER BY order_date, id`) atau tulis `ROWS UNBOUNDED PRECEDING`, yang juga lebih cepat di SQL Server.",
      "`LAG` dan `LEAD` membaca baris sebelum dan sesudahnya, untuk perubahan dari periode ke periode.",
      "Top-N per kelompok: beri nomor baris di sebuah CTE dengan `ROW_NUMBER()`, lalu filter `WHERE rn <= N` di luarnya."
    ],
    practice: "Di playground, tampilkan dua produk termahal di setiap kategori. Lalu tambahkan kolom yang menunjukkan harga tiap produk sebagai persentase dari total kategorinya.",
    teach: "Jelaskan apa bedanya `SUM(x) OVER (PARTITION BY c)` dengan `SUM(x) … GROUP BY c`.",
    analogy: "`GROUP BY` memasukkan murid-murid tiap kelas ke dalam bus dan melaporkan satu angka per bus. Window function membiarkan setiap murid tetap di mejanya dan memberi masing-masing secarik catatan: 'kamu tertinggi ke-3 di kelasmu; rata-rata kelas 160 cm'.",
    pitfalls: [
      "Mencoba memfilter window function di `WHERE`. Window dihitung setelah `WHERE`, jadi bungkus query-nya dalam CTE.",
      "Memakai `RANK()` padahal butuh tepat satu baris per kelompok: yang seri akan mengembalikan beberapa baris. Pakai `ROW_NUMBER()`.",
      "Lupa `ORDER BY` di running total dan malah mendapat grand total di setiap baris.",
      "Running total yang melompat-lompat karena beberapa baris punya tanggal yang sama. Pecahkan serinya di `ORDER BY`."
    ],
    quiz: [
      ["Skor 90, 90, 80. Peringkat apa yang diberikan `RANK()` (menurun)?", ["1, 2, 3", "1, 1, 2", "1, 1, 3", "1, 2, 2"], "`RANK` memberi peringkat yang sama untuk yang seri lalu melompat; `DENSE_RANK` akan memberi 1, 1, 2."],
      ["Berapa banyak baris yang dikembalikan window function dibandingkan input-nya?", ["Satu per partition", "Jumlahnya sama", "Satu per value `ORDER BY` yang berbeda", "Lebih sedikit, kalau ada yang seri"], "Window function menambah kolom; ia tidak merangkum baris."],
      ["Function mana yang membaca value dari baris sebelumnya?", ["`LEAD`", "`LAG`", "`FIRST_VALUE`", "`ROW_NUMBER`"], "`LAG` melihat ke belakang; `LEAD` melihat ke depan."]
    ]
  },
  plans: {
    title: 'Execution plan dan query tuning',
    why: "Tuning itu bukan menebak. Execution plan menunjukkan apa yang sebenarnya dilakukan engine dan kenapa, jadi kamu bisa mengubah satu hal berdasarkan bukti lalu mengukur lagi.",
    points: [
      "**Optimizer** memilih plan memakai **statistics** tentang sebaran data. Statistics yang basi menghasilkan perkiraan jumlah baris yang buruk dan plan yang buruk.",
      "Baca plan dengan membandingkan **jumlah baris perkiraan versus aktual** dan mencari operator yang paling mahal: scan, key lookup, sort, hash spill.",
      "Algoritma join: **nested loops** (input luar kecil, tabel dalam ber-index), **hash join** (input besar yang tidak terurut), **merge join** (kedua input sudah terurut).",
      "Kondisi yang **sargable** bisa memakai index seek. Membungkus kolom dengan function (`WHERE YEAR(order_date) = 2026`) atau mengawali dengan wildcard (`LIKE '%x'`) memaksa scan.",
      "Implicit conversion diam-diam mematikan seek. Yang umum di .NET adalah kolom `VARCHAR` yang dibandingkan dengan parameter `NVARCHAR`, yaitu wujud `string` .NET kecuali di-mapping sebagai `varchar` (di EF Core, `IsUnicode(false)`).",
      "**Parameter sniffing**: plan yang di-compile untuk satu value parameter dipakai ulang untuk value yang sangat berbeda. Diagnosis dengan Query Store; tangani dengan index yang lebih baik dulu, lalu `OPTION (RECOMPILE)` pada query itu, atau Query Store hint maupun forced plan.",
      "Di playground, `EXPLAIN QUERY PLAN` menampilkan plan SQLite, dan di sana tidak ada `YEAR()`: `strftime('%Y', order_date)` menyembunyikan kolom dari index dengan cara yang persis sama."
    ],
    practice: "Ambil query paling lambat di salah satu project-mu. Rekam plan aktual dan output `STATISTICS IO`-nya, tulis hipotesismu, ubah tepat satu hal (sebuah index atau penulisan ulang), lalu ukur lagi. Sajikan dalam format sebelum / perubahan / sesudah.",
    teach: "Jelaskan arti 'sargable' dan kenapa `WHERE YEAR(order_date) = 2026` tidak bisa memakai index pada `order_date`.",
    analogy: "Buku telepon diurutkan berdasarkan nama belakang. 'Semua orang bernama Smith' cukup sekali buka (seek). 'Semua orang yang nama belakangnya berakhiran -son' berarti membaca setiap halaman: urutannya tidak lagi membantu, karena kamu menanyakan hasil transformasi dari key-nya, bukan key-nya sendiri.",
    pitfalls: [
      "Menambah index berdasarkan intuisi alih-alih membaca plan.",
      "Mempercayai estimated plan padahal jumlah baris aktualnya jauh berbeda.",
      "Paging dengan `OFFSET` yang dalam, yang membaca lalu membuang ribuan baris per halaman.",
      "Memperbaiki parameter sniffing dengan `OPTION (RECOMPILE)` pada query yang jalan ribuan kali per detik. Compile setiap kali itu memakan CPU."
    ],
    quiz: [
      ["Kondisi mana yang bisa memakai index seek pada `order_date`?", ["`WHERE YEAR(order_date) = 2026`", "`WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'`", "`WHERE CONVERT(CHAR(4), order_date, 120) = '2026'`", "`WHERE DATEADD(day, 1, order_date) > '2026-01-01'`"], "Hanya range pada kolom polos yang sargable; pilihan lainnya menerapkan function pada kolomnya dulu."],
      ["Perkiraan baris: 10. Baris aktual: 900.000. Penyebab yang paling mungkin?", ["Terlalu banyak index di tabel itu", "Statistics yang basi atau menyesatkan, atau parameter sniffing", "Server kekurangan memory", "Query-nya memakai CTE"], "Optimizer memilih plan untuk input yang kecil sekali; perbaiki perkiraannya, maka plan-nya ikut membaik."],
      ["Algoritma join mana yang cocok untuk input luar yang kecil dengan index di tabel dalam?", ["Hash join", "Nested loops", "Merge join", "Tabel mana pun yang ditulis lebih dulu"], "Nested loops melakukan satu index seek murah per baris luar."]
    ]
  },
  locking: {
    title: 'Locking, deadlock, dan MVCC',
    why: "Saat aplikasi 'tiba-tiba' timeout ketika beban tinggi, penyebabnya biasanya blocking: satu transaction menunggu transaction lain. Keahliannya adalah mencari tahu siapa menunggu siapa, lalu mengubah pola aksesnya supaya mereka tidak saling menunggu.",
    points: [
      "Di Read Committed, default SQL Server, statement mengambil **lock**: shared (S) untuk pembacaan, exclusive (X) untuk penulisan. Penulis memblokir pembaca, dan pembaca sebentar memblokir penulis.",
      "**MVCC** (row versioning) menyimpan versi lama baris supaya pembaca melihat data terakhir yang sudah di-commit dan **tidak memblokir penulis**. Penulis tetap memblokir penulis lain. PostgreSQL selalu bekerja seperti ini; SQL Server juga, kalau `READ_COMMITTED_SNAPSHOT` aktif, yang merupakan default di Azure SQL Database.",
      "**Deadlock** adalah siklus: T1 memegang A dan menginginkan B, T2 memegang B dan menginginkan A. SQL Server memilih satu korban, me-rollback-nya, dan memunculkan error 1205.",
      "Cegah deadlock: sentuh baris dan tabel dengan **urutan yang konsisten**, jaga transaction tetap singkat, tambah index supaya statement me-lock lebih sedikit baris, dan retry korbannya. `EnableRetryOnFailure()` di EF Core me-retry deadlock secara otomatis, asalkan kamu tidak membuka transaction sendiri di luar execution strategy-nya.",
      "Blocking yang mengejutkan: `UPDATE … WHERE` pada kolom tanpa index me-lock setiap baris yang di-scan-nya, dan begitu satu statement memegang sekitar 5.000 lock, SQL Server menaikkannya menjadi lock pada seluruh tabel.",
      "Diagnosis dengan deadlock graph di Extended Events session `system_health`, `blocking_session_id` di `sys.dm_exec_requests`, dan `sys.dm_tran_locks`.",
      "**Upsert** (update barisnya kalau ada, insert kalau belum) itu rawan race: dua session bisa sama-sama tidak menemukan barisnya lalu sama-sama insert. Jalankan `UPDATE … WITH (UPDLOCK, HOLDLOCK)` lalu `IF @@ROWCOUNT = 0 INSERT …` dalam satu transaction, atau `MERGE … WITH (HOLDLOCK)`, dan tetap pasang key `UNIQUE` sebagai pertahanan terakhir."
    ],
    practice: "Buka dua jendela query di SQL Server Management Studio (atau dua terminal `sqlcmd`) ke database test yang punya tabel `accounts`, lalu mainkan keempat langkah di atas secara manual. Rekam error 1205, lalu temukan deadlock graph-nya di session `system_health`. Perbaiki dengan versi yang mendahulukan id terkecil, dan secara terpisah tambahkan retry di aplikasimu (di EF Core, `EnableRetryOnFailure()`). Perbaikan mana yang akan kamu rilis, dan kenapa sebaiknya keduanya tetap dipakai?",
    teach: "Jelaskan bagaimana deadlock terjadi memakai dua transfer di antara dua rekening yang sama, dan satu cara untuk mencegahnya.",
    analogy: "Dua orang berpapasan di lorong sempit, masing-masing memegang separuh dari kunci dua bagian dan berusaha meraih separuh milik yang lain. Tidak ada yang mau melepas duluan. Database adalah manajer yang menepuk bahu salah satunya: 'taruh punyamu, mundur, coba lagi.' Kalau sepakat selalu mengambil separuh kiri lebih dulu, hal ini tidak akan pernah terjadi.",
    pitfalls: [
      "Menganggap deadlock sebagai bug database, bukan bug urutan akses.",
      "Menebar hint `NOLOCK` untuk menyembunyikan blocking, dengan imbalan pembacaan yang kotor dan tidak konsisten.",
      "Tidak me-retry korban deadlock. Deadlock adalah error yang memang bisa terjadi dan sifatnya sementara.",
      "Hanya me-retry statement yang gagal. Seluruh transaction korbannya sudah di-rollback, jadi retry semuanya.",
      "Upsert dengan `IF NOT EXISTS (SELECT …) INSERT …` tanpa lock hint. Dua request lolos pengecekan bersamaan, dan salah satunya gagal di key, atau menyimpan duplikat kalau tidak ada key."
    ],
    quiz: [
      ["Apa cara standar mencegah deadlock antara transaction yang meng-update baris yang sama?", ["Tambahkan `WITH (NOLOCK)` pada update-nya", "Akses baris-barisnya dengan urutan yang konsisten", "Naikkan isolation level ke Serializable", "Perbesar lock timeout"], "Kalau semua pihak mengambil lock dengan urutan yang sama, siklus tidak bisa terbentuk. Serializable justru mengambil lebih banyak lock dan membuat deadlock lebih mungkin terjadi."],
      ["Dengan `READ_COMMITTED_SNAPSHOT` aktif, pembacaan yang berjalan lama…", ["memblokir semua penulis sampai selesai", "melihat versi yang konsisten dan tidak memblokir penulis", "melihat perubahan transaction lain yang belum di-commit", "mengambil lock pada seluruh tabel"], "Pembaca memakai row version, bukan shared lock."],
      ["Apa yang harus dilakukan kode aplikasi saat terpilih sebagai korban deadlock?", ["Tampilkan error-nya ke user", "Retry seluruh transaction", "Retry hanya statement yang gagal", "Tidak perlu apa-apa: perubahannya sudah tersimpan"], "Seluruh transaction-nya sudah di-rollback, jadi me-retry statement terakhir saja akan menerapkan setengah perubahan."],
      ["Dua request 'tambah ke keranjang' menjalankan `UPDATE …; IF @@ROWCOUNT = 0 INSERT …` untuk item yang sama pada saat bersamaan, tanpa lock hint. Apa yang bisa terjadi?", ["Tidak ada: tiap statement atomic, jadi pasangannya juga", "Keduanya tidak menemukan baris dan sama-sama insert, jadi salah satunya gagal di primary key", "Database menggabungkan kedua insert menjadi satu baris", "Request kedua otomatis menunggu sampai yang pertama commit"], "Tiap statement atomic, tapi pasangannya tidak. `UPDLOCK, HOLDLOCK` pada update menahan lock range-nya sampai insert, jadi request kedua menunggu lalu meng-update."]
    ]
  },
  scale: {
    title: 'Scaling dan mengembangkan database',
    why: "Schema berubah dan data bertambah sementara sistem tetap online. Tugasnya adalah merencanakan migration yang tidak mungkin menyebabkan downtime, dan tahu biaya tiap opsi scaling sebelum memakainya.",
    points: [
      "Lakukan scaling berurutan: perbaiki query dan index → cache → scale up → **read replica** → **partitioning** → **sharding**. Setiap langkah menambah biaya operasional.",
      "Read replica mengurangi beban primary tapi tertinggal di belakangnya, jadi 'membaca tulisanmu sendiri' perlu ditangani dengan hati-hati.",
      "**Partitioning** memecah satu tabel berdasarkan sebuah key (sering kali tanggal) supaya perawatannya lebih mudah dan query bisa melewati partition yang tidak relevan; **sharding** menyebar data ke beberapa server dan membuat query maupun transaction lintas shard jadi sulit.",
      "**Migration tanpa downtime** memakai pola **expand → migrate → contract**: tambahkan kolom baru yang nullable, tulis ke keduanya, isi data lama secara bertahap, pindahkan pembacaan, dan baru belakangan hapus kolom lamanya.",
      "Setiap deploy harus bisa jalan dengan schema **sebelum dan sesudah** migration, karena versi aplikasi lama dan baru berjalan berdampingan.",
      "Migration EF Core menerapkan perubahan schema-mu. Supaya tanpa downtime, pecah sebuah rename menjadi beberapa migration yang dirilis bersama versi aplikasi yang sepadan, alih-alih membiarkan EF membuat satu `RenameColumn`.",
      "Di luar baris biasa: function JSON (`JSON_VALUE`, `OPENJSON`), full-text search, indexed view (materialized view versi SQL Server), dan tahu kapan cache, search index, atau queue adalah alat yang lebih tepat."
    ],
    practice: "Tulis rencana migration lengkap, SQL beserta rilis aplikasi yang sepadan, untuk memecah kolom `name` menjadi `first_name` dan `last_name` pada tabel berisi 50 juta baris tanpa jadwal maintenance. Tentukan langkah mana yang paling sulit di-rollback.",
    teach: "Jelaskan pola expand–migrate–contract dan kenapa me-rename kolom dalam satu langkah merusak aplikasi yang sedang berjalan.",
    analogy: "Mengganti jembatan tanpa menutup jalan: bangun jembatan baru di samping yang lama (expand), pindahkan lalu lintas jalur demi jalur (migrate), dan robohkan jembatan lama hanya setelah tidak ada yang memakainya (contract). Meledakkan jembatan lama lebih dulu memang lebih cepat, dan membuat semua orang tercebur ke sungai.",
    pitfalls: [
      "Melakukan sharding sebelum index, caching, dan replica benar-benar dimanfaatkan.",
      "Satu `UPDATE` raksasa untuk mengisi data lama, yang me-lock tabel selama bermenit-menit dan memenuhi transaction log.",
      "Menganggap pembacaan dari replica langsung up to date setelah sebuah penulisan.",
      "Membiarkan EF Core membuat satu migration `RenameColumn` untuk sistem yang sedang live. Instance aplikasi lama yang masih berjalan langsung gagal begitu migration-nya diterapkan."
    ],
    quiz: [
      ["Langkah pertama me-rename kolom tanpa downtime?", ["Hapus kolom lamanya", "Tambahkan kolom baru di samping kolom lama", "Rename di tempat dengan `sp_rename`", "Salin tabelnya dengan nama baru"], "Expand dulu, supaya versi aplikasi lama dan baru tetap jalan."],
      ["User menyimpan profil, halaman berikutnya membaca dari replica dan menampilkan value lama. Kenapa?", ["Ada bug di query SQL-nya", "Replication lag: replica belum menerapkan penulisan itu", "Browser meng-cache halaman lama", "Deadlock me-rollback penyimpanannya"], "Replica asynchronous bersifat eventually consistent; arahkan request 'baca tulisanmu sendiri' ke primary."],
      ["Apa yang membuat sharding mahal dibandingkan partitioning di satu server?", ["Index berhenti bekerja lintas shard", "Join dan transaction lintas shard sulit atau mustahil", "Setiap shard butuh schema yang berbeda", "Backup tidak bisa dilakukan lagi"], "Data di server yang berbeda tidak bisa di-join atau di-commit secara atomic oleh satu engine."]
    ]
  }
}, { tagline: 'Datanya, di SQL Server: query, modelling, indexing, transaction, dan tuning.' });
