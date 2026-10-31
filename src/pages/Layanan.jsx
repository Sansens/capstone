import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Badge } from "../components/ui.jsx";
import {
  rtInfo,
  jenisSurat,
  layananPopuler,
  pengumuman,
  alurLayanan,
  statistik,
} from "../data.js";

export default function Layanan() {
  const [q, setQ] = useState("");

  const daftar = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return jenisSurat;
    return jenisSurat.filter(
      (s) => s.nama.toLowerCase().includes(key) || s.ringkas.toLowerCase().includes(key)
    );
  }, [q]);

  return (
    <>
      {/* HERO — TUGAS 2: Frontend Layanan RT */}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Sistem Layanan RT Digital</span>
          <h2>
            Urusan RT selesai <em>tanpa antre</em> di sekretariat.
          </h2>
          <p className="lede">
            Ajukan surat, laporkan masalah lingkungan, dan perbarui data keluarga dari mana
            saja. Semua tercatat rapi di basis data warga {rtInfo.nama} {rtInfo.kawasan}.
          </p>
          <div className="hero-actions">
            <Link to="/ajukan" className="btn btn-cream">
              <Icon name="file" size={17} /> Ajukan surat sekarang
            </Link>
            <Link to="/lapor" className="btn btn-outline">
              <Icon name="megaphone" size={17} /> Kirim laporan
            </Link>
          </div>
          <div className="hero-facts">
            <div>
              <strong>{statistik.warga}</strong>
              <span>warga terdata</span>
            </div>
            <div>
              <strong>{statistik.kk}</strong>
              <span>kepala keluarga</span>
            </div>
            <div>
              <strong>1–2 hari</strong>
              <span>rata-rata verifikasi</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-head">
            <span>Status layanan hari ini</span>
            <Badge>Sinkron</Badge>
          </div>
          <div className="hero-panel-row">
            <div className="hero-panel-icon"><Icon name="file" size={16} /></div>
            <div>
              <strong>Pengajuan surat</strong>
              <span>{statistik.suratBulanIni} berkas bulan ini</span>
            </div>
            <Badge>Diproses</Badge>
          </div>
          <div className="hero-panel-row">
            <div className="hero-panel-icon"><Icon name="megaphone" size={16} /></div>
            <div>
              <strong>Laporan warga</strong>
              <span>{statistik.laporanSelesai} dari {statistik.laporanBulanIni} tuntas</span>
            </div>
            <Badge>Selesai</Badge>
          </div>
          <div className="hero-panel-row">
            <div className="hero-panel-icon"><Icon name="clock" size={16} /></div>
            <div>
              <strong>Jam sekretariat</strong>
              <span>{rtInfo.jam}</span>
            </div>
            <Badge>Buka</Badge>
          </div>
        </div>
      </section>

      {/* Layanan cepat */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Akses cepat</span>
            <h2>Mulai dari kebutuhan Anda</h2>
          </div>
          <Link to="/lacak" className="btn btn-outline btn-sm">
            <Icon name="search" size={15} /> Cek status tiket
          </Link>
        </div>
        <div className="grid grid-4">
          {layananPopuler.map((l) => (
            <Link key={l.judul} to={l.tautan} className="layanan-card">
              <div className={`layanan-ico ${l.aksen}`}>
                <Icon name={l.ikon} size={21} />
              </div>
              <h3>{l.judul}</h3>
              <p>{l.teks}</p>
              <span className="card-link">
                {l.label} <Icon name="arrow" size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Daftar jenis surat */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Administrasi</span>
            <h2>Jenis surat yang dilayani</h2>
            <p>Enam jenis surat keterangan resmi RT 004 — seluruhnya tanpa biaya.</p>
          </div>
          <label className="toolbar-input">
            <Icon name="search" size={15} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari jenis surat…"
              aria-label="Cari jenis surat"
            />
          </label>
        </div>

        {daftar.length === 0 ? (
          <div className="card empty">Tidak ada surat yang cocok dengan “{q}”.</div>
        ) : (
          <div className="grid grid-3">
            {daftar.map((s) => (
              <article key={s.id} className="layanan-card">
                <div className="layanan-head">
                  <div className="layanan-ico">
                    <Icon name={s.ikon} size={21} />
                  </div>
                  <span className="kode">{s.kode}</span>
                </div>
                <h3>{s.nama}</h3>
                <p>{s.ringkas}</p>
                <div className="layanan-meta">
                  <span><Icon name="clock" size={13} /> {s.durasi}</span>
                  <span><Icon name="shield" size={13} /> {s.biaya}</span>
                </div>
                <Link to={`/ajukan?jenis=${s.id}`} className="card-link">
                  Ajukan surat <Icon name="arrow" size={15} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Alur */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Alur layanan</span>
            <h2>Empat langkah, selesai</h2>
          </div>
        </div>
        <div className="steps">
          {alurLayanan.map((s, i) => (
            <div className="step" key={s.judul}>
              <div className="step-num">{i + 1}</div>
              <h4>{s.judul}</h4>
              <p>{s.teks}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pengumuman + kontak */}
      <section className="section split">
        <div className="card card-pad">
          <div className="section-head" style={{ marginBottom: 4 }}>
            <div>
              <span className="eyebrow">Papan informasi</span>
              <h2 style={{ fontSize: 17 }}>Pengumuman RT terbaru</h2>
            </div>
            <span className="tiny muted">{pengumuman.length} pengumuman</span>
          </div>
          {pengumuman.map((p) => (
            <div className="notif-item" key={p.judul}>
              <div className="notif-date">{p.tanggal}</div>
              <div>
                <span className="tag">{p.tag}</span>
                <h4>{p.judul}</h4>
                <p>{p.isi}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card card-pad">
          <span className="eyebrow">Sekretariat</span>
          <h2 style={{ fontSize: 17, marginBottom: 10 }}>Kontak &amp; lokasi</h2>
          <div className="info-row">
            <Icon name="pin" size={17} />
            <div>
              <strong>{rtInfo.sekretariat}</strong>
              <span>{rtInfo.kelurahan}</span>
            </div>
          </div>
          <div className="info-row">
            <Icon name="phone" size={17} />
            <div>
              <strong>{rtInfo.telepon}</strong>
              <span>WhatsApp pengurus (chat only)</span>
            </div>
          </div>
          <div className="info-row">
            <Icon name="clock" size={17} />
            <div>
              <strong>{rtInfo.jam}</strong>
              <span>Hari libur nasional tutup</span>
            </div>
          </div>
          <div className="info-row">
            <Icon name="user" size={17} />
            <div>
              <strong>{rtInfo.ketua}</strong>
              <span>Ketua RT periode 2025–2028</span>
            </div>
          </div>
          <div className="notice" style={{ marginTop: 10 }}>
            <Icon name="alert" size={16} />
            <span>
              Untuk keadaan darurat (kebakaran, keamanan) hubungi pos ronda 24 jam, bukan
              formulir laporan mandiri.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
