// Bahasa Indonesia — track C#. Contoh kode tetap memakai versi aslinya.
I18N.lessons('csharp', {
  types: {
    title: 'Program, variabel, dan type',
    why: "Setiap program C# pada dasarnya adalah value ber-type yang mengalir lewat statement. Begitu murid paham bahwa compiler mengecek type **sebelum** program dijalankan, separuh error pemula tidak lagi terasa misterius.",
    points: [
      "Source code C# di-compile menjadi IL (intermediate language); .NET runtime (CLR) mengubah IL jadi machine code saat program berjalan (JIT). `dotnet run` mengerjakan kedua langkah itu.",
      "Variabel adalah kotak bernama dengan type yang tetap: `int`, `double`, `decimal` (uang), `bool`, `char`, `string`. Type-nya tidak pernah berubah setelah dideklarasikan.",
      "`var` bukan berarti 'type apa saja'. Compiler menyimpulkan type-nya dari sisi kanan, lalu menguncinya.",
      "C# itu statically typed: `int x = \"hello\";` gagal saat compile time, bukan saat run time. Itu fitur — error ketahuan sebelum sampai ke user.",
      "String interpolation `$\"Total: {price * qty}\"` adalah cara sehari-hari untuk menyusun teks.",
      "Pembagian integer membuang pecahannya: `7 / 2` hasilnya `3`. Jadikan salah satu sisinya `double` atau `decimal` supaya pecahannya tetap ada."
    ],
    practice: "Buat console app dengan `dotnet new console`. Deklarasikan nama, tahun lahir, dan tarif per jam kamu, lalu cetak satu kalimat yang memuat umurmu dan penghasilanmu untuk 40 jam kerja seminggu. Setelah itu, sengaja munculkan satu type error dan baca pesan compiler-nya dengan teliti.",
    teach: "Jelaskan ke orang yang belum pernah programming apa itu variabel dan type, dan kenapa C# menolak menjalankan `int x = \"hello\"`.",
    analogy: "Variabel itu seperti toples berlabel di dapur: toples bertuliskan 'tepung' hanya boleh diisi tepung. Compiler adalah koki galak yang memeriksa semua toples sebelum mulai memasak, jadi tidak ada yang baru sadar ada garam di toples gula saat masakan sudah setengah jadi.",
    pitfalls: [
      "Mengira `var` membuat variabel jadi dinamis seperti di JavaScript. Tunjukkan bahwa `var x = 1; x = \"a\";` tidak bisa di-compile.",
      "Memakai `double` untuk uang lalu kaget dengan hasil `0.1 + 0.2`. Uang itu `decimal`.",
      "Berharap `7 / 2` menghasilkan `3.5`. Type operand-lah yang menentukan operasinya."
    ],
    quiz: [
      ["Apa arti `var total = 5;` di C#?", ["`total` nantinya bisa menyimpan type apa saja", "`total` adalah `int`, disimpulkan oleh compiler", "Type `total` ditentukan saat run time", "`total` adalah variabel global"], "`var` adalah type inference saat compile time. Variabelnya akan selamanya `int`."],
      ["Apa yang dicetak `Console.WriteLine(9 / 2);`?", ["4.5", "4", "5", "Tidak bisa di-compile"], "Kedua operand-nya `int`, jadi C# melakukan pembagian integer dan membuang pecahannya."],
      ["Type mana yang cocok untuk menyimpan harga?", ["`float`", "`double`", "`decimal`", "`int`"], "`decimal` berbasis 10 dan bisa merepresentasikan nilai seperti 0.10 secara persis; binary floating point tidak bisa."]
    ]
  },
  flow: {
    title: 'Control flow dan method',
    why: "Keputusan, pengulangan, dan langkah bernama yang bisa dipakai ulang adalah seluruh tata bahasa logika programming. Semua yang datang belakangan — LINQ, async, web request — dibangun dari sini.",
    points: [
      "`if / else if / else` memilih cabang berdasarkan ekspresi `bool`. `==` membandingkan, `=` meng-assign.",
      "`for` kalau jumlah pengulangannya sudah diketahui, `foreach` untuk menelusuri collection, `while` untuk mengulang sampai sebuah kondisi berubah.",
      "Method adalah blok bernama dengan parameter ber-type dan return value ber-type: `static int Add(int a, int b) => a + b;`.",
      "Secara default, argumen dikirim **by value**: method menerima salinan dari isi variabelnya.",
      "Ekspresi `switch` mengubah sebuah value jadi hasil dalam satu ekspresi, dan memberi warning kalau ada case yang terlewat.",
      "Jaga method tetap kecil dan beri nama sesuai apa yang dikembalikan atau dikerjakannya. Nama yang bagus adalah dokumentasi pertama."
    ],
    practice: "Tulis FizzBuzz untuk 1 sampai 30 sebagai method `string FizzBuzz(int n)` plus sebuah loop yang memanggilnya. Lalu tulis ulang isi method-nya sebagai ekspresi `switch` terhadap tuple `(n % 3, n % 5)`.",
    teach: "Jelaskan perbedaan loop `for` dan `foreach`, dan kapan kamu memilih membuat method daripada menyalin kode.",
    analogy: "Method itu kartu resep: punya nama, daftar bahan (parameter), dan menghasilkan sebuah masakan (return value). Memanggil method sama dengan meminta seseorang memasak sesuai kartu itu — kamu tidak perlu menulis ulang resepnya setiap kali lapar.",
    pitfalls: [
      "Loop yang off-by-one: `i <= array.Length` membaca melewati ujung array. Array mulai dari 0 dan berakhir di `Length - 1`.",
      "Menulis `if (x = 5)`. Di C# ini compile error untuk type selain bool — momen yang pas untuk menjelaskan `=` versus `==`.",
      "Mengira method bisa mengubah argumen `int` milik pemanggilnya. Method hanya mendapat salinan, kecuali memakai `ref` atau `out`."
    ],
    quiz: [
      ["Loop mana yang paling pas untuk mengunjungi setiap item `List<string>` secara berurutan?", ["`while`", "`foreach`", "`do … while`", "`goto`"], "`foreach` langsung mengekspresikan 'setiap elemen' dan tidak mungkin keluar batas."],
      ["Method `void Reset(int n) { n = 0; }` dipanggil dengan `Reset(count)`. Berapa nilai `count` setelahnya?", ["0", "Tidak berubah", "null", "Compile error"], "`int` dikirim by value: method itu hanya me-nol-kan salinannya sendiri."],
      ["Apa arti `_` pada arm ekspresi `switch`?", ["Syntax error", "Variabel bernama underscore", "Default case yang cocok dengan apa saja", "Mengulang arm sebelumnya"], "`_` adalah discard pattern — cocok dengan value apa pun yang belum tertangkap sebelumnya."]
    ]
  },
  classes: {
    title: 'Class, object, dan property',
    why: "Inti C# adalah object-oriented. Controller ASP.NET, entity EF, dan DTO semuanya class; murid yang tidak bisa membaca class tidak akan bisa membaca codebase sungguhan mana pun.",
    points: [
      "**Class** adalah cetak biru; **object** adalah satu instance yang dibuat dengan `new`.",
      "State disimpan di property (`public string Name { get; set; }`), behavior ada di method.",
      "Constructor menjamin object dimulai dalam state yang valid. Data yang wajib ada ditaruh di constructor atau property `required`.",
      "**Encapsulation**: jadikan field `private` dan buka hanya yang dibutuhkan pemanggil. `private set` membuat class bisa menjaga aturannya sendiri.",
      "Member `static` adalah milik class-nya, bukan milik instance mana pun.",
      "`this` merujuk ke object yang sedang aktif. Biasanya tidak perlu ditulis."
    ],
    practice: "Tambahkan method `Withdraw` yang menolak penarikan melebihi saldo. Lalu tambahkan method `Transfer(BankAccount to, decimal amount)`. Aturan mana yang tinggal di method mana, dan kenapa `Balance` sebaiknya tetap private set?",
    teach: "Jelaskan perbedaan class dan object, dan kenapa `Balance` memakai private setter alih-alih bebas ditulis siapa saja.",
    analogy: "Class adalah gambar rancangan arsitek; object adalah rumah-rumah yang benar-benar dibangun dari rancangan itu. Encapsulation adalah pintu depan: tamu memencet bel (public method), bukan memanjat jendela lalu mengutak-atik instalasi listrik (private field).",
    pitfalls: [
      "Tertukar antara class dan instance — mencoba memanggil `BankAccount.Deposit(5)` tanpa object.",
      "Membuat semuanya `public` 'biar simpel'. Tunjukkan bug ketika kode luar mengisi saldo negatif.",
      "Mengira property sama saja dengan field. Property adalah sepasang method, dan bisa memvalidasi atau menghitung."
    ],
    quiz: [
      ["Apa yang diizinkan oleh `public decimal Balance { get; private set; }`?", ["Siapa saja boleh membaca dan menulis", "Siapa saja boleh membaca; hanya class itu yang boleh menulis", "Hanya class itu yang boleh membaca", "Tidak ada yang boleh menulis, selamanya"], "Getter-nya public dan setter-nya private, jadi class itu mengontrol setiap perubahan."],
      ["Apa tugas constructor?", ["Menghancurkan object", "Menempatkan object baru dalam state awal yang valid", "Membuat class jadi static", "Menyalin object"], "Constructor dijalankan sekali saat object dibuat dan menetapkan invariant-nya."],
      ["Method `static`…", ["dimiliki tiap object secara terpisah", "dimiliki class-nya dan tidak butuh instance", "tidak bisa mengembalikan value", "otomatis dijalankan saat startup"], "Member static dipanggil lewat type-nya langsung, misalnya `Math.Max(1, 2)`."]
    ]
  },
  memory: {
    title: 'Value type vs reference type',
    why: "'Kok mengubah satu variabel bikin variabel lain ikut berubah?' adalah bug level menengah yang paling sering muncul di C#. Jawabannya selalu soal value semantics versus reference semantics.",
    points: [
      "**Value type** (`int`, `bool`, `decimal`, `struct`, `enum`): variabelnya menyimpan datanya langsung. Assignment menyalin datanya.",
      "**Reference type** (`class`, `string`, array, `List<T>`): variabelnya menyimpan reference ke object di heap. Assignment menyalin reference-nya — dua variabel, satu object.",
      "Variabel lokal tinggal di stack frame milik method; object yang dibuat dengan `new` dari sebuah class tinggal di managed heap dan dibersihkan oleh garbage collector.",
      "`string` adalah reference type yang **immutable**, jadi dalam praktik ia berperilaku seperti value: 'mengubah' string sebenarnya membuat string baru.",
      "`==` pada class secara default membandingkan reference; pada value type dan record, yang dibandingkan isinya.",
      "`null` berarti reference tidak menunjuk ke apa pun. Value type tidak bisa null kecuali ditulis sebagai `int?`."
    ],
    practice: "Tebak dulu, baru jalankan: buat `struct Point { public int X; }` dan `class PointC { public int X; }`. Assign masing-masing ke variabel kedua, ubah `X` di variabel kedua, lalu cetak keduanya. Jelaskan kenapa hasilnya berbeda.",
    teach: "Jelaskan kenapa `p2.Name = \"Budi\"` ikut mengubah `p1.Name`, sedangkan `b = 9` tidak mengubah `a`.",
    analogy: "Value type itu selembar kertas: kalau difotokopi, coretan di fotokopiannya tidak mengubah aslinya. Reference type itu link ke dokumen online bersama: begitu link-nya kamu bagikan ke teman, editan mereka langsung muncul di layarmu juga.",
    pitfalls: [
      "'Value type tinggal di stack, reference type di heap' itu penyederhanaan. Struct di dalam class tinggal di heap. Ajarkan semantics-nya dulu (disalin vs dibagi), lokasinya belakangan.",
      "Mengira mengirim class ke method berarti menyalin object-nya. Yang disalin adalah reference-nya.",
      "Berharap `Replace(p)` mengubah variabel milik pemanggil. Tanpa `ref`, yang diarahkan ulang hanya reference lokal di dalam method."
    ],
    quiz: [
      ["Setelah `var x = new List<int>{1}; var y = x; y.Add(2);`, ada berapa item di `x`?", ["1", "2", "0", "Melempar exception"], "`List<T>` adalah reference type; `x` dan `y` menunjuk ke list yang sama."],
      ["Mana yang termasuk value type?", ["`string`", "`int[]`", "`struct DateOnly`", "`class Order`"], "Struct adalah value type. String dan array adalah reference type."],
      ["Kenapa `string` terasa seperti value type?", ["Karena disimpan di stack", "Karena immutable dan `==` membandingkan isinya", "Karena ia sebuah struct", "Karena tidak bisa null"], "String adalah object di heap, tapi tidak pernah bisa berubah, dan operator equality-nya di-overload untuk membandingkan karakter."]
    ]
  },
  interfaces: {
    title: 'Interface, inheritance, dan polymorphism',
    why: "ASP.NET Core dibangun di atas interface — `ILogger`, `IServiceCollection`, abstraksi `DbContext`. Dependency injection dan unit testing baru masuk akal setelah interface dipahami.",
    points: [
      "**Interface** adalah kontrak: daftar member tanpa state. Class yang mengimplementasikannya berjanji menyediakan semua member itu.",
      "**Polymorphism**: kode yang ditulis terhadap `IShape` bisa bekerja dengan shape apa pun, termasuk yang baru ditulis tahun depan.",
      "Inheritance (`class Dog : Animal`) berbagi implementasi. `virtual` menandai method yang boleh di-`override` oleh subclass.",
      "Sebuah class hanya bisa mewarisi satu base class, tapi bisa mengimplementasikan banyak interface.",
      "Utamakan **composition dan interface** daripada pohon inheritance yang dalam. Inheritance mengikatmu ke implementasi milik parent.",
      "Class `abstract` ada di tengah-tengah: ada kode yang dibagi, plus member yang wajib diisi subclass."
    ],
    practice: "Tambahkan `FakeNotifier` yang mencatat pesan ke `List<string>` alih-alih mengirimkannya. Pakai untuk memastikan `OrderService.Place` mengirim tepat satu pesan. Selamat, kamu baru saja menulis test double untuk unit test.",
    teach: "Jelaskan apa itu interface dan kenapa `OrderService` meminta `INotifier` alih-alih membuat `EmailNotifier` sendiri.",
    analogy: "Interface itu stopkontak di dinding. Lampu tidak peduli listriknya berasal dari batu bara, panel surya, atau genset — ia hanya butuh bentuk colokannya pas. Ganti pembangkitnya, lampunya tetap menyala.",
    pitfalls: [
      "Refleks membuat interface untuk setiap class. Interface baru layak ada kalau memang ada, atau akan ada, beberapa implementasi atau sebuah test double.",
      "Tertukar antara `override` dan `new` (hiding). Hanya `override` yang ikut dalam polymorphism.",
      "Memakai inheritance untuk code reuse di antara hal yang tidak berhubungan: hubungan 'is-a' harus benar di setiap pemakaian."
    ],
    quiz: [
      ["Berapa banyak interface yang bisa diimplementasikan satu class C#?", ["Satu", "Dua", "Berapa pun", "Tidak bisa kalau sudah punya base class"], "Single inheritance untuk class, multiple implementation untuk interface."],
      ["Method di base class harus ditandai apa supaya `override` bisa dipakai?", ["`static`", "`virtual` atau `abstract`", "`sealed`", "`private`"], "Hanya member yang virtual, abstract, atau sudah di-override yang bisa di-override."],
      ["Keuntungan utama `OrderService(INotifier n)` dibanding `new EmailNotifier()` di dalam class adalah…", ["Jalannya lebih cepat", "Dependency-nya bisa diganti atau dipalsukan tanpa mengubah `OrderService`", "Memory yang dipakai lebih sedikit", "Tidak perlu constructor"], "Bergantung pada abstraksi melepaskan class dari implementasi konkret — fondasi DI dan testing."]
    ]
  },
  generics: {
    title: 'Collection dan generics',
    why: "Program sungguhan sebagian besar isinya kumpulan data. Memilih antara `List`, `Dictionary`, dan `HashSet` adalah keputusan performance pertama yang diambil seorang developer.",
    points: [
      "`List<T>`: berurutan, bisa diakses lewat index, membesar otomatis. Mencari berdasarkan value itu O(n).",
      "`Dictionary<TKey, TValue>`: dari key ke value dalam O(1) rata-rata. Pakai `TryGetValue`, jangan menangkap exception.",
      "`HashSet<T>`: item unik dengan `Contains` yang cepat. `Queue<T>` dan `Stack<T>` untuk FIFO dan LIFO.",
      "**Generics** membuat satu class bisa dipakai untuk type apa pun sambil tetap type-safe: `List<int>` tidak bisa diisi string, dan tidak perlu casting.",
      "Constraint mempersempit apa saja yang boleh jadi `T`: `where T : IComparable<T>`, `where T : class, new()`.",
      "Terima type paling umum yang kamu butuhkan (`IEnumerable<T>`, `IReadOnlyList<T>`) dan kembalikan type paling spesifik yang berguna."
    ],
    practice: "Hitung frekuensi kata dalam sebuah paragraf memakai `Dictionary<string, int>`, lalu cetak tiga teratas. Setelah itu tulis class generic `Result<T>` yang menyimpan value atau pesan error.",
    teach: "Jelaskan kenapa mencari item di `Dictionary` lebih cepat daripada di `List`, dan apa manfaat `<T>` pada `List<T>`.",
    analogy: "`List` itu antrean orang: untuk mencari Budi kamu harus bertanya ke tiap orang satu per satu. `Dictionary` itu penitipan barang: kamu serahkan nomor 42, petugasnya langsung berjalan ke rak nomor 42. Generics itu alat pembuat label — desain kotaknya satu, tinggal dicap 'khusus sepatu' atau 'khusus buku'.",
    pitfalls: [
      "Memakai `list.Contains()` di dalam loop atas list lain — O(n²) tanpa sengaja. Ubah salah satunya jadi `HashSet`.",
      "Memanggil `dict[key]` untuk key yang tidak ada lalu kena `KeyNotFoundException`.",
      "Mengubah collection saat sedang di-iterate dengan `foreach`."
    ],
    quiz: [
      ["Kamu perlu mengecek ribuan kali apakah sebuah ID sudah pernah muncul. Pilihan terbaik?", ["`List<int>`", "`int[]`", "`HashSet<int>`", "`Queue<int>`"], "`HashSet.Contains` rata-rata O(1); scan pada list O(n)."],
      ["Apa yang disyaratkan `where T : new()`?", ["T adalah value type", "T punya public constructor tanpa parameter", "T baru saja dideklarasikan", "T mengimplementasikan `ICloneable`"], "Constraint `new()` membuat kode generic bisa menulis `new T()`."],
      ["Cara paling aman membaca key dictionary yang mungkin tidak ada?", ["`dict[key]` di dalam try/catch", "`dict.TryGetValue(key, out var v)`", "`dict.First()`", "`dict.Keys[key]`"], "`TryGetValue` hanya melakukan satu lookup dan melaporkan berhasil atau tidaknya tanpa exception."]
    ]
  },
  linq: {
    title: 'LINQ: query untuk apa saja',
    why: "LINQ adalah cara developer C# memfilter, mengubah, dan meng-aggregate data — baik di memory maupun, lewat EF Core, di SQL. Inilah jembatan antara track C# dan track SQL.",
    points: [
      "Method LINQ adalah extension method pada `IEnumerable<T>`: `Where` memfilter, `Select` mengubah, `OrderBy` mengurutkan, `GroupBy` mengelompokkan.",
      "Lambda seperti `x => x.Price > 10` adalah function kecil inline yang dikirim sebagai argumen.",
      "**Deferred execution**: menyusun query belum mengerjakan apa-apa. Query baru jalan saat di-enumerate (`foreach`, `ToList()`, `Count()`, `First()`).",
      "Setiap enumerasi menjalankan ulang query-nya. Panggil `ToList()` sekali kalau hasilnya mau dipakai berkali-kali.",
      "`First()` melempar exception kalau kosong, `FirstOrDefault()` mengembalikan `null`/default, `Single()` menuntut tepat satu.",
      "Pada `IQueryable<T>` (EF Core), method yang sama diterjemahkan jadi SQL, bukan dijalankan di memory."
    ],
    practice: "Dari list order (customer, amount, date), pakai LINQ untuk mencari total belanja tiap customer, diurutkan dari yang terbesar, ambil tiga teratas saja. Lalu taruh `Console.WriteLine` di dalam lambda `Where` dan amati kapan persisnya ia tercetak.",
    teach: "Jelaskan deferred execution: kenapa query LINQ dengan `Where` dan `Select` tidak mengerjakan apa pun sampai ada `foreach` atau `ToList()`?",
    analogy: "Query LINQ itu lembar instruksi yang ditempel di atas jalur perakitan: 'ambil yang merah, cat, kemas tiga yang pertama'. Menulis instruksinya tidak menggerakkan satu kotak pun. Jalurnya baru bergerak saat ada orang berdiri di ujung dan meminta hasilnya.",
    pitfalls: [
      "Meng-enumerate query yang sama dua kali sehingga operasi mahal (atau panggilan ke database) jalan dua kali.",
      "Memakai `Count() > 0` padahal ada `Any()` — yang satu menghitung semuanya, yang lain berhenti di kecocokan pertama.",
      "Memanggil `ToList()` di tengah query EF Core dan diam-diam menarik seluruh isi tabel ke memory."
    ],
    quiz: [
      ["Kapan `var q = items.Where(x => x > 5);` memfilter item-nya?", ["Saat itu juga", "Saat `q` di-enumerate", "Saat compile time", "Tidak pernah"], "Operator LINQ itu lazy; pekerjaannya baru terjadi saat enumerasi."],
      ["Pemanggilan mana yang melempar exception kalau sequence-nya kosong?", ["`FirstOrDefault()`", "`Any()`", "`First()`", "`ToList()`"], "`First()` menuntut minimal satu elemen."],
      ["Cara terbaik untuk bertanya 'apakah ada minimal satu yang cocok?'", ["`Count() > 0`", "`Any()`", "`ToList().Count > 0`", "`First() != null`"], "`Any()` langsung berhenti begitu ada satu elemen yang cocok."]
    ]
  },
  delegates: {
    title: 'Delegate, lambda, dan event',
    why: "Function sebagai value adalah tenaga di balik LINQ, middleware, handler minimal API, dan semua callback di .NET. Inilah ide yang membuat framework terasa seperti sulap sampai kamu melihat cara kerjanya.",
    points: [
      "**Delegate** adalah type yang menyimpan method: 'sesuatu yang menerima `int` dan mengembalikan `bool`'.",
      "`Func<T, TResult>` mengembalikan value, `Action<T>` tidak mengembalikan apa-apa, `Predicate<T>` mengembalikan `bool`. Kamu jarang butuh delegate type buatan sendiri.",
      "**Lambda** `x => x * 2` adalah method inline. Kalau ia memakai variabel dari luar, ia menjadi **closure** dan meng-capture variabelnya, bukan snapshot nilainya.",
      "**Event** adalah delegate dengan akses terbatas: pihak luar hanya boleh subscribe (`+=`) dan unsubscribe (`-=`).",
      "Lupa unsubscribe membuat subscriber tetap hidup — memory leak klasik.",
      "`app.MapGet(\"/\", () => \"hi\")` sebenarnya hanya mengirim sebuah delegate ke framework."
    ],
    practice: "Tulis extension method `MyWhere` dan `MySelect` buatanmu sendiri memakai `Func` dan `yield return`. Lalu rangkai keduanya. Kamu baru saja mengimplementasikan ulang inti LINQ.",
    teach: "Jelaskan apa maksudnya lambda 'meng-capture' sebuah variabel, pakai contoh `count`.",
    analogy: "Delegate itu nomor telepon di selembar kartu. Kartunya bisa kamu berikan ke orang lain, dan mereka bisa meneleponnya nanti tanpa tahu siapa yang mengangkat. Event itu mailing list: siapa pun boleh daftar atau keluar, tapi hanya pemiliknya yang boleh mengirim newsletter.",
    pitfalls: [
      "Mengira closure menyalin value-nya. Closure berbagi variabel yang sama, jadi perubahan setelahnya ikut terlihat oleh lambda.",
      "Publisher yang berumur panjang menahan reference ke subscriber berumur pendek lewat event.",
      "Mendeklarasikan delegate type sendiri padahal `Func` atau `Action` sudah cukup."
    ],
    quiz: [
      ["Type mana yang menggambarkan method yang menerima `string` dan mengembalikan `int`?", ["`Action<string, int>`", "`Func<string, int>`", "`Func<int, string>`", "`Predicate<string>`"], "Pada `Func`, type argument terakhir adalah return type-nya."],
      ["`int n = 1; Func<int> f = () => n; n = 5;` Apa yang dikembalikan `f()`?", ["1", "5", "0", "Melempar exception"], "Closure meng-capture variabel `n`, bukan nilainya saat closure dibuat."],
      ["Apa yang bisa dilakukan kode di luar class terhadap `event` public milik class itu?", ["Meng-invoke-nya", "Meng-assign `null` ke event itu", "Hanya subscribe dan unsubscribe", "Membaca daftar subscriber-nya"], "Event membatasi pihak luar hanya pada `+=` dan `-=`."]
    ]
  },
  async: {
    title: 'async, await, dan Task',
    why: "Semua request handler di ASP.NET Core seharusnya async. Salah paham soal ini menyebabkan dua bug production terparah di .NET: thread-pool starvation dan deadlock.",
    points: [
      "`Task` merepresentasikan pekerjaan yang akan selesai nanti; `Task<T>` juga membawa hasilnya.",
      "`await` **tidak** mem-block. Ia mendaftarkan 'lanjutkan dari sini kalau task-nya selesai' lalu mengembalikan thread untuk mengerjakan hal lain.",
      "Async itu soal **tidak menyia-nyiakan thread selama menunggu** I/O (database, HTTP, disk). Ia tidak membuat satu operasi jadi lebih cepat.",
      "Async dari ujung ke ujung: jangan pernah memanggil `.Result` atau `.Wait()` pada task — itu mem-block thread dan bisa deadlock.",
      "Mulai dulu operasi-operasi yang independen, lalu `await Task.WhenAll(...)` supaya semuanya berjalan secara concurrent.",
      "`async void` hanya untuk event handler; exception di dalamnya tidak bisa ditangkap pemanggil. Teruskan `CancellationToken` di seluruh rantai pemanggilan async."
    ],
    practice: "Tulis tiga method yang masing-masing melakukan `await Task.Delay(1000)` lalu mengembalikan sebuah angka. Ukur dengan `Stopwatch` waktu meng-await satu per satu versus memakai `Task.WhenAll`. Lalu jelaskan perbedaannya dengan kata-katamu sendiri.",
    teach: "Jelaskan apa yang terjadi pada thread saat kode sampai di `await`, dan kenapa itu membuat web server bisa menangani lebih banyak request.",
    analogy: "Pelayan mengantar pesananmu ke dapur dan tidak berdiri menunggu di depan kompor sampai makanannya matang — ia melayani meja lain dan kembali saat bel berbunyi. `await` adalah belnya. Mem-block dengan `.Result` adalah pelayan yang berdiri memelototi kompor sementara restoran makin penuh.",
    pitfalls: [
      "'Async membuat kode jalan paralel di thread lain.' Bukan — untuk I/O, selama menunggu tidak ada thread sama sekali.",
      "Membungkus pekerjaan CPU yang synchronous dengan `Task.Run` di ASP.NET lalu menyebutnya 'async'. Itu cuma memindahkan pekerjaannya ke thread pool lain.",
      "Lupa menulis `await` — method langsung lanjut dan exception-nya lenyap."
    ],
    quiz: [
      ["Apa yang terjadi pada thread saat ini di `await http.GetAsync(url)` selama panggilan network masih berlangsung?", ["Tidur sampai response datang", "Dilepas untuk mengerjakan hal lain", "Berputar terus dalam loop", "Dihancurkan"], "`await` melepaskan thread; sebuah continuation melanjutkan method-nya nanti."],
      ["Ada tiga panggilan I/O independen, masing-masing 1 detik. Pendekatan benar yang paling cepat?", ["Await satu per satu", "Mulai ketiganya, lalu `await Task.WhenAll`", "Panggil `.Result` di tiap task", "`Thread.Sleep(1000)`"], "Memulai semua task sebelum meng-await membuat waktu tunggunya tumpang-tindih: total sekitar 1 detik, bukan 3."],
      ["Kenapa `.Result` perlu dihindari di ASP.NET Core?", ["Lebih lama diketik", "Mem-block thread dari thread pool dan bisa membuat pool kehabisan thread", "Mengembalikan nilai yang salah", "Tidak didukung"], "Thread yang ter-block tidak bisa melayani request lain; saat beban tinggi, pool-nya habis."]
    ]
  },
  modern: {
    title: 'Error, null safety, record, dan pattern',
    why: "C# modern membuat compiler bisa mencegah satu kategori bug sekaligus: null reference, cleanup yang terlupa, dan case yang tidak ditangani. Kode senior bisa dikenali dari cara fitur-fitur ini dipakai.",
    points: [
      "Exception itu untuk situasi yang **exceptional**. Lempar type yang spesifik, tangkap hanya yang bisa kamu tangani, dan jangan pernah menelannya dengan `catch` kosong.",
      "`using` menjamin `Dispose()` dijalankan — file, koneksi, dan HTTP response harus dilepas secara pasti.",
      "**Nullable reference type**: `string` berarti tidak pernah null, `string?` berarti mungkin null. Compiler memberi warning kalau kamu men-dereference value yang mungkin null.",
      "`?.` (null-conditional), `??` (fallback), dan `??=` (assign kalau null) membuat penanganan null jadi eksplisit dan ringkas.",
      "**Record** memberi value-based equality, immutability, dan salinan dengan `with` — ideal untuk DTO dan message.",
      "**Pattern matching** (`is`, `switch` dengan type pattern, property pattern, dan relational pattern) menggantikan rentetan cast dan if."
    ],
    practice: "Modelkan hierarki `Shape` dengan record (`Circle`, `Rect`, `Triangle`) dan tulis satu method `Area` memakai ekspresi `switch`. Aktifkan `<Nullable>enable</Nullable>` lalu bereskan semua warning tanpa memakai operator `!`.",
    teach: "Jelaskan perbedaan `string` dan `string?`, dan bagaimana itu mengubah apa yang dicek compiler untukmu.",
    analogy: "Anotasi nullable itu label di kotak: 'selalu ada isinya' atau 'mungkin kosong — lihat dulu sebelum merogoh'. `using` itu kartu kunci hotel yang otomatis nonaktif saat checkout, jadi kamu tidak mungkin lupa mengembalikannya.",
    pitfalls: [
      "Memakai exception untuk control flow biasa seperti 'user tidak ditemukan'. Kembalikan `null`, `bool`, atau result type saja.",
      "Membungkam warning nullable dengan `!` alih-alih memperbaiki penyebabnya.",
      "Mengira `record` cuma 'class versi pendek'. Yang penting justru value equality dan immutability-nya."
    ],
    quiz: [
      ["Berapa hasil `a?.B ?? c` kalau `a` null?", ["Melempar exception", "`null`", "`c`", "`a`"], "`a?.B` menghasilkan null, lalu `??` memberikan fallback `c`."],
      ["Dua record dengan nilai property yang identik, kalau dibandingkan dengan `==`, hasilnya…", ["tidak pernah sama", "sama", "sama hanya kalau instance-nya sama", "compile error"], "Record mengimplementasikan value-based equality."],
      ["Apa yang dijamin oleh `using var conn = new SqlConnection(cs);`?", ["Koneksinya lebih cepat", "`Dispose()` dipanggil saat scope berakhir, bahkan kalau ada exception", "Koneksinya tidak pernah ditutup", "Variabelnya static"], "`using` di-compile menjadi try/finally dengan `Dispose()` di blok finally."]
    ]
  },
  gc: {
    title: 'Memory, garbage collector, dan Span',
    why: "Dalam skala besar, allocation rate berarti latency. Seorang expert bisa membaca profiler, tahu apa yang sedang dikerjakan GC, dan bisa membuang alokasi dari hot path tanpa membuat kodenya sulit dibaca.",
    points: [
      "GC itu **generational**: object baru mulai di Gen 0; yang selamat dipromosikan ke Gen 1, lalu Gen 2. Kebanyakan object mati muda, jadi collection di Gen 0 itu murah.",
      "Object berukuran sekitar 85 KB ke atas masuk **Large Object Heap**, di-collect bersama Gen 2 dan secara default tidak di-compact — buffer besar yang sementara itu mahal.",
      "Collection Gen 2 bisa membuat aplikasi berhenti sejenak. Kurangi sampah di hot path: pakai ulang buffer (`ArrayPool<T>`), hindari LINQ dan string concatenation yang tidak perlu di dalam loop yang ketat.",
      "`Span<T>` dan `ReadOnlySpan<T>` adalah view ke memory yang sudah ada — memotong array dan string dengan **zero allocation**. Keduanya `ref struct`, tidak bisa tinggal di heap dan tidak bisa melewati `await`.",
      "`Memory<T>` adalah saudara `Span<T>` yang ramah heap, untuk kode async.",
      "Ukur dulu: `dotnet-counters`, `dotnet-trace`, dan BenchmarkDotNet dengan `[MemoryDiagnoser]`. Jangan pernah optimasi berdasarkan intuisi."
    ],
    practice: "Benchmark `SumSlow` dan `SumFast` dengan BenchmarkDotNet dan `[MemoryDiagnoser]`. Laporkan jumlah byte yang dialokasikan per pemanggilan untuk masing-masing, lalu jelaskan dari mana asal setiap alokasi di versi yang lambat.",
    teach: "Jelaskan kenapa sebagian besar garbage collection di .NET itu cepat, dan kode seperti apa yang membuatnya lambat.",
    analogy: "Gen 0 itu meja kerjamu: kertas coretan kamu bersihkan berkali-kali sehari dalam hitungan detik. Gen 2 itu gudang: membersihkannya berarti menghentikan semua kegiatan selama satu sore. Kode yang bagus membiarkan kertas berumur pendek tetap di meja dan tidak menyeretnya ke gudang. `Span` itu bingkai jendela yang kamu pegang di atas sebagian halaman — kamu membaca lewat bingkai itu tanpa memfotokopi.",
    pitfalls: [
      "Memanggil `GC.Collect()` untuk 'membantu'. Itu mempromosikan object terlalu dini dan biasanya malah merugikan.",
      "Mengubah semuanya jadi struct demi menghindari alokasi, lalu membayar lebih mahal untuk penyalinan.",
      "Mengoptimasi kode yang bukan hot path. Profile dulu."
    ],
    quiz: [
      ["Kenapa collection Gen 0 biasanya murah?", ["Karena jalan di GPU", "Sebagian besar object baru sudah mati, jadi sedikit yang perlu ditelusuri atau disalin", "Karena hanya jalan saat shutdown", "Karena melewati stack"], "Generational hypothesis: object muda mati muda, jadi Gen 0 punya sedikit survivor."],
      ["Kenapa `Span<T>` tidak bisa jadi field sebuah class?", ["Terlalu besar", "Ia `ref struct` dan harus tetap di stack", "Sudah obsolete", "Class tidak bisa menyimpan struct"], "Span bisa menunjuk ke memory di stack, jadi compiler melarangnya lolos ke heap."],
      ["Langkah pertama sebelum mengoptimasi pemakaian memory?", ["Tulis ulang dengan struct", "Panggil `GC.Collect()`", "Ukur dengan profiler atau benchmark", "Buang semua LINQ"], "Tanpa pengukuran, kamu tidak tahu di mana alokasinya terjadi dan apakah itu berpengaruh."]
    ]
  },
  concurrency: {
    title: 'Concurrency dan thread safety',
    why: "Web server menjalankan banyak request sekaligus. Shared state apa pun — static field, singleton service, cache — disentuh beberapa thread secara bersamaan, dan bug di area ini jarang muncul, acak, dan fatal.",
    points: [
      "**Race condition** terjadi ketika hasilnya bergantung pada timing antar-thread. `count++` itu read-modify-write dan **tidak atomic**.",
      "Lindungi shared mutable state: `lock` untuk critical section yang pendek, `Interlocked` untuk satu counter, `SemaphoreSlim` untuk kode async (`lock` tidak boleh melewati `await`).",
      "Lebih baik tidak berbagi sama sekali: data immutable, object per-request (scoped), atau message passing dengan `Channel<T>`.",
      "`ConcurrentDictionary` aman per operasi, tapi urutan check-then-act tetap bisa race. Pakai `GetOrAdd` dan `AddOrUpdate`.",
      "**Deadlock**: dua thread masing-masing memegang lock yang dibutuhkan thread lainnya. Selalu ambil lock dengan urutan yang konsisten dan pegang sebentar saja.",
      "`Parallel.ForEachAsync` dan `Task.WhenAll` untuk throughput; channel untuk pipeline producer/consumer dengan back-pressure."
    ],
    practice: "Bangun rate limiter in-memory sederhana (maksimal N panggilan per detik per key) yang tetap benar di bawah `Parallel.For`. Tulis test yang gagal untuk versi naif berbasis `Dictionary` dan lolos untuk versimu.",
    teach: "Jelaskan langkah demi langkah kenapa `count++` pada shared variable menghasilkan total yang salah kalau thread-nya banyak.",
    analogy: "Dua kasir berbagi satu kertas rekap. Dua-duanya membaca '41', dua-duanya menambah satu di kepala, dua-duanya menulis '42' — satu penjualan hilang. Lock adalah aturan bahwa hanya orang yang memegang pulpen yang boleh membaca dan menulis rekap itu.",
    pitfalls: [
      "'Di laptop saya jalan kok' — race bergantung pada timing dan jumlah core. Test yang lolos tidak membuktikan apa-apa di sini.",
      "Menganggap singleton service dengan field `List` itu aman di ASP.NET Core.",
      "Memakai `lock` yang membungkus `await` (tidak diizinkan), atau me-lock `this` maupun sebuah string."
    ],
    quiz: [
      ["Kenapa `count++` tidak aman antar-thread?", ["Karena lambat", "Karena terdiri dari tiga langkah (baca, tambah, tulis) yang bisa saling menyela", "Karena `int` adalah reference type", "Karena dibuang oleh compiler"], "Dua thread bisa membaca nilai lama yang sama lalu sama-sama menulis nilai lama + 1, sehingga satu update hilang."],
      ["Primitive mana yang memberi mutual exclusion yang bisa melewati `await`?", ["`lock`", "`SemaphoreSlim`", "`volatile`", "`Monitor.Enter`"], "`SemaphoreSlim.WaitAsync` bisa di-await; `lock` tidak boleh berisi `await`."],
      ["Strategi terbaik untuk thread safety secara keseluruhan?", ["Lock semuanya", "Sebisa mungkin hindari shared mutable state", "Pakai lebih banyak thread", "Pakai field `static`"], "State yang tidak dibagi, atau tidak bisa berubah, tidak mungkin mengalami race."]
    ]
  },
  internals: {
    title: 'Variance, reflection, source generator, dan performance',
    why: "Inilah lapisan tempat framework ditulis. Memahaminya menjelaskan cara kerja DI container, serializer, dan EF Core — dan membuatmu bisa menjawab pertanyaan 'sebenarnya itu cara kerjanya gimana?' yang cepat atau lambat akan ditanyakan murid.",
    points: [
      "**Covariance** (`out T`): `IEnumerable<Dog>` bisa dipakai sebagai `IEnumerable<Animal>` karena value-nya hanya keluar. **Contravariance** (`in T`): `Action<Animal>` bisa dipakai sebagai `Action<Dog>` karena value-nya hanya masuk.",
      "**Reflection** memeriksa type saat run time — begitulah DI menemukan constructor dan serializer menemukan property. Fleksibel tapi lambat, dan tidak ramah untuk trimming maupun Native AOT.",
      "**Source generator** menulis kode saat compile time: context `System.Text.Json`, `[GeneratedRegex]`, `LoggerMessage`. Sama praktisnya, tanpa reflection saat run time.",
      "**Expression tree** merepresentasikan kode sebagai data — begitulah EF Core mengubah `x => x.Age > 18` menjadi `WHERE Age > 18`.",
      "Tiered compilation pada JIT, inlining, dan devirtualization membuat micro-benchmark menipu kecuali kamu memakai BenchmarkDotNet.",
      "Urutan prioritas performance: algoritma dan I/O dulu, alokasi kedua, micro-optimization paling akhir."
    ],
    practice: "Tulis DI container minimal (`Register<TInterface, TImpl>()`, `Resolve<T>()`) yang memakai reflection untuk menemukan constructor dan me-resolve parameternya secara rekursif. Lalu jelaskan apa bedanya kalau container itu dibuat dengan source generator.",
    teach: "Jelaskan kenapa `IEnumerable<Dog>` bisa diperlakukan sebagai `IEnumerable<Animal>`, tapi `List<Dog>` tidak bisa diperlakukan sebagai `List<Animal>`.",
    analogy: "Vending machine yang hanya mengeluarkan apel bisa dipakai di mana pun dibutuhkan 'mesin pengeluar buah' (covariance: output). Keranjang yang menerima buah apa saja bisa dipakai di mana pun dibutuhkan 'keranjang apel' (contravariance: input). Kotak yang menerima sekaligus mengeluarkan harus cocok persis — kalau tidak, akan ada yang memasukkan pisang ke kotak apel.",
    pitfalls: [
      "Menganggap generics selalu covariant. `List<T>` itu invariant karena ia membaca sekaligus menulis `T`.",
      "Memakai reflection di hot path tanpa caching.",
      "Mempercayai loop `Stopwatch` sebagai benchmark."
    ],
    quiz: [
      ["Kenapa `List<Dog>` tidak bisa di-assign ke `List<Animal>`?", ["Karena List itu sealed", "Karena nanti orang bisa `Add(new Cat())` ke list berisi anjing", "Karena Dog adalah value type", "Sebenarnya bisa"], "`List<T>` menghasilkan sekaligus menerima `T`, jadi harus invariant supaya tetap type-safe."],
      ["Bagaimana EF Core menerjemahkan `p => p.Price > 10` menjadi SQL?", ["Menjalankan lambda itu di setiap baris", "Menerima expression tree lalu memeriksa strukturnya", "Mem-parsing source file-nya", "Memakai pencocokan string"], "Method `IQueryable` menerima `Expression<Func<…>>`, yaitu data yang mendeskripsikan kodenya."],
      ["Keunggulan utama source generator dibanding reflection?", ["Bekerja saat run time", "Pekerjaannya pindah ke compile time: startup lebih cepat dan ramah AOT", "Tidak butuh compiler", "Memungkinkan dynamic typing"], "Kode hasil generate adalah kode ter-compile biasa, tanpa biaya discovery saat run time."]
    ]
  }
}, { tagline: 'Bahasanya: dari variabel dan class sampai async, memory, dan performance.' });
