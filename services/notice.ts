import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface Notice {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "important";
  course: string;
  date: string;
  author: string;
  department_id?: number;
  batch_id?: number;   // NEW: target batch (0 or undefined = all batches)
  author_role?: string; // NEW: who posted it
}

export interface CreateNoticeData {
  title: string;
  message: string;
  type: "info" | "warning" | "important";
  course?: string;
  department_id?: number;
  batch_id?: number;
  author?: string;
  author_role?: string;
}

export interface UpdateNoticeData {
  title?: string;
  message?: string;
  type?: "info" | "warning" | "important";
  course?: string;
  batch_id?: number;
}

/**
 * Fetch notices.
 * - If batchId provided: return notices for that batch OR notices with no batch (batch_id=0).
 * - If departmentId provided: return notices for that department.
 * - Otherwise: return all notices.
 */
export async function getNotices(
  _token: string,
  departmentId?: number,
  batchId?: number
): Promise<Notice[]> {
  try {
    const snap = await getDocs(collection(db, "notices"));
    let all = snap.docs.map((d) => d.data() as Notice).sort((a, b) => b.id - a.id);

    if (batchId && batchId > 0) {
      // Students/CR see their batch notices + general notices (batch_id === 0 or undefined)
      all = all.filter((n) => !n.batch_id || n.batch_id === 0 || n.batch_id === batchId);
    } else if (departmentId && departmentId > 0) {
      all = all.filter((n) => !n.department_id || n.department_id === 0 || n.department_id === departmentId);
    }

    return all;
  } catch (e) {
    toast.error("Failed to fetch notices");
    throw e;
  }
}

export async function createNotice(_token: string, data: CreateNoticeData): Promise<Notice> {
  try {
    const snap = await getDocs(collection(db, "notices"));
    const nextId = snap.size + 1;
    const now = new Date().toISOString().split("T")[0];
    const newNotice: Notice = {
      id: nextId,
      title: data.title,
      message: data.message,
      type: data.type,
      course: data.course || "",
      date: now,
      author: data.author || "Admin",
      author_role: data.author_role || "",
      department_id: data.department_id || 0,
      batch_id: data.batch_id || 0,
    };
    await setDoc(doc(db, "notices", `notice_${nextId}`), newNotice);
    toast.success("Notice created");
    return newNotice;
  } catch (e) {
    toast.error("Failed to create notice");
    throw e;
  }
}

export async function updateNotice(_token: string, id: number, data: UpdateNoticeData): Promise<Notice> {
  try {
    const ref = doc(db, "notices", `notice_${id}`);
    await updateDoc(ref, { ...data });
    const snap = await getDocs(query(collection(db, "notices"), where("id", "==", id)));
    return snap.docs[0].data() as Notice;
  } catch (e) {
    toast.error("Failed to update notice");
    throw e;
  }
}

export async function deleteNotice(_token: string, id: number): Promise<void> {
  try {
    await deleteDoc(doc(db, "notices", `notice_${id}`));
  } catch (e) {
    toast.error("Failed to delete notice");
    throw e;
  }
}
