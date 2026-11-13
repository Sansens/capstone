import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Icon } from "../components/ui.jsx";

export default function Register({ session, onRegister }) {
  const navigate = useNavigate();
  const [nik, setNik] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (session) return <Navigate to="/resident" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!/^\d{16}$/.test(nik.trim())) {
      setError("NIK harus terdiri dari 16 digit.");
      return;
    }
    if (name.trim().length < 3) {
      setError("Nama lengkap minimal 3 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onRegister({ nik, email, name, password });
      navigate("/resident", { replace: true });
    } catch (registrationError) {
      setError(registrationError.message || "Pendaftaran gagal. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-screen">
      <section className="login-showcase" aria-label="Layanan warga">
        <div className="login-showcase-inner">
          <a className="login-brand" href="/" aria-label="Beranda Kelompok A">
            <span className="brand-mark">A</span>
            <span><strong>KELOMPOK A</strong><small>Pelaporan Data Warga</small></span>
          </a>
          <div className="showcase-copy">
            <span className="showcase-eyebrow"><i /> Layanan warga, lebih dekat</span>
            <h1>Mulai layanan<br />warga dengan <em>mudah.</em></h1>
            <p>Buat akun menggunakan NIK Anda untuk mengakses layanan administrasi dan informasi lingkungan.</p>
          </div>
          <div className="showcase-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-home"><Icon name="home" size={58} strokeWidth={1.35} /></div>
            <div className="art-card art-card-top"><span className="art-mini-icon"><Icon name="check" size={16} /></span><span><b>Akun warga</b><small>Data tersimpan aman</small></span></div>
            <div className="art-card art-card-bottom"><span className="art-mini-icon warm"><Icon name="megaphone" size={16} /></span><span><b>Layanan digital</b><small>Lebih dekat dan praktis</small></span></div>
            <span className="art-spark spark-a">✳</span><span className="art-spark spark-b">✦</span>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="login-mobile-brand">
            <span className="brand-mark">A</span><strong>KELOMPOK A</strong>
          </div>
          <div className="login-heading">
            <span className="eyebrow">Pendaftaran warga</span>
            <h2>Buat akun baru</h2>
            <p>Daftarkan akun menggunakan NIK, email, dan nama lengkap sesuai identitas.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="register-nik">National ID Number (NIK)</label>
              <div className="login-input-wrap"><Icon name="card" size={18} /><input id="register-nik" inputMode="numeric" autoComplete="off" maxLength={16} value={nik} onChange={(event) => { setNik(event.target.value.replace(/\D/g, "").slice(0, 16)); setError(""); }} placeholder="NIK 16 digit" /></div>
            </div>
            <div className="field">
              <label htmlFor="register-email">Email</label>
              <div className="login-input-wrap"><Icon name="mail" size={18} /><input id="register-email" type="email" autoComplete="email" required value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="nama@gmail.com" /></div>
            </div>
            <div className="field">
              <label htmlFor="register-name">Nama Lengkap</label>
              <div className="login-input-wrap"><Icon name="user" size={18} /><input id="register-name" autoComplete="name" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="Bagus Adi Nugraha" /></div>
            </div>
            <div className="field">
              <label htmlFor="register-password">Kata Sandi</label>
              <div className="login-input-wrap"><Icon name="shield" size={18} /><input id="register-password" type="password" autoComplete="new-password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Minimal 6 karakter" /></div>
            </div>
            <div className="field">
              <label htmlFor="register-confirm-password">Konfirmasi Kata Sandi</label>
              <div className="login-input-wrap"><Icon name="shield" size={18} /><input id="register-confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); setError(""); }} placeholder="Masukkan ulang password" /></div>
            </div>
            {error && <p className="login-error" role="alert"><Icon name="alert" size={15} />{error}</p>}
            <button type="submit" className="btn btn-primary btn-block login-submit" disabled={submitting}>{submitting ? "Registering…" : "Daftar"}<Icon name="arrow" size={17} /></button>
          </form>

          <p className="auth-switch">Sudah memiliki akun? <Link to="/login" className="auth-switch-link">Masuk</Link></p>
          <div className="login-security"><span><Icon name="shield" size={16} /></span><p><strong>Akun pribadi warga</strong><small>Profil dan data akun disimpan terpisah untuk setiap pengguna.</small></p></div>
        </div>
      </section>
    </main>
  );
}
