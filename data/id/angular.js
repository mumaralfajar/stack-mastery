// Indonesian translation for the Angular track (exact parity with data/angular.js).
window.I18N = window.I18N || { ui: {}, tracks: {}, viz: {}, projects: [], iv: {} };
I18N.tracks.angular = {
  tagline: 'Frontend berfitur lengkap: component, Signal, dependency injection, Signal Forms, HTTP, dan SSR.',
  lessons: {
    components: {
      title: 'Component, template, dan binding',
      why: 'Angular membangun UI dari standalone component — tanpa boilerplate `NgModule`. Begitu kamu melihat component sebagai class yang menyimpan state reaktif dan berpasangan dengan template deklaratif, seluruh framework ini langsung masuk akal.',
      points: [
        'Setiap component bersifat **standalone secara default** (sejak Angular 19). Daftarkan component, directive, dan pipe yang dipakai di template dalam `imports: [...]`.',
        'Angular modern menamai class sesuai **perannya** tanpa akhiran `Component`: `ProductCard`, bukan `ProductCardComponent`.',
        'Selalu gunakan **self-closing tag** jika component tidak menerima projected child: `<app-product-card />` alih-alih `<app-product-card></app-product-card>`.',
        'Template melakukan binding dengan empat cara: `{{ expr }}` interpolasi untuk teks, `[prop]="expr"` property binding untuk input/atribut, `(event)="handler()"` untuk event, dan `host: { ... }` di dalam `@Component` untuk binding pada elemen host itu sendiri.',
        'Hindari `@HostBinding` dan `@HostListener` di kode baru: deklarasikan host binding langsung di metadata `@Component({ host: { ... } })`.',
        'Jalankan aplikasi dengan `bootstrapApplication(App, appConfig)` alih-alih melakukan bootstrap `NgModule`.'
      ],
      practice: 'Buat workspace baru dengan `npx @angular/cli@latest new shop-ng`. Ganti root template dengan component `ProductCard` yang menghitung jumlah klik memakai `signal()`, lalu nonaktifkan tombol saat `stock === 0`. Periksa elemen host `<app-product-card>` di DevTools untuk melihat `data-selected` berubah.',
      teach: 'Jelaskan perbedaan antara `{{ value }}`, `[disabled]="flag"`, dan `(click)="save()"` kepada orang yang baru tahu HTML.',
      analogy: 'Component adalah elemen HTML kustom yang punya ruang mesin sendiri. Kurung siku `[ ]` mendorong data **ke dalam** elemen, tanda kurung `( )` mengirim event **keluar**, dan `host` menempelkan aturan langsung ke cangkang luar elemen tersebut.',
      pitfalls: [
        'Memakai tag component di template tanpa memasukkan class-nya ke array `imports` milik parent.',
        'Menulis `(click)="() => save()"` di template: itu cuma membuat fungsi dan tidak pernah memanggilnya. Tulis `(click)="save()"`.',
        'Tetap memakai `@HostBinding` atau `@HostListener` alih-alih properti `host` di `@Component`.',
        'Menaruh pemanggilan array mahal seperti `.filter()` atau `.sort()` langsung di `{{ }}` — ekspresi template dievaluasi di setiap pass change detection.'
      ],
      quiz: [
        [
          'Di Angular modern, bagaimana cara membuat component lain tersedia di dalam template parent component?',
          ['Mendaftarkan keduanya di dalam `NgModule`', 'Menambahkan class child ke array `@Component({ imports: [...] })` milik parent', 'Mengimpor file-nya di bagian atas `main.ts` saja', 'Melakukan extends terhadap class child'],
          'Component bersifat standalone secara default, sehingga setiap component menyatakan secara eksplisit apa saja yang dipakai templatenya lewat `imports`.'
        ],
        [
          'Apa yang terjadi jika kamu menulis `(click)="() => toggle()"` di template Angular?',
          ['`toggle()` berjalan saat diklik', 'Tidak terjadi apa-apa: ekspresi hanya mengevaluasi sebuah fungsi tanpa memanggilnya', 'Angular melempar syntax error', 'Memanggil `toggle()` satu kali saat init'],
          'Event binding mengeksekusi ekspresinya sendiri ketika event terjadi; panggil metodenya langsung dengan `(click)="toggle()"`.'
        ],
        [
          'Cara yang dianjurkan untuk melakukan binding class atau atribut ARIA di elemen host milik component sendiri?',
          ['Inject `ElementRef` dan ubah `nativeElement`', 'Gunakan properti metadata `host: { ... }` di dalam `@Component`', 'Gunakan `@HostBinding` pada sebuah getter', 'Membungkus template dengan `<div>` tambahan'],
          'Properti metadata `host` bersifat deklaratif, tidak butuh import decorator tambahan, dan bekerja mulus dengan signal.'
        ]
      ]
    },
    flow: {
      title: 'Control flow, pipe, dan content projection',
      why: 'Template aplikasi nyata perlu bercabang berdasarkan loading state, merender daftar baris, memformat harga dan tanggal, serta membungkus markup anak di dalam card atau tombol. Control flow bawaan dan pipe menjaga template tetap cepat dan mudah dibaca tanpa mengotori class.',
      points: [
        'Control flow bawaan (`@if` / `@else if` / `@else`, `@for`, `@switch`) menggantikan structural directive seperti `*ngIf` dan `*ngFor` — tanpa import tambahan.',
        '`@for (p of products(); track p.id)` **wajib** memiliki ekspresi `track` agar Angular bisa memakai ulang node DOM saat data berubah; pasangkan dengan `@empty` untuk kondisi list kosong.',
        '`@switch` memakai `===` ketat tanpa fallthrough. Tambahkan `@default never;` saat melakukan switch pada union type agar case baru yang lupa ditangani langsung gagal saat build template.',
        'Gunakan class `@Pipe` yang pure (serta pipe bawaan seperti `CurrencyPipe` atau `DatePipe`) untuk memformat nilai di template. Di luar template, jangan pernah meng-inject class pipe — ekstrak fungsi biasa atau pakai `formatCurrency` / `formatDate` dari `@angular/common`.',
        'Proyeksikan markup parent dengan `<ng-content />`, beri nama banyak slot dengan `select="[card-badge]"`, dan taruh konten fallback langsung di dalam `<ng-content>Default</ng-content>`.'
      ],
      practice: 'Tambahkan anggota `\'paused\'` ke `LoadState`, biarkan `@switch` tidak disentuh, dan lihat strict template compiler Angular menangkap `@case` yang terlewat lewat `@default never;`. Lalu pindahkan `truncateText` ke helper bersama dan panggil dari `TruncatePipe` maupun fungsi TypeScript biasa.',
      teach: 'Jelaskan mengapa `@for` mewajibkan `track` dan apa masalahnya jika kamu selalu menulis `track $index` pada list yang item-nya bisa diurutkan ulang atau dihapus.',
      analogy: '`track` pada `@for` adalah label koper di tiap tas. Ketika koper bertukar posisi di ban berjalan, Angular membaca label (`p.id`) dan cukup memindahkan elemen DOM yang cocok alih-alih membongkar dan membangunnya ulang dari nol.',
      pitfalls: [
        'Memakai `track $index` pada list yang bisa berubah: menghapus item 0 menggeser semua indeks dan memaksa Angular me-rebind atau mengacak state child.',
        'Meng-inject `CurrencyPipe` atau custom pipe di dalam service alih-alih memakai `formatCurrency()` atau fungsi bersama biasa.',
        'Menaruh `<ng-content />` di dalam `@if` sambil mengira child dari parent tidak akan dibuat — gunakan `<ng-template>` + `NgTemplateOutlet` bila pembuatan bersyarat dibutuhkan.',
        'Membuat impure pipe (`pure: false`) untuk menyaring array tiap check alih-alih menurunkan `computed()` signal.'
      ],
      quiz: [
        [
          'Mengapa `@for` mewajibkan ekspresi `track`?',
          ['Untuk mengurutkan array secara otomatis', 'Agar Angular dapat mengenali item lintas pembaruan dan memakai ulang node DOM', 'Untuk memvalidasi kunci unik saat runtime', 'Untuk menonaktifkan change detection'],
          'Key yang stabil memungkinkan Angular memindahkan, memperbarui, atau menghapus node DOM yang memang benar-benar berubah saja.'
        ],
        [
          'Apa yang dipaksakan oleh `@default never;` di dalam blok `@switch`?',
          ['Cabang default tidak merender apa pun', 'Compile error apabila ada anggota union type yang belum ditangani', 'Melempar error runtime untuk nilai yang tidak dikenal', 'Melewati nilai null'],
          'Persis seperti pengecekan exhaustiveness `never` di TypeScript, `@default never;` menggagalkan type-checking template bila satu case union terlupa.'
        ],
        [
          'Kamu ingin memakai ulang logika pemformatan custom pipe di dalam sebuah injectable service. Praktik terbaiknya?',
          ['Daftarkan pipe di `providers` lalu `inject()`', 'Ekstrak menjadi fungsi biasa yang dipanggil oleh pipe dan service', 'Buat instans `new MyPipe()` di dalam template', 'Tandai pipe sebagai `pure: false`'],
          'Pipe adalah operator template, bukan injectable service; berbagi fungsi biasa bekerja bersih di kedua tempat.'
        ]
      ]
    },
    inputs: {
      title: 'Input, output, model(), dan query',
      why: 'Component berkomunikasi lewat kontrak publik yang sempit: data mengalir turun lewat input, perubahan mengalir naik lewat output, dan kontrol two-way memakai `model()`. Karena Angular memodelkan semua itu sebagai signal, child bereaksi terhadap input baru tanpa boilerplate lifecycle hook.',
      points: [
        'Deklarasikan input dengan `input()` (opsional dengan nilai default) dan `input.required<T>()` (wajib saat kompilasi). Keduanya mengembalikan signal read-only, jadi turunkan nilainya dengan `computed()`.',
        'Gunakan helper `transform` seperti `booleanAttribute` dan `numberAttribute` ketika parent mengirimkan atribut HTML statis (`<app-btn disabled />`).',
        'Deklarasikan event dengan `output<T>()` dan picu dengan `this.added.emit(value)`. Namai output dengan `camelCase` tanpa awalan `on` (`selected`, bukan `onSelected`).',
        'Gunakan `model()` untuk two-way binding (`[(quantity)]="qty"`). Mengubah nilai `model` di dalam child otomatis memperbarui signal yang terikat di parent.',
        'Query elemen template dengan `viewChild()` / `viewChildren()` dan elemen proyeksi dengan `contentChild()` / `contentChildren()`. Sama seperti input, semuanya berupa signal — tidak perlu menebak-nebak lewat `ngAfterViewInit`.'
      ],
      practice: 'Bangun component `StarRating` dengan `readonly rating = model(0)` dan `readonly max = input(5)`. Ikat secara two-way dari signal parent, tambahkan tombol dengan `viewChild` yang memfokuskan bintang pertama saat reset, lalu pastikan mengubah `rating` di dalam child otomatis memperbarui parent.',
      teach: 'Jelaskan kapan memakai `input()` + `output()` dibanding `model()`, dan mengapa `input()` sebagai signal menghapus sebagian besar kebutuhan akan `ngOnChanges`.',
      analogy: '`input()` adalah celah surat satu arah dari parent ke child, `output()` adalah bel yang dibunyikan child ke atas, dan `model()` adalah papan tulis bersama di antara keduanya yang bisa diubah kedua sisi dengan kontrak yang sama.',
      pitfalls: [
        'Memilih nama input yang bentrok dengan properti DOM bawaan seperti `title`, `id`, atau `hidden`.',
        'Membaca `viewChild.required()` di dalam constructor atau ketika elemennya berada di dalam `@if` yang bernilai false — ini melempar `NG0951` sebelum view ada.',
        'Mencoba memanggil `.set()` pada signal `input()`. Input bersifat read-only; gunakan `model()` atau `linkedSignal()` bila butuh penulisan lokal.',
        'Mengakses `query.nativeElement` langsung alih-alih memanggil signal query terlebih dahulu (`this.searchInput()?.nativeElement`).'
      ],
      quiz: [
        [
          'Fungsi mana yang membuat properti signal dengan two-way binding (`[(value)]`) di child component?',
          ['`input()`', '`output()`', '`model()`', '`computed()`'],
          '`model()` mengembalikan `ModelSignal` yang bertindak sekaligus sebagai input dan output `valueChange` pasangannya.'
        ],
        [
          'Mengapa `readonly disabled = input(false, { transform: booleanAttribute })` memudahkan pemanggil component?',
          ['Membuat `disabled` bisa ditulisi', 'Pemanggil cukup menulis `<app-btn disabled />` tanpa `[disabled]="true"`', 'Menonaktifkan seluruh parent', 'Menjalankan validasi otomatis'],
          'Atribut HTML statis masuk sebagai string (`""`); `booleanAttribute` mengonversi keberadaannya menjadi `true`.'
        ],
        [
          'Kapan signal `viewChild(\'searchInput\')` dijamin sudah terdefinisi?',
          ['Di dalam constructor', 'Setelah Angular merender view yang memuat `#searchInput`', 'Tepat sebelum pembuatan template', 'Tidak pernah, jika memakai signal'],
          'View query terisi setelah view template dibuat, dan secara reaktif kembali menjadi `undefined` jika `@if` menyembunyikan elemen tersebut.'
        ]
      ]
    },
    signals: {
      title: 'Reaktivitas: signal, computed, linkedSignal, dan effect',
      why: 'Signal adalah tulang punggung reaktif Angular modern. Memahami kapan harus memakai `computed()` (turunan read-only), `linkedSignal()` (nilai default turunan yang tetap bisa diedit), dan `effect()` (khusus efek samping eksternal) mencegah infinite loop dan bug UI basi.',
      points: [
        '**Writable signal**: `signal(initial)` menyimpan state; ubah dengan `.set(next)` atau `.update(prev => ...)` (selalu kembalikan array/objek baru, jangan mutasi di tempat). Ekspos tampilan read-only dengan `.asReadonly()`.',
        '**`computed()`**: lazy, memoized, dan otomatis melacak setiap signal yang dibaca secara sinkron di dalamnya — bahkan pada cabang kondisional (`if (a()) b()` hanya melacak `b` saat `a()` bernilai true).',
        '**`linkedSignal()`**: state writable yang di-reset setiap kali signal sumber berubah (misalnya menjaga pilihan item tetap valid saat daftar diperbarui, tanpa menyentuh `effect()`).',
        '**`effect(onCleanup => ...)`** khusus untuk menyinkronkan signal ke API eksternal non-signal (logging, `localStorage`, canvas). **Jangan pernah** memanggil `.set()` di dalam `effect` untuk menyinkronkan dua signal.',
        'Pelacakan signal berhenti saat menyentuh `await`: selalu baca semua signal yang kamu butuhkan **sebelum** batas asinkron, dan bungkus pembacaan yang tidak ingin dilacak dengan `untracked()`.',
        'Untuk membaca/menulis DOM setelah Angular merender, gunakan `afterRenderEffect({ earlyRead, write })` alih-alih `effect()`.'
      ],
      practice: 'Buka visualisasi grafik ketergantungan Signal di atas. Atur `qty = 0`, ubah coupon, dan perhatikan `total` melewati perhitungan ulang karena short-circuit (`qty() > 0 && hasCoupon()`) menghentikan pelacakan `hasCoupon`. Lalu coba ganti `linkedSignal` di component kecil dengan `effect` dan catat dua bug yang muncul.',
      teach: 'Jelaskan perbedaan antara `computed()`, `linkedSignal()`, dan `effect()`, serta mengapa mengubah signal di dalam `effect` adalah anti-pattern.',
      analogy: '`computed` itu seperti rumus spreadsheet: kamu tidak pernah mengetik langsung ke sel itu, dan Excel hanya menghitung ulang saat sel input yang benar-benar dibacanya berubah. `linkedSignal` seperti dropdown form yang memilih nilai default pintar tiap negara berubah, tetapi tetap mengizinkan pengguna menggantinya.',
      pitfalls: [
        'Memakai `effect()` untuk menyalin state dari satu signal ke signal lain alih-alih memakai `computed()` atau `linkedSignal()`.',
        'Membaca signal setelah `await` di dalam `effect()` atau `computed()` — pelacakan reaktif hanya berjalan secara sinkron.',
        'Memutasi array di tempat (`items().push(x)`) lalu heran mengapa `computed()` tidak pernah diperbarui.',
        'Mengukur atau membaca elemen DOM di dalam `effect()` (yang berjalan sebelum pembaruan DOM) alih-alih memakai `afterRenderEffect()`.'
      ],
      quiz: [
        [
          'Di dalam `computed(() => qty() > 0 && coupon() ? 15 : 0)`, nilai `qty()` adalah `0`. Apa yang terjadi ketika `coupon` berubah?',
          ['`computed` melempar error', 'Tidak dihitung ulang karena `coupon()` tidak pernah terbaca pada eksekusi terakhir', 'Tetap dihitung ulang seperti biasa', 'Berhenti berlangganan secara permanen'],
          'Dependensi dicatat secara dinamis di tiap eksekusi; short-circuit mencegah `coupon()` sempat terbaca.'
        ],
        [
          'Kamu ingin signal `selectedPage` otomatis reset ke `1` setiap kali `filterText` berubah, namun tetap memperbolehkan pengguna mengklik halaman 2 atau 3. Primitif mana yang paling tepat?',
          ['`effect()` yang memanggil `selectedPage.set(1)`', '`linkedSignal(() => (this.filterText(), 1))`', '`computed()`', '`untracked()`'],
          '`linkedSignal` menyediakan state writable yang otomatis di-reset ketika sumbernya berubah.'
        ],
        [
          'Mengapa pengukuran layout DOM sebaiknya diletakkan di `afterRenderEffect` alih-alih `effect`?',
          ['`effect` tidak bisa berjalan di browser', '`effect` berjalan sebelum Angular selesai memperbarui DOM', '`afterRenderEffect` ikut berjalan di server juga', '`effect` tidak memiliki hook cleanup'],
          '`afterRenderEffect` berjalan setelah proses render dalam fase baca/tulis eksplisit, menghindari ukuran basi dan layout thrashing.'
        ]
      ]
    },
    di: {
      title: 'Service dan hierarchical dependency injection',
      why: 'Persis seperti ASP.NET Core, Angular dibangun di atas dependency injection — bedanya injector Angular berbentuk **pohon** yang mencerminkan hirarki component dan route kamu, dan `inject()` menggantikan daftar parameter constructor yang panjang.',
      points: [
        'Hiasi singleton service tingkat aplikasi dengan `@Service()` (atau `@Injectable({ providedIn: \'root\' })`). Service ini tree-shakeable dan tidak perlu didaftarkan di array `providers`.',
        'Gunakan `inject(MyService)` di inisialisasi properti class, constructor, atau functional guard/interceptor. Di luar injection context, `inject()` melempar error — oper `Injector` ke `runInInjectionContext()` bila perlu.',
        'Bandingkan lifetime dengan ASP.NET Core: `providedIn: \'root\'` / `@Service()` berperilaku seperti **Singleton**; mendaftarkan service pada **Route** membatasinya ke sub-pohon route tersebut; memakai `@Service({ autoProvided: false })` di `@Component({ providers: [...] })` membuat instance terisolasi per elemen component (dihancurkan saat component unmount).',
        'Pencarian berjalan menyusuri dua pohon: naik di hirarki **`ElementInjector`** (elemen host) terlebih dahulu, lalu naik di hirarki **`EnvironmentInjector`** (route → root). Modifier (`{ optional: true, skipSelf: true, self: true, host: true }`) mengatur cara pencarian.',
        'Di dalam `@Component`, `providers` mengekspos service ke anak yang diproyeksikan (`<ng-content />`), sedangkan `viewProviders` menyembunyikannya dari konten proyeksi.',
        'Gunakan `InjectionToken<T>` untuk dependensi non-class (seperti objek konfigurasi atau `DOCUMENT`), dengan opsi `factory` root.'
      ],
      practice: 'Daftarkan service dengan `readonly id = crypto.randomUUID()` sekali menggunakan `@Service()` (singleton) dan sekali menggunakan `@Service({ autoProvided: false })` di dalam array `providers` milik dua `<app-panel>` bersaudara. Tampilkan kedua ID dan buktikan mengapa yang satu identik di mana-mana sedangkan yang satu lagi berbeda tiap panel.',
      teach: 'Bandingkan `@Service()` + `providers` di component + `InjectionToken` milik Angular dengan `AddSingleton`, `AddScoped`, dan `IOptions<T>` di ASP.NET Core.',
      analogy: 'Mencari dependensi dengan `inject()` seperti meminjam alat di bengkel. Kamu cek meja kerjamu sendiri dulu (`ElementInjector`), lalu bertanya ke meja kepala tim di atasmu, baru berjalan ke gudang pusat (`EnvironmentInjector` root). Service di `providers` component adalah kotak perkakas pribadi di meja itu.',
      pitfalls: [
        'Memanggil `inject()` di dalam click handler atau callback `setTimeout` alih-alih menangkap referensinya di inisialisasi field.',
        'Lupa menulis `{ optional: true }` saat mencari service milik parent, yang berujung `NullInjectorError` saat runtime.',
        'Mengekspos writable `signal` secara publik dari `@Service()` alih-alih `.asReadonly()` disertai method pembaruan eksplisit.',
        'Tertukar antara `providers` (dibagikan ke child `<ng-content />`) dan `viewProviders` (privat untuk template component sendiri).'
      ],
      quiz: [
        [
          'Di mana pemanggilan `inject(CartStore)` sah dilakukan?',
          ['Di dalam method handler `(click)` tombol', 'Di inisialisasi field class, constructor, factory provider, atau functional route guard', 'Setelah `await` di dalam method `async`', 'Di dalam fungsi utilitas biasa yang dipanggil saat runtime'],
          '`inject()` membutuhkan injection context yang aktif, yang disediakan Angular selama konstruksi DI serta callback router/HTTP fungsional.'
        ],
        [
          'Dua component bersaudara masing-masing mendaftarkan `DraftBuffer` di `@Component({ providers: [DraftBuffer] })`. Berapa banyak instance yang dibuat?',
          ['Satu singleton bersama', 'Dua instance terpisah, dihancurkan ketika masing-masing component dihancurkan', 'Satu per route', 'Compile error'],
          'Provider tingkat component menempel pada `ElementInjector` masing-masing elemen dan mengikuti siklus hidup component tersebut.'
        ],
        [
          'Apa yang dilakukan `inject(Logger, { optional: true, skipSelf: true })`?',
          ['Melempar error jika `Logger` ada di elemen saat ini', 'Melewati injector elemen saat ini, mencari ke leluhur, dan mengembalikan `null` jika tidak ada', 'Membuat instance `Logger` baru', 'Hanya mencari di root injector'],
          '`skipSelf` memulai pencarian dari injector parent dan `optional` mencegah error saat tidak ada provider yang ditemukan.'
        ]
      ]
    },
    routing: {
      title: 'Routing, route input, dan lazy loading',
      why: 'SPA multi-halaman harus menyimpan state yang layak dibagikan (produk terpilih, nomor halaman, filter) di URL, memuat area fitur berat sesuai kebutuhan, dan menyalurkan parameter URL langsung ke component sebagai signal input yang bersih.',
      points: [
        'Konfigurasikan route di array `Routes` lewat `provideRouter(routes, withComponentInputBinding(), withViewTransitions())` dan tampilkan view yang cocok di `<router-outlet />`.',
        'Dengan `withComponentInputBinding()`, path parameter (`products/:id`), query param (`?sort=price`), dan resolved data terikat langsung ke signal `input()` — tidak perlu berlangganan `ActivatedRoute` manual.',
        'Buat tautan secara deklaratif dengan `routerLink` dan `routerLinkActive` (jangan pakai `href` biasa yang memuat ulang seluruh halaman), serta navigasi secara imperatif dengan `Router.navigate()`.',
        'Jaga ukuran bundle awal tetap kecil dengan lazy-loading route fitur lewat `loadComponent` atau `loadChildren` (`() => import(\'./...\').then(m => m.MyPage)`).',
        'Urutkan route dari yang paling spesifik ke paling umum: Angular memakai **first-match wins**, jadi taruh wildcard `**` paling akhir.',
        '`providers` pada route membentuk `EnvironmentInjector` tingkat route yang dibagikan lintas child route dan dihancurkan saat pengguna keluar dari bagian tersebut.'
      ],
      practice: 'Siapkan route bersarang `children` di bawah `products/:id` (`overview` dan `reviews`), masing-masing dirender di dalam `<router-outlet />` milik `ProductDetail` sendiri. Pastikan di tab Network bahwa JS chunk milik lazy route baru terunduh saat kamu mengklik `routerLink`-nya.',
      teach: 'Jelaskan apa yang diubah oleh `withComponentInputBinding()` dibanding meng-inject `ActivatedRoute`, dan mengapa `loadComponent` lazy berpengaruh pada waktu muat awal.',
      analogy: 'Routing itu seperti papan petunjuk gedung yang dipadukan dengan ruang kelas yang disiapkan mendadak. Lobi hanya mengantar perabotan ruang tertentu (`loadComponent`) persis saat pengunjung membuka pintunya, dan `withComponentInputBinding()` menyelipkan lencana tamu (`:id`) langsung lewat bawah pintu sebagai signal input.',
      pitfalls: [
        'Menaruh wildcard `{ path: \'**\', ... }` sebelum route spesifik sehingga membayangi semua route di bawahnya.',
        'Memakai `href="/products/42"` alih-alih `routerLink`, yang memicu reload browser penuh dan menghapus state memori.',
        'Lupa mengaktifkan `withComponentInputBinding()` di `provideRouter(...)`, sehingga signal `input()` untuk param route bernilai `undefined`.',
        'Tetap menaruh static import component lazy-loaded di file route yang sama — bundler akhirnya memasukkannya ke eager chunk.'
      ],
      quiz: [
        [
          'Apa yang diaktifkan oleh `withComponentInputBinding()` di `provideRouter`?',
          ['Two-way binding ke `location.hash`', 'Route param, query param, dan resolved data otomatis terikat langsung ke signal `input()` component', 'Autentikasi otomatis', 'Preloading seluruh lazy chunk'],
          'Opsi ini memetakan state router ke input component yang cocok agar component terbebas dari ketergantungan ke `ActivatedRoute`.'
        ],
        [
          'Mengapa lebih baik memakai `loadComponent: () => import(\'./admin\').then(m => m.Admin)` dibanding `component: Admin` untuk halaman sekunder?',
          ['Halaman berjalan di background thread', 'Memecah `Admin` menjadi lazy JS chunk terpisah yang baru dimuat saat dikunjungi', 'Mengaktifkan SSR', 'Menjadikan `Admin` singleton'],
          'Dynamic `import()` memberi tahu bundler untuk menghasilkan chunk terpisah sehingga bundle awal lebih ramping.'
        ],
        [
          'Di mana route `{ path: \'**\', component: NotFound }` wajib diletakkan?',
          ['Di urutan pertama `routes`', 'Di urutan paling akhir `routes`, karena pencocokan bersifat first-match wins', 'Di dalam setiap child route', 'Hanya pada lazy route'],
          'Router berhenti pada route pertama yang cocok; menaruh `**` lebih awal akan menangkap URL yang sebenarnya valid.'
        ]
      ]
    },
    forms: {
      title: 'Signal Forms dan validasi',
      why: 'Sebagian besar UI enterprise adalah formulir dengan field kondisional, validasi lintas field, dan pemetaan error dari server. Signal Forms Angular (`@angular/forms/signals`) menggantikan boilerplate `FormGroup` dengan model signal bertipe penuh dan skema validasi deklaratif.',
      points: [
        'Mulai dari model `signal(...)` non-nullable (pakai `\'\'`, `0`, `false`, `[]` — jangan pernah `null` atau `undefined`), lalu oper ke `form(this.model, schemaPath => ...)`.',
        'Ikat input dengan `[formField]="myForm.name"`. Karena `[formField]` sudah mengatur `disabled`, `readonly`, `hidden`, `name`, dan `value`, jangan pernah menambahkan atribut bentrok seperti `[value]`, `[disabled]`, `min`, atau `max` pada elemen input.',
        'Baca state dengan **memanggil field sebagai fungsi**: `myForm.name().touched()`, `myForm.name().errors()`, `myForm().invalid()` (hanya `.length` pada sub-pohon array yang tanpa `()`).',
        'Susun aturan secara deklaratif di skema: `required()`, `min()`, `email()`, `validate()` (kembalikan `undefined` saat valid), `applyWhen()` untuk aturan kondisional, `applyEach()` untuk array, dan `validateAsync()` untuk pengecekan ke server.',
        'Tangani submit dengan `submit(this.myForm, async () => { ... })`: fungsi ini otomatis menandai semua field sebagai touched dan hanya menjalankan callback `async` bila seluruhnya valid.',
        'Saat menangani aplikasi Angular versi sebelumnya, kamu masih akan menemui **Reactive Forms** (`FormGroup`, `NonNullableFormBuilder`, `Validators`) — gagasan model-driven yang sama, hanya dibangun di atas stream RxJS bukan signal.'
      ],
      practice: 'Tambahkan field `sku` ke form di atas dengan `pattern(s.sku, /^[A-Z]{3}-\\d{3}$/, { message: \'Use ABC-123\' })` serta aturan lintas-field `validate()` yang melarang diskon di atas 50% ketika `price < 20`. Submit saat SKU tidak valid dan buktikan `submit()` menandai semua field sebagai touched tanpa menjalankan callback.',
      teach: 'Jelaskan perbedaan `productForm.name` (node field) dan `productForm.name()` (signal `FieldState`-nya), serta alasan Signal Forms menghindari `null` di dalam model.',
      analogy: 'Signal Forms mengubah form menjadi kontrak bertipe yang ditopang langsung oleh satu signal sumber kebenaran. `[formField]` menyambungkan input DOM ke state field tersebut, dan memanggil `field()` ibarat membuka panel instrumen live (`valid()`, `touched()`, `errors()`) milik input itu.',
      pitfalls: [
        'Lupa tanda kurung saat membaca state field: menulis `form.name.errors()` alih-alih `form.name().errors()`.',
        'Menaruh `null` di model awal `signal({ name: null })` alih-alih `\'\'` atau `0`.',
        'Menambahkan atribut `[disabled]`, `[value]`, `min`, atau `max` pada input yang terikat `[formField]` — definisikan semua itu di dalam skema.',
        'Mengembalikan `null` dari fungsi `validate()` kustom (kembalikan `undefined` saat valid) atau lupa `async` pada callback `submit()`.'
      ],
      quiz: [
        [
          'Bagaimana cara membaca apakah `productForm.name` sudah pernah disentuh (touched)?',
          ['`productForm.name.touched()`', '`productForm.name().touched()`', '`productForm().name.touched`', '`productForm.name.get(\'touched\')`'],
          'Memanggil field-nya (`productForm.name()`) mengembalikan `FieldState`, yang menyediakan signal `touched()`.'
        ],
        [
          'Saat memakai `[formField]` pada `<input type="number">`, di mana aturan nilai minimum seharusnya ditempatkan?',
          ['Sebagai `min="1"` pada input HTML', 'Di dalam skema `form()` memakai `min(s.price, 1)`', 'Di dalam handler `(change)`', 'Di dalam `ngOnInit`'],
          '`[formField]` memegang kendali atas state input dan melarang atribut template `min`/`max`/`disabled`/`value`; aturan ditaruh di skema.'
        ],
        [
          'Apa yang otomatis dilakukan `submit(this.form, async () => ...)` sebelum memeriksa validitas?',
          ['Me-reset model ke nilai awal', 'Menandai seluruh field sebagai touched agar pesan error tampil', 'Mengirim request POST', 'Menghapus semua server error'],
          'Menandai semua field sebagai touched menampilkan error apabila pengguna langsung menekan Save tanpa mengisi kolom wajib, dan mencegah callback berjalan saat form belum valid.'
        ]
      ]
    },
    http: {
      title: 'HTTP, httpResource, dan berkomunikasi dengan ASP.NET Core',
      why: 'Di sinilah Angular bertemu dengan API ASP.NET Core dan database SQL kamu. Pembacaan reaktif `httpResource`, functional interceptor, proteksi XSRF, serta pemetaan RFC 9457 `ProblemDetails` membuat kode jaringan tetap rapi, bisa dibatalkan, dan type-safe.',
      points: [
        'Gunakan `httpResource(() => ...)` untuk pembacaan `GET` reaktif: setiap kali signal di dalam fungsi URL-nya berubah, request yang sedang berjalan otomatis dibatalkan dan request baru dikirim. Kembalikan `undefined` untuk melewati fetch.',
        'Selalu jaga akses `httpResource.value()` dengan `.hasValue()` (atau cek `.error()` terlebih dahulu): membaca `.value()` saat resource berstatus `\'error\'` akan melempar error.',
        'Gunakan `HttpClient` (`post`, `put`, `patch`, `delete`) di dalam service atau handler untuk **mutasi** — pemanggilan `HttpClient` mengembalikan cold `Observable`, jadi tidak ada request yang dikirim sebelum di-subscribe (atau ditunggu dengan `firstValueFrom`).',
        'Konfigurasikan `provideHttpClient(withInterceptors([authInterceptor]))`: functional interceptor bekerja seperti **middleware ASP.NET Core**, berjalan pada request keluar dan response masuk. Gandakan `HttpRequest` yang immutable dengan `req.clone(...)`.',
        'Ubah `ProblemDetails` dari ASP.NET Core (`title` dan `errors`) menjadi `ApiError` bertipe sehingga error validasi menempel persis di kontrol form yang bersangkutan.',
        'Di mode development, proksikan `/api` ke port ASP.NET Core (`proxy.conf.json`) atau izinkan `http://localhost:4200` di CORS (`builder.Services.AddCors`). `provideHttpClient()` otomatis menyiapkan XSRF (cookie `XSRF-TOKEN` → header `X-XSRF-TOKEN`) untuk request mutasi same-origin.'
      ],
      practice: 'Hubungkan `ProductsPage` ke API validasi ASP.NET Core kamu memakai `proxy.conf.json` (atau CORS ke `http://localhost:4200`). Kirim harga negatif dan pastikan `ProblemDetails` terpetakan langsung ke `fieldErrors()[\'Price\']` di samping input. Sertakan juga `parse` dengan skema runtime pada `httpResource` agar payload API yang tak sesuai langsung gagal dengan rapi.',
      teach: 'Jelaskan mengapa `httpResource` dipilih untuk membaca data sementara `HttpClient` dipakai untuk menulis data, serta bagaimana `HttpInterceptorFn` setara dengan middleware ASP.NET Core.',
      analogy: '`httpResource` ibarat loket informasi pintar yang langsung menyobek nomor antrean lamamu begitu kamu mengganti pertanyaan sebelum petugas sempat kembali. `HttpInterceptorFn` adalah pos pemeriksaan yang dilewati setiap amplop keluar dan masuk secara berurutan.',
      pitfalls: [
        'Membaca `products.value()` di template tanpa `@if (products.hasValue())` atau `@if (products.error())` — `.value()` melempar error saat statusnya `\'error\'`.',
        'Memanggil `this.http.post(...)` tanpa subscribe atau menunggu `firstValueFrom(...)`: cold `Observable` tidak mengirim apa pun tanpa subscriber.',
        'Mengubah `req.headers` langsung di dalam interceptor alih-alih memakai `req.clone(...)`.',
        'Meninggalkan konfigurasi `CORS` backend ASP.NET Core hanya untuk `:5173` sementara Angular berjalan di `:4200`.'
      ],
      quiz: [
        [
          'Apa yang terjadi jika kamu membaca `userResource.value()` langsung saat request HTTP gagal?',
          ['Mengembalikan `undefined`', 'Melempar error karena resource berada pada status `\'error\'`', 'Mengulang request secara otomatis', 'Mengembalikan objek mentah `HttpErrorResponse`'],
          'Lindungi pembacaan dengan `hasValue()` atau periksa `error()` terlebih dahulu.'
        ],
        [
          'Mengapa `this.http.delete(\'/api/products/1\')` tidak melakukan apa pun jika nilai kembaliannya diabaikan?',
          ['Method `DELETE` diblokir secara default', '`HttpClient` mengembalikan cold `Observable` yang baru berjalan ketika di-subscribe', 'Interceptor membatalkan panggilan yang tidak di-await', 'Angular mewajibkan `HttpHeaders`'],
          'Cold observable menunggu subscriber (atau `firstValueFrom` / `toSignal`) sebelum membuka request jaringan.'
        ],
        [
          'Kamu perlu menambahkan header auth pada setiap API request yang keluar. Di mana tempat yang tepat?',
          ['Di setiap template component', 'Di dalam functional `HttpInterceptorFn` yang didaftarkan lewat `provideHttpClient(withInterceptors([...]))`', 'Di dalam fungsi `parse` milik `httpResource`', 'Di dalam `router.navigate`'],
          'Functional interceptor membungkus seluruh request `HttpClient` dan `httpResource` di satu tempat terpusat.'
        ]
      ]
    },
    rxjs: {
      title: 'Stream RxJS dan interop dengan Signal',
      why: 'Signal unggul untuk menyimpan nilai state sinkron; RxJS `Observable` unggul mengatur **event seiring waktu** — ketikan dengan debounce, balapan request pencarian, retry, dan pencegahan klik ganda. Menguasai keduanya sekaligus menjembatani keduanya dengan bersih sangat penting di Angular.',
      points: [
        'Sebuah **Signal** selalu punya nilai sekarang detik ini; sebuah **Observable** memodelkan rangkaian event asinkron sepanjang waktu (`debounceTime`, `retry`, pembatalan).',
        'Operator flattening tingkat lanjut menentukan nasib event baru yang datang sebelum panggilan asinkron sebelumnya selesai:',
        '**`switchMap`**: membatalkan inner request sebelumnya dan hanya mempertahankan yang terbaru — ideal untuk pencarian typeahead.',
        '**`exhaustMap`**: mengabaikan event baru selama request saat ini masih berjalan — ideal untuk tombol Bayar / Submit guna mencegah klik ganda.',
        '**`concatMap`** mengantre secara berurutan (penulisan serial); **`mergeMap`** menjalankan semuanya bersamaan.',
        'Cegah kebocoran memori dengan `takeUntilDestroyed()` (di dalam injection context, atau kirim `DestroyRef`), atau ubah stream ke signal memakai `toSignal(obs$, { initialValue })` yang otomatis unsubscribe.',
        'Jembatani arah sebaliknya dengan `toObservable(mySignal)` ketika kamu ingin menerapkan operator RxJS seperti `debounceTime` + `switchMap` pada sebuah signal.'
      ],
      practice: 'Catat output `compareFlattening` dengan dua pemicu cepat berselang 20 ms terhadap inner observable berdurasi 100 ms pada mode `\'switch\'` maupun `\'exhaust\'`. Jelaskan mengapa `\'switch\'` hanya mencetak pemicu kedua sedangkan `\'exhaust\'` hanya mencetak pemicu pertama.',
      teach: 'Jelaskan `switchMap` vs `exhaustMap` lewat contoh fitur UI nyata untuk masing-masing, serta alasan `toSignal` menyingkirkan pemanggilan `unsubscribe()` manual.',
      analogy: '`switchMap` adalah koki yang membuang roti setengah jadi begitu pelanggan berteriak "jadi ayam aja!". `exhaustMap` adalah tombol lift: menekannya lima kali saat pintu menutup tidak memanggil lima lift sekaligus.',
      pitfalls: [
        'Memakai `mergeMap` untuk pencarian typeahead: respons jaringan yang datang tidak berurutan menimpa hasil terbaru dengan hasil lama.',
        'Memanggil `.subscribe()` tanpa `takeUntilDestroyed()` atau pipe `async`, menyisakan langganan hantu berjalan setelah berpindah halaman.',
        'Melewatkan `{ initialValue }` pada `toSignal` untuk observable asinkron sehingga tipe signal tak terduga menjadi `T | undefined`.',
        'Menumpuk `.subscribe()` di dalam `.subscribe()` lain alih-alih merangkainya dengan `switchMap` / `exhaustMap`.'
      ],
      quiz: [
        [
          'Operator mana yang membatalkan request HTTP pencarian yang masih berjalan begitu pengguna mengetik karakter baru?',
          ['`mergeMap`', '`concatMap`', '`switchMap`', '`exhaustMap`'],
          '`switchMap` melakukan unsubscribe dari inner observable sebelumnya (membatalkan request HTTP) tiap kali nilai luar baru datang.'
        ],
        [
          'Pengguna mengklik ganda tombol "Place order". Operator mana yang mengabaikan klik kedua sampai request pertama selesai?',
          ['`switchMap`', '`exhaustMap`', '`mergeMap`', '`debounceTime`'],
          '`exhaustMap` mengabaikan pemicu baru selama inner observable masih aktif.'
        ],
        [
          'Apa yang diotomatisasi oleh `takeUntilDestroyed()`?',
          ['Mengulang request HTTP yang gagal', 'Menyelesaikan langganan observable saat component atau service pemiliknya dihancurkan', 'Mengonversi signal menjadi observable', 'Melakukan throttle event'],
          'Operator ini otomatis mengikat masa hidup subscription ke `DestroyRef` aktif.'
        ]
      ]
    },
    guards: {
      title: 'Route guard, resolver, dan error boundary',
      why: 'Melindungi route, menangani redirect dengan rapi, dan menjaga kegagalan runtime di template agar tidak membuat seluruh layar kosong mengubah demo menjadi aplikasi tangguh. Ingat: guard di client mengatur UX, sedangkan API ASP.NET Core menegakkan keamanan sesungguhnya.',
      points: [
        'Guard adalah fungsi biasa (`CanActivateFn`, `CanMatchFn`, `CanDeactivateFn`) yang berjalan di injection context, sehingga kamu bisa langsung memakai `inject()`.',
        'Kembalikan `true` untuk mengizinkan, `false` untuk memblokir, atau `UrlTree` / `RedirectCommand` (`router.parseUrl(\'/login\')`) untuk mengalihkan dengan bersih.',
        '`CanMatchFn` memutuskan apakah sebuah route ikut dicocokkan (cocok untuk peran pengguna atau feature flag, jatuh ke route lain saat `false`); `CanActivateFn` berjalan setelah route cocok.',
        'Guard di dalam array yang sama berjalan serentak jika bersifat asinkron; jangan mengasumsikan satu guard di `canActivate: [a, b]` selesai lebih dulu sebelum `b` mulai.',
        '**Batas keamanan**: client guard hanya menyembunyikan route UI; pengguna tetap bisa memotong JavaScript lewat DevTools. Selalu tegakkan `RequireAuthorization()` dan kepemilikan data di API ASP.NET Core.',
        '**Error boundary** (Angular v22.2+): bungkus sub-pohon template yang berisiko dalam `@boundary { ... } @error (let err; reset = $reset) { ... }` untuk menangkap error render secara lokal dan memberi tombol coba ulang lewat `$reset()`.'
      ],
      practice: 'Lindungi route `/admin` dengan `canMatch` dan `canActivate`, lalu bungkus component grafik yang melempar error saat diberi input buruk dengan `@boundary`. Pastikan klik Retry memanggil `$reset()` dan memulihkan tampilan tanpa me-reload halaman. Lalu panggil endpoint `/api/orders` via `curl` tanpa token dan pastikan ASP.NET Core tetap membalas `401`.',
      teach: 'Jelaskan perbedaan `CanActivateFn` dan `CanMatchFn`, serta mengapa route guard saja tidak pernah cukup untuk mengamankan API.',
      analogy: 'Route guard itu tali pembatas lantai museum: ia memandu pengunjung dengan halus ke loket tiket (`RedirectCommand`). `RequireAuthorization()` di API ASP.NET Core adalah pintu brankas baja — tidak ada yang mengandalkan tali beludru untuk melindungi brankas. `@boundary` adalah sekring listrik untuk satu ruangan agar satu bohlam putus tidak memadamkan seisi gedung.',
      pitfalls: [
        'Mengira `canActivate` mencegah orang memanggil `/api/admin/...` langsung lewat `fetch` atau `curl`.',
        'Menaruh `@boundary` di dalam component membungkus `<ng-content />` dengan harapan menangkap error konten proyeksi — bungkus component-nya dari template parent.',
        'Membuat `guardB` bergantung pada efek samping `guardA` pada `canActivate: [guardA, guardB]`, padahal guard asinkron berjalan bersamaan.',
        'Memakai `ResolveFn` untuk request lambat non-kritis tanpa indikator loading: navigasi membeku di halaman lama sampai resolver selesai.'
      ],
      quiz: [
        [
          'Mengapa otorisasi tetap wajib ditegakkan di ASP.NET Core meskipun route Angular sudah memiliki guard `canActivate`?',
          ['Guard Angular tidak berjalan di ponsel', 'Kode browser berjalan di mesin pengguna dan bisa dilewati; hanya server yang dapat menegakkan hak akses', 'Guard hanya aktif saat development', 'Router menyimpan token lama di cache'],
          'Client guard memperbaiki UX dengan mengarahkan pengguna yang belum login, sedangkan kebijakan server melindungi data sebenarnya.'
        ],
        [
          'Apa perbedaan `canMatch` dibanding `canActivate` saat mengembalikan `false`?',
          ['`canMatch` langsung menampilkan 404', '`canMatch` melewati definisi route tersebut sehingga router dapat mencocokkan route lain di bawahnya dengan path yang sama', '`canMatch` hanya berjalan di child route', 'Perilakunya sama persis'],
          'Dengan `canMatch`, kamu dapat mendefinisikan dua route untuk `/home` (misalnya dashboard admin vs anggota) dan memilih yang tepat secara bersih.'
        ],
        [
          'Dalam blok `@boundary` Angular v22.2+, apa efek memanggil `$reset()` di dalam `@error`?',
          ['Me-reload tab browser', 'Mencoba merender ulang blok `@boundary` aslinya', 'Menghapus semua signal aplikasi', 'Memanggil `Router.navigate([\'/\'])`'],
          '`$reset()` mereset status error dan mencoba merender kembali sub-pohon template yang dilindungi.'
        ]
      ]
    },
    testing: {
      title: 'Testing zoneless: component, routing, dan HTTP',
      why: 'Tes Angular modern berjalan di Vitest tanpa Zone.js. Alih-alih memanggil `fixture.detectChanges()` secara manual, kamu mengubah signal atau mengklik elemen DOM lalu `await fixture.whenStable()` — menguji aplikasi lewat perilaku pengguna nyata.',
      points: [
        'Ikuti pola **Act → `await fixture.whenStable()` → Assert**: picu perubahan signal, event input, atau klik tombol, tunggu scheduler zoneless Angular merender, lalu periksa DOM. Untuk component yang memakai `httpResource`, panggil `TestBed.tick()` sekali agar effect resource mengirimkan request-nya sebelum `HttpTestingController.expectOne()` menjawabnya.',
        '**Jangan memanggil `fixture.detectChanges()` atau `markForCheck()`** dalam tes zoneless: `detectChanges()` manual menyembunyikan ketergantungan reaktif yang terlewat dan tidak merefresh child `OnPush` sebagaimana jalannya di produksi.',
        'Uji integrasi HTTP dengan `provideHttpClient()` + `provideHttpClientTesting()` dan `HttpTestingController`: verifikasi method/URL/body secara persis dan kirim balik respons realistis termasuk `400` `ProblemDetails`.',
        'Uji component ber-route menggunakan `RouterTestingHarness.create()` + `provideRouter(...)` alih-alih me-mock `Router` — cara ini menguji guard, resolver, dan binding input yang sesungguhnya.',
        'Pilih elemen DOM layaknya pengguna dan pembaca layar (`getByRole`, `getByLabelText`, `role="alert"`), bukan lewat properti privat component atau class CSS utilitas.',
        'Untuk component `@angular/aria` atau Material, gunakan CDK **Component Harness** (`TestbedHarnessEnvironment`) agar tes tidak rapuh saat markup internal berubah.'
      ],
      practice: 'Perluas rangkaian tes ini untuk jalur sukses: kirim balik respons `201` pada `POST /api/products`, pastikan `httpResource` memuat ulang `GET /api/products`, dan pastikan item baru muncul di daftar. Setelah itu tulis tes `RouterTestingHarness` untuk route `ProductDetail`.',
      teach: 'Jelaskan mengapa tes zoneless memakai `await fixture.whenStable()` alih-alih `fixture.detectChanges()`, dan apa yang ditangkap `http.verify()` di akhir pengujian.',
      analogy: '`await fixture.whenStable()` itu menunggu dapur restoran selesai menata hidangan setelah kamu menyerahkan bon pesanan. Masuk ke dapur dengan `detectChanges()` memaksa satu piring keluar lebih cepat, menyembunyikan fakta bahwa bel dapurnya (`signal` / event) sebenarnya tidak berbunyi.',
      pitfalls: [
        'Memanggil `fixture.detectChanges()` karena kebiasaan lama dalam tes zoneless `OnPush` — ini menutupi reaktivitas yang rusak.',
        'Menunggu `fixture.whenStable()` sebelum me-flush request `httpResource` yang sedang berjalan — `whenStable()` menunggu tugas tertunda selesai, jadi flush lebih dulu dengan `TestBed.tick()` + `http.expectOne()`.',
        'Lupa memanggil `http.verify()` di `afterEach`, sehingga panggilan API liar atau ganda terlewat.',
        'Me-mock `Router` secara manual alih-alih menguji konfigurasi route dan guard nyata lewat `RouterTestingHarness`.',
        'Memeriksa field privat component alih-alih teks DOM terender dan atribut ARIA.'
      ],
      quiz: [
        [
          'Dalam tes Angular v22 zoneless, bagaimana cara menunggu perubahan signal dan event DOM selesai dirender?',
          ['Memanggil `fixture.detectChanges()` berulang kali', 'Menunggu dengan `await fixture.whenStable()`', 'Memanggil `tick(100)` dengan `fakeAsync`', 'Memanggil `fixture.changeDetectorRef.markForCheck()`'],
          'Pembaruan zoneless dijadwalkan secara asinkron; `whenStable()` menunggu proses rendering dan microtask yang tertunda dengan rapi.'
        ],
        [
          'Apa yang diperiksa oleh `httpTesting.verify()` di dalam `afterEach`?',
          ['Kesesuaian tipe TypeScript dengan API', 'Bahwa tidak ada request HTTP tak terduga atau belum di-flush yang masih terbuka', 'Keberadaan header CORS', 'Bahwa backend asli sedang menyala'],
          'Method ini menggagalkan tes jika component mengirim request tambahan yang tidak diantisipasi tesmu.'
        ],
        [
          'Alat yang direkomendasikan untuk menguji component yang melakukan navigasi atau membaca parameter route?',
          ['Me-mock `ActivatedRoute` dengan objek biasa', '`RouterTestingHarness` bersama `provideRouter(...)`', 'Mengganti `RouterLink` di dalam tes', 'Menguji lewat E2E saja'],
          '`RouterTestingHarness` menjalankan pencocokan route, guard, resolver, dan binding input component secara nyata.'
        ]
      ]
    },
    cd: {
      title: 'Change detection zoneless dan performa rendering',
      why: 'Aplikasi Angular versi lama mengandalkan Zone.js yang mem-patch setiap timer dan event browser lalu memeriksa seluruh pohon component dari atas ke bawah. Angular modern memakai `OnPush` + Signal secara default dan berjalan zoneless — hanya menyegarkan view yang signal-nya memang berubah.',
      points: [
        '**Cara kerja Zone.js (`Eager` lama)**: setiap klik, timer, atau respons HTTP memberi tahu Zone.js, yang kemudian memeriksa **seluruh component** dari root ke bawah, bahkan sub-pohon yang tidak tersentuh.',
        '**`ChangeDetectionStrategy.OnPush`** (kini default di Angular 22; `Default` berstatus deprecated dan digantikan `Eager`): sebuah view hanya diperiksa bila referensi input berubah, event DOM terjadi di dalamnya atau di child, `markForCheck()` dipanggil, atau **signal yang dibaca di templatenya** berubah.',
        '**Change detection signal lokal (zoneless)**: ketika sebuah signal diperbarui, Angular hanya menandai view spesifik yang membaca signal tersebut sebagai kotor — melewati parent, sibling, dan cabang lain yang tidak berkaitan.',
        'Jangan pernah memutasi objek atau array yang dikirim ke `input()` (`items.push(x)`): `OnPush` membandingkan input berdasarkan referensi (`Object.is`), jadi mutasi di tempat membuat pembaruan terlewat.',
        'Hindari komputasi berat di dalam template (jangan menulis `[items]="items().filter(...)"` atau membuat array/objek baru di dalam `{{ }}`). Turunkan sekali lewat `computed()` agar kerja hanya berjalan saat input benar-benar berubah.',
        'Ukur performa dengan Angular DevTools (flamegraph & sorotan change detection) dan virtualisasikan daftar yang sangat panjang (`@angular/cdk/scrolling`).'
      ],
      practice: 'Buka visualisasi penjelajah Change detection di atas. Picu pembaruan pada `Card B` di ketiga mode (`Eager`, `OnPush`, `Zoneless + Signal`) dan bandingkan component mana saja yang diperiksa — terutama saat mengaktifkan signal Cart bersama. Lalu jalankan profiler Angular DevTools pada daftar 5.000 baris.',
      teach: 'Jelaskan bagaimana Signal memampukan Angular melewati pengecekan parent dan sibling component tanpa Zone.js.',
      analogy: 'Change detection Zone.js lama seperti satpam hotel yang mengetuk setiap kamar setiap kali ada satu tamu menekan bel. `OnPush` + Signal adalah papan saklar langsung: hanya kamar yang kabelnya berdering yang menyala, dan tidak ada pintu lain yang dibuka.',
      pitfalls: [
        'Memanggil `items.filter(...)` atau membangun literal `{ ... }` langsung di ekspresi template, yang mengalokasikan array baru di tiap check dan mematahkan referensi `@for` / input child.',
        'Memutasi array di tempat sebelum mengirimkannya ke child `OnPush` (`Object.is` tetap melihat referensi yang sama).',
        'Mengubah component lambat ke `ChangeDetectionStrategy.Eager` alih-alih memperbaiki mutasi non-signal yang keliru.',
        'Memasang beban Zone.js atau panggilan `ApplicationRef.tick()` manual ketika signal sudah memicu pembaruan lokal dengan rapi.'
      ],
      quiz: [
        [
          'Di Angular 22, strategi `ChangeDetectionStrategy` mana yang aktif secara default?',
          ['`ChangeDetectionStrategy.Eager`', '`ChangeDetectionStrategy.OnPush`', '`ChangeDetectionStrategy.Manual`', 'Polling khusus Zone saja'],
          'Angular modern menjadikan `OnPush` sebagai bawaan, sementara `Default` dideprecate dan diganti menjadi `Eager`.'
        ],
        [
          'Sebuah signal `cartCount` bersama yang hanya dibaca oleh `CartBadge` dan `Card B` berubah dalam aplikasi zoneless. Template mana yang ikut diperbarui?',
          ['Seluruh aplikasi mulai dari `App`', 'Hanya `CartBadge` dan `Card B` (view yang membaca `cartCount`)', 'Hanya `App` dan `ProductList`', 'Tidak ada yang berubah tanpa `markForCheck()`'],
          'Signal hanya memberi tahu view konsumen yang benar-benar membacanya saat evaluasi template.'
        ],
        [
          'Mengapa array hasil saringan sebaiknya berasal dari `computed()` alih-alih `items().filter(...)` langsung di dalam `@for`?',
          ['`@for` tidak mendukung pemanggilan method', 'Pemanggilan di template dieksekusi ulang setiap kali check dan menghasilkan referensi array baru terus-menerus', '`computed()` otomatis memanggil backend', 'Pemanggilan di template tidak bisa membaca signal'],
          '`computed()` meng-cache array hasil saringan sampai `items()` atau `query()` benar-benar berubah.'
        ]
      ]
    },
    ssr: {
      title: 'Deferrable view (@defer), SSR, dan hybrid rendering',
      why: 'Pemuatan awal yang gesit bertumpu pada dua tuas: memecah UI non-kritis ke chunk lazy `@defer`, dan memilih per route antara client rendering (CSR), static prerendering (SSG), serta server rendering (SSR) dengan hydration.',
      points: [
        '**`@defer`** melakukan code-splitting otomatis pada standalone component (yang tidak direferensikan secara eager di file yang sama) dan memuatnya saat pemicu terjadi (`on viewport`, `on interaction`, `on hover`, `prefetch on idle`).',
        'Jaga layout shift (CLS) tetap nol: jangan pernah menunda konten LCP di atas lipatan layar, samakan ukuran `@placeholder` dengan blok aslinya, dan pakai `after` / `minimum` pada `@loading` untuk mencegah kedipan.',
        '**Hybrid rendering (`ServerRoute`)**: pilih `RenderMode.Prerender` untuk halaman statis/katalog, `RenderMode.Server` untuk halaman SEO dinamis, dan `RenderMode.Client` untuk dashboard yang butuh login.',
        'Aktifkan **`provideClientHydration()`** (di Angular 22+, incremental hydration dan event replay sudah aktif secara default). Gabungkan `@defer (on viewport; hydrate on interaction)` agar HTML hasil render server tetap ringan sampai pengguna berinteraksi.',
        'Jaga kode tetap aman di server: jangan sentuh `window`, `document`, atau `localStorage` saat SSR — inject `DOCUMENT`, jalankan kode DOM khusus browser di `afterNextRender()`, dan perlakukan `REQUEST` / `REQUEST_CONTEXT` sebagai nullable (`null` pada CSR/SSG).',
        'Nonaktifkan HTTP transfer cache (`transferCache: false` atau filter) untuk panggilan API terautentikasi agar respons pribadi pengguna tidak ikut tersimpan di HTML bersama.'
      ],
      practice: 'Bungkus component grafik berat di dalam `@defer (on viewport; prefetch on idle)` dengan `@placeholder` bertinggi tetap, lalu amati di tab Network bagaimana JS chunk-nya baru terunduh saat kamu menggulir ke bawah. Cek juga dampak pada CLS bila tinggi placeholder dihilangkan.',
      teach: 'Jelaskan kapan memilih `RenderMode.Client`, `RenderMode.Prerender`, dan `RenderMode.Server` di satu aplikasi yang sama, serta mengapa `window` tidak boleh dibaca di constructor component saat SSR.',
      analogy: 'SSR dengan incremental hydration seperti menata etalase toko yang sudah rapi saat subuh (`RenderMode.Server`) agar pengunjung langsung melihat barangnya, sementara eskalator berat di lantai dasar (`hydrate on interaction`) baru dinyalakan persis saat ada orang menginjaknya.',
      pitfalls: [
        'Menggunakan component di luar `@defer` dalam file yang sama (misalnya di `viewChild`), yang memaksanya masuk ke bundle utama.',
        'Menunda konten hero di atas lipatan layar atau menghilangkan dimensi placeholder sehingga merusak LCP dan CLS.',
        'Membaca `window` atau `localStorage` tanpa syarat di constructor/inisialisasi field, yang membuat build SSR crash.',
        'Menyimpan respons `HttpClient` yang terautentikasi di transfer cache SSR tanpa filter sehingga berisiko membocorkan data pengguna ke HTML.'
      ],
      quiz: [
        [
          'Apa yang menggagalkan pemisahan component di dalam `@defer` menjadi lazy bundle tersendiri?',
          ['Menambahkan blok `@placeholder`', 'Mereferensikan component tersebut di luar blok `@defer` dalam file yang sama (misalnya lewat `viewChild`)', 'Memakai `prefetch on idle`', 'Menjadikannya standalone'],
          'Referensi eager apa pun di file yang sama memaksa TypeScript/Angular menyertakannya dalam chunk utama.'
        ],
        [
          '`RenderMode` terbaik untuk halaman pengaturan akun terautentikasi yang tidak memerlukan SEO?',
          ['`RenderMode.Prerender`', '`RenderMode.Client`', '`RenderMode.Server` dengan cache publik', 'File teks statis'],
          'Dashboard khusus pengguna tidak diuntungkan oleh SSR/prerendering dan menghemat beban server lewat `RenderMode.Client`.'
        ],
        [
          'Di mana penyiapan DOM khusus browser (seperti membaca `getBoundingClientRect` atau `localStorage`) harus dijalankan pada component yang mendukung SSR?',
          ['Langsung di constructor', 'Di dalam `afterNextRender()` / `afterRenderEffect()`', 'Di `ngOnInit` tanpa pengecekan', 'Di konfigurasi `ServerRoute`'],
          '`afterNextRender` hanya berjalan di browser setelah rendering, tidak pernah di server Node SSR.'
        ]
      ]
    },
    arch: {
      title: 'Arsitektur, Angular Aria, dan aksesibilitas',
      why: 'Aplikasi yang tahan lama memisahkan state berdasarkan kepemilikannya, mematuhi batas folder yang terprediksi, berbagi kontrak API dari OpenAPI, dan mengirimkan widget interaktif yang aksesibel (tab, combobox, accordion) alih-alih click handler pada `<div>` yang rusak.',
      points: [
        'Susun folder per **fitur** dengan nama sesuai tujuan (`core/`, `features/products/`, `shared/ui/`): taruh singleton dan model (`*.model.ts`) di `core/`, layar domain di `features/`, dan component presentasional pakai ulang di `shared/`.',
        'Klasifikasikan state sebelum memilih alatnya: **state server** (`httpResource`), **state URL** (binding input router), **state form** (`form()`), **state UI lokal** (`signal()`), dan **state fitur bersama** (`@Service()` yang mengekspos signal `.asReadonly()`).',
        'Pasangkan Tailwind CSS v4 (`@import \'tailwindcss\';` — tanpa `tailwind.config.js`) dengan **Angular Aria** (`@angular/aria`) untuk widget kompleks seperti tab, combobox, listbox, dan accordion.',
        'Directive Angular Aria (`ngTabs`, `ngTabList`, `ngTab`, `ngTabPanel`, `ngCombobox`) menangani roving focus, panah keyboard, dan atribut ARIA (`[aria-selected]`, `[aria-expanded]`) sementara 100% HTML & CSS tetap milikmu.',
        'Jaga DTO TypeScript tetap sinkron dengan ASP.NET Core dengan men-generate tipe dari `/openapi/v1.json` (misalnya `openapi-typescript`) alih-alih menyalin interface secara manual.',
        'Verifikasi aksesibilitas secara menyeluruh: utamakan HTML semantik, `<label for>` eksplisit + pesan error ber-`aria-describedby`, navigasi keyboard tanpa jebakan fokus, serta `title` route yang unik.'
      ],
      practice: 'Bangun filter autocomplete yang aksesibel menggunakan `@angular/aria/combobox` + `@angular/aria/listbox`, beri gaya `[aria-selected=\'true\']` dan `:focus-visible`, lalu operasikan seluruh halaman hanya dengan Tab, tombol Panah, Enter, dan Escape. Setelah itu generate tipe TypeScript dari endpoint `/openapi/v1.json` ASP.NET Core.',
      teach: 'Jelaskan bagaimana Angular Aria memisahkan perilaku keyboard/ARIA yang aksesibel dari tampilan visual, dan bagaimana kamu memutuskan apakah sebuah state milik `httpResource`, URL, atau `@Service()`.',
      analogy: 'Angular Aria adalah sistem kemudi dan rem tersembunyi di dalam mobil: kamu bebas merancang dashboard dan bodi (HTML + CSS) sesuka hati, sementara directive-nya memastikan tombol panah, fokus, dan sinyal screen reader bekerja aman secara bawaan.',
      pitfalls: [
        'Menaruh logika bisnis dan pemanggilan `HttpClient` langsung di component presentasional `shared/`.',
        'Membangun tab atau dropdown kustom dengan `<div (click)="...">` — tidak bisa dioperasikan lewat keyboard dan tak terlihat oleh pembaca layar.',
        'Masih memakai `tailwind.config.js` / directive `@tailwind` gaya Tailwind v3 di proyek Angular v22 alih-alih `@import \'tailwindcss\';`.',
        'Menyalin DTO C# secara manual ke file TypeScript sampai suatu hari perubahan nama di backend merusak produksi.'
      ],
      quiz: [
        [
          'Masalah apa yang diselesaikan `@angular/aria` yang tidak bisa dilakukan oleh CSS biasa?',
          ['Melakukan bundling Tailwind v4', 'Menyediakan peran WAI-ARIA, atribut state `aria-*`, serta perilaku navigasi panah/fokus keyboard secara headless', 'Mengambil skema OpenAPI', 'Menjalankan SSR'],
          'Directive headless merangkum interaksi keyboard dan ARIA yang rumit sehingga kamu cukup menulis markup dan styling CSS.'
        ],
        [
          'Saat mengatur styling CSS untuk `ngTab` dari Angular Aria, bagaimana cara menargetkan tab yang sedang aktif?',
          ['`.ng-tab-active`', '`.tab-btn[aria-selected=\'true\']`', '`::ng-deep .selected`', 'Menambahkan class `.active` terpisah secara manual'],
          'Angular Aria mengatur atribut native `aria-selected` / `aria-expanded` secara langsung, sehingga memberi style lewat atribut itu menjamin tampilan visual dan aksesibilitas selalu selaras.'
        ],
        [
          'Di mana state halaman (pagination) dan filter pencarian aktif sebaiknya disimpan pada katalog produk?',
          ['Hanya di dalam root `@Service()`', 'Di parameter query URL yang diikat lewat `withComponentInputBinding()`', 'Di `localStorage`', 'Di dalam `TabPanel`'],
          'Menaruh filter dan nomor halaman di URL membuat tampilan dapat dibagikan lewat tautan, disimpan sebagai bookmark, dan aman saat tombol Back atau Refresh ditekan.'
        ]
      ]
    }
  }
};
