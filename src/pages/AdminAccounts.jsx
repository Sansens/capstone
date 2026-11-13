import React, { useEffect, useMemo, useState } from "react";
import { Icon, Badge } from "../components/ui.jsx";
import { deleteManagedAccount, subscribeToManagedAccounts, updateManagedAccount } from "../accountData.js";

const roleDetails = {
  resident: { label: "Warga", access: ["Dashboard warga", "Laporan mandiri", "Pengajuan surat", "Profil warga"] },
  "rt-admin": { label: "Pengurus RT", access: ["Dashboard RT", "Data warga", "Verifikasi surat", "Tindak lanjut laporan"] },
  "system-admin": { label: "Admin Sistem", access: ["Manajemen akun", "Pengaturan jenis surat"] },
};

const emptyForm = { name: "", role: "resident" };

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    try {
      return subscribeToManagedAccounts(setAccounts, (error) => {
        setLoadError(`Gagal memuat akun Firebase: ${error.message}`);
      });
    } catch (error) {
      setLoadError(`Gagal menghubungkan akun Firebase: ${error.message}`);
      return undefined;
    }
  }, []);

  const filtered = useMemo(() => {
    const key = query.trim().toLowerCase();
    if (!key) return accounts;
    return accounts.filter((account) => [account.name, account.identity, account.id, roleDetails[account.role]?.label].some((value) => value?.toLowerCase().includes(key)));
  }, [accounts, query]);

  const saveAccount = async (event) => {
    event.preventDefault();
    if (!editingId) {
      setMessage("Pilih akun terdaftar untuk mengubah datanya.");
      return;
    }
    if (form.name.trim().length < 3) {
      setMessage("Nama lengkap minimal 3 karakter.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await updateManagedAccount(editingId, {
        displayName: form.name.trim(),
        role: form.role,
      });
      setMessage("Perubahan akun berhasil disimpan.");
      setEditingId("");
      setForm(emptyForm);
    } catch (error) {
      setMessage(`Perubahan akun gagal disimpan: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const editAccount = (account) => {
    setEditingId(account.uid);
    setForm({ name: account.name, role: account.role });
    setMessage("");
  };

  const toggleStatus = async (account) => {
    const status = account.status === "Aktif" ? "Nonaktif" : "Aktif";
    setMessage("");
    try {
      await updateManagedAccount(account.uid, { status });
      setMessage(`${account.name} sekarang ${status.toLowerCase()}.`);
    } catch (error) {
      setMessage(`Status akun gagal diperbarui: ${error.message}`);
    }
  };

  const deleteAccount = async (account) => {
    if (!["resident", "rt-admin"].includes(account.role)) return;
    if (!window.confirm(`Hapus akun ${account.name}? Data akun akan dihapus, tetapi kredensial Firebase Authentication tetap tersimpan.`)) return;

    setDeletingId(account.uid);
    setMessage("");
    try {
      await deleteManagedAccount(account.uid);
      if (editingId === account.uid) {
        setEditingId("");
        setForm(emptyForm);
      }
      setMessage(`Data akun ${account.name} berhasil dihapus.`);
    } catch (error) {
      setMessage(`Akun gagal dihapus: ${error.message}`);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <>
      <section className="resident-page-intro admin-page-intro">
        <span className="eyebrow">Akses &amp; keamanan</span>
        <h2>Manajemen akun</h2>
        <p>Kelola peran dan status akun yang sudah terdaftar di Firebase Authentication.</p>
      </section>

      {loadError && <p className="login-error" role="alert">{loadError}</p>}
      <div className="admin-account-layout">
        <section className="card admin-account-list">
          <div className="card-pad admin-account-list-head">
            <div className="toolbar">
              <div><h3 style={{ fontSize: 15 }}>Akun pengguna</h3><p className="tiny muted">{accounts.length} akun terdaftar · peran menentukan area yang dapat diakses</p></div>
              <label className="toolbar-input"><Icon name="search" size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama / email / ID…" aria-label="Cari akun" /></label>
            </div>
          </div>
          <div className="table-wrap">
            <table className="admin-accounts-table">
              <thead><tr><th>Pengguna</th><th>Peran</th><th>Izin akses</th><th>Status</th><th>Aksi</th></tr></thead>
              <tbody>
                {filtered.map((account) => (
                  <tr key={account.id}>
                    <td><span className="cell-strong">{account.name}</span></td>
                    <td><span className={`admin-role-chip role-${account.role}`}>{roleDetails[account.role]?.label || account.role}</span></td>
                    <td><div className="admin-permissions">{(roleDetails[account.role]?.access || []).map((permission) => <span key={permission}>{permission}</span>)}</div></td>
                    <td><Badge tone={account.status === "Aktif" ? "tone-done" : "tone-wait"}>{account.status}</Badge></td>
                    <td>
                      {["resident", "rt-admin"].includes(account.role) && (
                        <div className="row-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => editAccount(account)}>Ubah</button>
                          <button className={`btn btn-outline btn-sm ${account.status === "Aktif" ? "btn-ghost" : "btn-primary"}`} onClick={() => toggleStatus(account)}>{account.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}</button>
                          {/* <button className="btn btn-outline btn-sm" disabled={deletingId === account.uid} aria-label={`Hapus akun ${account.name}`} onClick={() => deleteAccount(account)}>{deletingId === account.uid ? "Menghapus…" : "Hapus"}</button> */}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan="5" className="empty">Tidak ada akun yang cocok.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="card card-pad admin-account-form-card">
          <span className="eyebrow">{editingId ? "Perbarui akses" : "Akun Firebase"}</span>
          <h3 style={{ fontSize: 16 }}>{editingId ? "Ubah akun pengguna" : "Pilih akun"}</h3>
          <p className="small-text muted" style={{ marginTop: 5 }}>Perubahan peran disimpan ke dokumen Account dan langsung digunakan oleh kontrol akses.</p>
          <form className="admin-account-form" onSubmit={saveAccount}>
            <div className="field"><label htmlFor="account-name">Nama lengkap</label><input id="account-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Pilih akun pengguna" disabled={!editingId} /></div>
            <div className="field"><label htmlFor="account-role">Peran akun</label><select id="account-role" value={form.role} disabled={!editingId} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>{Object.entries(roleDetails).map(([id, role]) => <option value={id} key={id}>{role.label}</option>)}</select></div>
            {message && <p className="admin-form-message" role="status">{message}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={!editingId || saving}><Icon name="check" size={16} />{saving ? "Menyimpan…" : "Simpan perubahan"}</button>
            {editingId && <button type="button" className="btn btn-outline btn-block" onClick={() => { setEditingId(""); setForm(emptyForm); setMessage(""); }}>Batal mengubah</button>}
          </form>
          <p className="admin-demo-callout"><Icon name="alert" size={16} /> Buat pengguna dan kata sandinya di Firebase Authentication, lalu buat Account/{'{uid}'} dengan UID yang sama. Aplikasi browser tidak membuat kredensial akun.</p>
        </aside>
      </div>
    </>
  );
}
