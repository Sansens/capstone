import React, { useMemo, useState } from "react";
import { Icon, Badge } from "../components/ui.jsx";
import { readAdminAccounts, saveAdminAccounts } from "../adminData.js";

const roleDetails = {
  resident: { label: "Warga", access: ["Dashboard warga", "Laporan mandiri", "Pengajuan surat", "Profil warga"] },
  "rt-admin": { label: "Pengurus RT", access: ["Dashboard RT", "Data warga", "Verifikasi surat", "Tindak lanjut laporan"] },
  "system-admin": { label: "Admin Sistem", access: ["Manajemen akun", "Pengaturan jenis surat"] },
};

const emptyForm = { name: "", identity: "", role: "resident", permissions: [...roleDetails.resident.access] };

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState(readAdminAccounts);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const key = query.trim().toLowerCase();
    if (!key) return accounts;
    return accounts.filter((account) => [account.name, account.identity, account.id, roleDetails[account.role]?.label].some((value) => value?.toLowerCase().includes(key)));
  }, [accounts, query]);

  const commit = (nextAccounts, feedback) => {
    setAccounts(saveAdminAccounts(nextAccounts));
    setMessage(feedback);
  };

  const saveAccount = (event) => {
    event.preventDefault();
    if (form.name.trim().length < 3 || !form.identity.trim()) {
      setMessage("Isi nama lengkap dan email/ID akun terlebih dahulu.");
      return;
    }
    const duplicate = accounts.some((account) => account.identity.toLowerCase() === form.identity.trim().toLowerCase() && account.id !== editingId);
    if (duplicate) {
      setMessage("Email atau ID akun tersebut sudah digunakan.");
      return;
    }
    if (editingId) {
      commit(accounts.map((account) => account.id === editingId ? { ...account, name: form.name.trim(), identity: form.identity.trim(), role: form.role, access: form.permissions } : account), "Perubahan akun berhasil disimpan.");
    } else {
      commit([{ id: `ACC-${Date.now().toString().slice(-8)}`, name: form.name.trim(), identity: form.identity.trim(), role: form.role, status: "Aktif", access: form.permissions }, ...accounts], "Akun baru berhasil ditambahkan.");
    }
    setForm(emptyForm);
    setEditingId("");
  };

  const editAccount = (account) => {
    setEditingId(account.id);
    setForm({ name: account.name, identity: account.identity, role: account.role, permissions: account.access || roleDetails[account.role]?.access || [] });
    setMessage("");
  };

  const toggleStatus = (account) => {
    const status = account.status === "Aktif" ? "Nonaktif" : "Aktif";
    commit(accounts.map((item) => item.id === account.id ? { ...item, status } : item), `${account.name} sekarang ${status.toLowerCase()}.`);
  };

  return (
    <>
      <section className="resident-page-intro admin-page-intro">
        <span className="eyebrow">Akses &amp; keamanan</span>
        <h2>Manajemen akun</h2>
        <p>Kelola identitas pengguna, peran, serta izin akses pada portal Kelompok A.</p>
      </section>

      <div className="admin-account-layout">
        <section className="card admin-account-list">
          <div className="card-pad admin-account-list-head">
            <div className="toolbar">
              <div><h3 style={{ fontSize: 15 }}>Akun pengguna</h3><p className="tiny muted">{accounts.length} akun terdaftar · peran menentukan area yang dapat diakses</p></div>
              <label className="toolbar-input"><Icon name="search" size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama / email / ID…" aria-label="Cari akun" /></label>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Pengguna</th><th>Identitas akun</th><th>Peran</th><th>Izin akses</th><th>Status</th><th style={{ textAlign: "right" }}>Aksi</th></tr></thead>
              <tbody>
                {filtered.map((account) => (
                  <tr key={account.id}>
                    <td><span className="cell-strong">{account.name}</span><span className="cell-sub">{account.id}</span></td>
                    <td>{account.identity}</td>
                    <td><span className={`admin-role-chip role-${account.role}`}>{roleDetails[account.role]?.label || account.role}</span></td>
                    <td><div className="admin-permissions">{(account.access || roleDetails[account.role]?.access || []).map((permission) => <span key={permission}>{permission}</span>)}</div></td>
                    <td><Badge tone={account.status === "Aktif" ? "tone-done" : "tone-wait"}>{account.status}</Badge></td>
                    <td><div className="row-actions"><button className="btn btn-outline btn-sm" onClick={() => editAccount(account)}>Ubah</button><button className={`btn btn-sm ${account.status === "Aktif" ? "btn-ghost" : "btn-primary"}`} onClick={() => toggleStatus(account)}>{account.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}</button></div></td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan="6" className="empty">Tidak ada akun yang cocok.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="card card-pad admin-account-form-card">
          <span className="eyebrow">{editingId ? "Perbarui akses" : "Akun baru"}</span>
          <h3 style={{ fontSize: 16 }}>{editingId ? "Ubah akun pengguna" : "Tambah pengguna"}</h3>
          <p className="small-text muted" style={{ marginTop: 5 }}>Tentukan data akun dan perannya. Izin dasar akan mengikuti peran yang dipilih.</p>
          <form className="admin-account-form" onSubmit={saveAccount}>
            <div className="field"><label htmlFor="account-name">Nama lengkap</label><input id="account-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Nama pengguna" /></div>
            <div className="field"><label htmlFor="account-identity">Email / ID pengguna</label><input id="account-identity" value={form.identity} onChange={(event) => setForm((current) => ({ ...current, identity: event.target.value }))} placeholder="nama@contoh.id" /></div>
            <div className="field"><label htmlFor="account-role">Peran akun</label><select id="account-role" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value, permissions: [...roleDetails[event.target.value].access] }))}>{Object.entries(roleDetails).map(([id, role]) => <option value={id} key={id}>{role.label}</option>)}</select></div>
            <fieldset className="admin-permission-fieldset"><legend>Izin akses khusus</legend>{roleDetails[form.role].access.map((permission) => <label className="admin-permission-option" key={permission}><input type="checkbox" checked={form.permissions.includes(permission)} onChange={(event) => setForm((current) => ({ ...current, permissions: event.target.checked ? [...current.permissions, permission] : current.permissions.filter((item) => item !== permission) }))} /><span>{permission}</span></label>)}</fieldset>
            {message && <p className="admin-form-message" role="status">{message}</p>}
            <button type="submit" className="btn btn-primary btn-block"><Icon name={editingId ? "check" : "plus"} size={16} />{editingId ? "Simpan perubahan" : "Tambah akun"}</button>
            {editingId && <button type="button" className="btn btn-outline btn-block" onClick={() => { setEditingId(""); setForm(emptyForm); setMessage(""); }}>Batal mengubah</button>}
          </form>
          <p className="admin-demo-callout"><Icon name="alert" size={16} /> Data akun demo disimpan di browser ini. Pengaturan peran belum terhubung ke server autentikasi.</p>
        </aside>
      </div>
    </>
  );
}
