const STORAGE_PREFIX = "silaras-resident-data-";

const emptyData = (identity = "") => ({
  profile: {
    name: "",
    phone: "",
    email: "",
    block: "",
    address: "",
    familyCard: "",
    status: "Menunggu verifikasi",
    identity,
  },
  reports: [],
  letters: [],
  residenceHistory: [],
});

function accountKey(identity) {
  const value = String(identity || "guest").trim().toLowerCase();
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${STORAGE_PREFIX}${(hash >>> 0).toString(16)}`;
}

export function readResidentData(identity) {
  const fallback = emptyData(identity);
  try {
    const stored = JSON.parse(localStorage.getItem(accountKey(identity)) || "null");
    if (!stored || typeof stored !== "object") return fallback;
    return {
      ...fallback,
      ...stored,
      profile: { ...fallback.profile, ...(stored.profile || {}), identity },
      reports: Array.isArray(stored.reports) ? stored.reports : [],
      letters: Array.isArray(stored.letters) ? stored.letters : [],
      residenceHistory: Array.isArray(stored.residenceHistory) ? stored.residenceHistory : [],
    };
  } catch {
    return fallback;
  }
}

export function writeResidentData(identity, updates) {
  const current = readResidentData(identity);
  const next = {
    ...current,
    ...updates,
    profile: { ...current.profile, ...(updates.profile || {}), identity },
  };
  localStorage.setItem(accountKey(identity), JSON.stringify(next));
  return next;
}

export function addResidentRecord(identity, collection, record) {
  const current = readResidentData(identity);
  const records = Array.isArray(current[collection]) ? current[collection] : [];
  return writeResidentData(identity, { [collection]: [record, ...records] });
}

export function listResidentAccounts() {
  const accounts = [];
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith(STORAGE_PREFIX)) continue;
      const stored = JSON.parse(localStorage.getItem(key) || "null");
      if (stored?.profile) accounts.push(stored);
    }
  } catch {
    return accounts;
  }
  return accounts;
}

export function updateResidentRecord(identity, collection, recordId, updates) {
  const current = readResidentData(identity);
  const records = Array.isArray(current[collection]) ? current[collection] : [];
  return writeResidentData(identity, {
    [collection]: records.map((record) => record.id === recordId ? { ...record, ...updates } : record),
  });
}
