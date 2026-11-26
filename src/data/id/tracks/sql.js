// Bahasa Indonesia — track SQL. Contoh kode tetap memakai versi aslinya.
export const trackId = {
  id: 'sql',
  tagline: 'Data di SQL Server: query, desain skema, indexing, transaksi, dan tuning.',
  lessons: {
  select: {
    terms: [
      ['Primary key (`id`)', 'Kolom (atau pasangan kolom) penanda unik tiap baris dalam tabel. Tabel lain menunjuk ke sini lewat foreign key.'],
      ['Proyeksi vs Filter (`SELECT` vs `WHERE`)', '`WHERE` memilih *baris* mana yang lolos, sedangkan `SELECT` memilih *kolom* apa saja yang tampil.'],
      ['Urutan eksekusi klausa', 'Logika SQL memproses `FROM → WHERE → ORDER BY → SELECT → TOP/LIMIT` berurutan, meski `SELECT` ditulis paling atas.']
    ],
    title: 'Tabel, baris, dan SELECT',
    why: "Hampir semua aplikasi berdiri di atas database, dan `SELECT` adalah cara mengambil datanya kembali. Karena struktur query mirip bahasa Inggris, kamu cepat akrab saat membaca data. Contoh di materi ini memakai SQL Server yang umum dipasangkan dengan ASP.NET Core.",
    points: [
      "Database relasional menyimpan data dalam **tabel**. Tiap **baris** mewakili satu rekaman (seperti satu pelanggan), dan tiap **kolom** menyimpan satu bidang data (kotanya).",
      "**Primary key** menandai tiap baris agar unik, umumnya berupa `id`.",
      "`SELECT` memilih kolom, `WHERE` menyaring baris, `ORDER BY` mengurutkan hasil, dan `TOP (n)` mengambil n baris pertama. `OFFSET … FETCH` dipakai untuk halaman berikutnya.",
      "SQL memakai gaya **deklaratif**, artinya kamu cukup menyebut hasil yang diminta lalu mesin database yang menentukan langkah mengambilnya.",
      "Teks ditulis dengan tanda kutip tunggal (`'Jakarta'`). `LIKE 'A%'` mencocokkan pola teks, sementara `IN (...)` dan `BETWEEN` meringkas kondisi.",
      "SQL Server kerap menulis prefix `N'Jakarta'` untuk kolom Unicode `NVARCHAR`. Tanpa huruf `N`, karakter di luar code page bawaan bisa berubah menjadi `?`.",
      "Peka atau tidaknya `LIKE` dan `=` pada huruf kapital bergantung pada **collation** kolomnya. Bawaan sebagian besar SQL Server mengabaikan kapital.",
      "Playground ini menjalankan SQLite yang menulis `LIMIT 3` di akhir, menggantikan `TOP (3)` milik SQL Server setelah `SELECT`."
    ],
    practice: "Buka SQL playground lalu selesaikan tiga tantangan pertama memakai `LIMIT` sebagai ganti `TOP`. Setelah itu tampilkan lima produk termahal di luar kategori 'Tech'. Di SQLite, `price * 1.11` memunculkan sisa float (`1332.0000000000002`), jadi bungkus dengan `ROUND(…, 2)`.",
    teach: "Jelaskan arti tabel, baris, kolom, dan primary key ke teman yang baru terbiasa memakai spreadsheet.",
    analogy: "Memakai `SELECT … WHERE … ORDER BY` mirip memesan ke pustakawan: minta judul dan penulis buku terbitan sesudah 2020 dari yang paling baru. Kamu cukup menyebut hasil akhirnya, bukan lorong rak mana yang harus didatangi.",
    pitfalls: [
      "Memakai kutip ganda untuk teks. Saat `QUOTED_IDENTIFIER ON` di SQL Server (dan PostgreSQL), `\"Tech\"` dianggap nama kolom Tech lalu gagal. SQLite menerimanya tanpa peringatan.",
      "Mengira baris pasti keluar sesuai urutan masuk. Tanpa `ORDER BY`, SQL tidak menjanjikan urutan apa pun.",
      "Menulis `TOP (3)` tanpa `ORDER BY` yang cuma mengambil tiga baris acak, bukan tiga teratas.",
      "Membaca SQL berurutan dari atas ke bawah layaknya program biasa. Cek materi GROUP BY untuk melihat urutan aslinya."
    ],
    quiz: {
      'clause-chooses-rows-returned': ["Clause mana yang memilih **baris** mana saja yang dikembalikan?", ["`SELECT`", "`WHERE`", "`ORDER BY`", "`TOP`"], "`WHERE` menyaring baris, `SELECT` memilih kolom, dan `TOP` memotong hasil setelah diurutkan."],
      'without-order-order-rows': ["Tanpa `ORDER BY`, urutan barisnya…", ["sesuai primary key", "sesuai waktu dimasukkan", "tidak dijamin", "selalu sesuai clustered index"], "Di tabel kecil hasilnya sering tampak urut primary key begitu saja, padahal plan paralel atau index baru bisa mengacaknya kapan saja."],
      'name-like-match': ["Apa yang dicocokkan oleh `WHERE name LIKE 'A%'`?", ["Nama yang mengandung karakter %", "Nama yang diawali huruf A", "Nama yang diakhiri huruf A", "Persis nama 'A%'"], "`%` berperan sebagai wildcard yang cocok dengan nol atau banyak karakter."],
      'select-top-name-products': ["`SELECT TOP (3) name FROM products;` tanpa `ORDER BY` mengembalikan…", ["3 produk termahal", "3 produk termurah", "3 baris sembarang", "3 produk yang paling baru ditambahkan"], "`TOP` mengambil baris teratas dari urutan apa pun yang keluar, dan tanpa `ORDER BY` tidak ada jaminan urutan."]
    }
  },
  dml: {
    terms: [
      ['`NULL` tiga-nilai', '`NULL` menandakan nilai *tidak diketahui*, bukan nol atau `""`. Karena `city = NULL` bernilai unknown, selalu tulis `IS NULL`.'],
      ['`DECIMAL(p, s)` vs `FLOAT`', 'Tipe desimal basis 10 seperti `DECIMAL(10,2)` mencegah melesetnya angka pembulatan biner pada nominal uang.'],
      ['DML berparameter', 'Mengirim input user lewat parameter (`@price`) pada `INSERT`, `UPDATE`, dan `DELETE` menutup celah SQL injection.']
    ],
    title: 'Mengubah data, type, dan NULL',
    predict: {
      prompt: "Sebelum `INSERT`, tabel berisi 6 pelanggan: Ana dan Dewi tinggal di Jakarta, sedangkan Eko punya `city = NULL`. Berapa baris yang dikembalikan `SELECT name FROM customers WHERE city <> 'Jakarta';`?",
      options: ['`4`: Budi, Citra, Eko, dan Fitri', '`3`: Eko tidak ikut', '`0`: satu NULL di kolom membuat semua perbandingan jadi unknown'],
      answer: 1,
      explain: "SQL memakai logika tiga nilai. `NULL <> 'Jakarta'` bukan true melainkan *unknown*, dan `WHERE` hanya menyimpan baris yang kondisinya true, jadi Eko ikut hilang bersama Ana dan Dewi. Baris lain dibandingkan sendiri-sendiri, sehingga Budi, Citra, dan Fitri tetap muncul. Kalau kota yang tidak diketahui ingin ikut, tulis secara eksplisit: `WHERE city <> 'Jakarta' OR city IS NULL`."
    },
    why: "Membaca data aman dilakukan bebas, sedangkan menulis data bisa menghapus satu tabel sekaligus. Kebiasaan di materi ini melindungi datamu dari tulisan yang keliru serta menjelaskan perilaku unik `NULL`.",
    points: [
      "`INSERT INTO t (cols) VALUES (…)` menambah baris baru. `UPDATE t SET … WHERE …` mengubah baris cocok, dan `DELETE FROM t WHERE …` menghapusnya.",
      "`UPDATE` atau `DELETE` tanpa `WHERE` mengenai **semua baris** tabel. Uji dulu kondisi `WHERE` dengan `SELECT` sebelum mengubah data.",
      "Bungkus perubahan berisiko di dalam `BEGIN TRANSACTION`, periksa jumlah baris yang tersentuh, lalu pilih `COMMIT` atau `ROLLBACK`.",
      "Pilih tipe pas: `INT` untuk hitungan, `DECIMAL(10,2)` untuk uang, `NVARCHAR(n)` untuk teks Unicode, `DATE` atau `DATETIME2` untuk waktu, dan `BIT` untuk boolean.",
      "`NULL` artinya **kosong atau tak diketahui**, sama sekali bukan nol atau string kosong.",
      "Membandingkan apa pun dengan `NULL` menghasilkan nilai unknown, sehingga `NULL = NULL` bukan true. Gunakan `IS NULL` dan `IS NOT NULL`.",
      "`COALESCE(a, b)` mengembalikan nilai pertama yang bukan NULL, cara praktis mengisi nilai cadangan."
    ],
    practice: "Di playground, masukkan dirimu sebagai customer, buat satu order dengan satu item, lalu hapus order itu. Sebelum tiap perubahan, jalankan `SELECT` untuk melihat berapa baris yang kena. Kamu mesti menghapus item dulu sebelum order karena foreign key melindunginya.",
    teach: "Jelaskan kenapa `WHERE city = NULL` tak mengembalikan satu baris pun, lalu tunjukkan penulisan benarnya.",
    analogy: "NULL mirip amplop tersegel yang isinya tak bisa dilihat. Jika ditanya apakah isi dua amplop tersegel sama, jawaban jujurnya adalah unknown, bukan ya atau tidak. Klausa `WHERE` hanya meloloskan baris yang jawabannya pasti ya.",
    pitfalls: [
      "Menjalankan `DELETE FROM orders;` lalu baru sadar lupa `WHERE`. Transaction memungkinkanmu membatalkannya sebelum permanen.",
      "Menganggap NULL sama seperti nol saat menghitung, padahal `price + NULL` tetap menghasilkan NULL.",
      "Memakai `NOT IN (subquery)` lalu tak satu pun baris kembali ketika ada satu nilai NULL di dalamnya.",
      "Mengira `DELETE` di baris parent otomatis menyapu child. Foreign key menolak perintah itu kecuali dipasang `ON DELETE CASCADE`."
    ],
    quiz: {
      'update-products-set-price': ["Apa yang dilakukan `UPDATE products SET price = 0;`?", ["Tidak ada karena `UPDATE` wajib pakai `WHERE`", "Mengubah harga semua produk jadi 0", "Hanya mengubah baris yang harganya NULL", "Hanya mengubah baris pertama"], "Tanpa saringan `WHERE`, seluruh baris dalam tabel ikut terubah."],
      'result-null-null-sql': ["Hasil `NULL = NULL` di SQL adalah…", ["true", "false", "unknown", "error"], "Membandingkan dua nilai yang tak pasti tetap menghasilkan unknown, jadi pakailah `IS NULL`."],
      'coalesce-nickname-name-return': ["Apa yang dikembalikan `COALESCE(nickname, name, 'N/A')`?", ["Selalu 'N/A'", "Yang pertama dari ketiganya yang tidak NULL", "Ketiganya digabung jadi satu", "NULL kalau salah satunya NULL"], "`COALESCE` mengecek argumen dari kiri ke kanan dan mengembalikan nilai non-NULL pertama."]
    }
  },
  aggregate: {
    terms: [
      ['Aggregate (`COUNT`, `SUM`, `AVG`)', 'Merangkum banyak baris menjadi satu nilai ringkasan. `COUNT(*)` menghitung baris `NULL`, sedangkan `COUNT(col)` melewati `NULL`.'],
      ['`WHERE` vs `HAVING`', '`WHERE` menyaring baris mentah *sebelum* `GROUP BY` mengelompokkan, dan `HAVING` menyaring grup *sesudah* agregasi selesai.'],
      ['Pipeline logis SQL', 'Karena `SELECT` dievaluasi sesudah `WHERE`, klausa `WHERE` tak mengenal alias kolom (`AS total`) di SQL Server maupun PostgreSQL.']
    ],
    predict: {
      prompt: 'Tabel `customers` punya 5 baris, dan 1 customer memiliki `city = NULL`. Apa yang dikembalikan `COUNT(*)` dan `COUNT(city)`?',
      options: ['Keduanya mengembalikan `5`', '`COUNT(*)` mengembalikan `5`, sedangkan `COUNT(city)` mengembalikan `4`', '`COUNT(*)` mengembalikan `5`, sedangkan `COUNT(city)` mengembalikan `NULL`'],
      explain: '`COUNT(*)` menghitung seluruh baris termasuk nilai null (`5`), sedangkan `COUNT(col)` cuma menghitung entri yang bukan `NULL` (`4`).'
    },
    title: 'GROUP BY, aggregate, dan urutan query',
    why: "Dashboard dan laporan dibangun dari fungsi aggregate seperti total, hitungan, dan rata-rata. Di sini pula sering muncul pertanyaan kenapa `WHERE` menolak alias `SELECT`, yang jawabannya berasal dari urutan kerja SQL.",
    points: [
      "Aggregate meringkas banyak baris menjadi satu nilai (`COUNT(*)`, `SUM`, `AVG`, `MIN`, `MAX`).",
      "`GROUP BY` membagi baris ke beberapa kelompok sehingga tiap kelompok menjadi **satu baris output**.",
      "Setiap kolom di `SELECT` wajib ikut masuk `GROUP BY` atau berada di dalam fungsi aggregate.",
      "`WHERE` menyaring baris **sebelum** dikelompokkan, sedangkan `HAVING` menyaring kelompok **sesudah** aggregate dihitung.",
      "Urutan kerja logisnya `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `TOP`/`OFFSET`. Itu sebabnya `ORDER BY` mengenal alias `SELECT`, sementara `WHERE` belum.",
      "`COUNT(*)` menghitung semua baris, `COUNT(col)` menghitung nilai non-NULL, dan `COUNT(DISTINCT col)` menghitung nilai uniknya.",
      "SQLite di playground lebih longgar karena menerima alias di `WHERE` serta kolom polos di sebelah aggregate. SQL Server dan PostgreSQL menolak keduanya."
    ],
    practice: "Pakai playground untuk mencari total terjual tiap produk yang lakunya di atas 3 unit, urut terbanyak. Lalu telusuri visualisasinya langkah demi langkah dan ucapkan peran tiap klausa terhadap baris datanya.",
    teach: "Jelaskan beda `WHERE` dan `HAVING`, serta kenapa SQL tidak dijalankan berurutan sesuai teks yang ditulis.",
    analogy: "Menyortir koin. Buang koin asing (`WHERE`), tumpuk per pecahan (`GROUP BY`), dan sisakan yang di atas sepuluh koin (`HAVING`). Lalu catat label serta total tumpukan (`SELECT`), kemudian urutkan (`ORDER BY`).",
    pitfalls: [
      "Menaruh filter aggregate di dalam `WHERE` seperti `WHERE COUNT(*) > 2`, yang langsung gagal.",
      "Memilih kolom yang tak masuk `GROUP BY` maupun aggregate. SQL Server menolaknya, sedangkan SQLite diam-diam memetik nilai acak.",
      "`AVG` pada kolom `INT` di SQL Server menghasilkan `INT`, jadi rata-rata 1 dan 2 keluar 1. Ubah dulu tipenya pakai `AVG(CAST(quantity AS DECIMAL(10,2)))`."
    ],
    quiz: {
      'clause-filter-sum-amount': ["Clause mana yang bisa memfilter `SUM(amount) > 100`?", ["`WHERE`", "`HAVING`", "`ORDER BY`", "`GROUP BY`"], "Aggregate baru ada sesudah pengelompokan selesai, dan `HAVING` jalan sesudah `GROUP BY`."],
      'logically-runs-first': ["Menurut urutan kerja, mana yang dijalankan pertama?", ["`SELECT`", "`WHERE`", "`FROM`", "`GROUP BY`"], "SQL harus mengambil sumber tabelnya lebih dulu sebelum menyaring atau mengelompokkan baris."],
      'column-values-null-count': ["Sebuah kolom berisi value 5, NULL, 7. Berapa `COUNT(col)`?", ["3", "2", "12", "NULL"], "`COUNT(col)` melewati nilai NULL, berbeda dari `COUNT(*)` yang menjawab 3."],
      'quantity-int-column-values': ["`quantity` adalah kolom `INT` berisi 1 dan 2. Apa yang dikembalikan `AVG(quantity)` di SQL Server?", ["1.5", "1", "2", "NULL"], "Di SQL Server, rata-rata bilangan bulat dibuang pecahannya menjadi bilangan bulat. Cast ke `DECIMAL` dulu untuk mendapat 1.5."]
    }
  },
  joins: {
    terms: [
      ['`INNER JOIN` vs `LEFT JOIN`', '`INNER JOIN` cuma menjaga pasangan yang cocok. `LEFT JOIN` menjaga semua baris kiri lalu mengisi kolom kanan yang kosong dengan `NULL`.'],
      ['Foreign key (`customer_id`)', 'Kolom yang menautkan baris child (`orders`) ke primary key parent (`customers.id`) supaya data yatim tak bisa masuk.'],
      ['Anti-join (`IS NULL`)', '`LEFT JOIN ... WHERE o.id IS NULL` mencari baris parent yang tak punya satu pun child, contohnya customer tanpa order.']
    ],
    predict: {
      prompt: 'Kamu menjalankan `customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.status = \'paid\'`. Apa nasib Dewi yang punya 0 order?',
      options: ['Dewi tetap muncul dengan kolom order berisi `NULL`', 'Dewi lenyap (`LEFT JOIN` berubah sifat menjadi `INNER JOIN`)', 'SQL mengembalikan error sintaks'],
      explain: 'Bagi Dewi, nilai `o.status` adalah `NULL`, dan `NULL = \'paid\'` bernilai unknown, jadi `WHERE` membuang barisnya sesudah join. Pindahkan `o.status = \'paid\'` ke klausa `ON` agar Dewi tetap muncul.'
    },
    title: 'JOIN: menggabungkan tabel',
    why: "Skema relasional memang memecah data ke beberapa tabel, lalu join menyatukannya lagi. Masalahnya, salah memilih jenis join tak pernah memicu error, melainkan diam-diam menghilangkan atau menggandakan baris hingga total laporan meleset.",
    points: [
      "Join memadankan baris dua tabel lewat kondisi kunci, umumnya `foreign key = primary key`.",
      "`INNER JOIN` cuma mengambil pasangan yang sama-sama ada di kedua tabel.",
      "`LEFT JOIN` mempertahankan seluruh baris tabel kiri dan mengisi kolom kanan tanpa pasangan dengan NULL. Pakai pola ini saat butuh semua customer walau belum punya order.",
      "`RIGHT` dan `FULL OUTER` menyimpan baris tak berpasangan dari kanan atau kedua sisi, sedangkan `CROSS JOIN` menghasilkan seluruh kombinasi.",
      "Join bisa **menggandakan baris**, jadi satu customer dengan tiga order tampil tiga kali. Perhatikan baik-baik saat menjumlahkan.",
      "Cari baris **tanpa pasangan** memakai `LEFT JOIN … WHERE right.id IS NULL` atau `NOT EXISTS`."
    ],
    practice: "Pakai join visualizer untuk menebak jumlah baris tiap jenis join sebelum berpindah ke join itu. Lalu, di playground, tampilkan setiap customer beserta total belanjanya, dengan angka 0 untuk customer yang tidak punya order berstatus paid.",
    teach: "Jelaskan beda `INNER JOIN` dan `LEFT JOIN` memakai contoh customer dan order, termasuk nasib customer yang belum memesan apa pun.",
    analogy: "Bayangkan dua daftar tamu nikah: daftar undangan dan daftar konfirmasi hadir. INNER JOIN adalah tamu diundang yang hadir. LEFT JOIN adalah semua tamu undangan beserta konfirmasinya kalau ada, dan yang kosong berarti masih perlu kamu hubungi.",
    pitfalls: [
      "Menaruh filter tabel kanan di `WHERE` sesudah `LEFT JOIN`, yang langsung mengubahnya kembali jadi inner join. Taruh syarat itu di dalam `ON`.",
      "Memakai `COUNT(*)` sesudah left join ikut menghitung baris ber-NULL sebagai angka 1. Hitunglah kolom di sisi kanan seperti `o.id`.",
      "Menggabungkan dua tabel one-to-many (seperti order dan pembayaran) langsung ke parent lalu dijumlahkan, membuat tiap angka berlipat ganda."
    ],
    quiz: {
      'customers-rows-orders-orders': ["Customers punya 4 baris (1 tanpa order), dan Orders punya 5 baris milik customer valid. Berapa baris hasil `customers LEFT JOIN orders`?", ["4", "5", "6", "9"], "Lima pasangan yang cocok ditambah satu customer tanpa order yang diisi NULL."],
      'find-customers-orders': ["Bagaimana cara mencari customer yang tidak punya order?", ["`INNER JOIN … WHERE o.id IS NULL`", "`LEFT JOIN … WHERE o.id IS NULL`", "`LEFT JOIN … ON o.customer_id = c.id AND o.id IS NULL`", "`RIGHT JOIN … WHERE c.id IS NULL`"], "Baris kiri tanpa pasangan membawa NULL di sisi kanan, jadi saring baris itu sesudah join. Menaruhnya di `ON` malah meloloskan semua customer."],
      'left-join-orders-adding': ["Setelah `LEFT JOIN orders o`, menambahkan `WHERE o.status = 'paid'` berakibat apa?", ["Tidak ada yang berubah", "Customer tanpa order ikut terbuang, jadi berperilaku seperti inner join", "Semua customer tetap ada, tapi order yang belum dibayar dikosongkan", "Menyebabkan error"], "NULL = 'paid' bernilai unknown, jadi baris tanpa pasangan tersaring. Mengosongkan order yang belum dibayar didapat dengan memindah kondisinya ke `ON`."]
    }
  },
  subqueries: {
    splits: ['1 · Skalar & EXISTS', '2 · CTE berantai', '3 · CTE rekursif'],
    terms: [
      ['CTE (`WITH ... AS`)', 'Subquery bernama di atas query utama agar logika bertahap enak dibaca dari atas ke bawah.'],
      ['Correlated subquery / `EXISTS`', 'Merujuk baris luar di dalam subquery. `EXISTS` berhenti begitu ketemu kecocokan pertama tanpa menggandakan baris.'],
      ['Scalar subquery', 'Mengembalikan tepat satu nilai (1 baris, 1 kolom) untuk perbandingan seperti `WHERE price > (SELECT AVG(price) FROM products)`.']
    ],
    title: 'Subquery dan CTE',
    predict: {
      prompt: "Kamu mencari pelanggan tanpa pesanan berstatus paid dengan `WHERE c.id NOT IN (SELECT o.customer_id FROM orders AS o WHERE o.status = 'paid')`. Lalu sebuah bug menyisipkan pesanan paid dengan `customer_id` bernilai NULL (anggap kolomnya mengizinkan). Berapa pelanggan yang dikembalikan query sekarang?",
      options: ['Sama seperti sebelumnya: `IN` mengabaikan NULL', 'Tidak ada: `NOT IN` terhadap daftar yang berisi NULL tidak pernah true', 'Semua pelanggan: NULL tidak cocok dengan apa pun, jadi semuanya lolos'],
      answer: 1,
      explain: '`x NOT IN (a, b, NULL)` dijabarkan menjadi `x <> a AND x <> b AND x <> NULL`. Perbandingan terakhir bernilai unknown, jadi seluruh `AND` tidak pernah bisa true dan semua baris tersaring. `NOT EXISTS` dengan `o.customer_id = c.id` tidak punya jebakan ini: `customer_id` yang NULL tidak akan pernah cocok dengan pelanggan mana pun.'
    },
    why: "Pertanyaan laporan sering bertingkat, seperti mencari pelanggan yang belanjanya di atas rata-rata lalu melihat barang pesanannya. Subquery dan CTE memecah proses rumit itu menjadi tahapan yang gampang dicek satu per satu.",
    points: [
      "**Subquery** adalah query di dalam query lain: di dalam `WHERE` (menyaring himpunan), `FROM` (tabel turunan), atau `SELECT` (nilai tunggal).",
      "**Correlated** subquery membaca kolom dari baris luar dan dievaluasi tiap baris, pasangan alami untuk `EXISTS`.",
      "`EXISTS` berhenti seketika saat menemukan satu kecocokan, sedangkan `IN` memeriksa daftar nilai. Pilih `NOT EXISTS` ketimbang `NOT IN` demi aman dari NULL.",
      "**CTE** (`WITH name AS (…)`) memberi nama subquery supaya query utama mengalir turun dari atas ke bawah. SQL Server menghitung ulang CTE tiap kali dipanggil, jadi pakai tabel `#temp` bila hasilnya dipakai berulang.",
      "Sambung beberapa CTE berurutan untuk membangun query bertahap dan tes tiap bagian sendiri waktu debugging.",
      "**Recursive** CTE memanggil dirinya sendiri untuk menelusuri data berhirarki seperti pohon kategori atau bagan organisasi."
    ],
    practice: "Di playground, cari customer yang total belanjanya di atas rata-rata total belanja per customer. Tulis dengan CTE, dan jalankan tiap CTE sendiri dulu untuk mengecek baris-baris di tahap tengahnya.",
    teach: "Jelaskan apa itu CTE dan kenapa cara ini lebih rapi daripada menumpuk subquery bersarang.",
    analogy: "CTE mirip memberi nama bahan setengah jadi di resep masakan. Pertama bikin saus lalu namai *saus*, baru siram *saus* ke atas pasta. Subquery bersarang menulis seluruh resep itu dalam satu kalimat panjang.",
    pitfalls: [
      "`NOT IN` dengan subquery yang mengembalikan NULL. Seluruh kondisinya jadi unknown dan hasil query kosong melompong.",
      "Mengira CTE yang dipakai dua kali cuma dihitung sekali. Di SQL Server, CTE dijalankan ulang setiap kali dirujuk.",
      "Lupa bahwa di SQL Server statement **sebelum** `WITH` wajib diakhiri titik koma, kalau tidak muncul pesan 'Incorrect syntax near the keyword with'.",
      "Menaruh subquery di `SELECT` yang dieksekusi sekali per baris padahal join biasa jauh lebih ringan."
    ],
    quiz: {
      'correlated-subquery': ["Apa itu correlated subquery?", ["Subquery yang mengembalikan banyak kolom", "Subquery yang merujuk ke kolom dari query luar", "Subquery yang memakai `IN`", "Subquery yang muncul di `FROM`"], "Hasilnya bergantung pada baris luar yang sedang diproses, sehingga dievaluasi per baris."],
      'prefer-exists-subquery': ["Kenapa lebih baik memakai `NOT EXISTS` daripada `NOT IN (subquery)`?", ["`NOT EXISTS` selalu lebih cepat", "`NOT IN` tidak mengembalikan baris apa pun kalau subquery-nya menghasilkan NULL", "`NOT IN` tidak didukung di SQL Server", "`NOT IN` tidak bisa memakai index"], "`x NOT IN (1, NULL)` bernilai unknown untuk x berapa pun, sehingga tak ada baris yang lolos."],
      'purpose-cte': ["Tujuan utama CTE adalah…", ["Eksekusi yang selalu lebih cepat", "Keterbacaan: memberi nama pada satu tahap query", "Membuat temporary table yang bertahan selama session", "Meng-cache hasil supaya hanya dihitung sekali"], "CTE adalah ekspresi bernama untuk satu statement saja dan tidak di-cache oleh SQL Server."]
    }
  },
  design: {
    splits: ['1 · Tabel inti', '2 · Junction table & index', '3 · Kolom JSON'],
    terms: [
      ['Constraint (`CHECK`, `UNIQUE`, `NOT NULL`)', 'Aturan di mesin database supaya data rusak tak bisa masuk, meski lewat skrip manual di luar API.'],
      ['Normalisasi (1NF–3NF)', 'Menyimpan tiap fakta di satu tempat saja, bukan menyalin nama atau alamat ke banyak order agar data tetap selaras saat diubah.'],
      ['Surrogate vs Natural key', 'Key buatan berupa integer atau GUID takkan merusak foreign key saat customer mengganti email atau kode produk.']
    ],
    title: 'Desain schema: key, constraint, dan normalisasi',
    why: "Kode aplikasi sebagus apa pun tak sanggup menutupi skema tabel yang berantakan, karena setiap query terus harus mengakali strukturnya. Sebelum menetapkan kolom, biasakan bertanya apa yang rusak bila ada data salah masuk di sana.",
    points: [
      "Beri tiap **entitas** satu tabel, satu baris mewakili satu wujud data, dan simpan tiap fakta di **satu tempat**.",
      "**Foreign key** menjaga keutuhan hubungan antartabel: database menolak order yang menunjuk ke ID customer fiktif.",
      "Modelkan relasi one-to-many dengan foreign key di tabel anak, many-to-many lewat tabel perantara seperti `order_items`, dan jarang-jarang pakai one-to-one.",
      "**Normalisasi** mencegah duplikasi data. 1NF melarang daftar ditumpuk di satu sel, sedangkan 2NF dan 3NF mengikat seluruh kolom non-key murni ke key tabelnya.",
      "Constraint menjadi penjaga gratis tiap kali ada write (`NOT NULL`, `UNIQUE`, `CHECK (price >= 0)`, `DEFAULT`).",
      "Tentukan nasib baris anak saat parent dihapus. Bawaan foreign key menolak penghapusan, sedangkan `ON DELETE CASCADE` ikut menghapus anak-anaknya.",
      "Pahami ciri khas SQL Server: `IDENTITY` menghasilkan ID berurutan, `NVARCHAR(n)` menyimpan teks Unicode (`TEXT` sudah usang), dan foreign key tidak di-index otomatis.",
      "Denormalisasi boleh dilakukan dengan alasan jelas, misalnya menyimpan `unit_price` di item order supaya perubahan harga katalog tak mengubah catatan transaksi lama.",
      "**Kolom JSON** cocok buat setelan dinamis atau muatan mentah yang dibaca utuh. Validasi dengan `CHECK (ISJSON(col) = 1)`, ambil nilainya lewat `JSON_VALUE` atau `OPENJSON`, dan jadikan kolom biasa jika sering difilter atau di-join."
    ],
    practice: "Rancang skema perpustakaan berisi buku, banyak pengarang per buku, anggota, serta peminjaman. Tulis semua key dan constraint, lalu putuskan efek penghapusan anggota ke riwayat pinjamnya. Pilih satu fakta yang layak disimpan ganda atau jelaskan kenapa tak perlu.",
    teach: "Jelaskan kenapa nama dan alamat customer tidak pantas disalin di setiap baris order, serta akibat buruknya.",
    analogy: "Normalisasi mirip menulis nomor telepon teman di satu buku kontak utama ketimbang di banyak sticky note keliling rumah. Saat nomornya berganti, kamu cukup mengubah satu buku agar tak berakhir punya dua versi nomor.",
    pitfalls: [
      "Menyimpan tag terpisah koma di satu kolom (`'red,blue'`), yang mematikan index, join, dan foreign key.",
      "Menghilangkan foreign key 'demi fleksibilitas' lalu menumpuk baris yatim yang susah dibersihkan nanti.",
      "Terlalu kaku menormalisasi hingga menghapus sejarah harga: invoice lama tetap harus menyimpan harga beli saat transaksi terjadi.",
      "Menyimpan nominal uang di `FLOAT` atau `REAL`. Pakailah `DECIMAL` agar angka sen tidak meleset.",
      "Terus menyaring `JSON_VALUE(preferences, '$.language') = 'id'`, yang tak bisa menyentuh index biasa. Keluarkan jadi kolom normal atau index computed column."
    ],
    quiz: {
      'orders-products-many-many': ["Order dan produk berelasi many-to-many. Bagaimana memodelkannya?", ["Kolom `product_ids` berisi daftar yang dipisah koma di `orders`", "Junction table dengan foreign key ke masing-masing tabel", "Kolom `order_id` di `products`", "Satu baris `orders` per produk, dengan detail order yang diulang"], "Junction table punya satu baris per pasangan sekaligus mampu menyimpan atribut hubungan seperti quantity."],
      'foreign-key-constraint-prevent': ["Apa yang dicegah oleh constraint foreign key?", ["Join yang lambat", "Baris yang merujuk ke baris parent yang tidak ada", "Value yang duplikat di kolom itu", "Value NULL di kolom itu"], "Constraint ini menjaga tautan parent-child saat penulisan. Duplikat dijaga `UNIQUE`, sedangkan foreign key masih boleh NULL kecuali ditandai `NOT NULL`."],
      'unit-price-stored-order': ["Kenapa `unit_price` disimpan di `order_items` padahal `products` sudah punya `price`?", ["Itu kesalahan dan seharusnya diambil lewat join", "Penjualan harus menyimpan harga saat pembelian terjadi", "Supaya join ke `products` lebih cepat", "Foreign key mewajibkan salinan"], "Keduanya dua fakta terpisah: harga katalog hari ini berbeda dengan harga yang dibayar waktu transaksi."],
      'data-fits-json-column': ["Data mana yang paling cocok untuk kolom JSON?", ["Email customer, yang harus unik", "Pengaturan notifikasi yang field-nya berbeda-beda tiap customer", "`customer_id` pemilik sebuah order", "Harga produk, yang dipakai di laporan setiap hari"], "Data fleksibel yang dibaca serta disimpan utuh cocok masuk JSON. Kolom yang butuh constraint, join, atau agregasi harus berbentuk kolom bertipe asli."]
    }
  },
  indexes: {
    terms: [
      ['B-Tree seek vs Table scan', 'Index membuat SQL Server melompat ke key terurut lewat B-tree dalam O(log n) pembacaan, bukan membaca tiap halaman tabel dalam O(n).'],
      ['Clustered vs Covering index (`INCLUDE`)', 'Clustered mengurutkan isi tabel fisik menurut key. Menambah `INCLUDE (col)` membuat index non-clustered mampu menjawab query tanpa key lookup.'],
      ['Predikat sargable', 'Filter yang membandingkan kolom polos terindeks (`created_at >= ...`) mengizinkan seek, sedangkan membungkus kolom (`YEAR(created_at)`) memaksa full scan.']
    ],
    title: 'Index: cara database menemukan baris dengan cepat',
    predict: {
      prompt: 'Hanya ada `ix_orders_customer_date` pada `(customer_id, order_date)`. Filter mana yang bisa memakai index **seek** pada index itu?',
      options: ["`WHERE order_date >= '2026-02-01'`", "`WHERE customer_id = 2 AND order_date >= '2026-02-01'`", 'Keduanya, karena index-nya memuat kedua kolom'],
      answer: 1,
      explain: 'Composite index diurutkan berdasarkan `customer_id` dulu, dan `order_date` hanya diurutkan *di dalam* tiap pelanggan, mirip buku telepon yang diurutkan per nama keluarga lalu nama depan. Membatasi kolom terdepan membuat SQL Server bisa langsung melompat ke pelanggan 2 lalu menelusuri rentang tanggalnya. Filter yang hanya memakai `order_date` harus memindai seluruh index (atau tabel), karena tanggal yang cocok tersebar di semua pelanggan.'
    },
    why: "Query yang persis sama bisa kelar dalam 5 ms atau macet 50 detik hanya gara-gara satu index yang kurang. Index selalu menjadi tempat pertama yang diperiksa saat halaman melambat seiring membesarnya tabel.",
    points: [
      "Tanpa index, SQL memindai tiap baris dengan waktu O(n). Index B-tree melompati beberapa level pohon terurut dalam waktu O(log n) yang disebut **seek**.",
      "Tiap index merawat salinan terurut kolom terpilih beserta penunjuk ke baris asli. Pembacaan melesat cepat, sedangkan **penulisan melambat** dan ruang disk bertambah.",
      "Di SQL Server, **clustered index** menyimpan fisik tabel terurut menurut key (umumnya primary key), dan index non-clustered menunjuk balik ke sana. PostgreSQL memakai heap tak terurut.",
      "**Composite index** di `(a, b)` mempercepat saringan `a` maupun `a AND b`, tak pernah `b` sendirian (aturan leftmost-prefix). Taruh kolom sama-dengan sebelum kolom rentang.",
      "**Covering index** menyertakan kolom ekstra lewat `INCLUDE (...)` supaya mesin database tak perlu menengok tabel utama sama sekali.",
      "Index efektif pada kolom selektif. Untuk kolom `status` berisi tiga nilai, SQL Server sering mengabaikan index lalu melakukan scan biasa.",
      "Beri index pada kolom panas di `WHERE`, `JOIN`, `ORDER BY`, serta foreign key. Di EF Core, `HasIndex(o => new { o.CustomerId, o.OrderDate })` menurunkannya ke migration."
    ],
    practice: "Coba beberapa target di index visualizer dan perkirakan perbandingan baca scan vs seek untuk 1.000.000 baris. Lalu nyalakan Include Actual Execution Plan (Ctrl+M) di SSMS untuk membandingkan query sebelum dan sesudah di-index. Di SQLite pun `EXPLAIN QUERY PLAN` membedakan `SCAN` vs `SEARCH`.",
    teach: "Jelaskan kenapa index mempercepat pencarian tetapi memperlambat insert tanpa menyebut istilah 'B-tree'.",
    analogy: "Index mirip daftar indeks di belakang buku cetak berisi kata kunci berurutan dan nomor halamannya. Menemukan satu topik cuma makan hitungan detik, meski tiap kali ada halaman baru, daftar indeks itu ikut harus diperbarui.",
    pitfalls: [
      "Memasang index di semua kolom 'buat jaga-jaga' hingga membebani tiap operasi tulis.",
      "Mengira `(last_name, first_name)` membantu pencarian yang hanya menyebut `first_name`.",
      "Lupa meng-index foreign key sehingga hapus parent dan join memicu scan ke seluruh tabel anak.",
      "Meng-index kolom bervariasi rendah seperti flag `is_active` lalu bingung kenapa optimizer tetap memindai semua baris."
    ],
    quiz: {
      'index-exists-country-city': ["Ada index pada `(country, city)`. Filter mana yang bisa melakukan seek dengan index itu?", ["`WHERE city = 'Bandung'`", "`WHERE country = 'ID'`", "`WHERE city = 'Bandung' OR country = 'ID'`", "Dua pilihan pertama"], "Composite index cocok mulai dari kolom paling kiri, jadi `city` sendirian tak memenuhi awalannya."],
      'cost-adding-index': ["Apa biaya utama dari menambah index?", ["Pembacaan jadi lebih lambat", "Setiap insert, update, dan delete juga harus memperbarui index-nya, dan ia memakan storage", "Tabelnya tidak bisa di-alter lagi", "Tabelnya ter-lock selama index itu ada"], "Tiap penulisan wajib ikut memutakhirkan struktur terurut tambahan ini di disk."],
      'covering-index-means': ["Index yang 'covering' artinya…", ["Ia mencakup setiap kolom di tabel", "Ia memuat semua kolom yang dibutuhkan sebuah query, jadi tabelnya tidak dibaca", "Ia adalah clustered index", "Ia mempercepat semua query pada tabel itu"], "SQL Server menjawab seluruh query langsung dari index dengan nol key lookup."]
    }
  },
  transactions: {
    splits: ['1 · Transfer semua-atau-tidak', '2 · Lost update vs atomik', '3 · Optimistic concurrency'],
    terms: [
      ['ACID', 'Atomicity (berhasil semua atau batal), Consistency (constraint sah), Isolation (aman saat paralel), dan Durability (selamat dari crash setelah `COMMIT`).'],
      ['Isolation level', 'Menyeimbangkan antrean lock dan anomali paralel di antara `Read Committed`, `Repeatable Read`, `Serializable`, serta snapshot RCSI.'],
      ['`UPDATE` bersyarat atomik', '`UPDATE Products SET Stock = Stock - @qty WHERE Id = @id AND Stock >= @qty` mengecek dan menurunkan stok dalam satu langkah tak terpecah.']
    ],
    title: 'Transaction, ACID, dan isolation',
    predict: {
      prompt: 'Chair (`id = 7`) punya `stock = 1`. Dua pembeli menjalankan `UPDATE products SET stock = stock - 1 WHERE id = 7 AND stock > 0;` pada saat yang bersamaan. Apa yang terjadi?',
      options: ['Keduanya berhasil dan `stock` berakhir di `-1`', 'Satu mendapat `@@ROWCOUNT = 1`; yang lain menunggu lock, mengecek ulang `stock > 0`, lalu mendapat `0`', 'Keduanya membaca `1` dan sama-sama menulis `0`: lost update'],
      answer: 1,
      explain: 'Satu perintah `UPDATE` membaca dan menulis baris secara atomik sambil memegang exclusive lock. Statement kedua tertahan oleh lock itu sampai yang pertama commit, lalu mengevaluasi `stock > 0` terhadap nilai baru `0`, tidak menemukan baris yang cocok, dan melaporkan `@@ROWCOUNT = 0`. Lost update hanya terjadi kalau aplikasi membaca lewat `SELECT`, mengurangi di kode, lalu menulis hasilnya kembali.'
    },
    why: "Transfer bank, pengurangan stok barang, serta penulisan checkout wajib tuntas semua atau batal semua biarpun trafik sedang tinggi. Setiap kode yang memodifikasi tabel butuh pemahaman transaksi.",
    points: [
      "**Transaction** membungkus beberapa perintah menjadi satu kesatuan memakai `BEGIN TRANSACTION` … `COMMIT`, atau `ROLLBACK` untuk membatalkan semuanya.",
      "**ACID** berarti Atomic (tuntas semua atau batal), Consistent (constraint lolos), Isolated (pekerjaan paralel tak merusak data), dan Durable (hasil commit bertahan meski crash).",
      "Kenali empat anomali: **dirty read** (data belum commit), **non-repeatable read** (baris berubah di tengah transaksi), **phantom** (baris baru muncul), dan **lost update**.",
      "**Isolation level** menukar kecepatan antrean dengan perlindungan: Read Uncommitted → Read Committed → Repeatable Read → Serializable, plus Snapshot. SQL Server defaultnya Read Committed, sedangkan MySQL memakai Repeatable Read.",
      "Tambahkan `SET XACT_ABORT ON` agar SQL Server menggagalkan seluruh transaction bila muncul error, bukannya lanjut separuh jalan.",
      "Pertahankan durasi transaction tetap **singkat** tanpa menunggu jeda pengguna atau panggilan HTTP eksternal.",
      "Cegah balapan baca-lalu-tulis dengan satu `UPDATE … WHERE stock > 0`, atau gunakan **optimistic concurrency** lewat kolom `rowversion` (`[Timestamp]` di EF Core)."
    ],
    practice: "Buka dua tab SSMS atau dua terminal `sqlcmd` ke database sama (playground cuma punya satu koneksi). Jalankan `BEGIN TRANSACTION` dan kurangi saldo akun 1 tanpa commit di tab A, lalu query akun 1 di tab B untuk melihatnya menunggu. Commit di tab A dan ulangi dengan `READ_COMMITTED_SNAPSHOT` menyala.",
    teach: "Jelaskan arti 'atomic' di ACID lewat transfer bank dan apa kejanggalan yang dilihat pengguna jika aturan itu rusak.",
    analogy: "Transaction mirip membeli di vending machine. Mesin mengambil uang lalu menjatuhkan makanan, atau mengembalikan uangmu utuh sambil menahan makanannya. Tak pernah berakhir uang lenyap sementara jajanan tersangkut.",
    pitfalls: [
      "Membaca saldo ke memori aplikasi, menghitungnya, lalu menulis balik berisiko memicu lost update. Mode Read Committed pun tak bisa mencegahnya.",
      "Menahan transaction database terbuka sembari menunggu panggilan HTTP API eksternal yang lambat.",
      "Mengira isolation bawaan menangkis semua balapan. Read Committed masih meloloskan non-repeatable read, phantom, dan lost update.",
      "Membiarkan `XACT_ABORT` mati membuat SQL Server mengabaikan sebagian error dan telanjur men-commit perubahan separuh."
    ],
    quiz: {
      'transfer-debits-account-then': ["Sebuah transfer mendebit rekening A, lalu server crash sebelum mengkredit B. Dengan transaction, apa hasilnya setelah restart?", ["A terdebit, B tidak terkredit", "Tidak ada perubahan yang diterapkan", "B dikredit saat server menyala lagi", "Database harus di-restore dari backup"], "Atomicity menggagalkan seluruh transaksi yang belum commit selama proses pemulihan."],
      'anomaly-reading-data-another': ["Anomali mana yang berarti 'membaca data yang belum di-commit oleh transaction lain'?", ["Phantom", "Dirty read", "Lost update", "Non-repeatable read"], "Dirty read hanya bisa muncul pada mode Read Uncommitted atau saat memakai hint `NOLOCK`."],
      'safest-way-decrement-stock': ["Cara paling aman mengurangi stok di bawah concurrency?", ["`SELECT`, lalu `UPDATE` dengan value hasil hitungan, di dalam transaction", "`UPDATE … SET stock = stock - 1 WHERE stock > 0`, lalu cek jumlah baris yang terkena", "Simpan jumlah stok di memory aplikasi", "Baca dengan `NOLOCK` dulu supaya tidak memblokir siapa pun"], "Dalam Read Committed, dua sesi sama-sama bisa membaca stok sama sebelum menulis. Satu perintah atomic menutup celah penyisipan penulis lain."]
    }
  },
  window: {
    terms: [
      ['`OVER (PARTITION BY ...)`', 'Membagi baris ke jendela perhitungan tanpa menciutkannya, jadi seluruh baris asli tetap muncul di hasil akhir.'],
      ['`ROW_NUMBER()` vs `DENSE_RANK()`', '`ROW_NUMBER` memberi angka urut unik (1, 2, 3), sementara `DENSE_RANK` menyamakan peringkat angka seri tanpa melompat (1, 1, 2).'],
      ['Frame / Total berjalan (`ORDER BY`)', 'Menaruh `ORDER BY` di dalam `OVER (...)` mengubah jumlah grup biasa menjadi jumlah berjalan baris per baris.']
    ],
    title: 'Window function',
    predict: {
      prompt: 'Misalkan dua produk Tech termahal punya harga yang sama. Dengan `RANK() OVER (PARTITION BY category ORDER BY price DESC)`, nilai `price_rank` apa yang didapat tiga baris Tech teratas?',
      options: ['`1, 2, 3`', '`1, 1, 3`', '`1, 1, 2`'],
      answer: 1,
      explain: '`RANK()` memberi peringkat yang sama untuk baris yang seri lalu melompati angka berikutnya, jadi baris selanjutnya mendapat `3`. `DENSE_RANK()` akan menghasilkan `1, 1, 2`, sedangkan `ROW_NUMBER()` menghasilkan `1, 2, 3` dengan urutan acak di antara baris yang seri. Poin terakhir ini penting untuk query top-1 per grup: tambahkan kolom pemecah seri di `ORDER BY` agar `rn = 1` selalu deterministik.'
    },
    why: "Peringkat produk, saldo berjalan, selisih bulan lalu, dan top-N per kategori hadir di hampir semua laporan bisnis. Window function menggantikan self-join berbelit dengan satu ekspresi ringkas.",
    points: [
      "Window function menghitung lintas baris terkait **tanpa menggulungnya**. Berbeda dari `GROUP BY`, setiap baris asli tetap utuh.",
      "`OVER (PARTITION BY x ORDER BY y)` menentukan cara baris dikelompokkan ke partisi dan diurutkan di dalamnya.",
      "Untuk peringkat, pakai `ROW_NUMBER()` bagi angka unik (1, 2, 3), `RANK()` bila seri melompat, atau `DENSE_RANK()` bila seri rapat.",
      "`SUM(amount) OVER (ORDER BY date)` menghitung total berjalan. Tanpa `ORDER BY`, nilainya menjadi total utuh partisi diulang tiap baris.",
      "Dengan `ORDER BY`, tanggal kembar bawaannya memakai total berjalan yang sama. Tambah pemecah seri (`ORDER BY order_date, id`) atau pakai `ROWS UNBOUNDED PRECEDING`.",
      "Pakai `LAG` dan `LEAD` untuk membaca nilai baris sebelum atau sesudahnya guna menghitung selisih antarperiode.",
      "Untuk top-N per grup, beri nomor baris di CTE dengan `ROW_NUMBER()`, lalu saring `WHERE rn <= N` di luarnya."
    ],
    practice: "Di playground, tampilkan dua produk termahal di setiap kategori. Lalu tambahkan kolom yang menunjukkan harga tiap produk sebagai persentase dari total kategorinya.",
    teach: "Jelaskan perbedaan hasil antara `SUM(x) OVER (PARTITION BY c)` dan `SUM(x) … GROUP BY c`.",
    analogy: "`GROUP BY` menaikkan murid tiap kelas ke bus lalu melaporkan satu angka per bus. Window function membiarkan murid tetap duduk di mejanya sambil membagikan kartu berisi peringkat kelas dan rata-rata tinggi kelas.",
    pitfalls: [
      "Mencoba menyaring hasil window function langsung di `WHERE`. Hitungan window jalan sesudah `WHERE`, jadi bungkus dalam CTE dulu.",
      "Memakai `RANK()` padahal kamu wajib dapat tepat satu pemenang per grup: nilai kembar memunculkan banyak baris. Pakai `ROW_NUMBER()`.",
      "Lupa menulis `ORDER BY` pada total berjalan sehingga seluruh baris mencetak grand total sama rata.",
      "Total berjalan melompat mendadak karena banyak transaksi bertanggal sama. Sertakan pemecah seri unik di dalam `ORDER BY`."
    ],
    quiz: {
      'scores-90-90-80': ["Skor 90, 90, 80. Peringkat apa yang diberikan `RANK()` (menurun)?", ["1, 2, 3", "1, 1, 2", "1, 1, 3", "1, 2, 2"], "`RANK` menyamakan peringkat angka seri lalu melompati angka berikutnya, sedangkan `DENSE_RANK` menghasilkan 1, 1, 2."],
      'many-rows-window-function': ["Berapa banyak baris yang dikembalikan window function dibandingkan input-nya?", ["Satu per partition", "Jumlahnya sama", "Satu per value `ORDER BY` yang berbeda", "Lebih sedikit, kalau ada yang seri"], "Window function menambah kolom hitungan tanpa meringkas jumlah baris."],
      'function-reads-previous-row': ["Function mana yang membaca value dari baris sebelumnya?", ["`LEAD`", "`LAG`", "`FIRST_VALUE`", "`ROW_NUMBER`"], "`LAG` membaca baris mundur ke belakang, sedangkan `LEAD` membaca maju ke depan."]
    }
  },
  plans: {
    splits: ['1 · Filter sargable', '2 · Mengukur dengan STATISTICS', '3 · Keyset pagination'],
    terms: [
      ['Seek vs Scan & Key Lookup', 'Operator plan yang membuka apakah SQL melompat lewat index seek, memindai tabel, atau bolak-balik mengambil kolom ke tabel utama.'],
      ['Logical reads (`STATISTICS IO`)', 'Jumlah persis halaman 8 KB yang dibaca, memberi tolok ukur tuning yang stabil ketimbang angka milidetik yang berubah-ubah.'],
      ['Keyset pagination (`WHERE id > @last`)', 'Melompat langsung ke halaman berikutnya dalam O(log n) ketimbang membuang jutaan baris lewat `OFFSET` dalam.']
    ],
    title: 'Execution plan dan query tuning',
    why: "Optimasi query bukan kerja menebak. Execution plan membeberkan cara kerja mesin sebenarnya di balik layar, jadi kamu tinggal mengubah satu hal berdasar bukti lalu mengukur penurunan bacanya.",
    points: [
      "**Optimizer** SQL Server menyusun rencana eksekusi memakai **statistics** sebaran data. Statistics usang mengacaukan tebakan jumlah baris dan melahirkan plan lambat.",
      "Baca plan dengan membandingkan **baris perkiraan vs aktual** sambil memburu operator terberat seperti scan penuh, key lookup, sort, dan spill.",
      "Kenali jenis join: **nested loops** cocok buat input luar kecil ber-index, **hash join** bagi input besar acak, dan **merge join** bagi input yang sudah terurut.",
      "Kondisi **sargable** mengizinkan index seek. Membungkus kolom dengan fungsi (`YEAR(order_date) = 2026`) atau awalan wildcard (`LIKE '%x'`) memaksa full scan.",
      "Konversi tipe tersembunyi mematikan seek diam-diam. Di .NET, parameter string bawaan dikirim sebagai `NVARCHAR` terhadap kolom `VARCHAR` kecuali dipetakan dengan `IsUnicode(false)`.",
      "**Parameter sniffing** terjadi waktu plan yang dibuat untuk satu parameter dipakai ulang untuk parameter lain yang timpang. Cek Query Store, perbaiki index dulu, lalu pertimbangkan `OPTION (RECOMPILE)` atau Query Store hint.",
      "Di playground, `EXPLAIN QUERY PLAN` mencetak rencana milik SQLite. Memanggil `strftime('%Y', order_date)` melumpuhkan index persis seperti `YEAR()`."
    ],
    practice: "Ambil query paling lambat di salah satu project-mu. Rekam plan aktual dan output `STATISTICS IO`-nya, tulis hipotesismu, ubah tepat satu hal (sebuah index atau penulisan ulang), lalu ukur lagi. Sajikan dalam format sebelum / perubahan / sesudah.",
    teach: "Jelaskan apa arti 'sargable' dan alasan `WHERE YEAR(order_date) = 2026` gagal memakai index `order_date`.",
    analogy: "Buku telepon tersusun menurut nama belakang. Mencari nama 'Smith' cuma butuh satu kali buka (seek), tapi mencari akhiran '-son' memaksa membaca semua halaman karena awalan urutannya tak terpakai.",
    pitfalls: [
      "Menambah banyak index asal tebak tanpa memeriksa execution plan.",
      "Mempercayai estimated plan ketika jumlah baris aktualnya meleset ribuan kali lipat.",
      "Paging memakai `OFFSET` dalam yang terus membaca lalu membuang ribuan baris di tiap halaman.",
      "Memasang `OPTION (RECOMPILE)` pada query yang dipanggil ribuan kali per detik, membuang CPU terus-terusan hanya untuk compile ulang."
    ],
    quiz: {
      'condition-use-index-seek': ["Kondisi mana yang bisa memakai index seek pada `order_date`?", ["`WHERE YEAR(order_date) = 2026`", "`WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'`", "`WHERE CONVERT(CHAR(4), order_date, 120) = '2026'`", "`WHERE DATEADD(day, 1, order_date) > '2026-01-01'`"], "Hanya rentang pada kolom polos yang sifatnya sargable. Opsi lain menjalankan fungsi ke kolomnya dulu."],
      'estimated-rows-10-actual': ["Perkiraan baris: 10. Baris aktual: 900.000. Penyebab yang paling mungkin?", ["Terlalu banyak index di tabel itu", "Statistics yang basi atau menyesatkan, atau parameter sniffing", "Server kekurangan memory", "Query-nya memakai CTE"], "Optimizer menyusun plan untuk 10 baris padahal aslinya 900.000. Perbaiki estimasi barisnya agar plan ikut pulih."],
      'join-algorithm-suits-small': ["Algoritma join mana yang cocok untuk input luar yang kecil dengan index di tabel dalam?", ["Hash join", "Nested loops", "Merge join", "Tabel mana pun yang ditulis lebih dulu"], "Nested loops melakukan satu index seek murah per baris luar."]
    }
  },
  locking: {
    splits: ['1 · Deadlock & urutan lock', '2 · Row version & upsert', '3 · Versi MERGE'],
    terms: [
      ['Shared (S) vs Exclusive (X) lock', 'Pembaca saling berbagi S lock, sementara penulis mengambil X lock yang menahan pembaca maupun penulis lain di `Read Committed` klasik.'],
      ['Deadlock (`Error 1205`)', 'Siklus saat Tx A menunggu Tx B dan Tx B menunggu Tx A. Memakai urutan akses baku yang sama mencegahnya terulang.'],
      ['MVCC / RCSI', 'Menyimpan versi baris ter-commit sebelumnya di `tempdb` agar pembaca dan penulis berhenti saling memblokir.']
    ],
    title: 'Locking, deadlock, dan MVCC',
    why: "Saat aplikasi mendadak timeout waktu trafik padat, biang keroknya kerap berupa blocking antar-transaksi. Mengerti cara lock mengantre membantumu melacak penahan lock lalu mengubah urutan akses agar transaksi berjalan mulus.",
    points: [
      "Di mode Read Committed bawaan SQL Server, pembaca mengambil shared (S) lock dan penulis mengambil exclusive (X) lock. Penulis menahan pembaca, dan pembaca sejenak menahan penulis.",
      "**MVCC** menyimpan versi baris lama supaya pembaca melihat snapshot aman dan **tak memblokir penulis** (penulis tetap menunggu penulis). PostgreSQL selalu begini, sedangkan SQL Server memakainya lewat `READ_COMMITTED_SNAPSHOT` (default Azure SQL).",
      "**Deadlock** membentuk siklus kunci: T1 memegang A menunggu B, sementara T2 memegang B menunggu A. SQL Server menghentikan satu korban dengan error 1205.",
      "Cegah deadlock dengan menyentuh tabel dan baris dalam **urutan seragam**, menjaga transaksi singkat, meng-index filter `WHERE`, dan memasang retry lewat `EnableRetryOnFailure()` EF Core.",
      "Awas blocking terselubung: `UPDATE` tanpa index di filter WHERE mengunci seluruh baris yang dipindai. Lewat ~5.000 lock, SQL Server menguncinya menjadi table lock.",
      "Lacak penahan lock langsung memakai `blocking_session_id` di `sys.dm_exec_requests`, `sys.dm_tran_locks`, dan grafik deadlock di `system_health`.",
      "Upsert polos rawan balapan waktu dua sesi menyisip bareng. Amankan pakai `UPDATE … WITH (UPDLOCK, HOLDLOCK)` disambung `IF @@ROWCOUNT = 0 INSERT …` plus key `UNIQUE`."
    ],
    practice: "Buka dua jendela SSMS atau terminal `sqlcmd` ke tabel `accounts` uji coba lalu pancing error 1205 sendiri. Ambil grafik deadlock dari `system_health`, terapkan perbaikan urutan ID terkecil, lalu pasang `EnableRetryOnFailure()` di EF Core dan jelaskan kenapa tim memakai keduanya.",
    teach: "Jelaskan proses dua transfer serentak di sepasang akun yang sama memicu deadlock, beserta satu cara menghentikannya.",
    analogy: "Dua pegawai berpapasan di lorong sempit, masing-masing menggenggam separuh kunci dan menggapai separuh di tangan lawan. Database menepuk pundak salah satunya agar melepas dulu dan mengulang. Kesepakatan mengambil sisi kiri lebih dulu mencegah jalan buntu.",
    pitfalls: [
      "Menyalahkan mesin database ketika terjadi deadlock, bukannya membenahi urutan lock yang bertabrakan.",
      "Menabur hint `NOLOCK` untuk menyembunyikan antrean meski hasilnya membaca data kotor atau robek.",
      "Membiarkan error deadlock mematikan request ketimbang menanganinya sebagai retry sementara.",
      "Mengulang hanya satu perintah SQL yang gagal, padahal SQL Server membatalkan seluruh isi transaction korban.",
      "Upsert memakai `IF NOT EXISTS … INSERT` tanpa hint lock, yang berakhir bentrok duplicate key saat diklik serentak."
    ],
    quiz: {
      'standard-way-prevent-deadlocks': ["Apa cara standar mencegah deadlock antara transaction yang meng-update baris yang sama?", ["Tambahkan `WITH (NOLOCK)` pada update-nya", "Akses baris-barisnya dengan urutan yang konsisten", "Naikkan isolation level ke Serializable", "Perbesar lock timeout"], "Urutan lock bersama memutus siklus sebelum sempat terbentuk, sedangkan Serializable mengambil lebih banyak lock sehingga deadlock justru makin mudah terjadi."],
      'read-committed-snapshot-long': ["Dengan `READ_COMMITTED_SNAPSHOT` aktif, pembacaan yang berjalan lama…", ["memblokir semua penulis sampai selesai", "melihat versi yang konsisten dan tidak memblokir penulis", "melihat perubahan transaction lain yang belum di-commit", "mengambil lock pada seluruh tabel"], "Pembaca membaca snapshot versi baris yang sudah commit, bukan meminta shared lock."],
      'application-code-chosen-deadlock': ["Apa yang harus dilakukan kode aplikasi saat terpilih sebagai korban deadlock?", ["Tampilkan error-nya ke user", "Retry seluruh transaction", "Retry hanya statement yang gagal", "Tidak perlu apa-apa: perubahannya sudah tersimpan"], "Seluruh isi transaction sudah di-rollback, jadi mengulang kalimat terakhir saja hanya menuliskan setengah data."],
      'two-requests-run-update': ["Dua request menjalankan `UPDATE …` lalu `IF @@ROWCOUNT = 0 INSERT …` bersamaan tanpa hint lock. Apa yang terjadi?", ["Tidak ada, sebab kedua perintah berjalan terpisah", "Keduanya tidak menemukan baris dan sama-sama insert, jadi salah satunya gagal di primary key", "Database menggabungkan kedua insert menjadi satu baris", "Request kedua otomatis menunggu sampai yang pertama commit"], "Tiap perintah memang berjalan tunggal, tapi pasangan keduanya masih bisa terselip. Hint `UPDLOCK, HOLDLOCK` mengunci celahnya sampai commit."]
    }
  },
  scale: {
    terms: [
      ['Migrasi expand-and-contract', 'Perubahan skema bertahap: tambah kolom nullable → rilis tulis ganda → isi batch data → wajibkan `NOT NULL` → buang kolom lama.'],
      ['Read replica & lag', 'Menampung query baca GET serta analitik asinkron. Replika tertinggal sedikit di belakang primary, jadi baca-setelah-tulis tetap ke primary.'],
      ['Connection pooling', 'Memakai ulang koneksi TCP dan autentikasi yang sudah hangat lintas request HTTP ketimbang membuka koneksi baru tiap kali.']
    ],
    title: 'Scaling dan mengembangkan database',
    why: "Ukuran tabel membengkak dan bentuk data berubah saat sistem terus melayani trafik. Tugas utama engineer adalah menjalankan migrasi tanpa mematikan layanan dan memilih opsi scaling paling hemat sebelum lompat ke arsitektur mahal.",
    points: [
      "Scaling dilakukan berurutan: benahi query dan index → tambah cache → scale up → **read replica** → **partitioning** → **sharding**. Tiap tingkat menambah beban perawatan.",
      "Read replica meringankan beban primary, tapi jeda replikasi asinkron membuat user tak boleh membaca tulisannya sendiri yang baru masuk dari replika.",
      "**Partitioning** memecah satu tabel besar menurut tanggal atau key agar irisan lama mudah dibuang, sedangkan **sharding** menyebar data ke banyak server hingga memutus join biasa.",
      "Untuk **migrasi tanpa downtime** (**expand → migrate → contract**), tambah kolom nullable baru, tulis ganda, isi batch demi batch, pindahkan bacaan, lalu hapus kolom lama.",
      "Rilis kode yang mampu berjalan memakai skema lama maupun baru selama proses deploy bergulir berdampingan.",
      "Daripada membiarkan EF Core menerbitkan satu `RenameColumn` yang langsung merusak server, pecah ganti nama kolom jadi fase expand dan contract bersama rilis kode.",
      "Pahami kapan tabel relasional butuh pendamping: fungsi JSON (`JSON_VALUE`), full-text search, indexed view, cache Redis, search engine, atau message queue."
    ],
    practice: "Susun skrip SQL dan tahapan rilis kode untuk memecah kolom `name` menjadi `first_name` dan `last_name` di tabel 50 juta baris tanpa downtime. Tandai langkah mana yang paling berat di-rollback.",
    teach: "Jelaskan pola expand–migrate–contract dan kenapa mengganti nama kolom dalam satu migrasi mematikan trafik aktif.",
    analogy: "Bayangkan mengganti jembatan tanpa menyetop lalu lintas. Bangun jembatan baru di samping jembatan lama (expand), pindahkan jalur mobil pelan-pelan (migrate), baru bongkar jembatan lama sesudah kosong (contract).",
    pitfalls: [
      "Lompat ke sharding sebelum mengoptimalkan query, index, cache, dan read replica lebih dulu.",
      "Mengisi kolom baru di jutaan baris lewat satu `UPDATE` raksasa hingga tabel terkunci lama dan log transaksi penuh.",
      "Mengira bacaan dari read replica langsung menampilkan data terbaru beberapa milidetik sesudah primary menulis.",
      "Menjalankan satu migrasi `RenameColumn` EF Core di produksi saat instance aplikasi versi lama masih mengakses nama kolom lama."
    ],
    quiz: {
      'first-step-zero-downtime': ["Langkah pertama me-rename kolom tanpa downtime?", ["Hapus kolom lamanya", "Tambahkan kolom baru di samping kolom lama", "Rename di tempat dengan `sp_rename`", "Salin tabelnya dengan nama baru"], "Expand lebih dulu supaya aplikasi versi lama dan baru sama-sama tetap cocok."],
      'user-saves-profile-next': ["User menyimpan profil, halaman berikutnya membaca dari replica dan menampilkan value lama. Kenapa?", ["Ada bug di query SQL-nya", "Replication lag: replica belum menerapkan penulisan itu", "Browser meng-cache halaman lama", "Deadlock me-rollback penyimpanannya"], "Replika asinkron sedikit tertinggal, jadi request yang wajib langsung melihat tulisan sendiri harus diarahkan ke primary."],
      'makes-sharding-costly-compared': ["Apa yang membuat sharding mahal dibandingkan partitioning di satu server?", ["Index berhenti bekerja lintas shard", "Join dan transaction lintas shard sulit atau mustahil", "Setiap shard butuh schema yang berbeda", "Backup tidak bisa dilakukan lagi"], "Memisah tabel ke server berlainan memutus join antar-mesin serta transaksi atomic sekaligus."]
    }
  }
}
};

export default trackId;
