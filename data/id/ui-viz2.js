// Bahasa Indonesia — teks visualisasi di js/vizcss.js dan js/vizmore.js.
I18N.add({
  // specificity
  'Cascade and specificity': 'Cascade dan specificity',
  'Several rules all try to color the same link. Toggle them on or off to see which rule wins and why.': 'Beberapa rule sama-sama mewarnai link yang sama. Aktifkan atau matikan rule untuk melihat mana yang menang dan alasannya.',
  'No rule applies: the link keeps its default colour.': 'Tidak ada rule yang berlaku: link tetap memakai warna default-nya.',
  "!important outranks everything else, even inline styles. That's why it should be a last resort.": '!important mengungguli aturan lain, termasuk inline style. Karena itulah pakai hanya sebagai pilihan terakhir.',
  'Inline styles beat every selector, whatever its specificity.': 'Inline style mengalahkan semua selector, berapa pun specificity-nya.',
  '“{a}” and “{b}” have equal specificity ({s}), so the one declared later wins.': '“{a}” dan “{b}” punya specificity sama ({s}), jadi aturan yang ditulis lebih akhir yang menang.',
  '“{a}” wins with specificity ({s}). Compare column by column: ids first, then classes, then elements.': '“{a}” menang dengan specificity ({s}). Bandingkan berurutan per kolom: id dulu, lalu class, lalu element.',
  'Target element: ': 'Element target: ',
  ' (rules are listed in source order).': ' (rule diurutkan sesuai source).',
  'Winning result': 'Hasil akhir',

  // box model
  'Box model': 'Box model',
  'The dashed frame is a 320px-wide parent. Adjust the element and watch what `width` really means under each box-sizing.': 'Bingkai putus-putus adalah parent selebar 320px. Atur element-nya dan perhatikan apa arti `width` yang sebenarnya di tiap box-sizing.',
  'border-box: rendered width = width = {w}px (padding and border fit inside).': 'border-box: lebar yang tampil = width = {w}px (padding dan border masuk di dalamnya).',
  'content-box: rendered width = {w} + 2×{p} padding + 2×{b} border = {r}px.': 'content-box: lebar yang tampil = {w} + 2×{p} padding + 2×{b} border = {r}px.',
  ' With margins it takes {total}px': ' Ditambah margin, lebarnya menjadi {total}px',
  '. That exceeds the 320px parent, so it OVERFLOWS.': '. Lebar itu melampaui parent 320px, jadi OVERFLOW.',
  ', fitting inside the 320px parent.': ', masih muat di parent 320px.',
  'Orange = margin · solid edge = border · green = padding · blue = content': 'Oranye = margin · garis tepi solid = border · hijau = padding · biru = content',

  // flexbox
  'Flexbox playground': 'Flexbox playground',
  'Change the container’s properties and watch the items move. The matching CSS and Tailwind classes update below.': 'Ubah property milik container dan lihat item-itemnya bergerak. CSS dan class Tailwind yang setara ikut berubah di bawahnya.',
  'Main axis is horizontal: justify-content moves items left/right, align-items moves them up/down.': 'Main axis-nya horizontal: justify-content menggeser item ke kiri/kanan, align-items menggesernya ke atas/bawah.',
  'Main axis is now vertical: justify-content moves items up/down, and align-items moves them left/right.': 'Sekarang main axis-nya vertikal: justify-content menggeser item ke atas/bawah, dan align-items menggesernya ke kiri/kanan.',

  // grid
  'Grid playground': 'Grid playground',
  'Pick a column template, then resize the window with auto-fit selected to see a responsive grid with no media queries.': 'Pilih template kolom, lalu ubah ukuran window saat auto-fit terpilih untuk melihat grid yang responsif tanpa media query.',
  'Three equal columns: the free space is split into three fractions.': 'Tiga kolom sama lebar: ruang yang tersedia dibagi jadi tiga fraction.',
  'A fixed 200px sidebar column beside one flexible column filling the remaining width.': 'Satu kolom sidebar tetap 200px di samping satu kolom fleksibel yang mengisi sisa lebar.',
  'The middle column gets twice the share of the others.': 'Kolom tengah mendapat jatah dua kali lipat kolom lainnya.',
  'As many columns as fit, each at least 120px, stretched to fill the row. Narrow the window and columns drop away.': 'Sebanyak mungkin kolom yang muat, masing-masing minimal 120px, lalu direntangkan memenuhi baris. Persempit window-nya dan kolom akan berkurang.',
  'columns ': 'kolom ',
  'item 1 spans 2 columns': 'item 1 melebar 2 kolom',
  'item 4 full width': 'item 4 selebar penuh',

  // Big-O
  'Big-O growth': 'Pertumbuhan Big-O',
  'Pick an input size and compare how many steps each complexity class needs. Bars use a log scale so the faster classes stay visible alongside the worst one.': 'Pilih ukuran input dan bandingkan jumlah langkah tiap kelas complexity. Bar-nya memakai skala logaritmik supaya kelas yang lebih cepat tetap terlihat di samping kelas terburuk.',
  'hash lookup': 'hash lookup', 'binary search': 'binary search', 'one loop': 'satu loop',
  'sorting': 'sorting', 'nested loops': 'nested loop', 'all subsets': 'semua subset',
  'more than 10³⁰': 'lebih dari 10³⁰',
  'longer than the age of the universe': 'lebih lama dari umur alam semesta',
  'instant': 'instan', 'hours': 'jam', 'days': 'hari', 'years': 'tahun',
  'Class': 'Kelas', 'Typical cause': 'Penyebab umum', 'Steps': 'Langkah', 'At 100 M steps/s': 'Pada 100 juta langkah/detik',
  'Going from n = 1,000 to n = 1,000,000 multiplies O(n) work by a thousand, and O(n²) work by a million. Choosing the right algorithm matters far more than a faster machine.': 'Naik dari n = 1.000 ke n = 1.000.000 bikin kerja O(n) naik seribu kali lipat, sementara O(n²) melonjak sejuta kali. Memilih algoritma yang tepat jauh lebih berpengaruh daripada komputer yang lebih cepat.',

  // sorting
  'Sorting algorithms': 'Algoritma sorting',
  'Watch four algorithms sort the same 24 values and compare how many comparisons each one needs.': 'Lihat empat algoritma mengurutkan 24 nilai yang sama, lalu bandingkan berapa banyak perbandingan yang dibutuhkan masing-masing.',
  'Pick an algorithm and press Sort.': 'Pilih algoritma lalu tekan Sort.',
  'Algorithm': 'Algoritma',
  '{algo} used {c} comparisons for {n} values. n² is {sq}, while n·log₂n is about {nlog}.': '{algo} memakai {c} perbandingan untuk {n} nilai. n² adalah {sq}, sedangkan n·log₂n sekitar {nlog}.',
  'Sort': 'Sort', 'Shuffle': 'Acak',
  'Comparisons: ': 'Perbandingan: ',

  // event loop
  'The JavaScript event loop': 'Event loop JavaScript',
  'Four lines, one thread. Step through to see why the output order is 1, 2, 3, 4.': 'Empat baris, satu thread. Telusuri langkah demi langkah untuk melihat kenapa urutan output-nya 1, 2, 3, 4.',
  'Synchronous code runs immediately, top to bottom, on the single thread.': 'Kode synchronous langsung dijalankan, dari atas ke bawah, di satu-satunya thread.',
  "setTimeout doesn't run the callback right away. It tells the browser to queue it as a TASK when the timer ends, even if the delay is 0.": 'setTimeout tidak langsung menjalankan callback-nya. Ia meminta browser memasukkan callback ke antrean sebagai TASK setelah timer selesai, meski delay-nya 0.',
  'The promise is already resolved, so its callback is queued as a MICROTASK. It still does not run yet.': 'Promise-nya sudah resolved, jadi callback-nya masuk antrean sebagai MICROTASK. Tapi tetap belum dijalankan.',
  'The script keeps going. Nothing queued can interrupt running synchronous code.': 'Script terus berjalan. Tidak ada isi antrean yang bisa menyela kode synchronous yang sedang jalan.',
  'The script has finished and the call stack is empty. The event loop now checks the microtask queue FIRST.': 'Script sudah selesai dan call stack kosong. Sekarang event loop mengecek microtask queue LEBIH DULU.',
  'All microtasks run until the queue is empty, before any task and before the browser can repaint.': 'Semua microtask dijalankan sampai antreannya kosong, sebelum task apa pun atau sebelum browser menggambar ulang layar.',
  'Only now does the event loop take ONE task: the timeout callback. After it, microtasks would be checked again.': 'Baru sekarang event loop mengambil SATU task: callback timeout. Setelah itu, microtask akan dicek lagi.',
  'Done. Order: synchronous code → all microtasks → one task → microtasks again → next task…': 'Selesai. Urutannya: kode synchronous → semua microtask → satu task → microtask lagi → task berikutnya…',
  'Call stack': 'Call stack',
  'Microtask queue (promises)': 'Microtask queue (promise)',
  'Task queue (timers, events)': 'Task queue (timer, event)',
  'Console': 'Console',

  // Graph search
  "BFS and DFS on a graph": "BFS dan DFS pada graph",
  "Search from A to F with each algorithm and compare their paths. BFS uses a queue layer by layer, while DFS follows one branch deep.": "Cari jalur dari A ke F dengan tiap algoritma dan bandingkan hasilnya. BFS memakai queue per lapisan jarak, sedangkan DFS menelusuri satu cabang sedalam mungkin.",
  "Start at {node}: distance 0. It goes into the queue.": "Mulai dari {node}: jarak 0. Node ini masuk ke queue.",
  "Take {node} from the front of the queue (distance {d}). Unvisited neighbours go to the back: {added}.": "Ambil {node} dari depan queue (jarak {d}). Tetangga yang belum dikunjungi masuk ke belakang: {added}.",
  "{node} reached at distance {d}: {path}. BFS finishes every node at distance {prev} before any at distance {d}, so the first path it finds is a shortest one.": "{node} ketemu di jarak {d}: {path}. BFS menyelesaikan semua node berjarak {prev} dulu sebelum menyentuh jarak {d}, jadi rute pertamanya pasti sesingkat mungkin.",
  "Go deeper to {node}. The recursion stack is the current path: {path}.": "Masuk lebih dalam ke {node}. Recursion stack adalah path saat ini: {path}.",
  "{node} has no unvisited neighbours left, so the recursion returns to {back}.": "{node} tidak punya tetangga yang belum dikunjungi, jadi rekursinya kembali ke {back}.",
  "{node} found via {path}: {n} steps. DFS found a path, but not the shortest: BFS needs 3.": "{node} ketemu lewat {path} dalam {n} langkah. DFS memang dapat jalur, tapi bukan yang terpendek (BFS cuma perlu 3).", 
  "none": "tidak ada",
  "Graph with nodes A to H": "Graph dengan node A sampai H",
  "Queue (front first)": "Queue (depan lebih dulu)",
  "Recursion stack (top first)": "Recursion stack (atas lebih dulu)",
  "Visited, in order": "Urutan dikunjungi",
  "BFS (queue)": "BFS (queue)",
  "DFS (recursion)": "DFS (rekursi)",
  "n = {n}": "n = {n}",
  "Current node": "Node aktif",
  "In frontier": "Di frontier",
  "Visited": "Sudah dikunjungi",
  "Found path": "Jalur ditemukan"
});
