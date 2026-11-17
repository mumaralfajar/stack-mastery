// Bahasa Indonesia — track ASP.NET Core. Contoh kode tetap memakai versi aslinya.
I18N.lessons('aspnet', {
  http: {
    title: 'Cara kerja web: HTTP dalam 20 menit',
    why: "ASP.NET Core adalah mesin yang mengubah HTTP request menjadi HTTP response. Begitu kamu bisa membaca request dan response mentah, kamu bisa men-debug masalah web di framework apa pun. Setiap contoh di track ini adalah `Program.cs` lengkap untuk .NET 10: paste ke project baru, dan langsung jalan.",
    points: [
      "Browser (client) mengirim **request**: sebuah method (`GET`, `POST`, `PUT`, `DELETE`), URL, header, dan kadang body.",
      "Server mengembalikan **response**: status code, header, dan biasanya body (HTML atau JSON).",
      "Kelompok status: `2xx` sukses, `3xx` redirect, `4xx` kesalahan dari client, `5xx` server yang gagal.",
      "HTTP itu **stateless**: setiap request berdiri sendiri. Identitas dikirim ulang setiap kali, lewat cookie atau token.",
      "`GET` membaca dan tidak boleh mengubah data; `POST` membuat; `PUT`/`PATCH` meng-update; `DELETE` menghapus.",
      "`GET`, `PUT`, dan `DELETE` bersifat **idempotent**: mengirim request yang sama dua kali menghasilkan keadaan yang sama dengan mengirimnya sekali. `POST` tidak, jadi `POST` yang di-retry bisa membuat dua order.",
      "Halaman browser di satu origin (`http://localhost:5173`) hanya boleh membaca response dari origin lain (`http://localhost:5000`) kalau server mengizinkannya lewat header **CORS**. Aplikasi React yang memanggil API-nya persis kasus ini; materi routing menunjukkan cara menyiapkannya.",
      "Tab Network di dev tools browser menampilkan setiap request dan response. Biarkan terbuka selama kamu bekerja."
    ],
    practice: "Jalankan `dotnet new web`, ganti `Program.cs` dengan contohnya, lalu panggil `/time` dari browser, dari `curl -i`, dan dengan tab Network di dev tools terbuka. Temukan method, status code, dan `Content-Type` di masing-masing.",
    teach: "Jelaskan apa yang terjadi di antara mengetik URL dan melihat halaman, memakai kata request, response, status code, dan header.",
    analogy: "HTTP itu seperti memesan di konter lewat surat. Kamu mengirim amplop: apa yang kamu mau (method dan URL), catatan di bagian luar (header), dan isinya (body). Dapur mengirim balik amplop yang dicap dengan kode hasil. Dapur tidak ingat siapa kamu, jadi kamu harus menunjukkan kartu member setiap kali.",
    pitfalls: [
      "Mengira server 'ingat' user di antara request. Tidak; cookie atau token dikirim setiap kali.",
      "Memakai `GET` untuk operasi yang mengubah data. Browser, crawler, dan link preview memanggil `GET` sesuka hati.",
      "Mengembalikan `200 OK` dengan pesan error di body alih-alih kode `4xx`/`5xx` yang tepat."
    ],
    quiz: [
      ["Kelompok status code mana yang berarti 'client mengirim sesuatu yang salah'?", ["2xx", "3xx", "4xx", "5xx"], "Kode 4xx seperti 400, 401, dan 404 menandakan masalah pada request-nya."],
      ["HTTP bersifat stateless artinya…", ["Server tidak bisa menyimpan data apa pun", "Setiap request membawa semua yang dibutuhkan untuk memprosesnya", "Response tidak punya body", "Cookie tidak diizinkan"], "Protokolnya tidak menyimpan ingatan di antara request. Cookie adalah cara state dikirim ulang bersama setiap request."],
      ["Terjadi error jaringan dan client otomatis mengirim ulang request yang sama. Untuk method mana itu aman tanpa desain tambahan?", ["`POST /orders`", "`PUT /orders/7`", "`POST /payments`", "Tidak ada satu pun"], "`PUT` mengganti resource dengan isi yang sama, jadi mengulangnya tidak mengubah apa-apa lagi. Mengulang `POST` bisa membuat order atau tagihan kedua."]
    ]
  },
  anatomy: {
    title: 'Anatomi aplikasi ASP.NET Core',
    why: "`Program.cs` punya dua bagian, dan kebanyakan pertanyaan 'kenapa service-ku tidak ditemukan?' atau 'kenapa middleware-ku tidak jalan?' terjawab dengan tahu sesuatu itu masuk bagian yang mana.",
    points: [
      "**Bagian pertama, builder**: daftarkan service (hal-hal yang dibutuhkan aplikasi) dengan `builder.Services.Add…`, dan baca konfigurasi.",
      "**Bagian kedua, app**: setelah `builder.Build()`, susun request pipeline dengan `app.Use…` dan petakan endpoint dengan `app.Map…`. `app.Run()` menyalakan server dan menahan di situ sampai aplikasi dimatikan.",
      "**Kestrel** adalah web server bawaan yang mendengarkan sebuah port dan meneruskan request ke pipeline-mu.",
      "Konfigurasi berlapis: `appsettings.json` → `appsettings.{Environment}.json` → user secrets (hanya Development) → environment variable → argumen command line. Sumber yang belakangan menang.",
      "`ASPNETCORE_ENVIRONMENT` memilih perilaku `Development`, `Staging`, atau `Production`.",
      "Track ini memakai **minimal API** (`app.MapGet`). Gaya lainnya adalah controller: `AddControllers()` ditambah `MapControllers()`, di atas routing engine yang sama."
    ],
    practice: "Buat Web API dengan `dotnet new webapi` lalu paste contohnya. Tambahkan `Greeting` ke `appsettings.json`, lalu timpa dengan environment variable dan pastikan value mana yang menang. Terakhir, pindahkan baris `builder.Configuration` ke bawah `app.Run()` dan jelaskan apa yang terjadi.",
    teach: "Jelaskan dua bagian `Program.cs`: apa yang ditaruh sebelum `builder.Build()` dan apa yang setelahnya.",
    analogy: "Membuka restoran ada dua fase. Sebelum hari pembukaan kamu merekrut staf dan mengisi dapur (mendaftarkan service). Begitu pintu dibuka, kamu menentukan jalur yang dilewati setiap tamu: meja penerima, tempat titip jaket, meja makan, kasir (pipeline). Kamu tidak bisa merekrut koki sambil melayani tamu.",
    pitfalls: [
      "Mendaftarkan service setelah `builder.Build()`. Service collection-nya sudah read-only, dan itu melempar exception.",
      "Menulis kode setelah `app.Run()` dan berharap kode itu jalan saat startup.",
      "Meng-commit secret ke `appsettings.json`. Pakai user secrets di lokal dan environment variable atau vault di production.",
      "Mengira `appsettings.Development.json` dipakai di production."
    ],
    quiz: [
      ["Di mana `builder.Services.AddScoped<…>()` harus dipanggil?", ["Setelah `app.Run()`", "Sebelum `builder.Build()`", "Di dalam handler endpoint", "Di mana saja, asal di `Program.cs`"], "Service collection dibekukan saat aplikasinya di-build."],
      ["Key yang sama ada di `appsettings.json` dan di environment variable. Mana yang menang secara default?", ["`appsettings.json`", "Environment variable", "Tidak ada: aplikasinya menolak untuk start", "Yang paling baru diubah"], "Sumber konfigurasi yang ditambahkan belakangan menimpa yang lebih awal; environment variable datang setelah file JSON."],
      ["Apa itu Kestrel?", ["Driver database", "Web server lintas platform yang sudah terpasang di ASP.NET Core", "Reverse proxy yang harus di-install terpisah", "Penjadwal background job"], "Kestrel mendengarkan koneksi HTTP dan memasukkan request ke pipeline. Reverse proxy seperti nginx atau IIS bisa ditaruh di depannya, tapi tidak wajib."]
    ]
  },
  routing: {
    title: 'Routing, endpoint, dan model binding',
    why: "API adalah daftar endpoint. Memetakan URL ke kode, membaca input dengan aman, dan mengembalikan status code yang tepat adalah pekerjaan harian seorang backend developer.",
    points: [
      "**Routing** mencocokkan method + pola URL dengan sebuah handler: `GET /api/products/{id}`.",
      "**Model binding** mengisi parameter handler dari route, query string, header, dan body JSON secara otomatis.",
      "Kembalikan hasil yang tepat: `Ok` 200, `Created` 201, `NoContent` 204, `BadRequest` 400, `NotFound` 404. `TypedResults` ditambah `Results<…>` di signature juga mendokumentasikan setiap kemungkinan response di deskripsi OpenAPI.",
      "Konvensi REST: kata benda di URL (`/products/5`), method HTTP sebagai kata kerjanya. Bukan `/getProduct?id=5`.",
      "Route constraint seperti `{id:int}` menentukan route mana yang cocok. `/api/products/abc` tidak cocok sama sekali, jadi pemanggil mendapat **404**, bukan 400. Validasi input di handler atau lewat validation, bukan lewat constraint.",
      "Apa pun yang dipakai bersama oleh endpoint hidup selama aplikasi berjalan dan dipakai banyak request sekaligus, jadi harus thread-safe: karena itulah ada `ConcurrentDictionary` dan `Interlocked` di contoh.",
      "**CORS** membuat dev server React-mu, yang ada di origin lain, bisa memanggil API dari browser. Sebutkan origin yang kamu izinkan secara persis."
    ],
    practice: "Tambahkan `PUT /api/products/{id}` yang mengganti sebuah produk dan mengembalikan 404 kalau produknya tidak ada. Test kelima endpoint dengan file `.http` atau `curl`, dan cek setiap status code-nya. Lalu panggil `/api/products/abc` dan jelaskan kenapa hasilnya 404.",
    teach: "Jelaskan bagaimana ASP.NET Core tahu bahwa parameter `id` berasal dari URL dan `input` berasal dari body request.",
    analogy: "Routing itu resepsionis hotel: 'kamar 204? Lantai dua, sebelah kiri.' Model binding adalah bellboy yang membongkar kopermu ke laci-laci yang tepat sebelum kamu masuk kamar: value dari route di sini, value dari query di sana, body JSON ditata sebagai object.",
    pitfalls: [
      "Mengembalikan 200 dengan `null` saat sesuatu tidak ditemukan. Kembalikan 404.",
      "Membuat id dengan `list.Count + 1`. Setelah ada yang dihapus, id berikutnya mengulang id yang sudah ada.",
      "Menyimpan data bersama di `List<T>` biasa yang diubah banyak request sekaligus.",
      "Mengekspos entity database langsung sebagai body request dan response. Pakai DTO (record).",
      "Kata kerja di URL (`/api/createProduct`). Biarkan method HTTP yang membawa kata kerjanya."
    ],
    quiz: [
      ["Sebuah `POST` berhasil membuat resource. Status code terbaik?", ["200", "201", "204", "202"], "201 Created, idealnya dengan header `Location` yang menunjuk ke resource baru. 202 berarti 'diterima, belum selesai'."],
      ["Dengan `app.MapGet(\"/items/{id:int}\", (int id) => …)`, request ke `/items/abc` mengembalikan…", ["500", "404", "200 dengan id = 0", "400"], "Constraint `:int` tidak cocok, jadi tidak ada route yang ditemukan. Karena itulah constraint bukan alat validasi."],
      ["Dari mana parameter bertipe kompleks seperti `CreateProduct input` di-bind secara default pada POST?", ["Query string", "Route", "Body JSON", "Field form"], "Type kompleks di-bind dari body; type sederhana di-bind dari route atau query string."]
    ]
  },
  middleware: {
    title: 'Middleware pipeline',
    why: "Penanganan error, CORS, authentication, dan logging semuanya middleware. Salah urutan adalah salah satu kesalahan paling umum di ASP.NET Core, dan sulit terlihat kalau kamu belum punya gambaran pipeline-nya di kepala.",
    points: [
      "Request melewati middleware **sesuai urutan didaftarkan**, dan response kembali melewatinya dalam urutan **terbalik**.",
      "Setiap middleware boleh bekerja sebelum `next()`, memanggil `next()`, bekerja sesudahnya, atau **short-circuit** dengan tidak memanggil `next()` sama sekali.",
      "Urutan itu penting: penanganan exception paling awal (supaya membungkus semuanya), lalu HTTPS, static file, CORS, authentication, authorization, endpoint.",
      "Kamu tidak perlu memanggil `UseRouting()`: `WebApplication` sudah menambahkannya di awal pipeline. Panggil sendiri hanya kalau ada middleware yang harus jalan sebelum routing.",
      "`UseExceptionHandler()` perlu tahu cara menulis error-nya: daftarkan `AddProblemDetails()` (atau sebuah `IExceptionHandler`), kalau tidak, aplikasinya gagal saat startup.",
      "Middleware buatan sendiri cukup `app.Use(async (context, next) => { … })`, atau class dengan method `InvokeAsync`."
    ],
    practice: "Tulis middleware yang menolak request tanpa header `X-Api-Key` dengan 401, tanpa memanggil `next`. Taruh sebelum lalu sesudah middleware timing dan jelaskan apa yang berubah di log. Panggil `/boom` dengan `ASPNETCORE_ENVIRONMENT` bernilai `Production` dan pastikan tidak ada stack trace yang sampai ke client.",
    teach: "Jelaskan kenapa urutan middleware itu penting, pakai authentication dan authorization sebagai contoh.",
    analogy: "Keberangkatan di bandara: check-in, pemeriksaan keamanan, imigrasi, gate. Semua orang melewatinya dengan urutan itu, dan pos mana pun bisa menyuruhmu kembali. Imigrasi tidak bisa dilakukan sebelum ada yang mengecek siapa kamu. Saat pulang, kamu melewati pos-pos serupa dalam urutan terbalik.",
    pitfalls: [
      "Menaruh `UseAuthorization` sebelum `UseAuthentication`. Di titik itu belum ada yang login, jadi setiap endpoint yang dilindungi mengembalikan 401.",
      "Memanggil `UseExceptionHandler()` tanpa `AddProblemDetails()` lalu aplikasinya crash saat startup.",
      "Menulis ke response setelah `next()` padahal response-nya sudah mulai dikirim.",
      "Lupa bahwa kode setelah `await next()` jalan di perjalanan kembali."
    ],
    quiz: [
      ["Middleware A didaftarkan sebelum B. Di jalur response, mana yang menjalankan kode 'sesudah'-nya lebih dulu?", ["A", "B", "Keduanya bersamaan", "Yang lebih dulu menyelesaikan kode 'sebelum'-nya"], "Pipeline terurai terbalik: B selesai dulu, baru A."],
      ["Apa arti 'short-circuit'?", ["Aplikasinya crash", "Sebuah middleware menulis response tanpa memanggil `next`", "Dua middleware jalan paralel", "Request melewati routing tapi tetap sampai ke endpoint"], "Middleware berikutnya dan endpoint-nya tidak pernah jalan, seperti pada 401 atau response dari cache."],
      ["Kenapa middleware penanganan exception harus didaftarkan paling awal?", ["Karena paling cepat", "Supaya ia membungkus, dan bisa menangkap exception dari, semua yang datang setelahnya", "Karena ia harus membaca body request lebih dulu", "Hanya supaya mudah dibaca"], "Sebuah middleware hanya bisa menangkap exception dari komponen yang ia panggil lewat `next`."]
    ]
  },
  di: {
    title: 'Dependency injection dan service lifetime',
    why: "DI adalah tulang punggung ASP.NET Core. Salah memilih lifetime membuatmu mendapat data basi, race pada state bersama, dan error 'cannot consume scoped service from singleton'.",
    points: [
      "Class menyatakan apa yang dibutuhkannya di constructor; **container** yang membuat dan menyediakannya. Class tidak `new` dependency-nya sendiri.",
      "**Transient**: instance baru setiap kali diminta. Untuk service yang ringan dan stateless.",
      "**Scoped**: satu instance per HTTP request. Pilihan default untuk apa pun yang menyentuh database; `DbContext` itu scoped.",
      "**Singleton**: satu instance untuk seluruh aplikasi. Harus thread-safe dan tidak menyimpan state per user.",
      "**Captive dependency**: singleton yang memegang service scoped membuat service itu hidup selamanya. Di Development, ASP.NET Core mengecek hal ini dan melempar exception; di Production tidak dicek, jadi bug-nya lolos.",
      "`TimeProvider` adalah jam bawaan .NET. Inject itu alih-alih memanggil `DateTime.UtcNow`, dan test bisa menggantinya dengan versi palsu."
    ],
    practice: "Daftarkan sebuah class dengan property `Guid Id = Guid.NewGuid()` tiga kali — transient, scoped, dan singleton — lalu kembalikan ketiga id-nya dari endpoint yang meng-inject masing-masing dua kali. Refresh dan jelaskan polanya. Lalu jadikan `OrderService` singleton, jalankan di Development, dan baca error-nya.",
    teach: "Jelaskan ketiga service lifetime dan kenapa `DbContext` tidak boleh di-inject ke singleton.",
    analogy: "Sebuah hotel. **Singleton** adalah jam di lobi: satu untuk semua orang, selamanya. **Scoped** adalah kunci kamarmu: milikmu selama menginap, yang sama setiap kali kamu minta di meja depan, dikembalikan saat checkout. **Transient** adalah gelas kertas: yang baru setiap kali kamu minta.",
    pitfalls: [
      "Menyimpan data per user di singleton. Semua user jadi melihatnya.",
      "Meng-inject service scoped ke singleton. Kalau singleton butuh service scoped, inject `IServiceScopeFactory` dan buat scope untuk setiap unit kerja.",
      "Mengambil service dari `IServiceProvider` di mana-mana alih-alih menyatakannya di constructor (pola service locator)."
    ],
    quiz: [
      ["Dalam satu HTTP request, service scoped di-inject ke dua class berbeda. Ada berapa instance?", ["Satu", "Dua", "Satu per thread", "Dua, lalu digabung di akhir request"], "Scoped berarti satu instance per scope, dan setiap request adalah satu scope."],
      ["Lifetime apa yang dipakai `AddDbContext` secara default?", ["Singleton", "Scoped", "Transient", "Singleton yang di-pool"], "`DbContext` adalah satu unit kerja untuk satu request dan tidak thread-safe."],
      ["Apa itu captive dependency?", ["Referensi melingkar antara dua service", "Service berumur pendek yang dipegang service berumur panjang", "Service yang didaftarkan dua kali", "Service yang tidak pernah di-dispose"], "Misalnya singleton yang memegang `DbContext` scoped: ia tidak pernah dilepas, dan semua request memakainya bersama."]
    ]
  },
  efcore: {
    title: 'EF Core: database-mu di dalam C#',
    why: "EF Core adalah tempat C#, LINQ, dan SQL bertemu. Kalau dipakai dengan baik, boilerplate hilang; kalau dipakai membabi buta, ia menghasilkan query lambat yang tidak pernah kamu lihat. Kebiasaan yang paling penting adalah membaca SQL yang dihasilkannya.",
    points: [
      "`DbContext` adalah sesi dengan database; setiap `DbSet<T>` dipetakan ke sebuah tabel, dan setiap object entity ke sebuah baris.",
      "LINQ pada `DbSet` diterjemahkan jadi SQL dan dijalankan saat di-enumerate (`ToListAsync`, `FirstOrDefaultAsync`).",
      "**Migration** mencatat versi schema di dalam kode. Install tool-nya sekali (`dotnet tool install --global dotnet-ef`), tambahkan package `Microsoft.EntityFrameworkCore.Design`, lalu `dotnet ef migrations add Init` dan `dotnet ef database update`.",
      "**Change tracking**: muat sebuah entity, ubah, panggil `SaveChangesAsync`, dan EF yang menulis `UPDATE`-nya.",
      "Muat data relasi dengan projection lewat `Select`, yang hanya mengambil kolom yang dibutuhkan, atau dengan `Include` kalau kamu memang butuh entity utuh.",
      "Petakan uang secara eksplisit dengan `[Precision(10, 2)]`, supaya kolomnya `DECIMAL(10,2)` seperti di track SQL.",
      "LINQ dan `FromSql($\"…{value}\")` mengirim value sebagai parameter SQL. `FromSqlRaw` dengan string yang disambung tidak, dan rawan SQL injection."
    ],
    practice: "Arahkan contohnya ke SQL Server Express atau LocalDB (`Server=(localdb)\\MSSQLLocalDB`), tambahkan migration lalu terapkan, dan isi beberapa baris. Panggil setiap endpoint dan baca SQL-nya di console. Apakah itu yang akan kamu tulis sendiri?",
    teach: "Jelaskan bagaimana ekspresi LINQ C# seperti `db.Products.Where(p => p.Price < 100)` berubah menjadi query SQL.",
    analogy: "EF Core adalah penerjemah di antara dua orang yang bahasanya berbeda: kamu berbicara dalam object C#, database berbicara dalam tabel SQL. Penerjemah yang baik menghemat banyak pekerjaan, tapi kalau kamu tidak pernah belajar bahasa yang satunya, kamu tidak akan sadar saat terjemahannya bertele-tele atau salah.",
    pitfalls: [
      "Tidak pernah melihat SQL yang dihasilkan.",
      "Memanggil `ToList()` terlalu awal lalu memfilter di memory, bukan di database.",
      "Mengembalikan entity langsung dari API: navigation property menyebabkan serialisasi berputar-putar dan mengekspos kolom yang tidak dimaksudkan.",
      "Menyusun SQL dengan menyambung string, `FromSqlRaw(\"… '\" + name + \"'\")`."
    ],
    quiz: [
      ["Kapan `db.Products.Where(p => p.Price < 100)` menyentuh database?", ["Saat itu juga", "Saat di-enumerate, misalnya oleh `ToListAsync()`", "Saat aplikasi start", "Saat `SaveChanges` dipanggil"], "`IQueryable` bersifat deferred, sama seperti LINQ to Objects."],
      ["Apa isi sebuah migration?", ["Backup database", "Kode yang mendeskripsikan perubahan schema, dengan langkah `Up` dan `Down`", "Hanya seed data", "SQL hasil compile untuk setiap query"], "Migration adalah perubahan schema yang punya versi dan bisa di-review."],
      ["Kamu memuat sebuah entity dan mengubah property-nya. Apa yang menuliskannya ke database?", ["Tidak ada: otomatis tersimpan saat property-nya berubah", "`db.SaveChangesAsync()`", "`db.Update()` selalu wajib dipanggil dulu", "Men-dispose context-nya"], "Change tracker mendeteksi perubahannya; `SaveChanges` mengirim `UPDATE`-nya. `Update()` hanya diperlukan untuk entity yang tidak dilacak context."]
    ]
  },
  validation: {
    title: 'DTO, validasi, dan penanganan error',
    why: "API adalah kontrak dengan orang asing. Memvalidasi setiap input dan mengembalikan error yang konsisten dan bisa dibaca mesin adalah yang membuatnya bisa dipakai oleh orang selain kamu.",
    points: [
      "**Jangan pernah percaya input.** Validasi di batas sistem dan kembalikan `400 Bad Request` beserta detailnya.",
      "**DTO** (record untuk request dan response) memisahkan kontrak API dari entity database dan mencegah over-posting.",
      "Data annotation (`[Required]`, `[Range]`, `[StringLength]`) menyatakan aturan secara deklaratif. Di .NET 10, `AddValidation()` mengeceknya pada parameter minimal API.",
      "**ProblemDetails** (RFC 9457) adalah bentuk standar error dalam JSON: `type`, `title`, `status`, `detail`, `errors`.",
      "Tangani exception tak terduga secara terpusat dengan `UseExceptionHandler`: catat detailnya di log, kembalikan 500 yang umum, dan jangan pernah membocorkan stack trace.",
      "Kegagalan yang memang bisa terjadi (tidak ditemukan, konflik, input tidak valid) bukan exception; kembalikan status code untuk itu.",
      "Aturan seperti 'nama harus unik' tempatnya di database, sebagai index `UNIQUE`. Mengecek dulu di kode lalu insert akan race saat dua request datang bersamaan."
    ],
    practice: "Tambahkan validasi ke setiap endpoint penulisan di API-mu. Kirim lima request tidak valid yang berbeda dan pastikan masing-masing mengembalikan ProblemDetails `400` yang menyebut field yang salah. Kirim nama produk baru yang sama dua kali secara paralel dan pastikan yang satu mendapat 201 dan yang lain 409. Lalu lempar exception dengan sengaja dan pastikan tidak ada stack trace yang sampai ke client di Production.",
    teach: "Jelaskan kenapa API sebaiknya memakai DTO request dan response yang terpisah, alih-alih menerima dan mengembalikan entity database.",
    analogy: "DTO adalah formulir pesanan di konter; entity adalah catatan di gudang. Pelanggan mengisi formulir. Mereka tidak boleh masuk gudang lalu mengubah buku stok, termasuk kolom yang memang tidak boleh mereka lihat, seperti harga pokok atau `IsAdmin`.",
    pitfalls: [
      "Mem-bind langsung ke entity dan membiarkan client mengisi field seperti `IsAdmin` (over-posting).",
      "Melempar exception untuk kegagalan validasi.",
      "Mengecek duplikat dengan `AnyAsync` lalu insert, tanpa index unik di belakangnya.",
      "Mengembalikan bentuk error yang berbeda-beda dari endpoint yang berbeda."
    ],
    quiz: [
      ["Client mengirim harga negatif. Response yang benar?", ["500", "200 dengan pesan error", "400 dengan detail validasi", "422 tanpa body"], "Input client yang tidak valid adalah 4xx; 400 dengan detail per field membuat client bisa memperbaikinya."],
      ["Masalah apa yang dicegah oleh DTO request?", ["Query yang lambat", "Over-posting: client mengisi property yang tidak boleh mereka kendalikan", "Baris duplikat", "Error CORS"], "Hanya field yang ada di DTO yang bisa di-bind dari request."],
      ["Dua request membuat produk bernama 'Lamp' di saat yang sama. Apa yang bisa diandalkan untuk mencegah duplikat?", ["Mengecek `AnyAsync` sebelum insert", "Index `UNIQUE`, dengan error duplicate key diubah jadi 409", "`lock` di sekeliling endpoint", "Attribute validasi"], "Kedua pengecekan `AnyAsync` bisa sama-sama lolos sebelum ada yang insert. `lock` hanya bekerja di satu server. Index di database adalah satu-satunya tempat yang melihat keduanya."]
    ]
  },
  auth: {
    title: 'Authentication dan authorization',
    why: "Bug keamanan adalah yang paling mahal. Kamu harus bisa menjelaskan siapa pemanggilnya, bagaimana server tahu, dan bagaimana setiap endpoint memutuskan apa yang boleh mereka lakukan.",
    points: [
      "**Authentication** = membuktikan identitas. **Authorization** = memutuskan izin. Dua langkah terpisah, dua middleware terpisah.",
      "Untuk SPA di browser seperti aplikasi React-mu, panduan saat ini adalah **backend-for-frontend**: browser hanya memegang cookie session `HttpOnly`, dan token tetap di server. **Token JWT bearer** cocok untuk aplikasi mobile dan panggilan antar service.",
      "JWT terdiri dari tiga bagian base64url: header, payload (claim), signature. Ia **di-sign, bukan dienkripsi**: siapa pun bisa membacanya, tapi tidak ada yang bisa mengubahnya tanpa merusak signature-nya.",
      "Server mengecek signature, issuer, audience, dan masa berlaku di setiap request. Buat access token berumur pendek.",
      "Taruh setting token di konfigurasi, bukan di kode: `appsettings.json` menyebut identity provider-mu, dan `dotnet user-jwts` menulis setting test lokal ke `appsettings.Development.json`.",
      "Lakukan authorization dengan role, **policy**, dan pengecekan berbasis resource ('apakah order ini milikmu?').",
      "Jangan pernah menyimpan password sendiri: pakai ASP.NET Core Identity (hash yang di-salt dan lambat) atau identity provider lewat OpenID Connect."
    ],
    practice: "Jalankan contohnya dan buat token lokal dengan `dotnet user-jwts create` (dan `--role Admin` untuk token kedua). Buktikan dengan request bahwa 401 (tanpa token), 403 (login tapi bukan Admin), dan 404 (order milik orang lain) masing-masing terjadi. Lalu panggil `/api/products` dari halaman di `http://localhost:5173` dengan dan tanpa policy CORS, lalu bandingkan apa kata console browser.",
    teach: "Jelaskan perbedaan 401 dan 403, dan kenapa JWT bisa dipercaya padahal isinya bisa dibaca siapa saja.",
    analogy: "JWT itu gelang festival. Petugas bisa langsung melihat akses apa yang diberikan (claim-nya), berlakunya sampai malam ini, dan segel anti-palsunya (signature) menunjukkan bahwa loket resmi yang mengeluarkannya. Siapa pun bisa membaca gelangnya; tidak ada yang bisa mencetak tiruan yang meyakinkan.",
    pitfalls: [
      "Menaruh secret atau data sensitif di payload JWT. Siapa pun yang memegang token-nya bisa membacanya.",
      "Hanya mengecek 'sudah login' dan lupa mengecek bahwa pemanggil memiliki resource yang diminta (IDOR).",
      "Menyimpan access token di `localStorage`, tempat script sisipan mana pun bisa membacanya.",
      "Menganggap CORS sebagai pengaman API. CORS hanya memberi tahu browser apa yang boleh; `curl` dan server lain mengabaikannya sama sekali."
    ],
    quiz: [
      ["User yang sudah login tapi tidak punya role Admin memanggil endpoint khusus admin. Status-nya?", ["401", "403", "404", "400"], "401 berarti belum terautentikasi; 403 berarti sudah terautentikasi tapi tidak diizinkan."],
      ["Apa yang dijamin oleh signature JWT?", ["Payload-nya rahasia", "Token-nya dikeluarkan oleh pemegang key dan tidak diubah", "Token-nya belum kedaluwarsa", "User-nya benar orang yang ia akui, selamanya"], "Signing memberi integritas dan keaslian, bukan kerahasiaan. Masa berlaku adalah claim terpisah yang dicek server."],
      ["Pengecekan mana yang mencegah user A membaca order milik user B di `/api/orders/17`?", ["`RequireAuthorization()` saja", "Query yang hanya menemukan order milik pemanggil", "HTTPS", "CORS"], "Sudah login saja tidak cukup; kepemilikan harus dicek untuk setiap resource."]
    ]
  },
  config: {
    title: 'Options, logging, dan environment',
    why: "Build yang sama harus jalan di laptop, di CI, dan di production dengan setting yang berbeda. Saat ada yang rusak di production, sering kali log adalah satu-satunya pegangan.",
    points: [
      "**Options pattern** mem-bind satu bagian konfigurasi ke class ber-type: `IOptions<T>` (dibaca sekali), `IOptionsSnapshot<T>` (per request), `IOptionsMonitor<T>` (reload langsung).",
      "Validasi options saat startup dengan `ValidateDataAnnotations().ValidateOnStart()`, supaya setting yang salah menggagalkan deploy, bukan request pertama.",
      "**Structured logging**: `log.LogInformation(\"Order {OrderId} placed\", id)` menjaga `OrderId` sebagai field yang bisa dicari. Jangan pakai string interpolation di pemanggilan log.",
      "Level log: Trace, Debug, Information, Warning, Error, Critical. Atur per kategori di `appsettings.json`.",
      "Secret: user secrets saat development; environment variable atau vault (Azure Key Vault, AWS Secrets Manager) di production; jangan pernah di source control.",
      "Pakai log scope atau `Activity` untuk menempelkan correlation id, supaya satu request bisa diikuti lintas service."
    ],
    practice: "Pindahkan setiap string dan angka ajaib di API-mu ke class options yang tervalidasi. Hapus `Smtp:Host` dari `appsettings.json` dan pastikan aplikasinya menolak start dengan pesan yang jelas. Lalu isi lewat environment variable `Smtp__Host` (dua garis bawah) dan pastikan aplikasinya start.",
    teach: "Jelaskan kenapa `log.LogInformation(\"User {Id} logged in\", id)` lebih baik daripada string yang di-interpolasi.",
    analogy: "Log yang terstruktur itu seperti lemari arsip dengan map berlabel, bukan tumpukan catatan tulisan tangan: kamu bisa meminta 'semua tentang order 42' dan mendapat persis itu.",
    pitfalls: [
      "Meng-inject `IConfiguration` di mana-mana dan membaca key berupa string.",
      "Pesan log dengan string interpolation, yang menghilangkan strukturnya dan tetap mengalokasikan memory meski level itu dimatikan.",
      "Mencatat secret, token, atau data pribadi seperti alamat email di log.",
      "Berharap `IOptions<T>` membaca setting yang berubah. Ia hanya dibaca sekali; pakai `IOptionsMonitor<T>` untuk value yang selalu terbaru."
    ],
    quiz: [
      ["Apa yang diubah oleh `ValidateOnStart()`?", ["Tidak ada", "Options yang tidak valid gagal saat aplikasi start, bukan saat pertama dipakai", "Options di-reload otomatis", "Validasi dilewati di production"], "Gagal saat startup mengubah bug tersembunyi saat runtime menjadi kegagalan deploy yang jelas terlihat."],
      ["Interface options mana yang mengikuti perubahan konfigurasi tanpa restart?", ["`IOptions<T>`", "`IOptionsMonitor<T>`", "`IConfigurationRoot`", "`IOptionsFactory<T>`"], "`IOptionsMonitor` mengamati perubahan; `IOptions` hanya dihitung sekali."],
      ["Di mana password database production seharusnya disimpan?", ["`appsettings.json`, di-commit ke git", "Environment variable atau secret vault", "`appsettings.Production.json`, di-commit ke git", "Konstanta di dalam kode"], "Secret harus dijauhkan dari source control dan diberikan saat deploy."]
    ]
  },
  testing: {
    title: 'Testing API: unit dan integration',
    why: "Test membuatmu bisa mengubah kode tanpa rasa takut. Test yang baik juga dokumentasi yang tidak bisa basi: ia menyatakan apa yang seharusnya dilakukan kode, dan gagal begitu kode tidak lagi melakukannya.",
    points: [
      "**Unit test** mengecek satu class dengan dependency-nya dipalsukan. Cepat, banyak, presisi.",
      "**Integration test** menjalankan pipeline sungguhan di memory dengan `WebApplicationFactory<Program>` (package `Microsoft.AspNetCore.Mvc.Testing`): routing, DI, validasi, dan serialisasi, semuanya.",
      "Buat project test dengan `dotnet new xunit` dan tambahkan reference ke project API. Di .NET 10, `Program` otomatis public; di .NET 8 dan 9, tambahkan `public partial class Program { }` di akhir `Program.cs`.",
      "Susun setiap test sebagai **Arrange, Act, Assert**. Satu perilaku per test, dinamai sesuai perilakunya.",
      "Untuk test yang melibatkan database, pakai SQL Server sungguhan di container (Testcontainers), bukan provider in-memory EF, yang tidak punya constraint dan tidak menjalankan SQL.",
      "Test perilakunya, bukan implementasinya: assert pada output dan efek yang terlihat, bukan pada private method mana yang dipanggil."
    ],
    practice: "Tulis integration test untuk setiap endpoint di API produkmu, mencakup jalur sukses dan minimal satu kegagalan per endpoint. Lalu ubah sebuah status code di API dan lihat tepat satu test gagal dengan pesan yang mudah dibaca.",
    teach: "Jelaskan perbedaan unit test dan integration test, serta apa yang bisa ditangkap masing-masing yang tidak bisa ditangkap yang lain.",
    analogy: "Unit test mengecek bahwa setiap bata itu kokoh. Integration test mengecek bahwa temboknya berdiri tegak. Kamu butuh keduanya: bata yang sempurna tetap bisa dipasang miring, dan saat tembok roboh kamu ingin cepat tahu apakah penyebabnya sebuah bata.",
    pitfalls: [
      "Me-mock segalanya sampai test-nya hanya mengecek mock-nya sendiri.",
      "Test yang saling bergantung atau bergantung pada urutan jalannya.",
      "Mempercayai provider in-memory EF berperilaku seperti SQL Server: tanpa constraint, tanpa transaction, tanpa SQL sungguhan."
    ],
    quiz: [
      ["Apa yang diberikan `WebApplicationFactory<Program>`?", ["Mock dari database", "Aplikasimu yang sungguhan, di-host di memory, dengan `HttpClient` untuk memanggilnya", "Deploy ke server test", "Rekaman traffic production"], "Ia menjalankan pipeline yang sebenarnya di dalam proses test, jadi routing, DI, dan middleware semuanya ikut teruji."],
      ["Tiga bagian dari test yang tersusun baik adalah…", ["Setup, Run, Teardown", "Arrange, Act, Assert", "Given, When, Verify", "Mock, Call, Check"], "Siapkan input-nya, lakukan aksinya sekali, lalu assert hasilnya."],
      ["Kenapa SQL Server sungguhan lebih baik daripada provider in-memory EF untuk integration test?", ["Lebih cepat", "Provider in-memory tidak menegakkan constraint dan tidak menjalankan SQL sungguhan", "Tidak perlu setup", "xUnit tidak bisa memakai provider in-memory"], "Bug di penerjemahan query, constraint, dan transaction hanya muncul di engine sungguhan."]
    ]
  },
  efadv: {
    title: 'EF Core lebih dalam: tracking, N+1, dan concurrency',
    why: "Kebanyakan aplikasi ASP.NET Core yang lambat itu lambat karena segelintir kesalahan EF Core. Masing-masing punya bentuk yang mudah dikenali di log SQL, dan perbaikan yang kecil.",
    points: [
      "**Masalah N+1**: satu query untuk daftarnya, lalu satu query lagi per baris untuk data relasinya. Perbaiki dengan projection (`Select`) atau `Include`.",
      "Query yang hanya membaca sebaiknya di-project ke DTO atau memakai `AsNoTracking()`, supaya change tracker tidak bekerja sia-sia.",
      "`Include` pada beberapa collection melipatgandakan baris (cartesian explosion); `AsSplitQuery()` menggantinya dengan beberapa query yang lebih kecil.",
      "`SaveChanges` membungkus perubahannya dalam satu transaction. Transaction eksplisit hanya perlu untuk mencakup beberapa kali save.",
      "**Optimistic concurrency**: kolom `[Timestamp]` (`rowversion`) membuat update gagal dengan `DbUpdateConcurrencyException` kalau barisnya sudah berubah. Di web API, bandingkan dengan versi **yang dibaca client**, yang dikirim balik bersama editannya; kalau tidak, kamu hanya menangkap perubahan di beberapa milidetik antara load dan save milikmu sendiri.",
      "`ExecuteUpdateAsync` dan `ExecuteDeleteAsync` menjalankan satu statement SQL tanpa memuat entity. Keduanya melewati change tracker dan pengecekan concurrency, jadi simpan untuk perubahan massal."
    ],
    practice: "Buat endpoint yang menampilkan order beserta nama customer memakai loop yang naif. Hitung jumlah statement SQL di log untuk 50 order, perbaiki, lalu hitung lagi. Lalu buka produk yang sama di dua tab browser, simpan harga di tab pertama, simpan harga lain di tab kedua, dan pastikan tab kedua mendapat 409.",
    teach: "Jelaskan masalah query N+1 kepada orang yang paham LINQ tapi belum pernah melihat SQL yang dihasilkannya.",
    analogy: "N+1 itu seperti pergi ke supermarket sekali untuk mengambil daftar belanja, lalu bolak-balik menyetir untuk setiap barang di daftar itu. Projection berarti membawa seluruh daftar dalam satu kali jalan.",
    pitfalls: [
      "Mengaktifkan lazy loading dan tidak pernah sadar ada banjir query.",
      "Melacak ribuan entity untuk halaman yang hanya membaca.",
      "Menambah kolom `[Timestamp]` tapi membandingkannya dengan versi yang baru saja dimuat, sehingga dua user yang mengedit form yang sama tetap saling menimpa.",
      "Memakai `ExecuteUpdateAsync` di tempat yang seharusnya menerapkan aturan bisnis atau pengecekan concurrency."
    ],
    quiz: [
      ["Kamu menampilkan 100 order dan membaca `order.Customer.Name` di dalam loop dengan lazy loading. Berapa query-nya?", ["1", "2", "Sampai 101", "100"], "Satu untuk order-nya ditambah satu per order untuk customer-nya: pola N+1."],
      ["Apa yang dilakukan `AsNoTracking()`?", ["Mematikan log SQL", "Melewati change tracking untuk entity yang dikembalikan, menghemat waktu dan memory", "Mencegah EF meng-cache query plan", "Membaca data yang belum di-commit"], "Hasil yang hanya dibaca tidak butuh snapshot di change tracker."],
      ["Seorang user memuat sebuah produk 5 menit lalu dan sekarang menyimpan editannya. Versi mana yang harus dibandingkan oleh `UPDATE` untuk menangkap perubahan di antaranya?", ["Versi yang baru saja dimuat EF di request ini", "Versi yang diterima client 5 menit lalu dan dikirim balik", "Tidak perlu versi: `[Timestamp]` menanganinya otomatis", "Versi terbaru di tabel"], "Versi yang baru dimuat sudah mencakup perubahan orang lain, jadi membandingkan dengannya tidak mendeteksi apa-apa."]
    ]
  },
  perf: {
    title: 'Performance: caching, rate limiting, dan jebakan async',
    why: "Pekerjaan performance adalah pengukuran ditambah segelintir tuas yang sudah dipahami dengan baik. Keahliannya adalah mencocokkan tuas dengan gejalanya, dan tahu apa ongkos masing-masing terhadap ketepatan data.",
    points: [
      "Ukur dulu: load test (k6, bombardier, NBomber), lalu profiling. Pantau latency p50, p95, dan p99, bukan rata-rata.",
      "**Lapisan caching**: output caching (seluruh response), `HybridCache` (object, di memory dengan level kedua bersama yang opsional), dan distributed cache seperti Redis (dipakai bersama antar instance).",
      "Setiap cache butuh jawaban atas tiga pertanyaan: apa key-nya, kapan kedaluwarsanya, dan bagaimana meng-invalidate-nya? `HybridCache` juga mencegah stampede: satu pemanggilan factory per key, berapa pun request yang datang.",
      "**Rate limiting** mengembalikan `429` saat client mengirim terlalu banyak. Beri setiap client jatahnya sendiri (partisi per user atau alamat IP), kalau tidak, satu client yang berat menghabiskan jatah semua orang.",
      "**Thread-pool starvation**: sync-over-async (`.Result`, `.Wait()`) mem-block thread; latency naik sementara CPU tetap rendah. Perbaiki dengan async dari ujung ke ujung.",
      "Kemenangan murah: kompresi response, pagination di mana-mana, `IHttpClientFactory` untuk panggilan keluar, `IAsyncEnumerable` untuk streaming hasil yang besar."
    ],
    practice: "Lakukan load test pada satu endpoint API-mu dan catat latency p95 serta request per detik. Tambahkan output caching, test lagi, lalu tuliskan peningkatannya dan seberapa basi sebuah response sekarang bisa terjadi. Lalu bombardir endpoint itu dari satu client dan pastikan client kedua tetap bisa masuk.",
    teach: "Jelaskan apa itu thread-pool starvation dan kenapa pemakaian CPU tetap rendah sementara server berhenti merespons.",
    analogy: "Thread-pool starvation itu seperti call center yang semua agennya sedang menunggu di telepon dengan pemasok: tidak ada yang bekerja keras, tapi tidak ada satu pun pelanggan yang terlayani.",
    pitfalls: [
      "Meng-cache data per user di bawah key yang sama, lalu menampilkan data satu user ke user lain.",
      "Satu ember rate limit untuk semua orang, sehingga satu client yang berisik membuat semua orang mendapat 429.",
      "Mempartisi per alamat IP di belakang load balancer tanpa mengatur forwarded headers: setiap request jadi membawa IP load balancer dan berbagi satu ember.",
      "Menambah cache sebelum mengukur di mana waktunya benar-benar habis.",
      "Melaporkan latency rata-rata, yang menyembunyikan ekor lambat yang justru dirasakan user."
    ],
    quiz: [
      ["Latency naik, CPU di 15%, dan kodenya berisi pemanggilan `.Result`. Penyebab yang paling mungkin?", ["Loop yang CPU-bound", "Thread-pool starvation karena mem-block pekerjaan async", "Garbage collector", "Serialisasi JSON yang lambat"], "Thread yang ter-block hanya menunggu, dan request yang mengantre tidak kebagian thread."],
      ["Status code apa yang seharusnya dikembalikan rate limiter?", ["401", "403", "429", "503"], "429 Too Many Requests, idealnya dengan header `Retry-After`. 503 berarti seluruh service sedang tidak tersedia."],
      ["Dengan `AddTokenBucketLimiter(\"api\", …)` tanpa partisi, satu client mengirim 10.000 request. Apa yang terjadi pada yang lain?", ["Tidak ada; setiap client punya embernya sendiri", "Mereka juga mendapat 429: semuanya berbagi satu ember", "Server-nya crash", "Hanya IP client itu yang otomatis diblokir"], "Limiter biasa adalah satu ember bersama. Partisi per user atau IP untuk memberi setiap client embernya sendiri."],
      ["Kenapa aplikasi yang berjalan di beberapa server harus memakai distributed cache untuk data bersama?", ["Selalu lebih cepat", "Cache in-memory itu per instance, jadi antar instance bisa berbeda isinya", "ASP.NET Core mewajibkannya", "Cache memory tidak bisa membuat entry kedaluwarsa"], "Setiap instance punya memory sendiri; tempat penyimpanan bersama menjaga semuanya tetap konsisten."]
    ]
  },
  arch: {
    title: 'Arsitektur: batasan, slice, dan pekerjaan di background',
    why: "Arsitektur adalah memutuskan apa yang bisa berubah tanpa merusak apa. Sebuah struktur hanya layak dipertahankan kalau kamu bisa menyebutkan alasan di baliknya, dan kamu juga harus siap mengatakan kapan ia berlebihan.",
    points: [
      "**Layered / Clean Architecture**: domain di tengah, infrastruktur di pinggir, dependency mengarah ke dalam. Ini melindungi aturan bisnis dari perubahan framework.",
      "**Vertical slice**: susun per fitur (`PlaceOrder`), bukan per layer. Setiap slice memiliki request, handler, validasi, dan query-nya sendiri.",
      "**CQRS**: pisahkan model baca dari model tulis. Berguna kalau bentuk atau beban baca dan tulis berbeda; tidak perlu untuk CRUD sederhana.",
      "Taruh aturan yang harus selalu berlaku di **domain model** (sebuah `Order` yang menolak quantity yang mustahil), bukan tersebar di endpoint. Validasi request-nya juga; pengecekan di domain adalah pertahanan terakhir.",
      "Pekerjaan yang tidak boleh menunda response dikirim ke `BackgroundService` atau queue. **Outbox pattern** menyimpan pesannya dalam transaction yang sama dengan datanya, sehingga 'tersimpan' dan 'terkirim' tidak mungkin bertentangan.",
      "Sejak .NET 8, exception yang tidak tertangani di `BackgroundService` **menghentikan seluruh aplikasi**. Tangkap dan catat di dalam loop-nya.",
      "Mulailah sebagai **modular monolith**. Pecah jadi beberapa service hanya kalau struktur tim atau kebutuhan scaling menuntutnya: distribusi menambah jenis kegagalan, bukan kesederhanaan."
    ],
    practice: "Ambil API CRUD-mu dan susun ulang satu fitur sebagai vertical slice dengan method domain yang menjaga aturannya sendiri. Lalu tulis setengah halaman: untuk tim tiga orang yang membangun tool internal, kamu akan memilih layer, slice, atau minimal API biasa, dan kenapa?",
    teach: "Jelaskan outbox pattern: kegagalan apa yang dicegahnya, dan bagaimana caranya?",
    analogy: "Outbox itu seperti menulis 'kirim surat ini' di catatan pembukuan yang sama dengan penjualannya. Meski tukang posnya terlambat atau kantor posnya tutup, suratnya tidak mungkin terlupa, karena ia bagian dari catatan penjualan itu sendiri.",
    pitfalls: [
      "Menerapkan Clean Architecture, CQRS, dan library mediator pada aplikasi CRUD dengan lima endpoint.",
      "Domain model yang anemic, di mana setiap aturan tinggal di sebuah 'service' dan entity hanya kumpulan setter.",
      "Memasukkan id identity (`INT IDENTITY`) ke pesan outbox sebelum `SaveChanges`: nilainya masih 0. Buat id-nya di kode, seperti `Order` membuat sebuah `Guid`.",
      "Loop `BackgroundService` tanpa `try/catch`, sehingga satu putaran yang gagal menghentikan seluruh aplikasi.",
      "Memecah jadi microservice untuk memperbaiki masalah desain. Hasilnya masalah desain yang terdistribusi."
    ],
    quiz: [
      ["Apa yang dijamin oleh outbox pattern?", ["Pesan langsung terkirim saat itu juga", "Pesan disimpan dalam transaction yang sama dengan perubahan datanya, sehingga tidak ada yang terjadi tanpa yang lain", "Tidak ada pesan yang terkirim dua kali", "Database tidak pernah ter-lock"], "Penulisan yang atomic, lalu pengiriman at-least-once oleh publisher di background. Penerima harus bisa menangani duplikat."],
      ["Kenapa `BackgroundService` membuat scope untuk memakai `DbContext`?", ["Demi performance", "Hosted service itu singleton dan `DbContext` itu scoped", "Scope diwajibkan untuk logging", "Untuk membuka transaction database"], "Meng-inject service scoped ke singleton adalah captive dependency; buat scope untuk setiap unit kerja."],
      ["Sebuah exception lolos dari `ExecuteAsync` di `BackgroundService` .NET 10. Secara default…", ["Dicatat di log lalu service-nya restart", "Diabaikan", "Seluruh aplikasi berhenti", "Hanya request itu yang gagal"], "Sejak .NET 8, default host adalah berhenti saat sebuah background service gagal, jadi tangkap dan catat di dalam loop."],
      ["Kapan CQRS sepadan dengan ongkosnya?", ["Selalu", "Saat model baca dan tulis sangat berbeda bentuk atau bebannya", "Kapan pun memakai EF Core", "Hanya dengan microservice"], "CQRS menambah duplikasi dan kompleksitas; manfaatnya baru terasa kalau baca dan tulis benar-benar berbeda jalan."]
    ]
  },
  prod: {
    title: 'Production: observability, resilience, dan deployment',
    why: "Kode baru selesai saat ia berjalan dengan andal untuk user, bukan saat berhasil di-compile. Artinya merancang untuk hari ketika sesuatu gagal, dan di production, cepat atau lambat sesuatu pasti gagal.",
    points: [
      "**Observability** = log, metric, dan trace. **OpenTelemetry** adalah standarnya; sebuah trace mengikuti satu request melintasi beberapa service.",
      "**Health check**: liveness ('restart aku kalau ini gagal') versus readiness ('jangan kirim traffic ke aku dulu'). Keduanya menjawab pertanyaan yang berbeda.",
      "**Resilience** untuk panggilan keluar: selalu pakai timeout, retry dengan jitter untuk gangguan sementara, dan circuit breaker supaya tidak terus menghantam dependency yang mati. `AddStandardResilienceHandler()` menyiapkan semuanya.",
      "Handler standar me-retry **semua** method, termasuk `POST`. Izinkan itu hanya kalau panggilannya idempotent, misalnya dengan idempotency key yang dihormati pihak sana; kalau tidak, matikan retry untuk method yang tidak aman.",
      "Kirim sebagai container image: konfigurasi datang dari environment, dan aplikasinya stateless sehingga instance mana pun bisa melayani request apa pun. Sejak .NET 8, container mendengarkan di port **8080**.",
      "Deploy dengan aman: migration database yang backward compatible, graceful shutdown, rilis rolling atau blue/green, dan rollback yang benar-benar sudah dites."
    ],
    practice: "Jadikan API-mu container dan jalankan bersama SQL Server memakai Docker Compose. Tambahkan OpenTelemetry dengan dashboard Aspire sebagai collector lokal, matikan database-nya sambil mengirim request, lalu jelaskan apa yang disampaikan masing-masing oleh health check, log, dan trace.",
    teach: "Jelaskan perbedaan liveness check dan readiness check, dengan contoh di mana keduanya memberi jawaban yang berbeda.",
    analogy: "Circuit breaker itu seperti sekring di rumahmu: setelah beberapa kali korsleting, ia memutus aliran supaya kabelnya tidak terbakar, lalu membiarkanmu mencoba lagi nanti.",
    pitfalls: [
      "Me-retry panggilan yang tidak idempotent sehingga pelanggan ditagih dua kali. Resilience handler standar me-retry `POST` kecuali kamu melarangnya.",
      "Satu endpoint health yang mengecek database: gangguan database sebentar saja langsung me-restart semua instance.",
      "Men-deploy migration yang menghapus kolom yang masih dibaca versi lama yang sedang berjalan.",
      "Memetakan container ke port 80 padahal aplikasi di dalamnya mendengarkan di 8080."
    ],
    quiz: [
      ["Database mati selama 20 detik. Apa yang seharusnya dilaporkan liveness probe?", ["Unhealthy, supaya aplikasinya restart", "Healthy: proses aplikasinya sendiri baik-baik saja", "Unhealthy, tapi baru setelah 10 detik", "Degraded"], "Me-restart aplikasi tidak bisa memperbaiki database. Readiness yang seharusnya gagal; liveness tidak."],
      ["Apa yang dilakukan circuit breaker setelah kegagalan berulang?", ["Me-retry lebih cepat", "Langsung menggagalkan panggilan untuk sementara alih-alih menghubungi dependency yang gagal", "Me-restart server", "Otomatis pindah ke server cadangan"], "Ia memberi waktu bagi dependency untuk pulih dan melindungi thread serta latency milikmu sendiri."],
      ["Operasi mana yang aman di-retry otomatis tanpa desain tambahan?", ["`POST /payments`", "`GET /products/5`", "`POST /orders`", "Mengirim email"], "`GET` itu idempotent; yang lain butuh idempotency key lebih dulu."]
    ]
  }
}, { tagline: 'Backend-nya: HTTP, API, dependency injection, EF Core, security, dan production.' });
