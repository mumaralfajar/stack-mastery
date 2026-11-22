// Bahasa Indonesia — track Dart + Flutter. Contoh kode tetap memakai versi aslinya.
export const trackId = {
  id: 'flutter',
  tagline: 'Aplikasi mobile-nya: bahasa Dart, widget, state dengan Bloc, testing, sampai rilis ke HP sungguhan.',
  lessons: {
  dart: {
    terms: [
      ['Sound null safety (`String` vs `String?`)', 'Tipe non-nullable menjamin nilainya ada. Tipe nullable (`String?`) mewajibkanmu menangani kasus `null` (`??`, `?.`) sebelum dipakai.'],
      ['`final` vs `const`', '`final` diisi sekali saat run time, sedangkan `const` dikunci sejak compile time supaya Flutter bisa memakai ulang instance widget.'],
      ['Named parameter (`{required String id}`)', 'Argumen konfigurasi di dalam `{}` agar pemanggilan constructor widget Flutter tetap jelas dibaca.']
    ],
    title: 'Dart esensial: tipe, null safety, dan function',
    why: "Aplikasi Flutter memakai bahasa Dart. Kalau kamu sudah terbiasa dengan C# atau TypeScript, sebagian besar sintaksnya pasti terasa akrab. Hal utama yang sering kamu temui di setiap file Flutter adalah sound null safety, named parameter, dan perbedaan `final` dengan `const`.",
    points: [
      "Dart memakai tipe statis dengan inference, jadi `var age = 30` selamanya bertipe `int`. Tipe intinya meliputi `int`, `double`, `num`, `bool`, `String`, `List`, `Map`, dan `Set`.",
      "Isi `final` sekali saat run time, dan pakai `const` untuk nilai tetap sejak compile time. Biasakan pakai `final`; Flutter mengandalkan widget `const` untuk melewati rebuild yang tidak perlu.",
      "Dengan **sound null safety**, `String` tidak akan pernah null sedangkan `String?` bisa kosong. Compiler menolak pemakaian nilai nullable sampai kasus null-nya ditangani.",
      "Operator null-aware meliputi `a ?? b` (nilai cadangan), `a?.length` (akses kalau tidak null), dan `a ??= b` (isi kalau null). Hindari `a!`, karena aplikasi langsung crash saat run time bila nilainya null.",
      "Function di Dart adalah nilai. **Named parameter** di dalam `{}` bersifat opsional kecuali diberi `required`, dan cara itulah tiap widget diatur, misalnya `Text('Hi', maxLines: 2)`.",
      "String interpolation memakai `$name` dan `${expression}`. Pembagian `/` selalu menghasilkan `double`, jadi gunakan `~/` untuk pembagian bilangan bulat."
    ],
    practice: "Buka DartPad lalu tulis `String describe(String name, {int? age, String city = 'unknown'})` yang menghasilkan kalimat lengkap tanpa memakai `!` saat umur kosong. Panggil dengan tiga cara berbeda, lalu coba isi variabel `String` dengan `null` dan baca pesan error dari compiler-nya.",
    teach: "Jelaskan perbedaan `String` dan `String?`, serta mengapa Dart menolak me-compile `nickname.length` ketika `nickname` bertipe `String?`.",
    analogy: "Tipe non-nullable ibarat slot parkir yang pasti terisi mobil. Tipe nullable itu slot yang mungkin kosong, jadi compiler melarangmu membuka pintu sebelum mengecek bahwa mobilnya memang ada.",
    pitfalls: [
      "Menebar `!` hanya untuk membungkam compiler. Tiap tanda seru berisiko crash; tangani kasus null lewat `??`, `?.`, atau `if`.",
      "Tertukar antara `final` dan `const`: `final now = DateTime.now()` boleh, sedangkan `const now = DateTime.now()` gagal karena waktunya belum diketahui saat compile time.",
      "Mengira `7 / 2` hasilnya `3` seperti di C#. Di Dart, `/` selalu menghasilkan `double`."
    ],
    quiz: [
      ["Apa tipe `x` pada `var x = 5;`?", ["`dynamic`", "`int`, disimpulkan lalu dikunci", "`num`", "`Object?`"], "Dart menyimpulkan `int` dari nilai awal, dan variabel itu tidak bisa menyimpan tipe lain lagi."],
      ["Apa hasil `name ?? 'Guest'` jika `name` bernilai null?", ["null", "`'Guest'`", "Terjadi exception", "`name`"], "`??` menghasilkan sisi kanannya saat sisi kirinya null."],
      ["Deklarasi mana yang menjadi konstanta compile time?", ["`final a = DateTime.now();`", "`var a = 3;`", "`const a = 3;`", "`late int a;`"], "Nilai `const` harus diketahui saat compile time dan dikanonikalisasi."]
    ]
  },
  dartoop: {
    terms: [
      ['Constructor initializer & `required`', 'Membentuk object yang valid dalam satu baris (`const Product({required this.id, required this.name})`).'],
      ['Collection `if` / `for` & Spread (`...`)', 'Menyusun daftar widget bersyarat langsung di dalam `[ ... ]` ketimbang memanggil `.add()` satu per satu.'],
      ['Salinan immutable (`copyWith`)', 'Membuat salinan object state baru bukan mengubah field di tempat agar Bloc atau Riverpod mendeteksi perubahan.']
    ],
    title: 'Class, collection, dan immutability',
    why: "Setiap widget Flutter adalah class, dan setiap layar disusun dari list serta map data. Model class yang immutable dengan value equality membuat state management, khususnya Bloc, mudah ditebak.",
    points: [
      "Class memiliki field `final` dan constructor. Initializing formal (`this.name`) serta named parameter `required` menjaga constructor tetap ringkas dan pemanggilannya enak dibaca.",
      "Constructor `const` membuat instance bisa dibentuk saat compile time. Dart tidak memakai keyword `public` atau `private`; awalan underscore (`_count`) membuat member bersifat privat di library tersebut.",
      "Jaga model data agar **immutable** dengan menandai field `final` lalu membuat salinan baru lewat `copyWith`.",
      "Default-nya, Dart membandingkan object berdasarkan identitasnya, kecuali kamu meng-override `==` dan `hashCode`. Perbandingan state mengandalkan value equality, yang bisa diotomatiskan oleh `equatable` atau code generation.",
      "Collection intinya adalah `List` (berurutan), `Set` (unik), dan `Map` (key ke value). Seperti LINQ, `where` dan `map` menghasilkan `Iterable` lazy yang belum bekerja sebelum kamu me-loop atau memanggil `toList()`, sedangkan `fold`, `any`, dan `firstWhere` langsung berjalan.",
      "**Collection `if` dan `for`** menyusun daftar langsung di dalam list (`[for (final p in items) if (p.inStock) p.name]`), pola standar untuk menyusun daftar widget."
    ],
    practice: "Tulis class immutable `CartItem` (`product`, `quantity`) lengkap dengan `copyWith` dan value equality, ditambah function yang mengembalikan list baru setelah jumlah satu item dinaikkan. Pastikan list awal tetap utuh dan dua item bernilai sama memenuhi `==`.",
    teach: "Jelaskan kenapa dua object `Product` dengan isi field yang sama otomatis dianggap tidak sama, dan apa yang harus ditulis untuk mengubahnya.",
    analogy: "Object immutable seperti struk belanja yang sudah tercetak: tidak ada yang mengeditnya di tempat, melainkan menerbitkan struk koreksi baru. Karena struk lama tidak pernah berubah, widget, tes, atau log yang memegangnya selalu bisa mempercayai isinya, sementara `copyWith` mencetak salinan koreksi itu.",
    pitfalls: [
      "Meng-override `==` tanpa `hashCode`. Object yang sama wajib punya hash code yang sama agar set dan map tidak kacau.",
      "Mengubah isi list state langsung di tempat (`items.add(x)`) ketimbang membuat list baru, sehingga pembanding state lama dan baru tidak melihat perubahan.",
      "Lupa kalau `where` dan `map` bersifat lazy: mengulanginya dua kali menjalankan filter dua kali, jadi panggil `toList()` sekali jika dipakai ulang."
    ],
    quiz: [
      ["Bagaimana cara membuat member menjadi privat di Dart?", ["Memakai keyword `private`", "Menambah underscore di depan nama", "Menaruh di dalam `#region`", "Menandai dengan `@hidden`"], "Hak akses privat berlaku per library dan ditandai lewat awalan underscore."],
      ["Dua instance class berisi field sama dibuat dengan gaya `new` (bukan `const`), lalu dibandingkan lewat `==`. Hasil bawaannya adalah…", ["true", "false, kecuali keduanya instance yang sama", "compile error", "true jika class punya `toString`"], "Equality bawaan mengecek identitas referensi. Override `==` dan `hashCode` untuk membandingkan isi (dua ekspresi `const` yang sama mengacu ke satu instance, jadi tetap sama tanpa override)."],
      ["Apa hasil `[for (final n in [1, 2, 3]) if (n.isOdd) n * 10]`?", ["`[10, 20, 30]`", "`[10, 30]`", "`[1, 3]`", "Syntax error"], "Collection `for` dan `if` mengambil elemen ganjil saja lalu mengalikannya."]
    ]
  },
  widgets: {
    terms: [
      ['`StatelessWidget` vs `StatefulWidget`', 'Blueprint konfigurasi immutable yang ringan dibangun ulang (`build(context)`), dipasangkan dengan object `State` tahan lama saat dibutuhkan.'],
      ['`BuildContext`', 'Penunjuk letak widget di dalam tree agar bisa membaca `Theme.of(context)` atau `Navigator.of(context)`.'],
      ['Komposisi ketimbang widget raksasa', 'Memecah widget kecil bernama memberi Flutter batas rebuild yang rapi sekaligus penghematan `const`.']
    ],
    title: 'Flutter: widget dan widget tree',
    why: "Semua elemen di layar Flutter adalah widget yang tersusun dalam bentuk tree di kode. Begitu kamu melihat `build` sebagai fungsi pengubah data menjadi gambaran layar, mirip komponen React, cara kerja framework ini langsung terasa jelas.",
    points: [
      "**Widget** adalah deskripsi immutable untuk sebagian UI. Flutter mengubah tree widget menjadi pixel di layar, bukan menyuruhmu memanipulasi pixel langsung.",
      "`StatelessWidget` menyimpan input `final` dan sebuah method `build` yang mengembalikan widget anak, mirip function component beserta props di React.",
      "`runApp` memasang root widget. `MaterialApp` mengatur tema dan navigasi, sementara `Scaffold` menyediakan rangka halaman seperti app bar, body, dan tombol melayang.",
      "Flutter memakai **komposisi bukan pewarisan**, jadi kamu menyusun UI dengan menumpuk widget kecil seperti `Padding`, `Center`, `Text`, dan `Icon`, bukan menurunkan class besar.",
      "Tandai widget dengan `const` sebisa mungkin. Widget `const` dibentuk sekali sehingga Flutter bisa melewati proses rebuild-nya.",
      "`BuildContext` melacak posisi widget di dalam tree, jalur untuk membaca data dari parent seperti `Theme.of(context)`, `MediaQuery.sizeOf(context)`, atau `Navigator.of(context)`."
    ],
    practice: "Jalankan `flutter create shop` lalu ganti `lib/main.dart` memakai kode ini. Tambahkan produk ketiga, pisahkan teks harga menjadi widget `PriceLabel`, lalu pakai hot reload tiap selesai mengedit dan catat bagian mana yang tetap bertahan.",
    teach: "Jelaskan apa itu widget dan apa yang dikembalikan `build` ke orang yang sudah paham HTML atau React.",
    analogy: "Widget itu cetak biru, bukan bangunannya. Tiap kali data berubah, kamu menyerahkan cetak biru baru ke Flutter; Flutter membandingkannya dengan set lama dan cuma mengganti bagian yang berbeda. Cetak biru sangat murah digambar ulang.",
    pitfalls: [
      "Mencoba mengubah isi widget sesudah dibuat. Widget bersifat immutable, jadi kamu cukup menyusun tree baru.",
      "Membuat satu method `build` raksasa. Pecah menjadi class widget kecil agar kode lebih jelas dan cakupan rebuild mengecil.",
      "Memecah UI ke helper *method* bukan class widget: helper method tidak bisa `const` dan selalu ikut rebuild saat parent-nya berubah."
    ],
    quiz: [
      ["Apa yang dikembalikan method `build` milik `StatelessWidget`?", ["`RenderObject` yang menggambar dirinya sendiri", "Sebuah widget (deskripsi UI)", "Object `State`", "Sebuah `Element`"], "`build` mengembalikan widget tree untuk bagian layar ini, lalu Flutter membuat element serta render object-nya."],
      ["Mengapa menambahkan `const` saat memanggil constructor widget?", ["Membuat widget jadi immutable", "Instance-nya di-kanonisasi sehingga Flutter melewati rebuild-nya", "Wajib untuk widget tanpa field", "Menjaga State saat hot reload"], "Widget `const` yang sama menunjuk ke satu object, jadi Flutter tahu tidak ada yang berubah."],
      ["Apa fungsi `BuildContext`?", ["Global state aplikasi", "Penunjuk posisi widget di dalam tree", "Layar perangkat", "HTTP client"], "Melalui context, widget membaca ancestor seperti theme, media query, dan navigator."]
    ]
  },
  layout: {
    terms: [
      ['Constraints go down, sizes go up', 'Parent menurunkan batas min/maks, child memilih ukuran yang pas di rentang itu, lalu parent menentukan koordinat x/y akhir child.'],
      ['Batasan tak terhingga (`∞`)', 'Terjadi pada sumbu scrollable atau child `Row`/`Column` polos; menaruh `Expanded` atau `ListView` tak terbatas memicu error overflow.'],
      ['`Expanded` vs `Flexible`', '`Expanded` memaksa child mengisi semua ruang sumbu yang tersisa (`flex`), sedangkan `Flexible` mengizinkannya tumbuh maksimal sampai sisa ruang itu.']
    ],
    title: 'Layout: row, column, dan constraint',
    why: "Sebagian besar bug layout Flutter, mulai dari garis kuning-hitam overflow, error 'unbounded height', sampai widget yang mengabaikan ukuran, berpangkal pada satu aturan. Begitu kamu paham aturan ini, pesan error layout jadi mudah dimengerti.",
    points: [
      "Satu aturan inti mengatur layout: **constraint turun, size naik, parent menentukan posisi**. Parent mengirim ukuran min dan maks ke bawah, child memilih ukuran dalam rentang itu, lalu parent menempatkannya.",
      "`Row` menyusun anak horizontal dan `Column` vertikal. Sama seperti flexbox, `mainAxisAlignment` mengatur arah utama sedangkan `crossAxisAlignment` mengatur arah melintangnya.",
      "`Expanded` membuat child mengisi seluruh sisa ruang sumbu utama, sementara `Flexible` memperbolehkannya tumbuh paling lebar seukuran sisa ruang itu. Tanpa keduanya, child yang kepanjangan memicu overflow.",
      "Pakai `SizedBox` untuk ukuran tetap atau jarak antar-elemen, `Padding` untuk ruang di dalam, dan `Container` bila butuh ukuran, padding, dekorasi, serta perataan sekaligus.",
      "`ListView` dan `GridView` mendukung scroll dan mem-build item saat dibutuhkan lewat `.builder`. Di dalam `Column`, bungkus keduanya dengan `Expanded` supaya tingginya terbatas.",
      "Buat layout adaptif memakai `LayoutBuilder` (mengukur ruang yang diberikan ke widget ini) atau `MediaQuery.sizeOf(context)` (ukuran layar penuh)."
    ],
    practice: "Lepas `Expanded` di luar `Column`, beri kartu itu deskripsi yang sangat panjang, lalu baca error overflow-nya sebelum memasang `Expanded` lagi. Kemudian taruh `ListView` langsung di dalam `Column`, baca error 'unbounded height', dan perbaiki memakai `Expanded`.",
    teach: "Jelaskan aturan 'constraint turun, size naik, parent menentukan posisi' memakai contoh `Row` berisi `Text` di dalam `Expanded`.",
    analogy: "Layout mirip mengepak barang sesuai aturan ketat: parent bilang 'lebarmu boleh antara 0 sampai 300', child menjawab 'aku cukup 120', lalu parent menentukan di titik mana barang ditaruh. Child tidak pernah memilih posisinya sendiri atau melewati batas ruang dari parent.",
    pitfalls: [
      "Menaruh `Text` panjang langsung di `Row` tanpa `Expanded` atau `Flexible`. Teks diberi lebar tak terbatas dan langsung overflow.",
      "Menaruh widget scrollable (`ListView`) di dalam `Column` tanpa `Expanded`: tinggi yang ditawarkan tak terbatas sehingga list gagal menghitung ukurannya.",
      "Mengunci ukuran piksel tetap di mana-mana ketimbang membiarkan widget fleksibel menyesuaikan layar.",
      "Membuat `IconButton` tanpa `tooltip`: screen reader hanya membaca 'button' dan tidak ada petunjuk saat tombol ditahan atau di-hover."
    ],
    quiz: [
      ["Di dalam `Row`, properti mana yang mengatur posisi child arah vertikal?", ["`mainAxisAlignment`", "`crossAxisAlignment`", "`textAlign`", "`alignment`"], "Sumbu utama Row horizontal, sehingga `crossAxisAlignment` mengatur arah vertikalnya."],
      ["Apa peran `Expanded` di dalam `Row`?", ["Membuat child bisa di-scroll", "Membuat child mengisi seluruh sisa ruang di sumbu utama", "Menambah padding", "Menaruh child di tengah"], "Ia memberi child batas ketat sebesar sisa lebar yang tersedia."],
      ["Pernyataan mana yang tepat menggambarkan layout di Flutter?", ["Child memilih posisinya sendiri", "Constraint turun, size naik, parent menentukan posisi", "Size turun, constraint naik", "Semua elemen diposisikan absolut"], "Dalam satu pass, constraint turun ke child, size naik ke parent, lalu parent menaruh posisinya."]
    ]
  },
  async: {
    terms: [
      ['`Future<T>` & `async`/`await`', 'Mewakili satu nilai atau error asinkron yang datang nanti tanpa memacetkan UI isolate 60/120 fps Flutter.'],
      ['`Stream<T>`', 'Memancarkan nol atau banyak nilai dari waktu ke waktu (pesan WebSocket, posisi scroll, state Bloc) sampai dihentikan.'],
      ['Microtask vs Event queue', 'Event loop single-thread milik Dart selalu menguras habis antrean microtask lebih dulu sebelum mengambil event UI atau timer berikutnya.']
    ],
    title: 'Async Dart: Future, Stream, dan event loop',
    why: "Panggilan jaringan, akses file, sentuhan user, hingga Bloc semuanya berjalan asinkron di Flutter. `Future` mengirim satu nilai di masa depan, sedangkan `Stream` mengirim rangkaian nilai dari waktu ke waktu dan menjadi dasar state management.",
    points: [
      "`Future<T>` adalah nilai yang datang belakangan. Kata kunci `await` menjeda function `async` tanpa memblokir UI thread, mirip C# dan TypeScript.",
      "Mulai beberapa panggilan terpisah lebih dulu sebelum menunggunya dengan `Future.wait([...])`, atau pertahankan tipe tiap hasil lewat sintaks record `await (fetchUser(1), fetchOrders()).wait`. Tangani kegagalan dengan `try`/`catch`, dan ingat bahwa `.timeout(...)` menghentikan penantianmu tanpa membatalkan request HTTP di jaringan.",
      "`Stream<T>` mengirimkan rentetan nilai dari waktu ke waktu, misalnya ketukan, pesan WebSocket, atau pembaruan state. Baca memakai `await for` atau `listen`, dan buat memakai `async*` plus `yield` atau `StreamController`.",
      "Selalu panggil cancel pada `StreamSubscription` dan tutup `StreamController` saat selesai supaya langganan yang tertinggal tidak bocor di memori.",
      "Dart menjalankan kodemu di **satu thread dengan event loop**: selesaikan blok sinkron yang aktif, kuras **microtask queue**, baru ambil satu **event** (timer, I/O, atau sentuhan).",
      "Karena itu kerja sinkron yang lama membekukan layar. Pindahkan komputasi CPU berat ke **isolate** lain seperti yang dibahas di materi rendering."
    ],
    practice: "Tebak empat baris output terakhir sebelum menjalankan kodenya di DartPad. Lalu buat `Stream<String>` memakai `StreamController` dan `Timer` yang baru memancarkan kata kunci sesudah user berhenti mengetik selama 300 ms (debounce).",
    teach: "Jelaskan beda `Future` dan `Stream`, masing-masing dengan satu contoh nyata dari aplikasi mobile.",
    analogy: "`Future` seperti paket kurir: satu kardus datang sekali, entah berisi barang atau catatan gagal kirim. `Stream` seperti langganan koran: edisi terus berdatangan sampai kamu berhenti berlangganan, dan kalau lupa membatalkan sebelum pindah rumah, korannya menumpuk di depan pintu.",
    pitfalls: [
      "Lupa menulis `await`, sehingga function lanjut berjalan dan error asinkron ikut hilang.",
      "Menunggu panggilan terpisah satu per satu padahal `Future.wait` bisa menjalankannya berbarengan.",
      "Mendengarkan stream tapi lupa meng-cancel subscription waktu widget ditutup.",
      "Mengira `.timeout()` membatalkan proses di server. Ia hanya menghentikan penantian `await`; request-nya terus berjalan sampai selesai di latar."
    ],
    quiz: [
      ["`Future` selesai ___; `Stream` bisa mengirim ___.", ["berkali-kali; sekali", "sekali; banyak nilai dari waktu ke waktu", "sekali; satu nilai tapi lebih lambat", "sekali per listener; sekali per listener"], "Sebuah `Future` menghasilkan satu nilai, sedangkan `Stream` mengirim rangkaian nilai seiring waktu."],
      ["Dengan urutan mana callback `scheduleMicrotask` dan `Timer.run` jalan sesudah kode sinkron selesai?", ["Timer dulu", "Microtask dulu", "Mana yang didaftarkan lebih awal", "Bersamaan"], "Antrean microtask dikuras sampai habis sebelum event timer atau I/O berikutnya diambil."],
      ["Ada dua panggilan independen berdurasi masing-masing 300 ms. Cara tercepat yang benar?", ["`await` satu per satu", "`await Future.wait([a(), b()])`", "Panggil tanpa `await` dan berharap selesai", "`await` masing-masing di dalam loop `for`"], "Kedua future langsung berjalan sebelum di-await sehingga waktunya tumpang-tindih. Tanpa `await`, hasil maupun error-nya tidak terbaca."]
    ]
  },
  state: {
    terms: [
      ['Pemeriksaan `mounted`', 'Mencegah pemanggilan `setState()` sesudah widget meninggalkan layar saat `Future` baru selesai belakangan.'],
      ['`initState()` & `dispose()`', 'Setup satu kali waktu mount (controller dan listener) berpasangan dengan pembersihan (`controller.dispose()`) saat widget dicopot permanen.'],
      ['Mendorong state ke bawah', 'Menaruh state input lokal di widget daun dan menandai sibling sebagai `const` membatasi `build()` ke subtree yang berubah saja.']
    ],
    title: 'State: StatefulWidget, setState, dan lifecycle',
    why: "State adalah data yang berubah selama aplikasi berjalan. `setState` adalah mekanisme paling sederhana yang mendasari semua library state management, jadi memahami `State` membantu kamu mengerti cara kerja rebuild di Bloc.",
    points: [
      "`StatefulWidget` tetap immutable sementara data yang bisa berubah tinggal di object **`State`** terpisah yang bertahan melewati rebuild.",
      "Memanggil `setState(() { ... })` memperbarui data dan menandai widget dirty agar Flutter memanggil `build` lagi untuk widget tersebut **serta seluruh subtree-nya**.",
      "Lifecycle pentingnya meliputi `initState` (sekali di awal), `didUpdateWidget` (parent mengirim argumen baru), dan `dispose` (sekali di akhir untuk membersihkan controller, timer, serta subscription).",
      "**Naikkan state** saat dua widget berbagi data yang sama: parent bersama menyimpan nilainya, meneruskan ke bawah, dan menerima perubahan lewat callback (`ValueChanged<T>`).",
      "Simpan state serendah mungkin di tree agar perubahan tidak memicu rebuild luas, dengan memecah bagian yang berubah menjadi widget kecil sendiri.",
      "Pasang **`Key`** (`ValueKey`) kalau widget stateful dalam daftar bisa bertukar posisi atau dihapus, supaya Flutter menjaga tiap `State` menempel ke item yang benar."
    ],
    practice: "Buat layar dengan dua widget `Quantity` dan satu total. Tentukan di mana kedua hitungan itu harus tinggal lalu sambungkan, kemudian pindahkan `_count++` ke luar `setState` dan jelaskan mengapa layarnya berhenti berubah.",
    teach: "Jelaskan mengapa data yang berubah disimpan di object `State`, bukan di dalam `StatefulWidget` itu sendiri.",
    analogy: "Widget adalah uraian tugas, sedangkan `State` adalah karyawan yang mengerjakannya. Manajemen terus membagikan uraian tugas baru setiap kali ada revisi, tapi karyawan yang sama tetap duduk di mejanya bersama catatan kerjanya. Saat `dispose` berjalan, itu hari terakhir karyawan itu: saatnya mengembalikan kunci.",
    pitfalls: [
      "Mengubah field tanpa memanggil `setState`: datanya berubah di memori, tapi UI tidak ikut diperbarui.",
      "Lupa memanggil `dispose` pada controller, animation controller, dan stream subscription.",
      "Memanggil `setState` setelah widget tidak lagi tampil di layar (sesudah `await`). Cek `mounted` lebih dulu."
    ],
    quiz: [
      ["Apa efek memanggil `setState`?", ["Seluruh aplikasi restart", "`build` jalan ulang untuk widget tersebut dan subtree-nya", "Hanya `Text` yang berubah digambar ulang manual", "`initState` jalan lagi"], "Element ditandai dirty lalu di-rebuild pada frame berikutnya, dan Flutter cuma memperbarui node yang berbeda."],
      ["Di mana `TextEditingController` harus di-dispose?", ["Di `build`", "Di `dispose` milik State", "Tidak perlu", "Di `initState`"], "`dispose` berjalan sekali ketika `State` dicopot permanen, tempat ideal melepas resource."],
      ["Mengapa item daftar butuh `ValueKey`?", ["Untuk styling", "Supaya Flutter memasangkan tiap State ke item yang benar saat urutan daftar berubah", "Agar menjadi `const`", "Wajib untuk `ListView`"], "Tanpa key, state dicocokkan menurut urutan posisi sehingga tertukar bila susunan item bergeser."]
    ]
  },
  navforms: {
    splits: ['1 · Setup GoRouter', '2 · Halaman Home & Product', '3 · Form NewProductPage'],
    terms: [
      ['Routing deklaratif (`GoRouter`)', 'Memetakan path URL (`/products/:id`) ke tumpukan layar lengkap dengan deep link browser dan parameter bertipe.'],
      ['`GlobalKey<FormState>`', 'Mengumpulkan hasil pengecekan seluruh `validator` di `TextFormField` dalam satu kali panggil `.validate()`.'],
      ['Pembersihan controller', 'Setiap `TextEditingController` memasang listener yang wajib dilepas di `dispose()` agar memori tidak bocor.']
    ],
    title: 'Navigasi dan form',
    why: "Sebagian besar aplikasi terdiri dari banyak layar dan menerima input dari user. Routing deklaratif mengurus deep link serta tombol Back yang konsisten, sementara form tervalidasi menangkap input salah lebih awal.",
    points: [
      "Flutter menyusun layar berbentuk **tumpukan (stack)**: `push` meletakkan layar baru di paling atas, dan `pop` menurunkannya. API dasarnya adalah `Navigator.of(context).push(MaterialPageRoute(...))`.",
      "Kalau layar lebih dari beberapa buah, gunakan **go_router** untuk memetakan path URL ke layar, menangani parameter path, deep link, redirect, serta riwayat browser di web.",
      "`context.go('/products/42')` mengganti stack agar cocok dengan alamat itu, `context.push(...)` menumpuk layar di atasnya, dan `context.pop(result)` mengirim nilai balik ke layar pemanggil.",
      "**Struktur bersarang menentukan layar di bawahnya.** Bila `products/:id` ditulis di dalam route `/`, `go('/products/42')` menumpuk halaman produk di atas Home sehingga tombol Back tersedia. Bila ditulis terpisah sejajar di root, halaman produk tampil sendirian dan tombol Back keluar dari aplikasi.",
      "`Form` dengan `GlobalKey<FormState>` mengelompokkan beberapa `TextFormField`. Memanggil `validate()` menjalankan semua `validator`: hasil string tampil sebagai pesan error, sedangkan null berarti lolos.",
      "`save()` menjalankan tiap callback `onSaved`. Atur `keyboardType`, `textInputAction`, dan `autofillHints` agar keyboard ponsel cocok dengan isi kolomnya, memakai `TextInputType.numberWithOptions(decimal: true)` untuk harga karena `number` biasa di iOS tidak punya tombol koma/titik.",
      "Validasi di sisi aplikasi memudahkan user memperbaiki salah ketik dan aturannya harus sama dengan server (di sini minimal 0.01). Selalu validasi ulang di server API, jangan hanya percaya pada aplikasi."
    ],
    practice: "Tambahkan route edit `/products/:id/edit` yang memakai ulang form beserta nilai awalnya, lalu kirim produk yang tersimpan kembali lewat `context.pop(product)`. Uji di target web dan pastikan tombol Back browser maupun URL yang ditempel langsung sama-sama berfungsi.",
    teach: "Jelaskan cara kerja navigation stack dan apa yang dilakukan `push`, `pop`, serta `go`.",
    analogy: "Navigasi seperti tumpukan kartu di atas meja. `push` menaruh kartu baru di atas, `pop` mengangkat kartu teratas untuk memperlihatkan kartu di bawahnya. `go` merapikan meja lalu menyusun persis kartu-kartu sesuai alamat URL, makanya URL yang ditempel langsung membuka layar yang tepat beserta layar sebelumnya di bawah.",
    pitfalls: [
      "Mengirim object penuh antar-route sehingga deep link rusak. Kirim ID di path lalu muat datanya di halaman tujuan.",
      "Memakai `context` sesudah `await` tanpa mengecek `mounted`, karena user mungkin sudah menutup layar tersebut.",
      "Menulis semua route di level paling atas, membuat `go` meninggalkan layar tujuan sendirian di stack tanpa tombol Back.",
      "Memakai `double.parse` langsung pada ketikan user: `19,99` bikin crash di keyboard berkoma, jadi normalkan pemisah desimal lebih dulu.",
      "Cuma memvalidasi di perangkat atau memakai batas berbeda dari server. Terapkan aturan yang sama di backend."
    ],
    quiz: [
      ["Apa yang harus dikembalikan `validator` ketika input-nya valid?", ["`true`", "String kosong", "`null`", "Nilainya"], "String selain null ditampilkan sebagai error; null menandakan kolom lolos validasi."],
      ["Apa beda `context.go` dengan `context.push` di go_router?", ["Tidak ada", "`go` mengganti stack agar sesuai lokasi; `push` menambah satu layar di atasnya", "`push` khusus web", "`go` tidak bisa membawa parameter"], "`go` menyusun ulang stack sesuai URL tujuan, sementara `push` menambahkan satu layar di atas stack saat ini."],
      ["Mengapa memakai parameter path seperti `/products/42` lebih baik daripada mengirim object `Product`?", ["Lebih cepat", "Halaman tetap bisa dibuka ulang dari link atau sesudah aplikasi restart", "Object tidak bisa dikirim", "Menghindari rebuild"], "URL bisa disimpan sebagai teks, sedangkan object di memori hilang ketika aplikasi dibuka lewat link."],
      ["`/products/:id` ditulis sejajar dengan `/` di level teratas. Sesudah `context.go('/products/42')`, layar apa yang ada di bawah halaman produk?", ["Halaman Home", "Tidak ada: ia sendirian di stack sehingga tidak ada tombol Back", "Halaman mana pun yang tadi dibuka", "Salinan halaman produk"], "`go` membentuk stack dari hierarki route. Taruh rute di dalam `/` supaya Home berada di bawahnya."]
    ]
  },
  network: {
    splits: ['1 · Model & ApiException', '2 · Client ProductApi', '3 · Layar ProductList'],
    terms: [
      ['Factory `fromJson` bertipe', 'Mengubah hasil decode JSON dinamis menjadi class Dart bertipe tepat di batas HTTP.'],
      ['`ApiException` & `ProblemDetails`', 'Mem-parsing payload error RFC 9457 dari backend dengan aman agar UI tidak memamerkan HTML mentah atau stack trace.'],
      ['State async (loading / empty / error)', 'Melacak status memuat, kosong, error-retry, dan data siap bukan mengasumsikan jaringan selalu lancar.']
    ],
    title: 'Networking: HTTP, JSON, dan API ASP.NET Core-mu',
    why: "Di sinilah aplikasi mobile bertemu sisa stack lainnya: layar Flutter memanggil endpoint ASP.NET Core yang sama dengan frontend web. Model bertipe, state loading maupun error yang lengkap, dan client yang bisa di-inject membuat kode jaringan tetap mudah dites.",
    points: [
      "Pakai package `http` (atau `dio`) dengan `http.Client` yang di-inject bukan variabel global, supaya unit tes bisa menukarnya dengan fake.",
      "JSON datang sebagai `Map<String, dynamic>`. Ubah di perbatasan menjadi model bertipe lewat factory `fromJson`, atau generate kodenya memakai `json_serializable` kalau modelnya banyak.",
      "Angka JSON bisa tiba sebagai `int` atau `double`, jadi baca dulu lewat `num` sebelum memanggil `.toDouble()`. Seperti TypeScript, tipe Dart tidak mengecek bentuk JSON dengan sendirinya saat runtime.",
      "Cek `statusCode`, lempar exception bertipe saat gagal, dan selalu pasang timeout. Olah `ProblemDetails` ASP.NET Core menjadi pesan `title` yang aman ditampilkan dan error per field (`errors`), bukan isi body mentahnya.",
      "Android dan iOS memblokir trafik `http://` biasa. Untuk API lokal, pakai alamat HTTPS atau izinkan host dev saja lewat config network-security khusus debug, lalu pastikan aplikasi produksi khusus memakai HTTPS.",
      "Sebuah layar setidaknya punya empat status: **loading, data, kosong, error**. `FutureBuilder` cocok untuk kasus sederhana. Buat future-nya satu kali di luar `build`.",
      "Jauhkan kode jaringan dari widget lewat alur `widget -> repository -> API client`. Sisipkan token auth di satu tempat, lalu simpan token memakai `flutter_secure_storage` bukan preferences biasa."
    ],
    practice: "Arahkan `ProductApi` ke API products ASP.NET Core milikmu (`10.0.2.2` di emulator Android). Tambahkan `create(Product)` lewat POST lalu tampilkan error `ProblemDetails` di sebelah input form. Matikan server API untuk memastikan layar error tampil.",
    teach: "Jelaskan mengapa `http.Client` dikirim ke dalam `ProductApi`, bukan dibuat langsung di dalamnya.",
    analogy: "`fromJson` ibarat meja bea cukai di perbatasan: kargo bertipe bebas (`Map<String, dynamic>`) datang, dicek lalu diberi label satu kali, sesudah itu beredar di aplikasi sebagai `Product` yang jelas strukturnya tanpa memaksa setiap widget menebak-nebak isi kotaknya.",
    pitfalls: [
      "Membuat `Future` di dalam `build`, yang mengirim request HTTP baru tiap layar di-rebuild.",
      "Mengubah angka JSON langsung ke `double`: angka bulat seperti `25` datang sebagai `int` dan membuat cast-nya error.",
      "Membiarkan spinner berputar terus karena error dan timeout tidak pernah ditangani.",
      "Memanggil `http://10.0.2.2:5000` dari emulator Android dan langsung ditolak aturan cleartext sebelum request-nya keluar."
    ],
    quiz: [
      ["Mengapa `http.Client` di-inject ke class API?", ["Satu client per class lebih cepat", "Tes bisa memasukkan client tiruan sehingga tidak butuh jaringan nyata", "Diwajibkan package `http`", "Menjadikan client sebagai singleton"], "Dependensi yang dikirim dari luar bisa ditukar dengan fake saat tes."],
      ["JSON berisi `\"price\": 25`. Cara paling aman membacanya sebagai double?", ["`json['price'] as double`", "`(json['price'] as num).toDouble()`", "`double(json['price'])`", "`json.price`"], "`25` di-decode sebagai `int`; `num` menerima keduanya dan `toDouble` mengonversinya."],
      ["Di mana `Future` yang dipakai `FutureBuilder` sebaiknya dibuat?", ["Di dalam `build`", "Sekali, di State (sebagai field atau di `initState`)", "Di `dispose`", "Di `main`"], "`build` bisa jalan berkali-kali, jadi membuat future di sana akan mengulang request-nya setiap kali."]
    ]
  },
  bloc: {
    splits: ['1 · ProductsState sealed', '2 · ProductsCubit', '3 · Event CartBloc', '4 · UI ProductsPage'],
    terms: [
      ['`Cubit` vs `Bloc`', '`Cubit` memaparkan method sederhana (`load()`); `Bloc` memakai stream `Event` untuk debounce, pembatalan, dan jejak audit.'],
      ['State class sealed', 'Memodelkan state saling lepas (`Loading | Loaded | Failed`) supaya `switch (state)` mengecek semua kondisi layar saat compile time.'],
      ['`BlocSelector`', 'Membangun ulang UI hanya saat bagian state yang dipilih ikut berubah, melewati pembaruan field lain.']
    ],
    title: 'State management dengan Bloc dan Cubit',
    why: "Begitu beberapa layar berbagi data atau kamu ingin mengetes logika bisnis tanpa UI, `setState` cepat terasa sempit. Bloc memisahkan transisi state ke lapisannya sendiri yang mudah dites serta dilacak, dan membantu juga mengetahui bedanya dengan Provider dan Riverpod.",
    points: [
      "UI mengirim **intent masuk**, lalu menerima **state immutable keluar** lewat stream. Logika bisnis tinggal di luar widget tanpa memegang `BuildContext`.",
      "**Cubit** membuka method yang memanggil `emit(newState)` dan pas untuk sebagian besar layar. **Bloc** menerima **event** lewat handler `on<Event>`: kodenya lebih panjang, tapi tiap perubahan menjadi event bernama yang bisa dicatat log dan ditransformasi (debounce, batalkan, atau antrekan).",
      "Modelkan state sebagai **sealed class** (`loading`, `loaded`, `failed`) atau satu class dengan `copyWith` dan value equality. Jika state baru nilainya sama dengan state sebelumnya, Bloc melewati rebuild, dan mengubah list di tempat menyembunyikan perubahan itu. Tulis `==` manual atau pakai package `equatable`.",
      "User bisa menutup layar lebih cepat dari datangnya respons dan `BlocProvider` menutup cubit-nya. Memanggil `emit` sesudah `close` akan memicu error, jadi periksa `isClosed` sesudah tiap `await`.",
      "Event transformer dari `bloc_concurrency` mengatur antrean event: `restartable()` untuk kotak cari live, `droppable()` untuk mengabaikan klik ganda selama sibuk, dan `sequential()` untuk menjalankan satu per satu.",
      "`BlocProvider` membuat sekaligus membersihkan bloc untuk satu subtree. `BlocBuilder` menggambar ulang UI, `BlocListener` menjalankan aksi satu kali (snackbar, navigasi), sementara `BlocSelector` dan `buildWhen` mempersempit cakupan rebuild.",
      "Pakai `context.read<T>()` di dalam callback untuk memicu aksi, dan `context.watch<T>()` di dalam `build` untuk berlangganan perubahan. Bloc menerima **repository** yang disuntikkan lewat constructor.",
      "Sebagai perbandingan: **Provider** adalah dependency injection ringan plus `ChangeNotifier` dengan kode singkat tapi mutable. **Riverpod** menghilangkan `BuildContext` dengan dependensi halus dan pengecekan saat compile. **Bloc** butuh kode awal lebih banyak untuk mendapat alur transisi state yang mudah dilacak dan seragam di tim."
    ],
    practice: "Susun ulang daftar produk memakai `ProductsCubit` yang mengambil data dari `ProductApi`. Tambahkan kotak cari yang event-nya di-debounce oleh event transformer di `SearchBloc`, tampilkan pesan gagal dengan `BlocListener`, lalu cek widget mana saja yang rebuild saat satu item masuk ke keranjang.",
    teach: "Jelaskan beda Cubit dengan Bloc, dan kapan tambahan lapisan event layak dipakai.",
    analogy: "Cubit seperti mesin penjual otomatis: pencet satu tombol, barangnya langsung keluar. Bloc seperti dapur restoran berkupon pesanan: tiap permintaan ditulis di tiket lebih dulu sebelum dimasak, jadi kamu bisa melacak riwayat pesanan, menahan antrean, atau mengganti tiket cari lama saat tiket baru masuk.",
    pitfalls: [
      "Mengubah state di tempat lalu meng-emit object yang sama (`state.add(x); emit(state)`): dianggap sama persis oleh Bloc sehingga UI tidak ter-rebuild.",
      "Memakai `context.watch` di callback (berlangganan sia-sia) atau `context.read` di `build` (tidak pernah ikut ter-update).",
      "Menaruh navigasi atau snackbar di `BlocBuilder`. Builder bisa jalan berulang tiap rebuild; efek sekali jalan tempatnya di `BlocListener`.",
      "Memanggil `emit` sesudah `await` tanpa cek `isClosed`, memicu error 'Cannot emit new states after calling close' saat user keluar layar di tengah request.",
      "Menampilkan teks mentah `'$e'` ke user. Exception untuk log; simpan pesan yang ramah dibaca manusia di dalam state."
    ],
    quiz: [
      ["Apa perbedaan Cubit dan Bloc?", ["Cubit tidak bisa di-unit test", "Cubit menyediakan method; Bloc menerima event lalu memetakannya ke state", "Bloc hanya bisa menyimpan satu tipe state", "Cubit me-rebuild seluruh layar di tiap perubahan"], "Keduanya meng-emit state; Bloc menambahkan lapisan event agar tiap perubahan bisa dilacak serta ditransformasi."],
      ["Sebuah cubit menjalankan `state.items.add(x); emit(state);`. Mengapa UI-nya tidak berubah?", ["`emit` bersifat async", "State yang di-emit adalah object yang sama dengan sebelumnya sehingga dianggap tidak berubah", "List tidak bisa menjadi state", "Cubit sudah closed"], "Bloc melewati state yang bernilai sama dengan state aktif; jangan ubah isi di tempat dan emit object baru."],
      ["Di mana snackbar sebaiknya ditampilkan saat merespons perubahan state?", ["`BlocBuilder`", "`BlocListener`", "`initState`", "Di dalam cubit"], "Listener berjalan sekali tiap perubahan state dan dibuat khusus untuk efek samping seperti snackbar atau pindah halaman."],
      ["User membuka layar lalu pindah sebelum datanya datang. Aplikasi mencatat error 'Cannot emit new states after calling close'. Apa solusinya?", ["Jangan pernah menutup cubit", "Cek `isClosed` sesudah `await`, sebelum memanggil `emit`", "Bungkus `emit` dengan `Future.delayed`", "Ganti menjadi Bloc"], "`BlocProvider` menutup cubit waktu layarnya ditutup; respons yang datang terlambat harus diabaikan."]
    ]
  },
  dartdeep: {
    splits: ['1 · Generics, extension & mixin', '2 · Pattern Result sealed', '3 · Record & main()'],
    terms: [
      ['Extension method & Mixin (`with`)', 'Extension menambah helper (`context.theme`) ke tipe yang ada; mixin membagi perilaku lintas class tanpa inheritance.'],
      ['Pattern Result sealed', 'Menjamin penanganan `Success<T> | Failure<T>` tuntas saat compile time sehingga pemanggil tidak kena exception kejutan.'],
      ['Record & destructuring', 'Tuple bertipe ringan (`(double lat, double lng)`) untuk membawa banyak nilai tanpa membuat class ekstra.']
    ],
    title: 'Dart lebih dalam: generics, mixin, record, dan pattern',
    why: "Dart modern dilengkapi sealed class, pattern matching, record, dan extension. Fitur-fitur itu membantu pemodelan state diperiksa tuntas saat compile time sekaligus membuat parsing JSON lebih aman dan ringkas.",
    points: [
      "**Generics** menjaga helper tetap aman tipenya saat dipakai ulang: `T largest<T extends Comparable<T>>(List<T> items)`. Batas (`extends`) menentukan operasi apa yang boleh dipanggil di dalamnya.",
      "**Extension method** menambahkan getter atau method ke tipe di luar kode kita, seperti `'flutter'.capitalized`, diputuskan saat kompilasi tanpa biaya runtime.",
      "**Mixin** (`with`) membagikan perilaku lintas class yang tidak berkerabat tanpa pewarisan, contohnya `SingleTickerProviderStateMixin` atau `ChangeNotifier`.",
      "**Sealed class** membatasi seluruh subtype di file yang sama, jadi `switch` atasnya dicek **kelengkapannya** saat build. Tambah satu state baru dan setiap `switch` yang terlupa langsung error.",
      "**Pattern** membongkar struktur dan mengecek kecocokan sekaligus: `Success(:final value)`, guard lewat `when`, list/map pattern, serta `if (json case {...})` untuk memeriksa JSON.",
      "**Record** seperti `(double, double)` atau `({int x, int y})` adalah tuple bertipe yang immutable dengan value equality, praktis untuk mengirim banyak nilai tanpa class baru."
    ],
    practice: "Modelkan status request memakai sealed class `Idle`, `Loading`, `Loaded<T>`, dan `Failed`, lalu tulis `switch` expression yang menangani keempatnya. Tambahkan subtype kelima agar compiler menandai semua `switch` yang wajib diperbarui, lalu parse map JSON bersarang dengan satu pattern `case`.",
    teach: "Jelaskan bagaimana class `sealed` membuat `switch` dicek tuntas dan apa yang terjadi di compile time saat subtype baru ditambahkan.",
    analogy: "Sealed class seperti menu makanan yang daftar hidangannya sudah dikunci tercetak. Karena dapur tahu daftarnya lengkap, dapur mengecek tiap hidangan ada resepnya, dan jika pemilik menambah hidangan baru, resep yang bolong langsung ketahuan sebelum restoran buka, bukan saat tamu memesan.",
    pitfalls: [
      "Menambah cabang `default` atau wildcard `_` di `switch` atas sealed class, yang justru membungkam peringatan compiler saat ada state baru yang belum ditangani.",
      "Memakai record untuk model domain besar yang lebih pas jadi class. Record cocok untuk pengelompokan kecil di lingkup lokal.",
      "Mengira extension method bekerja dinamis: Dart memilihnya menurut tipe statis di kompilasi, jadi tidak jalan pada nilai `dynamic`."
    ],
    quiz: [
      ["Apa manfaat menandai sebuah class sebagai `sealed`?", ["Instansiasi lebih cepat", "`switch` yang dicek kelengkapannya atas subtype langsungnya", "Field privat", "Pewarisan ganda"], "Semua subtype langsung wajib berada di library yang sama, jadi compiler tahu daftar lengkapnya."],
      ["Apa itu `(int, String)` di Dart?", ["Tipe function", "Tipe record: pasangan immutable dengan value equality", "Sebuah list", "Syntax error"], "Record adalah tuple anonim yang immutable dan dibandingkan berdasarkan strukturnya."],
      ["Pada `Success(:final value) => ...`, apa tugas `:final value`?", ["Mendeklarasikan konstanta", "Mencocokkan getter `value` lalu mengikatnya ke variabel baru `value`", "Memanggil constructor", "Mengecek null"], "Singkatan dari pola `value: final value` pada pencocokan object."]
    ]
  },
  testing: {
    terms: [
      ['Unit vs Widget test (`WidgetTester`)', 'Unit test menguji logika Dart/Cubit murni tanpa UI; widget test merender frame UI cepat di VM tanpa emulator.'],
      ['`pump()` vs `pumpAndSettle()`', '`pump()` memajukan tepat satu frame (pas untuk mengecek spinner); `pumpAndSettle()` melaju terus sampai semua animasi berhenti.'],
      ['Injeksi repository tiruan (fake)', 'Menukar HTTP client nyata dengan fake deterministik yang langsung membalas data uji atau error tanpa koneksi jaringan.']
    ],
    title: 'Testing: unit, widget, dan integration test',
    why: "Widget test menjalankan pohon widget Flutter sungguhan dalam hitungan milidetik tanpa emulator atau ponsel. Memisahkan logika bisnis ke Bloc dengan repository injeksi membuat logikanya gampang di-unit test.",
    points: [
      "**Unit test** (`test`) memeriksa kode Dart murni seperti model, repository, dan cubit, cepat sehingga bisa dibuat banyak.",
      "**Widget test** (`testWidgets`) memasang widget di memori, mencari elemen, melakukan tap, lalu mengecek apa yang tampil tanpa membuka emulator.",
      "Pakai `pumpWidget` untuk memasang widget, `pump()` untuk memajukan satu frame, dan `pumpAndSettle()` untuk menunggu animasi selesai. Lupa melakukan pump sesudah tap adalah kesalahan paling umum.",
      "Cari elemen seperti cara user mencarinya: `find.text`, `find.byTooltip`, `find.bySemanticsLabel`, atau `Key` jika label teks tidak tersedia.",
      "Tes cubit dan bloc lewat **stream state**-nya memakai `expectLater(cubit.stream, emitsInOrder([...]))` atau `bloc_test`, memakai fake repository buatan tangan atau `mocktail`.",
      "**Integration test** (`integration_test`) menjalankan aplikasi utuh di perangkat atau emulator untuk alur penting. Golden test membandingkan pixel hasil render terhadap gambar referensi."
    ],
    practice: "Simpan sebagai `test/counter_test.dart` lalu jalankan `flutter test`. Setelah itu uji `ProductsCubit` dengan fake repository untuk skenario sukses, kosong, dan gagal, lalu tulis satu widget test yang memunculkan layar error dan menekan tombol Retry.",
    teach: "Jelaskan peran `pump()` di widget test dan mengapa tes gagal kalau kamu lupa memanggilnya setelah tap.",
    analogy: "Widget test ibarat gladi resik panggung dengan remote penahan waktu. Para pemain diam sampai kamu menekan tombol 'frame berikutnya' (`pump`), sehingga kamu bisa mengecek kondisi panggung tepat setelah tombol ditekan atau di tengah animasi.",
    pitfalls: [
      "Langsung mengecek UI tepat sesudah `tap` tanpa `pump()`, sebelum rebuild sempat berjalan.",
      "Memanggil `pumpAndSettle` saat spinner loading terus berputar tanpa henti, membuat tes hang sampai timeout.",
      "Mencari widget menurut class internal atau letak bersarangnya, bikin tes gampang rusak saat UI dirapikan. Cari lewat teks atau semantics label yang dilihat user."
    ],
    quiz: [
      ["Apa fungsi `await tester.pump()`?", ["Menjalankan aplikasi penuh", "Memajukan jam tes satu frame agar rebuild yang tertunda berjalan", "Mengambil screenshot", "Menunggu jaringan"], "Waktu tes dikendalikan manual; frame baru diproses saat kamu memanggil pump."],
      ["Bagaimana cara menguji state apa saja yang dikeluarkan sebuah cubit?", ["Membaca field privatnya", "Mengecek stream state-nya, misalnya dengan `emitsInOrder`", "Lewat widget test saja", "Tidak bisa dites"], "Output publik cubit adalah stream state-nya, jadi bisa dicek langsung."],
      ["Jenis tes mana yang membutuhkan perangkat asli atau emulator?", ["Unit test", "Widget test", "Integration test", "Golden test"], "Integration test menjalankan aplikasi penuh; unit dan widget test berjalan langsung di Dart VM."]
    ]
  },
  platform: {
    splits: ['1 · Adapter penyimpanan', '2 · MethodChannel Battery', '3 · AdaptiveShell'],
    terms: [
      ['Pembungkus plugin di repository', 'Taruh interface `SettingsStore` di antara kode aplikasi dan plugin supaya ganti dari `shared_preferences` ke secure storage cukup di satu file.'],
      ['`MethodChannel`', 'Saluran pesan asynchronous antara Dart dan kode native Kotlin atau Swift di masing-masing OS.'],
      ['Layout adaptif (`LayoutBuilder`)', 'Menampilkan `NavigationBar` di bawah untuk layar sempit dan memindahkannya ke `NavigationRail` di samping untuk tablet.']
    ],
    title: 'Persistence, platform channel, dan UI adaptif',
    why: "Aplikasi sungguhan perlu menyimpan data saat ditutup, mengakses fitur bawaan OS yang belum ada di Flutter, dan menyesuaikan tampilan di HP, tablet, sampai browser.",
    points: [
      "Pilih penyimpanan sesuai datanya: `shared_preferences` (pakai API `SharedPreferencesAsync` karena `SharedPreferences` lama mulai ditinggalkan) untuk setelan ringan, `flutter_secure_storage` (Keychain/Keystore) untuk token rahasia, dan database lokal (`sqflite` atau `drift`) untuk data offline yang terstruktur.",
      "Keamanan secure storage tergantung platformnya. Browser web tidak punya keystore hardware, jadi datanya disimpan di storage browser biasa. Jangan taruh token jangka panjang di build web.",
      "Bungkus plugin penyimpanan di class buatanmu sendiri supaya UI dan cubit bergantung ke interface milikmu, bukan langsung ke API plugin pihak ketiga.",
      "**Platform channel** mengirim pesan bolak-balik antara Dart dan Kotlin atau Swift. Pemanggilan `MethodChannel.invokeMethod` berjalan asynchronous dan bisa gagal, jadi tangkap `PlatformException` serta `MissingPluginException`. Cek dulu apakah plugin-nya sudah ada di pub.dev sebelum bikin sendiri.",
      "**Layout adaptif** membedakan tampilan berdasarkan lebar layar yang tersedia, bukan sistem operasinya. Pakai `NavigationBar` di bawah untuk layar sempit dan `NavigationRail` untuk layar lebar, lalu bungkus layar dengan `SafeArea` supaya konten aman dari notch atau status bar.",
      "Cek perilaku spesifik platform lewat `defaultTargetPlatform` dan `kIsWeb`, lalu ambil skala teks dan tema gelap dari `MediaQuery` dan `ThemeData`.",
      "OS bisa menjeda dan melanjutkan aplikasi mobile kapan saja. Pakai `AppLifecycleListener` untuk menyimpan data, menjeda stream, dan me-refresh data lama saat aplikasi dibuka lagi. Minta izin kamera atau lokasi pas fiturnya dipakai saja."
    ],
    practice: "Simpan pengaturan dark mode dan isi cart supaya tidak hilang saat aplikasi ditutup lalu dibuka lagi. Atur navigasinya pindah antara bottom bar dan rail di lebar 600 px, lalu tes dengan mengecilkan dan membesarkan jendela build web-nya. Terakhir, cari satu plugin fitur native di pub.dev (misalnya kamera atau lokasi) dan lihat cara plugin itu meminta izin di Android dan iOS.",
    teach: "Jelaskan apa itu platform channel dan kenapa memanggilnya berjalan asynchronous serta bisa gagal.",
    analogy: "Platform channel itu seperti penerjemah di antara dua kantor yang bahasanya beda. Kamu menyerahkan catatan singkat ('baterai tinggal berapa?'), penerjemah membawanya ke kantor sebelah, lalu tak lama jawabannya kembali. Kadang yang balik justru catatan kalau di kantor itu tidak ada yang mengurus permintaan tersebut. Kamu sendiri tidak pernah masuk ke kantor sebelah.",
    pitfalls: [
      "Menyimpan access token di `shared_preferences`, padahal isinya tersimpan sebagai teks biasa di disk. Pakai secure storage, dan ingat bahwa web tidak memilikinya.",
      "Memilih layout dari `Platform.isAndroid`, bukan dari lebar layar yang tersedia. Tablet, HP lipat, dan jendela desktop yang diubah ukurannya bakal berantakan.",
      "Meminta semua izin sekaligus waktu aplikasi baru dibuka. Minta izin saat fitur terkait dipakai, lalu siapkan alur kalau user menolak."
    ],
    quiz: [
      ["Di mana token login sebaiknya disimpan di HP?", ["`shared_preferences`", "Secure storage yang memakai Keychain atau Keystore", "Variabel global", "File teks di folder documents"], "Preferences tidak dienkripsi. Keystore bawaan OS memang dibuat khusus untuk menyimpan data rahasia."],
      ["Apa yang seharusnya menentukan pilihan antara bottom navigation bar dan navigation rail?", ["Sistem operasinya", "Lebar layar yang tersedia", "Versi Flutter", "Merek HP"], "Layout harus mengikuti ruang yang tersedia karena HP atau tablet yang sama bisa dipakai dalam posisi sempit maupun lebar."],
      ["Apa yang dikembalikan saat memanggil `MethodChannel`?", ["Nilai langsung saat itu juga", "`Future` yang bisa selesai dengan error", "Selalu `Stream`", "Tidak mengembalikan apa-apa"], "Pesan dikirim asynchronous ke kode native, dan sisi native bisa gagal atau tidak punya handler-nya."]
    ]
  },
  render: {
    splits: ['1 · Worker isolate', '2 · CustomPainter Sparkline', '3 · Feed & Key'],
    terms: [
      ['Tiga pohon (Widget / Element / RenderObject)', 'Widget cuma konfigurasi ringan, Element menyimpan identitas serta `State`, dan RenderObject menghitung ukuran lalu menggambar piksel.'],
      ['Isolate (`Isolate.run(...)`)', 'Memindahkan parsing JSON berat atau enkripsi ke memory kerja terpisah supaya UI isolate tetap selesai di bawah batas 8–16 ms per frame.'],
      ['Identitas `Key` (`ValueKey(id)`)', 'Menjaga Element stateful tetap menempel ke data item yang benar saat daftar diurutkan ulang atau disisipi, bukan tertukar index.']
    ],
    predict: {
      prompt: 'List `StatefulWidget` menampilkan `[A, B, C]` tanpa `Key`, lalu kamu menyisipkan `X` di index 0 (`[X, A, B, C]`). Object `State` mana yang menempel ke `A`?',
      options: ['`A` otomatis menyimpan `State`-nya berdasar isi teks', '`A` mewarisi `State` lama milik `B` (slot indeks bergeser tanpa key)', 'Flutter langsung menolak berjalan tanpa `UniqueKey`'],
      explain: 'Tanpa key, Flutter mencocokkan slot Element dari tipe widget dan nomor index (`[0, 1, 2]`). Menyisipkan elemen di index 0 bikin seluruh State lama ikut bergeser, kecuali tiap baris memakai `ValueKey(item.id)`.'
    },
    title: 'Rendering internal, performa, dan isolate',
    why: "Animasi mulus butuh satu frame setiap 16 ms, atau 8 ms di layar 120 Hz. Materi ini membahas apa yang terjadi di dalam satu frame, cara membaca DevTools, dan cara melacak di tree mana masalahnya muncul.",
    points: [
      "Flutter memakai **tiga tree**: **widget** (konfigurasi immutable yang murah dibuat ulang), **element** (instance hidup yang menyimpan `State` dan membandingkan widget lama dengan yang baru), dan **render object** (menghitung layout dan menggambar piksel).",
      "Saat rebuild, element membandingkan widget baru dan lama. Kalau `runtimeType` dan `key` sama, instance-nya cukup di-update. Kalau beda, subtree lama dibuang beserta State-nya, dan di sinilah key dan `const` berperan.",
      "Satu frame menjalankan **build → layout → paint → composite** di UI thread, lalu raster thread menggambarnya lewat **Impeller**. Engine default di iOS dan Android ini meng-compile shader sejak awal supaya animasi pertama tidak patah-patah. Jank terjadi saat salah satu thread melewatkan batas waktu frame-nya.",
      "Kurangi rebuild dengan constructor `const`, taruh state di widget yang lebih dalam, pakai `BlocSelector` atau `buildWhen`, dan gunakan `ListView.builder` supaya hanya item di layar yang di-build. `RepaintBoundary` memisahkan area yang sering digambar ulang, tapi item dari list builder sudah otomatis memakainya.",
      "Isolate di Dart punya **memory sendiri** dan berkomunikasi lewat pesan. `compute` atau `Isolate.run` memindahkan kerja berat CPU seperti parsing JSON besar dan olah gambar keluar dari UI isolate supaya animasi tetap jalan. Datanya disalin saat dikirim ke isolate lain, jadi kirim yang perlu saja, jangan seluruh state aplikasi.",
      "Browser web tidak punya isolate. `Isolate.run` bakal error di web, sedangkan `compute` otomatis menjalankannya di main thread. Tetap jalan, tapi UI ikut tertahan selama prosesnya selesai.",
      "Selalu ukur performa di **profile mode** pada HP sungguhan, jangan pernah di debug mode. Cek DevTools: performance overlay, grafik frame, 'Track widget rebuilds', dan tab memory."
    ],
    practice: "Di emulator Android atau build desktop, panggil `slowChecksum` langsung di UI isolate saat spinner berputar dan lihat animasinya macet, lalu pindahkan ke `compute`. Jalankan tes yang sama di build web dan perhatikan bedanya. Buka DevTools dalam profile mode, nyalakan 'Track widget rebuilds', scroll list panjang, lalu hilangkan satu rebuild yang tidak perlu.",
    teach: "Jelaskan fungsi widget tree, element tree, dan render object tree, lalu mana di antara ketiganya yang menyimpan `State`.",
    analogy: "Widget itu gambar rancangan arsitek yang digambar ulang setiap kali ada revisi. Element itu mandor di lapangan yang tidak pindah tempat, mengecek gambar baru terhadap yang terakhir, lalu menentukan bagian mana yang perlu diubah. Render object itu tembok aslinya: berat diubah, jadi baru disentuh kalau mandor bilang rancangannya memang berubah.",
    pitfalls: [
      "Menilai performa di debug mode, padahal jalannya berkali-kali lebih lambat dibanding profile atau release mode.",
      "Menjalankan parsing berat atau olah gambar di `build` atau di UI isolate, lalu berharap menempel `const` di mana-mana bisa menyelamatkannya.",
      "Membungkus semua widget dengan `RepaintBoundary`. Tiap boundary makan satu layer dan memory ekstra, jadi pakai hanya saat profiler menunjukkan biaya repaint tinggi. Item di list builder sudah punya sendiri.",
      "Memakai `Isolate.run` di aplikasi yang juga ditargetkan ke web karena di web langsung error. Pakai `compute` atau cek `kIsWeb` dulu."
    ],
    quiz: [
      ["Tree mana yang menyimpan `State` milik `StatefulWidget` di antara rebuild?", ["Widget tree", "Element tree", "Render tree", "Tidak ada, karena State itu global"], "Element bertahan di antara rebuild dan menyimpan State, sementara widget-nya dibuang lalu dibuat lagi."],
      ["Kapan element memakai ulang State lama untuk widget yang baru?", ["Selalu", "Saat widget baru punya runtime type dan key yang sama", "Tidak pernah", "Hanya untuk widget `const`"], "Type dan key yang cocok artinya update widget yang sama. Kalau tidak cocok, subtree lama dibuang."],
      ["Kenapa memakai `compute` untuk parsing JSON berukuran besar?", ["Supaya parsing-nya dikerjakan GPU", "Prosesnya pindah ke isolate terpisah sehingga UI isolate tetap lancar menggambar frame", "Menyimpan cache hasil parsing buat nanti", "Membaca JSON sebagian demi sebagian tanpa parsing"], "Isolate tidak berbagi memory ataupun thread, jadi UI tetap responsif saat proses berjalan (kecuali di web, karena `compute` jalan di main thread)."]
    ]
  },
  arch: {
    splits: ['1 · Konfigurasi & Domain', '2 · Lapisan Data & Cubit', '3 · Error boundary & main()'],
    terms: [
      ['Konfigurasi `--dart-define`', 'Memasukkan URL API staging atau produksi lewat `const String.fromEnvironment(...)` saat build tanpa menaruh rahasia di Git.'],
      ['Batas layer per fitur', 'Memisahkan entity domain Dart biasa dari implementasi API di layer data dan Cubit di layer presentation untuk tiap fitur.'],
      ['Zone / `PlatformDispatcher.onError`', 'Penangkap error global untuk mencatat error framework maupun error async yang terlewat ke layanan crash reporting.']
    ],
    title: 'Arsitektur, flavor, dan rilis',
    why: "Merilis aplikasi mobile beda dengan merilis website. Bug tidak beres cuma dengan redeploy, user bisa tetap pakai versi lama berbulan-bulan, dan pihak store memeriksa binary-mu sebelum tayang. Struktur kode, konfigurasi, dan disiplin rilis jauh lebih menentukan di sini.",
    points: [
      "Susun aplikasi dalam layer: **presentation** (widget dan bloc) → **domain** (model Dart biasa dan interface repository) → **data** (API client dan database). Dependency mengarah ke dalam, dan domain sama sekali tidak meng-import Flutter.",
      "Kelompokkan berdasarkan **fitur** (`features/cart/…`) dengan ketiga layer di dalam masing-masing fitur. Tentukan implementasinya di satu tempat, yaitu composition root, memakai `RepositoryProvider` atau service locator seperti `get_it`.",
      "Pisahkan konfigurasi per environment lewat `--dart-define` atau **flavor** (`dev` / `staging` / `prod`) supaya app id, ikon, dan URL API berbeda-beda. Jangan simpan secret apa pun di dalam binary, karena apa saja yang sudah dirilis bisa dibongkar.",
      "Tangkap semua error yang terlewat: pasang `FlutterError.onError` untuk error di dalam framework dan `PlatformDispatcher.instance.onError` untuk error async di luarnya, lalu kirim keduanya ke crash reporting.",
      "Untuk rilis, build binary release yang sudah di-sign (`flutter build appbundle` dan `flutter build ipa`) di CI, jalankan analisis serta test, naikkan nomor versi tiap build, lalu rilis bertahap. Acak nama symbol dengan `--obfuscate --split-debug-info` dan simpan file symbol-nya.",
      "Siapkan dukungan untuk versi lama: jaga API tetap kompatibel ke belakang, tambah cek versi minimum, dan lindungi fitur berisiko dengan remote flag. Accessibility seperti label semantics, kontras warna, dan skala teks itu syarat rilis yang wajib lolos."
    ],
    practice: "Rapikan struktur proyekmu menjadi `features/<name>/{data,domain,presentation}`. Tambah konfigurasi dev dan prod dengan URL API serta nama aplikasi yang beda. Siapkan job CI yang menjalankan `flutter analyze`, `flutter test`, dan release build. Terakhir, tulis checklist rilis versi 1.0.1 yang juga membawa perubahan schema database.",
    teach: "Jelaskan kenapa aplikasi mobile harus tetap cocok dengan versi lamanya sendiri, sesuatu yang jarang perlu dipikirkan di website.",
    analogy: "Website itu seperti restoran: ganti menu malam ini dan semua tamu langsung melihatnya. Aplikasi mobile itu buku resep cetak yang sudah tersebar di ribuan dapur. Kamu bisa menerbitkan edisi kedua, tapi edisi pertama masih ada di rak dan tetap dipakai memasak, jadi bahan yang dijual toko (API-mu) harus tetap cocok untuk kedua edisi.",
    pitfalls: [
      "Ikut meng-compile API key atau secret ke dalam aplikasi. Apa pun yang masuk ke binary bisa dibaca orang, jadi taruh secret di server.",
      "Mengubah backend sampai versi aplikasi lama yang masih terpasang di HP user langsung rusak.",
      "Menghilangkan file debug symbol dari build yang di-obfuscate sehingga stack trace error di production tidak bisa dibaca."
    ],
    quiz: [
      ["Di aplikasi Flutter yang dibagi per layer, apa saja yang boleh di-import layer domain?", ["Widget Flutter", "HTTP client", "Hanya Dart biasa, tanpa Flutter dan tanpa data source", "Semuanya"], "Dependency selalu mengarah ke dalam. Layer domain hanya berisi model dan interface yang nanti diimplementasikan layer luar."],
      ["Kenapa secret tidak boleh dimasukkan ke `--dart-define` untuk release build?", ["Bikin aplikasi jadi lambat", "Nilainya masuk ke binary dan tetap bisa diekstrak", "Store memindainya lalu menolak aplikasinya", "Hanya bisa dipakai di debug build"], "Binary aplikasi di sisi user itu sifatnya publik, jadi secret harus tinggal di server. Obfuscation cuma menyulitkan pencariannya, bukan menyembunyikannya."],
      ["Error jenis apa yang ditangkap `PlatformDispatcher.instance.onError`?", ["Hanya layout overflow", "Error async yang terlewat di luar callback framework Flutter", "Compile error", "Response HTTP 500"], "`FlutterError.onError` menangkap error di dalam framework, sedangkan dispatcher ini menangkap sisanya."]
    ]
  }
}
};

export default trackId;
