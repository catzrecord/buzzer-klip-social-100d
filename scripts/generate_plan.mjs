import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const planPath = path.join(root, "content-plan.json");
const audioManifestPath = path.join(root, "assets", "audio", "abstract-human-v1", "manifest.json");
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
const audioTracks = JSON.parse(await fs.readFile(audioManifestPath, "utf8"));

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

const contentThemeCycle = [
  "education", "mindset", "relatable", "community", "brand",
  "education", "challenge", "story", "motivation", "culture",
];
const subjectFamilyCycle = [
  "object", "human", "object", "human", "scene",
  "object", "human", "scene", "object", "human",
];

const contentBanks = {
  mindset: {
    pillar: "Creator Mindset",
    hashtag: "#CreatorMindset #BuzzerKlip",
    ideas: [
      ["Mulai Meski Belum Siap", "Rasa siap sering datang setelah langkah pertama.", "Karya yang dikirim memberi pengalaman nyata; draft yang disimpan hanya memberi kemungkinan.", "Kirim satu karya hari ini."],
      ["Sepi Bukan Berarti Gagal", "Feed yang tenang bukan vonis untuk kemampuanmu.", "Gunakan masa sepi untuk menguatkan karakter, ritme, dan kebiasaan berkarya.", "Tetap hadir di posting berikutnya."],
      ["Karya Tidak Harus Sempurna", "Perfeksionisme sering memakai nama kualitas.", "Tentukan standar selesai, rapikan bagian penting, lalu beri ruang untuk versi berikutnya.", "Pilih satu draft untuk diselesaikan."],
      ["Konsisten Lebih Berisik", "Satu karya hebat mudah lewat dari ingatan.", "Rangkaian karya yang jujur membuat orang mengenali suara dan arahmu.", "Bangun ritme yang sanggup kamu jaga."],
      ["Jangan Tunggu Mood", "Mood datang dan pergi, jadwal membuat karya tetap bergerak.", "Siapkan ritual kecil agar mulai terasa ringan bahkan pada hari biasa.", "Mulai dari lima menit pertama."],
      ["Berani Punya Gaya", "Terlihat berbeda memang terasa canggung di awal.", "Keunikan tumbuh ketika pilihan visual dan suaramu diulang dengan percaya diri.", "Pertahankan satu ciri khasmu."],
      ["Percaya Pada Proses", "Hasil besar jarang terlihat pada percobaan pertama.", "Setiap upload melatih mata, rasa, keputusan, dan kemampuan membaca penonton.", "Catat satu kemajuan hari ini."],
      ["Lelah Boleh Hilang Jangan", "Istirahat adalah bagian dari ritme kreatif.", "Kurangi kecepatan saat perlu, lalu kembali dengan arah yang lebih jernih.", "Atur jeda tanpa meninggalkan perjalanan."],
      ["Fokus Pada Satu Langkah", "Target besar terasa berat ketika dipikirkan sekaligus.", "Pecah perjalanan menjadi pilih momen, edit, cek, lalu kirim.", "Selesaikan langkah terdekat."],
      ["Kamu Punya Tempat", "Internet cukup luas untuk lebih dari satu jenis creator.", "Suara yang jujur menemukan orangnya ketika diberi kesempatan untuk tampil.", "Berani muncul dengan versimu."],
    ],
  },
  relatable: {
    pillar: "Relatable Creator",
    hashtag: "#CreatorLife #BuzzerKlip",
    ideas: [
      ["Export 99 Persen Lalu Error", "Kesabaran editor diuji tepat sebelum garis akhir.", "Tarik napas, cek ruang penyimpanan, lalu anggap ini bagian dari legenda produksi.", "Tag teman yang pernah mengalaminya."],
      ["Revisi Katanya Sedikit", "Tiga kata yang sering membuka perjalanan baru.", "Simpan versi, rapikan catatan, dan jangan percaya ukuran revisi sebelum membacanya.", "Berapa revisi terbanyakmu?"],
      ["Ide Datang Saat Mau Tidur", "Otak creator punya jadwal sendiri.", "Tulis satu kalimat sebelum ide itu berubah menjadi mimpi yang sulit dijelaskan.", "Buka notes sebelum memejamkan mata."],
      ["Folder Final Final Banget", "Nama file sering menceritakan seluruh perjuangan.", "Versi boleh banyak, tetapi keputusan terakhir tetap membutuhkan keberanian.", "Tulis nama file final paling absurd."],
      ["Lima Menit Jadi Dua Jam", "Satu cut kecil bisa membuka seratus kemungkinan.", "Waktu terasa hilang ketika creator sedang mengejar rasa yang tepat.", "Siapa yang sering lupa waktu saat edit?"],
      ["Caption Lebih Lama Dari Edit", "Visual selesai, satu kalimat masih menatap kosong.", "Kadang bagian tersulit bukan membuat, tetapi menjelaskan tanpa merusak rasa.", "Tim caption cepat atau lama?"],
      ["Sudah Posting Lalu Cek Lagi", "Creator tahu ritual refresh setelah upload.", "Harapan, cemas, dan penasaran berkumpul dalam satu gerakan jempol.", "Berapa kali kamu cek setelah posting?"],
      ["View Sepi Tetap Upload", "Angka kecil tetap lahir dari karya yang berani tampil.", "Hari sepi sering menjadi latihan untuk hari ketika perhatian datang lebih besar.", "Kasih semangat untuk creator yang konsisten."],
      ["Musik Ketemu Edit Selesai", "Satu audio tepat bisa menyatukan semua potongan.", "Momen ketika ritme bertemu visual selalu terasa seperti menemukan jawaban.", "Audio apa yang sedang kamu ulang?"],
      ["Deadline Bikin Kreatif", "Waktu sempit kadang memotong terlalu banyak pilihan.", "Batas yang jelas memaksa kita fokus pada keputusan yang benar-benar penting.", "Deadline paling mepetmu berapa jam?"],
    ],
  },
  community: {
    pillar: "Komunitas Creator",
    hashtag: "#KomunitasCreator #BuzzerKlip",
    ideas: [
      ["Clipper Tidak Jalan Sendiri", "Satu karya bisa lahir dari banyak dukungan.", "Teman review, sumber inspirasi, dan komunitas membuat perjalanan terasa lebih panjang napasnya.", "Tag partner kreatifmu."],
      ["Share Setup Kamu", "Alat sederhana sering punya cerita paling menarik.", "Tidak ada meja yang terlalu kecil untuk memulai karya yang punya dampak.", "Ceritakan setup yang kamu pakai."],
      ["Tim Cut Atau Transisi", "Setiap editor punya kebiasaan yang dibela mati-matian.", "Perbedaan gaya membuat percakapan kreatif tetap hidup dan menyenangkan.", "Pilih timmu di komentar."],
      ["Kenalan Dengan Creator Baru", "Kolaborasi dimulai dari sapaan yang sederhana.", "Satu koneksi baru bisa membawa perspektif, energi, dan kesempatan yang berbeda.", "Sapa satu creator hari ini."],
      ["Saling Review Bukan Menjatuhkan", "Feedback terbaik membantu karya bergerak.", "Bicarakan bagian spesifik, jelaskan dampaknya, lalu beri ruang untuk pilihan kreator.", "Kirim feedback yang berguna."],
      ["Cerita Clip Pertamamu", "Karya pertama mungkin berantakan, tetapi selalu punya tempat khusus.", "Dari sanalah selera, keberanian, dan kebiasaan mulai terbentuk.", "Bagikan cerita karya pertamamu."],
      ["Komunitas Bikin Konsisten", "Semangat lebih mudah dijaga ketika ada teman seperjalanan.", "Ritual berbagi progress membuat target terasa nyata dan menyenangkan.", "Buat check-in mingguan bersama."],
      ["Kolaborasi Membuka Pintu", "Dua sudut pandang bisa melahirkan kemungkinan ketiga.", "Gabungkan kekuatan tanpa menghapus karakter masing-masing creator.", "Ajak satu orang membuat sesuatu."],
      ["Rayakan Progress Kecil", "Tidak semua kemenangan harus menunggu angka besar.", "Cut lebih rapi, caption lebih jelas, dan upload tepat waktu layak dirayakan.", "Tulis progress kecil minggu ini."],
      ["Ruang Ini Milik Para Pembuat", "Buzzer Klip hidup karena karya dan percakapan creator.", "Semakin banyak yang berbagi, semakin kaya kemungkinan yang bisa dibangun bersama.", "Ajak creator lain bergabung."],
    ],
  },
  brand: {
    pillar: "Buzzer Klip",
    hashtag: "#BuzzerKlip #CreatorIndonesia",
    ideas: [
      ["Ruang Para Clipper", "Setiap potongan membawa sudut pandang baru.", "Buzzer Klip menjadi titik temu untuk karya, creator, dan peluang yang terus bergerak.", "Tunjukkan clip terbaikmu."],
      ["Dari Momen Jadi Karya", "Momen singkat bisa punya hidup yang panjang.", "Pilihan creator mengubah percakapan biasa menjadi sesuatu yang layak dibagikan.", "Mulai dari satu momen."],
      ["Satu Tempat Untuk Bergerak", "Ide membutuhkan ruang untuk diuji dan ditemukan.", "Buzzer Klip mendorong creator mengubah energi menjadi karya yang terlihat.", "Masuk dan mulai bergerak."],
      ["Peluang Dimulai Dari Upload", "Karya yang tampil bisa membuka percakapan baru.", "Jangan biarkan potongan terbaik hanya tinggal di folder export.", "Siapkan upload berikutnya."],
      ["Campaign Butuh Ide Segar", "Setiap brief bisa diterjemahkan dengan karakter berbeda.", "Sudut pandang creator membuat sebuah pesan terasa hidup dan relevan.", "Bawa gaya terbaikmu."],
      ["Karya Kamu Layak Dilihat", "Keberanian tampil adalah bagian dari proses kreatif.", "Buzzer Klip memberi ruang pada creator yang terus mencoba dan berkembang.", "Kirim karya yang kamu banggakan."],
      ["Clipper Punya Panggung", "Di balik setiap potongan ada keputusan dan kepekaan.", "Saat karya mendapat ruang, kemampuan creator ikut terlihat.", "Ambil panggungmu."],
      ["Hubungkan Ide Dengan Peluang", "Kreativitas tumbuh lebih jauh ketika bertemu kebutuhan nyata.", "Bangun karya yang jelas, khas, dan siap membuka percakapan.", "Mulai koneksi berikutnya."],
      ["Lebih Dari Sekadar Platform", "Komunitas dibangun oleh orang yang saling mendorong.", "Buzzer Klip menyatukan proses belajar, karya, dan kesempatan bertumbuh.", "Tumbuh bersama creator lain."],
      ["Giliran Kamu Masuk Feed", "Feed terbaik selalu menunggu suara baru.", "Satu karya yang jujur cukup untuk memperkenalkan karakter creator.", "Buat sesuatu yang layak diingat."],
    ],
  },
  challenge: {
    pillar: "Creator Challenge",
    hashtag: "#CreatorChallenge #BuzzerKlip",
    ideas: [
      ["Tantangan Hook 3 Detik", "Buat pembuka yang langsung memberi alasan untuk bertahan.", "Pilih konflik, hasil, atau pertanyaan; jangan gunakan salam panjang.", "Upload hasilmu dan tandai Buzzer Klip."],
      ["Potong Dalam 30 Menit", "Batas waktu memaksa keputusan terasa lebih jernih.", "Cari satu momen, pilih satu tujuan, dan selesaikan tanpa mengejar dekorasi.", "Pasang timer lalu mulai."],
      ["Upload Tiga Hari Beruntun", "Konsistensi lebih mudah dilatih dalam sprint pendek.", "Tiga hari cukup untuk melihat pola kerja tanpa membuat target terasa berat.", "Ajak teman ikut tantangan."],
      ["Satu Video Tiga Versi", "Sumber yang sama bisa punya tiga energi berbeda.", "Uji versi cepat, emosional, dan informatif untuk melihat cara cerita berubah.", "Pilih versi favoritmu."],
      ["Tanpa Transisi Berlebihan", "Cerita tetap harus kuat ketika efek dikurangi.", "Gunakan cut, timing, dan suara sebagai fondasi utama.", "Buat satu edit yang bersih."],
      ["Cari Momen Paling Relate", "Bagian yang terasa dekat lebih mudah mengundang respons.", "Pilih pengalaman kecil yang banyak orang pernah rasakan.", "Tulis momen pilihanmu."],
      ["Caption Satu Kalimat", "Kejelasan diuji ketika ruang dibuat sempit.", "Buat satu kalimat yang membuka percakapan tanpa menjelaskan semuanya.", "Kirim caption versimu."],
      ["Edit Dengan Satu Warna", "Batas visual bisa melahirkan identitas yang kuat.", "Pilih satu aksen lalu biarkan elemen lain mendukungnya.", "Tunjukkan warna pilihanmu."],
      ["Kolaborasi Dengan Creator Baru", "Energi baru mengubah cara kita melihat footage.", "Bagi peran dengan jelas dan pertahankan karakter masing-masing.", "Kirim satu ajakan kolaborasi."],
      ["Berani Posting Draft", "Tidak semua eksperimen harus menunggu sempurna.", "Pilih draft yang sudah menyampaikan rasa utamanya lalu beri kesempatan pada audience.", "Posting sebelum terlalu banyak berpikir."],
    ],
  },
  story: {
    pillar: "Creator Stories",
    hashtag: "#CreatorStories #BuzzerKlip",
    ideas: [
      ["Dari Laptop Tua Ke Karya Pertama", "Mesinnya lambat, tetapi rasa ingin membuat bergerak lebih cepat.", "Keterbatasan mengajarkan creator memilih hal yang benar-benar penting.", "Apa alat pertama yang kamu pakai?"],
      ["Satu Clip Mengubah Arah", "Kadang satu karya memberi tanda bahwa kita berada di jalan yang tepat.", "Bukan karena sempurna, tetapi karena akhirnya terasa seperti suara sendiri.", "Ingat karya yang mengubah arahmu."],
      ["Malam Panjang Sebelum Upload", "Timeline menyala ketika kota sudah tenang.", "Di antara kopi, revisi, dan ragu, keputusan untuk mengirim akhirnya menang.", "Siapa yang sering edit tengah malam?"],
      ["Revisi Kesepuluh", "Versi demi versi terasa seperti berjalan memutar.", "Lalu satu perubahan kecil membuat semuanya tiba-tiba punya bentuk.", "Ceritakan revisi paling melelahkan."],
      ["Saat View Pertama Masuk", "Angkanya kecil, tetapi rasanya seperti pintu terbuka.", "Satu penonton nyata cukup untuk membuat karya terasa sudah menemukan tempat.", "Kamu masih ingat view pertamamu?"],
      ["Penonton Pertama Bukan Angka", "Di balik satu view ada seseorang yang memilih berhenti.", "Mengingat hal itu membuat creator kembali fokus pada pengalaman manusia.", "Buat karya untuk satu orang nyata."],
      ["Ide Kecil Di Timeline Sepi", "Tidak ada efek besar, hanya satu momen yang terasa jujur.", "Sering kali justru potongan sederhana yang paling lama tinggal di kepala.", "Simpan ide kecilmu."],
      ["Belajar Dari Post Yang Sepi", "Karya itu tidak meledak, tetapi meninggalkan petunjuk.", "Hook, waktu, atau pesannya bisa dibaca ulang tanpa menghapus keberanian yang sudah ada.", "Ambil satu pelajaran tanpa menyalahkan diri."],
      ["Karya Yang Akhirnya Dikirim", "Tombol upload terasa lebih berat dari seluruh proses edit.", "Begitu dikirim, ruang baru terbuka untuk karya berikutnya.", "Selesaikan cerita yang tertunda."],
      ["Besok Kita Mulai Lagi", "Hari ini mungkin tidak berjalan sesuai rencana.", "Creator bertahan bukan karena selalu menang, tetapi karena bersedia kembali.", "Siapkan satu langkah untuk besok."],
    ],
  },
  motivation: {
    pillar: "Creator Energy",
    hashtag: "#CreatorEnergy #BuzzerKlip",
    ideas: [
      ["Satu Clip Bisa Buka Jalan", "Kita tidak selalu tahu karya mana yang menemukan pintunya.", "Tugas creator adalah terus membuat kemungkinan itu tersedia.", "Kirim satu kemungkinan baru."],
      ["Karya Hari Ini Menumpuk", "Tidak semua hasil terlihat pada hari yang sama.", "Skill, portofolio, dan kepercayaan tumbuh dari pekerjaan yang terus dikumpulkan.", "Tambahkan satu karya hari ini."],
      ["Mulai Kecil Bergerak Jauh", "Langkah kecil lebih kuat daripada rencana besar yang diam.", "Gunakan alat yang ada dan biarkan perjalanan memperbaiki sisanya.", "Mulai dari footage terdekat."],
      ["Audience Datang Pada Yang Hadir", "Orang sulit mengenali suara yang jarang muncul.", "Kehadiran yang konsisten memberi kesempatan pada audience untuk menemukanmu.", "Jaga satu ritme sederhana."],
      ["Tetap Buat Saat Sepi", "Masa tenang membangun otot yang dipakai ketika perhatian datang.", "Gunakan ruang ini untuk mencoba tanpa terlalu banyak beban.", "Buat satu eksperimen baru."],
      ["Momentum Dibangun", "Energi jarang turun dari langit dalam bentuk sempurna.", "Satu tugas selesai memudahkan tugas berikutnya ikut bergerak.", "Mulai dari bagian paling ringan."],
      ["Kualitas Tumbuh Dengan Volume", "Mata yang tajam lahir dari banyak keputusan.", "Produksi memberi lebih banyak kesempatan untuk mengenali apa yang benar-benar bekerja.", "Tambah satu repetisi berkualitas."],
      ["Satu Upload Lebih Baik", "Rencana yang indah tetap membutuhkan bukti.", "Satu karya terbit memberi data, pengalaman, dan keberanian nyata.", "Pilih upload yang bisa selesai hari ini."],
      ["Jangan Remehkan Progress", "Perubahan kecil sulit terlihat dari jarak dekat.", "Bandingkan dengan karya lama untuk menyadari seberapa jauh kamu sudah bergerak.", "Buka karya enam bulan lalu."],
      ["Besok Butuh Karya Hari Ini", "Masa depan creator dibangun oleh pilihan yang terasa biasa.", "Setiap latihan hari ini mempersingkat jarak menuju kemampuan berikutnya.", "Kerjakan satu hal untuk dirimu besok."],
    ],
  },
  culture: {
    pillar: "Clipper Culture",
    hashtag: "#ClipperCulture #BuzzerKlip",
    ideas: [
      ["Kami Adalah Para Clipper", "Kami melihat momen yang sering dilewati orang lain.", "Kami memotong bukan untuk mengecilkan cerita, tetapi untuk membuat intinya terdengar.", "Tunjukkan caramu melihat."],
      ["Potong Dengan Rasa", "Teknik membuat edit rapi; rasa membuatnya hidup.", "Kepekaan pada napas, emosi, dan konteks adalah identitas seorang clipper.", "Jaga rasa di setiap cut."],
      ["Cepat Bukan Asal", "Kecepatan adalah hasil dari keputusan yang terlatih.", "Kami bergerak cepat karena tahu apa yang perlu dipertahankan.", "Potong tegas, tetap peka."],
      ["Creator Tidak Menunggu Izin", "Ide tidak memerlukan panggung besar untuk dimulai.", "Kami membuat ruang sendiri melalui karya yang terus hadir.", "Ambil ruangmu hari ini."],
      ["Feed Adalah Kanvas", "Setiap post menambah warna pada identitas creator.", "Kami menyusun feed seperti cerita panjang yang tumbuh satu frame sekali.", "Tambahkan frame berikutnya."],
      ["Ritme Adalah Bahasa", "Sebelum kata selesai dipahami, tempo sudah lebih dulu terasa.", "Clipper berbicara melalui jeda, cut, dan perubahan energi.", "Buat ritmemu dikenali."],
      ["Detail Adalah Sikap", "Hal kecil menunjukkan seberapa serius kita menghargai penonton.", "Crop, audio, credit, dan caption adalah bagian dari karakter kerja.", "Rapikan satu detail terakhir."],
      ["Original Bukan Berarti Aneh", "Keaslian adalah pilihan yang konsisten, bukan kejutan kosong.", "Kami mengambil inspirasi lalu menerjemahkannya dengan pengalaman sendiri.", "Buat sesuatu yang terasa kamu."],
      ["Kerja Sunyi Tampil Nyaring", "Banyak jam tak terlihat hidup di balik beberapa detik karya.", "Ketika clip tayang, semua latihan sunyi menemukan suaranya.", "Hormati proses di balik layar."],
      ["Potong Posting Tumbuh", "Tiga kata ini bukan slogan kosong, tetapi siklus creator.", "Pilih momen, kirim karya, baca respons, lalu kembali lebih tajam.", "Mulai siklus berikutnya."],
    ],
  },
};

