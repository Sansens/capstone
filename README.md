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
Lanjut Laporan (`?tab=laporan`). Status dan catatan review contoh tersimpan pada sesi UI;
submission warga yang dibuat di browser yang sama dibaca dari penyimpanan lokal demo.

## Login dan akses peran

Halaman pertama adalah login (`/`). Pilih **Warga**, **Pengurus RT**, atau **Admin**;
setelah mengisi identitas dan kata sandi, pengguna diarahkan ke `/warga`, `/dashboard`,
atau `/admin`. Sesi demo disimpan di `localStorage` dan dapat diakhiri melalui tombol
keluar. Form login ini hanya simulasi antarmuka (identitas nonkosong diterima); belum
ada verifikasi kredensial di server dan tidak boleh dipakai untuk mengamankan data nyata.

## Struktur

```
src/
  App.jsx                 routing & guard sesi/peran
  data.js                 data contoh (warga, surat, laporan, statistik)
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

Catatan: seluruh data masih berupa data contoh (belum ada backend). Profil dan riwayat
pengajuan warga demo disimpan di `localStorage` browser melalui `src/residentData.js`;
unggahan berkas hanya simulasi antarmuka dan belum dikirim ke server.
