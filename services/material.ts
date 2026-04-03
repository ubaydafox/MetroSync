import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface Material {
  id: number;
  title: string;
  type: string;
  link: string;
  uploaded_by: string;
  date: string;
  course_id: number;
}

export interface CreateMaterialData {
  title: string;
  type: string;
  link: string;
  course: number;
}

export interface UpdateMaterialData {
  title: string;
  type: string;
  link: string;
}

export async function getCourseMaterials(_token: string, courseId: string): Promise<Material[]> {
  try {
    const snap = await getDocs(query(collection(db, "materials"), where("course_id", "==", Number(courseId))));
    return snap.docs.map((d) => d.data() as Material).sort((a, b) => a.id - b.id);
  } catch (e) {
    toast.error("Failed to fetch materials");
    throw e;
  }
}

export async function createMaterial(_token: string, data: CreateMaterialData): Promise<Material> {
  try {
    const snap = await getDocs(collection(db, "materials"));
    const nextId = snap.size + 1;
    const now = new Date().toISOString().split("T")[0];
    const newMaterial: Material = {
      id: nextId,
      title: data.title,
      type: data.type,
      link: data.link,
      course_id: data.course,
      uploaded_by: "Teacher",
      date: now,
    };
    await setDoc(doc(db, "materials", `material_${nextId}`), newMaterial);
    toast.success("Material added");
    return newMaterial;
  } catch (e) {
    toast.error("Failed to create material");
    throw e;
  }
}

export async function updateMaterial(_token: string, courseId: string, materialId: number, data: UpdateMaterialData): Promise<Material> {
  try {
    const ref = doc(db, "materials", `material_${materialId}`);
    await updateDoc(ref, { ...data });
    const snap = await getDocs(query(collection(db, "materials"), where("id", "==", materialId)));
    return snap.docs[0].data() as Material;
  } catch (e) {
    toast.error("Failed to update material");
    throw e;
  }
}

export async function deleteMaterial(_token: string, courseId: string, materialId: number): Promise<void> {
  try {
    await deleteDoc(doc(db, "materials", `material_${materialId}`));
  } catch (e) {
    toast.error("Failed to delete material");
    throw e;
  }
}
