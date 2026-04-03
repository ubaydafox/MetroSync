import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface Batch {
  id: number;
  name: string;
  year: number;
  department: string;
  department_id?: number;
  students: number;
  created_at: string;
  // Firestore doc id stored separately
  firestoreId?: string;
}

export interface CreateBatchData {
  name: string;
  year: number;
  department_id: number;
}

export interface UpdateBatchData {
  name?: string;
  year?: number;
  department_id?: number;
}

// Get all batches from Firestore
export async function getBatches(_token: string): Promise<Batch[]> {
  try {
    const snapshot = await getDocs(collection(db, "batches"));
    const batches = snapshot.docs.map((d) => ({
      firestoreId: d.id,
      ...(d.data() as Omit<Batch, "firestoreId">),
    }));
    return batches.sort((a, b) => a.id - b.id);
  } catch (error) {
    toast.error("Failed to fetch batches");
    throw error;
  }
}

// Get batches filtered by department_id (used on signup/onboarding)
export async function getBatchesByDepartment(departmentId: number): Promise<Batch[]> {
  try {
    const q = query(
      collection(db, "batches"),
      where("department_id", "==", departmentId)
    );
    const snapshot = await getDocs(q);
    const batches = snapshot.docs.map((d) => ({
      firestoreId: d.id,
      ...(d.data() as Omit<Batch, "firestoreId">),
    }));
    // Sort by year descending in JS (avoids Firestore composite index requirement)
    return batches.sort((a, b) => b.year - a.year);
  } catch (error) {
    console.error("Failed to fetch batches by department:", error);
    return [];
  }
}

// Create a new batch
export async function createBatch(
  _token: string,
  data: CreateBatchData
): Promise<Batch> {
  try {
    // Get current max id
    const snapshot = await getDocs(collection(db, "batches"));
    const maxId = snapshot.docs.reduce((max, d) => {
      const id = (d.data() as Batch).id || 0;
      return id > max ? id : max;
    }, 0);
    const newId = maxId + 1;

    const batchData = {
      ...data,
      id: newId,
      department: "",
      students: 0,
      created_at: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "batches"), batchData);
    return { ...batchData, firestoreId: docRef.id };
  } catch (error) {
    toast.error("Failed to create batch");
    throw error;
  }
}

// Update a batch
export async function updateBatch(
  _token: string,
  id: number,
  data: UpdateBatchData
): Promise<Batch> {
  try {
    const snapshot = await getDocs(collection(db, "batches"));
    const target = snapshot.docs.find((d) => (d.data() as Batch).id === id);
    if (!target) throw new Error("Batch not found");

    await updateDoc(doc(db, "batches", target.id), {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { id, ...(target.data() as Omit<Batch, "id">), ...data, firestoreId: target.id };
  } catch (error) {
    toast.error("Failed to update batch");
    throw error;
  }
}

// Delete a batch
export async function deleteBatch(_token: string, id: number): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, "batches"));
    const target = snapshot.docs.find((d) => (d.data() as Batch).id === id);
    if (!target) throw new Error("Batch not found");

    await deleteDoc(doc(db, "batches", target.id));
  } catch (error) {
    toast.error("Failed to delete batch");
    throw error;
  }
}
