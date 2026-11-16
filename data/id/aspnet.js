// Bahasa Indonesia — track ASP.NET Core. Contoh kode tetap memakai versi aslinya.
I18N.lessons('aspnet', {
  http: {
    title: 'Cara kerja web: HTTP dalam 20 menit',
    why: "ASP.NET Core adalah mesin yang mengubah HTTP request menjadi HTTP response. Murid yang bisa membaca request dan response mentah akan bisa men-debug masalah web apa pun, di framework apa pun.",
    points: [
      "Browser (client) mengirim **request**: sebuah method (`GET`, `POST`, `PUT`, `DELETE`), URL, header, dan kadang-kadang body.",
      "Server mengembalikan **response**: status code, header, dan biasanya body (HTML atau JSON).",
      "Kelompok status: `2xx` sukses, `3xx` redirect, `4xx` client yang salah, `5xx` server yang gagal.",
      "HTTP itu **stateless**: tiap request berdiri sendiri. Identitas dikirim ulang setiap kali lewat cookie atau token.",
      "`GET` membaca dan tidak boleh mengubah data; `POST` membuat; `PUT`/`PATCH` meng-update; `DELETE` menghapus.",
      "JSON adalah format body yang umum untuk API. Tab Network di dev tools browser menampilkan setiap request — ajarkan dari sana."
    ],
    practice: "Jalankan `dotnet new web`, tambahkan endpoint `/time`, lalu panggil dari browser, dari `curl -i`, dan lihat di tab Network dev tools. Temukan method, status code, dan `Content-Type` di masing-masing.",
    teach: "Jelaskan apa yang terjadi sejak URL diketik sampai halaman muncul, dengan memakai kata request, response, status code, dan header.",
    analogy: "HTTP itu seperti memesan lewat surat di sebuah loket. Kamu mengirim amplop: apa yang kamu mau (method dan URL), catatan di bagian luar (header), dan isinya (body). Dapur mengirim amplop balasan yang dicap dengan kode hasil. Dapur tidak mengingatmu sama sekali, jadi kamu harus menunjukkan kartu member setiap kali datang.",
    pitfalls: [
      "Mengira server 'mengingat' user di antara request. Tidak; cookie atau token dikirim setiap kali.",
      "Memakai `GET` untuk operasi yang mengubah data.",
      "Mengembalikan `200 OK` dengan pesan error di body, padahal seharusnya kode `4xx`/`5xx` yang sesuai."
    ],
    quiz: [
      ["Kelompok status code mana yang berarti 'client mengirim sesuatu yang salah'?", ["2xx", "3xx", "4xx", "5xx"], "Kode 4xx seperti 400, 401, 404 menandakan ada masalah pada request-nya."],
      ["HTTP bersifat stateless artinya…", ["Server tidak bisa menyimpan data", "Tiap request membawa semua yang dibutuhkan untuk memprosesnya", "Response tidak punya body", "Hanya GET yang diizinkan"], "Protokolnya tidak menyimpan ingatan antar-request; state dikirim ulang atau dicari kembali."],
      ["Method mana yang seharusnya dipakai untuk membuat order baru?", ["`GET`", "`POST`", "`DELETE`", "`HEAD`"], "`POST` mengirim data untuk membuat resource; `GET` harus aman dan read-only."]
    ]
  },
  anatomy: {
    title: 'Anatomi aplikasi ASP.NET Core',
    why: "`Program.cs` punya dua bagian, dan hampir semua pertanyaan 'kenapa service saya tidak ketemu / middleware saya tidak jalan' terjawab dengan tahu sesuatu itu masuk bagian yang mana.",
    points: [
      "**Bagian pertama — builder**: daftarkan service (hal-hal yang dibutuhkan aplikasi) dengan `builder.Services.Add…`.",
      "**Bagian kedua — app**: susun request pipeline dengan `app.Use…` dan petakan endpoint dengan `app.Map…`.",
      "**Kestrel** adalah web server bawaan yang listen di sebuah port dan menyerahkan request ke pipeline-mu.",
      "Configuration itu berlapis: `appsettings.json` → `appsettings.{Environment}.json` → user secrets → environment variable. Sumber yang belakangan yang menang.",
      "`ASPNETCORE_ENVIRONMENT` menentukan perilaku `Development`, `Staging`, atau `Production`.",
      "File `.csproj` berisi target framework dan daftar package NuGet; `dotnet run`, `dotnet watch`, dan `dotnet build` adalah perintah sehari-harimu."
    ],
    practice: "Buat Web API dengan `dotnet new webapi`. Tambahkan setting `Greeting` di `appsettings.json`, baca di sebuah endpoint, lalu override dengan environment variable dan pastikan nilai mana yang menang.",
    teach: "Jelaskan dua bagian `Program.cs`: apa yang ditulis sebelum `builder.Build()` dan apa yang ditulis sesudahnya.",
    analogy: "Membuka restoran itu ada dua fase. Sebelum hari pembukaan, kamu merekrut staf dan mengisi dapur (mendaftarkan service). Begitu pintu dibuka, kamu menentukan jalur yang dilewati setiap tamu: meja penerima tamu, penitipan jaket, meja makan, kasir (pipeline). Kamu tidak bisa merekrut koki di tengah-tengah melayani tamu.",
    pitfalls: [
      "Mendaftarkan service setelah `builder.Build()` — sudah terlambat.",
      "Meng-commit secret ke `appsettings.json`. Pakai user secrets di lokal, dan environment variable atau vault di production.",
      "Menganggap `appsettings.Development.json` ikut dipakai di production."
    ],
    quiz: [
      ["Di mana `builder.Services.AddScoped<…>()` harus dipanggil?", ["Setelah `app.Run()`", "Sebelum `builder.Build()`", "Di dalam controller", "Di `appsettings.json`"], "Service collection dibekukan saat app di-build."],
      ["Key yang sama ada di `appsettings.json` dan di environment variable. Secara default, mana yang menang?", ["`appsettings.json`", "Environment variable", "Yang lebih panjang", "Melempar exception"], "Configuration provider yang ditambahkan belakangan menimpa yang lebih awal; environment variable datang setelah file JSON."],
      ["Apa itu Kestrel?", ["Sebuah database", "Web server cross-platform bawaan ASP.NET Core", "Bundler JavaScript", "Library logging"], "Kestrel listen untuk koneksi HTTP dan meneruskan request ke middleware pipeline."]
    ]
  },
  routing: {
    title: 'Routing, endpoint, dan model binding',
    why: "API pada dasarnya adalah daftar endpoint. Memetakan URL ke kode, membaca input dengan aman, dan mengembalikan status code yang benar adalah pekerjaan harian seorang backend developer.",
    points: [
      "**Routing** mencocokkan method + pola URL dengan sebuah handler: `GET /api/products/{id}`.",
      "**Model binding** otomatis mengisi parameter handler dari route, query string, header, dan body JSON.",
      "Kembalikan result yang tepat: `Ok(value)` 200, `Created…` 201, `NoContent()` 204, `BadRequest()` 400, `NotFound()` 404.",
      "**Minimal API** (`app.MapGet`) itu ringkas; **controller** mengelompokkan endpoint yang berkaitan dalam satu class. Keduanya berjalan di atas routing engine yang sama.",
      "Konvensi REST: kata benda untuk URL (`/products/5`), HTTP method sebagai kata kerjanya. Bukan `/getProduct?id=5`.",
      "Route constraint seperti `{id:int}` menolak input yang salah sebelum kodemu dijalankan."
    ],
    practice: "Tambahkan `PUT /api/products/{id}` yang mengganti sebuah product dan mengembalikan 404 kalau product-nya tidak ada. Tes kelima endpoint dengan file `.http` atau `curl`, dan pastikan setiap status code-nya benar.",
    teach: "Jelaskan bagaimana ASP.NET Core tahu bahwa parameter `id` berasal dari URL sedangkan `input` berasal dari request body.",
    analogy: "Routing itu resepsionis hotel: 'kamar 204? lantai dua, sebelah kiri.' Model binding itu bellboy yang membongkar kopermu ke laci yang tepat — route value di sini, query value di sana, body JSON ditata jadi sebuah object — bahkan sebelum kamu masuk kamar.",
    pitfalls: [
      "Mengembalikan 200 dengan `null` saat data tidak ditemukan. Kembalikan 404.",
      "Mengekspos entity database langsung sebagai request dan response body. Pakai DTO/record.",
      "Kata kerja di URL (`/api/createProduct`). Biarkan HTTP method yang membawa kata kerjanya."
    ],
    quiz: [
      ["Sebuah `POST` berhasil membuat resource. Status code terbaik?", ["200", "201", "204", "302"], "201 Created, idealnya dengan header `Location` yang menunjuk ke resource baru itu."],
      ["Pada `app.MapGet(\"/items/{id:int}\", (int id) => …)`, request ke `/items/abc` mengembalikan…", ["500", "404", "200 dengan id = 0", "400"], "Constraint `:int` tidak cocok, jadi tidak ada route yang ditemukan."],
      ["Pada POST, dari mana parameter complex type seperti `CreateProduct input` di-bind secara default?", ["Query string", "Route", "Body JSON", "Cookie"], "Complex type di-bind dari body; simple type di-bind dari route atau query."]
    ]
  },
  middleware: {
    title: 'Middleware pipeline',
    why: "Authentication, CORS, error handling, logging, dan routing semuanya middleware. Bug urutan di sini termasuk kesalahan ASP.NET Core yang paling sering terjadi, dan tidak kelihatan kecuali gambarannya sudah ada di kepalamu.",
    points: [
      "Request melewati rantai middleware **sesuai urutan pendaftarannya**, dan response berjalan kembali melewatinya dengan urutan **terbalik**.",
      "Tiap middleware boleh mengerjakan sesuatu sebelum `next()`, memanggil `next()`, mengerjakan sesuatu sesudahnya — atau melakukan **short-circuit** dengan tidak memanggil `next()` sama sekali.",
      "Urutan itu penting: exception handling paling awal (supaya membungkus semuanya), lalu HTTPS, static files, routing, CORS, authentication, authorization, endpoint.",
      "`UseAuthentication` menjawab 'kamu siapa?'; `UseAuthorization` menjawab 'boleh melakukan ini?'. Authorization sebelum authentication tidak akan pernah berhasil.",
      "Custom middleware cukup `app.Use(async (context, next) => { … })` atau sebuah class dengan `InvokeAsync`.",
      "Endpoint filter dan action filter adalah hook yang lebih halus, yang berjalan di dalam tahap endpoint."
    ],
    practice: "Tulis middleware yang menolak request tanpa header `X-Api-Key` dengan 401, tanpa memanggil `next`. Taruh sebelum lalu sesudah `UseExceptionHandler`, dan jelaskan apa yang berubah.",
    teach: "Jelaskan kenapa urutan middleware itu penting, dengan authentication dan authorization sebagai contohnya.",
    analogy: "Keberangkatan di bandara: check-in, security, imigrasi, gate. Semua orang melewatinya dengan urutan itu, dan pos mana pun bisa menyuruhmu balik. Imigrasi tidak mungkin dijalankan sebelum ada yang mengecek kamu siapa. Saat pulang, kamu melewati pos yang sama dengan urutan terbalik.",
    pitfalls: [
      "Menaruh `UseAuthorization` sebelum `UseAuthentication` lalu bingung kenapa semua request kena 401.",
      "Menulis ke response setelah memanggil `next()` padahal response-nya sudah mulai dikirim.",
      "Lupa bahwa kode setelah `await next()` dijalankan saat perjalanan keluar."
    ],
    quiz: [
      ["Middleware A didaftarkan sebelum B. Di jalur response, mana yang lebih dulu menjalankan kode 'sesudah'-nya?", ["A", "B", "Keduanya bersamaan", "Tidak ada"], "Pipeline dibuka dengan urutan terbalik: B selesai dulu, baru A."],
      ["Apa maksud 'short-circuit'?", ["Aplikasinya crash", "Sebuah middleware mengembalikan response tanpa memanggil `next`", "Dua middleware jalan paralel", "Request-nya dicoba ulang"], "Middleware berikutnya dan endpoint-nya tidak pernah dijalankan — seperti pada 401 atau response dari cache."],
      ["Kenapa middleware exception handling sebaiknya didaftarkan paling awal?", ["Karena paling cepat", "Supaya ia membungkus dan menangkap exception dari semua yang ada sesudahnya", "Karena butuh request body", "Sekadar konvensi"], "Sebuah middleware hanya bisa menangkap exception dari komponen yang ia panggil lewat `next`."]
    ]
  },
  di: {
    title: 'Dependency injection dan service lifetime',
    why: "DI adalah tulang punggung ASP.NET Core. Salah memilih lifetime menyebabkan data basi, race pada shared state, dan error terkenal 'cannot consume scoped service from singleton'.",
    points: [
      "Class menyatakan kebutuhannya di constructor; **container** yang membuat dan menyediakannya. Class tidak me-`new` dependency-nya sendiri.",
      "**Transient**: instance baru setiap kali diminta. Untuk service yang ringan dan stateless.",
      "**Scoped**: satu instance per HTTP request. Default untuk apa pun yang menyentuh database — `DbContext` itu scoped.",
      "**Singleton**: satu instance sepanjang umur aplikasi. Harus thread-safe dan tidak boleh menyimpan state per-user.",
      "**Captive dependency**: singleton yang memegang scoped service membuatnya hidup selamanya. Jangan pernah meng-inject lifetime yang lebih pendek ke yang lebih panjang.",
      "DI memberi testability (bisa diganti dengan fake), satu titik konfigurasi, dan disposal otomatis."
    ],
    practice: "Daftarkan sebuah service dengan property `Guid Id = Guid.NewGuid()` tiga kali — transient, scoped, dan singleton — lalu kembalikan ketiga ID itu dari endpoint yang meng-inject masing-masing dua kali. Refresh dan jelaskan polanya.",
    teach: "Jelaskan ketiga service lifetime dan kenapa `DbContext` tidak boleh di-inject ke singleton.",
    analogy: "Bayangkan sebuah hotel. **Singleton** itu jam di lobi: satu untuk semua orang, selamanya. **Scoped** itu kunci kamarmu: milikmu selama menginap, kunci yang sama setiap kali kamu minta di resepsionis, dikembalikan saat checkout. **Transient** itu gelas kertas: yang baru setiap kali kamu minta.",
    pitfalls: [
      "Menyimpan data per-user di singleton — akibatnya semua user bisa melihatnya.",
      "Meng-inject scoped service ke singleton (captive dependency). Pakai `IServiceScopeFactory` sebagai gantinya.",
      "Service locator: mengambil service dari `IServiceProvider` di mana-mana alih-alih mendeklarasikannya di constructor."
    ],
    quiz: [
      ["Dalam satu HTTP request, sebuah scoped service di-inject ke dua class berbeda. Ada berapa instance?", ["Satu", "Dua", "Satu per thread", "Nol sampai dipakai pertama kali, lalu dua"], "Scoped berarti satu instance per scope, dan tiap request adalah satu scope."],
      ["Lifetime apa yang dipakai `AddDbContext` secara default?", ["Singleton", "Scoped", "Transient", "Static"], "`DbContext` adalah unit of work untuk satu request dan tidak thread-safe."],
      ["Apa itu captive dependency?", ["Circular reference", "Service berumur pendek yang dipegang oleh service berumur lebih panjang", "Service tanpa interface", "Service yang sudah di-dispose"], "Misalnya singleton yang memegang `DbContext` scoped — ia tidak pernah dilepas."]
    ]
  },
  efcore: {
    title: 'EF Core: database-mu dalam C#',
    why: "EF Core adalah tempat C#, LINQ, dan SQL bertemu. Kalau dipakai dengan baik, boilerplate hilang; kalau dipakai membabi buta, ia menghasilkan query lambat yang tidak kelihatan. Ajari murid untuk selalu melihat SQL-nya.",
    points: [
      "`DbContext` adalah sesi dengan database; tiap `DbSet<T>` dipetakan ke sebuah tabel dan tiap entity class ke sebuah baris.",
      "LINQ pada `DbSet` diterjemahkan jadi SQL dan dieksekusi saat di-enumerate (`ToListAsync`, `FirstOrDefaultAsync`).",
      "**Migration** mem-versioning schema dalam bentuk kode: `dotnet ef migrations add Init`, `dotnet ef database update`.",
      "**Change tracking**: load sebuah entity, ubah, panggil `SaveChangesAsync` — EF yang membuat `UPDATE`-nya.",
      "Relationship memakai navigation property; load data yang berelasi secara eksplisit dengan `Include`, atau lebih baik lagi, lakukan projection dengan `Select`.",
      "Parameter selalu dikirim sebagai SQL parameter — query LINQ aman dari SQL injection."
    ],
    practice: "Tambahkan EF Core dengan SQLite ke API products-mu, buat sebuah migration, dan ganti list in-memory-nya. Nyalakan `LogTo(Console.WriteLine)` lalu baca SQL untuk tiap endpoint. Apakah sama dengan yang akan kamu tulis sendiri?",
    teach: "Jelaskan bagaimana ekspresi LINQ di C# seperti `db.Products.Where(p => p.Price < 100)` berubah menjadi query SQL.",
    analogy: "EF Core itu penerjemah di antara dua orang yang berbeda bahasa. Kamu bicara dengan object C#; database bicara dengan tabel SQL. Penerjemah yang bagus itu anugerah — tapi kalau kamu tidak pernah belajar bahasa satunya, kamu tidak akan sadar saat terjemahannya bertele-tele atau salah.",
    pitfalls: [
      "Tidak pernah melihat SQL yang dihasilkan.",
      "Memanggil `ToList()` terlalu awal lalu memfilter di memory, bukan di database.",
      "Mengembalikan entity yang masih di-track langsung dari API, sehingga terjadi serialization cycle dan data terekspos berlebihan."
    ],
    quiz: [
      ["Kapan `db.Products.Where(p => p.Price < 100)` mengakses database?", ["Saat itu juga", "Saat di-enumerate, misalnya oleh `ToListAsync()`", "Saat aplikasi start", "Saat `SaveChanges` dipanggil"], "`IQueryable` itu deferred, sama seperti LINQ to Objects."],
      ["Apa isi sebuah migration?", ["Backup database", "Kode yang mendeskripsikan perubahan schema, lengkap dengan langkah up dan down", "Seed data saja", "Binary SQL Server hasil compile"], "Migration adalah perubahan schema yang ber-versi dan bisa di-review."],
      ["Kamu me-load sebuah entity lalu mengubah satu property. Apa yang menuliskannya ke database?", ["Tidak ada, otomatis saat berubah", "`db.SaveChangesAsync()`", "`db.Update()` selalu wajib", "Men-dispose context-nya"], "Change tracker mendeteksi perubahannya; `SaveChanges` yang mengirim UPDATE-nya."]
    ]
  },
  validation: {
    title: 'DTO, validasi, dan error handling',
    why: "API adalah kontrak dengan orang yang tidak kamu kenal. Memvalidasi setiap input dan mengembalikan error yang konsisten serta bisa dibaca mesin adalah pembeda antara demo dan produk.",
    points: [
      "**Jangan pernah percaya input.** Validasi di boundary dan kembalikan `400 Bad Request` beserta detailnya.",
      "**DTO** (record untuk request dan response) memisahkan kontrak API dari entity database dan mencegah over-posting.",
      "Data annotation (`[Required]`, `[Range]`, `[StringLength]`) atau FluentValidation mengekspresikan aturan secara deklaratif.",
      "**ProblemDetails** (RFC 9457) adalah bentuk JSON standar untuk error: `type`, `title`, `status`, `detail`, `errors`.",
      "Tangani exception tak terduga secara terpusat dengan `UseExceptionHandler` / `IExceptionHandler` — log detailnya, kembalikan 500 yang generik. Jangan pernah membocorkan stack trace.",
      "Kegagalan yang memang sudah diperkirakan (not found, conflict, validasi) bukan exception; kembalikan result code untuk itu."
    ],
    practice: "Tambahkan validasi ke setiap endpoint write di API-mu. Kirim lima request tidak valid yang berbeda dan pastikan masing-masing mengembalikan ProblemDetails `400` yang menyebutkan field yang salah. Lalu sengaja lempar sebuah exception dan pastikan tidak ada stack trace yang sampai ke client di mode Production.",
    teach: "Jelaskan kenapa API sebaiknya memakai DTO request/response yang terpisah alih-alih menerima dan mengembalikan entity database.",
    analogy: "DTO itu formulir pesanan di loket; entity itu catatan gudang. Customer mengisi formulir — mereka tidak boleh masuk ke gudang lalu mengedit buku stok, termasuk kolom yang memang tidak seharusnya mereka lihat seperti harga modal atau `IsAdmin`.",
    pitfalls: [
      "Binding langsung ke entity sehingga client bisa mengisi field seperti `IsAdmin` (over-posting).",
      "Memakai exception untuk kegagalan validasi.",
      "Mengembalikan bentuk error yang berbeda-beda dari endpoint yang berbeda."
    ],
    quiz: [
      ["Client mengirim harga negatif. Response yang benar?", ["500", "200 dengan string error", "400 dengan detail validasi", "404"], "Input client yang tidak valid itu 4xx; 400 dengan detail per field membuat client bisa memperbaikinya."],
      ["Masalah apa yang dicegah oleh request DTO?", ["Query lambat", "Over-posting: client mengisi property yang tidak seharusnya mereka kontrol", "Memory leak", "Error CORS"], "Hanya field yang ada di DTO yang bisa di-bind dari request."],
      ["Apa yang seharusnya dikembalikan untuk unhandled exception di production?", ["Stack trace, untuk debugging", "ProblemDetails 500 yang generik, dengan detail di-log di sisi server", "200", "SQL yang gagal"], "Detail internal membantu penyerang; log itu untukmu, response itu untuk client."]
    ]
  },
  auth: {
    title: 'Authentication dan authorization',
    why: "Bug security adalah bug yang paling mahal. Setiap backend developer harus bisa menjelaskan siapa pemanggilnya, bagaimana server mengetahuinya, dan bagaimana tiap endpoint memutuskan apa yang boleh dilakukan.",
    points: [
      "**Authentication** = membuktikan identitas. **Authorization** = memutuskan izin. Dua langkah terpisah, dua middleware terpisah.",
      "**Cookie** cocok untuk aplikasi browser di site yang sama; **JWT bearer token** cocok untuk API yang dipanggil SPA, aplikasi mobile, dan service lain.",
      "JWT terdiri dari tiga bagian base64: header, payload (claims), signature. JWT itu **di-sign, bukan dienkripsi** — siapa pun bisa membacanya; tidak ada yang bisa mengubahnya tanpa ketahuan.",
      "Server memvalidasi signature, issuer, audience, dan expiry di setiap request. Buat access token berumur pendek dan pakai refresh token.",
      "Lakukan authorization dengan role, **policy** (`RequireClaim`, custom requirement), dan pengecekan berbasis resource ('apakah order ini milikmu?').",
      "Jangan pernah menyimpan password: simpan slow hash yang di-salt (ASP.NET Core Identity melakukan ini) atau serahkan ke identity provider lewat OpenID Connect. Konfigurasikan CORS secara eksplisit untuk origin SPA."
    ],
    practice: "Amankan API-mu dengan JWT, pakai `dotnet user-jwts create` untuk token lokal. Tambahkan satu endpoint khusus admin dan satu endpoint 'hanya data milik sendiri'. Buktikan lewat request bahwa 401 (tanpa token), 403 (role salah), dan 404 (order milik orang lain) masing-masing terjadi.",
    teach: "Jelaskan perbedaan 401 dan 403, dan kenapa JWT bisa dipercaya padahal siapa pun bisa membaca isinya.",
    analogy: "Authentication itu menunjukkan paspor di perbatasan; authorization itu visa di dalamnya yang menyebutkan apa yang boleh kamu lakukan. JWT itu gelang festival: petugas langsung tahu aksesnya apa saja, masa berlakunya habis malam ini, dan segel anti-rusaknya (signature) membuktikan gelang itu memang dikeluarkan loket resmi.",
    pitfalls: [
      "Menaruh secret atau data sensitif di payload JWT — siapa pun bisa membacanya.",
      "Hanya mengecek 'sudah login' dan lupa mengecek kepemilikan resource yang spesifik (IDOR).",
      "Access token berumur panjang tanpa rencana revocation; menyimpan token di `localStorage` yang bisa dibaca XSS apa pun."
    ],
    quiz: [
      ["User yang sudah login tapi tidak punya role Admin memanggil endpoint admin. Status-nya?", ["401", "403", "404", "500"], "401 berarti belum terautentikasi; 403 berarti sudah terautentikasi tapi tidak diizinkan."],
      ["Apa yang dijamin oleh signature JWT?", ["Payload-nya rahasia", "Token dikeluarkan oleh pemegang key dan tidak diubah", "Token tidak pernah kedaluwarsa", "User-nya admin"], "Signing memberi integrity dan authenticity, bukan confidentiality."],
      ["Pengecekan mana yang mencegah user A membaca order milik user B di `/orders/17`?", ["`[Authorize]` saja", "Pengecekan berbasis resource bahwa order itu milik pemanggil", "HTTPS", "CORS"], "Terautentikasi saja tidak cukup; kepemilikan harus diverifikasi per resource."]
    ]
  },
  config: {
    title: 'Options, logging, dan environment',
    why: "Build yang sama harus jalan di laptop, di CI, dan di production dengan setting berbeda — dan ketika rusak jam 3 pagi, log adalah satu-satunya saksi.",
    points: [
      "**Options pattern** mem-bind satu section config ke class ber-type: `IOptions<T>` (tetap), `IOptionsSnapshot<T>` (per request), `IOptionsMonitor<T>` (live reload).",
      "Validasi options saat startup dengan `ValidateDataAnnotations().ValidateOnStart()` — fail fast, bukan baru gagal di request pertama.",
      "**Structured logging**: `log.LogInformation(\"Order {OrderId} placed\", id)` menjaga `OrderId` tetap jadi field yang bisa dicari. Jangan pernah pakai string interpolation di pemanggilan log.",
      "Log level: Trace, Debug, Information, Warning, Error, Critical. Atur per kategori di `appsettings`.",
      "Secret: user secrets saat development, environment variable atau vault (Azure Key Vault, AWS Secrets Manager) di production — jangan pernah di source control.",
      "Pakai scope atau `Activity` untuk menempelkan correlation ID supaya satu request bisa dilacak lintas service."
    ],
    practice: "Pindahkan semua magic string dan magic number di API-mu ke options class yang tervalidasi. Sengaja rusak satu setting dan pastikan aplikasinya menolak start dengan pesan yang jelas.",
    teach: "Jelaskan kenapa `log.LogInformation(\"User {Id} logged in\", id)` lebih baik daripada memakai interpolated string.",
    analogy: "Options itu panel pengaturan sebuah alat elektronik: satu tempat dengan label yang jelas, dicek saat dicolokkan, bukan baru ketahuan rusak di tengah mencuci. Structured log itu lemari arsip dengan map berlabel, bukan tumpukan catatan tulisan tangan — kamu bisa minta 'semua hal tentang order 42'.",
    pitfalls: [
      "Meng-inject `IConfiguration` di mana-mana lalu membaca key berupa string.",
      "Pesan log dengan string interpolation, yang merusak strukturnya dan tetap mengalokasikan memory walaupun level-nya dimatikan.",
      "Me-log secret, token, atau data pribadi."
    ],
    quiz: [
      ["Apa yang diubah oleh `ValidateOnStart()`?", ["Tidak ada", "Options yang tidak valid gagal saat aplikasi startup, bukan saat pertama dipakai", "Options di-reload otomatis", "Validasi dilewati di production"], "Fail fast saat startup mengubah bug runtime yang tersembunyi jadi kegagalan deployment yang jelas terlihat."],
      ["Interface options mana yang mencerminkan perubahan configuration tanpa restart?", ["`IOptions<T>`", "`IOptionsMonitor<T>`", "`IConfigurationRoot`", "Hanya `IOptionsFactory<T>`"], "`IOptionsMonitor` adalah singleton yang memantau perubahan; `IOptions` dihitung sekali saja."],
      ["Di mana password database production sebaiknya disimpan?", ["`appsettings.json` di git", "Environment variable atau secret vault", "Konstanta di kode", "README"], "Secret harus berada di luar source control dan di-inject saat deploy."]
    ]
  },
  testing: {
    title: 'Testing API: unit dan integration',
    why: "Test adalah cara mengubah kode tanpa rasa takut. Test juga alat mengajar terbaik: sebuah test adalah pernyataan yang bisa dieksekusi tentang apa yang seharusnya dilakukan kode.",
    points: [
      "**Unit test** mengecek satu class dengan dependency yang dipalsukan. Cepat, banyak, presisi.",
      "**Integration test** menjalankan pipeline sungguhan di memory dengan `WebApplicationFactory<Program>` — routing, DI, filter, serialization, semuanya.",
      "Susun setiap test sebagai **Arrange, Act, Assert**. Satu behavior per test, diberi nama sesuai behavior-nya.",
      "Di test, lebih baik pakai database sungguhan (Testcontainers atau SQLite) daripada EF in-memory provider, yang perilakunya berbeda dari database asli.",
      "Tes behavior-nya, bukan implementasinya: assert pada output dan efek yang bisa diamati, bukan pada private method mana yang dipanggil.",
      "Test pyramid: banyak unit test, lebih sedikit integration test, segelintir end-to-end test."
    ],
    practice: "Tulis integration test untuk setiap endpoint API products-mu, mencakup happy path dan minimal satu skenario gagal untuk tiap endpoint. Lalu ubah satu status code di API dan lihat tepat satu test gagal dengan pesan yang mudah dibaca.",
    teach: "Jelaskan perbedaan unit test dan integration test, dan apa yang bisa ditangkap masing-masing tapi tidak bisa ditangkap yang lain.",
    analogy: "Unit test mengecek tiap batu bata kokoh. Integration test mengecek temboknya berdiri tegak. Kamu butuh dua-duanya: bata yang sempurna pun bisa dipasang miring, dan saat tembok roboh, kamu ingin cepat tahu apakah penyebabnya sebuah bata.",
    pitfalls: [
      "Me-mock semuanya sampai test-nya hanya memverifikasi mock.",
      "Test yang saling bergantung atau bergantung pada urutan eksekusi.",
      "Percaya bahwa EF in-memory provider berperilaku seperti SQL Server (tidak ada constraint, tidak ada SQL sungguhan)."
    ],
    quiz: [
      ["Apa yang kamu dapat dari `WebApplicationFactory<Program>`?", ["Mock untuk database", "Aplikasi aslimu yang di-host di memory, plus `HttpClient` untuk memanggilnya", "Deployment ke production", "Sebuah browser"], "Ia menjalankan pipeline sungguhan di dalam proses test, jadi routing, DI, dan middleware ikut diuji."],
      ["Tiga bagian dari test yang terstruktur baik adalah…", ["Build, Run, Deploy", "Arrange, Act, Assert", "Given, Then, Finally", "Setup, Loop, Exit"], "Siapkan input-nya (arrange), lakukan satu aksi (act), periksa hasilnya (assert)."],
      ["Kenapa database sungguhan lebih baik daripada EF in-memory provider untuk integration test?", ["Lebih cepat", "In-memory provider tidak menegakkan constraint dan tidak menjalankan SQL sungguhan", "Tidak butuh setup", "xUnit mewajibkannya"], "Bug di translation, constraint, dan transaction hanya muncul kalau diuji dengan engine sungguhan."]
    ]
  },
  efadv: {
    title: 'EF Core lebih dalam: tracking, N+1, dan concurrency',
    why: "Kebanyakan aplikasi ASP.NET Core yang lambat itu lambat karena segelintir kesalahan EF Core. Masing-masing punya bentuk yang mudah dikenali di log SQL, dan masing-masing punya perbaikan satu baris.",
    points: [
      "**Masalah N+1**: satu query untuk daftarnya, lalu satu query lagi per baris untuk data yang berelasi. Perbaiki dengan projection (`Select`) atau `Include`.",
      "Query read-only sebaiknya memakai `AsNoTracking()` atau projection ke DTO — tanpa overhead change tracker.",
      "`Include` atas beberapa collection melipatgandakan baris (cartesian explosion); `AsSplitQuery()` menukarnya dengan beberapa query.",
      "`SaveChanges` membungkus perubahannya dalam satu transaction. Pakai transaction eksplisit hanya kalau perlu mencakup beberapa save.",
      "**Optimistic concurrency**: `rowversion`/concurrency token membuat update gagal dengan `DbUpdateConcurrencyException` kalau ada orang lain yang lebih dulu mengubah baris itu.",
      "Pekerjaan bulk: `ExecuteUpdateAsync` dan `ExecuteDeleteAsync` menjalankan satu statement SQL tanpa me-load entity."
    ],
    practice: "Buat endpoint yang menampilkan daftar order beserta nama customer memakai loop yang naif. Hitung jumlah statement SQL di log untuk 50 order. Perbaiki, lalu hitung lagi. Setelah itu simulasikan dua user mengedit satu product dan kembalikan 409 ke user kedua.",
    teach: "Jelaskan masalah N+1 query ke orang yang paham LINQ tapi belum pernah melihat SQL yang dihasilkannya.",
    analogy: "N+1 itu pergi ke supermarket sekali untuk mengambil daftar belanjanya, lalu bolak-balik naik mobil untuk tiap barang di daftar itu. Projection itu membawa seluruh daftar dalam satu kali jalan. Optimistic concurrency itu mengedit dokumen bersama yang memperingatkan 'dokumen ini sudah berubah sejak kamu membukanya', bukan diam-diam menimpa pekerjaan rekanmu.",
    pitfalls: [
      "Menyalakan lazy loading dan tidak pernah sadar ada badai query.",
      "Men-track ribuan entity untuk halaman yang read-only.",
      "Update last-write-wins yang diam-diam membuang perubahan user lain."
    ],
    quiz: [
      ["Kamu menampilkan 100 order dan mengakses `order.Customer.Name` di dalam loop dengan lazy loading. Berapa query?", ["1", "2", "Sampai 101", "100.000"], "Satu untuk order-nya, ditambah satu per order untuk customer-nya — pola N+1."],
      ["Apa yang dilakukan `AsNoTracking()`?", ["Mematikan logging", "Melewati change tracking untuk entity yang dikembalikan, sehingga hemat waktu dan memory", "Mencegah SQL injection", "Membuka transaction"], "Hasil yang read-only tidak butuh snapshot di change tracker."],
      ["Bagaimana kolom `[Timestamp]` melindungi update?", ["Me-lock baris untuk pembacaan", "UPDATE menyertakan versi lama di WHERE-nya, jadi 0 baris yang terpengaruh kalau sudah diubah orang lain", "Mengenkripsi barisnya", "Otomatis mencoba ulang"], "Nol baris terpengaruh berubah jadi `DbUpdateConcurrencyException`, yang bisa kamu ubah jadi 409."]
    ]
  },
  perf: {
    title: 'Performance: caching, rate limiting, dan jebakan async',
    why: "Pekerjaan performance itu pengukuran ditambah segelintir tuas yang sudah dipahami betul. Seorang expert tahu tuas mana yang cocok untuk gejala apa, dan berapa harga tiap tuas dari sisi correctness.",
    points: [
      "Ukur dulu: load test (k6, bombardier, NBomber), lalu profile. Pantau latency p50, p95, dan p99, bukan rata-ratanya.",
      "**Lapisan caching**: response/output caching (seluruh response), `HybridCache`/`IMemoryCache` (object di dalam proses), distributed cache seperti Redis (dipakai bersama antar-instance).",
      "Setiap cache butuh jawaban atas tiga pertanyaan: apa key-nya, kapan expire, dan bagaimana invalidation-nya? Waspadai stampede saat hot key expire.",
      "Middleware **rate limiting** (fixed window, sliding window, token bucket, concurrency) melindungi service dari penyalahgunaan dan overload; kembalikan `429`.",
      "**Thread-pool starvation**: sync-over-async (`.Result`, `.Wait()`) mem-block thread; latency naik sementara CPU tetap rendah. Perbaiki dengan async dari ujung ke ujung.",
      "Kemenangan murah: response compression, pagination di mana-mana, `HttpClientFactory` untuk panggilan keluar, streaming hasil besar dengan `IAsyncEnumerable`."
    ],
    practice: "Load test satu endpoint API-mu dan catat latency p95 serta request per detik. Tambahkan output caching, tes lagi, lalu tulis keuntungannya sekaligus seberapa basi sebuah response sekarang bisa terjadi.",
    teach: "Jelaskan apa itu thread-pool starvation dan kenapa pemakaian CPU tetap rendah padahal server jadi tidak responsif.",
    analogy: "Cache itu papan tulis berisi jawaban kemarin: dibacanya instan, tapi bisa jadi sudah basi. Rate limiting itu aturan pintu masuk kelab malam. Thread-pool starvation itu call center yang semua agennya sedang di-hold oleh supplier — tidak ada yang sibuk bekerja, tapi tidak ada customer yang bisa tersambung.",
    pitfalls: [
      "Meng-cache data per-user dengan key bersama sehingga satu user melihat data user lain.",
      "Menambah cache sebelum mengukur ke mana sebenarnya waktu habis.",
      "Melaporkan latency rata-rata, yang menyembunyikan slow tail yang justru dirasakan user."
    ],
    quiz: [
      ["Latency naik, CPU di 15%, dan di kodenya ada pemanggilan `.Result`. Kemungkinan penyebabnya?", ["Loop yang CPU-bound", "Thread-pool starvation akibat mem-block pekerjaan async", "RAM terlalu kecil", "JSON serialization yang lambat"], "Thread yang ter-block hanya menunggu, tidak bekerja; request yang mengantre tidak kebagian thread."],
      ["Status code apa yang seharusnya dikembalikan rate limiter?", ["401", "403", "429", "503"], "429 Too Many Requests, idealnya dengan header `Retry-After`."],
      ["Kenapa aplikasi yang jalan di beberapa server harus memakai distributed cache untuk data bersama?", ["Selalu lebih cepat", "In-memory cache itu per-instance, jadi antar-instance bisa tidak sepakat", "ASP.NET mewajibkannya", "Memory cache tidak bisa expire"], "Tiap instance punya memory sendiri; store bersama menjaga semuanya konsisten."]
    ]
  },
  arch: {
    title: 'Arsitektur: boundary, slice, dan background work',
    why: "Arsitektur adalah memutuskan apa yang boleh berubah tanpa merusak apa. Seorang expert bisa mempertahankan sebuah struktur dengan menyebutkan faktor pendorongnya — dan juga bisa bilang kapan struktur itu berlebihan.",
    points: [
      "**Layered / Clean Architecture**: domain di tengah, infrastructure di tepi, dependency mengarah ke dalam. Melindungi business rule dari gonta-ganti framework.",
      "**Vertical slice**: susun berdasarkan fitur (`Orders/PlaceOrder`), bukan berdasarkan layer. Tiap slice punya request, handler, validasi, dan query-nya sendiri. Minim seremoni, cohesion tinggi.",
      "**CQRS**: pisahkan read model dari write model. Berguna kalau read dan write punya bentuk atau skala yang berbeda; tidak perlu untuk CRUD sederhana.",
      "Taruh invariant di **domain model** (sebuah `Order` yang menolak state tidak valid), jangan tercecer di berbagai controller.",
      "Pekerjaan yang tidak boleh memperlambat response dipindahkan ke `BackgroundService` atau queue. Pakai **outbox pattern** supaya 'simpan ke DB' dan 'publish message' tidak mungkin tidak sinkron.",
      "Mulai sebagai **modular monolith**. Pecah jadi beberapa service hanya kalau struktur tim atau kebutuhan scaling menuntutnya — distribusi menambah failure mode, bukan kesederhanaan."
    ],
    practice: "Ambil API CRUD-mu dan susun ulang satu fitur sebagai vertical slice dengan domain method yang kaya. Lalu tulis setengah halaman: untuk tim tiga orang yang membangun internal tool, kamu pilih layer, slice, atau minimal API polos — dan kenapa?",
    teach: "Jelaskan outbox pattern: kegagalan apa yang dicegahnya, dan bagaimana caranya?",
    analogy: "Layer itu gedung yang disusun per profesi: semua tukang ledeng di lantai 1, semua tukang listrik di lantai 2. Slice disusun per apartemen: semua kebutuhan satu keluarga ada di balik satu pintu. Outbox itu menulis 'kirim surat ini' di entri buku besar yang sama dengan transaksi penjualannya, jadi suratnya tidak akan terlupa walaupun tukang posnya terlambat.",
    pitfalls: [
      "Menerapkan Clean Architecture, CQRS, dan MediatR untuk aplikasi CRUD lima endpoint.",
      "Anemic domain model: semua aturan tinggal di sebuah 'service' dan entity-nya cuma kumpulan setter.",
      "Memecah jadi microservices untuk memperbaiki masalah desain — hasilnya masalah desain yang terdistribusi."
    ],
    quiz: [
      ["Apa yang dijamin outbox pattern?", ["Message terkirim seketika", "Message dicatat dalam transaction yang sama dengan perubahan datanya, jadi tidak mungkin salah satunya terjadi tanpa yang lain", "Tidak akan pernah ada duplikat", "Database tidak pernah ter-lock"], "Write yang atomic, lalu at-least-once delivery oleh background publisher. Consumer-nya harus idempotent."],
      ["Kenapa `BackgroundService` membuat scope untuk memakai `DbContext`?", ["Demi performance", "Hosted service itu singleton sedangkan `DbContext` itu scoped", "Scope mengaktifkan logging", "Itu opsional"], "Meng-inject scoped service ke singleton adalah captive dependency; buat satu scope per unit of work."],
      ["Kapan CQRS sepadan dengan biayanya?", ["Selalu", "Saat read model dan write model berbeda jauh dalam bentuk atau beban", "Tidak pernah", "Hanya dengan microservices"], "CQRS menambah duplikasi dan kerumitan; manfaatnya baru terasa kalau read dan write memang benar-benar berbeda."]
    ]
  },
  prod: {
    title: 'Production: observability, resilience, dan deployment',
    why: "Kode dianggap selesai ketika berjalan andal untuk user, bukan ketika berhasil di-compile. Seorang expert mendesain untuk hari ketika ada yang gagal — karena pasti selalu ada yang gagal.",
    points: [
      "**Observability** = log, metric, dan trace. **OpenTelemetry** adalah standarnya; sebuah trace mengikuti satu request lintas service.",
      "**Health check**: liveness ('restart saya kalau ini gagal') versus readiness ('jangan kirimi saya traffic dulu'). Keduanya menjawab pertanyaan yang berbeda.",
      "**Resilience** untuk panggilan keluar: timeout selalu; retry dengan jitter untuk transient fault; circuit breaker supaya tidak terus menghantam dependency yang mati. `Microsoft.Extensions.Http.Resilience` menyediakan pipeline standarnya.",
      "Hanya retry operasi yang **idempotent**, atau jadikan idempotent dengan idempotency key.",
      "Rilis sebagai container image; configuration datang dari environment; aplikasinya stateless sehingga instance mana pun bisa melayani request mana pun.",
      "Deploy dengan aman: migration database yang backward compatible, graceful shutdown, rilis rolling atau blue/green, dan rollback yang sudah diuji."
    ],
    practice: "Containerize API-mu dan jalankan bersama database memakai Docker Compose. Tambahkan OpenTelemetry dengan collector lokal (dashboard .NET Aspire cocok untuk ini), matikan database-nya saat sedang mengirim request, lalu jelaskan apa yang disampaikan health check, log, dan trace masing-masing.",
    teach: "Jelaskan perbedaan liveness check dan readiness check, dengan contoh ketika keduanya memberi jawaban berbeda.",
    analogy: "Log itu buku harian, metric itu dashboard mobil, trace itu halaman pelacakan paket yang menunjukkan setiap gudang yang disinggahi paketmu. Circuit breaker itu sekring di rumahmu: setelah gangguan berulang ia memutus aliran supaya kabelnya tidak terbakar, lalu nanti kamu bisa mencoba menyalakannya lagi.",
    pitfalls: [
      "Me-retry panggilan yang tidak idempotent lalu menagih customer dua kali.",
      "Satu health endpoint yang mengecek database — gangguan DB sebentar saja langsung me-restart semua instance.",
      "Men-deploy migration yang menghapus kolom yang masih dibaca versi lama yang masih berjalan."
    ],
    quiz: [
      ["Database mati selama 20 detik. Apa yang seharusnya dilaporkan liveness probe?", ["Unhealthy, supaya aplikasinya di-restart", "Healthy — prosesnya sendiri baik-baik saja", "Sebaiknya hang", "404"], "Me-restart aplikasi tidak akan memperbaiki database. Readiness yang seharusnya gagal; liveness tidak."],
      ["Apa yang dilakukan circuit breaker setelah kegagalan berulang?", ["Retry lebih cepat", "Langsung menggagalkan panggilan selama periode tertentu tanpa menghubungi dependency yang bermasalah", "Me-restart server", "Mengosongkan cache"], "Ia memberi dependency waktu untuk pulih dan melindungi thread serta latency milikmu sendiri."],
      ["Operasi mana yang aman di-retry otomatis tanpa desain tambahan?", ["`POST /payments`", "`GET /products/5`", "`POST /orders`", "Mengirim email"], "`GET` itu idempotent; operasi yang tidak idempotent butuh idempotency key dulu."]
    ]
  }
}, { tagline: 'Backend-nya: HTTP, API, dependency injection, EF Core, security, dan production.' });
