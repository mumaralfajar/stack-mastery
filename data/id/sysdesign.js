// Bahasa Indonesia — track System Design. Contoh kode memakai versi aslinya.
I18N.lessons('sysdesign', {
  thinking: {
    terms: [
      ['Tail latency (`p95`, `p99`)', 'Batas waktu respons yang dipenuhi oleh 95% atau 99% request. Nilai rata-rata menyembunyikan outlier lambat yang merusak pengalaman saat checkout atau login di bawah beban tinggi.'],
      ["Hukum Little (`L = λW`)", 'Rata-rata pekerjaan aktif yang sedang berjalan (`L`) sama dengan laju kedatangan (`λ`) dikali rata-rata waktu di dalam sistem (`W`). Kenaikan latency otomatis melipatgandakan koneksi terbuka meski QPS tetap.'],
      ['Scaling vertikal vs horizontal', 'Scaling vertikal menaikkan kapasitas satu mesin (lebih banyak CPU/RAM, transaksi sederhana, dibatasi batas fisik hardware). Scaling horizontal menambah node stateless di balik load balancer (kapasitas tinggi, butuh koordinasi terdistribusi).']
    ],
    title: 'Latency, throughput, dan estimasi kapasitas',
    why: "Desain sistem dimulai dari skala angka, bukan langsung menggambar kotak arsitektur. Sebelum memilih cache atau men-shard database, perkirakan dulu laju request, pertumbuhan penyimpanan, bandwidth, dan bagaimana tail latency menggandakan konkurensi lewat Hukum Little.",
    points: [
      "**Latency** mengukur durasi satu request (`ms`), sedangkan **throughput** mengukur volume (`RPS` / `QPS`). Menambah replika worker menaikkan throughput tanpa otomatis mempercepat satu query yang memang lambat.",
      "Ukur **p50, p95, dan p99**, bukan hanya rata-rata. Jika satu halaman memanggil 10 layanan backend secara paralel, halaman menunggu respons paling lambat—mendorong ekor lambat 1% mengenai hampir 10% total kunjungan (`1 - 0.99^10`).",
      "Hafalkan patokan kecepatan hardware: baca RAM **~100 ns**, NVMe SSD **~100 µs**, round-trip jaringan satu AZ **~0.5 ms**, lintas region **50–150 ms**.",
      "Patokan cepat: sehari memiliki `86.400` detik (~`100.000`), sehingga **1 juta event/hari ≈ 12 RPS** rata-rata (siapkan kapasitas puncak **3×–10×** lebih tinggi).",
      "Terapkan **Hukum Little (`L = λW`)**: pada `2.000 RPS` dengan latency `50 ms` (`0.05 s`), server menahan `100` request bersamaan; bila lock database mendorong latency ke `500 ms`, konkurensi melonjak menjadi `1.000` dan menghabiskan connection pool.",
      "Uji asumsi dengan load generator nyata seperti **k6**, **bombardier**, atau **NBomber**, bukan mengandalkan benchmark lokal di laptop."
    ],
    practice: "Simpan sebagai `main.go` lalu jalankan `go run .`. Ubah `latencies` agar berisi dua puluh respons 15 ms dan satu jeda lock DB 900 ms: bandingkan `p50` vs `p99`, lalu hitung kebutuhan koneksi DB pool memakai Hukum Little pada puncak `3.000` RPS.",
    teach: "Jelaskan mengapa dua API dengan rata-rata latency sama-sama 25 ms bisa terasa jauh berbeda di produksi, lalu uraikan `L = λW` dengan contoh query downstream yang melambat.",
    analogy: "Lajur jalan tol menghitung jumlah mobil lewat per jam (throughput), sementara lama perjalanan tiap mobil (latency) ditentukan kecepatan dan antrean gerbang tol. Bila gerbang macet 30 detik, mobil mengantre sampai bahu jalan (`L = λW`) meski mobil yang masuk tidak bertambah.",
    pitfalls: [
      "Menentukan kapasitas cluster dari RPS harian rata-rata (`harian / 86.400`) alih-alih beban puncak (lonjakan login pagi, flash sale, atau gajian).",
      "Hanya memantau latency rata-rata (`mean`), sehingga lonjakan ekor `p99` luput padahal memukul pengguna aktif.",
      "Menambah core CPU pada layanan yang sebenarnya terhambat antrean connection pool atau round-trip jaringan lintas region."
    ],
    quiz: [
      ["Pada beban tetap 1.000 RPS, perlambatan database menaikkan rata-rata waktu respons dari 20 ms menjadi 400 ms. Apa yang terjadi pada jumlah request aktif (`L = λW`)?", ["Tetap 20 karena RPS tidak berubah", "Turun dari 20 ke 1", "Melonjak dari 20 menjadi 400, berisiko menghabiskan thread atau connection pool", "Turun setengah menjadi 10"], "Sesuai Hukum Little (`L = λW`), `1.000 * 0.4 d = 400` request aktif bersamaan, bukan lagi `20`."],
      ["Sekitar berapa RPS rata-rata untuk 8,6 juta event per hari?", ["10 RPS", "100 RPS", "1.000 RPS", "8.600 RPS"], "`8.640.000 / 86.400 detik = 100 RPS` rata-rata (ingat patokan cepat: ~1 juta/hari ≈ 12 RPS)."],
      ["Mengapa fan-out paralel ke 10 microservice terpisah memperburuk tail latency?", ["Serialisasi menggandakan ukuran payload", "Parent request menunggu respons paling lambat di antara ke-10 panggilan tersebut", "HTTP/1.1 menjatuhkan setiap paket kesepuluh", "Cache DNS kedaluwarsa di setiap hop"], "Jika tiap layanan punya ekor lambat 1%, memanggil 10 secara paralel membuat sekitar `1 - 0.99^10 ≈ 9.6%` request terkena layanan lambat."]
    ]
  },

  networking: {
    splits: [['NGINX Edge Proxy', '# --- 1. NGINX'], ['Envoy Cluster + Outlier', '# --- 2. Envoy']],
    terms: [
      ['Load balancer L4 vs L7', 'L4 meneruskan paket/aliran TCP berdasarkan IP dan port berkecepatan sangat tinggi; L7 mengakhiri TLS dan membaca header HTTP, path, cookie, serta frame gRPC untuk routing cerdas.'],
      ['Health check aktif vs pasif', 'Pemeriksaan aktif menembak endpoint `/readyz` berkala (tersedia bawaan di Envoy dan NGINX Plus); pemeriksaan pasif (Outlier Detection) mengeluarkan backend ketika trafik nyata memicu error 5xx atau timeout beruntun.'],
      ['HTTP/3 (QUIC)', 'Menjalankan stream termultipleks di atas UDP dengan handshake 0-RTT/1-RTT yang lebih cepat dan bebas blokade head-of-line TCP saat paket hilang di jaringan seluler.']
    ],
    title: 'DNS, CDN, reverse proxy, dan load balancer',
    why: "Setiap request melewati DNS, terminasi TLS, serta minimal satu reverse proxy atau load balancer sebelum menyentuh kode aplikasi. Salah menyetel health check, buffering, atau timeout di tepi jaringan dapat menghentikan API streaming dan membanjiri instance yang sekarat.",
    points: [
      "Gunakan **Anycast DNS + CDN** (**Cloudflare**, **AWS CloudFront**) untuk mengakhiri TLS dekat dengan pengguna serta menyajikan aset statis dan redirect dari edge tanpa membebani origin.",
      "Pasangkan **L4 balancing** (AWS NLB, IPVS) untuk throughput mentah atau koneksi TCP persisten dengan **L7 balancing** (**NGINX**, **Envoy**, **HAProxy**, AWS ALB) untuk routing path/header, terminasi TLS, dan rate limiting.",
      "Pilih algoritma penyeimbangan sesuai durasi kerja: **Round Robin** cocok untuk request cepat yang seragam; **Least Connections** atau **Power of Two Random Choices (P2C)** melindungi beban dengan durasi bervariasi.",
      "Kombinasikan **health check aktif** (`/readyz`) dengan **Outlier Detection pasif** (mengeluarkan host upstream setelah mis. 5 error 5xx beruntun di Envoy) agar pod rusak cepat tersingkir.",
      "Waspadai jebakan reverse proxy: **NGINX** open-source tidak memiliki health check aktif tanpa NGINX Plus, mengaktifkan `proxy_buffering on` secara default (membuat **SSE** tersangkut sampai dimatikan), dan memutus **WebSocket** menganggur setelah 60 detik bila `proxy_read_timeout` tidak diperpanjang.",
      "Aktifkan **HTTP/3 (QUIC)** di edge (`ngx_http_v3_module` dengan `Alt-Svc`, atau Envoy QUICHE) untuk menghindari antrean head-of-line TCP di jaringan seluler yang tidak stabil."
    ],
    practice: "Bandingkan kedua blok konfigurasi di atas dengan edge aplikasimu: petakan di mana TLS diterminasi, pastikan endpoint streaming menonaktifkan proxy buffering, dan tentukan nilai `max_ejection_percent` agar Outlier Detection tidak mengeluarkan seluruh node saat gangguan parsial.",
    teach: "Bandingkan L4 load balancer dengan L7 reverse proxy seperti Envoy, lalu jelaskan mengapa memadukan cek aktif `/readyz` bersama Outlier Detection pasif jauh lebih aman daripada mengandalkan salah satu saja.",
    analogy: "L4 balancer bekerja seperti petugas tol yang mengarahkan kendaraan berdasarkan lajur tanpa membuka muatan; L7 proxy memeriksa surat jalan untuk mengarahkan pengiriman VIP, menahan truk mogok, dan membagikan salinan brosur yang sama langsung di gerbang.",
    pitfalls: [
      "Menyetel health check hanya ke `/health` tanpa mengecek dependensi inti—atau justru menggagalkan readiness ketika dependensi opsional terganggu sejenak sehingga seluruh cluster dikeluarkan bersamaan.",
      "Memakai Round Robin pada endpoint yang durasi kerjanya bervariasi antara 2 ms hingga 4 detik, menumpuk request lambat ke satu server yang kewalahan.",
      "Menaruh L7 proxy dengan bawaan `proxy_buffering on` di depan endpoint SSE sehingga event tertahan di memori hingga buffer penuh."
    ],
    quiz: [
      ["Mengapa `max_ejection_percent: 50` di Envoy menyelamatkan cluster API saat lonjakan sesaat?", ["Ia mengompresi 50% body JSON", "Mencegah Outlier Detection mengeluarkan seluruh host backend sekaligus saat gangguan singkat", "Membatasi pemakaian CPU pada 50%", "Memaksa downgrade ke HTTP/3"], "Membatasi persentase node yang dikeluarkan menjaga sebagian kapasitas tetap melayani trafik alih-alih mengosongkan pool."],
      ["Perilaku bawaan NGINX mana yang secara diam-diam merusak Server-Sent Events (SSE)?", ["Kompresi gzip dimatikan", "`proxy_buffering on`, yang menahan chunk respons sebelum dikirim ke klien", "Routing Least Connections", "TLS 1.3 resumption"], "SSE membutuhkan pengiriman chunk seketika; matikan dengan `proxy_buffering off` agar NGINX langsung mem-flush setiap event."],
      ["Mengapa HTTP/3 (QUIC) lebih tangguh dari HTTP/2 pada koneksi seluler yang sering kehilangan paket?", ["Tanpa overhead enkripsi", "Stream berbasis UDP menghindari head-of-line blocking lintas stream independen dalam satu koneksi", "Jendela kongesti TCP lebih besar", "Lookup DNS stateless"], "Pada HTTP/2 di atas TCP, satu paket hilang menghentikan seluruh stream sampai dikirim ulang; QUIC mengisolasi kehilangan ke stream terkait saja."]
    ]
  },

  communication: {
    splits: [['Idempotent REST POST', '# --- 1. Idempotent'], ['Server-Sent Events', '# --- 2. Server-Sent'], ['WebSocket Upgrade', '# --- 3. WebSocket']],
    terms: [
      ['Idempotency key', 'ID unik buatan klien (header IETF `Idempotency-Key`) yang disimpan bersama respons agar retry `POST` memutar ulang hasil awal tanpa menggandakan efek samping.'],
      ['Paginasi Cursor vs Offset', 'Offset (`OFFSET 10000`) memindai lalu membuang ribuan baris dan bergeser saat baris baru masuk; cursor melompat langsung lewat `WHERE (created_at, id) < (@ts, @id)`.'],
      ['gRPC vs REST', 'gRPC memadukan HTTP/2 multiplexing dengan Protocol Buffers biner untuk komunikasi internal yang cepat; REST/JSON mengutamakan kompatibilitas browser, caching HTTP, dan keterbacaan.']
    ],
    title: 'API dan protokol real-time: REST, gRPC, WebSocket, dan SSE',
    why: "Memilih pola komunikasi yang keliru menyebabkan tagihan ganda tersembunyi saat retry, baris feed kembar ketika paginasi bergeser, atau boros memori server menahan ribuan koneksi persisten yang jarang dipakai.",
    points: [
      "Gunakan **REST/JSON** di gerbang publik demi dukungan luas browser, proxy, dan caching CDN; beralih ke **gRPC** antar-layanan internal di mana skema `.proto` bertipe ketat, payload biner, dan streaming HTTP/2 menekan latency dan CPU.",
      "Lindungi operasi `POST` dan `PATCH` yang tidak idempoten dari retry jaringan memakai header IETF **`Idempotency-Key`** yang ditopang unique constraint `(idempotency_key)` di database.",
      "Jadikan **cursor / keyset pagination** (`?after=2026-11-19T08:00:00Z,9842`) standar utama di feed dan buku besar agar data baru tidak menggandakan item halaman dan halaman dalam tetap `O(log n)`.",
      "Pilih transport real-time paling sederhana sesuai arah data: **Server-Sent Events (SSE)** untuk aliran satu arah server-ke-klien (otomatis menyambung ulang lewat `Last-Event-ID`), **WebSockets** hanya untuk komunikasi dua arah penuh waktu nyata (chat, kolaborasi langsung).",
      "Untuk pembaruan jarang (berjarak beberapa menit), pakai **short/long polling** atau **webhook** daripada membayar biaya RAM dan timeout load balancer demi socket persisten."
    ],
    practice: "Telusuri skenario retry checkout ponsel ketika klien timeout padahal server sudah meng-commit pesanan. Daftarkan setiap kolom yang wajib ada pada `orders` atau `idempotency_records` (key, hash request, status HTTP, respons terserialisasi, `expires_at`) dan jelaskan tindakan server bila kunci sama dikirim ulang dengan payload berbeda.",
    teach: "Bandingkan Short Polling, Long Polling, Server-Sent Events, dan WebSocket dari sisi jumlah koneksi, kecocokan firewall/proxy, reconnect otomatis, dan arah aliran pesan.",
    analogy: "REST itu seperti berkirim surat tercatat, gRPC seperti tabung pneumatik berkecepatan tinggi antar meja kantor, SSE seperti siaran radio yang menyambung tepat lewat `Last-Event-ID`, dan WebSocket seperti sambungan telepon dua arah yang terus terbuka.",
    pitfalls: [
      "Menerima ulang `Idempotency-Key` yang sama untuk isi JSON berbeda tanpa membalas `422 Unprocessable Content`, menutupi bug penggunaan ulang kunci di sisi klien.",
      "Memakai `OFFSET` pada timeline aktif atau buku besar (`OFFSET 50000`), membuang I/O database dan menampilkan baris ganda saat entri baru masuk.",
      "Memakai WebSocket untuk papan skor satu arah atau bilah progres padahal SSE di atas HTTP/2 bekerja lebih bersih dengan lebih sedikit kendala proxy."
    ],
    quiz: [
      ["Kamu hanya perlu mengalirkan pembaruan harga saham real-time satu arah dari server ke browser dengan reconnect otomatis saat sinyal putus. Protokol mana paling cocok?", ["WebSockets", "Server-Sent Events (SSE)", "Short polling tiap 50 ms", "SMTP"], "SSE berjalan di atas HTTP biasa, menyambung otomatis lewat browser, dan melanjut lewat `Last-Event-ID` tanpa handshake dua arah."],
      ["Mengapa server harus menolak `POST` ulang yang membawa `Idempotency-Key` lama tetapi isi body request-nya berbeda dari panggilan pertama?", ["HTTP/2 melarang kunci duplikat", "Memakai kunci lama untuk payload baru menandakan bug klien dan berisiko diam-diam membalas hasil lama yang salah", "Redis menghapus hash saat berbeda", "Parser JSON melarang retry POST"], "Memverifikasi hash payload memastikan satu kunci mewakili satu operasi logis dan menolak perbedaan dengan 422."],
      ["Mengapa paginasi cursor/keyset mengungguli `OFFSET 20000` pada tabel besar?", ["Offset menghapus baris lama", "Cursor melompat langsung lewat predikat berindeks (`WHERE (ts, id) < ...`) dalam O(log n) tanpa memindai baris yang dilewati", "Cursor mengompres JSON", "Offset mengunci seluruh tabel"], "`OFFSET 20000` memaksa DB membaca lalu membuang 20.000 baris; keyset cursor langsung melompat ke key berikutnya."]
    ]
  },

  caching: {
    splits: [['Cache-Aside + LRU', '// --- 1. Cache-Aside'], ['HTTP RFC 9111 Freshness', '// --- 2. HTTP RFC 9111']],
    terms: [
      ['Cache-Aside (Lazy Loading)', 'Aplikasi memeriksa cache dulu; saat miss baru memanggil database, mengisi cache, dan mengembalikan nilai. Hanya data populer yang menempati RAM.'],
      ['Write-Through vs Write-Behind', 'Write-Through memperbarui cache dan DB secara serempak (konsisten, tulis lebih lambat); Write-Behind menampung penulisan di cache dan mem-flush secara asinkron (tulis sangat cepat, berisiko hilang saat crash).'],
      ['Kebijakan eviksi (`LRU`, `LFU`)', 'LRU membuang key yang paling lama tidak disentuh; LFU melacak frekuensi akses (penghitung logaritmik di Redis) sehingga pemindaian batch sesekali tidak menggusur data yang sering diakses.']
    ],
    title: 'Lapisan cache, strategi tulis, dan caching HTTP',
    why: "Caching memangkas latency baca dari milidetik menjadi mikrodetik sekaligus melindungi database dari lonjakan trafik baca—namun strategi invalidasi atau eviksi yang keliru justru menyajikan harga basi, memenuhi RAM, atau memperlambat penulisan.",
    points: [
      "Susun lapisan cache sedekat mungkin dengan pengguna: **HTTP cache browser** → **edge CDN** (`s-maxage`) → **L1 memori lokal** (`HybridCache` / `ristretto`) → **L2 memori terdistribusi** (**Redis / Valkey / Memcached**).",
      "Manfaatkan header HTTP **RFC 9111** untuk data publik: `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=30`, `ETag` (`304 Not Modified`), dan `Vary` (jangan pernah pakai `Cache-Control: public` pada respons yang tergantung auth/cookie!).",
      "Sesuaikan strategi tulis dengan kebutuhan konsistensi: **Cache-Aside** cocok untuk dominan baca, **Write-Through** menjaga kesegaran langsung, dan **Write-Behind** cocok untuk penghitung analitik tinggi di mana kehilangan sedikit buffer saat crash masih dapat ditoleransi.",
      "Atur kebijakan eviksi **Redis `maxmemory`** secara sadar: **`allkeys-lru`** untuk cache umum, **`allkeys-lfu`** saat ada scan batch berkala yang berpotensi mencemari recency, dan hindari `noeviction` pada cache tanpa pemantauan ketat.",
      "Setiap kunci cache wajib punya tiga hal sejak awal: format kunci deterministik (`sku:42:v2`), **TTL** berbatas (plus jitter), dan jalur **invalidasi**."
    ],
    predict: {
      prompt: "Thread A membaca `sku:42` saat cache miss (DB berisi harga `100`). Sebelum Thread A menulis ke Redis, Thread B mengubah DB menjadi `120` lalu menghapus `sku:42` di Redis. Barulah Thread A menulis `100` ke Redis dengan TTL 10 menit. Apa yang dilihat pembaca selama 10 menit berikutnya?",
      options: [
        "120, karena Thread B menghapus kunci paling akhir",
        "100 (nilai basi), karena Thread A menimpa kunci yang baru dihapus memakai data lama",
        "Error transaksi Redis membatalkan Thread A",
        "Selalu cache miss hingga DB dimulai ulang"
      ],
      explain: "Thread A mengambil `100` sebelum Thread B menulis `120`, lalu mengisi Redis belakangan. Race klasik Cache-Aside ini menanam data basi hingga TTL habis—sebab itulah TTL terbatas tetap wajib dipadukan dengan versioning atau CDC."
    },
    practice: "Jalankan contoh Go dengan `go run .` lalu buka `VIZ.syscache`. Ubah kebijakan eviksi dari `LRU` ke `LFU`, akses key `A` tiga kali dan `B`/`C`/`D` sekali, lalu amati key mana yang selamat dari eviksi.",
    teach: "Bandingkan Cache-Aside, Write-Through, dan Write-Behind memakai contoh harga produk atau jumlah kunjungan, termasuk dampaknya bila server Redis mengalami restart.",
    analogy: "Cache itu menaruh barang terlaris di etalase depan kasir (`LRU`/`LFU`) agar tidak bolak-balik ke gudang (database) setiap transaksi. `TTL` memaksamu mengecek ulang label harga secara berkala.",
    pitfalls: [
      "Menaruh `Cache-Control: public` atau lupa `Vary: Authorization` pada respons spesifik pengguna sehingga CDN menayangkan profil User A ke User B.",
      "Membiarkan `maxmemory-policy` Redis tetap `noeviction` pada cluster cache murni sehingga setiap write gagal saat RAM penuh.",
      "Bergantung penuh pada delete manual tanpa TTL berbatas—satu invalidasi yang gagal meninggalkan data basi selamanya."
    ],
    quiz: [
      ["Kapan `allkeys-lfu` mengungguli `allkeys-lru`, misalnya saat laporan malam memindai 50.000 item lama?", ["LFU mengompres kunci otomatis", "LFU mengingat frekuensi akses, sehingga pemindaian satu kali tidak menggusur kunci populer yang sering dipakai", "LRU memblokir pembacaan saat eviksi", "LFU menjamin konsistensi linear"], "Pemindaian batch satu kali memenuhi sisi baru LRU, sedangkan LFU mempertahankan kunci dengan frekuensi hit tinggi."],
      ["Direktif `Cache-Control` RFC 9111 mana yang mengizinkan CDN langsung menyajikan respons yang baru kedaluwarsa sembari memperbaruinya di latar belakang?", ["`no-store`", "`must-revalidate`", "`stale-while-revalidate`", "`private`"], "`stale-while-revalidate=N` menyembunyikan jeda validasi ke origin dari pengguna selama jendela toleransi."],
      ["Kapan Write-Behind caching biasanya berbahaya dipakai?", ["Penghitung view dan analitik", "Gambar statis permanen", "Saldo rekening atau stok barang di mana hilangnya buffer cache saat crash berarti kehilangan transaksi", "Catatan DNS"], "Write-Behind memberi ack sebelum penulisan sampai ke disk persisten; kegagalan cache mendadak menghapus update di buffer."]
    ]
  },

  'cache-failures': {
    splits: [['Singleflight Coalescer', '// --- 1. Singleflight'], ['Bloom Filter Guard', '// --- 2. Compact Bloom Filter'], ['TTL Jitter', '// --- 3. TTL Jitter']],
    terms: [
      ['Cache stampede (dog-piling)', 'Banyak request serentak mengalami miss pada satu key populer yang baru kedaluwarsa dan menghantam database bersamaan untuk menghitung nilai yang sama.'],
      ['Cache penetration', 'Pencarian berulang untuk ID yang tidak ada di cache maupun database (mis. ID negatif `-1` atau pemindaian acak) terus menembus hingga membebani DB.'],
      ['Cache avalanche', 'Banyak kunci kedaluwarsa bersamaan—atau satu shard cache tumbang—sehingga lonjakan query membanjiri database seketika.']
    ],
    title: 'Kegagalan cache: stampede, penetration, dan hot key',
    why: "Cache yang mendongkrak throughput 50× saat normal dapat meruntuhkan database dalam hitungan detik saat satu key panas kedaluwarsa, penyerang mengirim ID acak, atau ribuan key habis masa berlaku tepat di awal jam.",
    points: [
      "Hentikan **Cache Stampede** dengan menggabungkan miss per kunci (**single-flight / mutex** — bawaan `golang.org/x/sync/singleflight` dan .NET `HybridCache`), stale-while-refresh, atau perpanjangan probabilistik dini (**XFetch**).",
      "Hentikan **Cache Avalanche** memakai **jitter acak pada TTL** (`baseTTL + rand(0, 20%)`) supaya kunci yang terisi berbarengan saat deploy tidak kedaluwarsa bersamaan, dilengkapi circuit breaker dan failover multi-AZ.",
      "Hentikan **Cache Penetration** memakai **negative caching** (`\"\"` atau `__NULL__` ber-TTL singkat 30–60 detik) serta **Bloom filter** ringkas di depan query database.",
      "Tangani **Hot Key** ekstrem (satu produk flash-sale memenuhi satu shard Redis) lewat **L1 cache lokal di memori aplikasi** (TTL 1–5 detik) atau penyebaran kunci lintas beberapa shard (`sku:42#0..3`).",
      "Selalu pasang **timeout** pada negative cache maupun single-flight agar satu lookup DB yang macet tidak ikut menahan 500 request yang menunggu."
    ],
    predict: {
      prompt: "Kunci banner beranda kedaluwarsa pukul `12:00:00`. Pada `12:00:00.010`, 500 request serentak mendapati miss di Redis lalu memanggil `db.GetBanner()` paralel dan masing-masing menulis kembali ke Redis. Dengan Cache-Aside naif tanpa penggabungan, berapa query DB yang langsung menembak pukul `12:00:00`?",
      options: [
        "1 query, karena Redis otomatis mengunci key yang kosong",
        "Hingga 500 query identik sekaligus selagi panggilan pertama masih berjalan",
        "0 query, karena Cache-Aside otomatis menyajikan data basi",
        "Tepat 2 query (primer + replika)"
      ],
      explain: "Kelima ratus pembaca melihat cache kosong sebelum ada satu pun panggilan yang selesai mengisi Redis, mengirim kawanan thundering herd 500× langsung ke database."
    },
    practice: "Jalankan `go run .` untuk melihat 25 pemanggil bersamaan menghasilkan `dbCalls=1`. Coba hapus pembungkus `SingleFlight` pada salinan kode lalu jalankan lagi untuk melihat `dbCalls=25`, lalu periksa bagaimana false positive Bloom filter tetap aman ditangani fallback DB.",
    teach: "Bedakan Cache Stampede, Cache Penetration, dan Cache Avalanche, lalu sebutkan masing-masing satu mitigasi utama beserta trade-off-nya.",
    analogy: "Single-flight itu seperti dua puluh penghuni kos yang melihat galon kosong lalu mengutus satu orang saja yang membeli air sementara yang lain menunggu; Bloom filter itu daftar tamu di pintu yang langsung menolak nama palsu tanpa memeriksa buku besar.",
    pitfalls: [
      "Mengira Bloom filter bebas false positive atau mendukung penghapusan langsung (Bloom filter standar hanya menjamin nol false negative; penghapusan butuh Counting Bloom Filter atau rebuild berkala).",
      "Menyimpan negative cache tanpa batas keragaman key atau TTL pendek sehingga serbuan ID acak menggusur cache yang valid.",
      "Menggunakan single-flight tanpa batas waktu tunggu sehingga satu kegagalan DB membuat seluruh goroutine penunggu ikut menggantung."
    ],
    quiz: [
      ["Apa yang dijamin 100% pasti oleh Bloom filter standar?", ["Key pasti ada di dalam DB", "Bila filter mengembalikan `false`, key tersebut dipastikan TIDAK ada", "Nol false positive", "Hapus key O(1)"], "Bloom filter tidak pernah menghasilkan false negative: jika ada satu bit hash bernilai 0, key pasti belum pernah ditambahkan."],
      ["Teknik mana yang langsung meredakan satu SKU flash-sale yang membanjiri satu node Redis meski hit rate mencapai 99,9%?", ["Snapshot RDB Redis lebih panjang", "Pindah ke Fixed Window", "Cache mikro L1 di RAM aplikasi (TTL ~1 detik) atau salting key lintas shard (`sku:42#0..N`)", "Mematikan eviksi"], "Satu hot key selalu mendarat di satu shard Redis yang sama; menyerap bacaan di L1 RAM atau menyebar salinan ber-salt mengakhiri kemacetan node tunggal."],
      ["Mengapa menambahkan jitter acak ±10–20% ke TTL cache saat pemanasan massal?", ["Mencegah ribuan key kedaluwarsa pada detik yang sama (cache avalanche)", "Menghemat RAM per key di Redis", "Memaksakan urutan LRU", "Melewati Origin Shield CDN"], "Jitter menyebar waktu kedaluwarsa sepanjang beberapa menit agar beban pembaruan latar tetap mulus."]
    ]
  },

  ratelimiting: {
    splits: [['Token Bucket', '// --- 1. Token Bucket'], ['Sliding Window Counter', '// --- 2. Sliding Window Counter'], ['HTTP 429 & IETF Headers', '// --- 3. HTTP Middleware']],
    terms: [
      ['Token Bucket', 'Mengisi ulang token pada laju `r` hingga batas burst `b`. Mengizinkan lonjakan singkat di dalam `b` sembari menjaga laju rata-rata jangka panjang `r` dalam memori `O(1)`.'],
      ['Sliding Window Counter', 'Menggabungkan `prevCount * bobotTumpangTindih + currCount` dari dua jendela bersebelahan—akurasi mendekati log penuh hanya dengan memori `O(1)` per klien.'],
      ['Header `RateLimit` IETF', 'Menstandarkan `RateLimit-Policy` (aturan kuota) dan `RateLimit` (sisa kuota/reset) menggantikan `X-RateLimit-*`, dipadukan dengan `429 Too Many Requests` + `Retry-After`.']
    ],
    title: 'Algoritma rate limiting, header IETF, dan load shedding',
    why: "Tanpa rate limiting dan load shedding, satu loop retry yang bug atau scraper agresif dapat menghabiskan seluruh pool API hingga pengguna sah tidak bisa masuk. Setiap algoritma menukar akurasi batas jendela dengan penggunaan RAM dan keluwesan burst.",
    points: [
      "Bandingkan algoritma utama: **Fixed Window** (RAM kecil, celah burst 2× di perbatasan menit), **Sliding Window Log** (akurat penuh, boros RAM menyimpan setiap timestamp), **Sliding Window Counter** (estimasi berbobot dua jendela, RAM O(1)), **Token Bucket** (rata-rata mulus + burst terkontrol), dan **Leaky Bucket / GCRA** (laju keluar konstan ketat).",
      "Di seluruh replika API terdistribusi, jangan pernah menjalankan `GET` lalu `SET` dari kode aplikasi—balapan antar-pod akan meloloskan kelebihan kuota. Jalankan cek-dan-kurangi secara atomik via **skrip Lua Redis** (`EVALSHA`) atau `INCR` + `EXPIRE`.",
      "Kembalikan **`429 Too Many Requests`** dengan `Retry-After` serta header **`RateLimit-Policy` / `RateLimit`** IETF; sesuai **RFC 9111**, perantara dan klien wajib mengabaikan header `RateLimit` pada respons cache (`Age > 0`).",
      "Tetapkan perilaku gagal per endpoint: **fail open** pada pencarian/katalog bila Redis terganggu sejenak, dan **fail closed** (atau fallback lokal ketat) pada endpoint login/OTP.",
      "Padukan **rate limiting** per klien (`429`) dengan **load shedding** tingkat server (`503 Service Unavailable`): tolak request berprioritas rendah sebelum kejenuhan CPU atau antrean menghancurkan p99 seluruh layanan."
    ],
    predict: {
      prompt: "Sebuah API memakai batas **Fixed Window** `100 request per menit` yang direset setiap detik `:00`. Satu klien mengirim `100` request pada `12:00:58` dan `100` lagi pada `12:01:01`. Berapa request yang lolos dalam rentang 4 detik itu?",
      options: [
        "Total 100 request, karena rate limiter menghitung 60 detik terakhir",
        "200 request lolos (2× batas kuota melintasi perbatasan pergantian menit)",
        "101 request lolos sebelum backoff aktif",
        "0 request lolos karena clock drift"
      ],
      explain: "Fixed Window mereset penghitungnya tepat pada `12:01:00`, membuka celah lonjakan `2×` lintas perbatasan jendela. Beralih ke **Sliding Window Counter**, **Token Bucket**, atau **GCRA** menutup celah ini."
    },
    practice: "Buka `VIZ.sysratelimit` dan jalankan uji lonjakan batas `:09` (`Lompat ke :09` → `Burst ×4` → `Maju +2d` → `Burst ×4`). Amati Fixed Window meloloskan batas `2×` sementara Sliding Window Counter, Token Bucket, dan Leaky Bucket menahan kelebihannya.",
    teach: "Jelaskan mengapa rate limiter terdistribusi mengeksekusi cek-dan-kurangi di dalam satu skrip Lua Redis, lalu bandingkan Token Bucket dengan Leaky Bucket.",
    analogy: "Token Bucket itu kartu tarif kereta berisi maksimal `b` perjalanan yang terisi tiap jam—kamu boleh masuk serombongan selama token tersisa, sedangkan Leaky Bucket itu palang pintu putar yang hanya berdetak pada irama tetap.",
    pitfalls: [
      "Membaca counter Redis di Go, mengecek `< limit`, lalu mengirim `INCR` di panggilan terpisah—request serentak lolos bersamaan sebelum counter naik.",
      "Membalas `429` tanpa `Cache-Control: no-store` atau lupa bahwa respons cache dengan `Age > 0` membawa angka `RateLimit` usang.",
      "Membatasi hanya berdasarkan IP saat banyak pengguna berada di balik NAT kantor atau CGNAT seluler, ikut memblokir ribuan pengguna tidak bersalah."
    ],
    quiz: [
      ["Algoritma rate limiting mana yang mencegah burst 2× melintasi detik `:59` ke `:01` sambil tetap menjaga memori `O(1)` per pengguna?", ["Fixed Window Counter", "Sliding Window Counter", "Log Redis tanpa eviksi", "Caching ETag HTTP"], "Sliding Window Counter membobot hitungan jendela sebelumnya berdasarkan porsi tumpang tindih hanya dengan dua angka per klien."],
      ["Menurut draf header RateLimit IETF + RFC 9111, bagaimana klien harus memperlakukan header `RateLimit` jika respons berasal dari cache perantara (`Age > 0`)?", ["Menggandakan sisa kuota", "Mengabaikan header `RateLimit` pada respons cache", "Memaksa retry dengan `Retry-After: 0`", "Menyimpannya permanen di localStorage"], "Header dari cache mencerminkan keadaan saat disimpan, bukan kuota langsung saat ini; klien wajib mengabaikannya ketika `Age > 0`."],
      ["Apa perbedaan utama antara rate limiting (`429`) dan load shedding (`503`)?", ["429 melindungi kuota per klien; 503 membuang kelebihan beban total demi menjaga kesehatan server", "429 khusus TCP, 503 khusus UDP", "503 hanya berjalan di CDN", "429 otomatis diulang browser"], "Rate limiting mengisolasi penyewa yang berisik; load shedding menyelamatkan kesehatan server secara global saat kapasitas total hampir jenuh."]
    ]
  },

  storage: {
    splits: [['Mini LSM-Tree (MemTable + WAL)', '// --- 1. LSM MemTable'], ['Database Selection Matrix', '// --- 2. Database Matrix']],
    terms: [
      ['Mesin penyimpan B-Tree', 'Halaman berukuran tetap yang diubah di tempat (mis. 8 KB di Postgres/SQL Server). Pencarian titik dan rentang cepat; pembaruan acak memicu pemecahan halaman dan write amplification.'],
      ['LSM-Tree (Log-Structured Merge)', 'Menambah penulisan berurutan ke WAL dan MemTable terurut di memori, lalu mem-flush SSTable yang tidak bisa diubah ke disk. Penulisan super cepat; pembacaan memeriksa MemTable + Bloom filter + SSTable.'],
      ['Write vs Read amplification', 'Write amplification mengukur byte yang ditulis ke disk per penulisan logis (mis. kompaksi LSM); read amplification menghitung jumlah pemeriksaan file/halaman per satu lookup.']
    ],
    title: 'Mesin penyimpanan dan pemilihan database: B-Tree vs LSM-Tree',
    why: "Setiap trade-off database—mengapa PostgreSQL unggul untuk transaksi campuran sedangkan Cassandra menyerap aliran tulis raksasa—berakar pada cara mesin penyimpannya: memodifikasi halaman B-Tree di tempat atau menambahkan SSTable LSM-Tree yang tak berubah.",
    points: [
      "**Mesin B-Tree** (**PostgreSQL**, **SQL Server**, **MySQL InnoDB**) memberi waktu baca stabil dan pemindaian rentang berurutan lewat satu lintasan pohon, namun membayar biaya I/O acak serta pemecahan halaman saat tulis berat.",
      "**Mesin LSM-Tree** (**RocksDB**, **Cassandra**, **ScyllaDB**, **Pebble**) mengubah penulisan acak menjadi append berurutan ke WAL + MemTable, mem-flush **SSTable** imutabel yang nanti digabungkan oleh kompaksi latar.",
      "Pembacaan LSM harus memeriksa MemTable dan beberapa lapis SSTable—karena itu mesin memasang **Bloom filter** per SSTable agar cepat melewati file yang pasti tidak memuat kunci tersebut.",
      "Cocokkan model data dengan pola akses: **OLTP Relasional** (join ACID, constraint), **Dokumen (MongoDB)** (skema hierarkis), **KV / Wide-Column (Redis, DynamoDB, Cassandra)** (skala partisi kunci diketahui), **OLAP Kolumnar (ClickHouse, BigQuery)** (agregasi miliaran baris), **Object Storage (S3, MinIO)** (file besar lewat presigned URL).",
      "Jangan pernah menaruh biner besar (gambar, dokumen PDF) di dalam kolom SQL; simpan metadata dan URI di SQL sambil mengalirkan file langsung ke **S3 / MinIO**."
    ],
    practice: "Telusuri `Put(\"user:1\", \"<TOMBSTONE>\")` pada demo Go LSM: jelaskan mengapa menghapus key di LSM-Tree sementara justru *menambah* data sampai kompaksi menggabungkan SSTable, lalu bandingkan dengan penghapusan baris di halaman B-Tree 8 KB PostgreSQL.",
    teach: "Bandingkan mesin penyimpanan B-Tree dan LSM-Tree pada pola tulis berurutan vs acak, langkah baca, serta beban kompaksi atau autovacuum.",
    analogy: "B-Tree itu lemari arsip rapi berdasarkan abjad di mana menyelipkan map baru kadang memaksa merapikan ulang seisi laci (page split); LSM-Tree meletakkan setiap catatan baru ke tumpukan kotak masuk lalu merapikan tumpukannya malam hari (kompaksi).",
    pitfalls: [
      "Mengira NoSQL berarti bebas memelihara skema—dokumen yang bervariasi memindahkan validasi konsistensi skema ke kode aplikasi.",
      "Membiarkan kompaksi LSM latar menghabiskan IOPS NVMe pada jam trafik puncak sehingga tail latency baca melonjak.",
      "Mengadopsi NoSQL terdistribusi sejak hari pertama ketika join relasional, transaksi ACID, dan 5.000 RPS berjalan mulus di satu server PostgreSQL atau SQL Server."
    ],
    quiz: [
      ["Mengapa LSM-Tree mampu mempertahankan throughput penulisan acak berkelanjutan jauh lebih tinggi dibanding B-Tree tradisional?", ["Ia membuang WAL dan mengorbankan durabilitas", "Penulisan masuk secara berurutan ke WAL dan MemTable di RAM, menghindari pecahan halaman 8 KB di tempat", "Semua tabel disimpan sebagai CSS", "Ia tidak pernah mengurutkan key"], "Append WAL berurutan plus flush batch MemTable menghindari read-modify-write acak pada halaman disk B-Tree."],
      ["Bagaimana cara LSM-Tree menghapus data yang berada di SSTable imutabel?", ["Menimpa byte dengan angka nol di tempat", "Menulis penanda tombstone; versi lama baru terbuang saat kompaksi berikutnya", "Membangun ulang seluruh database serentak", "Memakai trigger SQL"], "Karena SSTable tidak boleh diubah di tempat, delete menambahkan catatan tombstone yang menutupi versi lama sampai kompaksi membersihkannya."],
      ["Di mana sebaiknya berkas PDF KYC pengguna (masing-masing 2 MB) disimpan dalam platform pinjaman atau e-commerce?", ["Di dalam kolom PostgreSQL BYTEA / SQL Server VARBINARY(MAX)", "Di-encode Base64 di string Redis", "Di S3 / MinIO object storage diakses memakai presigned URL berbatas waktu, sementara metadata tinggal di SQL", "Di dalam cookie"], "Object storage menangani file besar secara murah bersama CDN/unggah langsung tanpa membengkakkan backup DB dan buffer pool RAM."]
    ]
  },

  'search-geo': {
    splits: [['Inverted Index + BM25', '// --- 1. Inverted Index'], ['Geohash Proximity Encoding', '// --- 2. Geohash']],
    terms: [
      ['Inverted index', 'Memetakan token kata yang dinormalisasi (`"coffee"`) ke daftar ID dokumen beserta posisinya—dipakai Elasticsearch dan OpenSearch agar pencarian teks tidak memindai seluruh tabel.'],
      ['Okapi BM25', 'Rumus pemeringkatan relevansi yang memperhitungkan kejenuhan frekuensi kata (`k1`), kelangkaan kata di seluruh korpus (`IDF`), dan normalisasi panjang dokumen (`b`).'],
      ['Geohash & Uber H3', 'Grid spasial pengisi ruang yang mengubah `(lat, lon)` menjadi awalan string terurut (Geohash persegi) atau ID sel heksagonal 64-bit (`H3` dengan jarak tetangga seragam).']
    ],
    title: 'Mesin pencari dan indeks spasial: inverted index, BM25, dan H3',
    why: "Indeks B-Tree relasional kewalahan pada dua fitur populer: pencarian relevansi substring (`LIKE '%espresso%'`) dan kueri radius dua dimensi super cepat (`pengemudi dalam radius 2 km`). Keduanya memerlukan struktur indeks khusus.",
    points: [
      "B-Tree mengindeks awalan dari kiri ke kanan sehingga `LIKE '%kata%'` memindai seluruh tabel; **Elasticsearch / OpenSearch** (Apache Lucene) memecah kata ke dalam **inverted index** (`term -> [docIDs]`).",
      "**BM25** menyempurnakan TF-IDF naif lewat batas jenuh pengulangan kata (`k1`) dan normalisasi panjang (`b`), mencegah deskripsi panjang yang penuh spam kata kunci mengalahkan judul singkat yang tepat.",
      "Perlakukan mesin pencari sebagai **indeks baca sekunder turunan**, bukan sumber kebenaran utama—sinkronkan perubahan dari SQL melalui jalur **Outbox / CDC**.",
      "Untuk pencarian kedekatan (`cari kurir terdekat`), dua indeks B-Tree terpisah di `(lat)` dan `(lon)` memindai terlalu banyak kandidat; ubah ruang 2D menjadi sel 1D via **Geohash**, **Quadtree**, **PostGIS R-Tree (GiST)**, atau **Uber H3**.",
      "Waspadai **diskontinuitas tepi Geohash**: dua titik berjarak 20 meter di seberang garis perbatasan grid memiliki awalan berbeda sama sekali—selalu periksa sel target **ditambah 8 sel tetangganya** (atau pakai heksagon **Uber H3** di mana keenam tetangga berjarak pusat sama)."
    ],
    practice: "Jalankan `go run .` dan amati mengapa dokumen `3` (`\"keyboard keycaps\"`) mendapat skor BM25 lebih tinggi dari dokumen `2` meski sama-sama memuat kata `'keyboard'` satu kali. Lalu bandingkan koordinat `(-0.001, 0.001)` dan `(0.001, -0.001)` dekat `(0, 0)` untuk melihat patahan awalan Geohash.",
    teach: "Jelaskan mengapa Elasticsearch harus tetap menjadi indeks sekunder yang disinkronkan dari Postgres/SQL Server alih-alih ledger utama, serta keunggulan heksagon Uber H3 dibanding grid persegi.",
    analogy: "Inverted index ibarat daftar indeks di halaman belakang buku yang menyebut setiap nomor halaman per topik tanpa membolak-balik seluruh buku. Petak heksagon H3 mirip sarang lebah di mana setiap sel tetangga berjarak langkah yang persis sama dari pusat.",
    pitfalls: [
      "Menjadikan Elasticsearch satu-satunya penyimpan utama tanpa sumber persisten—perubahan mapping atau kegagalan refresh berisiko menghilangkan pembaruan.",
      "Menjalankan `WHERE geohash LIKE prefix%` tanpa ikut memeriksa 8 sel tetangga di sekitarnya sehingga objek dekat perbatasan terlewat.",
      "Memilih presisi sel Geo terlalu rapat saat kepadatan driver sering berubah—Uber H3 memudahkan penggabungan ke induk (`cellToParent`) saat area sepi."
    ],
    quiz: [
      ["Dalam BM25, mengapa satu kecocokan kata di judul 2 kata biasanya mendapat skor lebih tinggi daripada satu kecocokan di deskripsi 200 kata?", ["Normalisasi panjang field (`b`) memberi bobot lebih tinggi pada field singkat yang fokus", "Inverted index melewati dokumen panjang", "BM25 mengurutkan sesuai abjad", "IDF menghapus kata yang sering muncul"], "Normalisasi panjang mencegah deskripsi panjang yang berisik selalu mengalahkan kecocokan tajam pada judul."],
      ["Mengapa query Geohash memeriksa sel target bersama 8 tetangganya?", ["Agar terurut sesuai abjad", "Titik berdekatan di seberang garis batas grid dapat memiliki awalan Geohash yang berbeda jauh", "Geohash hanya mengkodekan garis lintang", "SQL LIKE mewajibkan 9 pola"], "Dua titik berjarak 10 meter melintasi garis kuadran utama (seperti khatulistiwa atau meridian nol) punya awalan berbeda total."],
      ["Sifat geometri apa yang membuat Uber merancang H3 memakai bentuk heksagon alih-alih persegi atau segitiga?", ["Heksagon butuh bit separuh lebih sedikit", "Keenam sel tetangga berjarak sama persis dari pusat sel tanpa distorsi sudut diagonal", "Persegi tidak dapat menutupi permukaan bola", "PostGIS hanya mendukung heksagon"], "Grid persegi memiliki tetangga sisi (`1×`) dan tetangga sudut (`√2×`); heksagon menyamakan jarak setiap tetangga."]
    ]
  },

  'db-scaling': {
    splits: [['PgBouncer Transaction Pool', '-- --- 1. PgBouncer Pool'], ['Declarative Partitioning', '-- --- 2. Range Partitioning'], ['Shard Key & Resharding', '-- --- 3. Composite Shard Schema']],
    terms: [
      ['PgBouncer Transaction Mode', 'Mengembalikan koneksi backend server DB ke pool setiap selesai `COMMIT`/`ROLLBACK` alih-alih menahannya per socket klien, memultipleks ribuan koneksi aplikasi menjadi puluhan backend Postgres.'],
      ['Replication lag (`LSN`)', 'Jeda waktu antara commit di primer hingga replika baca asinkron memutar catatan WAL-nya. Mengirim Log Sequence Number (LSN) commit memungkinkan bacaan penting menunggu atau dialihkan ke primer demi read-your-own-writes.'],
      ['Partitioning vs Sharding', 'Partitioning memecah satu tabel menjadi tabel anak fisik di dalam satu host DB (pemangkasan scan cepat dan retensi `DROP PARTITION`); sharding menyebar rentang kunci atau bucket hash melintasi beberapa mesin DB terpisah.']
    ],
    title: 'Scaling database: pooling, replika, partisi, dan sharding',
    why: "Membuka 5.000 koneksi langsung ke Postgres dari 500 pod menguras scheduler kernel dan memakan gigabyte RAM. Scaling SQL menempuh empat tahap terukur: rapikan indeks dan transaction pooling dulu, alihkan pembacaan toleran jeda ke replika, partisi tabel raksasa di satu host, baru lakukan sharding ketika tulis primer benar-benar mentok.",
    points: [
      "Tiap proses backend PostgreSQL mengalokasikan memori lokal dan bersaing pada snapshot ProcArray; membatasi koneksi aktif DB sekitar `~100–300` di balik **PgBouncer** (`pool_mode = transaction`) atau **RDS Proxy** sering kali menggandakan throughput.",
      "Dalam Transaction Mode, hindari state level sesi (`SET TIME ZONE`, `PREPARE`, `LISTEN`, session advisory lock) kecuali `max_prepared_statements` PgBouncer diaktifkan secara eksplisit.",
      "Replika baca tertinggal saat tulis tinggi. Jamin **read-your-own-writes** pasca-mutasi (konfirmasi checkout, edit profil) dengan mengecek **commit LSN** atau mengarahkan bacaan pengguna selama 2–5 detik ke primer.",
      "Partisi rentang deklaratif PostgreSQL (`PARTITION BY RANGE (created_at)`) memangkas pemindaian data lama ke satu tabel bulanan saja dan mengganti badai vacuum `DELETE` berjam-jam menjadi `DROP TABLE` seketika.",
      "Pilih **shard key** (`tenant_id` atau `user_id`, bukan `created_at`) dengan kardinalitas tinggi yang selaras dengan pola akses utama; query tanpa shard key memicu fan-out **scatter-gather** mahal ke semua shard.",
      "Join lintas shard dan `AUTO_INCREMENT` berurutan tidak bekerja antar mesin terpisah—gunakan ID 64-bit terurut waktu (**Snowflake** / **UUIDv7**) dan pindahkan tampilan lintas entitas ke read model."
    ],
    predict: {
      prompt: "Aplikasi di-scale horizontal dari `20` menjadi `400` pod API (`25` koneksi DB per pod = `10.000` koneksi) menuju satu PostgreSQL primer (`max_connections = 5000`, `16 vCPU`). CPU masih 60%, tetapi p99 query melonjak 10× dan pod baru gagal konek. Menambah replika baca hanya membantu `SELECT`. Apa perbaikan akar masalah pertamanya?",
      options: [
        "Naikkan `max_connections = 20000` pada PostgreSQL",
        "Pasang PgBouncer dalam mode `transaction` di depan PostgreSQL dan jaga backend aktif sekitar 50–150",
        "Hapus seluruh foreign key dan indeks sekunder",
        "Segera shard tabel `users` melintasi 16 server PostgreSQL"
      ],
      explain: "PostgreSQL mengalami context switching berat dan perebutan snapshot lock ketika ribuan koneksi terbuka bersamaan. Transaction pooling memultipleks 10.000 socket aplikasi lewat ~100 backend aktif—membuka kapasitas jauh sebelum perlu menyentuh sharding."
    },
    practice: "Buka `VIZ.sysdbscale`, atur tulis vs baca serta periksa lag replikasi saat beban tulis naik, lalu bandingkan bagaimana Transaction Pooling memangkas backend primer dibanding Koneksi Langsung. Periksa pula kunci komposit `(tenant_id, order_id)` pada bagian 3 dan jelaskan mengapa `tenant_id` berada di depan.",
    teach: "Jelaskan urutan eskalasi yang tepat sebelum men-shard cluster Postgres—indeks, PgBouncer transaction mode, replika baca + LSN read-your-own-writes, partisi deklaratif—serta sebutkan kapan sharding benar-benar wajib.",
    analogy: "Koneksi langsung itu menyewa satu koki pribadi per tamu restoran bahkan saat tamu baru membaca buku menu; transaction pooling membuat 500 tamu berbagi 20 koki yang bertugas hanya selama hidangan benar-benar dimasak.",
    pitfalls: [
      "Menjalankan PgBouncer `transaction` mode sembari mengeksekusi `SET search_path`, tabel temporer, atau `pg_advisory_lock`—tenant berikutnya yang memakai ulang koneksi backend itu ikut mewarisi state sesi sebelumnya.",
      "Men-shard berdasarkan `created_at` atau `order_id` yang terus menaik, menumpuk 100% penulisan baru pada satu shard ujung kanan (write hotspot).",
      "Menghapus jutaan baris log memakai `DELETE FROM events WHERE created_at < ...` alih-alih memutus partisi bulanan, menimbulkan dead-tuple bloat dan risiko XID wraparound."
    ],
    quiz: [
      ["Mengapa `PARTITION BY RANGE (created_at)` mewajibkan `created_at` masuk dalam setiap `PRIMARY KEY` dan `UNIQUE` di PostgreSQL?", ["Agar pengurutan string lebih cepat", "PostgreSQL hanya menjamin keunikan di dalam indeks tiap partisi lokal bila kolom kunci partisi ikut di dalam unique key", "B-Tree hanya mengindeks timestamp", "Syarat wajib PgBouncer"], "Tanpa memeriksa seluruh tabel partisi lain di setiap insert, keunikan hanya bisa ditegakkan secara lokal ketika kolom pemecah masuk dalam indeks."],
      ["Bagaimana API yang langsung membaca setelah menulis menghindari data basi dari replika baca asinkron?", ["Matikan WAL di primer", "Arahkan bacaan seketika ke primer atau tunggu hingga replika mencapai `pg_last_wal_replay_lsn() >= commit_lsn`", "Tambahkan `LIMIT 1`", "Jalankan `VACUUM FULL`"], "Melacak LSN commit primer (atau pinning singkat ke primer setelah mutasi) menjamin read-your-own-writes tanpa menghentikan pembaca lain."],
      ["Kesalahan mana yang menciptakan write hotspot di database ter-shard?", ["Memakai UUIDv7 di dalam hash sharding `(tenant_id, id)`", "Melakukan range-sharding tabel append-only memakai `created_at`", "Membagi awal ke 256 virtual shard", "Menyandingkan `orders` dan `order_items` pada `tenant_id`"], "Semua timestamp terkini selalu masuk ke satu shard rentang paling kanan sementara shard lama menganggur dari beban tulis."]
    ]
  },

  hashing: {
    splits: [['Modulo Remapping Collapse', '// --- 1. Naive Modulo'], ['Hash Ring + Virtual Nodes', '// --- 2. Consistent Ring'], ['Bounded-Load Balancing', '// --- 3. Bounded-Load']],
    terms: [
      ['Cincin consistent hashing', 'Memetakan node fisik sekaligus kunci objek ke ruang melingkar `[0, 2^32)` (atau `2^64`); tiap kunci tinggal di node pertama searah jarum jam sehingga menambah/menghapus 1 dari `N` node hanya memindahkan `~1/N` kunci.'],
      ['Virtual nodes (`vnodes`)', 'Menempatkan beberapa titik cincin (`nodeA#0`, `nodeA#1`, ...) per mesin fisik. `100–200` vnodes menekan ketimpangan distribusi kunci dari ±30% ke bawah ±5% dan menyebar beban failover ke banyak survivor.'],
      ['Bounded-load hashing', 'Ekstensi Mirrokni et al. / Google Maglev / HAProxy yang membatasi tiap node pada `ceil(avgLoad * (1 + ε))` (`c = 1.25`) dan melimpahkan kelebihan ke node searah jarum jam berikutnya untuk meredam hot-key cascade.']
    ],
    title: 'Consistent hashing, virtual nodes, dan bounded-load balancing',
    why: "Shard Redis terpartisi, engine penyimpanan gaya Dynamo, dan L7 cache stateful tidak sanggup menghadapi pengosongan cache massal tiap kali satu instance bertambah atau mati. Consistent hashing bersama virtual nodes menjaga cache tetap hangat saat topologi berubah, sedangkan bounded loads mencegah hot key melumpuhkan satu node.",
    points: [
      "Hashing modulo (`hash(k) % N`) hanya cocok bila jumlah node statis: mengubah `N` dari `4` menjadi `5` mengganti hasil bagi hampir **80% (`4/5`)** kunci sekaligus.",
      "Pada cincin consistent hash (`N` node), menyisipkan atau menghapus satu node hanya memindahkan sekitar `~1/N` kunci (yang berada di antara node tersebut dan pendahulunya).",
      "Satu titik fisik per server di cincin menyisakan busur yang timpang—memakai **100–200 virtual nodes** per mesin meratakan sebaran secara statistik serta mendukung bobot berbeda (host `2×` RAM mendapat `2×` vnode).",
      "Lookup berjalan `O(log(N * V))` lewat binary search (`slices.BinarySearchFunc`) pada slice terurut uint32/uint64—sangat cepat tanpa alokasi tambahan di Go.",
      "Consistent hashing murni tetap bisa membakar satu node akibat satu key viral Zipfian; **Consistent Hashing with Bounded Loads** (`cap = ceil(loadRatio * c)`, `c ≈ 1.25`, dipakai di HAProxy dan load balancer Google/Vimeo) melimpahkan beban berlebih ke node berikutnya searah jarum jam.",
      "Alternatif ringan lain: **Rendezvous (Highest Random Weight) hashing** memilih `argmax node hash(key, node)`—tanpa struktur cincin dengan perpindahan minimal (`1/N`), ideal ketika `N` kecil (`< 100` backend)."
    ],
    predict: {
      prompt: "Kamu menjalankan cluster cache 4 node yang dirutekan lewat `fnv32(key) % N`. Saat jam sibuk, Node ke-4 ditambahkan (`N` berubah `4 -> 5`) untuk `10.000` key populer. Sekitar berapa banyak key yang langsung berpindah node (cache miss)?",
      options: [
        "~2.000 key (20%, sesuai `1/5` total key)",
        "~8.000 key (~80%), memicu badai cache stampede ke DB",
        "Tepat 2.500 key (25%)",
        "0 key sampai TTL lama habis"
      ],
      explain: "Mengganti pembagi modulo dari `4` ke `5` mengubah sisa `h % 4 != h % 5` untuk hampir semua bilangan (`lcm(4,5)=20`, artinya `16/20 = 80%` pindah). Cincin consistent hash menjaga perpindahan kunci tetap sekitar `~1/5` (20%)."
    },
    practice: "Buka `VIZ.syshash`, geser `vnodes/server` dari `1` ke `150` dan perhatikan jumlah key merata di tabel. Kemudian klik `+ Tambah Node E (4 -> 5)` dan bandingkan `Perpindahan Cincin Konsisten` terhadap `Perpindahan Modulo Naif`.",
    teach: "Jelaskan mengapa menambah virtual nodes memperbaiki keseimbangan awal SEKALIGUS meredam beban pemulihan saat satu node cache tiba-tiba mati.",
    analogy: "Menaruh 4 orang di permukaan jam bundar sering menyisakan potongan jarak yang timpang; memberi tiap orang 150 kursi tersebar acak di sekeliling jam menjamin setiap orang menangkap sekitar 25% lemparan dart.",
    pitfalls: [
      "Lupa membungkus wrap-around pada binary search (`idx == len(vnodes) -> 0`), membuat key yang nilai hash-nya melewati vnode terakhir gagal menemukan pemilik atau panic.",
      "Memakai hanya `1` atau `2` vnode di cluster kecil sehingga satu node memegang 60% cincin sementara node lain menganggur.",
      "Menganggap consistent hashing otomatis kebal terhadap hot key—satu kunci viral tetap selalu mengarah ke replika yang sama kecuali ditambah cache L1 atau bounded load."
    ],
    quiz: [
      ["Mengapa DynamoDB, Cassandra, dan proxy Redis memberi 100–200 virtual nodes per mesin fisik alih-alih hanya 1?", ["Untuk menggandakan RAM", "Menekan variasi ukuran partisi dan membagi rata beban failover node mati ke semua mesin tersisa", "Menghindari hashing key", "Menjamin linearizability"], "Banyaknya vnode mengubah jarak acak menjadi persentase yang merata dan mencegah satu tetangga langsung menanggung 100% beban node yang mati."],
      ["Apa efek menambahkan `bounded loads` (faktor kapasitas `c ≈ 1.25`) ketika terjadi lonjakan satu hot key?", ["Menonaktifkan virtual nodes", "Melimpahkan kelebihan request melewati `cap` ke server fisik berbeda berikutnya searah jarum jam", "Menghapus cold key permanen", "Memaksa retry TCP"], "Bounded-load menjamin tidak ada satu node pun melebihi `1.25×` beban rata-rata sembari tetap menjaga lokalitas di kondisi normal."],
      ["Pada cincin consistent hash 10 node dengan vnode seimbang, berapa perkiraan porsi key yang pindah bila 1 node baru masuk?", ["~90%", "~50%", "~9–10% (`1 / 11`)", "0%"], "Hanya key milik segmen yang baru diambil alih oleh node ke-11 yang bermigrasi (`1 / (N + 1)`)."]
    ]
  },

  messaging: {
    splits: [['Transactional Outbox', '-- --- 1. Outbox Table'], ['Relay & SKIP LOCKED', '-- --- 2. Outbox Poller'], ['Idempotent Consumer & DLQ', '-- --- 3. Consumer Dedup & DLQ']],
    terms: [
      ['Masalah Dual-write', 'Menulis ke PostgreSQL dan mengirim ke Kafka/RabbitMQ terpisah tanpa atomisitas: jika broker gagal tepat setelah DB commit (atau sebaliknya), state ledger dan event selisih diam-diam.'],
      ['Transactional Outbox + CDC', 'Menyisipkan baris domain sekaligus baris `outbox_events` dalam SATU transaksi SQL lokal; lalu worker `SKIP LOCKED` atau Debezium WAL CDC mengirim baris tersebut dengan andal ke broker.'],
      ['Dead-Letter Queue (DLQ)', 'Jalur penampungan pesan bermasalah yang berulang gagal lolos validasi skema atau retry agar tidak memblokir partisi sehat sambil menunggu inspeksi dan replay.']
    ],
    title: 'Pesan asinkron, transactional outbox, CDC, dan DLQ',
    why: "Proses aplikasi bisa mati persis di antara `COMMIT` SQL dan pemanggilan `Publish()` broker. Pola Transactional Outbox dipadu idempotent consumer mengubah dual-write yang rapuh menjadi pengiriman at-least-once yang tahan banting tanpa 2-phase commit lintas DB dan broker.",
    points: [
      "Jangan pernah mengandalkan **dual write** (`db.Commit()` lalu `kafka.Produce()`) untuk state pesanan atau uang: kedipan jaringan atau OOM kill di sela dua baris itu menghilangkan event selamanya.",
      "Menulis data bisnis + `outbox_events` dalam satu transaksi ACID menjamin keduanya ikut sukses atau batal bersama; kirim event lewat relai poller (`FOR UPDATE SKIP LOCKED`) atau **Change Data Capture (Debezium)** yang membaca Write-Ahead Log DB tanpa beban query berulang.",
      "Broker produksi (**Kafka**, **RabbitMQ**, **SQS**) mengirim secara **at-least-once**, artinya duplikat PASTI muncul saat timeout atau rebalance—pasangkan outbox dengan tabel dedup (`processed_events`) atas `event_id` unik atau upsert idempoten di sisi konsumen.",
      "Pilih broker sesuai semantik: **Kafka** mempertahankan log append berurut per kunci lintas partisi (`consumer_group` membaca paralel dengan dukungan replay dan analitik), sedangkan **RabbitMQ / SQS** unggul untuk antrean kerja bersaing dengan ACK/NACK per pesan.",
      "Kendalikan backlog agar tidak menjatuhkan worker lewat **backpressure**, batas prefetch, topik retry eksponensial, dan **Dead-Letter Queue (DLQ)** dengan batas `max_attempts`.",
      "Jangan biarkan satu payload JSON cacat menyumbat antrean partisi terurut tanpa henti: pindahkan ke **DLQ** beserta alasan error agar event pengguna sehat terus mengalir."
    ],
    practice: "Buka `VIZ.sysqueue`, aktifkan mode `Dual-Write (rapuh)` lalu matikan broker sebelum menyimpan pesanan—lihat DB dan antrean tidak konsisten—lalu ganti ke `Transactional Outbox (atomik)` dan pulihkan. Coba juga kirim pesan beracun sampai diparkir ke `DLQ`.",
    teach: "Jelaskan mengapa `FOR UPDATE SKIP LOCKED` mengizinkan banyak worker outbox bekerja serentak tanpa saling kunci, lalu bandingkan Outbox Poller vs Debezium WAL CDC pada trafik tulis tinggi.",
    analogy: "Outbox itu seperti mencatat salinan surat keluar langsung di halaman buku besar akuntansi sebelum bukunya ditutup; kurir menyalin dan mengirimkannya kapan pun kantor pos buka kembali tanpa ada amplop tercecer.",
    pitfalls: [
      "Memanggil Kafka tepat setelah `COMMIT` tanpa tabel outbox—proses crash atau timeout langsung menghilangkan email konfirmasi, stok, dan laporan analitik.",
      "Mengira klaim 'exactly-once' mengizinkan konsumen SQL melewatkan cek idempotensi—rebalance atau retry jaringan tetap mengirim batch ulang kecuali efek samping + `processed_events` di-commit bersama.",
      "Membiarkan pesan rusak terus mencoba ulang selamanya di depan antrean terurut daripada memindahkannya ke DLQ."
    ],
    quiz: [
      ["Mengapa klausa `FOR UPDATE SKIP LOCKED` penting saat beberapa worker relai membaca `outbox_events` bersamaan?", ["Menghapus duplikat diam-diam", "Setiap worker relai mengklaim batch baris tak terkunci secara terpisah tanpa memblokir satu sama lain", "Melewati WAL PostgreSQL", "Mengubah Kafka menjadi RabbitMQ"], "`SKIP LOCKED` mendistribusikan batch yang saling lepas ke tiap instance relai paralel tanpa antre lock."],
      ["Keunggulan apa yang diberikan **Debezium CDC** dibanding SQL polling pada `outbox_events` di 20.000 event/detik?", ["Menghapus kebutuhan transaksi DB primer", "Membaca perubahan langsung dari Write-Ahead Log Postgres tanpa beban kueri `SELECT ... UPDATE` berulang", "Menjamin nol duplikat konsumen tanpa tabel dedup", "Menggantikan seluruh endpoint HTTP"], "CDC berbasis WAL meniadakan kueri polling pada tabel aktif di beban tulis tinggi sembari menjaga latency publikasi sub-detik."],
      ["Jika konsumen menerima `event_id` yang sudah tercatat di `processed_events`, apa yang seharusnya dilakukan?", ["Crash dan memicu pager alert", "Melewati efek samping bisnis lalu mengirim ACK / commit offset dengan bersih", "Menyisipkan baris kedua ke `dead_letter_events`", "Me-restart Kafka"], "Karena event itu sudah pernah sukses diproses sebelumnya, langsung meng-ACK tanpa memutar ulang efek samping menjamin hasil akhir tetap akurat."]
    ]
  },

  resilience: {
    splits: [['Exponential Backoff + Full Jitter', '// --- 1. Full Jitter'], ['Circuit Breaker (Closed/Open/Half-Open)', '// --- 2. Circuit Breaker'], ['Semaphore Bulkhead + Timeout', '// --- 3. Bulkhead']],
    terms: [
      ['Full Jitter backoff', 'Rumus AWS Builders Library `sleep = rand[0, min(cap, base * 2^attempt)]`. Mengacak waktu bangun ribuan klien yang gagal alih-alih membiarkan seluruh armada retry serentak menghantam layanan yang baru pulih.'],
      ['Circuit Breaker', 'Mesin state (`Closed -> Open -> Half-Open`) yang langsung gagal cepat begitu rasio error melewati ambang batas, melindungi server hilir dan mencegah thread pemanggil ikut menggantung.'],
      ['Pola Bulkhead', 'Semafor berbatas atau pool worker terpisah per dependensi sehingga satu layanan SMS pihak ketiga yang lambat tidak ikut menghabiskan seluruh goroutine milik jalur checkout.']
    ],
    title: 'Ketahanan sistem: timeout, jittered backoff, circuit breaker, dan bulkhead',
    why: "Loop retry tanpa timeout, jitter, atau circuit breaker memperbesar gangguan kecil menjadi badai retry yang melumpuhkan layanan selama berjam-jam. Setiap klien keluar wajib punya deadline ketat, backoff ber-jitter dengan anggaran retry, circuit breaker, dan sekat bulkhead.",
    points: [
      "Selalu teruskan batas waktu ujung-ke-ujung via `context.WithTimeout`; tanpa timeout, layanan hilir yang lambat menahan seluruh pool pemanggil sampai seluruh upstream ikut tumbang.",
      "Jangan memakai interval tetap atau `2^attempt` tanpa jitter: seluruh pod yang gagal pada `t = 0` tidur persis `1s`, `2s`, `4s`, lalu menyerbu server yang baru pulih serentak (**Full Jitter** menyebar rentang `[0, window]`).",
      "Pasang **retry budget** (mis. batas maksimal `+20%` RPS ekstra di atas trafik normal): bila 90% panggilan sudah gagal, mencoba ulang `3×` melipatgandakan beban tepat saat kapasitas paling lemah.",
      "Pasangkan retry dengan **Circuit Breaker**: `Closed` (sehat) berpindah ke `Open` (gagal seketika dalam `0 ms`, nol request keluar) selama cooldown, lalu menguji 1–N panggilan uji di `Half-Open` sebelum menutup kembali.",
      "Sekat dependensi lambat atau rapuh memakai **Bulkhead** (semafor berbatas atau pool koneksi HTTP terpisah): saat `/pdf-export` tersendat, `/checkout` tetap memiliki kapasitas terjamin.",
      "Hanya **retry operasi yang idempoten** (`GET`, `HEAD`, `PUT`, `DELETE`, atau `POST` yang membawa `Idempotency-Key`); mengulang pembayaran non-idempoten berisiko menagih dua kali."
    ],
    predict: {
      prompt: "Payment gateway mati selama `3 detik` saat `1.000` request API aktif. Semua pemanggil mencoba ulang hingga `5` kali dengan exponential backoff deterministik tanpa jitter (`1s`, `2s`, `4s`, `8s`, `16s`). Saat gateway pulih pada `t = 3.1d`, apa yang terjadi?",
      options: [
        "Trafik pulih mulus ke QPS normal",
        "Gelombang retry serempak (`1.000+` panggilan bangun di ketukan `1s/2s/4s`) langsung merobohkan ulang gateway (badai retry)",
        "Circuit breaker otomatis menambah CPU gateway",
        "TCP Go membuang retry otomatis"
      ],
      explain: "Backoff deterministik menyatukan ribuan pemanggil ke detik bangun yang sama persis, sementara retry bebas melipatgandakan beban (`5×`). Studi AWS Builders' Library membuktikan **Full Jitter** + **retry budget** + **circuit breaker** memutus gelombang serempak ini."
    },
    practice: "Buka `VIZ.sysresilience`, ubah kesehatan downstream ke `Putus Total (100% gagal)`, klik `Burst ×6` untuk memicu `OPEN`, klik `Majukan Cooldown (+5d)` dua kali agar masuk `HALF_OPEN`, lalu bandingkan sebaran retry `Tanpa Jitter` vs `Full Jitter`.",
    teach: "Jelaskan mengapa memasang retry di SETIAP lapisan panggilan microservice 4 tingkat (`A -> B -> C -> D` masing-masing retry `3×`) melipatgandakan lonjakan kecil menjadi `81×` beban—dan di mana kebijakan retry seharusnya ditempatkan.",
    analogy: "Kapal selam memisahkan lambungnya dengan sekat kedap air (bulkhead) agar satu kebocoran tidak menenggelamkan seisi kapal; sekring listrik (circuit breaker) memutus arus sebelum kabel panas membakar seluruh bangunan.",
    pitfalls: [
      "Mengonfigurasi retry otomatis di setiap hop RPC (`3 × 3 × 3 × 3 = 81×` amplifikasi) alih-alih satu kali di lapisan paling tepi dengan anggaran waktu.",
      "Mencoba ulang HTTP `400 Bad Request` atau `401 Unauthorized`—hanya gangguan jaringan sementara, `429`, dan `503` yang layak di-retry.",
      "Berbagi satu `http.Client` tanpa timeout di seluruh fitur sehingga pengiriman webhook lambat menghabiskan socket yang dibutuhkan checkout."
    ],
    quiz: [
      ["Mengapa AWS Builders' Library menganjurkan **Full Jitter** dibanding exponential backoff deterministik?", ["Menggandakan throughput maksimal", "Menyebar waktu tunggu retry secara merata di `[0, cap]`, memutus lonjakan gelombang serentak", "Menghapus kebutuhan timeout", "Mengubah status 503 menjadi 200"], "Tanpa pengacakan, semua klien yang gagal bersamaan bangun bersamaan pada detik yang identik."],
      ["Dalam Circuit Breaker 3-state (`Closed`, `Open`, `Half-Open`), apa yang terjadi di dalam `Half-Open`?", ["Semua request mengabaikan timeout", "Hanya sedikit request uji canary yang diizinkan lewat untuk mengetes pemulihan sebelum kembali ke `Closed`", "Semua error diabaikan selamanya", "Metrik dibuang ke disk"], "Half-Open mengirim trafik uji kecil; sukses memulihkan status menjadi Closed, sedangkan gagal langsung memulai ulang timer Open."],
      ["Pola mana yang langsung mencegah endpoint webhook eksternal yang lambat menghabiskan seluruh goroutine yang dibutuhkan `/login`?", ["Write-Back Cache", "Bulkhead (pool worker / semafor konkurensi terpisah per dependensi)", "Geohashing", "Consistent Hashing"], "Memisahkan anggaran konkurensi per dependensi mencegah satu upstream macet melumpuhkan jalur sehat lainnya."]
    ]
  },

  consistency: {
    splits: [['Quorum Overlap (W + R > N)', '// --- 1. Quorum Store'], ['Idempotency-Key Middleware', '// --- 2. Idempotency-Key Middleware Store'], ['Kleppmann Fencing Token', '// --- 3. Kleppmann Fencing Token Storage Guard']],
    terms: [
      ['Quorum (`W + R > N`)', 'Dari total `N` replika, mensyaratkan tulis diakui `W` replika dan baca menanyai `R` replika sedemikian hingga `W + R > N` menjamin minimal satu replika yang dibaca menyimpan versi commit terbaru (`ver`).'],
      ['Header Idempotency-Key', 'Header permintaan HTTP draf IETF berisi ID unik buatan klien sehingga retry mengembalikan hasil asli tersimpan (`422` atau `409` bila kunci dipakai ulang untuk payload berbeda) tanpa memproses ulang efek samping.'],
      ['Fencing Token', 'Angka menaik monoton dari pemberi lease/lock (`token=34`) di setiap pemberian kunci; lapisan penyimpanan menolak penulisan dari pemegang lease basi bernomor lama (`33 <= 34`), mencegah split-brain setelah jeda GC.']
    ],
    title: 'Konsistensi terdistribusi: quorum, idempotency, saga, dan fencing token',
    why: "Di sistem terdistribusi, lease bisa kedaluwarsa saat jeda GC, jaringan terbelah dua, dan klien seluler mengirim ulang request akibat putus sinyal. Irisan quorum, kunci idempotensi ketat, saga kompensasi, dan fencing token monoton menutup celah kebenaran tersebut.",
    points: [
      "Atur quorum ala Dynamo secara sadar: untuk `N = 3`, `(W=2, R=2)` menjamin bacaan setelah tulis saling beririsan (`2 + 2 > 3`) sembari tetap toleran terhadap `1` replika mati saat baca maupun tulis.",
      "Gunakan **nomor versi / Lamport timestamp** ketika replika berbeda pendapat: `Get()` mengambil dari `R` replika, memilih `version` tertinggi, dan memicu **read repair** ke replika tertinggal.",
      "Pahami trade-off **PACELC**: saat **P**artition pilih **A**vailability (eventual ala Dynamo/Cassandra) atau **C**onsistency (Spanner/Raft/Postgres sync); **E**lse saat jaringan sehat pilih tukar **L**atency vs **C**onsistency.",
      "Untuk mutasi HTTP, simpan `(idempotency_key, payload_sha256, status, response_body)` di dalam transaksi lokal yang sama dengan perubahan data (pola Stripe / IETF `Idempotency-Key`); tolak payload tidak cocok dengan `422` dan duplikat paralel yang masih berjalan dengan `409`.",
      "Gantikan `2PC` terdistribusi yang rapuh antar microservice memakai **Saga**: Choreography (berbasis event, ringkas untuk <= 4 langkah) atau Orchestration (Temporal / state machine untuk alur kompleks lengkap dengan aksi kompensasi `RefundPayment` dan `ReleaseStock`).",
      "Jangan pernah hanya percaya pengecekan masa berlaku lease di sisi klien (peringatan Martin Kleppmann): worker yang berhenti sementara di pause GC tetap mengira ia masih memegang lock kecuali **penyimpanan memeriksa Fencing Token yang menaik monoton**."
    ],
    predict: {
      prompt: "Worker A memperoleh lock Redlock Redis (`TTL = 5d`, `fencing_token = 10`) lalu membeku selama `8d` karena jeda GC/OS. Pada `t = 5.1d`, lease A kedaluwarsa dan Redis memberi Worker B `fencing_token = 11`. Worker B menulis file `v2`. Pada `t = 8d`, Worker A bangun (masih mengira lock-nya aktif) dan hendak menimpa dengan `v1`. Apa yang menolak Worker A secara aman?",
      options: [
        "Memerintahkan Worker A mengecek `TTL` di Redis sesaat sebelum menulis",
        "Membuat storage menolak setiap penulisan yang membawa `fencing_token <= lastSeenToken` (`10 <= 11` -> ditolak)",
        "Memperpanjang lease Worker A menjadi 30 detik",
        "Mematikan GC di seluruh jaringan"
      ],
      explain: "Seperti dibuktikan Martin Kleppmann, cek masa lock sebelum melakukan I/O selalu menyisakan jendela balap (TOCTOU) di antara pengecekan dan penulisan ke disk. Hanya validasi fencing token monoton di sisi penyimpanan itu sendiri yang menghentikan penulis zombie secara atomik."
    },
    practice: "Jalankan `go run .` lalu coba ubah slice `Get` Quorum menjadi `[]int{2}` (`R=1` di mana `W+R = 3 <= N`): pastikan bagaimana data basi `ver=1 ($100)` bisa terbaca. Setelah itu rancang Saga checkout 3 tahap (`ReserveStock -> ChargeCard -> ConfirmOrder`) lengkap dengan kompensasi tiap tahap.",
    teach: "Bandingkan Saga Orchestration vs Choreography, lalu jelaskan bukti Martin Kleppmann mengenai mengapa lease Redis berbasis waktu saja tidak cukup melindungi penulisan kritis.",
    analogy: "Fencing token bekerja layaknya nomor segel resmi berurut yang dicap pada berkas pengadilan: sekalipun seorang juru tulis lama bangun dan mengirim formulir bercap #10 setelah #11 sudah disahkan, meja arsip memeriksa nomor di berkasnya langsung dan menolak #10.",
    pitfalls: [
      "Menyetel `W=2, R=1` pada `N=3` sambil berharap bacaan selalu terbaru (`2 + 1 <= 3` menyisakan nol irisan dengan replika yang tertinggal).",
      "Mengabaikan perbedaan isi payload pada `Idempotency-Key` yang dikirim ulang—membalas konfirmasi `$50` lama padahal klien mengubah body menjadi `$500` menimbulkan bug tagihan fatal.",
      "Membangun Saga tanpa membuat setiap aksi kompensasinya idempoten (`Refund` wajib tahan jika terpicu ulang saat retry!)."
    ],
    quiz: [
      ["Di cluster `N = 5` replika, jika tulis mensyaratkan `W = 3` konfirmasi, berapa minimum `R` agar minimal satu replika terbaru selalu masuk di setiap bacaan?", ["R = 1", "R = 2", "R = 3 (`3 + 3 = 6 > 5`)", "R = 5"], "Irisan quorum ketat menuntut `W + R > N`; untuk `N=5, W=3`, minimum `R` adalah `3`."],
      ["Kode status HTTP apa yang sebaiknya dikembalikan API `POST /payments` bila klien memakai ulang `Idempotency-Key` dengan isi payload YANG BERBEDA?", ["200 OK", "422 Unprocessable Content (atau 400/409 konflik payload)", "304 Not Modified", "503 Service Unavailable"], "Memakai kembali key untuk parameter berbeda menyalahi semantik idempotensi (pola Stripe/IETF mengembalikan `422` atau `409`)."],
      ["Mengapa storage itu sendiri wajib memeriksa fencing token monoton?", ["Untuk mengompres JSON", "Karena pemegang lock bisa terjeda (pause GC/jaringan) di antara saat mengecek masa lock hingga mengirim I/O penulisan", "Untuk melewati TLS", "Karena Raft tidak punya leader"], "Cek masa lock dari sisi klien memiliki race TOCTOU; pemeriksaan `token > lastToken` di storage menutup peluang penulis basi secara tuntas."]
    ]
  },

  observability: {
    splits: [['OpenTelemetry Collector', '# --- 1. OTel Collector'], ['SRE Burn-Rate Alert Rule', '# --- 2. SLO Burn-Rate Alert']],
    terms: [
      ['Tiga Pilar + Trace Context', 'Log JSON terstruktur (`trace_id`), Metrik (`RED`/`USE`), dan Trace Terdistribusi yang tersambung lintas hop HTTP/gRPC memakai header W3C `traceparent` (`00-<trace-id>-<span-id>-<flags>`).'],
      ['Jebakan kardinalitas tinggi', 'Menaruh ID tak terbatas (`user_id`, `order_id`, URL penuh) sebagai label metrik Prometheus meledakkan RAM TSDB; taruh atribut unik itu di **log dan span trace**, sedangkan metrik hanya memakai pola rute (`/orders/{id}`).'],
      ['Multi-Window Multi-Burn-Rate', 'Aturan alert Google SRE yang memadukan laju pemakaian error budget cepat (`14.4×`) di jendela panjang (`1h`) SEKALIGUS jendela pendek (`5m`) agar gangguan parah langsung memanggil on-call namun cepat mereda begitu pulih.']
    ],
    title: 'Observabilitas: trace OpenTelemetry, RED/USE, dan SLO burn rate',
    why: "Mengatakan 'CPU cuma 40% berarti web aman' melewatkan loop error 500 di `/checkout`; memicu pager tiap `99.95%` selama `1 menit` membangunkan tim pukul 3 pagi hanya karena dua kedipan kecil. Trace W3C yang menyatu dengan alert burn-rate SLO mengikat pemanggilan darurat langsung pada dampak nyata ke pengguna.",
    points: [
      "Gunakan **USE** (**Utilization, Saturation, Errors**) untuk infrastruktur (CPU, antrean NIC, disk IOPS, antre connection pool) dan **RED** (**Rate, Errors, Duration histogram**) untuk setiap layanan API.",
      "Agregasikan latency memakai **histogram** (bucket `le` -> `histogram_quantile`), bukan merata-ratakan gauge—kamu tidak bisa mengambil rata-rata persentil (`p99` global bukan rata-rata dari `p99` per pod!).",
      "Teruskan **W3C Trace Context** (`traceparent`) dari edge proxy -> API -> broker pesan -> span SQL agar mengklik satu trace gagal langsung menampakkan log, query lambat, dan timeout hilir dalam satu garis waktu.",
      "Terapkan sampling cerdas di skala besar: simpan **100% trace error dan ekor lambat** (`status >= 500` atau `latency > 500ms`) memakai `tail_sampling` OTel sembari men-downsample trafik health `200 OK` ke 1–5%.",
      "Pasang alert pada **laju pembakaran error budget** (`14.4×` menghabiskan `2%` budget 30-hari `99.9%` dalam **1 jam** -> halaman darurat; kebocoran lambat `1×` cukup tiket jam kerja) dengan **jendela pendek + panjang** agar alert cepat tutup setelah diperbaiki.",
      "Jangan pernah menempelkan `user_id`, `email`, atau UUID ke label Prometheus; paksakan template rute ber-kardinalitas rendah (`/v1/orders/{id}`) dan sensor PII di pipeline OTel."
    ],
    practice: "Telusuri mengapa aturan PromQL di atas memeriksa KEDUA jendela `[1h]` DAN `[5m]` (`and`). Hitung apa yang terjadi bila klausa `[5m]` dihapus setelah gangguan 5 menit selesai diperbaiki (berapa lama pager akan tetap berbunyi?).",
    teach: "Jelaskan ledakan label kardinalitas tinggi pada metrik Prometheus vs span trace, serta bedakan dashboard RED vs USE.",
    analogy: "Memantau SLA bulanan lewat burn rate seperti mengecek laju kebocoran tangki air: tetesan halus cukup ditambal besok siang, sedangkan kehilangan 2% persediaan sebulan hanya dalam 60 menit membunyikan sirene sekarang—dan berhenti segera setelah aliran bocor berhenti 5 menit.",
    pitfalls: [
      "Menyimpan `user_id` atau URL mentah ber-ID dalam label metrik Prometheus hingga menghancurkan RAM TSDB dengan jutaan deret waktu unik.",
      "Merata-ratakan nilai `p99` antar-pod di Grafana alih-alih menggabungkan bucket histogram mentah lebih dulu (`sum by (le)` -> `histogram_quantile`).",
      "Mencatat log teks polos tanpa W3C `trace_id`, memaksa tim mencocokkan jam manual melintasi 12 layanan."
    ],
    quiz: [
      ["Mengapa Google SRE menggabungkan jendela `1h` DAN jendela konfirmasi singkat `5m` pada alert fast-burn?", ["Agar penggunaan CPU berlipat dua", "Supaya gangguan yang sudah pulih otomatis menutup alert dalam ~5 menit alih-alih terus berbunyi selama satu jam penuh", "Karena Prometheus tidak bisa menghitung laju 1h", "Untuk menghapus metrik 500"], "Tanpa jendela konfirmasi pendek, rata-rata 1 jam tetap tinggi lama setelah perbaikan dideploy."],
      ["Di mana atribut ber-kardinalitas tinggi seperti `order_id` dan `customer_id` seharusnya dicatat?", ["Label metrik Prometheus", "Field log terstruktur dan atribut span trace OpenTelemetry", "Kode status HTTP", "Catatan DNS TXT"], "TSDB mengindeks tiap kombinasi label unik di RAM; span trace dan indeks log terstruktur memang dirancang untuk kardinalitas tinggi."],
      ["Header HTTP standar mana yang merangkai distributed trace melintasi proxy dan layanan Go/C#/Node?", ["`X-Custom-Debug`", "`traceparent` (W3C Trace Context)", "`Keep-Alive`", "`ETag`"], "W3C Trace Context (`traceparent`) didukung standar di Envoy, NGINX, SDK OpenTelemetry, dan gateway cloud."]
    ]
  },

  'containers-k8s': {
    splits: [['Deployment, Probes & preStop Drain', '# --- 1. Deployment + Zero-Downtime Rolling Drain'], ['Autoscaling (HPA) & Disruption Budget', '# --- 2. HPA v2']],
    terms: [
      ['Probe (`startup`/`readiness`/`liveness`)', '`startupProbe` melindungi aplikasi yang lambat menyala; `readinessProbe` memutus trafik Service dari pod saat warm-up/drain; `livenessProbe` me-restart container yang macet total (jangan hubungkan liveness ke kesehatan DB luar!).'],
      ['Balapan drain `preStop`', 'Kubernetes menghapus IP pod yang sedang dimatikan dari kube-proxy `iptables`/EndpointSlices secara asinkron sembari mengirim `SIGTERM`. Jeda `sleep 5–10s` di `preStop` memberi waktu propagasi proxy selesai agar rolling update bebas `502 Bad Gateway`.'],
      ['`PodDisruptionBudget` (`PDB`)', 'Kontrak cluster (`minAvailable` atau `maxUnavailable`) yang melarang pengurasan node rutin menghentikan terlalu banyak replika sekaligus saat maintenance.']
    ],
    title: 'Container, Kubernetes HPA, PDB, dan graceful shutdown',
    why: "Men-deploy container stateless tampak gampang sampai satu rolling update menjatuhkan 2% transaksi live dengan `502 Bad Gateway`, atau satu kedipan DB memicu restart massal seluruh pod gara-gara liveness-probe yang keliru. Probe yang tepat, hook drain, redaman HPA, dan PDB menjaga rilis tanpa downtime.",
    points: [
      "Bangun image multi-stage minimalis non-root (distroless atau Alpine, `readOnlyRootFilesystem: true`) agar tarikan container cepat dan permukaan CVE tetap kecil.",
      "Pisahkan peran **`readinessProbe`** dari **`livenessProbe`**: gagalkan `readiness` bila dependensi krusial terputus, tetapi JANGAN pernah menggagalkan `liveness` karena Postgres kedip—me-restart semua pod ketika DB melambat menambah badai startup tepat di saat DB sedang pulih.",
      "Tetapkan **`requests`** CPU seakurat mungkin untuk penjadwalan; hindari **CPU `limits`** terlalu ketat pada layanan peka tail-latency (quota Linux CFS memicu jeda throttling ~100ms), sambil tetap memasang **memory `limits`** agar kebocoran RAM ditangani bersih oleh OOMKill.",
      "Hapus error `502` saat rolling deploy lewat **drain dua langkah**: `preStop: sleep 10` memberi jeda penghapusan endpoint di Ingress/kube-proxy selagi aplikasi memutus keep-alive dan `/readyz`, barulah `SIGTERM` menuntaskan request aktif di dalam `terminationGracePeriodSeconds`.",
      "Konfigurasikan **`HorizontalPodAutoscaler` (`autoscaling/v2`)** memakai `scaleDown.stabilizationWindowSeconds: 300` agar fluktuasi trafik singkat tidak memicu bongkar-pasang pod terus-menerus.",
      "Lindungi workload stateful maupun layanan inti dengan **`PodDisruptionBudget` (`minAvailable: 2` atau `maxUnavailable: 1`)** sebelum mengaktifkan cluster autoscaler atau upgrade kernel node."
    ],
    practice: "Audit YAML Deployment di atas: mengapa `terminationGracePeriodSeconds: 45` dipasangkan dengan `preStop: sleep 10`, dan mengapa `maxUnavailable: 0` di `rollingUpdate` penting untuk layanan yang `PodDisruptionBudget`-nya sudah memakai `maxUnavailable: 1`?",
    teach: "Jelaskan kondisi balapan saat `kubectl rollout restart` antara tibanya `SIGTERM` di proses Go/Node dengan dihapuskannya IP pod oleh Ingress—serta mengapa mengecek `/healthz` dari `livenessProbe` memakai `SELECT 1` DB memicu outage berantai.",
    analogy: "Memasang jeda `preStop` sebelum mematikan server sama seperti membalik papan toko bertuliskan 'Tutup' 10 menit sebelum mengunci pintu depan sehingga pelanggan yang telanjur duduk menyelesaikan transaksinya dengan tenang.",
    pitfalls: [
      "Menghubungkan `livenessProbe` untuk menembak Redis atau PostgreSQL—saat Redis restart 15 detik, Kubernetes ikut membunuh seluruh pod API yang sebenarnya sehat.",
      "Melupakan jeda `preStop` (atau langsung menghentikan socket sebelum EndpointSlice selesai menyebar), melempar error `502` atau reset koneksi di setiap rilis.",
      "Menyetel `replicas: 1` bersama PDB `minAvailable: 1` (atau `maxUnavailable: 0`), membuat proses upgrade/drain node Kubernetes macet permanen."
    ],
    quiz: [
      ["Mengapa `livenessProbe` hampir TIDAK PERNAH boleh menembak database eksternal atau layanan pihak ketiga?", ["HTTP GET tidak didukung Kubernetes", "Jika DB melambat sejenak, Kubernetes me-restart seluruh pod API dalam loop crash berantai padahal prosesnya tidak deadlock", "ReadinessProbe sudah me-restart pod mati", "Liveness memperlambat GC Go"], "Liveness hanya menguji 'apakah proses macet permanen?'; gangguan dependensi luar harus ditangani Readiness atau circuit breaker."],
      ["Mengapa menambahkan `preStop: sleep 10` sebelum container memproses `SIGTERM` selama rolling update?", ["Memanaskan cache CPU", "Karena propagasi EndpointSlice/kube-proxy antar node berlangsung asinkron sehingga paket bisa masuk beberapa detik setelah terminasi dimulai", "Membersihkan garbage collector Go", "Melewati cek Readiness"], "Jeda drain singkat menampung paket yang sudah telanjur dirutekan sementara load balancer menghapus IP pod terkait."],
      ["Apa yang terjadi saat upgrade node cluster bila Deployment 1 replika memakai `PodDisruptionBudget` `minAvailable: 1`?", ["Kubernetes diam-diam menjadwalkan dua pod", "Pengosongan node terhenti tanpa batas karena mengusir satu-satunya pod melanggar PDB", "HPA menimpa PDB", "Pod berubah menjadi DaemonSet"], "Pastikan minimal >= 2 replika sebelum memasang `minAvailable: 1` / `maxUnavailable: 1`, jika tidak drain node sukarela macet."]
    ]
  },

  toolbox: {
    splits: [['Tool Decision Engine (Go)', '// --- 1. Workload Spec'], ['Minimal Stack Builder', '// --- 2. Stack Recommender']],
    terms: [
      ['Prinsip teknologi membosankan', 'Prinsip Dan McKinley: pilih storage dan perangkat terbukti yang sudah tim kuasai operasionalnya (sering kali cukup Postgres + Redis sebelum menambah lima sistem terdistribusi lain) kecuali batas skala memaksa berubah.'],
      ['Pemisahan OLTP vs OLAP', 'Layani transaksi pelanggan di OLTP berbasis baris (PostgreSQL/SQL Server); alirkan event/CDC ke OLAP kolumnar (ClickHouse, BigQuery, DuckDB) ketika kueri analitik `GROUP BY` mengancam lock jalur checkout.'],
      ['Workflow engine vs Antrean', 'Antrean polos (SQS/RabbitMQ/Kafka) unggul untuk event tunggal stateless; workflow engine tahan lama (Temporal, Durable Functions) menangani orkestrasi berhari-hari, timer, persetujuan manusia, dan kompensasi langkah secara bersih.']
    ],
    title: 'Matriks pemilihan tools dan blok arsitektur komposabel',
    why: "Perancang sistem yang matang tidak pernah memamerkan nama teknologi demi tren—mereka memulai dari batasan nyata (QPS, kebutuhan ACID, bentuk kueri, retensi, ukuran tim) lalu menyusun stack terkecil yang kegagalannya sanggup ditangani tim pukul 3 pagi.",
    points: [
      "**OLTP Utama (`< 20–50K` ops/detik satu region)**: **PostgreSQL** sudah menutupi integritas relasional, JSONB, partial index, antrean SKIP LOCKED, hingga `pgvector` sebelum perlu memikirkan Cassandra atau Spanner.",
      "**Wide-Column / Skala Tulis Masif / Key-Value Terprediksi**: **DynamoDB** atau **Cassandra** ketika SLA partition-key di ratusan ribu QPS melampaui tulis satu primer dan tidak butuh join rumit.",
      "**Cache Memori & Counter Sementara**: **Redis / Valkey** untuk cache `LRU/LFU` sub-milidetik, counter Lua rate limiter, leaderboard sorted set, dan pub/sub—bukan sebagai buku besar utama tanpa cadangan.",
      "**Messaging**: **RabbitMQ / SQS** untuk antrean tugas ber-routing dan retry tertunda; **Kafka / Redpanda** untuk log event berurut yang dikonsumsi ulang oleh banyak tim terpisah (billing, indeks pencarian, ML, ClickHouse).",
      "**Pencarian & Geospasial**: **OpenSearch / Elasticsearch** atau **Meilisearch** untuk teks penuh BM25/facet tersinkron dari CDC; **PostGIS** atau **Uber H3 + Redis** untuk pencocokan radius.",
      "**Orkestrasi & Load Balancing**: **NGINX / Envoy / Cloud ALB** untuk TLS, rate limit, dan routing L7; **OpenTelemetry + Prometheus/Grafana** untuk observabilitas; **Temporal** bila saga multi-tahap berlangsung lama atau butuh pemutaran ulang state."
    ],
    practice: "Jalankan `go run .` dan amati mengapa fintech ledger `5k QPS` sengaja tidak memakai Kafka, Sharding, OpenSearch, maupun Temporal sampai syarat beban memaksa. Tambahkan skenario ketiga milikmu (mis. layanan notifikasi atau pencocokan ojek online) dan jelaskan alasan tiap komponennya.",
    teach: "Pertahankan alasan memakai stack ramping (`Postgres + PgBouncer + Redis + Outbox`) hingga ~10–25K QPS alih-alih langsung menumpuk Kafka + Cassandra + 12 microservice sejak hari pertama—dan sebutkan metrik pemicu upgrade berikutnya.",
    analogy: "Tukang kayu ahli tidak membawa mesin CNC ke setiap proyek perbaikan rumah kalau pahat dan gergaji sudah presisi—setiap komponen terdistribusi baru yang kamu pasang membawa jadwal piket on-call, jeda sinkronisasi, dan pola kegagalannya sendiri.",
    pitfalls: [
      "Arsitektur berbasis resume: memasang Kafka, Cassandra, Elasticsearch, dan service mesh Istio untuk aplikasi internal 50 RPS beranggotakan 3 developer.",
      "Memilih NoSQL hanya untuk 'menghindari skema' pada sistem tagihan/keuangan relasional yang justru membutuhkan transaksi multi-baris ACID.",
      "Menganggap daftar tools bersifat abadi—ukur ulang titik kemacetan nyata setiap lonjakan trafik `2×–5×`."
    ],
    quiz: [
      ["Mengapa laporan BI berat (`GROUP BY` 12 bulan faktur) harus dipisah dari database PostgreSQL utama yang melayani checkout pelanggan?", ["PostgreSQL tidak mendukung `GROUP BY`", "Pemindaian analitik panjang menggusur halaman populer dari buffer pool OLTP dan berebut CPU/I/O dengan transaksi live", "JSON tidak dapat menyimpan tanggal", "CDN memblokir query analitik"], "Memisahkan beban OLAP ke replika khusus atau penyimpan kolumnar (ClickHouse/BigQuery) menjaga tail latency checkout tetap rendah."],
      ["Kapan **Temporal** (atau workflow engine persisten) mengungguli antrean RabbitMQ/SQS mentah?", ["Untuk resize satu thumbnail sederhana", "Ketika saga bisnis multi-langkah berjalan berjam-jam/berhari-hari memakai timer, aksi kompensasi, dan replay state deterministik", "Untuk men-cache gambar di tepi CDN", "Untuk meniadakan handshake TCP"], "Antrean polos cocok untuk tugas asinkron tunggal, sementara saga panjang ber-timer dan kompensasi mudah berantakan tanpa workflow engine."],
      ["Arsitektur database mana yang tepat untuk dompet keuangan ACID bertrafik puncak sedang `3.000 QPS` dengan tim kecil?", ["Cluster Cassandra 64-shard", "PostgreSQL primer + replika sync/async + PgBouncer + rate limiter Redis", "Ledger utama Elasticsearch", "Map di memori saja"], "PostgreSQL menuntaskan transaksi ACID di 3k QPS dengan beban operasional jauh lebih sederhana dibanding sharding NoSQL terdistribusi."]
    ]
  }
}, {
  name: 'System Design',
  tagline: 'Arsitektur, caching, rate limiting, mesin penyimpanan, sharding, antrean pesan, ketahanan sistem, observabilitas, dan pemilihan tools berskala besar.'
});
