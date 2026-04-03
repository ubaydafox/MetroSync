import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface HOD {
  id: number;
  name: string;
  email: string;
  department: string;
  department_id?: number;
  phone?: string;
  office?: string;
  teachers?: number;
  students?: number;
}

export interface CreateHODData {
  teacher_id: number;
  department_id: number;
}

export interface UpdateHODData {
  teacher_id?: number;
  department_id?: number;
}

export async function getHODs(_token: string): Promise<HOD[]> {
  try {
    const snap = await getDocs(collection(db, "hods"));
    return snap.docs.map((d) => d.data() as HOD).sort((a, b) => a.id - b.id);
  } catch (e) {
    toast.error("Failed to fetch HODs");
    throw e;
  }
}

export async function createHOD(_token: string, data: CreateHODData): Promise<HOD> {
  try {
    const snap = await getDocs(collection(db, "hods"));
    const nextId = snap.size + 1;
    const newHOD: HOD = {
      id: nextId,
      name: "",
      email: "",
      department: "",
      department_id: data.department_id,
    };
    await setDoc(doc(db, "hods", `hod_${nextId}`), newHOD);
    toast.success("HOD assigned");
    return newHOD;
  } catch (e) {
    toast.error("Failed to create HOD");
    throw e;
  }
}

export async function updateHOD(_token: string, id: number, data: UpdateHODData): Promise<HOD> {
  try {
    const ref = doc(db, "hods", `hod_${id}`);
    await updateDoc(ref, { ...data });
    const snap = await getDocs(query(collection(db, "hods"), where("id", "==", id)));
    return snap.docs[0].data() as HOD;
  } catch (e) {
    toast.error("Failed to update HOD");
    throw e;
  }
}

export async function deleteHOD(_token: string, id: number): Promise<void> {
  try {
    await deleteDoc(doc(db, "hods", `hod_${id}`));
  } catch (e) {
    toast.error("Failed to delete HOD");
    throw e;
  }
}
