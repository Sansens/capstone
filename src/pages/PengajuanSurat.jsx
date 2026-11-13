import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Icon, Badge } from "../components/ui.jsx";
import { rtInfo } from "../data.js";
import { subscribeToManagedLetterTypes } from "../adminData.js";
import { updateResidentServiceProfile } from "../accountData.js";
import { createResidentLetterRequest } from "../firestoreData.js";

const steps = ["Jenis surat", "Data pemohon", "Lampiran", "Periksa & kirim"];

const emptyForm = {
  jenis: "",
  nama: "",
  nik: "",
  telepon: "",
  alamat: "",
  blok: "",
  keperluan: "",
  setuju: false,
};

export default function PengajuanSurat({ session }) {
  const [params] = useSearchParams();
  const [availableLetterTypes, setAvailableLetterTypes] = useState([]);
  const [catalogError, setCatalogError] = useState("");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => {
    const accountProfile = session?.profile || {};
    return {
      ...emptyForm,
      jenis: params.get("jenis") || "",
      nik: /^\d{16}$/.test(session?.identity || "") ? session.identity : "",
      nama: accountProfile.name || "",
      telepon: accountProfile.phone || "",
      alamat: accountProfile.address || "",
      blok: accountProfile.block || "",
    };
  });
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [tiket, setTiket] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    try {
      return subscribeToManagedLetterTypes((types) => {
        setAvailableLetterTypes(types);
      }, (error) => setCatalogError(`Gagal memuat jenis surat: ${error.message}`));
    } catch (error) {
      setCatalogError(`Gagal menghubungkan jenis surat: ${error.message}`);
      return undefined;
    }
  }, []);

  const terpilih = useMemo(
    () => availableLetterTypes.find((s) => s.id === form.jenis),
    [availableLetterTypes, form.jenis]
  );

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validasi = (index) => {
    const e = {};
    if (index === 0 && !form.jenis) e.jenis = "Pilih salah satu jenis surat.";
    if (index === 1) {
      if (form.nama.trim().length < 3) e.nama = "Nama lengkap minimal 3 karakter.";
      if (!/^\d{16}$/.test(form.nik)) e.nik = "NIK harus 16 angka.";
      if (!/^[0-9+\-\s]{9,16}$/.test(form.telepon)) e.telepon = "Nomor telepon tidak valid.";
      if (form.alamat.trim().length < 5) e.alamat = "Alamat wajib diisi (min. 5 karakter).";
      if (!form.blok.trim()) e.blok = "Blok/rumah wajib diisi, contoh B-12.";
    }
    if (index === 3) {
      if (form.keperluan.trim().length < 10) e.keperluan = "Tuliskan keperluan minimal 10 karakter.";
      if (!form.setuju) e.setuju = "Centang pernyataan kebenaran data untuk melanjutkan.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const lanjut = () => {
    if (!validasi(step)) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const kembali = () => setStep((s) => Math.max(s - 1, 0));

  const tambahFile = (fileList) => {
    const baru = Array.from(fileList || []).map((f) => ({
      nama: f.name,
      ukuran: f.size,
    }));
    if (baru.length) setFiles((f) => [...f, ...baru].slice(0, 5));
  };

  const kirim = async () => {
    if (!validasi(3)) return;
    setSubmitting(true);
    setSubmissionError("");
    let submitted;
    try {
      await updateResidentServiceProfile(session, {
        name: form.nama,
        phone: form.telepon,
        block: form.blok,
        address: form.alamat,
      });
      submitted = await createResidentLetterRequest(session, {
        ...form,
        jenis: terpilih?.nama || "Pengajuan surat",
        jumlahLampiran: files.length,
      });
    } catch (error) {
      setSubmissionError(error.message || "Pengajuan surat gagal dikirim.");
      setSubmitting(false);
      return;
    }

    const nomor = submitted.ticketId;
    setTiket({ nomor, ...form, jumlahLampiran: files.length });
    setSubmitting(false);
  };

  if (tiket) {
    return (
      <div className="card success-card" style={{ maxWidth: 660, margin: "10px auto" }}>
        <div className="success-badge"><Icon name="check" size={30} strokeWidth={2.2} /></div>
        <h2>Pengajuan berhasil dikirim</h2>
        <p>
          Pengajuan <strong>{tiket.jenis && availableLetterTypes.find((s) => s.id === tiket.jenis)?.nama}</strong>{" "}
          atas nama <strong>{tiket.nama}</strong> sudah masuk ke meja pengurus RT.
          Verifikasi maksimal 2 hari kerja.
        </p>
        <div className="ticket">
          <span>Nomor pengajuan</span>
          <strong>{tiket.nomor}</strong>
        </div>
        <p className="tiny muted">
          Simpan nomor ini. Status pengajuan terbaru akan muncul di dashboard warga.
        </p>
        <div className="btn-row" style={{ justifyContent: "center", marginTop: 20 }}>
          <Link to="/warga" className="btn btn-primary">
            <Icon name="chart" size={16} /> Lihat status di dashboard
          </Link>
          <button
            className="btn btn-outline"
            onClick={() => {
              setTiket(null);
              setForm({ ...emptyForm, jenis: "" });
              setFiles([]);
              setStep(0);
            }}
          >
            <Icon name="plus" size={16} /> Ajukan surat lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="split" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
      <div>
        {(submissionError || catalogError) && <p className="login-error" role="alert">{submissionError || catalogError}</p>}
        <div className="wizard">
          {steps.map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 && <div className="wz-line" />}
              <div
                className={`wz-item ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
              >
                <div className="wz-dot">
                  {i < step ? <Icon name="check" size={14} strokeWidth={2.4} /> : i + 1}
                </div>
                <span>{label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="card card-pad">
          {step === 0 && (
            <>
              <span className="eyebrow">Langkah 1</span>
              <h2 style={{ fontSize: 18 }}>Pilih jenis surat</h2>
              <p className="muted small-text" style={{ margin: "4px 0 16px" }}>
                Pastikan jenis surat sesuai kebutuhan Anda. Setiap jenis memiliki persyaratan berbeda.
              </p>
              <div className="choice-grid">
                {availableLetterTypes.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className={`choice ${form.jenis === s.id ? "selected" : ""}`}
                    onClick={() => set("jenis", s.id)}
                  >
                    <div className="choice-top">
                      <div className="choice-radio" />
                      <strong>{s.nama}</strong>
                      <span className="kode">{s.kode}</span>
                    </div>
                    <p>{s.ringkas}</p>
                    <div className="choice-meta">
                      <span><Icon name="clock" size={12} /> {s.durasi}</span>
                      <span><Icon name="shield" size={12} /> {s.biaya}</span>
                    </div>
                  </button>
                ))}
              </div>
              {!availableLetterTypes.length && <p className="muted small-text">Katalog jenis surat belum tersedia. Silakan hubungi admin sistem.</p>}
              {errors.jenis && <p className="err" style={{ marginTop: 8 }}>{errors.jenis}</p>}
            </>
          )}

          {step === 1 && (
            <>
              <span className="eyebrow">Langkah 2</span>
              <h2 style={{ fontSize: 18 }}>Data pemohon</h2>
              <p className="muted small-text" style={{ margin: "4px 0 16px" }}>
                Data akan dicocokkan dengan basis data warga RT 004.
              </p>
              <div className="form-grid">
                <div className={`field span-2 ${errors.nama ? "invalid" : ""}`}>
                  <label htmlFor="nama">Nama lengkap sesuai KTP <span className="req">*</span></label>
                  <input
                    id="nama"
                    value={form.nama}
                    onChange={(e) => set("nama", e.target.value)}
                    placeholder="Contoh: Rina Kartika"
                  />
                  {errors.nama && <span className="err">{errors.nama}</span>}
                </div>
                <div className={`field ${errors.nik ? "invalid" : ""}`}>
                  <label htmlFor="nik">NIK <span className="req">*</span></label>
                  <input
                    id="nik"
                    inputMode="numeric"
                    maxLength={16}
                    value={form.nik}
                    readOnly
                    aria-describedby="nik-hint"
                    placeholder="16 angka"
                  />
                  {errors.nik ? (
                    <span className="err">{errors.nik}</span>
                  ) : (
                    <span className="hint" id="nik-hint">NIK mengikuti identitas akun terverifikasi.</span>
                  )}
                </div>
                <div className={`field ${errors.telepon ? "invalid" : ""}`}>
                  <label htmlFor="telepon">Nomor WhatsApp <span className="req">*</span></label>
                  <input
                    id="telepon"
                    inputMode="tel"
                    value={form.telepon}
                    onChange={(e) => set("telepon", e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                  />
                  {errors.telepon ? (
                    <span className="err">{errors.telepon}</span>
                  ) : (
                    <span className="hint">Digunakan untuk notifikasi status</span>
                  )}
                </div>
                <div className={`field ${errors.blok ? "invalid" : ""}`}>
                  <label htmlFor="blok">Blok / nomor rumah <span className="req">*</span></label>
                  <input
                    id="blok"
                    value={form.blok}
                    onChange={(e) => set("blok", e.target.value)}
                    placeholder="Contoh: B-12"
                  />
                  {errors.blok && <span className="err">{errors.blok}</span>}
                </div>
                <div className={`field ${errors.alamat ? "invalid" : ""}`}>
                  <label htmlFor="alamat">Alamat lengkap <span className="req">*</span></label>
                  <textarea
                    id="alamat"
                    value={form.alamat}
                    onChange={(e) => set("alamat", e.target.value)}
                    placeholder="Jalan, blok, nomor rumah, RT/RW"
                    style={{ minHeight: 84 }}
                  />
                  {errors.alamat && <span className="err">{errors.alamat}</span>}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <span className="eyebrow">Langkah 3</span>
              <h2 style={{ fontSize: 18 }}>Unggah lampiran</h2>
              <p className="muted small-text" style={{ margin: "4px 0 16px" }}>
                Format PDF/JPG/PNG, maksimal 5 berkas, 2 MB per berkas.
              </p>

              <label
                className="dropzone"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  tambahFile(e.dataTransfer.files);
                }}
                style={dragging ? { borderColor: "var(--orange)", background: "#fff8e7" } : undefined}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  hidden
                  onChange={(e) => {
                    tambahFile(e.target.files);
                    e.target.value = "";
                  }}
                />
                <div className="layanan-ico"><Icon name="upload" size={20} /></div>
                <strong>Klik untuk memilih berkas atau tarik ke sini</strong>
                <span>Fotokopi KTP, Kartu Keluarga, dan dokumen pendukung</span>
              </label>

              {files.map((f, i) => (
                <div className="file-chip" key={f.nama + i}>
                  <Icon name="file" size={16} />
                  <span>{f.nama}</span>
                  <span className="tiny muted">{(f.ukuran / 1024).toFixed(0)} KB</span>
                  <button
                    type="button"
                    aria-label={`Hapus ${f.nama}`}
                    onClick={() => setFiles((list) => list.filter((_, idx) => idx !== i))}
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>
              ))}

              <div className="field" style={{ marginTop: 18 }}>
                <label htmlFor="keperluan">Keperluan surat</label>
                <textarea
                  id="keperluan"
                  value={form.keperluan}
                  onChange={(e) => set("keperluan", e.target.value)}
                  placeholder="Contoh: untuk pendaftaran sekolah anak di SMPN 3"
                />
              </div>

              <div className="notice" style={{ marginTop: 14 }}>
                <Icon name="alert" size={16} />
                <span>
                  Lampiran boleh menyusul di sekretariat, namun pengajuan akan diverifikasi
                  setelah dokumen lengkap.
                </span>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <span className="eyebrow">Langkah 4</span>
              <h2 style={{ fontSize: 18 }}>Periksa kembali</h2>
              <p className="muted small-text" style={{ margin: "4px 0 16px" }}>
                Pastikan seluruh data sudah benar sebelum dikirim ke pengurus RT.
              </p>

              <div className="review-box">
                <div className="review-row"><span>Jenis surat</span><span>{terpilih?.nama}</span></div>
                <div className="review-row"><span>Kode surat</span><span>{terpilih?.kode}</span></div>
                <div className="review-row"><span>Nama pemohon</span><span>{form.nama}</span></div>
                <div className="review-row"><span>NIK</span><span>{form.nik}</span></div>
                <div className="review-row"><span>WhatsApp</span><span>{form.telepon}</span></div>
                <div className="review-row"><span>Blok / rumah</span><span>{form.blok}</span></div>
                <div className="review-row"><span>Alamat</span><span>{form.alamat}</span></div>
                <div className="review-row">
                  <span>Keperluan</span><span>{form.keperluan || "—"}</span>
                </div>
                <div className="review-row">
                  <span>Lampiran</span>
                  <span>{files.length ? `${files.length} berkas` : "Belum ada berkas"}</span>
                </div>
                <div className="review-row"><span>Estimasi selesai</span><span>{terpilih?.durasi}</span></div>
              </div>

              <button
                type="button"
                className="choice"
                onClick={() => set("setuju", !form.setuju)}
                style={{
                  marginTop: 16,
                  width: "100%",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  borderColor: form.setuju ? "var(--orange)" : undefined,
                  background: form.setuju ? "#fffaf0" : undefined,
                }}
              >
                <div className="choice-radio" style={{ marginTop: 2 }}>
                  {form.setuju && <Icon name="check" size={12} strokeWidth={3} />}
                </div>
                <span className="small-text" style={{ textAlign: "left" }}>
                  Saya menyatakan seluruh data dan dokumen yang saya lampirkan adalah benar dan
                  dapat dipertanggungjawabkan.
                </span>
              </button>
              {errors.setuju && <p className="err" style={{ marginTop: 6 }}>{errors.setuju}</p>}
              {errors.keperluan && (
                <p className="err" style={{ marginTop: 6 }}>{errors.keperluan}</p>
              )}
            </>
          )}

          <div className="btn-row" style={{ marginTop: 22, justifyContent: "space-between" }}>
            <button
              className="btn btn-outline"
              onClick={kembali}
              disabled={step === 0}
              type="button"
            >
              Kembali
            </button>
            {step < 3 ? (
              <button className="btn btn-primary" onClick={lanjut} type="button">
                Lanjut <Icon name="arrow" size={16} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={kirim} type="button" disabled={submitting}>
                <Icon name="check" size={16} /> {submitting ? "Mengirim…" : "Kirim pengajuan"}
              </button>
            )}
          </div>
        </div>
      </div>

      <aside>
        <div className="card card-pad">
          <span className="eyebrow">Ringkasan</span>
          <h3 style={{ fontSize: 15 }}>{terpilih ? terpilih.nama : "Belum memilih surat"}</h3>
          {terpilih ? (
            <>
              <div className="layanan-meta" style={{ marginTop: 8 }}>
                <span><Icon name="clock" size={13} /> {terpilih.durasi}</span>
                <span><Icon name="shield" size={13} /> {terpilih.biaya}</span>
              </div>
              <p className="tiny muted" style={{ margin: "14px 0 8px" }}>Persyaratan:</p>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.4, color: "var(--muted)" }}>
                {terpilih.syarat.map((s) => (
                  <li key={s} style={{ marginBottom: 4 }}>{s}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="small-text muted" style={{ marginTop: 6 }}>
              Pilih jenis surat pada langkah pertama untuk melihat persyaratan.
            </p>
          )}
          <hr style={{ border: 0, borderTop: "1px dashed var(--line)", margin: "16px 0" }} />
          <div className="info-row" style={{ padding: 0 }}>
            <Icon name="pin" size={16} />
            <div>
              <strong>Ambil dokumen</strong>
              <span>{rtInfo.sekretariat}</span>
            </div>
          </div>
          <div className="info-row" style={{ padding: "8px 0 0" }}>
            <Icon name="phone" size={16} />
            <div>
              <strong>{rtInfo.telepon}</strong>
              <span>Bantuan pengajuan</span>
            </div>
          </div>
        </div>

        <div className="card card-pad" style={{ marginTop: 16 }}>
          <div className="layanan-ico amber" style={{ marginBottom: 10 }}>
            <Icon name="shield" size={20} />
          </div>
          <h3 style={{ fontSize: 14.5 }}>Data Anda aman</h3>
          <p className="small-text muted" style={{ marginTop: 4 }}>
            NIK hanya diakses pengurus RT yang berwenang dan tidak ditampilkan penuh di halaman
            publik.
          </p>
          <div style={{ marginTop: 10 }}><Badge>Terenkripsi</Badge></div>
        </div>
      </aside>
    </div>
  );
}