const carouselHeadlineSets = {
  education: ["MASALAHNYA", "KUNCINYA", "COBA BEGINI", "GILIRAN KAMU"],
  mindset: ["YANG SERING TERASA", "INGAT INI", "LANGKAH KECIL", "BAWA PULANG"],
  relatable: ["KITA PERNAH", "RASANYA BEGINI", "NGAKU AJA", "GILIRAN CERITA"],
  community: ["KITA BERTEMU", "YANG KITA BANGUN", "GERAK BARENG", "AJAK SATU ORANG"],
  brand: ["KENAPA ADA", "YANG KAMI PERCAYA", "RUANG UNTUKMU", "MASUK KE DALAM"],
  challenge: ["ATURANNYA", "TARGETNYA", "MULAI SEKARANG", "TUNJUKKAN HASIL"],
  story: ["AWALNYA", "LALU BERUBAH", "YANG TERTINGGAL", "CERITAMU BERIKUTNYA"],
  motivation: ["SAAT TERASA BERAT", "PEGANG INI", "SATU LANGKAH", "TERUS BERGERAK"],
  culture: ["INI CARA KAMI", "YANG KAMI JAGA", "BENTUK SIKAPMU", "JADILAH BAGIAN"],
};

const carouselEndings = {
  education: "Simpan carousel ini, lalu praktikkan di clip berikutnya.",
  mindset: "Simpan kalimat yang ingin kamu ingat saat ragu datang lagi.",
  relatable: "Bagikan ke teman creator yang pasti memahami rasanya.",
  community: "Tandai satu creator yang ingin kamu ajak tumbuh bersama.",
  brand: "Bawa karya dan karakter terbaikmu ke Buzzer Klip.",
  challenge: "Tandai Buzzer Klip ketika hasil tantanganmu sudah tayang.",
  story: "Setiap creator punya cerita; lanjutkan punyamu hari ini.",
  motivation: "Kembali ke karya, satu langkah sederhana pada satu waktu.",
  culture: "Potong dengan rasa, posting dengan berani, tumbuh bersama.",
};

