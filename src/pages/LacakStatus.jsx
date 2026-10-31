import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon, Badge } from "../components/ui.jsx";
import { statusLaporanSaya } from "../data.js";

const contoh = Object.keys(statusLaporanSaya);

export default function LacakStatus() {
  const [params] = useSearchParams();
  const [nomor, setNomor] = useState(params.get("nomor") || "");
  const [hasil, setHasil] = useState(null);
  const [dicari, setDicari] = useState(false);

  useEffect(() => {
    const awal = params.get("nomor");
    if (awal && statusLaporanSaya[awal]) {
      setNomor(awal);
      setHasil({ nomor: awal, ...statusLaporanSaya[awal] });
      setDicari(true);
    }
  }, [params]);

  const cari = (e) => {
    e.preventDefault();
    const key = nomor.trim().toUpperCase();
    setDicari(true);
    setHasil(statusLaporanSaya[key] ? { nomor: key, ...statusLaporanSaya[key] } : null);
  };

  return (
    <div className="split" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
      <div>
        <div className="card card-pad">
          <span className="eyebrow">Pelacakan</span>
          <h2 style={{ fontSize: 18 }}>Cek status pengajuan atau laporan</h2>
          <p className="muted small-text" style={{ margin: "4px 0 16px" }}>
            Masukkan nomor tiket yang Anda terima saat mengirim formulir.
          </p>

          <form onSubmit={cari} className="btn-row" style={{ alignItems: "stretch" }}>
            <label className="toolbar-input" style={{ flex: 1 }}>
              <Icon name="search" size={16} />
              <input
                value={nomor}
                onChange={(e) => setNomor(e.target.value)}
                placeholder="Contoh: SUR-2085 atau LPR-1040"
                style={{ width: "100%" }}
                aria-label="Nomor tiket"
              />
            </label>
            <button className="btn btn-primary" type="submit">Lacak</button>
          </form>

          <div className="toc" style={{ marginTop: 14 }}>
            <span className="tiny muted" style={{ alignSelf: "center" }}>Coba contoh:</span>
            {contoh.map((k) => (
              <button
                key={k}
                className="badge tone-info"
                style={{ cursor: "pointer", border: "1px solid rgba(242,169,0,.4)" }}
                onClick={() => {
                  setNomor(k);
                  setHasil({ nomor: k, ...statusLaporanSaya[k] });
                  setDicari(true);
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {dicari && !hasil && (
          <div className="card card-pad" style={{ marginTop: 16, textAlign: "center" }}>
            <div className="layanan-ico orange" style={{ margin: "0 auto 10px" }}>
              <Icon name="alert" size={20} />
            </div>
            <h3 style={{ fontSize: 15 }}>Nomor tidak ditemukan</h3>
            <p className="small-text muted" style={{ marginTop: 4 }}>
              Periksa kembali penulisan nomor tiket. Jika masih bermasalah, hubungi sekretariat RT.
            </p>
          </div>
        )}

        {hasil && (
          <div className="card card-pad" style={{ marginTop: 16 }}>
            <div className="detail-head" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <span className="tiny muted">Nomor tiket</span>
                <h3 style={{ fontSize: 17, letterSpacing: "0.04em" }}>{hasil.nomor}</h3>
                <p className="small-text muted" style={{ marginTop: 2 }}>{hasil.jenis}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge>{hasil.langkah.filter((l) => l.selesai).length === hasil.langkah.length ? "Selesai" : "Diproses"}</Badge>
                <p className="tiny muted" style={{ marginTop: 6 }}>Diajukan {hasil.diajukan}</p>
              </div>
            </div>

            <div className="notice" style={{ marginTop: 16 }}>
              <Icon name="user" size={16} />
              <span>Pemohon: <strong>{hasil.pemohon}</strong></span>
            </div>

            <div className="timeline" style={{ marginTop: 22 }}>
              {hasil.langkah.map((l, i) => {
                const terakhirSelesai = l.selesai && (i === hasil.langkah.length - 1 || !hasil.langkah[i + 1].selesai);
                return (
                  <div
                    key={l.judul}
                    className={`timeline-item ${l.selesai ? "done" : ""} ${terakhirSelesai ? "current" : ""}`}
                  >
                    <div className="tl-dot">
                      {l.selesai ? <Icon name="check" size={13} strokeWidth={2.6} /> : <Icon name="clock" size={13} />}
                    </div>
                    <div className="tl-body">
                      <strong>{l.judul}</strong>
                      <span>{l.waktu}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <aside>
        <div className="card card-pad">
          <span className="eyebrow">Keterangan status</span>
          <div className="info-row">
            <Icon name="inbox" size={16} />
            <div><strong>Menunggu</strong><span>Belum diperiksa pengurus</span></div>
          </div>
          <div className="info-row">
            <Icon name="clock" size={16} />
            <div><strong>Diproses</strong><span>Sedang diverifikasi / dikerjakan</span></div>
          </div>
          <div className="info-row">
            <Icon name="check" size={16} />
            <div><strong>Selesai</strong><span>Dokumen siap / masalah tertangani</span></div>
          </div>
        </div>

        <div className="card card-pad" style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 14.5 }}>Belum menerima nomor?</h3>
          <p className="small-text muted" style={{ marginTop: 4 }}>
            Nomor tiket dikirim ke WhatsApp Anda setelah formulir berhasil dikirim. Jika tidak
            masuk, hubungi pengurus dengan menyebutkan nama dan tanggal pengajuan.
          </p>
          <div className="btn-row" style={{ marginTop: 12 }}>
            <span className="badge tone-wait">0812-3456-7890</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
