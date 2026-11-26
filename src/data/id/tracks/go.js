// Bahasa Indonesia — track Go. Contoh kode tetap memakai versi aslinya.
export const trackId = {
  id: 'go',
  name: 'Go',
  tagline: 'Layanan backend Go yang bertipe jelas dan konkuren: slice, interface, error, net/http, json/v2, goroutine, context, SQL, dan pprof.',
  lessons: {
  types: {
    terms: [
      ['Exported (`Name`) vs unexported (`name`)', 'Huruf awal kapital membuat simbol bisa dipakai dari luar package. Huruf kecil membatasinya hanya di dalam package tersebut, tanpa keyword `public` atau `private`.'],
      ['Zero value', 'Setiap variabel yang dideklarasikan langsung memiliki nilai awal bawaan (`0`, `""`, `false`, atau `nil`). Tipe seperti `bytes.Buffer` dan `sync.Mutex` bisa langsung dipakai tanpa memanggil constructor.'],
      ['`rune` vs `byte`', 'String di Go berisi deretan byte UTF-8 yang tidak bisa diubah isinya, jadi `len(s)` menghitung jumlah byte, bukan huruf. Tipe `rune` (`int32`) mewakili satu karakter Unicode saat melakukan iterasi.']
    ],
    title: 'Package, value, dan zero value',
    predict: {
      prompt: 'Dengan `cafe := "café"`, apa yang dicetak `len(cafe)` dan `len([]rune(cafe))`?',
      options: ['`4` dan `4`', '`5` dan `4`', '`4` dan `5`'],
      answer: 1,
      explain: '`string` di Go adalah deretan byte yang read-only (literal di source code berformat UTF-8), dan `len` menghitung byte. `é` (U+00E9) butuh dua byte dalam UTF-8, jadi `len(cafe)` bernilai `5`. Konversi ke `[]rune` mendekode code point-nya sehingga hasilnya `4`. Mengakses `cafe[3]` hanya mengembalikan satu byte, bukan karakter `é`, jadi pakai `for i, r := range cafe` saat kamu butuh karakter.'
    },
    why: "Aturan dasar Go dibuat ringkas dan jelas. Setiap file `.go` masuk ke sebuah package, simbol publik diawali huruf kapital, dan variabel yang baru dideklarasikan dimulai dari nilai bawaan seperti `0` atau `\"\"`. Begitu paham tiga aturan ini, kode standard library Go langsung mudah diikuti.",
    points: [
      "Setiap file `.go` termasuk dalam sebuah `package`. Titik masuk program adalah `package main` dengan `func main()`, sedangkan library hanya mengekspor simbol yang diawali huruf kapital.",
      "Pakai `:=` untuk nilai lokal yang langsung diisi (`qty := 3`) dan `var` saat memulai dari zero value (`var buf bytes.Buffer`). Go tidak mengonversi tipe angka secara tersirat, jadi ubah manual misalnya dengan `float64(price)`.",
      "Sejak Go 1.18, pakai `any` menggantikan `interface{}`. Sejak Go 1.21 dan 1.22, pakai built-in `min`, `max`, dan `cmp.Or(envPort, \"8080\")` untuk nilai cadangan.",
      "`len(s)` menghitung byte UTF-8, bukan karakter yang terlihat, jadi `len(\"é\")` bernilai `2`. Loop `range s` membaca tiap `rune` Unicode untukmu, dan `strings.CutLast` (Go 1.27+) memotong di pemisah terakhir tanpa hitung-hitungan indeks manual.",
      "Pakai `strings.Builder` sebagai pengganti `+` di dalam loop supaya penggabungan teks berulang tidak terus mengalokasikan string baru."
    ],
    practice: "Buat folder `shop-go`, jalankan `go mod init shop`, lalu simpan kode ini sebagai `main.go`. Jalankan dengan `go run .`, cek dokumentasi `strings.CutLast` lewat `go doc strings.CutLast`, lalu coba cetak indeks tiap karakter dengan `for i, r := range \"kopi ☕\"`.",
    teach: "Jelaskan bedanya `:=` dan `var` di Go, kenapa `len(\"café\")` hasilnya `5` bukan `4`, serta bagaimana Go mengatur visibilitas antar-package tanpa keyword `public` atau `private`.",
    analogy: "Zero value itu seperti pindah ke apartemen kosong yang listrik dan airnya sudah nyala: penghitung angka mulai dari `0`, boolean dari `false`, dan `bytes.Buffer` bisa langsung ditulis tanpa persiapan apa pun.",
    pitfalls: [
      "Mengira `len(str)` menghitung jumlah huruf, padahal isinya jumlah byte UTF-8. Memotong teks beraksen atau emoji berdasarkan byte bisa membelah karakter di tengah.",
      "Membiarkan variabel lokal atau import tidak terpakai. Compiler Go langsung menggagalkan build, bukan cuma memberi peringatan.",
      "Menganggap `int` bisa otomatis berubah jadi `float64`. Go mewajibkan konversi eksplisit seperti `float64(price)`."
    ],
    quiz: {
      'export-type-function-go': ["Bagaimana cara mengekspor sebuah type atau function dari package Go?", ["Menambahkan keyword `export`", "Mengawali namanya dengan huruf kapital", "Menaruhnya di `index.go`", "Memberi komentar `//go:export`"], "Visibilitas ekspor di Go ditentukan sepenuhnya oleh huruf kapital pada huruf pertama identifier."],
      'len-caf-return': ["Apa hasil `len(\"café\")`?", ["4", "5", "6", "Compile error"], "`len` pada string menghitung byte UTF-8; huruf `'é'` butuh 2 byte, jadi `3 + 2 = 5`."],
      'happens-declare-var-buf': ["Apa yang terjadi bila kamu menulis `var buf bytes.Buffer` lalu langsung memanggil `buf.WriteString(\"hi\")` tanpa `new` atau inisialisasi?", ["Panic nil pointer", "Error compile zero-value", "Langsung bekerja karena zero value `bytes.Buffer` memang buffer kosong yang siap pakai", "Tidak mencetak apa-apa"], "Merancang tipe agar zero value-nya langsung siap pakai adalah kebiasaan umum di Go, seperti pada `bytes.Buffer` dan `sync.Mutex`."]
    }
  },
  collections: {
    terms: [
      ['Header slice (`ptr, len, cap`)', 'Struktur kecil berisi 3 word yang menunjuk ke backing array. Menyalin atau mengirim slice hanya menyalin header ini, bukan seluruh elemennya.'],
      ['Full slice expression (`s[low:high:max]`)', 'Membatasi kapasitas menjadi `cap = max - low`. Operasi append melewati `len` setelahnya membuat array baru supaya slice induk tidak ikut tertimpa.'],
      ['Lookup map comma-ok', '`v, ok := m[k]` membedakan key yang memang tidak ada (`ok == false`) dari key yang tersimpan dengan nilai nol `0` (`ok == true`).']
    ],
    title: 'Array, slice, map, dan loop',
    why: "Sebagian besar kode Go memakai slice untuk daftar data dan map untuk pasangan key-value. Slice sebenarnya hanya jendela berisi 3 word yang menunjuk ke sebuah array, jadi menambah elemen ke sub-slice bisa menimpa isi slice aslinya. Map punya jebakan lain: membaca nil map mengembalikan zero value, sedangkan menulis ke nil map memicu panic.",
    points: [
      "Array `[3]int` memiliki panjang tetap sejak compile dan menyalin semua elemen saat di-assign. Slice `[]int` hanyalah header 3 word (`ptr`, `len`, `cap`) yang menunjuk ke backing array.",
      "Kalau perkiraan jumlah item sudah diketahui, alokasikan di awal dengan `make([]int, 0, n)` atau `make(map[string]int, n)` supaya tidak sering menyalin ulang memori saat tumbuh.",
      "Slice kosong `[]int{}` di-encode menjadi `[]` di JSON, sedangkan `nil` slice menjadi `null`. Membaca `nil` map mengembalikan zero value dengan normal, tapi menulis ke `nil` map memicu panic.",
      "Memanggil append pada sub-slice saat `len < cap` akan menimpa backing array milik induk. Cegah dengan `a[:2:2]` atau `slices.Clone(a)` (package `slices` / `maps`, Go 1.21+).",
      "Mulai Go 1.22, variabel `i` dan `v` pada `for range` dibuat terpisah di tiap iterasi supaya closure dan goroutine tidak tertukar memakai nilai terakhir. Kamu juga bisa menulis `for i := range 5` untuk mengulang `0` sampai `4`."
    ],
    predict: {
      prompt: "Perhatikan operasi slice pada kode di bawah. Apa yang dicetak `fmt.Println(a, b)`?",
      options: [
        "`[10 20 30 40] [10 20 99]` karena `append` selalu menyalin ke slice baru",
        "`[10 20 99 40] [10 20 99]` karena `b` masih punya `cap = 4`, sehingga `append` menimpa `a[2]`",
        "`[10 20 30 99] [10 20 99]` karena `append` menulis ke ujung `a`",
        "Panic saat runtime: slice bounds out of range"
      ],
      explain: "`b := a[0:2]` menunjuk ke awal array milik `a` dengan `len = 2` dan `cap = 4`. Karena kapasitasnya masih tersisa, `append(b, 99)` menimpa indeks `2` milik `a`. Batasi kapasitasnya dengan `a[0:2:2]` atau panggil `slices.Clone` agar `b` terpisah."
    },
    practice: "Buka visualisasi Header slice pada materi ini, telusuri kedua modenya, lalu tulis `WithoutIndex(items []int, idx int) []int` di `main.go` yang mengembalikan salinan tanpa `items[idx]` dan tidak mengubah slice asli pemanggil. Petunjuk: cek `slices.Delete(slices.Clone(items), idx, idx+1)`.",
    teach: "Gambar header slice 3-word (`ptr`, `len`, `cap`) lalu jelaskan ke developer C# atau JavaScript kenapa menambah item ke sub-slice Go bisa ikut mengubah slice aslinya.",
    analogy: "Slice itu seperti jendela pembatas di atas pita bernomor panjang. Dua jendela bisa mengintip pita yang sama, jadi kalau kamu menulis melewati tepi jendelamu saat slot pita di depannya masih ada, tulisan itu ikut muncul di jendela temanmu.",
    pitfalls: [
      "Menulis `var counts map[string]int` lalu langsung menjalankan `counts[\"a\"]++`. Menulis ke nil map memicu panic sebelum kamu membuatnya lewat `make` atau `map[string]int{}`.",
      "Mengembalikan potongan kecil dari `[]byte` berukuran 10 MB, misalnya token 10-byte dari body HTTP. Potongan kecil itu menahan seluruh array 10 MB di memori sampai kamu menyalinnya lewat `slices.Clone` atau `bytes.Clone`.",
      "Menulis boilerplate `sort.Slice` manual padahal `slices.Sort` dan `slices.Contains` sudah ada di standard library."
    ],
    quiz: {
      'happens-write-nil-map': ["Apa bedanya menulis ke `nil` map dibanding membaca `nil` map?", ["Keduanya berjalan normal", "Menulis ke `nil` map memicu panic, sedangkan membaca `nil` map mengembalikan zero value", "Keduanya panic saat `len()`", "`nil` map otomatis mengalokasikan memori saat write pertama"], "`nil` map terbaca kosong (`0`, `false`), namun `m[k] = v` panic sampai diinisialisasi dengan `make` atau `{}`."],
      'protect-calling-append': ["Kenapa `b := a[:2:2]` melindungi `a` saat memanggil `append(b, x)`?", ["Membuat `a` menjadi read-only", "Mengatur `cap(b) == len(b) == 2`, memaksa `append` mengalokasikan backing array baru", "Menyalin `a` saat compile time", "Memindahkan kepemilikan pointer ke GC"], "Karena sisa kapasitas `b` nol, `append` tidak bisa menulis ke slot 2 milik `a` dan mengalokasikan array baru."],
      'go-22-change-range': ["Apa yang berubah di Go 1.22 pada `for i, v := range items`?", ["Loop selalu berjalan paralel", "Setiap iterasi mendapat variabel `i` dan `v` baru, bukan memakai satu alamat memori yang sama", "Map selalu iterasi terurut berdasarkan key", "Slice menjadi immutable di dalam loop"], "Variabel per iterasi ini membereskan bug klasik closure dan goroutine yang menangkap nilai loop terakhir."]
    }
  },
  structs: {
    terms: [
      ['Value vs pointer receiver', '`func (c Cart) Total()` menerima salinan sehingga data pemanggil tidak berubah. `func (c *Cart) Add(...)` menerima pointer agar perubahan tersimpan dan struct besar tidak disalin.'],
      ['Struct embedding', 'Menulis type tanpa nama field (`Logger` di dalam `Server`) membuat field dan method-nya ikut muncul di struct luar tanpa inheritance.'],
      ['Tag `omitzero` (Go 1.24+)', 'Tag `json:"discount,omitzero"` menghapus field bernilai nol saat encode JSON, termasuk struct dan `time.Time` yang dulu sering lolos oleh `omitempty`.']
    ],
    title: 'Struct, pointer, dan method',
    predict: {
      prompt: 'Misalkan `AddItem` memakai value receiver, `func (o OrderConfig) AddItem(name string)`, dengan isi yang sama. Apa yang dicetak `cfg.ItemsCount()` setelah `cfg.AddItem("Mechanical Keyboard")`?',
      options: ['`1`: method selalu bekerja pada struct aslinya', '`0`: method menambahkan item ke salinan `cfg`', 'Error compile: `append` tidak boleh dipakai di dalam value receiver'],
      answer: 1,
      explain: 'Value receiver menerima salinan struct. `append` menyimpan slice header baru ke `o.items` milik salinan itu, dan salinannya dibuang begitu method selesai, jadi `cfg.items` tetap kosong. Pointer receiver (`*OrderConfig`) bekerja pada aslinya, itulah sebabnya method yang mengubah state memakainya. Gunakan satu jenis receiver per tipe agar konsisten.'
    },
    why: "Go tidak punya class atau inheritance. Kamu mengelompokkan data ke dalam struct, memilih value atau pointer receiver untuk method, menyusun type lewat embedding, dan memakai struct tag untuk JSON atau SQL.",
    points: [
      "Di Go, argumen dikirim by value (disalin). Kirim `&x` (`*T`) saat function perlu mengubah struct pemanggil atau menghindari salinan besar. Aritmetika pointer dilarang.",
      "Pakai jenis receiver yang konsisten pada satu type: kalau ada method yang mengubah field atau struct menyimpan `sync.Mutex` (yang tidak boleh disalin), pakai pointer receiver `*T` untuk semua method pada `T`.",
      "Tulis nama field saat membuat literal struct (`Product{ID: 1, Price: 25000}`). Literal tanpa nama field langsung rusak kalau urutan field bertambah atau bergeser.",
      "Sejak Go 1.26, `new(expr)` menerima nilai awal langsung (`Timeout: new(30)` menghasilkan `*int` berisi `30`), jadi kamu tidak perlu helper `ptr[T](v)` lagi untuk field opsional.",
      "Pakai struct embedding hanya kalau type luar memang sengaja mengekspor API milik type dalam. Untuk kolaborator internal, pakai field bernama biasa (`store *OrderStore`)."
    ],
    practice: "Ubah `OrderConfig` supaya `AddItem` mengabaikan nama kosong dan tambahkan field opsional `MaxRetries *int` yang diisi lewat `new(3)`. Coba oper `OrderConfig` by value (`func addCopy(c OrderConfig)`) dan buktikan jumlah item pemanggil tidak berubah kecuali memakai `*OrderConfig`.",
    teach: "Jelaskan kapan harus memilih value receiver dibanding pointer receiver pada struct Go, dan bandingkan struct embedding Go dengan class inheritance di C# atau Java.",
    analogy: "Mengirim by value itu seperti memberi fotokopi kontrak; mengirim pointer itu memberi kunci loker (`*T`) sehingga pengeditan mengubah dokumen aslinya.",
    pitfalls: [
      "Mencampur value dan pointer receiver pada satu type. Method value receiver bisa menyalin `sync.Mutex`, sementara method pointer tidak memenuhi interface kalau pemanggil cuma memegang nilai `T`.",
      "Memakai `omitempty` pada `time.Time` atau nested struct padahal Go 1.24 sudah punya `omitzero`, karena `omitempty` tidak menganggap zero struct sebagai kosong.",
      "Memakai `new(Type)` dengan anggapan Go wajib memakai constructor. Struct literal (`&Type{Field: val}`) atau zero value jauh lebih umum."
    ],
    quiz: {
      'method-use-pointer-receiver': ["Kapan sebuah method WAJIB memakai pointer receiver `*T` alih-alih value `T`?", ["Hanya untuk method exported", "Saat method mengubah receiver, menghindari salinan besar, atau struct berisi state non-copyable seperti `sync.Mutex`", "Hanya di dalam `package main`", "Setiap kali struct punya tag JSON"], "Value receiver bekerja pada salinan sehingga mutasi tertahan lokal dan penyalinan lock memicu race condition."],
      'timeout-new-30-go': ["Apa fungsi `Timeout: new(30)` di Go 1.26+?", ["Mengalokasikan slice berisi 30 int", "Mengembalikan `*int` yang menunjuk ke nilai `30` tanpa butuh helper function", "Syntax error", "Mengalokasikan 30 byte kosong"], "Go 1.26 memperluas built-in `new(expr)` agar langsung menerima ekspresi nilai awal."],
      'prefer-named-field-store': ["Kenapa memilih named field (`store *Repo`) dibanding embedding (`*Repo`) untuk dependency internal?", ["Named field lebih cepat di-compile", "Embedding mempromosikan semua method publik `Repo` ke API luar struct-mu", "Named field mengizinkan pointer nil sementara embedding tidak", "Go melarang embedding pointer"], "Pakai embedding hanya saat memang ingin mewariskan method publik (`is-a`); pakai named field untuk kolaborator internal."]
    }
  },
  interfaces: {
    terms: [
      ['Pemenuhan interface otomatis', 'Sebuah struct memenuhi interface cukup dengan punya method yang cocok, tanpa menulis keyword `implements`.'],
      ['Interface milik pemanggil (consumer)', 'Definisikan interface kecil berisi 1–3 method di package pemanggil (`Notifier`) daripada menaruh satu interface besar di sebelah struct implementasinya.'],
      ['Kotak `(type, value)` interface', 'Variabel interface menyimpan dua word: dynamic type dan pointer data. Nilainya `nil` hanya bila kedua word tersebut sama-sama `nil`.']
    ],
    title: 'Interface kecil dan jebakan nil',
    why: "Di C# atau Java, class harus mendaftar interface yang diimplementasikannya. Di Go, tipe apa pun yang punya method cocok otomatis memenuhi interface, sehingga pemanggil cukup menulis interface kecil (sering 1–3 method seperti `io.Reader`) di tempat ia memakainya. Memahami dua word di dalam interface juga menjelaskan kenapa typed nil pointer bisa membuat `err != nil` bernilai `true`.",
    points: [
      "Buat interface tetap kecil (1–3 method) di package pemakai: misalnya handler mendefinisikan `type ProductReader interface { Get(ctx context.Context, id string) (Product, error) }`, sehingga repository konkret tidak perlu meng-import layer web.",
      "Terima interface dan kembalikan struct: `func NewService(store ProductStore) *Service` tetap mudah di-mock saat testing sambil tetap memberi akses ke semua method `*Service`.",
      "Pasang pengecekan compile-time tanpa biaya runtime di sebelah implementasi: `var _ Writer = (*MemoryLog)(nil)`.",
      "Hati-hati dengan jebakan typed-nil: mengembalikan `var err *FieldError = nil` dari function bertype `error` mengisi kotak interface dengan `(type=*FieldError, value=nil)`. Karena word type bukan `nil`, `err != nil` menjadi `true`, jadi kembalikan `nil` langsung tanpa tipe.",
      "Selalu periksa type assertion dengan comma-ok (`w, ok := x.(Flusher)`) atau type switch. Menulis `x.(T)` langsung memicu panic jika tipe runtime-nya berbeda."
    ],
    predict: {
      prompt: "Perhatikan `validateBroken(\"ok\")` di bawah yang mengembalikan `error` ketika validasi lolos. Apa yang dicetak `err1 != nil`?",
      options: [
        "`false` karena `fe` tidak pernah diisi dan bernilai `nil`",
        "`true` karena mengembalikan `*FieldError(nil)` mengisi word type pada interface",
        "Compile error: tidak bisa mengembalikan `*FieldError` sebagai `error`",
        "Panic saat return"
      ],
      explain: "`fe` berawal sebagai pointer `nil` bertype `*FieldError(nil)`. Saat `validateBroken` mengembalikan `fe` sebagai `error`, Go mengisi word tipe dinamis milik interface dengan `*FieldError`, jadi `err1 != nil` bernilai `true` meski pointer datanya `nil`. Mengembalikan `nil` langsung memperbaikinya."
    },
    practice: "Telusuri `VIZ.goiface`, lalu periksa `err1` di `main.go` pakai `%T` dan `%v` (`fmt.Printf(\"%T %v\\n\", err1, err1)`). Meski nilai `err1` tercetak `<nil>`, dynamic type-nya masih `*main.FieldError`, dan keduanya baru kosong jika kamu mengembalikan `nil` langsung.",
    teach: "Jelaskan mengapa Go mendefinisikan interface kecil di package pemanggil bukan di package implementasi, lalu gambarkan isi dua word di dalam interface saat typed-nil masuk.",
    analogy: "Interface itu seperti map plastik bening berlabel di tab-nya (`*FieldError`) dan berisi selembar kertas di dalam (`nil`). Map baru dianggap kosong kalau label tab maupun kertas di dalamnya sama-sama tidak ada. Map yang masih berlabel dihitung tidak kosong meski isinya kosong.",
    pitfalls: [
      "Membuat interface gemuk ala Java (`IUserService`) sebelum benar-benar punya dua implementasi atau kebutuhan testing ('Don't design with interfaces, discover them').",
      "Mengembalikan typed nil pointer (`var err *MyErr`) atau `*bytes.Buffer` nil yang dibungkus menjadi `io.Reader` / `error`.",
      "Memakai `v := x.(string)` langsung tanpa `v, ok := x.(string)`."
    ],
    quiz: {
      'go-interface-normally-defined': ["Di mana interface Go seharusnya didefinisikan?", ["Di satu package terpusat `interfaces/`", "Di package pengimplementasi tepat di sebelah struct", "Di package pemanggil, berisi hanya 1–3 method yang memang dipanggil pemakai tersebut", "Di dalam `go.mod`"], "Interface minimal di sisi pemanggil memutus ketergantungan antar-package dan mencegah import melingkar."],
      'var-io-writer-auditlog': ["Apa efek `var _ io.Writer = (*AuditLog)(nil)` saat run time?", ["Mengalokasikan `AuditLog` nil tiap import", "Nol biaya runtime; ia memastikan saat compile time bahwa `*AuditLog` memenuhi `io.Writer`", "Memanggil `Write` dengan `nil`", "Panic bila `Write` tidak pernah dipanggil"], "Blank-identifier assertion dicek penuh oleh compiler tanpa biaya eksekusi."],
      'interface-variable-equal-nil': ["Kapan sebuah variabel interface bernilai sama dengan `nil`?", ["Setiap kali pointer di dalamnya `nil`", "Hanya ketika kedua word, yaitu dynamic type descriptor dan pointer nilai konkretnya, sama-sama `nil`", "Ketika seluruh field struct bernilai nol", "Interface tidak pernah bisa sama dengan `nil`"], "Interface berisi typed-nil menyimpan descriptor type yang tidak nil, sehingga `x != nil`."]
    }
  },
  errors: {
    terms: [
      ['Sentinel error (`ErrNotFound`)', 'Variabel error tingkat package (`errors.New(...)`) untuk kondisi yang diharapkan dan bisa dicocokkan pemanggil lewat `errors.Is`.'],
      ['Error wrapping (`%w`)', '`fmt.Errorf("loading order %s: %w", id, err)` menambahkan konteks langkah pemanggil sambil menjaga error asli tetap bisa dicek ke atas.'],
      ['`errors.AsType[T]` (Go 1.26+)', 'Pengganti generik untuk `var target T; errors.As(err, &target)` guna mengambil tipe error khusus tanpa deklarasi variabel terpisah.']
    ],
    title: 'Error sebagai nilai: wrapping dan errors.AsType',
    predict: {
      prompt: 'Jika `reserveItem` membungkus dengan `%v` alih-alih `%w` (`fmt.Errorf("reserving item %q: %v", id, err)`), apa yang dikembalikan `errors.Is(err, ErrNotFound)` untuk `"missing"`?',
      options: ['`true`: pesannya masih memuat teks dari `ErrNotFound`', '`false`: `%v` hanya memformat teks, jadi tautan ke `ErrNotFound` hilang', 'Panic, karena `errors.Is` mewajibkan error yang dibungkus'],
      answer: 1,
      explain: 'Dengan `%w`, `fmt.Errorf` mengembalikan error yang `Unwrap()`-nya menunjuk ke error asli, dan `errors.Is` menelusuri rantai itu sambil membandingkan nilainya. `%v` hanya menyalin pesan ke string baru: tampilannya sama persis saat dicetak, tetapi `errors.Is` dan `errors.AsType` tidak bisa lagi menemukan `ErrNotFound`. Jangan pernah membandingkan string error; bungkus dengan `%w` setiap kali pemanggil perlu bercabang berdasarkan penyebabnya.'
    },
    why: "Go memperlakukan error sebagai nilai kembalian biasa, bukan exception yang meloncat keluar dari stack. Mengecek `err != nil` dengan early return dan membungkus konteks lewat `%w` menunjukkan di langkah mana proses berhenti dan apa penyebabnya.",
    points: [
      "Periksa tiap error lalu return lebih awal (`if err != nil { return ..., fmt.Errorf(...: %w, err) }`). Jangan membuang error ke `_`, dan hindari blok `else` setelah return agar alur normal tetap rata kiri.",
      "Ikuti aturan penanganan tunggal: catat log error di batas atas (seperti HTTP handler) ATAU bungkus dan kembalikan error tersebut. Melakukan keduanya menulis log ganda di tiap lapisan.",
      "Awali pesan error dengan huruf kecil tanpa tanda titik di akhir (`\"opening config: permission denied\"`), karena pemanggil akan menambahkan konteks di depannya dipisahkan titik dua.",
      "Pakai `errors.Is(err, ErrNotFound)` untuk mencocokkan sentinel di rantai wrapping, `errors.AsType[*ValidationError](err)` (Go 1.26+) untuk mengambil tipe error terstruktur, dan `errors.Join` saat mengembalikan beberapa error sekaligus.",
      "Pakai `%w` di package internal supaya pemanggil bisa memeriksa penyebabnya, dan `%v` di batas luar jika ingin menyembunyikan detail internal. Simpan `panic` untuk bug program, bukan salah input user, data kosong, atau koneksi putus."
    ],
    practice: "Buat validator multi-field memakai `errors.Join` untuk menggabungkan dua error (`name` kosong dan `price <= 0`). Bungkus error gabungan itu di pemanggil dengan `%w`, lalu buktikan `errors.Is` dan `errors.AsType` tetap bisa mencocokkan kedua error di dalamnya.",
    teach: "Jelaskan kenapa `err == sql.ErrNoRows` gagal pada error yang di-wrap sedangkan `errors.Is(err, sql.ErrNoRows)` berhasil, serta kenapa me-log sekaligus me-return error yang sama membuat log penuh duplikat.",
    analogy: "Membungkus error dengan `%w` itu seperti menempelkan catatan langkah pada struk belanja tiap kali berpindah dari gudang ke kurir lalu kasir. Kamu tetap punya struk aslinya di bawah (`errors.Is`), plus urutan tempat terjadinya masalah.",
    pitfalls: [
      "Membandingkan error ter-wrap dengan `==`, bukan `errors.Is(err, ErrFoo)`.",
      "Memakai `%v` padahal pemanggil di atas masih perlu mencocokkan penyebabnya lewat `errors.Is` / `errors.AsType`.",
      "Memanggil `slog.Error` di dalam helper lalu tetap me-return error yang sama sehingga handler mencatat error yang sama berkali-kali.",
      "Mengawali pesan error dengan huruf kapital (`\"Failed to save.\"`). Saat dibungkus, kalimatnya menjadi janggal seperti `\"creating order: Failed to save.\"`."
    ],
    quiz: {
      'prefer-errors-err-errnotfound': ["Mengapa `errors.Is(err, ErrNotFound)` lebih baik daripada `err == ErrNotFound`?", ["`==` gagal compile pada error", "`errors.Is` menelusuri rantai wrapping dari `%w` dan `errors.Join`, sementara `==` hanya mengecek lapisan terluar", "`errors.Is` otomatis mencetak stack trace", "`==` sudah dihapus di Go 1.27"], "`errors.Is` memanggil pohon `Unwrap()` sehingga sentinel di dalam rantai tetap cocok."],
      'according-go-single-handling': ["Menurut aturan single handling rule, apa yang seharusnya dilakukan function repository saat query DB gagal?", ["Catat `slog.Error` dan kembalikan `nil`", "Log DAN kembalikan error yang sama", "Wrap dengan konteks (`fmt.Errorf(\"...: %w\", err)`) lalu kembalikan agar batas terluar yang me-log sekali", "Panggil `panic(err)`"], "Kembalikan wrapped error ke atas; biarkan batas terluar (HTTP handler atau `main`) menentukan status HTTP dan mencatat log sekali."],
      'errors-astype-quotaerror-err': ["Apa peningkatan `errors.AsType[*QuotaError](err)` (Go 1.26+) dibanding `errors.As(err, &target)`?", ["Berjalan secara asinkron", "Menghapus deklarasi manual `var target *QuotaError` dan memeriksa kecocokan type secara statis saat compile time", "Mengabaikan wrapped error", "Hanya mengecek sentinel error"], "`errors.AsType[T]` memakai generik untuk mengembalikan `(T, bool)` tanpa deklarasi variabel pointer tambahan."]
    }
  },
  http: {
    splits: ['1 · Handler & json/v2', '2 · Security & middleware', '3 · Server & timeouts'],
    terms: [
      ['Pattern `ServeMux` (Go 1.22+)', 'Mendukung method HTTP dan parameter path langsung di stdlib (`mux.HandleFunc("GET /products/{id}", h)` dan `r.PathValue("id")`).'],
      ['`encoding/json/v2` (Go 1.27+)', 'Package JSON default yang menolak key duplikat atau UTF-8 rusak, membaca stream dari `r.Body` lewat `json.UnmarshalRead`, dan menolak field tak dikenal lewat `json.RejectUnknownMembers`.'],
      ['`os.Root` & timeout `http.Server`', '`os.Root` mengunci pembacaan file di dalam satu folder (Go 1.24+), sedangkan timeout baca/tulis mencegah koneksi lambat menahan socket server.']
    ],
    title: 'Web API dengan net/http dan json/v2',
    why: "Standard library Go sudah cukup untuk membangun JSON HTTP API produksi tanpa harus langsung memasang web framework. Go 1.22 menambahkan routing method dan path parameter ke `http.ServeMux`, Go 1.25 menambahkan `http.CrossOriginProtection`, dan Go 1.27 menyertakan `encoding/json/v2` dengan validasi JSON yang lebih ketat.",
    points: [
      "Daftarkan method dan parameter path di stdlib: `mux.HandleFunc(\"GET /products/{id}\", ...)` membaca `{id}` lewat `r.PathValue(\"id\")` dan otomatis membalas `405 Method Not Allowed` bila method-nya salah.",
      "Dengan `encoding/json/v2` (default Go 1.27), key duplikat dan UTF-8 rusak langsung gagal. Batasi ukuran body dengan `http.MaxBytesReader` lebih dulu, lalu baca request dengan `json.UnmarshalRead(r.Body, &req, json.RejectUnknownMembers(true))`.",
      "Bungkus route memakai `http.NewCrossOriginProtection().Handler(...)` (Go 1.25+) untuk menahan request penulisan lintas-origin dari browser, lalu buka file dari input user via `os.OpenRoot(dir)` (Go 1.24+) supaya `../../etc/passwd` tidak bisa keluar dari `dir`.",
      "Middleware cukup berupa function biasa pembungkus `http.Handler` (`func(http.Handler) http.Handler`), sehingga urutan eksekusinya jelas dibaca dan dilacak.",
      "Selalu pasang timeout di `http.Server` (`ReadHeaderTimeout`, `ReadTimeout`, `WriteTimeout`, `IdleTimeout`), karena `http.ListenAndServe` membiarkan semua timeout bernilai nol."
    ],
    practice: "Buat module dengan kode ini, jalankan, dan uji `GET /products/1`, `DELETE /products/1` (membalas `405`), serta `POST /products` yang mengirim field tambahan `{\"name\":\"Lamp\",\"price\":200,\"admin\":true}` (ditolak oleh `json.RejectUnknownMembers(true)`). Tambahkan juga endpoint download file yang dibatasi `os.OpenRoot(\"./public\")`.",
    teach: "Jelaskan bagaimana `newHandler` membungkus `http.ServeMux` di dalam middleware tanpa reflection atau DI container, lalu jelaskan mengapa `ReadHeaderTimeout` dan `MaxBytesReader` wajib pada server publik.",
    analogy: "Middleware Go bekerja seperti lapisan pembungkus di luar `http.Handler`. Request masuk melewati lapisan logging dan pengecekan CSRF, menuju route yang cocok di `ServeMux`, lalu kembali keluar lewat jalur yang sama.",
    pitfalls: [
      "Memanggil `http.ListenAndServe(\":8080\", mux)` di produksi, karena server default-nya tidak punya batas timeout baca atau tulis.",
      "Memeriksa path input user cukup dengan `filepath.Clean` dan `strings.HasPrefix`, bukan `os.OpenRoot`. Pengecekan teks sangat mudah dilewati lewat symlink atau perbedaan aturan OS.",
      "Melewatkan `http.MaxBytesReader` sebelum decoding JSON, sehingga pengirim bisa mengunggah body bergigabyte sampai RAM habis."
    ],
    quiz: {
      'go-22-happens-someone': ["Di Go 1.22+, apa yang terjadi jika ada request `POST /products/1` saat route yang didaftarkan hanya `mux.HandleFunc(\"GET /products/{id}\", h)`?", ["Tetap memanggil `h`", "Mengembalikan 404 Not Found", "Otomatis membalas 405 Method Not Allowed lengkap dengan header `Allow`", "Panic saat compile"], "Go 1.22+ `ServeMux` mencocokkan HTTP method dan mengembalikan 405 otomatis ketika path cocok tapi method tidak terdaftar."],
      'wrap-body-http-maxbytesreader': ["Mengapa membungkus `r.Body` dengan `http.MaxBytesReader` sebelum `json.UnmarshalRead`?", ["Untuk mengompres respons JSON", "Untuk membatasi ukuran byte body agar payload raksasa tidak menghabiskan memori server", "Untuk menyalakan keep-alive", "Wajib agar `json/v2` membaca UTF-8"], "`MaxBytesReader` memutus stream seketika jika payload melampaui batas ukuran yang ditetapkan."],
      'os-openroot-dir-go': ["Bagaimana `os.OpenRoot(dir)` (Go 1.24+) melindungi endpoint akses file?", ["Mengenkripsi file di disk", "Mengunci akses file dan symlink secara ketat di bawah `dir`, menolak escape `../`", "Mengubah file jadi read-only", "Menyimpan file statis di RAM"], "`os.Root` membatasi resolusi path di level OS terhadap celah path traversal."]
    }
  },
  testing: {
    splits: ['1 · shop.go', '2 · shop_test.go'],
    terms: [
      ['Table-driven test (`t.Run`)', 'Menaruh input, hasil harapan, dan `name` kasus uji di dalam slice struct agar tiap baris berjalan sebagai subtest terpisah.'],
      ['`httptest.NewTestServer` (Go 1.27+)', 'Membuat HTTP test server di memori yang terikat ke `t` tanpa membuka port TCP asli, dan langsung cocok dipakai bersama `testing/synctest`.'],
      ['`testing/synctest` (Go 1.25–1.27)', 'Menjalankan goroutine di dalam gelembung jam simulasi terisolasi (`synctest.Test`, `synctest.Wait`, `synctest.Sleep`) supaya uji timer selesai cepat tanpa menunggu waktu nyata.']
    ],
    title: 'Table-driven test, httptest, dan synctest',
    why: "Perkakas testing menyatu langsung dengan perintah `go` (`go test ./...`). Tambahan dari Go 1.24 sampai 1.27 (`t.Context()`, `b.Loop()`, `httptest.NewTestServer`, dan `testing/synctest`) menghilangkan flaky test akibat timer dan menyederhanakan pengujian HTTP maupun konkurensi.",
    points: [
      "Beri nama file test `<nama>_test.go` sesuai file sumbernya, lalu susun skenario di slice struct yang dipanggil dengan `t.Run(tc.name, ...)`.",
      "Tandai fungsi pembantu dengan `t.Helper()` supaya nomor baris kegagalan menunjuk ke baris table test pemanggilnya, bukan baris di dalam helper.",
      "Pakai `t.Context()` (Go 1.24+), bukan `context.Background()`, agar context otomatis batal saat test selesai, lalu tambahkan `t.Parallel()` pada test yang tidak berbagi state.",
      "Uji kode HTTP tanpa membuka port jaringan: gunakan `httptest.NewRecorder()` untuk menguji handler satuan, atau `httptest.NewTestServer(t, handler)` (Go 1.27+) saat menjalankan `http.Client` ke router.",
      "Uji timer dan koordinasi goroutine tanpa tidur sungguhan menggunakan `testing/synctest.Test` dan `synctest.Sleep` (Go 1.25–1.27). Jalankan `go test -race ./...` bila CGO dan `gcc` terpasang."
    ],
    practice: "Simpan kedua tab sebagai `shop.go` dan `shop_test.go`, lalu jalankan `go test -v -bench=. ./...`. Perhatikan `TestDelayedBumpFakeClock` selesai dalam milidetik meski menunggu 5 detik! Tambahkan satu kasus baru pada `TestPriceMuxInMemory` memakai pola table-driven `t.Run`.",
    teach: "Jelaskan mengapa `time.Sleep(50 * time.Millisecond)` di dalam unit test membuat CI sering gagal acak, dan bagaimana `testing/synctest` membuatnya cepat sekaligus konsisten tanpa mengubah kode produksi.",
    analogy: "Menguji konkurensi biasa seperti memanggang kue sambil mengira-ngira timer di dapur yang ramai. `testing/synctest` menaruh seluruh goroutine di ruang kedap waktu tempat kamu bisa memutar jarum jamnya sendiri.",
    pitfalls: [
      "Memakai `time.Sleep` untuk menunggu goroutine selesai, bukan sinkronisasi nyata (`WaitGroup`, channel, atau `synctest`).",
      "Membuat banyak test untuk helper privat sambil membiarkan kontrak handler HTTP atau repository tidak teruji.",
      "Menamai file test per function (`apply_discount_test.go`), padahal cukup mengikuti pasangan `shop.go` dan `shop_test.go`."
    ],
    quiz: {
      'mark-helper-functions-inside': ["Mengapa menandai function bantu test dengan `t.Helper()`?", ["Mempercepat eksekusi", "Baris error laporan menunjuk ke baris test pemanggil alih-alih baris di dalam helper", "Mengaktifkan eksekusi paralel", "Otomatis menutup body HTTP"], "`t.Helper()` memberi tahu runner agar melewati frame stack helper saat melaporkan lokasi gagal."],
      'key-benefit-testing-synctest': ["Apa keunggulan utama `testing/synctest` + `synctest.Sleep`?", ["Menjalankan test di banyak server", "Memajukan jam palsu yang deterministik di dalam gelembung terisolasi tanpa menunggu waktu sungguhan", "Menggantikan `go test -race`", "Membuat database mock"], "`synctest` memajukan waktu simulasi seketika begitu seluruh goroutine gelembung terblokir."],
      'prefer-loop-go-24': ["Mengapa memakai `for b.Loop()` (Go 1.24+) alih-alih `for i := 0; i < b.N; i++` pada benchmark baru?", ["`b.Loop()` menjalankan multithread", "Ia otomatis mencegah eliminasi dead-code oleh compiler dan mengecualikan waktu setup/teardown", "`b.N` dihapus di Go 1.27", "`b.Loop()` mematikan penghitungan alokasi"], "`b.Loop()` mengatur timer benchmark dan menjaga hasil pemanggilan di dalam loop tetap hidup."]
    }
  },
  generics: {
    terms: [
      ['Constraint (`comparable`, `~int`)', 'Membatasi tipe yang boleh diterima parameter generik: `comparable` mengizinkan `==` dan `!=` (syarat key map), sementara `~int` menerima type kustom apa pun yang tipe dasarnya `int`.'],
      ['Generic method (Go 1.27+)', 'Method pada type konkret boleh mendeklarasikan parameter type sendiri (`func (b Bucket[T]) Map[U any](...)`) untuk mengubah isi wadah menjadi type `U`.'],
      ['Lazy iterator (`iter.Seq[T]`)', 'Fungsi yield dari Go 1.23+ yang bisa langsung dipakai di `for x := range seq`, mengirim nilai satu per satu tanpa mengalokasikan slice perantara.']
    ],
    title: 'Generics, iterator, dan utilitas stdlib',
    why: "Go berjalan lebih dari satu dekade tanpa generics, lalu menambahkannya di Go 1.18, disusul iterator (`iter.Seq`) di Go 1.23 dan generic method di Go 1.27. Pakai tipe konkret dulu, interface untuk perilaku bersama, dan generics hanya ketika struktur data atau helper benar-benar berulang.",
    points: [
      "Pakai generics untuk struktur data (`Stack[T]`, `Set[T]`), helper `slices` atau `maps`, serta menghilangkan pengulangan type assertion dari `any`. Kalau tipe konkret atau interface biasa sudah jelas terbaca, jangan pakai generics.",
      "Gunakan `comparable` untuk key map atau perbandingan setara (`func Unique[T comparable]`), `cmp.Ordered` (package `cmp`) untuk `<` dan `>`, serta tanda `~` (`type Num interface { ~int | ~float64 }`) supaya custom type seperti `type Cents int` tetap cocok.",
      "Di Go 1.27+, method pada `Bucket[T]` boleh mendeklarasikan type parameter `[U any]` miliknya sendiri (`func (b Bucket[T]) Map[U any](fn func(T) U) Bucket[U]`), walau method di dalam interface tetap non-generik.",
      "Iterator (`iter.Seq[T]`, Go 1.23+) bekerja langsung dengan `for v := range ...`, `slices.Collect`, dan `maps.Keys`, sehingga pemanggil bisa keluar dengan `break` kapan saja tanpa alokasi slice sementara."
    ],
    practice: "Tambahkan method `(b Bucket[T]) Filter(keep func(T) bool) iter.Seq[T]` memakai `iter.Seq` sehingga `for x := range b.Filter(...)` melakukan iterasi lazy dan langsung berhenti bila pemanggil menjalankan `break`.",
    teach: "Jelaskan perbedaan `int` dan `~int` di dalam constraint Go, kapan interface (`io.Reader`) lebih tepat daripada generics (`[T any]`), dan mengapa nilai balik `yield` yang `false` penting pada `iter.Seq`.",
    analogy: "Interface menjelaskan kemampuan (seperti stopkontak yang menerima berbagai steker cocok). Generics menjaga tipe isi wadah (seperti boks berlabel `[T]` yang tetap tahu isinya sepatu atau buku saat dibuka lagi).",
    pitfalls: [
      "Memaksakan `[T any]` ketika function konkret `[]Product` jauh lebih mudah dibaca.",
      "Mengabaikan nilai balik boolean dari `yield(v)` di dalam generator `iter.Seq`. Tetap memanggil `yield` setelah pemanggil keluar lewat `break` akan memicu panic.",
      "Mencoba menaruh generic method ke dalam kontrak interface, yang di Go 1.27 masih dilarang."
    ],
    quiz: {
      'int-mean-inside-go': ["Apa arti `~int` di dalam constraint type Go?", ["Hanya int yang boleh nil", "`int` serta seluruh custom type yang underlying type-nya `int` (mis. `type UserID int`)", "Semua unsigned integer", "Integer presisi perkiraan"], "`~` mencocokkan tipe dasar sehingga type alias domain tetap bisa memakai helper generik."],
      'inside-iter-seq-iterator': ["Di dalam iterator `iter.Seq[T]`, apa yang wajib dilakukan ketika `yield(v)` mengembalikan `false`?", ["Memanggil `panic`", "Berhenti memproduksi nilai dan langsung `return` karena pemanggil keluar dari loop lewat `break`", "Mencoba mengirim `v` ulang", "Reset ke indeks 0"], "Nilai `false` dari `yield` menandakan loop konsumen sudah berhenti (`break` atau `return`)."],
      'go-27-generic-methods': ["Apa kemampuan baru generic method di Go 1.27+, dan batasan apa yang tetap ada?", ["Method konkret boleh mendeklarasikan parameter type sendiri (`func (s Set[T]) Map[U any](...)`), namun method interface tetap tidak boleh", "Interface kini boleh berisi generic method juga", "Function generik tingkat package dihapus", "Method dapat mengubah type receiver secara dinamis"], "Go 1.27 mengizinkan method generik pada type konkret sembari mempertahankan kontrak interface tetap non-generik."]
    }
  },
  goroutines: {
    viz: 'goroutine',
    terms: [
      ['Goroutine (`go fn()`)', 'Task ringan (~2 KB stack awal) yang dijadwalkan runtime Go ke OS thread sehingga ribuan goroutine dapat berjalan bersamaan.'],
      ['Arah channel (`chan<-` / `<-chan`)', 'Membatasi parameter menjadi khusus-kirim atau khusus-terima agar kesalahan menutup atau membaca dari sisi yang keliru tertangkap saat compile time.'],
      ['`sync.WaitGroup.Go` (Go 1.25+)', 'Menjalankan `f()` dalam goroutine baru dan mengurus `Add(1)` serta `defer Done()` otomatis.']
    ],
    title: 'Goroutine, channel, dan select',
    why: "Go membawa dukungan konkurensi langsung di bahasanya. Daripada mengunci memori bersama dengan mutex di mana-mana, goroutine bertukar salinan nilai lewat channel bertipe aman dan menunggu banyak event atau pembatalan lewat `select`.",
    points: [
      "Tentukan cara keluar setiap goroutine sebelum kamu mengetik `go`. Goroutine tanpa sinyal batal atau sinkronisasi `WaitGroup` tetap tinggal di memori sampai proses mati.",
      "Kirim salinan nilai lewat channel daripada saling berbagi pointer ke struct yang terus berubah. Tulis arah channel (`chan<- T` untuk mengirim, `<-chan T` untuk menerima) di parameter function.",
      "Hanya sisi pengirim yang boleh memanggil `close(ch)` setelah tugasnya selesai, supaya penerima keluar dari `v, ok := <-ch` atau `for v := range ch`. Mengirim ke channel tertutup memicu panic, sedangkan membaca channel tertutup langsung memberi zero value.",
      "Mulai dari unbuffered channel (`make(chan T)`) agar pengirim dan penerima langsung sinkron. Tambahkan buffer (`make(chan T, n)`) hanya untuk meredam lonjakan beban yang sudah diukur.",
      "`select` menunggu beberapa channel sekaligus. Selalu sertakan `case <-ctx.Done():` saat menunggu operasi lambat supaya pemanggil tidak macet."
    ],
    predict: {
      prompt: "Pada `fetchWithTimeout` di bawah, `slowJob` butuh `200 ms`, sementara timeout context hanya `30 ms`. Apa yang terjadi saat dijalankan?",
      options: [
        "Mengembalikan `timeout`, dan `slowJob` masih bisa menaruh hasil lambatnya ke buffer `cap=1` lalu keluar tanpa macet",
        "Panic saat `close(ch)`",
        "`fetchWithTimeout` menunggu penuh 200 ms sebelum mengecek `ctx.Done()`",
        "Langsung deadlock"
      ],
      explain: "`select` menjalankan cabang pertama yang siap (`<-ctx.Done()` pada 30 ms). Membuat `ch := make(chan string, 1)` ber-buffer memungkinkan `slowJob` meletakkan hasilnya nanti lalu keluar, alih-alih tersangkut selamanya pada `ch <-` tanpa buffer."
    },
    practice: "Buka lab `VIZ.goroutine` untuk membandingkan mode unbuffered, buffered, dan `select`. Lalu ubah `fetchWithTimeout` sementara ke `make(chan string)` (unbuffered!) dan lihat kenapa goroutine latar belakang itu akan tersangkut di memori setelah timeout terjadi.",
    teach: "Jelaskan kenapa 'hanya pengirim yang menutup channel', kenapa `close(ch)` membangunkan semua pembaca yang menunggu, dan bagaimana ukuran buffer 1 mencegah kebocoran pada `select` dengan timeout.",
    analogy: "Unbuffered channel itu seperti oper tongkat lari estafet: pelari pertama belum boleh lepas sampai pelari kedua memegang tongkatnya. Buffered channel itu meja konter berisi `N` nampan tempat kamu bisa meletakkan `N` pesanan tanpa menunggu, baru berhenti saat meja penuh.",
    pitfalls: [
      "Memanggil `close(ch)` dari sisi penerima atau menutupnya dua kali, yang memicu panic `send on closed channel` atau `close of closed channel`.",
      "Memakai unbuffered result channel di dalam `select` bertimeout sehingga pengirim tersangkut permanen jika timeout menang lebih dulu.",
      "Memanggil `time.After(...)` berulang kali di dalam loop `for { select { ... } }` yang panjang. Setiap putaran membuat timer baru di memori, sedangkan `time.NewTimer` bersama `Reset` memakai ulang satu timer."
    ],
    quiz: {
      'call-close-ch-go': ["Siapa yang seharusnya memanggil `close(ch)` di Go?", ["Penerima setelah membaca satu item", "Sisi pengirim/produsen setelah seluruh datanya selesai dikirim", "`WaitGroup` otomatis menutupnya", "Goroutine mana pun yang memakai `recover`"], "Hanya pengirim yang tahu kapan pengiriman benar-benar selesai; mengirim setelah close memicu panic."],
      'ch-make-chan-result': ["Mengapa `ch := make(chan Result, 1)` mencegah kebocoran goroutine saat dipakai bersama `select` + `<-ctx.Done()`?", ["Buffer 1 menutup channel saat timeout", "Worker tetap bisa menaruh hasilnya ke 1 slot buffer lalu keluar meski pemanggil sudah kembali duluan", "Go melewati penjadwalan channel tanpa buffer", "Mempercepat CPU dua kali lipat"], "Tanpa buffer, worker yang selesai belakangan bakal terblokir permanen pada operasi kirim `ch <-`."],
      'wg-go-fn-go': ["Apa yang digantikan oleh `wg.Go(fn)` (Go 1.25+)?", ["Pernyataan `select`", "Boilerplate `wg.Add(1); go func() { defer wg.Done(); fn() }()` untuk tugas tunggu sederhana tanpa panic", "Penanganan error `errgroup.WithContext`", "Penguncian mutex"], "`sync.WaitGroup.Go` menghapus pola `Add(1)` dan `Done()` manual untuk wait group sederhana."]
    }
  },
  context: {
    viz: 'gocontext',
    terms: [
      ['Aturan `ctx` parameter pertama', 'Terima `ctx context.Context` sebagai argumen pertama (`func Fetch(ctx context.Context, id string)`), dan jangan menyimpan `ctx` di dalam field struct.'],
      ['`defer cancel()`', 'Panggil `defer cancel()` tepat setelah setiap `context.WithTimeout`, `WithCancel`, atau `WithDeadline` supaya timer dilepas begitu fungsi keluar.'],
      ['`context.WithoutCancel` (Go 1.21+)', 'Membuat turunan yang menjaga nilai request dan tracing sambil mengabaikan pembatalan induk, cocok untuk tugas audit setelah respons HTTP dikirim.']
    ],
    title: '`context.Context`: deadline, pembatalan, dan leak',
    predict: {
      prompt: '`reqCtx` punya timeout `20 ms`, `runQuery` butuh `100 ms`, dan `writeAudit` menurunkan context-nya dari `context.WithoutCancel(parent)`. Apa yang dicetak `main`?',
      options: ['`handler: aborted query: context deadline exceeded`, lalu baris audit dengan `req-42`', 'Hanya baris handler: audit dilewati karena `reqCtx` sudah kedaluwarsa', '`handler: aborted query: context canceled`, lalu baris audit dengan `<nil>`'],
      answer: 0,
      explain: 'Setelah `20 ms` deadline tercapai, `ctx.Done()` memenangkan `select`, dan `ctx.Err()` bernilai `context.DeadlineExceeded` dengan pesan `context deadline exceeded` (`context.Canceled` muncul kalau kamu sendiri memanggil `cancel()`). `context.WithoutCancel` mempertahankan semua value dari parent-nya, seperti request ID, tetapi membuang deadline dan pembatalannya, sehingga audit mendapat jatah baru `50 ms` dan mencetak `req-42`.'
    },
    why: "Saat melayani request nyata, client bisa memutus koneksi di tengah jalan dan layanan lain bisa melambat. `context.Context` menyambungkan HTTP request masuk ke setiap goroutine pekerja dan query SQL di bawahnya supaya pekerjaan berhenti saat request dibatalkan.",
    points: [
      "Pilih sumber context yang tepat: pakai `r.Context()` di handler HTTP, `t.Context()` di test Go 1.24+, `context.Background()` hanya di titik masuk awal (`main`), dan `context.TODO()` sementara selama merangkai signature. Jangan mengoper `nil`.",
      "Jangan memutus pohon pembatalan di tengah request. Membuat `context.Background()` di dalam method service memutus query database (`db.QueryContext`) dari timeout handler dan putusnya koneksi client.",
      "Jika pekerjaan seperti log audit harus tuntas setelah respons HTTP selesai, bungkus `r.Context()` memakai `context.WithoutCancel(ctx)` dan `WithTimeout` singkat supaya correlation ID tetap terbawa tanpa ikut terhenti saat handler return.",
      "Simpan hanya metadata lingkup request di `context.WithValue` memakai custom key type tidak diekspor (`type ctxKey struct{}`) agar tidak bentrok antar-package. Oper dependency seperti database atau logger lewat argumen biasa."
    ],
    practice: "Telusuri `VIZ.gocontext` yang membandingkan propagasi penuh vs `context.Background()` yang terputus, lalu coba `context.WithCancelCause` + `context.Cause(ctx)` di `main.go` untuk menyertakan alasan pembatalan kustom.",
    teach: "Jelaskan mengapa menyimpan `ctx` di dalam field struct `Service` merusak request HTTP yang konkuren, dan mengapa log audit yang dipicu saat HTTP handler selesai harus memakai `context.WithoutCancel`, bukan `context.Background()`.",
    analogy: "Anggap `context.Context` seperti kabel sakelar darurat dari pintu depan (`r.Context`) ke tiap alat di bengkel (`worker`, `db.QueryContext`). Menarik kabel depan langsung mematikan semua alat yang tersambung, kecuali ada satu alat yang dicolok ke stopkontak lain (`context.Background`).",
    pitfalls: [
      "Lupa memanggil `defer cancel()` sesudah `context.WithTimeout`, yang menyisakan timer aktif menempel di parent context sampai parent-nya habis waktu.",
      "Memakai string biasa seperti `\"userID\"` sebagai key `context.WithValue`, sehingga dua package yang memilih kata sama akan saling menimpa isi context.",
      "Menyimpan `ctx` di dalam struct (`type Client struct { ctx context.Context }`), padahal seharusnya dikirim per pemanggilan."
    ],
    quiz: {
      'ctx-never-stored-inside': ["Mengapa `ctx` TIDAK BOLEH disimpan sebagai field di struct berumur panjang?", ["Akan gagal compile", "Setiap request punya deadline/pembatalan berbeda; menyimpannya di struct membekukan state kedaluwarsa atau milik request lain", "Interface melarang field `Context`", "Memaksa seluruh int melompat ke heap"], "Setiap operasi punya siklus hidup sendiri; mengirim `ctx` di argumen pertama menjaga batas konkurensi tetap jelas."],
      'http-handler-starts-quick': ["Saat handler HTTP memicu log audit singkat yang tetap harus tuntas SETELAH respons HTTP terkirim, konstruktor context mana yang paling tepat?", ["`r.Context()` langsung", "`context.WithoutCancel(r.Context())` dipadukan dengan `WithTimeout`", "`nil`", "`context.Background()` di dalam driver DB"], "`WithoutCancel` mempertahankan metadata/tracing sambil melepaskan sinyal cancel dari HTTP request induk."],
      'declare-context-keys-unexported': ["Mengapa mendeklarasikan key context dengan unexported custom type (`type ctxKey string`)?", ["String polos tidak boleh jadi key interface", "Walaupun dua package memakai teks nama yang identik, perbedaan type Go menjamin key keduanya tidak akan pernah bentrok", "Membuat akses `Value()` O(1)", "Diwajibkan oleh `context.Background()`"], "`context.Value` membandingkan key berdasarkan type sekaligus nilainya, sehingga unexported type menjamin isolasi."]
    }
  },
  database: {
    terms: [
      ['`defer rows.Close()` & `rows.Err()`', 'Setiap loop `QueryContext` butuh keduanya. Lupa memanggil `Close()` membocorkan koneksi pool, sedangkan melewatkan `rows.Err()` menyembunyikan error jaringan di tengah iterasi.'],
      ['Kontrol pool `database/sql`', '`SetMaxOpenConns`, `SetMaxIdleConns`, `SetConnMaxLifetime`, dan `SetConnMaxIdleTime` menjaga jumlah koneksi ke Postgres atau SQL Server tetap terkendali.'],
      ['`pgx` & `sqlc` vs ORM', 'Banyak layanan Go melewati ORM berbasis reflection dan memilih SQL berparameter dengan `database/sql`, `pgx.RowToStructByName`, atau kode Go hasil generate `sqlc`.']
    ],
    title: 'Data relasional: database/sql, pgx, dan sqlc',
    why: "Di proyek Go, kamu umumnya menulis SQL langsung tanpa dibungkus ORM. Memahami alur hidup koneksi `database/sql` (`QueryContext`, `rows.Close`, `rows.Err`, transaction) berlaku langsung baik saat memakai `database/sql`, `pgx`, maupun `sqlc`.",
    points: [
      "Pakai method `*Context` (`db.QueryContext`, `db.ExecContext`, `db.BeginTx`) agar query lambat ikut batal begitu client HTTP memutus koneksi.",
      "Panggil `defer rows.Close()` tepat sesudah mengecek `err` pada `QueryContext`. Jangan memakai `QueryContext` untuk perintah tanpa baris hasil (pakai `ExecContext`, kalau tidak koneksinya bocor), dan selalu tutup loop dengan `if err := rows.Err(); err != nil`.",
      "Bungkus penulisan multi-langkah ke dalam `BeginTx` beserta `defer func() { _ = tx.Rollback() }()`, lalu akhiri dengan `return tx.Commit()`. Jika commit sudah berhasil, rollback hanya mengembalikan `sql.ErrTxDone` tanpa efek samping.",
      "Pakai `sql.Null[T]` (Go 1.22+, seperti `sql.Null[string]`) atau pointer untuk kolom NULL, serta `uuid.NewV7()` bawaan Go 1.27+ agar primary key berurut waktu dan index B-tree tidak mudah terpecah.",
      "Tulis query terparameterisasi `$1` atau `@p1` langsung memakai `database/sql`, `pgx` untuk performa Postgres tinggi, atau `sqlc` yang menghasilkan kode Go dari file `.sql` saat build."
    ],
    practice: "Sambungkan `ListProducts` dan `DecrementStock` ke database Postgres (`pgx/v5/stdlib`) atau SQLite (`modernc.org/sqlite`) di proyek percobaan, uji efek `ConfigurePool` saat banyak goroutine memanggilnya, dan buktikan `rows.Close()` tetap melepas koneksi meski terjadi error scanning di tengah baris.",
    teach: "Jelaskan mengapa melewatkan `rows.Err()` setelah `for rows.Next()` bisa mengembalikan data yang terpotong tanpa memunculkan error saat koneksi terputus di tengah jalan, serta mengapa `uuid.NewV7()` meminimalkan fragmentasi B-tree dibanding UUIDv4 acak.",
    analogy: "Meminjam koneksi dari `*sql.DB` itu seperti meminjam ruang baca perpustakaan. `defer rows.Close()` memastikan kuncinya selalu dikembalikan meski keluar cepat, lalu `rows.Err()` mengecek apakah printer macet sebelum kamu menganggap semua halaman sudah tercetak.",
    pitfalls: [
      "Memanggil `db.QueryContext` untuk `INSERT` atau `UPDATE` lalu membuang hasil `*sql.Rows`. Tiap pemanggilan membocorkan satu koneksi pool sampai database penuh.",
      "Menyusun klausa `ORDER BY` atau `WHERE` dari input user lewat `fmt.Sprintf` ketimbang memakai parameter (`$1`/`@p1`) dan allowlist nama kolom.",
      "Melupakan `db.SetMaxOpenConns(...)`, membuat default tanpa batas milik Go membanjiri database dengan ribuan koneksi saat traffic melonjak."
    ],
    quiz: {
      'check-rows-err-rows': ["Mengapa wajib memeriksa `rows.Err()` setelah `for rows.Next() { ... }` selesai?", ["Menutup koneksi ke DB", "`rows.Next()` mengembalikan `false` baik saat EOF normal MAUPUN saat terjadi error di tengah iterasi; `rows.Err()` membedakan keduanya", "Melakukan commit transaksi", "Membebaskan memori lebih cepat"], "Tanpa `rows.Err()`, putusnya koneksi di tengah pembacaan tampak seperti akhir baris yang normal."],
      'defer-func-tx-rollback': ["Mengapa `defer func() { _ = tx.Rollback() }()` aman ditulis tepat setelah `db.BeginTx`?", ["Ia membatalkan `Commit()`", "Jika `tx.Commit()` sudah berjalan, `Rollback()` mengembalikan `sql.ErrTxDone` tanpa efek samping; jika function keluar lebih awal karena error, ia otomatis me-rollback", "Ia menonaktifkan lock baris", "Go menjalankan `defer` sebelum `Commit()`"], "Pola ini memastikan seluruh jalur kegagalan dibatalkan tanpa menulis rollback di setiap `if err != nil`."],
      'uuid-newv7-go-27': ["Mengapa `uuid.NewV7()` (Go 1.27+) bekerja lebih baik untuk primary key SQL dibanding `uuid.NewV4()` yang acak?", ["v7 lebih pendek", "v7 menyertakan awalan timestamp sehingga baris baru masuk berurutan ke halaman B-tree dengan fragmentasi indeks jauh lebih sedikit", "v4 tidak bisa diindeks", "v7 mengenkripsi isi kolom"], "UUIDv7 yang berurut waktu menjaga lokalitas B-tree dan performa cache halaman indeks."]
    }
  },
  concurrency: {
    terms: [
      ['Bounded worker pool', 'Menjalankan sejumlah tetap `N` worker yang membaca dari channel tugas (atau `errgroup.SetLimit(N)`) agar jumlah goroutine tidak meledak mengikuti jumlah input.'],
      ['`sync.Mutex` & `atomic.Int64`', 'Melindungi struct bersama yang berubah-ubah (`Mutex` ditahan sesingkat mungkin, jangan melewati I/O) atau counter tunggal (`atomic`) agar terhindar dari race pada map dan field.'],
      ['Profil `goroutineleak` (Go 1.27+)', 'Profil standar `runtime/pprof` untuk mendeteksi goroutine yang terblokir permanen pada channel atau lock, tersedia langsung tanpa flag khusus sejak Go 1.27.']
    ],
    title: 'Worker pool, sinkronisasi, dan keamanan race',
    why: "Menjalankan 50.000 goroutine sekaligus ke API luar akan menghabiskan RAM, file descriptor, dan kuota koneksi database. Kode Go produksi membatasi jumlah worker aktif, menjaga kunci mutex sesingkat mungkin, dan memeriksa kebocoran lewat race detector serta profil `goroutineleak`.",
    points: [
      "Batasi konkurensi atas input user atau daftar item panjang memakai worker pool tetap atau `golang.org/x/sync/errgroup` (`g.SetLimit(N)` dengan `errgroup.WithContext`).",
      "Jaga critical section `sync.Mutex` tetap pendek dan jangan melakukan I/O jaringan atau disk saat menahan lock. Jangan menyalin struct yang berisi `sync.Mutex`, dan jangan meng-upgrade `RWMutex.RLock()` ke `Lock()` sebelum melepas kunci baca karena pasti deadlock.",
      "Untuk counter atau flag tunggal, pakai atomic bertipe (`atomic.Int64`, `atomic.Bool`). Untuk inisialisasi malas sekali jalan, pakai `sync.OnceValue(fn)` (Go 1.21+).",
      "Uji kode konkuren dengan `go test -race ./...` (butuh CGO dan compiler C) serta `testing/synctest`. Di Go 1.27+, cek `/debug/pprof/goroutineleak` atau `pprof.Lookup(\"goroutineleak\")` untuk menemukan goroutine yang terblokir permanen."
    ],
    practice: "Jalankan kode ini dan amati pembatalan worker lebih awal ketika `id == 4` gagal, lalu periksa dokumentasi `go doc golang.org/x/sync/errgroup` serta cek `/debug/pprof/goroutineleak` di Go 1.27. Coba ubah nilai `max(1, workers)` dan pastikan `leakProf.Count() == 0`.",
    teach: "Jelaskan mengapa dua goroutine yang menulis bersamaan ke satu `map` langsung memicu crash fatal (`fatal error: concurrent map writes`), serta jelaskan mengapa meng-upgrade `RLock` menjadi `Lock` tanpa melepas read lock lebih dulu pasti deadlock.",
    analogy: "Bounded worker pool itu seperti membuka 4 meja kasir untuk 1.000 pembeli daripada membiarkan seribu orang masuk ke belakang kasir sekaligus. Antrean berjalan stabil, database tetap sehat, dan menutup channel tugas mengosongkan pekerja yang tersisa.",
    pitfalls: [
      "Memanggil `wg.Add(1)` *di dalam* goroutine, bukan sebelum `go` (`wg.Go` mencegah bug ini otomatis).",
      "Menahan `sync.Mutex` saat melakukan pemanggilan HTTP atau query SQL sehingga seluruh request lain antre di belakang satu koneksi lambat.",
      "Meng-upgrade `RLock()` langsung menjadi `Lock()`, yang membuat pembaca lain dan penulis berikutnya deadlock permanen."
    ],
    quiz: {
      'happens-go-two-goroutines': ["Apa yang terjadi di Go apabila dua goroutine memodifikasi `map[string]int` biasa pada saat yang sama tanpa pengunci?", ["Nilai terakhir menang diam-diam", "Runtime langsung memicu crash fatal yang tidak bisa di-recover (`concurrent map writes`)", "Go otomatis mengunci map tersebut", "Mengembalikan nilai error"], "Go mendeteksi penulisan map bersamaan saat runtime dan langsung menghentikan proses sebelum hash bucket korup."],
      'cap-concurrency-worker-pool': ["Mengapa membatasi konkurensi dengan worker pool atau `errgroup.SetLimit(n)` daripada `for _, item := range items { go work(item) }`?", ["Lebih dari 10 goroutine gagal compile", "Fan-out tanpa batas menaikkan tekanan memori, file descriptor, dan koneksi DB secara bersamaan hingga sistem tumbang", "Channel maksimal 8 elemen", "`WaitGroup` maksimal 64"], "Konkurensi terbatas menjaga stabilitas memori sekaligus melindungi dependensi hilir."],
      'pprof-lookup-goroutineleak-ga': ["Apa yang dideteksi oleh `pprof.Lookup(\"goroutineleak\")` (GA di Go 1.27+)?", ["Loop CPU panas", "Goroutine yang terblokir permanen pada channel atau lock sehingga tidak akan pernah bisa dilanjutkan kembali", "Query SQL lambat", "Alokasi di stack"], "Go 1.27 merilis profil `goroutineleak` secara umum untuk melacak goroutine yang terjebak permanen."]
    }
  },
  architecture: {
    splits: ['1 · Config & options', '2 · Wiring & handlers', '3 · Graceful shutdown'],
    terms: [
      ['Wiring eksplisit di `main`', 'Merangkai dependensi (`db` -> `store` -> `handler` -> `server`) langsung di `cmd/api/main.go` supaya alur startup terlihat jelas tanpa DI container berbasis reflection.'],
      ['`log/slog` & `NewMultiHandler` (Go 1.26+)', 'Logger JSON terstruktur di stdlib; `slog.NewMultiHandler` mengirim catatan log ke stdout dan penampung error sekaligus tanpa library eksternal.'],
      ['`signal.NotifyContext` + `Shutdown`', 'Menangkap `SIGINT` dan `SIGTERM`, berhenti menerima koneksi baru, lalu menuntaskan handler yang masih jalan sebelum menutup pool database.']
    ],
    title: 'Graceful shutdown, slog, dan wiring eksplisit',
    why: "Aplikasi Go menghindari hook tersembunyi seperti `init()` maupun framework container yang buram. Merangkai constructor di `main()`, memvalidasi config melalui functional options, mencatat log terstruktur lewat `slog`, dan menutup server sebelum pool database membuat proses deploy dan matinya layanan mudah ditebak.",
    points: [
      "Hindari `init()` dan variabel global: `init()` berjalan sebelum `main()` tanpa kendali pemanggil, tidak bisa mengembalikan error, dan mengikat state antar-test. Rangkai dependensi di `main()` (terima interface, kembalikan struct).",
      "Functional options (`func NewServer(addr string, opts ...Option) (*Server, error)`) menjaga parameter default tetap ringkas sekaligus memunculkan error config saat startup, daripada gagal waktu request datang.",
      "Pakai `log/slog` (Go 1.21+) dengan teks pesan log yang konsisten dan atribut terstruktur (`slog.String(\"method\", r.Method)`). Gunakan `slog.NewMultiHandler` (Go 1.26+) saat perlu menyalurkan log ke lebih dari satu tujuan.",
      "Matikan layanan secara berurutan: dengarkan `SIGINT` dan `SIGTERM` lewat `signal.NotifyContext(context.Background(), ...)`, tunggu handler aktif lewat `srv.Shutdown(shutCtx)` memakai context timeout baru, baru tutup pool DB (`defer db.Close()`). Jalankan `govulncheck` dan `golangci-lint` di CI."
    ],
    practice: "Ubah `main()` sementara untuk memanggil `runApp(ctx, log)`, jalankan server, akses `/healthz`, tekan Ctrl+C (`SIGINT`), dan lihat pesan `draining in-flight requests` sebelum proses berhenti. Jalankan pula `govulncheck ./...` dan `golangci-lint run ./...` untuk memastikan tidak ada temuan keamanan atau resource leak.",
    teach: "Jelaskan mengapa aplikasi Go produksi lebih memilih wiring eksplisit di `main()` serta urutan `server.Shutdown(ctx)` sebelum `db.Close()` dibandingkan inisialisasi global di `init()`.",
    analogy: "Graceful shutdown itu seperti menutup toko: kunci pintu masuk lebih dulu (`Shutdown` berhenti menerima koneksi baru), tunggu pembeli di kasir menyelesaikan pembayaran (handler aktif rampung), lalu matikan listrik gudang (`db.Close`).",
    pitfalls: [
      "Menutup `db.Close()` sebelum `srv.Shutdown(shutCtx)` selesai, membuat request yang hampir rampung gagal mendadak di tengah rolling deploy.",
      "Mengoper sinyal `ctx` yang sudah dibatalkan ke `srv.Shutdown(ctx)`. Karena context-nya sudah berstatus batal, `Shutdown` langsung berhenti tanpa memberi waktu tunggu kecuali kamu membuat `WithTimeout(context.Background(), ...)` baru.",
      "Menyelipkan ID user yang terus berganti ke teks utama log (`slog.Info(\"gagal \" + id)`). Jaga teks pesan tetap konsisten dan taruh datanya sebagai atribut (`slog.Info(\"request failed\", \"userId\", id)`)."
    ],
    quiz: {
      'pass-fresh-context-withtimeout': ["Mengapa wajib memakai `context.WithTimeout(context.Background(), 10*time.Second)` baru saat memanggil `srv.Shutdown(...)` alih-alih mengoper signal `ctx`?", ["`context.Background()` mematikan log JSON", "Signal `ctx` sudah berstatus cancelled, sehingga memberikannya ke `Shutdown` tidak menyisakan waktu tunggu bagi request yang masih aktif", "Go melarang signal context di `net/http`", "`Shutdown` mengabaikan timeout"], "Context yang sudah batal membuat `srv.Shutdown` langsung keluar dengan `context.Canceled` sebelum menyelesaikan request yang sedang berjalan."],
      'order-resources-shut-down': ["Dalam urutan mana resource seharusnya ditutup saat menerima `SIGTERM`?", ["Tutup DB pool dulu, baru matikan HTTP server", "Hentikan listener HTTP dan tunggu request aktif tuntas (`srv.Shutdown`), BARU tutup pool DB", "Hentikan paksa dengan `os.Exit(1)` langsung", "Urutan penutupan tidak berpengaruh"], "Request yang masih berjalan tetap membutuhkan koneksi database sampai ia selesai mengirim respons."],
      'avoid-init-functions-reading': ["Mengapa sebaiknya menghindari `init()` untuk membaca konfigurasi atau membuka koneksi database?", ["`init()` berjalan saat import tanpa kendali pemanggil, tidak bisa mengembalikan error, dan membuat test bergantung urutan import", "`init()` sudah dihapus di Go 1.25", "`init()` berjalan setelah `main()`", "`init()` mematikan GC"], "Constructor eksplisit di `main()` membuat dependensi terlihat jelas, mudah diuji, dan error-nya mudah diperiksa."]
    }
  },
  profiling: {
    splits: ['1 · format.go', '2 · format_bench_test.go'],
    terms: [
      ['Escape analysis (`-gcflags=-m`)', 'Menentukan saat compile time apakah sebuah nilai cukup tinggal di stack goroutine atau harus dipindahkan ke heap yang dikelola GC.'],
      ['Selisih statistik `benchstat`', 'Membandingkan beberapa kali run benchmark (`-count=6`) untuk memisahkan penghematan CPU atau memori (`B/op`, `allocs/op`) dari noise antar-run.'],
      ['Profile-Guided Optimization (PGO)', 'Memasukkan profil CPU nyata (`default.pgo`) ke `go build` supaya compiler meng-inline dan mengoptimasi pemanggilan interface yang paling sering berjalan.']
    ],
    title: 'Memory escape, benchmark, dan pprof',
    why: "Menebak bagian kode Go yang lambat sering kali salah sasaran. Cek keputusan stack vs heap compiler dengan `-gcflags=-m`, buktikan hasilnya lewat beberapa kali run menggunakan `b.Loop()` dan `benchstat`, lalu baca profil CPU, heap, dan `goroutineleak` di `pprof`.",
    points: [
      "Ukur lebih dulu sebelum mengoptimasi: pastikan lambatnya bukan karena I/O eksternal (`pprof` goroutine atau `runtime/trace.FlightRecorder` di Go 1.25+), baru lihat titik alokasi tertinggi (`alloc_objects`, `B/op`, `allocs/op`).",
      "Jalankan `go build -gcflags=-m` untuk melihat alasan variabel pindah ke heap: mengembalikan pointer lokal, tertangkap closure, masuk ke interface, atau dikirim ke format `any`. Nilai di stack bebas biaya saat function selesai.",
      "Langkah alokasi paling efektif: tentukan kapasitas awal slice/map (`make([]byte, 0, cap)`), ganti `+` atau `fmt.Sprintf` di dalam loop memakai `strings.Builder` atau `strconv.AppendInt`, serta pakai ulang buffer lewat `sync.Pool` (ingat `Reset()` sebelum `Put()`).",
      "Ukur dengan `b.Loop()` (Go 1.24+), `-benchmem -count=6`, dan `benchstat`. Ulangi pengukuran baseline di versi Go yang sama saat upgrade, sebab Green Tea GC di Go 1.26 dan size-specialized allocator Go 1.27 ikut menggeser angka.",
      "Sertakan profil CPU produksi (`default.pgo`) agar PGO pada `go build` otomatis mengoptimasi jalur panas."
    ],
    practice: "Simpan kedua tab ke sebuah module, jalankan `go test -bench=. -benchmem -count=5`, lalu bandingkan `allocs/op` antara `BuildCSVNaive` (alokasi string `O(n)`) dan `BuildCSVFast` (`1 alloc/op`). Jalankan pula `go build -gcflags=-m` untuk mengamati keputusan stack vs heap compiler.",
    teach: "Jelaskan apa yang dilakukan escape analysis saat compile time, mengapa menekan angka `allocs/op` sering memberi dampak latency lebih besar daripada trik mikro, dan mengapa baseline `benchstat` wajib diulang saat berganti versi Go.",
    analogy: "Memori stack itu papan tulis di sebelah mejamu yang langsung bersih tanpa biaya begitu fungsi selesai. Memori heap adalah gudang bersama yang dirapikan petugas kebersihan malam (GC), jadi semakin sedikit nilai masuk ke gudang, semakin ringan kerjanya.",
    pitfalls: [
      "Menjalankan benchmark sekali tanpa `-benchmem` atau `-count` lalu mempercayai selisih 3% yang cuma noise CPU.",
      "Mengembalikan slice atau buffer ke `sync.Pool` tanpa `buf.Reset()`, yang membocorkan data request sebelumnya atau menahan buffer raksasa 10 MB di pool.",
      "Mengutak-atik alokasi mikro sementara 95% waktu request sebenarnya habis menunggu query SQL yang belum memakai index."
    ],
    quiz: {
      'go-build-gcflags-show': ["Apa yang ditampilkan oleh perintah `go build -gcflags=-m`?", ["Ukuran binary mobile", "Keputusan escape analysis dan inlining compiler yang menunjukkan variabel mana di stack vs yang pindah ke heap", "Execution plan SQL", "Jumlah goroutine bocor"], "`-gcflags=-m` mencetak analisis penempatan stack vs heap dan keputusan inline saat build."],
      'call-grow-estimatedbytes-strings': ["Mengapa memanggil `b.Grow(estimatedBytes)` pada `strings.Builder` di jalur panas?", ["Otomatis mengompres string", "Mengalokasikan backing byte slice satu kali di depan sehingga `allocs/op` turun mendekati 1", "Melewati validasi UTF-8", "Memaksa builder tetap di stack secara permanen"], "Satu alokasi berkapasitas tepat menghindari salinan berulang tiap kapasitas internal digandakan."],
      're-run-baseline-benchmark': ["Mengapa harus mengulang benchmark baseline setelah melakukan upgrade toolchain Go (mis. 1.26 -> 1.27)?", ["Benchmark lama tidak mau berjalan", "Perbaikan GC dan allocator runtime (seperti Green Tea GC Go 1.26 dan size-specialized allocator Go 1.27) mengubah skor secara independen dari kodemu", "`benchstat` menolak nama file yang berbeda", "`b.Loop()` mengganti satuan waktunya"], "Membandingkan baseline toolchain lama melawan kode baru mencampur efek upgrade compiler dengan efek perubahan kodemu."]
    }
  }
}
};

export default trackId;
