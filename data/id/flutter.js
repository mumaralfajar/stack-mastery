// Bahasa Indonesia — track Dart + Flutter. Contoh kode tetap memakai versi aslinya.
I18N.lessons('flutter', {
  dart: {
    title: 'Dart esensial: type, null safety, dan function',
    why: "Aplikasi Flutter ditulis dengan Dart, dan Dart memang dirancang untuk pekerjaan itu. Kalau kamu sudah paham C# atau TypeScript, sebagian besarnya akan terasa akrab — bagian yang berbeda (sound null safety, named parameter, `final` versus `const`) justru bagian yang dipakai di setiap file Flutter.",
    points: [
      "Dart itu statically typed dengan inference: `var age = 30` akan selamanya `int`. Type intinya `int`, `double`, `num`, `bool`, `String`, `List`, `Map`, `Set`.",
      "`final` hanya bisa di-assign sekali saat run time; `const` adalah konstanta compile time. Jadikan `final` sebagai default; Flutter banyak memakai widget `const` untuk melewati pekerjaan yang tidak perlu.",
      "**Sound null safety**: `String` tidak akan pernah null; `String?` mungkin null. Compiler menolak pemakaian value nullable sampai kamu menangani kasus null-nya.",
      "Operator null-aware: `a ?? b` (fallback), `a?.length` (akses kalau tidak null), `a ??= b` (assign kalau null). Hindari `a!` — ia melempar exception saat run time kalau dugaanmu salah.",
      "Function adalah value. **Named parameter** di dalam `{}` bersifat opsional kecuali ditandai `required`, dan begitulah setiap widget Flutter dikonfigurasi: `Text('Hi', maxLines: 2)`.",
      "String interpolation memakai `$name` dan `${expression}`. `/` selalu mengembalikan `double`; pakai `~/` untuk pembagian integer."
    ],
    practice: "Buka DartPad (Dart playground di program ini). Tulis `String describe(String name, {int? age, String city = 'unknown'})` yang mengembalikan sebuah kalimat, dan tangani age yang kosong tanpa memakai `!`. Panggil dengan tiga cara. Lalu ubah sebuah variabel `String` supaya menyimpan `null` dan baca pesan compiler-nya.",
    teach: "Jelaskan perbedaan `String` dan `String?`, dan kenapa Dart menolak meng-compile `nickname.length` kalau `nickname` ber-type `String?`.",
    analogy: "Type yang non-nullable itu slot parkir yang dijamin ada mobilnya. Type nullable itu slot yang mungkin kosong — dan petugasnya (compiler) tidak akan mengizinkanmu membuka pintu mobil sebelum kamu melihat dan memastikan mobilnya memang ada.",
    pitfalls: [
      "Menebar `!` untuk membungkam compiler. Masing-masing berpotensi crash; tangani kasus null-nya dengan `??`, `?.`, atau `if`.",
      "Tertukar antara `final` dan `const`: `final now = DateTime.now()` boleh, `const now = DateTime.now()` tidak — nilainya belum diketahui saat compile time.",
      "Berharap `7 / 2` menghasilkan `3` seperti di C#. Di Dart, `/` selalu menghasilkan `double`."
    ],
    quiz: [
      ["Apa type dari `x` pada `var x = 5;`?", ["`dynamic`", "`int`, disimpulkan dan terkunci", "`num`", "`Object?`"], "Dart menyimpulkan `int` dari nilai awalnya; variabel itu tidak akan pernah bisa menyimpan type lain."],
      ["Berapa hasil `name ?? 'Guest'` kalau `name` null?", ["null", "`'Guest'`", "Melempar exception", "`name`"], "`??` mengembalikan sisi kanannya kalau sisi kirinya null."],
      ["Deklarasi mana yang merupakan konstanta compile time?", ["`final a = DateTime.now();`", "`var a = 3;`", "`const a = 3;`", "`late int a;`"], "Nilai `const` harus sudah diketahui saat compile time dan dikanonikalisasi."]
    ]
  },
  dartoop: {
    title: 'Class, collection, dan immutability',
    why: "Setiap widget Flutter adalah class, dan setiap layar disusun dari list dan map berisi data. Model class yang immutable dengan value equality juga yang membuat state management — khususnya Bloc — jadi bisa diprediksi.",
    points: [
      "Sebuah class punya field `final` dan sebuah constructor. **Initializing formal** (`this.name`) dan **named parameter yang required** membuat constructor tetap pendek dan pemanggilannya mudah dibaca.",
      "Constructor `const` membuat instance bisa dibuat saat compile time. Tidak ada keyword `public`/`private`: underscore di depan (`_count`) membuat sebuah member private di library-nya.",
      "Model object sebaiknya **immutable**: semua field `final`, dan perubahan dilakukan dengan membuat salinan lewat `copyWith`.",
      "Dart membandingkan object berdasarkan identity kecuali kamu meng-override `==` dan `hashCode`. Value equality dibutuhkan untuk perbandingan state; package `equatable` atau code generation menghilangkan boilerplate-nya.",
      "Collection: `List` (berurutan), `Set` (unik), `Map` (key → value). `where`, `map`, `fold`, `any`, dan `firstWhere` itu lazy seperti LINQ — panggil `toList()` untuk mematerialisasikannya.",
      "**Collection `if` dan `for`** menyusun list secara deklaratif — `[for (final p in items) if (p.inStock) p.name]` — dan merupakan cara idiomatis untuk menyusun list widget."
    ],
    practice: "Tulis `CartItem` (product, quantity) yang immutable dengan `copyWith` dan value equality, serta sebuah function yang mengembalikan list baru dengan quantity satu item bertambah. Buktikan list aslinya tidak berubah, dan bahwa dua item yang sama bernilai `==`.",
    teach: "Jelaskan kenapa dua object `Product` dengan nilai field yang sama secara default tidak dianggap sama, dan apa yang harus kamu tulis untuk mengubahnya.",
    analogy: "Object immutable itu struk yang sudah dicetak: tidak ada yang mengeditnya, yang ada adalah menerbitkan salinan yang sudah dikoreksi. Karena struk lama tidak pernah berubah, siapa pun yang memegangnya — widget, test, log — bisa mempercayai isinya. `copyWith` adalah mesin kasir yang mencetak salinan koreksi itu.",
    pitfalls: [
      "Meng-override `==` tanpa `hashCode`. Object yang sama harus punya hash code yang sama, kalau tidak perilakunya kacau di set dan map.",
      "Me-mutate list yang merupakan bagian dari state (`items.add(x)`) alih-alih membuat list baru — apa pun yang membandingkan state lama dan baru tidak akan melihat perubahannya.",
      "Lupa bahwa `where` dan `map` itu lazy: pekerjaannya diulang di setiap iterasi kecuali kamu memanggil `toList()`."
    ],
    quiz: [
      ["Bagaimana membuat sebuah member jadi private di Dart?", ["Keyword `private`", "Awali namanya dengan underscore", "Taruh di dalam `#region`", "Tandai dengan `@hidden`"], "Privacy berlaku per library dan ditandai dengan underscore di depan nama."],
      ["Dua instance sebuah class dengan field identik dibandingkan dengan `==`. Secara default hasilnya…", ["true", "false, kecuali keduanya instance yang sama", "compile error", "true hanya kalau `const`… selain itu tidak pernah"], "Equality default adalah identity. Override `==` dan `hashCode` untuk value equality."],
      ["Apa hasil `[for (final n in [1, 2, 3]) if (n.isOdd) n * 10]`?", ["`[10, 20, 30]`", "`[10, 30]`", "`[1, 3]`", "Syntax error"], "Collection `for` dan `if` menyusun list dari elemen ganjil yang sudah ditransformasi."]
    ]
  },
  widgets: {
    title: 'Flutter: widget dan widget tree',
    why: "Di Flutter, semua yang ada di layar adalah widget, dan UI-nya adalah tree berisi widget yang dideskripsikan dalam kode. Begitu murid melihat `build` sebagai function dari data ke deskripsi layar — ide yang sama dengan komponen React — framework-nya tidak lagi terasa misterius.",
    points: [
      "**Widget** adalah deskripsi immutable dari sebagian UI. Flutter mengubah tree berisi widget menjadi pixel; kamu tidak pernah mengubah layar secara langsung.",
      "`StatelessWidget` punya field final (input-nya) dan method `build` yang mengembalikan widget lain. Ia setara dengan function component di React beserta props-nya.",
      "`runApp` memasang root widget. `MaterialApp` menyediakan theming dan navigasi; `Scaffold` menyediakan kerangka halaman: app bar, body, floating button.",
      "**Composition, bukan inheritance**: UI dibangun dengan menyusun widget kecil secara bersarang — `Padding`, `Center`, `Text`, `Icon` — bukan dengan men-subclass widget besar.",
      "Tandai widget dengan `const` sebisa mungkin. Widget `const` dibuat sekali dan Flutter bisa melewati rebuild-nya.",
      "`BuildContext` adalah lokasi sebuah widget di dalam tree. Lewat dialah kamu mencari sesuatu dari atas: `Theme.of(context)`, `MediaQuery.sizeOf(context)`, `Navigator.of(context)`."
    ],
    practice: "Jalankan `flutter create shop` lalu ganti `lib/main.dart` dengan kode ini. Tambahkan product ketiga, lalu ekstrak teks harganya menjadi widget `PriceLabel` sendiri. Pakai hot reload setelah tiap perubahan dan catat apa saja yang tetap bertahan.",
    teach: "Jelaskan apa itu widget dan apa yang dikembalikan `build`, ke orang yang sudah paham HTML atau React.",
    analogy: "Widget itu cetak biru, bukan bangunannya. Setiap kali ada yang berubah, kamu menyerahkan satu set cetak biru baru ke Flutter; Flutter membandingkannya dengan set sebelumnya dan hanya membangun ulang ruangan yang benar-benar berbeda. Cetak biru itu murah, makanya kamu bisa menggambarnya ulang terus-menerus.",
    pitfalls: [
      "Mencoba mengubah widget setelah dibuat. Widget itu immutable; yang kamu lakukan adalah mendeskripsikan tree baru.",
      "Satu method `build` raksasa. Ekstrak jadi class widget kecil — lebih jelas dan membuat Flutter me-rebuild lebih sedikit.",
      "Mengekstrak UI ke helper *method*, bukan ke widget: method tidak bisa `const` dan selalu ikut rebuild bersama parent-nya."
    ],
    quiz: [
      ["Apa yang dikembalikan method `build` milik `StatelessWidget`?", ["Pixel", "Sebuah widget (deskripsi UI)", "Object `State`", "Tidak ada"], "`build` mengembalikan widget tree lain yang mendeskripsikan bagian layar ini."],
      ["Kenapa menambahkan `const` pada pemanggilan constructor widget?", ["Membuat teks jadi tebal", "Instance-nya kanonik, jadi Flutter bisa melewati rebuild-nya", "Diwajibkan Dart", "Mematikan hot reload"], "Widget `const` yang identik adalah object yang sama, jadi framework tahu tidak ada yang berubah."],
      ["Apa itu `BuildContext`?", ["Global state aplikasi", "Pegangan ke posisi widget di dalam tree", "Layar device", "Network client"], "Lewat context, widget bisa mencari ancestor seperti theme, media query, dan navigator."]
    ]
  },
  layout: {
    title: 'Layout: row, column, dan constraint',
    why: "Hampir semua bug layout di Flutter — garis-garis overflow kuning-hitam, 'unbounded height', widget yang mengabaikan ukurannya — berasal dari satu aturan yang disalahpahami. Ajarkan aturannya, dan error-error itu mulai menjelaskan dirinya sendiri.",
    points: [
      "Satu aturannya: **constraint turun, size naik, parent menentukan posisi**. Parent memberi tahu tiap child ukuran minimum dan maksimumnya; child memilih ukuran di dalam rentang itu; parent yang menempatkannya.",
      "`Row` menata children secara horizontal, `Column` secara vertikal. `mainAxisAlignment` bekerja searah dengan arah itu, `crossAxisAlignment` melintanginya — model yang sama dengan flexbox.",
      "`Expanded` membuat child mengisi ruang yang tersisa di main axis; `Flexible` membolehkannya mengambil sampai sebanyak itu. Tanpa salah satunya, child yang terlalu lebar akan overflow.",
      "`SizedBox` memberi ukuran tetap atau jarak, `Padding` menambah ruang di dalam, `Container` menggabungkan ukuran, padding, dekorasi, dan alignment.",
      "`ListView` dan `GridView` bisa di-scroll dan mem-build secara lazy dengan `.builder`. Di dalam `Column`, keduanya butuh tinggi yang terbatas — bungkus dengan `Expanded`.",
      "Layout responsif memakai `LayoutBuilder` (ruang yang diberikan ke widget ini) atau `MediaQuery.sizeOf(context)` (seluruh layar) untuk memilih layout."
    ],
    practice: "Lepas `Expanded` yang membungkus `Column` dan beri card itu deskripsi yang sangat panjang: baca error overflow-nya. Pasang lagi. Lalu taruh `ListView` langsung di dalam `Column`, baca error 'unbounded height'-nya, dan perbaiki dengan `Expanded`.",
    teach: "Jelaskan 'constraint turun, size naik, parent menentukan posisi' memakai sebuah `Row` yang berisi `Text` yang dibungkus `Expanded`.",
    analogy: "Layout itu seperti mengepak koper bersama pelancong yang rewel. Parent bilang 'lebarmu boleh antara 0 sampai 300'. Child menjawab 'aku 120 saja'. Lalu parent yang memutuskan di bagian koper mana ia ditaruh. Child tidak pernah memilih posisinya sendiri, dan tidak pernah mendapat ruang lebih dari yang ditawarkan.",
    pitfalls: [
      "`Row` dengan `Text` panjang tanpa `Expanded` atau `Flexible` — teksnya diberi lebar tak terbatas dan overflow.",
      "Widget scrollable (`ListView`) di dalam `Column` tanpa `Expanded`: column menawarkan tinggi tak terbatas dan list-nya tidak bisa menentukan ukurannya.",
      "Mengandalkan ukuran pixel tetap di mana-mana alih-alih membiarkan widget fleksibel beradaptasi dengan layar."
    ],
    quiz: [
      ["Di dalam `Row`, property mana yang mengatur posisi children secara vertikal?", ["`mainAxisAlignment`", "`crossAxisAlignment`", "`textAlign`", "`alignment`"], "Main axis milik row itu horizontal, jadi cross axis-nya vertikal."],
      ["Apa yang dilakukan `Expanded` di dalam `Row`?", ["Membuat child bisa di-scroll", "Membuat child mengisi ruang main axis yang tersisa", "Menambah padding", "Men-center child"], "Ia memberi child constraint tight sebesar ruang yang tersisa."],
      ["Pernyataan mana yang menggambarkan layout di Flutter?", ["Child memilih posisinya sendiri", "Constraint turun, size naik, parent menentukan posisi", "Size turun, constraint naik", "Semuanya diposisikan secara absolut"], "Dalam satu pass, constraint diteruskan ke bawah dan size dilaporkan ke atas; parent yang memposisikan child."]
    ]
  },
  async: {
    title: 'Async Dart: Future, Stream, dan event loop',
    why: "Panggilan network, akses file, input user, dan Bloc sendiri semuanya asynchronous di Flutter. `Future` adalah satu nilai yang datang nanti; `Stream` adalah banyak nilai seiring waktu — dan state management dibangun di atas stream.",
    points: [
      "`Future<T>` adalah nilai yang datang belakangan. `await` menjeda function `async` tanpa mem-block UI thread, persis seperti di C# dan TypeScript.",
      "Mulai dulu pekerjaan-pekerjaan yang independen, lalu `await Future.wait([...])` supaya berjalan concurrent. Tangani kegagalan dengan `try`/`catch` dan tambahkan `.timeout(...)` pada apa pun yang menyentuh network.",
      "`Stream<T>` mengirimkan serangkaian nilai seiring waktu: tap, pesan WebSocket, perubahan state. Konsumsi dengan `await for` atau `listen`; hasilkan dengan `async*` dan `yield` atau sebuah `StreamController`.",
      "Selalu cancel `StreamSubscription` dan close `StreamController` kalau sudah selesai — subscription yang terlupa adalah memory leak.",
      "Dart menjalankan kodemu di **satu thread dengan sebuah event loop**: selesaikan kode synchronous yang sedang berjalan, habiskan **microtask queue**, lalu ambil satu **event** (timer, I/O, tap).",
      "Karena itu pekerjaan synchronous yang lama membekukan UI. Pekerjaan berat CPU tempatnya di **isolate** lain — dibahas di materi rendering."
    ],
    practice: "Tebak empat baris terakhir output-nya sebelum menjalankan ini di DartPad. Lalu tulis `Stream<String>` yang baru meng-emit query pencarian setelah user berhenti mengetik selama 300 ms (debounce), memakai `StreamController` dan `Timer`.",
    teach: "Jelaskan perbedaan `Future` dan `Stream`, masing-masing dengan satu contoh nyata dari aplikasi mobile.",
    analogy: "`Future` itu kiriman paket: satu kardus, datang sekali, mungkin malah berupa pemberitahuan gagal kirim. `Stream` itu langganan majalah: edisinya terus berdatangan sampai ada yang berhenti berlangganan — dan kalau kamu pindah rumah tanpa berhenti berlangganan, majalahnya menumpuk di depan pintu selamanya.",
    pitfalls: [
      "Lupa menulis `await`: function-nya langsung lanjut dan error-nya hilang.",
      "Meng-await panggilan independen satu per satu padahal `Future.wait` bisa membuatnya tumpang-tindih.",
      "Me-listen sebuah stream dan tidak pernah meng-cancel subscription-nya saat widget di-dispose."
    ],
    quiz: [
      ["`Future` selesai ___; `Stream` bisa meng-emit ___.", ["berkali-kali; sekali", "sekali; banyak nilai seiring waktu", "tidak pernah; sekali", "sekali; persis dua kali"], "Future adalah satu hasil asynchronous; stream adalah serangkaian hasil."],
      ["Dengan urutan apa callback `scheduleMicrotask` dan `Timer.run` dieksekusi setelah kode synchronous yang sedang berjalan?", ["Timer dulu", "Microtask dulu", "Yang dijadwalkan lebih dulu", "Paralel"], "Microtask queue dihabiskan seluruhnya sebelum event berikutnya diambil."],
      ["Ada dua panggilan independen, masing-masing 300 ms. Pendekatan benar yang paling cepat?", ["`await` satu per satu", "`await Future.wait([a(), b()])`", "Panggil tanpa `await`", "Pakai `sleep`"], "Kedua future sudah dimulai sebelum di-await, jadi waktu tunggunya tumpang-tindih."]
    ]
  },
  state: {
    title: 'State: StatefulWidget, setState, dan lifecycle',
    why: "State adalah hal yang berubah selama aplikasi berjalan. `setState` adalah tool paling sederhana sekaligus fondasi semua library state management — kamu tidak akan paham rebuild pada Bloc tanpa memahami ini.",
    points: [
      "`StatefulWidget` tetap immutable; data yang mutable tinggal di **object `State`** terpisah yang bertahan melewati rebuild.",
      "`setState(() { ... })` mengubah data dan menandai widget-nya dirty; Flutter memanggil `build` lagi untuk widget itu **beserta seluruh subtree-nya**.",
      "Lifecycle: `initState` (sekali, untuk setup), `didUpdateWidget` (parent mengirim input baru), `dispose` (sekali, bereskan controller, timer, dan subscription).",
      "**Lifting state up**: ketika dua widget butuh data yang sama, common parent yang memilikinya, mengirim nilainya ke bawah, dan menerima perubahan lewat callback (`ValueChanged<T>`).",
      "Taruh state serendah mungkin di tree supaya sebuah perubahan me-rebuild sesedikit mungkin. Ekstrak bagian yang berubah menjadi widget kecil sendiri.",
      "Sebuah **`Key`** memberi tahu Flutter State mana milik widget mana ketika sibling diurutkan ulang atau dihapus. List berisi item stateful butuh `ValueKey`."
    ],
    practice: "Bangun layar dengan dua widget `Quantity` dan sebuah total. Tentukan di mana kedua nilainya harus tinggal, lalu sambungkan. Setelah itu ubah `_count++` supaya jalan di luar `setState` dan jelaskan kenapa layarnya berhenti ter-update.",
    teach: "Jelaskan kenapa data yang mutable tinggal di object `State`, bukan di `StatefulWidget`-nya sendiri.",
    analogy: "Widget itu job description; State itu karyawan yang mengerjakan pekerjaannya. Manajemen terus-menerus menerbitkan ulang job description — jabatan baru, instruksi baru — tapi karyawan yang sama tetap di mejanya, lengkap dengan semua yang ia ingat. `dispose` adalah hari terakhir karyawan itu: kembalikan kuncinya.",
    pitfalls: [
      "Mengubah field tanpa memanggil `setState` — datanya berubah tapi tidak ada yang di-rebuild.",
      "Lupa `dispose` untuk controller, animation controller, dan stream subscription.",
      "Memanggil `setState` setelah widget-nya sudah tidak ada (setelah sebuah `await`). Cek `mounted` dulu."
    ],
    quiz: [
      ["Apa akibat memanggil `setState`?", ["Seluruh aplikasi restart", "`build` jalan lagi untuk widget itu beserta subtree-nya", "Hanya `Text` yang berubah yang digambar ulang secara manual", "`initState` jalan lagi"], "Element-nya ditandai dirty dan di-rebuild di frame berikutnya; lalu Flutter hanya meng-update bagian yang berbeda."],
      ["Di mana `TextEditingController` sebaiknya di-dispose?", ["Di `build`", "Di `dispose` milik State", "Tidak perlu", "Di `initState`"], "`dispose` jalan sekali saat State dibuang secara permanen — tempat untuk melepas resource."],
      ["Kenapa item list diberi `ValueKey`?", ["Untuk styling", "Supaya Flutter mencocokkan tiap State dengan item yang benar saat list diurutkan ulang", "Supaya jadi `const`", "Diwajibkan `ListView`"], "Tanpa key, state dicocokkan berdasarkan posisi dan menempel ke item yang salah setelah urutannya berubah."]
    ]
  },
  navforms: {
    title: 'Navigasi dan form',
    why: "Aplikasi sungguhan terdiri dari beberapa layar, dan sebagian di antaranya menerima input data. Routing deklaratif memberimu deep link dan tombol back yang berfungsi; form yang tervalidasi adalah awal dari kualitas data.",
    points: [
      "Flutter menyimpan layar dalam sebuah **stack**: `push` menaruh layar baru di atas, `pop` membuangnya. API dasarnya `Navigator.of(context).push(MaterialPageRoute(...))`.",
      "Untuk aplikasi yang lebih dari beberapa layar, pakai router deklaratif — **go_router** memetakan path mirip URL ke layar, menangani path parameter, deep link, redirect, dan history browser di web.",
      "`context.go('/products/42')` mengganti stack supaya sesuai dengan lokasinya; `context.push(...)` menambah di atasnya; `context.pop(result)` mengembalikan sebuah nilai ke pemanggilnya.",
      "Sebuah `Form` dengan `GlobalKey<FormState>` mengelompokkan beberapa `TextFormField`. `validate()` menjalankan `validator` tiap field — mengembalikan string berarti menampilkan error, mengembalikan null berarti valid.",
      "`save()` menjalankan tiap `onSaved`. Pilih `keyboardType`, `textInputAction`, dan `autofillHints` supaya keyboard yang muncul tepat.",
      "Validasi di client itu demi kenyamanan user. API harus memvalidasi lagi — jangan pernah percaya pada aplikasinya."
    ],
    practice: "Tambahkan route edit `/products/:id/edit` yang memakai ulang form-nya dengan nilai awal, dan kembalikan product yang tersimpan ke layar sebelumnya dengan `context.pop(product)`. Jalankan aplikasinya di target web dan pastikan tombol back browser serta URL yang di-paste sama-sama berfungsi.",
    teach: "Jelaskan navigation stack: apa yang dilakukan `push`, `pop`, dan `go` masing-masing terhadap stack itu?",
    analogy: "Navigasi itu setumpuk kartu di atas meja. `push` menaruh kartu baru di atas, `pop` mengambil kartu teratas sehingga kartu di bawahnya terlihat. `go` itu membersihkan meja lalu membagikan persis kartu-kartu yang digambarkan sebuah alamat — makanya link yang di-paste bisa membuka layar yang benar, lengkap dengan layar-layar yang benar di bawahnya.",
    pitfalls: [
      "Mengoper object utuh antar-route sehingga deep link rusak: kirim id di path lalu load datanya.",
      "Memakai `context` setelah sebuah `await` tanpa mengecek `mounted` — layarnya bisa saja sudah tidak ada.",
      "Hanya memvalidasi di device. Server harus menegakkan aturan yang sama."
    ],
    quiz: [
      ["Apa yang dikembalikan `validator` kalau input-nya valid?", ["`true`", "String kosong", "`null`", "Nilainya"], "String yang tidak null ditampilkan sebagai error; null berarti field-nya lolos."],
      ["Apa bedanya `context.go` dan `context.push` di go_router?", ["Tidak ada", "`go` mengganti stack supaya sesuai lokasi; `push` menambah satu layar di atasnya", "`push` khusus web", "`go` tidak bisa menerima parameter"], "`go` adalah navigasi deklaratif ke sebuah lokasi; `push` adalah penumpukan secara imperatif."],
      ["Kenapa path parameter seperti `/products/42` lebih baik daripada mengoper object `Product`?", ["Lebih cepat", "Lokasinya bisa dipulihkan dari sebuah link atau setelah restart", "Object tidak bisa dioper", "Menghindari rebuild"], "URL bisa di-serialize; object di memory hilang saat aplikasi dibuka dari sebuah link."]
    ]
  },
  network: {
    title: 'Networking: HTTP, JSON, dan API ASP.NET Core-mu',
    why: "Di sinilah aplikasi mobile bertemu dengan bagian stack lainnya: layar Flutter memanggil endpoint ASP.NET Core yang sama dengan aplikasi React. Model ber-type, state loading dan error yang jujur, serta client yang bisa di-inject adalah yang membuatnya bisa dites.",
    points: [
      "Pakai package `http` (atau `dio`) dengan `http.Client` yang kamu **inject** — jangan pernah global — supaya test bisa menggantinya dengan fake.",
      "JSON datang sebagai `Map<String, dynamic>`. Ubah di boundary menjadi model ber-type lewat factory `fromJson`; untuk model yang banyak, generate kodenya dengan `json_serializable`.",
      "Angka di JSON bisa berupa `int` atau `double`: baca sebagai `num` lalu konversi. Type di Dart, seperti type di TypeScript, tidak memvalidasi data saat run time.",
      "Cek `statusCode`, lempar exception ber-type untuk kegagalan, dan selalu pasang timeout. Petakan body ProblemDetails dari ASP.NET Core menjadi pesan yang ditampilkan ke user.",
      "Sebuah layar punya minimal empat state: **loading, data, kosong, error**. `FutureBuilder` menangani kasus sederhananya; buat future-nya sekali saja, bukan di dalam `build`.",
      "Jauhkan networking dari widget: widget → repository → API client. Kirim token auth lewat header dari satu tempat, dan simpan token dengan `flutter_secure_storage`, bukan preferences biasa."
    ],
    practice: "Arahkan ini ke API products ASP.NET Core-mu (di Android emulator, alamat mesin host adalah `10.0.2.2`). Tambahkan `create(Product)` dengan POST dan tampilkan error validasi dari response ProblemDetails di samping field form-nya. Matikan API-nya dan pastikan state error muncul.",
    teach: "Jelaskan kenapa `http.Client` dikirim ke dalam `ProductApi`, bukan dibuat di dalamnya.",
    analogy: "`fromJson` itu meja bea cukai di perbatasan: kargo yang deskripsinya longgar (`Map<String, dynamic>`) datang, diperiksa dan diberi label ulang sekali, lalu sejak itu beredar di dalam negeri sebagai `Product` yang dokumennya lengkap. Tanpa meja itu, setiap bagian aplikasi harus membuka petinya dan menebak-nebak.",
    pitfalls: [
      "Membuat future di dalam `build`, yang mengirim request baru di setiap rebuild.",
      "Meng-cast angka JSON langsung ke `double` — nilai seperti `25` datang sebagai `int` dan cast-nya melempar exception.",
      "Menampilkan spinner selamanya karena error dan timeout tidak pernah ditangani."
    ],
    quiz: [
      ["Kenapa `http.Client` di-inject ke class API?", ["Lebih cepat", "Test bisa mengirim fake client sehingga tidak butuh network sungguhan", "Diwajibkan Dart", "Mengaktifkan HTTPS"], "Dependency yang dikirim dari luar bisa diganti — dasar dari kode yang bisa dites."],
      ["JSON berisi `\"price\": 25`. Cara paling aman membacanya sebagai double?", ["`json['price'] as double`", "`(json['price'] as num).toDouble()`", "`double(json['price'])`", "`json.price`"], "`25` di-decode sebagai `int`; `num` menerima keduanya dan `toDouble` mengonversinya."],
      ["Di mana `Future` yang dipakai `FutureBuilder` sebaiknya dibuat?", ["Di dalam `build`", "Sekali, di State (sebagai field atau di `initState`)", "Di `dispose`", "Di `main`"], "`build` bisa jalan berkali-kali; membuat future di sana mengulang request-nya setiap kali."]
    ]
  },
  bloc: {
    title: 'State management dengan Bloc dan Cubit',
    why: "`setState` berhenti bisa diandalkan begitu beberapa layar berbagi data atau logic-nya perlu dites tanpa UI. Bloc adalah jawaban yang paling banyak dipakai tim Flutter profesional: perubahan state jadi eksplisit, bisa dilacak, dan bisa di-unit test — dan interviewer berharap kamu bisa membandingkannya dengan alternatif lain.",
    points: [
      "Idenya: UI mengirim **intent masuk**, menerima **state immutable keluar** lewat sebuah stream. Business logic tinggal di luar widget dan tidak punya `BuildContext`.",
      "**Cubit** menyediakan method yang memanggil `emit(newState)` — bentuk paling sederhana, cocok untuk kebanyakan fitur. **Bloc** menerima **event** dan memetakannya ke state lewat handler `on<Event>`: lebih banyak seremoni, tapi setiap perubahan adalah event bernama yang bisa di-log, dan event bisa ditransformasi (debounce, drop, restart).",
      "Modelkan state sebagai **sealed class** (loading / loaded / failed) atau satu class dengan `copyWith`. State harus immutable dengan value equality: meng-emit state yang sama tidak berefek apa-apa, dan me-mutate list di tempat berarti tidak ada rebuild.",
      "`BlocProvider` membuat dan men-dispose sebuah bloc lalu menyediakannya untuk subtree. `BlocBuilder` me-rebuild UI, `BlocListener` menjalankan efek sekali jalan (snackbar, navigasi), `BlocSelector` dan `buildWhen` mempersempit rebuild.",
      "`context.read<T>()` mengambil bloc untuk dipanggil (di callback); `context.watch<T>()` sekaligus berlangganan (di `build`). Bloc bergantung pada **repository**, yang di-inject lewat constructor.",
      "Sebagai perbandingan: **Provider** adalah dependency injection biasa plus `ChangeNotifier` — kodenya sedikit, tapi mutable dan implisit. **Riverpod** adalah provider yang compile-safe tanpa `BuildContext` dengan dependency yang halus — boilerplate lebih sedikit, mental model berbeda. **Bloc** memakan kode lebih banyak dan membeli prediktabilitas, tooling, dan konsistensi di seluruh tim."
    ],
    practice: "Bangun ulang daftar produkmu dengan `ProductsCubit` yang memakai class API dari materi networking. Tambahkan search box yang event-nya di-debounce dengan event transformer di sebuah `SearchBloc`. Tampilkan snackbar saat gagal dengan `BlocListener`, lalu catat widget mana saja yang rebuild saat satu item ditambahkan ke cart.",
    teach: "Jelaskan perbedaan Cubit dan Bloc, dan kapan seremoni tambahan berupa event itu sepadan.",
    analogy: "Cubit itu vending machine: kamu menekan tombol berlabel dan hasilnya keluar. Bloc itu restoran dengan tiket pesanan tertulis: setiap permintaan dicatat di tiket sebelum dapur bertindak, jadi kamu bisa membaca ulang persis apa yang diminta dan dengan urutan apa, menahan tiket, atau membatalkan tiket yang sudah digantikan tiket yang lebih baru. Administrasinya lebih banyak; jejak auditnya lengkap.",
    pitfalls: [
      "Me-mutate state lalu meng-emit object yang sama (`state.add(x); emit(state)`) — dianggap sama dengan state sebelumnya, jadi tidak ada yang rebuild.",
      "Memakai `context.watch` di dalam callback atau `context.read` di `build` untuk menggerakkan UI: yang pertama berlangganan tanpa guna, yang kedua tidak pernah ter-update.",
      "Menaruh navigasi dan snackbar di `BlocBuilder`. Builder bisa jalan berkali-kali; efek sekali jalan tempatnya di `BlocListener`."
    ],
    quiz: [
      ["Apa perbedaan Cubit dan Bloc?", ["Cubit tidak bisa meng-emit state", "Cubit menyediakan method; Bloc menerima event lalu memetakannya ke state", "Bloc khusus web", "Tidak ada"], "Keduanya meng-emit state; Bloc menambahkan lapisan event yang membuat setiap perubahan bisa dilacak dan ditransformasi."],
      ["Sebuah cubit menjalankan `state.items.add(x); emit(state);`. Kenapa UI-nya tidak ter-update?", ["`emit` itu async", "State yang di-emit adalah object yang sama dengan sebelumnya, jadi dianggap tidak berubah", "List tidak bisa jadi state", "Cubit-nya sudah closed"], "Bloc melewati state yang sama dengan state saat ini; jangan mutate apa pun dan emit object baru."],
      ["Di mana snackbar sebaiknya ditampilkan sebagai respons atas perubahan state?", ["`BlocBuilder`", "`BlocListener`", "`initState`", "Di dalam cubit"], "Listener jalan sekali per perubahan state dan memang dirancang untuk side effect."]
    ]
  },
  dartdeep: {
    title: 'Dart lebih dalam: generics, mixin, record, dan pattern',
    why: "Dart modern punya sealed class, pattern matching, record, dan extension — fitur yang membuat pemodelan state jadi exhaustive dan penanganan JSON jadi aman. Fitur-fitur ini juga pembeda antara kode yang ditulis orang yang paham Dart dan kode yang diterjemahkan dari bahasa lain.",
    points: [
      "**Generics** membuat kode reusable dan tetap ber-type: `T largest<T extends Comparable<T>>(List<T> items)`. Bound (`extends`) menyatakan apa yang boleh diandalkan oleh isi function-nya.",
      "**Extension method** menambah member ke type yang bukan milikmu — `'flutter'.capitalized` — di-resolve secara statis, tanpa biaya saat runtime.",
      "**Mixin** (`with`) membagi behavior ke class-class yang tidak berhubungan tanpa inheritance. Flutter memakainya terus-menerus: `SingleTickerProviderStateMixin`, `ChangeNotifier`.",
      "**Sealed class** punya kumpulan subtype yang tertutup, jadi `switch` atasnya dicek **exhaustiveness**-nya — tambahkan satu state dan setiap `switch` yang belum menanganinya gagal di-compile.",
      "**Pattern** melakukan destructuring dan pengecekan dalam satu langkah: `Success(:final value)`, guard dengan `when`, list pattern dan map pattern, serta `if (json case {...})` untuk memvalidasi JSON hasil decode.",
      "**Record** `(double, double)` atau `({int x, int y})` adalah tuple ber-type yang immutable dengan value equality — ideal untuk mengembalikan beberapa nilai tanpa membuat class."
    ],
    practice: "Modelkan state sebuah request sebagai sealed class dengan `Idle`, `Loading`, `Loaded<T>`, dan `Failed`, lalu tulis ekspresi `switch` yang menangani keempatnya. Tambahkan subtype kelima dan lihat compiler menemukan setiap `switch` yang harus kamu perbarui. Setelah itu parse sebuah map JSON bersarang dengan satu pattern `case`.",
    teach: "Jelaskan bagaimana sealed class membuat sebuah `switch` jadi exhaustive, dan apa yang terjadi saat compile time ketika kamu menambah subtype baru.",
    analogy: "Sealed class itu menu dengan daftar hidangan yang sudah tercetak tetap. Karena dapur tahu daftarnya lengkap, dapur bisa memastikan ada resep untuk setiap hidangan — dan kalau pemilik menambah hidangan, resep yang belum ada ketahuan sebelum restoran buka, bukan saat ada pelanggan yang memesannya.",
    pitfalls: [
      "Menambahkan cabang `default` / wildcard `_` di `switch` atas sealed class — justru membungkam error exhaustiveness yang kamu inginkan.",
      "Memakai record untuk konsep domain yang layak diberi nama. Record itu untuk pengelompokan kecil yang sifatnya lokal.",
      "Mengira extension method itu dinamis: ia dipilih berdasarkan static type, jadi tidak berlaku untuk value ber-type `dynamic`."
    ],
    quiz: [
      ["Apa yang dimungkinkan dengan menandai sebuah class `sealed`?", ["Instansiasi lebih cepat", "`switch` yang exhaustive atas subtype langsungnya", "Field private", "Multiple inheritance"], "Semua subtype langsung harus ada di library yang sama, jadi compiler tahu kumpulan lengkapnya."],
      ["Apa itu `(int, String)` di Dart?", ["Function type", "Record type: pasangan immutable dengan value equality", "Sebuah list", "Syntax error"], "Record adalah agregat anonim, immutable, dan structurally typed."],
      ["Pada `Success(:final value) => ...`, apa fungsi `:final value`?", ["Mendeklarasikan konstanta", "Mencocokkan getter `value` dan mengikatnya ke variabel baru bernama `value`", "Memanggil constructor", "Mengecek null"], "Itu singkatan dari `value: final value` di dalam object pattern."]
    ]
  },
  testing: {
    title: 'Testing: unit, widget, dan integration test',
    why: "Tooling test Flutter luar biasa bagus: widget test menjalankan widget tree sungguhan dalam hitungan milidetik tanpa device. Bloc dengan repository yang di-inject membuat business logic sangat mudah dites — dan itulah hasil nyata dari arsitekturnya.",
    points: [
      "**Unit test** (`test`) mengecek Dart biasa: model, repository, cubit. Cepat dan jumlahnya banyak.",
      "**Widget test** (`testWidgets`) memasang sebuah widget ke environment test, mencari element, melakukan tap, dan assert pada apa yang ditampilkan — tanpa emulator.",
      "`pumpWidget` mem-build, `pump()` memajukan satu frame, `pumpAndSettle()` jalan terus sampai animasi selesai. Lupa melakukan pump setelah sebuah aksi adalah kesalahan klasik.",
      "Cari element seperti cara user mencarinya: `find.text`, `find.byTooltip`, `find.bySemanticsLabel`, atau sebuah `Key` kalau tidak ada yang lebih baik.",
      "Tes bloc lewat **stream state**-nya: `expectLater(cubit.stream, emitsInOrder([...]))`, atau dengan package `bloc_test`. Ganti repository dengan fake tulisan tangan atau `mocktail`.",
      "**Integration test** (`integration_test`) menjalankan seluruh aplikasi di device atau emulator — sedikit, lambat, untuk alur yang kritis. Golden test membandingkan pixel hasil render dengan gambar referensi."
    ],
    practice: "Simpan ini sebagai `test/counter_test.dart` dan jalankan `flutter test`. Lalu tes `ProductsCubit` milikmu dengan fake repository untuk tiga kasus — sukses, kosong, dan gagal — dan tulis satu widget test yang menampilkan state error lalu menekan retry.",
    teach: "Jelaskan apa yang dilakukan `pump` di widget test dan kenapa test gagal kalau kamu lupa memanggilnya setelah sebuah tap.",
    analogy: "Widget test itu gladi resik panggung dengan remote untuk mengatur waktu. Tidak ada yang bergerak kecuali kamu menekan 'frame berikutnya' (`pump`). Tekan sebuah tombol, dan para aktor tetap membeku di posisi lamanya sampai kamu memajukan jam — justru karena itulah setiap momen bisa kamu periksa dengan presisi.",
    pitfalls: [
      "Langsung assert setelah `tap` tanpa `pump` — rebuild-nya belum terjadi.",
      "`pumpAndSettle` dengan animasi tanpa akhir (spinner): ia tidak pernah settle dan test-nya timeout.",
      "Mencari widget berdasarkan type atau struktur yang dalam, sehingga test rusak di setiap refactor. Carilah berdasarkan apa yang dilihat user."
    ],
    quiz: [
      ["Apa yang dilakukan `await tester.pump()`?", ["Menjalankan aplikasi", "Memajukan jam test satu frame supaya rebuild yang tertunda terjadi", "Mengambil screenshot", "Menunggu network"], "Waktu di test itu manual; sebuah frame hanya diproses kalau kamu melakukan pump."],
      ["Bagaimana mengetes apa yang di-emit sebuah cubit?", ["Membaca field private", "Assert pada `stream` state-nya, misalnya dengan `emitsInOrder`", "Hanya lewat widget test", "Tidak bisa dites"], "Output publik sebuah cubit adalah stream state-nya, yang bisa di-assert secara langsung."],
      ["Jenis test mana yang butuh device atau emulator?", ["Unit test", "Widget test", "Integration test", "Golden test"], "Integration test menjalankan aplikasi sungguhan; unit test dan widget test jalan di environment test Dart VM."]
    ]
  },
  platform: {
    title: 'Persistence, platform channel, dan UI adaptif',
    why: "Aplikasi sungguhan mengingat hal-hal di antara peluncuran, berbicara dengan fitur device yang tidak dicakup Flutter, dan tampil benar di HP, tablet, maupun browser. Inilah jarak antara demo dan sesuatu yang bisa kamu rilis ke store.",
    points: [
      "Storage sesuai tujuannya: `shared_preferences` untuk setting kecil, `flutter_secure_storage` (Keychain / Keystore) untuk token, database lokal (`sqflite`, `drift`) untuk data offline yang terstruktur.",
      "Bungkus storage dalam class milikmu sendiri supaya bagian aplikasi lainnya bergantung pada interface *milikmu*, bukan pada sebuah plugin.",
      "**Platform channel** mengirim pesan antara Dart dan Kotlin/Swift native. `MethodChannel.invokeMethod` itu asynchronous dan bisa gagal — tangkap `PlatformException` dan `MissingPluginException`. Cari dulu plugin yang sudah ada di pub.dev sebelum menulis sendiri.",
      "**Layout adaptif**: putuskan berdasarkan lebar yang tersedia, bukan jenis device — `NavigationBar` di bawah untuk layar sempit, `NavigationRail` untuk layar lebar. `SafeArea` menghindari notch dan system bar.",
      "Hormati platformnya: `defaultTargetPlatform` dan `kIsWeb` untuk perbedaan perilaku, text scaling dan dark mode dari `MediaQuery` dan `ThemeData`.",
      "Aplikasi dijeda dan dilanjutkan oleh OS. Pakai `AppLifecycleListener` untuk menyimpan pekerjaan, menjeda stream, dan menyegarkan data basi saat resume. Minta permission hanya pada saat memang dibutuhkan."
    ],
    practice: "Simpan setting dark mode dan isi cart supaya tetap ada di antara peluncuran aplikasi. Buat navigasi aplikasinya berpindah antara bottom bar dan rail di 600 px, lalu tes dengan mengubah ukuran build web-nya. Setelah itu cari plugin di pub.dev untuk satu fitur device (kamera, lokasi) dan baca bagaimana ia mendeklarasikan permission di tiap platform.",
    teach: "Jelaskan apa itu platform channel dan kenapa memanggilnya bersifat asynchronous dan bisa gagal.",
    analogy: "Platform channel itu penerjemah di antara dua kantor yang bahasanya berbeda. Kamu menyerahkan permintaan tertulis yang singkat ('level baterai?'), penerjemah membawanya ke kantor sebelah, dan sesaat kemudian jawabannya kembali — atau secarik catatan bahwa tidak ada orang di kantor itu yang menangani permintaan semacam itu. Kamu tidak pernah masuk sendiri ke kantor sebelah.",
    pitfalls: [
      "Menyimpan access token di `shared_preferences`, yang berupa teks polos di disk. Pakai secure storage.",
      "Memilih layout berdasarkan `Platform.isAndroid`, bukan lebar yang tersedia — tablet, HP lipat, dan window yang bisa diubah ukurannya jadi rusak.",
      "Meminta semua permission di peluncuran pertama. Mintalah sesuai konteks, dan tangani penolakannya."
    ],
    quiz: [
      ["Di mana token auth sebaiknya disimpan di device?", ["`shared_preferences`", "Secure storage yang didukung Keychain / Keystore", "Variabel global", "File teks di folder documents"], "Preferences tidak terenkripsi; keystore milik platform memang dirancang untuk rahasia."],
      ["Apa yang seharusnya menentukan pilihan antara bottom navigation bar dan navigation rail?", ["Sistem operasinya", "Lebar yang tersedia", "Versi Flutter", "Merek device"], "Layout harus merespons ruang; device yang sama bisa sempit atau lebar."],
      ["Apa yang dikembalikan pemanggilan `MethodChannel`?", ["Sebuah nilai, secara synchronous", "`Future` yang bisa selesai dengan error", "Selalu `Stream`", "Tidak ada"], "Pesan menyeberang ke kode native secara asynchronous, dan sisi native bisa gagal atau tidak ada."]
    ]
  },
  render: {
    title: 'Internal rendering, performance, dan isolate',
    why: "Mulus berarti satu frame setiap 16 ms — atau 8 ms di layar 120 Hz. Seorang expert tahu apa yang terjadi di dalam sebuah frame, bisa membaca DevTools, dan tahu masalahnya ada di tree yang mana dari ketiganya.",
    points: [
      "Flutter menyimpan **tiga tree**: **widget** (konfigurasi immutable, bebas di-rebuild), **element** (instance berumur panjang yang memegang State dan mencocokkan widget lama dengan yang baru), dan **render object** (layout dan paint).",
      "Saat rebuild, element membandingkan widget baru dengan yang lama: `runtimeType` dan `key` yang sama berarti **update di tempat**, kalau tidak subtree-nya dibuang dan State-nya hilang. Itulah kenapa key dan `const` penting.",
      "Satu frame menjalankan **build → layout → paint → composite** di UI thread, lalu raster thread yang menggambar. Jank adalah frame yang melewatkan deadline-nya di salah satu thread itu.",
      "Kurangi rebuild: constructor `const`, state dipindah ke bawah, `BlocSelector` / `buildWhen`, dan `ListView.builder` supaya hanya item yang terlihat yang di-build. `RepaintBoundary` mengisolasi area yang sering di-repaint.",
      "Isolate di Dart punya **memory terpisah** dan berkomunikasi lewat pesan. `Isolate.run` (atau `compute`) memindahkan pekerjaan berat CPU — parsing JSON besar, pemrosesan gambar — keluar dari UI isolate supaya animasi tetap berjalan.",
      "Ukur di **profile mode** di device sungguhan, jangan pernah di debug. Pakai DevTools: performance overlay, frame chart, 'Track widget rebuilds', dan memory view."
    ],
    practice: "Jalankan checksum-nya di UI isolate dulu (panggil `slowChecksum` langsung) sementara sebuah spinner sedang beranimasi, dan lihat layarnya membeku; lalu pindahkan ke `Isolate.run`. Buka DevTools di profile mode, aktifkan 'Track widget rebuilds', scroll sebuah list panjang, dan buang satu rebuild yang tidak perlu.",
    teach: "Jelaskan widget tree, element tree, dan render object tree: untuk apa masing-masing, dan mana yang memegang State.",
    analogy: "Widget itu gambar kerja arsitek, digambar ulang setiap kali ada yang berubah. Element itu manajer lapangan yang tetap berada di lokasi, membandingkan setiap gambar baru dengan yang terakhir, lalu memutuskan apa yang benar-benar harus diubah. Render object itu dinding sungguhannya: mahal, jadi hanya disentuh kalau manajer bilang gambarnya memang berbeda.",
    pitfalls: [
      "Menilai performance di debug mode, yang berkali-kali lipat lebih lambat daripada profile atau release.",
      "Melakukan parsing berat atau pengolahan gambar di `build` atau di UI isolate, lalu menambahkan `const` di mana-mana untuk mengimbanginya.",
      "Membungkus semuanya dengan `RepaintBoundary` — masing-masing memakan satu layer dan memory. Tambahkan hanya di tempat yang biaya repaint-nya terlihat di profiler."
    ],
    quiz: [
      ["Tree mana yang memegang State milik `StatefulWidget` melewati rebuild?", ["Widget tree", "Element tree", "Render tree", "Tidak ada — State itu global"], "Element berumur panjang dan memiliki State; widget dibuang lalu dibuat ulang."],
      ["Kapan sebuah element memakai ulang State-nya untuk widget baru?", ["Selalu", "Saat widget baru punya runtime type dan key yang sama", "Tidak pernah", "Hanya untuk widget `const`"], "Type dan key yang cocok berarti update di tempat; kalau tidak, subtree lama di-unmount."],
      ["Kenapa memakai `Isolate.run` untuk parsing JSON yang besar?", ["Memakai GPU", "Ia berjalan di isolate lain, jadi UI isolate tetap bisa me-render frame", "Meng-cache hasilnya", "Mengompres datanya"], "Isolate tidak berbagi memory maupun thread; UI tetap responsif selama pekerjaannya berjalan."]
    ]
  },
  arch: {
    title: 'Arsitektur, flavor, dan rilis',
    why: "Merilis aplikasi mobile berbeda dari merilis website: bug tidak bisa diperbaiki dengan sekadar redeploy, user memakai versi lama berbulan-bulan, dan store me-review binary-mu. Struktur, configuration, dan disiplin rilis adalah yang dibawa seorang expert.",
    points: [
      "Susun aplikasi dalam layer: **presentation** (widget + bloc) → **domain** (model Dart biasa dan interface repository) → **data** (API client, database). Dependency mengarah ke dalam; domain tidak meng-import Flutter.",
      "Susun berdasarkan **fitur** (`features/cart/…`) dengan layer-layer di dalam tiap fitur. Pilih implementasi di satu tempat — composition root — dengan `RepositoryProvider` atau locator seperti `get_it`.",
      "Configuration per environment: nilai `--dart-define` atau **flavor** (dev / staging / prod) dengan app id, icon, dan URL API yang berbeda. Tidak ada secret di dalam binary — apa pun yang dirilis bisa diekstrak.",
      "Tangkap apa pun yang lolos: `FlutterError.onError` untuk error dari framework dan `PlatformDispatcher.instance.onError` untuk error async yang tidak tertangkap, dua-duanya dilaporkan ke layanan crash reporting.",
      "Rilis: build artifact release yang sudah di-sign (`flutter build appbundle`, `flutter build ipa`) di CI, jalankan test dan analisis, beri versi pada setiap build, dan rilis bertahap. Obfuscate dengan `--obfuscate --split-debug-info` dan simpan symbol-nya.",
      "Rencanakan untuk versi lama: jaga API tetap backward compatible, tambahkan pengecekan versi minimum, dan lindungi fitur yang berisiko dengan remote flag. Accessibility — semantics label, kontras, text scaling — termasuk bagian dari kata selesai."
    ],
    practice: "Susun ulang aplikasimu menjadi `features/<name>/{data,domain,presentation}`. Tambahkan configuration dev dan prod dengan URL API dan nama aplikasi yang berbeda. Siapkan job CI yang menjalankan `flutter analyze`, `flutter test`, dan sebuah release build. Lalu tulis checklist yang akan kamu ikuti untuk merilis versi 1.0.1 yang disertai perubahan schema database.",
    teach: "Jelaskan kenapa aplikasi mobile harus tetap kompatibel dengan versi lamanya sendiri, dengan cara yang tidak perlu dilakukan sebuah website.",
    analogy: "Website itu restoran: ganti menu malam ini dan semua tamu langsung melihatnya. Aplikasi mobile itu buku resep cetak yang sudah ada di ribuan dapur: kamu bisa menerbitkan edisi kedua, tapi edisi pertama masih ada di rak dan orang akan terus memasak dari situ — jadi bahan yang dijual toko (API-mu) harus tetap cocok untuk keduanya.",
    pitfalls: [
      "API key atau secret yang ikut di-compile ke dalam aplikasi. Apa pun yang ada di binary bisa dibaca; simpan secret di server.",
      "Perubahan backend yang merusak versi aplikasi yang masih terpasang di HP user.",
      "Kehilangan debug symbol dari build yang di-obfuscate, sehingga stack trace dari production tidak bisa dibaca."
    ],
    quiz: [
      ["Di aplikasi Flutter yang berlapis, apa yang boleh di-import oleh layer domain?", ["Widget Flutter", "HTTP client", "Hanya Dart biasa — tanpa Flutter, tanpa data source", "Semuanya"], "Dependency mengarah ke dalam; domain mendefinisikan model dan interface yang diimplementasikan layer luar."],
      ["Kenapa secret tidak boleh ditaruh di nilai `--dart-define` untuk release build?", ["Membuat aplikasi lambat", "Nilainya di-compile ke dalam binary dan bisa diekstrak", "Store menolaknya", "Merusak hot reload"], "Binary di sisi client itu publik; secret yang sesungguhnya tempatnya di server."],
      ["Apa yang ditangkap `PlatformDispatcher.instance.onError`?", ["Hanya layout overflow", "Error async yang tidak tertangkap di luar callback milik framework Flutter", "Compile error", "Response HTTP 500"], "`FlutterError.onError` mencakup error yang ditangkap framework; hook milik dispatcher mencakup sisanya."]
    ]
  }
}, { tagline: 'Aplikasi mobile-nya: bahasa Dart, widget, state dengan Bloc, testing, sampai rilis ke device sungguhan.' });
