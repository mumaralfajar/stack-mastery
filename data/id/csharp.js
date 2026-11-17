// Bahasa Indonesia — track C#. Contoh kode tetap memakai versi aslinya.
I18N.lessons('csharp', {
  types: {
    title: 'Program, variabel, dan type',
    why: "Setiap program C# pada dasarnya adalah value ber-type yang mengalir lewat statement. Begitu kamu paham bahwa compiler mengecek type itu **sebelum** program jalan, sebagian besar error pemula tidak lagi terasa misterius: itu cuma compiler yang memberi tahu lebih awal bahwa ada dua hal yang tidak cocok.",
    points: [
      "Source code C# di-compile menjadi IL (intermediate language); .NET runtime (CLR) mengubah IL jadi machine code saat program berjalan (JIT). `dotnet run` mengerjakan kedua langkah itu.",
      "Variabel adalah kotak bernama dengan type yang tetap: `int`, `double`, `decimal` (uang), `bool`, `char`, `string`. Type-nya tidak pernah berubah setelah dideklarasikan.",
      "`var` bukan berarti 'type apa saja'. Compiler menyimpulkan type-nya dari sisi kanan, lalu menguncinya.",
      "C# itu statically typed: `int x = \"hello\";` sudah gagal saat build, bukan saat user menjalankan programnya.",
      "String interpolation `$\"Total: {price * qty}\"` adalah cara sehari-hari untuk menyusun teks.",
      "Angka diformat mengikuti regional setting komputermu. Di PC dengan setting Indonesia, `59.97` tercetak sebagai `59,97`. Pakai `CultureInfo.InvariantCulture` kalau teksnya harus sama di mana pun: file, API, log.",
      "Pembagian integer membuang pecahannya: `7 / 2` hasilnya `3`. Jadikan salah satu sisinya `double` atau `decimal` supaya pecahannya tetap ada."
    ],
    practice: "Buat console app dengan `dotnet new console`. Deklarasikan nama, tahun lahir, dan tarif per jam kamu, lalu cetak satu kalimat yang memuat umurmu dan penghasilanmu untuk 40 jam kerja seminggu. Setelah itu, isi variabel angkamu dengan teks, build, dan baca pesan compiler-nya pelan-pelan: di situ ada nomor baris, kedua type-nya, dan apa yang sebenarnya diharapkan.",
    teach: "Jelaskan ke orang yang belum pernah programming apa itu variabel dan type, dan kenapa C# menolak menjalankan `int x = \"hello\"`.",
    analogy: "Variabel itu seperti toples berlabel di dapur: toples bertuliskan 'tepung' hanya boleh diisi tepung. Compiler adalah koki galak yang memeriksa semua toples sebelum mulai memasak, jadi tidak ada yang baru sadar ada garam di toples gula saat masakan sudah setengah jadi.",
    pitfalls: [
      "Memperlakukan `var` seperti `let` di JavaScript. `var x = 1; x = \"a\";` tidak bisa di-compile: `x` selamanya `int`.",
      "Memakai `double` untuk uang. `0.1 + 0.2` tercetak `0.30000000000000004`; dengan `decimal` (`0.1m + 0.2m`) hasilnya `0.3`.",
      "Berharap `7 / 2` menghasilkan `3.5`. Yang menentukan operasinya adalah type operand, bukan variabel tempat hasilnya disimpan: `double d = 7 / 2;` tetap `3`.",
      "Membandingkan output-mu dengan tutorial lalu melihat `59,97`, bukan `59.97`. Itu regional format, bukan bug."
    ],
    quiz: [
      ["Apa arti `var total = 5;` di C#?", ["`total` adalah `dynamic`, jadi nanti bisa menyimpan type apa saja", "`total` adalah `int`, disimpulkan oleh compiler", "`total` adalah `object` sampai pertama kali dipakai", "`total` adalah `long`, karena `var` memilih type integer terbesar"], "`var` adalah type inference saat compile time. Variabelnya akan selamanya `int`."],
      ["Apa yang dicetak `double d = 9 / 2; Console.WriteLine(d);`?", ["4.5", "4", "5", "Tidak bisa di-compile"], "`9 / 2` adalah pembagian integer dan dihitung sebelum assignment. Hasilnya `4` lalu diubah jadi `4.0`, yang tercetak sebagai `4`."],
      ["Type mana yang cocok untuk menyimpan harga?", ["`float`", "`double`", "`decimal`", "`string`, supaya tidak ada pembulatan"], "`decimal` berbasis 10 dan bisa merepresentasikan nilai seperti 0.10 secara persis; binary floating point tidak bisa. `string` tidak bisa dijumlahkan atau dikalikan."]
    ]
  },
  flow: {
    title: 'Control flow dan method',
    why: "Keputusan, pengulangan, dan langkah bernama yang bisa dipakai ulang: itulah seluruh tata bahasa logika program. LINQ, async, dan web request nanti semuanya dirakit dari potongan-potongan ini.",
    points: [
      "`if / else if / else` memilih cabang berdasarkan ekspresi `bool`. `==` membandingkan, `=` meng-assign.",
      "`for` kalau jumlah pengulangannya sudah diketahui, `foreach` untuk menelusuri collection, `while` untuk mengulang sampai sebuah kondisi berubah.",
      "Method adalah blok bernama dengan parameter ber-type dan return value ber-type: `static int Add(int a, int b) => a + b;`.",
      "Secara default, argumen dikirim **by value**: method menerima salinan dari isi variabelnya. Untuk angka, yang disalin angkanya; untuk object, yang disalin reference ke object itu. Level berikutnya menjelaskan kenapa bedanya penting.",
      "Ekspresi `switch` mengubah sebuah value jadi hasil dalam satu ekspresi.",
      "Jaga method tetap kecil dan beri nama sesuai apa yang dikembalikan atau dikerjakannya. Nama yang bagus adalah dokumentasi pertama."
    ],
    practice: "Tulis FizzBuzz untuk 1 sampai 30 sebagai method `string FizzBuzz(int n)` plus sebuah loop yang memanggilnya. Lalu tulis ulang isi method-nya sebagai ekspresi `switch` terhadap tuple `(n % 3, n % 5)`.",
    teach: "Jelaskan perbedaan loop `for` dan `foreach`, dan kapan kamu memilih membuat method daripada menyalin kode.",
    analogy: "Method itu kartu resep: punya nama, daftar bahan (parameter), dan menghasilkan sebuah masakan (return value). Memanggil method sama dengan meminta seseorang memasak sesuai kartu itu. Kamu tidak menulis ulang resepnya setiap kali lapar.",
    pitfalls: [
      "Loop yang off-by-one: `i <= array.Length` membaca melewati ujung array. Array mulai dari 0 dan berakhir di `Length - 1`.",
      "Mengetik `if (x = 5)`. C# menolak meng-compile-nya kecuali `x` bertipe `bool`, dan itu menyelamatkanmu dari bug klasik di C: `=` meng-assign, `==` membandingkan.",
      "Berharap method bisa mengubah argumen `int` milikmu. Yang diubah hanya salinannya sendiri, kecuali parameternya `ref` atau `out`."
    ],
    quiz: [
      ["Loop mana yang paling pas untuk mengunjungi setiap item `List<string>` secara berurutan?", ["`for (int i = 0; i <= list.Count; i++)`", "`foreach`", "`while (list.Any())`", "`do … while`"], "`foreach` langsung mengekspresikan 'setiap elemen' dan tidak mungkin keluar batas. Loop `for` di pilihan itu membaca satu item melewati ujung."],
      ["Method `void Reset(int n) { n = 0; }` dipanggil dengan `Reset(count)`. Berapa nilai `count` setelahnya?", ["0", "Tidak berubah", "Tergantung apakah `count` dideklarasikan dengan `var`", "Compile error"], "`int` dikirim by value: method itu hanya me-nol-kan salinannya sendiri."],
      ["Apa arti `_` pada arm ekspresi `switch`?", ["Variabel yang bisa dibaca di dalam arm itu", "Hanya cocok dengan `null`", "Arm default yang cocok dengan apa pun yang tersisa", "Mengulang hasil arm sebelumnya"], "`_` adalah discard pattern. Ia cocok dengan value apa pun yang belum tertangkap arm sebelumnya."]
    ]
  },
  classes: {
    title: 'Class, object, dan property',
    why: "Inti C# adalah object-oriented. Controller ASP.NET Core, entity EF Core, dan DTO semuanya class, jadi lancar membaca class adalah syarat untuk bisa membaca codebase sungguhan.",
    points: [
      "**Class** adalah cetak biru; **object** adalah satu instance yang dibuat dengan `new`.",
      "State disimpan di property (`public string Name { get; set; }`), behavior ada di method.",
      "Constructor memastikan object dimulai dalam state yang valid. Data yang wajib ada ditaruh di constructor atau property `required`.",
      "**Encapsulation**: jadikan field `private` dan buka hanya yang dibutuhkan pemanggil. `private set` membuat class bisa menjaga aturannya sendiri.",
      "Member `static` adalah milik class-nya, bukan milik instance mana pun.",
      "`this` merujuk ke object yang sedang aktif. Biasanya tidak perlu ditulis."
    ],
    practice: "Tambahkan method `Withdraw` yang menolak penarikan melebihi saldo. Lalu tambahkan method `Transfer(BankAccount to, decimal amount)`. Aturan mana yang tinggal di method mana, dan kenapa `Balance` sebaiknya tetap private set?",
    teach: "Jelaskan perbedaan class dan object, dan kenapa `Balance` memakai private setter alih-alih bebas ditulis siapa saja.",
    analogy: "Class adalah gambar rancangan arsitek; object adalah rumah-rumah yang benar-benar dibangun dari rancangan itu. Encapsulation adalah pintu depan: tamu memencet bel (public method), bukan memanjat jendela lalu mengutak-atik sekring (private field).",
    pitfalls: [
      "Memanggil `BankAccount.Deposit(50)` langsung pada class-nya. `Deposit` butuh object: `acct.Deposit(50)`.",
      "Membuat semuanya `public` biar simpel. Akibatnya kode mana pun bisa menulis `acct.Balance = -500`, dan aturan di `Deposit` tidak melindungi apa-apa.",
      "Mengira property sama saja dengan field. Property adalah sepasang method, dan bisa memvalidasi atau menghitung."
    ],
    quiz: [
      ["Apa yang diizinkan oleh `public decimal Balance { get; private set; }`?", ["Siapa saja boleh membaca dan menulis", "Siapa saja boleh membaca; hanya kode di dalam class itu yang boleh menulis", "Hanya class turunan yang boleh menulis", "Hanya bisa ditulis sekali, di constructor"], "Getter-nya public dan setter-nya private, jadi class itu mengontrol setiap perubahan. Ditulis-sekali-di-constructor adalah arti dari `{ get; }` saja."],
      ["Apa tugas constructor?", ["Membebaskan memory object nanti", "Menempatkan object baru dalam state awal yang valid", "Dijalankan setiap kali sebuah property dibaca", "Menyalin object yang sudah ada"], "Constructor dijalankan sekali saat object dibuat dan menegakkan aturan object itu sejak awal."],
      ["Method `static`…", ["dimiliki tiap object secara terpisah", "dimiliki class-nya dan tidak butuh instance", "hanya bisa dipanggil sekali", "otomatis dijalankan saat startup"], "Member static dipanggil lewat type-nya langsung, misalnya `Math.Max(1, 2)`."]
    ]
  },
  memory: {
    title: 'Value type vs reference type',
    why: "'Kok mengubah satu variabel bikin variabel lain ikut berubah?' adalah salah satu bug membingungkan pertama yang akan kamu temui di C#. Jawabannya soal value semantics versus reference semantics, dan sekali paham, kamu tidak akan lupa.",
    points: [
      "**Value type** (`int`, `bool`, `decimal`, `DateTime`, semua `struct` dan `enum`): variabelnya menyimpan datanya langsung. Assignment menyalin datanya.",
      "**Reference type** (`class`, `string`, array, `List<T>`): variabelnya menyimpan reference ke object di heap. Assignment menyalin reference-nya — dua variabel, satu object.",
      "Variabel lokal tinggal di stack frame milik method; object yang dibuat dengan `new` dari sebuah class tinggal di managed heap dan dibersihkan oleh garbage collector.",
      "`string` adalah reference type yang **immutable**, jadi dalam praktik ia berperilaku seperti value: 'mengubah' string sebenarnya membuat string baru.",
      "`==` pada class membandingkan reference, kecuali type-nya meng-override operator itu, seperti `string` dan record. Value type bawaan membandingkan nilai. `struct` buatanmu sendiri belum punya `==` sampai kamu menulisnya, meski `Equals` membandingkan field-nya.",
      "`null` berarti reference tidak menunjuk ke apa pun. Value type tidak bisa null kecuali ditulis sebagai `int?`."
    ],
    practice: "Tebak dulu, baru jalankan: buat `struct Point { public int X; }` dan `class PointC { public int X; }`. Assign masing-masing ke variabel kedua, ubah `X` di variabel kedua, lalu cetak keduanya. Jelaskan kenapa hasilnya berbeda.",
    teach: "Jelaskan kenapa `p2.Name = \"Budi\"` ikut mengubah `p1.Name`, sedangkan `b = 9` tidak mengubah `a`.",
    analogy: "Value type itu selembar kertas: kalau difotokopi, coretan di fotokopiannya tidak mengubah aslinya. Reference type itu link ke dokumen online bersama: begitu link-nya kamu bagikan ke teman, editan mereka langsung muncul di layarmu juga.",
    pitfalls: [
      "'Value type tinggal di stack, reference type di heap' itu hanya kira-kira benar: field struct di dalam class ikut tinggal di heap bersama class itu. Pikirkan dulu disalin atau dibagi; lokasi byte-nya urusan kedua.",
      "Mengira mengirim object ke method berarti menyalin object-nya. Yang disalin adalah reference-nya.",
      "Berharap `Replace(p1)` mengubah variabel milik pemanggil. Tanpa `ref`, yang diarahkan ulang hanya reference lokal di dalam method."
    ],
    quiz: [
      ["Setelah `var x = new List<int>{1}; var y = x; y.Add(2);`, ada berapa item di `x`?", ["1, karena `y` adalah salinan", "2", "0", "Tidak bisa di-compile"], "`List<T>` adalah reference type; `x` dan `y` menunjuk ke list yang sama."],
      ["Mana yang termasuk value type?", ["`string`", "`int[]`", "`DateTime`", "`List<int>`"], "`DateTime` adalah struct. `string`, array, dan `List<T>` adalah reference type — termasuk `int[]`, array berisi value type."],
      ["Kenapa `string` terasa seperti value type?", ["Karena disimpan di stack", "Karena immutable dan `==` membandingkan karakternya", "Karena ia sebuah struct", "Karena compiler menyalinnya di setiap assignment"], "String adalah object di heap, tapi tidak pernah bisa berubah, dan `==` di-overload untuk membandingkan karakternya."]
    ]
  },
  interfaces: {
    title: 'Interface, inheritance, dan polymorphism',
    why: "ASP.NET Core bersandar pada interface di mana-mana: kamu meminta `ILogger<T>`, mendaftarkan service di `IServiceCollection`, membaca setting lewat `IConfiguration`. Dependency injection dan unit testing baru masuk akal setelah interface dipahami.",
    points: [
      "**Interface** adalah kontrak: daftar member yang dijanjikan akan disediakan oleh sebuah class. Interface tidak menyimpan data instance.",
      "**Polymorphism**: kode yang ditulis terhadap `INotifier` bisa bekerja dengan notifier apa pun, termasuk yang baru ditulis tahun depan.",
      "Inheritance (`class Dog : Animal`) berbagi implementasi. `virtual` menandai method yang boleh di-`override` oleh subclass; `abstract` menandai yang wajib.",
      "Sebuah class hanya bisa mewarisi satu base class, tapi bisa mengimplementasikan banyak interface.",
      "Utamakan **composition dan interface** daripada pohon inheritance yang dalam. Inheritance mengikatmu ke detail implementasi milik parent."
    ],
    practice: "Tambahkan `FakeNotifier` yang mencatat pesan ke `List<string>` alih-alih mengirimkannya. Pakai untuk memastikan `OrderService.Place` mengirim tepat satu pesan. Fake itu adalah test double, dasar dari unit testing. Lalu tambahkan `Bird` yang meng-override `Move`, dan coba tulis `new` alih-alih `override` untuk melihat apa yang berubah.",
    teach: "Jelaskan apa itu interface dan kenapa `OrderService` meminta `INotifier` alih-alih membuat `EmailNotifier` sendiri.",
    analogy: "Interface itu stopkontak di dinding. Lampu tidak peduli listriknya berasal dari batu bara, panel surya, atau genset; ia hanya butuh bentuk colokannya pas. Ganti pembangkitnya, lampunya tetap menyala.",
    pitfalls: [
      "Refleks membuat interface untuk setiap class. Interface baru layak ada kalau memang ada, atau akan ada, beberapa implementasi atau sebuah test double.",
      "Menulis `new` alih-alih `override` pada method. Kodenya tetap ter-compile (dengan warning), tapi kode yang memegang reference `Animal` tetap memanggil versi base-nya.",
      "Memakai inheritance hanya untuk reuse kode di antara hal yang tidak berhubungan. Hubungan 'is-a' harus benar di setiap tempat base type-nya dipakai."
    ],
    quiz: [
      ["Berapa banyak interface yang bisa diimplementasikan satu class C#?", ["Satu", "Maksimal dua", "Berapa pun", "Tidak bisa kalau sudah punya base class"], "Sebuah class punya paling banyak satu base class, tapi bisa mengimplementasikan interface sebanyak apa pun."],
      ["Method di base class harus ditandai apa supaya `override` bisa dipakai?", ["`static`", "`virtual` atau `abstract`", "`sealed`", "`public` saja sudah cukup"], "Hanya member yang virtual, abstract, atau sudah di-override yang bisa di-override. Sekadar public tidak cukup."],
      ["Keuntungan utama `OrderService(INotifier notifier)` dibanding `new EmailNotifier()` di dalam class adalah…", ["Pemanggilannya jadi lebih cepat", "Dependency-nya bisa diganti atau dipalsukan tanpa mengubah `OrderService`", "`OrderService` tidak lagi butuh constructor", "`OrderService` jadi tidak bisa diwarisi"], "Bergantung pada abstraksi melepaskan class dari implementasi konkret. Itulah dasar DI dan testing."]
    ]
  },
  generics: {
    title: 'Collection dan generics',
    why: "Sebagian besar isi program sungguhan adalah kumpulan data. Memilih antara `List`, `Dictionary`, dan `HashSet` biasanya jadi keputusan performance pertamamu, sering tanpa kamu sadari.",
    points: [
      "`List<T>`: berurutan, bisa diakses lewat index, membesar otomatis. Mencari item berdasarkan value itu O(n).",
      "`Dictionary<TKey, TValue>`: dari key ke value dalam O(1) rata-rata. Pakai `TryGetValue`, jangan menangkap exception.",
      "`HashSet<T>`: item unik dengan `Contains` yang cepat. `Queue<T>` dan `Stack<T>` untuk yang masuk-pertama-keluar-pertama dan masuk-terakhir-keluar-pertama.",
      "**Generics** membuat satu class bisa dipakai untuk type apa pun sambil tetap type-safe: `List<int>` tidak bisa diisi string, dan tidak perlu casting.",
      "Constraint mempersempit apa saja yang boleh jadi `T`: `where T : IComparable<T>`, `where T : class, new()`.",
      "Terima type paling umum yang kamu butuhkan (`IEnumerable<T>`, `IReadOnlyList<T>`) dan kembalikan type paling spesifik yang berguna."
    ],
    practice: "Hitung frekuensi kata dalam sebuah paragraf memakai `Dictionary<string, int>`, lalu cetak tiga teratas. Setelah itu tulis class generic `Result<T>` yang menyimpan value atau pesan error.",
    teach: "Jelaskan kenapa mencari item di `Dictionary` lebih cepat daripada di `List`, dan apa manfaat `<T>` pada `List<T>`.",
    analogy: "`List` itu antrean orang: untuk mencari Budi kamu harus bertanya ke tiap orang satu per satu. `Dictionary` itu penitipan barang: kamu serahkan nomor 42, petugasnya langsung berjalan ke rak nomor 42.",
    pitfalls: [
      "Memanggil `list.Contains()` di dalam loop atas list lain: O(n²) tanpa sengaja. Ubah salah satunya jadi `HashSet` dulu.",
      "Membaca `dict[key]` untuk key yang tidak ada lalu kena `KeyNotFoundException`.",
      "Menambah atau menghapus item di dalam `foreach` atas list yang sama. Hasilnya `InvalidOperationException`; loop atas salinannya (`list.ToList()`) atau kumpulkan perubahannya lalu terapkan setelah loop selesai."
    ],
    quiz: [
      ["Kamu perlu mengecek ribuan kali apakah sebuah ID sudah pernah muncul. Pilihan terbaik?", ["`List<int>` dengan `Contains`", "`int[]` yang dicari dengan loop", "`HashSet<int>`", "`Queue<int>`"], "`HashSet.Contains` rata-rata O(1); menelusuri list atau array itu O(n)."],
      ["Apa yang disyaratkan `where T : new()`?", ["T adalah value type", "T punya public constructor tanpa parameter", "T sudah dibuat dengan `new` sebelum dikirim", "T mengimplementasikan `ICloneable`"], "Constraint `new()` membuat kode generic bisa menulis `new T()`."],
      ["Cara terbaik membaca key dictionary yang mungkin tidak ada?", ["`dict[key]` di dalam try/catch", "`dict.TryGetValue(key, out var v)`", "`dict.ContainsKey(key)`, lalu `dict[key]`", "`dict.Keys.First(k => k == key)`"], "`TryGetValue` hanya melakukan satu lookup. `ContainsKey` lalu indexer memang jalan, tapi mencari key-nya dua kali; try/catch lambat dan menyembunyikan maksudmu."]
    ]
  },
  errors: {
    title: 'Exception dan cleanup',
    why: "Hal-hal bisa gagal: file hilang, jaringan putus, user mengetik asal. Cara kamu melempar, menangkap, dan membereskan sesudahnya menentukan apakah kegagalan itu jadi pesan yang jelas dan baris log yang berguna, atau crash yang meninggalkan file setengah tertulis.",
    points: [
      "Exception menghentikan method yang sedang jalan lalu naik ke atas call stack sampai bertemu `catch` yang cocok. Kalau tidak ada yang menangkap, program berhenti dan mencetak stack trace.",
      "Tangkap exception hanya di tempat kamu bisa melakukan sesuatu yang berguna: retry, menampilkan pesan, memakai fallback. Selain itu, biarkan naik. ASP.NET Core mengubah exception yang tidak tertangani menjadi response 500 dan sebuah log entry.",
      "Tangkap type yang spesifik (`FileNotFoundException`, `FormatException`) sebelum yang umum. `catch { }` yang kosong menyembunyikan bug.",
      "Di dalam `catch`, `throw;` melempar ulang dan mempertahankan stack trace aslinya. `throw ex;` me-reset-nya, dan kamu kehilangan baris tempat masalahnya bermula.",
      "`finally` selalu jalan: saat sukses, saat ada exception, bahkan setelah `return`. `using` adalah bentuk singkat dari `finally` yang paling umum, yaitu memanggil `Dispose()` pada file, koneksi, dan HTTP response.",
      "Exception itu untuk kegagalan yang tidak kamu duga. Untuk hasil yang memang bisa diduga, seperti input user yang tidak valid, pakai method gaya `TryParse` atau kembalikan sebuah result."
    ],
    practice: "Tulis method yang membaca angka dari file teks, satu per baris, lalu mengembalikan jumlahnya. Tentukan apa yang harus terjadi untuk file yang tidak ada, baris kosong, dan baris seperti `12a`: mana yang exception, dan mana yang input biasa? Lalu buat pembacaannya gagal dengan sengaja dan pakai breakpoint untuk memastikan `Dispose()` tetap jalan.",
    teach: "Jelaskan kapan kamu menangkap exception dan kapan kamu membiarkannya naik, pakai `ReadFirstLine` dan `ParseAge` sebagai contoh.",
    analogy: "Exception itu alarm kebakaran: ia menyela apa pun yang sedang terjadi, dan bunyinya terus naik ke lantai atas sampai ada orang yang tahu harus berbuat apa. `catch` adalah orang itu. `catch` yang kosong sama dengan mencabut baterai alarmnya.",
    pitfalls: [
      "`catch (Exception) { }` tanpa isi. Program jalan terus dalam keadaan rusak dan log-nya tidak menunjukkan apa-apa.",
      "`throw ex;` alih-alih `throw;`. Stack trace-nya sekarang dimulai di `catch` milikmu, jadi baris yang sebenarnya gagal hilang.",
      "Menangkap exception di setiap method 'biar aman'. Tangkap di tempat kamu bisa bertindak; kebanyakan method sebaiknya membiarkan exception lewat.",
      "Memakai exception untuk hasil yang normal seperti 'user tidak ditemukan' atau field form yang salah. Lambat, dan alurnya jadi susah diikuti."
    ],
    quiz: [
      ["Di dalam `catch`, apa bedanya `throw;` dengan `throw ex;`?", ["Sama saja", "`throw;` melempar ulang dan mempertahankan stack trace aslinya", "`throw;` menelan exception-nya", "`throw;` melempar `Exception` baru tanpa pesan"], "`throw ex;` me-reset stack trace ke baris saat ini; `throw;` mempertahankan tempat masalahnya benar-benar bermula."],
      ["Kapan blok `finally` dijalankan?", ["Hanya kalau ada exception", "Hanya kalau tidak ada exception", "Selalu: saat sukses, saat ada exception, dan setelah `return`", "Hanya kalau tidak ada blok `catch`"], "Jaminan itulah yang membuat `finally`, dan `using`, aman untuk cleanup."],
      ["User mengetik `12a` di field umur. Cara yang lebih baik untuk menanganinya?", ["`int.Parse` di dalam try/catch", "`int.TryParse`, lalu tampilkan pesan validasi kalau hasilnya `false`", "Biarkan exception-nya sampai ke global error handler", "`Convert.ToInt32` di dalam catch kosong"], "Input yang salah itu bisa diduga, bukan kejadian luar biasa. `TryParse` melaporkannya tanpa biaya dan keributan sebuah exception."],
      ["Apa yang dijamin oleh `using var conn = new SqlConnection(cs);`?", ["Koneksinya tetap terbuka sampai program selesai", "`Dispose()` dipanggil saat scope berakhir, bahkan kalau ada exception", "Koneksinya terbuka otomatis", "Koneksinya dipakai bersama oleh semua thread"], "`using` di-compile menjadi try/finally dengan `Dispose()` di blok `finally`."]
    ]
  },
  linq: {
    title: 'LINQ: query untuk apa saja',
    why: "LINQ adalah cara kode C# memfilter, mengubah, dan merangkum data: di memory, dan lewat EF Core, di SQL. Inilah jembatan antara track ini dan track SQL.",
    points: [
      "Method LINQ adalah extension method pada `IEnumerable<T>`: `Where` memfilter, `Select` mengubah, `OrderBy` mengurutkan, `GroupBy` mengelompokkan.",
      "Lambda seperti `x => x.Price > 10` adalah function kecil inline yang dikirim sebagai argumen.",
      "**Deferred execution**: menyusun query belum mengerjakan apa-apa. Query baru jalan saat di-enumerate (`foreach`, `ToList()`, `Count()`, `First()`).",
      "Setiap enumerasi menjalankan ulang query-nya. Panggil `ToList()` sekali kalau hasilnya mau dipakai berkali-kali.",
      "`First()` melempar exception kalau sequence-nya kosong, `FirstOrDefault()` mengembalikan `null` atau nilai default, `Single()` menuntut tepat satu.",
      "Pada `IQueryable<T>` (EF Core), method yang sama diterjemahkan jadi SQL, bukan dijalankan di memory."
    ],
    practice: "Dari list order (customer, amount, date), pakai LINQ untuk mencari total belanja tiap customer, diurutkan dari yang terbesar, ambil tiga teratas saja. Lalu taruh `Console.WriteLine` di dalam lambda `Where` dan amati kapan persisnya ia tercetak.",
    teach: "Jelaskan deferred execution: kenapa query LINQ dengan `Where` dan `Select` tidak mengerjakan apa pun sampai ada `foreach` atau `ToList()`?",
    analogy: "Query LINQ itu lembar instruksi yang ditempel di atas jalur perakitan: 'ambil yang merah, cat, kemas tiga yang pertama'. Menulis instruksinya tidak menggerakkan satu kotak pun. Jalurnya baru bergerak saat ada orang berdiri di ujung dan meminta hasilnya.",
    pitfalls: [
      "Meng-enumerate query yang sama dua kali sehingga langkah yang mahal, atau panggilan ke database, jalan dua kali.",
      "Menulis `Count() > 0` untuk bertanya 'ada atau tidak?'. Pada sequence biasa `Count()` menelusuri semuanya, sedangkan `Any()` berhenti di item pertama. Pada `List` bedanya kecil, tapi `Any()` lebih jelas maksudnya, dan di EF Core ia jadi query `EXISTS` yang lebih murah.",
      "Memanggil `ToList()` di tengah query EF Core dan diam-diam menarik seluruh isi tabel ke memory."
    ],
    quiz: [
      ["Kapan `var q = items.Where(x => x > 5);` memfilter item-nya?", ["Saat itu juga, ketika baris itu dijalankan", "Saat `q` di-enumerate", "Saat method-nya selesai", "Saat `q` pertama kali di-assign ke variabel lain"], "Operator LINQ itu lazy; pekerjaannya baru terjadi saat enumerasi."],
      ["Pemanggilan mana yang melempar exception kalau sequence-nya kosong?", ["`FirstOrDefault()`", "`Any()`", "`First()`", "`Where()`"], "`First()` menuntut minimal satu elemen."],
      ["Cara terbaik untuk bertanya 'apakah ada minimal satu yang cocok?'", ["`Count() > 0`", "`Any()`", "`ToList().Count > 0`", "`FirstOrDefault() != null`"], "`Any()` berhenti di kecocokan pertama. `FirstOrDefault() != null` salah untuk value type, karena default-nya `0`, bukan `null`."]
    ]
  },
  delegates: {
    title: 'Delegate, lambda, dan event',
    why: "Mengoper function sebagai value adalah bahan dasar LINQ, middleware, dan handler minimal API. Begitu kamu bisa membaca `Func<T, bool>`, banyak kode framework jadi bisa dibaca.",
    points: [
      "**Delegate** adalah type yang menyimpan method: 'sesuatu yang menerima `int` dan mengembalikan `bool`'.",
      "`Func<T, TResult>` mengembalikan value, `Action<T>` tidak mengembalikan apa-apa, `Predicate<T>` mengembalikan `bool`. Kamu jarang butuh delegate type buatan sendiri.",
      "**Lambda** `x => x * 2` adalah method inline. Kalau ia memakai variabel dari luar, ia menjadi **closure** dan meng-capture variabelnya, bukan snapshot nilainya.",
      "**Extension method** (`this` sebelum parameter pertama) menambahkan method ke type yang sudah ada, dan `yield return` menyerahkan item satu per satu. Gabungan keduanya adalah cara LINQ sendiri ditulis.",
      "**Event** adalah delegate dengan akses terbatas: pihak luar hanya boleh subscribe (`+=`) dan unsubscribe (`-=`). Lupa unsubscribe membuat subscriber tetap hidup selama publisher-nya hidup.",
      "`app.MapGet(\"/\", () => \"hi\")` sebenarnya hanya mengirim sebuah delegate ke framework."
    ],
    practice: "Tambahkan extension method `Transform` di sebelah `KeepIf` (versi `Select` buatanmu, memakai `Func<T, TResult>` dan `yield return`), lalu rangkai keduanya. Taruh `Console.WriteLine` di masing-masing dan lihat item mengalir satu per satu. Kamu baru saja membangun ulang inti LINQ.",
    teach: "Jelaskan apa maksudnya lambda 'meng-capture' sebuah variabel, pakai contoh `count`.",
    analogy: "Delegate itu nomor telepon di selembar kartu. Kartunya bisa kamu berikan ke orang lain, dan mereka bisa meneleponnya nanti tanpa tahu siapa yang mengangkat. Event itu mailing list: siapa pun boleh daftar atau keluar, tapi hanya pemiliknya yang mengirim newsletter.",
    pitfalls: [
      "Mengira closure menyalin value-nya. Closure berbagi variabel yang sama, jadi perubahan setelahnya ikut terlihat oleh lambda.",
      "Publisher berumur panjang yang menahan subscriber berumur pendek lewat event yang tidak pernah mereka tinggalkan. Subscriber itu tidak bisa dibersihkan garbage collector.",
      "Mendeklarasikan delegate type sendiri padahal `Func` atau `Action` sudah cukup."
    ],
    quiz: [
      ["Type mana yang menggambarkan method yang menerima `string` dan mengembalikan `int`?", ["`Action<string, int>`", "`Func<string, int>`", "`Func<int, string>`", "`Predicate<string>`"], "Pada `Func`, type argument terakhir adalah return type-nya."],
      ["`int n = 1; Func<int> f = () => n; n = 5;` Apa yang dikembalikan `f()`?", ["1", "5", "0", "Melempar exception"], "Closure meng-capture variabel `n`, bukan nilainya saat lambda dibuat."],
      ["Apa yang bisa dilakukan kode di luar class terhadap `event` public milik class itu?", ["Meng-invoke-nya", "Mengganti semua subscriber dengan `=`", "Hanya subscribe dan unsubscribe", "Membaca daftar subscriber-nya"], "Event membatasi pihak luar hanya pada `+=` dan `-=`. Hanya class pemiliknya yang bisa memicu event itu."]
    ]
  },
  async: {
    title: 'async, await, dan Task',
    why: "Sebagian besar kerja web server adalah menunggu: menunggu database, API lain, atau disk. Kode async membuat thread bisa mengerjakan hal lain selama menunggu. Kalau salah, biasanya tidak kelihatan saat development; masalahnya muncul saat beban tinggi, berupa request yang mengantre lalu timeout.",
    points: [
      "`Task` merepresentasikan pekerjaan yang akan selesai nanti; `Task<T>` juga membawa hasilnya.",
      "`await` **tidak** mem-block. Ia mendaftarkan 'lanjutkan dari sini kalau task-nya selesai' lalu menyerahkan thread untuk mengerjakan hal lain.",
      "Async itu soal **tidak menyia-nyiakan thread selama menunggu** I/O (database, HTTP, disk). Ia tidak membuat satu operasi jadi lebih cepat.",
      "Async dari ujung ke ujung: jangan memanggil `.Result` atau `.Wait()` pada task. Di ASP.NET Core itu menahan satu thread dari thread pool selama menunggu, dan saat beban tinggi pool-nya habis (thread-pool starvation). Di aplikasi desktop (WinForms, WPF) itu juga bisa deadlock.",
      "Mulai dulu operasi-operasi yang independen, lalu `await Task.WhenAll(...)` supaya semuanya berjalan secara concurrent.",
      "`async void` hanya untuk event handler: pemanggil tidak bisa meng-await-nya atau menangkap exception-nya.",
      "Teruskan `CancellationToken` ke setiap pemanggilan async, supaya pekerjaan berhenti saat user menyerah atau request-nya dibatalkan.",
      "`IAsyncEnumerable<T>` adalah aliran hasil yang datang seiring waktu: buat dengan `async` dan `yield return`, konsumsi dengan `await foreach`. `AsAsyncEnumerable()` di EF Core dan endpoint ASP.NET Core yang mengembalikannya men-stream baris, alih-alih mengumpulkan semuanya di memory dulu."
    ],
    practice: "Ubah kodenya supaya memuat lima hal secara concurrent dengan `Task.WhenAll` dan cetak total waktunya. Lalu batalkan setelah 500 ms dan pastikan semua yang belum selesai ikut berhenti. Terakhir, ganti `Task.Delay` dengan panggilan `HttpClient.GetStringAsync` sungguhan ke URL publik, dan cek apakah perilaku waktunya tetap sama.",
    teach: "Jelaskan apa yang terjadi pada thread saat kode sampai di `await`, dan kenapa itu membuat web server bisa menangani lebih banyak request.",
    analogy: "Pelayan mengantar pesananmu ke dapur dan tidak berdiri menunggu di depan kompor sampai makanannya matang: ia melayani meja lain dan kembali saat bel berbunyi. `await` adalah belnya. Mem-block dengan `.Result` adalah pelayan yang berdiri memelototi kompor sementara restoran makin penuh.",
    pitfalls: [
      "'Async membuat kode jalan paralel di thread lain.' Bukan: untuk I/O, selama menunggu tidak ada thread sama sekali.",
      "Membungkus pekerjaan CPU yang synchronous dengan `Task.Run` di ASP.NET Core lalu menyebutnya async. Itu cuma memindahkan pekerjaannya ke thread lain di pool.",
      "Lupa menulis `await`. Method langsung lanjut sebelum pekerjaannya selesai, dan kalau task-nya gagal, tidak ada yang melihat exception-nya. Compiler memberi warning (CS4014); jangan diabaikan.",
      "Memanggil `ToListAsync()` pada hasil yang sangat besar hanya untuk di-loop sekali. Stream dengan `AsAsyncEnumerable()` dan `await foreach`, maka pemakaian memory tetap datar berapa pun jumlah barisnya."
    ],
    quiz: [
      ["Apa yang terjadi pada thread saat ini di `await http.GetAsync(url)` selama panggilan network masih berlangsung?", ["Tidur sampai response datang", "Dilepas untuk mengerjakan hal lain", "Terus mengecek network dalam loop", "Menyerahkan request ke thread baru yang ia buat"], "`await` menyerahkan thread; sebuah continuation melanjutkan method-nya saat response tiba."],
      ["Ada tiga panggilan I/O independen, masing-masing 1 detik. Pendekatan benar yang paling cepat?", ["Await satu per satu", "Mulai ketiganya, lalu `await Task.WhenAll`", "Bungkus masing-masing dengan `Task.Run` lalu baca `.Result`", "`Parallel.For` dengan `.Wait()` di tiap panggilan"], "Memulai semua task sebelum meng-await membuat waktu tunggunya tumpang-tindih: total sekitar 1 detik, bukan 3, tanpa mem-block thread mana pun."],
      ["Kenapa `.Result` perlu dihindari di ASP.NET Core?", ["Nilainya berbeda dengan hasil `await`", "Menahan satu thread dari thread pool selama menunggu, dan saat beban tinggi pool-nya habis", "Selalu menyebabkan deadlock", "Tidak boleh dipakai di dalam controller"], "ASP.NET Core tidak punya synchronization context, jadi deadlock klasiknya tidak terjadi di sana. Tapi setiap thread yang ter-block adalah thread yang tidak bisa melayani request lain."],
      ["Sebuah method mengembalikan `IAsyncEnumerable<Order>`. Bagaimana cara mengonsumsinya?", ["`foreach (var o in GetOrders())`", "`await foreach (var o in GetOrders())`", "`GetOrders().Result`", "`await Task.WhenAll(GetOrders())`"], "`await foreach` menunggu tiap item berikutnya, jadi loop bisa mulai sebelum item terakhir ada. `foreach` biasa tidak bisa di-compile untuk async stream."]
    ]
  },
  modern: {
    title: 'Null safety, record, dan pattern',
    why: "C# modern membuat compiler bisa menangkap beberapa kategori bug sekaligus sebelum kamu menjalankan apa pun: null reference, bentuk data yang tidak ditangani, dan perubahan yang tidak disengaja. Kode yang memakai fitur-fitur ini dengan baik jadi lebih pendek dan lebih susah rusak.",
    points: [
      "**Nullable reference type** aktif secara default di project baru: `string` berarti tidak pernah null, `string?` berarti mungkin null, dan compiler memberi warning kalau kamu memakai value yang mungkin null tanpa mengeceknya.",
      "`?.` (null-conditional), `??` (fallback), dan `??=` (assign kalau null) membuat penanganan null jadi ringkas dan eksplisit.",
      "`!` (null-forgiving operator) berkata ke compiler 'percaya saja'. Pakai hanya kalau kamu benar-benar tahu lebih banyak daripada compiler; setiap tanda seru itu adalah tempat `NullReferenceException` masih bisa terjadi.",
      "**Record** memberi value-based equality, immutability, dan salinan dengan `with`, cocok untuk DTO dan message.",
      "**Pattern matching** (`is`, dan `switch` dengan type pattern, property pattern, dan relational pattern) menggantikan rentetan cast dan `if`. Hierarki record kecil ditambah ekspresi `switch` adalah cara yang rapi untuk memodelkan 'salah satu dari bentuk-bentuk ini'."
    ],
    practice: "Modelkan hierarki `Shape` dengan record (`Circle`, `Rect`, `Triangle`) dan tulis satu method `Area` memakai ekspresi `switch`. Lalu build project-mu dan bereskan semua warning nullable tanpa memakai operator `!`.",
    teach: "Jelaskan perbedaan `string` dan `string?`, dan bagaimana itu mengubah apa yang dicek compiler untukmu.",
    analogy: "Anotasi nullable itu label di kotak: 'selalu ada isinya' atau 'mungkin kosong, lihat dulu sebelum merogoh'. Compiler membaca label itu dan mencegahmu merogoh kotak yang belum kamu cek.",
    pitfalls: [
      "Membungkam warning nullable dengan `!` alih-alih memperbaiki penyebabnya.",
      "Mengira `record` cuma 'class versi pendek'. Intinya justru value equality dan immutability.",
      "Memberi record property `{ get; set; }` lalu mengubahnya saat record itu sedang jadi key dictionary atau ada di `HashSet`. Hash-nya berubah dan lookup tidak lagi menemukannya."
    ],
    quiz: [
      ["Berapa hasil `a?.B ?? c` kalau `a` null?", ["Melempar `NullReferenceException`", "`null`", "`c`", "`default(B)`"], "`a?.B` menghasilkan null, lalu `??` memberikan fallback `c`."],
      ["Dua record dengan nilai property yang identik, kalau dibandingkan dengan `==`, hasilnya…", ["tidak pernah sama kecuali instance-nya sama", "sama", "sama hanya kalau salah satunya dibuat dengan `with`", "compile error"], "Record mengimplementasikan value-based equality."],
      ["Apa yang disampaikan `string? name` ke compiler?", ["`name` opsional dan boleh tidak diisi saat pemanggilan", "`name` mungkin null, jadi beri warning sebelum aku memakainya tanpa dicek", "`name` adalah nullable value type", "`name` akan otomatis dicek null saat run time"], "Anotasi nullable hanya berlaku saat compile time. Yang berubah adalah warning yang kamu dapat, bukan apa yang terjadi saat run time."]
    ]
  },
  gc: {
    title: 'Memory, GC, dan performance',
    why: "Dalam skala besar, allocation rate berubah jadi latency. Materi ini tentang membaca apa yang sedang dikerjakan garbage collector, menemukan alokasi yang penting di hot path, dan membuangnya tanpa membuat kode sulit dibaca.",
    points: [
      "GC itu **generational**: object baru mulai di Gen 0; yang selamat dipromosikan ke Gen 1, lalu Gen 2. Kebanyakan object mati muda, jadi collection di Gen 0 itu murah.",
      "Object berukuran sekitar 85 KB ke atas masuk **Large Object Heap**, di-collect bersama Gen 2 dan secara default tidak di-compact, jadi buffer besar yang sementara itu mahal.",
      "Collection Gen 2 penuh bisa membuat aplikasi berhenti sejenak. Kurangi sampah di hot path: pakai ulang buffer (`ArrayPool<T>`), hindari LINQ dan string concatenation yang tidak perlu di dalam loop yang ketat.",
      "`Span<T>` dan `ReadOnlySpan<T>` adalah view ke memory yang sudah ada: memotong array dan string dengan **zero allocation**. Keduanya `ref struct`, jadi tidak bisa tinggal di heap atau dipegang melewati `await`.",
      "`Memory<T>` adalah saudara `Span<T>` yang ramah heap, untuk kode async.",
      "Urutan kerja saat ada yang lambat: algoritma dan I/O dulu (memperbaiki query N+1 mengalahkan micro-optimisation apa pun), alokasi kedua, micro-optimisation paling akhir.",
      "Ukur, jangan menebak: `dotnet-counters` dan `dotnet-trace` untuk aplikasi yang sedang jalan, BenchmarkDotNet dengan `[MemoryDiagnoser]` untuk satu method. Loop `Stopwatch` menyesatkan, karena JIT meng-compile ulang kode yang sering jalan selagi program berjalan (tiered compilation)."
    ],
    practice: "Benchmark `SumSlow` dan `SumFast` dengan BenchmarkDotNet dan `[MemoryDiagnoser]`. Laporkan jumlah byte yang dialokasikan per pemanggilan untuk masing-masing, lalu jelaskan dari mana asal setiap alokasi di versi yang lambat.",
    teach: "Jelaskan kenapa sebagian besar garbage collection di .NET itu cepat, dan kode seperti apa yang membuatnya lambat.",
    analogy: "Gen 0 itu meja kerjamu: kertas coretan kamu bersihkan berkali-kali sehari dalam hitungan detik. Gen 2 itu gudang: membersihkannya berarti menghentikan semua kegiatan selama satu sore. Kode yang bagus membiarkan kertas berumur pendek tetap di meja dan tidak menyeretnya ke gudang.",
    pitfalls: [
      "Memanggil `GC.Collect()` untuk 'membantu'. Itu mempromosikan object yang masih hidup ke generasi tua terlalu dini dan biasanya malah merugikan.",
      "Mengubah semuanya jadi struct demi menghindari alokasi, lalu membayar lebih mahal untuk penyalinan.",
      "Mengoptimasi kode yang bukan hot path. Profile dulu.",
      "Mempercayai loop `Stopwatch` sebagai benchmark."
    ],
    quiz: [
      ["Kenapa collection Gen 0 biasanya murah?", ["Karena jalan di background thread, jadi gratis", "Sebagian besar object baru sudah mati, jadi sedikit yang perlu ditelusuri atau disalin", "Karena hanya memeriksa object di atas 85 KB", "Karena melewati object yang direferensikan dari stack"], "Object muda cenderung mati muda, jadi Gen 0 hanya punya sedikit survivor yang perlu diurus."],
      ["Kenapa `Span<T>` tidak bisa jadi field sebuah class?", ["Terlalu besar untuk class", "Ia `ref struct` yang bisa menunjuk ke memory di stack, jadi tidak boleh lolos ke heap", "Span selalu read-only", "Class tidak bisa menyimpan struct"], "Span bisa menunjuk ke stack frame yang hilang saat method selesai, jadi compiler mencegahnya sampai ke heap."],
      ["Langkah pertama sebelum mengoptimasi pemakaian memory?", ["Tulis ulang type yang sering dipakai jadi struct", "Panggil `GC.Collect()` setelah operasi besar", "Ukur dengan profiler atau benchmark", "Ganti semua LINQ dengan loop"], "Tanpa mengukur, kamu tidak tahu di mana alokasinya terjadi dan apakah itu berpengaruh."]
    ]
  },
  concurrency: {
    title: 'Concurrency dan thread safety',
    why: "Web server menjalankan banyak request sekaligus. Shared state apa pun — static field, singleton service, cache in-memory — disentuh beberapa thread bersamaan, dan bug yang muncul jarang terjadi, susah direproduksi, dan mahal akibatnya.",
    points: [
      "**Race condition** terjadi ketika hasilnya bergantung pada timing antar-thread. `count++` itu baca, tambah, tulis, dan **tidak atomic**.",
      "Lindungi shared mutable state: `lock` untuk critical section yang pendek, `Interlocked` untuk satu counter, `SemaphoreSlim` untuk kode async (`lock` tidak boleh berisi `await`).",
      "Lebih baik lagi, jangan berbagi: data immutable, object per-request (scoped), atau message passing dengan `Channel<T>`.",
      "`ConcurrentDictionary` aman per operasi, tapi urutan check-then-act tetap bisa race. Pakai `GetOrAdd` dan `AddOrUpdate`.",
      "**Deadlock**: dua thread masing-masing memegang lock yang dibutuhkan thread lainnya. Ambil lock dengan urutan yang konsisten dan pegang sebentar saja.",
      "`Parallel.ForEachAsync` dan `Task.WhenAll` untuk throughput; channel untuk pipeline producer/consumer dengan back-pressure."
    ],
    practice: "Bangun rate limiter in-memory kecil (maksimal N panggilan per detik per key) yang tetap benar di bawah `Parallel.For`. Jalankan versi naif berbasis `Dictionary` dan versimu dengan banyak thread, beberapa kali, lalu bandingkan hitungannya. Versi naif gagal di sebagian run, tidak semuanya, dan justru itulah alasan kamu harus menalar thread safety, bukan percaya pada satu test yang hijau.",
    teach: "Jelaskan langkah demi langkah kenapa `count++` pada shared variable menghasilkan total yang salah kalau thread-nya banyak.",
    analogy: "Dua kasir berbagi satu kertas rekap. Dua-duanya membaca '41', dua-duanya menambah satu di kepala, dua-duanya menulis '42', dan satu penjualan hilang. Lock adalah aturan bahwa hanya orang yang memegang pulpen yang boleh membaca dan menulis rekap itu.",
    pitfalls: [
      "'Di laptop saya jalan kok.' Race bergantung pada timing dan jumlah core, jadi satu run yang lolos hampir tidak membuktikan apa-apa.",
      "Menganggap singleton service dengan field `List` itu aman di ASP.NET Core. Semua request berbagi list yang sama.",
      "Mencoba `await` di dalam `lock` (tidak akan ter-compile), atau me-lock `this` maupun sebuah string, yang bisa ikut di-lock oleh kode lain."
    ],
    quiz: [
      ["Kenapa `count++` tidak aman antar-thread?", ["`++` lambat pada shared memory", "Karena terdiri dari tiga langkah (baca, tambah, tulis) yang bisa saling menyela", "Karena `int` adalah reference type", "Karena JIT memindahkannya ke akhir method"], "Dua thread bisa membaca nilai lama yang sama lalu sama-sama menulis nilai lama + 1, sehingga satu update hilang."],
      ["Primitive mana yang memberi mutual exclusion yang bisa melewati `await`?", ["`lock`", "`SemaphoreSlim`", "`volatile`", "`Interlocked.Increment`"], "`SemaphoreSlim.WaitAsync` bisa di-await; blok `lock` tidak boleh berisi `await`."],
      ["Strategi terbaik untuk thread safety secara keseluruhan?", ["Bungkus setiap method dengan `lock`", "Sebisa mungkin hindari shared mutable state", "Pakai `ConcurrentDictionary` untuk semuanya", "Tandai shared field sebagai `volatile`"], "State yang tidak dibagi, atau tidak bisa berubah, tidak mungkin mengalami race."]
    ]
  },
  internals: {
    title: 'Cara kerja framework: variance, reflection, dan kode hasil generate',
    why: "Inilah lapisan tempat framework ditulis. Di sini terjawab bagaimana DI container menemukan constructor, bagaimana JSON serializer menemukan property, dan bagaimana EF Core mengubah lambda jadi SQL.",
    points: [
      "**Covariance** (`out T`): `IEnumerable<Dog>` bisa dipakai sebagai `IEnumerable<Animal>` karena value-nya hanya keluar. **Contravariance** (`in T`): `Action<Animal>` bisa dipakai sebagai `Action<Dog>` karena value-nya hanya masuk.",
      "**Reflection** memeriksa type saat run time. Begitulah DI container menemukan constructor dan serializer menemukan property. Fleksibel, tapi lambat, dan melewati pengecekan compiler.",
      "**Source generator** menulis kode itu saat compile time: context `System.Text.Json`, `[GeneratedRegex]`, `LoggerMessage`. Sama praktisnya, tanpa pencarian saat run time.",
      "Trimming dan Native AOT membuang kode yang kelihatannya tidak direferensikan siapa pun, jadi library yang banyak memakai reflection bisa rusak di sana. Kode hasil generate tetap jalan.",
      "**Expression tree** merepresentasikan kode sebagai data. Begitulah EF Core mengubah `x => x.Age > 18` menjadi `WHERE Age > 18`."
    ],
    practice: "Tulis DI container minimal (`Register<TInterface, TImpl>()`, `Resolve<T>()`) yang memakai reflection untuk menemukan constructor dan me-resolve parameternya secara rekursif. Lalu jelaskan apa yang akan dilakukan container berbasis source generator secara berbeda.",
    teach: "Jelaskan kenapa `IEnumerable<Dog>` bisa diperlakukan sebagai `IEnumerable<Animal>`, tapi `List<Dog>` tidak bisa diperlakukan sebagai `List<Animal>`.",
    analogy: "Vending machine yang hanya mengeluarkan apel bisa dipakai di mana pun dibutuhkan 'mesin pengeluar buah' (covariance: output). Keranjang yang menerima buah apa saja bisa dipakai di mana pun dibutuhkan 'keranjang apel' (contravariance: input). Kotak yang menerima sekaligus mengeluarkan harus cocok persis, kalau tidak, akan ada yang memasukkan pisang ke kotak apel.",
    pitfalls: [
      "Menganggap generics selalu covariant. `List<T>` itu invariant karena ia membaca sekaligus menulis `T`.",
      "Memakai reflection di hot path tanpa meng-cache hasilnya.",
      "Memakai reflection padahal generic atau interface sudah cukup. Property yang di-rename jadi rusak saat run time, bukan saat build."
    ],
    quiz: [
      ["Kenapa `List<Dog>` tidak bisa di-assign ke `List<Animal>`?", ["`List<T>` itu sealed", "Karena nanti orang bisa `Add(new Cat())` ke list berisi anjing", "`Dog` harus berupa struct", "Sebenarnya bisa, dengan implicit cast"], "`List<T>` menghasilkan sekaligus menerima `T`, jadi harus invariant supaya tetap type-safe."],
      ["Bagaimana EF Core menerjemahkan `p => p.Price > 10` menjadi SQL?", ["Menjalankan lambda itu di setiap baris di memory", "Menerima expression tree lalu menerjemahkan strukturnya", "Men-decompile IL milik lambda itu", "Mencocokkan teks source lambda-nya"], "Method `IQueryable` menerima `Expression<Func<…>>`, yaitu data yang mendeskripsikan kodenya."],
      ["Keunggulan utama source generator dibanding reflection?", ["Kode bisa berubah saat run time", "Pekerjaannya pindah ke compile time: startup lebih cepat, dan jalan di Native AOT", "Tidak butuh compiler lagi", "Membuat kode jadi dynamically typed"], "Kode hasil generate adalah kode ter-compile biasa, tanpa biaya pencarian saat run time."]
    ]
  }
}, { tagline: 'Bahasanya: dari variabel dan class sampai async, memory, dan performance.' });
