import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { jenisSurat } from "./data.js";
import { requireFirebase } from "./firebase.js";

const LETTER_TYPES_COLLECTION = "LetterTypes";

export function subscribeToManagedLetterTypes(onTypes, onError) {
  const { db } = requireFirebase();
  return onSnapshot(collection(db, LETTER_TYPES_COLLECTION), (snapshot) => {
    const types = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    onTypes(types.sort((first, second) => first.nama.localeCompare(second.nama, "id")));
  }, onError);
}

export async function initializeManagedLetterTypes() {
  const { db } = requireFirebase();
  const typeCollection = collection(db, LETTER_TYPES_COLLECTION);
  const snapshot = await getDocs(typeCollection);
  if (!snapshot.empty) return;

  const batch = writeBatch(db);
  jenisSurat.forEach((type) => {
    const { id, ...data } = type;
    batch.set(doc(db, LETTER_TYPES_COLLECTION, id), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
}

export async function saveManagedLetterType(type, existingId) {
  const { db } = requireFirebase();
  const typeRef = existingId
    ? doc(db, LETTER_TYPES_COLLECTION, existingId)
    : doc(collection(db, LETTER_TYPES_COLLECTION));
  const { id: _id, ...data } = type;
  await setDoc(typeRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  return typeRef.id;
}

export async function deleteManagedLetterType(typeId) {
  const { db } = requireFirebase();
  await deleteDoc(doc(db, LETTER_TYPES_COLLECTION, typeId));
}
