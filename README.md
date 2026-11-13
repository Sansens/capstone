# Kelompok A — Sistem Pelaporan Mandiri & Basis Data Warga RT

Project React untuk tugas "Sistem Pelaporan Mandiri dan Basis Data Warga" (RT 004 / Griya Asri).
Semua tampilan menggunakan tema warna yang diminta:

| Warna | Kode | Pemakaian |
| --- | --- | --- |
| Cokelat tua | `#4D2A00` | teks utama, sidebar, tombol gelap |
| Oranye | `#CC6F00` | aksi utama, tautan, garis diagram |
| Amber | `#F2A900` | aksen, ikon, grafik |
| Krem | `#F9E6A8` | latar lembut, badge, sorotan |

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi ke dist/
```

## Versi satu file HTML (tanpa install)

`artifacts/Kelompok-A-RT-website.html` adalah versi mandiri: seluruh JS dan CSS sudah
tertanam di dalam satu file, jadi cukup **klik dua kali** untuk membuka di browser
(tanpa Node.js maupun server). Routing memakai router in-memory agar tidak bentrok
dengan pembatasan browser pada `file://`, dengan rute awal dibaca dari hash,
mis. `Kelompok-A-RT-website.html#/dashboard`.

Membangun ulang file tersebut setelah mengubah kode:

```bash
npx vite build --config vite.standalone.config.js
node scripts/inline-standalone.mjs
```

## Pemetaan tugas

| Tugas | Isi | Lokasi |
| --- | --- | --- |
| 1A | Use case diagram (Warga, Admin Sistem, Pengurus RT) | `/sistem` — `src/pages/Sistem.jsx` |
| 1B | Flowchart pengajuan surat digital | `/sistem` |
| 1C | ERD basis data warga | `/sistem` |
| 2 | Dashboard dan layanan warga | `/warga` — `src/pages/ResidentDashboard.jsx` |
| 3 | Front end Pengajuan Surat (wizard 4 langkah) | `/ajukan` — `src/pages/PengajuanSurat.jsx` |
| 4 | Dashboard Pengurus RT | `/dashboard` — `src/pages/Dashboard.jsx` |

Area warga memiliki empat halaman: **Dashboard Warga** (`/warga`), **Laporan Mandiri**
(`/lapor`), **Pengajuan Surat** (`/ajukan`), dan **Profil Saya** (`/profil`). Status
pengajuan terbaru ditampilkan pada dashboard warga.

Dashboard **Pengurus RT** memiliki empat bagian: Dashboard RT (`?tab=ringkasan`), Data
Warga dan riwayat mutasi (`?tab=warga`), Verifikasi Surat (`?tab=surat`), serta Tindak
Lanjut Laporan (`?tab=laporan`). Akun warga, pengajuan, status, dan katalog jenis surat
dibaca langsung dari Firestore dan diperbarui secara real-time.

## Firebase Authentication dan Firestore

Login sekarang memakai Firebase Authentication (email/password). Peran tidak dipilih
atau dipercaya dari browser: aplikasi membaca `Account/{uid}` setelah autentikasi dan
mengarahkan akun ke halaman sesuai field `role`. Kata sandi hanya disimpan Firebase
Authentication, tidak di koleksi Firestore.

### Menyiapkan Firebase

1. Buat project Firebase, aktifkan **Authentication → Email/Password**, dan buat
   database Firestore.
2. Salin `.env.example` menjadi `.env.local`, lalu isi konfigurasi aplikasi web Firebase.
   Jangan masukkan kredensial Admin SDK atau service-account ke aplikasi React.
3. Buat tiga user pada Authentication. NIK warga diterjemahkan menjadi email Auth
   `nik-3573012011950003@silaras-rt.web.app`, sehingga warga tetap login memakai NIK.
   Untuk demo: warga menggunakan kata sandi `123`; `pengurus@mail.com` dan
   `admin@mail.com` masing-masing menggunakan `12345`. Ganti kata sandi demo sebelum
   aplikasi dipublikasikan.
4. Untuk setiap user, buat dokumen `Account` dengan ID sama persis seperti UID dari
   Firebase Authentication:

```text
Account/{uid}
  role: "resident" | "rt-admin" | "system-admin"
  displayName: string
  email: string
  nik: string                 // warga; kosongkan atau hilangkan untuk admin
  status: "Aktif" | "Nonaktif" // opsional; default aktif
  createdAt: timestamp
```

