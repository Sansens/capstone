// Data contoh (mock) untuk & Basis Data Warga RT 004

export const rtInfo = {
  nama: "KELOMPOK A",
  kawasan: "Gubeng",
  kelurahan: "Airlangga",
  ketua: "Muh. Zaitun Rohmat S",
  sekretariat: "Jl. Gubeng Kertajaya IX C / 42",
  telepon: "0812-3456-7890",
  jam: "Senin–Sabtu, 08.00–15.00 WIB",
};

export const jenisSurat = [
  {
    id: "domisili",
    kode: "SKD",
    nama: "Surat Keterangan Domisili",
    ringkas: "Bukti resmi bahwa warga benar berdomisili di wilayah RT 004.",
    durasi: "1 hari kerja",
    biaya: "Gratis",
    ikon: "home",
    syarat: ["Fotokopi KTP pemohon", "Fotokopi Kartu Keluarga", "Surat permohonan tertulis"],
  },
  {
    id: "usaha",
    kode: "SKU",
    nama: "Surat Keterangan Usaha",
    ringkas: "Keterangan usaha mikro/warung yang beroperasi di lingkungan RT.",
    durasi: "1 hari kerja",
    biaya: "Gratis",
    ikon: "briefcase",
    syarat: ["Fotokopi KTP & KK", "Foto lokasi usaha", "Keterangan jenis usaha"],
  },
  {
    id: "sktm",
    kode: "SKTM",
    nama: "Surat Keterangan Tidak Mampu",
    ringkas: "Pengantar bantuan pendidikan, kesehatan, atau program sosial.",
    durasi: "2 hari kerja",
    biaya: "Gratis",
    ikon: "heart",
    syarat: ["Fotokopi KTP & KK", "Surat permohonan orang tua", "Bukti pendukung (opsional)"],
  },
  {
    id: "pengantar-ktp",
    kode: "SPK",
    nama: "Surat Pengantar KTP / KK",
    ringkas: "Pengantar pembuatan atau perpanjangan KTP-el dan Kartu Keluarga.",
    durasi: "1 hari kerja",
    biaya: "Gratis",
    ikon: "card",
    syarat: ["Fotokopi KK", "Fotokopi akta/ijazah", "Fotokopi KTP lama (jika perpanjangan)"],
  },
  {
    id: "nikah",
    kode: "SPN",
    nama: "Surat Pengantar Nikah",
    ringkas: "Pengantar N1–N4 untuk pendaftaran pernikahan di KUA.",
    durasi: "2 hari kerja",
    biaya: "Gratis",
    ikon: "rings",
    syarat: ["Fotokopi KTP & KK calon pengantin", "Fotokopi akta lahir", "Pasfoto 3x4 (2 lembar)"],
  },
  {
    id: "kehilangan",
    kode: "SKK",
    nama: "Surat Keterangan Kehilangan",
    ringkas: "Keterangan kehilangan dokumen sebagai syarat pembuatan ulang.",
    durasi: "1 hari kerja",
    biaya: "Gratis",
    ikon: "alert",
    syarat: ["Fotokopi KTP & KK", "Kronologi kehilangan", "Surat keterangan kepolisian (menyusul)"],
  },
];

export const layananPopuler = [
  {
    ikon: "file",
    judul: "Pengajuan Surat Digital",
    teks: "Ajukan surat keterangan RT tanpa datang ke sekretariat. Pantau status sampai siap diambil.",
    tautan: "/ajukan",
    label: "Ajukan sekarang",
    aksen: "amber",
  },
  {
    ikon: "megaphone",
    judul: "Laporan Mandiri Warga",
    teks: "Laporkan sampah menumpuk, lampu jalan mati, atau saluran tersumbat langsung dari ponsel.",
    tautan: "/lapor",
    label: "Kirim laporan",
    aksen: "orange",
  },
  {
    ikon: "users",
    judul: "Basis Data Warga",
    teks: "Perbarui data diri, nomor kontak, dan komposisi keluarga agar data RT selalu mutakhir.",
    tautan: "/dashboard?tab=warga",
    label: "Lihat data warga",
    aksen: "brown",
  },
  {
    ikon: "search",
    judul: "Lacak Status",
    teks: "Cek posisi pengajuan surat dan tindak lanjut laporan dengan nomor tiket Anda.",
    tautan: "/lacak",
    label: "Cek status",
    aksen: "cream",
  },
];

