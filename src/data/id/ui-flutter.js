// @ts-check
// Bahasa Indonesia — teks antarmuka untuk track Dart + Flutter: playground dan visualisasi di js/vizflutter.js.
const dict = {
  // navigation, lesson page, setup guide
  'Dart + Flutter playground': 'Dart + Flutter playground',
  'Open Dart + Flutter playground': 'Buka Dart + Flutter playground',
  '6. Your first Flutter app': '6. Aplikasi Flutter pertamamu',
  '`flutter doctor` tells you what is still missing for each platform. The web target needs only Chrome, so you can start before setting up Android Studio or Xcode.': '`flutter doctor` memberi tahu apa yang masih kurang untuk tiap platform. Target web hanya butuh Chrome, jadi kamu bisa mulai sebelum menyiapkan Android Studio atau Xcode.',

  // playground
  'DartPad compiles and runs real Dart and Flutter right in your browser. Pick a lesson sample, click Run, edit the code, and try it again.': 'DartPad menjalankan Dart dan Flutter sungguhan langsung di browsermu. Pilih contoh dari materi, klik Run, ubah kodenya, lalu jalankan lagi.',
  'Lesson sample': 'Contoh dari materi',
  'The sample is sent to DartPad automatically. If the editor on the right does not show it, press Copy and paste it in.': 'Contohnya otomatis dikirim ke DartPad. Kalau editor di sebelah kanan tidak menampilkannya, tekan Salin lalu paste di sana.',
  'DartPad needs an internet connection. Samples that use packages such as flutter_bloc or go_router are meant for a local project: ': 'DartPad butuh koneksi internet. Contoh yang memakai package seperti flutter_bloc atau go_router ditujukan untuk project lokal: ',

  // constraints
  'Constraints go down, sizes go up': 'Constraint turun, size naik',
  'Follow one layout pass through Padding → Row → three children on a 360-wide screen. Then remove Expanded and watch the overflow happen.': 'Ikuti satu layout pass melewati Padding → Row → tiga child di layar selebar 360. Lalu lepas Expanded dan lihat overflow terjadi.',
  ' Wrap Text in Expanded': ' Bungkus Text dengan Expanded',
  'Constraints received ↓': 'Constraint yang diterima ↓',
  'Size reported ↑': 'Size yang dilaporkan ↑',
  'The Row’s 328 pixels': '328 pixel milik Row',
  'The screen gives Padding a tight constraint: be exactly 360 wide.': 'Layar memberi Padding constraint yang tight: lebarnya harus persis 360.',
  'Padding keeps 16 on each side for itself and passes what is left down: Row may be up to 328 wide.': 'Padding mengambil 16 di tiap sisi untuk dirinya, lalu meneruskan sisanya ke bawah: Row boleh selebar maksimal 328.',
  'Row lays out its non-flexible children first, with unbounded width. Icon answers 40, IconButton answers 48. Sizes go up.': 'Row me-layout dulu child yang tidak fleksibel, dengan lebar tanpa batas. Icon menjawab 40, IconButton menjawab 48. Size naik ke atas.',
  'Space left: 328 − 40 − 48 = 240. Expanded gives Text a tight width of exactly 240, so it wraps onto two lines and reports 240 × 40.': 'Ruang tersisa: 328 − 40 − 48 = 240. Expanded memberi Text lebar tight persis 240, jadi teksnya turun jadi dua baris dan melaporkan 240 × 40.',
  'Without Expanded, Text also gets unbounded width. It lays out on one long line at 520 × 20, which exceeds what Row has.': 'Tanpa Expanded, Text ikut mendapat lebar tanpa batas. Teks memanjang dalam satu baris berukuran 520 × 20, melebihi ruang Row.',
  'Row reports 328 × 48 (the tallest child), Padding adds its 16 and reports 360 × 80. Finally parents set positions: Icon at x = 0, Text at x = 40, IconButton at x = 280.': 'Row melaporkan 328 × 48 (mengikuti child tertinggi), Padding menambahkan 16 miliknya lalu melaporkan 360 × 80. Terakhir, parent menentukan posisi: Icon di x = 0, Text di x = 40, dan IconButton di x = 280.',
  'Children need 40 + 520 + 48 = 608, while the Row is only 328 wide: “RenderFlex overflowed by 280 pixels”. The Row can\'t grow because its parent set the limit, so wrap Text in Expanded or Flexible.': 'Ketiga child butuh 40 + 520 + 48 = 608, padahal Row cuma selebar 328: “RenderFlex overflowed by 280 pixels”. Row tidak bisa melebar karena batas datang dari parent, jadi bungkus Text dengan Expanded atau Flexible.',

  // rebuild explorer
  'Rebuild explorer': 'Rebuild explorer',
  'Tap a widget to call setState there. Everything that flashes ran build() again. Then mark the unchanged children const and try once more.': 'Tap sebuah widget untuk memanggil setState di sana. Semua yang berkedip berarti build()-nya jalan lagi. Lalu tandai child yang tidak berubah sebagai const dan coba sekali lagi.',
  'Tap any widget.': 'Tap widget mana saja.',
  ' Children are const (configuration unchanged)': ' Child-nya const (konfigurasinya tidak berubah)',
  'builds:': 'build:',
  'setState in {name} → {n} build() call(s)': 'setState di {name} → {n} pemanggilan build()',
  ', skipping {n} unchanged const subtree(s).': ', dan melewati {n} subtree const yang tidak berubah.',
  ': this widget and its subtree. Push state down or use BlocSelector to rebuild less.': ': widget ini beserta seluruh subtree-nya. Turunkan state ke child atau pakai BlocSelector supaya rebuild makin sedikit.',
  '. Parents and siblings never rebuild.': '. Parent dan sibling tidak pernah ikut rebuild.',
  'ProductsPage contains AppBar, ProductList and CartBadge. ProductList contains the three tiles.': 'ProductsPage berisi AppBar, ProductList, dan CartBadge. ProductList berisi tiga tile.',

  // three trees
  'Widget, element and render trees': 'Widget tree, element tree, dan render tree',
  'Five moments in the life of a small screen. Watch which of the three trees is recreated, which is updated, and where State lives.': 'Lima momen dalam hidup sebuah layar kecil. Perhatikan mana dari ketiga tree yang dibuat ulang, mana yang di-update, dan di mana State tinggal.',
  'Widget tree': 'Widget tree', 'Element tree': 'Element tree', 'Render tree': 'Render tree',
  'immutable configuration': 'konfigurasi yang immutable',
  'long-lived, holds State': 'bertahan lama, memegang State',
  'layout and paint': 'layout dan paint',
  'created': 'dibuat', 'updated': 'di-update', 'kept': 'tetap', 'wrong State!': 'State salah!',
  'First build. Widgets are created, each is inflated into an element, and elements create render objects. The State object is created and held by its element.': 'Build pertama. Widget dibuat, masing-masing di-inflate menjadi element, lalu element membuat render object. Object State dibuat dan disimpan oleh element-nya.',
  'setState: every widget is a new object, yet each element sees the same type in the same slot. It stays alive, keeps its State, and updates only the changed render object.': 'setState: tiap widget adalah object baru, tetapi setiap element melihat tipe yang sama di slot yang sama. Element bertahan, menjaga State-nya, dan cuma meng-update render object yang berubah.',
  'A different widget TYPE appears at position 1. The element cannot update itself to another type: the old element and render object are discarded and new ones created. Any State below that point would be lost.': 'Di posisi 1 muncul widget dengan TYPE berbeda. Element tidak bisa meng-update dirinya ke type lain: element dan render object lama dibuang, lalu dibuat yang baru. State di bawah titik itu ikut hilang.',
  'Two stateful siblings swap places, WITHOUT keys. Elements match by position and type only, so each element stays where it was: B is now shown with A’s count. This is the classic reordered-list bug.': 'Dua sibling stateful bertukar tempat TANPA key. Element cuma dicocokkan berdasarkan posisi dan type, jadi tiap element tetap di slot lama: sekarang B tampil dengan hitungan milik A. Inilah bug klasik pada list yang diurutkan ulang.',
  'The same swap WITH keys: elements match by key, so each element moves with its widget alongside its State and render object. Keys tell Flutter which widget is which.': 'Pertukaran yang sama DENGAN key: element dicocokkan berdasarkan key, jadi tiap element berpindah mengikuti widget-nya bersama State dan render object. Key memberi tahu Flutter widget mana yang mana.'
};

export default dict;
