import { jenisSurat } from "./data.js";

const ACCOUNTS_KEY = "silaras-admin-accounts";
const LETTER_TYPES_KEY = "silaras-letter-types";

const seedAccounts = [
  { id: "ACC-RT-001", name: "Suryana Wijaya", identity: "suryana.wijaya@rt004.id", role: "rt-admin", status: "Aktif", access: ["Dashboard RT", "Data warga", "Verifikasi surat", "Tindak lanjut laporan"] },
  { id: "ACC-ADM-001", name: "Admin Kelompok A", identity: "admin@kelompoka.id", role: "system-admin", status: "Aktif", access: ["Manajemen akun", "Pengaturan jenis surat"] },
  { id: "ACC-W-001", name: "Rina Kartika", identity: "rina.kartika@warga.id", role: "resident", status: "Aktif", access: ["Dashboard warga", "Laporan mandiri", "Pengajuan surat", "Profil warga"] },
  { id: "ACC-W-002", name: "Agus Salim", identity: "agus.salim@warga.id", role: "resident", status: "Aktif", access: ["Dashboard warga", "Laporan mandiri", "Pengajuan surat", "Profil warga"] },
];

function readList(key, fallback) {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(stored) ? stored : fallback.map((item) => ({ ...item }));
  } catch {
    return fallback.map((item) => ({ ...item }));
  }
}

export function readAdminAccounts() {
  return readList(ACCOUNTS_KEY, seedAccounts);
}

export function saveAdminAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return accounts;
}

export function readManagedLetterTypes() {
  return readList(LETTER_TYPES_KEY, jenisSurat).map((item) => ({ ...item, syarat: [...(item.syarat || [])] }));
}

export function saveManagedLetterTypes(types) {
  localStorage.setItem(LETTER_TYPES_KEY, JSON.stringify(types));
  return types;
}