export const pengumuman = [
  {
    tanggal: "28 Okt 2026",
    tag: "Kerja Bakti",
    judul: "Kerja bakti normalisasi saluran air Blok C",
    isi: "Minggu, 2 November 2026 pukul 07.00. Titik kumpul di pos ronda Blok C. Mohon membawa alat kebersihan.",
  },
  {
    tanggal: "24 Okt 2026",
    tag: "Administrasi",
    judul: "Pemutakhiran data warga semester II",
    isi: "Seluruh kepala keluarga diminta memperbarui data anggota keluarga melalui menu Basis Data Warga sebelum 15 November.",
  },
  {
    tanggal: "19 Okt 2026",
    tag: "Keamanan",
    judul: "Jadwal ronda November — Desember",
    isi: "Jadwal ronda terbaru sudah ditempel di pos utama dan dapat dilihat pada papan informasi digital RT.",
  },
];

export const alurLayanan = [
  { judul: "Pilih layanan", teks: "Tentukan jenis surat atau laporan yang dibutuhkan." },
  { judul: "Isi formulir", teks: "Lengkapi data pemohon dan unggah lampiran persyaratan." },
  { judul: "Verifikasi pengurus", teks: "Pengurus RT memeriksa kelengkapan dalam 1–2 hari kerja." },
  { judul: "Terbit & unduh", teks: "Surat digital siap diunduh atau diambil di sekretariat." },
];

export const statistik = {
  warga: 248,
  kk: 76,
  laporanBulanIni: 34,
  suratBulanIni: 52,
  laporanSelesai: 27,
  suratMenunggu: 9,
};

export const laporanTrend = [
  { bulan: "Mei", laporan: 22, surat: 31 },
  { bulan: "Jun", laporan: 28, surat: 38 },
  { bulan: "Jul", laporan: 19, surat: 34 },
  { bulan: "Agu", laporan: 33, surat: 45 },
  { bulan: "Sep", laporan: 26, surat: 41 },
  { bulan: "Okt", laporan: 34, surat: 52 },
];

export const laporanWarga = [
  { id: "LPR-1042", judul: "Lampu jalan Blok B mati", kategori: "Fasilitas", pelapor: "Rina Kartika", tanggal: "28 Okt", status: "Diproses", prioritas: "Tinggi" },
  { id: "LPR-1041", judul: "Sampah menumpuk di dekat pos ronda", kategori: "Kebersihan", pelapor: "Agus Salim", tanggal: "27 Okt", status: "Menunggu", prioritas: "Sedang" },
  { id: "LPR-1040", judul: "Saluran air tersumbat Blok C", kategori: "Lingkungan", pelapor: "Dewi Lestari", tanggal: "26 Okt", status: "Diproses", prioritas: "Tinggi" },
  { id: "LPR-1039", judul: "Pohon rindang berisiko tumbang", kategori: "Keamanan", pelapor: "Bambang P.", tanggal: "25 Okt", status: "Selesai", prioritas: "Sedang" },
  { id: "LPR-1038", judul: "Parkir liar menutup gang 3", kategori: "Ketertiban", pelapor: "Siti Aminah", tanggal: "24 Okt", status: "Selesai", prioritas: "Rendah" },
];

