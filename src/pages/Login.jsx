import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Icon } from "../components/ui.jsx";

const roles = [
  { id: "resident", title: "Warga", detail: "Akses layanan lingkungan", icon: "home" },
  { id: "rt-admin", title: "Pengurus RT", detail: "Kelola layanan warga", icon: "users" },
  { id: "system-admin", title: "Admin", detail: "Kelola sistem Kelompok A", icon: "shield" },
];

const destinations = {
  resident: "/warga",
  "rt-admin": "/dashboard",
  "system-admin": "/admin",
};

export default function Login({ session, onLogin }) {
  const navigate = useNavigate();
  const [role, setRole] = useState("resident");
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const selectedRole = roles.find((item) => item.id === role);

  if (session) return <Navigate to={destinations[session.role] || "/warga"} replace />;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!identity.trim() || !password) {
      setError("Masukkan identitas dan kata sandi untuk melanjutkan.");
      return;
    }

    const name = role === "resident" ? "Warga Kelompok A" : role === "rt-admin" ? "Pengurus RT" : "Admin Sistem";
    const nextSession = { role, identity: identity.trim(), name, signedInAt: Date.now() };
    onLogin(nextSession);
    navigate(destinations[role], { replace: true });
  };

  const identityLabel = role === "resident" ? "NIK atau nomor ponsel" : "Email atau ID pengguna";
  const identityPlaceholder = role === "resident" ? "Masukkan NIK / nomor ponsel" : "nama@contoh.id";

  return (
    <main className="login-screen">
      <section className="login-showcase" aria-label="Tentang Kelompok A">
        <div className="login-showcase-inner">
          <a className="login-brand" href="/" aria-label="Beranda Kelompok A">
            <span className="brand-mark">A</span>
            <span><strong>KELOMPOK A</strong><small>Pelaporan Data Warga</small></span>
          </a>

          <div className="showcase-copy">
            <span className="showcase-eyebrow"><i /> Layanan warga, lebih dekat</span>
            <h1>Urusan lingkungan<br />jadi <em>lebih sederhana.</em></h1>
            <p>Satu pintu untuk layanan administrasi, pelaporan, dan pengelolaan warga</p>
          </div>

          <div className="showcase-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-home"><Icon name="home" size={58} strokeWidth={1.35} /></div>
            <div className="art-card art-card-top"><span className="art-mini-icon"><Icon name="check" size={16} /></span><span><b>Surat digital</b><small>Proses lebih praktis</small></span></div>
            <div className="art-card art-card-bottom"><span className="art-mini-icon warm"><Icon name="megaphone" size={16} /></span><span><b>Laporan warga</b><small>Terpantau transparan</small></span></div>
            <span className="art-spark spark-a">✳</span><span className="art-spark spark-b">✦</span>
          </div>

          {/* <div className="showcase-foot"><Icon name="pin" size={15} /> Melayani warga {rtInfo.kawasan}, {rtInfo.kelurahan}</div> */}
        </div>
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="login-mobile-brand">
            <span className="brand-mark">A</span><strong>KELOMPOK A</strong>
          </div>
          <div className="login-heading">
            <span className="eyebrow">Selamat datang</span>
            <h2>Masuk ke akun Anda</h2>
            <p>Pilih jenis akun, lalu masukkan identitas untuk melanjutkan.</p>
          </div>

          <div className="role-picker" role="group" aria-label="Pilih jenis akun">
            {roles.map((item) => (
              <button
                className={`role-option ${role === item.id ? "selected" : ""}`}
                type="button"
                key={item.id}
                onClick={() => { setRole(item.id); setError(""); }}
                aria-pressed={role === item.id}
              >
                <span className="role-icon"><Icon name={item.icon} size={19} /></span>
                <span className="role-copy"><strong>{item.title}</strong><small>{item.detail}</small></span>
                <span className="role-check"><Icon name="check" size={13} /></span>
              </button>
            ))}
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="login-identity">{identityLabel}</label>
              <div className="login-input-wrap"><Icon name={role === "resident" ? "card" : "user"} size={18} /><input id="login-identity" autoComplete="username" value={identity} onChange={(event) => { setIdentity(event.target.value); setError(""); }} placeholder={identityPlaceholder} /></div>
            </div>
            <div className="field">
              <div className="login-label-row"><label htmlFor="login-password">Kata sandi</label><a href="#bantuan" onClick={(event) => event.preventDefault()}>Lupa kata sandi?</a></div>
              <div className="login-input-wrap"><Icon name="shield" size={18} /><input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Masukkan kata sandi" /><button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}><Icon name={showPassword ? "eyeOff" : "eye"} size={17} /></button></div>
            </div>
            {error && <p className="login-error" role="alert"><Icon name="alert" size={15} />{error}</p>}
            <button type="submit" className="btn btn-primary btn-block login-submit">Masuk sebagai {selectedRole.title}<Icon name="arrow" size={17} /></button>
          </form>

          <div className="login-security"><span><Icon name="shield" size={16} /></span><p><strong>Akses aman &amp; terarah</strong><small>Anda akan diarahkan ke dashboard sesuai jenis akun.</small></p></div>
          {/* <p className="login-demo-note">Mode demonstrasi: formulir ini belum terhubung ke layanan verifikasi identitas. Sambungkan ke backend autentikasi sebelum digunakan secara nyata.</p> */}
          {/* <div className="login-copyright">© 2026 Kelompok A</div> */}
        </div>
      </section>
    </main>
  );
}
