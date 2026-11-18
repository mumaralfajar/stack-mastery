// Bahasa Indonesia — track C#. Contoh kode tetap memakai versi aslinya.
I18N.lessons('csharp', {
  types: {
    terms: [
      ['Static typing', 'Setiap variabel punya type pasti (`int`, `string`, `decimal`) yang dicek waktu build sebelum program jalan.'],
      ['`var` (type inference)', 'Membuat compiler menebak type variabel dari sisi kanan tanda sama dengan, bukan membuatnya jadi dynamic.'],
      ['`decimal` vs `double`', '`decimal` (`0.1m`) memakai basis 10 untuk hitungan uang, sedangkan `double` memakai binary floating point dan bisa membulatkan `0.1 + 0.2`.']
    ],
    title: 'Program, variabel, dan type',
    why: "Setiap program C# memproses nilai bertipe lewat rangkaian statement. Begitu paham bahwa compiler mengecek type **sebelum** program jalan, error pemula tidak lagi terasa acak. Itu cuma peringatan awal soal type yang tidak cocok.",
    points: [
      "C# di-compile menjadi IL, lalu .NET runtime (CLR) mengubah IL itu jadi machine code lewat JIT saat jalan. `dotnet run` menjalankan keduanya.",
      "Variabel itu kotak bernama dengan type tetap: `int`, `double`, `decimal` (uang), `bool`, `char`, `string`. Type-nya tidak berubah setelah deklarasi.",
      "`var` bukan berarti 'bebas isi type apa saja'. Compiler menebak type-nya dari sisi kanan lalu menguncinya.",
      "C# itu statically typed, jadi `int x = \"hello\";` langsung gagal saat build sebelum aplikasi dipakai user.",
      "String interpolation `$\"Total: {price * qty}\"` adalah cara paling praktis untuk menyusun teks.",
      "Format angka mengikuti setting regional PC kamu. Di Windows berbahasa Indonesia, `59.97` tercetak `59,97`, jadi pakai `CultureInfo.InvariantCulture` untuk file, API, atau log.",
      "Pembagian bilangan bulat membuang sisanya: `7 / 2` jadi `3`. Ubah salah satu angka ke `double` atau `decimal` kalau mau pecahannya ikut."
    ],
    practice: "Buat aplikasi console pakai `dotnet new console`. Deklarasikan nama, tahun lahir, dan tarif per jam kamu, lalu cetak kalimat berisi umur dan gaji 40 jam kerja seminggu. Setelah itu coba isi angka dengan teks, build, dan baca pesan compiler-nya perlahan.",
    teach: "Jelaskan ke orang awam apa itu variabel dan type, lalu kenapa C# menolak menjalankan `int x = \"hello\"`.",
    analogy: "Variabel itu toples berlabel di dapur: toples bertuliskan 'tepung' cuma boleh diisi tepung. Compiler bekerja seperti chef galak yang mengecek semua toples sebelum masak supaya gula tidak tertukar garam di tengah jalan.",
    pitfalls: [
      "Menyamakan `var` dengan `let` di JavaScript. `var x = 1; x = \"a\";` ditolak compiler karena `x` tetap `int`.",
      "Memakai `double` untuk uang. `0.1 + 0.2` tercetak `0.30000000000000004`, padahal `decimal` (`0.1m + 0.2m`) pas `0.3`.",
      "Mengira `7 / 2` menghasilkan `3.5`. Pembagian dua integer dibulatkan sebelum masuk variabel, jadi `double d = 7 / 2` tetap bernilai `3`.",
      "Bingung melihat output `59,97` padahal di tutorial tertulis `59.97`. Itu efek format angka regional, bukan bug."
    ],
    quiz: [
      ["Apa arti `var total = 5;` di C#?", ["`total` bertipe `dynamic`, jadi nanti bisa diisi type lain", "`total` bertipe `int`, ditebak compiler saat build", "`total` bertipe `object` sampai pertama kali dipakai", "`total` bertipe `long` karena `var` selalu memilih integer terbesar"], "`var` itu type inference saat compile time, jadi `total` selamanya bertipe `int`."],
      ["Apa yang tercetak dari `double d = 9 / 2; Console.WriteLine(d);`?", ["4.5", "4", "5", "Tidak lolos compile"], "`9 / 2` dihitung sebagai pembagian integer dulu menjadi `4`, baru diubah ke `4.0` dan tercetak `4`."],
      ["Type mana yang cocok untuk menyimpan harga barang?", ["`float`", "`double`", "`decimal`", "`string` agar tidak dibulatkan"], "`decimal` memakai basis 10 sehingga angka seperti 0.10 tetap akurat, berbeda dari float biner atau string."]
    ]
  },
  flow: {
    terms: [
      ['Guard clause (early `return`)', 'Menangani kasus tidak valid di awal method agar alur utamanya tetap datar dan mudah dibaca.'],
      ['Switch expression', 'Bentuk ringkas (`score switch { >= 90 => "A", _ => "B" }`) yang memaksa setiap cabang menghasilkan nilai.'],
      ['Method signature', 'Nama method, return type, dan daftar tipe parameternya. Mengubah salah satunya berarti mengubah kontrak API.']
    ],
    title: 'Alur kontrol dan method',
    why: "Percabangan, perulangan, dan method menjadi pondasi semua logika program. Materi lanjutan seperti LINQ, async, dan HTTP handler tersusun dari pola dasar ini.",
    points: [
      "`if / else if / else` memilih jalur berdasarkan kondisi `bool` (`==` membandingkan nilai, sedangkan `=` mengisi nilai).",
      "Pakai `for` saat butuh nomor indeks, `foreach` untuk menyusuri koleksi, dan `while` selama syaratnya masih terpenuhi.",
      "Method membungkus langkah kerja dengan parameter dan tipe hasil (`static int Add(int a, int b) => a + b`).",
      "Default di C# mengirim argumen **by value**. Untuk angka yang disalin nilainya, sedangkan untuk object yang disalin referensinya.",
      "Satu nilai bisa dipetakan langsung ke hasil lewat `switch` expression yang ringkas.",
      "Jaga method tetap singkat dan beri nama sesuai tugasnya. Penamaan yang jelas adalah dokumentasi paling efektif."
    ],
    practice: "Tulis FizzBuzz untuk angka 1 sampai 30 lewat method `string FizzBuzz(int n)` yang dipanggil dalam loop. Setelah jalan, ubah isi method menjadi `switch` expression pada tuple `(n % 3, n % 5)`.",
    teach: "Jelaskan beda perulangan `for` dan `foreach`, serta kapan kode lebih baik dipisah ke method ketimbang disalin berulang.",
    analogy: "Method itu kartu resep berisi nama masakan, daftar bahan (parameter), dan hasil jadinya (return value). Saat lapar kamu tinggal mengikuti kartu itu tanpa menulis ulang resepnya dari nol.",
    pitfalls: [
      "Salah batas indeks seperti `i <= array.Length` yang membaca lewat ujung array. Indeks dimulai dari 0 sampai `Length - 1`.",
      "Salah ketik `if (x = 5)`. C# langsung menolak karena `x` bukan `bool`, mencegah bug klasik tertukarnya `=` dan `==`.",
      "Mengira method bisa mengubah nilai `int` milik pemanggil. Tanpa `ref` atau `out`, method hanya mengubah salinannya sendiri."
    ],
    quiz: [
      ["Perulangan mana yang paling pas untuk menyusuri tiap item di `List<string>` dari awal sampai akhir?", ["`for (int i = 0; i <= list.Count; i++)`", "`foreach`", "`while (list.Any())`", "`do … while`"], "`foreach` langsung mengambil tiap elemen tanpa risiko kelewatan batas indeks, sedangkan loop `for` di pilihan pertama membaca lewat ujung list."],
      ["Method `void Reset(int n) { n = 0; }` dipanggil lewat `Reset(count)`. Berapa nilai `count` setelahnya?", ["0", "Tidak berubah", "Tergantung apakah `count` dideklarasikan dengan `var`", "Error compile"], "`int` dikirim by value, sehingga method hanya mengubah salinan `n` di dalamnya."],
      ["Apa fungsi pola `_` di dalam cabang `switch` expression?", ["Variabel penampung nilai di dalam cabang", "Hanya cocok kalau nilainya `null`", "Cabang bawaan yang menangkap sisa nilai apa pun", "Mengulang hasil dari cabang sebelumnya"], "`_` adalah discard pattern yang menangkap nilai apa pun jika cabang di atasnya tidak ada yang cocok."]
    ]
  },
  classes: {
    terms: [
      ['Class vs Object', '`class` adalah rancangannya (`Product`), sedangkan object adalah wujud nyata di memori yang dibuat lewat `new Product(...)`.'],
      ['Constructor', 'Dijalankan saat `new` dipanggil agar data wajib sudah valid sejak awal (bisa memakai primary constructor atau `init`).'],
      ['Invariant', 'Aturan yang wajib dijaga seumur hidup oleh sebuah object, misalnya harga tidak boleh minus.']
    ],
    title: 'Class, object, dan property',
    why: "C# dibangun di sekitar object. Controller ASP.NET Core, entity EF Core, hingga DTO semuanya berupa class, jadi paham anatomi class membantumu membaca kode nyata lebih cepat.",
    points: [
      "**Class** mendefinisikan cetakan dasar, lalu **object** adalah satu wujud hidupnya yang dibuat lewat `new`.",
      "Property (`public string Name { get; set; }`) menyimpan data, sedangkan method menjalankan perilaku.",
      "Constructor menjaga object mulai dalam keadaan valid. Masukkan data wajib lewat parameter constructor atau properti `required`.",
      "Dalam **encapsulation**, jadikan field `private` dan buka akses seperlunya saja. Memberi `private set` menjaga aturan class tetap aman.",
      "Anggota `static` menempel pada class-nya sendiri, bukan pada tiap object hasil instan.",
      "`this` merujuk ke object yang sedang aktif, walaupun C# jarang mengharuskan kamu menulisnya."
    ],
    practice: "Tambahkan method `Withdraw` yang menolak penarikan melebihi saldo, lalu buat `Transfer(BankAccount to, decimal amount)`. Pikirkan aturan mana masuk ke method mana, dan kenapa `Balance` perlu setter privat.",
    teach: "Jelaskan beda class dan object, lalu alasan `Balance` memakai private setter bukan bebas diubah dari luar.",
    analogy: "Class mirip gambar denah rumah dari arsitek, dan tiap rumah yang berdiri adalah object-nya. Encapsulation berfungsi seperti pintu depan: tamu memencet bel (public method), bukan memanjat jendela dan mengutak-atik kabel (private field).",
    pitfalls: [
      "Memanggil `BankAccount.Deposit(50)` langsung lewat nama class-nya. `Deposit` milik object, jadi panggil `acct.Deposit(50)`.",
      "Membuka semua hal jadi `public` biar cepat. Kode luar bisa menulis `acct.Balance = -500` dan menerobos validasi di `Deposit`.",
      "Mengira property sama persis seperti field. Di balik layar, property adalah sepasang method yang bisa memvalidasi atau menghitung nilai."
    ],
    quiz: [
      ["Apa izin akses yang diberikan `public decimal Balance { get; private set; }`?", ["Siapa saja bebas membaca dan menulis", "Siapa saja bisa membaca, tapi hanya kode di dalam class yang boleh mengubah", "Hanya class turunan yang boleh mengubah", "Hanya bisa diisi sekali di constructor saja"], "Getter-nya public sedangkan setter-nya private, sehingga class tetap memegang kendali perubahan (jika ingin sekali isi di constructor, pakai `{ get; }`)."],
      ["Apa tugas utama constructor?", ["Membebaskan memori object saat selesai dipakai", "Menyiapkan object baru dalam kondisi awal yang valid", "Berjalan setiap kali ada property dibaca", "Menyalin seluruh data dari object lain"], "Constructor berjalan tepat saat object dibuat untuk menegakkan aturan awalnya sejak pertama ada."],
      ["Sebuah method `static` itu…", ["dimiliki terpisah oleh masing-masing object", "menempel di tipe class-nya sehingga bisa dipanggil tanpa instance", "hanya bisa dipanggil satu kali saja", "otomatis jalan saat aplikasi mulai"], "Member static dipanggil langsung lewat nama tipenya, seperti `Math.Max(1, 2)`."]
    ]
  },
  memory: {
    terms: [
      ['Value type (`struct`, `int`)', 'Assignment menyalin seluruh nilainya (`b = a`), jadi mengubah `b` tidak akan menyentuh `a`.'],
      ['Reference type (`class`)', 'Variabel hanya memegang alamat memori menuju object di heap, jadi menyalin variabel cuma menggandakan penunjuknya.'],
      ['Immutability', 'Mengunci properti dengan `init` atau membuat salinan baru lewat `with` agar referensi bersama tidak berubah diam-diam.']
    ],
    title: 'Value type vs reference type',
    viz: 'stackheap',
    predict: {
      prompt: 'Misalkan `p1 = new Person("Ana")`, lalu `p2 = p1`, kemudian `p2.Name = "Budi"`. Apa yang dicetak `Console.WriteLine(p1.Name)`?',
      options: ['`Ana` karena `p2` menerima salinan terpisah', '`Budi` karena kedua variabel menunjuk ke object heap yang sama', 'Error compile saat mengubah property'],
      answer: 1,
      explain: 'Karena `Person` adalah `class` (reference type), baris `p2 = p1` menyalin alamat referensinya, bukan menggandakan object-nya. Mengubah `p2.Name` langsung mengubah satu-satunya object tersebut.'
    },
    why: "'Aku cuma mengubah satu variabel, kok yang lain ikut berubah?' adalah kebingungan paling umum saat belajar C#. Jawabannya ada di aturan value type vs reference type, dan sekali paham kamu takkan tertipu lagi.",
    points: [
      "**Value type** (`int`, `bool`, `decimal`, `DateTime`, struct, enum) menyimpan data langsung di tempatnya, jadi assignment selalu menyalin nilai.",
      "**Reference type** (`class`, `string`, array, `List<T>`) menyimpan petunjuk ke object di heap, jadi menyalinnya membuat dua variabel menunjuk satu object.",
      "Variabel lokal hidup di stack frame method, sedangkan object hasil `new` tinggal di managed heap sampai dibersihkan garbage collector.",
      "`string` adalah reference type yang **immutable**, sehingga terasa seperti value type karena teks baru selalu menghasilkan object string baru.",
      "Operator `==` pada class membandingkan alamat memori kecuali di-override seperti pada `string` dan `record`. Struct buatan sendiri belum punya `==` meski `Equals` bisa membandingkan field.",
      "`null` artinya referensi tidak menunjuk ke mana pun. Value type tidak bisa bernilai null kecuali ditandai nullable seperti `int?`."
    ],
    practice: "Tebak hasilnya lalu jalankan: buat `struct Point { public int X; }` dan `class PointC { public int X; }`. Salin masing-masing ke variabel kedua, ubah `X` pada salinannya, lalu cetak keduanya dan jelaskan perbedaannya.",
    teach: "Jelaskan kenapa mengubah `p2.Name = \"Budi\"` ikut mengganti `p1.Name`, tapi `b = 9` membiarkan `a` tetap utuh.",
    analogy: "Value type seperti selembar kertas yang difotokopi: coretan di fotokopian tidak mengubah kertas asli. Reference type mirip link Google Docs: kalau temanmu mengedit lewat link tersebut, layar kamu ikut berubah.",
    pitfalls: [
      "Patokan 'value type selalu di stack, reference di heap' hanya kasar. Field struct di dalam class tetap duduk di heap, jadi pikirkan aturan disalin atau dibagi dulu.",
      "Mengira mengirim class ke parameter method otomatis menggandakannya. Yang disalin tetap cuma referensinya.",
      "Mengharapkan `Replace(p1)` mengganti variabel milik pemanggil. Tanpa kata kunci `ref`, yang tertukar cuma referensi lokal di parameter."
    ],
    quiz: [
      ["Setelah `var x = new List<int>{1}; var y = x; y.Add(2);` berapa jumlah isi `x`?", ["1, karena `y` hasil salinan", "2", "0", "Error compile"], "`List<T>` bertipe reference, jadi `x` dan `y` sama-sama menunjuk ke satu list."],
      ["Manakah dari pilihan berikut yang termasuk value type?", ["`string`", "`int[]`", "`DateTime`", "`List<int>`"], "`DateTime` adalah struct. Sebaliknya, `string`, `List<T>`, dan array `int[]` semuanya reference type."],
      ["Kenapa `string` terasa seperti value type saat dipakai?", ["Disimpan langsung di stack", "Sifatnya immutable dan `==` membandingkan isi teksnya", "Bentuk aslinya adalah struct", "Compiler otomatis menggandakannya di tiap assignment"], "Meskipun tinggal di heap, sifat immutable dan perbandingan isi pada `==` membuatnya berperilaku seperti nilai."]
    ]
  },
  interfaces: {
    terms: [
      ['Interface (`IPayment`)', 'Kontrak tentang *apa* kemampuan suatu tipe tanpa mengatur caranya, memudahkan unit test menukar layanan asli dengan tiruan.'],
      ['Polymorphism', 'Memanggil `.Charge(...)` lewat referensi `IPayment` agar tiap class konkret menjalankan kodenya sendiri.'],
      ['Composition over inheritance', 'Menyimpan helper di field (`class OrderService(IPayment pay)`) ketimbang membangun pohon pewarisan class yang kaku.']
    ],
    title: 'Interface, pewarisan, dan polymorphism',
    why: "ASP.NET Core penuh dengan interface seperti `ILogger<T>`, `IServiceCollection`, dan `IConfiguration`. Begitu mengerti interface, cara kerja dependency injection dan kode yang mudah di-test langsung masuk akal.",
    points: [
      "**Interface** berisi kontrak murni berupa daftar method dan property tanpa menyimpan data instance.",
      "Dengan **polymorphism**, kode yang memakai `INotifier` tetap cocok dengan implementasi baru apa pun nanti.",
      "Pewarisan (`class Dog : Animal`) dipakai untuk berbagi kode induk. Beri penanda `virtual` agar subclass boleh me-`override`, atau `abstract` jika wajib diisi.",
      "Satu class hanya boleh mewarisi satu class induk, tapi bebas mengimplementasikan banyak interface.",
      "Lebih baik mengutamakan komposisi dan interface kecil ketimbang hierarki class yang dalam dan saling mengunci."
    ],
    practice: "Buat `FakeNotifier` yang menampung pesan ke `List<string>` dan pakai untuk mengecek apakah `OrderService.Place` mengirim satu pesan. Setelah itu tambahkan `Bird` yang meng-override `Move`, lalu coba ganti `override` dengan `new`.",
    teach: "Jelaskan apa fungsi interface dan kenapa `OrderService` lebih baik meminta `INotifier` ketimbang membuat `EmailNotifier` sendiri.",
    analogy: "Interface itu seperti stopkontak dinding. Lampu tak peduli listrik datang dari panel surya atau PLTA selama colokannya pas. Pembangkitnya boleh diganti, lampunya tetap menyala.",
    pitfalls: [
      "Kebiasaan membuat interface untuk setiap class. Interface baru berguna saat memang ada banyak implementasi atau butuh fake untuk test.",
      "Menulis `new` padahal maunya `override` pada method turunan. Kode lolos compile dengan warning, tapi referensi induk tetap memanggil method lama.",
      "Memakai pewarisan cuma demi menyalin kode antar benda yang tak nyambung. Hubungan pewarisan harus selalu masuk akal."
    ],
    quiz: [
      ["Berapa banyak interface yang boleh diimplementasikan satu class C#?", ["Satu saja", "Maksimal dua", "Bebas sebanyak apa pun", "Tidak boleh jika sudah punya class induk"], "Satu class hanya boleh punya satu induk class, tapi bebas menerapkan berapapun interface."],
      ["Penanda apa yang wajib ada di method induk agar bisa di-`override`?", ["`static`", "`virtual` atau `abstract`", "`sealed`", "`public` saja sudah cukup"], "Hanya member `virtual`, `abstract`, atau hasil override sebelumnya yang boleh di-override lagi."],
      ["Keuntungan utama `OrderService(INotifier notifier)` dibanding langsung `new EmailNotifier()` di dalam class adalah…", ["Panggilan method jadi lebih cepat", "Implementasinya bisa ditukar atau dibuatkan fake tanpa mengubah `OrderService`", "`OrderService` jadi tak butuh constructor", "Mencegah `OrderService` diwarisi class lain"], "Bergantung pada abstraksi memisahkan class dari implementasi konkret, dan itulah dasar dependency injection."]
    ]
  },
  generics: {
    terms: [
      ['`List<T>` vs `Dictionary<K,V>` vs `HashSet<T>`', '`List` mencari lewat urutan, sementara `Dictionary` dan `HashSet` memakai hashing untuk lookup O(1) dan cek keunikan instan.'],
      ['Generic parameter `<T>`', 'Placeholder tipe yang diisi saat compile time agar `Repository<Product>` aman tipe tanpa boxing.'],
      ['`IEnumerable<T>`', 'Urutan data sekali jalan yang mendukung loop dan LINQ tanpa mewajibkan pemanggil mengirim `List`.']
    ],
    title: 'Koleksi dan generics',
    why: "Sebagian besar program nyata mengolah daftar data. Memilih antara `List`, `Dictionary`, dan `HashSet` sering menjadi keputusan performa pertama kamu, kadang tanpa disadari.",
    points: [
      "`List<T>` rapi sesuai urutan, punya indeks, dan ukurannya fleksibel. Namun mencari isi di dalamnya butuh waktu O(n).",
      "`Dictionary<TKey, TValue>` memetakan key ke nilai dalam rata-rata O(1). Pakai `TryGetValue` untuk membaca agar tak butuh try/catch.",
      "`HashSet<T>` menjamin item unik dengan pencarian `Contains` yang ngebut, sedangkan `Queue<T>` (antrean) dan `Stack<T>` (tumpukan) mengatur urutan keluar-masuk.",
      "**Generics** membuat satu kode bisa melayani banyak tipe dengan aman: `List<int>` menolak teks tanpa perlu cast manual.",
      "Constraint membatasi tipe `T` yang boleh masuk, misalnya `where T : IComparable<T>` atau `where T : class, new()`.",
      "Terima tipe parameter yang longgar seperti `IEnumerable<T>` atau `IReadOnlyList<T>`, lalu kembalikan hasil yang cukup spesifik."
    ],
    practice: "Hitung frekuensi kata dalam satu paragraf memakai `Dictionary<string, int>`, lalu cetak tiga besarnya. Kemudian tulis class generik `Result<T>` yang menyimpan nilai sukses atau pesan error.",
    teach: "Jelaskan alasan mencari data di `Dictionary` jauh lebih cepat daripada di `List`, dan apa manfaat `<T>` di `List<T>`.",
    analogy: "Mencari di `List` seperti menyusuri antrean orang satu per satu demi menemukan Budi. `Dictionary` itu tempat penitipan jaket: kamu serahkan karcis nomor 42 dan petugas langsung menuju gantungan 42.",
    pitfalls: [
      "Memanggil `list.Contains()` di dalam loop lain sehingga kompleksitasnya membengkak diam-diam jadi O(n kuadrat). Pindahkan dulu ke `HashSet`.",
      "Membaca langsung `dict[key]` saat key-nya tidak ada dan berujung `KeyNotFoundException`.",
      "Menambah atau menghapus item di tengah `foreach`. Salin dulu (`list.ToList()`) atau catat perubahan lalu terapkan setelah loop selesai."
    ],
    quiz: [
      ["Kamu harus mengecek ribuan kali apakah suatu ID sudah pernah muncul. Pilihan paling tepat?", ["`List<int>` dengan `Contains`", "`int[]` dicari pakai loop", "`HashSet<int>`", "`Queue<int>`"], "Pengecekan `HashSet.Contains` rata-rata O(1), jauh lebih cepat dibanding menyapu list atau array satu-satu (O(n))."],
      ["Apa syarat yang diminta oleh constraint `where T : new()`?", ["T harus berupa value type", "T punya constructor public tanpa parameter", "T harus sudah dibuat dengan `new` sebelum dikirim", "T mengimplementasikan `ICloneable`"], "Constraint `new()` mengizinkan kode generik memanggil `new T()` dengan aman."],
      ["Cara paling pas membaca key dictionary yang belum tentu ada?", ["Pakai `dict[key]` di dalam try/catch", "`dict.TryGetValue(key, out var v)`", "Cek `dict.ContainsKey(key)` dulu lalu baca `dict[key]`", "Cari lewat `dict.Keys.First(k => k == key)`"], "`TryGetValue` hanya mencari sekali di tabel hash. Menggabungkan `ContainsKey` dan indexer mencari dua kali, dan try/catch lambat."]
    ]
  },
  errors: {
    terms: [
      ['`using` / `IDisposable`', 'Menutup file, socket, dan koneksi database tepat saat blok selesai meski terjadi error di tengah method.'],
      ['Exception filter / catch order', 'Tangkap error spesifik (`FileNotFoundException`) di tempat yang bisa pulih daripada menelan semua `Exception` begitu saja.'],
      ['Result pattern vs Exceptions', 'Kembalikan error validasi sebagai nilai biasa (`Result` atau HTTP 400/404), dan simpan exception untuk kejadian tak terduga.']
    ],
    title: 'Exception dan bersih-bersih resource',
    why: "File bisa hilang, koneksi jaringan bisa putus, dan user bisa mengisi input aneh. Penanganan error menentukan apakah kegagalan menghasilkan log yang rapi atau merusak data di tengah jalan.",
    points: [
      "Saat exception muncul, eksekusi mundur melewati call stack sampai bertemu `catch` yang cocok. Bila tak ada yang menangkap, program berhenti.",
      "Tangkap error hanya di titik kamu sanggup mengambil tindakan (retry, fallback, atau bungkus ulang). Di ASP.NET Core, error bebas naik lalu dicatat handler global.",
      "Urutkan penangkap spesifik (`FileNotFoundException`, `FormatException`) sebelum yang umum, dan jangan tinggalkan blok `catch { }` kosong.",
      "Di dalam `catch`, pakai `throw;` tanpa nama variabel agar stack trace asli tidak hilang. Menulis `throw ex;` menimpa lokasi awal error.",
      "Blok `finally` pasti jalan entah sukses ataupun gagal. Menulis `using` otomatis diterjemahkan compiler menjadi `finally { resource.Dispose(); }`.",
      "Simpan exception untuk gangguan tak terduga. Untuk validasi input yang wajar, pakai `TryParse` atau tipe balikan `Result`."
    ],
    practice: "Baca file teks baris per baris dan jumlahkan angkanya. Tentukan respons untuk file hilang, baris kosong, dan teks `12a`, lalu paksakan gagal baca untuk memastikan `Dispose()` tetap terpanggil.",
    teach: "Jelaskan kapan harus menangkap exception dan kapan membiarkannya naik lewat contoh `ReadFirstLine` dan `ParseAge`.",
    analogy: "Exception mirip alarm kebakaran yang berbunyi naik ke lantai atas sampai ada petugas terlatih (`catch`) yang menanganinya. Memakai `catch` kosong sama seperti mencabut baterai alarm saat ada api.",
    pitfalls: [
      "Menulis `catch (Exception) { }` kosong lalu membiarkan aplikasi lanjut dengan data rusak tanpa jejak di log.",
      "Memakai `throw ex;` padahal harusnya `throw;`, sehingga baris sumber masalahnya terhapus dari stack trace.",
      "Membungkus semua method kecil pakai `try/catch` 'untuk jaga-jaga', bukan membiarkannya ditangani di pemanggil terluar atau handler global.",
      "Memakai exception untuk kasus wajar seperti format angka salah atau data tidak ditemukan."
    ],
    quiz: [
      ["Di dalam blok `catch`, apa beda `throw;` dengan `throw ex;`?", ["Keduanya sama persis", "`throw;` meneruskan error dengan tetap menjaga stack trace aslinya", "`throw;` langsung menelan exception", "`throw;` membuat `Exception` baru tanpa pesan"], "`throw ex;` mengatur ulang posisi error ke baris catch sekarang, sedangkan `throw;` menjaga asal masalah sesungguhnya."],
      ["Kapan blok `finally` dijalankan?", ["Hanya kalau terjadi exception", "Hanya kalau tidak ada exception", "Selalu jalan: saat sukses, saat gagal, dan bahkan setelah `return`", "Hanya jika tidak ada blok `catch`"], "Jaminan selalu jalan inilah yang membuat `finally` dan `using` aman untuk membersihkan resource."],
      ["User mengetik `12a` di kolom umur. Cara terbaik menanganinya?", ["`int.Parse` di dalam try/catch", "`int.TryParse`, lalu tampilkan pesan validasi jika hasilnya `false`", "Biarkan error naik ke global error handler", "`Convert.ToInt32` dengan blok catch kosong"], "Input salah itu kejadian biasa, bukan error sistem. `TryParse` memeriksanya cepat tanpa biaya exception."],
      ["Apa jaminan dari baris `using var conn = new SqlConnection(cs);`?", ["Koneksi terus terbuka sampai program selesai", "`Dispose()` otomatis dipanggil di akhir scope, meski ada exception", "Koneksi terbuka seketika tanpa dipanggil", "Koneksi aman dipakai bersamaan banyak thread"], "`using` diubah compiler menjadi blok try/finally yang selalu memanggil `Dispose()`."]
    ]
  },
  linq: {
    terms: [
      ['Deferred execution', 'Operator seperti `Where` dan `Select` baru mencatat rencananya. Data baru diproses waktu `.ToList()`, `.First()`, atau `foreach` berjalan.'],
      ['`IEnumerable<T>` vs `IQueryable<T>`', '`IEnumerable` menjalankan lambda atas object di memori, sementara `IQueryable` menyimpan pohon ekspresi untuk diterjemahkan EF Core jadi SQL.'],
      ['`Any()` vs `Count() > 0`', '`Any()` langsung berhenti pada item cocok pertama (`EXISTS` di SQL), sedangkan `Count()` berisiko menghitung seluruh baris sia-sia.']
    ],
    title: 'LINQ: mengolah data apa saja',
    viz: 'linq',
    why: "LINQ adalah cara C# menyaring, mengubah, dan meringkas data baik di memori maupun di SQL lewat EF Core. Ini jembatan langsung antara track C# dan SQL.",
    points: [
      "LINQ menambah extension method ke `IEnumerable<T>` seperti `Where` (saring), `Select` (ubah bentuk), `OrderBy` (urutkan), dan `GroupBy` (kelompokkan).",
      "Lambda ringkas seperti `x => x.Price > 10` ditulis langsung sebagai argumen ke dalam operator LINQ.",
      "Berkat **deferred execution**, menyusun query tidak langsung mengolah data. Data baru diproses saat diulang memakai `foreach`, `ToList()`, `Count()`, atau `First()`.",
      "Mengulang query yang sama dua kali ikut menjalankan kodenya dua kali. Simpan hasilnya lewat `ToList()` kalau datanya mau dibaca berulang.",
      "`First()` mengeluarkan error bila kosong, `FirstOrDefault()` mengembalikan `null` atau nilai `default`, dan `Single()` mewajibkan pas satu hasil.",
      "Pada `IQueryable<T>` milik EF Core, operator LINQ diterjemahkan menjadi query SQL, bukan perulangan di memori C#."
    ],
    practice: "Dari daftar pesanan (pelanggan, total, tanggal), hitung belanja tiap pelanggan memakai LINQ, urutkan tertinggi ke terendah, lalu ambil tiga besar. Setelah itu selipkan `Console.WriteLine` di dalam lambda `Where` dan amati kapan teksnya tercetak.",
    teach: "Jelaskan maksud deferred execution: kenapa query LINQ berisi `Where` dan `Select` diam saja sebelum bertemu `foreach` atau `ToList()`?",
    analogy: "Query LINQ itu daftar instruksi di atas ban berjalan: 'ambil yang merah, cat ulang, masukkan tiga pertama ke dus'. Menulis aturan itu belum menggerakkan satu dus pun sampai ada petugas datang meminta barang jadinya.",
    pitfalls: [
      "Menjalankan loop pada satu query LINQ berkali-kali hingga tanpa sadar memanggil database dua kali.",
      "Menulis `Count() > 0` sekadar untuk mengecek ketersediaan data. `Any()` lebih tepat maksudnya dan berubah jadi `EXISTS` yang hemat di EF Core.",
      "Memanggil `ToList()` di tengah query EF Core sehingga seluruh isi tabel tersedot ke memori dulu baru disaring."
    ],
    quiz: [
      ["Kapan baris `var q = items.Where(x => x > 5);` mulai menyaring item?", ["Langsung saat baris itu dieksekusi", "Ketika `q` mulai dibaca atau diulang", "Saat method-nya selesai dipanggil", "Saat `q` disalin ke variabel baru"], "Query LINQ bersifat lazy dan baru bekerja saat enumerasi dimulai."],
      ["Panggilan mana yang gagal dengan error jika urutannya kosong?", ["`FirstOrDefault()`", "`Any()`", "`First()`", "`Where()`"], "`First()` mengharuskan minimal ada satu elemen yang cocok."],
      ["Cara paling tepat untuk mengecek 'apakah ada minimal satu data yang cocok?'", ["`Count() > 0`", "`Any()`", "`ToList().Count > 0`", "`FirstOrDefault() != null`"], "`Any()` berhenti saat ketemu yang pertama. Menguji `FirstOrDefault() != null` justru salah pada angka karena nilai bakunya `0`, bukan `null`."]
    ]
  },
  delegates: {
    terms: [
      ['Delegate (`Func<>` / `Action<>`)', 'Referensi fungsi bertipe aman (`Func<int, bool>` menerima `int` lalu kembali `bool`, sedangkan `Action` tanpa nilai balik).'],
      ['Lambda (`x => x * 2`)', 'Fungsi anonim sebaris yang langsung diteruskan ke LINQ, middleware, atau event handler.'],
      ['Closure capture', 'Lambda yang menjaga akses langsung ke variabel luar. Hati-hati terhadap loop counter yang berubah atau object besar yang tertahan di memori.']
    ],
    title: 'Delegate, lambda, dan event',
    why: "Mengirim fungsi sebagai nilai menjadi tulang punggung LINQ, middleware, dan Minimal API. Begitu terbiasa membaca bentuk `Func<T, bool>`, kode framework langsung terasa ramah.",
    points: [
      "**Delegate** mendefinisikan wadah bertipe untuk sebuah method, seperti 'terima `int` dan kembalikan `bool`'.",
      "`Func<T, TResult>` mengembalikan nilai, `Action<T>` tanpa nilai balik, dan `Predicate<T>` mengembalikan `bool`. Kamu hampir tak butuh bikin tipe delegate sendiri.",
      "**Lambda** (`x => x * 2`) menulis fungsi singkat di tempat. Jika menyentuh variabel luar, ia menjadi **closure** yang memantau variabel aslinya, bukan nilainya saja.",
      "**Extension method** (`this` sebelum parameter pertama) menambah fungsi ke tipe yang sudah ada, sedangkan `yield return` mengeluarkan item satu per satu seperti cara kerja LINQ.",
      "**Event** membungkus delegate agar kode luar cuma bisa mendaftar (`+=`) atau mencabut (`-=`). Lupa mencabut langganan menahan listener agar tak bisa dibersihkan memori.",
      "`app.MapGet(\"/\", () => \"hi\")` sebenarnya cuma mengirim sebuah lambda langsung ke sistem routing ASP.NET Core."
    ],
    practice: "Tambahkan extension method `Transform` di sebelah `KeepIf` (mirip `Select`, memakai `Func<T, TResult>` dan `yield return`), lalu rangkai keduanya. Letakkan `Console.WriteLine` di tiap langkah agar terlihat data mengalir satu per satu seperti di LINQ.",
    teach: "Jelaskan apa artinya lambda 'menangkap' variabel luar dengan merujuk contoh `count`.",
    analogy: "Delegate mirip nomor telepon di kartu nama: kamu titip kartunya ke orang lain untuk ditelepon nanti tanpa tahu siapa yang mengangkat. Event seperti milis newsletter: semua boleh daftar atau berhenti, tapi hanya pemilik milis yang berhak mengirim siaran.",
    pitfalls: [
      "Mengira closure menyalin isi variabelnya. Ia justru memegang variabel aslinya, jadi perubahan nilai belakangan ikut terbaca.",
      "Publisher tahan lama yang masih memegang referensi subscriber sementara lewat event karena lupa berhenti berlangganan.",
      "Membuat tipe delegate kustom baru padahal sudah tersedia `Func` atau `Action`."
    ],
    quiz: [
      ["Tipe manakah yang cocok untuk method berparameter `string` dan menghasilkan `int`?", ["`Action<string, int>`", "`Func<string, int>`", "`Func<int, string>`", "`Predicate<string>`"], "Pada `Func`, parameter tipe paling kanan selalu menjadi tipe kembaliannya."],
      ["`int n = 1; Func<int> f = () => n; n = 5;` Apa hasil panggilan `f()`?", ["1", "5", "0", "Error saat jalan"], "Closure menyimpan referensi ke variabel `n` itu sendiri, bukan nilainya saat lambda dibuat."],
      ["Apa saja yang boleh dilakukan kode luar terhadap `event` publik di sebuah class?", ["Menjalankan atau memicu event tersebut", "Menghapus semua subscriber dengan tanda `=`", "Cuma mendaftar dan berhenti berlangganan", "Membaca seluruh daftar subscriber-nya"], "Event membatasi kode luar hanya pada `+=` dan `-=`. Hanya class pemiliknya yang bisa memicu event."]
    ]
  },
  async: {
    terms: [
      ['Non-blocking I/O (`await`)', 'Membebaskan thread agar ASP.NET Core bisa melayani ribuan request lain selama menunggu balasan SQL atau HTTP.'],
      ['`Task.WhenAll(...)`', 'Menjalankan beberapa tugas async yang tidak saling tergantung berbarengan agar tidak perlu menunggu satu per satu.'],
      ['`CancellationToken`', 'Meneruskan sinyal batal saat client memutus koneksi atau timeout agar query database langsung berhenti bekerja.']
    ],
    title: 'async, await, dan Task',
    viz: 'async',
    predict: {
      prompt: 'Sebuah endpoint memanggil dua query independen masing-masing 200 ms: `await db.GetUserAsync(); await db.GetOrdersAsync();` dibanding menjalankan keduanya dulu lalu menunggu `Task.WhenAll(u, o)`. Berapa perkiraan waktunya?',
      options: ['Keduanya ~200 ms karena sama-sama memakai `await`', 'Berurutan makan ~400 ms, sedangkan `Task.WhenAll` hanya ~200 ms', 'Jalan bersamaan butuh dua proses aplikasi terpisah'],
      answer: 1,
      explain: 'Dua `await` berturut-turut membuat query kedua menunggu query pertama kelar (~400 ms). Menjalankan keduanya sekaligus lewat `Task.WhenAll` menumpuk waktu tunggunya menjadi ~200 ms.'
    },
    why: "Tugas utama web server sebenarnya menunggu database, API luar, atau disk. Kode async membebaskan thread agar melayani request lain selama jeda itu, mencegah antrean macet dan timeout saat traffic padat.",
    points: [
      "`Task` mewakili pekerjaan yang sedang berjalan, sedangkan `Task<T>` nantinya juga menghasilkan nilai.",
      "`await` tidak menahan thread untuk diam menunggu. Ia menempelkan kelanjutan kode lalu memulangkan thread ke pool seketika.",
      "Async menghindari pemborosan thread saat menunggu I/O (SQL, HTTP, disk), walaupun tidak mempercepat satu query tunggal.",
      "Pakai async dari ujung ke ujung dan hindari `.Result` maupun `.Wait()`. Memblokir thread pool membuat server ASP.NET Core kehabisan thread saat sibuk (dan bikin UI macet).",
      "Mulai dulu tugas yang tidak saling menunggu, lalu tutup dengan `await Task.WhenAll(...)` supaya waktunya bertumpuk tanpa menambah thread.",
      "Gunakan `async void` hanya untuk event handler tombol di UI, karena pemanggil tak bisa menunggu atau menangkap error-nya.",
      "Oper `CancellationToken` ke seluruh method async agar query database segera dibatalkan jika pengguna menutup tab browser.",
      "`IAsyncEnumerable<T>` menghasilkan data bertahap lewat `yield return` dan dibaca memakai `await foreach`, cocok untuk men-stream hasil EF Core tanpa menumpuknya di RAM."
    ],
    practice: "Ubah kode contoh agar memuat lima data bersamaan dengan `Task.WhenAll` lalu cetak durasinya. Setelah itu batalkan di 500 ms dan cek apakah tugas sisanya berhenti, lalu ganti `Task.Delay` dengan `HttpClient.GetStringAsync` ke URL publik.",
    teach: "Jelaskan nasib thread saat eksekusi menyentuh `await`, dan kenapa pola ini membuat web server sanggup menampung jauh lebih banyak pengguna.",
    analogy: "Bayangkan pelayan mengantar bon pesanan ke dapur. Daripada melamun di depan kompor menunggu matang, ia melayani meja lain lalu kembali pas bel (`await`) berbunyi. Memaksa `.Result` persis seperti pelayan yang mogok berdiri di dapur saat restoran penuh.",
    pitfalls: [
      "Mengira async otomatis menambah thread untuk I/O. Selama menunggu respons jaringan atau disk, tidak ada thread yang dipakai sama sekali.",
      "Membungkus pekerjaan CPU berat dengan `Task.Run` di ASP.NET Core lalu menganggapnya async. Itu cuma memindahkan beban ke thread pool lain.",
      "Lupa menaruh `await`. Method langsung lewat dan error dari task hilang tanpa ketahuan, jadi selalu bereskan warning CS4014.",
      "Memanggil `ToListAsync()` pada data raksasa hanya untuk satu kali loop, padahal streaming pakai `AsAsyncEnumerable()` menjaga memori tetap ringan."
    ],
    quiz: [
      ["Apa yang terjadi pada thread aktif ketika sampai di `await http.GetAsync(url)` saat data jaringan masih di jalan?", ["Thread tidur pulas sampai jawaban tiba", "Thread dilepas agar bisa mengurus request lain", "Thread sibuk memeriksa status jaringan tiap milidetik", "Thread menyerahkan request itu ke thread baru"], "`await` mengembalikan thread ke pool dan meneruskan sisa method saat data sudah datang."],
      ["Tiga panggilan I/O independen berdurasi masing-masing 1 detik. Cara tercepat yang benar?", ["Menunggu satu demi satu dengan await", "Mulai ketiganya dulu, lalu `await Task.WhenAll`", "Bungkus tiap panggilan dalam `Task.Run` lalu ambil `.Result`", "Jalankan `Parallel.For` dan `.Wait()`"], "Memulai ketiganya dulu menyatukan waktu tunggunya menjadi sekitar 1 detik tanpa menahan satu thread pun."],
      ["Kenapa `.Result` harus dihindari di dalam ASP.NET Core?", ["Nilainya bisa berbeda dengan hasil `await`", "Ia menyandera satu thread pool selama menunggu, membuat server kehabisan thread saat ramai", "Pasti selalu mengalami deadlock", "Dilarang keras di dalam controller"], "ASP.NET Core memang bebas dari deadlock UI klasik, tapi tiap thread yang tersandera berarti satu thread hilang dari antrean layanan."],
      ["Sebuah method mengembalikan `IAsyncEnumerable<Order>`. Bagaimana cara membacanya?", ["`foreach (var o in GetOrders())`", "`await foreach (var o in GetOrders())`", "`GetOrders().Result`", "`await Task.WhenAll(GetOrders())`"], "`await foreach` menunggu tiap baris berikutnya hadir, sehingga data bisa langsung diproses sebelum semuanya selesai."]
    ]
  },
  modern: {
    terms: [
      ['Nullable reference types (`string?`)', 'Analisis alur oleh compiler memperingatkan sebelum kamu mengakses nilai yang mungkin `null`.'],
      ['`record`', 'Class data ringkas dan immutable dengan perbandingan nilai otomatis (`a == b`) serta dukungan salin cepat lewat `with`.'],
      ['Pattern matching', 'Percabangan deklaratif berbasis tipe dan bentuk data (`is Order { Total: > 100 } o`) yang keutuhannya dicek compiler.']
    ],
    title: 'Null safety, record, dan pattern',
    why: "C# modern membantu compiler mencegah beberapa jenis bug sebelum program dijalankan: null reference, kondisi data yang terlewat, dan mutasi tak sengaja. Kodenya jadi jauh lebih pendek namun tetap kokoh.",
    points: [
      "Project baru otomatis mengaktifkan **nullable reference type**. `string` menjanjikan nilai selalu ada, sementara `string?` memintamu mengecek null terlebih dahulu.",
      "`?.` (null-conditional), `??` (nilai cadangan), dan `??=` (isi jika masih null) merapikan pengecekan nilai kosong.",
      "Tanda `!` (null-forgiving) membungkam peringatan compiler tanpa menambah penjagaan di runtime. Hindari memakainya sembarangan atau `NullReferenceException` menanti di sana.",
      "**Record** membawa kesetaraan nilai, immutability, dan ekspresi `with` bawaan, sangat cocok untuk DTO dan event.",
      "**Pattern matching** (`is` dan `switch` dengan cek properti atau rentang angka) menggantikan rantai cast bertele-tele dan pas disandingkan dengan record."
    ],
    practice: "Buat model hierarki `Shape` memakai record (`Circle`, `Rect`, `Triangle`) lalu hitung `Area` dengan satu `switch` expression. Setelah jalan, build project dan bereskan semua warning nullable tanpa memakai operator `!` sama sekali.",
    teach: "Jelaskan perbedaan `string` dan `string?` serta bagaimana hal itu mengubah bantuan pemeriksaan dari compiler.",
    analogy: "Penanda nullable mirip stiker di atas kotak: 'selalu berisi' atau 'bisa kosong, intip dulu'. Compiler membaca stiker itu dan menegur kalau tanganmu asal merogoh kotak yang belum diperiksa.",
    pitfalls: [
      "Menempelkan `!` demi membungkam warning nullable tanpa membereskan akar masalahnya.",
      "Menganggap `record` sekadar 'class versi singkat'. Nilai jual utamanya ada pada perbandingan isi dan sifat immutable.",
      "Memasang `{ get; set; }` di record lalu mengubah isinya saat sudah menjadi key `HashSet` atau dictionary, membuat kode hash-nya meleset."
    ],
    quiz: [
      ["Apa hasil evaluasi `a?.B ?? c` saat `a` bernilai null?", ["Menghasilkan `NullReferenceException`", "`null`", "`c`", "`default(B)`"], "`a?.B` berhenti dan bernilai null, lalu `??` langsung memilih cadangan `c`."],
      ["Dua record dengan seluruh isi property persis sama saat dicek dengan `==` hasilnya…", ["selalu berbeda kecuali menunjuk object yang persis sama", "sama (equal)", "sama hanya jika salah satunya dibuat lewat `with`", "gagal compile"], "Record otomatis membandingkan isi nilai sebagai bawaan, bukan alamat memori."],
      ["Apa pesan dari deklarasi `string? name` kepada compiler?", ["`name` bersifat opsional dan boleh dilewati saat memanggil fungsi", "`name` mungkin null, jadi beri peringatan kalau kupakai sebelum dicek", "`name` adalah value type yang boleh kosong", "`name` akan dicek null otomatis saat aplikasi berjalan"], "Anotasi nullable cuma berlaku saat compile time untuk memberi peringatan, tanpa mengubah perilaku runtime."]
    ]
  },
  gc: {
    terms: [
      ['Generations (Gen 0 / 1 / 2)', 'Object sementara dibersihkan cepat di Gen 0, sedangkan object bertahan lama pindah ke Gen 2 / LOH yang pembersihannya berat.'],
      ['`Span<T>`', 'Tampilan irisan memori di stack tanpa alokasi heap untuk parsing array atau string.'],
      ['Boxing', 'Membungkus value type (`int`) ke dalam `object` di heap, memicu alokasi tersembunyi di koleksi non-generik atau `string.Format`.']
    ],
    title: 'Memori, GC, dan performa',
    why: "Pada beban traffic tinggi, kecepatan alokasi memori langsung berubah menjadi jeda latensi. Memahami cara kerja garbage collector membantumu menemukan alokasi boros di jalur panas lalu merapikannya tanpa membuat kode sulit dibaca.",
    points: [
      "GC di .NET bekerja bertahap (**generational**). Object baru mulai di Gen 0 yang bersih cepat, lalu yang awet naik kelas ke Gen 1 dan Gen 2.",
      "Alokasi 85 KB ke atas langsung masuk Large Object Heap dan dibersihkan bareng Gen 2 tanpa dirapatkan ulang. Karena itu buffer besar sementara terasa berat.",
      "Hindari jeda Gen 2 di loop sibuk dengan menyewa buffer (`ArrayPool<T>`) serta mengurangi penyambungan string dan rantai LINQ berulang.",
      "`Span<T>` dan `ReadOnlySpan<T>` memotong array atau string dengan nol alokasi. Karena bertipe `ref struct`, ia dilarang masuk heap atau melewati `await`.",
      "`Memory<T>` menjadi pasangan aman dari `Span<T>` ketika buffer harus dibawa melintasi pemanggilan async.",
      "Urutan membenahi performa: algoritma dan query I/O dulu (membereskan N+1 jauh lebih berdampak), baru pemangkasan alokasi, lalu optimasi mikro paling akhir.",
      "Ukur pakai `dotnet-counters`, `dotnet-trace`, atau BenchmarkDotNet berlabel `[MemoryDiagnoser]`. Hindari tes loop `Stopwatch` polos karena tertipu optimasi JIT bertingkat."
    ],
    practice: "Ukur perbandingan `SumSlow` dan `SumFast` memakai BenchmarkDotNet dengan `[MemoryDiagnoser]`. Catat jumlah byte yang terpakai tiap panggilan lalu jelaskan sumber seluruh alokasi di versi lambat.",
    teach: "Jelaskan kenapa kebanyakan pembersihan GC di .NET berjalan sangat cepat, dan pola kode apa yang bikin proses itu melambat.",
    analogy: "Gen 0 mirip meja kerjamu yang kertas coretannya disapu bersih berkali-kali tiap hari hanya dalam hitungan detik. Gen 2 itu gudang: membersihkannya memaksa seluruh pekerjaan berhenti setengah hari, jadi usahakan sampah sementara tak terbawa sampai ke gudang.",
    pitfalls: [
      "Memanggil `GC.Collect()` manual untuk 'membantu'. Ini malah menaikkan paksa object aktif ke generasi tua dan memperburuk jeda.",
      "Mengubah semuanya jadi struct demi menghindari heap, lalu malah terbebani biaya menyalin ukuran besar.",
      "Mengoptimasi bagian kode yang jarang lewat jalur sibuk. Selalu ukur dengan profiler dulu.",
      "Mengandalkan loop `Stopwatch` sederhana sebagai tolok ukur performa."
    ],
    quiz: [
      ["Kenapa pembersihan memori Gen 0 biasanya sangat murah dan cepat?", ["Berjalan di thread latar belakang tanpa biaya CPU", "Hampir semua object baru sudah tidak terpakai lagi sehingga sedikit yang perlu disalin", "Hanya memeriksa object berukuran di atas 85 KB", "Melewati object yang masih dipegang stack"], "Karena sebagian besar alokasi cepat tidak terpakai lagi, hanya sedikit yang selamat dan perlu dipindahkan."],
      ["Mengapa `Span<T>` dilarang dijadikan field di dalam sebuah class?", ["Ukurannya terlalu besar untuk muat di class", "Ia bertipe `ref struct` yang mungkin menunjuk ke memori stack sehingga tidak boleh bocor ke heap", "Span selalu bersifat read-only", "Class memang tidak pernah boleh berisi struct"], "Span bisa menunjuk ke stack frame yang lenyap saat method usai, jadi compiler mencegahnya tersimpan di heap."],
      ["Langkah pertama yang wajib diambil sebelum memangkas pemakaian memori?", ["Ubah semua tipe data sibuk jadi struct", "Panggil `GC.Collect()` setiap habis kerja berat", "Ukur dan profil dulu titik alokasinya", "Ganti semua LINQ dengan loop biasa"], "Tanpa mengukur lebih dulu, kamu tidak tahu persis di mana alokasi besar terjadi atau apakah itu memang sumber lambatnya."]
    ]
  },
  concurrency: {
    terms: [
      ['Race condition', 'Dua thread membaca dan mengubah data bersama tanpa pengatur urutan sehingga hasil akhirnya mengandalkan keberuntungan waktu.'],
      ['`ConcurrentDictionary` vs `lock`', '`ConcurrentDictionary` mengamankan akses peta data per operasi, sementara `SemaphoreSlim(1, 1)` mengunci blok async (jangan taruh `await` di dalam `lock`).'],
      ['`Channel<T>`', 'Antrean async producer/consumer berkecepatan tinggi untuk menyalurkan pekerjaan latar belakang dari endpoint HTTP ke worker.']
    ],
    title: 'Concurrency dan thread safety',
    why: "Web API memproses banyak request sekaligus di saat bersamaan. Static field, koleksi singleton, atau cache memori disentuh serempak banyak thread hingga memicu bug langka yang susah dilacak.",
    points: [
      "Pada **race condition**, kebenaran hasil bergantung pada keberuntungan urutan thread. Operasi seperti `count++` memecah langkah baca, tambah, dan tulis sehingga tak aman.",
      "Amankan data berubah dengan `lock` untuk kode sinkron, `Interlocked` untuk penghitung tunggal, atau `SemaphoreSlim.WaitAsync` jika di dalamnya ada `await`.",
      "Cara lebih bersih lagi adalah menghindari berbagi data berubah: pakai record immutable, state khusus per request, atau antrean `Channel<T>`.",
      "`ConcurrentDictionary` mengamankan tiap panggilan tunggal, tapi urutan cek-lalu-isi tetap rawan bentrok. Gunakan method atomik seperti `GetOrAdd` dan `AddOrUpdate`.",
      "Terjadi **deadlock** saat dua thread saling menunggu gembok milik lawannya. Selalu ambil kunci dengan urutan yang seragam dan lepas secepatnya.",
      "Pakai `Parallel.ForEachAsync` atau `Task.WhenAll` untuk kerja paralel, dan pilih `Channel<T>` untuk jalur produksi-konsumsi dengan batas antrean."
    ],
    practice: "Bangun rate limiter sederhana di memori (maksimal N panggilan per detik per key) yang aman diuji memakai `Parallel.For`. Bandingkan hasilnya melawan `Dictionary` biasa lewat tes multi-thread berulang dan amati kenapa versi polosnya kadang lolos lalu kadang meleset.",
    teach: "Jelaskan langkah demi langkah kenapa `count++` pada satu variabel bersama menghasilkan angka akhir yang salah saat dikerjakan banyak thread.",
    analogy: "Dua kasir menulis nota di satu papan hitung bersama. Keduanya sama-sama melihat angka '41', menambah 1 di kepala, lalu menulis '42', membuat satu transaksi hilang. Lock bertugas memaksa hanya pemegang spidol yang boleh mencatat.",
    pitfalls: [
      "Percaya alasan 'di laptopku jalan lancar'. Race bug bergantung pada jumlah core dan timing, jadi satu kali tes hijau tidak menjamin apa-apa.",
      "Menganggap field `List` di dalam service singleton ASP.NET Core itu aman. Semua request pengguna masuk menyentuh list yang sama.",
      "Mencoba menulis `await` di dalam blok `lock` (ditolak compiler), atau memasang gembok pada `this` dan `string` yang bisa ikut dikunci kode lain."
    ],
    quiz: [
      ["Mengapa operasi `count++` tidak aman bila diakses beberapa thread sekaligus?", ["Operator `++` lambat di memori bersama", "Aslinya terdiri dari tiga langkah (baca, tambah, tulis) yang bisa saling menyalip", "`int` itu reference type", "JIT menunda penambahan ke akhir method"], "Dua thread bisa membaca angka lama yang sama lalu menulis hasil penjumlahan yang sama, membuat satu hitungan hilang."],
      ["Alat pengunci mana yang mendukung penggunaan `await` di dalamnya?", ["`lock`", "`SemaphoreSlim`", "`volatile`", "`Interlocked.Increment`"], "`SemaphoreSlim.WaitAsync` kompatibel penuh dengan `await`, berbeda dengan `lock` yang melarang `await` di bloknya."],
      ["Strategi paling aman untuk menjaga thread safety di seluruh aplikasi?", ["Pasang `lock` di setiap method", "Hindari data mutable bersama sedapat mungkin", "Ganti semua koleksi jadi `ConcurrentDictionary`", "Beri penanda `volatile` di semua field"], "Data yang tidak dibagi antar thread, atau tidak bisa diubah isinya, mustahil mengalami race condition."]
    ]
  },
  internals: {
    terms: [
      ['Covariance / Contravariance (`out` / `in`)', 'Membuat `IEnumerable<Dog>` diterima saat butuh `IEnumerable<Animal>` (`out`) dan `IComparer<Animal>` bisa dipakai untuk `Dog` (`in`).'],
      ['Reflection vs Source Generators', 'Reflection memeriksa tipe saat aplikasi berjalan (lebih lambat dan menyulitkan AOT), sedangkan Source Generator membuat kode C# polos saat build.'],
      ['Expression tree (`Expression<Func<>>`)', 'Menyimpan lambda sebagai pohon struktur kode bukan IL terkompilasi agar EF Core bisa menyusun query SQL berparameter.']
    ],
    title: 'Cara kerja framework: variance, reflection, dan code generation',
    why: "Di sinilah lapisan tempat framework dibangun. Materi ini membuka tabir bagaimana DI container merangkai constructor, cara serializer membaca property, hingga trik EF Core menerjemahkan lambda menjadi SQL.",
    points: [
      "**Covariance** (`out T`) membuat `IEnumerable<Dog>` berlaku sebagai `IEnumerable<Animal>` karena data cuma keluar. **Contravariance** (`in T`) membuat `Action<Animal>` berlaku untuk `Action<Dog>` karena data cuma masuk.",
      "**Reflection** mengintip tipe object saat runtime untuk kebutuhan DI container maupun serializer. Pendekatan ini fleksibel namun lambat dan tak terlindung pengecekan compiler.",
      "**Source generator** memindahkan tugas itu ke waktu compile lewat context `System.Text.Json`, `[GeneratedRegex]`, atau `LoggerMessage` tanpa beban pencarian di runtime.",
      "Fitur trimming dan Native AOT membuang kode yang tampak tak dipakai sehingga library berbasis reflection rentan gagal, sementara kode hasil generate tetap aman.",
      "**Expression tree** memperlakukan kode sebagai struktur data. Begitulah caranya EF Core menerjemahkan `x => x.Age > 18` menjadi `WHERE Age > 18`."
    ],
    practice: "Buat DI container sederhana (`Register<TInterface, TImpl>()`, `Resolve<T>()`) berbasis reflection yang mencari constructor dan menyiapkan parameternya berulang ke dalam. Setelah jalan, jelaskan apa perbedaan rancangan container yang memakai source generator.",
    teach: "Jelaskan kenapa `IEnumerable<Dog>` boleh diperlakukan seperti `IEnumerable<Animal>`, sedangkan `List<Dog>` dilarang masuk sebagai `List<Animal>`.",
    analogy: "Mesin penjual khusus apel aman menggantikan slot 'mesin buah' karena cuma mengeluarkan apel (covariance). Keranjang buah umum bisa menggantikan 'keranjang apel' karena menerima apel (contravariance). Sebaliknya, kotak keluar-masuk harus persis agar jangan ada yang menyelipkan pisang ke kotak apel.",
    pitfalls: [
      "Mengira semua tipe generik pasti covariant. `List<T>` bersifat invariant karena membaca sekaligus menuliskan `T`.",
      "Memakai reflection di jalur sibuk terus-menerus tanpa menyimpan hasil pencariannya di cache.",
      "Memilih reflection padahal cukup diselesaikan lewat generic atau interface. Penggantian nama property jadi baru meledak pas program jalan, bukan waktu build."
    ],
    quiz: [
      ["Mengapa `List<Dog>` tidak bisa langsung dimasukkan ke variabel bertipe `List<Animal>`?", ["`List<T>` adalah class sealed", "Nanti ada yang bisa memanggil `Add(new Cat())` ke dalam list khusus anjing", "`Dog` harus berbentuk struct", "Sebenarnya bisa dengan cast otomatis"], "`List<T>` memproduksi sekaligus menerima `T`, sehingga harus invariant agar tipe data tetap aman."],
      ["Bagaimana EF Core mengubah lambda `p => p.Price > 10` menjadi perintah SQL?", ["Menjalankan lambda itu pada tiap baris data di memori", "Menerima struktur expression tree lalu menerjemahkan node-nya", "Membongkar ulang IL dari lambda tersebut", "Membaca teks source file kode aslinya"], "Parameter di `IQueryable` bertipe ekspresi terstruktur yang menggambarkan isi kodenya sebagai data."],
      ["Keuntungan utama source generator dibanding reflection?", ["Kode bisa bebas bermutasi pas aplikasi berjalan", "Pekerjaannya bergeser ke compile time: startup lebih cepat dan lolos Native AOT", "Menghilangkan kebutuhan terhadap compiler", "Mengubah tipe kode menjadi dynamic"], "Kode hasil generator berupa C# biasa yang sudah terkompilasi tanpa ongkos pencarian saat runtime."]
    ]
  }
}, { tagline: 'Bahasanya: mulai dari tipe data dan class sampai async, memori, dan performa.' });
