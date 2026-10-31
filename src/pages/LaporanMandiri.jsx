import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Badge } from "../components/ui.jsx";
import { addResidentRecord, readResidentData, writeResidentData } from "../residentData.js";

const kategori = ["Kebersihan", "Fasilitas", "Lingkungan", "Keamanan", "Ketertiban"];
const prioritas = [
  { id: "Rendah", teks: "Bisa menunggu" },
  { id: "Sedang", teks: "Perlu segera" },
  { id: "Tinggi", teks: "Membahayakan" },
];

export default function LaporanMandiri({ session }) {
  const [form, setForm] = useState(() => {
    const profile = readResidentData(session?.identity).profile;
    return {
      kategori: "Kebersihan",
      judul: "",
      lokasi: "",
      deskripsi: "",
      prioritas: "Sedang",
      nama: profile.name || "",
      telepon: profile.phone || "",
    };
  });
  const [foto, setFoto] = useState([]);
  const [errors, setErrors] = useState({});
  const [tiket, setTiket] = useState(null);
  const [recentReports, setRecentReports] = useState(() => readResidentData(session?.identity).reports);
  const fileRef = useRef(null);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const kirim = (e) => {
    e.preventDefault();
    const err = {};
    if (form.judul.trim().length < 6) err.judul = "Judul laporan minimal 6 karakter.";
    if (!form.lokasi.trim()) err.lokasi = "Sebutkan lokasi kejadian.";
    if (form.deskripsi.trim().length < 15) err.deskripsi = "Jelaskan kondisi minimal 15 karakter.";
    if (form.nama.trim().length < 3) err.nama = "Nama pelapor wajib diisi.";
    if (!/^[0-9+\-\s]{9,16}$/.test(form.telepon)) err.telepon = "Nomor WhatsApp tidak valid.";
    setErrors(err);
    if (Object.keys(err).length) return;

    const record = {
      id: "LPR-" + Math.floor(1043 + Math.random() * 200),
      createdAt: new Date().toISOString(),
      status: "Menunggu",
      ...form,
      foto: foto.length,
    };
    addResidentRecord(session?.identity, "reports", record);
    writeResidentData(session?.identity, { profile: { name: form.nama, phone: form.telepon } });
    setRecentReports((reports) => [record, ...reports]);
    setTiket({ nomor: record.id, ...record });
  };

  return (
    <div className="split" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
      <div>
        {tiket ? (
          <div className="card success-card">
            <div className="success-badge"><Icon name="megaphone" size={28} /></div>
            <h2>Laporan terkirim ke pengurus</h2>
            <p>
              Laporan <strong>{tiket.judul}</strong> di {tiket.lokasi} sudah masuk antrean
              tindak lanjut. Pengurus RT akan meninjau dalam 1×24 jam.
            </p>
            <div className="ticket">
              <span>Nomor laporan</span>
              <strong>{tiket.nomor}</strong>
            </div>
            <div className="btn-row" style={{ justifyContent: "center", marginTop: 20 }}>
              <Link to="/warga" className="btn btn-primary">
                <Icon name="chart" size={16} /> Lihat status di dashboard
              </Link>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setTiket(null);
                  setFoto([]);
                  setForm({
                    kategori: "Kebersihan",
                    judul: "",
                    lokasi: "",
                    deskripsi: "",
                    prioritas: "Sedang",
                    nama: readResidentData(session?.identity).profile.name || "",
                    telepon: readResidentData(session?.identity).profile.phone || "",
                  });
                }}
              >
                Kirim laporan lain
              </button>
            </div>
          </div>
        ) : (
          <form className="card card-pad" onSubmit={kirim} noValidate>
            <span className="eyebrow">Laporan mandiri</span>
            <h2 style={{ fontSize: 18 }}>Laporkan masalah di lingkungan RT</h2>
            <p className="muted small-text" style={{ margin: "4px 0 18px" }}>
              Sertakan lokasi dan deskripsi yang jelas agar pengurus dapat cepat menindaklanjuti.
            </p>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="kategori">Kategori</label>
                <select
                  id="kategori"
                  value={form.kategori}
                  onChange={(e) => set("kategori", e.target.value)}
                >
                  {kategori.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div className={`field ${errors.lokasi ? "invalid" : ""}`}>
                <label htmlFor="lokasi">Lokasi <span className="req">*</span></label>
                <input
                  id="lokasi"
                  value={form.lokasi}
                  onChange={(e) => set("lokasi", e.target.value)}
                  placeholder="Contoh: Blok B, depan pos ronda"
                />
                {errors.lokasi && <span className="err">{errors.lokasi}</span>}
              </div>

              <div className={`field span-2 ${errors.judul ? "invalid" : ""}`}>
                <label htmlFor="judul">Judul laporan <span className="req">*</span></label>
                <input
                  id="judul"
                  value={form.judul}
                  onChange={(e) => set("judul", e.target.value)}
                  placeholder="Contoh: Lampu jalan depan Blok B mati sejak 3 hari"
                />
                {errors.judul && <span className="err">{errors.judul}</span>}
              </div>

              <div className={`field span-2 ${errors.deskripsi ? "invalid" : ""}`}>
                <label htmlFor="deskripsi">Deskripsi kondisi <span className="req">*</span></label>
                <textarea
                  id="deskripsi"
                  value={form.deskripsi}
                  onChange={(e) => set("deskripsi", e.target.value)}
                  placeholder="Ceritakan kondisi, dampak, dan sejak kapan terjadi…"
                />
                {errors.deskripsi && <span className="err">{errors.deskripsi}</span>}
              </div>

              <div className="field span-2">
                <label>Tingkat urgensi</label>
                <div className="grid grid-3" style={{ gap: 8 }}>
                  {prioritas.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      className={`choice ${form.prioritas === p.id ? "selected" : ""}`}
                      onClick={() => set("prioritas", p.id)}
                      style={{ padding: "11px 13px" }}
                    >
                      <div className="choice-top" style={{ marginBottom: 0 }}>
                        <div className="choice-radio" />
                        <strong>{p.id}</strong>
                      </div>
                      <p style={{ marginTop: 4 }}>{p.teks}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor="nama">Nama pelapor <span className="req">*</span></label>
                <input
                  id="nama"
                  value={form.nama}
                  onChange={(e) => set("nama", e.target.value)}
                  placeholder="Nama lengkap"
                />
                {errors.nama && <span className="err">{errors.nama}</span>}
              </div>
              <div className={`field ${errors.telepon ? "invalid" : ""}`}>
                <label htmlFor="telepon">WhatsApp <span className="req">*</span></label>
                <input
                  id="telepon"
                  value={form.telepon}
                  onChange={(e) => set("telepon", e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                />
                {errors.telepon && <span className="err">{errors.telepon}</span>}
              </div>

              <div className="field span-2">
                <label>Foto pendukung (opsional)</label>
                <label className="dropzone" style={{ padding: "18px" }}>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => {
                      const baru = Array.from(e.target.files || []).map((f) => f.name);
                      if (baru.length) setFoto((l) => [...l, ...baru].slice(0, 3));
                      e.target.value = "";
                    }}
                  />
                  <div className="layanan-ico"><Icon name="upload" size={18} /></div>
                  <strong>Unggah foto kondisi lokasi</strong>
                  <span>Maksimal 3 foto, format JPG/PNG</span>
                </label>
                {foto.map((f, i) => (
                  <div className="file-chip" key={f + i}>
                    <Icon name="file" size={16} />
                    <span>{f}</span>
                    <button
                      type="button"
                      aria-label={`Hapus ${f}`}
                      onClick={() => setFoto((l) => l.filter((_, idx) => idx !== i))}
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="btn-row" style={{ marginTop: 20, justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-primary">
                <Icon name="megaphone" size={16} /> Kirim laporan
              </button>
            </div>
          </form>
        )}
      </div>

      <aside>
        <div className="card card-pad">
          <div className="section-head" style={{ marginBottom: 2 }}>
            <h3 style={{ fontSize: 14.5 }}>Laporan saya</h3>
            <span className="tiny muted">{recentReports.length} laporan</span>
          </div>
          {recentReports.length ? recentReports.slice(0, 3).map((report) => (
            <div key={report.id} className="notif-item" style={{ padding: "12px 2px" }}>
              <div>
                <span className="tag">{report.id}</span>
                <h4 style={{ fontSize: 12.9 }}>{report.judul}</h4>
                <p style={{ fontSize: 11.6 }}>{report.kategori} · {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(new Date(report.createdAt))}</p>
              </div>
              <div style={{ marginLeft: "auto" }}><Badge>{report.status}</Badge></div>
            </div>
          )) : <p className="small-text muted" style={{ marginTop: 12 }}>Laporan yang Anda kirim akan tampil di sini.</p>}
          <Link to="/warga" className="card-link" style={{ marginTop: 8 }}>
            Kembali ke ringkasan <Icon name="arrow" size={15} />
          </Link>
        </div>

        <div className="card card-pad" style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 14.5 }}>Tips agar cepat ditangani</h3>
          <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 12.4, color: "var(--muted)" }}>
            <li style={{ marginBottom: 6 }}>Sebutkan patokan lokasi yang mudah ditemukan.</li>
            <li style={{ marginBottom: 6 }}>Satu laporan untuk satu masalah.</li>
            <li>Sertakan foto agar petugas membawa peralatan yang tepat.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
