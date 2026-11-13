import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { requireFirebase } from "./firebase.js";

function requireResident(session) {
  if (!session?.uid || session.role !== "resident") {
    throw new Error("Hanya akun warga yang dapat mengirim laporan atau pengajuan surat.");
  }
}

function ticketId(prefix, documentId) {
  return `${prefix}-${documentId.slice(0, 8).toUpperCase()}`;
}

export async function createResidentReport(session, report) {
  requireResident(session);
  const { db } = requireFirebase();
  const reportRef = doc(collection(db, "Reports"));
  const record = {
    ticketId: ticketId("LPR", reportRef.id),
    residentUid: session.uid,
    residentNik: session.identity,
    residentName: report.nama,
    phone: report.telepon,
    category: report.kategori,
    title: report.judul,
    location: report.lokasi,
    description: report.deskripsi,
    priority: report.prioritas,
    photoCount: report.foto,
    status: "Menunggu",
    createdAt: serverTimestamp(),
  };
  await setDoc(reportRef, record);
  return { ...record, id: reportRef.id, createdAt: new Date().toISOString() };
}

export async function createResidentLetterRequest(session, request) {
  requireResident(session);
  const { db } = requireFirebase();
  const requestRef = doc(collection(db, "Letter Requests"));
  const record = {
    ticketId: ticketId("SUR", requestRef.id),
    residentUid: session.uid,
    residentNik: session.identity,
    residentName: request.nama,
    phone: request.telepon,
    address: request.alamat,
    block: request.blok,
    letterType: request.jenis,
    purpose: request.keperluan,
    attachmentCount: request.jumlahLampiran,
    status: "Menunggu",
    correctionNote: "",
    createdAt: serverTimestamp(),
  };
  await setDoc(requestRef, record);
  return { ...record, id: requestRef.id, createdAt: new Date().toISOString() };
}

export function subscribeToRtSubmissions(onReports, onLetters, onError) {
  const { db } = requireFirebase();
  const reportsQuery = query(collection(db, "Reports"), orderBy("createdAt", "desc"));
  const lettersQuery = query(collection(db, "Letter Requests"), orderBy("createdAt", "desc"));
  const unsubscribeReports = onSnapshot(reportsQuery, onReports, onError);
  const unsubscribeLetters = onSnapshot(lettersQuery, onLetters, onError);

  return () => {
    unsubscribeReports();
    unsubscribeLetters();
  };
}

export function subscribeToResidentSubmissions(session, onReports, onLetters, onError) {
  requireResident(session);
  const { db } = requireFirebase();
  const reportsQuery = query(
    collection(db, "Reports"),
    where("residentUid", "==", session.uid)
  );
  const lettersQuery = query(
    collection(db, "Letter Requests"),
    where("residentUid", "==", session.uid)
  );
  const unsubscribeReports = onSnapshot(reportsQuery, onReports, onError);
  const unsubscribeLetters = onSnapshot(lettersQuery, onLetters, onError);

  return () => {
    unsubscribeReports();
    unsubscribeLetters();
  };
}

export async function updateRtSubmission(collectionName, documentId, updates) {
  const { db } = requireFirebase();
  if (!["Reports", "Letter Requests"].includes(collectionName)) {
    throw new Error("Koleksi pengajuan tidak dikenal.");
  }
  await updateDoc(doc(db, collectionName, documentId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}