const items = [];
let id = 1;
for (const pillar of pillars) {
  for (const [sourceTitle, sourceHook, sourceInsight, sourceCta] of pillar.ideas) {
    const contentTheme = contentThemeCycle[(id - 1) % contentThemeCycle.length];
    const bankIndex = Math.floor((id - 1) / contentThemeCycle.length);
    const bank = contentTheme === "education" ? null : contentBanks[contentTheme];
    const [title, hook, insight, cta] = bank
      ? bank.ideas[bankIndex]
      : [sourceTitle, sourceHook, sourceInsight, sourceCta];
    const selectedPillar = bank?.pillar || pillar.name;
    const selectedHashtag = bank?.hashtag || pillar.hashtag;
    const subjectFamily = subjectFamilyCycle[(id - 1) % subjectFamilyCycle.length];
    const [stepOne, stepTwo, stepThree, stepFour] = carouselHeadlineSets[contentTheme];
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + id - 1);
    const isoDate = date.toISOString().slice(0, 10);
    const format = "mixed_abstract";
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
            { role: "cover", headline: title, body: selectedPillar },
            { role: "problem", headline: stepOne, body: hook },
            { role: "principle", headline: stepTwo, body: insight },
            { role: "action", headline: stepThree, body: cta },
            {
              role: "cta",
              headline: stepFour,
              body: carouselEndings[contentTheme],
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
    const [tag1, tag2] = selectedHashtag.split(" ");
    let item = {
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
      pillar: selectedPillar,
      content_theme: contentTheme,
      campaign_theme: campaignTheme,
      approval_required: true,
      approval_status: "approved",
      asset: assets[0],
      assets,
      slides,
      slide_count: assets.length,
      asset_version: "buzzer-klip-web-brand-mixed-v6",
      visual_revision: "website-brand-mixed-abstract-v6",
      visual_theme: "Buzzer Klip website palette and Plus Jakarta Sans over cinematic mixed abstract art",
      subject_family: subjectFamily,
      audio: {
        requested: true,
        selection: "trending",
        native_feed_music: true,
        graph_api_attachment: false,
        original_preview_asset: audioTracks[(id - 1) % audioTracks.length].asset,
        original_preview_title: audioTracks[(id - 1) % audioTracks.length].title,
        bpm: audioTracks[(id - 1) % audioTracks.length].bpm,
        mood: audioTracks[(id - 1) % audioTracks.length].mood,
        native_search: audioTracks[(id - 1) % audioTracks.length].native_search,
        reason: "Instagram Audio API attaches audio to Reels; this queue preserves single-photo and carousel formats.",
      },
      final_caption: `${hook} ${insight}\n\n${cta}\n\n${tag1} ${tag2}`,
    };
    const existing = existingById.get(id);
    if (existing?.status === "published" || existing?.manual_asset_lock === true) {
      item = existing;
    } else if (
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
