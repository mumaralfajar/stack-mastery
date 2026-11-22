// Bahasa Indonesia — track CSS + Tailwind. Contoh kode tetap memakai versi aslinya.
export const trackId = {
  id: 'css',
  tagline: 'Tampilannya: cascade, layout, desain responsif, dan Tailwind CSS.',
  lessons: {
  html: {
    terms: [
      ['Landmark semantik', 'Elemen seperti `<header>`, `<nav>`, `<main>`, dan `<article>` yang menunjukkan peta halaman ke pembaca layar.'],
      ['`<button>` vs `<a>`', 'Pakai `<a href="...">` untuk pindah halaman atau URL, lalu pakai `<button type="button">` untuk aksi langsung di tempat.'],
      ['`<label for="id">`', 'Mengaitkan teks label ke input supaya pembaca layar mengumumkannya dan klik pada label otomatis memfokuskan input.']
    ],
    title: 'Dasar HTML: struktur dan makna',
    why: "CSS memberi gaya pada HTML, dan React me-render HTML. Memilih tag semantik memberimu fokus keyboard, dukungan pembaca layar, dan SEO gratis, sedangkan `div` tidak punya satu pun.",
    points: [
      "HTML menentukan **arti konten**, bukan tampilannya: judul, paragraf, daftar, tombol, serta area navigasi.",
      "Pasang satu `<h1>` tiap halaman lalu turunkan ke `<h2>` dan `<h3>`. Pengguna screen reader melompat antar-heading layaknya daftar isi.",
      "**Landmark** membagi kerangka halaman lewat `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, dan `<footer>`.",
      "Pakai `<button>` untuk aksi dan `<a href>` untuk navigasi tautan. Keduanya langsung mendukung keyboard, sementara `<div>` yang diberi klik tidak. Simpan `<div>` cuma untuk pembungkus tata letak.",
      "Selalu pasangkan input bersama `<label>`. Memilih `type` (`email`, `number`, `date`) memunculkan papan ketik ponsel yang sesuai, sementara `required`, `min`, dan `pattern` memvalidasi sebelum JavaScript jalan.",
      "Beri gambar teks `alt` yang jelas (`alt=\"\"` untuk gambar hiasan) beserta `width` dan `height` agar halaman tak melompat saat dimuat."
    ],
    practice: "Di CSS playground, susun kerangka halaman produk memakai elemen semantik, lalu pakai `div` hanya untuk wadah tanpa arti khusus. Jelajahi seluruh isi lewat tombol Tab untuk memastikan semua kontrol bisa diraih, lalu ganti tombol dengan `div` klik dan rasakan bedanya.",
    teach: "Jelaskan kenapa memilih `<button>` jauh lebih tepat daripada menaruh handler klik pada `<div>`.",
    analogy: "HTML itu seperti denah bangunan berlabel: ruang ini dapur, yang ini ruang depan, yang sebelah tangga. Cat dan mebel (CSS) menyusul belakangan. Denah yang cuma menuliskan 'ruangan' di tiap kotak membuat tamu tunanetra tak bisa menemukan dapur.",
    pitfalls: [
      "Memakai `div` dan `span` untuk komponen interaktif lalu repot menulis ulang fokus, tombol Enter, serta role ARIA sendiri.",
      "Menaruh placeholder di input tanpa menyertakan label asli.",
      "Memilih tingkatan heading cuma demi ukuran font, bukan urutan struktur dokumen.",
      "Memasang `<button>` di dalam form tanpa `type=\"button\"`, padahal bawaannya `submit` sehingga tiap klik langsung mengirim form."
    ],
    quiz: [
      ["Elemen mana yang seharusnya memicu aksi seperti 'Add to cart'?", ["`<div onclick>`", "`<button type=\"button\">`", "`<a href=\"#\">`", "`<span role=\"button\">`"], "Button mendukung fokus, Enter, dan Spasi bawaan serta diumumkan tepat oleh screen reader. Link untuk pindah URL, sedangkan span tetap butuh tabindex dan event keyboard manual."],
      ["Untuk apa atribut `alt`?", ["Tooltip yang muncul saat hover", "Teks pengganti yang menjelaskan gambar, untuk orang dan alat yang tidak bisa melihatnya", "Keterangan yang tampil di bawah gambar", "Kata kunci untuk mesin pencari"], "Screen reader membacakan isinya, dan teks itu tampil saat gambar gagal dimuat."],
      ["Bagaimana `<label>` terhubung ke input-nya?", ["Dengan ditaruh di sebelahnya", "`for` pada label yang cocok dengan `id` input (atau dengan membungkus input-nya)", "Dengan memakai `class` yang sama", "Dengan `aria-label` pada label"], "Tautan ini memberi input nama aksesibel serta memfokuskan kotak isian saat label diklik."]
    ]
  },
  cascade: {
    terms: [
      ['Specificity (`id`, `class`, `tag`)', 'Skor tiga bagian penentu rule pemenang saat selector berbenturan (`#id` kalahkan `.class`, lalu `a`).'],
      ['Source order (urutan kode)', 'Penentu seri kalau dua rule skornya sama. Deklarasi yang muncul lebih belakangan di CSS yang menang.'],
      ['Inheritance (pewarisan)', 'Properti teks (`color`, `font`) menurun ke elemen anak sampai ditimpa, sedangkan properti kotak (`border`, `padding`) diam di tempat.']
    ],
    title: 'Selector, cascade, dan specificity',
    why: "Tiap kali sebuah rule CSS terasa tak mempan, biasanya ada rule lain yang diutamakan. Cascade mengikuti aturan penentu yang pasti, dan sekali kamu menghafal urutannya, styling jadi gak bikin bingung lagi.",
    points: [
      "Bentuk dasar rule adalah `selector { property: value }`. Selector membidik tag (`p`), class (`.card`), ID (`#header`), atribut (`[type=email]`), atau status (`:hover`, `:focus-visible`).",
      "Combinator membaca hubungan elemen: `nav a` (keturunan), `ul > li` (anak langsung), dan `h2 + p` (saudara tepat setelahnya).",
      "Saat banyak rule mengatur properti sama, **cascade** memeriksa `!important`, inline style, urutan `@layer`, **specificity**, baru **urutan baris** (yang terakhir menang).",
      "Skor specificity dihitung `(id, class, element)`. Satu ID mengalahkan berapa pun banyaknya class, dan satu class selalu mengungguli tumpukan tag.",
      "`:where()` bernilai **nol**, membuat `:where(.card) a` semudah `a` untuk ditimpa. `:is()` ikut mengambil skor argumennya yang paling spesifik.",
      "Properti teks seperti `color`, `font`, dan `line-height` **diwariskan** ke anak, sementara properti kotak seperti `margin`, `padding`, dan `border` tidak.",
      "Jaga skor tetap rendah dengan single class. Tiap kali menempelkan ID atau `!important`, timpaan berikutnya makin merepotkan."
    ],
    practice: "Di specificity visualizer, tebak warna pemenang sebelum menekan tombol tiap rule. Lalu buka CSS playground, tulis tiga rule bentrok untuk satu tombol, dan buat ketiganya menang bergantian tanpa menyentuh `!important`.",
    teach: "Jelaskan cara browser memutuskan rule CSS mana yang akhirnya dipakai saat dua rule berbenturan.",
    analogy: "Specificity mirip permainan kartu berperingkat tegas. ID adalah as, class adalah raja, dan tag adalah kartu angka. Tumpukan kartu raja takkan pernah mengalahkan satu kartu as, lalu bila sama kuat yang turun terakhir menang.",
    pitfalls: [
      "Mengira 11 class bisa menundukkan 1 ID. Kolom skornya tak pernah bertumpuk lintas kolom.",
      "Menempelkan `!important` demi jalan pintas, memaksa orang berikutnya menumpuk `!important` lebih banyak lagi.",
      "Mengira semua properti otomatis menular ke anak. Properti `border` dan `margin` tak pernah diwariskan."
    ],
    quiz: [
      ["Selector mana yang specificity-nya paling tinggi?", ["`.card .title`", "`#main`", "`div p span a`", "`.a.b.c`"], "Satu ID (1,0,0) langsung menang terhadap berapa pun class atau elemen."],
      ["Dua rule dengan specificity sama mengatur `color`. Mana yang menang?", ["Yang pertama di file", "Yang dideklarasikan belakangan", "Yang deklarasinya lebih banyak", "Yang ada di file lebih besar"], "Bila importance, layer, dan skor specificity sama persis, deklarasi yang datang paling akhir yang menang."],
      ["Property mana yang diwariskan bawaannya?", ["`margin`", "`border`", "`color`", "`width`"], "Properti teks semacam `color` dan `font` turun ke anak, sedangkan properti layout kotak tidak."],
      ["Berapa specificity dari `:where(#main .card) a`?", ["(1,1,1)", "(0,0,1)", "(0,1,1)", "(1,0,1)"], "Semua selector di dalam `:where()` dihitung nol, jadi tinggal `a` saja yang dihitung."]
    ]
  },
  box: {
    terms: [
      ['`box-sizing: border-box`', 'Memasukkan padding dan border ke dalam lebar `width` supaya kotak tidak meluber melewati ukuran yang kamu tulis.'],
      ['Padding vs Margin', 'Padding memberi ruang napas di dalam latar dan border, sedangkan margin memberi jarak antar-elemen di luar border.'],
      ['Margin collapsing', 'Margin vertikal blok yang bersentuhan melebur mengambil yang paling besar bukan dijumlah (tak terjadi pada flex atau grid).']
    ],
    title: 'Box model',
    why: "Setiap elemen HTML dibungkus kotak persegi panjang. Sekali kamu terbiasa membayangkan keempat lapisannya, masalah seperti kotak selebar 100% yang mendadak meluber ke kanan langsung terasa masuk akal.",
    points: [
      "Dari tengah ke luar, tiap kotak tersusun atas **content**, **padding** (ruang di dalam border), **border**, dan **margin** (jarak keluar antarkotak).",
      "Bawaan `content-box` cuma menerapkan `width` ke isi konten lalu menambah padding dan border di luarnya. Mode `border-box` memasukkan padding dan border ke dalam `width`.",
      "Awali proyek CSS dengan reset `*, *::before, *::after { box-sizing: border-box; }`.",
      "Elemen `block` mengisi satu baris penuh dan turun menumpuk. Elemen `inline` mengalir dalam teks tanpa memedulikan `width` dan `height`, sementara `inline-block` mengalir sebaris tapi menerima ukuran pasti.",
      "Margin vertikal antarblok bertumpuk **melebur** menjadi satu margin terlebar. Padding tak pernah melebur, dan item flex atau grid juga tak saling melebur.",
      "`overflow` mengatur isi berlebih: `visible`, `hidden`, `clip`, atau `auto` (scrollbar hanya muncul bila kurang muat)."
    ],
    practice: "Pakai box model visualizer agar elemen `content-box` 300px meluber keluar parent 320px, lalu bereskan dengan menggantinya ke `border-box`. Cek pula diagram box salah satu elemen lewat dev tools.",
    teach: "Jelaskan beda padding dan margin, serta efek menyalakan `box-sizing: border-box`.",
    analogy: "Bayangkan lukisan berbingkai di dinding. Kontennya adalah lukisan, kertas putih sekelilingnya padding, bingkainya border, dan dinding kosong menuju lukisan sebelah adalah margin. Memasang `border-box` berarti ukuran 30 cm dihitung dari tepi luar bingkai.",
    pitfalls: [
      "Memasang `width: 100%` ditambah padding di mode `content-box` hingga kotak keluar dari induknya.",
      "Menunggu `width` atau margin atas-bawah berefek pada elemen inline seperti `span`.",
      "Kaget melihat margin melebur lalu menambah margin lebih besar lagi. Di flex atau grid, pakailah `gap`."
    ],
    quiz: [
      ["Dengan `box-sizing: content-box`, `width: 200px; padding: 20px; border: 5px solid` di-render selebar berapa?", ["200px", "225px", "250px", "240px"], "Total lebarnya 200 + 20×2 + 5×2 = 250px karena padding dan border dihitung di luar lebar konten."],
      ["Apa yang ada di antara content dan border?", ["Margin", "Padding", "Outline", "Gap"], "Padding berada di dalam garis border, sementara margin ada di luarnya. Outline digambar melapisi tepi tanpa memakan ruang layout."],
      ["Dua paragraf bertumpuk punya `margin-bottom: 20px` dan `margin-top: 30px`. Celahnya…", ["50px", "30px", "20px", "25px"], "Margin vertikal yang berdekatan melebur mengambil nilai yang terbesar dari keduanya."]
    ]
  },
  units: {
    terms: [
      ['`rem` vs `em` vs `px`', '`rem` mengikuti ukuran font root pilihan browser (aksesibel), `em` mengikuti elemen tempatnya berada, sedangkan `px` nilainya kaku.'],
      ['Lebar bacaan (`ch`)', 'Lebar baris diukur dari lebar karakter nol. Menahan panjang kalimat sekitar `60ch–70ch` menjaga mata nyaman membaca.'],
      ['Rasio kontras (`4.5:1`)', 'Batas kontras minimum WCAG AA antara teks isi dan latar supaya tulisan jelas di bawah sinar matahari maupun bagi pengguna low-vision.']
    ],
    title: 'Unit, warna, dan tipografi',
    why: "Tipografi yang nyaman dibaca serta spasi seragam membereskan sebagian besar tampilan UI profesional. Pilihan unit ukuran juga menentukan apakah halamanmu tetap patuh saat pengguna memperbesar huruf di browser.",
    points: [
      "`px` memakai ukuran piksel CSS tetap, sedangkan `rem` mengalikan ukuran font root (bawaannya 16px) dan mengikuti setelan aksesibilitas browser.",
      "`em` mengikuti ukuran font elemennya sendiri, pas untuk padding tombol yang membesar bersama teks. `%` mengacu induknya, `vw`/`dvh` mengikuti viewport, dan `ch` mengukur lebar satu karakter.",
      "`clamp(min, preferred, max)` mengukur ukuran cair di antara batas min dan maks. Mencampur `rem` di teks (`clamp(1.75rem, 1rem + 3vw, 2.5rem)`) membuat zoom browser tetap memperbesar judul.",
      "Warna dapat ditulis lewat hex `#3b47d6`, `rgb()`, `hsl()` (hue, saturation, lightness), atau `oklch()` agar tiap langkah gelap-terangnya tampak setara di mata.",
      "Teks isi yang nyaman dimulai dari minimal 16px dengan `line-height: 1.5`, lebar kolom `45ch–75ch` (`max-width: 65ch`), dan skala ukuran judul jelas.",
      "Kontras teks normal harus minimal 4.5:1 terhadap latarnya (3:1 bagi judul besar) sesuai standar WCAG AA."
    ],
    practice: "Setel ukuran font default browser ke 20px lalu bandingkan halaman berbasis `px` melawan halaman berbasis `rem`. Setelah itu rancang judul yang 1.5rem di ponsel dan 2.5rem di desktop memakai satu `clamp()` tanpa media query, lalu zoom 200% untuk mengujinya.",
    teach: "Jelaskan perbedaan `px`, `em`, dan `rem`, lalu beri contoh kapan masing-masing paling cocok.",
    analogy: "`px` itu ukuran penggaris mati: 2 cm sama bagi siapa pun. Sebaliknya, `rem` artinya dua kali ukuran tulisan normal pembacanya, jadi huruf ikut membesar saat pembaca menyetel huruf lebih besar.",
    pitfalls: [
      "Mengubah `html { font-size: 10px }` atau mengunci teks di `px`, mematikan preferensi huruf besar pengguna.",
      "Menumpuk `em` berlapis-lapis hingga teks membengkak atau menyusut tak karuan seperti fotokopi berulang.",
      "Menulis ukuran font pakai `vw` murni yang nyaris kebal terhadap zoom browser.",
      "Memasang teks abu-abu pucat di atas putih sampai gagal uji kontras."
    ],
    quiz: [
      ["Ukuran font root adalah 16px. Berapa besar `1.5rem`?", ["15px", "16px", "24px", "1.5px"], "`rem` mengalikan ukuran font root: 1.5 × 16 = 24px."],
      ["Apa yang dilakukan `clamp(1rem, 3vw, 2rem)`?", ["Selalu memakai 3vw", "Memakai 3vw, tapi tidak pernah di bawah 1rem atau di atas 2rem", "Memakai nilai terkecil dari ketiganya", "Memakai 3vw hanya di layar yang lebih sempit dari 2rem"], "`clamp` menjaga nilai tengah tetap bergerak di antara batas minimum dan maksimumnya."],
      ["Rasio kontras minimum untuk teks body biasa menurut WCAG AA?", ["2:1", "3:1", "4.5:1", "7:1"], "AA mensyaratkan 4.5:1 untuk teks biasa dan 3:1 untuk teks besar, sedangkan 7:1 untuk level AAA yang lebih ketat."]
    ]
  },
  flexbox: {
    terms: [
      ['Main axis vs Cross axis', '`flex-direction: row` menempatkan sumbu utama horizontal (`justify-content`) dan sumbu silang vertikal (`align-items`).'],
      ['`min-width: 0` / `min-inline-size: 0`', 'Menghilangkan batas bawaan `min-width: auto` milik flex item supaya teks panjang bisa turun baris atau terpotong rapi.'],
      ['`gap` & `flex: 1`', '`gap` memberi jarak bersih di antara anak tanpa trik margin, sementara `flex: 1` membagi sisa ruang kosong merata.']
    ],
    title: 'Flexbox: layout satu dimensi',
    why: "Navbar, toolbar, kartu produk, kotak rata tengah, hingga baris form hampir selalu berupa deretan satu baris atau satu kolom. Flexbox menyelesaikan semua susunan satu arah ini.",
    points: [
      "`display: flex` mengubah elemen anak langsung menjadi flex item yang berbaris di sepanjang **main axis** (`row` atau `column`).",
      "`justify-content` menyebar item di sumbu utama, sementara `align-items` mengatur perataan pada sumbu silang.",
      "`gap` menyisipkan jarak antarelemen anak tanpa perlu repot menghapus margin ujung.",
      "Ukuran item diatur lewat `flex`: `flex: 1` membagi sisa ruang merata, sedangkan `flex: 0 0 200px` mengunci lebar pas 200px.",
      "`flex-wrap: wrap` menurunkan item ke baris baru saat penuh, dan `margin-left: auto` mendorong satu item beserta sisanya ke ujung terjauh.",
      "Bawaannya flex item menolak menyusut di bawah lebar isinya. Pasang `min-width: 0` di item agar teks panjang atau tabel mau turun baris."
    ],
    practice: "Di flexbox visualizer, buat tiga susunan: item rata tengah ke dua arah, item pertama kiri dan sisanya rapat kanan, serta kolom selebar sama. Catat kode CSS dan class Tailwind untuk masing-masing.",
    teach: "Jelaskan arti main axis dan cross axis, beserta properti perataan masing-masing sumbu.",
    analogy: "Flexbox itu seperti menata buku di satu papan rak. `justify-content` menyebar buku sepanjang papan (rapat kiri, tengah, atau renggang), sedangkan `align-items` menentukan duduk buku pendek di atas, bawah, atau tengah. Kalau papan diberdirikan (`column`), kedua arahnya ikut bertukar.",
    pitfalls: [
      "Tertukar antara `justify-content` dan `align-items` sesudah mengubah arah `flex-direction` ke `column`.",
      "Judul panjang atau tabel lebar menjebol batas flex. Atasi dengan `min-width: 0` di item flex.",
      "Memaksakan flexbox untuk membuat grid dua dimensi dengan lebar kaku."
    ],
    quiz: [
      ["Dengan `flex-direction: row`, property mana yang menengahkan item ke atas-bawah?", ["`justify-content`", "`align-items`", "`text-align`", "`vertical-align`"], "Pada baris horizontal, sumbu silangnya vertikal dan dikendalikan oleh `align-items`."],
      ["Apa yang dilakukan `flex: 1` pada setiap child?", ["Mengatur lebar tiap child menjadi 1fr", "Memberi setiap child bagian yang sama dari ruang kosong", "Membuat setiap child selebar 100%", "Mencegah child mengecil"], "Aturan ini menyetel flex-grow ke 1 dengan basis nol, jadi ruang sisa dibagi rata."],
      ["Di sebuah flex row, bagaimana cara mendorong hanya item terakhir ke paling kanan?", ["`float: right` pada item itu", "`margin-left: auto` pada item itu", "`justify-content: flex-end` pada container", "`position: absolute` pada item itu"], "Margin auto menyedot semua ruang kosong di sebelah kirinya. Sebaliknya, `justify-content: flex-end` menggeser semua item sekaligus."]
    ]
  },
  grid: {
    terms: [
      ['Satuan `fr`', 'Pecahan ruang kosong tersisa di container grid sesudah kolom berukuran tetap dan berbasis konten diletakkan.'],
      ['`repeat(auto-fit, minmax(min(260px, 100%), 1fr))`', 'Grid responsif tanpa media query yang otomatis menumpuk card di layar sempit tanpa horizontal overflow.'],
      ['Track implisit vs eksplisit', 'Kolom atau baris yang kamu definisikan (`grid-template-columns`) vs baris ekstra otomatis waktu item bergulir ke bawah.']
    ],
    title: 'CSS Grid: layout dua dimensi',
    why: "Kerangka halaman, dashboard, galeri foto, serta tata letak apa pun yang baris dan kolomnya wajib sejajar merupakan tugas CSS Grid. Bersama flexbox, hampir semua layout jadi rapi tanpa trik lama.",
    points: [
      "`display: grid` bersama `grid-template-columns` menetapkan jalur kolomnya, sementara baris baru otomatis terbentuk seiring masuknya anak.",
      "Satuan `fr` membagi ruang sisa berbanding lurus (`1fr 2fr` memberi bagian sepertiga dan dua pertiga).",
      "`repeat(3, 1fr)` menghasilkan tiga kolom rata. `repeat(auto-fit, minmax(min(220px, 100%), 1fr))` menyesuaikan jumlah kolom otomatis tanpa media query sekaligus bebas meluber di bawah 220px.",
      "Item bisa melintasi banyak kolom memakai `grid-column: span 2`, atau penuh kiri-ke-kanan lewat `grid-column: 1 / -1`.",
      "`grid-template-areas` memetakan zona header, sidebar, dan konten utama mirip sketsa gambar langsung di CSS.",
      "Patokan gampangnya: pakai **Grid** untuk struktur dua dimensi halaman, lalu pakai **flexbox** untuk menyusun isi di tiap kotak."
    ],
    practice: "Coba beragam template di grid visualizer lalu geser lebar jendela saat mode `auto-fit` aktif. Setelah itu bangun kerangka halaman sidebar plus konten memakai `grid-template-areas` di playground yang melipat jadi satu kolom di ponsel.",
    teach: "Jelaskan kapan memakai Grid dan kapan flexbox beserta contoh UI nyata untuk masing-masing.",
    analogy: "Flexbox ibarat satu papan rak buku, sedangkan Grid ibarat kertas berpetak. Di kertas berpetak kamu menggambar garis kolom dan baris dulu, meletakkan kartu ke selnya, lalu semua sisi lurus sejajar atas-bawah maupun kiri-kanan.",
    pitfalls: [
      "Memilih `auto-fill` padahal butuh `auto-fit`: `auto-fill` menyisakan jalur kosong tak terlihat daripada meregangkan item yang sedikit memenuhi baris.",
      "Menulis `minmax(220px, 1fr)` tanpa `min()`, mengakibatkan scroll ke samping di layar sempit di bawah 220px.",
      "Menulis banyak aturan breakpoint jumlah kolom padahal `minmax()` sudah otomatis menyesuaikan.",
      "Kolom `1fr` jebol saat diisi tabel lebar atau URL panjang. Ganti jadi `minmax(0, 1fr)`."
    ],
    quiz: [
      ["Apa yang dihasilkan `grid-template-columns: 1fr 3fr`?", ["Dua kolom sama lebar", "Dua kolom yang berbagi ruang kosong 1:3", "Empat kolom", "Satu kolom berisi tiga baris"], "Satuan `fr` membagi ruang tersisa sebanding dengan angkanya."],
      ["Deklarasi mana yang menghasilkan grid responsif tanpa media query?", ["`repeat(3, 1fr)`", "`repeat(auto-fit, minmax(min(200px, 100%), 1fr))`", "`200px 200px 200px`", "`grid-auto-flow: column`"], "Browser memasukkan sebanyak mungkin kolom selebar minimal 200px lalu merentangkannya, sedangkan `min()` menyelamatkan layar yang lebih sempit."],
      ["Bagaimana membuat sebuah item grid membentang selebar penuh?", ["`width: 100vw`", "`grid-column: 1 / -1`", "`grid-column: span all`", "`justify-self: stretch`"], "Rentang garis 1 ke -1 melingkupi semua jalur kolom (`span all` bukan sintaks CSS valid)."]
    ]
  },
  responsive: {
    terms: [
      ['`@media` mobile-first', 'Mulai dari gaya satu kolom ponsel lalu tambahkan aturan `min-width` bertahap seiring layar melebar.'],
      ['Tipografi cair `clamp(min, pref, max)`', 'Menskalakan ukuran huruf mulus di antara dua batas viewport dalam satu baris tanpa lompatan breakpoint kaku.'],
      ['Container query (`@container`)', 'Membuat komponen beradaptasi terhadap lebar wadah induknya sendiri ketimbang lebar jendela browser penuh.']
    ],
    title: 'Responsive design',
    why: "Mayoritas pengunjung web membuka halaman dari ponsel. Desain yang hanya pas di monitor desainer otomatis berantakan di tangan sebagian besar pengguna.",
    points: [
      "Selalu pasang `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` supaya browser ponsel tidak mengecilkan tampilan desktop penuh.",
      "Rancang **mobile-first** dari tampilan satu kolom dulu, lalu tambahkan aturan layar lebar lewat `@media (min-width: …)` atau `@media (width >= 768px)`.",
      "Utamakan **ukuran intrinsik** (`flex-wrap`, grid `auto-fit`, `clamp()`, `max-width`), baru pasang breakpoint seperlunya tepat saat tata letak mulai sesak.",
      "Jaga gambar responsif memakai `max-width: 100%` dan `height: auto`, ditambah `width`/`height` atau `aspect-ratio` untuk mencegah layar melompat.",
      "**Container query** (`@container`) menyesuaikan komponen terhadap lebar wadah kartu induknya ketimbang ukuran layar penuh.",
      "Patuhi preferensi pengguna lewat `prefers-color-scheme`, `hover`, `pointer`, dan `prefers-reduced-motion`. Bungkus animasi di dalam `prefers-reduced-motion: no-preference`."
    ],
    practice: "Ambil halaman khusus desktop lalu ubah supaya bersih di lebar 360px tanpa scroll menyamping. Hitung jumlah media query yang terpakai, lalu coba buang satu dengan trik tata letak intrinsik.",
    teach: "Jelaskan konsep 'mobile-first' di CSS dan kenapa media query `min-width` lebih unggul daripada `max-width`.",
    analogy: "Mobile-first ibarat berkemas dalam tas kabin lebih dulu: muat yang pokok saja, lalu kalau tersedia koper besar baru tambahkan barang ekstra. Kebalikannya jauh lebih susah saat harus membuang barang dari koper penuh.",
    pitfalls: [
      "Lupa menyertakan meta tag viewport di HTML.",
      "Merancang pas cuma untuk tiga ukuran layar ponsel dan laptop, bukannya membiarkan konten menentukan breakpoint.",
      "Menyembunyikan konten penting di versi mobile daripada menata ulang urutannya.",
      "Memasang animasi ke mana-mana lalu menimpanya dengan `!important` untuk reduced-motion. Cukup aktifkan hanya saat diizinkan."
    ],
    quiz: [
      ["Di stylesheet mobile-first, style dasarnya menargetkan…", ["Layar desktop", "Layar kecil, dengan query `min-width` menambah layout untuk layar yang lebih besar", "Tablet, dengan query ke dua arah", "Cetak"], "Kamu memulai dari susunan bertumpuk paling ringan lalu menambah perbaikan ke ukuran lebih lebar."],
      ["Container query didasarkan pada apa?", ["Lebar viewport", "Ukuran container dari elemen itu", "Device pixel ratio", "Ukuran font user"], "Komponen merespons ruang yang ditempatinya sendiri di mana pun ia diletakkan."],
      ["Rule mana yang mencegah gambar meluber dari parent-nya?", ["`width: 100vw`", "`max-width: 100%; height: auto`", "`overflow: hidden` pada gambar", "`object-fit: contain`"], "Gambar mengecil mengikuti lebar wadah tanpa melampaui 100% dan rasio aslinya tetap terjaga."]
    ]
  },
  position: {
    terms: [
      ['`relative` vs `absolute`', '`position: absolute` berpatokan ke leluhur terdekat yang posisinya bukan `static` (umumnya `relative`).'],
      ['`position: sticky`', 'Mengalir normal sampai menyentuh batas `top`, lalu menempel. Akan gagal kalau ada leluhur memakai `overflow: hidden`.'],
      ['Stacking context', 'Lapisan lukis terpisah ciptaan `transform`, `opacity < 1`, atau `isolation: isolate` yang mengurung semua `z-index` di dalamnya.']
    ],
    title: 'Positioning dan stacking context',
    why: "Modal, dropdown, header sticky, hingga tooltip semuanya bertumpu pada positioning. Paham cara kerjanya langsung menjawab misteri klasik kenapa `z-index: 9999` masih kalah oleh elemen bertumpuk lain.",
    points: [
      "`position: static` mengikuti alur normal. `relative` menahan tempatnya di alur sembari mengizinkan geseran tipis serta jadi acuan bagi anak yang absolut.",
      "`absolute` mencabut elemen dari alur biasa lalu menempelkannya ke **ancestor ber-position terdekat**.",
      "`fixed` mengacu ke viewport, **kecuali** ada leluhur memakai `transform`, `filter`, atau `will-change: transform`. `sticky` ikut scroll sampai offset tercapai lalu menempel di dalam wadah scroll-nya.",
      "`z-index` hanya aktif di elemen ber-position maupun item flex/grid, dan cuma mengatur urutan **dalam stacking context yang sama**.",
      "Stacking context baru tercipta oleh elemen ber-position dengan `z-index`, `opacity` di bawah 1, `transform`, `filter`, dan `isolation: isolate`. Anak tak sanggup melompati batas context induknya.",
      "Overlay modern memakai `<dialog>` atau Popover API yang tampil di **top layer** teratas bebas jebakan `z-index`. Di React, portal memberi jalan keluar serupa."
    ],
    practice: "Buat ulang bug-nya: taruh elemen `position: fixed; inset: 0; z-index: 9999` di dalam parent ber-`transform`, di samping header sticky dengan `z-index: 10`. Jelaskan dua masalah yang timbul lalu bereskan dengan dua cara.",
    teach: "Jelaskan kenapa elemen `z-index: 9999` tetap bisa tertutup elemen `z-index: 2`.",
    analogy: "Bayangkan stacking context sebagai map bening bertumpuk berisi lembar transparan. Di dalam satu map kamu bebas mengurutkan lembar memakai `z-index`, tapi lembar di map bawah mustahil mendahului isi map di atasnya.",
    pitfalls: [
      "Menambah angka z-index setinggi-tingginya daripada mencari leluhur pembuat stacking context.",
      "Memasang `position: absolute` tanpa leluhur ber-position hingga elemen melesat ke pojok halaman.",
      "`position: sticky` mati gara-gara leluhurnya memasang `overflow: hidden`.",
      "`position: fixed` mendadak ikut terseret scroll sebab induknya ketambahan `transform` dari animasi."
    ],
    quiz: [
      ["Elemen yang diberi position absolut ditempatkan mengacu ke…", ["Viewport, selalu", "Ancestor terdekatnya yang di-position", "Elemen parent-nya, selalu", "`<body>`, selalu"], "Elemen ini mencari leluhur terdekat selain `static`, baru jatuh ke initial containing block kalau tak ketemu."],
      ["Mana yang membuat stacking context baru?", ["`color: red`", "`transform: translateX(0)`", "`margin: 0`", "`display: block`"], "Transform, opacity di bawah 1, filter, serta `isolation: isolate` sama-sama menciptakan stacking context baru."],
      ["Kenapa `z-index` bisa tidak berpengaruh pada sebuah elemen?", ["Angkanya melebihi batas yang diizinkan browser", "Elemennya tidak di-position, dan bukan item flex atau grid", "Parent-nya punya `overflow: hidden`", "Nilai negatif diabaikan"], "Properti `z-index` dilewati begitu saja di elemen `static` di luar flex atau grid."],
      ["Elemen `position: fixed` tiba-tiba ikut scroll bersama halaman. Penyebab yang paling mungkin?", ["`z-index`-nya tidak ada", "Ada ancestor yang sekarang punya `transform`, sehingga `fixed` relatif terhadapnya", "Halamannya memakai flexbox", "Meta tag viewport-nya tidak ada"], "Leluhur yang memiliki `transform` atau `filter` otomatis berubah jadi batas acuan bagi keturunan `fixed`."]
    ]
  },
  modern: {
    terms: [
      ['CSS custom property (`--bg`)', 'Variabel pewarisan langsung yang dihitung browser saat runtime. Mengubah `data-theme="dark"` ikut mewarnai ulang seluruh layar seketika.'],
      ['Selector induk `:has()`', 'Memberi gaya pada wadah parent berdasarkan kondisi elemen di dalamnya (`label:has(input:invalid)`) cukup dengan CSS murni.'],
      ['Kontrol cascade `@layer`', 'Mengurutkan stylesheet ke lapisan prioritas tegas supaya aturan library luar berhenti menabrak komponenmu.']
    ],
    title: 'Custom property, theming, dan CSS modern',
    why: "Design token, dark mode, serta varian komponen bertumpu pada custom property. CSS modern pun kini menanggung hampir semua fitur preprocessor lama, menjaga konfigurasi build tetap ringkas.",
    points: [
      "**Custom property** (`--brand: #3b47d6`) ikut mengalir dan diwariskan di runtime lewat `var(--brand, fallback)`. Tidak seperti variabel Sass, nilainya dapat diubah langsung di browser.",
      "Pasang **design token** di `:root` untuk warna, spasi, dan sudut lengkung. Berganti tema cukup dengan menukar isi variabel itu.",
      "Tombol dark mode manual perlu tiga jalur: ikut OS saat belum dipilih, lalu patuhi `data-theme=\"light\"` atau `data-theme=\"dark\"` sesudahnya. Jangan sampai media query menimpa pilihan light.",
      "`color-scheme: light dark` menyelaraskan checkbox dan scrollbar bawaan ke mode gelap, sedangkan `light-dark(#fff, #0e1117)` mengganti nilai warna sesuai mode.",
      "**Nesting** asli CSS (`.card { &:hover { … } }`), `:is()`, dan `:where()` meringkas selector berulang.",
      "`:has()` memberi style ke elemen induk melihat kondisinya di dalam, misalnya `.field:has(input:user-invalid)` menyorot wadah input yang salah tanpa JS.",
      "Transition menganimasikan perubahan gaya antar-state. Utamakan menganimasikan `transform` dan `opacity` supaya tetap ringan."
    ],
    practice: "Buat tombol ganti tema tiga mode (sistem, light, dark) yang mengatur `data-theme` di `<html>` lalu menyimpannya. Uji keenam kombinasi setelan OS dan pilihan pengguna, lalu tambah tema high-contrast cukup dengan mengubah token.",
    teach: "Jelaskan bagaimana custom property memungkinkan dark mode tanpa merombak gaya tiap komponen.",
    analogy: "Custom property itu nama cat di bagan dekorator seperti 'dinding' atau 'list'. Tiap instruksi ruangan cuma menyebut nama cat itu, jadi saat rumah berganti nuansa kamu tinggal mengganti tiga kaleng di bagan.",
    pitfalls: [
      "Menulis kode warna mentah berulang di banyak rule sehingga ganti palet tema berujung cari-ganti manual.",
      "Aturan media query dark mode yang memaksa tampil gelap biarpun user memilih mode terang.",
      "Lupa `color-scheme`, meninggalkan input dan scrollbar putih menyilaukan di latar gelap.",
      "Menganimasikan `width`, `height`, atau `top` hingga browser mengulang kalkulasi layout di setiap frame."
    ],
    quiz: [
      ["Apa bedanya custom property dengan variabel Sass?", ["Lebih cepat diketik", "Ada di browser, ikut cascade dan diwariskan, dan bisa berubah per elemen atau per media query", "Hanya bisa menyimpan warna", "Butuh build step"], "Variabel Sass lenyap saat build, sedangkan custom property tetap hidup dan reaktif di browser."],
      ["Apa yang dipilih oleh `.card:has(img)`?", ["Gambar di dalam card", "Card yang berisi gambar", "Card tanpa gambar", "Gambar pertama di setiap card"], "`:has()` membidik elemen berdasarkan keturunan yang ada di dalamnya."],
      ["Sistemnya gelap, user memilih light, dan halamannya tetap gelap. Penyebab yang paling mungkin?", ["Browser meng-cache CSS lama", "Rule `prefers-color-scheme: dark` tidak mengecualikan `[data-theme=\"light\"]`", "`color-scheme` tidak ada", "Custom property tidak bisa diubah setelah halaman dimuat"], "Aturan media query terus menimpa token gelap. Jaga dengan `:root:not([data-theme=\"light\"])`."],
      ["Property mana yang paling murah untuk dianimasikan?", ["`width` dan `height`", "`transform` dan `opacity`", "`margin` dan `padding`", "`top` dan `left`"], "Compositor GPU menanganinya langsung tanpa perlu menghitung ulang layout maupun paint."]
    ]
  },
  tailwind: {
    terms: [
      ['Class utilitas (`px-4`, `gap-3`)', 'Class kecil satu tujuan yang langsung memetakan design token, menggantikan file CSS `.card-wrapper` dadakan.'],
      ['Token `@theme`', 'Definisi design token berbasis CSS di Tailwind v4 yang langsung melahirkan class utilitas dari variabel CSS.'],
      ['Prefiks responsif / state (`md:`, `hover:`)', 'Pengubah bersyarat sebaris tepat pada elemen markup tempat kamu membaca kodenya.']
    ],
    title: 'Tailwind CSS: dasar utility-first',
    why: "Tailwind kini jadi andalan populer untuk mewarnai aplikasi React. Daripada mengarang nama class dan bolak-balik file stylesheet, kamu merangkai utilitas ringkas yang masing-masing adalah properti CSS murni.",
    points: [
      "Gaya **utility-first** merangkai class kecil bertugas tunggal (`p-4`, `flex`, `text-lg`, `bg-blue-600`) langsung di markup tanpa repot mengarang nama `.card-header`.",
      "Jarak spasi (`p-4` = 1rem per kelipatan 0.25rem), skala huruf `text-sm`–`text-4xl`, dan palet warna terjaga seragam dari satu **skala desain**. Di v4 semua angka spasi (`p-13`) langsung jalan.",
      "**Variant** menambah awalan syarat ke utilitas: `hover:`, `focus-visible:`, `disabled:`, `dark:`, beserta breakpoint `min-width` (`sm:` `md:` `lg:`).",
      "Utilitas layout memetakan CSS satu banding satu (`flex items-center justify-between gap-4`, `grid grid-cols-3`, `absolute inset-0`).",
      "Pakai nilai bebas (`w-[37rem]`, `bg-[#1da1f2]`) seperlunya saja agar tata letak tetap menempel ke skala standar.",
      "Tailwind memindai file kode dan menghasilkan **hanya class yang dipakai**, sehingga file CSS produksi kecil dibanding menimpa komponen kit bawaan."
    ],
    practice: "Buka CSS playground, nyalakan Tailwind, dan bangun ulang card-nya dari ingatan. Lalu terjemahkan lima class-nya kembali ke CSS biasa. Kalau bingung, buka lagi pelajaran CSS terkait.",
    teach: "Jelaskan konsep 'utility-first' beserta jawaban atas anggapan 'bukankah ini mirip inline style?'",
    analogy: "CSS klasik mirip memesan mebel kustom: beri nama, catat ukuran, lalu rakit terpisah. Tailwind memberi kotak balok ukuran seragam sehingga siapa pun di tim merakit bagian yang tetap nyambung tampilannya.",
    pitfalls: [
      "Menghafal nama utilitas Tailwind tanpa paham dasar CSS. Tiap class cuma singkatan deklarasi CSS, jadi debugging tetap butuh CSS.",
      "Merangkai nama class dinamis (`'text-' + color + '-500'`). Pemindai Tailwind butuh nama class utuh tertulis nyata di kode.",
      "Menganggapnya sama dengan inline style, padahal inline style tak mendukung `:hover`, fokus, dark mode, breakpoint, atau skala token.",
      "Menaruh aturan CSS sendiri di luar `@layer` di proyek Tailwind v4, membuatnya tak sengaja menimpa seluruh class utilitas."
    ],
    quiz: [
      ["Apa arti `md:grid-cols-2`?", ["Dua kolom hanya di layar sedang", "Dua kolom mulai dari breakpoint `md` ke atas", "Dua kolom di bawah `md`", "Kolom berukuran sedang"], "Prefiks breakpoint memakai query `min-width` mobile-first, berlaku dari `md` ke atas."],
      ["Kenapa CSS Tailwind tetap kecil di production?", ["Ia mengirim stylesheet tetap yang sudah di-minify", "Hanya class yang ditemukan di file source-mu yang dihasilkan", "Ia menghapus class yang tidak terpakai di browser saat runtime", "Ia memakai inline style"], "Tailwind memindai kode sumber lalu hanya merakit class utilitas yang benar-benar ditulis."],
      ["Kenapa `className={'bg-' + color + '-500'}` sering tidak berfungsi?", ["React melarang penyambungan string di `className`", "Tailwind tidak bisa melihat nama class lengkapnya di source, jadi class itu tidak pernah dihasilkan", "Warna harus berupa nilai hex", "Template string itu lambat"], "Pemindaian build mendeteksi kata utuh di file, jadi petakan nilai varian ke nama class lengkap."]
    ]
  },
  twreact: {
    terms: [
      ['Abstraksi komponen', 'Memakai ulang `<Button variant="danger">` di React daripada `@apply` CSS menjaga bundel kecil dan ber-type aman.'],
      ['Peta variant eksplisit', 'Memetakan key (`primary: "bg-indigo-600..."`) ketimbang menyambung string dinamis supaya pemindai Tailwind menemukan tiap class.'],
      ['`twMerge(...)`', 'Membuang class utilitas yang saling menimpa sehingga `twMerge("px-4", "px-8")` menyisakan `px-8` saja.']
    ],
    title: 'Tailwind di React: komponen, variant, dan theming',
    why: "Utilitas baru terasa rapi saat perulangannya dipecah ke tempat yang tepat. Di React, komponen menyimpan daftar class satu kali saja, dan varian ber-type membuat TypeScript langsung menegur gaya yang salah ketik.",
    points: [
      "Hindari duplikasi dengan mengekstrak **komponen React** ketimbang mengandalkan `@apply`. Cukup `<Button>` yang menyimpan class-nya.",
      "Di Vite, pasang `tailwindcss` dan `@tailwindcss/vite`, daftarkan plugin-nya, lalu muat `@import \"tailwindcss\";` di entri CSS.",
      "Perluas token lewat `@theme` di CSS: menulis `--color-brand-500` otomatis melahirkan `bg-brand-500`, `text-brand-500`, dan seterusnya.",
      "Gabungkan class lewat `clsx` plus `tailwind-merge` (`cn()`) supaya `className` dari pemanggil menang aman tanpa bentrok urutan.",
      "Bungkus varian seperti `size` atau `intent` sebagai union type lewat object peta atau helper `cva`.",
      "Pasang `type=\"button\"` sebagai bawaan komponen `<Button>` agar tombol di dalam form tak langsung men-submit tanpa sengaja.",
      "Warnai state tanpa JS (`group-hover:`, `peer-invalid:`, `aria-expanded:`), lalu pasang `@custom-variant` kalau `dark:` diatur lewat atribut HTML."
    ],
    practice: "Bangun `Button`, `Input`, dan `Card` dengan varian ber-type di proyek Vite + React + Tailwind. Tambah warna merek lewat `@theme` serta sakelar dark mode di `data-theme` pada `<html>`, lalu cek menekan `Button` dalam form tak men-submit.",
    teach: "Jelaskan alasan proyek React + Tailwind mengekstrak komponen ketimbang membuat class CSS berulang.",
    analogy: "Komponen itu stempel karet yang tintanya sudah terisi pas. Kamu tak lagi membagikan dua belas botol tinta ke tim sambil berharap campurannya sama, melainkan cukup memutar pengatur ukuran dan warna pada stempelnya.",
    pitfalls: [
      "Keseringan memakai `@apply` sampai akhirnya membangun ulang arsitektur stylesheet manual lagi.",
      "Menggabung string class mentah hingga `px-2 px-4` sama-sama masuk dan hasilnya bergantung urutan CSS, bukannya memakai `tailwind-merge`.",
      "Menerima nama varian berupa string bebas ketimbang union ber-type.",
      "Membuat `<Button>` tanpa bawaan `type=\"button\"` sehingga tiap klik di dalam form memicu submit."
    ],
    quiz: [
      ["Apa yang terjadi kalau `--color-brand-500` didefinisikan di dalam `@theme`?", ["Tidak ada, sampai kamu menulis CSS yang memakainya", "Menghasilkan utility seperti `bg-brand-500` dan `text-brand-500`", "Mengganti semua warna bawaan", "Membuat komponen React"], "Variabel tema berfungsi sebagai design token yang menentukan class utilitas keluaran Tailwind."],
      ["Masalah apa yang diselesaikan `tailwind-merge`?", ["Ukuran bundle", "Utility yang bertabrakan seperti `px-2 px-4`: ia menyimpan yang terakhir", "Dark mode yang tidak ada", "Build yang lambat"], "Utilitas ini menyelesaikan bentrokan sehingga `className` dari luar menimpa default dengan pasti."],
      ["Sebuah `<Button>` yang reusable ditaruh di dalam `<form>`. Mengkliknya men-submit form. Kenapa?", ["React men-submit form di setiap klik", "`type`-nya default ke `submit` kalau tidak diatur", "`tailwind-merge` menghapus type-nya", "Form-nya tidak punya `action`"], "Tombol HTML bawaannya berjenis `submit`, jadi komponen reusable mesti menetapkan `type=\"button\"`."],
      ["Cara terbaik memakai ulang sekumpulan utility di seluruh aplikasi React?", ["Copy-paste", "`@apply` di stylesheet global", "Ekstrak sebuah komponen", "Object `style` inline"], "Komponen menyatukan struktur HTML, aksesibilitas, perilaku, sekaligus daftar class utilitasnya."]
    ]
  },
  arch: {
    terms: [
      ['Token semantik vs primitif', 'Komponen memakai nama peran `--surface` atau `--accent` (semantik), bukan `--blue-500`, agar ganti tema aman tanpa ubah komponen.'],
      ['Pembatasan cakupan gaya (CSS Modules / Layers)', 'Mencegah aturan CSS antarhalaman saling tabrakan saat banyak engineer menyentuh stylesheet bersama.'],
      ['Skala spasi modular', 'Membatasi jarak margin dan padding ke tangga kelipatan tetap (`4, 8, 12, 16, 24, 32px`) bikin UI terlihat selaras otomatis.']
    ],
    title: 'Arsitektur CSS dan design system',
    why: "Karena semua rule CSS bawaannya global, kode gaya jauh lebih cepat berantakan dibanding logika lain seiring membesarnya tim. Memilih batas cakupan dengan sadar menjaga gaya tetap bersih dan tahan lama.",
    points: [
      "CSS tanpa batas berbagi satu **ruang nama global**, tempat perang specificity dan bentrokan urutan baris gampang terjadi.",
      "Pilihan pembatasnya meliputi aturan penamaan (**BEM** `.card__title--large`), **CSS Modules**, **utility-first** (Tailwind), CSS-in-JS, serta `@scope`.",
      "**Cascade layer** (`@layer reset, base, components, utilities;`) mengunci prioritas tetap: layer yang ditulis belakangan mengalahkan layer awal tanpa peduli skor specificity.",
      "Aturan **di luar `@layer` menang melawan seluruh layer**. Di Tailwind v4 yang meletakkan utilitas ke `@layer utilities`, CSS polos tanpa layer langsung menimpa utilitas Tailwind kecuali masuk ke sebuah layer juga.",
      "Susun **design system** dari token (warna, jarak, lengkung) → komponen dasar (`Button`, `Input`) → pola layar, berbekal alias semantik seperti `--color-danger`.",
      "Komponen reusable sebaiknya tak membawa margin luar sendiri. Biarkan wadah induk mengatur jarak lewat `gap` agar komponen cocok di segala tempat.",
      "Timbang plus-minus tiap cara. Utility cepat dan ringkas walau HTML ramai, CSS Modules terisolasi meski butuh ekstra file, dan runtime CSS-in-JS membebani Server Components."
    ],
    practice: "Audit salah satu stylesheet proyekmu: hitung jumlah `!important`, temukan selector terberat, dan catat semua warna mentah. Setelah itu susun proposal strategi token serta batas CSS untuk tim lima orang beserta alasan memilihnya.",
    teach: "Jelaskan cara cascade layer menyelesaikan prioritas gaya antara class utilitas dan rule komponen, termasuk bahaya CSS di luar layer.",
    analogy: "Tanpa cascade layer, prioritas CSS itu seperti lomba teriak: yang skornya paling kencang selalu menang sampai semua orang terus berteriak. Cascade layer menetapkan giliran bicara di rapat, sehingga giliran akhir selalu menang sepelan apa pun suaranya.",
    pitfalls: [
      "Mencampur tiga gaya styling dalam satu repo tanpa kesepakatan batas pemakaiannya.",
      "Menamai token menurut warna mentahnya (`--blue`) bukan perannya (`--color-action`), menyulitkan saat rebrand.",
      "Menempelkan margin luar di komponen hingga letaknya miring tiap dipakai di layar baru.",
      "Menulis CSS biasa di luar `@layer` pada proyek Tailwind v4 lalu tanpa sadar menimpa class utilitas."
    ],
    quiz: [
      ["Dengan `@layer components, utilities;` rule mana yang menang: `#app .btn` di `components` atau `.hidden` di `utilities`?", ["`#app .btn`: specificity-nya lebih tinggi", "`.hidden`: layer yang belakangan menang, berapa pun specificity-nya", "Yang posisinya lebih akhir di file", "Tidak ada"], "Urutan layer diperiksa duluan sebelum membandingkan skor specificity."],
      ["`.hidden { display: none }` berada di `@layer utilities`, sementara `.card { display: block }` di luar layer. Pada `<div class=\"card hidden\">`, mana yang menang?", ["`.hidden`: utilities adalah layer terakhir", "`.card`: style di luar layer mengalahkan semua layer", "Yang posisinya lebih akhir di file", "Tidak ada yang berlaku"], "Deklarasi di luar layer mengungguli seluruh isi layer. Itulah sebab CSS biasa bisa mengalahkan utilitas Tailwind v4."],
      ["Apa yang diberikan CSS Modules?", ["Theming saat runtime", "Nama class dengan cakupan lokal yang dibuat saat build", "Library class utility", "Dukungan `@scope` bawaan di browser lama"], "Nama class tiap file di-hash menjadi unik agar gaya antar-komponen tak pernah bertabrakan."],
      ["Kenapa komponen yang reusable sebaiknya tidak mengatur margin luarnya sendiri?", ["Margin lambat di-render", "Jarak bergantung pada konteks, jadi layout parent yang seharusnya mengaturnya", "Margin tidak berfungsi di dalam grid", "Merusak dark mode"], "Komponen yang membawa margin bawaan cuma pas di layar pertama tempat ia dirancang."]
    ]
  },
  render: {
    terms: [
      ['CLS (Cumulative Layout Shift)', 'Lompatan layar tiba-tiba gara-gara gambar atau font telat dimuat tanpa ukuran pasti. Kunci ukuran atau `aspect-ratio` sejak awal.'],
      ['Animasi compositor-only (`transform`, `opacity`)', 'Diproses langsung di GPU bebas hitung ulang layout atau paint, jauh lebih halus ketimbang animasi `width` atau `top`.'],
      ['`:focus-visible` & `prefers-reduced-motion`', 'Mempertahankan garis fokus keyboard yang tajam sekaligus meredam animasi berat bagi user yang sensitif terhadap gerak.']
    ],
    title: 'Rendering performance dan aksesibilitas',
    why: "CSS ikut menentukan seberapa cepat layar muncul dan seberapa nyaman dipakai semua orang. Mengerti alur render browser membantu menyingkirkan layar tersendat, lompatan layout, serta celah aksesibilitas.",
    points: [
      "Browser bekerja lewat urutan **Style → Layout → Paint → Composite**. Mengubah ukuran (`width`, `top`, `margin`) memicu ulang layout, mengubah warna memicu paint, sedangkan `transform` dan `opacity` langsung ke composite.",
      "**Layout thrashing** terjadi waktu loop bergantian menulis gaya lalu membaca `offsetHeight`, memaksa hitung layout sinkron terus-menerus. Kelompokkan pembacaan lebih dulu sebelum menulis gaya.",
      "CSS menghambat render awal (**render-blocking**). Jaga ukurannya ramping, inline CSS kritis bila perlu, dan jauhi rantai `@import`.",
      "Cegah **layout shift (CLS)** dengan menyiapkan dimensi `width`/`height` atau `aspect-ratio`, hindari menyisip banner di atas konten tampil, dan gunakan `font-display: swap`.",
      "`content-visibility: auto` dan `contain` memberi sinyal agar browser melewati hitung layout dan paint bagi bagian di luar layar.",
      "Pertahankan cincin fokus lewat `:focus-visible`, penuhi rasio kontras, dan jangan cuma pakai warna untuk membedakan status. Sembunyikan teks khusus pembaca layar memakai `.sr-only` ketimbang `display: none`.",
      "Kunci animasi di dalam `prefers-reduced-motion: no-preference`. Bila perlu meredam CSS pihak ketiga tanpa memutus event `transitionend`, ubah durasinya ke `0.01ms` bukan `none`."
    ],
    practice: "Rekam trace performa animasi `left` dibanding animasi `transform` lalu bedakan beban Layout dan Paint-nya. Setelah itu jelajahi salah satu halaman memakai tombol Tab penuh tanpa mouse lalu benahi titik fokus yang hilang.",
    teach: "Jelaskan alasan animasi `transform` terasa jauh lebih mulus dibanding `left` dari alur rendering pipeline.",
    analogy: "Me-render web mirip menyiapkan panggung sandiwara. Layout membangun rangka kayunya, paint mengecat papan panggung, dan composite menggeser panel jadi di atas rel. Menganimasikan `left` membongkar rangka tiap frame, sementara `transform` cuma menggeser panel jadi enam puluh kali sedetik.",
    pitfalls: [
      "Menulis `outline: none` tanpa pengganti hingga pengguna keyboard tersesat tak tahu di mana fokus berada.",
      "Memasang `will-change` ke semua elemen sehingga menguras memori GPU tanpa manfaat nyata.",
      "Memasang gambar atau iklan tanpa jatah ruang kosong hingga halaman melompat-lompat waktu dimuat.",
      "Menimpa `transition: none !important` yang mematahkan pendengar event `transitionend` di JavaScript."
    ],
    quiz: [
      ["Perubahan mana yang bisa ditangani compositor saja?", ["`width`", "`margin-top`", "`transform`", "`font-size`"], "Transform dan opacity dilewati tahap layout maupun paint selama berada di lapisan sendiri."],
      ["Apa yang paling langsung mengurangi layout shift dari gambar?", ["Lazy loading", "Menyiapkan ruang dengan dimensi atau `aspect-ratio`", "File yang lebih kecil", "Menyajikannya dari CDN"], "Begitu browser tahu ukurannya sejak awal, teks di bawah tak ikut terdorong waktu gambar selesai turun."],
      ["Bagaimana menyembunyikan konten dari layar tapi tetap terbaca oleh screen reader?", ["`display: none`", "`visibility: hidden`", "Pola visually-hidden (`.sr-only`)", "`aria-hidden=\"true\"`"], "`display: none`, `visibility: hidden`, dan `aria-hidden` sama-sama menyingkirkan teks tersebut dari pohon aksesibilitas."]
    ]
  }
}
};

export default trackId;
