import React, { useState } from "react";
import { Icon, Badge } from "../components/ui.jsx";
import { readManagedLetterTypes, saveManagedLetterTypes } from "../adminData.js";

const emptyForm = { kode: "", nama: "", ringkas: "", durasi: "1 hari kerja", biaya: "Gratis", ikon: "file", requirements: "" };

function formFromType(type) {
  return { ...type, requirements: (type.syarat || []).join("\n") };
}

export default function AdminLetterTypes() {
  const [types, setTypes] = useState(readManagedLetterTypes);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const commit = (nextTypes, feedback) => {
    setTypes(saveManagedLetterTypes(nextTypes));
    setMessage(feedback);
  };

  const saveType = (event) => {
    event.preventDefault();
    const requirements = form.requirements.split("\n").map((item) => item.trim()).filter(Boolean);
    if (!form.kode.trim() || form.nama.trim().length < 3 || !requirements.length) {
      setMessage("Isi kode, nama surat, dan minimal satu persyaratan.");
      return;
    }
    const code = form.kode.trim().toUpperCase();
    const duplicate = types.some((type) => type.kode.toUpperCase() === code && type.id !== editingId);
    if (duplicate) {
      setMessage("Kode surat sudah digunakan. Pilih kode yang berbeda.");
      return;
    }
    const nextType = {
      id: editingId || `surat-${Date.now()}`,
      kode: code,
      nama: form.nama.trim(),
      ringkas: form.ringkas.trim() || `Layanan ${form.nama.trim()} untuk kebutuhan administrasi warga.`,
      durasi: form.durasi.trim() || "1 hari kerja",
      biaya: form.biaya.trim() || "Gratis",
      ikon: form.ikon || "file",
      syarat: requirements,
    };
    const nextTypes = editingId ? types.map((type) => type.id === editingId ? nextType : type) : [...types, nextType];
    commit(nextTypes, editingId ? "Jenis surat berhasil diperbarui." : "Jenis surat berhasil ditambahkan.");
    setForm(emptyForm);
    setEditingId("");
  };

  const editType = (type) => {
    setEditingId(type.id);
    setForm(formFromType(type));
    setMessage("");
  };

  const removeType = (type) => {
    if (!window.confirm(`Hapus jenis surat ${type.nama}?`)) return;
    commit(types.filter((item) => item.id !== type.id), "Jenis surat dihapus.");
    if (editingId === type.id) {
      setEditingId("");
      setForm(emptyForm);
    }
  };

  return (
    <>
      <section className="resident-page-intro admin-page-intro">
        <span className="eyebrow">Konfigurasi layanan</span>
        <h2>Pengaturan jenis surat</h2>
        <p>Kelola daftar surat administrasi, durasi layanan, dan dokumen yang perlu disiapkan warga.</p>
      </section>

      <div className="admin-letter-layout">
        <section className="admin-letter-list">
          <div className="admin-letter-list-head"><div><h3>Jenis surat tersedia</h3><p>{types.length} jenis layanan · perubahan akan digunakan pada formulir pengajuan warga</p></div><Badge tone="tone-info">Katalog aktif</Badge></div>
          {types.length ? <div className="admin-letter-cards">
            {types.map((type) => (
              <article className="card admin-letter-card" key={type.id}>
                <div className="admin-letter-card-top"><span className="kode">{type.kode}</span><div className="btn-row"><button className="btn btn-outline btn-sm" type="button" onClick={() => editType(type)}>Ubah</button><button className="btn btn-ghost btn-sm admin-delete-button" type="button" onClick={() => removeType(type)} aria-label={`Hapus ${type.nama}`}><Icon name="close" size={15} /></button></div></div>
                <h3>{type.nama}</h3>
                <p>{type.ringkas}</p>
                <div className="admin-letter-meta"><span><Icon name="clock" size={13} />{type.durasi}</span><span><Icon name="shield" size={13} />{type.biaya}</span></div>
                <div className="admin-requirements"><strong>Persyaratan</strong><ul>{type.syarat.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></div>
              </article>
            ))}
          </div> : <div className="card empty">Belum ada jenis surat. Tambahkan jenis surat pada formulir di samping.</div>}
        </section>

        <aside className="card card-pad admin-letter-form-card">
          <span className="eyebrow">{editingId ? "Perbarui katalog" : "Katalog surat"}</span>
          <h3 style={{ fontSize: 16 }}>{editingId ? "Ubah jenis surat" : "Tambah jenis surat"}</h3>
          <p className="small-text muted" style={{ marginTop: 5 }}>Nama, keterangan, dan persyaratan ini akan ditampilkan kepada warga saat mengajukan surat.</p>
          <form className="admin-account-form" onSubmit={saveType}>
            <div className="form-grid">
              <div className="field"><label htmlFor="letter-code">Kode surat</label><input id="letter-code" value={form.kode} onChange={(event) => setForm((current) => ({ ...current, kode: event.target.value }))} placeholder="Contoh: SKD" /></div>
              <div className="field"><label htmlFor="letter-duration">Estimasi</label><input id="letter-duration" value={form.durasi} onChange={(event) => setForm((current) => ({ ...current, durasi: event.target.value }))} placeholder="1 hari kerja" /></div>
              <div className="field span-2"><label htmlFor="letter-name">Nama jenis surat</label><input id="letter-name" value={form.nama} onChange={(event) => setForm((current) => ({ ...current, nama: event.target.value }))} placeholder="Surat Keterangan ..." /></div>
              <div className="field span-2"><label htmlFor="letter-description">Keterangan untuk warga</label><textarea id="letter-description" value={form.ringkas} onChange={(event) => setForm((current) => ({ ...current, ringkas: event.target.value }))} placeholder="Jelaskan kegunaan surat ini" /></div>
              <div className="field span-2"><label htmlFor="letter-requirements">Persyaratan <span className="req">*</span></label><textarea id="letter-requirements" value={form.requirements} onChange={(event) => setForm((current) => ({ ...current, requirements: event.target.value }))} placeholder={"Satu persyaratan per baris\nFotokopi KTP\nFotokopi KK"} /><span className="hint">Tulis satu dokumen persyaratan di setiap baris.</span></div>
              <div className="field span-2"><label htmlFor="letter-fee">Biaya</label><input id="letter-fee" value={form.biaya} onChange={(event) => setForm((current) => ({ ...current, biaya: event.target.value }))} placeholder="Gratis" /></div>
            </div>
            {message && <p className="admin-form-message" role="status">{message}</p>}
            <button type="submit" className="btn btn-primary btn-block"><Icon name={editingId ? "check" : "plus"} size={16} />{editingId ? "Simpan perubahan" : "Tambah jenis surat"}</button>
            {editingId && <button type="button" className="btn btn-outline btn-block" onClick={() => { setEditingId(""); setForm(emptyForm); setMessage(""); }}>Batal mengubah</button>}
          </form>
          <p className="admin-demo-callout"><Icon name="alert" size={16} /> Katalog disimpan di browser ini untuk demonstrasi. Pengajuan yang sudah dibuat tidak berubah.</p>
        </aside>
      </div>
    </>
  );
}
