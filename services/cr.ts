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
    // Look up the student by roll number
    const userQuery = query(collection(db, "users"), where("roll", "==", data.roll));
    const userSnap = await getDocs(userQuery);
    
    if (userSnap.empty) {
      toast.error(`No student found with registration number ${data.roll}`);
      throw new Error(`Student not found`);
    }
    
    const userDoc = userSnap.docs[0];
    const userData = userDoc.data();
    
    // Update their role in the users collection to cr
    await updateDoc(doc(db, "users", userDoc.id), { role: "cr" });

    // Ensure we have an entry in the CRs collection
    const snap = await getDocs(collection(db, "crs"));
    const nextId = snap.size + 1;
    const newCR: CR = {
      id: nextId,
      name: userData.name || data.name || "",
      email: userData.email || data.email || "",
      batch: userData.batch || "",
      batch_id: Number(userData.batch) || data.batch_id,
      roll: data.roll,
      department_id: Number(userData.department) || data.department_id,
      students: 0,
    };
    await setDoc(doc(db, "crs", `cr_${nextId}`), newCR);
    toast.success("CR assigned successfully");
    return newCR;
  } catch (e) {
    console.error("Error in createCR:", e);
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
    // Optional: restore their role back to student if found
    const crSnap = await getDocs(query(collection(db, "crs"), where("id", "==", id)));
    if (!crSnap.empty) {
      const crData = crSnap.docs[0].data();
      const userSnap = await getDocs(query(collection(db, "users"), where("roll", "==", crData.roll)));
      if (!userSnap.empty) {
        await updateDoc(doc(db, "users", userSnap.docs[0].id), { role: "student" });
      }
    }

    await deleteDoc(doc(db, "crs", `cr_${id}`));
    toast.success("CR removed successfully");
  } catch (e) {
    toast.error("Failed to delete CR");
    throw e;
  }
}
