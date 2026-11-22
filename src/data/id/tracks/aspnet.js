// Bahasa Indonesia — track ASP.NET Core. Contoh kode tetap memakai versi aslinya.
export const trackId = {
  id: 'aspnet',
  tagline: 'Backend-nya: HTTP, API, dependency injection, EF Core, security, dan production.',
  lessons: {
  http: {
    terms: [
      ['Method & URL', 'Kata kerja (`GET`, `POST`, `PUT`, `DELETE`) ditambah jalur resource (`/api/products/7`) untuk memberi tahu server aksi yang diminta.'],
      ['Status code', 'Vonis tiga digit (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Error`) supaya client tahu hasil request-nya.'],
      ['Header & body JSON', 'Metadata kunci dan nilai (`Authorization`, `Content-Type`) yang membungkus payload JSON saat lewat di HTTP.']
    ],
    title: 'Cara kerja web: HTTP dalam 20 menit',
    why: "ASP.NET Core adalah mesin yang mengubah HTTP request jadi HTTP response. Begitu paham cara membaca request dan response mentah, kamu bakal gampang men-debug masalah web di framework mana saja. Semua contoh di track ini berupa `Program.cs` lengkap untuk .NET 10. Mulai dari `dotnet new web`, jalankan baris `dotnet add package` di bagian atas kalau ada, lalu tempel kodenya. Contoh yang memakai database mengandalkan SQL Server Express lokal (`.\\SQLEXPRESS`), kecuali kamu mengganti connection string `Shop`.",
    points: [
      "Browser (client) mengirim **request** berisi method (`GET`, `POST`, `PUT`, `DELETE`), URL, header, dan kadang body.",
      "Server membalas dengan **response** berisi status code, header, dan biasanya body HTML atau JSON.",
      "Kelompok statusnya simpel: `2xx` sukses, `3xx` redirect, `4xx` salah dari sisi client, dan `5xx` gagal di server.",
      "HTTP itu **stateless**, jadi tiap request berdiri sendiri. Identitas dikirim ulang setiap kali, entah lewat cookie atau token.",
      "`GET` hanya membaca tanpa mengubah data, `POST` membuat baru, `PUT` dan `PATCH` memperbarui, sementara `DELETE` menghapus.",
      "`GET`, `PUT`, dan `DELETE` bersifat **idempotent**, jadi dikirim dua kali tetap menghasilkan keadaan sama seperti sekali kirim. `POST` tidak begitu, makanya me-retry `POST` bisa bikin order kembar.",
      "Halaman browser di satu origin (`http://localhost:5173`) cuma boleh membaca response dari origin lain (`http://localhost:5000`) kalau server mengizinkan lewat header **CORS**. Kasus ini persis waktu app React memanggil API-nya, dan setup-nya ada di materi routing.",
      "Biarkan tab Network di dev tools browser terbuka selama bekerja untuk memantau tiap request dan response."
    ],
    practice: "Jalankan `dotnet new web`, ganti `Program.cs` dengan contohnya, lalu panggil `/time` dari browser, lewat `curl -i`, dan sambil melihat tab Network dev tools. Cek method, status code, dan `Content-Type` di ketiganya.",
    teach: "Jelaskan alur antara mengetik URL sampai halaman muncul menggunakan istilah request, response, status code, dan header.",
    analogy: "HTTP mirip memesan lewat surat di loket. Kamu mengirim amplop berisi pesananmu (method dan URL), catatan di luar amplop (header), serta isinya (body). Dapur mengirim balik amplop berstempel kode hasil. Karena dapur selalu lupa siapa kamu, tunjukkan kartu membermu di setiap pesanan.",
    pitfalls: [
      "Mengira server menyimpan ingatan soal user di antara request. Tidak, cookie atau token harus dikirim ulang tiap kali.",
      "Memakai `GET` untuk operasi pengubah data. Browser, crawler, dan link preview bebas memanggil `GET` kapan saja.",
      "Membalas `200 OK` dengan pesan error di body bukan menggunakan status code `4xx` atau `5xx` yang pas."
    ],
    quiz: [
      ["Kelompok status code mana yang berarti 'client mengirim sesuatu yang salah'?", ["2xx", "3xx", "4xx", "5xx"], "Kode 4xx seperti 400, 401, dan 404 menandakan masalah di request client."],
      ["HTTP bersifat stateless artinya…", ["Server tidak bisa menyimpan data apa pun", "Setiap request membawa semua yang dibutuhkan untuk memprosesnya", "Response tidak punya body", "Cookie tidak diizinkan"], "Protokol ini tidak menyimpan sesi di antara request. Cookie dipakai untuk mengirim ulang state di setiap request."],
      ["Terjadi error jaringan dan client otomatis mengirim ulang request yang sama. Untuk method mana itu aman tanpa desain tambahan?", ["`POST /orders`", "`PUT /orders/7`", "`POST /payments`", "Tidak ada satu pun"], "`PUT` menimpa resource dengan isi yang persis sama, jadi mengulangnya aman. Mengulang `POST` bisa membuat pesanan atau tagihan ganda."]
    ]
  },
  anatomy: {
    terms: [
      ['`builder.Services` (container DI)', 'Paruh pertama `Program.cs`: mendaftarkan service dan konteks database *sebelum* `builder.Build()`.'],
      ['Pipeline middleware (`app.Use*`)', 'Paruh kedua `Program.cs`: menyusun rantai berurutan untuk memproses setiap request masuk dan response keluar.'],
      ['Endpoint Minimal API', '`app.MapGet("/path", handler)` memetakan rute langsung ke lambda C# tanpa boilerplate controller tambahan.']
    ],
    title: 'Anatomi aplikasi ASP.NET Core',
    why: "`Program.cs` terbagi jadi dua bagian, dan hampir semua masalah 'kenapa service-ku tidak ketemu?' atau 'kenapa middleware-ku tidak jalan?' langsung jelas begitu kamu tahu barisnya masuk bagian mana.",
    points: [
      "Di **bagian pertama (builder)**, daftarkan semua service yang dibutuhkan aplikasi lewat `builder.Services.Add…` dan muat konfigurasi.",
      "Di **bagian kedua (app)** setelah `builder.Build()`, rangkai request pipeline lewat `app.Use…` lalu petakan endpoint lewat `app.Map…`. Pemanggilan `app.Run()` menyalakan server hingga dimatikan.",
      "**Kestrel** adalah web server bawaan yang mendengarkan sebuah port dan menyalurkan request ke pipeline-mu.",
      "Konfigurasi bertumpuk dari bawah ke atas: `appsettings.json` → `appsettings.{Environment}.json` → user secrets (khusus Development) → environment variable → argumen CLI. Sumber paling akhir yang menang.",
      "`ASPNETCORE_ENVIRONMENT` memilih setelan `Development`, `Staging`, atau `Production`.",
      "Track ini memakai **minimal API** (`app.MapGet`). Gaya lainnya adalah controller (`AddControllers()` + `MapControllers()`) di atas routing engine yang persis sama."
    ],
    practice: "Buat Web API baru memakai `dotnet new webapi` lalu tempel contohnya. Tambah `Greeting` di `appsettings.json`, timpa dengan environment variable, dan pastikan nilai mana yang menang. Terakhir, geser baris `builder.Configuration` ke bawah `app.Run()` dan amati efeknya.",
    teach: "Jelaskan dua paruh `Program.cs`: apa saja yang ditaruh sebelum `builder.Build()` dan apa yang sesudahnya.",
    analogy: "Membuka restoran punya dua tahap. Sebelum hari pembukaan, kamu merekrut staf dan mengisi dapur (mendaftarkan service). Begitu pintu buka, kamu mengatur jalur tamu: meja sambut, tempat jaket, meja makan, lalu kasir (pipeline). Kamu tentu tidak merekrut koki di tengah meja makan.",
    pitfalls: [
      "Mendaftarkan service setelah `builder.Build()`. Koleksinya sudah read-only dan langsung memicu error.",
      "Menulis kode setelah `app.Run()` lalu berharap kode itu jalan pas startup.",
      "Meng-commit secret ke `appsettings.json`. Taruh di user secrets waktu dev dan environment variable atau vault saat production.",
      "Mengira `appsettings.Development.json` ikut dipakai di production."
    ],
    quiz: [
      ["Di mana `builder.Services.AddScoped<…>()` harus dipanggil?", ["Setelah `app.Run()`", "Sebelum `builder.Build()`", "Di dalam handler endpoint", "Di mana saja, asal di `Program.cs`"], "Service collection langsung terkunci begitu aplikasi di-build."],
      ["Key yang sama ada di `appsettings.json` dan environment variable. Mana yang otomatis menang?", ["`appsettings.json`", "Environment variable", "Tidak ada: aplikasinya menolak start", "Yang paling baru diubah"], "Konfigurasi yang dimuat belakangan menimpa yang lebih awal, dan environment variable masuk sesudah file JSON."],
      ["Apa itu Kestrel?", ["Driver database", "Web server lintas platform yang sudah terpasang di ASP.NET Core", "Reverse proxy yang harus di-install terpisah", "Penjadwal background job"], "Kestrel mendengarkan koneksi HTTP dan menyalurkan request ke pipeline. Reverse proxy seperti nginx atau IIS bisa ditaruh di depannya, meski tidak wajib."]
    ]
  },
  routing: {
    terms: [
      ['Batasan rute (`{id:int}`)', 'Memastikan `/products/abc` langsung dibalas 404 sebelum masuk ke handler C# dengan tipe yang salah.'],
      ['Model binding', 'Menarik nilai bertipe otomatis dari segmen rute, query string (`?page=2`), header, dan body JSON request.'],
      ['`TypedResults` vs `Results`', '`TypedResults.Ok(x)` menanamkan tipe balikan nyata (`Results<Ok<T>, NotFound>`) di signature agar OpenAPI mendokumentasikan semua status code.']
    ],
    title: 'Routing, endpoint, dan model binding',
    why: "API pada dasarnya adalah daftar endpoint. Memetakan URL ke kode C#, membaca input dengan aman, dan mengembalikan status code yang tepat adalah rutinitas harian developer backend.",
    points: [
      "**Routing** mencocokkan HTTP method dan pola URL dengan handler, seperti `GET /api/products/{id}`.",
      "**Model binding** otomatis mengisi parameter handler dari rute, query string, header, dan body JSON.",
      "Balas dengan status yang sesuai: `Ok` 200, `Created` 201, `NoContent` 204, `BadRequest` 400, dan `NotFound` 404. `TypedResults` plus `Results<…>` juga mendokumentasikan semua status response di OpenAPI.",
      "Ikuti konvensi REST: pakai kata benda di URL (`/products/5`) dan biarkan method HTTP menjadi kata kerjanya, bukan `/getProduct?id=5`.",
      "Route constraint seperti `{id:int}` ikut menentukan rute mana yang cocok. `/api/products/abc` sama sekali tidak cocok, jadi pemanggil mendapat **404**, bukan 400. Validasi input tetap dilakukan di handler atau filter.",
      "Data yang dipakai bersama oleh beberapa endpoint bertahan selama aplikasi hidup dan diakses banyak request serentak, makanya contoh di bawah memakai `ConcurrentDictionary` dan `Interlocked` agar thread-safe.",
      "**CORS** memungkinkan dev server frontend dari origin berbeda memanggil API lewat browser. Daftarkan origin yang diizinkan satu per satu."
    ],
    practice: "Tambah `PUT /api/products/{id}` untuk mengganti produk dan balas 404 kalau tidak ada. Uji kelima endpoint lewat file `.http` atau `curl` sambil mengecek status code tiap hasil, lalu panggil `/api/products/abc` dan jelaskan kenapa balasannya 404.",
    teach: "Jelaskan bagaimana ASP.NET Core tahu kalau parameter `id` diambil dari URL sementara `input` diambil dari body request.",
    analogy: "Routing itu resepsionis hotel: 'kamar 204? Lantai dua sebelah kiri.' Model binding adalah bellboy yang merapikan isi kopermu ke laci yang pas sebelum kamu masuk kamar: nilai rute masuk laci satu, query string ke laci lain, dan JSON disusun jadi object.",
    pitfalls: [
      "Membalas 200 berisi `null` waktu data tidak ditemukan. Balas 404.",
      "Membuat id baru dengan `list.Count + 1`. Begitu satu data terhapus, id berikutnya bakal tabrakan.",
      "Menaruh data bersama di `List<T>` polos padahal diubah banyak request berbarengan.",
      "Mengeluarkan entity database langsung sebagai JSON request atau response. Bungkus pakai DTO record.",
      "Menaruh kata kerja di URL (`/api/createProduct`). Biarkan method HTTP yang membawa kata kerjanya."
    ],
    quiz: [
      ["Sebuah `POST` berhasil membuat resource. Status code terbaik?", ["200", "201", "204", "202"], "201 Created, idealnya disertai header `Location` yang menunjuk resource barunya. 202 berarti diterima tapi belum selesai."],
      ["Dengan `app.MapGet(\"/items/{id:int}\", (int id) => …)`, request ke `/items/abc` mengembalikan…", ["500", "404", "200 dengan id = 0", "400"], "Constraint `:int` gagal cocok sehingga tidak ada rute yang sesuai. Karena itulah constraint bukan alat validasi."],
      ["Di method POST, dari mana parameter bertipe kompleks seperti `CreateProduct input` otomatis di-bind?", ["Query string", "Route", "Body JSON", "Field form"], "Tipe kompleks di-bind dari body JSON, sementara tipe sederhana diambil dari route atau query string."]
    ]
  },
  middleware: {
    terms: [
      ['Delegate middleware (`next()`)', 'Komponen yang membungkus setiap HTTP request: kode sebelum `await next()` berjalan saat masuk, dan kode sesudahnya saat keluar.'],
      ['Short-circuiting', 'Mengembalikan `401` atau hasil cache lebih awal tanpa memanggil `next()`, melewati handler di hilir dengan aman.'],
      ['Urutan pipeline', 'Memasang `ExceptionHandler` paling luar dan `UseAuthentication()` sebelum `UseAuthorization()` menjaga error tertangkap serta identitas siap sebelum izin dicek.']
    ],
    title: 'Middleware pipeline',
    why: "Penanganan error, CORS, authentication, dan logging semuanya berjalan lewat middleware. Salah urutan adalah salah satu kesalahan paling sering di ASP.NET Core dan susah ditebak sebelum kamu punya gambaran jelas tentang alur pipeline-nya.",
    points: [
      "Request masuk melewati middleware **sesuai urutan pendaftaran**, lalu response keluar kembali dalam urutan **terbalik**.",
      "Setiap middleware bebas mengeksekusi kode sebelum `next()`, memanggil `next()`, menjalankan kode sesudahnya, atau memutus aliran (**short-circuit**) dengan tidak memanggil `next()`.",
      "Urutan sangat menentukan: pasang exception handler paling awal supaya membungkus semuanya, disusul HTTPS, static file, CORS, authentication, authorization, dan endpoint.",
      "Kamu tidak wajib memanggil `UseRouting()` karena `WebApplication` sudah menyisipkannya di awal pipeline. Panggil sendiri cuma kalau ada middleware yang harus jalan sebelum routing.",
      "`UseExceptionHandler()` perlu format error: daftarkan `AddProblemDetails()` atau sebuah `IExceptionHandler`, kalau tidak aplikasinya crash saat startup.",
      "Middleware kustom cukup ditulis inline pakai `app.Use(async (context, next) => { … })`, atau berupa class dengan method `InvokeAsync`."
    ],
    practice: "Buat middleware yang menolak request tanpa header `X-Api-Key` dengan 401 tanpa memanggil `next`. Pasang sebelum lalu sesudah middleware timing dan amati bedanya di log. Panggil `/boom` dengan `ASPNETCORE_ENVIRONMENT` disetel ke `Production` dan pastikan tidak ada stack trace bocor ke client.",
    teach: "Jelaskan kenapa urutan middleware itu penting memakai contoh authentication dan authorization.",
    analogy: "Alur keberangkatan di bandara: check-in, pemeriksaan keamanan, imigrasi, lalu gate. Semua penumpang lewat sesuai urutan itu dan pos mana saja bisa menghentikanmu. Imigrasi jelas tak bisa mengecek paspor sebelum identitas diperiksa, dan saat pulang kamu melewati pos yang sama dengan urutan terbalik.",
    pitfalls: [
      "Memasang `UseAuthorization` sebelum `UseAuthentication`. Saat dicek belum ada identitas user, jadi semua endpoint terproteksi langsung membalas 401.",
      "Memanggil `UseExceptionHandler()` tanpa `AddProblemDetails()` yang bikin startup langsung gagal.",
      "Menulis ke response setelah `next()` padahal status dan header response sudah terlanjur terkirim.",
      "Lupa bahwa kode di bawah `await next()` baru jalan di perjalanan pulang."
    ],
    quiz: [
      ["Middleware A didaftarkan sebelum B. Di jalur response, mana yang menjalankan kode 'sesudah'-nya lebih dulu?", ["A", "B", "Keduanya bersamaan", "Yang lebih dulu menyelesaikan kode 'sebelum'-nya"], "Pipeline keluar dari dalam ke luar, jadi B beres duluan lalu disusul A."],
      ["Apa arti 'short-circuit'?", ["Aplikasinya crash", "Sebuah middleware menulis response tanpa memanggil `next`", "Dua middleware jalan paralel", "Request melewati routing tapi tetap sampai ke endpoint"], "Middleware sesudahnya dan endpoint tidak pernah dieksekusi, misalnya saat 401 atau membalas dari cache."],
      ["Kenapa middleware penanganan exception harus didaftarkan paling awal?", ["Karena paling cepat", "Supaya ia membungkus, dan bisa menangkap exception dari, semua yang datang setelahnya", "Karena ia harus membaca body request lebih dulu", "Hanya supaya mudah dibaca"], "Middleware cuma bisa menangkap exception dari komponen yang dipanggil lewat `next` di dalamnya."]
    ]
  },
  di: {
    terms: [
      ['`Transient`', 'Membuat instance baru setiap kali constructor atau endpoint meminta service ini.'],
      ['`Scoped`', 'Satu instance dipakai bersama sepanjang satu HTTP request dan di-dispose saat request selesai, wajib untuk `DbContext`.'],
      ['Bug captive dependency', 'Menyuntikkan service `Scoped` ke dalam `Singleton`, yang membuat koneksi DB usang ikut tertahan selamanya.']
    ],
    title: 'Dependency injection dan service lifetime',
    why: "DI menopang seluruh arsitektur ASP.NET Core. Salah memilih lifetime bikin datamu basi, memicu race condition pada state bersama, dan memunculkan error 'cannot consume scoped service from singleton'.",
    points: [
      "Class cukup meminta dependency-nya lewat constructor agar **container** yang membuat dan mengirimkannya, tanpa menginstansiasi sendiri lewat `new`.",
      "Pilih **transient** untuk service ringan tanpa state karena selalu dibuatkan instance baru tiap diminta.",
      "Pilih **scoped** untuk satu instance per HTTP request, pilihan standar bagi segala hal yang menyentuh database seperti `DbContext`.",
      "Pilih **singleton** untuk satu instance sepanjang umur aplikasi. Isinya harus thread-safe dan bebas dari state per user.",
      "Waspadai **captive dependency** saat singleton menahan service scoped agar tetap hidup selamanya. Mode Development mengecek ini dan memicu error, tapi di Production lolos tanpa dicek.",
      "`TimeProvider` adalah jam bawaan .NET. Inject itu ketimbang `DateTime.UtcNow` supaya unit test bisa memakai waktu tiruan."
    ],
    practice: "Daftarkan satu class berisi `Guid Id = Guid.NewGuid()` dalam mode transient, scoped, dan singleton, lalu inject masing-masing dua kali ke satu endpoint yang mengembalikan keenam id-nya. Refresh browser dan baca polanya, lalu ubah `OrderService` menjadi singleton di mode Development dan lihat pesan error-nya.",
    teach: "Jelaskan ketiga service lifetime dan kenapa `DbContext` tidak boleh masuk ke singleton.",
    analogy: "Bayangkan hotel. **Singleton** itu jam di lobi yang sama untuk semua tamu selamanya. **Scoped** itu kartu kunci kamarmu yang dipakai sepanjang menginap lalu dikembalikan saat checkout. **Transient** itu gelas kertas yang selalu baru setiap kali kamu minta.",
    pitfalls: [
      "Menyimpan data per user di singleton sehingga user lain ikut melihatnya.",
      "Meng-inject service scoped ke singleton. Kalau memang perlu, inject `IServiceScopeFactory` lalu buat scope per tugas.",
      "Mengambil service dari `IServiceProvider` langsung di method ketimbang menaruhnya di parameter constructor (anti-pattern service locator)."
    ],
    quiz: [
      ["Dalam satu HTTP request, service scoped di-inject ke dua class berbeda. Ada berapa instance?", ["Satu", "Dua", "Satu per thread", "Dua, lalu digabung di akhir request"], "Scoped artinya satu instance per scope, dan setiap HTTP request mendapat satu scope."],
      ["Lifetime apa yang otomatis dipakai `AddDbContext`?", ["Singleton", "Scoped", "Transient", "Singleton yang di-pool"], "`DbContext` menjadi satu unit kerja per request dan memang tidak thread-safe."],
      ["Apa itu captive dependency?", ["Referensi melingkar antara dua service", "Service bermasa hidup singkat yang ditahan service bermasa hidup lebih lama", "Service yang didaftarkan dua kali", "Service yang tidak pernah di-dispose"], "Misalnya singleton memegang `DbContext` scoped: instance itu tak pernah dibebaskan dan terpakai lintas request."]
    ]
  },
  efcore: {
    splits: ['1 · Setup & Program.cs', '2 · Proyeksi & update', '3 · Entity & DbContext'],
    terms: [
      ['`DbContext`', 'Mewakili sesi dengan database, melacak entity yang diambil, dan menghasilkan transaksi SQL saat `SaveChangesAsync()` dipanggil.'],
      ['Proyeksi (`.Select(...)`)', 'Mengambil kolom DTO yang diperlukan langsung dari SQL ketimbang memuat grafik entity utuh ke memori.'],
      ['Migration', 'Kode C# berversi (`dotnet ef migrations add`) untuk menjaga perubahan skema database tetap sinkron di Git.']
    ],
    title: 'EF Core: database-mu di dalam C#',
    why: "EF Core menjembatani C#, LINQ, dan SQL. Kalau dipakai pas, kodenya bebas boilerplate, tapi kalau asal pakai ia diam-diam mencetak query lambat. Kebiasaan terbaik di sini adalah rutin membaca SQL yang dihasilkan.",
    points: [
      "`DbContext` mewakili satu sesi dengan database, tempat setiap `DbSet<T>` memetakan tabel dan tiap entity menjadi baris.",
      "Ekspresi LINQ pada `DbSet` baru diterjemahkan menjadi SQL dan dieksekusi saat di-enumerate lewat `ToListAsync` atau `FirstOrDefaultAsync`.",
      "**Migration** menyimpan riwayat skema di Git. Install tool-nya sekali (`dotnet tool install --global dotnet-ef`), tambah `Microsoft.EntityFrameworkCore.Design`, lalu jalankan `dotnet ef migrations add Init` dan `dotnet ef database update`.",
      "Dengan **change tracking**, EF otomatis mencatat perubahan di entity yang dimuat lalu mengirim `UPDATE` waktu kamu memanggil `SaveChangesAsync`.",
      "Ambil data relasi dengan proyeksi `Select` biar cuma mengambil kolom yang perlu, atau pakai `Include` saat memang butuh entity lengkap.",
      "Tandai tipe uang memakai `[Precision(10, 2)]` supaya kolomnya memakai `DECIMAL(10,2)` seperti di track SQL.",
      "LINQ dan `FromSql($\"…{value}\")` otomatis memparameterkan input, sementara `FromSqlRaw` dengan string yang disambung manual membuka celah SQL injection."
    ],
    practice: "Arahkan contohnya ke SQL Server Express atau LocalDB (`Server=(localdb)\\MSSQLLocalDB`), buat dan terapkan migration-nya, lalu isi beberapa data. Panggil semua endpoint dan baca SQL di console: apakah query itu mirip SQL yang kamu tulis sendiri?",
    teach: "Jelaskan bagaimana ekspresi LINQ seperti `db.Products.Where(p => p.Price < 100)` berubah menjadi query SQL.",
    analogy: "EF Core itu penerjemah di antara dua bahasa yang beda: kamu bicara object C#, database bicara tabel SQL. Penerjemah yang cekatan menghemat waktu, tapi kalau kamu tak mengerti SQL, kamu tak bakal sadar saat hasil terjemahannya berputar-putar dan lambat.",
    pitfalls: [
      "Tidak pernah mengintip SQL yang dicetak ke log.",
      "Memanggil `ToList()` duluan lalu memfilter barisnya di memory bukan di database.",
      "Mengembalikan entity langsung dari API karena navigation property bisa memicu JSON berputar dan membocorkan kolom tersembunyi.",
      "Menyusun SQL dengan menyambung string lewat `FromSqlRaw(\"… '\" + name + \"'\")`."
    ],
    quiz: [
      ["Kapan `db.Products.Where(p => p.Price < 100)` menyentuh database?", ["Saat itu juga", "Saat di-enumerate, misalnya oleh `ToListAsync()`", "Saat aplikasi start", "Saat `SaveChanges` dipanggil"], "`IQueryable` dieksekusi tunda sampai dibaca hasilnya, sama seperti LINQ biasa."],
      ["Apa isi sebuah migration?", ["Backup database", "Kode yang mendeskripsikan perubahan schema, dengan langkah `Up` dan `Down`", "Hanya seed data", "SQL hasil compile untuk setiap query"], "Migration adalah catatan skema berversi yang bisa di-review."],
      ["Kamu memuat sebuah entity dan mengubah property-nya. Apa yang menuliskannya ke database?", ["Tidak ada: otomatis tersimpan saat property-nya berubah", "`db.SaveChangesAsync()`", "`db.Update()` selalu wajib dipanggil dulu", "Men-dispose context-nya"], "Change tracker menangkap perubahannya lalu `SaveChanges` mengirim `UPDATE`. `Update()` cuma untuk entity yang tidak sedang di-track."]
    ]
  },
  validation: {
    terms: [
      ['DTO Input/Output', 'Kontrak `record` terpisah (`CreateProductRequest`, `ProductResponse`) supaya client tak bisa mengubah field entity sensitif.'],
      ['`AddValidation()`', 'Filter endpoint opsional di Minimal API untuk mengecek atribut `[Required]`, `[Range]`, dan `[MaxLength]` sebelum handler jalan.'],
      ['RFC 9457 `ProblemDetails`', 'Format payload error JSON standar (`title`, `status`, `errors`) untuk gagal validasi maupun exception tak terduga.']
    ],
    title: 'DTO, validasi, dan penanganan error',
    why: "API itu kontrak dengan pihak luar. Memvalidasi semua input masuk dan membalas error dalam format konsisten memudahkan siapa pun berintegrasi dengan API-mu.",
    points: [
      "**Jangan pernah percaya input.** Validasi di batas pintu masuk dan balas body yang invalid dengan `400 Bad Request` yang rinci.",
      "**DTO** berupa record request dan response memisahkan kontrak API dari entity database serta mencegah over-posting.",
      "Atribut validasi (`[Required]`, `[Range]`, `[StringLength]`) mendeklarasikan aturan langsung di DTO. Di .NET 10, `AddValidation()` otomatis memeriksanya pada parameter minimal API.",
      "**ProblemDetails** (RFC 9457) menetapkan format error JSON baku berisi `type`, `title`, `status`, `detail`, dan `errors`.",
      "Tangani exception tak terduga di satu tempat memakai `UseExceptionHandler`: catat detail lengkap di log, lalu balas 500 generik tanpa membocorkan stack trace.",
      "Kondisi gagal yang wajar seperti data hilang, bentrok, atau input salah bukan exception. Balas dengan status code yang sesuai.",
      "Aturan unik seperti 'nama produk harus unik' wajib dijaga dengan index `UNIQUE` di database. Mengecek dulu di C# lalu insert bakal kena race condition saat ada dua request bersamaan."
    ],
    practice: "Pasang validasi ke semua endpoint tulis di API-mu. Kirim lima request ngawur berbeda dan cek semuanya membalas ProblemDetails `400` dengan nama field yang bermasalah. Kirim dua request nama produk baru yang sama bersamaan, lalu pastikan satu dapat 201 dan satunya 409. Terakhir, picu error di mode Production untuk memastikan stack trace tidak bocor.",
    teach: "Jelaskan kenapa API lebih aman memakai DTO request dan response ketimbang menerima atau mengirim entity database langsung.",
    analogy: "DTO itu formulir pesanan di meja kasir, sementara entity itu buku stok di gudang. Pembeli cuma boleh mengisi formulir di depan, bukan masuk ke gudang dan mengubah kolom harga modal atau `IsAdmin`.",
    pitfalls: [
      "Mengikat JSON langsung ke entity sehingga caller bisa menyelipkan field rahasia seperti `IsAdmin` (over-posting).",
      "Memakai exception untuk kegagalan validasi biasa.",
      "Mengecek duplikat dengan `AnyAsync` lalu insert tanpa index unik di tabel.",
      "Mengembalikan struktur error JSON yang beda-beda antar endpoint."
    ],
    quiz: [
      ["Client mengirim harga negatif. Response yang benar?", ["500", "200 dengan pesan error", "400 dengan detail validasi", "422 tanpa body"], "Input salah dari client masuk kategori 4xx, dan 400 berisi detail field membantu client memperbaikinya."],
      ["Masalah apa yang dicegah oleh DTO request?", ["Query yang lambat", "Over-posting: client mengisi property yang tidak boleh mereka kendalikan", "Baris duplikat", "Error CORS"], "Hanya property di dalam DTO yang bisa terisi dari body request."],
      ["Dua request membuat produk bernama 'Lamp' bersamaan. Apa yang betul-betul mencegah duplikat?", ["Mengecek `AnyAsync` sebelum insert", "Index `UNIQUE`, dengan error duplicate key diubah jadi 409", "`lock` di sekeliling endpoint", "Attribute validasi"], "Dua cek `AnyAsync` bisa sama-sama lolos sebelum salah satu sempat insert, dan `lock` tidak mempan kalau server-nya lebih dari satu. Hanya index DB yang melihat semuanya."]
    ]
  },
  auth: {
    splits: ['1 · Setup Auth & CORS', '2 · Endpoint & kepemilikan', '3 · Entity & pengaturan'],
    terms: [
      ['Autentikasi vs Otorisasi', 'Autentikasi memastikan *siapa* kamu (`ClaimsPrincipal`), sementara otorisasi mengecek *apa* yang boleh kamu sentuh.'],
      ['Otorisasi berbasis resource', 'Mengecek kepemilikan (`order.UserId == callerId`) di tiap baris dan membalas `404` agar keberadaan data orang lain tidak bocor.'],
      ['Kebijakan CORS', 'Header server yang menentukan origin frontend mana (jangan `*` bareng credentials) yang boleh membaca respons lintas origin di browser.']
    ],
    title: 'Authentication dan authorization',
    why: "Bug keamanan paling mahal ongkos perbaikannya. Kamu harus selalu tahu siapa yang memanggil API, bagaimana server memastikan identitasnya, dan cara tiap endpoint membatasi aksesnya.",
    points: [
      "**Authentication** membuktikan identitas dan **authorization** menentukan hak akses. Keduanya adalah dua langkah dan middleware yang terpisah.",
      "Untuk aplikasi SPA browser seperti React, pola **backend-for-frontend** menjaga browser hanya memegang cookie session `HttpOnly` sementara token tetap aman di server. **JWT bearer token** lebih cocok untuk mobile app dan komunikasi antar service.",
      "JWT berisi tiga bagian base64url: header, payload claim, dan signature. Isinya **ditandatangani, bukan dienkripsi**, jadi siapa saja bisa membaca isinya, tapi tak bisa diubah tanpa merusak signature.",
      "Server memverifikasi signature, issuer, audience, dan masa berlaku di setiap request. Gunakan access token berumur singkat.",
      "Simpan konfigurasi token di file config, jangan di kode: `appsettings.json` menunjuk identity provider, sementara `dotnet user-jwts` menulis token dev ke `appsettings.Development.json`.",
      "Terapkan otorisasi memakai role, **policy**, dan cek kepemilikan data ('apakah order ini milik pemanggil?').",
      "Jangan merakit penyimpanan password sendiri: pakai ASP.NET Core Identity (hash lambat plus salt) atau identity provider lewat OpenID Connect."
    ],
    practice: "Jalankan contohnya lalu buat token lokal lewat `dotnet user-jwts create` (ditambah `--role Admin` untuk token kedua). Buktikan lewat request bahwa status 401 (tanpa token), 403 (login bukan Admin), dan 404 (order milik orang lain) muncul sesuai kondisi. Lalu panggil `/api/products` dari halaman di `http://localhost:5173` dengan dan tanpa policy CORS dan cek pesan console browser.",
    teach: "Jelaskan bedanya 401 dan 403, serta kenapa JWT tetap aman dipercaya meski isi payload-nya terbaca siapa pun.",
    analogy: "JWT itu seperti gelang konser. Petugas langsung melihat izin akses dan jam berlakunya dari tulisan di gelang, lalu mengecek segel hologramnya (signature) untuk memastikan gelang itu resmi terbitan panitia. Orang lain bisa membaca tulisannya, tapi mustahil memalsukan segelnya.",
    pitfalls: [
      "Menaruh secret atau data sensitif di payload JWT karena siapa saja yang memegang token dapat membacanya.",
      "Cuma mengecek 'sudah login' tapi lupa memastikan pemanggil adalah pemilik data yang diminta (IDOR).",
      "Menaruh access token di `localStorage`, tempat script XSS mana pun bebas mencurinya.",
      "Menganggap CORS sebagai pengaman server API. Browser memang tunduk ke CORS, tapi `curl` dan script server lain mengabaikannya total."
    ],
    quiz: [
      ["User yang sudah login tapi tidak punya role Admin memanggil endpoint khusus admin. Status-nya?", ["401", "403", "404", "400"], "401 berarti belum login, sedangkan 403 berarti sudah login tapi tidak punya izin."],
      ["Apa yang dijamin oleh signature JWT?", ["Payload-nya rahasia", "Token-nya dikeluarkan oleh pemegang key dan tidak diubah", "Token-nya belum kedaluwarsa", "User-nya benar orang yang ia akui, selamanya"], "Signature membuktikan keaslian dan keutuhan token, bukan kerahasiaan isinya. Masa berlaku dicek dari claim expiry terpisah."],
      ["Pengecekan mana yang mencegah user A membaca order milik user B di `/api/orders/17`?", ["`RequireAuthorization()` saja", "Query yang hanya menemukan order milik pemanggil", "HTTPS", "CORS"], "Status login saja belum cukup. Setiap resource pribadi wajib dicek kepemilikannya."]
    ]
  },
  config: {
    terms: [
      ['Pattern Options (`IOptions<T>`)', 'Mengikat bagian konfigurasi ke class C# bertipe kuat dan divalidasi saat startup (`ValidateDataAnnotations().ValidateOnStart()`).'],
      ['Logging terstruktur', 'Template log (`"Paid {OrderId} for {Total}"`) menjaga field bernama tetap bisa dicari di Seq atau OpenTelemetry ketimbang string polos.'],
      ['User Secrets / Key Vault', 'Menyimpan password DB dan API key di luar Git serta `appsettings.json` per environment.']
    ],
    title: 'Options, logging, dan environment',
    why: "Aplikasi hasil build yang sama jalan di laptop, CI, sampai server production dengan setelan berbeda-beda. Begitu production bermasalah, catatan log sering kali menjadi satu-satunya petunjuk.",
    points: [
      "**Options pattern** memetakan konfigurasi ke class bertipe: `IOptions<T>` membaca sekali, `IOptionsSnapshot<T>` me-reload tiap request, dan `IOptionsMonitor<T>` memantau update langsung.",
      "Validasi options saat startup lewat `ValidateDataAnnotations().ValidateOnStart()` supaya salah ketik langsung menggagalkan deploy, bukan meledak di request pertama.",
      "**Structured logging** seperti `log.LogInformation(\"Order {OrderId} placed\", id)` mempertahankan `OrderId` sebagai field terindeks. Hindari string interpolation di pemanggilan log.",
      "Level log berurutan dari Trace, Debug, Information, Warning, Error, hingga Critical, dan bisa diatur per kategori di `appsettings.json`.",
      "Jauhkan secret dari source control: pakai user secrets saat pengembangan lokal, lalu environment variable atau vault (Azure Key Vault, AWS Secrets Manager) saat production.",
      "Pakai log scope atau `Activity` untuk menempelkan correlation id agar jejak satu request dapat ditelusuri lintas service."
    ],
    practice: "Pindahkan string dan angka statis di API ke class options tervalidasi. Hapus `Smtp:Host` dari `appsettings.json` dan pastikan aplikasi menolak menyala dengan pesan jelas, lalu kirim lewat environment variable `Smtp__Host` (dua underscore) agar aplikasi start kembali.",
    teach: "Jelaskan kenapa `log.LogInformation(\"User {Id} logged in\", id)` lebih baik daripada string interpolation.",
    analogy: "Log terstruktur mirip lemari arsip dengan map berlabel rapi, bukan tumpukan kertas catatan acak. Kamu bisa langsung mencari 'semua log order 42' dalam hitungan detik.",
    pitfalls: [
      "Meng-inject `IConfiguration` ke banyak class lalu mengetik key string mentah berulang kali.",
      "Membuat pesan log memakai `$` interpolation karena menghilangkan struktur field dan tetap mengalokasi string meski level log-nya mati.",
      "Menulis password, token, atau alamat email user ke file log.",
      "Berharap `IOptions<T>` otomatis membaca nilai config baru. `IOptions<T>` dibaca sekali, jadi ganti ke `IOptionsMonitor<T>` kalau butuh update real-time."
    ],
    quiz: [
      ["Apa yang diubah oleh `ValidateOnStart()`?", ["Tidak ada", "Options yang tidak valid gagal saat aplikasi start, bukan saat pertama dipakai", "Options di-reload otomatis", "Validasi dilewati di production"], "Gagal pas startup mengubah error diam-diam saat runtime jadi gagal deploy yang cepat ketahuan."],
      ["Interface options mana yang mengikuti perubahan konfigurasi tanpa restart?", ["`IOptions<T>`", "`IOptionsMonitor<T>`", "`IConfigurationRoot`", "`IOptionsFactory<T>`"], "`IOptionsMonitor` memantau update config, sementara `IOptions` cuma dibaca sekali."],
      ["Di mana password database production seharusnya disimpan?", ["`appsettings.json`, di-commit ke git", "Environment variable atau secret vault", "`appsettings.Production.json`, di-commit ke git", "Konstanta di dalam kode"], "Secret wajib disimpan di luar Git dan disuntikkan saat deploy."]
    ]
  },
  testing: {
    terms: [
      ['`WebApplicationFactory<T>`', 'Menyalakan pipeline ASP.NET Core aslimu (`routing`, `validation`, `middleware`) di memori untuk integration test yang cepat.'],
      ['`HttpClient` in-memory', 'Mengirim request JSON HTTP sungguhan dari suite test ke `TestServer` tanpa membuka port jaringan nyata.'],
      ['Test double & container', 'Jalankan test integrasi dengan container SQL nyata (Testcontainers) bukan EF InMemory saat menguji perilaku SQL.']
    ],
    title: 'Testing API: unit dan integration',
    why: "Test membuatmu berani merombak kode tanpa takut merusak fitur lama. Test yang rapi juga menjadi dokumentasi hidup yang gagal persis saat perilaku kode melenceng.",
    points: [
      "**Unit test** menguji satu class memakai dependensi tiruan. Eksekusinya cepat, fokus, dan jumlahnya banyak.",
      "**Integration test** menyalakan pipeline HTTP lengkap di memory lewat `WebApplicationFactory<Program>` (`Microsoft.AspNetCore.Mvc.Testing`) sehingga routing, DI, validasi, dan JSON teruji sekaligus.",
      "Buat project test dengan `dotnet new xunit` dan referensikan ke project API. Di .NET 10 `Program` otomatis public, sedangkan .NET 8 dan 9 butuh `public partial class Program { }` di ujung `Program.cs`.",
      "Susun setiap skenario dengan pola **Arrange, Act, Assert**, uji dan beri nama satu perilaku per test.",
      "Untuk database, jalankan SQL Server asli di container (Testcontainers) daripada provider in-memory EF yang mengabaikan constraint maupun SQL.",
      "Uji perilaku yang terlihat oleh pemanggil, bukan detail method privat, supaya refactor internal tidak gampang mematahkan test."
    ],
    practice: "Tulis integration test untuk setiap endpoint di API produkmu, mencakup jalur sukses dan minimal satu kasus gagal per endpoint. Lalu ubah satu status code di API dan lihat tepat satu test langsung gagal dengan pesan jelas.",
    teach: "Jelaskan bedanya unit test dan integration test, lalu jenis bug apa yang tertangkap oleh masing-masing.",
    analogy: "Unit test memastikan tiap batu bata dicetak kokoh. Integration test memastikan dindingnya benar-benar berdiri tegak. Batu bata bagus bisa saja dipasang miring, tapi begitu dinding roboh, unit test membantumu mencari bata mana yang retak.",
    pitfalls: [
      "Terlalu banyak memakai mock sampai test-nya cuma memverifikasi mock bikinannya sendiri.",
      "Menulis test yang saling berbagi state atau bergantung pada urutan eksekusi.",
      "Mengira provider in-memory EF berperilaku sama seperti SQL Server padahal bebas constraint dan transaction."
    ],
    quiz: [
      ["Apa yang diberikan `WebApplicationFactory<Program>`?", ["Mock dari database", "Aplikasimu yang sungguhan, di-host di memory, dengan `HttpClient` untuk memanggilnya", "Deploy ke server test", "Rekaman traffic production"], "Pipeline aplikasi aslinya ikut berjalan di proses test, jadi routing, DI, dan middleware semuanya teruji."],
      ["Tiga bagian dari test yang tersusun baik adalah…", ["Setup, Run, Teardown", "Arrange, Act, Assert", "Given, When, Verify", "Mock, Call, Check"], "Siapkan input, jalankan aksinya sekali, lalu verifikasi hasilnya."],
      ["Kenapa SQL Server sungguhan lebih baik daripada provider in-memory EF untuk integration test?", ["Lebih cepat", "Provider in-memory tidak menegakkan constraint dan tidak menjalankan SQL sungguhan", "Tidak perlu setup", "xUnit tidak bisa memakai provider in-memory"], "Bug pada translasi SQL, constraint, dan transaction cuma muncul di database engine asli."]
    ]
  },
  efadv: {
    splits: ['1 · N+1 vs proyeksi', '2 · Optimistic concurrency', '3 · Entity & DbContext'],
    terms: [
      ['`AsNoTracking()`', 'Melewati pencatatan snapshot change-tracker pada query baca saja untuk memangkas penggunaan CPU dan RAM.'],
      ['Bug query N+1', 'Mengirim 1 query untuk N baris plus N query tersembunyi di dalam loop, diselesaikan memakai `.Select(...)` atau `.Include(...)`.'],
      ['Optimistic concurrency (`[Timestamp]`)', 'Mendeteksi dua suntingan bentrok lewat versi baris dan mengembalikan `409 Conflict` supaya editan pertama tidak tertimpa tanpa kabar.']
    ],
    title: 'EF Core lebih dalam: tracking, N+1, dan concurrency',
    why: "Mayoritas app ASP.NET Core yang lemot disebabkan segelintir kesalahan EF Core yang sama. Masing-masing punya jejak jelas di log SQL dan perbaikannya cuma beberapa baris.",
    points: [
      "Hindari **masalah N+1**, yaitu satu query utama memicu query tambahan per baris untuk relasinya. Bereskan dengan proyeksi `Select` atau eager loading `Include`.",
      "Query baca saja sebaiknya diproyeksikan ke DTO atau memakai `AsNoTracking()` supaya change tracker tidak bekerja percuma.",
      "Memakai `Include` di beberapa collection sekaligus memperbanyak duplikasi baris (cartesian explosion). Pakai `AsSplitQuery()` untuk memecahnya jadi beberapa query kecil.",
      "`SaveChanges` otomatis membungkus perubahan ke satu transaksi, jadi transaksi manual baru dibutuhkan bila mencakup beberapa kali save.",
      "Aktifkan **optimistic concurrency** dengan kolom `[Timestamp]` (`rowversion`) supaya bentrok edit memicu `DbUpdateConcurrencyException`. Bandingkan terhadap versi **yang dulu dibaca client**, bukan versi yang baru saja di-load di server.",
      "`ExecuteUpdateAsync` dan `ExecuteDeleteAsync` langsung mengeksekusi SQL tanpa memuat entity, melewati change tracker dan cek concurrency, cocok untuk update massal."
    ],
    practice: "Buat endpoint yang mendaftar order beserta nama customer memakai loop naif, hitung jumlah query SQL untuk 50 order, lalu perbaiki dan hitung ulang. Setelah itu buka produk yang sama di dua tab browser, simpan harga berbeda di tab satu lalu tab dua, dan pastikan tab kedua mendapat 409.",
    teach: "Jelaskan masalah query N+1 ke orang yang sudah paham LINQ tapi belum pernah mengintip SQL hasil terjemahannya.",
    analogy: "N+1 mirip pergi ke supermarket sekali buat memfoto daftar belanja, lalu menyetir bolak-balik satu per satu demi membeli tiap barangnya. Proyeksi berarti membawa pulang semua barang dalam satu perjalanan.",
    pitfalls: [
      "Mengaktifkan lazy loading tanpa sadar lalu dibanjiri puluhan query per request.",
      "Membiarkan ribuan entity dilacak change tracker di halaman yang cuma baca data.",
      "Menaruh `[Timestamp]` tapi mencocokkannya dengan nilai yang baru di-load saat save, sehingga editan dua user tetap saling menimpa.",
      "Memakai `ExecuteUpdateAsync` untuk aksi yang sebenarnya wajib melewati aturan domain atau cek concurrency."
    ],
    quiz: [
      ["Kamu menampilkan 100 order dan membaca `order.Customer.Name` di dalam loop dengan lazy loading. Berapa query-nya?", ["1", "2", "Sampai 101", "100"], "Satu query mengambil daftar order ditambah satu query per order untuk customer-nya: itulah pola N+1."],
      ["Apa yang dilakukan `AsNoTracking()`?", ["Mematikan log SQL", "Melewati change tracking untuk entity yang dikembalikan, menghemat waktu dan memory", "Mencegah EF meng-cache query plan", "Membaca data yang belum di-commit"], "Query baca tidak membutuhkan salinan snapshot di change tracker."],
      ["Seorang user memuat sebuah produk 5 menit lalu dan sekarang menyimpan editannya. Versi mana yang harus dibandingkan oleh `UPDATE` untuk menangkap perubahan di antaranya?", ["Versi yang baru saja dimuat EF di request ini", "Versi yang diterima client 5 menit lalu dan dikirim balik", "Tidak perlu versi: `[Timestamp]` menanganinya otomatis", "Versi terbaru di tabel"], "Versi yang barusan dimuat sudah mencakup editan orang lain, jadi membandingkannya tak akan menangkap konflik."]
    ]
  },
  perf: {
    splits: ['1 · Setup & RateLimiter', '2 · Endpoint cache', '3 · Model & DbContext'],
    terms: [
      ['`OutputCache`', 'Menyimpan byte respons HTTP utuh per kunci rute atau query sehingga `GET` identik melewati eksekusi endpoint.'],
      ['`HybridCache` (anti-stampede)', 'Menggabungkan cache memori L1 + L2 terdistribusi dan menyatukan miss paralel supaya 1.000 request cukup memicu 1 query DB.'],
      ['Invalidasi cache', 'Menghapus entri cache basi (`EvictByTagAsync` / `RemoveAsync`) setiap kali ada operasi tulis `POST`/`PUT`/`DELETE`.']
    ],
    title: 'Performance: caching, rate limiting, dan jebakan async',
    why: "Optimasi performa berarti mengukur lebih dulu lalu menarik beberapa tuas yang efeknya terukur. Tantangannya adalah memilih tuas yang pas sambil menimbang sejauh mana data boleh basi.",
    points: [
      "Ukur sebelum mengoptimasi memakai load test (k6, bombardier, NBomber) dan profiler. Pantau latency p50, p95, dan p99 ketimbang angka rata-rata.",
      "Pilih **lapisan cache** sesuai skala: output caching untuk response HTTP utuh, `HybridCache` untuk object in-memory plus level dua terdistribusi, atau Redis jika app jalan di banyak server.",
      "Tiap cache wajib menjawab tiga hal: key-nya apa, kapan kedaluwarsanya, dan kapan dibuang saat data berubah. `HybridCache` juga menahan stampede agar cuma satu callback factory jalan untuk key yang baru expired.",
      "**Rate limiting** membalas `429` saat client mengirim request berlebih. Partisi jatahnya per user atau IP supaya satu client yang agresif tak memblokir semua user.",
      "Hindari **thread-pool starvation** gara-gara mem-block task async dengan `.Result` atau `.Wait()`, yang bikin latency melonjak saat CPU santai. Gunakan async dari hulu ke hilir.",
      "Langkah hemat lainnya: kompresi response, pagination di semua list, `IHttpClientFactory` untuk HTTP client, dan `IAsyncEnumerable` untuk streaming data besar."
    ],
    practice: "Load test satu endpoint API dan catat latency p95 beserta RPS-nya. Tambah output caching, ukur lagi, dan hitung selisihnya sekaligus batas maksimal data bisa basi. Setelah itu bombardir endpoint-nya dari satu client lalu pastikan client kedua tetap lolos.",
    teach: "Jelaskan apa itu thread-pool starvation dan kenapa CPU terlihat rendah sementara server berhenti merespons.",
    analogy: "Thread-pool starvation seperti call center yang semua agennya sedang tertahan di telepon menunggu pemasok. Tidak ada yang bekerja berat, tapi tidak satu pun pelanggan baru bisa dilayani.",
    pitfalls: [
      "Menyimpan data pribadi user di cache memakai key global, membocorkan data ke user lain.",
      "Memakai satu kuota rate limit untuk semua traffic sehingga satu bot memicu error 429 ke seluruh user.",
      "Mempartisi limit berdasarkan IP di belakang load balancer tanpa konfigurasi forwarded headers, membuat semua request memakai IP balancer yang sama.",
      "Memasang cache membabi buta sebelum mengukur di mana waktu benar-benar habis.",
      "Cuma mengecek latency rata-rata, padahal ekor lambat di p95 dan p99 yang bikin user mengeluh."
    ],
    quiz: [
      ["Latency naik, CPU di 15%, dan kodenya berisi pemanggilan `.Result`. Penyebab yang paling mungkin?", ["Loop yang CPU-bound", "Thread-pool starvation karena mem-block pekerjaan async", "Garbage collector", "Serialisasi JSON yang lambat"], "Thread yang diblokir tidak bekerja tapi tetap dihitung sibuk, sementara antrean request baru kehabisan thread."],
      ["Status code apa yang seharusnya dikembalikan rate limiter?", ["401", "403", "429", "503"], "429 Too Many Requests, idealnya dengan header `Retry-After`. 503 berarti seluruh service sedang down."],
      ["Dengan `AddTokenBucketLimiter(\"api\", …)` tanpa partisi, satu client mengirim 10.000 request. Apa yang terjadi pada yang lain?", ["Tidak ada, setiap client punya embernya sendiri", "Mereka juga mendapat 429: semuanya berbagi satu ember", "Server-nya crash", "Hanya IP client itu yang otomatis diblokir"], "Limiter tanpa partisi berarti satu ember bersama. Partisi per user atau IP biar jatah tiap client terpisah."],
      ["Kenapa aplikasi yang berjalan di beberapa server harus memakai distributed cache untuk data bersama?", ["Selalu lebih cepat", "Cache in-memory itu per instance, jadi antar instance bisa berbeda isinya", "ASP.NET Core mewajibkannya", "Cache memory tidak bisa membuat entry kedaluwarsa"], "Tiap instance menyimpan memory sendiri, jadi cache bersama menjaga semua server sinkron."]
    ]
  },
  arch: {
    splits: ['1 · Wiring aplikasi', '2 · Slice PlaceOrder', '3 · Entity domain', '4 · Outbox & worker'],
    terms: [
      ['Vertical slice', 'Mengelompokkan kode berdasarkan fitur (`PlaceOrder.cs` berisi command, validasi, handler, endpoint) bukan memisahkannya ke banyak folder per layer.'],
      ['Entity domain kaya', 'Menjaga aturan bisnis di dalam method factory atau behavior (`Order.Place(...)`) sehingga state invalid mustahil terbuat.'],
      ['Transactional Outbox', 'Menulis baris bisnis dan `OutboxMessage` di transaksi DB *yang sama*, lalu `BackgroundService` mengirimkannya ke broker.']
    ],
    title: 'Arsitektur: batasan, slice, dan pekerjaan di background',
    why: "Arsitektur adalah menentukan bagian mana yang bebas berubah tanpa merusak bagian lain. Pola apa pun baru masuk akal kalau kamu paham alasan pemakaiannya sekaligus tahu kapan ia berlebihan.",
    points: [
      "Pilih **Layered / Clean Architecture** saat ingin melindungi aturan bisnis dari gonta-ganti framework: domain ada di tengah dan dependensi mengarah ke dalam.",
      "Pilih **vertical slice** untuk menyusun kode per fitur (`PlaceOrder`) agar request, validasi, handler, dan query-nya terkumpul di satu file/folder.",
      "Pakai **CQRS** untuk memisahkan model baca dan tulis jika pola beban atau bentuk datanya memang beda jauh, dan abaikan untuk CRUD biasa.",
      "Jaga aturan yang tak boleh dilanggar di dalam **domain model** (misalnya `Order` menolak kuantitas nol/minus) bukan disebar di tiap endpoint. Tetap validasi input request di gerbang awal, sementara domain menjadi garis pertahanan akhir.",
      "Lempar tugas berat keluar dari request lewat `BackgroundService` atau queue. Dengan **outbox pattern**, data bisnis dan pesan event disimpan dalam satu transaksi DB agar keduanya selalu sinkron.",
      "Mulai .NET 8, exception yang lolos di `BackgroundService` langsung **menghentikan seluruh aplikasi**, jadi tangkap dan catat error di dalam loop-nya.",
      "Awali dari **modular monolith**, dan baru pecah menjadi beberapa service bila skala atau pembagian tim menuntut. Sistem terdistribusi justru menambah titik gagal baru."
    ],
    practice: "Ambil API CRUD-mu lalu rapikan satu fiturnya menjadi vertical slice dengan method domain penjaga aturan. Setelah itu tulis setengah halaman argumen: untuk tim bertiga yang bikin aplikasi internal, apakah kamu pilih layer, slice, atau minimal API biasa, dan kenapa?",
    teach: "Jelaskan outbox pattern: kegagalan apa yang dicegahnya dan bagaimana cara kerjanya?",
    analogy: "Outbox itu seperti menulis 'kirim kuitansi ini' di baris pembukuan yang persis sama dengan catatannya penjualan. Meski kurir telat atau kantor pos lagi tutup, suratnya tidak mungkin terlupa karena sudah jadi bagian dari transaksi penjualan itu sendiri.",
    pitfalls: [
      "Memaksakan Clean Architecture, CQRS, dan mediator ke aplikasi CRUD berisi lima endpoint.",
      "Membuat model domain kosong yang semua aturannya lari ke 'service' lain, menyisakan entity berisi setter doang.",
      "Menaruh `INT IDENTITY` ke outbox payload sebelum `SaveChanges` karena nilainya masih 0. Generate id-nya di C# seperti `Order` membuat `Guid`.",
      "Membiarkan loop `BackgroundService` tanpa `try/catch`, sehingga satu kegagalan mematikan seluruh host.",
      "Memecah kode semrawut menjadi microservice dengan harapan masalah desain beres, padahal cuma memindah kerumitan ke jaringan."
    ],
    quiz: [
      ["Apa yang dijamin oleh outbox pattern?", ["Pesan langsung terkirim saat itu juga", "Pesan disimpan dalam transaction yang sama dengan perubahan datanya, sehingga tidak ada yang terjadi tanpa yang lain", "Tidak ada pesan yang terkirim dua kali", "Database tidak pernah ter-lock"], "Tulisannya atomik, lalu publisher mengirimnya minimal sekali di background. Sisi penerima tetap perlu tahan duplikat."],
      ["Kenapa `BackgroundService` membuat scope untuk memakai `DbContext`?", ["Demi performance", "Hosted service itu singleton dan `DbContext` itu scoped", "Scope diwajibkan untuk logging", "Untuk membuka transaction database"], "Memasukkan service scoped ke singleton memicu captive dependency, makanya buat scope baru per unit kerja."],
      ["Sebuah exception lolos dari `ExecuteAsync` di `BackgroundService` .NET 10. Bawaannya…", ["Dicatat di log lalu service-nya restart", "Diabaikan", "Seluruh aplikasi berhenti", "Hanya request itu yang gagal"], "Sejak .NET 8, host otomatis berhenti waktu background service crash, jadi bungkus pakai try/catch di loop."],
      ["Kapan CQRS sepadan dengan ongkosnya?", ["Selalu", "Saat model baca dan tulis sangat berbeda bentuk atau bebannya", "Kapan pun memakai EF Core", "Hanya dengan microservice"], "CQRS menambah duplikasi dan kompleksitas, jadi baru sepadan saat baca dan tulis betul-betul punya kebutuhan berbeda."]
    ]
  },
  prod: {
    splits: ['1 · Telemetri & resiliensi', '2 · Health check & client', '3 · Dockerfile & kontainer'],
    terms: [
      ['Trace & metrik OpenTelemetry', 'Menghubungkan log, latency, dan span SQL/HTTP lintas service memakai header W3C Trace Context.'],
      ['Probe Liveness vs Readiness', '`/health/live` mengecek apakah proses hidup, sementara `/health/ready` mengecek apakah DB siap melayani traffic.'],
      ['Circuit breaker + retry ber-jitter', 'Melindungi dependency yang bermasalah dari kegagalan beruntun memakai handler resiliensi standar dan idempotency key.']
    ],
    title: 'Production: observability, resilience, dan deployment',
    why: "Tugasmu belum kelar waktu kode cuma lolos compile. Kode baru beres waktu tahan dipakai user sungguhan, artinya siap menghadapi hari ketika ada bagian yang tumbang di production.",
    points: [
      "**Observability** memadukan log, metric, dan trace, dengan **OpenTelemetry** sebagai standarnya untuk melacak perjalanan satu request lintas service.",
      "Pisahkan **health check** menjadi liveness ('restart kontainer kalau gagal') dan readiness ('tahan traffic dulu ke instance ini'), sebab dua-duanya menjawab pertanyaan yang berbeda.",
      "**Resilience** pada panggilan keluar butuh timeout, retry pakai jitter untuk gangguan sesaat, dan circuit breaker agar tidak terus menghantam dependency yang mati. `AddStandardResilienceHandler()` menyalakan semuanya.",
      "Ingat bahwa handler standar me-retry **semua** HTTP method termasuk `POST`. Biarkan aktif cuma jika layanan tujuan memakai idempotency key, atau matikan retry untuk method pengubah data.",
      "Kirim aplikasi sebagai container image yang stateless dengan config dari environment supaya instance mana pun bebas melayani request. Sejak .NET 8, kontainer mendengarkan di port **8080**.",
      "Deploy bertahap memakai migrasi database yang aman bagi versi lama, graceful shutdown, rolling atau blue/green release, serta rencana rollback yang benar-benar teruji."
    ],
    practice: "Bungkus API-mu dalam container bersama SQL Server memakai Docker Compose. Pasang OpenTelemetry mengarah ke dashboard Aspire lokal, lalu matikan database di tengah traffic dan bandingkan apa yang muncul di health check, log, dan trace.",
    teach: "Jelaskan perbedaan liveness check dan readiness check disertai contoh situasi saat jawabannya berlawanan.",
    analogy: "Circuit breaker mirip sekring di panel listrik rumah: sesudah korsleting berulang kali, sakelarnya langsung putus supaya kabel tidak kebakar, baru membolehkan arus lewat lagi setelah aman.",
    pitfalls: [
      "Me-retry request tidak idempotent sehingga kartu user terpotong dua kali. Handler standar ikut me-retry `POST` kecuali kamu membatasinya.",
      "Memakai satu endpoint health check yang ikut mengetes DB sehingga gangguan DB sebentar me-restart seluruh server.",
      "Menjalankan migrasi yang langsung menghapus kolom saat versi aplikasi lama masih aktif membacanya.",
      "Memetakan port 80 ke container padahal ASP.NET Core sejak .NET 8 mendengarkan di port 8080."
    ],
    quiz: [
      ["Database mati selama 20 detik. Apa yang seharusnya dilaporkan liveness probe?", ["Unhealthy, supaya aplikasinya restart", "Healthy: proses aplikasinya sendiri baik-baik saja", "Unhealthy, tapi baru setelah 10 detik", "Degraded"], "Me-restart aplikasi tidak memperbaiki SQL Server, jadi readiness yang wajib gagal sementara liveness tetap hijau."],
      ["Apa yang dilakukan circuit breaker setelah kegagalan berulang?", ["Me-retry lebih cepat", "Langsung menggagalkan panggilan sementara ketimbang menghubungi dependency yang bermasalah", "Me-restart server", "Otomatis pindah ke server cadangan"], "Ia memberi waktu bagi dependency untuk pulih sambil melindungi thread pool dan latency aplikasimu."],
      ["Operasi mana yang aman di-retry otomatis tanpa desain tambahan?", ["`POST /payments`", "`GET /products/5`", "`POST /orders`", "Mengirim email"], "`GET` bersifat idempotent, sedangkan operasi lain butuh idempotency key lebih dulu."]
    ]
  }
}
};

export default trackId;
