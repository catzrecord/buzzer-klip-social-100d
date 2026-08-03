import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const planPath = path.join(root, "content-plan.json");
const start = new Date("2026-08-01T00:00:00Z");
const campaignTheme = "Potong. Posting. Cuan.";
const carouselSlides = 5;
const existingPlan = await fs
  .readFile(planPath, "utf8")
  .then((value) => JSON.parse(value))
  .catch((error) => {
    if (error?.code === "ENOENT") return [];
    throw error;
  });
const existingById = new Map(existingPlan.map((item) => [Number(item.id), item]));

function seededRandom(seedText) {
  let seed = 2166136261;
  for (const char of seedText) {
    seed ^= char.charCodeAt(0);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(values, random) {
  const output = [...values];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

const random = seededRandom("buzzer-klip-100d-carousel-single-v2");
const postTypes = [];
for (let week = 0; week < 14; week += 1) {
  postTypes.push(
    ...shuffled(
      ["carousel", "carousel", "carousel", "single", "single", "single", "single"],
      random,
    ),
  );
}
postTypes.push(...shuffled(["carousel", "single"], random));

const pillars = [
  {
    name: "Hook yang Nempel",
    hashtag: "#HookKonten #BuzzerKlip",
    ideas: [
      ["3 Detik Pertama Menentukan", "Kalau pembuka masih muter-muter, penonton sudah keburu swipe.", "Mulai dengan konflik, hasil, atau kalimat yang bikin orang merasa sedang diajak bicara.", "Coba cek tiga detik pertama videomu hari ini."],
      ["Buka Dengan Hasil", "Penonton suka tahu alasan untuk bertahan.", "Tampilkan hasil atau janji paling jelas sebelum masuk ke proses. Rasa penasaran langsung punya arah.", "Simpan pola ini untuk clip berikutnya."],
      ["Kalimat Yang Menggigit", "Hook bukan sekadar kalimat besar; hook adalah pintu masuk.", "Pilih satu frasa yang tajam, singkat, dan punya ketegangan. Jangan jelaskan semuanya di awal.", "Tulis satu hook versi kamu di komentar."],
      ["Jangan Mulai Dari Halo", "Sapaan bisa hangat, tapi belum tentu membuat orang berhenti.", "Masuk lewat pertanyaan, kejutan, atau pernyataan yang berani. Biar konteks terasa setelah perhatian terkunci.", "Uji pembuka baru di posting berikutnya."],
      ["Penasaran Itu Mesin", "Clip yang kuat menyisakan ruang untuk penonton melanjutkan.", "Potong tepat sebelum jawaban terasa lengkap, lalu biarkan punchline bekerja.", "Tandai momen yang paling bikin penasaran."],
      ["Satu Hook Satu Arah", "Terlalu banyak ide di awal membuat pesan kehilangan bentuk.", "Pilih satu emosi utama: kaget, setuju, tertantang, atau ingin tahu. Sisanya menyusul.", "Apa emosi utama clip kamu?"],
      ["Bikin Mata Berhenti", "Visual pertama harus punya tugas, bukan hanya dekorasi.", "Gunakan close-up, perubahan framing, atau teks besar untuk memberi sinyal bahwa momen penting dimulai.", "Coba satu perubahan framing hari ini."],
      ["Hook Bisa Diulang", "Format yang berhasil bukan untuk disimpan sekali lalu dilupakan.", "Catat struktur pembuka yang perform, lalu isi dengan topik berbeda agar tetap segar.", "Buat bank hook versi Buzzer Klip."],
      ["Potong Sebelum Basa-Basi", "Ritme cepat lahir dari keputusan yang tegas.", "Buang jeda yang tidak menambah rasa, informasi, atau karakter. Setiap detik harus punya alasan.", "Review satu clip lama dan potong ulang."],
      ["Hook Yang Terasa Kamu", "Tren boleh dipakai, tapi suara personal membuat orang kembali.", "Ambil struktur yang sedang bekerja lalu masukkan sudut pandang, diksi, dan energi khasmu.", "Simpan gaya, bukan cuma format."],
    ],
  },
  {
    name: "Pilih Momen",
    hashtag: "#ClipperIndonesia #PilihMomen",
    ideas: [
      ["Cari Kalimat Emas", "Tidak semua detik layak menjadi clip.", "Cari kalimat yang bisa berdiri sendiri, punya makna, dan membuat orang ingin mendengar konteksnya.", "Mulai dari transcript, bukan timeline kosong."],
      ["Momen Yang Bikin Relate", "Clip paling mudah dibagikan sering terasa seperti pengalaman sendiri.", "Prioritaskan cerita yang menyentuh masalah umum, kegagalan kecil, atau kemenangan yang realistis.", "Kamu pernah ada di momen ini?"],
      ["Ambil Perubahannya", "Perubahan energi adalah bahan bakar yang bagus.", "Cari bagian ketika pembicara berpindah dari ragu ke yakin, tenang ke heboh, atau serius ke lucu.", "Tandai perubahan energi di video sumber."],
      ["Punchline Jangan Dipotong", "Kalimat sebelum punchline sering menjadi penyangga tawa.", "Sisakan napas secukupnya agar payoff terasa natural, bukan terburu-buru.", "Tes dua versi potongan dan bandingkan."],
      ["Satu Clip Satu Momen", "Clip yang mencoba membawa lima topik biasanya terasa kabur.", "Pilih satu momen utama dan biarkan editing melayani momen itu sampai selesai.", "Sederhanakan clip yang sedang kamu kerjakan."],
      ["Bukan Cuma Yang Viral", "Potensi share tidak selalu terlihat dari jumlah view sumber.", "Cerita niche dengan sudut pandang kuat bisa punya umur panjang di feed baru.", "Cari permata tersembunyi di arsip."],
      ["Dengar Nada Suaranya", "Emosi sering muncul lebih dulu lewat nada daripada kata.", "Gunakan perubahan volume, jeda, dan tawa sebagai petunjuk kapan clip mulai hidup.", "Pakai telinga sebelum tombol cut."],
      ["Cari Konflik Kecil", "Konflik tidak harus dramatis untuk menarik perhatian.", "Perbedaan pendapat, kesalahan sederhana, atau keputusan sulit sudah cukup untuk membuat alur bergerak.", "Temukan satu konflik kecil hari ini."],
      ["Potongan Yang Punya Arah", "Awal, tengah, dan akhir membuat clip terasa utuh.", "Pastikan penonton tahu apa yang sedang dipertaruhkan lalu beri payoff yang pantas.", "Cek arah clip sebelum export."],
      ["Momen Yang Layak Diingat", "Clip terbaik meninggalkan satu kalimat di kepala.", "Pilih bagian yang bisa dikutip, dipakai ulang, atau menjadi alasan orang membicarakan videonya.", "Tulis kalimat yang ingin diingat penonton."],
    ],
  },
  {
    name: "Edit Cepat",
    hashtag: "#EditVideo #CreatorWorkflow",
    ideas: [
      ["Timeline Bukan Tempat Parkir", "Setiap layer harus membantu cerita bergerak.", "Rapikan track, beri nama file, dan hapus potongan mati sebelum masuk ke tahap dekorasi.", "Bereskan timeline sebelum menambah efek."],
      ["Cut Ikuti Napas", "Editing yang enak sering terasa seperti ritme percakapan.", "Potong mengikuti napas, tekanan kata, atau perubahan ekspresi agar video tetap manusiawi.", "Dengarkan ritme sebelum menekan cut."],
      ["Subtitle Bukan Wallpaper", "Teks harus membantu memahami, bukan menutup wajah.", "Jaga kontras, batasi kata per baris, dan beri ruang untuk visual utama.", "Review subtitle tanpa suara."],
      ["Zoom Ada Tujuannya", "Zoom berlebihan membuat penonton lelah.", "Gunakan perubahan skala untuk menekankan punchline, data, atau emosi yang bergeser.", "Hapus satu zoom yang tidak perlu."],
      ["Warna Untuk Energi", "Color grade bukan sekadar membuat video lebih terang.", "Pakai satu aksen warna yang konsisten agar serial clip terasa punya identitas.", "Pilih satu warna ciri khasmu."],
      ["Sound Effect Secukupnya", "Efek suara yang tepat terasa seperti tanda baca.", "Gunakan untuk menutup cut, menandai perubahan, atau memberi aksen pada punchline.", "Dengar ulang mix dengan mata tertutup."],
      ["Frame Pertama Harus Jelas", "Thumbnail dan frame awal bekerja sebelum audio dimulai.", "Pilih ekspresi atau objek yang langsung menjelaskan konflik dan konteks.", "Buat tiga kandidat frame pembuka."],
      ["Ritme Pendek Bukan Asal Cepat", "Cepat dan padat adalah dua hal berbeda.", "Sisakan jeda ketika penonton perlu mencerna agar energi tetap terasa premium.", "Tambahkan satu napas di tempat yang tepat."],
      ["Edit Untuk Layar Kecil", "Detail yang terlihat di laptop bisa hilang di ponsel.", "Perbesar elemen penting, gunakan teks yang tegas, dan uji clip pada ukuran feed.", "Tonton preview dari jarak satu lengan."],
      ["Export Bukan Garis Finish", "File selesai belum tentu siap tayang.", "Cek audio, crop, subtitle, dan frame pertama sebelum mengirim ke antrean posting.", "Pakai checklist sebelum upload."],
    ],
  },
  {
    name: "Caption Nendang",
    hashtag: "#CaptionKonten #CopywritingCreator",
    ideas: [
      ["Caption Buka Percakapan", "Caption yang baik tidak mengulang semua isi video.", "Tambahkan sudut pandang, pertanyaan, atau konteks yang membuat orang ingin ikut bicara.", "Tulis caption seolah sedang chat dengan komunitasmu."],
      ["Satu Caption Satu Janji", "Pembaca perlu tahu apa yang akan mereka dapatkan.", "Buat janji kecil yang jelas lalu buktikan lewat clip, bukan lewat kata-kata berlebihan.", "Perjelas kalimat pertama captionmu."],
      ["CTA Jangan Mengemis", "Ajakan yang natural terasa lebih kuat daripada memaksa komentar.", "Berikan alasan untuk merespons: pilih opsi, ceritakan pengalaman, atau tag teman yang relate.", "Buat CTA yang mudah dijawab."],
      ["Hashtag Bukan Strategi Tunggal", "Hashtag membantu menemukan konteks, bukan menggantikan konten.", "Campur kata kunci niche, komunitas, dan tema clip agar caption tetap terbaca natural.", "Pilih hashtag yang benar-benar relevan."],
      ["Tulis Seperti Bicara", "Bahasa yang terlalu kaku membuat energi creator hilang.", "Gunakan kalimat pendek, diksi sehari-hari, dan satu punchline yang terasa milikmu.", "Baca caption keras-keras sebelum posting."],
      ["Caption Untuk Save", "Tidak semua posting harus mengundang debat.", "Buat caption yang merangkum satu pelajaran praktis agar orang punya alasan menyimpannya.", "Tambahkan satu takeaway hari ini."],
      ["Pertanyaan Yang Spesifik", "Pertanyaan umum sering dijawab dengan scroll.", "Tanyakan pilihan, kebiasaan, atau pengalaman yang bisa dijawab cepat tanpa berpikir terlalu lama.", "Ubah pertanyaan luas menjadi pilihan konkret."],
      ["Pakai Bahasa Komunitas", "Diksi yang tepat memberi rasa bahwa orang berada di ruang yang sama.", "Temukan istilah yang sering dipakai audience lalu gunakan tanpa memaksa slang.", "Dengar cara komunitasmu berbicara."],
      ["Caption Bisa Jadi Hook Kedua", "Feed punya lebih dari satu pintu masuk.", "Kalimat pembuka caption harus tetap menarik meski video belum diputar.", "Tulis opening yang punya tensi."],
      ["Edit Caption Setelah Preview", "Kadang video mengubah cara kita membaca caption.", "Tonton final cut, lalu pangkas kata yang sudah dijelaskan oleh visual.", "Biarkan caption memberi lapisan baru."],
    ],
  },
  {
    name: "Format Menang",
    hashtag: "#ContentFormat #SocialMediaIndonesia",
    ideas: [
      ["Vertikal Itu Bahasa Feed", "Ruang layar ponsel punya ritmenya sendiri.", "Susun wajah, teks, dan gerak di area yang mudah dibaca dengan satu tangan.", "Uji crop vertikal sebelum final export."],
      ["Safe Zone Itu Nyata", "UI platform bisa menutup elemen penting.", "Simpan teks utama di tengah dan sisakan ruang untuk caption, tombol, serta username.", "Cek clip dalam simulasi feed."],
      ["Frame Bisa Jadi Identitas", "Tidak semua clip harus terlihat seperti template yang sama.", "Pilih satu sistem border, label, atau warna yang membuat serialmu mudah dikenali.", "Buat aturan visual untuk sepuluh posting."],
      ["Cover Yang Mengundang", "Cover bukan ringkasan; cover adalah undangan.", "Pakai kata sedikit, kontras tinggi, dan satu elemen visual yang memberi rasa cerita.", "Redesign satu cover lama."],
      ["Buat Serial, Bukan Kebetulan", "Audience lebih mudah kembali ketika tahu apa yang mereka tunggu.", "Gunakan nama rubrik, nomor episode, atau format berulang dengan isi yang terus berubah.", "Pilih nama seri pertamamu."],
      ["Feed Perlu Kontras", "Deretan visual yang sama-sama keras bisa terasa datar.", "Selang-selingi close-up, text card, objek, dan frame percakapan agar mata punya jeda.", "Susun sembilan posting sebagai satu grid."],
      ["Teks Besar, Pesan Jelas", "Ukuran bukan masalah jika hierarkinya tepat.", "Satu headline besar lebih efektif daripada banyak teks kecil yang berebut perhatian.", "Pangkas teks di cover menjadi setengahnya."],
      ["Crop Mengubah Cerita", "Potongan gambar bisa mengubah siapa yang terasa menjadi tokoh utama.", "Geser framing untuk menemukan ekspresi, tangan, atau objek yang paling bercerita.", "Bandingkan dua crop sebelum memilih."],
      ["Beri Ruang Untuk Gerak", "Frame yang terlalu penuh mematikan energi.", "Sediakan area kosong untuk pergerakan, sticker, atau subtitle agar visual terasa hidup.", "Cari ruang kosong di footage-mu."],
      ["Konsisten Bukan Monoton", "Sistem membuat produksi lebih cepat tanpa mematikan eksperimen.", "Pertahankan warna dan ritme, lalu ubah sudut kamera, prop, atau cara bercerita.", "Eksperimen di dalam sistem."],
    ],
  },
  {
    name: "Ritme Creator",
    hashtag: "#CreatorTips #KerjaKreatif",
    ideas: [
      ["Batching Bikin Napas Panjang", "Produksi harian tidak harus berarti mulai dari nol setiap hari.", "Kelompokkan riset, clipping, editing, dan scheduling agar fokus tidak pecah.", "Coba satu sesi batch minggu ini."],
      ["Buat Bank Ide", "Ide bagus sering datang saat kita sedang tidak membuka editor.", "Simpan hook, momen, komentar audience, dan referensi dalam satu tempat yang mudah dicari.", "Tambahkan lima ide ke bankmu."],
      ["Ritme Mengalahkan Mood", "Inspirasi penting, tapi sistem membuat output bertahan.", "Tetapkan jam kecil untuk riset dan satu target yang realistis untuk diselesaikan.", "Pilih satu kebiasaan yang bisa diulang."],
      ["Satu Workflow Untuk Satu Tujuan", "Banyak tab tidak selalu berarti banyak kemajuan.", "Urutkan pekerjaan dari bahan mentah sampai siap tayang dengan checklist yang terlihat.", "Tutup tab yang tidak membantu."],
      ["Revisi Dengan Jarak", "Mata yang terlalu lama melihat clip sering melewatkan masalah kecil.", "Istirahat sebentar lalu tonton ulang untuk menemukan jeda, teks, dan momen yang terasa lambat.", "Beri jarak sebelum final review."],
      ["Deadline Membantu Fokus", "Kreativitas juga butuh pagar.", "Buat waktu cut-off agar editing tidak terus melebar tanpa dampak nyata.", "Pasang deadline untuk export berikutnya."],
      ["Folder Yang Bisa Dicari", "Waktu creator sering hilang di file yang tidak bernama.", "Gunakan nama yang konsisten untuk sumber, versi, subtitle, dan final agar kolaborasi lebih ringan.", "Rapikan lima file terakhir."],
      ["Cek Sebelum Serah", "Klip yang rapi terasa profesional bahkan sebelum dilihat performanya.", "Gunakan checklist audio, aspect ratio, subtitle, cover, dan caption sebelum dikirim.", "Buat checklist satu layar."],
      ["Kerja Cepat Bukan Kerja Ceroboh", "Kecepatan datang dari keputusan yang berulang dan jelas.", "Simpan preset, shortcut, dan format yang sering dipakai agar energi fokus ke cerita.", "Tambahkan satu shortcut baru."],
      ["Jaga Energi Kreatif", "Output panjang tidak ada artinya jika creator habis di tengah jalan.", "Atur batas kerja, jeda, dan target yang bisa dipertanggungjawabkan.", "Rancang workflow yang bisa kamu jalani."],
    ],
  },
  {
    name: "Brand Ready",
    hashtag: "#BrandCampaign #CreatorEconomy",
    ideas: [
      ["Brand Suka Konteks", "Konten yang hanya terlihat ramai belum tentu terasa relevan.", "Tunjukkan siapa audience, kenapa topik ini cocok, dan bagaimana clip menyampaikan pesan.", "Tambahkan konteks di pitch-mu."],
      ["Brief Bukan Belenggu", "Brief yang jelas justru memberi ruang untuk eksekusi lebih berani.", "Pisahkan pesan wajib, batasan, dan area eksperimen sebelum mulai clipping.", "Baca brief dengan tiga warna catatan."],
      ["Jaga Suara Creator", "Iklan terasa lebih kuat ketika tidak kehilangan manusia di baliknya.", "Masukkan diksi dan ritme creator selama tetap menjaga pesan campaign.", "Pertahankan suara, rapikan arah."],
      ["Satu Pesan, Banyak Potongan", "Campaign bisa punya banyak pintu masuk.", "Cari beberapa momen dari satu sumber untuk menguji sudut yang berbeda tanpa mengulang rasa.", "Buat tiga angle dari satu footage."],
      ["Hook Harus Nyambung", "Hook yang ramai tapi tidak relevan hanya menghasilkan drop-off.", "Pastikan pembuka membawa penonton menuju pesan brand, bukan sekadar mengejar klik.", "Cek hubungan hook dan payoff."],
      ["Rapikan Delivery", "Partner kerja mengingat proses, bukan hanya hasil akhir.", "Nama file, deadline, revisi, dan catatan yang jelas membuat kolaborasi terasa aman.", "Kirim pekerjaan dengan konteks lengkap."],
      ["Tunjukkan Bukti Kerja", "Portofolio terbaik menjelaskan keputusan, bukan hanya thumbnail.", "Sertakan tujuan, format, peranmu, dan hasil yang bisa dipahami tanpa klaim berlebihan.", "Beri satu kalimat konteks pada portofolio."],
      ["Pahami Audience Brand", "Satu gaya tidak cocok untuk semua campaign.", "Sesuaikan tempo, diksi, dan visual dengan orang yang ingin diajak bicara.", "Baca komentar audience brand."],
      ["Revisi Itu Kolaborasi", "Feedback membantu output mendekati tujuan bersama.", "Tanyakan bagian mana yang perlu berubah dan alasan bisnis di baliknya.", "Ubah revisi menjadi percakapan yang jelas."],
      ["Siap Tayang Itu Skill", "Klip bagus harus hadir pada format dan waktu yang tepat.", "Pahami spesifikasi delivery, caption, cover, dan approval agar kualitas tidak jatuh di tahap terakhir.", "Cek semua detail sebelum submit."],
    ],
  },
  {
    name: "Cuan Terukur",
    hashtag: "#CuanCreator #PayoutCreator",
    ideas: [
      ["View Bukan Satu-Satunya Angka", "Reach memberi sinyal, tapi kualitas perhatian memberi cerita lebih lengkap.", "Lihat retention, share, save, komentar, dan kesesuaian audience bersama-sama.", "Pilih tiga metrik yang benar-benar kamu pahami."],
      ["Pahami Nilai Clip", "Satu clip bisa bekerja jauh setelah hari pertama.", "Konten yang menjelaskan, menghibur, atau menggerakkan orang punya nilai lebih dari angka view sesaat.", "Catat alasan clip layak dibagikan."],
      ["Cuan Butuh Konsistensi", "Satu posting besar belum membentuk sistem.", "Produksi rutin membuat kualitas, data, dan peluang kerja bisa tumbuh bersama.", "Jaga ritme posting minggu ini."],
      ["Baca Retention", "Drop-off menunjukkan titik yang perlu diperbaiki.", "Gunakan data untuk menguji hook, tempo, dan payoff tanpa menebak-nebak.", "Cari satu detik tempat penonton pergi."],
      ["Jangan Kejar Angka Kosong", "View tanpa konteks bisa menyesatkan keputusan.", "Hubungkan performa dengan tujuan: awareness, klik, komunitas, atau payout.", "Tentukan tujuan sebelum upload."],
      ["Portofolio Yang Bicara", "Brand ingin melihat pola, bukan satu keberuntungan.", "Kumpulkan beberapa clip dengan tema dan hasil yang menunjukkan kemampuanmu berulang.", "Susun portofolio berdasarkan kekuatan."],
      ["Catat Apa Yang Bekerja", "Ingatan sering memilih highlight dan melupakan detail.", "Simpan hook, durasi, format, dan respons audience agar eksperimen berikutnya lebih tajam.", "Buat log performa sederhana."],
      ["Nilai Datang Dari Kejelasan", "Creator yang rapi lebih mudah dipercaya untuk pekerjaan berikutnya.", "Komunikasikan deliverable, timeline, dan hasil dengan bahasa yang mudah dipahami.", "Tulis ringkasan kerja satu paragraf."],
      ["Performa Adalah Feedback", "Angka bukan nilai dirimu; angka adalah informasi.", "Gunakan data untuk memperbaiki proses, bukan untuk menghakimi kreativitas.", "Ambil satu pelajaran dari posting terakhir."],
      ["Ulangi Yang Terbukti", "Eksperimen perlu disertai disiplin mengulang hal baik.", "Jadikan format yang perform sebagai fondasi lalu beri variasi agar tetap segar.", "Pilih satu format untuk diulang."],
    ],
  },
  {
    name: "Komunitas Klip",
    hashtag: "#KomunitasCreator #BuzzerKlip",
    ideas: [
      ["Klip Menghubungkan Orang", "Konten pendek bisa menjadi pintu percakapan yang panjang.", "Pilih momen yang membuat orang merasa dilihat lalu beri ruang untuk mereka menambahkan pengalaman.", "Tag teman yang akan relate."],
      ["Komentar Adalah Riset", "Audience sering memberi brief terbaik secara gratis.", "Baca pertanyaan dan keberatan mereka untuk menemukan ide clip berikutnya.", "Ambil satu ide dari komentar hari ini."],
      ["Share Karena Merasa Terwakili", "Orang membagikan sesuatu yang membantu mereka bicara.", "Cari kalimat yang bisa mewakili pengalaman yang sulit dijelaskan sendiri.", "Apa yang ingin kamu wakili?"],
      ["Beri Kredit Dengan Jelas", "Ekosistem creator tumbuh dari rasa saling menghargai.", "Tulis sumber, tag pihak terkait, dan pastikan kontribusi tidak hilang di balik editan.", "Cek credit sebelum publish."],
      ["Bikin Audience Ikut Memilih", "Interaksi terasa ringan ketika pilihan dibuat konkret.", "Tanyakan hook mana yang paling kuat, cover mana yang paling jelas, atau topik mana yang ingin dibahas.", "Buka voting untuk clip berikutnya."],
      ["Komunitas Suka Konsistensi", "Orang kembali ketika ritme dan energi terasa dapat diprediksi.", "Buat rubrik yang punya jadwal, gaya, dan janji yang jelas.", "Pilih hari untuk rubrikmu."],
      ["Jangan Takut Niche", "Niche membuat percakapan terasa lebih dalam.", "Topik yang spesifik membantu menemukan orang yang benar-benar peduli.", "Sebutkan niche yang ingin kamu kuasai."],
      ["Balas Dengan Nilai", "Komentar creator juga bagian dari konten.", "Jawab dengan contoh, konteks, atau pertanyaan lanjutan agar percakapan terus bergerak.", "Buka tiga komentar terakhir dan balas serius."],
      ["Rayakan Progress Kecil", "Komunitas tidak hanya hadir saat angka besar.", "Bagikan proses, eksperimen, dan peningkatan kecil agar perjalanan terasa dekat.", "Cerita satu progress minggu ini."],
      ["Buzzer Bukan Sekadar Ramai", "Energi ramai paling kuat ketika punya arah.", "Bangun ruang yang mendorong skill, kolaborasi, dan peluang nyata untuk creator.", "Ajak satu creator tumbuh bareng."],
    ],
  },
  {
    name: "Level Up",
    hashtag: "#LevelUpCreator #Clipper",
    ideas: [
      ["Skill Bisa Dilatih", "Editing bukan bakat misterius yang hanya dimiliki segelintir orang.", "Latihan kecil yang berulang membuat mata lebih peka terhadap ritme dan momen.", "Ambil satu footage untuk latihan hari ini."],
      ["Tonton Dengan Mata Editor", "Menonton bisa menjadi bentuk riset.", "Perhatikan kapan kamu tertawa, berhenti, atau ingin membagikan sesuatu; di situlah struktur bekerja.", "Catat satu hal dari video yang kamu tonton."],
      ["Bikin Versi Kedua", "Versi pertama sering hanya membuka kemungkinan.", "Gunakan feedback atau data untuk membuat potongan yang lebih ringkas, jelas, dan berani.", "Jangan berhenti di first draft."],
      ["Berani Hapus", "Menambah elemen tidak selalu membuat cerita lebih kuat.", "Coba hapus satu efek, satu kalimat, atau satu detik lalu lihat apakah pesannya lebih tajam.", "Edit dengan tombol delete."],
      ["Cari Referensi, Bukan Salinan", "Belajar dari format tidak berarti kehilangan suara sendiri.", "Ambil prinsip ritme, framing, atau copy lalu terjemahkan ke dunia dan audience-mu.", "Tulis prinsip yang ingin kamu adaptasi."],
      ["Kualitas Terlihat Dari Detail", "Subtitle sejajar, audio bersih, dan crop tepat membangun kepercayaan.", "Detail kecil membuat penonton fokus pada cerita, bukan pada gangguan teknis.", "Pilih satu detail untuk dirapikan."],
      ["Eksperimen Dengan Batas", "Kebebasan kreatif lebih mudah dipakai ketika parameternya jelas.", "Tentukan durasi, warna, atau format lalu cari cara paling menarik untuk bekerja di dalamnya.", "Buat tantangan 30 menit."],
      ["Jadilah Editor Yang Peka", "Teknik dapat dipelajari, tapi kepekaan harus diasah.", "Perhatikan emosi, konteks, dan dampak sebelum memilih momen yang akan didorong ke feed.", "Tanyakan: apa yang penonton rasakan?"],
      ["Naik Level Dengan Feedback", "Mata kedua sering menemukan hal yang kita lewatkan.", "Minta feedback spesifik tentang hook, ritme, dan kejelasan agar revisi punya arah.", "Kirim satu draft ke partner tepercaya."],
      ["Posting Adalah Latihan", "Setiap publish memberi data baru tentang cara kamu bercerita.", "Teruskan siklus buat, tayang, baca respons, dan perbaiki dengan rasa ingin tahu.", "Siapkan posting berikutnya sekarang."],
    ],
  },
];

const items = [];
let id = 1;
for (const pillar of pillars) {
  for (const [title, hook, insight, cta] of pillar.ideas) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + id - 1);
    const isoDate = date.toISOString().slice(0, 10);
    const formatCycle = ["image", "type", "object", "mixed", "image", "type", "object", "mixed", "type", "image"];
    const format = formatCycle[(id - 1) % formatCycle.length];
    const postType = postTypes[id - 1];
    const dayKey = `day-${String(id).padStart(3, "0")}`;
    const assets =
      postType === "carousel"
        ? Array.from(
            { length: carouselSlides },
            (_, slideIndex) =>
              `posts/buzzer-klip-100d/${dayKey}/slide-${String(slideIndex + 1).padStart(2, "0")}.jpg`,
          )
        : [`posts/buzzer-klip-100d/${dayKey}.jpg`];
    const slides =
      postType === "carousel"
        ? [
            { role: "cover", headline: title, body: campaignTheme },
            { role: "problem", headline: "MASALAHNYA", body: hook },
            { role: "principle", headline: "KUNCINYA", body: insight },
            { role: "action", headline: "COBA BEGINI", body: cta },
            {
              role: "cta",
              headline: "GILIRAN KAMU",
              body: "Simpan carousel ini, lalu praktikkan di clip berikutnya.",
            },
          ].map((slide, slideIndex) => ({ ...slide, asset: assets[slideIndex] }))
        : [
            {
              role: "single",
              headline: title,
              body: hook,
              asset: assets[0],
            },
          ];
    const [tag1, tag2] = pillar.hashtag.split(" ");
    const item = {
      id,
      date: isoDate,
      time_wib: "09:00",
      timezone: "Asia/Jakarta",
      status: "queued_auto",
      post_type: postType,
      week_number: Math.floor((id - 1) / 7) + 1,
      day_in_week: ((id - 1) % 7) + 1,
      format,
      title,
      pillar: pillar.name,
      campaign_theme: campaignTheme,
      approval_required: true,
      approval_status: "approved",
      asset: assets[0],
      assets,
      slides,
      slide_count: assets.length,
      asset_version: "buzzer-klip-100d-v2",
      visual_revision: "buzzer-neo-brutalist-creator-v2",
      audio: {
        requested: true,
        selection: "trending",
        native_feed_music: true,
        graph_api_attachment: false,
        reason: "Instagram Audio API attaches audio to Reels; this queue preserves single-photo and carousel formats.",
      },
      final_caption: `${hook} ${insight}\n\n${cta}\n\n${tag1} ${tag2}`,
    };
    const existing = existingById.get(id);
    if (
      existing &&
      existing.title === item.title &&
      existing.date === item.date &&
      existing.post_type === item.post_type
    ) {
      for (const field of [
        "status",
        "approval_status",
        "instagram_media_id",
        "instagram_url",
        "published_at",
        "published_via",
      ]) {
        if (existing[field] !== undefined) item[field] = existing[field];
      }
    }
    items.push(item);
    id += 1;
  }
}
await fs.writeFile(planPath, `${JSON.stringify(items, null, 2)}\n`);
await fs.writeFile(path.join(root, "CAPTION-BUZZER-KLIP-100D.txt"), items.map((item) => [
  `POST ${String(item.id).padStart(3, "0")}`,
  `${item.date} — ${item.time_wib} WIB`,
  `${item.post_type.toUpperCase()} — ${item.slide_count} slide`,
  item.title,
  item.pillar,
  "",
  item.final_caption,
  "",
].join("\n")).join("\n"));
const carouselCount = items.filter((item) => item.post_type === "carousel").length;
const singleCount = items.filter((item) => item.post_type === "single").length;
console.log(
  `Generated ${items.length} Buzzer Klip posts: ${items[0].date} -> ${items.at(-1).date} (${carouselCount} carousel, ${singleCount} single)`,
);
