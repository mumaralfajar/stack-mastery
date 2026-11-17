// Indonesian translation for the Angular track (exact parity with data/angular.js).
window.I18N = window.I18N || { ui: {}, tracks: {}, viz: {}, projects: [], iv: {} };
I18N.tracks.angular = {
  tagline: 'Frontend berfitur lengkap: component, Signal, dependency injection, Signal Forms, HTTP, dan SSR.',
  lessons: {
    components: {
      title: 'Component, template, dan binding',
      why: 'Setiap layar Angular disusun dari pohon potongan UI kecil bernama component. Begitu kamu paham bagaimana sebuah class TypeScript menyimpan data dan template HTML-nya menampilkan serta memperbarui data itu, seluruh framework ini langsung terasa masuk akal.',
      terms: [
        ['Component', 'Satu potongan UI yang bisa dipakai ulang: satu class TypeScript (berisi data dan aksi klik) berpasangan dengan template HTML miliknya sendiri.'],
        ['Decorator (`@Component`)', 'Penanda berawalan `@` tepat di atas class yang memberi tahu Angular nama tag HTML (`selector`) dan markup (`template`) milik component tersebut.'],
        ['`selector`', 'Nama tag HTML kustom (seperti `app-product-card`) untuk memanggil component ini di dalam template lain.'],
        ['Binding', 'Menghubungkan nilai atau method TypeScript di class langsung ke teks HTML, properti elemen, atau event pengguna.']
      ],
      points: [
        'Sebuah **component** Angular memasangkan `class` TypeScript (penyimpan data dan aksi) dengan **decorator `@Component({ ... })`** yang menentukan dua hal inti: `selector` (nama tag HTML, misalnya `\'app-product-card\'`) dan `template` (HTML-nya).',
        'Untuk memakai sebuah component di dalam template component lain, cantumkan class-nya ke `imports: [ProductCard]` pada `@Component(...)` milik parent. Jika tag kustom tidak punya HTML di antara tag buka dan tutup, tulis self-closing: `<app-product-card />`.',
        '**Template menghubungkan data lewat tiga cara utama**: `{{ name }}` (**interpolasi**) menyisipkan teks ke HTML; `[disabled]="outOfStock"` (**property binding**) mengisi properti elemen DOM dari TypeScript; dan `(click)="select()"` (**event binding**) memanggil method class ketika pengguna mengklik.',
        'Kurung siku `[disabled]="outOfStock"` penting bahkan untuk atribut boolean: di HTML biasa, `disabled="false"` tetap membuat tombol mati karena atributnya ada, sedangkan `[disabled]="false"` mengisi properti DOM JavaScript dengan boolean `false`.',
        'Dalam sintaks class Angular, **`readonly`** mencegah properti konstan tertimpa tanpa sengaja, dan **`protected`** membolehkan `template` milik component itu membaca field/method sambil tetap menyembunyikannya dari parent component.',
        'Aplikasi dimulai dari `main.ts` dengan memanggil `bootstrapApplication(App)`, yang memasang root component `App` ke dalam tag `<app-root></app-root>` di `index.html`.'
      ],
      practice: 'Buat workspace baru dengan `npx @angular/cli@latest new shop-ng` dan ganti root component dengan kode di atas. Jalankan lewat `npx ng serve`, buka browser, lalu tambahkan properti `clickCount = 0` yang bertambah di dalam `toggle()`. Lihat apa yang error jika kamu menghapus `ProductCard` dari `imports: [ProductCard]` atau menulis `(click)="() => toggle()"` alih-alih `(click)="toggle()"`.',
      teach: 'Jelaskan fungsi `@Component`, `selector`, `imports`, `{{ value }}`, `[disabled]`, dan `(click)` satu per satu memakai bahasa sederhana tanpa menganggap pendengarmu sudah tahu Angular.',
      analogy: 'Component itu seperti tag HTML kustom buatanmu sendiri (`<app-product-card />`) dengan otak TypeScript kecil di belakangnya. Kurung kurawal ganda `{{ }}` mencetak data ke halaman, kurung siku `[ ]` mendorong nilai TypeScript **ke dalam** properti HTML, dan tanda kurung `( )` mengirim klik pengguna **kembali** ke class kamu.',
      pitfalls: [
        'Memakai `<app-product-card />` di template parent tanpa mendaftarkan `ProductCard` di array `@Component({ imports: [...] })` milik parent.',
        'Menulis `(click)="() => toggle()"` di template: Angular menjalankan ekspresinya saat diklik, yang cuma membuat fungsi panah tanpa pernah memanggilnya. Tulis `(click)="toggle()"`.',
        'Memakai `private` pada field yang dibaca template—Angular mengecek template secara ketat sehingga butuh `protected` atau properti publik (`readonly`).',
        'Di tutorial Angular lama kamu mungkin melihat file pembungkus `NgModule` alih-alih `imports: [...]` langsung di `@Component`; Angular modern tidak butuh `NgModule`.'
      ],
      quiz: [
        [
          'Apa yang wajib kamu tambahkan agar template parent component mengenali `<app-product-card />`?',
          ['File registrasi `NgModule`', '`ProductCard` di dalam array `@Component({ imports: [...] })` milik parent', 'Tag `<link>` HTML di `index.html`', 'Menurunkan `ProductCard` memakai `extends`'],
          'Setiap component secara eksplisit mencantumkan component lain yang dipakai templatenya lewat array `imports`.'
        ],
        [
          'Apa yang terjadi jika kamu menulis `(click)="() => toggle()"` di dalam template Angular?',
          ['`toggle()` berjalan saat diklik', 'Tidak terjadi apa-apa: klik hanya mengevaluasi fungsi panah tanpa memanggil `toggle()`', 'Angular gagal dikompilasi', '`toggle()` berjalan sekali saat halaman dimuat'],
          'Event binding langsung mengeksekusi ekspresi itu saat event terjadi; panggil method-nya langsung dengan `(click)="toggle()"`.'
        ],
        [
          'Mengapa lebih baik memakai `[disabled]="isOutOfStock"` daripada HTML `disabled="{{ isOutOfStock }}"`?',
          ['Property binding meneruskan boolean JavaScript `true`/`false` langsung ke elemen DOM', 'Kurung siku memberi style tombol secara otomatis', 'HTML tidak mendukung atribut pada tombol', 'Hanya berjalan lebih cepat di ponsel'],
          'Pada atribut HTML, bahkan `disabled="false"` tetap menonaktifkan tombol karena nama atributnya hadir. `[disabled]` mengatur properti boolean DOM secara langsung.'
        ]
      ]
    },
    flow: {
      title: 'Control flow, pipe, dan slot konten',
      why: 'HTML biasa tidak bisa mengulang array, menampilkan spinner loading menggantikan tabel, atau memformat `240` menjadi `$240.00`. Angular menambahkan percabangan template yang bersih (`@if`, `@for`, `@switch`), filter pemformatan bernama pipe, dan slot pembungkus (`<ng-content />`) agar template tetap ekspresif sekaligus mudah dibaca.',
      terms: [
        ['Control flow', 'Blok template (`@if`, `@for`, `@switch`) yang secara bersyarat menampilkan, mengulang, atau memilih markup HTML.'],
        ['`track`', 'Ekspresi ID yang diwajibkan oleh `@for` (seperti `track p.id`) agar Angular mengenali tiap baris daftar saat data berubah alih-alih membangun ulang seluruh daftar.'],
        ['Pipe (`|`)', 'Operator pemformatan template (seperti `{{ price | currency }}`) yang mengubah tampilan suatu nilai tanpa mengubah data aslinya.'],
        ['Content projection (`<ng-content />`)', 'Menyisipkan slot penampung di dalam component pembungkus agar parent bisa menyelipkan HTML-nya sendiri di antara tag pembungkus tersebut.']
      ],
      points: [
        '**`@if` / `@else if` / `@else`** menampilkan atau menghapus elemen secara bersih sesuai kondisi. **`@for (p of products; track p.id)`** mengulang markup untuk tiap item, dan blok opsional **`@empty`** tampil saat panjang array nol.',
        'Setiap `@for` mewajibkan **`track`** agar Angular tahu node DOM mana milik item data yang mana. Memakai ID unik yang stabil (`track p.id`) berarti menyisipkan atau mengurutkan item cukup memindahkan elemen DOM yang ada alih-alih menghancurkan dan membuat ulang semua baris (yang bisa menghilangkan fokus kursor atau posisi scroll).',
        '**`@switch (value)`** membandingkan memakai `===` ketat tanpa fallthrough antar-case. Jika `value` bertipe union TypeScript (seperti `\'loading\' | \'ready\' | \'error\'`), akhiri dengan **`@default never;`** supaya compiler menggagalkan build bila kelak kamu menambah state baru tanpa `@case` pasangannya.',
        '**Pipe** (`{{ p.price | currency }}`) memformat nilai di template tanpa mengubah data asli. Class `@Pipe({ name: \'truncate\' })` buatanmu harus **pure** (fungsi tanpa efek samping yang mengembalikan hasil sama untuk input sama). Untuk memakai ulang logika format itu di file TypeScript biasa, ekstrak fungsi biasa (`truncateText`) dan panggil dari kedua tempat.',
        '**Content projection** mengubah component menjadi pembungkus serbaguna (`<app-badge-card>...</app-badge-card>`): `<ng-content />` tanpa nama menangkap isi utama, sementara `select="[card-badge]"` memakai **selector atribut CSS** biasa untuk mengarahkan `<span card-badge>` ke slot khususnya (dan konten di dalam `<ng-content>Default</ng-content>` berperan sebagai teks fallback).'
      ],
      practice: 'Pertama, tebak apa yang terjadi jika kamu menambah `\'paused\'` ke `type LoadState` tanpa menambah `@case (\'paused\')`, lalu tambahkan dan baca pesan error compiler akibat `@default never;`. Setelah itu, ubah `products` menjadi `[]` untuk melihat fallback `@empty`, dan pastikan `truncateText(\'USB-C Docking Station\', 10)` bekerja lewat `| truncate: 10` di template maupun dipanggil langsung di TypeScript.',
      teach: 'Jelaskan mengapa `@for` butuh `track p.id`, apa fungsi pipe (`|`), dan bagaimana `<ng-content select="[card-badge]" />` bekerja kepada orang yang baru tahu HTML dan CSS.',
      analogy: '`track` di `@for` adalah label nomor di setiap koper: saat koper bertukar posisi di ban berjalan, Angular membaca label (`p.id`) dan menggeser elemen DOM yang cocok alih-alih membongkar dan mengemas ulang semuanya dari nol. `<ng-content />` seperti bingkai foto berlubang-lubang berlabel.',
      pitfalls: [
        'Menulis `track $index` pada daftar yang item-nya bisa disisipkan di atas, diurutkan ulang, atau dihapus—bergesernya indeks membuat Angular memasangkan baris DOM yang keliru.',
        'Lupa menambahkan `CurrencyPipe` atau custom pipe (`TruncatePipe`) ke `@Component({ imports: [...] })`.',
        'Mencoba menginstansiasi atau memakai ulang class `@Pipe` langsung di logika TypeScript biasa alih-alih memanggil fungsi helper bersama seperti `truncateText()`.',
        'Di tutorial Angular lama kamu akan menjumpai `*ngIf` dan `*ngFor`; blok bawaan modern `@if` / `@for` tidak butuh import ekstra dan lebih cepat.'
      ],
      quiz: [
        [
          'Mengapa `@for` mewajibkan ekspresi `track` seperti `track p.id`?',
          ['Untuk mengurutkan item sesuai abjad', 'Agar Angular dapat mengenali setiap item lintas perubahan array dan memakai ulang node DOM-nya', 'Untuk mengubah key menjadi huruf besar', 'Untuk menyembunyikan item kosong'],
          'ID yang stabil memberi tahu Angular elemen DOM mana yang berpindah atau tetap sama sehingga baris yang tidak berubah tidak perlu dibangun ulang.'
        ],
        [
          'Apa yang dijamin dengan menaruh `@default never;` di akhir `@switch`?',
          ['Tidak ada yang dirender bila cocok', 'Compile error setiap kali ada cabang union type yang lupa ditangani', 'Lemparan error runtime di browser', 'Perbandingan huruf kecil otomatis'],
          'Cara ini memanfaatkan pengecekan `never` milik TypeScript agar setiap nilai union dipastikan punya handler `@case`.'
        ],
        [
          'Bagaimana cara berbagi logika pemformatan antara pipe template dan helper TypeScript biasa?',
          ['Salin tempel isi kodenya ke dua file', 'Ekstrak menjadi fungsi TypeScript biasa (seperti `truncateText`) yang dipanggil oleh pipe maupun kode lain', 'Bungkus seluruh aplikasi dengan `CurrencyPipe`', 'Memakai `@for` di dalam pipe'],
          'Pipe hanyalah class pembungkus tipis di atas fungsi murni—mengekstrak fungsinya menjaga template dan kode TypeScript tetap bersih dan konsisten.'
        ]
      ]
    },
    signals: {
      title: 'State reaktif: signal, computed, linkedSignal, dan effect',
      why: 'UI nyata berubah setelah klik, ketikan, dan timer. **Signal** memberi Angular wadah kecil yang eksplisit di sekeliling setiap nilai yang bisa berubah sehingga Angular tahu *persis* teks atau atribut mana yang bergantung pada nilai itu—dan memperbaruinya otomatis tanpa memindai seisi halaman.',
      terms: [
        ['Signal (`signal(val)`)', 'Kotak reaktif berisi suatu nilai. Memanggilnya seperti fungsi (`qty()`) membaca nilainya sekaligus mendaftarkan pembaca untuk pembaruan berikutnya.'],
        ['`computed()`', 'Signal turunan read-only yang menghitung hasilnya secara lazy, menyimpannya di cache (memoized), dan hanya menghitung ulang bila signal yang benar-benar dibacanya berubah.'],
        ['`linkedSignal()`', 'State writable dengan nilai default otomatis: di-reset setiap kali signal sumber berubah, namun tetap boleh diubah lewat `.set()`.'],
        ['`effect()`', 'Pelari efek samping yang otomatis berjalan saat signal yang dibacanya berubah—khusus untuk menyinkronkan ke luar Angular (timer, log, `localStorage`).']
      ],
      points: [
        'Buat state reaktif dengan **`signal(initialValue)`**. Baca nilainya dengan **memanggilnya** (`this.qty()`), ganti dengan `.set(next)`, atau hitung nilai baru dari nilai lama lewat `.update(q => q + 1)`. Selalu buat array/objek baru alih-alih mengubah di tempat.',
        'Turunkan nilai dengan **`computed(() => this.price() * this.qty())`**. Sifatnya **lazy** (hanya dihitung ketika dibaca) dan **memoized** (di-cache sampai dependensi yang dilacak berubah). Pelacakannya pun dinamis: pada `qty() > 0 && hasCoupon()`, perubahan `hasCoupon` diabaikan saat `qty()` bernilai `0` karena `&&` melakukan short-circuit sebelum sempat membacanya.',
        'Pakai **`linkedSignal`** bila state butuh nilai default turunan pintar yang juga dapat **diubah manual** oleh pengguna (misalnya mereset `selectedShipping` saat pilihan ongkir berubah, sambil tetap mempertahankan pilihan pengguna bila opsi itu masih tersedia).',
        'Pakai **`effect(onCleanup => ...)`** khusus untuk mendorong perubahan ke sistem luar (logging, `localStorage`, canvas, timer), sambil mendaftarkan `onCleanup(...)` untuk membatalkan timer atau listener lama. **Jangan pernah** memakai `effect()` untuk menyalin satu signal ke signal lain—pakai `computed()` atau `linkedSignal()`.',
        'Pelacakan signal hanya mencatat pembacaan sinkron: selalu baca semua signal **sebelum** `await`, dan bungkus pembacaan yang tidak ingin disubscribe dengan **`untracked(this.qty)`**.'
      ],
      practice: 'Buka visualisasi interaktif **Graf ketergantungan Signal** di atas: atur `qty = 0`, toggle `hasCoupon`, dan amati `total()` tetap di-cache karena `qty() > 0 && hasCoupon()` short-circuit sebelum membaca `hasCoupon()`. Lalu buka **Playground TypeScript** (`#/play/ts`), jalankan contoh **Signal Angular** dan **linkedSignal Angular**, lalu ubah `price.set(150)` untuk mengamati perhitungan ulangnya.',
      teach: 'Jelaskan apa itu `signal()`, bagaimana `computed()` menyimpan cache sekaligus melacak cabang dinamis, dan mengapa `linkedSignal()` membereskan kasus di mana orang sering salah memakai `effect()`.',
      analogy: '`computed` itu sel rumus di spreadsheet: kamu tidak bisa mengetik langsung ke dalamnya, dan Excel hanya menghitung ulang saat sel input yang benar-benar dibacanya berubah. `linkedSignal` itu dropdown checkout pintar: otomatis memilih Standard saat negara diganti, tetapi tetap membiarkanmu mengklik Express.',
      pitfalls: [
        'Memakai `effect()` untuk menyalin nilai signal A ke signal B (`effect(() => b.set(a() * 2))`) alih-alih menulis `const b = computed(() => a() * 2)`.',
        'Mengubah isi array di dalam signal secara langsung (`items().push(x)`) tanpa menggantinya lewat `.update(list => [...list, x])`—Angular melihat referensi array yang sama sehingga tidak memicu pembaruan.',
        'Membaca signal di dalam `computed` atau `effect` *setelah* `await`: pelacakan signal hanya mengamati pemanggilan sinkron.',
        'Lupa tanda kurung saat membaca signal di template (`{{ total }}` mencetak `[Signal: 110]` alih-alih memanggil `{{ total() }}`).'
      ],
      quiz: [
        [
          'Di dalam `computed(() => qty() > 0 && coupon() ? 15 : 0)`, nilai `qty()` sedang `0`. Apa yang terjadi ketika `coupon` berubah?',
          ['`computed` melempar error', 'Tetap di-cache tanpa menghitung ulang, karena short-circuit melewati pembacaan `coupon()`', 'Tetap dihitung ulang seperti biasa', 'Mengosongkan `qty()`'],
          'Dependensi dicatat dinamis tiap evaluasi; saat `qty() > 0` bernilai false, `coupon()` tidak pernah dipanggil.'
        ],
        [
          'Primitif mana yang memberimu state yang otomatis reset saat filter berubah, tapi tetap memperbolehkan pengguna mengubahnya dengan `.set()`?',
          ['`computed()`', '`linkedSignal()`', '`effect()`', '`untracked()`'],
          '`linkedSignal()` membuat derived state writable yang menghitung nilai default baru tiap sumbernya berubah.'
        ],
        [
          'Kapan `effect()` menjadi pilihan yang tepat?',
          ['Menyinkronkan API eksternal non-Angular seperti `localStorage`, gambar canvas, atau analytics saat signal berubah', 'Menyaring array dari kotak pencarian', 'Menginisialisasi konstanta class', 'Memanggil `.set()` pada signal lain setiap prop berubah'],
          'Gunakan `computed()` / `linkedSignal()` untuk state antar-signal, dan sisihkan `effect()` untuk efek samping eksternal beserta cleanup.'
        ]
      ]
    },
    // ---------------- Intermediate ----------------
    inputs: {
      title: 'API Component: input, output, model, query, dan host',
      why: 'Component bekerja sama lewat batas yang jelas: parent mengirim data turun, child mengirim event naik, kontrol form kustom tetap tersinkron dua arah, dan kadang class butuh pegangan ke elemen DOM atau tag pembungkus terluarnya sendiri. Karena Angular memodelkan input, `model()`, dan query sebagai Signal, semua yang baru kamu pelajari langsung berlaku.',
      terms: [
        ['`input()` / `input.required()`', 'Signal read-only yang menerima data kiriman dari parent component (`[unitPrice]="25"`).'],
        ['`output()`', 'Pemancar event yang mengirim notifikasi naik ke parent component (`(addToCart)="onAdded($event)"`).'],
        ['`model()`', 'Signal writable dua arah yang mendukung singkatan `[(quantity)]="qty"` (`[quantity]` masuk + `(quantityChange)` keluar).'],
        ['Elemen host', 'Tag HTML terluar milik component sendiri yang dirender di parent (misalnya `<app-qty-picker>`), diatur lewat `host: { ... }` di dalam `@Component`.'],
        ['Template query (`viewChild`)', 'Signal yang memberi TypeScript akses ke elemen anak berlabel (seperti `<input #searchInput />`) setelah dirender.']
      ],
      points: [
        '**Input**: deklarasikan input opsional dengan `input(defaultVal)` dan yang wajib dengan `input.required<number>()`. Karena input **adalah signal read-only**, turunkan nilainya lewat `computed()`—jangan pernah menulis `this.unitPrice.set(...)`.',
        '**Atribut HTML vs properti DOM**: di `<app-qty-picker disabled />`, HTML statis mengirim string kosong `""`. Penambahan `{ transform: booleanAttribute }` mengonversi keberadaan atribut menjadi boolean `true` (`numberAttribute` melakukan hal serupa untuk angka).',
        '**Output & Two-way `model()`**: kirim event kustom lewat `readonly addToCart = output<number>()` (gunakan camelCase tanpa awalan `on`, misalnya `selected`, bukan `onSelected`). Untuk state bersama yang bisa diedit dua sisi seperti stepper jumlah, `model(1)` menyediakan input sekaligus output sehingga parent bisa memakai sintaks two-way **banana-in-a-box** `[(quantity)]="qty"`.',
        '**Query elemen (`viewChild` / `contentChild`)**: pasang penanda `#name` pada elemen template (`<input #searchInput />`) dan ambil pembungkusnya (`ElementRef<HTMLInputElement>`) lewat `viewChild(\'searchInput\')` (`contentChild` membaca elemen yang diproyeksikan lewat `<ng-content />`). Karena query berupa signal, panggil `this.searchInput()?.nativeElement.focus()` secara aman setelah render.',
        '**Mengatur elemen host**: `<app-qty-picker>` itu sendiri adalah **elemen host** yang membungkus seluruh `template:`. Ikat class, atribut, atau listener host langsung di `@Component({ host: { \'class\': \'picker-host\', \'[attr.data-disabled]\': \'disabled()\' } })` dengan memakai `[attr.*]` setiap kali menargetkan atribut HTML kustom.'
      ],
      practice: 'Bangun component `StarRating` dengan `readonly max = input(5)` dan `readonly rating = model(0)`. Ikat dari parent memakai `[(rating)]="score"`, periksa `<app-star-rating>` di DevTools browser untuk memastikan `host:` menambahkan `data-rating` ketika bintang diklik, lalu tambahkan tombol `viewChild` yang memfokuskan tombol bintang pertama saat Reset.',
      teach: 'Jelaskan perbedaan `input()` + `output()` dibanding `model()`, mengapa `<app-btn disabled />` butuh `booleanAttribute`, dan apa itu **elemen host**.',
      analogy: '`input()` adalah kotak surat satu arah dari parent ke child, `output()` adalah bel yang ditekan child ke atas, dan `model()` adalah papan tulis bersama yang bisa diubah keduanya. **Elemen host** adalah amplop terluarnya itu sendiri, diatur lewat `host: { ... }`.',
      pitfalls: [
        'Memilih nama input yang bentrok dengan atribut HTML standar seperti `title`, `id`, atau `hidden`.',
        'Memanggil `viewChild.required()` di dalam constructor class atau saat elemennya berada di dalam `@if` bernilai false—Angular melempar error `NG0951` sebelum view tersebut ada.',
        'Mencoba memanggil `.set()` pada signal `input()` (input bersifat read-only; gunakan `model()` atau `linkedSignal()` untuk penulisan lokal).',
        'Di kode Angular lama kamu mungkin menemui `@HostBinding`, `@HostListener`, `ngOnChanges`, dan `ngAfterViewInit`; `host:`, `computed()`, dan `viewChild()` menggantikan semuanya dengan bersih.'
      ],
      quiz: [
        [
          'Fungsi mana yang membuat signal two-way (`[(value)]`) antara parent dan child?',
          ['`input()`', '`output()`', '`model()`', '`computed()`'],
          '`model()` mengembalikan signal writable yang membuka input `[value]` sekaligus output `(valueChange)` dalam satu kontrak.'
        ],
        [
          'Mengapa `input(false, { transform: booleanAttribute })` membuat parent bisa menulis `<app-qty-picker disabled />`?',
          ['HTML mengirim atribut statis sebagai string kosong `""`, yang diubah `booleanAttribute` menjadi `true`', 'Langsung menonaktifkan parent component', 'Melewati pengecekan TypeScript', 'Membuat `Signal` dari CSS'],
          'Tanpa transform, atribut HTML telanjang tiba sebagai `""`; `booleanAttribute` mengubah keberadaannya menjadi `true` dengan rapi.'
        ],
        [
          'Di mana atribut atau class CSS untuk tag terluar `<app-qty-picker>` milik component sendiri sebaiknya ditulis?',
          ['Di dalam `constructor` dengan `document.querySelector`', 'Di bagian `host: { ... }` pada `@Component(...)`', 'Di dalam `index.html`', 'Di dalam `main.ts`'],
          '`host` mengikat class, atribut, dan listener DOM secara deklaratif ke elemen host milik component.'
        ]
      ]
    },
    di: {
      title: 'Service dan dependency injection',
      why: 'Component berfokus pada tampilan UI, sedangkan state bersama (seperti keranjang belanja atau sesi login) dan helper API tinggal di **service**. **Dependency Injection (DI)** milik Angular memungkinkan component mana pun meminta service bersama tanpa membuat `new CartStore()` manual—dan memudahkan test menukarnya dengan objek tiruan.',
      terms: [
        ['Service (`@Service()`)', 'Class TypeScript biasa penyimpan state bersama atau logika bisnis yang dapat dipakai ulang oleh banyak component.'],
        ['Dependency Injection (DI)', 'Pola ketika Angular menciptakan dan menyerahkan instance class lewat `inject(...)`, bukan component memanggil `new ...` secara manual.'],
        ['`Injector`', 'Registri pencarian (berbentuk pohon) milik Angular yang menjawab permintaan `inject(...)` mulai dari tingkat component sampai root aplikasi.'],
        ['`InjectionToken`', 'Kunci bertipe unik untuk meng-inject nilai non-class seperti objek konfigurasi atau `DOCUMENT` browser.']
      ],
      points: [
        '**Dependency Injection** memecahkan dua hal: berbagi satu instance (seperti keranjang belanja) lintas component terpisah, dan memudahkan tes menukar implementasi palsu. Tandai singleton tingkat aplikasi dengan **`@Service()`** (setara `@Injectable({ providedIn: \'root\' })`, sekaligus **tree-shakeable**—service tak terpakai tidak masuk bundle).',
        'Minta dependensi ke Angular memakai **`inject(CartStore)`** di inisialisasi field class atau constructor (atau di dalam guard router dan interceptor HTTP fungsional). Memanggil `inject()` di dalam method klik biasa akan error kecuali dibungkus `runInInjectionContext()`.',
        '**Lifetime service** (mirip ASP.NET Core): `@Service()` membuat satu **singleton se-aplikasi** (`AddSingleton`). Mendaftarkan service di Route membatasinya ke bagian route tersebut. Menulis `@Service({ autoProvided: false })` lalu memasukkan `[DraftBuffer]` di `@Component({ providers: [...] })` memberi tiap instance component salinan privatnya sendiri yang hancur saat dihapus dari layar.',
        '**Cara pencarian menyusuri dua pohon injector**: Angular mengecek naik di rantai **`ElementInjector`** (array `providers` elemen ini, lalu elemen leluhur di template), lalu bila belum ketemu naik di rantai **`EnvironmentInjector`** (provider route → root aplikasi). Opsi mengatur pencarian: `{ optional: true }` mengembalikan `null` alih-alih crash; `{ skipSelf: true }` mulai mencari dari parent.',
        'Selalu lindungi state service bersama: biarkan field `signal` writable berstatus `private` (`_items`), lalu ekspos versi read-only `.asReadonly()` bersama method eksplisit (`add()`).',
        'Untuk interface TypeScript atau objek pengaturan biasa (yang hilang saat kompilasi, berbeda dengan class), buat **`InjectionToken<ApiSettings>`** bertipe.'
      ],
      practice: 'Tambahkan `readonly instanceId = crypto.randomUUID()` ke `CartStore` dan `DraftBuffer`, lalu render dua `<app-editor-panel />` berdampingan di `App`. Pastikan `CartStore` menampilkan UUID identik di mana-mana sementara `DraftBuffer` menghasilkan UUID berbeda per panel. Hapus `{ optional: true }` sementara dari `parentDraft` untuk melihat error `NullInjectorError` yang dicegahnya.',
      teach: 'Jelaskan cara kerja Dependency Injection, bandingkan `@Service()` vs `providers: [...]` di component dengan lifetime ASP.NET Core, dan jelaskan mengapa `InjectionToken` diperlukan untuk interface konfigurasi.',
      analogy: 'Memanggil `inject(Tool)` itu seperti meminjam alat di bengkel. Kamu cek meja kerjamu dulu (`ElementInjector`), melirik ke meja pengawas di atasmu (`skipSelf`), dan kalau belum ada juga baru berjalan ke gudang pusat (`EnvironmentInjector` root).',
      pitfalls: [
        'Memanggil `inject(MyService)` di dalam method tombol `(click)` atau `setTimeout` alih-alih menangkap `private readonly svc = inject(MyService)` sebagai field class.',
        'Lupa menulis `{ optional: true }` saat mengecek apakah parent menyediakan sebuah service—menimbulkan crash `NullInjectorError` saat component dipakai sendirian.',
        'Mengekspos properti `signal` writable secara publik dari service alih-alih `.asReadonly()`, membiarkan sembarang component menimpa state bersama.',
        'Catatan projection: `providers` membagikan service ke child yang diproyeksikan lewat `<ng-content />`, sedangkan `viewProviders` menyembunyikannya dari child proyeksi.'
      ],
      quiz: [
        [
          'Di mana pemanggilan `inject(CartStore)` sah dilakukan?',
          ['Di dalam method handler `(click)`', 'Di inisialisasi field class, constructor, fungsi factory, atau functional route guard', 'Di dalam callback `async` setelah `await`', 'Di sembarang fungsi helper statis saat runtime'],
          '`inject()` membutuhkan injection context Angular yang aktif selama instansiasi class serta setup router/HTTP fungsional.'
        ],
        [
          'Dua tag `<app-editor-panel />` bersaudara masing-masing menulis `DraftBuffer` di `@Component({ providers: [DraftBuffer] })`. Berapa banyak instance `DraftBuffer` yang dibuat?',
          ['Satu singleton bersama', 'Dua instance terpisah, masing-masing hancur saat panelnya hilang dari layar', 'Nol kecuali ditambahkan ke `main.ts`', 'Compile error'],
          'Mendaftarkan di `@Component` menempelkan satu instance ke `ElementInjector` masing-masing elemen.'
        ],
        [
          'Mengapa memakai `new InjectionToken<ApiSettings>(...)` alih-alih menulis `inject(ApiSettings)` secara langsung?',
          ['Interface mempercepat injeksi saat runtime', 'Interface TypeScript terhapus saat kompilasi, jadi Angular butuh objek token runtime sebagai kunci pencarian', '`@Service()` melarang penggunaan interface', 'Token mengenkripsi string otomatis'],
          'Tipe `interface` TypeScript lenyap di output JavaScript; `InjectionToken` memberi Angular kunci nyata saat runtime.'
        ]
      ]
    },
    routing: {
      title: 'Routing, URL input, dan lazy loading',
      why: 'Aplikasi web nyata butuh URL yang bisa dibagikan (`/products/42?tab=reviews`) sekaligus menjaga unduhan awal tetap cepat. Router Angular mengubah Single-Page Application menjadi tampilan yang dapat di-bookmark, memetakan parameter URL langsung ke signal input, dan mengunduh halaman berat hanya saat dikunjungi.',
      terms: [
        ['SPA (Single-Page Application)', 'Aplikasi web yang mengganti URL dan menukar component di tempat di dalam browser tanpa me-reload seluruh dokumen HTML.'],
        ['`<router-outlet />`', 'Tag penampung tempat Angular merender component halaman mana pun yang cocok dengan URL browser saat ini.'],
        ['Path vs query param', 'Segmen URL wajib (`/products/:id`) dibanding filter pasangan key-value opsional setelah `?` (`?tab=reviews`).'],
        ['Lazy loading (`loadComponent`)', 'Memecah satu route menjadi chunk file JS tersendiri yang baru diunduh saat pengguna membuka route tersebut.']
      ],
      points: [
        'Angular mengatur halaman lewat array **`Routes`**, didaftarkan di `app.config.ts` memakai `provideRouter(routes, withComponentInputBinding(), withViewTransitions())`, dan menampilkan component route aktif tepat di bawah **`<router-outlet />`**.',
        'Selalu buat tautan internal dengan **`routerLink`** (serta `routerLinkActive="on"` untuk menandai tautan aktif), jangan pernah `<a href="/products/42">`—`href` biasa memaksa browser reload penuh dan menghapus seluruh signal di memori!',
        'Mengaktifkan **`withComponentInputBinding()`** otomatis mengikat path parameter URL (`:id`), query string (`?tab=reviews`), serta `title` / resolved data ke **`input()` signal** yang namanya cocok di component tujuan—tanpa perlu parsing manual.',
        '**Jaga ukuran bundle awal tetap kecil**: gunakan **`loadComponent: () => import(\'./product-detail\').then(m => m.ProductDetail)`** (atau `loadChildren`) alih-alih `component: ProductDetail` statis. Bundler menghasilkan file JS chunk terpisah yang hanya diunduh ketika dikunjungi.',
        '**First-match wins**: Angular membaca `routes` dari atas ke bawah dan berhenti di pola pertama yang cocok. Taruh route spesifik (`products/:id`) sebelum fallback sapu-jagat (`path: \'**\'`).',
        'Menambahkan `providers: [...]` pada suatu route membentuk `EnvironmentInjector` tingkat route yang dibagikan ke seluruh halaman anaknya lalu dibersihkan saat keluar.'
      ],
      practice: 'Konfigurasikan sub-route `children` di bawah `products/:id` (`overview` dan `reviews`), pasang `<router-outlet />` kedua di dalam `ProductDetail`, lalu buka tab **Network** DevTools browser (filter ke JS). Klik `routerLink`-mu dan lihat lazy chunk hanya terunduh saat bernavigasi.',
      teach: 'Jelaskan apa yang dihindari `<a routerLink="...">` dibanding `<a href="...">`, bagaimana `withComponentInputBinding()` menyederhanakan pembacaan parameter URL, dan mengapa `loadComponent` mempercepat muatan halaman awal.',
      analogy: 'Routing adalah papan direktori gedung bersama ruangan yang disiapkan mendadak. Lobi tidak pernah mengangkut perabotan ke Ruang 42 (`loadComponent`) sebelum tamu mengklik pintunya—dan `withComponentInputBinding()` menyelipkan lencana tamu (`:id`) langsung ke ruangan sebagai `input()` signal.',
      pitfalls: [
        'Menaruh `{ path: \'**\', ... }` di baris atas `routes`—karena first-match wins, aturan ini menyedot seluruh URL aplikasi.',
        'Menulis `href="/products/42"` alih-alih `routerLink="/products/42"`, yang mengulang boot seluruh aplikasi Angular setiap diklik.',
        'Lupa menulis `withComponentInputBinding()` di `provideRouter(...)`, sehingga signal `input()` untuk param route bernilai `undefined`.',
        'Ikut menaruh static import `ProductDetail` di atas `app.routes.ts`: bundler melihat import eager tersebut dan kehilangan lazy code splitting.'
      ],
      quiz: [
        [
          'Apa yang diotomatisasi `withComponentInputBinding()` saat diaktifkan di `provideRouter`?',
          ['Mengenkripsi parameter URL', 'Mengikat path param URL, query param, dan resolved data langsung ke signal `input()` component', 'Memuat ulang file CSS tiap navigasi', 'Mengunduh semua lazy route saat startup'],
          'Nilai dari route mengalir langsung ke properti `input()` yang cocok tanpa membaca `ActivatedRoute` secara manual.'
        ],
        [
          'Mengapa lebih baik memakai `loadComponent: () => import(\'./admin\').then(m => m.Admin)` untuk halaman sekunder?',
          ['Menjalankan halaman di background worker', 'Compiler menempatkan `Admin` di file JS terpisah yang baru dimuat saat dikunjungi', 'Mengaktifkan SSR secara otomatis', 'Membagikan satu instance `Admin` di mana-mana'],
          'Dynamic `import()` memampukan code splitting agar pengguna hanya mengunduh halaman yang benar-benar mereka buka.'
        ],
        [
          'Di mana route sapu-jagat `{ path: \'**\', ... }` harus ditempatkan?',
          ['Pertama di dalam `routes`', 'Terakhir di dalam `routes`, karena pencocokan berhenti di path pertama yang cocok', 'Hanya di dalam `children`', 'Sebelum `redirectTo`'],
          'Route diperiksa dari atas ke bawah; route apa pun setelah `**` tidak akan pernah terjangkau.'
        ]
      ]
    },
    forms: {
      title: 'Signal Forms, validasi, dan error yang aksesibel',
      why: 'Hampir setiap aplikasi mengumpulkan input pengguna—form daftar, editor produk, checkout—lengkap dengan aturan bersyarat dan umpan balik error yang jelas. **Signal Forms** Angular (`@angular/forms/signals`) membungkus satu model data `signal(...)` dalam skema validasi bertipe aman, menyinkronkan input DOM, error, dan atribut aksesibilitas otomatis.',
      terms: [
        ['Field vs FieldState (`f.name` vs `f.name()`)', '`productForm.name` adalah referensi pengikatan yang dikirim ke `[formField]`; memanggil `productForm.name()` mengembalikan signal status hidupnya (`touched()`, `invalid()`, `errors()`).'],
        ['`touched()`', 'Menjadi `true` setelah pengguna masuk lalu meninggalkan input (blur) atau menekan Submit—mencegah peringatan "Required!" muncul sebelum pengguna mengetik.'],
        ['Skema validasi', 'Aturan yang diberikan ke `form(model, s => ...)` (`required`, `min`, `applyWhen` bersyarat, `validate` kustom) untuk memeriksa kebenaran data terpusat.'],
        ['`aria-invalid` & `aria-describedby`', 'Atribut aksesibilitas HTML standar yang memberi tahu pembaca layar saat input error (`aria-invalid="true"`) dan elemen `<p id="...">` mana yang berisi teks error (`aria-describedby`).']
      ],
      points: [
        'Mulai dari **model `signal` non-nullable** (pakai default kosong seperti `\'\'`, `0`, `false` alih-alih `null`), lalu bungkus dengan **`form(this.model, s => ...)`** dan ikat kontrol `<input>` memakai **`[formField]="productForm.name"`**.',
        'Karena `[formField]` mengelola langsung `value`, `disabled`, `readonly`, `hidden`, `name`, dan batas validasi, jangan pernah menaruh atribut bentrok seperti `[value]`, `[disabled]`, `min`, atau `max` pada `<input>` HTML.',
        'Bedakan **referensi field** vs **cek state**: oper `productForm.name` (tanpa `()`) ke `[formField]`, dan panggil **`productForm.name()`** (dengan `()`) saat membaca `.touched()`, `.invalid()`, `.hidden()`, atau `.errors()`.',
        'Deklarasikan aturan secara bersih di callback skema: **`required()`**, **`min()`**, **`email()`**, **`applyWhen(s.discount, condition, rules)`** untuk field kondisional (`hidden()` otomatis `true` bila dilewati!), `applyEach()` untuk item array, dan **`validate()`** (kembalikan `{ kind, message }` jika gagal atau `undefined` bila valid).',
        'Tangani submit dengan `novalidate` pada `<form>` (agar balon error bawaan browser tidak bentrok dengan UI-mu) dan **`submit(this.productForm, async () => { ... })`**: `submit()` otomatis menandai semua field sebagai `touched` agar pesan error tampil bila tidak valid, dan hanya menjalankan callback `async` saat seluruhnya valid.',
        'Sambungkan error yang aksesibel memakai `<label for="...">`, `[attr.aria-invalid]`, `[attr.aria-describedby]`, dan `role="alert"` pada teks error agar pengguna keyboard dan pembaca layar langsung mendengar pesan kesalahan.'
      ],
      practice: 'Kembangkan `ProductForm` dengan menambahkan `sku: \'\'` ke `model`, validasikan memakai `pattern(s.sku, /^[A-Z]{3}-\\d{3}$/, { message: \'Use format ABC-123\' })`, dan tambahkan aturan lintas-field `validate()` yang melarang diskon di atas `50` saat `price < 20`. Submit dengan input tidak valid lalu pastikan pesan error tampil di semua field tanpa menjalankan `console.log`.',
      teach: 'Jelaskan perbedaan `productForm.name` dan `productForm.name()`, alasan tampilan error umumnya mengecek `.touched()`, serta bagaimana `aria-invalid` + `aria-describedby` membantu pengguna pembaca layar.',
      analogy: 'Signal Forms mengubah form menjadi satu blueprint hidup yang tersambung langsung ke model `signal`. Mengoper `productForm.name` ke `[formField]` mencolokkan alat ukur ke `<input>`, sedangkan memanggil `productForm.name()` membaca jarum indikator (`touched()`, `invalid()`, `errors()`).',
      pitfalls: [
        'Lupa tanda kurung saat membaca state field: menulis `form.name.errors()` alih-alih `form.name().errors()`.',
        'Menaruh `null` di awal `signal({ name: null })` alih-alih `\'\'` atau `0`.',
        'Menaruh atribut HTML `[disabled]`, `[value]`, `min`, atau `max` pada `<input [formField]="...">`—aturan harus tinggal di skema `form()`.',
        'Mengembalikan `null` alih-alih `undefined` ketika pengecekan `validate()` kustom lolos, atau di aplikasi lama saat kamu menjumpai **Reactive Forms** (`FormGroup`, `Validators`) yang melakukan validasi model-driven serupa di atas RxJS alih-alih Signals.'
      ],
      quiz: [
        [
          'Bagaimana cara membaca apakah `productForm.name` sudah pernah disentuh pengguna?',
          ['`productForm.name.touched()`', '`productForm.name().touched()`', '`productForm().name.touched`', '`productForm.name.get(\'touched\')`'],
          'Memanggil field-nya (`productForm.name()`) mengembalikan `FieldState`, yang mengekspos signal `.touched()` dan `.errors()`.'
        ],
        [
          'Di mana aturan angka minimum sebaiknya ditulis untuk `<input type="number" [formField]="productForm.price">`?',
          ['Sebagai `min="1"` HTML langsung di input', 'Di dalam skema `form()` memakai `min(s.price, 1)`', 'Di dalam handler blur', 'Di dalam `index.html`'],
          '`[formField]` mengelola atribut input langsung dan bergantung pada skema agar logika serta UI tetap serasi.'
        ],
        [
          'Apa yang dilakukan `submit(this.productForm, async () => ...)` sebelum menjalankan callback-mu?',
          ['Mereset seluruh input jadi kosong', 'Menandai semua field sebagai `touched` agar pesan error tampil, dan melewati callback kecuali valid', 'Memanggil `fetch()` otomatis', 'Menghapus atribut ARIA'],
          'Pengguna yang langsung mengklik Save segera melihat kolom mana yang perlu diperbaiki, sementara form invalid tidak pernah menjalankan callback simpan.'
        ]
      ]
    },
    // ---------------- Advanced ----------------
    rxjs: {
      title: 'Stream event asinkron: RxJS dan interop Signal',
      why: 'Signal unggul menyimpan *nilai sekarang detik ini* (jumlah, total, buka/tutup). **RxJS** unggul mengatur **event seiring waktu**—menunggu 300 ms setelah ketikan berhenti, membatalkan pencarian usang, atau mengabaikan klik ganda tak sengaja pada Bayar. Memahami stream `Observable` di sini membuat `HttpClient` dan event router di Angular langsung terang benderang.',
      terms: [
        ['`Observable`', 'Aliran nilai malas (lazy stream) yang datang seiring waktu (nol, satu, atau banyak). **Cold** Observable tidak bekerja sebelum `.subscribe()` (atau `firstValueFrom`) mendengarkannya.'],
        ['Operator & `.pipe(...)`', 'Langkah transformasi berantai (`debounceTime`, `switchMap`) di dalam `.pipe(...)` untuk menyaring, menunda, atau membatalkan event stream.'],
        ['`switchMap` vs `exhaustMap`', '`switchMap` membatalkan panggilan async lama yang belum selesai saat event baru tiba (pencarian typeahead); `exhaustMap` mengabaikan klik baru sampai panggilan aktif selesai (tombol Pay).'],
        ['`toSignal()` / `toObservable()`', 'Jembatan Angular untuk mengubah stream `Observable` menjadi signal (beserta pembersihan otomatis) dan sebaliknya.']
      ],
      points: [
        '**Signal vs Observable**: Signal selalu memegang *satu nilai sinkron saat ini*. **Observable** memodelkan *event asinkron seiring waktu*. Method `HttpClient` Angular mengembalikan **cold Observable**—ibarat cetak biru, panggilan HTTP tidak berjalan sampai ada yang subscribe (atau diubah lewat `firstValueFrom()` / `toSignal()`).',
        'Bentuk pola waktu dengan operator **`.pipe(...)`**: `debounceTime(300)` menunggu jeda ketikan 300 ms sebelum memancarkan nilai; `distinctUntilChanged()` membuang kueri kembar berturut-turut.',
        '**Memilih operator flattening async yang tepat** ketika event baru tiba sementara request sebelumnya masih berjalan:',
        '**`switchMap`**: membatalkan inner observable sebelumnya yang sedang jalan dan beralih ke yang terbaru—wajib untuk pencarian typeahead agar balasan lama tidak menimpa hasil baru.',
        '**`exhaustMap`**: mengabaikan pemicu baru selama satu inner observable masih berjalan—wajib untuk tombol Checkout / Submit guna mencegah tagihan ganda.',
        '**`concatMap`** mengantre request secara berurutan (simpan serial); **`mergeMap`** menjalankan semuanya bersamaan (urutan tidak penting).',
        '**Bersihkan otomatis**: memanggil `.subscribe()` tanpa pembersihan meninggalkan listener hantu setelah berpindah halaman. Pasangkan `.pipe(takeUntilDestroyed())` (di constructor/inisialisasi field) atau ubah stream dengan bersih ke signal memakai **`toSignal(obs$, { initialValue })`**.'
      ],
      practice: 'Buka **Playground TypeScript** (`#/play/ts`), pilih **RxJS switchMap vs exhaustMap**, lalu jalankan untuk membandingkan bagaimana `switchMap` membatalkan `\'typing ke\'` sementara `exhaustMap` mengabaikan `\'accidental double-click\'`. Lalu tukar `\'switch\'` dan `\'exhaust\'` di `compareFlattening` untuk memprediksi keluarannya.',
      teach: 'Jelaskan dengan kata-kata sederhana apa yang membedakan `Observable` dari `Signal`, kapan memilih `switchMap` dibanding `exhaustMap`, dan mengapa `toSignal()` meniadakan pemanggilan `.unsubscribe()` manual.',
      analogy: '`switchMap` adalah koki cepat saji yang membuang roti setengah jadi begitu pelanggan berteriak "jadi ayam aja!". `exhaustMap` adalah tombol panggilan lift: menekannya lima kali selagi lift bergerak tidak akan memanggil lima lift.',
      pitfalls: [
        'Memakai `mergeMap` untuk pencarian langsung: balasan lambat untuk `\'la\'` yang tiba setelah `\'laptop\'` menimpa layar dengan hasil basi.',
        'Memanggil `.subscribe(...)` tanpa `takeUntilDestroyed()`, meninggalkan timer atau listener hantu berjalan setelah berpindah halaman.',
        'Lupa menulis `{ initialValue }` di `toSignal(obs$)`: tanpanya, nilai awal signal bertipe `undefined` (`T | undefined`) sebelum event pertama datang.',
        'Menumpuk `.subscribe()` di dalam callback `.subscribe()` lain alih-alih merangkainya datar memakai `switchMap` atau `exhaustMap`.'
      ],
      quiz: [
        [
          'Operator mana yang membatalkan request HTTP pencarian sebelumnya begitu pengguna mengetik huruf baru?',
          ['`mergeMap`', '`concatMap`', '`switchMap`', '`exhaustMap`'],
          '`switchMap` melakukan unsubscribe dari inner observable sebelumnya (membatalkan request HTTP-nya) tiap ada nilai baru masuk.'
        ],
        [
          'Pengguna mengklik ganda tombol "Place order". Operator mana yang mengabaikan klik ekstra sampai request pertama selesai?',
          ['`switchMap`', '`exhaustMap`', '`mergeMap`', '`debounceTime`'],
          '`exhaustMap` mengabaikan pemicu baru dari hulu selama inner observable masih berjalan.'
        ],
        [
          'Apa yang diotomatisasi oleh `takeUntilDestroyed()`?',
          ['Mengulang request jaringan tiga kali', 'Otomatis unsubscribe ketika component atau service dihancurkan', 'Mengubah signal menjadi JSON', 'Mengurutkan item array'],
          'Operator ini mengikat umur subscription langganan ke `DestroyRef` Angular sehingga tidak perlu pembersihan manual.'
        ]
      ]
    },
    http: {
      title: 'HTTP, httpResource, dan berkomunikasi dengan ASP.NET Core',
      why: 'Di sinilah Angular terhubung ke backend ASP.NET Core dan database kamu. Angular memberi **`httpResource`** untuk pembacaan data `GET` reaktif serta **`HttpClient`** (beserta interceptor mirip middleware, keamanan XSRF bawaan, dan penanganan error `ProblemDetails` terstruktur) untuk mutasi `POST`/`PUT`/`DELETE`.',
      terms: [
        ['`httpResource()`', 'Loader data berbasis signal untuk request `GET`: melacak signal di fungsi URL-nya, membatalkan request usang, dan mengekspos `.isLoading()`, `.error()`, serta `.value()`.'],
        ['`HttpInterceptorFn`', 'Hook middleware fungsional yang berjalan di setiap request keluar dan response masuk—dipakai untuk memasang request ID, header auth, atau menangani error terpusat.'],
        ['CORS vs Dev Proxy', 'Browser memblokir `localhost:4200` membaca `localhost:5000` kecuali ASP.NET Core mengaktifkan **CORS** (`AddCors`), ATAU Angular CLI memproksikan `/api` lewat `proxy.conf.json` saat dev.'],
        ['`ProblemDetails` & XSRF', 'RFC 9457 `ProblemDetails` adalah payload JSON error standar ASP.NET Core (`title` + `errors`); **XSRF** (cookie `XSRF-TOKEN` → header `X-XSRF-TOKEN`) memblokir form POST lintas-situs palsu.']
      ],
      points: [
        '**Pembacaan `GET` reaktif lewat `httpResource(() => \'/api/products?q=\' + query())`**: setiap kali signal yang dibaca dalam callback berubah, Angular otomatis membatalkan request lama dan mengambil URL baru (kembalikan `undefined` untuk menjeda fetch).',
        'Selalu periksa `.hasValue()` atau `.error()` sebelum memanggil **`products.value()`**—membaca `.value()` langsung saat request gagal akan melempar error.',
        '**Mutasi dengan `HttpClient`**: panggil `post`, `put`, `patch`, atau `delete` untuk operasi tulis. Sebagaimana terlihat di pelajaran RxJS, `HttpClient` mengembalikan **cold `Observable`**, sehingga tidak ada yang dikirim ke jaringan sebelum kamu await `firstValueFrom()` atau subscribe.',
        '**Middleware `HttpInterceptorFn`**: daftarkan `provideHttpClient(withInterceptors([requestIdInterceptor]))` di `appConfig`. Karena objek `HttpRequest` bersifat immutable, gandakan dengan `req.clone({ setHeaders: ... })` sebelum diteruskan ke `next(...)`.',
        '**Petakan `ProblemDetails` ASP.NET Core**: tangkap `HttpErrorResponse` lalu ekstrak `title` dan `errors` (misalnya `{ Price: [\'Must be positive\'] }`) ke dalam `ApiError` bertipe agar tiap pesan tampil persis di bawah input pasangannya.',
        '**Pengaturan lokal & keamanan**: siapkan `proxy.conf.json` di Angular CLI (atau izinkan `http://localhost:4200` di `AddCors` ASP.NET Core). Utilitas TypeScript seperti `Omit<Product, \'id\'>` dan `satisfies CreateProduct` memverifikasi payload ketat sesuai DTO backend tanpa menghilangkan tipe literal yang disimpulkan.'
      ],
      practice: 'Buka **Playground TypeScript** (`#/play/ts`) lalu jalankan **Mapper ProblemDetails ASP.NET** untuk melihat bagaimana JSON validasi terpetakan menjadi `fieldErrors`. Setelah itu sambungkan `ProductsPage` ke API ASP.NET Core lokalmu memakai `proxy.conf.json`, kirim `-5` pada harga, dan amati `fieldErrors()[\'Price\']` muncul langsung di sebelah input.',
      teach: 'Jelaskan kapan memilih `httpResource` dibanding `HttpClient`, mengapa pemanggilan `http.post(...)` saja tidak mengirim apa pun tanpa menunggu `firstValueFrom()`, serta cara kerja CORS / `proxy.conf.json`.',
      analogy: '`httpResource` itu loket pemesanan hidup yang menyobek kertas antrean pencarian lamamu begitu kamu meminta halaman lain. `HttpInterceptorFn` adalah gerbang pemeriksaan yang dilewati setiap request keluar dan response masuk secara otomatis.',
      pitfalls: [
        'Memanggil `products.value()` di template tanpa `@if (products.hasValue())`—bila API gagal, `.value()` melempar error.',
        'Memanggil `this.http.delete(\'/api/products/1\')` dan lupa menunggu `firstValueFrom(...)` atau subscribe—cold `Observable` tidak pernah dikirim.',
        'Mengubah `req.headers` langsung di dalam interceptor alih-alih memakai `req.clone(...)`.',
        'Hanya mengizinkan port Vite `:5173` di `AddCors()` ASP.NET Core saat dev server Angular berjalan di `:4200`.'
      ],
      quiz: [
        [
          'Apa yang terjadi jika kamu membaca `userResource.value()` ketika request HTTP-nya berakhir error?',
          ['Mengembalikan `undefined`', 'Melempar error karena status resource berada di `\'error\'`', 'Mencoba ulang satu kali', 'Mencetak string'],
          'Periksa `hasValue()` atau `error()` dulu sebelum membaca `.value()`.'
        ],
        [
          'Mengapa `this.http.delete(\'/api/products/1\')` tidak melakukan apa pun jika kamu mengabaikan nilai kembaliannya?',
          ['Browser memblokir `DELETE`', '`HttpClient` mengembalikan cold `Observable` yang baru dikirim saat di-subscribe (atau ditunggu dengan `firstValueFrom`)', 'Interceptor memblokirnya', 'CORS melarang `DELETE`'],
          'Cold observable menunggu subscriber sebelum membuka panggilan HTTP.'
        ],
        [
          'Di mana header Authorization atau `X-Request-Id` seharusnya dipasang lintas seluruh request API?',
          ['Di dalam tiap template component', 'Di functional `HttpInterceptorFn` yang didaftarkan via `provideHttpClient(withInterceptors([...]))`', 'Di dalam `index.html`', 'Di dalam `router.navigate`'],
          'Functional interceptor menangani header lintas-aplikasi serta pencatatan error di satu tempat terpusat.'
        ]
      ]
    },
    guards: {
      title: 'Route guard, resolver, dan pemulihan @boundary',
      why: 'Aplikasi produksi butuh tiga lapisan ketahanan: mencegah pengguna tak terautentikasi masuk ke layar privat, menyiapkan metadata route dengan rapi, dan mengisolasi error widget tak terduga agar satu grafik rusak tidak memutihkan seisi halaman. Ingat: pengecekan route di browser hanya mengatur pengalaman pengguna—API ASP.NET Core tetap menegakkan keamanan nyata.',
      terms: [
        ['`CanActivateFn` / `CanMatchFn`', 'Guard route fungsional yang mengizinkan (`true`), menolak (`false`), atau mengalihkan (`RedirectCommand`) sebelum route ditampilkan.'],
        ['`ResolveFn`', 'Fungsi yang mengambil metadata kecil milik route (seperti judul halaman) sebelum component tujuan dirender.'],
        ['Batas keamanan', 'JS browser selalu bisa dibaca atau dilewati lewat DevTools—hanya server backend yang benar-benar menegakkan izin akses.'],
        ['`@boundary` / `@error`', 'Blok error boundary template Angular (v22.2+) yang menangkap error render secara lokal dan menyediakan `$reset()` untuk mencoba ulang.']
      ],
      points: [
        '**Bagian 1 — Route Guard (`CanActivateFn` & `CanMatchFn`)**: guard adalah fungsi biasa yang berjalan dalam injection context, sehingga `inject()` bisa dipakai langsung. Kembalikan `true` untuk mengizinkan, `false` untuk memblokir, atau `new RedirectCommand(router.parseUrl(\'/login\'))` untuk mengalihkan tanpa reload penuh.',
        '`CanMatchFn` menentukan apakah definisi route itu ikut *cocok* (cocok untuk route berbasis peran di URL yang sama seperti `/home`, turun memeriksa route di bawahnya saat `false`), sementara `CanActivateFn` berjalan setelah route terpilih. Perlu dicatat bahwa guard asinkron di `canActivate: [a, b]` berjalan **serentak**—jangan mengira `a` pasti selesai sebelum `b` mulai.',
        '**Realitas keamanan**: route guard hanya memoles **navigasi UI**. Siapa pun bisa menembak `/api/admin/...` langsung memakai `curl` atau `fetch`, jadi endpoint ASP.NET Core **wajib** memakai `RequireAuthorization()` dan memeriksa kepemilikan data.',
        '**Bagian 2 — Route Resolver (`ResolveFn`)**: memuat data ringan lebih awal (seperti judul halaman dinamis) ke input binding route sebelum render. Hindari panggilan API lambat yang memblokir di resolver tanpa indikator loading, karena navigasi terasa membeku sampai resolver selesai.',
        '**Bagian 3 — Error Boundary (`@boundary` di Angular v22.2+)**: bungkus child component berisiko (grafik pihak ketiga atau data kompleks) dalam **`@boundary { ... } @error { ... }`** agar crash runtime di widget itu merender tampilan fallback lokal dengan tombol Retry **`$reset()`** tanpa merusak seisi halaman.'
      ],
      practice: 'Render `OrdersShell` dengan `broken` awalnya `true`, lihat fallback `@error` muncul menggantikan layar putih kosong, klik Retry, dan pastikan `broken.set(false); $reset()` memulihkan widget di tempat. Lalu panggil endpoint `/api/orders` ASP.NET Core milikmu via `curl` tanpa token guna memastikan backend tetap memblokir pemanggil tak berizin (`401`).',
      teach: 'Jelaskan kapan memilih `CanMatchFn` dibanding `CanActivateFn`, mengapa route guard merupakan UX bukan keamanan sesungguhnya, dan apa yang dicegah oleh `@boundary` + `$reset()`.',
      analogy: 'Route guard itu tali beludru yang mengarahkan pengunjung museum ke loket tiket (`RedirectCommand`), sementara `RequireAuthorization()` ASP.NET Core adalah pintu brankas baja. `@boundary` adalah sekring listrik untuk satu ruangan agar satu bohlam putus tidak memadamkan seluruh gedung.',
      pitfalls: [
        'Mengira `canActivate` melindungi endpoint server dari panggilan `curl` atau Postman langsung.',
        'Menaruh `@boundary` di dalam component pembungkus mengelilingi `<ng-content />` sambil berharap error markup kiriman parent tertangkap—bungkus component-nya dari template **parent**.',
        'Berharap `guardB` pada `canActivate: [guardA, guardB]` menunggu `guardA` selesai dulu—guard asinkron berjalan serentak.',
        'Menaruh query database lambat tanpa cache ke dalam `ResolveFn` tanpa spinner, membuat tautan terasa macet saat diklik.'
      ],
      quiz: [
        [
          'Mengapa ASP.NET Core tetap harus memverifikasi izin meskipun Angular sudah menjaga `/admin` dengan `canActivate`?',
          ['Guard Angular tidak jalan di iOS', 'Kode browser berjalan di mesin pengguna dan bisa dilewati; hanya backend yang menegakkan keamanan nyata', 'Guard cuma berjalan saat build', 'Token kadaluarsa di `<router-outlet>`'],
          'Guard merapikan alur navigasi bagi pengguna normal; kebijakan server mencegah manipulasi API langsung.'
        ],
        [
          'Bagaimana `canMatch` yang mengembalikan `false` berbeda dari `canActivate` yang mengembalikan `false`?',
          ['`canMatch` langsung melempar error `404`', '`canMatch` melewati kandidat route itu agar router dapat mencocokkan route berikutnya yang memakai path sama', '`canMatch` menonaktifkan lazy chunk', 'Tidak ada bedanya'],
          'Dengan `canMatch`, dua route bisa berbagi `/home` (misalnya dashboard admin vs dashboard pelanggan) dengan bersih.'
        ],
        [
          'Di dalam blok `@boundary { ... } @error { ... }`, apa fungsi memanggil `$reset()`?',
          ['Me-reload seluruh tab browser', 'Menghapus error tertangkap dan mencoba merender ulang sub-pohon `@boundary`', 'Me-reset semua service singleton', 'Memanggil `Router.navigate([\'/\'])`'],
          '`$reset()` mereset error boundary setelah kamu memperbaiki signal atau state pemicunya.'
        ]
      ]
    },
    testing: {
      title: 'Testing zoneless: component, routing, dan HTTP',
      why: 'Tes Angular modern berjalan cepat di **Vitest** di dalam **jsdom** (DOM browser tiruan di Node.js) tanpa Zone.js. Alih-alih mendorong change detection secara manual, tesmu meniru cara pengguna nyata berinteraksi: ubah input atau picu klik, tunggu scheduler Angular selesai lewat `await fixture.whenStable()`, lalu periksa teks dan status aksesibilitas di layar.',
      terms: [
        ['Vitest & jsdom', 'Vitest adalah runner tes yang cepat (`describe`/`it`/`expect`); jsdom menyediakan elemen `document`/DOM browser tiruan di Node tanpa membuka Chrome.'],
        ['`TestBed`', 'Kotak pasir pengujian Angular untuk membuat component (`TestBed.createComponent`) beserta service atau provider tiruan.'],
        ['`await fixture.whenStable()`', 'Menjeda tes hingga Angular selesai merender pembaruan signal zoneless dan microtask yang tertunda dengan rapi.'],
        ['`HttpTestingController`', 'Mock pengujian yang mencegat panggilan `HttpClient` dan `httpResource` agar tes bisa memeriksa request secara tepat dan membalas data palsu secara offline.']
      ],
      points: [
        '**Ritme tes zoneless (`Act -> await fixture.whenStable() -> Assert`)**: picu klik, event input, atau perubahan signal, tunggu `await fixture.whenStable()` agar Angular merender secara alami, lalu periksa DOM. Jangan memaksa **`fixture.detectChanges()`** manual—deteksi paksa menutupi signal yang terlewat dan menyembunyikan bug reaktivitas.',
        '**Keunikan timing pada `httpResource`**: karena `httpResource` langsung mengantrekan task jaringan begitu effect-nya jalan, memanggil `await fixture.whenStable()` langsung akan membuat tes menggantung menunggu jaringan! Panggil **`TestBed.tick()`** satu kali tepat sesudah `createComponent()` agar request terkirim, balas lewat **`http.expectOne(...).flush(...)`**, barulah `await fixture.whenStable()`.',
        '**Menguji API HTTP secara offline**: pasang `[provideHttpClient(), provideHttpClientTesting()]` ke `TestBed.configureTestingModule`, periksa method/URL/body via `HttpTestingController`, kirim balik respons `200`/`201`/`400 ProblemDetails` realistis, dan selalu jalankan **`http.verify()` di `afterEach`** guna menangkap request liar atau ganda.',
        '**Menguji halaman ber-route**: gunakan **`RouterTestingHarness.create()`** bersama `provideRouter(routes, withComponentInputBinding())` asli alih-alih me-mock `Router` manual—cara ini sekalian menguji guard, parameter URL, dan input binding.',
        '**Periksa seperti pengguna & pembaca layar**: cari teks yang terender, label semantik, dan `[aria-invalid]` / `role="alert"` alih-alih mengintip field `private`/`protected` component. Gunakan CDK Component Harness (`TestbedHarnessEnvironment`) untuk widget `@angular/aria` atau Material.'
      ],
      practice: 'Tambahkan `it(...)` kedua ke spec ini untuk mengecek jalur sukses: flush respons `201` di `POST /api/products`, tangkap `httpResource.reload()` yang menembak `GET /api/products` baru, flush daftar 2 item terbaru, dan pastikan nama produk baru ikut tampil di DOM terender.',
      teach: 'Jelaskan mengapa tes zoneless menunggu `fixture.whenStable()` alih-alih memanggil `fixture.detectChanges()`, mengapa `TestBed.tick()` mendahului flush `httpResource` awal, dan apa yang ditangkap `http.verify()`.',
      analogy: '`await fixture.whenStable()` itu menunggu di meja saji sampai dapur selesai menata piring sesudah pesanan dikirim. Mengintip ke dapur memakai `detectChanges()` memaksa satu piring keluar secara manual, menyembunyikan apakah bel dapurnya (`signal` / event) benar-benar berbunyi.',
      pitfalls: [
        'Memanggil `fixture.detectChanges()` dalam tes zoneless—menutupi langganan signal yang terlewat dan akan rusak di produksi.',
        'Memanggil `await fixture.whenStable()` *sebelum* me-flush request `httpResource` yang sedang berjalan—request tertunda membekukan stability sebelum `TestBed.tick()` + `.flush()` dijalankan.',
        'Lupa menulis `afterEach(() => http.verify())`, membiarkan panggilan HTTP ganda atau liar terlewat.',
        'Me-mock `Router` manual alih-alih menguji routing dan guard nyata memakai `RouterTestingHarness`.'
      ],
      quiz: [
        [
          'Dalam tes Angular v22 zoneless, bagaimana cara menunggu perubahan signal dan event DOM selesai dirender?',
          ['Memanggil `fixture.detectChanges()` dalam loop', 'Menunggu `await fixture.whenStable()`', 'Memanggil `tick(100)` di dalam `fakeAsync`', 'Mengganti `OnPush` dengan `Eager`'],
          '`whenStable()` menunggu secara alami scheduler render zoneless Angular dan microtask yang sedang berjalan.'
        ],
        [
          'Mengapa `httpResource` di dalam component yang baru dibuat butuh `TestBed.tick()` + `http.expectOne().flush()` *sebelum* `await fixture.whenStable()`?',
          ['`whenStable()` menunggu task resource HTTP yang tertunda selesai lebih dulu', '`TestBed.tick()` mengompilasi template', 'Vitest memblokir HTTP sampai di-tick dua kali', 'Signal tidak bekerja di `beforeEach`'],
          '`httpResource` mendaftarkan pending task selagi mengambil data; menjawab request tiruannya membuka kunci stability dengan bersih.'
        ],
        [
          'Apa yang diperiksa oleh `httpTesting.verify()` di `afterEach`?',
          ['Kecocokan DTO C#', 'Bahwa tidak ada request HTTP tak terduga atau belum di-flush yang tersisa', 'Bahwa animasi CSS sudah berhenti', 'Bahwa CORS dimatikan'],
          'Ia menangkap panggilan API duplikat tak sengaja atau request yang lupa diverifikasi dan dijawab oleh tesmu.'
        ]
      ]
    },
    // ---------------- Expert ----------------
    cd: {
      title: 'Change detection dan performa rendering',
      why: '**Change detection** adalah cara Angular memeriksa datamu lalu memperbarui DOM browser. Memahami bagaimana Angular bergeser dari pemindaian pohon atas-ke-bawah Zone.js (`Eager`) menuju `OnPush` dan **pembaruan Signal lokal zoneless** menjelaskan mengapa Angular modern terasa sangat ringan—serta kesalahan halus apa yang masih bisa memicu kerja berlebih.',
      terms: [
        ['Change detection', 'Proses membandingkan state TypeScript yang baru dengan template lalu menambal bagian DOM browser yang berubah saja.'],
        ['`OnPush` vs `Eager` lama', '`Eager` (bersama Zone.js) memeriksa ulang seluruh component dari root ke bawah tiap ada event apa pun; `OnPush` (default Angular 22) hanya mengecek component bila input-nya berubah, event terjadi di dalamnya, atau signal yang dibacanya berubah.'],
        ['Reference equality (`Object.is`)', '`OnPush` mengecek apakah input menunjuk ke referensi objek/array *baru*, sehingga mutasi di tempat seperti `.push()` pada objek yang sama terabaikan.'],
        ['`afterRenderEffect()`', 'Berjalan *setelah* Angular selesai memperbarui DOM, dibagi ke fase `earlyRead` dan `write` berurutan agar pengukuran layout tidak menimbulkan thrashing.']
      ],
      points: [
        '**`Eager` lama (Zone.js)**: dahulu, Zone.js mem-patch event browser (`click`, `setTimeout`, `fetch`), membuat Angular menyapu seluruh pohon component dari atas ke bawah—termasuk component yang datanya tidak berubah. (`ChangeDetectionStrategy.Default` kini deprecated dan diganti nama menjadi `Eager`, sedangkan **`OnPush` adalah default Angular 22**.)',
        '**Zoneless + Signal**: saat sebuah signal berubah di aplikasi zoneless, Angular hanya menandai *view template spesifik* yang membaca signal tersebut agar direfresh—melewati parent, sibling, dan cabang lain secara menyeluruh.',
        '**Reference equality penting**: `OnPush` memeriksa input component memakai **`Object.is`** (identitas referensi). Jangan memutasi array/objek input di tempat (`items.push(x)`); buat salinan baru (`[...items, x]`) agar child view melihat perubahan tersebut.',
        '**Jaga ekspresi template tetap murah**: jangan menulis `[items]="items().filter(...)"` atau objek literal `{ a: 1 }` langsung di binding HTML—itu membuat array/objek baru di *setiap* pengecekan! Hitung sekali di dalam **`computed()`**, yang menyimpan cache sampai `items()` atau `query()` benar-benar berubah.',
        '**Pengukuran DOM aman (`afterRenderEffect`)**: karena `effect()` berjalan *sebelum* perubahan DOM dicetak, taruh pembacaan/penulisan ukuran dan scroll DOM di `afterRenderEffect({ earlyRead, write })` agar hasil pengukuran tetap akurat tanpa memicu reflow berulang (**layout thrashing**).',
        'Pastikan titik lambat lewat **Angular DevTools** (flamegraph & sorotan change detection) alih-alih menebak, dan virtualisasikan daftar ribuan baris menggunakan **`@angular/cdk/scrolling`**.'
      ],
      practice: 'Buka visualisasi interaktif **Penjelajah change detection** di atas: klik `Card B` di mode `Eager (Zone.js)`, `OnPush`, dan `Zoneless + Signal`, lalu aktifkan `Update shared CartSignal` dan klik `Card B` lagi. Jelaskan mengapa hanya di mode `Zoneless + Signal` komponen `App` dan `ProductList` tetap dilewati.',
      teach: 'Jelaskan bagaimana Signal memampukan Angular hanya menyegarkan `CartBadge` dan `Card B` tanpa Zone.js ataupun berjalan turun dari `App`, serta mengapa `items.push()` merusak input `OnPush`.',
      analogy: 'Change detection Zone.js lama seperti satpam hotel yang memeriksa setiap kamar lantai demi lantai tiap kali satu tamu menekan bel. `OnPush` + Signal adalah papan saklar langsung: hanya kamar yang kabelnya berdering yang menyala, dan tidak ada pintu lain yang diketuk.',
      pitfalls: [
        'Memanggil `items().filter(...)` atau menyusun `{ ... }` langsung di dalam template—membuat referensi baru di setiap check dan menggagalkan cache `computed()`.',
        'Memutasi array di tempat sebelum meneruskannya ke child `OnPush` (`Object.is` melihat referensi array yang persis sama sehingga melewati pembaruan).',
        'Mengubah component lambat ke `ChangeDetectionStrategy.Eager` alih-alih memperbaiki bug mutasi non-signal biasa.',
        'Mengukur `getBoundingClientRect()` di dalam `effect()` (sebelum DOM dirender) alih-alih `afterRenderEffect()`.'
      ],
      quiz: [
        [
          'Strategi `ChangeDetectionStrategy` mana yang aktif secara default di Angular 22?',
          ['`ChangeDetectionStrategy.Eager`', '`ChangeDetectionStrategy.OnPush`', '`ChangeDetectionStrategy.Manual`', 'Polling Zone'],
          'Angular modern menjadikan `OnPush` sebagai bawaan, sementara `Default` dideprecate dan diganti menjadi `Eager` eksplisit.'
        ],
        [
          'Dalam aplikasi zoneless, signal `cartCount` bersama yang hanya dibaca oleh `CartBadge` dan `Card B` diperbarui. View mana yang disegarkan?',
          ['Setiap component dimulai dari `App`', 'Hanya `CartBadge` dan `Card B` (view yang membaca `cartCount`)', 'Hanya `App` dan `ProductList`', 'Tidak ada tanpa `markForCheck()`'],
          'Signal hanya memberi tahu view konsumen yang membacanya saat rendering—melewati parent dan sibling.'
        ],
        [
          'Mengapa menghitung daftar tersaring dengan `computed()` alih-alih memanggil `items().filter(...)` di dalam `@for`?',
          ['Template melarang pemanggilan `.filter()`', 'Pemanggilan template berjalan ulang setiap kali check dan menghasilkan referensi array baru terus-menerus', '`computed()` memanggil server otomatis', 'Loop hanya menerima string'],
          '`computed()` meng-cache referensi array tersaring hingga `items()` atau `query()` benar-benar berubah.'
        ]
      ]
    },
    ssr: {
      title: 'Deferrable view (@defer), SSR, dan hybrid rendering',
      why: 'Pemuatan halaman awal yang cepat bertumpu pada dua alat sekaligus: memecah UI non-kritis ke bundle **`@defer`** on-demand, dan memilih per route apakah HTML dirender di browser (**CSR**), sekali saat deploy (**Prerender / SSG**), atau per request di server Node (**SSR**) dengan **hydration**.',
      terms: [
        ['CSR vs SSG vs SSR', '**CSR** merakit HTML di browser (`RenderMode.Client`); **SSG / Prerender** menyusun HTML statis saat deploy (`RenderMode.Prerender`); **SSR** merender HTML segar di Node tiap request (`RenderMode.Server`).'],
        ['Hydration', 'Menempelkan event listener klik dan reaktivitas signal Angular ke atas HTML server yang sudah tampil tanpa menghapus dan menggambar ulang DOM.'],
        ['LCP & CLS', '**LCP** (Largest Contentful Paint) mengukur seberapa cepat elemen hero utama tampil; **CLS** (Cumulative Layout Shift) mengukur lompatan tata letak mengganggu saat chunk dimuat.'],
        ['`@defer`', 'Blok template yang otomatis memisahkan standalone component menjadi JS chunk tersendiri dan memuatnya saat pemicu terjadi (`on viewport`, `hydrate on interaction`).']
      ],
      points: [
        '**UI chunk malas lewat `@defer`**: bungkus widget sekunder di bawah lipatan layar (grafik, ulasan) dalam `@defer (on viewport; prefetch on idle)`. Angular otomatis memecah `<app-product-reviews />` ke JS chunk-nya sendiri—selama tidak ada kode lain di file yang sama yang mereferensikan `ProductReviews` di luar `@defer`!',
        '**Lindungi LCP dan CLS**: jangan pernah menunda konten hero di atas lipatan layar (merusak **LCP**), samakan tinggi **`@placeholder`** (`min-height`) dengan widget aslinya guna mencegah loncatan **CLS**, dan pasang `(after 100ms; minimum 200ms)` pada `@loading` agar spinner tidak berkedip.',
        '**Hybrid routing (`ServerRoute[]`)**: kombinasikan mode render per URL: `RenderMode.Prerender` untuk halaman katalog/marketing statis (`getPrerenderParams` mendaftar ID yang diketahui), `RenderMode.Server` untuk halaman SEO dinamis, dan `RenderMode.Client` untuk dashboard privat per user.',
        '**Incremental hydration (`provideClientHydration()`)**: sudah disertai event replay di Angular 22+. Menggabungkan **`@defer (on viewport; hydrate on interaction)`** merender HTML di server demi SEO/kecepatan sambil menahan JS berat tertidur hingga pengguna mengklik atau menggulir ke sana.',
        '**Keamanan di server Node**: Node SSR tidak punya `window`, `document`, atau `localStorage` browser! Inject token **`DOCUMENT`** Angular alih-alih `document` global, bungkus kode DOM khusus browser dalam **`afterNextRender()`**, dan anggap `REQUEST` bisa null.',
        '**Jangan bocorkan data privat**: saring endpoint `HttpClient` yang terautentikasi keluar dari `transferCache` SSR (`withHttpTransferCacheOptions`) agar JSON API pribadi tidak tertanam ke dalam HTML server bersama.'
      ],
      practice: 'Taruh grafik berat di dalam `@defer (on viewport; prefetch on idle)` dengan `min-height` tetap pada `@placeholder`, buka DevTools Network (filter ke JS), dan amati chunk baru terunduh persis saat digulir ke area terlihat. Hapus `min-height` sebentar untuk melihat lompatan layout (**CLS**).',
      teach: 'Jelaskan **hydration**, bandingkan `RenderMode.Client`, `RenderMode.Prerender`, dan `RenderMode.Server` dalam bahasa sederhana, serta jelaskan mengapa mengakses `window` di constructor membuat SSR crash.',
      analogy: 'SSR dengan incremental hydration itu menata etalase toko yang terang saat subuh (`RenderMode.Server`) sehingga pejalan kaki langsung melihat barangnya, sambil baru menyalakan eskalator berat di ruang bawah tanah (`hydrate on interaction`) ketika ada orang melangkah naik.',
      pitfalls: [
        'Mereferensikan component yang dibungkus `@defer` di bagian lain file yang sama di luar `@defer` (misalnya `viewChild(ProductReviews)`), memaksanya kembali ke bundle utama.',
        'Menunda judul/gambar hero di atas lipatan layar (merusak LCP) atau membiarkan `@placeholder` kosong bertinggi nol (merusak CLS).',
        'Memanggil `window.localStorage` atau `document.title` langsung di constructor component—mematahkan SSR di Node.',
        'Membiarkan endpoint user terautentikasi tersimpan di transfer cache HTTP SSR tanpa menyaring request privat.'
      ],
      quiz: [
        [
          'Apa yang menghalangi component di dalam `@defer` berpindah ke JS chunk lazy tersendiri?',
          ['Menambah `@placeholder`', 'Mereferensikan class component tersebut di tempat lain dalam file yang sama di luar `@defer` (misalnya `viewChild`)', 'Menambah `prefetch on idle`', 'Menambah CSS style'],
          'Referensi eager apa pun di ruang lingkup file TypeScript/template yang sama memaksa bundler menahan component di chunk utama.'
        ],
        [
          '`RenderMode` mana yang paling cocok untuk dashboard pengaturan akun yang butuh login dan tidak perlu diindeks mesin pencari?',
          ['`RenderMode.Prerender`', '`RenderMode.Client`', '`RenderMode.Server` dengan cache publik', 'File teks mentah'],
          'Dashboard privat per pengguna tidak diuntungkan oleh SSR/SSG dan menghemat beban server lewat rendering sisi client.'
        ],
        [
          'Di mana pekerjaan DOM khusus browser (membaca posisi scroll atau `localStorage`) seharusnya berjalan di component SSR?',
          ['Langsung di `constructor`', 'Di dalam `afterNextRender()` atau `afterRenderEffect()`', 'Di dalam config `ServerRoute`', 'Di dalam `@Pipe`'],
          '`afterNextRender()` melewati eksekusi server Node sepenuhnya dan baru berjalan satu kali di browser sesudah hydrate.'
        ]
      ]
    },
    arch: {
      title: 'Arsitektur, aksesibilitas, dan Angular Aria',
      why: 'Aplikasi yang mudah dirawat menata file berdasarkan fitur bisnis, menempatkan tiap jenis state pada pemilik yang tepat, menjaga tipe backend/frontend tersinkron lewat OpenAPI, dan membangun widget interaktif (tab, dropdown, combobox) dengan **Angular Aria** alih-alih click handler pada `<div>` yang tidak aksesibel.',
      terms: [
        ['Folder fitur (`core/` / `features/` / `shared/`)', 'Mengelompokkan file berdasar peran: `core/` menyimpan singleton aplikasi & model, `features/` menyimpan halaman bisnis, dan `shared/` menyimpan widget UI pakai ulang murni.'],
        ['Headless UI (`@angular/aria`)', 'Directive khusus perilaku yang memberi peran WAI-ARIA, atribut `aria-selected`/`aria-expanded`, dan navigasi panah keyboard sementara 100% HTML & CSS tetap milikmu.'],
        ['Codegen OpenAPI', 'Men-generate interface TypeScript otomatis dari kontrak `/openapi/v1.json` ASP.NET Core (`openapi-typescript`) alih-alih menyalin DTO secara manual.'],
        ['Roving focus', 'Pola keyboard (dipakai di dalam toolbar dan tab) saat Tab masuk ke widget satu kali dan tombol Panah Kiri/Kanan menggeser fokus antar-tab.']
      ],
      points: [
        '**Susun berdasar fitur**: taruh service auth/config tingkat aplikasi dan model domain (`product.model.ts`) di `core/`, bagian halaman route di `features/products/`, dan component presentasional murni (hanya terima `input()`, kirim `output()`, tanpa HTTP) di `shared/ui/`.',
        '**Cocokkan state dengan pemiliknya**: **pembacaan server** tinggal di `httpResource`, **filter/halaman yang bisa di-bookmark** tinggal di **URL** (`withComponentInputBinding()`), **draft isian pengguna** tinggal di **`form()`**, **buka/tutup UI lokal** tetap di **`signal()`**, dan **cart/sesi bersama** tinggal di `@Service()` yang mengekspos `.asReadonly()`.',
        '**Jaga C# dan TypeScript sinkron lewat OpenAPI**: ASP.NET Core menerbitkan skema di `/openapi/v1.json`. Alat seperti `openapi-typescript` men-generate ulang tipe DTO TypeScript otomatis agar perubahan nama di backend langsung menggagalkan build Angular saat kompilasi—bukan saat produksi.',
        '**Styling dengan Tailwind CSS v4**: Angular modern cukup menulis `@import \'tailwindcss\';` langsung di CSS (tanpa perlu file `tailwind.config.js` gaya lama).',
        '**Widget kompleks aksesibel lewat `@angular/aria`**: HTML polos cukup untuk tombol dan tautan, namun tab, accordion, dan combobox butuh tombol panah keyboard ketat, roving focus, dan pembaruan `aria-selected`. `@angular/aria` menyediakan **headless directive** (`ngTabs`, `ngTabList`, `ngTab`, `ngTabPanel`, `ngCombobox`) sementara HTML dan CSS sepenuhnya bebas kamu atur.',
        '**Checklist aksesibilitas menyeluruh**: pakai tag semantik dulu (`<button>`, `<nav>`, `<main>`), `<label for>` eksplisit + error `aria-describedby`, garis fokus `:focus-visible` yang jelas, `title` route unik, dan styling langsung kondisi ARIA aktif (`[aria-selected=\'true\']`).'
      ],
      practice: 'Bangun pemilih negara dengan pencarian memakai `@angular/aria/combobox` + `@angular/aria/listbox`, beri gaya `[aria-selected=\'true\']` dan `:focus-visible`, lalu uji bahwa kamu bisa membuka, menyaring, memilih dengan Panah + Enter, dan menutup dengan Escape memakai **keyboard saja**. Lalu lihat output `/openapi/v1.json` ASP.NET Core milikmu untuk melihat bagaimana skema memetakan ke interface TypeScript.',
      teach: 'Jelaskan apa arti **headless UI** (`@angular/aria`), mengapa memberi gaya `[aria-selected=\'true\']` lebih aman daripada mengatur class CSS `.active` terpisah, serta cara menentukan di mana suatu state sebaiknya tinggal.',
      analogy: 'Angular Aria adalah setir, rem, dan lampu sein tersembunyi di dalam mobil: kamu bebas memahat bodi dan dashboard luar (HTML + Tailwind CSS) sesuka hati, sementara directive-nya menjamin navigasi keyboard dan sinyal pembaca layar bekerja aman sejak awal.',
      pitfalls: [
        'Menaruh panggilan API (`HttpClient`) atau logika bisnis di dalam tombol atau kartu pakai ulang di `shared/ui/`.',
        'Memakai elemen `<div>` untuk diklik sebagai tab atau dropdown (`<div (click)="...">`)—mustahil dijangkau tombol Tab atau Panah dan tak terbaca pembaca layar.',
        'Menyalin properti DTO C# secara manual ke file TypeScript alih-alih men-generate tipe dari `/openapi/v1.json`.',
        'Menambahkan class CSS `.active` kustom terpisah dari `[aria-selected=\'true\']`, membuat status visual dan teknologi bantu mudah tidak sinkron.'
      ],
      quiz: [
        [
          'Apa yang ditangani `@angular/aria` yang tidak bisa dilakukan CSS polos?',
          ['Mengompilasi utilitas Tailwind', 'Mengelola peran WAI-ARIA, atribut `aria-*`, roving focus, serta interaksi panah keyboard sembari membiarkanmu bebas men-style', 'Men-generate model C#', 'Menjalankan server SSR'],
          'Directive headless merangkum perilaku keyboard dan pembaca layar yang rumit sambil menyerahkan 100% HTML dan CSS kepadamu.'
        ],
        [
          'Bagaimana seharusnya CSS menyoroti `ngTab` yang aktif di Angular Aria?',
          ['Dengan `.ng-tab-active`', 'Dengan `.tab-btn[aria-selected=\'true\']`', 'Dengan `::ng-deep`', 'Hanya lewat JavaScript'],
          'Angular Aria menyetel `aria-selected` asli secara otomatis, sehingga sorotan visual terikat langsung ke status aksesibilitas.'
        ],
        [
          'Di mana filter pencarian produk aktif dan nomor halaman pagination sebaiknya disimpan?',
          ['Di dalam field service privat saja', 'Di query parameter URL yang diikat lewat `withComponentInputBinding()`', 'Di `sessionStorage`', 'Di dalam `ProductRow`'],
          'State URL bertahan melewati refresh browser dan tombol Back/Forward serta memungkinkan pengguna membagikan tautan terfilter.'
        ]
      ]
    }
  }
};
