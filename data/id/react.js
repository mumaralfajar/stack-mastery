// Bahasa Indonesia — track TypeScript + React. Contoh kode tetap memakai versi aslinya.
I18N.lessons('react', {
  js: {
    terms: [
      ['`const` vs `let`', '`const` mencegah pengikatan ulang nama variabel (pilihan default); isi object tetap disalin secara immutable (`{ ...x }`).'],
      ['`===` vs `==`', '`===` membandingkan nilai dan type secara ketat tanpa konversi tersembunyi (`0 == ""` adalah jebakan klasik `==`).'],
      ['Array `.map()` / `.filter()`', 'Menghasilkan array baru yang ditransformasi atau disaring tanpa memutasi daftar asli — dasar update React.']
    ],
    title: 'Dasar JavaScript untuk TypeScript',
    why: "TypeScript adalah JavaScript plus type. Kebanyakan bug React yang membingungkan pemula — value yang basi, array yang termutasi, `undefined` — adalah masalah JavaScript, bukan masalah React.",
    points: [
      "`const` tidak bisa di-assign ulang, `let` bisa. Pakai `const` sebagai default, dan jangan pakai `var`.",
      "Function adalah value. Arrow function `(x) => x * 2` adalah bentuk yang dipakai sehari-hari.",
      "Object dan array adalah **reference**: `const b = a` memakai array yang sama. Salin dengan spread: `[...a]`, `{ ...obj }`.",
      "`map`, `filter`, dan `reduce` mengembalikan value **baru** dan tidak mengubah array-nya. `sort`, `reverse`, dan `splice` mengubahnya di tempat; versi yang menyalin adalah `toSorted`, `toReversed`, dan `toSpliced`.",
      "Destructuring membongkar isi: `const { name, age } = user;` dan `const [first, ...rest] = list;`.",
      "`===` membandingkan secara ketat. `?.` berhenti di `null`/`undefined`, dan `??` memberi fallback hanya untuk `null`/`undefined`. `||` memberi fallback untuk value falsy apa pun: `0`, `''`, `null`, `undefined`, `NaN`, `false`."
    ],
    practice: "Di TypeScript playground: dari sebuah array `{ name, price, inStock }`, hasilkan nama item yang tersedia dengan harga di bawah 100, diurutkan berdasarkan harga, tanpa mengubah array aslinya. Pakai `toSorted`, lalu log array aslinya untuk membuktikan bahwa ia tidak berubah.",
    teach: "Jelaskan kenapa `const b = a; b.push(1);` juga mengubah `a`, dan cara menghindarinya.",
    analogy: "`const` pada object itu seperti anjing dengan tali yang terikat mati: talinya tidak bisa dipindah ke anjing lain, tapi anjingnya tetap bisa kotor kena lumpur.",
    pitfalls: [
      "Mengira `const` membuat object jadi immutable. Ia hanya mengunci object mana yang ditunjuk oleh nama itu.",
      "Memanggil `sort` atau `splice` pada state; keduanya mengubah array di tempat. Pakai `toSorted` dan `toSpliced`.",
      "Menulis `count || 10` padahal `0` adalah jumlah yang valid. Pakai `??`.",
      "Tertukar antara `map` (mengembalikan array baru) dan `forEach` (tidak mengembalikan apa-apa)."
    ],
    quiz: [
      ["Apa yang dikembalikan `[1, 2, 3].map(n => n * 2)`?", ["`undefined`", "`[2, 4, 6]`, dan array aslinya juga jadi `[2, 4, 6]`", "`[2, 4, 6]`, tanpa mengubah array aslinya", "`6`"], "`map` mengembalikan array baru berisi elemen yang sudah diubah dan tidak menyentuh array aslinya."],
      ["`const a = { n: 1 }; const b = a; b.n = 2;` Berapa `a.n`?", ["1", "2", "undefined", "Error: `a` itu const"], "`a` dan `b` menunjuk object yang sama; `const` hanya mencegah variabelnya di-assign ulang."],
      ["Berapa hasil `0 ?? 10`?", ["`0`", "`10`", "`null`", "`false`"], "`??` hanya mengganti `null` dan `undefined`. `0 || 10` akan menghasilkan `10`, karena `0` itu falsy."]
    ]
  },
  ts: {
    terms: [
      ['Discriminated union', 'Gabungan bentuk object dengan tag literal (`{ ok: true; data: T } | { ok: false; error: string }`) yang menyempit otomatis di blok `if`.'],
      ['Type narrowing', 'Compiler melacak alur kontrol (`typeof x === "string"`, `in`, `switch`) untuk mengetahui sub-type persisnya di tiap cabang.'],
      ['`unknown` vs `any`', '`unknown` mewajibkanmu mengecek bentuk data saat runtime sebelum membaca properti; `any` mematikan pemeriksa type sepenuhnya.']
    ],
    title: 'TypeScript: type yang menangkap bug',
    why: "TypeScript memindahkan satu kelompok bug dari 'ditemukan user' menjadi 'digarisbawahi editor'. Ia juga menjadi kontrak antara frontend React-mu dan backend C#-mu.",
    points: [
      "Beri anotasi di tempat data masuk: parameter, return type, response API. Biarkan inference mengurus sisanya.",
      "`interface` atau `type` menggambarkan bentuk sebuah object. TypeScript itu **struktural**: kalau bentuknya cocok, ia diterima.",
      "**Union type** memodelkan 'salah satu dari': `string | number`, `'idle' | 'loading' | 'error'`.",
      "**Narrowing**: setelah `if (typeof x === 'string')` atau `if (user)`, TypeScript tahu type yang lebih spesifik di dalam blok itu.",
      "Property opsional `age?: number` berarti `number | undefined`. Dengan `strict` aktif, seperti di template Vite, kamu wajib menangani `undefined`-nya.",
      "Hindari `any`: ia mematikan pengecekan. Pakai `unknown` lalu lakukan narrowing. Type hilang saat runtime, jadi type tidak mengecek data yang datang dari network."
    ],
    practice: "Di playground, definisikan type `Todo` dan function `toggle(todos: Todo[], id: string): Todo[]` yang mengembalikan array baru. Lalu modelkan state sebuah request sebagai discriminated union berisi `idle`, `loading`, `success`, dan `error`, dan tulis function yang menangani keempatnya.",
    teach: "Jelaskan apa itu union type dan bagaimana TypeScript melakukan 'narrowing' di dalam `if`.",
    analogy: "Type itu seperti mainan pencocok bentuk: balok persegi hanya masuk ke lubang persegi, dan kamu langsung tahu saat mencobanya, bukan setelah kotaknya dikirim. Union adalah lubang yang menerima persegi atau lingkaran, dan narrowing adalah mengecek mana yang sedang kamu pegang sebelum memakainya.",
    pitfalls: [
      "Langsung memakai `any` saat checker protes. Protesnya biasanya menunjuk bug sungguhan.",
      "Mengira TypeScript mengecek data API saat runtime. `as Product` adalah janji yang kamu buat, bukan pengecekan.",
      "Memberi anotasi pada hal yang sudah bisa disimpulkan compiler."
    ],
    quiz: [
      ["Apa yang diizinkan oleh `type Size = 'S' | 'M' | 'L'`?", ["String apa pun", "Tepat salah satu dari ketiga string itu", "Array berisi ketiga string itu", "String apa pun yang diawali S, M, atau L"], "Itu adalah union dari string literal type."],
      ["Type TypeScript saat runtime itu…", ["dicek oleh engine JavaScript", "dihapus: hanya ada saat compile time", "diubah menjadi class", "disimpan sebagai komentar di output"], "Compiler menghapus semua type; outputnya JavaScript biasa."],
      ["Alternatif yang lebih aman daripada `any` untuk value yang bentuknya tidak diketahui?", ["`object`", "`unknown`, lalu narrowing", "`never`", "`{}`"], "`unknown` memaksamu mengecek type-nya sebelum memakai value itu."]
    ]
  },
  components: {
    terms: [
      ['Ekspresi JSX', 'Sintaks ekspresi JavaScript (`<Card price={p.price} />`) yang dikompilasi menjadi pemanggilan fungsi `jsx(...)` — bukan parser template terpisah.'],
      ['Props (satu arah ke bawah)', 'Input read-only dari parent ke child; perubahan di child tidak pernah memutasi props parent secara langsung.'],
      ['Prop `key` yang stabil', 'Membuat React mengenali item berdasarkan ID database saat diurutkan atau ditambah — memakai indeks array sering memicu bug state saat urutan bergeser.']
    ],
    title: 'React: komponen, JSX, dan props',
    why: "Ide utama React muat dalam satu kalimat: UI adalah function dari data. Begitu kamu melihat komponen sebagai function yang mengembalikan deskripsi layar, sisanya tinggal mengikuti. Track ini memakai React 19, versi yang di-install project Vite baru.",
    points: [
      "**Komponen** adalah function yang mengembalikan JSX. Namanya diawali huruf kapital.",
      "**JSX** adalah JavaScript yang terlihat seperti HTML. Kurung kurawal `{ }` menyisipkan ekspresi apa pun.",
      "**Props** adalah input sebuah komponen, dikirim seperti atribut. Props itu read-only: komponen tidak pernah mengubah props-nya sendiri.",
      "Render list dengan `map` dan beri setiap item `key` yang stabil dan unik.",
      "Conditional rendering memakai JavaScript biasa: `cond && <X />` atau `cond ? <A /> : <B />`.",
      "Susun komponen-komponen kecil menjadi yang lebih besar; `children` membuat komponen bisa membungkus konten apa pun."
    ],
    practice: "Buat project dengan `npm create vite@latest shop -- --template react-ts`. Bangun `ProductList` yang me-render `ProductCard` dari sebuah array, menampilkan pesan saat array-nya kosong, dan menyorot item di atas 1000.",
    teach: "Jelaskan apa itu komponen React dan apa itu props, kepada orang yang paham HTML dan JavaScript dasar.",
    analogy: "Komponen itu seperti stempel karet dengan bagian kosong: desainnya tetap, dan props mengisi bagian kosong itu setiap kali kamu menstempel. Halaman dibangun dengan menstempel stempel-stempel kecil di dalam stempel yang lebih besar.",
    pitfalls: [
      "Memakai index array sebagai `key` untuk list yang urutannya bisa berubah.",
      "Mencoba mengubah props dari dalam child.",
      "Muncul angka `0` nyasar karena `items.length && <List />`. Pakai `items.length > 0 &&`."
    ],
    quiz: [
      ["Apa itu function component React?", ["Class yang meng-extend `HTMLElement`", "Function yang menerima props dan mengembalikan JSX", "Template string berisi HTML", "Deskripsi halaman dalam JSON"], "Komponen adalah function biasa yang menggambarkan UI untuk props yang diberikan."],
      ["Kenapa setiap item list butuh `key`?", ["Untuk styling CSS", "Supaya React bisa mencocokkan item antar render", "Untuk mengurutkan list", "Supaya React bisa melewati render list-nya"], "Key memberi elemen identitas yang stabil, sehingga React meng-update, memindahkan, atau menghapus elemen yang tepat."],
      ["Bisakah child component mengubah props yang diterimanya?", ["Bisa, bebas", "Tidak: props itu read-only; ia meminta ke parent lewat callback", "Hanya kalau prop-nya object", "Bisa, tapi hanya dengan `useState`"], "Data mengalir ke bawah; perubahan diminta ke atas lewat function yang dikirim sebagai props."]
    ]
  },
  jsdeep: {
    terms: [
      ['Lexical closure', 'Fungsi yang membawa serta variabel dari lingkup tempatnya dibuat — menjelaskan bagaimana hook React mengingat state antar render.'],
      ['Microtask queue (`Promise.then`)', 'Dikosongkan tuntas segera setelah call stack kosong dan *sebelum* browser menjalankan timer `setTimeout` atau menggambar frame berikutnya.'],
      ['Kesetaraan Nilai vs Referensi (`===`)', 'Dua object dengan isi sama `{ a: 1 } === { a: 1 }` bernilai `false` kecuali keduanya menunjuk satu object memori yang sama.']
    ],
    predict: {
      prompt: 'Dengan urutan apa konsol mencetak ini? `console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);`',
      options: ['`1, 2, 3, 4`', '`1, 4, 3, 2` (microtask diselesaikan sebelum timer)', '`1, 4, 2, 3` (timer berjalan lebih dulu dari promise)'],
      explain: 'Panggilan sinkron (`1`, `4`) berjalan lebih dulu di call stack, lalu seluruh antrean microtask dikuras (`3`), dan barulah antrean macrotask (`setTimeout` `2`) dieksekusi.'
    },
    title: 'JavaScript lebih dalam: closure, this, dan event loop',
    why: "Ketiga ide ini menjelaskan kebanyakan perilaku JavaScript yang 'aneh': value basi di hook React, `this` yang hilang, dan kode yang berjalan dengan urutan tak terduga.",
    points: [
      "**Closure** adalah function beserta variabel-variabel yang bisa dilihatnya saat ia dibuat. Variabel itu tetap hidup selama function-nya hidup. Setiap hook dan event handler React bergantung pada ini.",
      "**Stale closure** adalah function yang masih melihat variabel lama: penyebab effect dan timer React yang membaca state usang.",
      "`this` ditentukan oleh **cara function dipanggil**, bukan tempat ia ditulis: `obj.method()` membuat `this` menjadi `obj`; pemanggilan yang dilepas kehilangan itu. **Arrow function** tidak punya `this` sendiri dan memakai milik kode di sekitarnya.",
      "JavaScript berjalan di **satu thread** dengan **event loop**: selesaikan kode synchronous yang sedang jalan, lalu jalankan **semua microtask** (callback promise, kode setelah `await`), lalu ambil **satu task** (timer, event, response network), dan ulangi. Browser bisa menggambar ulang layar di antara task, tidak pernah di tengah-tengahnya.",
      "Jadi `.then` dari promise yang sudah resolve selalu jalan sebelum `setTimeout(…, 0)`, dan pekerjaan synchronous yang panjang memblokir rendering dan input sepenuhnya.",
      "`Promise.all` menunggu beberapa promise yang sudah berjalan, dan langsung reject begitu salah satunya gagal; `Promise.allSettled` menunggu semua hasilnya. Selalu tangani rejection: rejection yang tidak ditangani adalah bug yang diam-diam."
    ],
    practice: "Tebak urutan output contoh event loop, lalu jalankan visualisasinya langkah demi langkah untuk mengecek. Di TypeScript playground, tulis function `debounce(fn, ms)` memakai closure, dan jelaskan variabel mana yang dijaga tetap hidup oleh closure itu.",
    teach: "Jelaskan kenapa `Promise.resolve().then(...)` jalan sebelum `setTimeout(..., 0)` padahal keduanya sama-sama 'asynchronous'.",
    analogy: "Event loop itu seperti seorang koki dengan dua rel pesanan. Setelah menyelesaikan masakan di tangannya, ia menghabiskan seluruh rel 'mendesak' (microtask) sebelum mengambil hanya satu tiket dari rel biasa (task), lalu mengecek rel mendesak lagi.",
    pitfalls: [
      "Mengirim `obj.method` sebagai callback lalu kehilangan `this`. Pakai arrow function atau `bind`.",
      "Mengira `setTimeout(fn, 0)` langsung jalan. Ia jalan setelah kode saat ini dan semua microtask yang tertunda.",
      "Stale closure di effect atau interval React yang membaca state yang ditangkap saat render pertama.",
      "Loop `while` yang butuh 300 ms: halaman tidak bisa menggambar ulang atau merespons klik sampai loop-nya selesai."
    ],
    quiz: [
      ["Mana yang di-log lebih dulu: callback `setTimeout(…, 0)` atau callback `.then` dari promise yang sudah resolve, keduanya dijadwalkan di kode synchronous yang sama?", ["Timeout-nya", "Callback promise-nya", "Yang ditulis lebih dulu", "Tergantung browser-nya"], "Semua microtask dijalankan sebelum event loop mengambil task berikutnya."],
      ["Apa yang ditangkap oleh closure?", ["Salinan value saat closure dibuat", "Variabelnya itu sendiri, yang tetap hidup bersama function-nya", "Hanya variabel global", "Tidak ada apa-apa setelah function luarnya selesai"], "Function itu menyimpan reference yang hidup ke scope di sekitarnya."],
      ["`const f = user.hi; f();` gagal membaca `this.name` karena…", ["`hi` sudah dihapus", "`this` bergantung pada cara pemanggilan, dan `f()` tidak punya object di depan titik", "`hi` adalah arrow function", "`name` itu private"], "Melepas method membuatnya kehilangan receiver; di strict mode, `this` bernilai `undefined`."]
    ]
  },
  state: {
    terms: [
      ['Snapshot render', 'State (`count`) bersifat tetap sepanjang satu giliran render; `setCount(c => c + 1)` membaca antrean state terbaru dengan aman.'],
      ['Update state immutable', 'Membuat array/object baru (`setItems([...items, x])`) agar `Object.is(prev, next)` melihat referensi berubah lalu memicu re-render.'],
      ['Derived state', 'Menghitung total terfilter langsung saat render alih-alih menyalin nilai ke `useState` tambahan yang rawan tidak sinkron.']
    ],
    title: 'State dan re-rendering',
    why: "State adalah cara komponen mengingat sesuatu, dan cara React tahu bahwa layar harus berubah. 'Kenapa layarnya tidak ter-update?' dan 'kenapa render-nya sering sekali?' sama-sama berasal dari cara kerja ini.",
    points: [
      "**State** adalah data yang diingat komponen di antara render: `const [count, setCount] = useState(0)`.",
      "Memanggil setter menjadwalkan **re-render**: React memanggil function-mu lagi dan meng-update DOM agar sesuai dengan JSX yang baru.",
      "Saat sebuah komponen re-render, **semua child-nya ikut re-render** secara default, entah props-nya berubah atau tidak.",
      "State adalah **snapshot**: di dalam satu render, `count` tidak pernah berubah. Pakai bentuk updater `setCount(c => c + 1)` kalau value berikutnya bergantung pada value sebelumnya.",
      "**Jangan pernah memutasi state.** Buat array atau object baru supaya React melihat reference baru: `setItems([...items, x])`.",
      "Jangan simpan sesuatu yang bisa dihitung. Hitung total dan list yang difilter saat render."
    ],
    practice: "Bangun komponen todo-nya. Lalu rusak dengan sengaja: ganti isi `add` dengan `todos.push(...)` diikuti `setTodos(todos)`. Lihat bahwa tidak ada yang ter-update, lalu jelaskan kenapa dari sisi reference.",
    teach: "Jelaskan langkah demi langkah apa yang terjadi di antara mengklik tombol yang memanggil `setCount(count + 1)` dan layar menampilkan angka baru.",
    analogy: "Setiap render adalah foto komponen pada satu momen, dan `count` di dalam foto itu membeku. Memanggil `setCount` tidak mengedit fotonya; ia meminta React mengambil foto baru. Memutasi state sama dengan mencoret foto lama dengan spidol: React membandingkan kedua cetakan, melihat lembar kertas yang sama, dan tidak mengubah apa-apa.",
    pitfalls: [
      "Memanggil `setCount(count + 1)` tiga kali dan berharap bertambah 3. Ketiganya membaca snapshot yang sama.",
      "Memutasi array atau object di dalam state.",
      "Menyimpan juga data turunan di state, lalu membiarkannya tidak sinkron.",
      "Id dari `Date.now()`, yang bisa kembar kalau dua item ditambahkan di milidetik yang sama. Pakai `crypto.randomUUID()`."
    ],
    quiz: [
      ["`count` bernilai 0. Sebuah handler menjalankan `setCount(count + 1); setCount(count + 1);`. Berapa `count` di render berikutnya?", ["0", "1", "2", "Melempar error"], "Kedua pemanggilan menghitung 0 + 1 dari snapshot yang sama. Pakai `setCount(c => c + 1)` untuk mendapat 2."],
      ["State sebuah parent berubah. Komponen mana yang re-render secara default?", ["Hanya parent-nya", "Parent beserta semua turunannya", "Seluruh aplikasi", "Hanya child yang props-nya berubah"], "Me-render ulang sebuah komponen ikut me-render ulang subtree-nya, kecuali ada yang melewatinya seperti `memo` atau React Compiler."],
      ["Kenapa `items.push(x); setItems(items);` tidak meng-update UI?", ["`push` tidak mengubah array-nya", "Reference array-nya tidak berubah, jadi React tidak melihat state baru", "`setItems` harus di-await", "React hanya melacak object, bukan array"], "React membandingkan berdasarkan reference; object array yang sama berarti 'tidak ada yang berubah'."]
    ]
  },
  effects: {
    terms: [
      ['Array dependensi (`[userId]`)', 'Semua nilai reaktif yang dibaca di dalam `useEffect` harus dicantumkan di sini supaya React menjalankan ulang effect saat input berubah.'],
      ['Fungsi cleanup (`return () => ...`)', 'Berjalan sebelum effect berikutnya dan saat unmount — wajib untuk `AbortController`, timer, dan mengabaikan respons async usang.'],
      ['Sinkronisasi, bukan handler event', '`useEffect` menyinkronkan React dengan sistem luar (jaringan, WebSocket, DOM API); aksi simpan saat klik tombol cukup di event handler.']
    ],
    predict: {
      prompt: 'Pengguna berpindah cepat dari `userId = 1` (request lambat 700 ms) ke `userId = 2` (cepat 100 ms) di `useEffect` polos tanpa cleanup. Apa yang tampil di layar pada t = 700 ms?',
      options: ['User #2 tetap tampil rapi', 'User #1 menimpa User #2 (race condition)', 'React otomatis membatalkan `fetch` tanpa perlu `AbortController`'],
      explain: 'React tidak otomatis membatalkan promise `fetch()`. Saat request #1 selesai belakangan pada 700 ms tanpa cleanup pengecek abort/ignore, `setState` usangnya menimpa layar User #2.'
    },
    title: 'Effect dan data fetching',
    why: "`useEffect` membuat lebih banyak orang bingung daripada hook lain mana pun. Memahami untuk apa ia dipakai (menjaga agar tetap selaras dengan sesuatu di luar React) dan untuk apa ia tidak dipakai mencegah infinite loop, race, dan banyak bug yang susah dilacak.",
    points: [
      "Rendering harus **pure**: props dan state yang sama menghasilkan JSX yang sama, tanpa side effect.",
      "`useEffect` jalan **setelah** render untuk menjaga agar tetap selaras dengan dunia luar: network, timer, subscription, DOM.",
      "**Dependency array** menentukan kapan effect dijalankan ulang: `[]` sekali setelah mount, `[id]` setiap kali `id` berubah, tanpa array sama sekali setelah setiap render.",
      "Kembalikan **cleanup function** untuk membatalkan effect-nya: unsubscribe, hapus timer, batalkan request.",
      "Fetching di dalam effect butuh tiga state (loading, error, data) dan perlindungan dari **race condition**: batalkan atau abaikan response yang sudah basi. Di aplikasi sungguhan, library data yang mengerjakannya untukmu; materi server state memakai TanStack Query.",
      "Sering kali kamu **tidak butuh effect**: value turunan tempatnya di render, dan respons terhadap aksi user tempatnya di event handler."
    ],
    practice: "Bangun komponennya dengan memakai API ASP.NET Core-mu. Dengan network yang diperlambat di dev tools, klik cepat bergantian antar produk; hapus cleanup-nya dan lihat produk yang salah muncul. Kembalikan cleanup-nya dan jelaskan race-nya.",
    teach: "Jelaskan apa yang dilakukan dependency array pada `useEffect` dan untuk apa cleanup function.",
    analogy: "Effect itu instruksi tetap untuk kru panggung: 'setiap kali adegan berganti ke adegan N, siapkan properti untuk N, dan sebelum adegan berikutnya, bereskan yang lama.' Dependency array adalah daftar hal yang dianggap sebagai pergantian adegan.",
    pitfalls: [
      "Melewatkan sebuah dependency lalu membaca value yang basi; atau mengubah state yang juga menjadi dependency sehingga loop tanpa akhir.",
      "Memakai effect untuk menghitung sesuatu dari props atau state. Hitung saja saat render.",
      "Tanpa cleanup: response yang datang tidak berurutan menimpa data yang lebih baru."
    ],
    quiz: [
      ["`useEffect(() => { … }, [])` dijalankan…", ["Di setiap render", "Sekali setelah render pertama (mount)", "Tidak pernah", "Sebelum render pertama"], "Dependency array kosong berarti tidak ada yang bisa berubah untuk memicu effect jalan lagi. (Saat development, Strict Mode sengaja menjalankannya dua kali.)"],
      ["Untuk apa function yang dikembalikan dari sebuah effect?", ["Mengembalikan data ke komponen", "Cleanup sebelum effect jalan lagi dan saat unmount", "Menangani error", "Memoize effect-nya"], "Ia membatalkan effect-nya: unsubscribe, menghapus timer, membatalkan request."],
      ["Kamu butuh `fullName` dari props `first` dan `last`. Pendekatan terbaik?", ["`useEffect` yang mengatur state", "Hitung saat render: `const fullName = first + ' ' + last`", "`useRef` yang di-update setiap render", "`useMemo` di sekeliling string-nya"], "Value turunan tidak butuh effect maupun state; state tambahan berarti render dan bug tambahan. `useMemo` tidak ada gunanya untuk hal semurah ini."]
    ]
  },
  forms: {
    terms: [
      ['Controlled input', 'Elemen `<input value={val} onChange={...} />` yang sumber kebenarannya berada di state React bukan baru dibaca saat submit.'],
      ['Lifting state up', 'Memindahkan state bersama ke parent terdekat yang sama agar dua komponen bersaudara tetap sinkron lewat props.'],
      ['Komposisi (`children`)', 'Mengirim slot JSX (`<Modal>{content}</Modal>`) daripada menumpuk boolean/konfigurasi props menjaga parent tetap longgar.']
    ],
    title: 'Form, lifting state, dan komposisi',
    why: "Antarmuka sungguhan berisi form dan list yang berbagi data. Tahu di mana state seharusnya tinggal, dan bagaimana komponen yang bersebelahan saling bicara, membuat aplikasi tetap rapi alih-alih kusut.",
    points: [
      "Form di React 19 bisa memakai **Action**: kirim sebuah function ke `<form action={…}>`, dan `useActionState` memberimu state yang dikembalikan (misalnya error) beserta flag `isPending`. Value-nya datang sebagai `FormData`.",
      "Setelah sebuah action, React me-reset field form yang uncontrolled. Kembalikan value yang di-submit di dalam state dan pakai sebagai `defaultValue`, supaya submit yang gagal tidak menghapus ketikan user.",
      "**Controlled input** mengambil `value`-nya dari state dan melaporkan perubahan lewat `onChange`. Pakai saat kamu butuh value-nya di setiap ketikan, seperti pencarian langsung.",
      "Kalau dua komponen butuh data yang sama, **angkat state-nya** ke parent bersama terdekat lalu kirim ke bawah. Child mengubahnya dengan memanggil **callback** yang dikirim sebagai props: data ke bawah, event ke atas.",
      "Hubungkan setiap error dengan field-nya: `aria-invalid` di input, dan `aria-describedby` yang menunjuk ke pesannya, supaya screen reader mengumumkannya bersama field itu.",
      "Untuk form besar, pakai library (React Hook Form) dengan validator schema (Zod), supaya aturan yang sama memvalidasi sekaligus memberi type pada datanya."
    ],
    practice: "Tambahkan kotak pencarian dan sebuah list sebagai komponen yang bersebelahan. Tentukan di mana teks pencarian harus tinggal, sambungkan dengan controlled input, lalu tulis satu kalimat yang membenarkan lokasinya. Lalu submit form produk dengan nama kosong dan pastikan harga yang sudah kamu ketik masih ada.",
    teach: "Jelaskan 'lifting state up' dengan dua komponen bersebelahan yang perlu menampilkan data yang sama.",
    analogy: "Dua anak berbagi satu kotak krayon. Kalau masing-masing menyimpan kotak sendiri, gambar mereka tidak akan pernah cocok. Serahkan kotaknya ke orang tua, yang membagikan krayon ke bawah dan menerima permintaan ('boleh minta yang biru?') dari bawah. Satu kotak, satu kebenaran.",
    pitfalls: [
      "Menyalin prop ke state lalu bingung kenapa ia tidak ter-update.",
      "Mengangkat semuanya ke atas 'jaga-jaga', sehingga seluruh aplikasi re-render di setiap ketikan.",
      "Mencampur controlled dan uncontrolled di satu input (`value` kadang `undefined`), yang memicu peringatan React 'changing an uncontrolled input'.",
      "Pesan error ditampilkan dekat field tapi tidak dihubungkan dengan `aria-describedby`, sehingga pengguna screen reader tidak pernah mendengarnya."
    ],
    quiz: [
      ["Dua komponen bersebelahan harus menampilkan value yang sama. Di mana state-nya seharusnya tinggal?", ["Di kedua komponen", "Di parent bersama terdekat mereka", "Di variabel level module", "Di `localStorage`"], "Satu pemilik mengirim value ke keduanya, jadi keduanya otomatis tetap sinkron."],
      ["Bagaimana child meng-update state milik parent-nya?", ["Mengubah prop-nya", "Memanggil callback function yang dikirim sebagai prop", "Membaca state parent dengan `useContext`", "Tidak bisa"], "Parent mengirim sebuah function dan child memanggilnya: event mengalir ke atas."],
      ["Sebuah form action mengembalikan error validasi, dan field-nya kembali kosong. Kenapa?", ["Action-nya melempar error", "React me-reset field uncontrolled setelah action; kembalikan value-nya dan pakai sebagai `defaultValue`", "`useActionState` hanya menyimpan field terakhir", "Form-nya butuh `method=\"post\"`"], "Reset otomatis memakai `defaultValue` tiap field, jadi mengisinya dengan value yang di-submit menjaga ketikan user."],
      ["Input yang 'controlled' adalah input yang…", ["value-nya berasal dari state React", "value-nya hanya ada di DOM", "type-nya `password`", "perubahannya dinonaktifkan"], "State adalah sumber kebenaran: `onChange` meng-update state, dan state mengatur `value`."]
    ]
  },
  generics: {
    terms: [
      ['Batasan generik (`<T extends { id: number }>`)', 'Mengharuskan parameter type generik minimal memiliki struktur tertentu sembari mempertahankan tipe lengkap aslinya saat kembali.'],
      ['`Pick` / `Omit` / `Partial`', 'Utility type bawaan yang menurunkan `CreateProduct` (`Omit<Product, "id">`) atau `UpdateProduct` dari satu interface sumber.'],
      ['`keyof T` & Akses terindeks (`T[K]`)', 'Memastikan helper (`groupBy(items, key)`) menolak nama properti fiktif dan tahu persis type properti yang dikembalikan.']
    ],
    title: 'Generics dan utility type di TypeScript',
    why: "Generics membuatmu bisa menulis satu function, hook, atau komponen yang reusable dan tetap ber-type penuh. Utility type membuatmu bisa menurunkan type alih-alih menyalinnya, yang menjaga frontend tetap selaras dengan API.",
    points: [
      "**Generic** adalah parameter type: `function first<T>(items: T[]): T | undefined`. Type dari pemanggil mengalir sampai ke hasilnya.",
      "Batasi dengan `extends`: `<T extends { id: number }>` berarti 'type apa pun yang punya id'.",
      "`keyof T` adalah union dari nama-nama property T; `T[K]` adalah type dari property K.",
      "Utility type menurunkan bentuk baru: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `ReturnType<F>`, `Awaited<T>`.",
      "Komponen generic: `function List<T>({ items, render }: ListProps<T>)` bekerja untuk type item apa pun.",
      "Turunkan, jangan duplikasi: `type CreateProduct = Omit<Product, 'id'>` tidak mungkin melenceng dari `Product`."
    ],
    practice: "Di playground, tulis `groupBy<T, K extends keyof T>(items: T[], key: K)` yang mengembalikan `Map<T[K], T[]>`. Lalu tulis signature hook generic `useLocalStorage<T>(key, initial)` dan sebutkan apa `T`-nya di dua tempat pemanggilan yang berbeda.",
    teach: "Jelaskan arti `<T>` dalam `function first<T>(items: T[]): T` dan kenapa itu lebih baik daripada `any`.",
    analogy: "Generic itu amplop berlabel: 'apa pun yang masuk ke sini, keluar dengan bentuk yang sama'. `any` adalah amplop tanpa label: kamu memasukkan cek, dan penerimanya bisa saja menganggapnya daftar belanja.",
    pitfalls: [
      "Menambah parameter type yang hanya dipakai sekali. Generic seharusnya menghubungkan dua hal, misalnya input dan output.",
      "Menulis tangan salinan type yang hampir sama alih-alih menurunkannya.",
      "Mengira `getJson<Product[]>` mengecek response-nya. Itu asersi yang tidak dicek; validasi di batas sistem (misalnya dengan Zod) kalau itu penting."
    ],
    quiz: [
      ["Apa itu `Omit<Product, 'id'>`?", ["Product yang hanya berisi `id`", "Product tanpa property `id`", "Product dengan `id` yang dijadikan opsional", "Function yang menghapus `id` saat runtime"], "`Omit` membangun type dengan key yang disebut dihapus. Type tidak pernah dijalankan, jadi tidak ada yang dihapus dari object sungguhan."],
      ["Di `<T, K extends keyof T>`, `K` boleh berisi apa?", ["String apa pun", "Hanya nama property dari `T`", "Type apa pun", "Type dari salah satu value T"], "`keyof T` adalah union dari key-key T, dan `K` harus muat di dalamnya."],
      ["Apa yang dilakukan `Partial<T>`?", ["Menjadikan setiap property opsional", "Menjadikan setiap property wajib", "Menjadikan setiap property nullable", "Menjadikan `T` readonly"], "Setiap property mendapat `?`, cocok untuk payload patch atau update."]
    ]
  },
  hooks: {
    terms: [
      ['Custom hook (`useX`)', 'Fungsi TypeScript biasa pengekstrak logika + hook agar beberapa komponen berbagi perilaku tanpa pembungkus DOM tambahan.'],
      ['`useReducer`', 'Menggabungkan transisi state kompleks di balik state machine `switch (action.type)` terpisah dari JSX komponen.'],
      ['Context (`createContext`)', 'Menyalurkan tema atau auth ke pohon komponen dalam tanpa harus mengoper props manual melewati lapisan tengah.']
    ],
    title: 'Custom hook, context, dan reducer',
    why: "Seiring aplikasi bertambah besar, logika harus bisa dibagi tanpa copy-paste, dan data harus bisa sampai ke komponen yang dalam tanpa mengoper props melewati sepuluh lapis. Ketiga alat ini adalah jawaban React.",
    points: [
      "**Custom hook** adalah function bernama `useX` yang memanggil hook lain. Ia berbagi **logika**, bukan state: setiap pemanggil mendapat state-nya sendiri.",
      "Aturan hook: panggil di level teratas komponen atau hook, jangan pernah di dalam kondisi atau loop, supaya urutan pemanggilannya sama di setiap render.",
      "**Context** mengantarkan value ke turunan mana pun tanpa prop drilling. Cocok untuk value yang jarang berubah: tema, user saat ini, locale. Di React 19, render `<MyContext value={…}>` langsung dan baca dengan `useContext` atau `use`.",
      "Setiap konsumen re-render saat value context berubah, jadi jaga value-nya tetap stabil (`useMemo`, kecuali React Compiler sudah mengerjakannya untukmu) dan pisahkan value yang tidak berhubungan ke context berbeda. Context bukan state manager.",
      "`useReducer` memusatkan perubahan state yang rumit: `(state, action) => newState`. Action yang ditulis sebagai discriminated union membuat action yang tidak valid menjadi compile error.",
      "`useRef` menyimpan value yang bisa diubah tanpa memicu re-render: node DOM, id timer, value sebelumnya."
    ],
    practice: "Ekstrak logika pengambilan produk menjadi `useProducts(search)` dengan pencarian yang di-debounce. Tambahkan keranjang belanja memakai reducer dan context di atas, lalu tampilkan jumlah item di komponen header yang tidak menerima props apa pun.",
    teach: "Jelaskan kenapa dua komponen yang memanggil custom hook yang sama tidak berbagi state.",
    analogy: "Custom hook itu resep, bukan hidangan: dua orang yang mengikuti resep yang sama masing-masing mendapat piringnya sendiri.",
    pitfalls: [
      "Berharap custom hook berfungsi sebagai store bersama.",
      "Menaruh state yang sering berubah di satu context besar lalu me-render ulang seluruh tree.",
      "Mengirim object `{ … }` baru sebagai value context di setiap render, sehingga setiap konsumen re-render setiap kali.",
      "Memanggil hook di dalam `if`, yang merusak urutan pemanggilan."
    ],
    quiz: [
      ["Dua komponen sama-sama memanggil `useCounter()`. Keduanya…", ["berbagi satu counter", "masing-masing mendapat state sendiri", "melempar error", "berbagi sampai salah satunya unmount"], "Hook berbagi logika; state milik komponen yang memanggilnya."],
      ["Kenapa hook tidak boleh dipanggil di dalam kondisi?", ["Jadi lebih lambat", "React mengenali hook berdasarkan urutan pemanggilan, yang harus sama di setiap render", "TypeScript melarangnya", "Hook-nya jadi jalan dua kali"], "State disimpan berdasarkan posisi dalam urutan pemanggilan; melewatkan satu pemanggilan menggeser semua hook sesudahnya."],
      ["Mengubah `.current` dari sebuah `useRef`…", ["me-render ulang komponennya", "tidak memicu re-render", "melempar error di Strict Mode", "me-reset state komponennya"], "Ref adalah kotak yang bisa diubah di luar siklus render."]
    ]
  },
  perf: {
    terms: [
      ['`React.memo`', 'Melewati re-render child saat semua props sama secara dangkal (`Object.is`) — mudah rusak oleh objek/callback inline baru kecuali distabilkan.'],
      ['`useCallback` & `useMemo`', 'Menjaga referensi fungsi/objek antar render — baru dipakai jika profiling membuktikan child memo atau komputasi berat membutuhkannya.'],
      ['`useTransition` / kolokasi state', 'Menurunkan state cepat-berubah sedekat mungkin ke daun yang butuh serta menandai filter berat non-mendesak agar ketikan tetap mulus.']
    ],
    title: 'Performance rendering',
    why: "React sudah cepat secara default, dan kebanyakan 'optimasi' buatan tangan membuat kode lebih susah dibaca tanpa membuatnya lebih cepat. Ukur dulu, lalu terapkan perbaikan yang tepat pada komponen yang tepat.",
    points: [
      "**Render** adalah React memanggil function-mu; **commit** adalah React menyentuh DOM. Render biasanya murah; render tambahan hanya jadi masalah kalau lambat atau sangat banyak.",
      "**Ukur dulu** dengan Profiler di React DevTools: komponen mana yang render, kenapa, dan berapa lama.",
      "**React Compiler** (stabil sejak Oktober 2025) memoize komponen, value, dan callback secara otomatis saat build. Kalau ia aktif, kamu jarang menulis `memo`, `useMemo`, atau `useCallback` sendiri. Ia mengandalkan kodemu yang mengikuti aturan React (render yang pure, tanpa mutasi).",
      "Perbaikan paling murah bersifat struktural: pindahkan state **ke bawah**, ke komponen yang membutuhkannya, dan kirim subtree yang mahal sebagai `children` supaya tidak ikut re-render.",
      "Tanpa compiler, atau untuk satu titik panas: `memo(Component)` melewati render kalau props-nya sama secara dangkal, dan `useCallback`/`useMemo` menjaga props itu tetap stabil. Prop object, array, atau function baru di setiap render diam-diam menggagalkan `memo`.",
      "Untuk list panjang, lakukan **virtualisasi** (render hanya baris yang terlihat). Pecah bundle dengan `lazy` dan `Suspense`."
    ],
    practice: "Render 5.000 baris dengan kotak pencarian dan rekam sesi mengetik di Profiler. Terapkan perbaikan satu per satu — `memo` dengan callback yang stabil, lalu virtualisasi — dan catat berapa komponen yang render per ketikan setelah masing-masing. Lalu hapus memoisasi manualnya, aktifkan React Compiler, dan rekam lagi.",
    teach: "Jelaskan kenapa membungkus komponen dengan `memo` kadang tidak berpengaruh sama sekali.",
    analogy: "`memo` itu penjaga pintu yang bertanya 'apakah ada yang berubah dari kirimanmu sejak terakhir kali?' Kalau kamu selalu menyerahkan kotak yang benar-benar baru, meski isinya sama, ia terpaksa menjawab ya. `useCallback` dan `useMemo` adalah cara menyerahkan kotak yang sama, dan React Compiler adalah rekan kerja yang melakukannya untukmu.",
    pitfalls: [
      "Membungkus semuanya dengan `useMemo`/`useCallback` tanpa mengukur.",
      "`memo` yang digagalkan oleh prop inline `{}` / `[]` / `() => {}`.",
      "Mengoptimasi render padahal biaya sebenarnya adalah bundle 2 MB atau API yang lambat.",
      "Kode yang melakukan mutasi saat render, yang tidak bisa di-memoize dengan aman oleh React Compiler."
    ],
    quiz: [
      ["Sebuah child yang di-memoize menerima `onClick={() => select(id)}` dari parent-nya, tanpa React Compiler. Apakah `memo` melewati re-render?", ["Ya", "Tidak: function baru dibuat di setiap render, jadi props-nya berbeda", "Hanya di production", "Hanya untuk child pertama"], "Perbandingan dangkal melihat reference function yang berbeda setiap kali."],
      ["React Compiler aktif. Apakah kamu masih butuh `useCallback` di sekeliling event handler?", ["Ya, di mana-mana", "Biasanya tidak: compiler memoize-nya secara otomatis", "Hanya untuk handler yang memanggil `setState`", "Hanya di dalam class component"], "Compiler menambahkan memoisasinya saat build, asalkan kodenya mengikuti aturan React."],
      ["Langkah pertama saat sebuah layar React terasa lambat?", ["Bungkus semuanya dengan `useMemo`", "Profiling untuk melihat apa yang render dan berapa lama", "Pindahkan semua state ke context", "Ganti `useState` dengan `useReducer`"], "Tanpa mengukur, kamu tidak bisa tahu komponen atau operasi mana yang memakan biaya."],
      ["Perbaikan terbaik untuk list berisi 20.000 baris?", ["`memo` di setiap baris", "Virtualisasi: render hanya baris yang terlihat", "`useCallback` untuk setiap handler", "Memakai index sebagai `key`"], "Tidak membuat 20.000 node DOM lebih baik daripada membuat re-render-nya lebih murah."]
    ]
  },
  server: {
    splits: ['1 · Helper ApiError & api()', '2 · Query & Mutasi ProductsPage'],
    terms: [
      ['Server state vs Client state', 'Data backend bersifat asinkron, bersama, dan bisa kedaluwarsa; mengelolanya lewat TanStack Query menghapus salinan lokal yang usang.'],
      ['`useQuery` & `invalidateQueries`', '`useQuery` menyimpan cache per `queryKey`; sesudah `useMutation` menulis, invalidation langsung menyegarkan semua layar terkait.'],
      ['Peta error per field `ProblemDetails`', 'Menerjemahkan JSON validasi ASP.NET Core `400` (`errors.Name[0]`) langsung ke error form aksesibel lewat `aria-describedby`.']
    ],
    title: 'Server state, routing, dan berkomunikasi dengan API-mu',
    why: "Di sinilah track-track bertemu: layar React memanggil endpoint ASP.NET Core yang menjalankan SQL. Menangani caching, error, auth, dan type dengan benar di sini adalah inti pekerjaan full-stack.",
    points: [
      "**Server state** (data milik backend) berbeda dengan **client state** (state UI). Ia asynchronous, dipakai bersama, dan bisa basi.",
      "Library server state (TanStack Query) memberi caching, deduplikasi, refetch di background, retry, serta state loading/error, menggantikan fetching di `useEffect` yang ditulis tangan. Bungkus aplikasinya sekali dengan `<QueryClientProvider>`.",
      "**Query** membaca dan di-cache berdasarkan key; **mutation** menulis lalu **meng-invalidate** query yang terdampak supaya di-refetch.",
      "Ubah ProblemDetails dari ASP.NET menjadi sesuatu yang bisa dipakai UI: `title` untuk pesan umum, dan `errors` untuk pesan di samping setiap field.",
      "**Router** (React Router atau TanStack Router) memetakan URL ke komponen. Taruh state yang bisa dibagikan — halaman, filter, id yang dipilih — di URL.",
      "Bagikan kontraknya: generate type TypeScript dari dokumen **OpenAPI** milik API alih-alih mengetik ulang DTO secara manual.",
      "Auth untuk SPA: utamakan cookie `HttpOnly`, `Secure`, `SameSite` lewat backend-for-frontend daripada token di `localStorage`. Cookie dikirim otomatis, jadi lindungi operasi penulisan dari CSRF dengan antiforgery token milik ASP.NET Core atau custom header yang wajib ada."
    ],
    practice: "Hubungkan aplikasi React-mu ke API ASP.NET Core dengan TanStack Query: list, create, delete. Kirim produk yang tidak valid dan pastikan pesan validasi dari server muncul di samping field yang tepat. Generate type TypeScript dari dokumen OpenAPI milik API lalu hapus salinan yang kamu tulis sendiri.",
    teach: "Jelaskan perbedaan server state dan client state, serta apa yang dilakukan 'meng-invalidate query'.",
    analogy: "Server state itu seperti buku perpustakaan: kamu memegang salinannya, tapi perpustakaan yang memiliki kebenarannya, dan orang lain mungkin sudah memperbaruinya. Cache query adalah rak berisi salinan pinjamanmu, masing-masing dicap tanggal 'cek lagi setelah'. Meng-invalidate berarti bilang 'aku baru saja menyerahkan koreksi; ambilkan edisi terbarunya'.",
    pitfalls: [
      "Menyalin data hasil fetch ke `useState` lalu menyimpan salinan kebenaran kedua yang basi.",
      "Menyimpan access token di `localStorage`, tempat script sisipan mana pun bisa membacanya.",
      "Mengatur `Content-Type: application/json` di setiap request, termasuk GET, yang memaksa request preflight CORS tambahan setiap kali.",
      "Men-spread opsi dari pemanggil setelah `headers` milikmu sendiri, sehingga mengirim header apa pun diam-diam menghapus `Content-Type`.",
      "Merawat salinan type TypeScript dari DTO C# secara manual sampai keduanya melenceng."
    ],
    quiz: [
      ["Setelah mutation 'create product' berhasil, bagaimana seharusnya list produk ter-update?", ["Ter-update sendiri", "Invalidate query list-nya supaya di-refetch", "Muat ulang halaman", "`push` item baru ke array di cache"], "Invalidation menandai data di cache sebagai basi dan mengambilnya ulang dari sumber kebenaran. Memutasi cache secara langsung melewati deteksi perubahan."],
      ["Mana yang tempatnya di URL, bukan di state komponen?", ["Apakah dropdown sedang terbuka", "Nomor halaman dan filter sebuah list", "Input yang baru setengah diketik", "State hover"], "State tampilan yang bisa dibagikan dan di-bookmark sebaiknya bertahan saat reload dan bisa dijadikan link."],
      ["SPA-mu login dengan cookie `HttpOnly`. Apa lagi yang dibutuhkan operasi penulisan?", ["Tidak ada: `HttpOnly` memblokir semua serangan", "Perlindungan CSRF, seperti antiforgery token atau custom header yang wajib ada", "Token di `localStorage` juga", "`credentials: \"omit\"` di setiap request"], "Browser mengirim cookie di setiap request ke API-mu, termasuk request yang dipicu situs lain. Itulah yang dicegah oleh perlindungan CSRF."],
      ["Cara paling andal menjaga type TypeScript tetap selaras dengan API C#?", ["Salin secara manual", "Generate dari dokumen OpenAPI milik API", "Pakai `any` untuk response API", "Bagikan file `.d.ts` lewat Slack"], "Type yang di-generate ikut berubah saat API berubah, dan menggagalkan build kalau frontend-nya tertinggal."]
    ]
  },
  tsadv: {
    terms: [
      ['Conditional type (`T extends U ? X : Y`)', 'Menghitung tipe hasil secara dinamis berdasar bentuk input — dasar dari `Awaited<T>` dan `ReturnType<F>` bawaan TypeScript.'],
      ['Mapped type (`{ [K in keyof T]: ... }`)', 'Mengubah setiap properti pada sebuah interface secara sistematis (misalnya membentuk kamus error per field).'],
      ['`infer` & Template literal type', 'Mengekstrak sub-type di dalam pencocokan (`infer R`) dan memaksa pola string jalur API (`\`/api/${string}\``) di waktu kompilasi.']
    ],
    title: 'Type tingkat lanjut: conditional, mapped, dan inferred',
    why: "Type system TypeScript adalah bahasa pemrograman kecil. Kalau dipakai dengan baik, ia membuat kode yang salah mustahil ditulis; kalau terlalu pintar, ia membuat kode yang tidak bisa diubah orang lain. Keahliannya adalah membedakan keduanya.",
    points: [
      "**Conditional type** memilih sebuah type: `T extends U ? X : Y`. Pada union, ia **didistribusikan**: diterapkan ke setiap anggotanya.",
      "`infer` menangkap sebagian type di dalam kondisi: `T extends Promise<infer R> ? R : T`. `Awaited<T>` bawaan TypeScript bekerja dengan cara ini.",
      "**Mapped type** mengubah setiap property: `{ [K in keyof T]: … }`, dengan modifier `readonly`/`?` dan penggantian nama key lewat `as`.",
      "**Template literal type** membangun type string, ditulis dengan backtick seperti template string JavaScript: type nama event yang diturunkan dari nama property.",
      "`never` adalah type kosong. Meng-assign ke `never` di cabang `default` memberi **pengecekan kelengkapan**: menambah anggota union akan menggagalkan build sampai anggota itu ditangani.",
      "`satisfies` mengecek sebuah value terhadap type **tanpa memperlebarnya**. `as const` membekukan literal. Utamakan keduanya daripada cast `as`."
    ],
    practice: "Tulis `DeepReadonly<T>`, dan `PathParams<'/users/:id/posts/:postId'>` yang menghasilkan `{ id: string; postId: string }`. Lalu tulis satu paragraf tentang apakah kamu akan menerima `PathParams` di codebase tim, dan apa yang bisa mengubah pendapatmu.",
    teach: "Jelaskan bagaimana meng-assign ke variabel ber-type `never` di case `default` membuat compiler menangkap anggota union yang terlupa.",
    analogy: "Type biasa adalah label di kotak. Type tingkat lanjut adalah mesin pencetak label: masukkan satu type dan ia mencetak type lain yang berkaitan. `never` adalah celah yang tidak bisa dilewati apa pun: kalau masih ada yang tersisa dan jatuh ke sana, compiler sudah menemukan case yang belum kamu tangani.",
    pitfalls: [
      "Akrobat type yang tidak bisa dirawat siapa pun di tim. Keterbacaan mengalahkan kepintaran.",
      "Cast `as` yang membungkam error yang sebenarnya benar menurut type system.",
      "Lupa bahwa conditional type didistribusikan ke anggota union, lalu mendapat hasil yang mengejutkan.",
      "Membuat ulang utility type yang sudah disediakan TypeScript, seperti `Awaited`, `NonNullable`, atau `ReturnType`."
    ],
    quiz: [
      ["Apa hasil `T extends Promise<infer R> ? R : T` untuk `T = Promise<string>`?", ["`Promise<string>`", "`string`", "`never`", "`unknown`"], "`infer R` menangkap type yang dihasilkan promise saat resolve."],
      ["Apa yang dilakukan `satisfies` yang tidak dilakukan anotasi type?", ["Mengecek value-nya saat runtime", "Mengecek kecocokan sambil mempertahankan type sempit hasil inference", "Membuat value-nya bisa diubah", "Mematikan pengecekan untuk value itu"], "Anotasi memperlebar ke type yang dianotasikan; `satisfies` mengecek sekaligus mempertahankan literalnya."],
      ["Anggota baru ditambahkan ke union yang ditangani `switch` dengan `const x: never = value` di `default`. Hasilnya?", ["Bug diam-diam saat runtime", "Compile error sampai case baru itu ditangani", "Tidak ada apa-apa", "Case barunya jatuh ke case pertama"], "Anggota yang belum ditangani tidak bisa di-assign ke `never`, jadi build gagal tepat di tempat yang benar."]
    ]
  },
  internals: {
    terms: [
      ['Pohon Fiber (unit kerja)', 'Pohon tautan internal React penyimpan state dan hook komponen agar rendering bisa dijeda, dilanjutkan, atau dibatalkan per prioritas.'],
      ['Rekonsiliasi (render vs commit)', 'Render menghitung selisih UI di JS murni; Commit menuliskan mutasi DOM minimal secara sinkron agar layar tak pernah tampil setengah jadi.'],
      ['Pemanggilan ganda `StrictMode`', 'Pemeriksaan mode dev yang memanggil render/effect dua kali untuk langsung mengungkap mutasi tak murni atau cleanup yang lupa ditulis.']
    ],
    title: 'Internal React: reconciliation dan concurrency',
    why: "Memahami bagaimana React memutuskan apa yang diubah, dan kapan, mengubah perilaku yang membingungkan — state yang hilang, effect yang jalan dua kali, jank — menjadi akibat yang bisa ditebak dari segelintir aturan.",
    points: [
      "Rendering menghasilkan tree berisi **element** (object biasa). **Reconciliation** membandingkannya dengan tree sebelumnya untuk menemukan perubahan DOM sesedikit mungkin.",
      "Dua aturan: **type element** yang berbeda di posisi yang sama mengganti seluruh subtree; **key** mengenali child yang urutannya berubah. State terikat pada posisi + type + key.",
      "Mengubah `key` sebuah komponen secara sengaja **me-reset state-nya**: teknik yang berguna, sekaligus kecelakaan yang umum.",
      "**Fiber** adalah satuan kerja React, yang membuat rendering bisa dijeda, dilanjutkan, dan diprioritaskan. **Fase render** bisa diinterupsi dan harus pure; **fase commit** dijalankan sekaligus.",
      "**Fitur concurrent**: `useTransition` dan `useDeferredValue` menandai update sebagai tidak mendesak supaya mengetik tetap responsif; `Suspense` mendeklarasikan batas loading; `use(promise)` membaca promise di dalam batas Suspense.",
      "Strict Mode me-render dua kali dan menjalankan mount, unmount, lalu mount lagi pada effect saat development, untuk mengungkap kode yang tidak pure. Server Component di-render di server dan tidak mengirim JavaScript untuk dirinya sendiri: model eksekusi yang berbeda dari client component."
    ],
    practice: "Bangun komponen tab yang me-render `<Counter />` di dua cabang pada posisi yang sama, dan lihat state-nya bertahan saat berpindah. Lalu beri masing-masing `key` yang berbeda dan jelaskan perubahannya dari sisi reconciliation.",
    teach: "Jelaskan kenapa mengubah `key` sebuah komponen me-reset state-nya.",
    analogy: "Reconciliation itu seperti petugas teater yang membandingkan denah tempat duduk malam ini dengan malam kemarin. Kursi yang sama, jenis tamu yang sama: biarkan dan perbarui tiketnya. Jenis tamu yang berbeda di kursi itu: kosongkan sepenuhnya. `key` adalah tanda nama, sehingga petugas bisa mengikuti tamu yang pindah kursi alih-alih menganggapnya orang asing.",
    pitfalls: [
      "Mendefinisikan komponen di dalam komponen lain: setiap render ia menjadi type baru, sehingga state-nya terus ter-reset.",
      "Side effect di fase render, yang bisa jalan lebih dari sekali.",
      "Menganggap jalan-dua-kali dari Strict Mode sebagai bug lalu mematikannya."
    ],
    quiz: [
      ["Di posisi yang sama, sebuah `<div>` diganti dengan `<section>` yang child-nya identik. React akan…", ["mengubah tag-nya di tempat", "menghancurkan subtree lama dan membangun yang baru, sehingga state child-nya hilang", "mengabaikan perubahannya", "melempar error"], "Type element yang berbeda berarti tree yang berbeda; React tidak mencoba memakainya ulang."],
      ["Apa yang bisa dilakukan dengan `useTransition`?", ["Menganimasikan CSS", "Menandai update state sebagai tidak mendesak supaya update yang mendesak bisa menyelanya", "Mengambil data di background", "Melewati render sebuah komponen"], "Transition menjaga UI tetap responsif selama render yang mahal."],
      ["Kenapa Strict Mode menjalankan effect dua kali saat development?", ["Itu bug di build development", "Untuk mengungkap effect yang tidak punya cleanup yang benar", "Untuk memuat data dua kali demi kecepatan", "Karena Strict Mode juga me-render di server"], "Mount → unmount → mount mensimulasikan mount ulang; effect dengan cleanup yang benar tidak terpengaruh."]
    ]
  },
  arch: {
    terms: [
      ['Test berorientasi pengguna (`render` + `userEvent`)', 'Menguji komponen lewat role dan label aksesibel (`getByRole("button")`) alih-alih membaca state internal komponen.'],
      ['Mocking API (`MSW`)', 'Mencegat `fetch` di batas jaringan supaya test komponen menjalankan serialisasi, validasi, dan status error sungguhan.'],
      ['Gerbang aksesibilitas inti (`axe-core`)', 'Landmark semantik, navigasi keyboard, kontrol berlabel, dan wilayah error `role="alert"` yang dicek otomatis di tiap fitur.']
    ],
    title: 'Arsitektur frontend, testing, dan aksesibilitas',
    why: "Frontend yang baik adalah frontend yang bisa diubah tim dengan aman selama bertahun-tahun dan bisa dioperasikan setiap user. Itu butuh struktur, test yang bertahan saat refactor, dan aksesibilitas yang diperlakukan sebagai kebutuhan, bukan fitur tambahan.",
    points: [
      "Klasifikasikan state sebelum memilih alat: **server state** (library query), **URL state** (router), **state UI lokal** (`useState`), **client state bersama** (context, atau store seperti Zustand kalau sering berubah).",
      "Susun per **fitur** (`features/cart/…`), bukan per jenis file, dan pisahkan potongan UI bersama. Tegakkan batasnya dengan aturan lint.",
      "Test **perilaku lewat UI** dengan React Testing Library: cari elemen berdasarkan role dan label, bertindak seperti user, dan assert pada apa yang mereka lihat. Mock network-nya (MSW), bukan komponennya.",
      "Setup test untuk Vitest: environment `jsdom`, `import \"@testing-library/jest-dom/vitest\"` untuk matcher seperti `toBeInTheDocument`, dan provider yang sama dengan yang dipakai aplikasi (di sini `QueryClientProvider`).",
      "Beberapa test **end-to-end** (Playwright) mencakup jalur kritis melewati frontend, API, dan database sungguhan.",
      "**Aksesibilitas**: HTML semantik dulu, setiap input berlabel, bisa dioperasikan penuh lewat keyboard, fokus yang terlihat, kontras yang cukup, pengumuman untuk perubahan async. Test dengan keyboard dan screen reader.",
      "Budget performance: pantau Core Web Vitals (LCP, INP, CLS), pecah kode per route, optimasi gambar, dan gagalkan CI saat bundle melewati budget."
    ],
    practice: "Tulis test ini untuk halaman produkmu sendiri, lalu refactor bagian dalam halamannya — ganti nama komponen, ubah cara state dikelola — tanpa menyentuh test-nya. Kalau test-nya rusak, berarti ia mengetes implementasi. Terakhir, operasikan seluruh halaman hanya dengan keyboard dan perbaiki apa yang kamu temukan.",
    teach: "Jelaskan kenapa test yang mencari elemen berdasarkan role dan label lebih berharga daripada test yang mengecek bagian dalam komponen.",
    analogy: "UI test yang baik itu seperti mystery shopper: mereka masuk, memakai toko seperti pelanggan biasa, lalu melaporkan pengalamannya. Mereka tidak peduli bagaimana gudang ditata, jadi kamu bebas menata ulang gudangnya.",
    pitfalls: [
      "Store global untuk segalanya, termasuk data server dan input form.",
      "Snapshot test dan test state internal yang rusak di setiap refactor tanpa pernah menangkap bug.",
      "`div` atau `li` dengan `onClick` alih-alih `button`: tidak bisa dicapai lewat keyboard dan tidak terlihat oleh teknologi bantu.",
      "Me-render komponen di test tanpa provider yang dibutuhkannya, lalu bergulat dengan error yang membingungkan."
    ],
    quiz: [
      ["Di mana tempat data yang diambil dari API?", ["Store Redux global, selalu", "Cache server state seperti TanStack Query", "`localStorage`", "`useRef` di komponen root"], "Server state butuh caching, penanda basi, dan invalidation, yang memang tugas library query."],
      ["Kenapa mencari dengan `getByRole('button', { name: 'Add' })`, bukan dengan class CSS?", ["Lebih cepat", "Ia mengetes apa yang dirasakan user dan teknologi bantu, dan bertahan saat refactor", "Class tidak ada di jsdom", "Tidak perlu rendering"], "Role dan nama adalah kontrak publik UI; nama class adalah detail implementasi."],
      ["Langkah pertama yang paling penting untuk aksesibilitas?", ["Tambahkan atribut ARIA ke setiap elemen", "Pakai elemen HTML semantik dengan label yang benar", "Pilih palet warna berkontras tinggi", "Pasang widget overlay aksesibilitas"], "Elemen bawaan memberi dukungan keyboard dan makna secara gratis; ARIA mengisi celah, bukan menggantikannya. Widget overlay tidak memperbaiki markup yang bermasalah."]
    ]
  }
}, { tagline: 'Frontend-nya: JavaScript modern, type system, komponen, state, dan arsitektur.' });
