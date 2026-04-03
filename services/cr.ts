import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface CR {
  id: number;
  name: string;
  email: string;
  batch: string;
  batch_id?: number;
  roll: string;
  department_id?: number;
  students: number;
}

export interface CreateCRData {
  roll: string;
  name?: string;
  email?: string;
  batch_id?: number;
  department_id?: number;
}

export interface UpdateCRData {
  roll: string;
  name?: string;
  email?: string;
}

export async function getCRs(_token: string): Promise<CR[]> {
  try {
    const snap = await getDocs(collection(db, "crs"));
    return snap.docs.map((d) => d.data() as CR).sort((a, b) => a.id - b.id);
  } catch (e) {
    toast.error("Failed to fetch CRs");
    throw e;
  }
}

export async function createCR(_token: string, data: CreateCRData): Promise<CR> {
  try {
    const snap = await getDocs(collection(db, "crs"));
    const nextId = snap.size + 1;
    const newCR: CR = {
      id: nextId,
      name: data.name || "",
      email: data.email || "",
      batch: "",
      batch_id: data.batch_id,
      roll: data.roll,
      department_id: data.department_id,
      students: 0,
    };
    await setDoc(doc(db, "crs", `cr_${nextId}`), newCR);
    toast.success("CR assigned");
    return newCR;
  } catch (e) {
    toast.error("Failed to create CR");
    throw e;
  }
}

export async function updateCR(_token: string, id: number, data: UpdateCRData): Promise<CR> {
  try {
    const ref = doc(db, "crs", `cr_${id}`);
    await updateDoc(ref, { ...data });
    const snap = await getDocs(query(collection(db, "crs"), where("id", "==", id)));
    return snap.docs[0].data() as CR;
  } catch (e) {
    toast.error("Failed to update CR");
    throw e;
  }
}

export async function deleteCR(_token: string, id: number): Promise<void> {
  try {
    await deleteDoc(doc(db, "crs", `cr_${id}`));
  } catch (e) {
    toast.error("Failed to delete CR");
    throw e;
  }
}
