import { getDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { requireFirebase } from "./firebase.js";

const homeForRole = {
  resident: "/warga",
  "rt-admin": "/dashboard",
  "system-admin": "/admin",
};

export function identityToAuthEmail(identity) {
  const value = String(identity || "").trim();
  if (/^\d{16}$/.test(value)) {
    return `nik-${value}@silaras-rt.web.app`;
  }
  return value.toLowerCase();
}

export async function accountSessionForUser(user) {
  const { db } = requireFirebase();
  const accountSnapshot = await getDoc(doc(db, "Account", user.uid));
  if (!accountSnapshot.exists()) {
    throw new Error("Akun belum terdaftar pada koleksi Account. Hubungi administrator.");
  }

  const account = accountSnapshot.data();
  if (!homeForRole[account.role]) {
    throw new Error("Peran akun tidak valid. Hubungi administrator.");
  }
  if (account.status === "Nonaktif") {
    throw new Error("Akun dinonaktifkan. Hubungi administrator.");
  }

  return {
    uid: user.uid,
    role: account.role,
    identity: account.nik || account.email || user.email || "",
    email: account.email || user.email || "",
    name: account.displayName || "Pengguna",
    profile: {
      name: account.displayName || "",
      email: account.contactEmail || account.email || user.email || "",
      phone: account.phone || "",
      block: account.block || "",
      address: account.address || "",
      familyCard: account.familyCard || "",
      status: account.residencyStatus || "Menunggu verifikasi",
    },
  };
}

export async function loginWithIdentity(identity, password) {
  const { auth } = requireFirebase();
  const email = identityToAuthEmail(identity);
  if (!email) throw new Error("Masukkan NIK atau email.");

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    try {
      return await accountSessionForUser(credential.user);
    } catch (error) {
      await signOut(auth);
      throw error;
    }
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      throw new Error("Pengguna tidak ditemukan.");
    }
    if (error.code === "auth/invalid-email") {
      throw new Error("Format email tidak valid.");
    }
    if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      throw new Error("NIK/email atau kata sandi salah.");
    }
    throw error;
  }
}

export async function registerResident({ nik, email, name, password }) {
  const normalizedNik = String(nik || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedName = String(name || "").trim();
  if (!/^\d{16}$/.test(normalizedNik)) {
    throw new Error("NIK harus terdiri dari 16 digit.");
  }
  if (!normalizedEmail) {
    throw new Error("Masukkan alamat email.");
  }
  if (normalizedName.length < 3) {
    throw new Error("Nama lengkap minimal 3 karakter.");
  }

  const { auth, db } = requireFirebase();
  try {
    const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    await setDoc(doc(db, "Account", credential.user.uid), {
      uid: credential.user.uid,
      nik: normalizedNik,
      email: normalizedEmail,
      displayName: normalizedName,
      role: "resident",
      status: "Active",
      createdAt: serverTimestamp(),
    });
    return await accountSessionForUser(credential.user);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("This email is already registered.");
    }
    if (error.code === "auth/weak-password") {
      throw new Error("Password must be at least 6 characters");
    }
    throw error;
  }
}

export { homeForRole };
