// @ts-check
// Bahasa Indonesia — track System Design. Contoh kode memakai versi aslinya.
export const trackId = {
  id: 'sysdesign',
  name: 'System Design',
  tagline: 'Arsitektur, caching, rate limiting, mesin penyimpanan, sharding, antrean pesan, ketahanan sistem, observabilitas, dan pemilihan tools berskala besar.',
  lessons: {
  thinking: {
    terms: [
      ['Tail latency (`p95`, `p99`)', 'Batas waktu respons yang dipenuhi 95% atau 99% request. Rata-rata menutupi outlier lambat yang mengganggu checkout dan login saat trafik tinggi.'],
      ["Hukum Little (`L = λW`)", 'Rata-rata pekerjaan aktif (`L`) sama dengan laju kedatangan (`λ`) dikali rata-rata durasi di sistem (`W`). Kenaikan latency melipatgandakan koneksi terbuka meski QPS tetap.'],
      ['Scaling vertikal vs horizontal', 'Scaling vertikal menaikkan CPU atau RAM pada satu mesin. Scaling horizontal menambah node stateless di balik load balancer dengan tambahan biaya koordinasi.']
    ],
    title: 'Latency, throughput, dan estimasi kapasitas',
    why: "Desain sistem dimulai dari hitungan skala, sebelum menggambar diagram kotak. Perkirakan dulu laju request, pertumbuhan disk, bandwidth, dan bagaimana tail latency menggandakan konkurensi lewat Hukum Little.",
    points: [
      "Latency mengukur durasi satu request (`ms`), sementara throughput mengukur volume (`RPS` atau `QPS`). Menambah replika worker menaikkan throughput tanpa mempercepat satu query yang lambat.",
      "Ukur `p50`, `p95`, dan `p99` karena rata-rata menyembunyikan outlier. Halaman yang memanggil 10 endpoint paralel menunggu yang paling lambat, membuat ekor 1% mengenai ~10% kunjungan (`1 - 0.99^10`).",
      "Ingat urutan kecepatan hardware: baca RAM ~100 ns, NVMe SSD ~100 µs. Round-trip satu AZ makan ~0,5 ms, sedangkan lintas region makan 50 hingga 150 ms.",
      "Sehari memiliki `86.400` detik (~`100.000`), sehingga 1 juta event per hari rata-rata ~12 RPS. Siapkan kapasitas 3× hingga 10× lebih besar untuk puncak beban.",
      "Hitung konkurensi lewat Hukum Little (`L = λW`): pada `2.000 RPS` dan latency `50 ms` (`0,05 s`), server menahan `100` slot aktif. Bila lock DB mendorong latency ke `500 ms`, konkurensi naik ke `1.000` dan menguras pool.",
      "Uji asumsi beban memakai load generator nyata seperti `k6`, `bombardier`, atau `NBomber` sebelum menentukan ukuran cluster produksi."
    ],
    practice: "Simpan sebagai `main.go` lalu jalankan `go run .`. Ubah `latencies` menjadi dua puluh respons 15 ms plus satu jeda lock DB 900 ms. Bandingkan `p50` ke `p99`, lalu hitung kebutuhan pool pada `3.000` peak RPS.",
    teach: "Jelaskan mengapa dua API ber-latency rata-rata 25 ms bisa terasa berbeda di produksi. Uraikan `L = λW` dengan contoh query downstream yang lambat.",
    analogy: "Lajur tol menghitung mobil per jam (throughput), sementara lama perjalanan (latency) bergantung kecepatan dan gerbang tol. Bila gerbang macet 30 detik, antrean meluber ke jalur masuk (`L = λW`) meski mobil baru tidak bertambah.",
    pitfalls: [
      "Menentukan ukuran cluster dari RPS harian rata-rata (`daily / 86,400`) dan melupakan lonjakan puncak saat jam login pagi, flash sale, atau gajian.",
      "Hanya melaporkan latency rata-rata (`mean`), yang menyembunyikan lonjakan `p99` yang dirasakan pengguna aktif.",
      "Menambah core CPU ke layanan yang terhambat I/O saat bottleneck sebenarnya ada pada antrean connection pool atau round-trip lintas region."
    ],
    quiz: {
      '000-rps-db-slowdown': ["Pada 1.000 RPS, perlambatan DB menaikkan rata-rata waktu respons dari 20 ms menjadi 400 ms. Apa yang terjadi pada jumlah request aktif (`L = λW`)?", ["Tetap 20 karena RPS sama", "Turun dari 20 ke 1", "Melonjak dari 20 menjadi 400, berisiko menghabiskan thread atau koneksi", "Turun setengah menjadi 10"], "Menurut Hukum Little (`L = λW`), `1.000 * 0,4 s` menghasilkan `400` request aktif bersamaan, naik dari `20`."],
      'many-requests-per-second': ["Sekitar berapa RPS rata-rata untuk 8,6 juta event per hari?", ["10 RPS", "100 RPS", "1.000 RPS", "8.600 RPS"], "Membagi `8.640.000` dengan `86.400` detik menghasilkan `100 RPS` rata-rata (sekitar 12 RPS per 1 juta event harian)."],
      'calling-10-independent-microserv': ["Mengapa memanggil 10 microservice terpisah secara paralel memperbesar tail latency?", ["Serialisasi menggandakan ukuran payload", "Parent request menunggu respons paling lambat dari 10 panggilan itu", "HTTP/1.1 menjatuhkan setiap paket kesepuluh", "Cache DNS kedaluwarsa tiap hop"], "Jika setiap layanan punya ekor lambat 1%, memanggil 10 secara paralel membuat ~`1 - 0,99^10 ≈ 9,6%` kunjungan terkena panggilan lambat."]
    }
  },

  networking: {
    splits: ['NGINX Edge Proxy', 'Envoy Cluster + Outlier'],
    terms: [
      ['Load balancer L4 vs L7', 'L4 merutekan paket TCP/UDP berdasar IP dan port secara cepat. L7 mengakhiri TLS lalu membaca header HTTP, path, dan frame gRPC untuk routing cerdas.'],
      ['Health check aktif vs pasif', 'Pemeriksaan aktif menembak `/readyz` berkala (tersedia di Envoy dan NGINX Plus). Pemeriksaan pasif (Outlier Detection) mengeluarkan backend setelah error 5xx atau timeout beruntun.'],
      ['HTTP/3 (QUIC)', 'Memultipleks stream di atas UDP dengan handshake 0-RTT atau 1-RTT. Satu paket hilang hanya menahan stream miliknya sendiri tanpa blokade head-of-line TCP di jaringan seluler.']
    ],
    title: 'DNS, CDN, reverse proxy, dan load balancer',
    why: "Setiap request melewati DNS, terminasi TLS, serta minimal satu reverse proxy atau load balancer sebelum menyentuh aplikasimu. Kesalahan timeout, buffering, atau health check di edge mematikan API streaming dan membanjiri instance yang lemah.",
    points: [
      "Pasang Anycast DNS dan CDN (Cloudflare, AWS CloudFront) di depan agar TLS berakhir dekat pengguna dan aset statis disajikan langsung dari edge.",
      "Padukan L4 balancing (AWS NLB, IPVS) untuk throughput mentah bersama L7 balancing (NGINX, Envoy, HAProxy, AWS ALB) untuk routing path dan rate limit.",
      "Pilih algoritma balancing sesuai durasi kerja. Round Robin pas untuk endpoint cepat dan seragam, sedangkan Least Connections atau Power of Two Random Choices (`P2C`) menjaga endpoint bervariasi.",
      "Gabungkan cek aktif `/readyz` bersama Outlier Detection pasif (misalnya mengeluarkan host upstream setelah 5 error 5xx beruntun di Envoy) agar pod rusak cepat tersingkir.",
      "Cermati bawaan proxy NGINX: versi open-source tidak memiliki cek aktif dan menyalakan `proxy_buffering on`, yang menahan event SSE. Perpanjang `proxy_read_timeout` agar WebSocket menganggur bertahan lewat 60 detik.",
      "Aktifkan HTTP/3 (QUIC) di edge (NGINX `ngx_http_v3_module` dengan `Alt-Svc`, atau Envoy QUICHE) untuk menghindari antrean TCP pada koneksi seluler yang sering putus."
    ],
    practice: "Bandingkan kedua blok konfigurasi dengan edge aplikasimu. Petakan terminasi TLS, matikan proxy buffering untuk stream, lalu tentukan `max_ejection_percent` agar kapasitas bertahan saat gangguan parsial.",
    teach: "Bandingkan L4 load balancer dengan L7 proxy seperti Envoy. Jelaskan mengapa kombinasi cek aktif `/readyz` dan Outlier Detection pasif lebih kuat daripada memakai satu jenis saja.",
    analogy: "L4 balancer melambaikan truk masuk jalur lewat pelat nomor tanpa membuka muatan. L7 proxy memeriksa surat jalan untuk mengarahkan muatan prioritas, menahan truk mogok, dan membagikan brosur cached.",
    pitfalls: [
      "Menyetel cek `/health` yang melewatkan dependensi inti, atau justru menggagalkan readiness saat dependensi opsional terganggu sehingga balancer menyingkirkan semua server sehat.",
      "Memakai Round Robin ketika waktu respons terbentang dari 2 ms sampai 4 detik, menumpuk request berat di satu server.",
      "Menaruh L7 proxy ber-default `proxy_buffering on` di depan stream SSE sehingga event tertahan di memori hingga buffer penuh."
    ],
    quiz: {
      'envoy-max-ejection-percent': ["Mengapa `max_ejection_percent: 50` di Envoy melindungi cluster selama gangguan singkat jaringan?", ["Ia mengompres 50% body JSON", "Mencegah Outlier Detection mengeluarkan semua host backend serentak saat lonjakan error singkat", "Membatasi CPU hingga 50%", "Memaksa turun ke HTTP/3"], "Membatasi persentase ejeksi mempertahankan separuh kapasitas online ketika seluruh pod mencatat error bersamaan."],
      'default-nginx-setting-stalls': ["Setelan bawaan NGINX mana yang menghambat Server-Sent Events (SSE)?", ["Kompresi gzip dimatikan", "`proxy_buffering on`, yang mengumpulkan chunk respons sebelum dikirim ke klien", "Routing Least Connections", "TLS 1.3 resumption"], "Klien SSE menunggu event terkirim seketika. Memasang `proxy_buffering off` menghentikan NGINX menahan chunk kecil di RAM."],
      'http-quic-beat-http': ["Mengapa HTTP/3 (QUIC) mengungguli HTTP/2 pada jaringan seluler dengan packet loss?", ["Tanpa overhead enkripsi", "Stream berbasis UDP membatasi kehilangan paket pada stream terkait saja tanpa menahan stream lain", "Window kongesti TCP lebih besar", "Lookup DNS stateless"], "Pada HTTP/2 di atas TCP, satu paket hilang menahan semua stream sampai terkirim ulang. QUIC membatasi tunggu pada satu stream saja."]
    }
  },

  communication: {
    splits: ['Idempotent REST POST', 'Server-Sent Events', 'WebSocket Upgrade'],
    terms: [
      ['Idempotency key', 'ID buatan klien (header IETF `Idempotency-Key`) yang disimpan bersama respons sehingga retry `POST` memutar hasil pertama tanpa menjalankan efek samping dua kali.'],
      ['Paginasi Cursor vs Offset', 'Offset (`OFFSET 10000`) memindai lalu membuang baris, dan batas halaman bergeser ketika baris baru masuk. Cursor melompat langsung lewat `WHERE (created_at, id) < (@ts, @id)`.'],
      ['gRPC vs REST', 'gRPC memadukan multiplexing HTTP/2 dan Protocol Buffers biner untuk kontrak internal cepat. REST/JSON mengutamakan dukungan browser, caching HTTP, dan keterbacaan.']
    ],
    title: 'API dan protokol real-time: REST, gRPC, WebSocket, dan SSE',
    why: "Pola komunikasi yang keliru memicu tagihan ganda saat retry, baris feed kembar di paginasi, atau server membuang RAM menahan koneksi menganggur.",
    points: [
      "Pakai REST/JSON di edge publik demi dukungan alat klien luas dan caching CDN. Gunakan gRPC antar layanan internal ketika kontrak `.proto`, payload biner, dan stream HTTP/2 menekan latency dan CPU.",
      "Lindungi panggilan `POST` dan `PATCH` yang tidak idempoten dari retry jaringan memakai header IETF `Idempotency-Key` dengan unique constraint `(idempotency_key)` di database.",
      "Pakai keyset cursor pagination (`?after=2026-11-19T08:00:00Z,9842`) di feed aktif dan buku besar. Entri baru tidak menggandakan item halaman, dan halaman dalam tetap `O(log n)`.",
      "Pilih Server-Sent Events (SSE) untuk pembaruan satu arah server-ke-klien karena browser menyambung ulang otomatis lewat `Last-Event-ID`. Simpan WebSockets untuk trafik dua arah penuh seperti chat.",
      "Gunakan short polling, long polling, atau webhook ketika pembaruan berjarak beberapa menit agar server tidak menahan socket persisten yang menganggur."
    ],
    practice: "Telusuri retry checkout ponsel saat klien timeout sesudah commit. Daftarkan seluruh kolom pada `orders` atau `idempotency_records` (kunci, hash request, status HTTP, respons terserialisasi, `expires_at`). Jelaskan respons server jika kunci dipakai ulang untuk payload berbeda.",
    teach: "Bandingkan Short Polling, Long Polling, Server-Sent Events, dan WebSocket berdasarkan jumlah koneksi, dukungan firewall, reconnect otomatis, dan arah aliran pesan.",
    analogy: "REST ibarat mengirim surat tercatat, sementara gRPC seperti pipa pneumatik antar meja kantor. SSE seperti siaran radio yang menyambung tepat di `Last-Event-ID`, sedangkan WebSockets menjaga telepon dua arah terbuka.",
    pitfalls: [
      "Menerima ulang `Idempotency-Key` lama bersama body JSON baru tanpa membalas `422 Unprocessable Content`, menutupi bug pemakaian ulang kunci di klien.",
      "Memakai paginasi `OFFSET` pada linimasa aktif (`OFFSET 50000`), membuang I/O DB dan memunculkan baris kembar saat entri baru masuk.",
      "Memilih WebSockets untuk papan skor satu arah ketika SSE di atas HTTP/2 bekerja dengan jauh lebih sedikit masalah proxy."
    ],
    quiz: {
      'only-need-stream-real': ["Kamu hanya perlu mengalirkan harga saham real-time dari server ke browser dengan reconnect otomatis saat sinyal putus. Protokol mana paling pas?", ["WebSockets", "Server-Sent Events (SSE)", "Short polling tiap 50 ms", "SMTP"], "SSE berjalan di atas HTTP standar, menyambung otomatis, dan melanjut dari `Last-Event-ID` tanpa overhead handshake dua arah."],
      'reject-retried-post-carrying': ["Mengapa server menolak retry `POST` dengan `Idempotency-Key` yang sudah ada bila isi body berbeda dari panggilan pertama?", ["HTTP/2 melarang kunci duplikat", "Memakai satu kunci untuk payload berbeda menandakan bug klien yang berisiko mengembalikan hasil cache keliru", "Redis menghapus hash saat beda", "Parser JSON melarang retry POST"], "Membandingkan hash payload mengikat satu kunci ke satu operasi logis dan menolak ketidakcocokan lewat HTTP 422."],
      'cursor-pagination-beat-offset': ["Mengapa paginasi cursor mengungguli `OFFSET 20000` pada tabel besar?", ["Offset menghapus baris lama", "Cursor melompat langsung memakai predikat berindeks (`WHERE (ts, id) < ...`) dalam O(log n) tanpa memindai baris terbuang", "Cursor mengompres JSON", "Offset mengunci seluruh tabel"], "`OFFSET 20000` memaksa DB membaca lalu membuang 20.000 baris, sedangkan keyset cursor langsung melompat ke key berikutnya."]
    }
  },

  caching: {
    splits: ['Cache-Aside + LRU', 'HTTP RFC 9111 Freshness'],
    terms: [
      ['Cache-Aside (Lazy Loading)', 'Aplikasi memeriksa cache dulu. Saat miss, ia membaca database, mengisi cache, lalu mengembalikan data sehingga hanya key populer yang memakai RAM.'],
      ['Write-Through vs Write-Behind', 'Write-Through memperbarui cache dan DB serempak untuk bacaan segar walau tulis lebih lambat. Write-Behind menampung tulis di cache dan mem-flush asinkron demi tulis cepat, berisiko hilang saat crash.'],
      ['Kebijakan eviksi (`LRU`, `LFU`)', 'LRU membuang key paling lama tidak tersentuh. LFU melacak frekuensi akses dengan penghitung logaritmik di Redis agar scan batch jarang tidak mengusir data populer.']
    ],
    title: 'Lapisan cache, strategi tulis, dan caching HTTP',
    why: "Caching memangkas latency baca dari milidetik menjadi mikrodetik dan menyerap trafik baca dari database. Namun invalidasi atau eviksi yang salah menyajikan data basi, memenuhi RAM, atau memperlambat tulis.",
    points: [
      "Susun lapisan cache sedekat mungkin ke pemanggil: HTTP cache browser, CDN edge (`s-maxage`), lalu L1 RAM lokal (HybridCache atau `ristretto`). Gunakan Redis atau Valkey sebagai RAM L2 terdistribusi.",
      "Pasang header HTTP RFC 9111 pada bacaan publik: `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=30`, `ETag` (`304 Not Modified`), dan `Vary`. Jangan pernah menaruh `Cache-Control: public` pada respons pribadi berbasis auth atau cookie.",
      "Pilih strategi tulis sesuai toleransi konsistensi. Cache-Aside pas untuk aplikasi dominan baca, Write-Through menjaga kesegaran langsung, dan Write-Behind cocok untuk counter analitik tinggi yang masih aman kehilangan buffer terakhir saat crash.",
      "Atur kebijakan eviksi Redis `maxmemory` dengan sadar: pakai `allkeys-lru` untuk cache umum, `allkeys-lfu` bila scan latar mengotori urutan baru, dan hindari `noeviction` pada cache.",
      "Tentukan tiga hal untuk tiap kunci cache sejak awal: skema deterministik (`sku:42:v2`), TTL terbatas dengan jitter, dan jalur invalidasi."
    ],
    predict: {
      prompt: "Thread A membaca `sku:42` saat cache miss (DB berisi harga `100`). Sebelum Thread A menulis ke Redis, Thread B mengubah DB menjadi `120` lalu menghapus `sku:42` di Redis. Barulah Thread A menulis `100` ke Redis ber-TTL 10 menit. Apa yang dilihat pembaca selama 10 menit berikutnya?",
      options: [
        "120, karena Thread B menghapus kunci paling akhir",
        "100 (nilai basi), karena Thread A menimpa kunci yang baru dihapus memakai data lama",
        "Error transaksi Redis membatalkan Thread A",
        "Selalu cache miss hingga DB dimulai ulang"
      ],
      explain: "Thread A membaca `100` sebelum Thread B menulis `120`, lalu menulis Redis belakangan. Race klasik Cache-Aside ini menyisakan data basi hingga TTL habis, sebab itulah kunci butuh TTL terbatas plus versioning atau invalidasi CDC."
    },
    practice: "Jalankan contoh Go dengan `go run .` lalu buka `VIZ.syscache`. Ubah eviksi dari `LRU` ke `LFU`, baca kunci `A` tiga kali serta `B`/`C`/`D` sekali, lalu cek kunci mana yang bertahan.",
    teach: "Bandingkan Cache-Aside, Write-Through, dan Write-Behind memakai contoh harga produk atau penghitung tayang. Jelaskan dampak saat Redis restart pada masing-masing pola.",
    analogy: "Cache menaruh barang laris di meja depan (`LRU` atau `LFU`) sehingga pegawai tidak perlu berjalan ke gudang tiap pesanan. `TTL` memaksa pemeriksaan rak secara berkala.",
    pitfalls: [
      "Menaruh `Cache-Control: public` atau lupa `Vary: Authorization` pada respons pengguna, menyebabkan CDN menyajikan profil Pengguna A ke Pengguna B.",
      "Membiarkan `maxmemory-policy` Redis pada `noeviction` di cluster cache sehingga penulisan gagal begitu RAM penuh.",
      "Hanya bergantung pada penghapusan manual tanpa TTL, menyisakan entri basi selamanya setelah satu delete gagal."
    ],
    quiz: {
      'allkeys-lfu-beat-allkeys': ["Mengapa `allkeys-lfu` bisa mengungguli `allkeys-lru` saat laporan malam memindai 50.000 item lama?", ["LFU mengompres kunci otomatis", "LFU mencatat frekuensi akses sehingga scan sekali jalan tidak menggusur key panas yang sering dipakai", "LRU memblokir bacaan saat eviksi", "LFU menjamin konsistensi kuat"], "Pemindaian batch memenuhi ujung baru daftar LRU, sedangkan LFU menjaga item yang sering diakses tetap bertahan."],
      'rfc-9111-cache-control': ["Direktif RFC 9111 `Cache-Control` mana yang membolehkan CDN menyajikan data baru kedaluwarsa sambil memperbaruinya di latar belakang?", ["`no-store`", "`must-revalidate`", "`stale-while-revalidate`", "`private`"], "`stale-while-revalidate=N` menyembunyikan latency validasi origin dari pengunjung selama jendela tenggang."],
      'write-behind-caching-risky': ["Kapan Write-Behind caching menjadi pilihan berisiko?", ["Penghitung tayang dan analitik", "Thumbnail statis permanen", "Saldo rekening atau stok barang di mana hilangnya buffer cache saat crash menghilangkan update ter-commit", "Catatan DNS"], "Write-Behind mengakui penulisan sebelum menyalin ke disk persisten, sehingga crash cache menghapus perubahan yang masih tertampung."]
    }
  },

  'cache-failures': {
    splits: ['Singleflight Coalescer', 'Bloom Filter Guard', 'TTL Jitter'],
    terms: [
      ['Cache stampede (dog-piling)', 'Banyak request serentak mengalami miss pada key populer yang baru kedaluwarsa, lalu mengirim query kembar untuk menghitung nilai yang sama.'],
      ['Cache penetration', 'Pencarian key yang kosong di cache maupun database (seperti ID tidak valid `-1` atau bot scan) menembus cache setiap saat dan membebani DB.'],
      ['Cache avalanche', 'Banyak kunci kedaluwarsa serentak atau satu shard cache jatuh, mengirim lonjakan trafik mendadak langsung ke database.']
    ],
    title: 'Kegagalan cache: stampede, penetration, dan hot key',
    why: "Cache yang mampu menahan 50× beban normal tetap bisa menjatuhkan database dalam hitungan detik. Kondisi ini muncul saat key panas kedaluwarsa di puncak trafik, bot meminta ID palsu, atau seluruh TTL habis bersamaan.",
    points: [
      "Hentikan cache stampede dengan menggabungkan miss serentak per key memakai singleflight (`golang.org/x/sync/singleflight` di Go, `HybridCache` di .NET), stale-while-refresh, atau perpanjangan dini XFetch.",
      "Hentikan cache avalanche dengan menambah jitter acak TTL (`baseTTL + rand(0, 20%)`) agar kunci dari deploy tidak habis bersamaan. Padukan dengan circuit breaker dan replika multi-AZ.",
      "Hentikan cache penetration ID palsu lewat negative caching (`\"\"` atau `__NULL__` ber-TTL 30 hingga 60 detik). Pasang Bloom filter di depan pembacaan DB.",
      "Cegah hot key viral memenuhi satu shard Redis. Tambah cache L1 di memori aplikasi 1 hingga 5 detik, atau sebar kunci baca lintas shard (`sku:42#0..3`).",
      "Pasang batas waktu context pada negative cache dan singleflight agar satu build ulang yang macet tidak menggantung 500 pemanggil."
    ],
    predict: {
      prompt: "Banner beranda kedaluwarsa pukul `12:00:00`. Pada `12:00:00.010`, 500 request serentak mendapati miss Redis dan memanggil `db.GetBanner()` paralel sebelum menulis balik Redis. Dengan Cache-Aside tanpa penggabungan, berapa query DB yang langsung menembak pukul `12:00:00`?",
      options: [
        "1 query, karena Redis mengunci key yang kosong",
        "Hingga 500 query identik selagi panggilan pertama masih berjalan",
        "0 query, karena Cache-Aside otomatis menyajikan data basi",
        "Tepat 2 query (primer + replika)"
      ],
      explain: "Kelima ratus bacaan melihat cache kosong sebelum satu pun selesai mengisi Redis, mengirim kawanan thundering herd 500× langsung ke database."
    },
    practice: "Jalankan `go run .` dan lihat 25 pemanggil bersamaan memicu `dbCalls=1`. Hapus pembungkus `SingleFlight` pada salinan kode untuk melihat `dbCalls=25`. Cek juga cara false positive Bloom filter jatuh balik ke DB plus negative cache.",
    teach: "Bedakan Cache Stampede, Cache Penetration, dan Cache Avalanche. Sebutkan masing-masing satu mitigasi utama beserta trade-off-nya.",
    analogy: "Singleflight itu seperti dua puluh anak kos melihat galon kosong lalu mengutus satu orang membeli untuk semuanya. Bloom filter itu daftar tamu di pintu yang langsung menolak nama asing sebelum membuka buku kas.",
    pitfalls: [
      "Mengira Bloom filter punya nol false positive atau bisa hapus key langsung. Filter standar hanya menjamin nol false negative, jadi hapus butuh Counting Bloom Filter atau rebuild berkala.",
      "Menyimpan negative cache tanpa batas jumlah key atau TTL pendek, membuat ID acak mengusir cache yang valid.",
      "Memakai singleflight tanpa timeout sehingga satu panggilan DB macet menahan seluruh pemanggil yang menunggu."
    ],
    quiz: {
      'standard-bloom-filter-guarantee': ["Apa jaminan 100% pasti dari Bloom filter standar?", ["Key pasti ada di dalam DB", "Bila filter mengembalikan `false`, key tersebut dipastikan TIDAK ada", "Nol false positive", "Hapus key O(1)"], "Bloom filter tidak pernah menghasilkan false negative. Bila satu bit hash bernilai 0, key tersebut belum pernah dimasukkan."],
      'technique-stops-one-flash': ["Teknik apa yang menghentikan satu SKU flash-sale memenuhi satu shard Redis meski hit rate sudah 99,9%?", ["Snapshot RDB Redis lebih lama", "Beralih ke batas Fixed Window", "Cache mikro L1 di RAM lokal (TTL 1s) atau salting kunci baca (`sku:42#0..N`)", "Mematikan eviksi"], "Satu hot key menghantam satu shard Redis setiap bacaan. Menyerap bacaan di L1 app RAM atau salting antar shard menyingkirkan bottleneck tersebut."],
      'add-10-20-random': ["Mengapa menambah jitter acak 10% hingga 20% pada TTL cache saat warm-up massal?", ["Mencegah satu kelompok key kedaluwarsa bersamaan (cache avalanche)", "Menghemat RAM per key di Redis", "Memaksakan urutan LRU", "Melewati Origin Shield CDN"], "Jitter menyebar waktu kedaluwarsa sepanjang beberapa menit agar pembaruan latar stabil tanpa lonjakan serentak."]
    }
  },

  ratelimiting: {
    splits: ['Token Bucket', 'Sliding Window Counter', 'HTTP 429 & IETF Headers'],
    terms: [
      ['Token Bucket', 'Mengisi ulang token pada laju `r` hingga kapasitas burst `b`. Membolehkan lonjakan singkat hingga `b` sembari menjaga laju rata-rata `r` di memori `O(1)`.'],
      ['Sliding Window Counter', 'Menggabungkan `prevCount * bobotTumpangTindih + currCount` dari dua bucket berdekatan. Memberi akurasi tinggi memakai memori `O(1)` per klien.'],
      ['Header `RateLimit` IETF', 'Menstandarkan `RateLimit-Policy` (aturan kuota) dan `RateLimit` (sisa kuota dan reset) pengganti `X-RateLimit-*`, beserta `429 Too Many Requests` dan `Retry-After`.']
    ],
    title: 'Algoritma rate limiting, header IETF, dan load shedding',
    why: "Tanpa rate limiting dan load shedding, satu loop retry rusak atau scraper menghabiskan pool API dan membuat pengguna sah menunggu. Setiap algoritma menukar keadilan batas jendela dengan RAM dan keluwesan burst.",
    points: [
      "Sesuaikan algoritma dengan kebutuhan: Fixed Window (RAM mungil, burst batas 2×) dan Sliding Window Log (presisi, simpan semua timestamp). Sliding Window Counter, Token Bucket, dan Leaky Bucket atau GCRA menjaga state `O(1)` tanpa lonjakan tepi.",
      "Di banyak pod API, jangan pakai `GET` lalu `SET` dari kode aplikasi karena pod yang berlomba bisa meloloskan kuota berlebih. Jalankan cek-dan-kurangi atomik di dalam skrip Lua Redis (`EVALSHA`) atau `INCR` plus `EXPIRE`.",
      "Kembalikan `429 Too Many Requests` dengan `Retry-After` serta header IETF `RateLimit-Policy` / `RateLimit`. Menurut RFC 9111, klien wajib mengabaikan header `RateLimit` saat respons berasal dari cache (`Age > 0`).",
      "Tetapkan mode gagal per rute: fail open pada pencarian bila Redis putus, dan fail closed pada endpoint login atau OTP.",
      "Padukan batas per klien (`429`) bersama load shedding tingkat server (`503 Service Unavailable`). Tolak request prioritas rendah sebelum kejenuhan CPU atau antrean menjatuhkan `p99` semuanya."
    ],
    predict: {
      prompt: "Sebuah API memasang batas Fixed Window `100` request per menit yang direset pada detik `:00`. Satu klien mengirim `100` request pada `12:00:58` dan `100` lagi pada `12:01:01`. Berapa request yang lolos dalam rentang 4 detik itu?",
      options: [
        "Total 100 request, karena rate limiter melacak 60 detik terakhir",
        "200 request lolos (2× batas yang diizinkan di batas pergantian menit)",
        "101 request lolos sebelum backoff aktif",
        "0 request lolos karena selisih jam"
      ],
      explain: "Fixed Window mereset penghitungnya pada `12:01:00`, sehingga klien bisa mengirim `2×` batas melewati sambungan menit. Sliding Window Counter, Token Bucket, atau GCRA menutup celah ini."
    },
    practice: "Buka `VIZ.sysratelimit` dan uji lonjakan tepi `:09` (`Lompat ke :09` -> `Burst ×4` -> `Maju +2d` -> `Burst ×4`). Amati Fixed Window meloloskan batas `2×`, sementara Sliding Window Counter, Token Bucket, dan Leaky Bucket menolaknya.",
    teach: "Jelaskan mengapa rate limiter terdistribusi mengeksekusi cek-dan-kurangi dalam satu skrip Lua Redis atau perintah atomik. Bandingkan Token Bucket dengan Leaky Bucket.",
    analogy: "Token Bucket itu kartu kereta berisi hingga `b` tiket yang diisi tiap jam agar rombongan kecil bisa masuk bersama. Leaky Bucket itu palang mekanis yang berputar pada satu ketukan tetap.",
    pitfalls: [
      "Membaca counter Redis di Go, mengecek `< limit`, lalu mengirim `INCR` di panggilan kedua. Request serentak lolos bersamaan saat trafik tinggi.",
      "Mengembalikan `429` tanpa `Cache-Control: no-store`, atau lupa bahwa respons cache dengan `Age > 0` membawa angka `RateLimit` usang.",
      "Membatasi hanya lewat IP di balik NAT kantor atau proxy CGNAT seluler, ikut memblokir ribuan pengguna lain yang tidak bersalah."
    ],
    quiz: {
      'rate-limiting-approach-prevents': ["Pendekatan rate limiting mana yang mencegah klien mengirim dua kali kuota melintasi `:59` dan `:01` sekaligus mempertahankan memori `O(1)` per pengguna?", ["Fixed Window Counter", "Sliding Window Counter", "Log Redis tanpa eviksi", "Caching ETag HTTP"], "Sliding Window Counter membobot hitungan jendela lalu menurut fraksi tumpang tindihnya hanya dengan dua angka per klien."],
      'according-ietf-ratelimit-headers': ["Menurut draf header RateLimit IETF dan RFC 9111, bagaimana klien menyikapi header `RateLimit` pada respons dari cache perantara (`Age > 0`)?", ["Menggandakan sisa kuota", "Mengabaikan header `RateLimit` pada respons cache", "Memaksa retry dengan `Retry-After: 0`", "Menyimpannya di localStorage selamanya"], "Header cached mencatat kondisi origin saat disimpan, bukan sisa kuota aktif, jadi klien mengabaikannya ketika `Age > 0`."],
      'distinguishes-rate-limiting-429': ["Apa beda rate limiting (`429`) dan load shedding (`503`)?", ["429 menegakkan kuota per klien, sedangkan 503 membuang kelebihan trafik total demi menjaga kesehatan server", "429 khusus TCP, 503 khusus UDP", "503 hanya berjalan di CDN", "429 otomatis di-retry browser"], "Rate limiting mengisolasi penyewa yang berisik. Load shedding menjaga kesehatan server secara menyeluruh saat kapasitas total penuh."]
    }
  },

  storage: {
    splits: ['Mini LSM-Tree (MemTable + WAL)', 'Database Selection Matrix'],
    terms: [
      ['Mesin penyimpan B-Tree', 'Halaman berukuran tetap (misalnya 8 KB di Postgres dan SQL Server) yang diperbarui di tempat. Cepat untuk baca dan rentang, dengan page split pada tulis acak.'],
      ['LSM-Tree (Log-Structured Merge)', 'Menulis berurutan ke WAL serta MemTable terurut di RAM, lalu mem-flush SSTable imutabel ke disk. Cepat saat tulis, sementara bacaan memeriksa MemTable plus Bloom filter dan SSTable.'],
      ['Write vs Read amplification', 'Write amplification menghitung byte yang ditulis ke disk per tulis logis (seperti kompaksi LSM). Read amplification menghitung berapa pencarian file yang dibutuhkan tiap pembacaan antar level SSTable.']
    ],
    title: 'Mesin penyimpanan dan pemilihan database: B-Tree vs LSM-Tree',
    why: "Kekuatan database berakar dari mesin disk-nya. PostgreSQL unggul untuk transaksi campuran sedangkan Cassandra menyerap aliran tulis masif karena B-Tree mengubah halaman di tempat, sementara LSM-Tree menumpuk SSTable imutabel.",
    points: [
      "Mesin B-Tree (PostgreSQL, SQL Server, MySQL InnoDB) memberi pembacaan titik stabil dan scan rentang terurut lewat satu lintasan pohon. Tulis acak berat membayar biaya I/O acak dan pemecahan halaman.",
      "Mesin LSM-Tree (RocksDB, Cassandra, ScyllaDB, Pebble) mengubah tulis acak menjadi append berurutan ke WAL dan MemTable. Mesin mem-flush SSTable imutabel yang nanti dikompaksi di latar belakang.",
      "Karena bacaan LSM memeriksa MemTable beserta beberapa level SSTable, tiap SSTable membawa Bloom filter untuk melewati file yang pasti tidak punya kunci tersebut.",
      "Pilih data store berdasar pola akses: OLTP relasional untuk join ACID, MongoDB untuk dokumen, atau Redis dan DynamoDB demi kecepatan kunci. Pakai ClickHouse untuk analitik dan S3 untuk media.",
      "Keluarkan biner besar seperti gambar dan PDF dari tabel SQL. Simpan metadata serta URI di SQL, lalu alirkan file langsung ke object storage seperti S3 atau MinIO."
    ],
    practice: "Telusuri `Put(\"user:1\", \"<TOMBSTONE>\")` di demo LSM Go. Menghapus kunci *menambah* data sementara hingga kompaksi menggabung SSTable, berbeda dari menghapus baris pada halaman B-Tree 8 KB.",
    teach: "Bandingkan mesin penyimpanan B-Tree dan LSM-Tree pada perilaku tulis, langkah baca, dan overhead kompaksi atau vacuum.",
    analogy: "B-Tree itu lemari arsip abjad di mana map baru memaksa menggeser laci. LSM-Tree menaruh catatan langsung ke buku tulis secara berurutan lalu menyusun arsipnya malam hari saat kompaksi.",
    pitfalls: [
      "Mengira NoSQL meniadakan kerja skema. Dokumen bebas memindahkan pengecekan skema dan migrasi ke dalam kode aplikasimu.",
      "Membiarkan kompaksi LSM latar menghabiskan IOPS NVMe pada trafik jam kerja hingga tail latency baca melonjak.",
      "Memilih NoSQL terdistribusi di hari pertama padahal join ACID dan 5.000 RPS berjalan lancar di satu node PostgreSQL atau SQL Server."
    ],
    quiz: {
      'lsm-tree-handle-heavier': ["Mengapa LSM-Tree menahan beban tulis berkelanjutan jauh lebih besar dibanding B-Tree tradisional?", ["Ia meninggalkan WAL dan mengorbankan durabilitas", "Tulis masuk berurutan ke WAL dan MemTable, menghindari pemecahan halaman 8 KB acak di tempat", "Semua tabel disimpan di CSS", "Ia tidak pernah mengurutkan key"], "Append WAL berurutan plus flush MemTable menghindari I/O read-modify-write acak pada halaman B-Tree."],
      'lsm-tree-delete-record': ["Bagaimana LSM-Tree menghapus baris pada SSTable imutabel?", ["Menimpa byte di tempat dengan angka nol", "Menambahkan penanda tombstone agar versi lama dibuang saat kompaksi", "Membangun ulang database secara sinkron", "Memakai trigger SQL"], "SSTable tidak berubah di disk. Operasi hapus menambah tombstone yang menutupi entri lama sampai kompaksi berjalan."],
      'mb-user-uploaded-kyc': ["Di mana PDF KYC 2 MB unggahan pengguna harus disimpan dalam sistem pesanan atau pinjaman?", ["Di dalam kolom PostgreSQL BYTEA atau SQL Server VARBINARY(MAX)", "Di-encode Base64 di string Redis", "Di object storage S3 atau MinIO dengan presigned URL berbatas waktu dan metadata SQL", "Di dalam cookie browser"], "Object storage menangani biner besar dengan biaya murah lewat unggah langsung, menjaga backup SQL dan buffer pool RAM tetap ramping."]
    }
  },

  'search-geo': {
    splits: ['Inverted Index + BM25', 'Geohash Proximity Encoding'],
    terms: [
      ['Inverted index', 'Memetakan token ter-normalisasi (`"coffee"`) ke daftar posting ID dokumen. Elasticsearch dan OpenSearch memakainya agar pencarian teks menghindari table scan.'],
      ['Okapi BM25', 'Rumus peringkat relevansi yang menggabungkan kejenuhan frekuensi kata (`k1`), kelangkaan kata di seluruh korpus (`IDF`), dan normalisasi panjang field (`b`).'],
      ['Geohash & Uber H3', 'Grid spasial yang mengubah `(lat, lon)` menjadi awalan string terurut (persegi Geohash) atau ID sel heksagon 64-bit (`H3` berjarak seragam).']
    ],
    title: 'Mesin pencari dan indeks spasial: inverted index, BM25, dan H3',
    why: "Indeks B-Tree relasional kedodoran pada dua fitur umum: pencarian substring berperingkat (`LIKE '%espresso%'`) dan kueri radius cepat (`pengemudi dalam radius 2 km`). Keduanya butuh tata letak indeks khusus.",
    points: [
      "B-Tree mengindeks awalan dari kiri ke kanan, sehingga `LIKE '%term%'` memindai seluruh tabel. Elasticsearch dan OpenSearch memecah teks menjadi inverted index (`term -> [docIDs]`).",
      "BM25 mengungguli TF-IDF lewat efek jenuh pengulangan kata (`k1`) dan normalisasi panjang (`b`) supaya deskripsi panjang penuh kata kunci tidak mengalahkan judul singkat.",
      "Perlakukan mesin pencari sebagai indeks baca sekunder, bukan penyimpan utama. Sinkronkan pembaruan SQL lewat stream Outbox atau CDC lalu terapkan toleransi typo serta sinonim saat kueri.",
      "Indeks B-Tree terpisah di `(lat)` dan `(lon)` memindai kotak terlalu besar untuk kueri radius. Petakan ruang 2D ke sel 1D memakai Geohash, Quadtree, PostGIS R-Tree (GiST), atau Uber H3.",
      "Waspadai sambungan tepi Geohash karena titik berdekatan di seberang garis grid bisa punya nol karakter awalan yang sama. Periksa sel target ditambah 8 tetangganya, atau gunakan heksagon Uber H3 yang keenam tetangganya berjarak seragam."
    ],
    practice: "Jalankan `go run .` dan lihat mengapa dokumen `3` (`\"keyboard keycaps\"`) mengungguli dokumen `2` di BM25 walau sama-sama memuat `'keyboard'` sekali. Bandingkan `(-0.001, 0.001)` dan `(0.001, -0.001)` di dekat `(0, 0)` untuk mengamati batas awalan Geohash.",
    teach: "Jelaskan mengapa Elasticsearch paling tepat menjadi indeks sekunder tersinkron dari SQL, bukan penyimpan utama. Jelaskan mengapa heksagon Uber H3 mengungguli grid persegi untuk heatmap radius.",
    analogy: "Inverted index bekerja layaknya daftar indeks di belakang buku yang mencatat nomor halaman tiap topik agar kamu tidak membaca per halaman. Petak heksagon H3 mirip sarang lebah di mana setiap tetangga berjarak pusat sama persis.",
    pitfalls: [
      "Menjadikan Elasticsearch sumber data utama tanpa cadangan persisten, memicu hilangnya pembaruan saat reindex atau jeda refresh.",
      "Memakai `WHERE geohash LIKE prefix%` tanpa mengecek 8 sel sekitar, melewatkan titik dekat yang terpisah garis grid.",
      "Mengunci resolusi spasial kelewat rapat saat jumlah driver berfluktuasi. Uber H3 memudahkan penggabungan ke induk lewat `cellToParent` saat area sepi."
    ],
    quiz: {
      'bm25-match-inside-word': ["Di BM25, mengapa kecocokan di judul 2 kata mendapat skor lebih tinggi dibanding kecocokan di deskripsi 200 kata?", ["Normalisasi panjang field (`b`) memberi nilai lebih tinggi pada field singkat", "Inverted index melewati dokumen panjang", "BM25 mengurutkan sesuai abjad", "IDF menghapus kata yang sering muncul"], "Normalisasi panjang mencegah deskripsi panjang yang ramai mengungguli judul singkat."],
      'geohash-queries-check-target': ["Mengapa kueri Geohash memeriksa sel target sekaligus 8 sel tetangganya?", ["Agar terurut sesuai abjad", "Koordinat berdekatan di seberang garis batas grid dapat memiliki nol karakter awalan Geohash yang sama", "Geohash hanya mengkodekan garis lintang", "SQL LIKE mewajibkan 9 pola"], "Dua titik berjarak 10 meter melintasi garis ekuator atau meridian utama mempunyai awalan yang sama sekali berbeda."],
      'geometric-advantage-made-uber': ["Keunggulan geometri apa yang membuat Uber memilih bentuk heksagon untuk H3 dibanding persegi atau segitiga?", ["Heksagon butuh bit separuh lebih sedikit", "Keenam tetangga berjarak sama persis dari pusat sel tanpa distorsi diagonal", "Persegi tidak bisa menutupi permukaan bola", "PostGIS hanya mendukung heksagon"], "Grid persegi memiliki tetangga tepi dekat (`1×`) dan sudut jauh (`√2×`), sedangkan heksagon menyamakan jarak setiap langkah."]
    }
  },

  'db-scaling': {
    splits: ['PgBouncer Transaction Pool', 'Declarative Partitioning', 'Shard Key & Resharding'],
    terms: [
      ['PgBouncer Transaction Mode', 'Mengembalikan koneksi backend DB ke pool tiap selesai `COMMIT` atau `ROLLBACK`. Ribuan socket aplikasi yang menganggur bisa berbagi puluhan backend Postgres.'],
      ['Replication lag (`LSN`)', 'Jeda waktu antara commit di primer sampai replika baca memutar catatan WAL-nya. Membawa commit LSN memungkinkan bacaan penting menunggu atau dialihkan ke primer demi read-your-own-writes.'],
      ['Partitioning vs Sharding', 'Partitioning membagi satu tabel menjadi tabel anak fisik di satu host DB demi pruning kueri dan penghapusan `DROP TABLE` instan. Sharding menyebar data lintas server DB terpisah.']
    ],
    title: 'Scaling database: pooling, replika, partisi, dan sharding',
    why: "Membuka 5.000 koneksi Postgres untuk 500 pod menguras scheduler OS dan memakan gigabyte RAM. Scale SQL bertahap: rapikan indeks dan transaction pool dulu, lalu alihkan bacaan ke replika. Partisi tabel di satu host sebelum membagi shard lintas node.",
    points: [
      "Setiap backend PostgreSQL mengalokasikan memori lokal dan berebut snapshot. Membatasi koneksi langsung di kisaran 100 sampai 300 di balik PgBouncer (`pool_mode = transaction`) atau RDS Proxy sering menggandakan throughput.",
      "Pada Transaction Mode, hindari state level sesi (`SET TIME ZONE`, `PREPARE`, `LISTEN`, session advisory lock) kecuali kamu mengonfigurasi `max_prepared_statements` di PgBouncer.",
      "Replika asinkron tertinggal saat trafik tulis tinggi. Lindungi read-your-own-writes pasca checkout atau edit profil memakai cookie commit LSN atau mengarahkan bacaan pengguna ke primer beberapa detik.",
      "Partisi rentang deklaratif PostgreSQL (`PARTITION BY RANGE (created_at)`) memangkas pemindaian ke satu tabel bulanan dan mengganti vacuum `DELETE` berjam-jam menjadi `DROP TABLE` seketika.",
      "Pilih shard key ber-kardinalitas tinggi (`tenant_id` atau `user_id`) yang cocok dengan pola kueri utama. Kueri tanpa shard key memicu scan scatter-gather ke setiap shard.",
      "Join lintas shard dan `AUTO_INCREMENT` gagal pada shard terpisah. Buat ID 64-bit terurut waktu (Snowflake atau UUIDv7) lalu siapkan tampilan lintas shard di read model."
    ],
    predict: {
      prompt: "Skala API dinaikkan dari `20` ke `400` pod (`25` koneksi per pod = `10.000` koneksi) menuju satu primer PostgreSQL (`max_connections = 5000`, `16 vCPU`). CPU berada di 60%, namun `p99` melompat 10× dan pod baru gagal konek. Apa solusi akar masalahnya?",
      options: [
        "Naikkan `max_connections = 20000` pada PostgreSQL",
        "Pasang PgBouncer mode `transaction` di depan PostgreSQL dan jaga backend aktif sekitar 50–150",
        "Hapus seluruh foreign key dan indeks sekunder",
        "Shard tabel `users` ke 16 server PostgreSQL sekaligus"
      ],
      explain: "PostgreSQL membuang CPU untuk context switch dan rebutan snapshot lock ketika ribuan koneksi terbuka serentak. Transaction pooling memultipleks 10.000 socket aplikasi lewat ~100 backend, memberi ruang skala besar sebelum sharding diperlukan."
    },
    practice: "Buka `VIZ.sysdbscale`, naikkan tulis vs baca untuk memantau pertumbuhan lag replika, lalu bandingkan Transaction Pooling vs Koneksi Langsung. Di bagian 3, jelaskan mengapa `tenant_id` diletakkan pertama di `(tenant_id, order_id)`.",
    teach: "Uraikan empat tahap scaling sebelum men-shard Postgres: indeks, PgBouncer transaction mode, replika baca dengan cek LSN, dan partisi. Sebutkan kapan sharding menjadi keharusan.",
    analogy: "Koneksi langsung memberi satu koki pribadi per tamu meski tamu baru membaca menu. Transaction pooling membuat 500 tamu berbagi 20 koki yang memasak satu hidangan lalu mundur kembali ke pool.",
    pitfalls: [
      "Memakai perintah sesi (`SET search_path`, tabel temporer, atau `pg_advisory_lock`) di mode `transaction` PgBouncer sehingga tenant berikutnya mewarisi state sesi lama.",
      "Men-shard berdasar `created_at` atau `order_id`, mengirim 100% insert baru ke satu shard paling kanan.",
      "Menjalankan `DELETE FROM events WHERE created_at < ...` atas jutaan baris, memicu pembengkakan vacuum dan risiko XID wraparound ketika membuang partisi selesai dalam milidetik."
    ],
    quiz: {
      'partition-range-created-require': ["Mengapa `PARTITION BY RANGE (created_at)` mewajibkan `created_at` ada di setiap `PRIMARY KEY` dan `UNIQUE` PostgreSQL?", ["Agar pengurutan string lebih cepat", "PostgreSQL menegakkan keunikan per indeks partisi kecuali kolom pemecah masuk di dalam unique key", "B-Tree hanya mengindeks timestamp", "Syarat wajib PgBouncer"], "Tanpa mengecek seluruh partisi anak tiap insert, keunikan lokal baru berlaku global saat kolom partisi masuk di dalam key."],
      'post-write-read-avoid': ["Bagaimana bacaan setelah menulis menghindari data usang dari replika asinkron?", ["Matikan WAL di primer", "Arahkan bacaan pengguna itu ke primer atau tunggu `pg_last_wal_replay_lsn() >= commit_lsn`", "Pasang `LIMIT 1`", "Jalankan `VACUUM FULL`"], "Mengecek commit LSN primer atau pinning singkat ke primer memberi read-your-own-writes monoton tanpa menghalangi pembaca lain."],
      'choice-creates-write-hotspot': ["Pilihan mana yang menciptakan write hotspot di database ter-shard?", ["Memakai UUIDv7 dalam hash sharding `(tenant_id, id)`", "Melakukan range-sharding tabel append-only berdasar `created_at`", "Membagi awal menjadi 256 virtual shard", "Menyandingkan `orders` dan `order_items` pada `tenant_id`"], "Seluruh timestamp kini mendarat di satu shard rentang paling kanan selagi shard lama menganggur."]
    }
  },

  hashing: {
    splits: ['Modulo Remapping Collapse', 'Hash Ring + Virtual Nodes', 'Bounded-Load Balancing'],
    terms: [
      ['Cincin consistent hashing', 'Menaruh node dan key di satu ruang hash melingkar `[0, 2^32)` atau `2^64`. Setiap key jatuh ke node searah jarum jam berikutnya, jadi tambah atau hapus 1 node memindah ~`1/N` key.'],
      ['Virtual nodes (`vnodes`)', 'Beberapa titik cincin (`nodeA#0`, `nodeA#1`) per server. Memakai 100 hingga 200 vnodes menekan ketimpangan distribusi di bawah ±5% dan meratakan beban failover ke survivor.'],
      ['Bounded-load hashing', 'Membatasi beban tiap node pada `ceil(avgLoad * (1 + ε))` (misalnya `c = 1.25`) dan menggeser ke node searah jarum jam berikutnya bila penuh, meredam overload hot key.']
    ],
    title: 'Consistent hashing, virtual nodes, dan bounded-load balancing',
    why: "Shard Redis terpartisi dan cache Layer-7 stateful kehilangan hit rate bila scaling mengosongkan semua key. Consistent hashing dengan virtual nodes menjaga cache hangat saat topologi berubah, sedangkan bounded load melindungi host dari hot key viral.",
    points: [
      "Hashing modulo (`hash(k) % N`) pecah saat cluster berganti ukuran: mengubah `N` dari `4` ke `5` merutekan ulang ~80% (`4/5`) key seketika.",
      "Pada cincin consistent hash berisi `N` node, menambah atau melepas satu node cuma memindahkan ~`1/N` key (antara node itu dan tetangganya berlawanan arah jarum jam).",
      "Satu titik per server menciptakan busur timpang. Memberi tiap host 100 hingga 200 virtual nodes meratakan distribusi dan membuat server bermemori `2×` bisa menampung `2×` vnode.",
      "Binary search (`slices.BinarySearchFunc`) atas slice terurut uint32/uint64 menuntaskan lookup dalam hitungan mikrodetik `O(log(N * V))` tanpa alokasi tambahan.",
      "Consistent hashing biasa tetap membebani satu node untuk satu key viral. Bounded-load hashing (`cap = ceil(loadRatio * c)`, `c ≈ 1.25`, dipakai HAProxy dan Maglev) melimpahkan trafik berlebih ke node berikutnya.",
      "Ketika `N` kurang dari 100 backend, Rendezvous (Highest Random Weight) hashing memilih `argmax node hash(key, node)` dengan perpindahan minimal `1/N` tanpa state cincin."
    ],
    predict: {
      prompt: "Cluster cache 4 node merutekan key lewat `fnv32(key) % N`. Di puncak trafik, kamu menambah Node ke-4 (`N` berubah `4 -> 5`) untuk `10.000` key populer. Kira-kira berapa key yang langsung pindah ke node lain (cache miss)?",
      options: [
        "~2.000 key (20%, sesuai `1/5` total key)",
        "~8.000 key (~80%), memicu badai cache stampede ke DB",
        "Tepat 2.500 key (25%)",
        "0 key sampai TTL lama habis"
      ],
      explain: "Mengganti pembagi dari `4` ke `5` mengubah hasil `h % 4` vs `h % 5` untuk 16 dari 20 angka (`80%`). Cincin consistent hash hanya memindahkan ~`1/5` (`20%`)."
    },
    practice: "Buka `VIZ.syshash`, geser `vnodes/server` dari `1` ke `150`, dan amati sebaran key merata ke semua server. Klik `+ Tambah Node E` (`4 -> 5`) lalu bandingkan angka `Perpindahan Cincin Konsisten` terhadap Modulo Naif.",
    teach: "Jelaskan mengapa menambah virtual nodes memperbaiki pemerataan kunci di kondisi normal sekaligus pemulihan saat satu server cache jatuh.",
    analogy: "Menaruh 4 orang satu kali di keliling jam menyisakan potongan yang timpang. Memberi tiap orang 150 kursi acak membuat semua orang menangkap sekitar 25% lemparan dart.",
    pitfalls: [
      "Lupa membungkus wrap-around binary search (`idx == len(vnodes) -> 0`), membuat lookup di atas vnode terakhir panic atau gagal.",
      "Memilih `1` atau `2` vnode pada cluster kecil hingga satu host memegang 60% key sementara host lain kosong.",
      "Mengira consistent hashing sendirian mengatasi hot key. Satu key viral tetap mengarah ke satu replika kecuali dipasangi cache L1 atau bounded load."
    ],
    quiz: {
      'dynamodb-cassandra-redis-proxies': ["Mengapa DynamoDB, Cassandra, dan proxy Redis memberi 100 hingga 200 virtual nodes per mesin fisik?", ["Untuk melipatgandakan kapasitas RAM", "Mengurangi ketimpangan partisi dan menyebar beban failover ke seluruh mesin yang bertahan", "Menghindari hashing key", "Menjamin linearizability kuat"], "Banyaknya vnode menyamakan ukuran busur acak dan mencegah tetangga searah jarum jam memikul 100% beban node mati."],
      'bounded-loads-capacity-factor': ["Apa yang diubah `bounded loads` (faktor kapasitas `c ≈ 1.25`) saat terjadi lonjakan hot key?", ["Mematikan virtual nodes", "Melimpahkan kelebihan request di atas `cap` ke server fisik berbeda berikutnya searah jarum jam", "Menghapus cold key selamanya", "Memaksa retry TCP"], "Bounded-load hashing membatasi tiap host di dekat `1.25×` rata-rata sambil menjaga lokalitas saat beban normal."],
      '10-node-consistent-hash': ["Dalam cincin consistent hash 10 node ber-vnode seimbang, sekitar berapa persen key pindah bila 1 node baru bergabung?", ["~90%", "~50%", "~9–10% (`1 / 11`)", "0%"], "Hanya key di dalam segmen yang diambil alih node ke-11 yang berpindah (`1 / (N + 1)`)."]
    }
  },

  messaging: {
    splits: ['Transactional Outbox', 'Relay & SKIP LOCKED', 'Idempotent Consumer & DLQ'],
    terms: [
      ['Masalah Dual-write', 'Menulis ke PostgreSQL lalu mengirim ke Kafka atau RabbitMQ terpisah dalam satu request. Crash atau timeout di antara kedua panggilan membuat ledger dan event tidak sinkron.'],
      ['Transactional Outbox + CDC', 'Menyisipkan baris domain serta baris `outbox_events` dalam satu transaksi SQL. Worker `SKIP LOCKED` atau Debezium WAL CDC mengirim baris ke broker.'],
      ['Dead-Letter Queue (DLQ)', 'Antrean samping yang menampung pesan beracun yang berulang kali gagal parsing atau retry sehingga partisi sehat terus melaju saat tim memeriksa kerusakannya.']
    ],
    title: 'Pesan asinkron, transactional outbox, CDC, dan DLQ',
    why: "Layanan bisa crash persis di antara `COMMIT` SQL dan `Publish()` broker. Transactional Outbox bersama konsumen idempoten mengubah dual-write berisiko menjadi pengiriman at-least-once tanpa two-phase commit terdistribusi.",
    points: [
      "Hindari dual write (`db.Commit()` lalu `kafka.Produce()`) pada alur uang atau pesanan. OOM kill atau timeout jaringan di antara keduanya menghilangkan event hilir selamanya.",
      "Simpan tabel domain dan `outbox_events` dalam satu transaksi ACID. Kirim baris lewat worker poller (`FOR UPDATE SKIP LOCKED`) atau Change Data Capture (Debezium) membaca Write-Ahead Log tanpa beban query berat.",
      "Broker seperti Kafka, RabbitMQ, dan SQS memberi pengiriman at-least-once sehingga duplikat muncul saat retry dan rebalance. Catat `event_id` di tabel dedup (`processed_events`) atau lakukan upsert idempoten.",
      "Pilih broker sesuai beban kerja: Kafka menjaga log partisi terurut bagi banyak tim (`consumer_group`). RabbitMQ dan SQS pas untuk antrean tugas ber-ACK dan delay.",
      "Lindungi worker hilir dari penumpukan memakai batas prefetch, topik retry backoff, dan Dead-Letter Queue (DLQ) berbatas `max_attempts`.",
      "Kirim payload JSON rusak ke DLQ sesudah batas retry agar satu pesan cacat tidak menghentikan satu partisi Kafka penuh."
    ],
    practice: "Buka `VIZ.sysqueue`, pindah ke mode `Dual-Write (rapuh)`, lalu picu gangguan broker supaya DB dan Antrean terpisah. Setelah itu, ganti ke `Transactional Outbox (atomik)` dan pulihkan, lalu kirim pesan beracun hingga masuk ke `DLQ`.",
    teach: "Jelaskan mengapa `FOR UPDATE SKIP LOCKED` membiarkan beberapa worker outbox polling bersamaan tanpa saling mengunci. Bandingkan Outbox Poller dengan Debezium WAL CDC saat trafik tulis padat.",
    analogy: "Outbox menulis salinan surat keluar di dalam buku akuntansi tersegel sebelum menutup halaman. Kurir membaca buku itu begitu kantor pos buka kembali sehingga tak ada surat hilang ketika mobil pos mogok.",
    pitfalls: [
      "Mengirim event Kafka tepat sesudah `COMMIT` tanpa outbox. Crash proses atau timeout membuang email hilir, stok, dan analitik.",
      "Mengira konsumen at-least-once aman tanpa deduplikasi. Retry dan rebalance tetap mengirim ulang batch kecuali efek samping di-commit atomik bersama `processed_events`.",
      "Mengulang pesan rusak terus-menerus di kepala partisi terurut padahal memindahkannya ke DLQ langsung melancarkan event sehat."
    ],
    quiz: {
      'update-skip-locked-matter': ["Mengapa `FOR UPDATE SKIP LOCKED` penting saat banyak worker relai membaca `outbox_events`?", ["Ia menghapus duplikat otomatis", "Tiap worker relai mengklaim baris tak terkunci secara terpisah tanpa menunggu transaksi worker lain", "Ia melewati WAL PostgreSQL", "Ia mengubah Kafka jadi RabbitMQ"], "`SKIP LOCKED` membagikan batch terpisah ke worker relai paralel tanpa antre row lock."],
      'advantage-debezium-cdc-offer': ["Apa keunggulan Debezium CDC dibanding SQL polling pada `outbox_events` di 20.000 event/detik?", ["Menghapus perlunya transaksi DB primer", "Mengalirkan perubahan langsung dari Write-Ahead Log Postgres tanpa beban polling `SELECT ... UPDATE` berulang", "Menjamin nol bacaan duplikat tanpa dedup", "Menggantikan semua endpoint HTTP"], "CDC berbasis WAL menghindari query polling di halaman indeks saat QPS tulis tinggi sembari menjaga latency sub-detik."],
      'consumer-receives-event-id': ["Saat konsumen menerima `event_id` yang sudah ada di dalam `processed_events`, apa langkahnya?", ["Crash dan kirim pager alert", "Lewati efek samping bisnis lalu kirim ACK (commit offset)", "Masukkan baris kedua ke `dead_letter_events`", "Restart Kafka"], "Event sudah ter-commit sebelumnya, jadi melewati kerja dan meng-commit offset menjaga pengiriman at-least-once tetap idempoten."]
    }
  },

  resilience: {
    splits: ['Exponential Backoff + Full Jitter', 'Circuit Breaker (Closed/Open/Half-Open)', 'Semaphore Bulkhead + Timeout'],
    terms: [
      ['Full Jitter backoff', 'Rumus AWS Builders Library `sleep = rand[0, min(cap, base * 2^attempt)]`. Mengacak waktu jeda retry agar layanan yang baru pulih tidak langsung dihantam gelombang serentak.'],
      ['Circuit Breaker', 'Mesin state (`Closed -> Open -> Half-Open`) yang gagal cepat saat error melewati ambang batas, melindungi server hilir dan melepas thread pemanggil.'],
      ['Pola Bulkhead', 'Semafor berbatas atau pool worker terpisah per dependensi supaya satu gateway SMS pihak ketiga yang lambat tidak menghabiskan slot milik jalur checkout.']
    ],
    title: 'Ketahanan sistem: timeout, jittered backoff, circuit breaker, dan bulkhead',
    why: "Loop retry tanpa timeout, jitter, atau circuit breaker memperburuk perlambatan kecil menjadi badai retry berjam-jam. Klien keluar di produksi wajib punya timeout berbatas, backoff ber-jitter dengan anggaran retry, circuit breaker, dan sekat bulkhead.",
    points: [
      "Teruskan batas waktu ujung-ke-ujung dengan `context.WithTimeout` dan anggaran tiap hop. Tanpa timeout, downstream lambat mengikat pool pemanggil sampai layanan hulu ikut tumbang.",
      "Hindari jeda tetap atau `2^attempt` murni di armada server. Pod yang gagal serempak di `t = 0` bangun bersama di `1s`, `2s`, dan `4s`, sedangkan Full Jitter menyebar waktu tunggu di `[0, window]`.",
      "Pasang anggaran retry (misalnya maksimal 20% RPS tambahan di atas baseline). Ketika 90% panggilan sudah gagal, mengulang `3×` per request membanjiri sistem 4× lipat saat kapasitas terlemah.",
      "Pasang Circuit Breaker: `Closed` berpindah ke `Open` (gagal cepat dalam `0 ms`) selama periode cooldown. Sesudahnya, `Half-Open` menguji probe canary sebelum menutup lagi.",
      "Pisahkan upstream lambat memakai bulkhead berupa semafor berbatas atau pool HTTP terpisah agar kemacetan `/pdf-export` tak mengganggu `/checkout`.",
      "Ulangi hanya operasi idempoten (`GET`, `HEAD`, `PUT`, `DELETE`, atau `POST` bersama `Idempotency-Key`) supaya timeout jaringan tak menimbulkan tagihan ganda."
    ],
    predict: {
      prompt: "Payment gateway tumbang selama `3` detik selagi `1.000` request API berjalan. Setiap pemanggil mengulang hingga `5` kali memakai backoff deterministik (`1s`, `2s`, `4s`, `8s`, `16s`). Apa yang terjadi saat gateway menyala lagi pada `t = 3.1d`?",
      options: [
        "Trafik pulih lancar pada QPS normal",
        "Gelombang retry serentak (`1.000+` panggilan bangun di ketukan tepat `1s/2s/4s`) merobohkan ulang gateway yang baru pulih (badai retry)",
        "Circuit breaker otomatis menaikkan CPU gateway",
        "Go membuang retry otomatis di dalam TCP"
      ],
      explain: "Backoff deterministik menyatukan ribuan pemanggil ke detik bangun yang sama persis dan melipatgandakan beban (`5×`). Full Jitter, anggaran retry, dan circuit breaker memutus gelombang serentak."
    },
    practice: "Buka `VIZ.sysresilience`, setel kesehatan downstream ke `Putus Total (100% gagal)`, lalu klik `Burst ×6` untuk memicu `OPEN`. Klik `Majukan Cooldown (+5d)` dua kali menuju `HALF_OPEN` dan bandingkan sebaran `Tanpa Jitter` vs `Full Jitter`.",
    teach: "Jelaskan mengapa mengulang tiap hop RPC pada pohon panggilan 4 lapis (`A -> B -> C -> D`, masing-masing retry `3×`) mengubah gangguan kecil menjadi trafik `81×`. Sebutkan di mana kebijakan retry harus dipasang.",
    analogy: "Kapal selam memisahkan kompartemen lambung dengan sekat kedap air agar kebocoran di satu ruang tidak menenggelamkan kapal. Circuit breaker memutus arus sebelum kabel panas membakar seisi gedung.",
    pitfalls: [
      "Memasang retry di setiap hop microservice (`3 × 3 × 3 × 3 = 81×` amplifikasi request) padahal satu kali retry di tepi dengan anggaran batas waktu jauh lebih terkendali.",
      "Mengulang error validasi HTTP `400 Bad Request` atau `401 Unauthorized`. Retry backoff hanya berguna bagi gangguan jaringan sementara, `429`, atau `503`.",
      "Memakai satu `http.Client` global tanpa timeout untuk jalur checkout penting sekaligus pengiriman webhook yang lambat."
    ],
    quiz: {
      'aws-builders-library-recommend': ["Mengapa AWS Builders Library menyarankan Full Jitter dibanding exponential backoff deterministik?", ["Ia menggandakan throughput maksimum", "Ia menyebar waktu tunggu retry merata di `[0, cap]`, memutus lonjakan gelombang serempak", "Menghapus kebutuhan timeout", "Mengubah 503 menjadi 200"], "Tanpa faktor acak, klien yang gagal bersamaan akan bangun bersamaan dalam gelombang serentak."],
      'state-circuit-breaker-closed': ["Di Circuit Breaker 3-state (`Closed`, `Open`, `Half-Open`), apa yang berlangsung saat `Half-Open`?", ["Semua request melewati timeout", "Permintaan uji terbatas dijalankan untuk mengetes apakah dependensi pulih sebelum pindah ke `Closed`", "Semua error diabaikan permanen", "Metrik dibuang ke disk"], "Half-Open melepas trafik uji kecil. Sukses menutup breaker lagi, sementara gagal langsung mengulang timer cooldown."],
      'pattern-stops-slow-third': ["Pola apa yang menghentikan endpoint webhook pihak ketiga lambat menghabiskan seluruh thread API untuk `/login`?", ["Write-Back Cache", "Bulkhead (pool worker atau semafor konkurensi terpisah per dependensi)", "Geohashing", "Consistent Hashing"], "Memisahkan anggaran konkurensi per dependensi mencegah satu upstream macet menghabiskan jalur request sehat."]
    }
  },

  consistency: {
    splits: ['Quorum Overlap (W + R > N)', 'Idempotency-Key Middleware', 'Kleppmann Fencing Token'],
    terms: [
      ['Quorum (`W + R > N`)', 'Dari `N` replika, tulis butuh ack `W` replika dan baca mengecek `R` replika hingga `W + R > N`. Irisan ini menjamin satu replika memegang `ver` terbaru.'],
      ['Header Idempotency-Key', 'Header draf IETF berisi ID buatan klien agar retry write mengembalikan hasil awal tersimpan (`409` atau `422` bila payload berbeda) tanpa menagih dua kali.'],
      ['Fencing Token', 'Angka urut menaik dari pemberi lease (`token=34`). Storage menolak tulis pembawa token lama (`33 <= 34`), mencegah split-brain pasca jeda GC.']
    ],
    title: 'Konsistensi terdistribusi: quorum, idempotency, saga, dan fencing token',
    why: "Di sistem penyimpanan terdistribusi, lease habis saat jeda GC, jaringan terpartisi, dan klien seluler mengirim ulang request timeout. Irisan quorum, kunci idempoten, saga, dan fencing token monoton menutup celah kebenaran ini.",
    points: [
      "Terapkan quorum gaya Dynamo: dengan `N = 3`, setelan `(W=2, R=2)` menjamin irisan baca-setelah-tulis (`2 + 2 > 3`) dan tetap hidup meski `1` replika mati saat baca maupun tulis.",
      "Nomor versi atau Lamport timestamp menyelesaikan perbedaan antar replika. `Get()` mengecek `R` node, mengambil `version` tertinggi, lalu menjalankan read repair ke node yang tertinggal.",
      "Ikuti PACELC: saat partisi (`P`), pilih ketersediaan (`A`, Dynamo) atau konsistensi (`C`, Spanner/Raft). Di kondisi sehat (`E`), seimbangkan latency (`L`) dan konsistensi (`C`).",
      "Untuk write HTTP, simpan `(idempotency_key, payload_sha256, status, response_body)` dalam transaksi DB domain yang sama. Tolak payload berubah dengan `422` dan duplikat berjalan dengan `409`.",
      "Gantikan two-phase commit (`2PC`) antar microservice memakai Saga. Pakai event choreography untuk alur 2–4 langkah, dan orchestration saat butuh rollback eksplisit seperti `RefundPayment` dan `ReleaseStock`.",
      "Jangan bergantung pada timer lease di sisi klien saja (peringatan Martin Kleppmann). Worker yang membeku di pause GC melebihi TTL bisa menimpa data baru kecuali storage memeriksa Fencing Token monoton."
    ],
    predict: {
      prompt: "Worker A memegang lock Redis (`TTL = 5d`, `fencing_token = 10`) lalu membeku `8d` saat GC. Pada `t = 5.1d`, Redis melepas lock A dan memberi Worker B `fencing_token = 11` yang menulis `v2`. Pada `t = 8d`, Worker A bangun dan mengirim `v1` lama. Apa yang menghentikan Worker A?",
      options: [
        "Mengharuskan Worker A mengecek `TTL` Redis sebelum menulis",
        "Mengharuskan storage menolak tulis apa pun dengan `fencing_token <= lastSeenToken` (`10 <= 11` -> ditolak)",
        "Memperpanjang lease Worker A ke 30 detik",
        "Mematikan jeda GC lintas jaringan"
      ],
      explain: "Martin Kleppmann membuktikan cek masa lock sebelum I/O menyisakan jendela balap antara pengecekan dan tulis disk. Hanya penolakan token tak-monoton di sisi storage yang menghentikan penulis zombie secara atomik."
    },
    practice: "Jalankan `go run .`, lalu ganti slice `Get` Quorum menjadi `[]int{2}` (`R=1` di mana `W+R = 3 <= N`) untuk melihat `ver=1 ($100)` usang lolos. Rancang Saga checkout 3 langkah (`ReserveStock -> ChargeCard -> ConfirmOrder`) beserta aksi kompensasinya.",
    teach: "Bandingkan Saga Orchestration dengan Choreography. Jelaskan bukti fencing-token Martin Kleppmann yang menunjukkan mengapa lease Redis berbasis waktu tak cukup melindungi penulisan storage.",
    analogy: "Fencing token mirip segel nomor urut resmi di berkas pengadilan. Jika juru tulis lambat mengajukan berkas #10 setelah #11 sudah masuk, meja arsip menolak semua nomor di bawah #11.",
    pitfalls: [
      "Menyetel `W=2, R=1` pada `N=3` sambil mengharapkan bacaan kuat. Karena `2 + 1 <= 3`, pembacaan dapat menyentuh satu replika tertinggal.",
      "Mengabaikan perubahan isi pada retry `Idempotency-Key`. Membalas konfirmasi `$50` lama saat payload diganti menjadi `$500` menyebabkan bug penagihan tersembunyi.",
      "Membangun Saga tanpa aksi rollback idempoten (`Refund` wajib sanggup menangani retry ganda tanpa refund dua kali)."
    ],
    quiz: {
      'replica-cluster-writes-require': ["Di cluster `N = 5` replika di mana tulis mensyaratkan `W = 3` ack, berapa minimum `R` yang menjamin minimal satu replika mutakhir ikut dalam tiap bacaan?", ["R = 1", "R = 2", "R = 3 (`3 + 3 = 6 > 5`)", "R = 5"], "Irisan quorum butuh `W + R > N`. Dengan `N=5` dan `W=3`, minimum `R` adalah `3`."],
      'http-status-idempotent-post': ["Status HTTP apa yang dikirim API `POST /payments` saat klien memakai ulang `Idempotency-Key` lama untuk payload berbeda?", ["200 OK", "422 Unprocessable Content (atau 400/409 konflik payload)", "304 Not Modified", "503 Service Unavailable"], "Memakai ulang kunci dengan parameter berubah menyalahi aturan idempotensi, sehingga API Stripe/IETF membalas `422` atau `409`."],
      'storage-itself-check-monotonic': ["Mengapa storage sendiri wajib memeriksa fencing token monoton?", ["Untuk mengompres JSON", "Karena pemegang lock bisa terjeda saat GC atau jeda jaringan di antara cek masa lock dan tulis storage", "Melewati TLS", "Karena Raft tanpa leader"], "Pengecekan lease di sisi klien punya celah balap sebelum tulis disk, sedangkan cek `token > lastToken` di storage menutup akses penulis usang secara atomik."]
    }
  },

  observability: {
    splits: ['OpenTelemetry Collector', 'SRE Burn-Rate Alert Rule'],
    terms: [
      ['Tiga Pilar + Trace Context', 'Log JSON terstruktur (`trace_id`), metrik `RED` atau `USE`, dan trace terdistribusi yang dirangkai antar hop memakai `traceparent` W3C (`00-<trace-id>-<span-id>-<flags>`).'],
      ['Jebakan kardinalitas tinggi', 'Menaruh ID tak berbatas (`user_id`, `order_id`, URL utuh) sebagai label metrik Prometheus meledakkan memori TSDB. Simpan ID mentah di log dan span trace, pakai pola rute (`/orders/{id}`) di metrik.'],
      ['Multi-Window Multi-Burn-Rate', 'Aturan alert Google SRE yang memeriksa pembakaran budget cepat (`14.4×`) di jendela `1h` maupun `5m`. Gangguan besar langsung membunyikan alarm dan cepat pulih begitu usai.']
    ],
    title: 'Observabilitas: trace OpenTelemetry, RED/USE, dan SLO burn rate',
    why: "Berkata 'CPU masih 40%' melewatkan loop error 500 pada `/checkout`. Paging tiap `99.95%` per `1 menit` mengganggu on-call akibat kedipan singkat, sehingga trace W3C dan alert burn-rate mengikat alarm ke keluhan pengguna.",
    points: [
      "Pakai metrik USE (Utilization, Saturation, Errors) untuk hardware dan pool (CPU, antrean NIC, disk IOPS, tunggu koneksi). Pakai RED (Rate, Errors, Duration histogram) di tiap endpoint layanan.",
      "Agregasikan latency dengan histogram (bucket `le` memakai `histogram_quantile`), jangan rata-ratakan gauge. Nilai `p99` tiap pod tak bisa dirata-rata menjadi `p99` cluster.",
      "Teruskan header W3C `traceparent` dari ingress proxy melewati API, broker, dan span SQL sehingga satu tampilan trace menyatukan log, query lambat, dan timeout.",
      "Lakukan sampling cerdas: simpan 100% error dan ekor lambat (`status >= 500` atau `latency > 500ms`) lewat OTel `tail_sampling`. Ambil sampel 1% hingga 5% dari trafik `200 OK` normal.",
      "Pasang alert burn rate di jendela pendek dan panjang. Misalnya, `14.4×` membakar 2% SLO `99.9%` 30-hari dalam 1 jam (alarm + cek `5m`), sementara kebocoran `1×` membuka tiket jam kerja.",
      "Singkirkan `user_id`, alamat email, dan UUID mentah dari label Prometheus. Pakai template rute (`/v1/orders/{id}`) dan sensor PII di prosesor OpenTelemetry."
    ],
    practice: "Telusuri mengapa alert PromQL memeriksa `[1h]` dan `[5m]`. Hitung berapa lama alarm tetap menyala sesudah gangguan 5 menit berakhir kalau klausa `[5m]` dihapus.",
    teach: "Jelaskan ledakan label ber-kardinalitas tinggi di metrik Prometheus dibanding span trace. Bandingkan dashboard RED dan USE.",
    analogy: "Memantau budget error bulanan lewat burn rate seperti mengawasi kebocoran tangki air. Tetesan kecil cukup dijadwalkan besok, sedangkan hilangnya 2% air bulanan dalam satu jam langsung membunyikan sirene hingga ditambal.",
    pitfalls: [
      "Menaruh `user_id` atau ID mentah pada path URL ke label Prometheus hingga membengkakkan RAM TSDB dengan jutaan time series.",
      "Merata-ratakan nilai `p99` per instance di Grafana sehingga ekor akurasinya hilang. Agregasikan dulu counter bucket histogram mentah (`sum by (le)` lalu `histogram_quantile`).",
      "Menulis log teks polos tanpa W3C `trace_id`, memaksa engineer mencari kecocokan timestamp manual lintas 12 layanan."
    ],
    quiz: {
      'google-sre-combine-1h': ["Mengapa Google SRE memadukan jendela `1h` dan jendela pendek `5m` pada alert fast-burn?", ["Untuk menggandakan beban CPU", "Supaya gangguan yang sudah pulih menutup alert dalam ~5 menit, menghindari pager berbunyi satu jam penuh", "Karena Prometheus tidak menghitung laju 1h", "Untuk menghapus metrik 500"], "Tanpa jendela pendek, laju bergulir `1h` tetap di atas ambang lama setelah perbaikan tayang."],
      'high-cardinality-attributes-like': ["Di mana atribut ber-kardinalitas tinggi seperti `order_id` dan `customer_id` sebaiknya disimpan?", ["Label metrik Prometheus", "Field log terstruktur dan atribut span trace OpenTelemetry", "Kode status HTTP", "Catatan DNS TXT"], "Prometheus mengindeks tiap kombinasi label unik di RAM, sedangkan indeks log dan span trace dirancang menampung kardinalitas tinggi."],
      'standard-http-header-links': ["Header HTTP standar apa yang menyambungkan trace terdistribusi lintas proxy serta layanan Go, C#, atau Node?", ["`X-Custom-Debug`", "`traceparent` (W3C Trace Context)", "`Keep-Alive`", "`ETag`"], "W3C Trace Context (`traceparent`) bekerja lintas Envoy, NGINX, SDK OpenTelemetry, dan gateway cloud."]
    }
  },

  'containers-k8s': {
    splits: ['Deployment, Probes & preStop Drain', 'Autoscaling (HPA) & Disruption Budget'],
    terms: [
      ['Probe (`startup`/`readiness`/`liveness`)', '`startupProbe` menjaga aplikasi lambat menyala, `readinessProbe` melepas pod hangat atau drain dari trafik, dan `livenessProbe` me-restart proses macet. Jangan ikat liveness ke cek DB luar.'],
      ['Balapan drain `preStop`', 'Kubernetes menghapus IP pod mati dari EndpointSlices secara asinkron sembari mengirim `SIGTERM`. Jeda 5 hingga 10 detik di `preStop` memberi waktu propagasi routing agar rilis bebas `502 Bad Gateway`.'],
      ['`PodDisruptionBudget` (`PDB`)', 'Kebijakan cluster (`minAvailable` atau `maxUnavailable`) yang melarang pengosongan node sukarela menghentikan terlalu banyak replika sekaligus saat maintenance.']
    ],
    title: 'Container, Kubernetes HPA, PDB, dan graceful shutdown',
    why: "Deploy container tampak mudah sampai rolling update memutus 2% transaksi checkout dengan `502 Bad Gateway`. Gangguan DB juga bisa memicu loop restart massal, sehingga probe tepat, hook drain, redaman HPA, dan PDB menjaga rilis tanpa downtime.",
    points: [
      "Bangun image multi-stage minimalis non-root (distroless atau Alpine dengan `readOnlyRootFilesystem: true`) supaya tarikan cepat dan celah CVE tetap sempit.",
      "Pisahkan `readinessProbe` dari `livenessProbe`: gagalkan readiness saat dependensi mati, bukan liveness. Me-restart pod sehat ketika DB goyang membanjiri DB yang sedang pulih lewat badai koneksi baru.",
      "Tetapkan CPU `requests` yang tepat untuk penjadwalan, dan hindari CPU `limits` ketat pada API peka latency karena kuota CFS memicu jeda 100 ms. Selalu pasang memory `limits` agar OOMKill menangkap kebocoran.",
      "Hentikan error `502` saat rolling deploy lewat drain dua tahap. Pertama `preStop: sleep 10` memberi waktu kube-proxy dan Ingress melepas pod selagi `/readyz` false, lalu `SIGTERM` menuntaskan request aktif di dalam `terminationGracePeriodSeconds`.",
      "Pasang `scaleDown.stabilizationWindowSeconds: 300` pada `HorizontalPodAutoscaler` (`autoscaling/v2`) supaya fluktuasi trafik singkat tidak menaik-turunkan jumlah pod terus-menerus.",
      "Tambah `PodDisruptionBudget` (`minAvailable: 2` atau `maxUnavailable: 1`) pada pool utama sebelum menjalankan cluster autoscaler atau upgrade node."
    ],
    practice: "Tinjau YAML Deployment di atas. Jelaskan mengapa `terminationGracePeriodSeconds: 45` dipasangkan dengan `preStop: sleep 10`, dan mengapa `maxUnavailable: 0` di `rollingUpdate` penting saat `PodDisruptionBudget` memasang `maxUnavailable: 1`.",
    teach: "Jelaskan kondisi balapan saat `kubectl rollout restart` antara tibanya `SIGTERM` di proses dan Ingress yang menghapus IP pod itu. Jelaskan mengapa mengecek `SELECT 1` di dalam `livenessProbe` memicu outage berantai.",
    analogy: "Memberi jeda `preStop` sebelum mematikan server sama seperti membalik papan toko ke 'Tutup' 10 menit sebelum mengunci pintu. Tamu yang sudah duduk sempat menghabiskan makanannya.",
    pitfalls: [
      "Mengikat `livenessProbe` untuk mengecek koneksi Redis atau PostgreSQL. Saat Redis restart 15 detik, Kubernetes langsung menghentikan semua pod API sehat.",
      "Melewatkan jeda `preStop` atau menutup socket langsung pada `SIGTERM` sebelum EndpointSlice selesai disebar, menimbulkan error `502` di tiap rilis.",
      "Menyetel `replicas: 1` bersama PDB `minAvailable: 1` (atau `maxUnavailable: 0`), menghalangi proses upgrade node Kubernetes selamanya."
    ],
    quiz: {
      'livenessprobe-avoid-querying-ext': ["Mengapa `livenessProbe` harus menghindari menembak database eksternal atau API pihak ketiga?", ["HTTP GET tidak didukung Kubernetes", "Jika DB melambat sebentar, Kubernetes me-restart semua pod API sehat dalam loop crash walau prosesnya tidak deadlock", "ReadinessProbe sudah me-restart pod mati", "Liveness memperlambat GC Go"], "Liveness hanya memeriksa apakah proses mengalami deadlock. Gangguan layanan hilir ditangani readiness probe atau circuit breaker."],
      'add-prestop-sleep-10': ["Mengapa menambah `preStop: sleep 10` sebelum container memproses `SIGTERM` selama rolling deploy?", ["Memanaskan cache CPU", "Karena propagasi EndpointSlice dan kube-proxy antar node berlangsung asinkron sehingga paket tetap datang setelah terminasi mulai", "Membersihkan garbage collector Go", "Melewati cek Readiness"], "Jeda drain singkat menampung trafik berjalan sembari load balancer menghapus IP pod yang dimatikan."],
      'happens-during-node-upgrade': ["Apa yang terjadi saat upgrade node jika Deployment 1 replika memakai `PodDisruptionBudget` bernilai `minAvailable: 1`?", ["Kubernetes menggandakan otomatis", "Drain node terhenti karena mengeluarkan satu-satunya pod melanggar PDB", "HPA menimpa PDB", "Pod berubah menjadi DaemonSet"], "Jalankan minimal 2 replika sebelum memasang `minAvailable: 1` atau `maxUnavailable: 1`, kalau tidak drain node macet."]
    }
  },

  toolbox: {
    splits: ['Tool Decision Engine (Go)', 'Minimal Stack Builder'],
    terms: [
      ['Prinsip teknologi membosankan', 'Prinsip Dan McKinley: mulai dari database dan tools teruji yang sudah tim kuasai (sering cukup Postgres plus Redis) sampai batas skala terukur memaksa pindah.'],
      ['Pemisahan OLTP vs OLAP', 'Layani transaksi pelanggan pada OLTP berbasis baris (PostgreSQL, SQL Server). Alirkan event CDC ke OLAP kolumnar (ClickHouse, BigQuery, DuckDB) sebelum scan `GROUP BY` mengunci tabel checkout.'],
      ['Workflow engine vs Antrean', 'Antrean (SQS, RabbitMQ, Kafka) cocok untuk event tunggal stateless. Workflow engine tahan lama (Temporal, Durable Functions) menangani orkestrasi berhari-hari, timer, persetujuan, dan rollback langkah.']
    ],
    title: 'Matriks pemilihan tools dan blok arsitektur komposabel',
    why: "Mulai pemilihan tools dari batasan nyata (QPS, aturan ACID, bentuk query, retensi, dan ukuran tim), bukan tren vendor. Rangkai stack terkecil yang kegagalannya sanggup ditangani timmu pukul 3 pagi.",
    points: [
      "Di bawah `20K–50K` ops/detik per region, PostgreSQL menangani join, JSONB, partial index, SKIP LOCKED, dan `pgvector`. Tunda Cassandra atau Spanner.",
      "Pilih wide-column seperti DynamoDB atau Cassandra bila SLA partition-key ratusan ribu QPS melewati kapasitas satu primer tulis. Hindari opsi ini jika butuh join lintas entitas.",
      "Gunakan Redis atau Valkey untuk cache sub-ms `LRU`/`LFU`, counter Lua rate limit, leaderboard sorted-set, dan pub/sub, jangan jadikan buku besar tahan lama satu-satunya.",
      "Pilih RabbitMQ atau SQS untuk antrean tugas ber-routing dan retry tertunda. Pilih Kafka atau Redpanda untuk log terurut imutabel bagi konsumen terpisah seperti billing, pencarian, ML, dan ClickHouse.",
      "Pakai OpenSearch, Elasticsearch, atau Meilisearch tersinkron lewat CDC untuk pencarian teks BM25 dan facet. Pakai PostGIS atau Uber H3 bersama Redis untuk pencocokan radius.",
      "Pasang NGINX, Envoy, atau ALB cloud di tepi untuk TLS, batas laju, dan routing L7. Tambah OpenTelemetry, Prometheus, dan Grafana untuk observabilitas, serta Temporal untuk saga panjang multi-langkah."
    ],
    practice: "Jalankan `go run .` dan catat mengapa fintech ledger `5k QPS` melewatkan Kafka, sharding, OpenSearch, dan Temporal sampai bottleneck membutuhkannya. Tambah beban ketiga untuk sistem targetmu sendiri (misalnya pengirim notifikasi atau pencocokan ojek) lalu jelaskan tiap komponennya.",
    teach: "Pertahankan alasan memakai stack ramping (`Postgres + PgBouncer + Redis + Outbox`) hingga 10K–25K QPS dan jelaskan mengapa lebih baik daripada langsung menumpuk Kafka, Cassandra, dan 12 microservice di hari pertama. Sebutkan metrik pemicu upgrade berikutnya.",
    analogy: "Tukang kayu ahli tak membawa mesin CNC untuk perbaikan kecil saat pahat tangan lebih cepat beres. Setiap komponen terdistribusi ekstra menambah alarm on-call, jeda sinkronisasi, dan pola gagal baru.",
    pitfalls: [
      "Arsitektur demi CV: memasang Kafka, Cassandra, Elasticsearch, dan service mesh Istio bagi aplikasi internal 50 RPS buatan tiga engineer.",
      "Memilih NoSQL sekadar menghindari skema untuk sistem tagihan atau buku besar relasional yang butuh transaksi multi-baris ACID.",
      "Menganggap pilihan tools bersifat tetap, lalu lupa mengukur ulang bottleneck nyata tiap trafik naik 2× hingga 5×."
    ],
    quiz: {
      'keep-heavy-bi-reporting': ["Mengapa laporan BI berat (`GROUP BY` 12 bulan faktur) harus dijauhkan dari PostgreSQL primer yang melayani checkout?", ["PostgreSQL tidak punya `GROUP BY`", "Scan analitik panjang menggusur halaman OLTP panas dari buffer RAM dan berebut CPU serta I/O dengan transaksi checkout", "JSON tak bisa menyimpan tanggal", "CDN memblokir query analitik"], "Memindah scan OLAP ke replika atau DB kolumnar (ClickHouse atau BigQuery) melindungi tail latency checkout."],
      'temporal-durable-workflow-engine': ["Kapan Temporal (atau workflow engine persisten) mengungguli antrean mentah RabbitMQ atau SQS?", ["Untuk resize thumbnail satu langkah", "Ketika saga bisnis berlangsung berjam-jam atau berhari-hari memakai timer, kompensasi, dan replay state deterministik", "Untuk cache gambar di edge CDN", "Untuk menghapus handshake TCP"], "Antrean pas bagi tugas asinkron tunggal, sementara saga panjang ber-timer dan rollback rapuh tanpa workflow engine."],
      'database-architecture-matches-ac': ["Arsitektur database apa yang cocok untuk dompet finansial ACID bertrafik puncak `3.000 QPS` dengan tim kecil?", ["Cluster Cassandra 64-shard", "PostgreSQL primer + replika sync/async + PgBouncer + rate limit Redis", "Ledger utama Elasticsearch", "Map di memori saja"], "PostgreSQL menangani transaksi ACID pada 3.000 QPS dengan beban operasional jauh lebih ringan dibanding sharding NoSQL."]
    }
  }
}
};

export default trackId;
