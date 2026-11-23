// Indonesian translation for the Angular track (exact parity with data/angular.js).
export const trackId = {
  id: 'angular',
  tagline: 'Framework frontend lengkap: component, Signal, dependency injection, Signal Forms, HTTP, hingga SSR.',
  lessons: {
    components: {
      predict: {
        prompt: "Di template Angular, developer menulis `<button type=\"button\" (click)=\"() => toggle()\">Select</button>` bukannya `(click)=\"toggle()\"`. Apa yang terjadi saat tombol diklik user?",
        options: [
          "`toggle()` berjalan normal di setiap klik",
          "Tidak terjadi apa-apa: Angular hanya mengevaluasi ekspresi menjadi objek arrow function baru tanpa memanggilnya",
          "Angular menolak mengompilasi template tersebut",
        ],
        answer: 1,
        explain: "Berbeda dari `onClick={() => toggle()}` di React, event binding Angular langsung mengeksekusi pernyataan template saat event muncul. Membungkusnya dengan `() =>` hanya membuat lalu membuang fungsi di tiap klik.",
      },
      title: 'Component, template, dan binding',
      why: 'Setiap halaman Angular tersusun dari potongan UI kecil bernama component. Begitu paham cara class TypeScript menyimpan data lalu template HTML menampilkannya dan merespons aksi user, framework ini langsung masuk akal.',
      terms: [
        ['Component', 'Satu blok UI yang bisa dipakai ulang: class TypeScript penyimpan data dan aksi klik, berpasangan dengan template HTML-nya sendiri.'],
        ['Decorator (`@Component`)', 'Penanda berawalan `@` di atas class yang memberi tahu Angular nama tag HTML (`selector`) dan markup (`template`) milik component itu.'],
        ['`selector`', 'Nama tag HTML kustom (seperti `app-product-card`) untuk memanggil component ini di dalam template lain.'],
        ['Binding', 'Menghubungkan data atau method di class TypeScript langsung ke teks HTML, properti elemen, atau event klik user.']
      ],
      points: [
        'Sebuah component Angular memadukan class TypeScript dengan decorator `@Component({ ... })`. Decorator ini menentukan dua hal inti: `selector` untuk nama tag HTML (misalnya `\'app-product-card\'`), dan `template` untuk isi HTML-nya.',
        'Untuk memakai component di template lain, daftarkan class-nya ke `imports: [ProductCard]` di `@Component(...)` milik parent. Kalau tag itu tidak butuh isi HTML di antara tag buka dan tutup, tulis ringkas `<app-product-card />`.',
        'Template menghubungkan data lewat tiga cara: `{{ name }}` (interpolasi) mencetak teks ke HTML, `[disabled]="outOfStock"` (property binding) mengisi properti DOM dari TypeScript, dan `(click)="select()"` (event binding) menjalankan method saat elemen diklik.',
        'Kurung siku `[disabled]="outOfStock"` penting untuk nilai boolean. Di HTML biasa, `disabled="false"` tetap mematikan tombol karena atributnya ada, sedangkan `[disabled]="false"` mengirim nilai boolean `false` langsung ke properti DOM JavaScript.',
        'Di dalam class Angular, `readonly` mencegah field atau signal terganti tanpa sengaja. Sementara `protected` membuka akses ke template component sendiri sambil menyembunyikannya dari parent.',
        'Aplikasi dimulai dari `main.ts` lewat panggilan `bootstrapApplication(App)`, yang menempelkan root component `App` ke dalam `<app-root></app-root>` di `index.html`.'
      ],
      practice: 'Buat project baru dengan `npx @angular/cli@latest new shop-ng` lalu ganti root component memakai kode di atas. Jalankan `npx ng serve`, buka browser, lalu tambahkan properti `clickCount = 0` yang bertambah tiap kali `toggle()` dipanggil. Lihat error yang muncul kalau kamu menghapus `ProductCard` dari `imports: [ProductCard]` atau menulis `(click)="() => toggle()"` bukan `(click)="toggle()"`.',
      teach: 'Jelaskan fungsi `@Component`, `selector`, `imports`, `{{ value }}`, `[disabled]`, dan `(click)` satu per satu dengan bahasa sederhana ke orang yang belum mengenal Angular.',
      analogy: 'Component itu seperti tag HTML buatanmu sendiri (`<app-product-card />`) dengan otak TypeScript di belakangnya. Kurung kurawal ganda `{{ }}` mencetak data ke layar, kurung siku `[ ]` mengirim nilai ke properti HTML, dan tanda kurung `( )` mengirim aksi user balik ke class.',
      pitfalls: [
        'Memasang `<app-product-card />` di template parent tapi lupa memasukkan `ProductCard` ke array `@Component({ imports: [...] })`.',
        'Menulis `(click)="() => toggle()"` di template. Angular hanya mengeksekusi fungsi panahnya saat diklik tanpa memanggil isinya, jadi tulis `(click)="toggle()"`.',
        'Menandai field yang dipakai template sebagai `private`. Compiler template Angular mengecek ketat dan butuh `protected` atau `readonly` publik.',
        'Di tutorial Angular versi lama ada pembungkus `NgModule` selain `imports: [...]` di `@Component`. Angular modern tidak membutuhkannya lagi.'
      ],
      quiz: [
        [
          'Apa yang perlu ditambahkan supaya template parent mengenali tag `<app-product-card />`?',
          ['File konfigurasi `NgModule`', '`ProductCard` di array `@Component({ imports: [...] })` milik parent', 'Tag `<link>` HTML di `index.html`', 'Menurunkan `ProductCard` dengan `extends`'],
          'Tiap component mendaftarkan sendiri component lain yang dipakainya lewat array `imports`.'
        ],
        [
          'Apa yang terjadi jika kamu menulis `(click)="() => toggle()"` di template Angular?',
          ['`toggle()` jalan saat diklik', 'Tidak terjadi apa-apa karena klik hanya mengevaluasi fungsi panah tanpa menjalankan `toggle()`', 'Angular gagal compile', '`toggle()` jalan sekali saat halaman dibuka'],
          'Event binding mengeksekusi ekspresi langsung saat event terjadi, jadi panggil method-nya lewat `(click)="toggle()"`.'
        ],
        [
          'Mengapa lebih baik memakai `[disabled]="isOutOfStock"` ketimbang `disabled="{{ isOutOfStock }}"`?',
          ['Property binding mengirim boolean `true`/`false` asli ke elemen DOM', 'Kurung siku memberi style tombol otomatis', 'HTML tidak mendukung atribut di tombol', 'Hanya lebih cepat di ponsel'],
          'Di atribut HTML, bahkan `disabled="false"` tetap mematikan tombol karena atributnya ada. `[disabled]` mengisi properti boolean DOM dengan benar.'
        ]
      ]
    },
    flow: {
      predict: {
        prompt: "Daftar input memakai `@for (p of products; track $index)` lalu user mengetik catatan di item `A` pada indeks `0`. Kemudian item baru `X` disisipkan di depan (indeks `0`). Di mana catatan itu tampil?",
        options: [
          "Ikut turun bersama item `A` ke indeks `1`",
          "Tetap menempel di indeks `0` pada baris milik item baru `X`",
          "Angular otomatis mengosongkan semua input saat array disisipi di depan",
        ],
        answer: 1,
        explain: "Dengan `track $index`, Angular memakai ulang baris DOM `0` untuk item apa pun yang kini di indeks `0` (`X`), sehingga isi `<input>` lama menempel di baris yang salah. Memakai `track p.id` memindahkan baris DOM mengikuti `A`.",
      },
      title: 'Control flow, pipe, dan slot konten',
      why: 'HTML biasa tidak bisa mengulang array, mengganti tabel dengan spinner loading, atau memformat `240` menjadi `$240.00`. Angular menambahkan blok template `@if`, `@for`, dan `@switch`, operator pemformatan bernama pipe, serta slot `<ng-content />` agar template tetap ekspresif namun mudah dibaca.',
      terms: [
        ['Control flow', 'Blok template (`@if`, `@for`, `@switch`) untuk menampilkan, mengulang, atau memilih bagian HTML sesuai kondisi.'],
        ['`track`', 'Ekspresi ID yang wajib ada di `@for` (seperti `track p.id`) agar Angular mengenali tiap baris saat data berubah dan tidak merender ulang seluruh daftar.'],
        ['Pipe (`|`)', 'Operator pemformatan di template (seperti `{{ price | currency }}`) yang mengubah tampilan tanpa merusak data aslinya.'],
        ['Content projection (`<ng-content />`)', 'Membuat slot di component pembungkus agar parent bisa menyelipkan HTML kustom di tengah-tengah tag tersebut.']
      ],
      points: [
        'Blok **`@if` / `@else if` / `@else`** menampilkan atau menyembunyikan elemen sesuai kondisi. **`@for (p of products; track p.id)`** mengulang markup untuk tiap item, dan blok opsional **`@empty`** tampil saat array kosong.',
        'Setiap `@for` butuh **`track`** supaya Angular tahu elemen DOM mana milik item data yang mana. Memakai ID unik yang stabil (`track p.id`) membuat penyisipan atau pengurutan cukup menggeser elemen DOM yang ada, menjaga posisi fokus dan scroll.',
        '**`@switch (value)`** membandingkan dengan `===` dan tidak lanjut ke cabang berikutnya. Jika ekspresinya berupa union TypeScript seperti `\'loading\' | \'ready\' | \'error\'`, akhiri dengan **`@default never;`** agar compiler memblokir build bila suatu saat kamu lupa menambah cabang baru.',
        '**Pipe** seperti `{{ p.price | currency }}` memformat nilai di template tanpa mengubah data sumber. Class `@Pipe({ name: \'truncate\' })` harus murni: hasil selalu sama untuk input yang sama. Kalau logika formatnya mau dipakai di file TypeScript biasa, ekstrak ke fungsi seperti `truncateText` dan panggil dari kedua tempat.',
        '**Content projection** menyulap component menjadi pembungkus fleksibel (`<app-badge-card>...</app-badge-card>`). `<ng-content />` polos menangkap isi utama, sementara `select="[card-badge]"` memakai selector atribut CSS untuk mengarahkan elemen beratribut tersebut ke slot khusus (isi di dalam `<ng-content>Default</ng-content>` tampil sebagai fallback).'
      ],
      practice: 'Pertama, tebak apa yang terjadi bila kamu menambah `\'paused\'` ke `type LoadState` tanpa cabang `@case (\'paused\')`, lalu tambahkan dan baca pesan error compiler akibat `@default never;`. Setelah itu ubah `products` menjadi `[]` untuk melihat fallback `@empty`, lalu pastikan `truncateText(\'USB-C Docking Station\', 10)` bekerja lewat `| truncate: 10` di template maupun dipanggil di TypeScript.',
      teach: 'Jelaskan mengapa `@for` butuh `track p.id`, apa fungsi pipe (`|`), dan cara kerja `<ng-content select="[card-badge]" />` ke orang yang baru tahu HTML dan CSS.',
      analogy: 'Bayangkan `track` di `@for` seperti tag nama di tiap koper. Saat urutan koper di ban berjalan berubah, Angular cukup membaca tag (`p.id`) dan menggeser elemen DOM yang cocok daripada membongkar lalu merakit semuanya dari awal. Sedangkan `<ng-content />` seperti bingkai foto berjendela yang bisa diisi gambar berbeda.',
      pitfalls: [
        'Memakai `track $index` untuk daftar yang item-nya sering disisipkan di atas, diurutkan ulang, atau dihapus. Nomor urut yang bergeser bikin Angular menukar baris DOM yang salah.',
        'Lupa memasukkan `CurrencyPipe` atau custom pipe (`TruncatePipe`) ke `@Component({ imports: [...] })`.',
        'Mencoba memanggil class `@Pipe` langsung di kode TypeScript biasa daripada mengekstrak fungsi bersama seperti `truncateText()`.',
        'Di tutorial Angular lama kamu mungkin masih melihat `*ngIf` dan `*ngFor`. Blok bawaan `@if` dan `@for` tidak perlu di-import dan lebih cepat.'
      ],
      quiz: [
        [
          'Mengapa `@for` mewajibkan ekspresi `track` seperti `track p.id`?',
          ['Untuk mengurutkan item sesuai abjad', 'Agar Angular mengenali tiap item saat array berubah dan memakai ulang elemen DOM-nya', 'Untuk mengubah key menjadi huruf besar', 'Untuk menyembunyikan item kosong'],
          'ID yang stabil membantu Angular melacak elemen mana yang bergeser atau tetap sama sehingga baris lain tidak dibangun ulang.'
        ],
        [
          'Apa jaminan dari menulis `@default never;` di akhir `@switch`?',
          ['Tidak ada yang dirender bila tidak cocok', 'Build error di compile time tiap kali cabang union type lupa ditangani', 'Error runtime di browser', 'Pencocokan huruf kecil otomatis'],
          'Trik ini memakai pengecekan tipe `never` milik TypeScript agar semua kemungkinan nilai union pasti punya `@case` masing-masing.'
        ],
        [
          'Bagaimana cara terbaik berbagi logika pemformatan antara pipe template dan kode TypeScript biasa?',
          ['Salin tempel kodenya ke dua file', 'Ekstrak ke fungsi TypeScript biasa seperti truncateText lalu panggil dari pipe dan tempat lain', 'Bungkus seluruh aplikasi dengan CurrencyPipe', 'Menaruh `@for` di dalam pipe'],
          'Pipe hanyalah pembungkus tipis di atas fungsi biasa, jadi mengekstrak fungsinya menjaga template dan TypeScript tetap sinkron.'
        ]
      ]
    },
    signals: {
      title: 'State reaktif: signal, computed, linkedSignal, dan effect',
      predict: {
        prompt: 'Anggap `qty` bernilai `0` dan `discount = computed(() => qty() > 0 && hasCoupon() ? 15 : 0)`. Kalau kamu mengubah `hasCoupon.set(true)` sementara `qty()` masih `0`, berapa kali `discount()` dihitung ulang?',
        options: ['1 kali (dihitung ulang menjadi 0)', '0 kali (`hasCoupon` belum dilacak karena kondisi kiri gagal dulu)', 'Error karena ada pembacaan yang tidak dilacak'],
        explain: 'Signal melacak dependensi tiap kali fungsi dievaluasi. Karena `qty() > 0` bernilai `false`, operator `&&` berhenti di sisi kiri sebelum membaca `hasCoupon()`, sehingga perubahan `hasCoupon` tidak memicu hitung ulang sampai `qty` positif.'
      },
      why: 'UI berubah karena klik, ketikan, dan timer. **Signal** membungkus setiap nilai yang bisa berubah supaya Angular tahu bagian teks atau atribut mana yang memakainya, lalu memperbarui bagian itu saja tanpa memindai seisi halaman.',
      terms: [
        ['Signal (`signal(val)`)', 'Wadah reaktif berisi nilai. Memanggilnya seperti fungsi (`qty()`) membaca nilainya sekaligus mendaftarkan pembaca untuk update berikutnya.'],
        ['`computed()`', 'Signal turunan read-only yang menghitung hasil saat dibaca, menyimpan cache-nya, dan cuma hitung ulang bila signal yang benar-benar dibacanya berubah.'],
        ['`linkedSignal()`', 'State yang bisa ditulis namun punya nilai default otomatis: reset tiap kali signal sumber berubah, tapi tetap boleh diubah manual lewat `.set()`.'],
        ['`effect()`', 'Fungsi otomatis yang berjalan tiap signal bacaannya berubah, dipakai khusus menyinkronkan ke luar Angular (seperti timer, log, atau `localStorage`).']
      ],
      points: [
        'Buat state reaktif lewat **`signal(initialValue)`**. Baca isinya dengan memanggil fungsinya (`this.qty()`), ganti lewat `.set(next)`, atau ubah dari nilai lama lewat `.update(q => q + 1)`. Selalu buat array atau objek baru, jangan mengubah isi yang lama di tempat.',
        'Hitung nilai turunan memakai **`computed(() => this.price() * this.qty())`**. Nilai hanya dihitung saat dibaca dan disimpan di cache sampai dependensinya berubah. Pelacakannya dinamis: di ekspresi `qty() > 0 && hasCoupon()`, perubahan `hasCoupon` diabaikan selama `qty()` bernilai `0` karena `&&` berhenti sebelum membacanya.',
        'Pakai **`linkedSignal`** saat kamu butuh nilai default cerdas yang tetap boleh **diubah manual** oleh user, misalnya mereset `selectedShipping` saat metode kirim berubah, tapi tetap mempertahankan pilihan user bila opsi itu masih ada.',
        'Pakai **`effect(onCleanup => ...)`** hanya untuk berinteraksi ke luar Angular (`localStorage`, log, canvas, timer), sambil mendaftarkan `onCleanup(...)` untuk membatalkan timer lama. Jangan pakai `effect()` untuk menyalin satu signal ke signal lain; gunakan `computed()` atau `linkedSignal()`.',
        'Pelacakan signal hanya mencatat pembacaan sinkron. Baca semua signal yang diperlukan **sebelum** `await`, dan bungkus pembacaan yang tidak mau ikut dilacak memakai **`untracked(this.qty)`**.'
      ],
      practice: 'Buka visualisasi interaktif **Graf ketergantungan Signal** di atas: setel `qty = 0`, klik toggle `hasCoupon`, lalu lihat `total()` tetap ter-cache karena `qty() > 0 && hasCoupon()` berhenti di kiri sebelum membaca `hasCoupon()`. Lalu buka **Playground TypeScript** (`/play/ts/`), jalankan **Signal Angular** dan **linkedSignal Angular**, dan ubah `price.set(150)` untuk melihat pembaruannya.',
      teach: 'Jelaskan apa itu `signal()`, bagaimana `computed()` menyimpan cache sekaligus melacak cabang dinamis, dan mengapa `linkedSignal()` menyelesaikan kasus di mana orang sering keliru memakai `effect()`.',
      analogy: '`computed` mirip sel rumus di spreadsheet: kamu tidak bisa mengetik langsung di sel itu, dan spreadsheet cuma menghitung ulang kalau sel input yang dibacanya berubah. Sementara `linkedSignal` seperti dropdown ongkir pintar: otomatis pindah ke Reguler saat negara diganti, tapi tetap membolehkanmu memilih Kilat.',
      pitfalls: [
        'Memakai `effect()` untuk menyalin signal A ke signal B (`effect(() => b.set(a() * 2))`), padahal cukup `const b = computed(() => a() * 2)`.',
        'Memodifikasi array di dalam signal langsung (`items().push(x)`) daripada menggantinya lewat `.update(list => [...list, x])`. Referensi array tidak berubah, jadi UI tidak diperbarui.',
        'Membaca signal di dalam `computed` atau `effect` setelah baris `await`. Pelacakan signal berhenti saat eksekusi masuk ke kode asinkron.',
        'Lupa tanda kurung waktu membaca signal di template (`{{ total }}` akan mencetak objek signal-nya, bukan memanggil `{{ total() }}`).'
      ],
      quiz: [
        [
          'Di `computed(() => qty() > 0 && coupon() ? 15 : 0)`, nilai `qty()` sedang `0`. Apa yang terjadi saat `coupon` berubah?',
          ['`computed` error', 'Hasil tetap diambil dari cache tanpa dihitung ulang, karena kondisi kiri langsung berhenti sebelum membaca `coupon()`', 'Dihitung ulang seperti biasa', 'Mengosongkan `qty()`'],
          'Dependensi dicatat tiap kali fungsi berjalan; saat `qty() > 0` salah, `coupon()` tidak sempat dipanggil.'
        ],
        [
          'Primitif mana yang memberi state otomatis reset saat filter berubah, namun tetap boleh diubah manual dengan `.set()`?',
          ['`computed()`', '`linkedSignal()`', '`effect()`', '`untracked()`'],
          '`linkedSignal()` membuat state writable yang otomatis menghitung nilai default baru saat sumbernya berubah.'
        ],
        [
          'Kapan `effect()` tepat digunakan?',
          ['Menyinkronkan API luar seperti `localStorage`, canvas, atau analytics saat signal berubah', 'Menyaring array dari kotak cari', 'Membuat konstanta class', 'Memanggil `.set()` di signal lain tiap kali ada perubahan'],
          'Pakai `computed()` atau `linkedSignal()` untuk state turunan antar-signal, dan sisihkan `effect()` untuk efek ke luar beserta cleanup-nya.'
        ]
      ]
    },
    // ---------------- Intermediate ----------------
    inputs: {
      title: 'API Component: input, output, model, query, dan host',
      why: 'Component bekerja sama lewat kontrak yang jelas: parent mengirim data turun, child mengirim event naik, input form kustom tetap sinkron dua arah via `model()`, dan class kadang butuh akses ke elemen DOM atau tag pembungkus luarnya.',
      terms: [
        ['`input()` / `input.required()`', 'Signal read-only penerima data kiriman dari parent component (`[unitPrice]="25"`).'],
        ['`output()`', 'Pemancar event untuk mengirim notifikasi naik ke parent component (`(addToCart)="onAdded($event)"`).'],
        ['`model()`', 'Signal dua arah yang bisa ditulis ulang dengan singkatan `[(quantity)]="qty"` (gabungan `[quantity]` masuk dan `(quantityChange)` keluar).'],
        ['Elemen host', 'Tag HTML terluar milik component itu sendiri di template parent (seperti `<app-qty-picker>`), diatur lewat `host: { ... }` di `@Component`.'],
        ['Template query (`viewChild`)', 'Signal untuk mengambil elemen anak bertanda (seperti `<input #searchInput />`) di TypeScript sesudah render.']
      ],
      points: [
        'Buat input opsional memakai `input(defaultVal)` dan input wajib memakai `input.required<number>()`. Karena **input adalah signal read-only**, olah nilainya dengan `computed()`, bukan dengan memanggil `this.unitPrice.set(...)`.',
        'Atribut HTML dan properti DOM bekerja berbeda. Di `<app-qty-picker disabled />`, HTML mengirim string kosong `""`. Menambah `{ transform: booleanAttribute }` mengubah atribut kosong itu menjadi boolean `true` (`numberAttribute` melakukan hal serupa untuk angka).',
        'Kirim event kustom memakai `readonly addToCart = output<number>()` dengan nama camelCase tanpa awalan `on` (`selected`, bukan `onSelected`). Untuk state bersama yang bisa diedit kedua sisi seperti stepper angka, `model(1)` membuka jalur input dan output sekaligus sehingga parent cukup menulis sintaks two-way `[(quantity)]="qty"`.',
        'Tandai elemen template memakai `#name` seperti `<input #searchInput />`, lalu ambil referensi elemennya lewat `viewChild(\'searchInput\')` (`contentChild` untuk elemen di dalam `<ng-content />`). Karena query berupa signal, panggil `this.searchInput()?.nativeElement.focus()` setelah render.',
        'Tag `<app-qty-picker>` itu sendiri adalah **elemen host** pembungkus template. Pasang class, atribut (`[attr.*]`), atau event listener di `@Component({ host: { \'class\': \'picker-host\', \'[attr.data-disabled]\': \'disabled()\' } })`.'
      ],
      practice: 'Buat component `StarRating` berisi `readonly max = input(5)` dan `readonly rating = model(0)`. Hubungkan dari parent dengan `[(rating)]="score"`, cek `<app-star-rating>` di DevTools untuk memastikan `host:` memasang `data-rating` saat bintang diklik, lalu fokuskan tombol bintang pertama saat Reset memakai `viewChild`.',
      teach: 'Jelaskan bedanya `input()` plus `output()` dibanding `model()`, alasan `<app-btn disabled />` butuh `booleanAttribute`, serta apa itu **elemen host**.',
      analogy: '`input()` adalah kotak surat satu arah dari parent ke child, `output()` adalah bel yang ditekan child ke atas, dan `model()` adalah papan tulis bersama yang bisa ditulis keduanya. Sedangkan **elemen host** adalah amplop luarnya yang diatur lewat `host: { ... }`.',
      pitfalls: [
        'Memilih nama input yang bentrok dengan atribut HTML standar seperti `title`, `id`, atau `hidden`.',
        'Membaca `viewChild.required()` di constructor atau saat elemennya berada di dalam `@if` yang salah. Angular memicu error `NG0951` sampai view tersebut dirender.',
        'Memanggil `.set()` di signal `input()`. Input tidak bisa ditimpa langsung, jadi beralihlah ke `model()` atau `linkedSignal()` kalau child perlu menulis nilai lokal.',
        'Di kode Angular lama masih sering ditemui `@HostBinding`, `@HostListener`, `ngOnChanges`, dan `ngAfterViewInit`. Kode modern menggantinya dengan `host:`, `computed()`, dan `viewChild()`.'
      ],
      quiz: [
        [
          'Fungsi mana yang membuat signal two-way (`[(value)]`) antara parent dan child?',
          ['`input()`', '`output()`', '`model()`', '`computed()`'],
          '`model()` mengembalikan signal writable yang membuka jalur input `[value]` sekaligus output `(valueChange)`.'
        ],
        [
          'Mengapa `input(false, { transform: booleanAttribute })` membuat parent bisa menulis `<app-qty-picker disabled />`?',
          ['HTML mengirim atribut tanpa nilai sebagai string kosong `""`, lalu `booleanAttribute` mengubahnya menjadi `true`', 'Otomatis mematikan parent component', 'Melewati pemeriksaan TypeScript', 'Mengubah CSS menjadi `Signal`'],
          'Tanpa transform, atribut HTML kosong tiba sebagai `""`. `booleanAttribute` mengonversi keberadaannya menjadi `true`.'
        ],
        [
          'Di mana atribut atau class CSS untuk tag luar `<app-qty-picker>` milik component sebaiknya dipasang?',
          ['Di `constructor` memakai `document.querySelector`', 'Di blok `host: { ... }` pada `@Component(...)`', 'Di `index.html`', 'Di `main.ts`'],
          '`host` menempelkan class, atribut, dan DOM listener ke elemen host milik component itu.'
        ]
      ]
    },
    di: {
      predict: {
        prompt: "Dua `<app-editor-panel />` bersaudara sama-sama meng-inject `CartStore` (`@Service()`) dan `DraftBuffer` (didaftarkan di `providers: [DraftBuffer]` milik `EditorPanel`). Panel 1 memanggil `cart.add(\"Mug\")` dan `localDraft.notes.set(\"VIP\")`. Apa yang dilihat Panel 2?",
        options: [
          "Panel 2 melihat `\"Mug\"` sekaligus `\"VIP\"`",
          "Panel 2 melihat `\"Mug\"` di `cart`, tapi `\"\"` (kosong) di `localDraft`-nya sendiri",
          "Panel 2 tidak melihat keduanya karena component bersaudara tidak pernah berbagi service",
        ],
        answer: 1,
        explain: "`CartStore` adalah singleton root yang dibagi lewat `EnvironmentInjector` aplikasi sehingga kedua panel melihat `\"Mug\"`. `DraftBuffer` didaftarkan di `ElementInjector` milik `EditorPanel`, memberi tiap panel instance terpisah.",
      },
      title: 'Service dan dependency injection',
      why: 'Component fokus ke tampilan, sementara state bersama seperti keranjang belanja atau sesi login serta helper API ditaruh di **service**. Dengan **Dependency Injection (DI)** Angular, component mana saja bisa meminta service bersama tanpa memanggil `new CartStore()` manual, sekaligus memudahkan tes menggantinya dengan objek tiruan.',
      terms: [
        ['Service (`@Service()`)', 'Class TypeScript biasa penyimpan state bersama atau logika bisnis agar bisa dipakai ulang di banyak component.'],
        ['Dependency Injection (DI)', 'Pola ketika Angular membuat dan menyuplai instance class lewat `inject(...)`, sehingga component tidak perlu memanggil `new ...` sendiri.'],
        ['`Injector`', 'Pohon registri pencari milik Angular yang menjawab permintaan `inject(...)` dari tingkat component naik ke root aplikasi.'],
        ['`InjectionToken`', 'Kunci bertipe untuk meng-inject nilai non-class seperti objek konfigurasi atau `DOCUMENT` browser.']
      ],
      points: [
        '**Dependency Injection** memudahkan dua hal: berbagi satu instance (misalnya keranjang belanja) ke banyak component, serta menukarnya dengan mock di tes. Tandai singleton aplikasi memakai **`@Service()`** (ringkasan dari `@Injectable({ providedIn: \'root\' })`), dan service yang tidak dipakai otomatis dibuang saat bundling.',
        'Minta service memakai **`inject(CartStore)`** di field class, constructor, route guard fungsional, atau interceptor HTTP. Memanggil `inject()` di dalam handler klik gagal kecuali dibungkus `runInInjectionContext()`.',
        'Lifetime service mirip ASP.NET Core: `@Service()` membuat satu **singleton se-aplikasi** (`AddSingleton`), sedangkan menaruh service di Route membatasinya ke sub-halaman route itu. Menandai `@Service({ autoProvided: false })` lalu memasukkan `[DraftBuffer]` ke `@Component({ providers: [...] })` memberi tiap instance component salinan terpisah.',
        'Pencarian dependensi menelusuri dua pohon berurutan. Angular mengecek naik di rantai **`ElementInjector`** (`providers` elemen ini lalu elemen parent-nya) sebelum naik ke rantai **`EnvironmentInjector`** (provider route hingga root aplikasi). Pakai `{ optional: true }` untuk mengembalikan `null` saat tidak ketemu, atau `{ skipSelf: true }` untuk mulai mencari dari parent.',
        'Lindungi state service bersama dengan membuat field `signal` writable berstatus `private` (`_items`). Buka akses bacanya lewat `.asReadonly()` bersama method ubah yang jelas seperti `add()`.',
        'Interface TypeScript dan objek setting hilang saat kompilasi ke JS, jadi buat kunci bertipe **`InjectionToken<ApiSettings>`** untuk meng-inject-nya.'
      ],
      practice: 'Tambahkan `readonly instanceId = crypto.randomUUID()` ke `CartStore` dan `DraftBuffer`, lalu tampilkan dua `<app-editor-panel />` bersebelahan di `App`. Pastikan `CartStore` punya satu UUID sama di mana-mana sementara tiap panel mendapat `DraftBuffer` ber-UUID unik, lalu hapus sementara `{ optional: true }` pada `parentDraft` untuk memicu `NullInjectorError`.',
      teach: 'Jelaskan masalah yang diselesaikan Dependency Injection, petakan `@Service()` dan `providers: [...]` di component ke lifetime ASP.NET Core, serta jelaskan mengapa interface konfigurasi butuh `InjectionToken`.',
      analogy: 'Memanggil `inject(Tool)` itu seperti mencari perkakas di bengkel. Kamu cek meja kerjamu dulu (`ElementInjector`), menengok ke meja supervisor (`skipSelf`), lalu jalan ke gudang pusat (`EnvironmentInjector` root) kalau belum ada juga.',
      pitfalls: [
        'Memanggil `inject(MyService)` di dalam event `(click)` atau `setTimeout` daripada menyimpannya sebagai `private readonly svc = inject(MyService)` di field class.',
        'Lupa `{ optional: true }` ketika mengecek service di komponen leluhur. Component akan memicu `NullInjectorError` kalau dirender sendirian.',
        'Membuka field `signal` writable ke publik di service, bukan memakai `.asReadonly()`, membiarkan component mana saja menimpa state bersama.',
        'Perhatikan proyeksi `<ng-content />`: `providers` membagikan service ke child yang diselipkan lewat slot, sedangkan `viewProviders` menyembunyikannya dari mereka.'
      ],
      quiz: [
        [
          'Di mana pemanggilan `inject(CartStore)` sah dilakukan?',
          ['Di dalam handler `(click)`', 'Di inisialisasi field class, constructor, factory, atau functional route guard', 'Di dalam callback `async` sesudah `await`', 'Di sembarang helper statis'],
          '`inject()` membutuhkan injection context Angular yang aktif saat setup class atau pemanggilan guard/HTTP fungsional.'
        ],
        [
          'Dua tag `<app-editor-panel />` bersebelahan masing-masing memasang `DraftBuffer` di `@Component({ providers: [DraftBuffer] })`. Berapa jumlah instance `DraftBuffer`?',
          ['Satu singleton bersama', 'Dua instance terpisah, tiap instance dihancurkan saat panelnya hilang dari layar', 'Nol kecuali ditulis di `main.ts`', 'Compile error'],
          'Mendaftar di `@Component` menempelkan satu instance baru ke `ElementInjector` masing-masing elemen.'
        ],
        [
          'Mengapa memakai `new InjectionToken<ApiSettings>(...)` ketimbang menulis `inject(ApiSettings)` langsung?',
          ['Interface mempercepat pencarian runtime', 'TypeScript menghapus interface saat kompilasi, jadi Angular butuh objek token di runtime', '`@Service()` melarang interface', 'Token mengenkripsi string setting'],
          'Tipe `interface` TypeScript lenyap di hasil kompilasi JS. `InjectionToken` memberi Angular kunci runtime yang nyata.'
        ]
      ]
    },
    routing: {
      title: 'Routing, URL input, dan lazy loading',
      why: 'Aplikasi web butuh URL yang bisa dibagikan seperti `/products/42?tab=reviews` sekaligus loading awal yang cepat. Router Angular mengganti tampilan tanpa reload halaman, meneruskan parameter URL langsung ke signal input, dan mengunduh halaman berat hanya saat dikunjungi.',
      terms: [
        ['SPA (Single-Page Application)', 'Aplikasi web yang mengganti URL dan menukar component di dalam browser tanpa me-reload seluruh halaman HTML.'],
        ['`<router-outlet />`', 'Tag penampung tempat Angular merender component yang cocok dengan URL browser saat ini.'],
        ['Path vs query param', 'Segmen URL wajib (`/products/:id`) dibanding filter pasangan key-value opsional sesudah `?` (`?tab=reviews`).'],
        ['Lazy loading (`loadComponent`)', 'Memecah satu route menjadi file JS tersendiri yang baru diunduh saat user membuka route tersebut.']
      ],
      points: [
        'Atur halaman di array **`Routes`**, daftarkan di `app.config.ts` dengan `provideRouter(routes, withComponentInputBinding(), withViewTransitions())`, lalu pasang **`<router-outlet />`** di tempat halaman aktif harus muncul.',
        'Buat tautan internal memakai **`routerLink`** (dan `routerLinkActive="on"` untuk menandai tab aktif), bukan `<a href="/products/42">`. Tag `href` biasa memuat ulang seluruh halaman dan menghapus semua signal di memori.',
        'Aktifkan **`withComponentInputBinding()`** agar parameter path URL (`:id`), query string (`?tab=reviews`), dan data `title` route otomatis masuk ke **`input()` signal** yang namanya cocok di component tujuan.',
        'Jaga ukuran bundle awal tetap kecil dengan **`loadComponent: () => import(\'./product-detail\').then(m => m.ProductDetail)`** (atau `loadChildren`) ketimbang `component: ProductDetail`. Tiap lazy route hanya mengunduh chunk JS-nya saat dibuka.',
        'Angular membaca `routes` dari atas ke bawah lalu berhenti di pola pertama yang cocok. Taruh route spesifik seperti `products/:id` sebelum rute penangkap semua URL seperti `path: \'**\'`.',
        'Menambahkan `providers: [...]` pada route membentuk `EnvironmentInjector` tingkat route yang dibagikan ke seluruh halaman anaknya lalu dibersihkan ketika pindah.'
      ],
      practice: 'Susun sub-route `overview` dan `reviews` di bawah `products/:id` memakai `children`, taruh `<router-outlet />` kedua di `ProductDetail`, lalu buka tab **Network** DevTools yang disaring ke JS. Klik `routerLink`-mu dan perhatikan chunk-nya baru terunduh saat pindah halaman.',
      teach: 'Jelaskan masalah apa yang dihindari `<a routerLink="...">` dibanding `<a href="...">`, bagaimana `withComponentInputBinding()` menyalurkan param URL, serta mengapa `loadComponent` mempercepat loading awal.',
      analogy: 'Routing seperti direktori gedung beserta ruangan siap pakai saat dibutuhkan. Lobi belum mengisi perabotan ke Ruang 42 (`loadComponent`) sebelum ada pengunjung yang masuk, dan `withComponentInputBinding()` menyelipkan lencana tamu (`:id`) ke ruangan itu sebagai `input()` signal.',
      pitfalls: [
        'Menaruh `{ path: \'**\', ... }` di baris paling atas `routes`. Karena pola pertama yang cocok selalu menang, aturan itu menyedot semua URL.',
        'Menulis `href="/products/42"` ketimbang `routerLink="/products/42"`, yang membuat aplikasi Angular boot ulang tiap diklik.',
        'Lupa memasang `withComponentInputBinding()` di `provideRouter(...)`, sehingga signal `input()` param route bernilai `undefined`.',
        'Menaruh static import `ProductDetail` di atas `app.routes.ts`. Import biasa itu membatalkan pemisahan lazy chunk.'
      ],
      quiz: [
        [
          'Apa yang dilakukan `withComponentInputBinding()` di dalam `provideRouter`?',
          ['Mengenkripsi parameter URL', 'Mengikat path param URL, query param, dan resolved data langsung ke signal `input()` component', 'Memuat ulang file CSS tiap navigasi', 'Mengunduh semua lazy route di awal'],
          'Nilai route mengalir langsung ke signal `input()` yang cocok tanpa membaca `ActivatedRoute` manual.'
        ],
        [
          'Mengapa memakai `loadComponent: () => import(\'./admin\').then(m => m.Admin)` untuk halaman sekunder?',
          ['Menjalankan halaman di background worker', 'Compiler memisahkan `Admin` ke file JS terpisah yang baru dimuat saat dibuka', 'Mengaktifkan SSR otomatis', 'Membagikan satu instance `Admin` di semua tempat'],
          'Dynamic `import()` memecah route ke chunk tersendiri sehingga user hanya mengunduh halaman yang mereka buka.'
        ],
        [
          'Di mana rute cadangan `{ path: \'**\', ... }` harus diletakkan?',
          ['Pertama di dalam `routes`', 'Terakhir di dalam `routes`, karena pencarian berhenti di rute pertama yang cocok', 'Hanya di dalam `children`', 'Sebelum `redirectTo`'],
          'Route dicocokkan dari atas ke bawah, jadi apa pun di bawah `**` tidak akan pernah tercapai.'
        ]
      ]
    },
    forms: {
      title: 'Signal Forms, validasi, dan error yang aksesibel',
      splits: ['1 · Template & ARIA', '2 · Skema & submit()'],
      why: 'Hampir semua aplikasi mengumpulkan input user, mulai dari form daftar sampai checkout, lengkap dengan aturan bersyarat dan pesan error yang jelas. **Signal Forms** Angular (`@angular/forms/signals`) memasangkan model data `signal(...)` dengan skema validasi bertipe aman agar input DOM, status error, dan atribut aksesibilitas selalu sinkron.',
      terms: [
        ['Field vs FieldState (`f.name` vs `f.name()`)', '`productForm.name` adalah pegangan binding yang dikirim ke `[formField]`; memanggil `productForm.name()` mengembalikan signal status hidupnya (`touched()`, `invalid()`, `errors()`).'],
        ['`touched()`', 'Berubah jadi `true` sesudah user keluar dari kolom input atau menekan Submit, supaya pesan error tidak muncul duluan sebelum user mengetik.'],
        ['Skema validasi', 'Aturan di dalam `form(model, s => ...)` (`required`, `min`, `applyWhen` bersyarat, `validate` kustom) untuk mengecek validitas form di satu tempat.'],
        ['`aria-invalid` & `aria-describedby`', 'Atribut aksesibilitas HTML yang memberi tahu pembaca layar saat input error (`aria-invalid="true"`) dan elemen `<p id="...">` mana yang menyimpan pesan error-nya (`aria-describedby`).']
      ],
      points: [
        'Mulai dari **model `signal` non-nullable** dengan nilai awal seperti `\'\'`, `0`, atau `false` (bukan `null`), bungkus dengan **`form(this.model, s => ...)`**, lalu ikat elemen `<input>` dengan **`[formField]="productForm.name"`**.',
        'Karena `[formField]` sudah mengurus `value`, `disabled`, `readonly`, `hidden`, `name`, dan batas min/max, jangan pasang lagi `[value]`, `[disabled]`, `min`, atau `max` di elemen `<input>` HTML.',
        'Bedakan **referensi field** dengan **pemanggilan status**: oper `productForm.name` tanpa `()` ke `[formField]`, dan panggil **`productForm.name()`** pakai `()` tiap kali membaca `.touched()`, `.invalid()`, `.hidden()`, atau `.errors()`.',
        'Tulis aturan di callback skema: **`required()`**, **`min()`**, **`email()`**, **`applyWhen(s.discount, condition, rules)`** (`hidden()` jadi `true` saat dilewati), `applyEach()` untuk array, dan **`validate()`** yang mengembalikan `{ kind, message }` atau `undefined`.',
        'Pasang `novalidate` di `<form>` supaya tooltip bawaan browser tidak menabrak tampilan error-mu, lalu tangani pengiriman lewat **`submit(this.productForm, async () => { ... })`**. Fungsi `submit()` menandai semua field sebagai `touched` dan menjalankan callback `async` hanya kalau valid.',
        'Hubungkan pesan error yang aksesibel memakai `<label for="...">`, `[attr.aria-invalid]`, `[attr.aria-describedby]`, dan `role="alert"` pada teks error agar pengguna keyboard dan pembaca layar langsung menerima informasinya.'
      ],
      practice: 'Tambahkan `sku: \'\'` ke `model` di `ProductForm`. Validasi dengan `pattern(s.sku, /^[A-Z]{3}-\\d{3}$/, { message: \'Use format ABC-123\' })` lalu tambahkan aturan lintas-field `validate()` yang melarang diskon di atas `50` saat `price < 20`. Kirim input tidak valid untuk memastikan pesan error tampil tanpa menjalankan `console.log`.',
      teach: 'Jelaskan beda `productForm.name` dengan `productForm.name()`, mengapa pesan error memeriksa `.touched()`, serta bagaimana `aria-invalid` dan `aria-describedby` membantu pembaca layar.',
      analogy: 'Signal Forms berfungsi seperti panel kontrol yang tersambung ke model `signal`. Mengirim `productForm.name` ke `[formField]` menyambungkan kolom input ke panel, sementara memanggil `productForm.name()` membaca jarum statusnya (`touched()`, `invalid()`, `errors()`).',
      pitfalls: [
        'Lupa tanda kurung waktu membaca status field: `form.name.errors()` gagal, sedangkan `form.name().errors()` berhasil.',
        'Menaruh `null` di nilai awal `signal({ name: null })` ketimbang `\'\'` atau `0`.',
        'Menaruh atribut HTML `[disabled]`, `[value]`, `min`, atau `max` pada `<input [formField]="...">`. Semua aturan harus berada di skema `form()`.',
        'Mengembalikan `null` ketimbang `undefined` saat pengecekan `validate()` lolos. Di aplikasi lama ada juga **Reactive Forms** (`FormGroup`, `Validators`) yang melakukan validasi berbasis model memakai RxJS bukan Signals.'
      ],
      quiz: [
        [
          'Bagaimana cara mengecek apakah `productForm.name` sudah pernah disentuh pengguna?',
          ['`productForm.name.touched()`', '`productForm.name().touched()`', '`productForm().name.touched`', '`productForm.name.get(\'touched\')`'],
          'Memanggil `productForm.name()` menghasilkan `FieldState` yang menyediakan signal `.touched()` dan `.errors()`.'
        ],
        [
          'Di mana aturan angka minimum sebaiknya disimpan untuk `<input type="number" [formField]="productForm.price">`?',
          ['Langsung sebagai atribut HTML `min="1"` pada input', 'Di dalam skema `form()` lewat `min(s.price, 1)`', 'Di dalam handler blur', 'Di dalam `index.html`'],
          '`[formField]` mengatur atribut DOM dari skema sehingga logika validasi dan tampilan selalu sejalan.'
        ],
        [
          'Apa yang dikerjakan `submit(this.productForm, async () => ...)` sebelum menjalankan callback?',
          ['Mengosongkan semua input', 'Menandai seluruh field `touched` agar pesan error tampil, dan melewati callback kecuali form valid', 'Memanggil `fetch()` otomatis', 'Menghapus atribut ARIA'],
          'User yang langsung mengklik Save segera melihat kolom mana yang masih salah, dan form yang tidak valid tidak pernah menjalankan fungsi simpan.'
        ]
      ]
    },
    // ---------------- Advanced ----------------
    rxjs: {
      predict: {
        prompt: "Request `40 ms` dipicu oleh `\"first\"` di `t = 0 ms` lalu `\"second\"` di `t = 10 ms`. Apa yang dipancarkan `triggers$.pipe(switchMap(req))` dibanding `triggers$.pipe(exhaustMap(req))`?",
        options: [
          "Keduanya memancarkan `[\"first\", \"second\"]`",
          "`switchMap` hanya memancarkan `[\"second\"]` (membatalkan `\"first\"`), sedangkan `exhaustMap` hanya memancarkan `[\"first\"]` (mengabaikan `\"second\"`)",
          "`switchMap` memancarkan `[\"first\"]`, sedangkan `exhaustMap` memancarkan `[\"second\"]`",
        ],
        answer: 1,
        explain: "`switchMap` berhenti mendengarkan observable `\"first\"` yang sedang jalan saat `\"second\"` datang sehingga hanya `\"second\"` selesai. `exhaustMap` membuang `\"second\"` selama `\"first\"` masih sibuk, sehingga hanya `\"first\"` yang keluar.",
      },
      title: 'Stream event asinkron: RxJS dan interop Signal',
      why: 'Signal cocok menyimpan *nilai terkini* seperti jumlah barang, total harga, atau status buka/tutup. **RxJS** cocok mengatur **event berurutan seiring waktu**, seperti menunggu 300 ms setelah user berhenti mengetik, membatalkan pencarian usang, atau menolak klik ganda di tombol Bayar. Memahami stream `Observable` juga membantu kamu memahami `HttpClient` dan event router di Angular.',
      terms: [
        ['`Observable`', 'Aliran data bertipe lazy yang mengirim nol, satu, atau banyak nilai dari waktu ke waktu. **Cold** Observable diam saja sampai `.subscribe()` atau `firstValueFrom` memicunya.'],
        ['Operator & `.pipe(...)`', 'Langkah transformasi seperti `debounceTime` atau `switchMap` di dalam `.pipe(...)` untuk menyaring, menunda, atau membatalkan event stream.'],
        ['`switchMap` vs `exhaustMap`', '`switchMap` membatalkan proses async lama saat event baru datang (kotak pencarian); `exhaustMap` mengabaikan klik baru sampai proses yang sedang jalan selesai (tombol Pay).'],
        ['`toSignal()` / `toObservable()`', 'Helper Angular untuk mengubah aliran `Observable` menjadi signal lengkap dengan pembersihan otomatis, serta sebaliknya.']
      ],
      points: [
        'Signal memegang *satu nilai saat ini*, sedangkan **Observable** memodelkan *event dari waktu ke waktu*. Method `HttpClient` Angular menghasilkan **cold Observable**, sehingga panggilan HTTP tidak jalan sampai di-subscribe atau diubah dengan `firstValueFrom()` maupun `toSignal()`.',
        'Atur jeda waktu lewat operator **`.pipe(...)`**: `debounceTime(300)` menunggu 300 ms tanpa ketikan baru, dan `distinctUntilChanged()` membuang kueri yang kembar berturut-turut.',
        'Tiga operator flattening menentukan perilaku saat event baru datang selagi request sebelumnya belum selesai:',
        '`switchMap` membatalkan observable lama yang masih berjalan lalu memakai yang terbaru. Cocok untuk live search agar respons lama tidak menimpa hasil ketikan terbaru.',
        '`exhaustMap` menolak pemicu baru selama satu inner observable masih aktif. Cocok untuk tombol Checkout atau Submit supaya tidak terjadi tagihan ganda.',
        '`concatMap` menjalankan request satu per satu berurutan untuk penulisan bertahap, sedangkan `mergeMap` menjalankan semuanya bersamaan saat urutan tidak penting.',
        'Selalu hentikan langganan saat component ditutup. Pasangkan `.pipe(takeUntilDestroyed())` di constructor atau inisialisasi field, atau ubah aliran menjadi signal dengan **`toSignal(obs$, { initialValue })`**.'
      ],
      practice: 'Buka **Playground TypeScript** (`/play/ts/`), pilih **RxJS switchMap vs exhaustMap**, lalu jalankan untuk melihat `switchMap` membatalkan `\'typing ke\'` sementara `exhaustMap` mengabaikan `\'accidental double-click\'`. Lalu tukar `\'switch\'` dan `\'exhaust\'` di `compareFlattening` untuk menebak hasilnya.',
      teach: 'Jelaskan beda `Observable` dan `Signal`, kapan memilih `switchMap` ketimbang `exhaustMap`, dan mengapa `toSignal()` meniadakan pemanggilan `.unsubscribe()` manual.',
      analogy: '`switchMap` itu seperti koki yang langsung membuang pesanan setengah jadi begitu pembeli teriak "ganti ayam aja!". Sedangkan `exhaustMap` seperti tombol lift: menekannya lima kali saat lift sudah bergerak tidak akan mendatangkan lima lift.',
      pitfalls: [
        'Memakai `mergeMap` untuk fitur pencarian langsung. Balasan lambat untuk `\'la\'` yang tiba sesudah `\'laptop\'` akan menimpa layar dengan hasil lama.',
        'Memanggil `.subscribe(...)` tanpa `takeUntilDestroyed()`, menyisakan timer atau listener jalan terus sesudah pindah halaman.',
        'Lupa memasang `{ initialValue }` di `toSignal(obs$)`, membuat tipe awal signal menjadi `T | undefined` sebelum event pertama keluar.',
        'Menaruh `.subscribe()` bersarang di dalam `.subscribe()` lain bukan merangkainya rata lewat operator seperti `switchMap` atau `exhaustMap`.'
      ],
      quiz: [
        [
          'Operator mana yang membatalkan request HTTP pencarian lama begitu user mengetik huruf baru?',
          ['`mergeMap`', '`concatMap`', '`switchMap`', '`exhaustMap`'],
          '`switchMap` berhenti mendengarkan inner observable sebelumnya (sekaligus membatalkan request HTTP-nya) tiap ada nilai baru.'
        ],
        [
          'User mengklik ganda tombol "Place order". Operator mana yang mengabaikan klik tambahan sampai request pertama selesai?',
          ['`switchMap`', '`exhaustMap`', '`mergeMap`', '`debounceTime`'],
          '`exhaustMap` membuang pemicu baru dari hulu selagi inner observable masih bekerja.'
        ],
        [
          'Apa yang ditangani `takeUntilDestroyed()` untukmu?',
          ['Mengulang panggilan jaringan tiga kali', 'Otomatis unsubscribe saat component atau service dihancurkan', 'Mengubah signal menjadi JSON', 'Mengurutkan array kiriman'],
          'Operator ini mengaitkan masa hidup langganan ke `DestroyRef` milik Angular.'
        ]
      ]
    },
    http: {
      predict: {
        prompt: "Di dalam handler klik, kamu menulis `this.http.post(\"/api/products\", payload);` tanpa `.subscribe()` maupun `await firstValueFrom(...)`. Apa yang muncul di tab Network browser?",
        options: [
          "Satu request `POST /api/products` dengan respons yang diabaikan",
          "Nol request jaringan: `HttpClient` mengembalikan cold `Observable` yang tidak berjalan sebelum di-subscribe",
          "Error runtime sinkron dari TypeScript",
        ],
        answer: 1,
        explain: "`HttpClient` Angular menghasilkan cold Observable—memanggil `.post()` cuma menyusun rencananya. Tidak ada request keluar browser sampai kamu subscribe atau mengubahnya lewat `await firstValueFrom(...)`.",
      },
      title: 'HTTP, httpResource, dan berkomunikasi dengan ASP.NET Core',
      splits: ['1 · Mapper ApiError', '2 · Interceptor', '3 · Component + loader'],
      why: 'Di bagian ini Angular tersambung ke backend ASP.NET Core dan database kamu. Kamu memakai **`httpResource`** untuk memuat data `GET` reaktif, serta **`HttpClient`** (lengkap dengan interceptor dan proteksi XSRF bawaan) untuk operasi tulis dan error `ProblemDetails` terstruktur.',
      terms: [
        ['`httpResource()`', 'Loader `GET` berbasis signal yang melacak signal di fungsi URL-nya, membatalkan request usang, serta membuka `.isLoading()`, `.error()`, dan `.value()`.'],
        ['`HttpInterceptorFn`', 'Middleware fungsional yang berjalan di tiap request keluar dan response masuk untuk memasang header auth, request ID, atau penanganan error terpusat.'],
        ['CORS vs Dev Proxy', 'Browser memblokir `localhost:4200` memanggil `localhost:5000` kecuali ASP.NET Core mengaktifkan **CORS** (`AddCors`), atau Angular CLI meneruskan `/api` lewat `proxy.conf.json`.'],
        ['`ProblemDetails` & XSRF', 'RFC 9457 `ProblemDetails` adalah format error JSON standar ASP.NET Core (`title` + `errors`); **XSRF** (cookie `XSRF-TOKEN` ke header `X-XSRF-TOKEN`) menahan form POST palsu lintas situs.']
      ],
      points: [
        'Gunakan **`httpResource(() => \'/api/products?q=\' + query())`** untuk pembacaan `GET` reaktif. Tiap signal di callback berubah, Angular membatalkan request lama dan mengambil URL baru (kembalikan `undefined` untuk menahan fetch).',
        'Cek `.hasValue()` atau `.error()` sebelum membaca **`products.value()`**, sebab memanggil `.value()` setelah request gagal akan memicu error.',
        'Pakai method **`HttpClient`** (`post`, `put`, `patch`, `delete`) untuk perubahan data. Karena `HttpClient` menghasilkan **cold `Observable`**, belum ada apa pun yang dikirim ke server sampai kamu memanggil `firstValueFrom(...)` atau subscribe.',
        'Daftarkan middleware via `provideHttpClient(withInterceptors([requestIdInterceptor]))` di `appConfig`. Objek `HttpRequest` bersifat immutable, jadi gandakan lewat `req.clone({ setHeaders: ... })` sebelum diteruskan ke `next(...)`.',
        'Tangkap `HttpErrorResponse` untuk memetakan **`ProblemDetails`** ASP.NET Core (`title` dan `errors` seperti `{ Price: [\'Must be positive\'] }`) ke tipe `ApiError` supaya pesan tampil di bawah input pasangannya.',
        'Teruskan panggilan `/api` lewat `proxy.conf.json` saat dev lokal (atau izinkan `http://localhost:4200` di `AddCors` ASP.NET Core). Utility TypeScript seperti `Omit<Product, \'id\'>` dan `satisfies CreateProduct` mengecek kesesuaian payload dengan DTO backend tanpa menghapus tipe literalnya.'
      ],
      practice: 'Buka **Playground TypeScript** (`/play/ts/`) lalu jalankan **Mapper ProblemDetails ASP.NET** untuk melihat bagaimana JSON validasi dipetakan ke `fieldErrors`. Hubungkan `ProductsPage` ke API ASP.NET Core lokalmu memakai `proxy.conf.json`, masukkan `-5` pada harga, lalu lihat `fieldErrors()[\'Price\']` muncul di samping input.',
      teach: 'Jelaskan kapan memilih `httpResource` dibanding `HttpClient`, mengapa `http.post(...)` tanpa `firstValueFrom()` tidak mengirim apa pun, dan beda CORS dengan `proxy.conf.json`.',
      analogy: '`httpResource` mirip konter pesanan yang langsung merobek slip antrean lamamu begitu kamu ganti pilihan. Sementara `HttpInterceptorFn` adalah pos pemeriksaan yang dilalui tiap request keluar dan response masuk.',
      pitfalls: [
        'Membaca `products.value()` di template tanpa `@if (products.hasValue())`, yang memicu error bila API gagal.',
        'Memanggil `this.http.delete(\'/api/products/1\')` tanpa menunggu `firstValueFrom(...)` atau subscribe. Cold `Observable`-nya tidak pernah jalan.',
        'Mencoba mengubah `req.headers` langsung di interceptor ketimbang mengembalikan `req.clone(...)`.',
        'Membuka CORS hanya untuk port Vite `:5173` di `AddCors()` ASP.NET Core padahal Angular dev server jalan di `:4200`.'
      ],
      quiz: [
        [
          'Apa yang terjadi jika kamu memanggil `userResource.value()` ketika request HTTP-nya gagal?',
          ['Menghasilkan `undefined`', 'Memicu error karena status resource bernilai `\'error\'`', 'Mengulang satu kali', 'Mencetak peringatan teks'],
          'Cek `hasValue()` atau `error()` lebih dulu sebelum memanggil `.value()`.'
        ],
        [
          'Mengapa `this.http.delete(\'/api/products/1\')` tidak mengirim apa pun jika nilai kembaliannya diabaikan?',
          ['Browser memblokir request `DELETE`', '`HttpClient` menghasilkan cold `Observable` yang baru mengirim saat di-subscribe atau ditunggu dengan `firstValueFrom`', 'Interceptor membatalkan call yang tak disimpan', 'CORS menolak respons kosong'],
          'Cold observable menunggu ada yang subscribe sebelum berjalan.'
        ],
        [
          'Di mana header Authorization atau `X-Request-Id` sebaiknya ditambahkan ke semua panggilan API?',
          ['Di dalam tiap template component', 'Di `HttpInterceptorFn` fungsional yang didaftarkan lewat `provideHttpClient(withInterceptors([...]))`', 'Di dalam `index.html`', 'Di dalam `router.navigate`'],
          'Interceptor fungsional memusatkan header global dan penanganan error di satu tempat.'
        ]
      ]
    },
    guards: {
      splits: ["1 · AuthSession & Guard","2 · Resolver & @boundary","3 · Rute Terlindungi"],
      title: 'Route guard, resolver, dan pemulihan @boundary',
      why: 'Aplikasi produksi menjaga user tak berizin agar tidak masuk ke layar privat, memuat data kecil sebelum halaman buka, dan mengisolasi widget bermasalah supaya satu grafik error tidak membuat seluruh halaman blank. Ingat: pengecekan route di browser cuma mengatur alur tampilan, kontrol akses asli tetap ditegakkan API ASP.NET Core.',
      terms: [
        ['`CanActivateFn` / `CanMatchFn`', 'Route guard berbentuk fungsi yang memberi nilai `true`, `false`, atau `RedirectCommand` sebelum sebuah route dibuka.'],
        ['`ResolveFn`', 'Fungsi pemuat data route ringan seperti judul halaman sebelum component tujuan dirender.'],
        ['Batas keamanan', 'User selalu bisa membuka atau melewati JavaScript browser lewat DevTools, jadi cuma server backend yang menjamin keamanan asli.'],
        ['`@boundary` / `@error`', 'Blok error boundary template Angular v22.2+ yang menangkap crash render lokal dan menyediakan `$reset()` untuk mencoba ulang.']
      ],
      points: [
        'Route guard (`CanActivateFn` dan `CanMatchFn`) adalah fungsi di dalam injection context sehingga boleh memanggil `inject()`. Kembalikan `true` untuk mengizinkan, `false` untuk menolak, atau `new RedirectCommand(router.parseUrl(\'/login\'))` untuk mengalihkan halaman tanpa reload penuh.',
        '`CanMatchFn` menentukan apakah suatu definisi route ikut dicocokkan, memungkinkan beberapa route berbagi URL `/home` dan turun ke route berikutnya saat `false`. Sedangkan `CanActivateFn` jalan sesudah cocok. Guard asinkron di `canActivate: [a, b]` berjalan **bersamaan**, jadi jangan kira `a` pasti selesai sebelum `b` mulai.',
        'Route guard cuma mengarahkan **navigasi UI**. Siapa pun tetap bisa menembak `/api/admin/...` lewat `curl` atau `fetch`, jadi endpoint ASP.NET Core tetap butuh `RequireAuthorization()` dan validasi kepemilikan data.',
        'Route resolver (`ResolveFn`) memuat metadata kecil seperti judul halaman ke input route lebih awal. Hindari query lambat di dalam resolver tanpa indikator loading, karena klik tautan bakal terasa macet.',
        'Bungkus widget berisiko dengan **`@boundary { ... } @error { ... }`** (Angular v22.2+) supaya error render tampil sebagai fallback lokal lengkap dengan tombol Retry **`$reset()`** tanpa menjatuhkan seluruh halaman.'
      ],
      practice: 'Render `OrdersShell` dengan `broken` awalnya `true`, lihat fallback `@error` menggantikan blank crash, klik Retry, dan pastikan `broken.set(false); $reset()` memulihkan widget itu. Lalu tembak endpoint `/api/orders` ASP.NET Core dari `curl` tanpa token guna membuktikan backend membalas `401`.',
      teach: 'Jelaskan kapan memakai `CanMatchFn` vs `CanActivateFn`, mengapa route guard sekadar UX bukan keamanan sesungguhnya, dan apa yang dipulihkan `@boundary` plus `$reset()`.',
      analogy: 'Route guard seperti tali antrean di museum yang mengarahkan tamu ke loket tiket (`RedirectCommand`), sedangkan `RequireAuthorization()` ASP.NET Core adalah pintu brankasnya. `@boundary` adalah sekring listrik satu ruangan agar satu lampu putus tidak memadamkan seluruh lantai.',
      pitfalls: [
        'Mengira `canActivate` sudah melindungi endpoint API dari panggilan `curl` atau Postman langsung.',
        'Menaruh `@boundary` di pembungkus mengelilingi `<ng-content />` dengan harapan error dari markup parent tertangkap. Bungkus child-nya dari template parent.',
        'Menganggap `guardB` di `canActivate: [guardA, guardB]` menunggu `guardA` selesai dulu. Guard asinkron jalan berbarengan.',
        'Menjalankan query lambat tanpa cache di `ResolveFn` tanpa indikator loading, membuat perpindahan halaman terasa nge-freeze.'
      ],
      quiz: [
        [
          'Mengapa ASP.NET Core wajib memeriksa izin akses walaupun Angular sudah menjaga `/admin` lewat `canActivate`?',
          ['Guard Angular tidak jalan di iOS', 'Kode browser jalan di perangkat user dan bisa dilewati, sehingga cuma backend yang menjaga keamanan asli', 'Guard cuma jalan saat `ng build`', 'Token kedaluwarsa di `<router-outlet>`'],
          'Guard memandu alur navigasi bagi user biasa; pengecekan di server menghentikan penyalahgunaan API langsung.'
        ],
        [
          'Apa beda `canMatch` bernilai `false` dengan `canActivate` bernilai `false`?',
          ['`canMatch` langsung melempar halaman 404', '`canMatch` melewati definisi route tersebut agar router mengecek route selanjutnya di path yang sama', '`canMatch` mematikan lazy chunk', 'Tidak ada bedanya'],
          '`canMatch` membuat dua route bisa berbagi path `/home`, misalnya dashboard admin dan dashboard pelanggan.'
        ],
        [
          'Di dalam blok `@boundary { ... } @error { ... }`, apa fungsi memanggil `$reset()`?',
          ['Me-reload seluruh tab browser', 'Menghapus error yang tertangkap dan merender ulang blok `@boundary`', 'Me-reset semua service singleton', 'Memanggil `Router.navigate([\'/\'])`'],
          '`$reset()` membersihkan status error boundary sesudah state pemicunya diperbaiki.'
        ]
      ]
    },
    testing: {
      title: 'Testing zoneless: component, routing, dan HTTP',
      why: 'Tes Angular modern berjalan cepat di **Vitest** di dalam **jsdom** (DOM browser tiruan di Node.js) tanpa Zone.js. Ketimbang memicu change detection manual, tes meniru perilaku user: klik atau ketik, tunggu Angular selesai lewat `await fixture.whenStable()`, lalu cek teks dan status ARIA yang tampil.',
      terms: [
        ['Vitest & jsdom', 'Vitest menjalankan tes `describe`/`it`/`expect` dengan cepat, sedangkan jsdom menyimulasikan node DOM browser di Node tanpa membuka Chrome.'],
        ['`TestBed`', 'Lingkungan uji milik Angular untuk memasang component (`TestBed.createComponent`) beserta service atau provider tiruan.'],
        ['`await fixture.whenStable()`', 'Menjeda tes sampai Angular menyelesaikan pembaruan signal zoneless dan microtask yang masih berjalan.'],
        ['`HttpTestingController`', 'Mock uji yang menangkap panggilan `HttpClient` dan `httpResource` supaya tes bisa memeriksa request dan mengirim respons palsu tanpa jaringan.']
      ],
      points: [
        'Ikuti alur **`Act -> await fixture.whenStable() -> Assert`**: klik atau ubah signal, tunggu `await fixture.whenStable()` supaya Angular merender sendiri, lalu cek DOM. Jangan memaksa pakai `fixture.detectChanges()`, karena cara itu bisa menyembunyikan pembacaan signal yang terlewat.',
        '`httpResource` langsung mendaftarkan task jaringan saat berjalan, jadi memanggil `await fixture.whenStable()` duluan bikin tes menggantung. Panggil **`TestBed.tick()`** sekali sesudah `createComponent()` agar request terkirim, balas lewat **`http.expectOne(...).flush(...)`**, barulah panggil `await fixture.whenStable()`.',
        'Uji HTTP tanpa jaringan nyata memakai `[provideHttpClient(), provideHttpClientTesting()]`. Periksa method, URL, dan body lewat `HttpTestingController`, kirim respons `200`/`201`/`400 ProblemDetails`, dan panggil **`http.verify()` di `afterEach`** agar tidak ada request liar tersisa.',
        'Uji halaman ber-route bersama guard dan binding aslinya lewat **`RouterTestingHarness.create()`** dan `provideRouter(routes, withComponentInputBinding())` ketimbang me-mock `Router` manual.',
        'Periksa elemen yang dilihat user atau pembaca layar (teks terlihat, keterkaitan `<label>`, `[aria-invalid]`, `role="alert"`) ketimbang mengecek properti internal component. Pakai harness `TestbedHarnessEnvironment` untuk widget `@angular/aria` atau Material.'
      ],
      practice: 'Tambahkan `it(...)` kedua untuk mengecek alur tambah data: kirim `201` di `POST /api/products`, tangkap `httpResource.reload()` yang memicu `GET /api/products`, kirim daftar 2 item terbaru, dan pastikan nama produk baru muncul di DOM.',
      teach: 'Jelaskan mengapa tes zoneless memakai `fixture.whenStable()` daripada `fixture.detectChanges()`, mengapa `TestBed.tick()` harus dijalankan sebelum membalas `httpResource`, dan apa fungsi `http.verify()`.',
      analogy: 'Menunggu `await fixture.whenStable()` seperti menunggu di konter saji sampai dapur selesai menata pesanan. Memanggil `detectChanges()` itu seperti meraih piring ke dapur sebelum belnya (`signal` / event) berbunyi, menutupi apakah belnya benar-benar berfungsi.',
      pitfalls: [
        'Memanggil `fixture.detectChanges()` di spec zoneless, yang menutupi signal yang lupa terbaca dan baru error di produksi.',
        'Memanggil `await fixture.whenStable()` sebelum membalas request `httpResource` yang aktif. Request yang menggantung menahan stability kecuali `TestBed.tick()` dan `.flush()` jalan lebih dulu.',
        'Lupa menulis `afterEach(() => http.verify())`, sehingga request duplikat atau request tak terduga lolos tanpa ketahuan.',
        'Membuat mock `Router` manual ketimbang menguji rute dan guard sungguhan dengan `RouterTestingHarness`.'
      ],
      quiz: [
        [
          'Di tes Angular v22 zoneless, bagaimana cara menunggu pembaruan signal dan event DOM selesai dirender?',
          ['Memanggil `fixture.detectChanges()` di dalam loop', 'Menunggu `await fixture.whenStable()`', 'Memanggil `tick(100)` di dalam `fakeAsync`', 'Kembali memakai `Eager`'],
          '`whenStable()` menunggu penjadwal zoneless Angular dan microtask selesai.'
        ],
        [
          'Mengapa `httpResource` di component tes yang baru dibuat perlu `TestBed.tick()` + `http.expectOne().flush()` sebelum `await fixture.whenStable()`?',
          ['`whenStable()` menunggu semua request `httpResource` aktif selesai dulu', '`TestBed.tick()` mengompilasi template HTML', 'Vitest memblokir HTTP sampai di-tick dua kali', 'Signal mengabaikan `beforeEach`'],
          'Mengirim respons tiruan melepaskan task yang sedang ditunggu oleh `httpResource`.'
        ],
        [
          'Apa yang diperiksa `httpTesting.verify()` di dalam `afterEach`?',
          ['Kesesuaian DTO C#', 'Bahwa tidak ada request HTTP tak terduga atau belum dibalas yang tertinggal', 'Bahwa animasi CSS selesai', 'Bahwa CORS mati'],
          'Ia mendeteksi panggilan API ganda atau request yang lupa dibalas oleh tesmu.'
        ]
      ]
    },
    // ---------------- Expert ----------------
    cd: {
      predict: {
        prompt: "Parent menyimpan `items` lalu menjalankan `items.push(newProduct)` langsung di tempat dengan referensi array yang sama, lalu mengirimnya ke child `OnPush` (`<app-catalog-view [items]=\"items\" />`). Apa yang terjadi?",
        options: [
          "Child langsung diperbarui karena `items.length` bertambah",
          "Child `OnPush` melewatkan update karena `Object.is(prevItems, nextItems)` masih bernilai `true`",
          "Angular melempar error immutability saat `.push()` dipanggil",
        ],
        answer: 1,
        explain: "`OnPush` mengecek perubahan input lewat identitas referensi (`Object.is`), bukan isi array secara mendalam. Membuat array baru (`items.update(list => [...list, newProduct])`) memberi referensi baru agar Angular menyegarkan child.",
      },
      title: 'Change detection dan performa rendering',
      why: '**Change detection** adalah cara Angular membandingkan state aplikasi ke template lalu memperbarui DOM. Melihat pergeseran Angular dari pemindaian atas-ke-bawah Zone.js (`Eager`) ke `OnPush` dan **update Signal zoneless** menjelaskan mengapa aplikasi modern tetap ringan dan bug apa yang masih boros render.',
      terms: [
        ['Change detection', 'Memeriksa perubahan state TypeScript terhadap template dan cuma menambal node DOM yang berubah.'],
        ['`OnPush` vs `Eager` lama', '`Eager` (bersama Zone.js) mengecek ulang seluruh component dari root ke bawah tiap ada event; `OnPush` (bawaan Angular 22) hanya mengecek component saat input, event lokal, atau signal yang dibacanya berubah.'],
        ['Reference equality (`Object.is`)', '`OnPush` memeriksa apakah input menunjuk ke referensi objek atau array baru, jadi mutasi langsung seperti `.push()` tidak terdeteksi.'],
        ['`afterRenderEffect()`', 'Berjalan sesudah DOM diperbarui, memisahkan fase pengukuran `earlyRead` dan fase ubah `write` agar layout tidak dihitung berulang-ulang.']
      ],
      points: [
        'Mode **`Eager` lama (Zone.js)** mencegat event browser (`click`, `setTimeout`, `fetch`) lalu menyapu seluruh pohon component dari atas ke bawah tiap kali ada event, termasuk component yang tidak berubah. `ChangeDetectionStrategy.Default` kini deprecated sebagai `Eager`, sedangkan **`OnPush` adalah default Angular 22**.',
        'Di aplikasi **Zoneless + Signal**, perubahan signal hanya menandai view template yang membacanya. Component parent dan sibling lain ikut dilewati.',
        '`OnPush` membandingkan input dengan **`Object.is`** (identitas referensi). Hindari memodifikasi array atau objek langsung di tempat (`items.push(x)`), dan buat salinan baru (`[...items, x]`) supaya child tahu ada data baru.',
        'Jangan menulis `[items]="items().filter(...)"` atau objek literal `{ a: 1 }` di dalam template, karena keduanya selalu membuat referensi baru di setiap check. Pindahkan perhitungan ke **`computed()`** agar hanya dihitung ulang saat `items()` atau `query()` berubah.',
        'Taruh pengukuran ukuran DOM dan update scroll di `afterRenderEffect({ earlyRead, write })` ketimbang `effect()`, karena callback efek berjalan sebelum DOM dicetak dan memicu hitung ulang layout berlebih.',
        'Periksa bagian lambat di **Angular DevTools** (flamegraph dan highlight change detection) sebelum mengoptimasi, dan virtualisasikan tabel panjang memakai **`@angular/cdk/scrolling`**.'
      ],
      practice: 'Buka **Penjelajah change detection** di atas lalu klik `Card B` pada mode `Eager (Zone.js)`, `OnPush`, dan `Zoneless + Signal`. Nyalakan `Update shared CartSignal`, klik `Card B` lagi, dan jelaskan mengapa hanya di mode `Zoneless + Signal` komponen `App` serta `ProductList` tetap dilewati.',
      teach: 'Jelaskan bagaimana Signal memperbarui hanya `CartBadge` dan `Card B` tanpa Zone.js menyapu dari `App`, dan mengapa `items.push()` membuat `OnPush` tidak mendeteksi perubahan input.',
      analogy: 'Zone.js versi lama seperti satpam hotel yang mengecek setiap kamar lantai demi lantai setiap kali satu tamu memencet bel. `OnPush` bersama Signal seperti interkom langsung: hanya kamar yang belnya berbunyi yang menyala.',
      pitfalls: [
        'Menulis `items().filter(...)` atau objek literal `{ ... }` di template, yang memproduksi referensi baru di tiap pengecekan.',
        'Memodifikasi isi array langsung di tempat sebelum dikirim ke child `OnPush` (`Object.is` melihat referensi yang sama sehingga melewati render ulang).',
        'Mengubah component lambat ke `ChangeDetectionStrategy.Eager` daripada memperbaiki mutasi state pemicunya.',
        'Memanggil `getBoundingClientRect()` di dalam `effect()` sebelum DOM selesai dirender, bukan di `afterRenderEffect()`.'
      ],
      quiz: [
        [
          'Strategi `ChangeDetectionStrategy` apa yang menjadi default di Angular 22?',
          ['`ChangeDetectionStrategy.Eager`', '`ChangeDetectionStrategy.OnPush`', '`ChangeDetectionStrategy.Manual`', 'Zone polling'],
          'Angular 22 menjadikan `OnPush` sebagai standar dan mengganti nama `Default` lama menjadi `Eager`.'
        ],
        [
          'Di aplikasi zoneless, signal `cartCount` bersama yang hanya dibaca `CartBadge` dan `Card B` berubah. View mana yang diperbarui?',
          ['Semua component dimulai dari `App`', 'Hanya `CartBadge` dan `Card B`', 'Hanya `App` dan `ProductList`', 'Tidak ada tanpa `markForCheck()`'],
          'Signal hanya memberi tahu view template yang membacanya saat render, melewati parent maupun sibling.'
        ],
        [
          'Mengapa menghitung daftar tersaring dengan `computed()` lebih baik daripada memanggil `items().filter(...)` di `@for`?',
          ['Template melarang `.filter()`', 'Ekspresi template berjalan ulang di tiap check dan selalu menghasilkan array referensi baru', '`computed()` mengirim data ke server', 'Loop hanya menerima string'],
          '`computed()` menyimpan hasil di cache sampai `items()` atau `query()` berubah.'
        ]
      ]
    },
    ssr: {
      splits: ["1 · @defer & ProductScreen","2 · ServerRoutes & Hydration"],
      predict: {
        prompt: "Kamu menaruh `<app-product-reviews />` di dalam `@defer (on viewport)` agar dimuat lazy, lalu di class component yang sama kamu juga menulis `private readonly reviews = viewChild(ProductReviews);`. Apa pengaruhnya ke bundle JS?",
        options: [
          "`ProductReviews` tetap terpisah di chunk lazy dan `viewChild` terisi setelah dimuat",
          "`ProductReviews` ditarik kembali ke bundle utama karena merujuk class-nya di luar `@defer` menciptakan import eager",
          "Angular menggagalkan build dengan error",
        ],
        answer: 1,
        explain: "Agar `@defer` memecah ke chunk lazy terpisah, component hanya boleh dirujuk di dalam blok template `@defer`. Merujuk `ProductReviews` di TypeScript (`viewChild(ProductReviews)`) menahannya di bundle utama.",
      },
      title: 'Deferrable view (@defer), SSR, dan hybrid rendering',
      why: 'Loading halaman awal yang cepat menggabungkan dua teknik: memecah UI sekunder ke chunk **`@defer`** yang baru dimuat saat perlu, serta memilih per route apakah HTML dibuat di browser (**CSR**), saat build (**Prerender / SSG**), atau per request di server Node (**SSR**). **Hydration** lalu mengaktifkan halaman itu tanpa menggambar ulang DOM dari nol.',
      terms: [
        ['CSR vs SSG vs SSR', '**CSR** membangun HTML di browser (`RenderMode.Client`); **SSG / Prerender** membuat HTML statis waktu build (`RenderMode.Prerender`); **SSR** merender HTML baru di Node tiap ada request (`RenderMode.Server`).'],
        ['Hydration', 'Menempelkan event listener dan reaktivitas signal Angular ke HTML hasil render server tanpa membongkar ulang DOM yang sudah tampil.'],
        ['LCP & CLS', '**LCP** (Largest Contentful Paint) mengukur seberapa cepat layar utama muncul; **CLS** (Cumulative Layout Shift) mengukur pergeseran tata letak mengganggu saat chunk baru masuk.'],
        ['`@defer`', 'Blok template yang memisahkan standalone component menjadi chunk JS tersendiri dan memuatnya saat pemicu terjadi, seperti `on viewport` atau `hydrate on interaction`.']
      ],
      points: [
        'Pisahkan widget di bawah layar awal seperti grafik atau ulasan memakai `@defer (on viewport; prefetch on idle)`. Angular memecah `<app-product-reviews />` ke chunk JS-nya sendiri selama tidak ada bagian lain di file itu yang memakai `ProductReviews` di luar `@defer`.',
        'Jaga **LCP** dan **CLS**: jangan bungkus elemen hero di layar utama dengan `@defer` karena memperlambat LCP. Beri **`@placeholder`** tinggi minimal (`min-height`) sesuai ukuran widget supaya tata letak tidak meloncat, lalu pasang `(after 100ms; minimum 200ms)` di `@loading` agar spinner tidak berkedip cepat.',
        'Atur mode render tiap route di `ServerRoute[]`: `RenderMode.Prerender` untuk halaman katalog atau marketing statis (`getPrerenderParams`), `RenderMode.Server` untuk halaman SEO dinamis, dan `RenderMode.Client` untuk dashboard pribadi yang butuh login.',
        'Aktifkan incremental hydration lewat `provideClientHydration()` (aktif beserta event replay di Angular 22+). Menggabungkan **`@defer (on viewport; hydrate on interaction)`** mengirim HTML dari server demi SEO dan kecepatan tampilan awal sementara JS beratnya menunggu sampai user mengklik atau menggulir ke sana.',
        'Server Node SSR tidak punya `window`, `document`, atau `localStorage`. Inject token **`DOCUMENT`** Angular bukan `document` global, pindahkan kode DOM browser ke **`afterNextRender()`**, dan anggap `REQUEST` bisa bernilai null.',
        'Saring endpoint ber-auth keluar dari `transferCache` SSR lewat `withHttpTransferCacheOptions` supaya data JSON pribadi user tidak ikut tertanam di HTML server bersama.'
      ],
      practice: 'Taruh grafik berat di `@defer (on viewport; prefetch on idle)` dengan `min-height` tetap pada `@placeholder`, buka DevTools Network (filter JS), dan perhatikan chunk-nya baru terunduh saat layar digulir sampai ke sana. Hapus sebentar `min-height` itu untuk melihat lompatan tata letak (**CLS**).',
      teach: 'Jelaskan apa itu **hydration**, bandingkan `RenderMode.Client`, `RenderMode.Prerender`, dan `RenderMode.Server`, serta alasan menyentuh `window` di dalam constructor membuat SSR error.',
      analogy: 'SSR dengan incremental hydration mirip menyalakan lampu etalase toko sejak pagi (`RenderMode.Server`) supaya orang yang lewat langsung melihat isinya, sementara mesin toko di dalam baru dinyalakan (`hydrate on interaction`) begitu ada pembeli masuk.',
      pitfalls: [
        'Memakai component `@defer` di bagian lain file yang sama (misalnya `viewChild(ProductReviews)`), sehingga bundler menariknya kembali ke bundle utama.',
        'Membungkus teks atau gambar hero layar pertama di `@defer` (menurunkan LCP) atau mengosongkan `min-height` pada `@placeholder` (memperburuk CLS).',
        'Memanggil `window.localStorage` atau `document.title` di constructor component, yang membuat SSR gagal di Node.',
        'Membiarkan endpoint API pribadi masuk ke HTTP transfer cache SSR tanpa filter rute privat.'
      ],
      quiz: [
        [
          'Apa yang menghalangi component di dalam `@defer` terpisah ke chunk JS lazy-nya sendiri?',
          ['Menambah `@placeholder`', 'Menggunakan class component itu di bagian lain file yang sama di luar `@defer` (misalnya `viewChild`)', 'Menambah `prefetch on idle`', 'Menambah style component'],
          'Referensi langsung di ruang lingkup TypeScript atau template yang sama memaksa bundler menahannya di bundle utama.'
        ],
        [
          'Mode `RenderMode` mana yang pas untuk dashboard pengaturan akun ber-login yang tidak diindeks mesin pencari?',
          ['`RenderMode.Prerender`', '`RenderMode.Client`', '`RenderMode.Server` dengan cache publik', 'File teks mentah'],
          'Dashboard pribadi tidak mendapat manfaat dari SSR maupun SSG dan menghemat beban server lewat rendering di browser.'
        ],
        [
          'Di mana kode DOM khusus browser (membaca posisi scroll atau `localStorage`) harus dijalankan di component SSR?',
          ['Di dalam `constructor`', 'Di dalam `afterNextRender()` atau `afterRenderEffect()`', 'Di dalam konfigurasi `ServerRoute`', 'Di dalam `@Pipe`'],
          '`afterNextRender()` tidak berjalan di Node dan cuma dieksekusi satu kali di browser.'
        ]
      ]
    },
    arch: {
      title: 'Arsitektur, aksesibilitas, dan Angular Aria',
      why: 'Basis kode Angular yang sehat membagi file menurut fitur, meletakkan tiap state di tempat yang tepat, dan membuat tipe DTO otomatis dari OpenAPI. Untuk komponen interaktif seperti tab dan menu, **Angular Aria** memberi dukungan keyboard yang layak ketimbang memakai tag `<div>` biasa dengan klik.',
      terms: [
        ['Folder fitur (`core/` / `features/` / `shared/`)', '`core/` berisi singleton aplikasi dan model, `features/` berisi halaman rute, dan `shared/` berisi komponen UI pakai ulang murni.'],
        ['Headless UI (`@angular/aria`)', 'Directive khusus perilaku yang mengurus peran WAI-ARIA, atribut `aria-*`, dan navigasi panah keyboard, sedangkan HTML dan CSS sepenuhnya di tanganmu.'],
        ['Codegen OpenAPI', 'Membuat interface TypeScript otomatis dari skema `/openapi/v1.json` ASP.NET Core (`openapi-typescript`), bukan menyalin DTO dengan tangan.'],
        ['Roving focus', 'Pola navigasi keyboard di mana tombol Tab masuk ke tab strip sekali, lalu tombol Panah memindahkan fokus antar-item.']
      ],
      points: [
        'Kelompokkan file berdasar fitur: taruh service auth/config dan model (`product.model.ts`) di `core/`, area rute di `features/products/`, dan komponen UI polos (cukup terima `input()`, kirim `output()`, tanpa HTTP) di `shared/ui/`.',
        'Taruh tiap state di tempat alaminya: data server di `httpResource`, filter serta nomor halaman yang bisa dibagikan di **URL** (`withComponentInputBinding()`), draft input di **`form()`**, buka/tutup UI di **`signal()`** lokal, dan state bersama aplikasi di `@Service()` lewat `.asReadonly()`.',
        'Sinkronkan model C# dan TypeScript lewat OpenAPI. ASP.NET Core menerbitkan `/openapi/v1.json`, lalu tool seperti `openapi-typescript` menghasilkan tipe TS supaya perubahan skema backend terdeteksi saat build bukan di produksi.',
        'Atur gaya dengan Tailwind CSS v4 cukup lewat `@import \'tailwindcss\';` di CSS tanpa perlu `tailwind.config.js` versi lama.',
        'Gunakan **`@angular/aria`** (`ngTabs`, `ngTabList`, `ngTab`, `ngTabPanel`, `ngCombobox`) untuk tab, accordion, dan combobox. HTML bawaan cukup untuk tombol dan link, tapi widget kompleks butuh navigasi panah, roving focus, dan atribut `aria-selected` sambil menyerahkan tampilan sepenuhnya ke kamu.',
        'Jalankan pemeriksaan aksesibilitas ini tiap membuat fitur: utamakan HTML semantik (`<button>`, `<nav>`, `<main>`), pasangkan `<label for>` dengan error `aria-describedby`, pastikan outline `:focus-visible` tampak jelas, beri `title` unik per rute, dan beri gaya langsung pada `[aria-selected=\'true\']`.'
      ],
      practice: 'Buat pemilih negara dengan kotak cari memakai `@angular/aria/combobox` dan `@angular/aria/listbox`, beri gaya `[aria-selected=\'true\']` serta `:focus-visible`, lalu uji apakah kamu bisa membuka, menyaring, memilih dengan tombol Panah + Enter, dan menutup dengan Escape memakai **keyboard saja**. Intip `/openapi/v1.json` dari ASP.NET Core untuk melihat cara skema dipetakan ke interface TS.',
      teach: 'Jelaskan arti **headless UI** (`@angular/aria`), mengapa memberi gaya `[aria-selected=\'true\']` lebih aman ketimbang mengubah class `.active` terpisah, dan cara menentukan di mana state tinggal.',
      analogy: 'Angular Aria itu seperti kolom kemudi, rem, dan lampu sein tersembunyi di dalam mobil. Kamu bebas membentuk bodi dan dashboard sesukamu dengan HTML plus Tailwind CSS, sementara directive-nya menjamin navigasi keyboard dan pembaca layar berjalan mulus sejak awal.',
      pitfalls: [
        'Menaruh panggilan `HttpClient` atau logika bisnis di dalam tombol atau kartu pakai ulang di `shared/ui/`.',
        'Menjadikan tag `<div>` sebagai tab atau dropdown palsu (`<div (click)="...">`), yang tidak bisa dicapai Tab maupun Panah dan bisu bagi pembaca layar.',
        'Menyalin field DTO C# ke interface TypeScript satu per satu bukan men-generate-nya dari `/openapi/v1.json`.',
        'Menyalakan class `.active` terpisah dari `[aria-selected=\'true\']`, memicu tampilan visual dan status pembaca layar jadi beda.'
      ],
      quiz: [
        [
          'Apa yang disediakan `@angular/aria` yang tidak bisa dikerjakan CSS biasa?',
          ['Mengompilasi utilitas Tailwind', 'Mengelola peran WAI-ARIA, atribut `aria-*`, roving focus, dan tombol panah keyboard sementara gaya tetap di tanganmu', 'Membuat model C#', 'Menjalankan server SSR'],
          'Directive headless menghubungkan logika keyboard dan pembaca layar sembari menjaga HTML serta CSS sepenuhnya dalam kendalimu.'
        ],
        [
          'Bagaimana CSS seharusnya menyoroti `ngTab` aktif di Angular Aria?',
          ['Memakai `.ng-tab-active`', 'Memakai `.tab-btn[aria-selected=\'true\']`', 'Memakai `::ng-deep`', 'Hanya dari JavaScript'],
          'Angular Aria memasang `aria-selected` otomatis, mengunci tampilan aktif ke status aksesibilitasnya.'
        ],
        [
          'Di mana filter pencarian aktif dan nomor halaman pagination sebaiknya disimpan?',
          ['Hanya di field service privat', 'Di parameter query URL lewat withComponentInputBinding()', 'Di sessionStorage', 'Di dalam ProductRow'],
          'Parameter URL bertahan saat refresh serta tombol Back/Forward dan membuat link-nya bisa dibagikan.'
        ]
      ]
    }
  }
};

export default trackId;
