
import React, { useEffect, useState } from "react";
import logo from '../assets/logo.png';
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import { Icon } from "./ui.jsx";
import { rtInfo } from "../data.js";

const nav = [
  { to: "/warga", label: "Dashboard Warga", icon: "grid", end: true },
  { to: "/lapor", label: "Laporan Mandiri", icon: "megaphone" },
  { to: "/ajukan", label: "Pengajuan Surat", icon: "file" },
  { to: "/profil", label: "Profil Saya", icon: "user" },
  { to: "/dashboard", label: "Dashboard Pengurus", icon: "chart" },
  { to: "/sistem", label: "Dokumen Sistem", icon: "layers" },
];

const titles = {
  "/warga": ["Dashboard Warga", "Layanan dan status pengajuan Anda dalam satu tempat"],
  "/ajukan": ["Pengajuan Surat", "Formulir surat digital dengan verifikasi pengurus"],
  "/lapor": ["Laporan Mandiri", "Sampaikan masalah lingkungan langsung ke pengurus"],
  "/profil": ["Profil Saya", "Informasi pribadi dan riwayat domisili warga"],
  "/dashboard": ["Dashboard Pengurus", "Ringkasan operasional, verifikasi, dan data warga"],
  "/admin/akun": ["Manajemen Akun", "Kelola identitas pengguna, peran, dan izin akses"],
  "/admin/surat": ["Pengaturan Jenis Surat", "Kelola katalog surat dan persyaratan warga"],
  "/sistem": ["Dokumen Sistem", "Use case diagram, flowchart, dan ERD"],
};

const rtAdminNav = [
  { to: "/dashboard?tab=ringkasan", label: "Dashboard RT", icon: "chart" },
  { to: "/dashboard?tab=warga", label: "Data Warga", icon: "users" },
  { to: "/dashboard?tab=surat", label: "Verifikasi Surat", icon: "file" },
  { to: "/dashboard?tab=laporan", label: "Tindak Lanjut Laporan", icon: "megaphone" },
];

const systemAdminNav = [
  { to: "/admin/akun", label: "Manajemen Akun", icon: "users" },
  { to: "/admin/surat", label: "Pengaturan Jenis Surat", icon: "file" },
];

export default function Layout({ session, onLogout }) {
  const [open, setOpen] = useState(false);
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const dashboardTab = new URLSearchParams(search).get("tab") || "ringkasan";
  const rtTitle = {
    ringkasan: ["Dashboard RT", "Ringkasan layanan, warga, dan pengajuan terbaru"],
    warga: ["Data Warga", "Identitas warga dan riwayat mutasi masuk / keluar"],
    surat: ["Verifikasi Surat", "Tinjau berkas, berikan catatan, dan setujui surat"],
    laporan: ["Tindak Lanjut Laporan", "Tinjau laporan mandiri dan perbarui status"],
  };
  const [title, subtitle] = pathname === "/dashboard" ? rtTitle[dashboardTab] || rtTitle.ringkasan : titles[pathname] || titles["/warga"];
  const displayName = session?.name || "Pengguna Kelompok A";
  const initials = displayName.slice(0, 2).toUpperCase();
  const roleLabel = session?.role === "resident" ? "Warga" : session?.role === "system-admin" ? "Admin Sistem" : "Pengurus RT";
  const visibleNav = session?.role === "resident"
    ? nav.slice(0, 4)
    : session?.role === "rt-admin"
      ? rtAdminNav
      : systemAdminNav;

  const isNavActive = (to) => {
    const [targetPath, targetQuery] = to.split("?");
    if (pathname !== targetPath) return false;
    if (targetQuery) return search === `?${targetQuery}`;
    return true;
  };

  return (
    <div className="app">
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <strong>KELOMPOK A</strong>
            <span>Pelaporan Data Warga</span>
          </div>
          <button className="icon-btn sidebar-close" onClick={() => setOpen(false)} aria-label="Tutup menu">
            <Icon name="close" />
          </button>
        </div>

        <nav className="side-nav">
          <p className="side-label">{session?.role === "resident" ? "Menu Warga" : session?.role === "rt-admin" ? "Area Pengurus" : "Administrasi Sistem"}</p>
          {visibleNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={() => `side-link ${isNavActive(item.to) ? "active" : ""}`}>
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="side-card">
          <div className="side-card-icon"><Icon name="phone" size={18} /></div>
          <p>Butuh bantuan?</p>
          <strong>{rtInfo.telepon}</strong>
          <span>{rtInfo.jam}</span>
        </div>

        <div className="side-user">
          <div className="avatar">{initials}</div>
          <div>
            <strong>{displayName}</strong>
            <span>{roleLabel}</span>
          </div>
          <button type="button" className="logout-button" onClick={() => { onLogout(); navigate("/", { replace: true }); }} aria-label="Keluar"><Icon name="logout" size={18} /></button>
        </div>
      </aside>

      {open && <div className="scrim" onClick={() => setOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn burger" onClick={() => setOpen(true)} aria-label="Buka menu">
              <Icon name="menu" />
            </button>
            <div>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </div>
          <div className="topbar-right">
            <label className="top-search">
              <Icon name="search" size={17} />
              <input placeholder="Cari layanan, surat, atau warga…" />
            </label>
            <button className="icon-btn has-dot" aria-label="Notifikasi">
              <Icon name="bell" size={19} />
            </button>
            <div className="top-user">
              <div className="avatar small">{initials}</div>
              <div>
                <strong>{displayName}</strong>
                <span>{roleLabel}</span>
              </div>
            </div>
          </div>
        </header>

        <div className={`page ${session?.role === "rt-admin" || session?.role === "system-admin" ? "page-wide" : ""}`}><Outlet /></div>

        <footer className="site-footer">
          <div>
            <strong>Sistem Pelaporan Mandiri &amp; Basis Data Warga</strong>
            <p>{rtInfo.sekretariat} · {rtInfo.kelurahan}</p>
          </div>
          <div className="footer-links">
            {/* {session?.role !== "resident" && <NavLink to="/sistem">Dokumen Sistem</NavLink>} */}
            {session?.role === "resident" && <NavLink to="/profil">Profil Saya</NavLink>}
            <span>© 2026 {rtInfo.nama}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
