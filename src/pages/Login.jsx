import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Icon } from "../components/ui.jsx";
import { loginWithIdentity } from "../firebaseAuth.js";

const destinations = {
  resident: "/warga",
  "rt-admin": "/dashboard",
  "system-admin": "/admin",
};

export default function Login({ session, onLogin, authError }) {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (session) return <Navigate to={destinations[session.role] || "/warga"} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!identity.trim() || !password) {
      setError("Masukkan identitas dan kata sandi untuk melanjutkan.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const nextSession = await loginWithIdentity(identity, password);
      onLogin(nextSession);
      navigate(destinations[nextSession.role], { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Login gagal. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <p>Masuk menggunakan email yang terdaftar.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="login-identity">Email</label>
              <div className="login-input-wrap"><Icon name="user" size={18} /><input id="login-identity" type="email" autoComplete="username" value={identity} onChange={(event) => { setIdentity(event.target.value); setError(""); }} placeholder="nama@gmail.com" /></div>
            </div>
            <div className="field">
              <div className="login-label-row"><label htmlFor="login-password">Kata sandi</label><a href="#bantuan" onClick={(event) => event.preventDefault()}>Lupa kata sandi?</a></div>
              <div className="login-input-wrap"><Icon name="shield" size={18} /><input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Masukkan kata sandi" /><button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}><Icon name={showPassword ? "eyeOff" : "eye"} size={17} /></button></div>
            </div>
            {(error || (!identity && authError)) && <p className="login-error" role="alert"><Icon name="alert" size={15} />{error || authError}</p>}
            <button type="submit" className="btn btn-primary btn-block login-submit" disabled={submitting}>{submitting ? "Memverifikasi…" : "Masuk"}<Icon name="arrow" size={17} /></button>
          </form>

          <p className="auth-switch">Belum mempunyai akun? <Link to="/daftar" className="auth-switch-link">Daftar</Link></p>
          <div className="login-security"><span><Icon name="shield" size={16} /></span><p><strong>Akses sesuai peran akun</strong><small>Peran dan hak akses dibaca dari data akun Firebase.</small></p></div>
          {/* <div className="login-copyright">© 2026 Kelompok A</div> */}
        </div>
      </section>
    </main>
  );
}
