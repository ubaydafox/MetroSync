import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface Department {
  id: number;
  name: string;
  short_name: string;
  description?: string;
  hod?: string;
  teachers?: number;
  students?: number;
  courses?: number;
  // Firestore doc id (string) stored separately
  firestoreId?: string;
}

export interface CreateDepartmentData {
  name: string;
  short_name: string;
  description?: string;
  hod?: string;
}

export interface UpdateDepartmentData {
  name?: string;
  short_name?: string;
  description?: string;
  hod?: string;
}

// Fetch all departments from Firestore (public — no auth required)
export const getAllDepartments = async (): Promise<Department[]> => {
  try {
    const q = query(collection(db, "departments"), orderBy("id", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      firestoreId: d.id,
      ...(d.data() as Omit<Department, "firestoreId">),
    }));
  } catch (error) {
    console.error("Failed to fetch departments from Firestore:", error);
    return [];
  }
};

// Alias used by admin pages (same as getAllDepartments but requires token)
export const getDepartments = async (_token: string): Promise<Department[]> => {
  return getAllDepartments();
};

export const createDepartment = async (
  _token: string,
  data: CreateDepartmentData
): Promise<Department> => {
  try {
    // Get current max id
    const snapshot = await getDocs(collection(db, "departments"));
    const maxId = snapshot.docs.reduce((max, d) => {
      const id = (d.data() as Department).id || 0;
      return id > max ? id : max;
    }, 0);
    const newId = maxId + 1;

    const docRef = await addDoc(collection(db, "departments"), {
      ...data,
      id: newId,
      createdAt: serverTimestamp(),
    });

    return { ...data, id: newId, firestoreId: docRef.id };
  } catch (error) {
    toast.error("Failed to add department");
    throw error;
  }
};

export const updateDepartment = async (
  _token: string,
  id: number,
  data: UpdateDepartmentData
): Promise<Department> => {
  try {
    const snapshot = await getDocs(collection(db, "departments"));
    const target = snapshot.docs.find((d) => (d.data() as Department).id === id);
    if (!target) throw new Error("Department not found");

    await updateDoc(doc(db, "departments", target.id), {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { id, ...(target.data() as Omit<Department, "id">), ...data, firestoreId: target.id };
  } catch (error) {
    toast.error("Failed to update department");
    throw error;
  }
};

export const deleteDepartment = async (
  _token: string,
  id: number
): Promise<void> => {
  try {
    const snapshot = await getDocs(collection(db, "departments"));
    const target = snapshot.docs.find((d) => (d.data() as Department).id === id);
    if (!target) throw new Error("Department not found");

    await deleteDoc(doc(db, "departments", target.id));
  } catch (error) {
    toast.error("Failed to delete department");
    throw error;
  }
};