export const pengajuanMasuk = [
  { id: "SUR-2087", jenis: "Surat Keterangan Domisili", pemohon: "Rina Kartika", blok: "B-12", tanggal: "28 Okt", status: "Menunggu" },
  { id: "SUR-2086", jenis: "Surat Keterangan Usaha", pemohon: "Agus Salim", blok: "C-04", tanggal: "28 Okt", status: "Menunggu" },
  { id: "SUR-2085", jenis: "Surat Pengantar Nikah", pemohon: "Fajar Nugroho", blok: "A-21", tanggal: "27 Okt", status: "Diproses" },
  { id: "SUR-2084", jenis: "Surat Keterangan Tidak Mampu", pemohon: "Siti Aminah", blok: "D-08", tanggal: "27 Okt", status: "Diproses" },
  { id: "SUR-2083", jenis: "Surat Pengantar KTP / KK", pemohon: "Dewi Lestari", blok: "B-07", tanggal: "26 Okt", status: "Selesai" },
];

export const dataWarga = [
  { nama: "Suryana Wijaya", nik: "3201••••••••0001", blok: "A-01", kk: "3201012301", anggota: 4, status: "Tetap", kontak: "0812-1100-2201" },
  { nama: "Rina Kartika", nik: "3201••••••••0044", blok: "B-12", kk: "3201012302", anggota: 3, status: "Tetap", kontak: "0813-2211-8890" },
  { nama: "Agus Salim", nik: "3201••••••••0072", blok: "C-04", kk: "3201012303", anggota: 5, status: "Tetap", kontak: "0857-9900-1122" },
  { nama: "Fajar Nugroho", nik: "3201••••••••0118", blok: "A-21", kk: "3201012304", anggota: 2, status: "Kontrak", kontak: "0895-3344-7788" },
  { nama: "Dewi Lestari", nik: "3201••••••••0203", blok: "B-07", kk: "3201012305", anggota: 4, status: "Tetap", kontak: "0821-5566-3344" },
  { nama: "Hendra Gunawan", nik: "3201••••••••0251", blok: "D-11", kk: "3201012306", anggota: 1, status: "Pindah masuk", kontak: "0819-7788-5566" },
];

export const mutasiWarga = [
  { nama: "Hendra Gunawan", jenis: "Pindah masuk", asal: "RT 002 / Cibinong", tanggal: "26 Okt 2026", status: "Terverifikasi" },
  { nama: "Keluarga Pratama", jenis: "Pindah keluar", asal: "Blok C-09 → Bandung", tanggal: "21 Okt 2026", status: "Terverifikasi" },
  { nama: "Yusuf Maulana", jenis: "Pindah masuk", asal: "RT 007 / Bogor", tanggal: "17 Okt 2026", status: "Menunggu" },
];

export const statusLaporanSaya = {
  "SUR-2085": {
    jenis: "Surat Pengantar Nikah",
    pemohon: "Fajar Nugroho",
    diajukan: "27 Okt 2026, 09.12",
    langkah: [
      { judul: "Pengajuan diterima", waktu: "27 Okt, 09.12", selesai: true },
      { judul: "Verifikasi pengurus RT", waktu: "27 Okt, 14.30", selesai: true },
      { judul: "Ditandatangani Ketua RT", waktu: "Estimasi 29 Okt", selesai: false },
      { judul: "Siap diunduh", waktu: "Estimasi 30 Okt", selesai: false },
    ],
  },
  "LPR-1040": {
    jenis: "Laporan — Saluran air tersumbat",
    pemohon: "Dewi Lestari",
    diajukan: "26 Okt 2026, 07.45",
    langkah: [
      { judul: "Laporan diterima", waktu: "26 Okt, 07.45", selesai: true },
      { judul: "Diteruskan ke petugas kebersihan", waktu: "26 Okt, 10.20", selesai: true },
      { judul: "Pengerjaan di lapangan", waktu: "Sedang berlangsung", selesai: true },
      { judul: "Selesai & diverifikasi", waktu: "Estimasi 29 Okt", selesai: false },
    ],
  },
};
