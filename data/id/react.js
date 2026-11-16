// Bahasa Indonesia — track TypeScript + React. Contoh kode tetap memakai versi aslinya.
I18N.lessons('react', {
  js: {
    title: 'JavaScript esensial untuk TypeScript',
    why: "TypeScript adalah JavaScript plus type. Semua bug React yang membingungkan pemula — nilai basi, array yang ter-mutate, `this`, `undefined` — sebenarnya konsep JavaScript, bukan konsep React.",
    points: [
      "`const` tidak bisa di-assign ulang, `let` bisa. Jadikan `const` sebagai default. Jangan pernah pakai `var`.",
      "Function adalah value. Arrow function `(x) => x * 2` adalah bentuk yang dipakai sehari-hari.",
      "Object dan array adalah **reference**: `const b = a` berbagi array yang sama. Salin dengan spread: `[...a]`, `{ ...obj }`.",
      "Method array mengembalikan array **baru**: `map` mengubah, `filter` memilih, `find` mengambil satu, `reduce` melipat. Kode React disusun dari method-method ini.",
      "Destructuring membongkar isi: `const { name, age } = user;` dan `const [first, ...rest] = list;`.",
      "`===` membandingkan secara strict. `?.` dan `??` menangani `null`/`undefined` dengan aman. Truthy/falsy: `0`, `''`, `null`, `undefined`, `NaN` itu falsy."
    ],
    practice: "Di TypeScript playground: dari array berisi `{ name, price, inStock }`, hasilkan nama item yang in-stock dengan harga di bawah 100, diurutkan berdasarkan harga, tanpa me-mutate array aslinya. Lalu buktikan array aslinya tidak berubah.",
    teach: "Jelaskan kenapa `const b = a; b.push(1);` ikut mengubah `a`, dan bagaimana menghindarinya.",
    analogy: "`const` pada object itu anjing dengan tali yang terikat mati: talinya tidak bisa dipindah ke anjing lain, tapi anjingnya tetap bisa belepotan lumpur. Spread (`{ ...obj }`) itu fotokopi yang boleh kamu coret-coret tanpa menyentuh aslinya.",
    pitfalls: [
      "Mengira `const` membuat object jadi immutable. `const` hanya mengunci binding-nya.",
      "Memakai `push`, `sort`, atau `splice` pada state — semuanya me-mutate langsung di tempat.",
      "Tertukar antara `map` (mengembalikan array baru) dan `forEach` (tidak mengembalikan apa-apa)."
    ],
    quiz: [
      ["Apa yang dikembalikan `[1, 2, 3].map(n => n * 2)`?", ["`undefined`", "`[2, 4, 6]`", "Mengubah array aslinya", "`6`"], "`map` mengembalikan array baru berisi elemen hasil transformasi dan tidak menyentuh aslinya."],
      ["`const a = { n: 1 }; const b = a; b.n = 2;` Berapa nilai `a.n`?", ["1", "2", "undefined", "Error — `a` itu const"], "`a` dan `b` merujuk ke object yang sama; `const` hanya mencegah variabelnya di-assign ulang."],
      ["Berapa hasil `null ?? 'x'`?", ["`null`", "`'x'`", "`false`", "Error"], "`??` mengembalikan sisi kanan kalau sisi kirinya `null` atau `undefined`."]
    ]
  },
  ts: {
    title: 'TypeScript: type yang menangkap bug',
    why: "TypeScript memindahkan satu kelas bug dari 'user yang menemukannya' menjadi 'editor yang menggarisbawahinya'. Ia juga menjadi kontrak bersama antara frontend React dan backend C#.",
    points: [
      "Beri anotasi di titik data masuk: parameter, return type, response API. Sisanya biarkan inference yang mengurus.",
      "`interface` atau `type` mendeskripsikan bentuk sebuah object. TypeScript itu **structural**: kalau bentuknya cocok, ia diterima.",
      "**Union type** memodelkan 'salah satu dari': `string | number`, `'idle' | 'loading' | 'error'`.",
      "**Narrowing**: setelah `if (typeof x === 'string')` atau `if (user)`, TypeScript tahu type yang lebih spesifik di dalam blok itu.",
      "Property opsional `age?: number` berarti `number | undefined`. Dengan mode `strict` aktif, kamu wajib menangani `undefined`-nya.",
      "Hindari `any` — itu mematikan checker. Pakai `unknown` lalu lakukan narrowing. Type lenyap saat run time: ia tidak memvalidasi data dari network."
    ],
    practice: "Di playground, definisikan type `Todo` dan function `toggle(todos: Todo[], id: number): Todo[]` yang mengembalikan array baru. Lalu modelkan state sebuah request sebagai discriminated union dengan `idle`, `loading`, `success`, dan `error`, dan tulis function yang menangani keempatnya.",
    teach: "Jelaskan apa itu union type dan bagaimana TypeScript melakukan 'narrowing' di dalam sebuah `if`.",
    analogy: "Type itu mainan pencocok bentuk: balok persegi hanya masuk ke lubang persegi, dan kamu langsung tahu saat mencobanya, bukan setelah kotaknya dikirim. Union adalah lubang yang menerima persegi atau lingkaran — dan narrowing adalah mengecek mana yang sedang kamu pegang sebelum memakainya.",
    pitfalls: [
      "Lari ke `any` saat checker protes. Protesnya biasanya memang bug sungguhan.",
      "Mengira TypeScript memvalidasi data API saat run time. `as Product` itu janji, bukan pengecekan.",
      "Memberi anotasi berlebihan pada hal yang sudah disimpulkan compiler."
    ],
    quiz: [
      ["Apa yang diizinkan `type Size = 'S' | 'M' | 'L'`?", ["String apa saja", "Tepat salah satu dari tiga string itu", "Array berisi tiga string", "Angka dari 1 sampai 3"], "Itu union dari string literal type."],
      ["Type TypeScript saat run time itu…", ["ditegakkan oleh browser", "dihapus — hanya ada saat compile time", "diubah jadi class", "disimpan di JSON"], "Compiler membuang semua type; output-nya JavaScript biasa."],
      ["Alternatif `any` yang lebih aman untuk value yang bentuknya belum diketahui?", ["`object`", "`unknown`, lalu narrowing", "`never`", "`void`"], "`unknown` memaksamu mengecek type-nya dulu sebelum memakai value-nya."]
    ]
  },
  components: {
    title: 'React: komponen, JSX, dan props',
    why: "Seluruh ide React cukup satu kalimat: UI adalah function dari data. Begitu murid melihat komponen sebagai function yang mengembalikan deskripsi layar, sisanya tinggal mengikuti.",
    points: [
      "**Komponen** adalah function yang mengembalikan JSX. Namanya diawali huruf kapital.",
      "**JSX** adalah JavaScript yang tampilannya mirip HTML. Kurung kurawal `{ }` menyisipkan expression apa pun.",
      "**Props** adalah input sebuah komponen, dikirim seperti attribute. Props itu read-only — komponen tidak pernah mengubah props-nya.",
      "Render list dengan `map` dan beri tiap item `key` yang stabil dan unik.",
      "Conditional rendering memakai JavaScript biasa: `cond && <X />` atau `cond ? <A /> : <B />`.",
      "Susun komponen kecil menjadi komponen yang lebih besar; `children` membuat komponen bisa membungkus content apa saja."
    ],
    practice: "Buat project dengan `npm create vite@latest shop -- --template react-ts`. Bangun `ProductList` yang me-render beberapa `ProductCard` dari sebuah array, menampilkan pesan kalau array-nya kosong, dan menandai item yang harganya di atas 1000.",
    teach: "Jelaskan apa itu komponen React dan apa itu props, ke orang yang sudah paham HTML dan JavaScript dasar.",
    analogy: "Komponen itu stempel dengan bagian kosong: desainnya tetap, dan props mengisi bagian kosong itu setiap kali kamu mengecap. Halaman dibangun dengan mengecap stempel kecil di dalam stempel yang lebih besar. Stempel tidak mengubah tinta yang diberikan kepadanya — ia hanya memakainya.",
    pitfalls: [
      "Memakai index array sebagai `key` untuk list yang urutannya bisa berubah.",
      "Mencoba mengubah props di dalam child.",
      "Menampilkan `0` di layar gara-gara `items.length && <List />`. Pakai `items.length > 0 &&`."
    ],
    quiz: [
      ["Apa itu function component di React?", ["Class yang meng-extend HTMLElement", "Function yang menerima props dan mengembalikan JSX", "File CSS", "Template string HTML"], "Komponen adalah function biasa yang mendeskripsikan UI untuk props yang diberikan."],
      ["Kenapa tiap item list butuh `key`?", ["Untuk styling CSS", "Supaya React bisa mencocokkan item antar-render", "Untuk mengurutkan list", "TypeScript mewajibkannya"], "Key memberi elemen identitas yang stabil, sehingga React meng-update, memindah, atau menghapus elemen yang tepat."],
      ["Bolehkah komponen child mengubah props yang diterimanya?", ["Boleh, bebas", "Tidak — props itu read-only; ia meminta ke parent lewat callback", "Hanya angka", "Hanya saat development"], "Data mengalir ke bawah; perubahan diminta ke atas lewat function yang dikirim sebagai props."]
    ]
  },
  jsdeep: {
    title: 'JavaScript lebih dalam: closure, this, dan event loop',
    why: "Tiga ide ini menjelaskan hampir semua perilaku JavaScript yang 'aneh' — nilai basi di React hook, `this` yang hilang, dan kode yang jalan dengan urutan tak terduga. Ketiganya juga topik JavaScript yang paling sering ditanyakan saat interview.",
    points: [
      "**Closure** adalah function beserta variabel yang bisa dilihatnya saat ia dibuat. Variabel itu tetap hidup selama function-nya hidup. Semua React hook dan event handler bergantung pada hal ini.",
      "**Stale closure** adalah function yang masih melihat variabel lama — penyebab effect dan timer di React membaca state yang sudah usang.",
      "`this` ditentukan oleh **cara function dipanggil**, bukan tempat ia ditulis: `obj.method()` menjadikan `this` sebagai `obj`; pemanggilan yang terlepas dari object-nya kehilangan konteks itu. **Arrow function** tidak punya `this` sendiri dan memakai milik scope di sekitarnya.",
      "JavaScript berjalan di **satu thread** dengan sebuah **event loop**: jalankan kode synchronous yang sedang berjalan sampai tuntas, lalu habiskan **semua microtask** (callback promise, lanjutan `await`), lalu ambil **satu task** (timer, event, I/O), lalu ulangi.",
      "Jadi `.then` dari promise yang sudah resolved selalu jalan sebelum `setTimeout(…, 0)`, dan pekerjaan synchronous yang lama mem-block rendering dan input sepenuhnya.",
      "`Promise.all` menjalankan promise secara concurrent dan fail fast; `Promise.allSettled` menunggu semua hasil. Selalu tangani rejection — rejection yang tidak ditangani adalah bug yang diam-diam."
    ],
    practice: "Tebak urutan output contoh event loop, lalu telusuri visualisasinya untuk mengecek. Di TypeScript playground, tulis function `debounce(fn, ms)` memakai closure, dan jelaskan variabel mana yang dijaga tetap hidup oleh closure itu.",
    teach: "Jelaskan kenapa `Promise.resolve().then(...)` jalan sebelum `setTimeout(..., 0)` padahal dua-duanya 'asynchronous'.",
    analogy: "Closure itu ransel yang dibawa sebuah function: apa pun yang ada dalam jangkauannya saat ia dibuat ikut terbawa ke mana pun ia dipanggil. Event loop itu seorang koki dengan dua rel pesanan: setelah menyelesaikan masakan yang sedang dipegang, ia menghabiskan dulu seluruh rel 'urgent' (microtask) sebelum mengambil satu tiket saja dari rel biasa (task) — lalu mengecek rel urgent lagi.",
    pitfalls: [
      "Mengirim `obj.method` sebagai callback lalu kehilangan `this`. Pakai arrow function atau `bind`.",
      "Menganggap `setTimeout(fn, 0)` langsung jalan. Ia jalan setelah kode yang sedang berjalan dan semua microtask yang menunggu.",
      "Stale closure di effect atau interval React yang membaca state hasil capture di render pertama."
    ],
    quiz: [
      ["Mana yang di-log lebih dulu: callback `setTimeout(…, 0)` atau callback `.then` dari promise yang resolved, kalau dua-duanya dijadwalkan di kode synchronous yang sama?", ["Timeout", "Callback promise", "Yang ditulis lebih dulu", "Acak"], "Semua microtask dijalankan sebelum event loop mengambil task berikutnya."],
      ["Apa yang di-capture oleh closure?", ["Salinan nilai saat dibuat", "Variabelnya sendiri, yang tetap hidup bersama function-nya", "Hanya variabel global", "Tidak ada lagi setelah function luarnya return"], "Function-nya memegang reference yang hidup ke scope di sekitarnya."],
      ["`const f = user.hi; f();` gagal membaca `this.name` karena…", ["`hi` sudah dihapus", "`this` bergantung pada call site, dan `f()` tidak punya object di depan titik", "arrow function tidak bisa di-assign", "`name` itu private"], "Melepas method dari object-nya membuat receiver-nya hilang; di strict mode `this` jadi undefined."]
    ]
  },
  state: {
    title: 'State dan re-rendering',
    why: "State adalah jantung React sekaligus sumber kebingungan terbesar. 'Kenapa layarnya tidak update?' dan 'kenapa render-nya sering sekali?' dua-duanya berasal dari model render.",
    points: [
      "**State** adalah data yang diingat komponen di antara render: `const [count, setCount] = useState(0)`.",
      "Memanggil setter menjadwalkan **re-render**: React memanggil function-mu lagi dan meng-update DOM supaya cocok dengan JSX yang baru.",
      "Saat sebuah komponen re-render, **semua child-nya ikut re-render** secara default — terlepas dari props-nya berubah atau tidak.",
      "State adalah **snapshot**: di dalam satu render, `count` tidak pernah berubah. Pakai bentuk updater `setCount(c => c + 1)` kalau nilai berikutnya bergantung pada nilai sebelumnya.",
      "**Jangan pernah me-mutate state.** Buat array atau object baru supaya React melihat reference yang baru: `setItems([...items, x])`.",
      "Jangan menyimpan apa yang bisa dihitung. Turunkan nilai (total, list hasil filter) saat render."
    ],
    practice: "Bangun komponen todo. Lalu rusak dengan sengaja: ganti isi `add` dengan `todos.push(...)` disusul `setTodos(todos)`. Amati bahwa tidak ada yang ter-update, dan jelaskan alasannya dari sisi reference.",
    teach: "Jelaskan langkah demi langkah apa yang terjadi sejak tombol yang memanggil `setCount(count + 1)` diklik sampai layar menampilkan angka baru.",
    analogy: "Setiap render adalah foto komponen pada satu momen. `count` di dalam foto itu beku. Memanggil `setCount` tidak mengedit fotonya — ia meminta React memotret yang baru. Me-mutate state itu mencoret foto lama dengan spidol: React membandingkan dua cetakan, melihat lembar kertasnya sama, lalu tidak mengubah apa-apa.",
    pitfalls: [
      "Memanggil `setCount(count + 1)` tiga kali dan berharap +3. Ketiganya membaca snapshot yang sama.",
      "Me-mutate array atau object yang ada di state.",
      "Menduplikasi data turunan di state lalu membiarkannya tidak sinkron."
    ],
    quiz: [
      ["`count` bernilai 0. Sebuah handler menjalankan `setCount(count + 1); setCount(count + 1);`. Berapa `count` di render berikutnya?", ["0", "1", "2", "Melempar error"], "Kedua pemanggilan menghitung 0 + 1 dari snapshot yang sama. Pakai `setCount(c => c + 1)` supaya jadi 2."],
      ["State milik parent berubah. Komponen mana yang re-render secara default?", ["Hanya parent", "Parent dan semua descendant-nya", "Seluruh aplikasi", "Tidak ada sampai props berubah"], "Re-render sebuah komponen ikut me-re-render subtree-nya, kecuali ada yang melewatinya seperti `memo`."],
      ["Kenapa `items.push(x); setItems(items);` tidak meng-update UI?", ["`push` itu async", "Reference array-nya tidak berubah, jadi React tidak melihat state baru", "`setItems` butuh `await`", "Array tidak bisa jadi state"], "React membandingkan berdasarkan reference; object array yang sama berarti 'tidak ada yang berubah'."]
    ]
  },
  effects: {
    title: 'Effect dan data fetching',
    why: "`useEffect` adalah hook yang paling sering disalahgunakan di React. Mengajarkan untuk apa ia dipakai — sinkronisasi dengan sesuatu di luar React — dan untuk apa ia tidak dipakai mencegah infinite loop, race, dan separuh bug di aplikasi sungguhan.",
    points: [
      "Rendering harus **pure**: props dan state yang sama masuk, JSX yang sama keluar, tanpa side effect.",
      "`useEffect` jalan **setelah** render untuk sinkronisasi dengan dunia luar: network, timer, subscription, DOM.",
      "**Dependency array** menentukan kapan effect dijalankan ulang: `[]` sekali setelah mount, `[id]` setiap kali `id` berubah, tidak ditulis = setelah setiap render.",
      "Kembalikan **cleanup function** untuk membatalkan effect-nya: unsubscribe, clear timer, abort request.",
      "Fetching di dalam effect butuh tiga state (loading, error, data) dan perlindungan dari **race condition** — abort atau abaikan response yang sudah basi.",
      "Sering kali kamu **tidak butuh effect**: nilai turunan tempatnya di render, dan respons terhadap aksi user tempatnya di event handler."
    ],
    practice: "Bangun komponennya dengan API ASP.NET Core milikmu. Klik cepat berpindah-pindah product dengan network di-throttle; buang cleanup-nya dan lihat product yang salah muncul. Kembalikan cleanup-nya dan jelaskan race yang terjadi.",
    teach: "Jelaskan apa fungsi dependency array pada `useEffect` dan untuk apa cleanup function-nya.",
    analogy: "Effect itu instruksi tetap untuk kru panggung: 'setiap kali adegan berganti ke adegan N, siapkan properti untuk N — dan sebelum adegan berikutnya, bereskan yang lama.' Dependency array adalah daftar hal yang dianggap sebagai pergantian adegan.",
    pitfalls: [
      "Melewatkan sebuah dependency sehingga membaca nilai basi; atau men-set state yang juga merupakan dependency sehingga loop selamanya.",
      "Memakai effect untuk menghitung sesuatu dari props atau state — hitung saja saat render.",
      "Tanpa cleanup: response yang datang tidak berurutan menimpa data yang lebih baru."
    ],
    quiz: [
      ["`useEffect(() => { … }, [])` dijalankan…", ["Di setiap render", "Sekali setelah render pertama (mount)", "Tidak pernah", "Sebelum render pertama"], "Dependency array kosong berarti tidak ada yang bisa berubah untuk memicu effect jalan ulang."],
      ["Untuk apa function yang dikembalikan dari sebuah effect?", ["Mengembalikan data", "Cleanup sebelum effect berikutnya jalan dan saat unmount", "Error handling", "Memoization"], "Ia membatalkan effect-nya: unsubscribe, clear timer, abort request."],
      ["Kamu butuh `fullName` dari props `first` dan `last`. Pendekatan terbaik?", ["`useEffect` yang men-set state", "Hitung saat render: `const fullName = first + ' ' + last`", "Variabel global", "`useRef`"], "Nilai turunan tidak butuh effect maupun state — state tambahan berarti render tambahan dan bug tambahan."]
    ]
  },
  forms: {
    title: 'Form, lifting state, dan composition',
    why: "Interface sungguhan isinya form dan list yang berbagi data. Tahu di mana state seharusnya tinggal — dan bagaimana sibling berkomunikasi — adalah pembeda antara aplikasi yang rapi dan props yang kusut seperti spageti.",
    points: [
      "**Controlled input** mengambil `value`-nya dari state dan melaporkan perubahan lewat `onChange`: state adalah single source of truth.",
      "Ketika dua komponen butuh data yang sama, **lift state-nya** ke common parent terdekat lalu kirim ke bawah.",
      "Child mengubah state milik parent dengan memanggil **callback** yang dikirim sebagai props: data ke bawah, event ke atas.",
      "Jaga state **se-lokal mungkin** dan lift hanya kalau memang perlu dibagi.",
      "Tangani submit dengan `onSubmit` pada `<form>` dan `event.preventDefault()`. Tampilkan error validasi di samping field-nya.",
      "Untuk form besar, pakai library (React Hook Form) dengan schema validator (Zod) supaya aturan yang sama memvalidasi sekaligus memberi type pada datanya."
    ],
    practice: "Tambahkan komponen search box dan komponen list sebagai sibling. Tentukan di mana state teks pencariannya harus tinggal, sambungkan, dan tulis satu kalimat yang membenarkan lokasinya.",
    teach: "Jelaskan 'lifting state up' dengan dua komponen sibling yang perlu menampilkan data yang sama.",
    analogy: "Dua anak berbagi satu kotak krayon. Kalau masing-masing menyimpan kotak sendiri, gambar mereka tidak akan pernah serasi. Serahkan kotaknya ke orang tua, yang membagikan krayon ke bawah dan menerima permintaan — 'boleh minta biru?' — dari bawah. Satu kotak, satu kebenaran.",
    pitfalls: [
      "Menyalin props ke state lalu bingung kenapa tidak ikut ter-update.",
      "Me-lift semuanya ke paling atas 'buat jaga-jaga', sehingga seluruh aplikasi ikut re-render.",
      "Mencampur uncontrolled dan controlled input, sehingga muncul warning 'changing an uncontrolled input'."
    ],
    quiz: [
      ["Dua komponen sibling harus menampilkan nilai yang sama. Di mana state-nya sebaiknya tinggal?", ["Di kedua sibling", "Di common parent terdekat mereka", "Di variabel global", "Di `localStorage`"], "Satu pemilik mengirim nilainya ke bawah ke keduanya; mereka otomatis tetap sinkron."],
      ["Bagaimana child meng-update state milik parent-nya?", ["Me-mutate props-nya", "Memanggil callback function yang dikirim sebagai props", "Memakai `document.querySelector`", "Tidak bisa"], "Parent mengirim sebuah function; child memanggilnya — event mengalir ke atas."],
      ["Input yang 'controlled' adalah input yang…", ["value-nya dikendalikan oleh React state", "value-nya hanya tinggal di DOM", "type-nya `password`", "perubahannya dinonaktifkan"], "State adalah source of truth; `onChange` meng-update state dan state men-set `value`."]
    ]
  },
  generics: {
    title: 'Generics dan utility type di TypeScript',
    why: "Generics adalah cara menulis satu function, hook, atau komponen reusable yang tetap ber-type penuh. Utility type adalah cara menurunkan type alih-alih menduplikasinya — dan menjaga frontend tetap selaras dengan API.",
    points: [
      "**Generic** adalah type parameter: `function first<T>(items: T[]): T | undefined`. Type dari pemanggil ikut mengalir.",
      "Batasi dengan `extends`: `<T extends { id: number }>` berarti 'type apa pun yang punya id'.",
      "`keyof T` adalah union dari nama-nama property milik T; `T[K]` adalah type dari property K.",
      "Utility type menurunkan bentuk baru: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `ReturnType<F>`.",
      "Komponen generic: `function List<T>({ items, render }: ListProps<T>)` bekerja untuk type item apa pun.",
      "Turunkan, jangan duplikasi: `type CreateProduct = Omit<Product, 'id'>` tidak mungkin melenceng dari `Product`."
    ],
    practice: "Di playground, tulis `groupBy<T, K extends keyof T>(items: T[], key: K)` yang mengembalikan `Map<T[K], T[]>`. Lalu tulis signature hook generic `useLocalStorage<T>(key, initial)` dan sebutkan apa `T`-nya di dua call site yang berbeda.",
    teach: "Jelaskan arti `<T>` pada `function first<T>(items: T[]): T` dan kenapa itu lebih baik daripada memakai `any`.",
    analogy: "Generic itu amplop berlabel: 'apa pun yang masuk ke sini, keluarnya sama'. `any` itu amplop tanpa label — kamu memasukkan cek, penerimanya bisa saja memperlakukannya sebagai daftar belanja. `Pick` dan `Omit` itu cetakan kue yang dipakai pada type yang sudah ada, bukan memanggang yang baru dari nol.",
    pitfalls: [
      "Menambah generic yang hanya dipakai sekali — type parameter seharusnya menghubungkan dua hal.",
      "Menulis tangan type yang nyaris sama alih-alih menurunkannya.",
      "Mengira `getJson<Product[]>` mengecek response-nya. Itu assertion tanpa pengecekan; validasi di boundary kalau memang penting."
    ],
    quiz: [
      ["Apa itu `Omit<Product, 'id'>`?", ["Product yang hanya punya `id`", "Product tanpa property `id`", "Array of product", "Function runtime"], "`Omit` membuat type dengan key yang disebutkan dibuang."],
      ["Pada `<T, K extends keyof T>`, `K` boleh berupa apa?", ["String apa saja", "Hanya nama property milik `T`", "Type apa saja", "Angka"], "`keyof T` adalah union dari key milik T, dan K harus assignable ke situ."],
      ["Apa yang dilakukan `Partial<T>`?", ["Membuat semua property jadi opsional", "Membuat semua property jadi wajib", "Membuang semua property", "Membuat T jadi readonly"], "Tiap property mendapat `?` — praktis untuk payload patch/update."]
    ]
  },
  hooks: {
    title: 'Custom hook, context, dan reducer',
    why: "Seiring aplikasi membesar, logic harus bisa dibagi tanpa copy-paste dan data harus bisa sampai ke komponen yang dalam tanpa mengoper props lewat sepuluh lapis. Tiga tool inilah jawaban React.",
    points: [
      "**Custom hook** adalah function bernama `useX` yang memanggil hook lain. Ia membagi **logic**, bukan state — tiap pemanggil mendapat state-nya sendiri.",
      "Rules of hooks: panggil di top level sebuah komponen atau hook, jangan pernah di dalam kondisi atau loop, supaya urutan pemanggilannya identik di setiap render.",
      "**Context** mengantarkan sebuah value ke descendant mana pun tanpa prop drilling. Cocok untuk value global yang jarang berubah: theme, user saat ini, locale.",
      "Setiap consumer ikut re-render saat value context berubah. Pecah context dan memoize value-nya; context bukan state manager.",
      "`useReducer` memusatkan transisi state yang rumit: `(state, action) => newState`. Action yang dimodelkan sebagai discriminated union membuat transisi tidak valid jadi compile error.",
      "`useRef` menyimpan value mutable yang **tidak** memicu re-render — DOM node, timer, nilai sebelumnya."
    ],
    practice: "Ekstrak logic fetching product-mu menjadi `useProducts(search)` dengan pencarian yang di-debounce. Tambahkan cart memakai reducer dan context di atas, dan tampilkan jumlah item di komponen header yang tidak menerima props apa pun.",
    teach: "Jelaskan kenapa dua komponen yang memanggil custom hook yang sama tidak berbagi state.",
    analogy: "Custom hook itu resep, bukan masakannya: dua orang yang mengikuti resep yang sama masing-masing mendapat piringnya sendiri. Context itu pengeras suara gedung — semua orang mendengar pengumumannya tanpa ada kurir yang mengetuk tiap pintu, dan justru karena itu kamu tidak memakainya untuk percakapan yang berubah tiap detik.",
    pitfalls: [
      "Berharap custom hook berfungsi sebagai shared store.",
      "Menaruh state yang cepat berubah di satu context besar dan me-re-render seluruh tree.",
      "Memanggil hook di dalam `if`, sehingga urutan pemanggilannya rusak."
    ],
    quiz: [
      ["Dua komponen sama-sama memanggil `useCounter()`. Mereka…", ["berbagi satu counter", "masing-masing mendapat state yang independen", "melempar error", "berbagi sampai salah satunya unmount"], "Hook membagi logic; state-nya milik instance komponen yang memanggilnya."],
      ["Kenapa hook tidak boleh dipanggil di dalam kondisi?", ["Soal performance", "React mengenali hook dari urutan pemanggilan, yang harus sama di setiap render", "TypeScript melarangnya", "Nanti jalan dua kali"], "State disimpan berdasarkan posisi dalam urutan pemanggilan; melewatkan satu pemanggilan menggeser semua hook sesudahnya."],
      ["Mengubah `.current` milik sebuah `useRef`…", ["me-re-render komponen", "tidak memicu re-render", "melempar error", "me-reset state"], "Ref adalah kotak mutable di luar siklus render."]
    ]
  },
  perf: {
    title: 'Rendering performance',
    why: "React sudah cepat secara default, dan kebanyakan 'optimasi' hanya membuat kode lebih lambat dibaca tanpa membuatnya lebih cepat dijalankan. Developer level mahir mengukur dulu, lalu menerapkan perbaikan yang tepat ke komponen yang tepat.",
    points: [
      "**Render** adalah React memanggil function-mu; **commit** adalah React menyentuh DOM. Render biasanya murah; render yang tidak perlu baru jadi masalah kalau lambat atau jumlahnya banyak.",
      "**Ukur dulu** dengan Profiler di React DevTools: cari komponen mana yang render, kenapa, dan berapa lama.",
      "Perbaikan termurah bersifat struktural: pindahkan state **ke bawah**, ke komponen yang membutuhkannya; kirim subtree yang mahal sebagai `children` supaya tidak ikut re-render.",
      "`memo(Component)` melewati re-render kalau props-nya shallow equal. Ia gagal diam-diam kalau kamu mengirim object, array, atau function baru di setiap render.",
      "`useMemo` meng-cache nilai hasil hitungan; `useCallback` meng-cache identitas function — terutama berguna untuk menjaga props tetap stabil bagi child yang di-memo.",
      "**React Compiler** otomatis melakukan memoization kalau diaktifkan. Untuk list panjang, lakukan **virtualization** (render hanya baris yang terlihat). Pecah bundle dengan `lazy` dan `Suspense`."
    ],
    practice: "Render 5.000 baris dengan sebuah search box. Rekam sesi mengetik di Profiler. Terapkan perbaikan satu per satu — `memo`, callback yang stabil, lalu virtualization — dan catat berapa komponen yang render per ketukan tombol setelah tiap perbaikan.",
    teach: "Jelaskan kenapa membungkus komponen dengan `memo` kadang tidak berpengaruh sama sekali.",
    analogy: "`memo` itu penjaga pintu yang bertanya 'ada yang berubah dari kirimanmu sejak terakhir kali?' Kalau kamu menyerahkan kardus yang benar-benar baru setiap kali — walaupun isinya identik — ia terpaksa menjawab ya. `useCallback` dan `useMemo` adalah cara menyerahkan kardus yang sama.",
    pitfalls: [
      "Membungkus semuanya dengan `useMemo`/`useCallback` tanpa mengukur.",
      "`memo` yang dikalahkan oleh props inline `{}` / `[]` / `() => {}`.",
      "Mengoptimasi render padahal biaya sebenarnya ada di bundle 2 MB atau API yang lambat."
    ],
    quiz: [
      ["Child yang di-memo menerima `onClick={() => select(id)}` dari parent-nya. Apakah `memo` melewati re-render?", ["Ya", "Tidak — function baru dibuat di tiap render, jadi props-nya berbeda", "Hanya di production", "Hanya untuk child pertama"], "Shallow comparison melihat reference function yang berbeda setiap kali."],
      ["Langkah pertama ketika sebuah layar React terasa lambat?", ["Tambahkan `useMemo` di mana-mana", "Profile untuk melihat apa yang render dan berapa lama", "Tulis ulang dengan framework lain", "Buang TypeScript"], "Tanpa pengukuran, kamu tidak bisa tahu komponen atau operasi mana yang jadi biayanya."],
      ["Perbaikan terbaik untuk list 20.000 baris?", ["`memo` di tiap baris", "Virtualization: render hanya baris yang terlihat", "`useCallback`", "Key yang lebih besar"], "Tidak membuat 20.000 DOM node lebih efektif daripada membuat re-render-nya lebih murah."]
    ]
  },
  server: {
    title: 'Server state, routing, dan komunikasi dengan API-mu',
    why: "Di sinilah keempat track bertemu: layar React memanggil endpoint ASP.NET Core yang menjalankan SQL. Membereskan caching, error, auth, dan type di titik inilah yang menjadikan seseorang full-stack developer.",
    points: [
      "**Server state** (data milik backend) berbeda dengan **client state** (state UI). Ia asynchronous, dipakai bersama, dan bisa basi.",
      "Library server state (TanStack Query) memberi caching, deduplication, background refetch, retry, dan state loading/error — menggantikan fetching dengan `useEffect` yang ditulis tangan.",
      "**Query** membaca dan di-cache berdasarkan sebuah key; **mutation** menulis lalu **meng-invalidate** query yang terdampak supaya di-fetch ulang.",
      "**Router** (React Router atau TanStack Router) memetakan URL ke komponen. Taruh state yang layak dibagikan — halaman, filter, id terpilih — di URL.",
      "Bagikan kontraknya: generate type TypeScript atau client dari dokumen **OpenAPI** milik API, jangan mengetik ulang DTO secara manual.",
      "Auth untuk SPA: utamakan cookie yang secure, `HttpOnly`, `SameSite` (backend-for-frontend) daripada token di `localStorage`. Konfigurasikan CORS untuk origin yang persis."
    ],
    practice: "Hubungkan aplikasi React-mu dengan API ASP.NET Core memakai TanStack Query: list, create, delete. Tampilkan error validasi dari server (ProblemDetails) di samping field yang tepat. Generate type TypeScript dari dokumen OpenAPI milik API dan hapus salinan yang kamu tulis tangan.",
    teach: "Jelaskan perbedaan server state dan client state, dan apa yang dilakukan 'meng-invalidate sebuah query'.",
    analogy: "Server state itu buku perpustakaan: kamu memegang satu salinan, tapi kebenarannya milik perpustakaan dan bisa saja sudah diperbarui orang lain. Query cache itu rak berisi salinan pinjamanmu, masing-masing dicap dengan tanggal 'cek lagi setelah'. Invalidate itu mengatakan 'saya baru saja menyerahkan koreksi — tolong ambilkan edisi terbarunya'.",
    pitfalls: [
      "Menyalin data hasil fetch ke `useState` lalu memelihara kebenaran kedua yang basi.",
      "Menyimpan access token di `localStorage`, yang bisa dibaca script sisipan apa pun.",
      "Memelihara manual salinan TypeScript dari DTO C# sampai keduanya melenceng."
    ],
    quiz: [
      ["Setelah mutation 'create product' berhasil, bagaimana daftar product ter-update?", ["Tidak akan pernah", "Invalidate query daftarnya supaya di-fetch ulang", "Reload halaman", "Mutate array di cache dengan `push`"], "Invalidation menandai data di cache sebagai basi dan memicu refetch dari source of truth."],
      ["Mana yang tempatnya di URL, bukan di state komponen?", ["Dropdown sedang terbuka atau tidak", "Nomor halaman dan filter sebuah list saat ini", "Input yang baru setengah diketik", "State hover"], "State tampilan yang layak dibagikan dan di-bookmark harus selamat dari reload dan bisa dijadikan link."],
      ["Cara paling andal menjaga type TypeScript tetap sinkron dengan API C#?", ["Salin manual", "Generate dari dokumen OpenAPI milik API", "Pakai `any`", "Tulis di komentar"], "Type hasil generate ikut berubah saat API berubah dan menggagalkan build kalau frontend-nya ketinggalan."]
    ]
  },
  tsadv: {
    title: 'Type tingkat lanjut: conditional, mapped, dan inferred',
    why: "Type system TypeScript adalah sebuah bahasa pemrograman kecil. Seorang expert memakainya supaya kode yang salah mustahil ditulis — dan tahu kapan type yang cerdik lebih mahal daripada manfaatnya.",
    points: [
      "**Conditional type** memilih sebuah type: `T extends U ? X : Y`. Pada union, ia **terdistribusi** — diterapkan ke tiap anggota.",
      "`infer` menangkap sebagian dari sebuah type di dalam kondisi: `T extends Promise<infer R> ? R : T`.",
      "**Mapped type** mengubah setiap property: `{ [K in keyof T]: … }`, dengan modifier `readonly`/`?` dan key remapping lewat `as`.",
      "**Template literal type** menyusun type berbentuk string: misalnya type nama event yang diturunkan dari nama property.",
      "`never` adalah type kosong. Meng-assign ke `never` di cabang `default` memberi **exhaustiveness checking** — menambah anggota union membuat build gagal sampai ditangani.",
      "`satisfies` mengecek sebuah value terhadap type **tanpa melebarkannya**. `as const` membekukan literal. Utamakan keduanya daripada cast `as`."
    ],
    practice: "Tulis `DeepReadonly<T>` dan `PathParams<'/users/:id/posts/:postId'>` yang menghasilkan `{ id: string; postId: string }`. Lalu tulis satu paragraf: apakah kamu akan menerima `PathParams` di codebase tim, dan apa yang bisa mengubah pendapatmu.",
    teach: "Jelaskan bagaimana meng-assign ke variabel ber-type `never` di case `default` membuat compiler menangkap anggota union yang terlupa.",
    analogy: "Type biasa itu label di kotak. Type tingkat lanjut itu mesin pencetak label: masukkan satu type, keluar type lain yang berkaitan. `never` itu lubang yang tidak bisa dilewati apa pun — kalau masih ada yang tersisa untuk dijatuhkan ke situ, compiler baru saja menemukan case yang belum kamu tangani.",
    pitfalls: [
      "Akrobat type yang tidak bisa dipelihara siapa pun di tim. Readability lebih penting daripada kecerdikan.",
      "Cast `as` yang membungkam error padahal type system-nya yang benar.",
      "Lupa bahwa conditional type terdistribusi pada union, sehingga hasilnya mengejutkan."
    ],
    quiz: [
      ["Apa hasil `T extends Promise<infer R> ? R : T` untuk `T = Promise<string>`?", ["`Promise<string>`", "`string`", "`never`", "`unknown`"], "`infer R` menangkap type hasil resolve promise itu."],
      ["Apa yang dilakukan `satisfies` yang tidak dilakukan type annotation?", ["Berjalan saat run time", "Mengecek kecocokan sambil mempertahankan inferred type milik value yang lebih sempit", "Membuat value jadi mutable", "Mematikan pengecekan"], "Annotation melebarkan ke type yang dianotasikan; `satisfies` memvalidasi sekaligus mempertahankan literal."],
      ["Anggota baru ditambahkan ke union yang ditangani `switch` dengan `const x: never = value` di `default`. Hasilnya?", ["Bug runtime yang diam-diam", "Compile error sampai case baru itu ditangani", "Tidak ada apa-apa", "Infinite loop"], "Anggota yang belum ditangani tidak assignable ke `never`, jadi build gagal tepat di tempat yang seharusnya."]
    ]
  },
  internals: {
    title: 'Internal React: reconciliation dan concurrency',
    why: "Tahu bagaimana React memutuskan apa yang diubah, dan kapan, mengubah perilaku misterius — state hilang, effect dobel, tearing, jank — menjadi konsekuensi yang bisa diprediksi dari segelintir aturan.",
    points: [
      "Rendering menghasilkan tree berisi **element** (object biasa). **Reconciliation** membandingkannya dengan tree sebelumnya untuk mencari perubahan DOM seminimal mungkin.",
      "Dua heuristik: **element type** yang berbeda di posisi yang sama mengganti seluruh subtree; **key** mengenali children saat urutannya berubah. State terikat pada posisi + type + key.",
      "Mengubah `key` sebuah komponen secara sengaja **me-reset state-nya** — teknik yang berguna, dan kecelakaan yang sering terjadi.",
      "**Fiber** adalah unit kerja React, yang membuat rendering bisa dijeda, dilanjutkan, dan diprioritaskan. **Render phase** bisa diinterupsi dan harus pure; **commit phase** itu synchronous.",
      "**Fitur concurrent**: `useTransition` dan `useDeferredValue` menandai update sebagai tidak mendesak supaya mengetik tetap responsif; `Suspense` mendeklarasikan loading boundary.",
      "Strict Mode menjalankan render dan effect dua kali saat development untuk membongkar kode yang tidak pure. Server Component di-render di server dan tidak mengirim JavaScript untuk dirinya sendiri — model eksekusi yang berbeda dari client component."
    ],
    practice: "Bangun komponen tab yang secara kondisional me-render `<Counter />` di dua cabang pada posisi yang sama, dan amati state-nya tetap bertahan saat berpindah tab. Lalu beri masing-masing `key` yang berbeda dan jelaskan perubahannya dari sisi reconciliation.",
    teach: "Jelaskan kenapa mengubah `key` sebuah komponen me-reset state-nya.",
    analogy: "Reconciliation itu petugas bioskop yang membandingkan denah kursi malam ini dengan semalam. Kursi sama, jenis tamu sama: biarkan dan perbarui tiketnya. Jenis tamu berbeda di kursi itu: kosongkan kursinya sepenuhnya. `key` itu name tag — dengan name tag, petugas bisa mengikuti tamu yang pindah kursi alih-alih menganggapnya orang asing.",
    pitfalls: [
      "Mendefinisikan komponen di dalam komponen lain — type baru di setiap render, jadi state-nya terus ter-reset.",
      "Side effect di render phase, yang bisa jalan lebih dari sekali.",
      "Menganggap double invocation di Strict Mode sebagai bug yang harus dimatikan."
    ],
    quiz: [
      ["Di posisi yang sama, sebuah `<div>` diganti `<section>` dengan children yang identik. React akan…", ["meng-update tag-nya di tempat", "menghancurkan subtree lama dan membangun yang baru, sehingga state child hilang", "mengabaikan perubahannya", "melempar error"], "Element type yang berbeda berarti tree yang berbeda; React tidak mencoba memakainya ulang."],
      ["Apa yang bisa kamu lakukan dengan `useTransition`?", ["Menganimasikan CSS", "Menandai sebuah state update sebagai tidak mendesak supaya update yang mendesak bisa menyelanya", "Fetch data", "Melewati rendering"], "Transition menjaga UI tetap responsif selama render yang mahal."],
      ["Kenapa Strict Mode menjalankan effect dua kali saat development?", ["Bug yang sudah diketahui", "Untuk membongkar effect yang tidak punya cleanup yang benar", "Demi performance", "Untuk memanaskan cache"], "Mount → unmount → mount mensimulasikan remount; effect yang benar tidak terpengaruh."]
    ]
  },
  arch: {
    title: 'Arsitektur frontend, testing, dan accessibility',
    why: "Frontend level expert adalah frontend yang bisa diubah tim dengan aman selama bertahun-tahun dan bisa dioperasikan semua user. Itu soal struktur, test yang selamat dari refactoring, dan accessibility sebagai requirement, bukan fitur tambahan.",
    points: [
      "Klasifikasikan state sebelum memilih tool: **server state** (query library), **URL state** (router), **local UI state** (`useState`), **shared client state** (context, atau store seperti Zustand kalau sering berubah).",
      "Susun berdasarkan **fitur** (`features/cart/…`), bukan berdasarkan jenis file; pisahkan UI primitive yang dipakai bersama. Tegakkan boundary dengan lint rule.",
      "Tes **behavior lewat UI** dengan React Testing Library: cari element berdasarkan role dan label, bertindak seperti user, assert pada apa yang mereka lihat. Mock network-nya (MSW), bukan komponenmu.",
      "Beberapa test **end-to-end** (Playwright) mencakup jalur kritis melintasi frontend, API, dan database yang sungguhan.",
      "**Accessibility**: HTML semantik dulu, setiap input berlabel, bisa dioperasikan penuh lewat keyboard, focus yang terlihat, kontras yang cukup, pengumuman untuk perubahan async. Tes dengan keyboard dan screen reader.",
      "Performance budget: pantau Core Web Vitals (LCP, INP, CLS), pecah kode per route, optimasi gambar, dan gagalkan CI kalau bundle membesar melewati budget."
    ],
    practice: "Tulis test ini untuk halaman products milikmu, lalu refactor bagian dalam halamannya — rename komponen, ganti state management — tanpa menyentuh test-nya. Kalau test-nya rusak, berarti ia mengetes implementasi. Terakhir, operasikan seluruh halaman hanya dengan keyboard dan perbaiki apa yang kamu temukan.",
    teach: "Jelaskan kenapa test yang mencari element berdasarkan role dan label lebih berharga daripada test yang memeriksa bagian dalam komponen.",
    analogy: "Test UI yang bagus itu mystery shopper: ia masuk, memakai toko seperti pelanggan biasa, dan melaporkan apa yang dialaminya. Ia tidak peduli bagaimana gudangnya ditata — jadi kamu bebas menata ulang gudang. Dan toko yang accessible punya ramp yang dibangun sejak awal, bukan papan yang baru dikeluarkan kalau diminta.",
    pitfalls: [
      "Global store untuk semuanya, termasuk data server dan input form.",
      "Snapshot test dan test atas internal state yang rusak di setiap refactor dan tidak menangkap bug apa pun.",
      "`div` dengan `onClick` alih-alih `button`: tidak terjangkau keyboard dan tidak terlihat oleh assistive technology."
    ],
    quiz: [
      ["Di mana data hasil fetch dari API seharusnya ditaruh?", ["Global Redux store, selalu", "Cache server state seperti TanStack Query", "`localStorage`", "Ref komponen"], "Server state butuh caching, staleness, dan invalidation — itu tugas query library."],
      ["Kenapa query dengan `getByRole('button', { name: 'Add' })` dan bukan dengan class CSS?", ["Lebih cepat", "Mengetes apa yang ditangkap user dan assistive tech, dan selamat dari refactoring", "Class sudah deprecated", "Tidak perlu rendering"], "Role dan name adalah kontrak publik sebuah UI; nama class adalah detail implementasi."],
      ["Langkah pertama terpenting untuk accessibility?", ["Tambahkan ARIA ke setiap element", "Pakai element HTML semantik dengan label yang benar", "Perbesar ukuran font", "Tambahkan dark theme"], "Element native membawa dukungan keyboard dan semantik secara gratis; ARIA untuk menutup celah, bukan pengganti."]
    ]
  }
}, { tagline: 'Frontend-nya: JavaScript modern, type system, komponen, state, dan arsitektur.' });
