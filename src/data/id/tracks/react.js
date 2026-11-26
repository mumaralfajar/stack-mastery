// @ts-check
// Bahasa Indonesia — track TypeScript + React. Contoh kode tetap memakai versi aslinya.
export const trackId = {
  id: 'react',
  tagline: 'Bagian frontend: JavaScript modern, type system, komponen, state, dan arsitektur.',
  lessons: {
  js: {
    terms: [
      ['`const` vs `let`', '`const` mencegah nama variabel di-assign ulang (pakai sebagai default). Isi object tetap perlu disalin (`{ ...x }`) agar tidak ikut berubah.'],
      ['`===` vs `==`', '`===` mengecek nilai sekaligus tipenya tanpa konversi diam-diam (`0 == ""` adalah jebakan klasik `==`).'],
      ['Array `.map()` / `.filter()`', 'Membuat array baru hasil transformasi atau penyaringan tanpa mengubah array aslinya, yang diandalkan React untuk update state.']
    ],
    title: 'Dasar JavaScript untuk TypeScript',
    why: "TypeScript itu JavaScript yang ditambah tipe. Mayoritas bug React yang bikin pemula bingung, seperti nilai lama, array termutasi, atau `undefined`, sebenarnya berasal dari JavaScript.",
    points: [
      "`const` tidak bisa di-assign ulang, sedangkan `let` bisa. Biasakan pakai `const` dan hindari `var`.",
      "Function diperlakukan seperti nilai biasa. Arrow function seperti `(x) => x * 2` paling sering kamu pakai sehari-hari.",
      "Object dan array dioper lewat **reference**, jadi `const b = a` menunjuk array yang sama. Salin dulu pakai spread (`[...a]`, `{ ...obj }`).",
      "`map`, `filter`, dan `reduce` menghasilkan array **baru** tanpa menyentuh aslinya. Sebaliknya `sort`, `reverse`, dan `splice` mengubah array di tempat, jadi pakai `toSorted`, `toReversed`, atau `toSpliced`.",
      "Destructuring langsung membongkar isi object atau array: `const { name, age } = user` dan `const [first, ...rest] = list`.",
      "`===` mengecek nilai dan tipe persisnya. `?.` berhenti di `null` atau `undefined`, sementara `??` cuma memberi cadangan untuk keduanya. `||` jatuh ke cadangan untuk semua nilai falsy (`0`, `''`, `null`, `undefined`, `NaN`, `false`)."
    ],
    practice: "Di TypeScript playground, ambil array `{ name, price, inStock }` lalu hasilkan nama produk yang stoknya ada dan harganya di bawah 100, urut harga termurah. Pakai `toSorted`, lalu log array asli untuk membuktikan isinya tak berubah.",
    teach: "Jelaskan kenapa menulis `const b = a` lalu `b.push(1)` ikut mengubah `a`, dan bagaimana menghindarinya.",
    analogy: "`const` pada object itu seperti mengikat anjing ke tali paten. Talinya tak bisa dipindah ke anjing lain, tapi anjingnya tetap bisa bermain lumpur.",
    pitfalls: [
      "Mengira `const` bikin object kebal perubahan. Kata kunci itu hanya mengunci object mana yang ditunjuk variabel tersebut.",
      "Memanggil `sort` atau `splice` langsung pada state akan mengubah array aslinya di tempat. Pakai `toSorted` dan `toSpliced`.",
      "Menulis `count || 10` padahal `0` adalah angka yang sah. Pakai `??`.",
      "Tertukar antara `map` (mengembalikan array baru) dan `forEach` (tidak mengembalikan nilai)."
    ],
    quiz: {
      'map-return': ["Apa yang dikembalikan `[1, 2, 3].map(n => n * 2)`?", ["`undefined`", "`[2, 4, 6]`, dan array aslinya juga jadi `[2, 4, 6]`", "`[2, 4, 6]`, tanpa mengubah array aslinya", "`6`"], "`map` membuat array baru berisi hasil transformasi tanpa menyentuh array aslinya."],
      'const-const': ["Jika `const a = { n: 1 }`, `const b = a`, lalu `b.n = 2`, berapa `a.n`?", ["1", "2", "undefined", "Error: `a` itu const"], "`a` dan `b` menunjuk ke object yang sama. `const` hanya melarang variabelnya di-assign ulang."],
      'what-is-0-10': ["Berapa hasil `0 ?? 10`?", ["`0`", "`10`", "`null`", "`false`"], "`??` hanya mengganti `null` dan `undefined`. Kalau `0 || 10` baru keluar `10`, karena `0` dianggap falsy."]
    }
  },
  ts: {
    predict: {
      prompt: "Diketahui `type Result<T> = { ok: true; data: T } | { ok: false; error: string }`, lalu kamu menulis `function show(r: Result<Product>) { console.log(r.data.name); }` tanpa mengecek `if (r.ok)`. Apa yang terjadi?",
      options: [
        "Lolos kompilasi dan mencetak `undefined` saat runtime bila `ok` bernilai `false`",
        "Error kompilasi TypeScript: `Property \"data\" does not exist on type \"{ ok: false; error: string }\"`",
        "TypeScript otomatis menyisipkan pengecekan `if (r.ok)` saat runtime",
      ],
      answer: 1,
      explain: "Sebelum narrowing lewat penanda `r.ok`, `r` bisa saja cabang error yang tidak punya `data`. Mengecek `if (r.ok)` mempersempit `r` menjadi `{ ok: true; data: Product }` di dalam blok tersebut.",
    },
    terms: [
      ['Discriminated union', 'Bentuk object berbeda yang berbagi penanda literal (`ok: true` dengan `data: T`, atau `ok: false` dengan `error: string`) sehingga otomatis menyempit di blok `if`.'],
      ['Type narrowing', 'TypeScript melacak pengecekan seperti `typeof x === "string"`, `in`, dan `switch` agar tahu sub-tipe persisnya di tiap cabang.'],
      ['`unknown` vs `any`', '`unknown` memaksamu mengecek bentuk nilai saat runtime sebelum membaca propertinya, sedangkan `any` mematikan pemeriksa tipe.']
    ],
    title: 'TypeScript: type yang menangkap bug',
    why: "TypeScript memindahkan banyak bug dari temuan pengguna di produksi menjadi garis bawah merah di editor. Tipe-tipe ini juga menjadi kontrak bersama antara frontend React dan backend API.",
    points: [
      "Tulis tipe di pintu masuk data seperti parameter, nilai kembali, dan respons API. Biarkan compiler menebak sisanya.",
      "`interface` atau `type` menjelaskan bentuk sebuah object. TypeScript memakai pengecekan **struktural**, artinya object apa pun yang bentuknya cocok langsung diterima.",
      "**Union type** memodelkan pilihan seperti `string | number` atau `'idle' | 'loading' | 'error'`.",
      "**Narrowing** terjadi sesudah pengecekan seperti `if (typeof x === 'string')` atau `if (user)`, jadi TypeScript tahu tipe lebih spesifik di dalam blok itu.",
      "Properti opsional seperti `age?: number` berarti `number | undefined`. Saat mode `strict` aktif seperti di template Vite, kamu harus menangani kemungkinan `undefined`.",
      "Hindari `any` karena mematikan pengecekan. Pakai `unknown` lalu persempit dulu. Ingat bahwa tipe lenyap saat runtime, jadi TypeScript tidak mengecek data yang datang dari jaringan."
    ],
    practice: "Di playground, definisikan tipe `Todo` dan fungsi `toggle(todos: Todo[], id: string): Todo[]` yang menghasilkan array baru. Setelah itu, modelkan status request sebagai discriminated union (`idle`, `loading`, `success`, `error`) dan tulis handler untuk keempatnya.",
    teach: "Jelaskan apa itu union type dan bagaimana TypeScript mempersempit tipenya di dalam `if`.",
    analogy: "Tipe data itu mirip mainan pencocok bentuk. Balok persegi cuma muat di lubang persegi, dan salahnya ketahuan detik itu juga sebelum kotaknya dikirim. Union itu lubang yang mau menerima persegi atau lingkaran, lalu narrowing mengecek mana yang sedang kamu pegang sebelum dipakai.",
    pitfalls: [
      "Asal menempel `any` tiap kali TypeScript protes. Biasanya keluhan compiler memang menunjuk bug nyata.",
      "Mengira TypeScript ikut memvalidasi respons API saat runtime. Menulis `as Product` cuma janji dari kamu, bukan pengecekan sungguhan.",
      "Menulis anotasi tipe di setiap variabel lokal padahal compiler sudah otomatis mengetahuinya."
    ],
    quiz: {
      'type-size-allow': ["Apa yang diizinkan oleh `type Size = 'S' | 'M' | 'L'`?", ["String apa pun", "Tepat salah satu dari ketiga string itu", "Array berisi ketiga string itu", "String apa pun yang diawali S, M, atau L"], "Itu union dari string literal type."],
      'typescript-types-runtime': ["Type TypeScript saat runtime…", ["dicek oleh engine JavaScript", "dihapus: hanya ada saat compile time", "diubah menjadi class", "disimpan sebagai komentar di output"], "Compiler menghapus semua tipe, sehingga file jadinya murni JavaScript biasa."],
      'safer-alternative-any-value': ["Alternatif yang lebih aman daripada `any` untuk value yang bentuknya tidak diketahui?", ["`object`", "`unknown`, lalu narrow", "`never`", "`{}`"], "`unknown` memaksamu mengecek tipe nilainya dulu sebelum dipakai."]
    }
  },
  components: {
    predict: {
      prompt: "Sebuah komponen merender `{products.length && <ProductList items={products} />}` saat `products` bernilai `[]`. Apa yang benar-benar tampil di DOM?",
      options: [
        "Tidak ada apa-apa (DOM kosong)",
        "Angka `0` tercetak sebagai teks di halaman",
        "Error runtime karena `&&` mewajibkan boolean",
      ],
      answer: 1,
      explain: "Di JavaScript, `0 && <ProductList />` menghasilkan `0`, dan React merender angka `0` ke DOM (berbeda dengan `false`, `null`, atau `undefined`). Tulis `products.length > 0 && ...` sebagai gantinya.",
    },
    terms: [
      ['Ekspresi JSX', 'Sintaks JavaScript seperti `<Card price={p.price} />` yang dikompilasi menjadi pemanggilan fungsi `jsx(...)`, bukan parser template terpisah.'],
      ['Props (satu arah ke bawah)', 'Input read-only dari parent ke child. Mengubah tampilan di child tidak pernah mengubah props milik parent langsung.'],
      ['Prop `key` yang stabil', 'Membantu React mengenali baris list lewat ID database saat ditambah atau diurutkan. Memakai index array bikin bug state ketika urutan bergeser.']
    ],
    title: 'React: komponen, JSX, dan props',
    why: "Inti React muat dalam satu kalimat: tampilan UI adalah hasil fungsi dari data. Begitu kamu memandang komponen sebagai fungsi yang menggambarkan layar untuk data saat ini, semuanya jadi masuk akal. Materi ini memakai React 19 sesuai template Vite terbaru.",
    points: [
      "**Komponen** adalah fungsi yang mengembalikan JSX, dan namanya selalu diawali huruf kapital.",
      "**JSX** itu JavaScript yang ditulis mirip HTML. Kurung kurawal `{ }` menyisipkan ekspresi JS apa pun langsung ke dalamnya.",
      "**Props** adalah input read-only sebuah komponen yang dikirim layaknya atribut HTML. Komponen tidak boleh mengubah props yang ia terima.",
      "Render daftar item memakai `map` dan pasang `key` yang unik serta stabil di setiap item.",
      "Tampilan bersyarat cukup memakai logika JavaScript biasa seperti `cond && <X />` atau `cond ? <A /> : <B />`.",
      "Susun layar besar dari komponen-komponen kecil. Prop `children` membuat komponen bisa membungkus konten apa pun di dalamnya."
    ],
    practice: "Buat project Vite lewat `npm create vite@latest shop -- --template react-ts`. Bangun `ProductList` yang menampilkan barisan `ProductCard`, munculkan pesan kosong saat array `[]`, lalu beri sorotan khusus untuk harga di atas 1000.",
    teach: "Jelaskan apa itu komponen React dan props kepada teman yang baru paham HTML dan JS dasar.",
    analogy: "Komponen bekerja seperti stempel karet dengan bagian kosong. Desain cetakannya tetap, sedangkan props mengisi bagian kosong itu tiap kali kamu mencap. Halaman disusun dari stempel kecil di dalam stempel yang lebih besar.",
    pitfalls: [
      "Memakai index array sebagai `key` pada list yang itemnya bisa ditambah, dihapus, atau diacak ulang.",
      "Mencoba mengubah nilai props langsung dari dalam child component.",
      "Tanpa sengaja mencetak angka `0` ke layar gara-gara `items.length && <List />`. Pakai `items.length > 0 &&`."
    ],
    quiz: {
      'react-function-component': ["Apa itu function component React?", ["Class yang meng-extend `HTMLElement`", "Function yang menerima props dan mengembalikan JSX", "Template string berisi HTML", "Deskripsi halaman dalam JSON"], "Komponen itu fungsi biasa yang mendeskripsikan UI berdasarkan props yang masuk."],
      'each-list-item-need': ["Kenapa setiap item list butuh `key`?", ["Untuk styling CSS", "Supaya React bisa mencocokkan item antar render", "Untuk mengurutkan list", "Supaya React bisa melewati render list-nya"], "Key memberi identitas stabil agar React meng-update, memindahkan, atau menghapus baris yang tepat."],
      'child-component-change-props': ["Bisakah child component mengubah props yang diterimanya?", ["Bisa, bebas", "Tidak, props itu read-only. Ia meminta ke parent lewat callback", "Hanya kalau prop-nya object", "Bisa, tapi hanya dengan `useState`"], "Data mengalir ke bawah, dan child meminta perubahan ke atas melalui fungsi callback di props."]
    }
  },
  jsdeep: {
    terms: [
      ['Lexical closure', 'Fungsi yang terbawa bersama variabel dari lingkup tempatnya dibuat, cara hook React menyimpan state di antara render.'],
      ['Microtask queue (`Promise.then`)', 'Dikosongkan tuntas tepat setelah call stack kosong, sebelum browser mengambil timer `setTimeout` berikutnya atau menggambar layar.'],
      ['Kesetaraan Nilai vs Referensi (`===`)', 'Object seperti `{ a: 1 } === { a: 1 }` bernilai `false` kecuali kedua variabel menunjuk ke satu object yang sama di memori.']
    ],
    predict: {
      prompt: 'Apa urutan log dari `console.log(1)`, `setTimeout(() => console.log(2), 0)`, `Promise.resolve().then(() => console.log(3))`, `console.log(4)`?',
      options: ['`1, 2, 3, 4`', '`1, 4, 3, 2` (microtask diselesaikan sebelum timer)', '`1, 4, 2, 3` (timer berjalan lebih dulu dari promise)'],
      explain: 'Panggilan sinkron (`1`, `4`) jalan duluan di call stack. Berikutnya seluruh antrean microtask dikuras (`3`), baru giliran `setTimeout` (`2`) dijalankan.'
    },
    title: 'JavaScript lebih dalam: closure, this, dan event loop',
    why: "Tiga aturan ini menjawab banyak perilaku 'aneh' JavaScript. Misalnya nilai lama nyangkut di hook, `this` jadi `undefined`, atau callback async tak sesuai urutan baris.",
    points: [
      "**Closure** memasangkan fungsi dengan variabel di sekitarnya saat fungsi dibuat. Selama fungsi itu masih ada, variabel tersebut ikut bertahan hidup. Semua hook dan handler bekerja dengan cara ini.",
      "**Stale closure** menyimpan nilai variabel dari giliran lama, penyebab timer atau effect membaca state yang sudah ketinggalan.",
      "`this` ditentukan oleh **cara fungsi dipanggil**, bukan tempatnya ditulis. Menulis `obj.method()` mengikat `this` ke `obj`, sedangkan melepas metodenya bikin `this` hilang. **Arrow function** meminjam `this` dari lingkup luarnya.",
      "JavaScript berjalan di **satu thread** lewat **event loop**. Kode sinkron dirampungkan dulu, lalu **semua microtask** (`Promise.then`, kode setelah `await`) dibereskan, baru satu **task** (timer, klik, respons) diambil lalu diulang. Browser hanya menggambar ulang layar di sela task.",
      "Itu sebabnya `.then` selalu mendahului `setTimeout(..., 0)`, dan loop sinkron yang berat langsung membekukan scroll dan klik.",
      "`Promise.all` langsung gagal begitu salah satu promise gagal, sementara `Promise.allSettled` menunggu semua hasil selesai. Selalu tangani rejection supaya bug tidak hilang diam-diam."
    ],
    practice: "Tebak dulu urutan output contoh event loop, lalu cek dengan visualisasinya langkah demi langkah. Setelah itu, buat `debounce(fn, ms)` memakai closure dan jelaskan variabel timer mana yang tetap disimpan.",
    teach: "Jelaskan kenapa `Promise.resolve().then(...)` mendahului `setTimeout(..., 0)` padahal keduanya sama-sama asinkron.",
    analogy: "Bayangkan event loop sebagai satu koki dengan dua rel pesanan. Sehabis menuntaskan satu piring, koki itu menghabiskan semua tiket di rel prioritas (microtask), memasak satu tiket di rel biasa (task), lalu mengecek rel prioritas lagi.",
    pitfalls: [
      "Mengoper `obj.method` mentah-mentah sebagai callback lalu kehilangan `this`. Bungkus dalam arrow function atau `bind`.",
      "Mengira `setTimeout(fn, 0)` jalan seketika. Callback tetap harus menunggu kode saat ini dan semua microtask selesai.",
      "Stale closure di dalam effect atau `setInterval` yang terus membaca state dari render pertama.",
      "Memblokir thread utama dengan loop sinkron yang lama sehingga klik dan animasi macet total."
    ],
    quiz: {
      'both-settimeout-resolved-then': ["Antara `setTimeout(…, 0)` dan `.then` dari promise yang sudah resolved di kode sinkron yang sama, mana yang log duluan?", ["Timeout-nya", "Callback promise-nya", "Yang ditulis lebih dulu", "Tergantung browser-nya"], "Semua microtask dijalankan sampai habis sebelum event loop mengambil task berikutnya."],
      'closure-capture': ["Apa yang ditangkap oleh closure?", ["Salinan value saat closure dibuat", "Variabelnya itu sendiri, yang tetap hidup bersama function-nya", "Hanya variabel global", "Tidak ada apa-apa setelah function luarnya selesai"], "Fungsi menyimpan referensi hidup ke variabel di lingkup luarnya."],
      'assigning-const-user-hi': ["Menyimpan `const f = user.hi` lalu memanggil `f()` gagal membaca `this.name` karena…", ["`hi` sudah dihapus", "`this` bergantung pada cara pemanggilan, dan `f()` tidak punya object di depan titik", "`hi` adalah arrow function", "`name` itu private"], "Melepas method menghilangkan penerimanya, sehingga `this` menjadi `undefined` di strict mode."]
    }
  },
  state: {
    predict: {
      prompt: "Saat `count` bernilai `0`, satu handler klik memanggil `setCount(count + 1); setCount(count + 1); setCount(c => c + 1);`. Berapa nilai `count` di render berikutnya?",
      options: [
        "`1` (React mengabaikan panggilan `setCount` berulang di satu handler)",
        "`2` (kedua `count + 1` mengantrekan `1`, lalu `c => c + 1` menambah `1` ke `1`)",
        "`3` (ketiga penambahan terjumlahkan)",
      ],
      answer: 1,
      explain: "Di dalam satu render, `count` terkunci di `0`, sehingga kedua `setCount(count + 1)` sama-sama menyetel antrean ke `1`. Updater fungsi `c => c + 1` lalu menerima angka `1` tersebut dan mengembalikan `2`.",
    },
    terms: [
      ['Snapshot render', 'State seperti `count` tetap konstan selama satu giliran render. Memberi updater `c => c + 1` membaca antrean state terbaru dengan aman.'],
      ['Update state immutable', 'Membuat array atau object baru (`setItems([...items, x])`) agar `Object.is(prev, next)` melihat referensi berubah lalu memicu render.'],
      ['Derived state', 'Menghitung total atau daftar terfilter langsung saat render, ketimbang menyimpan salinan di `useState` lain yang mudah tidak sinkron.']
    ],
    title: 'State dan re-rendering',
    why: "State membuat komponen mampu mengingat nilai sekaligus memberi tahu React kapan layar harus digambar ulang. Memahami mekanismenya menjelaskan kenapa layar kadang tak mau berubah atau malah terlalu sering render.",
    points: [
      "**State** menyimpan data yang bertahan antar render: `const [count, setCount] = useState(0)`.",
      "Memanggil setter menjadwalkan **re-render**, memanggil fungsi komponen lagi lalu menyesuaikan DOM dengan bagian JSX yang berubah.",
      "Bawaannya, me-render ulang parent ikut **me-render semua child**, biarpun props mereka tidak berubah.",
      "State bekerja seperti **snapshot**. Di dalam satu render, nilai `count` terkunci tetap, jadi kirim updater (`c => c + 1`) kalau nilai baru bergantung pada nilai sebelumnya.",
      "**Jangan mutasi state langsung.** Beri salinan baru (`setItems([...items, x])`) supaya React mendeteksi referensi object yang baru.",
      "Hindari menyimpan hasil hitungan di state. Hitung total dan list terfilter langsung di badan fungsi saat render."
    ],
    practice: "Bangun komponen todo-nya. Lalu rusak dengan sengaja: ganti isi `add` dengan `todos.push(...)` diikuti `setTodos(todos)`. Lihat bahwa tidak ada yang ter-update, lalu jelaskan kenapa dari sisi reference.",
    teach: "Jelaskan langkah demi langkah apa yang terjadi sejak tombol `setCount(count + 1)` diklik sampai angka baru tampil di layar.",
    analogy: "Setiap render itu ibarat foto komponen pada satu detik tertentu, dan angka `count` di dalam foto itu membeku. Memanggil `setCount` berarti meminta React memotret ulang, bukan mengedit foto lama. Memutasi state sama seperti mencoret foto lama pakai spidol: React melihat kertas foto yang sama dan tak mengubah apa pun.",
    pitfalls: [
      "Memanggil `setCount(count + 1)` tiga kali dalam satu handler sambil berharap naik 3. Semuanya membaca snapshot yang sama.",
      "Memutasi langsung isi array atau object yang tersimpan di state.",
      "Menaruh data turunan ke hook state tambahan lalu kewalahan menjaganya tetap cocok.",
      "Membuat ID pakai `Date.now()`, yang bisa kembar di loop cepat. Pakai `crypto.randomUUID()`."
    ],
    quiz: {
      'count-click-handler-calls': ["`count` bernilai 0, lalu handler klik memanggil `setCount(count + 1)` dua kali berturut-turut. Berapa `count` pada render berikutnya?", ["0", "1", "2", "Terjadi error"], "Keduanya menghitung 0 + 1 dari snapshot render yang sama. Pakai `setCount(c => c + 1)` kalau mau jadi 2."],
      'parent-state-changes-components': ["State sebuah parent berubah. Komponen mana yang ikut re-render?", ["Hanya parent-nya", "Parent beserta semua turunannya", "Seluruh aplikasi", "Hanya child yang props-nya berubah"], "Me-render ulang komponen akan me-render subtree di bawahnya, kecuali dilewati oleh `memo` atau React Compiler."],
      'won-items-push-followed': ["Kenapa `items.push(x)` diikuti `setItems(items)` gagal memperbarui layar?", ["`push` tidak mengubah array-nya", "Reference array-nya tidak berubah, jadi React tidak melihat state baru", "`setItems` harus di-await", "React hanya melacak object, bukan array"], "React membandingkan state lewat referensi object, jadi memberi array yang sama terbaca seperti tidak ada perubahan."]
    }
  },
  effects: {
    terms: [
      ['Array dependensi (`[userId]`)', 'Cantumkan semua nilai reaktif yang dibaca di dalam `useEffect` agar React menjalankannya ulang tiap kali input itu berubah.'],
      ['Fungsi cleanup (`return () => ...`)', 'Berjalan sebelum effect berikutnya dan saat unmount, berguna untuk membersihkan timer, membatalkan request, atau mengabaikan respons lama.'],
      ['Sinkronisasi, bukan handler event', '`useEffect` menyelaraskan React dengan sistem luar seperti jaringan, WebSocket, atau DOM API. Aksi simpan saat klik tombol cukup di event handler.']
    ],
    predict: {
      prompt: 'Tanpa cleanup di `useEffect`, user berpindah cepat dari `userId = 1` (request 700 ms) ke `userId = 2` (100 ms). Apa yang tampil pada t = 700 ms?',
      options: ['User #2 tetap tampil di layar', 'User #1 menimpa User #2 (race condition)', 'React otomatis membatalkan `fetch` tanpa perlu `AbortController`'],
      explain: 'React tidak membatalkan promise `fetch()` yang masih jalan. Tanpa tanda abort atau ignore di cleanup, request #1 selesai belakangan lalu menimpa tampilan User #2.'
    },
    title: 'Effect dan data fetching',
    why: "`useEffect` paling sering bikin bingung dibanding hook mana pun. Mengerti kapan hook ini cocok untuk menyinkronkan sistem luar dan kapan salah tempat menyelamatkanmu dari infinite loop dan race condition.",
    points: [
      "Proses render harus **pure**, artinya props dan state yang sama harus menghasilkan JSX yang sama tanpa efek samping.",
      "`useEffect` jalan **sesudah** render untuk berinteraksi dengan dunia luar React seperti timer, socket, fetch jaringan, atau DOM manual.",
      "**Dependency array** mengatur kapan effect diulang: `[]` sekali saat mount, `[id]` setiap kali `id` berubah, dan tanpa array berarti jalan tiap render.",
      "Kembalikan **cleanup function** untuk membereskan efek sebelumnya, misalnya membersihkan timer, berhenti langganan, atau membatalkan fetch.",
      "Fetch manual di dalam effect butuh status loading, error, dan data plus penangkal **race condition**. Di proyek nyata, pakai TanStack Query daripada menulis fetch sendiri.",
      "Sering kali kamu **tidak butuh effect**. Hitung nilai turunan saat render, dan tangani klik langsung di event handler."
    ],
    practice: "Sambungkan komponennya ke API ASP.NET Core lalu lambatkan jaringan lewat dev tools. Klik cepat bergantian antar produk, hapus cleanup-nya sampai muncul bug data tertukar, lalu pasang lagi dan jelaskan penyebabnya.",
    teach: "Jelaskan apa fungsi dependency array di `useEffect` dan masalah apa yang dicegah fungsi cleanup.",
    analogy: "Effect itu seperti perintah buat kru panggung. Setiap adegan pindah ke N, siapkan properti adegan N, lalu bereskan properti lama sebelum adegan berikutnya mulai. Dependency array adalah daftar pemicu pergantian adegan.",
    pitfalls: [
      "Melupakan dependensi lalu membaca nilai lama, atau meng-update state yang masuk daftar dependensi hingga berputar tanpa henti.",
      "Memakai `useEffect` untuk menghitung nilai dari props atau state padahal bisa dihitung langsung saat render.",
      "Tanpa cleanup, respons request lebih awal yang datang lambat menimpa data yang lebih baru."
    ],
    quiz: {
      'useeffect-runs': ["`useEffect(() => { … }, [])` dijalankan…", ["Di setiap render", "Sekali setelah render pertama (mount)", "Tidak pernah", "Sebelum render pertama"], "Dengan dependency array kosong, tidak ada nilai yang memicu pengulangan (di mode dev, Strict Mode sengaja menjalankannya dua kali)."],
      'function-returned-effect': ["Untuk apa function yang dikembalikan dari sebuah effect?", ["Mengembalikan data ke komponen", "Cleanup sebelum effect jalan lagi dan saat unmount", "Menangani error", "Memoize effect-nya"], "Fungsi itu membereskan giliran sebelumnya: cabut listener, hapus timer, atau batalkan request."],
      'need-fullname-first-last': ["Kamu butuh `fullName` dari props `first` dan `last`. Pendekatan terbaik?", ["`useEffect` yang mengatur state", "Hitung saat render: `const fullName = first + ' ' + last`", "`useRef` yang di-update setiap render", "`useMemo` di sekeliling string-nya"], "Nilai turunan tak butuh effect maupun state tambahan yang cuma menambah render. `useMemo` untuk penggabungan string sekecil ini juga tak perlu."]
    }
  },
  forms: {
    splits: ["1 · ProductForm & useActionState","2 · Catalog (State Diangkat)"],
    terms: [
      ['Controlled input', 'Elemen `<input value={val} onChange={...} />` yang dikendalikan state React daripada baru membaca isi DOM saat submit.'],
      ['Lifting state up', 'Memindah state bersama ke parent bersama terdekat agar dua komponen bersaudara tetap sinkron lewat props.'],
      ['Komposisi (`children`)', 'Mengoper JSX via `<Modal>{content}</Modal>` daripada menumpuk banyak props konfigurasi agar komponen parent tetap renggang.']
    ],
    title: 'Form, lifting state, dan komposisi',
    why: "Aplikasi nyata banyak berisi form dan daftar yang berbagi state. Mengetahui di mana state seharusnya berada dan bagaimana komponen saudara saling sinkron bikin struktur kode tetap bersih dan mudah dirawat.",
    points: [
      "Form React 19 mendukung **Action** lewat `<form action={…}>`. Memanggil `useActionState` memberi hasil error dan status `isPending`, sementara isi input masuk sebagai `FormData`.",
      "React otomatis mengosongkan input uncontrolled setelah action beres. Kembalikan nilai kiriman lalu pasang di `defaultValue` supaya error validasi tak menghapus ketikan user.",
      "**Controlled input** menerima `value` dari state dan melapor perubahan lewat `onChange`. Pakai ini kalau perlu bereaksi di tiap ketikan, misalnya pencarian langsung.",
      "Saat dua komponen saudara butuh data sama, **angkat state-nya** ke parent bersama terdekat. Child meminta pembaruan lewat callback props (data ke bawah, event ke atas).",
      "Hubungkan pesan error ke input-nya lewat `aria-invalid` dan `aria-describedby` supaya pembaca layar membacakan error bersama field terkait.",
      "Untuk form besar, gabungkan React Hook Form dengan library validasi schema seperti Zod agar satu aturan mengurus validasi sekaligus tipe TypeScript."
    ],
    practice: "Tambahkan kotak pencarian dan daftar produk sebagai dua komponen bersaudara. Tentukan di mana teks pencarian harus disimpan, hubungkan dengan controlled input, lalu tulis satu kalimat alasannya. Setelah itu, submit form dengan nama kosong dan pastikan harga yang sudah diketik tak ikut hilang.",
    teach: "Jelaskan konsep 'lifting state up' memakai contoh dua komponen saudara yang butuh menampilkan data sama.",
    analogy: "Dua anak memakai satu kotak krayon yang sama. Kalau tiap anak memegang kotak masing-masing, gambar mereka tak akan cocok. Berikan kotaknya ke orang tua yang membagikan krayon ke bawah dan menerima permintaan warna dari bawah. Satu kotak, satu sumber kebenaran.",
    pitfalls: [
      "Menyalin props ke `useState` lalu bingung saat pembaruan dari parent tidak ikut tampil.",
      "Mengangkat semua state ke root aplikasi 'buat jaga-jaga', akibatnya seluruh layar re-render di tiap ketikan.",
      "Berubah-ubah antara `value={undefined}` dan string pada satu input yang sama, memicu peringatan controlled vs uncontrolled.",
      "Menaruh teks error di dekat input tanpa menyambung `aria-describedby`, membuat pengguna screen reader tidak pernah mendengarnya."
    ],
    quiz: {
      'two-sibling-components-show': ["Dua komponen bersebelahan harus menampilkan value yang sama. Di mana state-nya seharusnya tinggal?", ["Di kedua komponen", "Di parent bersama terdekat mereka", "Di variabel level module", "Di `localStorage`"], "Satu pemilik menyalurkan nilai ke keduanya supaya otomatis selalu seragam."],
      'child-update-state-owned': ["Bagaimana child meng-update state milik parent-nya?", ["Mengubah prop-nya", "Memanggil callback function yang dikirim sebagai prop", "Membaca state parent dengan `useContext`", "Tidak bisa"], "Parent memberi fungsi callback lewat props dan child memanggilnya agar event naik ke atas."],
      'form-action-returns-validation': ["Sebuah form action mengembalikan error validasi, dan field-nya kembali kosong. Kenapa?", ["Action-nya memicu error", "React mengosongkan input uncontrolled sesudah action, jadi kembalikan datanya lalu pasang sebagai `defaultValue`", "`useActionState` hanya menyimpan field terakhir", "Form-nya butuh `method=\"post\"`"], "Reset otomatis membaca `defaultValue` tiap input, jadi memberi nilai kiriman sebelumnya menjaga ketikan user tetap ada."],
      'controlled-input-one-whose': ["Input yang 'controlled' adalah input yang…", ["value-nya berasal dari state React", "value-nya hanya ada di DOM", "type-nya `password`", "perubahannya dinonaktifkan"], "State menjadi sumber utama: `onChange` mengubah state, lalu state mengisi `value`."]
    }
  },
  generics: {
    terms: [
      ['Batasan generik (`<T extends { id: number }>`)', 'Membatasi parameter tipe agar minimal punya struktur tertentu sembari mempertahankan tipe penuhnya saat kembali.'],
      ['`Pick` / `Omit` / `Partial`', 'Utility type bawaan untuk menurunkan `CreateProduct` (`Omit<Product, "id">`) atau `UpdateProduct` langsung dari satu interface utama.'],
      ['`keyof T` & Akses terindeks (`T[K]`)', 'Menjamin helper (`groupBy(items, key)`) menolak nama properti sembarangan dan tahu persis tipe nilai yang kembali.']
    ],
    title: 'Generics dan utility type di TypeScript',
    why: "Generics membuat satu function, hook, atau komponen bisa dipakai ulang untuk bermacam data tanpa kehilangan keamanan tipe. Utility type menurunkan bentuk baru dari tipe yang ada supaya frontend dan API tetap kompak.",
    points: [
      "**Generic** adalah parameter tipe seperti `function first<T>(items: T[]): T | undefined`. Tipe konkret dari pemanggil ikut terbawa sampai ke hasil kembalian.",
      "Tambahkan batasan lewat `extends`: `<T extends { id: number }>` menerima tipe apa pun selama punya `id` bertipe number.",
      "`keyof T` membentuk union dari semua nama properti `T`, sementara `T[K]` mengambil tipe milik properti `K`.",
      "Utility type menghasilkan bentuk turunan: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `ReturnType<F>`, dan `Awaited<T>`.",
      "Komponen generic seperti `function List<T>({ items, render }: ListProps<T>)` cocok untuk bentuk item apa saja.",
      "Turunkan tipe baru daripada menyalin manual: `type CreateProduct = Omit<Product, 'id'>` takkan melenceng dari `Product`."
    ],
    practice: "Di playground, tulis `groupBy<T, K extends keyof T>(items: T[], key: K)` yang mengembalikan `Map<T[K], T[]>`. Lalu tulis signature hook `useLocalStorage<T>(key, initial)` dan sebutkan tipe `T` di dua tempat pemanggilan berbeda.",
    teach: "Jelaskan arti `<T>` pada `function first<T>(items: T[]): T` dan kenapa cara ini jauh lebih baik dari `any`.",
    analogy: "Generic itu amplop berlabel: apa pun jenis surat yang kamu masukkan, keluarnya terjamin masih jenis yang sama. Sebaliknya, `any` adalah amplop polos yang bisa membuat penerima mengira selembar cek adalah daftar belanja.",
    pitfalls: [
      "Menambah parameter tipe yang cuma dipakai sekali. Generic baru berguna saat menghubungkan dua hal, misalnya input dan nilai kembali.",
      "Menulis ulang tipe yang nyaris kembar ketimbang menurunkannya pakai `Pick`, `Omit`, atau `Partial`.",
      "Mengira `getJson<Product[]>` ikut mengecek isi respons API. Itu cuma asersi tipe, jadi tetap validasi data dari jaringan memakai Zod."
    ],
    quiz: {
      'omit-product-id': ["Apa itu `Omit<Product, 'id'>`?", ["Product yang hanya berisi `id`", "Product tanpa property `id`", "Product dengan `id` yang dijadikan opsional", "Function yang menghapus `id` saat runtime"], "`Omit` membuat tipe tanpa key yang disebut. Tipe tidak pernah jalan saat runtime, jadi object aslinya tidak berubah."],
      'extends-keyof': ["Di `<T, K extends keyof T>`, `K` boleh berisi apa?", ["String apa pun", "Hanya nama property dari `T`", "Type apa pun", "Type dari salah satu value T"], "`keyof T` berisi gabungan semua nama properti `T`, dan `K` wajib termasuk di situ."],
      'what-does-partial-t': ["Apa yang dilakukan `Partial<T>`?", ["Menjadikan setiap property opsional", "Menjadikan setiap property wajib", "Menjadikan setiap property nullable", "Menjadikan `T` readonly"], "Semua properti mendapat tanda `?`, pas untuk payload update sebagian."]
    }
  },
  hooks: {
    splits: ["1 · Hook useDebounced","2 · cartReducer Bertipe","3 · CartContext & Provider"],
    predict: {
      prompt: "Komponen `<Header />` dan `<Sidebar />` sama-sama memanggil `useDebounced(query, 300)` dari modul yang sama. Saat `<Header />` mengubah input-nya, apa yang terjadi pada state debounce milik `<Sidebar />`?",
      options: [
        "`<Sidebar />` ikut ter-update karena keduanya memanggil custom hook yang sama",
        "`<Sidebar />` tidak terpengaruh karena tiap pemanggil komponen mendapat state hook terpisah",
        "React melempar error karena satu custom hook dipanggil di dua komponen",
      ],
      answer: 1,
      explain: "Custom hook hanya berbagi *logika* stateful, bukan state-nya. Setiap pemanggilan `useDebounced()` mendaftarkan slot `useState` dan `useEffect` sendiri di Fiber masing-masing komponen.",
    },
    terms: [
      ['Custom hook (`useX`)', 'Fungsi TypeScript biasa berisi logika hook stateful agar komponen lain bisa memakainya ulang tanpa elemen pembungkus tambahan.'],
      ['`useReducer`', 'Mengumpulkan transisi state kompleks ke satu fungsi `switch (action.type)` di luar JSX komponen.'],
      ['Context (`createContext`)', 'Menyalurkan data tema atau user jauh ke dalam pohon komponen tanpa harus mengoper props di tiap lapis tengah.']
    ],
    title: 'Custom hook, context, dan reducer',
    why: "Makin besar aplikasi, logika perlu dipakai bersama tanpa salin-tempel dan data perlu menjangkau komponen dalam tanpa mengoper props sepuluh lapis. Custom hook, context, dan reducer menyelesaikan keduanya.",
    points: [
      "**Custom hook** adalah fungsi bernama `useX` yang memanggil hook bawaan React. Ia membagi **logika**, bukan state, jadi tiap pemanggil mendapat state sendiri.",
      "Panggil hook hanya di tingkat paling atas komponen atau custom hook, jangan di dalam `if` atau loop. React bergantung pada urutan panggilan yang sama di tiap render.",
      "**Context** mengalirkan nilai ke turunan tanpa prop drilling, cocok untuk data jarang berubah seperti tema, user aktif, atau bahasa. Di React 19, cukup render `<MyContext value={…}>` langsung.",
      "Setiap konsumen ikut re-render saat isi context berubah, jadi jaga kestabilan nilainya (`useMemo` bila perlu) dan pisahkan data yang tak berkaitan ke context lain.",
      "`useReducer` merapikan update state bercabang menjadi satu fungsi `(state, action) => newState`. Menulis action sebagai discriminated union membuat typo tertangkap saat kompilasi.",
      "`useRef` menyimpan kotak `.current` yang bisa diubah tanpa memicu re-render, cocok untuk node DOM, ID timer, atau nilai render sebelumnya."
    ],
    practice: "Ekstrak pengambilan produk ke `useProducts(search)` dengan pencarian yang diberi jeda. Tambahkan keranjang belanja memakai reducer dan context, lalu tampilkan jumlah item di header tanpa memberi props ke header tersebut.",
    teach: "Jelaskan kenapa dua komponen yang sama-sama memanggil satu custom hook tidak saling berbagi state.",
    analogy: "Custom hook itu resep masakan, bukan piring makanannya. Dua orang yang memasak dari resep sama tetap punya piring masing-masing.",
    pitfalls: [
      "Mengira custom hook otomatis berperan seperti store global bersama.",
      "Menaruh state yang sering berubah ke dalam satu context raksasa sehingga seluruh halaman ikut re-render terus.",
      "Membuat object `{ … }` baru di prop value context tiap kali render, bikin semua konsumen re-render setiap saat.",
      "Memanggil hook di dalam blok `if`, yang merusak urutan indeks hook React."
    ],
    quiz: {
      'two-components-both-call': ["Dua komponen sama-sama memanggil `useCounter()`. Keduanya…", ["berbagi satu counter", "masing-masing mendapat state sendiri", "memicu error", "berbagi sampai salah satunya unmount"], "Custom hook cuma membagi logika, sementara state melekat ke komponen pemanggilnya."],
      'hooks-called-inside-conditions': ["Kenapa hook tidak boleh dipanggil di dalam kondisi?", ["Jadi lebih lambat", "React mengenali hook lewat urutan pemanggilannya, yang harus cocok di setiap render", "TypeScript melarangnya", "Hook-nya jadi jalan dua kali"], "React menyimpan state berdasarkan urutan posisi panggilan hook, jadi melewatkan satu panggilan bikin hook sesudahnya bergeser."],
      'changing-useref-value-current': ["Mengubah `.current` dari sebuah `useRef`…", ["me-render ulang komponennya", "tidak memicu re-render", "memicu error di Strict Mode", "me-reset state komponennya"], "Ref adalah kotak variabel biasa di luar siklus render React."]
    }
  },
  perf: {
    predict: {
      prompt: "Tanpa React Compiler, `<ProductRow>` dibungkus `memo`, lalu `<Catalog>` merender `<ProductRow key={r.id} row={r} onSelect={(id) => setSelected(id)} />`. Saat user mengetik di kotak cari, apakah baris yang tidak berubah melewati re-render?",
      options: [
        "Ya, karena `r` masih object yang sama dan `memo` mengabaikan prop fungsi",
        "Tidak, karena `(id) => setSelected(id)` membuat referensi fungsi baru di setiap render `<Catalog>`",
        "Hanya baris pertama yang re-render",
      ],
      answer: 1,
      explain: "`memo` membandingkan setiap prop dengan `Object.is`. Arrow function inline selalu menghasilkan referensi baru di tiap render parent (`prevOnSelect !== nextOnSelect`), mematahkan `memo` kecuali distabilkan lewat `useCallback` (atau React Compiler).",
    },
    terms: [
      ['`React.memo`', 'Melewati re-render child saat semua props cocok di permukaan lewat `Object.is`. Object atau fungsi inline baru bakal menggagalkannya kecuali distabilkan.'],
      ['`useCallback` & `useMemo`', 'Menahan referensi fungsi atau object antar render, cukup dipakai bila profiling membuktikan child atau kalkulasi berat memang butuh.'],
      ['`useTransition` / kolokasi state', 'Menurunkan state cepat-berubah ke child yang butuh serta menandai filter berat non-mendesak agar ketikan tetap mulus.']
    ],
    title: 'Performance rendering',
    why: "React bawaannya sudah cepat, dan optimasi sebelum waktunya malah bikin kode susah dibaca tanpa hasil nyata. Ukur dulu lewat profiler, baru benahi titik yang benar-benar lambat.",
    points: [
      "**Render** berarti React memanggil fungsi komponenmu, sementara **commit** berarti memperbarui DOM. Render biasanya ringan kecuali isinya berat atau terpicu berlebihan.",
      "**Ukur dulu** memakai Profiler di React DevTools untuk melihat komponen mana yang render, apa pemicunya, dan berapa durasinya.",
      "**React Compiler** otomatis me-memoize komponen, nilai, dan callback saat build. Saat aktif, kamu jarang perlu menulis `memo` atau `useCallback` sendiri asalkan fungsi render tetap pure.",
      "Perbaikan struktural itu gratis. Turunkan state ke komponen yang benar-benar butuh, atau oper subtree berat lewat `children` supaya tidak ikut ter-render ulang.",
      "Jika tanpa compiler, bungkus child panas dengan `memo` lalu stabilkan props memakai `useCallback` atau `useMemo`. Membuat fungsi atau object baru di render diam-diam menembus `memo`.",
      "Untuk daftar ribuan baris, pakai **virtualisasi** agar hanya baris yang terlihat di layar yang dipasang ke DOM. Pecah rute besar lewat `lazy` dan `Suspense`."
    ],
    practice: "Render 5.000 baris dengan kotak pencarian lalu rekam ketikan di Profiler. Pasang `memo` plus callback stabil, lalu virtualisasi, sambil mencatat jumlah komponen per ketikan tiap langkah. Terakhir hapus hook manual itu, aktifkan React Compiler, dan ukur ulang.",
    teach: "Jelaskan kenapa membungkus komponen dengan `memo` kadang tidak mengurangi hitungan render sama sekali.",
    analogy: "`memo` bekerja mirip penjaga pintu yang bertanya apakah isi kirimanmu berubah dari kemarin. Kalau tiap datang kamu selalu membawa kardus baru, si penjaga tetap menganggapnya berbeda biarpun isinya sama. `useCallback` dan `useMemo` mengoper kardus yang sama, dan React Compiler mengotomatiskan itu.",
    pitfalls: [
      "Membungkus semua hal dengan `useMemo`/`useCallback` tanpa mengukur dulu.",
      "`memo` percuma gara-gara prop inline `{}` / `[]` / `() => {}`.",
      "Sibuk mengutak-atik render padahal sumber lambatnya bundle JS 2 MB atau query API yang lemot.",
      "Memutasi object saat render, sehingga React Compiler tidak bisa mengoptimasinya dengan aman."
    ],
    quiz: {
      'memoized-child-receives-onclick': ["Sebuah child yang di-memoize menerima `onClick={() => select(id)}` dari parent-nya, tanpa React Compiler. Apakah `memo` melewati re-render?", ["Ya", "Tidak: function baru dibuat di setiap render, jadi props-nya berbeda", "Hanya di production", "Hanya untuk child pertama"], "Pengecekan dangkal selalu melihat referensi fungsi yang baru dibuat setiap render."],
      'react-compiler-enabled-still': ["React Compiler aktif. Apakah kamu masih butuh `useCallback` di sekeliling event handler?", ["Ya, di semua tempat", "Biasanya tidak: compiler otomatis me-memoize-nya", "Hanya untuk handler yang memanggil `setState`", "Hanya di dalam class component"], "Compiler menambahkan memoization itu waktu build selama kode mematuhi aturan React."],
      'first-step-react-screen': ["Langkah pertama saat sebuah layar React terasa lambat?", ["Bungkus semuanya dengan `useMemo`", "Profiling untuk melihat apa yang render dan berapa lama", "Pindahkan semua state ke context", "Ganti `useState` dengan `useReducer`"], "Tanpa mengukur, kamu cuma menebak komponen atau langkah mana yang boros."],
      'fix-list-20-000': ["Perbaikan terbaik untuk list berisi 20.000 baris?", ["`memo` di setiap baris", "Virtualisasi: render hanya baris yang terlihat", "`useCallback` untuk setiap handler", "Memakai index sebagai `key`"], "Menghindari pembuatan 20.000 node DOM jauh lebih berdampak daripada mempercepat re-render-nya."]
    }
  },
  server: {
    splits: ['1 · Helper ApiError & api()', '2 · Query & Mutasi ProductsPage'],
    terms: [
      ['Server state vs Client state', 'Data backend bersifat asinkron, dipakai ramai-ramai, dan bisa di-cache. Mengelolanya di TanStack Query menghapus salinan lokal yang tertinggal.'],
      ['`useQuery` & `invalidateQueries`', '`useQuery` menyimpan cache per `queryKey`. Sesudah `useMutation` menyimpan perubahan, invalidation menyegarkan layar terkait otomatis.'],
      ['Peta error per field `ProblemDetails`', 'Memetakan JSON validasi ASP.NET Core `400` (`errors.Name[0]`) langsung menjadi pesan error aksesibel di samping field lewat `aria-describedby`.']
    ],
    title: 'Server state, routing, dan berkomunikasi dengan API-mu',
    why: "Di sini semua bagian bertemu: layar React memanggil endpoint ASP.NET Core yang mengolah database SQL. Mengurus caching, validasi error, auth, dan kontrak tipe di lapisan ini penting di hampir setiap aplikasi nyata.",
    points: [
      "**Server state** tinggal di backend, beda sifatnya dari **client state** lokal. Ia datang lewat jaringan asinkron, bisa berubah tanpa sepengetahuanmu, dan perlu masa kedaluwarsa.",
      "TanStack Query memberi caching, deduplikasi request, retry, dan status loading agar kamu tak perlu menulis fetch manual di `useEffect`. Bungkus aplikasi sekali di `<QueryClientProvider>`.",
      "**Query** membaca dan menyimpan cache per key, sedangkan **mutation** mengirim perubahan lalu **meng-invalidate** query terkait supaya data daftar ikut segar.",
      "Petakan `ProblemDetails` dari ASP.NET langsung ke UI: tampilkan `title` untuk pesan umum dan `errors` di samping field form yang salah.",
      "**Router** seperti React Router atau TanStack Router menautkan URL ke komponen halaman. Taruh kondisi yang pantas dibagikan seperti halaman, filter, dan ID terpilih di URL.",
      "Jaga kontrak API dengan men-generate tipe TypeScript dari dokumen **OpenAPI** ketimbang mengetik ulang class DTO C# dengan tangan.",
      "Untuk autentikasi SPA, pilih cookie `HttpOnly`, `Secure`, `SameSite` lewat pola BFF ketimbang token di `localStorage`. Karena cookie terkirim otomatis, lindungi request tulis dari CSRF memakai token antiforgery atau custom header."
    ],
    practice: "Hubungkan aplikasi React-mu ke API ASP.NET Core dengan TanStack Query: list, create, delete. Kirim produk yang tidak valid dan pastikan pesan validasi dari server muncul di samping field yang tepat. Generate type TypeScript dari dokumen OpenAPI milik API lalu hapus salinan yang kamu tulis sendiri.",
    teach: "Jelaskan perbedaan server state dan client state, serta efek dari meng-invalidate sebuah query.",
    analogy: "Server state itu seperti buku perpustakaan. Kamu memegang salinan pinjaman, tapi perpustakaan yang punya edisi master yang mungkin baru direvisi orang lain. Cache query adalah rak pinjamanmu yang bertempel tanggal kadaluwarsa. Meng-invalidate artinya melapor ke petugas bahwa kamu baru mengirim revisi dan minta diambilkan cetakan terbaru.",
    pitfalls: [
      "Menyalin hasil fetch ke `useState` lalu terjebak merawat dua versi data yang mudah tertinggal.",
      "Menaruh access token di `localStorage` sehingga skrip XSS apa pun bisa mencurinya.",
      "Memasang header `Content-Type: application/json` di request GET, memicu preflight CORS tambahan yang tak perlu.",
      "Menyebar opsi pemanggil sesudah `headers` default sehingga header tambahan tak sengaja menimpa `Content-Type`.",
      "Memperbarui DTO TypeScript terpisah dari class C# sampai lama-kelamaan tidak cocok."
    ],
    quiz: {
      'successful-create-product-mutati': ["Setelah mutation 'create product' berhasil, bagaimana seharusnya list produk ter-update?", ["Ter-update sendiri", "Invalidate query list-nya supaya di-refetch", "Muat ulang halaman", "`push` item baru ke array di cache"], "Invalidation menandai cache sudah lewat masa lalu mengambil data segar dari server. Mengubah cache langsung melewati pelacakan perubahan."],
      'belongs-url-than-component': ["Mana yang tempatnya di URL, bukan di state komponen?", ["Apakah dropdown sedang terbuka", "Nomor halaman dan filter sebuah list", "Input yang baru setengah diketik", "State hover"], "Tampilan yang pantas dibagikan atau di-bookmark sebaiknya tetap bertahan saat halaman dimuat ulang."],
      'spa-signs-httponly-cookie': ["SPA-mu login dengan cookie `HttpOnly`. Apa lagi yang dibutuhkan operasi penulisan?", ["Tidak ada: `HttpOnly` memblokir semua serangan", "Perlindungan CSRF, seperti antiforgery token atau custom header yang wajib ada", "Token di `localStorage` juga", "`credentials: \"omit\"` di setiap request"], "Browser mengirim cookie ke API di setiap request, termasuk yang dipicu situs lain. Itu alasan utama butuh pelindung CSRF."],
      'robust-way-keep-typescript': ["Cara paling andal menjaga type TypeScript tetap selaras dengan API C#?", ["Salin manual", "Generate dari dokumen OpenAPI milik API", "Pakai `any` untuk response API", "Bagikan file `.d.ts` lewat Slack"], "Tipe hasil generate ikut berubah mengikuti API dan langsung menggagalkan build jika frontend tertinggal."]
    }
  },
  tsadv: {
    terms: [
      ['Conditional type (`T extends U ? X : Y`)', 'Memilih tipe hasil berdasarkan bentuk tipe masukan, cara `Awaited<T>` dan `ReturnType<F>` bekerja di balik layar.'],
      ['Mapped type (`{ [K in keyof T]: ... }`)', 'Mengubah tiap properti interface dengan pola teratur, pas untuk kamus pesan error form yang ketat.'],
      ['`infer` & Template literal type', 'Menarik sub-tipe di dalam pencocokan (`infer R`) dan memvalidasi pola string seperti `\`/api/${string}\`` saat kompilasi.']
    ],
    title: 'Type tingkat lanjut: conditional, mapped, dan inferred',
    why: "Sistem tipe TypeScript ibarat bahasa kecil yang berjalan saat kompilasi. Dipakai secukupnya, ia menutup celah bug sebelum kode jalan. Dipakai berlebihan, rekan tim akan kesusahan membaca dan mengubahnya.",
    points: [
      "**Conditional type** bercabang menurut bentuk tipe (`T extends U ? X : Y`). Bila diberikan ke union, ia otomatis tersebar ke setiap anggotanya.",
      "`infer` mengekstrak bagian tipe di dalam syarat kondisi, seperti `T extends Promise<infer R> ? R : T` (dasar dari `Awaited<T>`).",
      "**Mapped type** menelusuri setiap properti (`{ [K in keyof T]: … }`), lalu menambah `readonly`, menaruh `?`, atau mengganti nama key memakai `as`.",
      "**Template literal type** menyusun pola string memakai backtick, berguna menurunkan nama event atau pola route langsung dari daftar key.",
      "`never` menandakan himpunan nilai kosong. Meng-assign ke variabel `never` pada cabang `default` memberi **pengecekan kelengkapan**, mematahkan build jika ada opsi union yang terlewat.",
      "`satisfies` mengecek kecocokan literal **tanpa memperlebar** tipenya, sedangkan `as const` membekukan nilai literal. Utamakan keduanya sebelum memakai cast `as`."
    ],
    practice: "Tulis `DeepReadonly<T>`, serta `PathParams<'/users/:id/posts/:postId'>` yang menghasilkan `{ id: string, postId: string }`. Lalu tuliskan dalam satu paragraf apakah kamu mau menerima `PathParams` ke repo tim dan alasannya.",
    teach: "Jelaskan bagaimana meng-assign ke variabel `never` pada cabang `default` menangkap opsi union yang terlupa saat build.",
    analogy: "Tipe dasar itu seperti stiker label di kotak. Tipe tingkat lanjut adalah mesin cetak label yang membaca satu tipe lalu memproduksi tipe turunan lain. Sementara `never` adalah celah sempit yang tak bisa dimasuki nilai apa pun, jadi sisa cabang yang tertinggal langsung tertangkap compiler.",
    pitfalls: [
      "Merangkai akrobat tipe yang tak ada rekan tim sanggup merawatnya. Kode jelas menang dari tipe pintar.",
      "Menyumpal error tipe sah memakai `as` ketimbang membereskan akar bug-nya.",
      "Lupa conditional type tersebar ke anggota union lalu kaget melihat tipe hasilnya.",
      "Menulis ulang utilitas yang sudah disediakan TypeScript seperti `Awaited`, `NonNullable`, atau `ReturnType`."
    ],
    quiz: {
      'extends-promise-infer-promise': ["Apa hasil `T extends Promise<infer R> ? R : T` untuk `T = Promise<string>`?", ["`Promise<string>`", "`string`", "`never`", "`unknown`"], "`infer R` mengambil tipe nilai yang keluar saat promise selesai."],
      'satisfies-type-annotation-doesn': ["Apa yang dilakukan `satisfies` yang tidak dilakukan anotasi type?", ["Mengecek value-nya saat runtime", "Mengecek kecocokan sambil mempertahankan type sempit hasil inference", "Membuat value-nya bisa diubah", "Mematikan pengecekan untuk value itu"], "Anotasi biasa memperlebar tipe, sedangkan `satisfies` mengecek bentuk sembari mempertahankan tipe literalnya."],
      'new-member-added-union': ["Anggota baru ditambahkan ke union yang ditangani `switch` dengan `const x: never = value` di `default`. Hasilnya?", ["Bug diam-diam saat runtime", "Compile error sampai case baru itu ditangani", "Tidak ada apa-apa", "Case barunya jatuh ke case pertama"], "Cabang yang belum ditangani tak bisa masuk ke `never`, jadi build gagal persis di lokasi yang kurang."]
    }
  },
  internals: {
    predict: {
      prompt: "Parent merender `{isAdmin ? <EditForm user={admin} /> : <EditForm user={guest} />}` tanpa prop `key`. Saat `isAdmin` berubah dari `true` ke `false`, apa yang terjadi pada teks draf di dalam `useState` milik `EditForm`?",
      options: [
        "Otomatis ter-reset kosong karena berada di cabang ternary berbeda",
        "Tetap bertahan membawa draf lama milik admin karena tipe komponen yang sama berada di posisi tree yang sama",
        "React memunculkan peringatan rekonsiliasi",
      ],
      answer: 1,
      explain: "React mencocokkan berdasarkan posisi tree, tipe elemen, dan `key`—bukan cabang `?:` mana yang mengembalikan JSX. Posisi dan tipe `EditForm` yang sama membuat state Fiber lama tetap dipakai kecuali diberi `key={user.id}`.",
    },
    terms: [
      ['Pohon Fiber (unit kerja)', 'Struktur pohon internal React penyimpan state dan hook agar proses render bisa dijeda, dilanjutkan, atau dibatalkan sesuai prioritas.'],
      ['Rekonsiliasi (render vs commit)', 'Render menghitung selisih UI di JavaScript. Commit menerapkan perubahan DOM minimal sekaligus agar layar tak tampil setengah jadi.'],
      ['Pemanggilan ganda `StrictMode`', 'Pemeriksaan mode dev yang memanggil render dan effect dua kali untuk langsung menangkap efek samping atau cleanup yang tertinggal.']
    ],
    title: 'Internal React: reconciliation dan concurrency',
    why: "State yang hilang tiba-tiba, effect jalan dua kali, dan tampilan patah-patah tampak acak sampai kamu tahu cara React menjadwalkan kerja. Beberapa aturan inti menjelaskan semua gejalanya.",
    points: [
      "Render menyusun pohon **element** berupa object biasa. **Reconciliation** membandingkannya dengan pohon sebelumnya untuk mencari ubahan DOM paling minimal.",
      "Dua aturan berlaku: mengganti **tipe element** di posisi sama membongkar seluruh subtree-nya, dan **key** memadankan anak saat urutan bergeser. State menempel ke posisi + tipe + key.",
      "Mengganti `key` komponen sengaja **mengulang state-nya** dari nol, trik yang praktis saat dibutuhkan dan menjebak bila terjadi tanpa sengaja.",
      "**Fiber** membagi kerja render ke unit yang bisa dijeda, dilanjutkan, atau dibatalkan. **Fase render** harus murni dan boleh terputus, sedangkan **fase commit** mengubah DOM sekaligus.",
      "`useTransition` dan `useDeferredValue` menandai update tidak mendesak agar ketikan tetap lancar. `Suspense` memasang tampilan cadangan saat loading, dan `use(promise)` membaca data async di dalamnya.",
      "Di development, Strict Mode menjalankan render dua kali dan memasang-cabut effect lagi untuk memancing bug efek samping. Server Components berjalan hanya di server tanpa mengirim JS komponen ke browser."
    ],
    practice: "Bangun komponen tab yang me-render `<Counter />` di dua cabang pada posisi yang sama, dan lihat state-nya bertahan saat berpindah. Lalu beri masing-masing `key` yang berbeda dan jelaskan perubahannya dari sisi reconciliation.",
    teach: "Jelaskan kenapa mengganti `key` pada sebuah komponen langsung mengulang state-nya dari awal.",
    analogy: "Reconciliation itu mirip petugas teater membandingkan denah kursi malam ini dengan malam kemarin. Kursi sama dan jenis tamu sama: biarkan duduk, cukup perbarui tiketnya. Jenis tamu di kursi itu berganti: kosongkan seluruh barisnya dulu. `key` adalah papan nama agar petugas bisa mengikuti tamu yang pindah kursi.",
    pitfalls: [
      "Mendeklarasikan komponen di dalam komponen lain sehingga tiap render terbaca tipe baru dan state-nya terus terhapus.",
      "Menaruh efek samping di badan fase render yang bisa dipanggil ulang berkali-kali.",
      "Mengira pemanggilan ganda Strict Mode itu bug lalu mematikannya."
    ],
    quiz: {
      'same-position-div-replaced': ["Di posisi yang sama, sebuah `<div>` diganti dengan `<section>` yang child-nya identik. React akan…", ["mengubah tag-nya di tempat", "menghancurkan subtree lama dan membangun yang baru, sehingga state child-nya hilang", "mengabaikan perubahannya", "memicu error"], "Tipe element yang berbeda menandakan pohon baru, jadi React membongkar subtree lama bukannya memakai ulang."],
      'usetransition-let': ["Apa yang bisa dilakukan dengan `useTransition`?", ["Menganimasikan CSS", "Menandai update state sebagai tidak mendesak supaya update yang mendesak bisa menyelanya", "Mengambil data di background", "Melewati render sebuah komponen"], "Transition menjaga ketikan dan klik tetap responsif selama render berat disiapkan."],
      'strict-mode-run-effects': ["Kenapa Strict Mode menjalankan effect dua kali saat development?", ["Itu bug di build development", "Untuk mengungkap effect yang tidak punya cleanup yang benar", "Untuk memuat data dua kali demi kecepatan", "Karena Strict Mode juga me-render di server"], "Simulasi mount, unmount, lalu mount ulang menguji logika cleanup sejak dini."]
    }
  },
  arch: {
    splits: ["1 · Setup Server MSW","2 · Helper Query & Uji User"],
    terms: [
      ['Test berorientasi pengguna (`render` + `userEvent`)', 'Menguji komponen dari sisi pengguna lewat role dan label (`getByRole("button")`) ketimbang mengintip state internal komponen.'],
      ['Mocking API (`MSW`)', 'Mencegat `fetch` di batas jaringan supaya test menjalankan serialisasi, validasi, dan status error HTTP sungguhan.'],
      ['Gerbang aksesibilitas inti (`axe-core`)', 'Mengecek landmark semantik, navigasi keyboard, label input, dan pesan error `role="alert"` otomatis per fitur.']
    ],
    title: 'Arsitektur frontend, testing, dan aksesibilitas',
    why: "Frontend yang tangguh bisa diubah tim dengan percaya diri selama bertahun-tahun sekaligus nyaman dipakai semua orang. Itu butuh batas modul yang jelas, test yang tahan refactor, dan aksesibilitas sejak awal.",
    points: [
      "Kelompokkan state sebelum memilih library: taruh **server state** di cache query, **URL state** di router, dan **state UI lokal** di `useState`. Client state yang sering berubah dan dibagi banyak layar baru masuk Zustand atau context.",
      "Susun folder per **fitur** (`features/cart/…`) ketimbang jenis file, pisahkan UI bersama, dan kunci batasnya lewat aturan lint.",
      "Uji **alur pengguna nyata** dengan React Testing Library: cari elemen lewat role dan label, klik pakai `userEvent`, lalu mock `fetch` di jaringan dengan MSW.",
      "Test Vitest memakai environment `jsdom`, `@testing-library/jest-dom/vitest` untuk matcher seperti `toBeInTheDocument`, dan provider asli aplikasi seperti `QueryClientProvider`.",
      "Tambahkan beberapa test **end-to-end** Playwright untuk alur paling penting yang menembus frontend, API, hingga database asli.",
      "Bangun **aksesibilitas** mulai dari HTML semantik. Beri label tiap input, dukung penuh navigasi keyboard dengan fokus terlihat, jaga kontras warna, lalu cek dengan pembaca layar.",
      "Pantau Core Web Vitals (LCP, INP, CLS), pecah rute memakai lazy load, optimasi gambar, dan pasang batas ukuran bundle di CI."
    ],
    practice: "Tulis test ini untuk halaman produkmu sendiri, lalu ubah nama komponen dan hook internalnya tanpa menyentuh file test. Kalau test-nya patah, berarti test itu menempel ke implementasi. Akhiri dengan menjelajahi seluruh halaman memakai keyboard saja.",
    teach: "Jelaskan kenapa UI test yang mencari elemen lewat role dan label lebih tahan refactor daripada mengecek state internal.",
    analogy: "UI test yang bagus itu seperti mystery shopper. Mereka masuk, belanja layaknya pelanggan biasa, lalu melaporkan pengalaman mereka tanpa peduli bagaimana gudang belakang kamu tata ulang.",
    pitfalls: [
      "Menumpuk data API dan isi input form ke dalam satu store global raksasa.",
      "Mengandalkan snapshot test rapuh atau mengecek hook internal yang patah di setiap refactor ringan.",
      "Memasang `onClick` ke `div` atau `li` daripada memakai `button`, yang memutus akses keyboard dan pembaca layar.",
      "Me-render komponen dalam test tanpa membungkus provider yang dibutuhkan lalu bingung mengejar pesan error."
    ],
    quiz: {
      'data-fetched-api-belong': ["Di mana tempat data yang diambil dari API?", ["Store Redux global, selalu", "Cache server state seperti TanStack Query", "`localStorage`", "`useRef` di komponen root"], "Data dari server butuh caching, aturan kedaluwarsa, dan invalidation yang diurus TanStack Query."],
      'query-getbyrole-button-name': ["Kenapa mencari dengan `getByRole('button', { name: 'Add' })`, bukan dengan class CSS?", ["Lebih cepat", "Ia mengetes apa yang dirasakan user dan teknologi bantu, dan bertahan saat refactor", "Class tidak ada di jsdom", "Tidak perlu rendering"], "Role dan nama aksesibel adalah kontrak asli antarmuka ke pengguna, sedangkan class CSS cuma urusan internal."],
      'important-first-step-accessibili': ["Langkah pertama yang paling penting untuk aksesibilitas?", ["Tambahkan atribut ARIA ke setiap elemen", "Pakai elemen HTML semantik dengan label yang benar", "Pilih palet warna berkontras tinggi", "Pasang widget overlay aksesibilitas"], "HTML semantik memberi dukungan keyboard dan makna sejak awal. ARIA mengisi celah yang tersisa, dan widget overlay tidak memperbaiki markup yang rusak."]
    }
  }
}
};

export default trackId;