Set `role` sesuai jenis user; akun contoh masing-masing memakai `resident`,
`rt-admin`, dan `system-admin`. Jangan menambahkan field password. Akun baru dan kata
sandi dibuat di Firebase Authentication, lalu dokumen `Account/{uid}` dibuat dengan UID
yang sama. Panel manajemen akun hanya mengubah dokumen akun yang sudah terdaftar; aplikasi
browser tidak membuat kredensial Authentication.
5. Deploy `firestore.rules` dengan Firebase CLI (`firebase deploy --only
   firestore:rules`) dan jalankan aplikasi dengan `npm run dev`.

Contoh dokumen akun (ganti tiap placeholder UID dengan UID dari Authentication):

```text
Account/{UID_WARGA} = {
  role: "resident",
  displayName: "Warga Kelompok A",
  email: "nik-3573012011950003@silaras-rt.web.app",
  nik: "3573012011950003",
  createdAt: timestamp
}

Account/{UID_PENGURUS} = {
  role: "rt-admin",
  displayName: "Pengurus RT",
  email: "pengurus@mail.com",
  createdAt: timestamp
}

Account/{UID_ADMIN} = {
  role: "system-admin",
  displayName: "Admin Sistem",
  email: "admin@mail.com",
  createdAt: timestamp
}
```

### Struktur koleksi dan data real-time

- `Account/{uid}` menyimpan peran dan profil dasar yang terikat ke UID Auth. Profil warga
  juga menyimpan `phone`, `block`, `address`, `familyCard`, `contactEmail`,
  `residencyStatus`, dan `residenceHistory`; warga hanya dapat mengubah profilnya sendiri,
  sedangkan Pengurus RT dapat melihat daftar warga dan memperbarui status domisili.
- `Reports/{autoId}` menyimpan `ticketId`, `residentUid`, `residentNik`,
  `residentName`, `phone`, `category`, `title`, `location`, `description`,
  `priority`, `photoCount`, `status`, dan `createdAt`.
- `Letter Requests/{autoId}` menyimpan `ticketId`, `residentUid`, `residentNik`,
  `residentName`, `phone`, `address`, `block`, `letterType`, `purpose`,
  `attachmentCount`, `status`, `correctionNote`, dan `createdAt`.
- `LetterTypes/{id}` menyimpan katalog jenis surat (`kode`, `nama`, `ringkas`, `durasi`,
  `biaya`, `ikon`, dan `syarat`). Saat koleksi masih kosong, halaman admin sistem
  menginisialisasi katalog contoh satu kali. Perubahan katalog di panel admin langsung
  muncul pada formulir pengajuan warga.

Form menambahkan `residentUid` dari UID Auth, memberi status awal `Menunggu`, dan
mengisi `createdAt` dengan `serverTimestamp()`. Contoh penulisan tersebut ada di
`src/firestoreData.js`.

Form warga menulis langsung ke dua koleksi pengajuan. Dashboard warga hanya membaca
pengajuan milik UID-nya, sedangkan dashboard Pengurus RT membaca semua pengajuan serta
data akun warga. Akun admin sistem membaca dan mengelola akun serta katalog jenis surat.
Security Rules membatasi pengiriman ke akun warga yang sedang login, mengunci perubahan
profil ke pemiliknya, serta membatasi perubahan status dan pengaturan katalog berdasarkan
peran.

Untuk demo lama tanpa konfigurasi Firebase, login dan penyimpanan Firestore tidak
tersedia; Firebase harus dikonfigurasi agar aplikasi dapat digunakan.

## Struktur

```
src/
  App.jsx                 routing & guard sesi/peran
  data.js                 data contoh (warga, surat, laporan, statistik)
  accountData.js          profil dan data akun berbasis Firestore
  adminData.js            katalog jenis surat berbasis Firestore
  firestoreData.js        pengajuan laporan/surat dan subscription Firestore
  styles.css              design token & seluruh styling
  components/
    Layout.jsx            sidebar, topbar, footer
    ui.jsx                ikon SVG & badge
  pages/
    Login.jsx             pintu masuk peran warga/pengurus/admin
    AdminAccounts.jsx     identitas akun, role, dan izin akses admin sistem
    AdminLetterTypes.jsx  katalog jenis surat & persyaratan
    ResidentDashboard.jsx dashboard warga & status pengajuan
    ResidentProfile.jsx   profil, domisili, riwayat warga
    Layanan.jsx           halaman katalog layanan (legacy)
    PengajuanSurat.jsx    Tugas 3
    Dashboard.jsx         Tugas 4
    Sistem.jsx            Tugas 1 (diagram SVG)
    LaporanMandiri.jsx
    LacakStatus.jsx
```

Catatan: data mutasi dan grafik statistik tertentu masih berupa contoh. Profil, daftar
akun, katalog surat, laporan, dan pengajuan surat yang digunakan pada alur utama tersimpan
di Firestore; unggahan berkas masih simulasi dan hanya jumlah lampiran yang dicatat.
