import React, { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Icon, Badge } from "../components/ui.jsx";
import {
  statistik,
  laporanTrend,
  laporanWarga,
  pengajuanMasuk,
  dataWarga,
  mutasiWarga,
  jenisSurat,
} from "../data.js";
import { listResidentAccounts, updateResidentRecord, writeResidentData } from "../residentData.js";

const tabs = [
  { id: "ringkasan", label: "Dashboard RT" },
  { id: "warga", label: "Data Warga" },
  { id: "surat", label: "Verifikasi Surat" },
  { id: "laporan", label: "Tindak Lanjut Laporan" },
];

const donutData = [
  { label: "Domisili", value: 18, color: "#4d2a00" },
  { label: "Usaha", value: 12, color: "#cc6f00" },
  { label: "Tidak mampu", value: 9, color: "#f2a900" },
  { label: "Pengantar KTP", value: 13, color: "#f9e6a8" },
];

const maxTrend = Math.max(...laporanTrend.map((d) => Math.max(d.laporan, d.surat)));

function maskedNik(value = "") {
  if (!value || value.includes("•")) return value || "—";
  return `${"•".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
}

export default function Dashboard() {
  const [params, setParams] = useSearchParams();
  const tab = tabs.some((item) => item.id === params.get("tab")) ? params.get("tab") : "ringkasan";
  const [accounts] = useState(listResidentAccounts);
  const [laporan, setLaporan] = useState(() => {
    const submitted = listResidentAccounts().flatMap((account) => (account.reports || []).map((item) => ({
      ...item,
      pelapor: item.nama || account.profile.name || "Warga",
      nik: account.profile.identity || "",
      tanggal: item.createdAt ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(new Date(item.createdAt)) : "Baru",
      judul: item.judul || item.title,
      localIdentity: account.profile.identity,
      localCollection: "reports",
    })));
    return [...submitted, ...laporanWarga];
  });
  const [pengajuan, setPengajuan] = useState(() => {
    const submitted = listResidentAccounts().flatMap((account) => (account.letters || []).map((item) => ({
      ...item,
      jenis: item.jenis || item.title || "Pengajuan surat",
      pemohon: account.profile.name || "Warga",
      nik: account.profile.identity || "",
      blok: account.profile.block || "—",
      tanggal: item.createdAt ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(new Date(item.createdAt)) : "Baru",
      localIdentity: account.profile.identity,
      localCollection: "letters",
    })));
    return [...submitted, ...pengajuanMasuk];
  });
  const [mutasi, setMutasi] = useState(() => {
    try { return JSON.parse(localStorage.getItem("silaras-rt-mutasi") || "null") || mutasiWarga; }
    catch { return mutasiWarga; }
  });
  const [residents, setResidents] = useState(() => {
    const stored = listResidentAccounts().filter((account) => account.profile?.name).map((account) => ({
      nama: account.profile.name,
      nik: account.profile.identity || "—",
      blok: account.profile.block || "—",
      kk: account.profile.familyCard || "—",
      anggota: 1,
      status: account.profile.status || "Tetap",
      kontak: account.profile.phone || "—",
    }));
    return [...stored, ...dataWarga];
  });
  const [q, setQ] = useState("");
  const [submissionQuery, setSubmissionQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [formMutasi, setFormMutasi] = useState({ nama: "", jenis: "Pindah masuk", asal: "" });
  const [correctionNotes, setCorrectionNotes] = useState({});

  const setTab = (id) => {
    const next = new URLSearchParams(params);
    next.set("tab", id);
    setParams(next, { replace: true });
    setQ("");
    setFilterStatus("Semua");
  };

  const laporanTampil = useMemo(() => {
    const key = q.toLowerCase();
    return laporan.filter(
      (l) =>
        (filterStatus === "Semua" || l.status === filterStatus) &&
        (l.judul.toLowerCase().includes(key) ||
          l.id.toLowerCase().includes(key) ||
          l.pelapor.toLowerCase().includes(key))
    );
  }, [laporan, q, filterStatus]);

  const submissions = useMemo(() => [
    ...pengajuan.map((item) => ({
      id: item.id,
      title: item.jenis,
      type: "Pengajuan surat",
      person: item.pemohon,
      nik: item.nik || "",
      status: item.status,
      tab: "surat",
    })),
    ...laporan.map((item) => ({
      id: item.id,
      title: item.judul,
      type: "Laporan warga",
      person: item.pelapor,
      nik: item.nik || "",
      status: item.status,
      tab: "laporan",
    })),
  ].filter((item) => {
    const key = submissionQuery.trim().toLowerCase();
    return !key || [item.id, item.title, item.type, item.person, item.nik].some((value) => value.toLowerCase().includes(key));
  }), [pengajuan, laporan, submissionQuery]);

  const ubahStatusLaporan = (id, status) => {
    setLaporan((list) => list.map((l) => {
      if (l.id !== id) return l;
      if (l.localIdentity) updateResidentRecord(l.localIdentity, l.localCollection, l.id, { status });
      return { ...l, status };
    }));
  };

  const ubahStatusPengajuan = (id, status, note) => {
    setPengajuan((list) => list.map((p) => {
      if (p.id !== id) return p;
      if (p.localIdentity) updateResidentRecord(p.localIdentity, p.localCollection, p.id, { status, correctionNote: note ?? p.correctionNote });
      return { ...p, status, correctionNote: note ?? p.correctionNote };
    }));
  };

  const ubahStatusWarga = (nik, status) => {
    setResidents((list) => list.map((resident) => resident.nik === nik ? { ...resident, status } : resident));
    if (accounts.some((account) => account.profile?.identity === nik)) {
      writeResidentData(nik, { profile: { status } });
    }
  };

  const setMutationList = (next) => {
    setMutasi(next);
    localStorage.setItem("silaras-rt-mutasi", JSON.stringify(next));
  };

  const totalDonut = donutData.reduce((a, d) => a + d.value, 0);
  let offset = 0;

  return (
    <>
      <div className="tabs" style={{ marginBottom: 18 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ringkasan" && (
        <>
          <div className="grid grid-4">
            <div className="kpi">
              <div className="kpi-top">
                <span>Total warga</span>
                <div className="kpi-ico dark"><Icon name="users" size={17} /></div>
              </div>
              <div className="kpi-value">{statistik.warga}</div>
              <div className="kpi-foot"><span className="delta-up">+4</span> dari bulan lalu · {statistik.kk} KK</div>
            </div>
            <div className="kpi">
              <div className="kpi-top">
                <span>Laporan bulan ini</span>
                <div className="kpi-ico orange"><Icon name="megaphone" size={17} /></div>
              </div>
              <div className="kpi-value">{laporan.length + 29}</div>
              <div className="kpi-foot">
                <span className="delta-up">+8</span> · {laporan.filter((l) => l.status === "Selesai").length} selesai
              </div>
            </div>
            <div className="kpi">
              <div className="kpi-top">
                <span>Pengajuan surat</span>
                <div className="kpi-ico amber"><Icon name="file" size={17} /></div>
              </div>
              <div className="kpi-value">{statistik.suratBulanIni}</div>
              <div className="kpi-foot">
                <span className="delta-up">+11</span> · {pengajuan.filter((p) => p.status === "Menunggu").length} menunggu verifikasi
              </div>
            </div>
            <div className="kpi">
              <div className="kpi-top">
                <span>Rata-rata verifikasi</span>
                <div className="kpi-ico"><Icon name="clock" size={17} /></div>
              </div>
              <div className="kpi-value">1,4 <span style={{ fontSize: 15, fontWeight: 600 }}>hari</span></div>
              <div className="kpi-foot"><span className="delta-down">−0,3</span> lebih cepat dari target</div>
            </div>
          </div>

          <div className="card rt-submission-overview">
            <div className="card-pad" style={{ paddingBottom: 0 }}>
              <div className="toolbar">
                <div>
                  <h3 style={{ fontSize: 15 }}>Pengajuan &amp; laporan terbaru</h3>
                  <p className="tiny muted">Cari berdasarkan nama warga, NIK, judul, atau nomor tiket</p>
                </div>
                <label className="toolbar-input rt-wide-search">
                  <Icon name="search" size={15} />
                  <input value={submissionQuery} onChange={(event) => setSubmissionQuery(event.target.value)} placeholder="Cari nama / NIK…" aria-label="Cari pengajuan berdasarkan nama atau NIK" />
                </label>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Nomor</th><th>Jenis pengajuan</th><th>Warga</th><th>NIK</th><th>Status</th><th style={{ textAlign: "right" }}>Buka</th></tr></thead>
                <tbody>
                  {submissions.slice(0, 8).map((item) => (
                    <tr key={`${item.type}-${item.id}`}>
                      <td className="cell-strong">{item.id}</td>
                      <td>{item.title}<span className="cell-sub">{item.type}</span></td>
                      <td>{item.person}</td>
                      <td>{maskedNik(item.nik)}</td>
                      <td><Badge>{item.status}</Badge></td>
                      <td><div className="row-actions"><button className="btn btn-outline btn-sm" onClick={() => setTab(item.tab)}>Tinjau</button></div></td>
                    </tr>
                  ))}
                  {!submissions.length && <tr><td colSpan="6" className="empty">Tidak ada pengajuan yang cocok dengan pencarian.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="split" style={{ marginTop: 18 }}>
            <div className="card card-pad">
              <div className="chart-head">
                <div>
                  <h3>Tren layanan 6 bulan</h3>
                  <p>Perbandingan laporan warga dan pengajuan surat</p>
                </div>
                <div className="legend">
                  <span><i className="swatch orange" /> Laporan</span>
                  <span><i className="swatch cream" /> Surat</span>
                </div>
              </div>
              <div className="bars-grid">
                <div className="bars">
                  {laporanTrend.map((d) => (
                    <div className="bar-group" key={d.bulan} title={`${d.bulan}: ${d.laporan} laporan, ${d.surat} surat`}>
                      <div className="bar-pair">
                        <div className="bar" style={{ height: `${(d.laporan / maxTrend) * 100}%` }} />
                        <div className="bar soft" style={{ height: `${(d.surat / maxTrend) * 100}%` }} />
                      </div>
                      <span className="bar-label">{d.bulan}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card card-pad">
              <div className="chart-head">
                <div>
                  <h3>Komposisi jenis surat</h3>
                  <p>{totalDonut} berkas bulan ini</p>
                </div>
              </div>
              <div className="donut-wrap">
                <svg className="donut" viewBox="0 0 140 140" role="img" aria-label="Komposisi jenis surat">
                  <circle cx="70" cy="70" r="52" fill="none" stroke="#f4ecdd" strokeWidth="18" />
                  {donutData.map((d) => {
                    const len = (d.value / totalDonut) * 2 * Math.PI * 52;
                    const dash = `${len - 4} ${2 * Math.PI * 52 - len + 4}`;
                    const el = (
                      <circle
                        key={d.label}
                        cx="70"
                        cy="70"
                        r="52"
                        fill="none"
                        stroke={d.color}
                        strokeWidth="18"
                        strokeDasharray={dash}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                      />
                    );
                    offset += len;
                    return el;
                  })}
                  <text x="70" y="66" textAnchor="middle" fontSize="19" fontWeight="800" fill="#4d2a00">
                    {totalDonut}
                  </text>
                  <text x="70" y="82" textAnchor="middle" fontSize="8.5" fill="#8a6a45" letterSpacing="1">
                    BERKAS
                  </text>
                </svg>
                <div className="donut-legend">
                  {donutData.map((d) => (
                    <div key={d.label}>
                      <i className="swatch" style={{ background: d.color }} />
                      <span>{d.label}</span>
                      <b>{Math.round((d.value / totalDonut) * 100)}%</b>
                    </div>
                  ))}
                </div>
              </div>
              <div className="progress-list">
                <div className="progress-row">
                  <div className="pr-top"><span>Pengajuan terverifikasi</span><b>43 / 52</b></div>
                  <div className="track"><i style={{ width: "83%" }} /></div>
                </div>
                <div className="progress-row">
                  <div className="pr-top"><span>Laporan tuntas</span><b>{laporan.filter((l) => l.status === "Selesai").length} / {laporan.length}</b></div>
                  <div className="track">
                    <i style={{ width: `${(laporan.filter((l) => l.status === "Selesai").length / laporan.length) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="split" style={{ marginTop: 18 }}>
            <div className="card">
              <div className="card-pad" style={{ paddingBottom: 0 }}>
                <div className="section-head" style={{ marginBottom: 10 }}>
                  <div>
                    <h3 style={{ fontSize: 15 }}>Laporan warga terbaru</h3>
                    <p>Perlu tindak lanjut pengurus</p>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setTab("laporan")}>
                    Lihat semua <Icon name="arrow" size={14} />
                  </button>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Laporan</th><th>Pelapor</th><th>Status</th><th style={{ textAlign: "right" }}>Aksi</th></tr>
                  </thead>
                  <tbody>
                    {laporan.slice(0, 4).map((l) => (
                      <tr key={l.id}>
                        <td>
                          <span className="cell-strong">{l.judul}</span>
                          <span className="cell-sub">{l.id} · {l.kategori}</span>
                        </td>
                        <td>{l.pelapor}</td>
                        <td><Badge>{l.status}</Badge></td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => ubahStatusLaporan(l.id, l.status === "Selesai" ? "Diproses" : "Selesai")}
                            >
                              {l.status === "Selesai" ? "Buka lagi" : "Tuntaskan"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card card-pad">
              <div className="section-head" style={{ marginBottom: 10 }}>
                <div>
                  <h3 style={{ fontSize: 15 }}>Menunggu verifikasi</h3>
                  <p>{pengajuan.filter((p) => p.status === "Menunggu").length} pengajuan surat</p>
                </div>
              </div>
              {pengajuan.filter((p) => p.status === "Menunggu").length === 0 && (
                <p className="small-text muted">Semua pengajuan sudah diproses. 🎉</p>
              )}
              {pengajuan.filter((p) => p.status === "Menunggu").map((p) => (
                <div key={p.id} className="notif-item" style={{ padding: "10px 2px", alignItems: "center" }}>
                  <div>
                    <span className="tag">{p.id}</span>
                    <h4 style={{ fontSize: 12.8 }}>{p.jenis}</h4>
                    <p style={{ fontSize: 11.6 }}>{p.pemohon} · Blok {p.blok}</p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginLeft: "auto" }}
                    onClick={() => ubahStatusPengajuan(p.id, "Diproses")}
                  >
                    Verifikasi
                  </button>
                </div>
              ))}
              <Link to="/sistem" className="card-link" style={{ marginTop: 10 }}>
                Lihat alur verifikasi <Icon name="arrow" size={15} />
              </Link>
            </div>
          </div>
        </>
      )}

      {tab === "laporan" && (
        <div className="card">
          <div className="card-pad" style={{ paddingBottom: 0 }}>
            <div className="toolbar">
              <div>
                <h3 style={{ fontSize: 15 }}>Daftar laporan warga</h3>
                <p className="tiny muted">{laporanTampil.length} laporan ditampilkan</p>
              </div>
              <div className="btn-row">
                <label className="toolbar-input">
                  <Icon name="search" size={15} />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari laporan / pelapor…" />
                </label>
                <select
                  className="toolbar-input"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ fontSize: 12.8 }}
                >
                  {["Semua", "Menunggu", "Diproses", "Selesai"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Laporan</th><th>Kategori</th><th>Pelapor</th><th>Prioritas</th><th>Status</th><th style={{ textAlign: "right" }}>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {laporanTampil.map((l) => (
                  <tr key={l.id}>
                    <td className="cell-strong">{l.id}</td>
                    <td>{l.judul}<span className="cell-sub">{l.lokasi ? `${l.lokasi} · ` : ""}{l.tanggal} Okt 2026</span>{l.deskripsi && <span className="cell-sub">{l.deskripsi}</span>}</td>
                    <td>{l.kategori}</td>
                    <td>{l.pelapor}</td>
                    <td><Badge tone={l.prioritas === "Tinggi" ? "tone-danger" : l.prioritas === "Sedang" ? "tone-wait" : "tone-info"}>{l.prioritas}</Badge></td>
                    <td><Badge>{l.status}</Badge></td>
                    <td>
                      <div className="row-actions">
                        {l.status !== "Diproses" && (
                          <button className="btn btn-outline btn-sm" onClick={() => ubahStatusLaporan(l.id, "Diproses")}>Proses</button>
                        )}
                        {l.status !== "Selesai" && (
                          <button className="btn btn-primary btn-sm" onClick={() => ubahStatusLaporan(l.id, "Selesai")}>Selesai</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {laporanTampil.length === 0 && (
                  <tr><td colSpan="7" className="empty">Tidak ada laporan yang cocok.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "surat" && (
        <div className="card">
          <div className="card-pad" style={{ paddingBottom: 12 }}>
            <div className="chart-head">
              <div>
                <h3 style={{ fontSize: 15 }}>Verifikasi pengajuan surat</h3>
                <p>Setujui atau tolak berkas yang masuk dari warga</p>
              </div>
              <div className="legend">
                <span><i className="swatch brown" /> {pengajuan.length} total pengajuan bulan ini</span>
              </div>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Jenis surat</th><th>Pemohon</th><th>Tanggal</th><th>Status</th><th>Catatan koreksi</th><th style={{ textAlign: "right" }}>Tindakan</th></tr>
              </thead>
              <tbody>
                {pengajuan.map((p) => (
                  <tr key={p.id}>
                    <td className="cell-strong">{p.id}</td>
                    <td>{p.jenis}</td>
                    <td>{p.pemohon}<span className="cell-sub">Blok {p.blok}</span></td>
                    <td>{p.tanggal}{p.tanggal?.includes("Okt") ? "" : " Okt"}</td>
                    <td>
                      <Badge tone={p.status === "Selesai" || p.status === "Diterbitkan" ? "tone-done" : p.status === "Diproses" || p.status === "Disetujui" ? "tone-progress" : p.status === "Perlu perbaikan" || p.status === "Ditolak" ? "tone-danger" : "tone-wait"}>
                        {p.status === "Selesai" ? "Diterbitkan" : p.status}
                      </Badge>
                    </td>
                    <td>
                      {p.status === "Menunggu" || p.status === "Perlu perbaikan" ? (
                        <textarea className="rt-correction-note" value={correctionNotes[p.id] ?? p.correctionNote ?? ""} onChange={(event) => setCorrectionNotes((notes) => ({ ...notes, [p.id]: event.target.value }))} placeholder="Tulis dokumen/data yang perlu diperbaiki" aria-label={`Catatan koreksi ${p.id}`} />
                      ) : p.correctionNote ? <span className="cell-sub">{p.correctionNote}</span> : <span className="tiny muted">—</span>}
                    </td>
                    <td>
                      <div className="row-actions">
                        {(p.status === "Menunggu" || p.status === "Perlu perbaikan") && (
                          <>
                            <button className="btn btn-outline btn-sm" disabled={!(correctionNotes[p.id] ?? p.correctionNote ?? "").trim()} onClick={() => ubahStatusPengajuan(p.id, "Perlu perbaikan", correctionNotes[p.id] ?? p.correctionNote)}>Minta perbaikan</button>
                            <button className="btn btn-primary btn-sm" onClick={() => ubahStatusPengajuan(p.id, "Disetujui", correctionNotes[p.id] ?? p.correctionNote ?? "")}>Setujui</button>
                          </>
                        )}
                        {p.status === "Diproses" && (
                          <button className="btn btn-primary btn-sm" onClick={() => ubahStatusPengajuan(p.id, "Disetujui")}>Setujui</button>
                        )}
                        {p.status === "Disetujui" && <button className="btn btn-primary btn-sm" onClick={() => ubahStatusPengajuan(p.id, "Diterbitkan")}>Terbitkan surat</button>}
                        {(p.status === "Selesai" || p.status === "Diterbitkan") && <span className="tiny muted">Surat terbit</span>}
                        {p.status === "Ditolak" && <span className="tiny muted">Ditolak</span>}
                      </div>
                    </td>
                  </tr>
                ))}
                {pengajuan.length === 0 && <tr><td colSpan="7" className="empty">Belum ada pengajuan surat.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="card-pad" style={{ paddingTop: 14 }}>
            <div className="notice">
              <Icon name="file" size={16} />
              <span>
                Jenis surat aktif: {jenisSurat.map((s) => s.kode).join(" · ")}. Perubahan master jenis
                surat dilakukan oleh admin sistem.
              </span>
            </div>
          </div>
        </div>
      )}

      {tab === "warga" && (
        <>
        <div className="card">
          <div className="card-pad" style={{ paddingBottom: 0 }}>
            <div className="toolbar">
              <div>
                <h3 style={{ fontSize: 15 }}>Basis data warga</h3>
                <p className="tiny muted">NIK ditampilkan tersamarkan sesuai kebijakan privasi</p>
              </div>
              <label className="toolbar-input">
                <Icon name="search" size={15} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama / NIK / blok…" />
              </label>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nama</th><th>NIK</th><th>Blok</th><th>No. KK</th><th>Anggota</th><th>Status</th><th>Kontak</th><th style={{ textAlign: "right" }}>Aksi</th></tr>
              </thead>
              <tbody>
                {residents
                  .filter(
                    (w) =>
                      w.nama.toLowerCase().includes(q.toLowerCase()) ||
                      w.blok.toLowerCase().includes(q.toLowerCase()) ||
                      w.nik.toLowerCase().includes(q.toLowerCase())
                  )
                  .map((w) => (
                    <tr key={w.nik}>
                      <td className="cell-strong">{w.nama}</td>
                      <td>{maskedNik(w.nik)}</td>
                      <td>{w.blok}</td>
                      <td>{w.kk}</td>
                      <td>{w.anggota} orang</td>
                      <td><Badge>{w.status}</Badge></td>
                      <td>{w.kontak}</td>
                      <td><div className="row-actions"><button className="btn btn-outline btn-sm" onClick={() => ubahStatusWarga(w.nik, w.status === "Terverifikasi" || w.status === "Tetap" ? "Pindah keluar" : "Terverifikasi")}>{w.status === "Terverifikasi" || w.status === "Tetap" ? "Tandai pindah" : "Verifikasi"}</button></div></td>
                    </tr>
                  ))}
                {!residents.some((w) => w.nama.toLowerCase().includes(q.toLowerCase()) || w.blok.toLowerCase().includes(q.toLowerCase()) || w.nik.toLowerCase().includes(q.toLowerCase())) && <tr><td colSpan="8" className="empty">Warga tidak ditemukan.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <section className="section">
          <div className="section-head">
            <div><span className="eyebrow">Riwayat kependudukan</span><h2>Mutasi warga masuk &amp; keluar</h2><p>Catat perpindahan domisili dan pantau verifikasinya.</p></div>
          </div>
          <div className="split" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
          <div className="card">
            <div className="card-pad" style={{ paddingBottom: 0 }}>
              <div className="section-head" style={{ marginBottom: 8 }}>
                <div>
                  <h3 style={{ fontSize: 15 }}>Riwayat pindah masuk / keluar</h3>
                  <p className="tiny muted">{mutasi.length} catatan mutasi</p>
                </div>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Nama</th><th>Jenis</th><th>Keterangan</th><th>Tanggal</th><th>Status</th><th style={{ textAlign: "right" }}>Aksi</th></tr>
                </thead>
                <tbody>
                  {mutasi.map((m, i) => (
                    <tr key={m.nama + i}>
                      <td className="cell-strong">{m.nama}</td>
                      <td>
                        <Badge tone={m.jenis === "Pindah masuk" ? "tone-info" : "tone-wait"}>{m.jenis}</Badge>
                      </td>
                      <td>{m.asal}</td>
                      <td>{m.tanggal}</td>
                      <td><Badge>{m.status}</Badge></td>
                      <td><div className="row-actions">{m.status === "Menunggu" ? <button className="btn btn-outline btn-sm" onClick={() => setMutationList(mutasi.map((item, index) => index === i ? { ...item, status: "Terverifikasi" } : item))}>Verifikasi</button> : <span className="tiny muted">Tercatat</span>}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card card-pad">
            <span className="eyebrow">Catat mutasi</span>
            <h3 style={{ fontSize: 15 }}>Tambah data pindah</h3>
            <form
              style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}
              onSubmit={(e) => {
                e.preventDefault();
                if (formMutasi.nama.trim().length < 3 || formMutasi.asal.trim().length < 3) return;
                setMutationList([
                  {
                    nama: formMutasi.nama,
                    jenis: formMutasi.jenis,
                    asal: formMutasi.asal,
                    tanggal: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date()),
                    status: "Menunggu",
                  },
                  ...mutasi,
                ]);
                setFormMutasi({ nama: "", jenis: "Pindah masuk", asal: "" });
              }}
            >
              <div className="field">
                <label htmlFor="mnama">Nama warga / keluarga</label>
                <input
                  id="mnama"
                  value={formMutasi.nama}
                  onChange={(e) => setFormMutasi((f) => ({ ...f, nama: e.target.value }))}
                  placeholder="Contoh: Keluarga Santoso"
                />
              </div>
              <div className="field">
                <label htmlFor="mjenis">Jenis mutasi</label>
                <select
                  id="mjenis"
                  value={formMutasi.jenis}
                  onChange={(e) => setFormMutasi((f) => ({ ...f, jenis: e.target.value }))}
                >
                  <option>Pindah masuk</option>
                  <option>Pindah keluar</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="masal">Alamat asal / tujuan</label>
                <input
                  id="masal"
                  value={formMutasi.asal}
                  onChange={(e) => setFormMutasi((f) => ({ ...f, asal: e.target.value }))}
                  placeholder="RT / kelurahan asal"
                />
              </div>
              <button className="btn btn-primary btn-block" type="submit">
                <Icon name="plus" size={16} /> Simpan catatan
              </button>
              <p className="tiny muted">
                Catatan baru berstatus “Menunggu” hingga diverifikasi ketua RT.
              </p>
            </form>
          </div>
        </div>
        </section>
        </>
      )}
    </>
  );
}
