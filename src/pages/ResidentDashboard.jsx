import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Badge } from "../components/ui.jsx";
import { subscribeToResidentProfile } from "../accountData.js";
import { subscribeToResidentSubmissions } from "../firestoreData.js";

const actions = [
  { to: "/lapor", title: "Buat laporan", text: "Sampaikan masalah di lingkungan RT.", icon: "megaphone", tone: "orange", label: "Laporan mandiri" },
  { to: "/ajukan", title: "Ajukan surat", text: "Pilih surat dan lengkapi persyaratannya.", icon: "file", tone: "amber", label: "Surat digital" },
  { to: "/profil", title: "Profil saya", text: "Periksa dan perbarui data warga.", icon: "user", tone: "brown", label: "Data warga" },
];

function formatDate(value) {
  if (!value) return "Baru saja";
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default function ResidentDashboard({ session }) {
  const [profile, setProfile] = useState(() => ({
    name: "",
    phone: "",
    block: "",
    address: "",
    ...(session?.profile || {}),
  }));
  const [reports, setReports] = useState([]);
  const [letters, setLetters] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    try {
      return subscribeToResidentProfile(session, (data) => setProfile(data.profile), (error) => {
        setLoadError(`Gagal memuat profil warga: ${error.message}`);
      });
    } catch (error) {
      setLoadError(`Gagal menghubungkan profil warga: ${error.message}`);
      return undefined;
    }
  }, [session]);

  useEffect(() => {
    const mapItems = (snapshot, type) => snapshot.docs.map((item) => {
      const data = item.data();
      const date = data.createdAt?.toDate?.();
      return {
        id: data.ticketId || item.id,
        title: data.title || data.letterType || "Pengajuan",
        jenis: data.letterType || "",
        createdAt: date ? date.toISOString() : data.createdAt || "",
        status: data.status || "Menunggu",
        type,
      };
    }).sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0));

    try {
      return subscribeToResidentSubmissions(
        session,
        (snapshot) => setReports(mapItems(snapshot, "Laporan")),
        (snapshot) => setLetters(mapItems(snapshot, "Pengajuan surat")),
        (error) => setLoadError(`Gagal memuat status pengajuan: ${error.message}`)
      );
    } catch (error) {
      setLoadError(`Gagal menghubungkan status pengajuan: ${error.message}`);
      return undefined;
    }
  }, [session]);

  const recent = useMemo(() => [...reports, ...letters]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)), [reports, letters]);
  const name = profile.name || "Warga";
  const profileProgress = [profile.name, profile.phone, profile.block, profile.address].filter(Boolean).length;

  return (
    <>
      <section className="resident-welcome">
        <div>
          <span className="eyebrow">Portal warga</span>
          <h2>Halo, {name.split(" ")[0]} <span aria-hidden="true">👋</span></h2>
          <p>Semua kebutuhan layanan RT Anda, kini bisa diakses dari satu tempat.</p>
        </div>
        <div className="resident-welcome-mark"><Icon name="home" size={28} /></div>
      </section>
      {loadError && <p className="login-error" role="alert">{loadError}</p>}

      <section className="section resident-services">
        <div className="section-head">
          <div><span className="eyebrow">Akses cepat</span><h2>Layanan untuk Anda</h2><p>Pilih salah satu layanan untuk memulai.</p></div>
        </div>
        <div className="grid grid-3">
          {actions.map((action) => (
            <Link to={action.to} className="resident-service-card" key={action.to}>
              <div className={`resident-service-icon ${action.tone}`}><Icon name={action.icon} size={21} /></div>
              <span className="resident-service-label">{action.label}</span>
              <h3>{action.title}</h3>
              <p>{action.text}</p>
              <span className="resident-service-link">Buka layanan <Icon name="arrow" size={15} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section resident-lower-grid">
        <div className="card resident-status-card">
          <div className="resident-card-head">
            <div><span className="eyebrow">Aktivitas terbaru</span><h2>Status laporan &amp; surat</h2></div>
            <span className="resident-count">{recent.length} pengajuan</span>
          </div>
          {recent.length ? (
            <div className="resident-status-list">
              {recent.slice(0, 5).map((item) => (
                <article className="resident-status-item" key={`${item.type}-${item.id}`}>
                  <span className={`resident-status-icon ${item.type === "Laporan" ? "orange" : "amber"}`}><Icon name={item.type === "Laporan" ? "megaphone" : "file"} size={17} /></span>
                  <div className="resident-status-copy"><span className="resident-ticket">{item.id} · {item.type}</span><strong>{item.title || item.jenis || item.judul}</strong><small>{formatDate(item.createdAt)}</small></div>
                  <Badge>{item.status || "Menunggu"}</Badge>
                </article>
              ))}
            </div>
          ) : (
            <div className="resident-empty-state"><span><Icon name="inbox" size={22} /></span><strong>Belum ada aktivitas</strong><p>Laporan dan pengajuan surat yang Anda kirim akan tampil di sini.</p></div>
          )}
        </div>

        <aside className="card resident-profile-summary">
          <span className="eyebrow">Data warga</span>
          <div className="resident-profile-person"><span className="avatar">{name.slice(0, 2).toUpperCase()}</span><div><strong>{name}</strong><small>{profile.block ? `Blok ${profile.block}` : "Blok belum dilengkapi"}</small></div></div>
          <div className="resident-progress"><div><span>Kelengkapan profil</span><strong>{profileProgress}/4</strong></div><i><b style={{ width: `${profileProgress * 25}%` }} /></i></div>
          <p className="small-text muted">Lengkapi data pribadi agar pengurus dapat memproses layanan Anda dengan tepat.</p>
          <Link to="/profil" className="btn btn-outline btn-block resident-profile-button">Lihat profil <Icon name="arrow" size={15} /></Link>
        </aside>
      </section>
      <p className="resident-demo-note"><Icon name="alert" size={14} /> Profil dan status pengajuan diperbarui langsung dari Firebase.</p>
    </>
  );
}
