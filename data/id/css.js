// Bahasa Indonesia — track CSS + Tailwind. Contoh kode tetap memakai versi aslinya.
I18N.lessons('css', {
  html: {
    title: 'HTML esensial: struktur dan makna',
    why: "CSS memberi style pada HTML dan React me-render HTML. Memilih element yang tepat memberimu dukungan keyboard, accessibility, dan makna untuk search engine secara gratis — dan memakai `div` untuk semuanya membuang semua itu.",
    points: [
      "HTML mendeskripsikan **apa sebenarnya sebuah konten**, bukan tampilannya: heading, paragraf, list, button, area navigasi.",
      "Satu halaman punya satu `<h1>` dan heading yang bersarang secara berurutan (`h2`, `h3`…). Pengguna screen reader bernavigasi lewat heading seperti lewat daftar isi.",
      "**Landmark** menyusun struktur halaman: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.",
      "Pakai `<button>` untuk aksi dan `<a href>` untuk navigasi. Dua-duanya secara default bisa difokus dan dioperasikan lewat keyboard; `<div>` yang bisa diklik tidak punya keduanya.",
      "Form: setiap input butuh `<label>`; `type` (`email`, `number`, `date`) memberi keyboard yang tepat dan validasi bawaan; `required`, `min`, `pattern` memvalidasi tanpa JavaScript.",
      "Gambar butuh teks `alt` yang menjelaskan fungsinya (`alt=\"\"` kosong kalau murni dekoratif). `class` dan `id` adalah pengait untuk CSS dan JavaScript."
    ],
    practice: "Di CSS playground, bangun kerangka halaman produk hanya dengan element semantik — tanpa `div`. Lalu navigasikan hanya dengan tombol Tab: apakah semuanya bisa dijangkau dan diaktifkan? Ganti button-nya dengan `div` yang bisa diklik, lalu coba lagi.",
    teach: "Jelaskan kenapa sebaiknya memakai `<button>` alih-alih `<div>` dengan click handler.",
    analogy: "HTML itu denah bangunan yang diberi label: ruangan ini dapur, ini pintu masuk, ini tangga. Cat dan perabot (CSS) datang belakangan. Denah yang semua ruangannya berlabel 'ruangan' memang masih bisa didekorasi — tapi tidak ada yang bisa menemukan dapurnya, apalagi tamu yang tidak bisa melihat.",
    pitfalls: [
      "`div` dan `span` untuk semuanya, lalu mengimplementasikan ulang focus, keyboard, dan role secara manual.",
      "Input yang punya placeholder tapi tidak punya label.",
      "Memilih level heading berdasarkan ukuran font-nya, bukan berdasarkan outline dokumen."
    ],
    quiz: [
      ["Element mana yang seharusnya memicu aksi seperti 'Add to cart'?", ["`<div onclick>`", "`<button>`", "`<a>` tanpa href", "`<span>`"], "Button bisa difokus, bisa dioperasikan lewat keyboard, dan diumumkan dengan benar tanpa kerja tambahan."],
      ["Untuk apa attribute `alt`?", ["Tooltip", "Teks alternatif yang mendeskripsikan gambar bagi orang dan tool yang tidak bisa melihatnya", "Nama file gambar", "Keyword SEO"], "Screen reader membacakannya, dan teksnya muncul saat gambar gagal dimuat."],
      ["Bagaimana `<label>` dihubungkan dengan input-nya?", ["Dengan diletakkan berdekatan", "`for` pada label yang cocok dengan `id` input (atau dengan membungkus input-nya)", "Lewat `class`", "Otomatis"], "Hubungan itu memberi input sebuah accessible name dan membuat label-nya bisa diklik."]
    ]
  },
  cascade: {
    title: 'Selector, cascade, dan specificity',
    why: "'Kenapa style saya tidak jalan?' adalah pertanyaan CSS yang pertama dan paling sering muncul. Jawabannya selalu cascade: seperangkat aturan tetap yang menentukan deklarasi mana yang menang.",
    points: [
      "Sebuah rule berbentuk `selector { property: value; }`. Selector menyasar berdasarkan element (`p`), class (`.card`), id (`#header`), attribute (`[type=email]`), atau state (`:hover`, `:focus-visible`).",
      "Combinator mengekspresikan hubungan: `nav a` (descendant), `ul > li` (direct child), `h2 + p` (sibling berikutnya).",
      "Ketika beberapa rule mengatur property yang sama, **cascade** memilih pemenangnya: importance, lalu origin dan layer, lalu **specificity**, lalu **urutan di source** (yang terakhir menang).",
      "Specificity dihitung sebagai (id, class, element). Satu id mengalahkan berapa pun class; satu class mengalahkan berapa pun element. Inline style mengalahkan semua selector; `!important` mengalahkan inline.",
      "Sebagian property **diwariskan** dari parent (color, font, line-height); kebanyakan property layout (margin, padding, border, width) tidak.",
      "Jaga specificity tetap rendah dan rata: beri style dengan satu class. Hindari id dan `!important` di stylesheet — setiap eskalasi membuat override berikutnya makin sulit."
    ],
    practice: "Di visualisasi specificity, tebak warna yang menang sebelum menyalakan atau mematikan tiap rule. Lalu buka CSS playground, tulis tiga rule yang saling bertabrakan untuk satu button, dan buat masing-masing menang bergantian tanpa memakai `!important`.",
    teach: "Jelaskan bagaimana browser memutuskan mana dari dua rule CSS yang bertabrakan yang berlaku untuk sebuah element.",
    analogy: "Cascade itu permainan kartu dengan peringkat yang ketat. Id adalah as, class adalah king, element adalah kartu angka — dan setumpuk king pun tidak bisa mengalahkan satu as. Kalau dua pemain memegang kartu yang sama, yang jalan terakhir yang menang. `!important` itu membalik meja: berhasil sekali, lalu semua orang ikut-ikutan membalik meja.",
    pitfalls: [
      "Mengira 11 class mengalahkan 1 id. Kolom specificity tidak pernah meluap ke kolom lain.",
      "Mengandalkan `!important` supaya menang, yang justru memulai perlombaan senjata.",
      "Menganggap semua property diwariskan. `border` dan `margin` pada parent tidak turun ke child."
    ],
    quiz: [
      ["Selector mana yang specificity-nya paling tinggi?", ["`.card .title`", "`#main`", "`div p span a`", "`.a.b.c`"], "Satu id (1,0,0) mengalahkan berapa pun class atau element."],
      ["Dua rule dengan specificity identik sama-sama mengatur `color`. Mana yang menang?", ["Yang pertama di file", "Yang dideklarasikan belakangan", "Tidak ada", "Yang lebih panjang"], "Kalau importance, origin, dan specificity-nya sama, urutan di source yang menentukan: yang terakhir menang."],
      ["Property mana yang secara default diwariskan?", ["`margin`", "`border`", "`color`", "`width`"], "Property teks seperti `color` dan `font` diwariskan; property box tidak."]
    ]
  },
  box: {
    title: 'Box model',
    why: "Setiap element adalah persegi panjang. Bug ukuran — element selebar 100% yang overflow dari parent-nya, celah misterius — adalah salah paham soal box model, dan semuanya lenyap begitu keempat lapisannya terlihat.",
    points: [
      "Dari dalam ke luar: **content**, **padding** (ruang di dalam border), **border**, **margin** (ruang di luar, di antara element).",
      "Default-nya `box-sizing: content-box`, artinya `width` hanya mengatur content; padding dan border ditambahkan di atasnya. `border-box` membuat `width` sudah termasuk padding dan border — sesuai yang diharapkan semua orang.",
      "Awali setiap project dengan `*, *::before, *::after { box-sizing: border-box; }`.",
      "Element `display: block` mengambil lebar penuh dan menumpuk ke bawah; element `inline` mengalir di dalam teks dan mengabaikan width/height; `inline-block` mengalir inline tapi menerima ukuran.",
      "Margin vertikal dari block yang bersebelahan **collapse** menjadi yang lebih besar. Padding dan `gap` pada flex/grid tidak collapse.",
      "`overflow` mengatur content yang tidak muat: `visible`, `hidden`, `auto` (scroll kalau perlu)."
    ],
    practice: "Pakai visualisasi box model untuk membuat element `content-box` 300px overflow dari parent 320px, lalu perbaiki dengan beralih ke `border-box`. Di dev tools, inspect element mana saja di halaman ini dan baca diagram box-nya.",
    teach: "Jelaskan perbedaan padding dan margin, dan apa yang diubah oleh `box-sizing: border-box`.",
    analogy: "Lukisan berbingkai di dinding. Lukisannya adalah content; karton putih di sekelilingnya adalah padding; bingkainya adalah border; dinding kosong antara bingkai ini dan bingkai berikutnya adalah margin. `border-box` artinya ketika kamu bilang 'ini lukisan 30 cm', yang kamu ukur adalah sisi luar bingkainya.",
    pitfalls: [
      "Memasang `width: 100%` plus padding di bawah `content-box` sehingga overflow dari parent.",
      "Berharap `width` atau margin vertikal bekerja pada element inline seperti `span`.",
      "Kaget dengan margin yang collapse lalu menambah margin lagi untuk mengimbanginya."
    ],
    quiz: [
      ["Dengan `box-sizing: content-box`, `width: 200px; padding: 20px; border: 5px solid` tampil selebar berapa?", ["200px", "225px", "250px", "240px"], "200 + 20×2 + 5×2 = 250px. Padding dan border ditambahkan di luar lebar content."],
      ["Mana yang berada di antara content dan border?", ["Margin", "Padding", "Outline", "Gap"], "Padding ada di dalam border; margin ada di luarnya."],
      ["Dua paragraf bertumpuk punya `margin-bottom: 20px` dan `margin-top: 30px`. Jaraknya…", ["50px", "30px", "20px", "10px"], "Margin vertikal yang bersebelahan collapse menjadi yang lebih besar di antara keduanya."]
    ]
  },
  units: {
    title: 'Unit, warna, dan tipografi',
    why: "Teks yang enak dibaca dan spacing yang konsisten adalah sebagian besar hal yang membuat sebuah interface tampak profesional. Memilih unit relatif juga menentukan apakah desainmu menghormati pengaturan ukuran font milik user.",
    points: [
      "`px` itu absolut. `rem` relatif terhadap ukuran font root (default 16px) dan mengikuti pengaturan browser user — pakai untuk ukuran font dan spacing.",
      "`em` relatif terhadap ukuran font element itu sendiri (berguna untuk padding yang mengikuti ukuran teks). `%` relatif terhadap parent. `vw`/`vh`/`dvh` adalah unit viewport; `ch` adalah lebar satu karakter.",
      "`clamp(min, preferred, max)` memberi ukuran yang fluid tapi berbatas: `font-size: clamp(1.5rem, 4vw, 2.5rem)`.",
      "Warna: hex `#3b47d6`, `rgb()`, `hsl()` (hue, saturation, lightness — mudah dinalar), dan `oklch()` (merata secara persepsi, pilihan modern).",
      "Tipografi yang enak dibaca: body 16px atau lebih, `line-height` sekitar 1.5, panjang baris 45–75 karakter (`max-width: 65ch`), skala ukuran heading yang jelas.",
      "Kontras teks terhadap background harus mencapai 4.5:1 (3:1 untuk teks besar) agar memenuhi WCAG AA."
    ],
    practice: "Ubah ukuran font default browsermu jadi 20px dan bandingkan halaman yang memakai `px` dengan yang memakai `rem`. Lalu buat heading yang berukuran 1.5rem di HP dan 2.5rem di layar lebar memakai satu `clamp()` tanpa media query.",
    teach: "Jelaskan perbedaan `px`, `em`, dan `rem`, dan kapan kamu memilih masing-masing.",
    analogy: "`px` itu ukuran penggaris: 2 cm ya 2 cm untuk siapa pun. `rem` itu 'dua kali ukuran tulisan tangan normalku' — mengikuti ukuran apa pun yang dipilih tiap pembaca sebagai normal. `em` itu 'dua kali ukuran teks di sini', jadi efeknya berlipat saat bersarang, seperti fotokopi dari fotokopi.",
    pitfalls: [
      "Memasang `html { font-size: 10px }` atau mengukur teks dengan `px`, yang menimpa pengaturan accessibility milik user.",
      "Ukuran font `em` yang bersarang, lalu teksnya mengecil atau membesar di tiap level.",
      "Teks abu-abu muda di atas putih yang gagal memenuhi kontras."
    ],
    quiz: [
      ["Ukuran font root 16px. Berapa besar `1.5rem`?", ["15px", "16px", "24px", "1.5px"], "`rem` mengalikan ukuran font root: 1.5 × 16 = 24px."],
      ["Apa yang dilakukan `clamp(1rem, 3vw, 2rem)`?", ["Selalu 3vw", "Memakai 3vw tapi tidak pernah di bawah 1rem atau di atas 2rem", "Memilih yang terkecil", "Error di layar kecil"], "`clamp` membatasi nilai fluid yang diinginkan di antara minimum dan maksimum."],
      ["Rasio kontras minimum untuk teks body normal menurut WCAG AA?", ["2:1", "3:1", "4.5:1", "7:1"], "4.5:1 untuk teks normal; 3:1 untuk teks besar; 7:1 adalah level AAA yang lebih ketat."]
    ]
  },
  flexbox: {
    title: 'Flexbox: layout satu dimensi',
    why: "Navbar, toolbar, card, konten yang di-center, baris form — kebanyakan layout sehari-hari hanyalah satu baris atau satu kolom berisi beberapa hal. Flexbox menangani semuanya, dan 'cara center div' sudah jadi satu baris sejak flexbox hadir.",
    points: [
      "`display: flex` pada parent menjadikan child-nya flex item yang ditata di sepanjang **main axis** (`flex-direction: row` atau `column`).",
      "`justify-content` mendistribusikan item di sepanjang main axis; `align-items` mengatur posisinya di cross axis.",
      "`gap` menambah jarak antar-item tanpa trik margin.",
      "Item bisa membesar dan mengecil: `flex: 1` berarti 'ambil bagian yang sama dari ruang kosong'; `flex: 0 0 200px` berarti 'tetap persis 200px'.",
      "`flex-wrap: wrap` membolehkan item turun ke baris baru. `margin-left: auto` pada satu item mendorongnya ke ujung.",
      "Secara default flex item menolak mengecil di bawah ukuran content-nya; `min-width: 0` pada item membuat teks panjang bisa dipotong."
    ],
    practice: "Di visualisasi flexbox, buat ulang tiga layout: item di-center di dua arah; item pertama di kiri dan sisanya di kanan; kolom sama lebar. Tuliskan CSS dan class Tailwind untuk masing-masing.",
    teach: "Jelaskan main axis dan cross axis, dan property mana yang mengatur alignment di masing-masing axis.",
    analogy: "Flexbox itu menata buku di satu rak. `justify-content` menentukan bagaimana buku disebar di sepanjang rak — dirapatkan ke kiri, di tengah, atau berjarak rata. `align-items` menentukan buku yang pendek menempel di bawah, di atas, atau di tengah. Mengganti `flex-direction` jadi column sama dengan memberdirikan raknya, dan arti kedua property itu di layar jadi bertukar.",
    pitfalls: [
      "Tertukar antara `justify-content` dan `align-items` setelah `flex-direction` diubah jadi `column`.",
      "Teks panjang atau tabel lebar yang menjebol layout flex — perbaiki dengan `min-width: 0`.",
      "Memakai flexbox untuk grid dua dimensi yang sesungguhnya, lalu melawannya dengan width tetap."
    ],
    quiz: [
      ["Dengan `flex-direction: row`, property mana yang men-center item secara vertikal?", ["`justify-content`", "`align-items`", "`text-align`", "`vertical-align`"], "Pada row, cross axis-nya vertikal, dan `align-items` mengatur cross axis."],
      ["Apa efek `flex: 1` di setiap child?", ["Menyembunyikan overflow", "Memberi tiap child bagian yang sama dari ruang yang tersedia", "Membuatnya selebar 1px", "Menumpuknya"], "Grow jadi 1 dengan basis nol, jadi ruang kosong dibagi rata."],
      ["Di flex row, bagaimana mendorong item terakhir ke ujung kanan?", ["`float: right`", "`margin-left: auto` pada item itu", "`text-align: right`", "`position: absolute`"], "Margin auto menyerap semua ruang kosong di sisi itu."]
    ]
  },
  grid: {
    title: 'CSS Grid: layout dua dimensi',
    why: "Kerangka halaman, dashboard, galeri, dan desain apa pun dengan baris dan kolom yang harus sejajar adalah wilayahnya Grid. Dipakai bersama flexbox, Grid menghilangkan kebutuhan akan layout hack sama sekali.",
    points: [
      "`display: grid` ditambah `grid-template-columns` mendefinisikan track kolom; baris dibuat otomatis seiring item mengalir masuk.",
      "Unit `fr` adalah pecahan dari ruang yang tersisa: `1fr 2fr` membaginya sepertiga / dua pertiga.",
      "`repeat(3, 1fr)` adalah tiga kolom sama lebar. `repeat(auto-fit, minmax(220px, 1fr))` adalah **grid responsif tanpa media query**.",
      "Item bisa melebar melintasi track: `grid-column: span 2` atau `grid-column: 1 / -1` (selebar penuh).",
      "`grid-template-areas` memberi nama pada area sehingga layout-nya terbaca seperti gambar halamannya.",
      "Patokan: **Grid untuk halaman dan struktur dua dimensi, flexbox untuk isi tiap sel.**"
    ],
    practice: "Di visualisasi grid, ganti-ganti template-nya dan ubah ukuran window saat `auto-fit` terpilih. Lalu bangun layout aplikasi ini sendiri (sidebar + main) dengan `grid-template-areas` di CSS playground.",
    teach: "Jelaskan kapan memilih Grid dan kapan memilih flexbox, dengan satu contoh untuk masing-masing.",
    analogy: "Flexbox itu rak; Grid itu selembar kertas berpetak. Di kertas berpetak kamu menentukan kolom dan barisnya dulu, baru menaruh benda ke dalam sel — dan semuanya sejajar baik mendatar maupun menurun. Kamu merancang satu lantai gedung dengan kertas berpetak (Grid), lalu menata perabot tiap ruangan di sepanjang dinding (flexbox).",
    pitfalls: [
      "Memakai `auto-fill` padahal yang dimaksud `auto-fit`: `auto-fill` mempertahankan track kosong, jadi item yang sedikit tidak melebar.",
      "Menulis jumlah kolom per breakpoint secara hard-code padahal `minmax()` bisa beradaptasi sendiri.",
      "Kolom `1fr` yang overflow karena content panjang — pakai `minmax(0, 1fr)`."
    ],
    quiz: [
      ["Apa yang dihasilkan `grid-template-columns: 1fr 3fr`?", ["Dua kolom sama lebar", "Dua kolom yang berbagi ruang kosong 1:3", "Empat kolom", "Satu kolom dengan 3 baris"], "Unit `fr` membagi ruang yang tersedia secara proporsional."],
      ["Deklarasi mana yang memberi grid responsif tanpa media query?", ["`repeat(3, 1fr)`", "`repeat(auto-fit, minmax(200px, 1fr))`", "`200px 200px 200px`", "`grid-auto-flow: column`"], "Browser memasang sebanyak mungkin kolom minimal 200px yang muat, lalu merentangkannya."],
      ["Bagaimana membuat grid item melebar selebar penuh?", ["`width: 100vw`", "`grid-column: 1 / -1`", "`flex: 1`", "`float: none`"], "Dari line 1 sampai line -1 mencakup semua track kolom."]
    ]
  },
  responsive: {
    title: 'Responsive design',
    why: "Lebih dari separuh traffic web datang dari HP. Layout yang hanya bagus di lebar layar desainernya berarti rusak untuk kebanyakan user — dan cara berpikir responsif diharapkan dari siapa pun yang menyentuh kode frontend.",
    points: [
      "Sertakan viewport meta tag, kalau tidak HP akan menampilkan halaman dalam keadaan zoom out: `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`.",
      "**Mobile-first**: tulis style dasar untuk layar kecil, lalu tambah kerumitan dengan `@media (min-width: …)`.",
      "Utamakan layout **intrinsic** yang beradaptasi sendiri — flex-wrap, grid `auto-fit`, `clamp()`, `max-width` — dan tambahkan breakpoint hanya di titik desainnya benar-benar rusak.",
      "Gambar: `max-width: 100%; height: auto;` dan pasang attribute `width`/`height` atau `aspect-ratio` untuk mencegah layout shift.",
      "**Container query** (`@container`) memberi style pada komponen berdasarkan lebar container-nya, bukan viewport — tool yang tepat untuk komponen reusable.",
      "Hormati preferensi user lewat media feature: `prefers-color-scheme`, `prefers-reduced-motion`, `hover`, `pointer`."
    ],
    practice: "Ambil halaman yang hanya dirancang untuk desktop dan buat ia berfungsi di lebar 360px tanpa scroll horizontal. Hitung media query yang kamu butuhkan, lalu coba buang satu dengan menggantinya memakai teknik intrinsic.",
    teach: "Jelaskan arti 'mobile-first' di CSS dan kenapa media query `min-width` lebih disukai daripada `max-width`.",
    analogy: "Mobile-first itu berkemas untuk bepergian dengan tas kabin dulu: kamu mulai hanya dengan yang esensial, dan kalau nanti dapat koper lebih besar, tinggal menambah ekstra. Mulai dari koper besar lalu berusaha menjejalkannya ke tas kabin berarti keputusan menyakitkan soal apa yang harus dibuang. Container query itu perabot yang melipat mengikuti ruangan tempat ia ditaruh, bukan mengikuti rumahnya.",
    pitfalls: [
      "Lupa viewport meta tag.",
      "Mendesain untuk tiga lebar device yang persis, bukan membiarkan content yang menentukan breakpoint.",
      "Menyembunyikan content di mobile alih-alih menata ulangnya."
    ],
    quiz: [
      ["Di stylesheet mobile-first, style dasarnya menyasar…", ["Layar desktop", "Layar kecil, dengan query `min-width` yang menambah layout untuk layar lebih besar", "Print", "Tablet saja"], "Mulai dari yang sederhana lalu tingkatkan ke atas; layout yang lebih besar itu sifatnya opt-in."],
      ["Container query didasarkan pada apa?", ["Lebar viewport", "Ukuran container dari element itu", "Device pixel ratio", "Ukuran font user"], "Komponen merespons ruang tempat ia ditaruh, di mana pun itu."],
      ["Rule mana yang menjaga gambar tidak overflow dari parent-nya?", ["`width: 100vw`", "`max-width: 100%; height: auto`", "`overflow: scroll`", "`float: left`"], "Gambar boleh mengecil supaya muat tapi tidak pernah melebihi container-nya, dan rasionya tetap terjaga."]
    ]
  },
  position: {
    title: 'Positioning dan stacking context',
    why: "Modal, dropdown, sticky header, tooltip, dan badge semuanya bergantung pada positioning — dan 'z-index: 9999 tidak ngefek' adalah pertanyaan interview klasik dengan jawaban yang presisi.",
    points: [
      "`position: static` adalah flow default. `relative` mempertahankan ruang element dan membuatmu bisa menggesernya — sekaligus menjadikannya acuan bagi child yang absolutely positioned.",
      "`absolute` mengeluarkan element dari flow dan memposisikannya terhadap **positioned ancestor** terdekat.",
      "`fixed` memposisikan terhadap viewport. `sticky` ikut scroll seperti biasa sampai mencapai sebuah offset, lalu menempel di dalam scroll container-nya.",
      "`z-index` hanya berlaku pada positioned element dan flex/grid item, dan hanya mengurutkan element **di dalam stacking context yang sama**.",
      "Stacking context baru dibuat oleh `z-index` pada positioned element, dan juga oleh `opacity < 1`, `transform`, `filter`, `isolation: isolate`, dan lainnya. Child tidak akan pernah bisa keluar dari context milik parent-nya.",
      "Overlay modern: element `<dialog>` dan Popover API di-render di **top layer**, di atas semuanya, tanpa perlu z-index."
    ],
    practice: "Reproduksi bug stacking ini: taruh element `z-index: 9999` di dalam parent yang punya `transform`, bersebelahan dengan sibling ber-`z-index: 2`. Jelaskan kenapa ia kalah, lalu perbaiki dengan dua cara berbeda.",
    teach: "Jelaskan kenapa element dengan `z-index: 9999` masih bisa muncul di belakang element dengan `z-index: 2`.",
    analogy: "Stacking context itu map berisi lembaran transparan. Di dalam satu map, kamu bebas mengatur urutan lembarannya dengan `z-index`. Tapi map-map itu sendiri juga ditumpuk — dan lembaran di map paling bawah tidak akan pernah bisa naik ke atas map yang menindihnya, setinggi apa pun nomornya di dalam map sendiri.",
    pitfalls: [
      "Terus menaikkan angka z-index alih-alih mencari ancestor mana yang membuat stacking context.",
      "`position: absolute` tanpa positioned ancestor, sehingga element-nya terbang ke pojok halaman.",
      "`position: sticky` gagal karena ada ancestor yang punya `overflow: hidden`."
    ],
    quiz: [
      ["Element yang absolutely positioned ditempatkan relatif terhadap…", ["Viewport, selalu", "Positioned ancestor terdekatnya", "Sibling sebelumnya", "Selalu `<body>`"], "Ia memakai ancestor terdekat yang position-nya bukan `static`, dan kalau tidak ada, initial containing block."],
      ["Mana yang membuat stacking context baru?", ["`color: red`", "`transform: translateX(0)`", "`margin: 0`", "`display: block`"], "Transform, opacity di bawah 1, filter, dan `isolation: isolate` semuanya membuat stacking context."],
      ["Kenapa `z-index` bisa tidak berpengaruh pada sebuah element?", ["Angkanya terlalu besar", "Element-nya tidak positioned (dan bukan flex/grid item)", "Browsernya sudah tua", "Butuh `!important`"], "`z-index` diabaikan pada element static yang bukan flex/grid item."]
    ]
  },
  modern: {
    title: 'Custom property, theming, dan CSS modern',
    why: "Design token, dark mode, dan variant komponen dibangun di atas custom property. CSS modern juga sudah menyerap sebagian besar hal yang dulu membutuhkan preprocessor — menguasainya membuat toolchain-mu tetap ramping.",
    points: [
      "**Custom property** (`--brand: #3b47d6`) adalah variabel yang ikut cascade dan diwariskan, dibaca dengan `var(--brand, fallback)`. Berbeda dengan variabel Sass, ia tetap hidup saat run time.",
      "Definisikan **design token** di `:root` — warna, spacing, radius — dan rujuk dari mana-mana. Mengganti theme berarti mendefinisikan ulang token-nya.",
      "Dark mode: definisikan ulang token di bawah `@media (prefers-color-scheme: dark)` dan/atau attribute `[data-theme=\"dark\"]` untuk toggle manual.",
      "**Nesting** native (`.card { &:hover { … } .title { … } }`) dan `:is()` / `:where()` memendekkan selector; `:where()` punya specificity nol.",
      "`:has()` adalah parent selector: `.field:has(input:invalid)` memberi style pada pembungkus berdasarkan isinya.",
      "Transition menganimasikan perubahan property; utamakan menganimasikan `transform` dan `opacity`. Selalu hormati `prefers-reduced-motion`."
    ],
    practice: "Tambahkan theme kedua ke pola ini (misalnya high-contrast) hanya dengan mendefinisikan ulang token. Lalu buat toggle yang memasang `data-theme` di `<html>` dan mengingat pilihannya. Tidak boleh ada rule komponen yang menyebut warna mentah.",
    teach: "Jelaskan bagaimana CSS custom property membuat dark mode jadi mungkin tanpa menulis ulang style setiap komponen.",
    analogy: "Custom property itu nama-nama warna cat di daftar milik dekorator: 'dinding', 'lis', 'aksen'. Instruksi tiap ruangan berbunyi 'cat lisnya dengan warna lis'. Untuk mendekorasi ulang seisi rumah, kamu cukup mengubah tiga entri di daftar itu, bukan instruksi tiap ruangan.",
    pitfalls: [
      "Warna hard-code yang tercecer di berbagai komponen, sehingga theming jadi pekerjaan find-and-replace.",
      "Menganimasikan `width`, `height`, atau `top`, yang memaksa layout di setiap frame.",
      "Toggle theme yang mengabaikan preferensi sistem saat kunjungan pertama."
    ],
    quiz: [
      ["Apa bedanya custom property dengan variabel Sass?", ["Lebih cepat diketik", "Ada saat run time, ikut cascade dan diwariskan, dan bisa berubah per element atau media query", "Hanya bisa menyimpan warna", "Butuh build step"], "Variabel Sass hilang setelah di-compile; custom property adalah nilai yang hidup di browser."],
      ["Apa yang dipilih `.card:has(img)`?", ["Gambar di dalam card", "Card yang berisi gambar", "Card tanpa gambar", "Tidak ada — tidak valid"], "`:has()` memilih element berdasarkan descendant-nya."],
      ["Property mana yang paling murah dianimasikan?", ["`width` dan `height`", "`transform` dan `opacity`", "`margin` dan `padding`", "`top` dan `left`"], "Keduanya bisa ditangani compositor tanpa layout maupun paint."]
    ]
  },
  tailwind: {
    title: 'Tailwind CSS: dasar-dasar utility-first',
    why: "Tailwind adalah CSS framework yang paling banyak dipakai di project React modern. Ia mengganti urusan penamaan dan pemeliharaan stylesheet dengan class kecil yang bisa dirangkai — dan setiap class-nya adalah CSS biasa yang sudah kamu pahami.",
    points: [
      "**Utility-first**: tiap class mengerjakan satu hal (`p-4`, `flex`, `text-lg`, `bg-blue-600`). Kamu merangkainya di markup, bukan mengarang nama class lalu menulis CSS terpisah.",
      "Nilainya berasal dari sebuah **design scale**: spacing `p-4` = 1rem, tipografi `text-sm`…`text-4xl`, warna `slate-50`…`slate-950`. Batasan menghasilkan konsistensi.",
      "**Variant** memberi prefix berupa kondisi pada utility: `hover:`, `focus-visible:`, `disabled:`, `dark:`, dan breakpoint `sm:` `md:` `lg:` (mobile-first, min-width).",
      "Layout-nya terpetakan satu-satu dengan yang sudah kamu tahu: `flex items-center justify-between gap-4`, `grid grid-cols-3`, `absolute inset-0`.",
      "Jalan keluar darurat: arbitrary value `w-[37rem]`, `bg-[#1da1f2]`, dan arbitrary variant. Pakai seperlunya; utamakan scale.",
      "Compiler men-scan file-mu dan **hanya menghasilkan class yang kamu pakai**, jadi bundle CSS tetap kecil. Component library seperti Bootstrap mengambil pendekatan sebaliknya: komponen yang sudah diberi style, lalu kamu override."
    ],
    practice: "Buka CSS playground, nyalakan Tailwind, dan bangun ulang card-nya dari ingatan. Lalu terjemahkan balik lima class-nya menjadi CSS biasa yang dihasilkannya — kalau tidak bisa, ulangi materi CSS yang bersangkutan.",
    teach: "Jelaskan arti 'utility-first' dan jawab keberatan yang sering muncul: 'bukannya ini sama saja dengan inline style?'",
    analogy: "CSS tradisional itu memesan furnitur custom: beri nama tiap barang, deskripsikan, tunggu dibuat. Tailwind itu sekotak balok susun standar dengan ukuran dan warna tetap — kamu langsung merangkai yang dibutuhkan saat itu juga, dan karena semua orang memakai balok yang sama, semua yang dibangun di rumah itu serasi.",
    pitfalls: [
      "Belajar Tailwind sebagai pengganti CSS. Setiap utility adalah deklarasi CSS; tanpa fundamentalnya kamu tidak akan bisa men-debug.",
      "Menyusun nama class secara dinamis (`'text-' + color + '-500'`). Compiler hanya menemukan string class yang utuh di source-mu.",
      "Menyebutnya 'inline style'. Utility mendukung hover, focus, breakpoint, dan dark mode, serta mengambil nilai dari scale yang terbatas — inline style tidak punya semua itu."
    ],
    quiz: [
      ["Apa arti `md:grid-cols-2`?", ["Dua kolom hanya di layar medium", "Dua kolom mulai dari breakpoint `md` ke atas", "Dua kolom di bawah `md`", "Kolom berukuran medium"], "Variant breakpoint adalah query `min-width` yang mobile-first: berlaku di lebar itu dan yang lebih lebar."],
      ["Kenapa output CSS Tailwind tetap kecil di production?", ["Di-gzip dua kali", "Hanya class yang ditemukan di source file-mu yang dihasilkan", "Tidak mengirim CSS sama sekali", "Memakai inline style"], "Compiler men-scan template-mu dan hanya menghasilkan utility yang benar-benar kamu pakai."],
      ["Kenapa `className={'bg-' + color + '-500'}` sering tidak jalan?", ["React melarangnya", "Compiler tidak bisa melihat nama class yang utuh di source, jadi class itu tidak pernah dihasilkan", "Warna harus berupa hex", "Template string itu lambat"], "Class dideteksi sebagai string utuh saat build time; petakan nilainya ke nama class yang lengkap."]
    ]
  },
  twreact: {
    title: 'Tailwind di React: komponen, variant, dan theming',
    why: "Utility di markup hanya bisa scale kalau pengulangannya dihilangkan dengan cara yang benar. Di codebase React, unit reuse-nya adalah komponen, bukan class CSS — dan variant yang ber-type mengubah design system menjadi sebuah API.",
    points: [
      "Hilangkan duplikasi dengan mengekstrak **komponen**, bukan dengan lari ke `@apply`. Sebuah `<Button>` cukup memiliki class-nya di satu tempat.",
      "Setup dengan Vite: install `tailwindcss` dan `@tailwindcss/vite`, tambahkan plugin-nya, dan tulis `@import \"tailwindcss\";` di file CSS utamamu.",
      "Kustomisasi design system langsung di CSS dengan `@theme`: mendefinisikan `--color-brand-500` otomatis menghasilkan `bg-brand-500`, `text-brand-500`, dan seterusnya.",
      "Gabungkan class dengan aman memakai `clsx` + `tailwind-merge` (helper `cn()` yang umum) supaya `className` dari pemanggil bisa meng-override default tanpa konflik.",
      "Modelkan variant (size, intent) sebagai props ber-type — manual dengan lookup object atau dengan `class-variance-authority`. Variant yang tidak valid jadi compile error.",
      "Styling berdasarkan state tanpa JavaScript: `group-hover:`, `peer-invalid:`, `data-[state=open]:`, `aria-expanded:`. Dark mode memakai `dark:`; ubah jadi strategi class dengan `@custom-variant` untuk toggle manual."
    ],
    practice: "Bangun komponen `Button`, `Input`, dan `Card` dengan variant ber-type di project Vite + React + Tailwind. Tambahkan warna brand lewat `@theme` dan toggle dark mode. Tidak boleh ada file page yang berisi lebih dari utility layout.",
    teach: "Jelaskan kenapa di project React + Tailwind kamu mengekstrak komponen, bukan class CSS, untuk menghindari pengulangan utility.",
    analogy: "Komponen itu stempel yang sudah ada tintanya. Kamu tidak membagikan daftar dua belas warna tinta ke semua orang lalu berharap mereka mencampurnya dengan cara yang sama setiap kali — kamu memberi mereka stempelnya. Variant adalah tombol putar di stempel itu: small, medium, large; primary, danger.",
    pitfalls: [
      "Berlebihan memakai `@apply` dan membangun kembali arsitektur stylesheet yang justru ingin dihilangkan Tailwind.",
      "Menyambung string class sehingga `px-2 px-4` sama-sama berlaku dengan hasil tak terduga — gabungkan dengan `tailwind-merge`.",
      "Variant berupa string bebas, bukan typed union."
    ],
    quiz: [
      ["Apa efek mendefinisikan `--color-brand-500` di dalam `@theme`?", ["Tidak ada, sampai kamu menulis CSS untuknya", "Menghasilkan utility seperti `bg-brand-500` dan `text-brand-500`", "Meng-override semua warna", "Membuat komponen React"], "Theme variable adalah design token yang menentukan utility class apa saja yang tersedia."],
      ["Masalah apa yang diselesaikan `tailwind-merge`?", ["Ukuran bundle", "Utility yang bertabrakan seperti `px-2 px-4` — ia mempertahankan yang terakhir", "Dark mode yang hilang", "Build yang lambat"], "Ia menyelesaikan konflik sehingga `className` dari pemakai komponen bisa meng-override default dengan andal."],
      ["Cara yang disarankan untuk memakai ulang sekumpulan utility di seluruh aplikasi React?", ["Copy-paste", "`@apply` di stylesheet global", "Ekstrak jadi komponen", "Object `style` inline"], "Komponen adalah unit reuse-nya; ia membungkus struktur, behavior, dan class sekaligus."]
    ]
  },
  arch: {
    title: 'Arsitektur CSS dan design system',
    why: "CSS itu global secara default, jadi ia membusuk lebih cepat daripada kode lain di tim yang sedang tumbuh. Seorang expert memilih strategi scoping dengan sengaja dan bisa mempertahankannya terhadap alternatif lain.",
    points: [
      "Masalah intinya adalah **global scope + specificity + urutan source**: rule mana pun bisa memengaruhi element mana pun, dan override terus menumpuk.",
      "Strategi scoping: konvensi penamaan (**BEM**: `.card__title--large`), **CSS Modules** (nama class unik saat build time), **utility-first** (Tailwind), CSS-in-JS, dan **`@scope`** native.",
      "**Cascade layer** (`@layer reset, base, components, utilities;`) membuat prioritas jadi eksplisit: layer yang belakangan mengalahkan layer sebelumnya, berapa pun specificity-nya. Ini mengakhiri perang specificity.",
      "**Design system** adalah token (warna, spacing, tipografi, radius) → primitive (Button, Input) → pattern. Token punya tingkatan: nilai mentah, alias semantik (`--color-danger`), token komponen.",
      "Komponen sebaiknya tidak mengatur margin luarnya sendiri; layout parent yang memegang spacing (lewat `gap`). Ini membuat komponen bisa dipakai ulang di mana saja.",
      "Trade-off yang perlu bisa kamu jelaskan: utility-first memberi kecepatan dan bundle CSS kecil, tapi markup-nya ramai; CSS Modules memberi CSS biasa dan isolasi, tapi lebih banyak file dan penamaan; CSS-in-JS yang runtime memakan performance."
    ],
    practice: "Audit sebuah stylesheet yang kamu kenal: hitung `!important`, cari selector dengan specificity tertinggi, dan daftar semua nilai warna mentah. Lalu tulis proposal satu halaman tentang scoping dan token untuk tim lima orang, sebutkan alternatif yang kamu tolak beserta alasannya.",
    teach: "Jelaskan bagaimana cascade layer mengakhiri 'perang specificity', dengan contoh utility class yang harus meng-override style komponen.",
    analogy: "Tanpa layer, prioritas di CSS adalah adu teriak: yang paling keras (paling spesifik) yang menang, jadi semua orang terus menaikkan suara. Cascade layer adalah urutan bicara yang disepakati dalam rapat: pimpinan rapat selalu punya kata terakhir, sepelan apa pun ia bicara.",
    pitfalls: [
      "Mencampur tiga strategi scoping dalam satu codebase tanpa aturan mana berlaku di mana.",
      "Token yang dinamai berdasarkan nilainya (`--blue`), bukan tujuannya (`--color-action`), sehingga rebranding jadi menyakitkan.",
      "Komponen yang membawa margin luar dan rusak di setiap konteks baru."
    ],
    quiz: [
      ["Dengan `@layer components, utilities;`, rule mana yang menang: `#app .btn` di `components` atau `.hidden` di `utilities`?", ["`#app .btn` — specificity-nya lebih tinggi", "`.hidden` — layer yang belakangan menang berapa pun specificity-nya", "Yang terakhir di file", "Tidak ada"], "Urutan layer dibandingkan lebih dulu sebelum specificity."],
      ["Apa yang diberikan CSS Modules?", ["Theming saat runtime", "Nama class dengan scope lokal yang dihasilkan saat build time", "Library utility class", "Dukungan browser untuk CSS lama"], "Nama class tiap file dibuat unik, jadi style tidak bisa bertabrakan antar-komponen."],
      ["Kenapa komponen reusable sebaiknya tidak mengatur margin luarnya sendiri?", ["Margin itu lambat", "Spacing bergantung pada konteks, jadi layout parent yang seharusnya memegangnya", "Margin sudah deprecated", "Merusak dark mode"], "Komponen dengan margin bawaan hanya cocok di konteks tempat ia pertama kali didesain."]
    ]
  },
  render: {
    title: 'Rendering performance dan accessibility',
    why: "CSS menentukan seberapa cepat halaman muncul dan apakah semua orang bisa memakainya. Seorang expert bisa menjelaskan rendering pipeline, mendiagnosis jank dan layout shift, serta memperlakukan accessibility sebagai syarat correctness.",
    points: [
      "Pipeline-nya: **Style → Layout → Paint → Composite**. Mengubah geometri (width, top, margin) memicu layout; mengubah warna memicu paint; `transform` dan `opacity` bisa langsung lompat ke composite.",
      "**Layout thrashing**: membaca layout (`offsetHeight`) setelah menulis style di dalam loop memaksa layout synchronous berulang-ulang. Kumpulkan dulu semua read, baru write.",
      "CSS itu **render-blocking**: jaga ukurannya tetap kecil, inline-kan critical CSS untuk tampilan pertama kalau perlu, dan hindari rantai `@import`.",
      "Cegah **layout shift (CLS)**: sediakan ruang dengan `aspect-ratio` / dimensi, jangan menyisipkan content di atas content yang sudah ada, pakai `font-display: swap` dengan fallback yang ukurannya sepadan.",
      "`content-visibility: auto` dan `contain` membuat browser bisa melewati pekerjaan untuk subtree yang di luar layar atau terisolasi.",
      "Accessibility di CSS: jangan pernah membuang focus outline tanpa pengganti (`:focus-visible`), jaga kontras, hormati `prefers-reduced-motion`, jangan menyampaikan makna hanya lewat warna, dan sembunyikan secara visual dengan pola `.sr-only`, bukan `display: none`, kalau content-nya harus tetap tersedia bagi screen reader."
    ],
    practice: "Rekam performance trace dari animasi yang mengubah `left`, lalu yang mengubah `transform`. Bandingkan entri Layout dan Paint-nya. Setelah itu telusuri salah satu halamanmu dengan Tab tanpa mouse, dan perbaiki setiap titik di mana kamu kehilangan jejak focus.",
    teach: "Jelaskan kenapa menganimasikan `transform` lebih mulus daripada menganimasikan `left`, dari sudut pandang rendering pipeline.",
    analogy: "Me-render halaman itu seperti mementaskan drama. Layout adalah membangun set panggung, paint adalah mengecat dekorasinya, composite adalah menggeser panel yang sudah jadi di atas rel. Menganimasikan `left` berarti membangun ulang set di setiap frame. Menganimasikan `transform` hanya menggeser panel yang sudah jadi — kru panggung bisa melakukannya enam puluh kali per detik tanpa memanggil tukang kayu.",
    pitfalls: [
      "`outline: none` tanpa pengganti, membuat halaman tidak bisa dipakai lewat keyboard.",
      "`will-change` di semua element, memakan memory tanpa manfaat.",
      "Gambar dan iklan tanpa dimensi yang disediakan, membuat content meloncat-loncat saat loading."
    ],
    quiz: [
      ["Perubahan mana yang bisa ditangani compositor saja?", ["`width`", "`margin-top`", "`transform`", "`font-size`"], "Transform dan opacity tidak butuh layout maupun paint kalau element-nya ada di layer sendiri."],
      ["Apa yang paling langsung mengurangi cumulative layout shift akibat gambar?", ["Lazy loading", "Menyediakan ruang dengan dimensi atau `aspect-ratio`", "Ukuran file yang lebih kecil", "CDN"], "Kalau browser sudah tahu ukurannya sebelum gambar dimuat, tidak ada yang bergeser saat gambarnya datang."],
      ["Bagaimana menyembunyikan content secara visual tapi tetap tersedia untuk screen reader?", ["`display: none`", "`visibility: hidden`", "Pola visually-hidden (`.sr-only`)", "`opacity: 0` pada body"], "`display: none` dan `visibility: hidden` ikut membuang content dari accessibility tree."]
    ]
  }
}, { tagline: 'Tampilannya: cascade, layout, responsive design, dan Tailwind CSS dalam skala besar.' });
