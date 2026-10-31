import React, { useEffect, useMemo, useState } from "react";
import { Icon, Badge } from "../components/ui.jsx";
import { readResidentData, writeResidentData } from "../residentData.js";

function maskIdentity(value = "") {
  if (value.length < 6) return value || "Belum diisi";
  return `${value.slice(0, 3)}${"•".repeat(Math.min(value.length - 5, 10))}${value.slice(-2)}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export default function ResidentProfile({ session }) {
  const data = useMemo(() => readResidentData(session?.identity), [session?.identity]);
  const [form, setForm] = useState(data.profile);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [history, setHistory] = useState(data.residenceHistory);

  useEffect(() => {
    setForm(data.profile);
    setHistory(data.residenceHistory);
  }, [data]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setSaved(false);
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 3) nextErrors.name = "Nama minimal 3 karakter.";
    if (form.phone && !/^[0-9+\-\s]{9,16}$/.test(form.phone)) nextErrors.phone = "Nomor ponsel tidak valid.";
    if (!form.block.trim()) nextErrors.block = "Blok / nomor rumah wajib diisi.";
    if (form.address.trim().length < 5) nextErrors.address = "Alamat lengkap wajib diisi.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const currentData = readResidentData(session?.identity);
    const oldAddress = currentData.profile.address;
    const newAddress = form.address.trim();
    const nextHistory = newAddress && oldAddress !== newAddress
      ? [{
          id: `DOM-${Date.now()}`,
          date: new Date().toISOString(),
          title: oldAddress ? "Perubahan alamat domisili" : "Domisili awal dicatat",
          detail: oldAddress ? `${oldAddress} → ${newAddress}` : newAddress,
        }, ...currentData.residenceHistory]
      : currentData.residenceHistory;
    const nextData = writeResidentData(session?.identity, {
      profile: { ...form, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), block: form.block.trim(), address: form.address.trim() },
      residenceHistory: nextHistory,
    });
    setForm(nextData.profile);
    setHistory(nextData.residenceHistory);
    setSaved(true);
  };

  return (
    <>
      <section className="resident-page-intro">
        <span className="eyebrow">Akun warga</span>
        <h2>Profil &amp; data domisili</h2>
        <p>Periksa informasi tempat tinggal dan pastikan data kontak Anda selalu terbaru.</p>
      </section>

      <div className="resident-profile-layout">
        <form className="card card-pad resident-profile-form" onSubmit={submit} noValidate>
          <div className="resident-card-head"><div><h3>Informasi pribadi</h3><p>Perbarui nama dan kontak yang dapat dihubungi pengurus.</p></div><span className="resident-profile-avatar">{(form.name || "W").slice(0, 1).toUpperCase()}</span></div>
          <div className="form-grid">
            <div className={`field span-2 ${errors.name ? "invalid" : ""}`}><label htmlFor="profile-name">Nama lengkap <span className="req">*</span></label><input id="profile-name" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Nama sesuai KTP" />{errors.name && <span className="err">{errors.name}</span>}</div>
            <div className="field"><label htmlFor="profile-identity">NIK / identitas akun</label><input id="profile-identity" value={maskIdentity(session?.identity || "")} readOnly /><span className="hint">Identitas akun hanya ditampilkan tersamar.</span></div>
            <div className={`field ${errors.phone ? "invalid" : ""}`}><label htmlFor="profile-phone">Nomor ponsel</label><input id="profile-phone" inputMode="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="08xx-xxxx-xxxx" />{errors.phone && <span className="err">{errors.phone}</span>}</div>
            <div className="field span-2"><label htmlFor="profile-email">Email (opsional)</label><input id="profile-email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="nama@email.com" /></div>
          </div>
          <div className="resident-form-divider" />
          <div className="resident-card-head resident-address-head"><div><h3>Informasi tempat tinggal</h3><p>Data domisili dan hubungan keluarga di lingkungan RT.</p></div><Badge tone={form.status === "Terverifikasi" ? "tone-done" : "tone-wait"}>{form.status || "Menunggu verifikasi"}</Badge></div>
          <div className="form-grid">
            <div className={`field ${errors.block ? "invalid" : ""}`}><label htmlFor="profile-block">Blok / nomor rumah <span className="req">*</span></label><input id="profile-block" value={form.block} onChange={(event) => update("block", event.target.value)} placeholder="Contoh: B-12" />{errors.block && <span className="err">{errors.block}</span>}</div>
            <div className="field"><label htmlFor="profile-kk">Nomor kartu keluarga</label><input id="profile-kk" value={form.familyCard} onChange={(event) => update("familyCard", event.target.value)} placeholder="Nomor KK" /></div>
            <div className={`field span-2 ${errors.address ? "invalid" : ""}`}><label htmlFor="profile-address">Alamat lengkap <span className="req">*</span></label><textarea id="profile-address" value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="Jalan, blok, nomor rumah, RT/RW" />{errors.address && <span className="err">{errors.address}</span>}</div>
          </div>
          <div className="resident-profile-form-actions">{saved && <span className="resident-saved"><Icon name="check" size={15} /> Perubahan tersimpan di perangkat ini.</span>}<button type="submit" className="btn btn-primary"><Icon name="check" size={15} /> Simpan perubahan</button></div>
        </form>

        <aside className="resident-history-column">
          <section className="card card-pad resident-residence-card">
            <span className="eyebrow">Domisili saat ini</span>
            <div className="resident-address-icon"><Icon name="pin" size={20} /></div>
            <h3>{form.block ? `Blok ${form.block}` : "Alamat belum dilengkapi"}</h3>
            <p>{form.address || "Lengkapi alamat tempat tinggal pada formulir profil."}</p>
            <div className="resident-residence-meta"><span>Status warga</span><strong>{form.status || "Menunggu verifikasi"}</strong></div>
            <div className="resident-residence-meta"><span>Nomor KK</span><strong>{form.familyCard || "Belum diisi"}</strong></div>
          </section>

          <section className="card card-pad resident-history-card">
            <div className="resident-card-head"><div><span className="eyebrow">Riwayat</span><h3>Riwayat domisili</h3></div><Icon name="clock" size={18} /></div>
            {history.length ? (
              <div className="resident-history-list">
                {history.map((item) => (
                  <article className="resident-history-item" key={item.id}>
                    <span className="resident-history-dot"><Icon name="check" size={11} /></span>
                    <div><strong>{item.title}</strong><p>{item.detail}</p><small>{formatDate(item.date)}</small></div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="resident-history-empty"><Icon name="layers" size={20} /><p>Riwayat perpindahan akan tercatat di sini setelah data domisili diperbarui atau diverifikasi pengurus.</p></div>
            )}
          </section>
        </aside>
      </div>
      <p className="resident-demo-note"><Icon name="alert" size={14} /> Data profil demo disimpan secara lokal di browser dan tidak dikirim ke pengurus.</p>
    </>
  );
}
