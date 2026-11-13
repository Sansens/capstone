import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { requireFirebase } from "./firebase.js";

const ACCOUNT_COLLECTION = "Account";

function profileFromAccount(account, identity = account.nik || account.email || "") {
  return {
    name: account.displayName || "",
    phone: account.phone || "",
    email: account.contactEmail || account.email || "",
    block: account.block || "",
    address: account.address || "",
    familyCard: account.familyCard || "",
    status: account.residencyStatus || "Menunggu verifikasi",
    identity,
  };
}

export function subscribeToResidentProfile(session, onProfile, onError) {
  const { db } = requireFirebase();
  return onSnapshot(doc(db, ACCOUNT_COLLECTION, session.uid), (snapshot) => {
    if (!snapshot.exists()) {
      onError(new Error("Data akun warga tidak ditemukan."));
      return;
    }
    const account = snapshot.data();
    onProfile({
      profile: profileFromAccount(account, session.identity),
      residenceHistory: account.residenceHistory || [],
    });
  }, onError);
}

export async function saveResidentProfile(session, profile, residenceHistory) {
  const { db } = requireFirebase();
  await updateDoc(doc(db, ACCOUNT_COLLECTION, session.uid), {
    displayName: profile.name,
    contactEmail: profile.email,
    phone: profile.phone,
    block: profile.block,
    address: profile.address,
    familyCard: profile.familyCard,
    residenceHistory,
    updatedAt: serverTimestamp(),
  });
}

export async function updateResidentServiceProfile(session, profile) {
  const { db } = requireFirebase();
  await updateDoc(doc(db, ACCOUNT_COLLECTION, session.uid), {
    displayName: profile.name,
    phone: profile.phone,
    ...(profile.block ? { block: profile.block } : {}),
    ...(profile.address ? { address: profile.address } : {}),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToResidentAccounts(onAccounts, onError) {
  const { db } = requireFirebase();
  const residentsQuery = query(
    collection(db, ACCOUNT_COLLECTION),
    where("role", "==", "resident")
  );
  return onSnapshot(residentsQuery, (snapshot) => {
    onAccounts(snapshot.docs.map((item) => {
      const account = item.data();
      const profile = profileFromAccount(account);
      return {
        uid: item.id,
        nama: profile.name || "Warga",
        blok: profile.block || "—",
        kk: profile.familyCard || "—",
        anggota: account.householdSize || 1,
        status: profile.status,
        kontak: profile.phone || "—",
      };
    }));
  }, onError);
}

export async function updateResidentStatus(uid, status) {
  const { db } = requireFirebase();
  await updateDoc(doc(db, ACCOUNT_COLLECTION, uid), {
    residencyStatus: status,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToManagedAccounts(onAccounts, onError) {
  const { db } = requireFirebase();
  return onSnapshot(collection(db, ACCOUNT_COLLECTION), (snapshot) => {
    onAccounts(snapshot.docs.map((item) => {
      const account = item.data();
      return {
        id: item.id,
        uid: item.id,
        name: account.displayName || "Pengguna",
        identity: account.nik || account.email || item.id,
        role: account.role,
        status: account.status || "Aktif",
      };
    }));
  }, onError);
}

export async function updateManagedAccount(uid, updates) {
  const { db } = requireFirebase();
  await updateDoc(doc(db, ACCOUNT_COLLECTION, uid), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteManagedAccount(uid) {
  const { db } = requireFirebase();
  await deleteDoc(doc(db, ACCOUNT_COLLECTION, uid));
}
