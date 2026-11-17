// Bahasa Indonesia — track CSS + Tailwind. Contoh kode tetap memakai versi aslinya.
I18N.lessons('css', {
  html: {
    title: 'Dasar HTML: struktur dan makna',
    why: "CSS memberi gaya pada HTML, dan React me-render HTML. Memilih elemen yang tepat memberimu dukungan keyboard, aksesibilitas, dan makna untuk mesin pencari secara gratis; `div` dengan click handler tidak memberi satu pun dari itu.",
    points: [
      "HTML menjelaskan **apa isi kontennya**, bukan tampilannya: heading, paragraf, list, tombol, area navigasi.",
      "Sebuah halaman biasanya punya satu `<h1>`, dengan heading lain tersusun berurutan di bawahnya (`h2`, `h3`…). Pengguna screen reader melompat antar heading seperti memakai daftar isi.",
      "**Landmark** menyusun struktur halaman: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.",
      "Pakai `<button>` untuk aksi dan `<a href>` untuk navigasi. Keduanya bisa difokus dan dipakai lewat keyboard secara default; `<div>` yang bisa diklik tidak. `<div>` biasa tetap boleh sebagai pembungkus layout yang tidak bermakna.",
      "Form: setiap input butuh `<label>`; `type` (`email`, `number`, `date`) memunculkan keyboard ponsel yang tepat dan validasi bawaan; `required`, `min`, dan `pattern` memvalidasi tanpa JavaScript.",
      "Gambar butuh teks `alt` yang menjelaskan fungsinya (`alt=\"\"` kalau murni dekorasi), ditambah `width` dan `height` supaya halaman tidak melompat saat gambar dimuat."
    ],
    practice: "Di CSS playground, buat kerangka halaman produk dengan elemen semantik, dan pakai `div` hanya untuk pembungkus yang tidak punya makna. Lalu jelajahi halamannya hanya dengan tombol Tab: apakah semuanya bisa dicapai dan dipakai? Ganti tombolnya dengan `div` yang bisa diklik, lalu coba lagi.",
    teach: "Jelaskan kenapa kamu sebaiknya memakai `<button>`, bukan `<div>` dengan click handler.",
    analogy: "HTML itu denah bangunan yang diberi label: ruangan ini dapur, ini pintu masuk, ini tangga. Cat dan perabot (CSS) datang belakangan. Denah yang semua ruangannya hanya dilabeli 'ruangan' tetap bisa didekorasi, tapi tidak ada yang bisa menemukan dapurnya, apalagi tamu yang tidak bisa melihat.",
    pitfalls: [
      "`div` dan `span` untuk semua yang interaktif, lalu membuat ulang fokus, penanganan keyboard, dan role secara manual.",
      "Input yang punya placeholder tapi tidak punya label.",
      "Memilih level heading berdasarkan ukuran font-nya, bukan berdasarkan struktur dokumen.",
      "`<button>` di dalam form tanpa `type=\"button\"`: type default-nya `submit`, jadi mengkliknya akan men-submit form."
    ],
    quiz: [
      ["Elemen mana yang seharusnya memicu aksi seperti 'Add to cart'?", ["`<div onclick>`", "`<button type=\"button\">`", "`<a href=\"#\">`", "`<span role=\"button\">`"], "Button bisa difokus, berfungsi dengan Enter dan Spasi, dan diumumkan dengan benar oleh screen reader. Link itu untuk navigasi, dan `span` dengan role tetap butuh `tabindex` dan penanganan tombol yang ditulis manual."],
      ["Untuk apa atribut `alt`?", ["Tooltip yang muncul saat hover", "Teks pengganti yang menjelaskan gambar, untuk orang dan alat yang tidak bisa melihatnya", "Keterangan yang tampil di bawah gambar", "Kata kunci untuk mesin pencari"], "Screen reader membacanya, dan teks itu muncul saat gambar gagal dimuat."],
      ["Bagaimana `<label>` terhubung ke input-nya?", ["Dengan ditaruh di sebelahnya", "`for` pada label yang cocok dengan `id` input (atau dengan membungkus input-nya)", "Dengan memakai `class` yang sama", "Dengan `aria-label` pada label"], "Hubungan itu memberi input sebuah nama yang aksesibel dan membuat klik pada label memfokuskan input-nya."]
    ]
  },
  cascade: {
    title: 'Selector, cascade, dan specificity',
    why: "'Kenapa style-ku tidak berlaku?' hampir selalu punya jawaban yang sama: ada rule lain yang menang. Cascade adalah seperangkat aturan tetap yang menentukan rule mana, dan begitu kamu memahaminya, CSS tidak lagi terasa acak.",
    points: [
      "Sebuah rule berbentuk `selector { property: value; }`. Selector menargetkan berdasarkan elemen (`p`), class (`.card`), id (`#header`), atribut (`[type=email]`), atau state (`:hover`, `:focus-visible`).",
      "Combinator menyatakan hubungan: `nav a` (keturunan), `ul > li` (anak langsung), `h2 + p` (saudara berikutnya).",
      "Saat beberapa rule mengatur property yang sama, **cascade** memilih pemenangnya dengan urutan ini: importance (`!important`), inline style, cascade layer, **specificity**, dan terakhir **urutan di source** (yang terakhir menang).",
      "Specificity dihitung sebagai (id, class, elemen). Satu id mengalahkan berapa pun jumlah class; satu class mengalahkan berapa pun jumlah elemen.",
      "`:where()` menambah specificity **nol**, jadi `:where(.card) a` sama mudahnya ditimpa seperti `a`. `:is()` mengambil specificity dari argumennya yang paling spesifik.",
      "Sebagian property **diwarisi** dari parent (`color`, `font`, `line-height`); kebanyakan property layout (`margin`, `padding`, `border`, `width`) tidak.",
      "Jaga specificity tetap rendah dan datar: beri style dengan satu class saja. Setiap id atau `!important` membuat penimpaan berikutnya makin sulit."
    ],
    practice: "Di specificity visualizer, tebak warna pemenangnya sebelum menyalakan tiap rule. Lalu buka CSS playground, tulis tiga rule yang saling bertentangan untuk satu tombol, dan buat masing-masing menang bergantian tanpa memakai `!important`.",
    teach: "Jelaskan bagaimana browser memutuskan mana dari dua rule CSS yang bertentangan yang berlaku pada sebuah elemen.",
    analogy: "Specificity itu permainan kartu dengan peringkat yang ketat. Id adalah as, class adalah raja, elemen adalah kartu angka, dan setumpuk raja tidak bisa mengalahkan satu as. Kalau dua pemain memegang kartu yang setara, yang terakhir bermain yang menang.",
    pitfalls: [
      "Mengira 11 class mengalahkan 1 id. Kolom-kolomnya tidak pernah saling 'menyimpan' ke kolom sebelahnya.",
      "Memakai `!important` supaya menang. Berhasil sekali, lalu orang berikutnya juga butuh `!important`.",
      "Menganggap semua property diwariskan. `border` dan `margin` pada parent tidak turun ke child-nya."
    ],
    quiz: [
      ["Selector mana yang specificity-nya paling tinggi?", ["`.card .title`", "`#main`", "`div p span a`", "`.a.b.c`"], "Satu id (1,0,0) mengungguli berapa pun jumlah class atau elemen."],
      ["Dua rule dengan specificity sama mengatur `color`. Mana yang menang?", ["Yang pertama di file", "Yang dideklarasikan belakangan", "Yang deklarasinya lebih banyak", "Yang ada di file lebih besar"], "Kalau importance, layer, dan specificity-nya sama, urutan di source yang menentukan: yang terakhir menang."],
      ["Property mana yang diwariskan secara default?", ["`margin`", "`border`", "`color`", "`width`"], "Property teks seperti `color` dan `font` diwariskan; property box tidak."],
      ["Berapa specificity dari `:where(#main .card) a`?", ["(1,1,1)", "(0,0,1)", "(0,1,1)", "(1,0,1)"], "Semua yang ada di dalam `:where()` dihitung nol, jadi hanya `a` yang tersisa."]
    ]
  },
  box: {
    title: 'Box model',
    why: "Setiap elemen adalah sebuah persegi panjang. Kebanyakan bug ukuran, seperti elemen selebar 100% yang meluber dari parent-nya atau celah yang tidak bisa dijelaskan, berasal dari box model, dan hilang begitu kamu bisa melihat keempat lapisannya.",
    points: [
      "Dari dalam ke luar: **content**, **padding** (ruang di dalam border), **border**, **margin** (ruang di luar, di antara elemen).",
      "Default-nya `box-sizing: content-box`, artinya `width` hanya mengatur content; padding dan border ditambahkan di atasnya. `border-box` membuat `width` sudah termasuk padding dan border, sesuai harapan kebanyakan orang.",
      "Mulai setiap project dengan `*, *::before, *::after { box-sizing: border-box; }`.",
      "Elemen `display: block` mengambil lebar penuh dan bertumpuk; elemen `inline` mengalir di dalam teks dan mengabaikan `width` dan `height`; `inline-block` mengalir inline tapi menerima ukuran.",
      "Margin vertikal blok yang bersebelahan **collapse** menjadi yang lebih besar. Padding tidak collapse, begitu juga margin antar item flex atau grid.",
      "`overflow` mengatur konten yang tidak muat: `visible`, `hidden`, `clip`, atau `auto` (scroll hanya kalau perlu)."
    ],
    practice: "Pakai box model visualizer untuk membuat elemen `content-box` selebar 300px meluber dari parent selebar 320px, lalu perbaiki dengan beralih ke `border-box`. Di dev tools, inspect elemen apa saja di halaman ini dan baca diagram box-nya.",
    teach: "Jelaskan perbedaan padding dan margin, dan apa yang diubah oleh `box-sizing: border-box`.",
    analogy: "Lukisan berbingkai di dinding. Lukisannya adalah content, kertas putih di sekelilingnya adalah padding, bingkainya adalah border, dan dinding kosong sebelum bingkai berikutnya adalah margin. `border-box` berarti saat kamu bilang 'lukisan ini 30 cm', yang kamu ukur adalah sisi luar bingkainya.",
    pitfalls: [
      "`width: 100%` ditambah padding dengan `content-box`, sehingga meluber dari parent.",
      "Berharap `width` atau margin vertikal bekerja pada elemen inline seperti `span`.",
      "Kaget dengan margin yang collapse lalu menambah margin lagi untuk mengimbanginya. Di container flex atau grid, pakai `gap`."
    ],
    quiz: [
      ["Dengan `box-sizing: content-box`, `width: 200px; padding: 20px; border: 5px solid` di-render selebar berapa?", ["200px", "225px", "250px", "240px"], "200 + 20×2 + 5×2 = 250px. Padding dan border ditambahkan di luar lebar content."],
      ["Apa yang ada di antara content dan border?", ["Margin", "Padding", "Outline", "Gap"], "Padding ada di dalam border; margin ada di luarnya. Outline digambar di atas tepinya dan tidak memakan ruang."],
      ["Dua paragraf bertumpuk punya `margin-bottom: 20px` dan `margin-top: 30px`. Celahnya…", ["50px", "30px", "20px", "25px"], "Margin vertikal yang bersebelahan collapse menjadi yang lebih besar dari keduanya."]
    ]
  },
  units: {
    title: 'Unit, warna, dan tipografi',
    why: "Teks yang mudah dibaca dan jarak yang konsisten sudah mengerjakan sebagian besar tugas membuat antarmuka terlihat profesional. Pilihan unit juga menentukan apakah desainnya menghormati setting ukuran font dan zoom milik user.",
    points: [
      "`px` itu absolut. `rem` relatif terhadap ukuran font root (default-nya 16px) dan mengikuti setting browser user, jadi pakai untuk ukuran font dan spasi.",
      "`em` relatif terhadap ukuran font elemen itu sendiri (berguna untuk padding yang ikut membesar bersama teksnya). `%` relatif terhadap parent. `vw`, `vh`, dan `dvh` adalah unit viewport; `ch` adalah lebar satu karakter.",
      "`clamp(min, preferred, max)` memberi ukuran yang fleksibel dengan batas. Untuk teks, campur unit di nilai tengahnya, `clamp(1.75rem, 1rem + 3vw, 2.5rem)`: bagian `rem` tetap membesar saat user melakukan zoom, sedangkan `vw` saja tidak.",
      "Warna: hex `#3b47d6`, `rgb()`, `hsl()` (hue, saturation, lightness: mudah dinalar), dan `oklch()` (merata secara persepsi, jadi langkah yang sama terlihat sama).",
      "Tipografi yang enak dibaca: teks body 16px atau lebih, `line-height` sekitar 1.5, panjang baris 45–75 karakter (`max-width: 65ch`), dan skala ukuran heading yang jelas.",
      "Kontras teks harus mencapai 4.5:1 terhadap background-nya (3:1 untuk teks besar) agar memenuhi WCAG AA."
    ],
    practice: "Atur ukuran font default browser-mu ke 20px lalu bandingkan halaman yang diukur dengan `px` dan yang diukur dengan `rem`. Lalu buat heading yang berukuran 1.5rem di ponsel dan 2.5rem di layar lebar dengan satu `clamp()` tanpa media query. Zoom ke 200% dan pastikan heading-nya tetap membesar.",
    teach: "Jelaskan perbedaan `px`, `em`, dan `rem`, serta kapan kamu memilih masing-masing.",
    analogy: "`px` itu ukuran penggaris: 2 cm tetap 2 cm untuk semua orang. `rem` itu 'dua kali ukuran tulisan tanganku yang biasa': ia mengikuti ukuran yang dipilih masing-masing pembaca sebagai ukuran normal.",
    pitfalls: [
      "Mengatur `html { font-size: 10px }` atau mengukur teks dengan `px`, yang menimpa setting aksesibilitas milik user.",
      "Menumpuk ukuran font `em` lalu melihat teksnya mengecil atau membesar di setiap level, seperti fotokopi dari fotokopi.",
      "Ukuran font yang murni `vw`, yang hampir tidak berubah saat user melakukan zoom.",
      "Teks abu-abu muda di atas putih yang gagal memenuhi kontras."
    ],
    quiz: [
      ["Ukuran font root adalah 16px. Berapa besar `1.5rem`?", ["15px", "16px", "24px", "1.5px"], "`rem` mengalikan ukuran font root: 1.5 × 16 = 24px."],
      ["Apa yang dilakukan `clamp(1rem, 3vw, 2rem)`?", ["Selalu memakai 3vw", "Memakai 3vw, tapi tidak pernah di bawah 1rem atau di atas 2rem", "Memakai nilai terkecil dari ketiganya", "Memakai 3vw hanya di layar yang lebih sempit dari 2rem"], "`clamp` menjaga nilai fleksibel yang diinginkan tetap di antara batas minimum dan maksimum."],
      ["Rasio kontras minimum untuk teks body biasa menurut WCAG AA?", ["2:1", "3:1", "4.5:1", "7:1"], "4.5:1 untuk teks biasa dan 3:1 untuk teks besar; 7:1 adalah level AAA yang lebih ketat."]
    ]
  },
  flexbox: {
    title: 'Flexbox: layout satu dimensi',
    why: "Navbar, toolbar, card, konten yang di-center, dan baris form: kebanyakan layout sehari-hari adalah satu baris atau satu kolom berisi beberapa hal, dan flexbox menangani semuanya.",
    points: [
      "`display: flex` pada parent mengubah child-nya menjadi flex item, yang disusun sepanjang **main axis** (`flex-direction: row` atau `column`).",
      "`justify-content` menyebar item sepanjang main axis; `align-items` meratakannya di cross axis.",
      "`gap` menambah jarak antar item tanpa trik margin.",
      "Item bisa membesar dan mengecil: `flex: 1` berarti 'ambil bagian yang sama dari ruang kosong'; `flex: 0 0 200px` berarti 'tetap persis 200px'.",
      "`flex-wrap: wrap` membuat item bisa turun ke baris baru. `margin-left: auto` pada satu item mendorongnya, dan semua yang setelahnya, ke ujung yang jauh.",
      "Secara default, flex item tidak mau mengecil lebih kecil dari isinya; `min-width: 0` pada item membuat teks panjang bisa mengecil atau terpotong."
    ],
    practice: "Di flexbox visualizer, buat ulang tiga layout: item di tengah secara horizontal dan vertikal; item pertama di kiri dan sisanya di kanan; kolom-kolom dengan lebar sama. Tuliskan CSS dan class Tailwind untuk masing-masing.",
    teach: "Jelaskan main axis dan cross axis, serta property mana yang mengatur perataan di masing-masing.",
    analogy: "Flexbox itu seperti menata buku di satu rak. `justify-content` menentukan bagaimana buku disebar sepanjang rak: didorong ke kiri, di tengah, atau berjarak rata. `align-items` menentukan apakah buku yang pendek duduk di bawah, di atas, atau di tengah. `flex-direction: column` memberdirikan raknya, dan arti kedua property itu di layar jadi bertukar.",
    pitfalls: [
      "Tertukar antara `justify-content` dan `align-items` setelah mengubah `flex-direction` menjadi `column`.",
      "Teks panjang atau tabel lebar yang merusak layout flex. Perbaiki dengan `min-width: 0` pada item-nya.",
      "Memakai flexbox untuk grid dua dimensi sungguhan lalu melawannya dengan lebar tetap."
    ],
    quiz: [
      ["Dengan `flex-direction: row`, property mana yang membuat item di tengah secara vertikal?", ["`justify-content`", "`align-items`", "`text-align`", "`vertical-align`"], "Di sebuah baris, cross axis-nya vertikal, dan `align-items` mengatur cross axis."],
      ["Apa yang dilakukan `flex: 1` pada setiap child?", ["Mengatur lebar tiap child menjadi 1fr", "Memberi setiap child bagian yang sama dari ruang kosong", "Membuat setiap child selebar 100%", "Mencegah child mengecil"], "Ia mengatur grow menjadi 1 dengan basis nol, jadi ruang kosongnya dibagi rata."],
      ["Di sebuah flex row, bagaimana cara mendorong hanya item terakhir ke paling kanan?", ["`float: right` pada item itu", "`margin-left: auto` pada item itu", "`justify-content: flex-end` pada container", "`position: absolute` pada item itu"], "Margin auto menyerap semua ruang kosong di sisi itu. `justify-content: flex-end` akan memindahkan semua item ke kanan."]
    ]
  },
  grid: {
    title: 'CSS Grid: layout dua dimensi',
    why: "Kerangka halaman, dashboard, galeri, dan desain apa pun yang baris dan kolomnya harus sejajar adalah wilayah Grid. Bersama flexbox, ia menangani hampir semua layout tanpa trik.",
    points: [
      "`display: grid` ditambah `grid-template-columns` mendefinisikan track kolom; baris dibuat otomatis saat item mengalir masuk.",
      "Unit `fr` adalah bagian dari ruang sisa: `1fr 2fr` membaginya sepertiga dan dua pertiga.",
      "`repeat(3, 1fr)` adalah tiga kolom sama lebar. `repeat(auto-fit, minmax(min(220px, 100%), 1fr))` adalah grid responsif tanpa media query; `min()` mencegahnya meluber dari container yang lebih sempit dari 220px.",
      "Item bisa membentang beberapa track: `grid-column: span 2`, atau `grid-column: 1 / -1` untuk lebar penuh.",
      "`grid-template-areas` memberi nama pada area, sehingga layout-nya terbaca seperti gambar halamannya.",
      "Patokan: **Grid untuk halaman dan apa pun yang dua dimensi, flexbox untuk isi setiap sel.**"
    ],
    practice: "Di grid visualizer, berpindah-pindah antar template dan ubah ukuran jendela selagi `auto-fit` dipilih. Lalu bangun layout aplikasi ini sendiri (sidebar + main) dengan `grid-template-areas` di CSS playground, dan buat kembali ke satu kolom di ponsel.",
    teach: "Jelaskan kapan memilih Grid dan kapan memilih flexbox, dengan satu contoh untuk masing-masing.",
    analogy: "Flexbox itu rak; Grid itu kertas berpetak. Di kertas berpetak kamu menentukan kolom dan barisnya dulu, lalu menaruh barang ke dalam sel-selnya, dan semuanya sejajar baik ke samping maupun ke bawah.",
    pitfalls: [
      "Memakai `auto-fill` padahal yang kamu mau `auto-fit`: `auto-fill` menyimpan track kosong, jadi item yang sedikit tidak melebar memenuhi baris.",
      "`minmax(220px, 1fr)` tanpa `min()`, yang meluber dari container yang lebih sempit dari 220px.",
      "Menulis jumlah kolom secara manual per breakpoint padahal `minmax()` bisa menyesuaikan sendiri.",
      "Kolom `1fr` yang meluber karena konten panjang. Pakai `minmax(0, 1fr)`."
    ],
    quiz: [
      ["Apa yang dihasilkan `grid-template-columns: 1fr 3fr`?", ["Dua kolom sama lebar", "Dua kolom yang berbagi ruang kosong 1:3", "Empat kolom", "Satu kolom berisi tiga baris"], "Unit `fr` membagi ruang yang tersedia secara proporsional."],
      ["Deklarasi mana yang menghasilkan grid responsif tanpa media query?", ["`repeat(3, 1fr)`", "`repeat(auto-fit, minmax(min(200px, 100%), 1fr))`", "`200px 200px 200px`", "`grid-auto-flow: column`"], "Browser memuat sebanyak mungkin kolom dengan lebar minimal 200px lalu melebarkannya; `min()` menangani container yang lebih sempit dari itu."],
      ["Bagaimana membuat sebuah item grid membentang selebar penuh?", ["`width: 100vw`", "`grid-column: 1 / -1`", "`grid-column: span all`", "`justify-self: stretch`"], "Dari garis 1 sampai garis -1 mencakup semua track kolom. `span all` bukan CSS yang valid."]
    ]
  },
  responsive: {
    title: 'Responsive design',
    why: "Sebagian besar traffic web datang dari ponsel. Layout yang hanya berfungsi di lebar layar milik desainernya berarti rusak untuk sebagian besar user-mu.",
    points: [
      "Sertakan meta tag viewport, kalau tidak, ponsel me-render halaman dalam keadaan di-zoom out: `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`.",
      "**Mobile-first**: tulis style dasar untuk layar kecil, lalu tambahkan kerumitan dengan `@media (min-width: …)`, atau sintaks range yang lebih baru, `@media (width >= 768px)`.",
      "Utamakan layout **intrinsik** yang menyesuaikan sendiri (flex-wrap, grid `auto-fit`, `clamp()`, `max-width`), dan tambahkan breakpoint hanya di tempat desainnya benar-benar rusak.",
      "Gambar: `max-width: 100%; height: auto;`, ditambah atribut `width`/`height` atau `aspect-ratio`, supaya tidak ada yang bergeser saat gambar dimuat.",
      "**Container query** (`@container`) memberi style pada komponen berdasarkan lebar container-nya, bukan viewport, dan itulah yang biasanya dibutuhkan komponen yang bisa dipakai ulang.",
      "Hormati preferensi user: `prefers-color-scheme`, `hover`, `pointer`, dan `prefers-reduced-motion`. Tulis animasi di dalam `@media (prefers-reduced-motion: no-preference)`, supaya animasi hanya ditambahkan untuk orang yang tidak meminta gerakan dikurangi."
    ],
    practice: "Ambil halaman yang hanya dirancang untuk desktop dan buat berfungsi di lebar 360px tanpa scroll horizontal. Hitung berapa media query yang kamu butuhkan, lalu coba hapus satu dengan menggantinya memakai teknik intrinsik.",
    teach: "Jelaskan arti 'mobile-first' di CSS dan kenapa media query `min-width` lebih disukai daripada `max-width`.",
    analogy: "Mobile-first itu seperti mengepak koper kabin dulu: kamu mulai dengan yang penting saja, dan kalau nanti dapat koper yang lebih besar, kamu menambah barang ekstra. Memulai dengan koper besar lalu memaksanya masuk ke koper kabin berarti harus memutuskan dengan berat hati apa yang dibuang.",
    pitfalls: [
      "Lupa meta tag viewport.",
      "Mendesain untuk tiga lebar perangkat yang persis, alih-alih membiarkan konten yang menentukan breakpoint-nya.",
      "Menyembunyikan konten di mobile alih-alih menyusunnya ulang.",
      "Menambah animasi di mana-mana lalu mencoba menghapusnya untuk user reduced-motion dengan `!important`. Lebih baik tambahkan animasi hanya di tempat yang memang diinginkan."
    ],
    quiz: [
      ["Di stylesheet mobile-first, style dasarnya menargetkan…", ["Layar desktop", "Layar kecil, dengan query `min-width` menambah layout untuk layar yang lebih besar", "Tablet, dengan query ke dua arah", "Cetak"], "Mulai dari yang sederhana lalu tingkatkan ke atas; layout yang lebih besar bersifat tambahan."],
      ["Container query didasarkan pada apa?", ["Lebar viewport", "Ukuran container dari elemen itu", "Device pixel ratio", "Ukuran font user"], "Komponen merespons ruang tempat ia ditaruh, di mana pun itu."],
      ["Rule mana yang mencegah gambar meluber dari parent-nya?", ["`width: 100vw`", "`max-width: 100%; height: auto`", "`overflow: hidden` pada gambar", "`object-fit: contain`"], "Gambar boleh mengecil supaya muat tapi tidak pernah melebihi container-nya, dan proporsinya tetap terjaga."]
    ]
  },
  position: {
    title: 'Positioning dan stacking context',
    why: "Modal, dropdown, header yang sticky, tooltip, dan badge semuanya bergantung pada positioning. 'Kenapa `z-index: 9999` tidak berpengaruh?' punya jawaban yang pasti, dan mengetahuinya menghemat berjam-jam.",
    points: [
      "`position: static` adalah alur normal. `relative` mempertahankan ruang elemennya dan membuatmu bisa menggesernya sedikit, sekaligus menjadikannya titik acuan untuk child yang di-position secara absolut.",
      "`absolute` mengeluarkan elemen dari alur dan memosisikannya terhadap **ancestor terdekat yang di-position**.",
      "`fixed` memosisikan terhadap viewport, **kecuali** ada ancestor yang punya `transform`, `filter`, atau `will-change: transform`: maka ia jadi fixed terhadap ancestor itu. `sticky` ikut scroll seperti biasa sampai mencapai offset tertentu, lalu menempel di dalam scroll container-nya.",
      "`z-index` hanya berlaku untuk elemen yang di-position dan item flex/grid, dan hanya mengurutkan elemen **di dalam stacking context yang sama**.",
      "Stacking context baru dibuat oleh elemen yang di-position dan punya `z-index`, dan juga oleh `opacity` di bawah 1, `transform`, `filter`, `isolation: isolate`, dan lainnya. Sebuah child tidak pernah bisa naik di atas context milik parent-nya.",
      "Overlay modern: elemen `<dialog>` dan Popover API di-render di **top layer**, di atas semuanya, tanpa `z-index` dan tanpa jebakan stacking context. Di React, portal adalah jalan keluar lainnya."
    ],
    practice: "Buat ulang bug-nya: taruh elemen `position: fixed; inset: 0; z-index: 9999` di dalam parent yang punya `transform`, di samping header sticky dengan `z-index: 10`. Jelaskan dua hal yang salah, lalu perbaiki dengan dua cara berbeda.",
    teach: "Jelaskan kenapa elemen dengan `z-index: 9999` masih bisa muncul di belakang elemen dengan `z-index: 2`.",
    analogy: "Stacking context itu seperti map berisi lembaran transparan. Di dalam satu map kamu bebas mengurutkan lembarannya dengan `z-index`. Tapi map-mapnya juga bertumpuk, dan lembaran di map paling bawah tidak akan pernah bisa naik di atas map yang di atasnya, setinggi apa pun angkanya di dalam map-nya sendiri.",
    pitfalls: [
      "Terus menaikkan angka z-index alih-alih mencari ancestor yang membuat stacking context.",
      "`position: absolute` tanpa ancestor yang di-position, sehingga elemennya terbang ke pojok halaman.",
      "`position: sticky` gagal karena ada ancestor dengan `overflow: hidden` yang sudah menjadi scroll container.",
      "Elemen `position: fixed` yang berhenti fixed karena ada ancestor yang mendapat `transform`, misalnya dari library animasi."
    ],
    quiz: [
      ["Elemen yang di-position secara absolut ditempatkan relatif terhadap…", ["Viewport, selalu", "Ancestor terdekatnya yang di-position", "Elemen parent-nya, selalu", "`<body>`, selalu"], "Ia memakai ancestor terdekat yang position-nya bukan `static`, dan kembali ke initial containing block kalau tidak ada."],
      ["Mana yang membuat stacking context baru?", ["`color: red`", "`transform: translateX(0)`", "`margin: 0`", "`display: block`"], "Transform, opacity di bawah 1, filter, dan `isolation: isolate` semuanya membuat stacking context."],
      ["Kenapa `z-index` bisa tidak berpengaruh pada sebuah elemen?", ["Angkanya melebihi batas yang diizinkan browser", "Elemennya tidak di-position, dan bukan item flex atau grid", "Parent-nya punya `overflow: hidden`", "Nilai negatif diabaikan"], "`z-index` diabaikan pada elemen static yang bukan item flex atau grid."],
      ["Elemen `position: fixed` tiba-tiba ikut scroll bersama halaman. Penyebab yang paling mungkin?", ["`z-index`-nya tidak ada", "Ada ancestor yang sekarang punya `transform`, sehingga `fixed` relatif terhadapnya", "Halamannya memakai flexbox", "Meta tag viewport-nya tidak ada"], "Ancestor yang di-transform (atau diberi filter) menjadi containing block untuk turunan yang fixed."]
    ]
  },
  modern: {
    title: 'Custom property, theming, dan CSS modern',
    why: "Design token, dark mode, dan variant komponen dibangun di atas custom property. CSS modern juga sudah bisa melakukan sebagian besar hal yang dulu membutuhkan preprocessor, jadi menguasainya membuat toolchain-mu tetap ramping.",
    points: [
      "**Custom property** (`--brand: #3b47d6`) adalah variabel yang ikut cascade dan diwariskan, dibaca dengan `var(--brand, fallback)`. Tidak seperti variabel Sass, ia tetap hidup di browser dan bisa berubah saat runtime.",
      "Definisikan **design token** di `:root` (warna, spasi, radius) lalu pakai di mana-mana. Mengganti tema berarti mendefinisikan ulang token-tokennya.",
      "Dark mode dengan tombol manual butuh tiga kasus: ikuti sistem kalau user belum memilih, dan patuhi `data-theme=\"light\"` atau `data-theme=\"dark\"` kalau sudah. Media query-nya harus melewati halaman yang user-nya memilih light.",
      "`color-scheme: light dark` membuat kontrol form dan scrollbar ikut menyesuaikan tema. `light-dark(#fff, #0e1117)` memilih value berdasarkan itu, alternatif ringkas untuk tema yang sederhana.",
      "**Nesting** bawaan (`.card { &:hover { … } }`) serta `:is()` / `:where()` mempersingkat selector.",
      "`:has()` adalah parent selector: `.field:has(input:user-invalid)` memberi style pada pembungkus berdasarkan isinya.",
      "Transition menganimasikan perubahan property; animasikan `transform` dan `opacity` sebisa mungkin."
    ],
    practice: "Buat tombol tema dengan tiga state: sistem, light, dan dark. Tombol itu mengatur `data-theme` di `<html>` (atau menghapusnya untuk 'sistem') dan mengingat pilihannya. Test keenam kombinasi setting sistem dan pilihan user. Lalu tambahkan tema high-contrast hanya dengan mendefinisikan ulang token; tidak boleh ada rule komponen yang menyebut warna mentah.",
    teach: "Jelaskan bagaimana custom property di CSS memungkinkan dark mode tanpa menulis ulang style setiap komponen.",
    analogy: "Custom property itu seperti nama-nama warna cat di bagan milik dekorator: 'dinding', 'list', 'aksen'. Instruksi untuk setiap ruangan berbunyi 'cat list-nya dengan warna list'. Untuk mendekorasi ulang seluruh rumah, kamu cukup mengubah tiga entri di bagan, bukan instruksi untuk setiap ruangan.",
    pitfalls: [
      "Warna yang ditulis langsung di mana-mana dalam komponen, sehingga ganti tema berubah jadi kerja cari-dan-ganti.",
      "Media query dark mode yang mengabaikan pilihan user, sehingga 'light' tidak bisa dipilih di sistem yang gelap.",
      "Lupa `color-scheme`, sehingga field form dan scrollbar tetap putih di halaman gelap.",
      "Menganimasikan `width`, `height`, atau `top`, yang memaksa layout di setiap frame."
    ],
    quiz: [
      ["Apa bedanya custom property dengan variabel Sass?", ["Lebih cepat diketik", "Ada di browser, ikut cascade dan diwariskan, dan bisa berubah per elemen atau per media query", "Hanya bisa menyimpan warna", "Butuh build step"], "Variabel Sass hilang setelah di-compile; custom property adalah value yang hidup di browser."],
      ["Apa yang dipilih oleh `.card:has(img)`?", ["Gambar di dalam card", "Card yang berisi gambar", "Card tanpa gambar", "Gambar pertama di setiap card"], "`:has()` memilih elemen berdasarkan turunannya."],
      ["Sistemnya gelap, user memilih light, dan halamannya tetap gelap. Penyebab yang paling mungkin?", ["Browser meng-cache CSS lama", "Rule `prefers-color-scheme: dark` tidak mengecualikan `[data-theme=\"light\"]`", "`color-scheme` tidak ada", "Custom property tidak bisa diubah setelah halaman dimuat"], "Media query-nya tetap menerapkan token gelap. Lindungi dengan `:root:not([data-theme=\"light\"])`."],
      ["Property mana yang paling murah untuk dianimasikan?", ["`width` dan `height`", "`transform` dan `opacity`", "`margin` dan `padding`", "`top` dan `left`"], "Compositor bisa menanganinya tanpa layout atau paint."]
    ]
  },
  tailwind: {
    title: 'Tailwind CSS: dasar utility-first',
    why: "Tailwind adalah salah satu cara paling umum untuk memberi style pada aplikasi React saat ini. Ia mengganti urusan memberi nama dan merawat stylesheet dengan class kecil yang bisa dirangkai, dan setiap class-nya adalah CSS biasa yang sudah kamu pahami.",
    points: [
      "**Utility-first**: setiap class melakukan satu hal (`p-4`, `flex`, `text-lg`, `bg-blue-600`). Kamu merangkainya di markup alih-alih mengarang nama class dan menulis CSS terpisah.",
      "Value-nya berasal dari **skala desain**: spasi (`p-4` = 1rem, dengan kelipatan 0.25rem), tipografi `text-sm`…`text-4xl`, warna `slate-50`…`slate-950`. Batasan menghasilkan konsistensi. Di v4, angka spasi berapa pun bisa dipakai (`p-13`) tanpa konfigurasi.",
      "**Variant** memberi awalan kondisi pada utility: `hover:`, `focus-visible:`, `disabled:`, `dark:`, dan breakpoint `sm:` `md:` `lg:` (mobile-first, min-width).",
      "Layout dipetakan satu-satu ke yang sudah kamu kenal: `flex items-center justify-between gap-4`, `grid grid-cols-3`, `absolute inset-0`.",
      "Jalan keluar: arbitrary value `w-[37rem]`, `bg-[#1da1f2]`, dan arbitrary variant. Pakai seperlunya; utamakan skala.",
      "Tailwind memindai file-filemu dan hanya menghasilkan **class yang kamu pakai**, jadi CSS-nya tetap kecil. Library komponen seperti Bootstrap bekerja sebaliknya: komponen yang sudah diberi style lalu kamu timpa."
    ],
    practice: "Buka CSS playground, nyalakan Tailwind, dan bangun ulang card-nya dari ingatan. Lalu terjemahkan lima class-nya kembali ke CSS biasa yang dihasilkannya. Kalau tidak bisa, ulangi lagi materi CSS yang terkait.",
    teach: "Jelaskan arti 'utility-first' dan jawab keberatan yang umum: 'bukankah ini sama saja dengan inline style?'",
    analogy: "CSS tradisional itu seperti memesan perabot custom: beri nama tiap barang, jelaskan, lalu tunggu dibuat. Tailwind itu sekotak balok bangunan standar dengan ukuran dan warna tetap: kamu merangkai apa yang kamu butuhkan saat itu juga, dan karena semua orang memakai balok yang sama, semua yang dibangun di rumah itu jadi serasi.",
    pitfalls: [
      "Belajar Tailwind alih-alih belajar CSS. Setiap utility adalah deklarasi CSS; tanpa dasarnya kamu tidak bisa men-debug-nya.",
      "Menyusun nama class secara dinamis (`'text-' + color + '-500'`). Tailwind hanya menemukan nama class lengkap yang tertulis di source-mu.",
      "Menyebutnya 'inline style'. Utility mendukung hover, fokus, breakpoint, dan dark mode, serta diambil dari skala yang terbatas; inline style tidak bisa satu pun dari itu.",
      "Menulis CSS sendiri di luar cascade layer pada project Tailwind v4: CSS itu mengalahkan semua utility Tailwind, berapa pun specificity-nya. Materi arsitektur menjelaskan sebabnya."
    ],
    quiz: [
      ["Apa arti `md:grid-cols-2`?", ["Dua kolom hanya di layar sedang", "Dua kolom mulai dari breakpoint `md` ke atas", "Dua kolom di bawah `md`", "Kolom berukuran sedang"], "Variant breakpoint adalah query `min-width` yang mobile-first: berlaku di lebar itu dan yang lebih lebar."],
      ["Kenapa CSS Tailwind tetap kecil di production?", ["Ia mengirim stylesheet tetap yang sudah di-minify", "Hanya class yang ditemukan di file source-mu yang dihasilkan", "Ia menghapus class yang tidak terpakai di browser saat runtime", "Ia memakai inline style"], "Tailwind memindai source-mu dan hanya menghasilkan utility yang benar-benar kamu pakai."],
      ["Kenapa `className={'bg-' + color + '-500'}` sering tidak berfungsi?", ["React melarang penyambungan string di `className`", "Tailwind tidak bisa melihat nama class lengkapnya di source, jadi class itu tidak pernah dihasilkan", "Warna harus berupa nilai hex", "Template string itu lambat"], "Class dideteksi sebagai string utuh saat build; petakan value ke nama class yang lengkap."]
    ]
  },
  twreact: {
    title: 'Tailwind di React: komponen, variant, dan theming',
    why: "Utility di markup hanya bisa berkembang kalau pengulangan dihilangkan dengan cara yang benar. Di codebase React, satuan untuk dipakai ulang adalah komponen, bukan class CSS, dan variant yang ber-type mengubah design system menjadi API yang dicek oleh compiler.",
    points: [
      "Hilangkan duplikasi dengan mengekstrak **komponen**, bukan dengan memakai `@apply`. Sebuah `<Button>` memiliki class-nya satu kali saja.",
      "Setup dengan Vite: install `tailwindcss` dan `@tailwindcss/vite`, tambahkan plugin-nya, lalu tulis `@import \"tailwindcss\";` di file CSS utamamu.",
      "Sesuaikan design system di CSS dengan `@theme`: mendefinisikan `--color-brand-500` membuat `bg-brand-500`, `text-brand-500`, dan seterusnya.",
      "Gabungkan class dengan aman memakai `clsx` + `tailwind-merge` (helper `cn()` yang umum), supaya `className` dari pemanggil bisa menimpa default tanpa konflik.",
      "Modelkan variant (ukuran, intent) sebagai prop ber-type, secara manual dengan object lookup atau dengan `class-variance-authority`. Variant yang tidak valid menjadi compile error.",
      "Komponen tombol sebaiknya default ke `type=\"button\"`. Default HTML-nya `submit`, jadi tanpa itu setiap tombol di dalam form akan men-submit form-nya.",
      "Beri style pada state tanpa JavaScript: `group-hover:`, `peer-invalid:`, `data-[state=open]:`, `aria-expanded:`. Dark mode memakai `dark:`; ubah ke class atau atribut dengan `@custom-variant` untuk tombol manual."
    ],
    practice: "Bangun komponen `Button`, `Input`, dan `Card` dengan variant ber-type di project Vite + React + Tailwind. Tambahkan warna brand lewat `@theme` dan tombol dark mode yang mengatur `data-theme` di `<html>`. Taruh sebuah `Button` di dalam form dan pastikan mengkliknya tidak men-submit. Tidak boleh ada file halaman yang berisi lebih dari utility layout.",
    teach: "Jelaskan kenapa, di project React + Tailwind, kamu mengekstrak komponen alih-alih class CSS untuk menghindari pengulangan utility.",
    analogy: "Komponen itu stempel karet yang sudah membawa tintanya sendiri. Kamu tidak memberi semua orang daftar dua belas warna tinta lalu berharap mereka mencampurnya dengan cara yang sama setiap kali; kamu memberi mereka stempelnya. Variant adalah putaran di stempel itu: kecil, sedang, besar; primary, danger.",
    pitfalls: [
      "Terlalu sering memakai `@apply` dan membangun ulang arsitektur stylesheet yang justru ingin dihilangkan Tailwind.",
      "Menyambung string class sehingga `px-2 px-4` sama-sama berlaku dan hasilnya bergantung pada urutan CSS. Gabungkan dengan `tailwind-merge`.",
      "Variant berupa string bebas alih-alih union yang ber-type.",
      "Komponen `Button` tanpa `type` default, yang men-submit form mana pun tempat ia ditaruh."
    ],
    quiz: [
      ["Apa yang terjadi kalau `--color-brand-500` didefinisikan di dalam `@theme`?", ["Tidak ada, sampai kamu menulis CSS yang memakainya", "Menghasilkan utility seperti `bg-brand-500` dan `text-brand-500`", "Mengganti semua warna bawaan", "Membuat komponen React"], "Variabel theme adalah design token yang menentukan class utility apa saja yang ada."],
      ["Masalah apa yang diselesaikan `tailwind-merge`?", ["Ukuran bundle", "Utility yang bertabrakan seperti `px-2 px-4`: ia menyimpan yang terakhir", "Dark mode yang tidak ada", "Build yang lambat"], "Ia menyelesaikan konflik, jadi `className` dari pemanggil bisa diandalkan untuk menimpa default."],
      ["Sebuah `<Button>` yang reusable ditaruh di dalam `<form>`. Mengkliknya men-submit form. Kenapa?", ["React men-submit form di setiap klik", "`type`-nya default ke `submit` kalau tidak diatur", "`tailwind-merge` menghapus type-nya", "Form-nya tidak punya `action`"], "Button HTML secara default adalah `type=\"submit\"`; komponennya seharusnya default ke `\"button\"`."],
      ["Cara terbaik memakai ulang sekumpulan utility di seluruh aplikasi React?", ["Copy-paste", "`@apply` di stylesheet global", "Ekstrak sebuah komponen", "Object `style` inline"], "Komponen adalah satuan untuk dipakai ulang; ia menyatukan struktur, perilaku, dan class sekaligus."]
    ]
  },
  arch: {
    title: 'Arsitektur CSS dan design system',
    why: "CSS bersifat global secara default, jadi ia lebih cepat membusuk dibanding kode lain seiring tim bertambah besar. Tugasnya adalah memilih cara membatasi cakupannya dengan sengaja, dan bisa menjelaskan kenapa alternatifnya ditolak.",
    points: [
      "Masalah intinya adalah **scope global + specificity + urutan di source**: rule mana pun bisa memengaruhi elemen mana pun, dan penimpaan terus menumpuk.",
      "Strategi pembatasan cakupan: konvensi penamaan (**BEM**: `.card__title--large`), **CSS Modules** (nama class unik yang dibuat saat build), **utility-first** (Tailwind), CSS-in-JS, dan **`@scope`** bawaan.",
      "**Cascade layer** (`@layer reset, base, components, utilities;`) membuat urutan prioritas jadi eksplisit: layer yang belakangan mengalahkan yang lebih awal, berapa pun specificity-nya.",
      "CSS yang ditulis **di luar layer mana pun mengalahkan semua layer**. Tailwind v4 menaruh style-nya sendiri di dalam layer (`theme`, `base`, `components`, `utilities`), jadi CSS biasa yang kamu tulis di luar layer diam-diam menimpa utility Tailwind. Taruh CSS-mu sendiri di dalam layer juga.",
      "**Design system** adalah token (warna, spasi, tipografi, radius) → primitive (Button, Input) → pattern. Token punya tingkatan: nilai mentah, alias semantik (`--color-danger`), dan token komponen.",
      "Komponen sebaiknya tidak mengatur margin luarnya sendiri; layout parent yang mengatur jarak (dengan `gap`). Itu membuat komponen bisa dipakai ulang di mana saja.",
      "Pertimbangan untung-rugi: utility-first memberi kecepatan dan bundle CSS yang kecil tapi markup yang ramai; CSS Modules memberi CSS biasa dan isolasi tapi lebih banyak file dan penamaan; CSS-in-JS di runtime memakan performance dan tidak cocok dengan React Server Components."
    ],
    practice: "Audit stylesheet yang kamu kenal: hitung `!important`, temukan selector dengan specificity tertinggi, dan daftarkan setiap nilai warna mentah. Lalu tulis proposal satu halaman tentang pembatasan cakupan dan token untuk tim berisi lima orang, sebutkan alternatif yang kamu tolak dan alasannya.",
    teach: "Jelaskan bagaimana cascade layer menyelesaikan urutan prioritas, pakai contoh class utility yang harus menimpa style komponen, dan kenapa CSS di luar layer mengalahkan semuanya.",
    analogy: "Tanpa layer, prioritas CSS itu seperti adu teriak: yang paling keras (paling spesifik) menang, jadi semua orang terus menaikkan suaranya. Cascade layer adalah urutan bicara yang disepakati dalam rapat: ketua rapat selalu punya kata terakhir, sepelan apa pun ia bicara.",
    pitfalls: [
      "Mencampur tiga strategi pembatasan cakupan dalam satu codebase tanpa aturan mana yang berlaku di mana.",
      "Token yang dinamai sesuai nilainya (`--blue`) alih-alih tujuannya (`--color-action`), sehingga rebranding jadi menyakitkan.",
      "Komponen yang membawa margin luar dan rusak di setiap konteks baru.",
      "CSS di luar layer pada project Tailwind v4, yang diam-diam mengalahkan utility-nya."
    ],
    quiz: [
      ["Dengan `@layer components, utilities;` rule mana yang menang: `#app .btn` di `components` atau `.hidden` di `utilities`?", ["`#app .btn`: specificity-nya lebih tinggi", "`.hidden`: layer yang belakangan menang, berapa pun specificity-nya", "Yang posisinya lebih akhir di file", "Tidak ada"], "Urutan layer dibandingkan sebelum specificity."],
      ["`.hidden { display: none }` ada di `@layer utilities`; `.card { display: block }` tidak ada di layer mana pun. Pada `<div class=\"card hidden\">`, mana yang menang?", ["`.hidden`: utilities adalah layer terakhir", "`.card`: style di luar layer mengalahkan semua layer", "Yang posisinya lebih akhir di file", "Tidak ada yang berlaku"], "Deklarasi biasa di luar layer mana pun mengungguli semua deklarasi yang ada di layer. Itulah kenapa CSS biasa bisa menimpa utility Tailwind v4."],
      ["Apa yang diberikan CSS Modules?", ["Theming saat runtime", "Nama class dengan cakupan lokal yang dibuat saat build", "Library class utility", "Dukungan `@scope` bawaan di browser lama"], "Nama class di setiap file dibuat unik, jadi style tidak bisa bertabrakan antar komponen."],
      ["Kenapa komponen yang reusable sebaiknya tidak mengatur margin luarnya sendiri?", ["Margin lambat di-render", "Jarak bergantung pada konteks, jadi layout parent yang seharusnya mengaturnya", "Margin tidak berfungsi di dalam grid", "Merusak dark mode"], "Komponen dengan margin bawaan hanya cocok di konteks tempat ia pertama kali dirancang."]
    ]
  },
  render: {
    title: 'Rendering performance dan aksesibilitas',
    why: "CSS menentukan seberapa cepat halaman muncul dan apakah semua orang bisa memakainya. Artinya memahami rendering pipeline dengan cukup baik untuk menemukan jank dan layout shift, serta menganggap aksesibilitas sebagai bagian dari kebenaran kode.",
    points: [
      "Pipeline-nya: **Style → Layout → Paint → Composite**. Mengubah geometri (`width`, `top`, `margin`) memicu layout; mengubah warna memicu paint; `transform` dan `opacity` bisa langsung loncat ke composite.",
      "**Layout thrashing**: membaca layout (`offsetHeight`) setelah menulis style, di dalam loop, memaksa layout sinkron berulang kali. Kumpulkan pembacaan dulu, baru penulisannya.",
      "CSS itu **render-blocking**: jaga tetap kecil, inline-kan CSS kritis untuk layar pertama kalau perlu, dan hindari rantai `@import`.",
      "Cegah **layout shift (CLS)**: siapkan ruang dengan dimensi atau `aspect-ratio`, jangan menyisipkan konten di atas yang sudah tampil, dan pakai `font-display: swap` dengan font cadangan yang ukurannya disesuaikan.",
      "`content-visibility: auto` dan `contain` membuat browser bisa melewati pekerjaan untuk bagian halaman yang di luar layar atau terisolasi.",
      "Aksesibilitas di CSS: jangan pernah menghapus outline fokus tanpa pengganti (`:focus-visible`), jaga kontras, jangan menyampaikan makna hanya lewat warna, dan sembunyikan secara visual dengan pola `.sr-only`, bukan `display: none`, kalau screen reader masih harus bisa menemukannya.",
      "Reduced motion: tambahkan animasi hanya di bawah `prefers-reduced-motion: no-preference`, seperti di materi responsive. Kalau kamu juga butuh pengaman untuk CSS pihak ketiga, pendekkan durasinya menjadi `0.01ms` alih-alih `none`, supaya JavaScript yang menunggu `transitionend` tetap mendapat event-nya."
    ],
    practice: "Rekam performance trace dari animasi yang mengubah `left`, lalu yang mengubah `transform`, dan bandingkan entri Layout dan Paint-nya. Lalu jelajahi salah satu halamanmu dengan tombol Tab tanpa menyentuh mouse, dan perbaiki setiap tempat di mana kamu kehilangan jejak fokus.",
    teach: "Jelaskan kenapa menganimasikan `transform` lebih mulus daripada menganimasikan `left`, dari sudut pandang rendering pipeline.",
    analogy: "Me-render halaman itu seperti mementaskan sandiwara. Layout adalah membangun set panggung, paint adalah mengecat dekorasinya, composite adalah menggeser panel yang sudah jadi di atas rel. Menganimasikan `left` berarti membangun ulang set setiap frame; menganimasikan `transform` hanya menggeser panel yang sudah jadi, yang bisa dilakukan kru panggung enam puluh kali per detik tanpa memanggil tukang kayu.",
    pitfalls: [
      "`outline: none` tanpa pengganti, yang membuat halaman tidak bisa dipakai lewat keyboard.",
      "`will-change` di mana-mana, memakan memory tanpa manfaat.",
      "Gambar dan iklan tanpa ruang yang disiapkan, sehingga konten melompat saat semuanya dimuat.",
      "`transition: none !important` untuk reduced motion, yang merusak kode yang menunggu `transitionend`."
    ],
    quiz: [
      ["Perubahan mana yang bisa ditangani compositor saja?", ["`width`", "`margin-top`", "`transform`", "`font-size`"], "Transform dan opacity tidak butuh layout maupun paint kalau elemennya berada di layer sendiri."],
      ["Apa yang paling langsung mengurangi layout shift dari gambar?", ["Lazy loading", "Menyiapkan ruang dengan dimensi atau `aspect-ratio`", "File yang lebih kecil", "Menyajikannya dari CDN"], "Kalau browser sudah tahu ukurannya sebelum gambar dimuat, tidak ada yang bergeser saat gambarnya datang."],
      ["Bagaimana menyembunyikan konten secara visual tapi tetap tersedia untuk screen reader?", ["`display: none`", "`visibility: hidden`", "Pola visually-hidden (`.sr-only`)", "`aria-hidden=\"true\"`"], "`display: none`, `visibility: hidden`, dan `aria-hidden` semuanya menghapus konten dari apa yang diumumkan screen reader."]
    ]
  }
}, { tagline: 'Tampilannya: cascade, layout, responsive design, dan Tailwind CSS dalam skala besar.' });
