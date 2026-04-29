import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface Notice {
  id: string;          // Issue 3: Now Firestore auto-generated document ID (string)
  title: string;
  message: string;
  type: "info" | "warning" | "important";
  course: string;
  date: string;
  author: string;
  author_uid?: string; // Issue 6: Track who posted for ownership checks
  department_id?: number;
  batch_id?: number;
  author_role?: string;
}

export interface CreateNoticeData {
  title: string;
  message: string;
  type: "info" | "warning" | "important";
  course?: string;
  department_id?: number;
  batch_id?: number;
  author?: string;
  author_uid?: string;
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
 * Issue 5: Real-time notices with onSnapshot — no more getDocs + JS filter.
 * Returns an unsubscribe function to clean up the listener.
 */
export function subscribeToNotices(
  onData: (notices: Notice[]) => void,
  options?: { batchId?: number; departmentId?: number }
): Unsubscribe {
  let q = query(collection(db, "notices"));

  // Use Firestore server-side filtering where possible
  if (options?.batchId && options.batchId > 0) {
    // Students see their batch + general (batch_id === 0) notices
    // Note: Firestore can't do OR on the same field in one query,
    // so we fetch both independently and merge.
    const batchQ = query(
      collection(db, "notices"),
      where("batch_id", "==", options.batchId)
    );
    const generalQ = query(
      collection(db, "notices"),
      where("batch_id", "==", 0)
    );

    let batchNotices: Notice[] = [];
    let generalNotices: Notice[] = [];
    let unsubBatch: Unsubscribe | null = null;
    let unsubGeneral: Unsubscribe | null = null;

    const merge = () => {
      const seen = new Set<string>();
      const merged: Notice[] = [];
      [...batchNotices, ...generalNotices].forEach((n) => {
        if (!seen.has(n.id)) { seen.add(n.id); merged.push(n); }
      });
      merged.sort((a, b) => b.date.localeCompare(a.date));
      onData(merged);
    };

    unsubBatch = onSnapshot(batchQ, (snap) => {
      batchNotices = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notice));
      merge();
    });
    unsubGeneral = onSnapshot(generalQ, (snap) => {
      generalNotices = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notice));
      merge();
    });

    return () => { unsubBatch?.(); unsubGeneral?.(); };
  }

  if (options?.departmentId && options.departmentId > 0) {
    q = query(
      collection(db, "notices"),
      where("department_id", "==", options.departmentId)
    );
  }

  return onSnapshot(q, (snap) => {
    const notices = snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Notice))
      .sort((a, b) => b.date.localeCompare(a.date));
    onData(notices);
  });
}

/**
 * One-shot fetch (kept for dashboard widgets that don't need live updates)
 */
export async function getNotices(
  _token: string,
  departmentId?: number,
  batchId?: number
): Promise<Notice[]> {
  try {
    const snap = await getDocs(collection(db, "notices"));
    let all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notice))
      .sort((a, b) => b.date.localeCompare(a.date));

    if (batchId && batchId > 0) {
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

/**
 * Issue 3: Use addDoc for auto-generated safe IDs — no more snap.size + 1 race condition.
 */
export async function createNotice(_token: string, data: CreateNoticeData): Promise<Notice> {
  try {
    const now = new Date().toISOString().split("T")[0];
    const payload = {
      title: data.title,
      message: data.message,
      type: data.type,
      course: data.course || "",
      date: now,
      author: data.author || "Admin",
      author_uid: data.author_uid || "",
      author_role: data.author_role || "",
      department_id: data.department_id || 0,
      batch_id: data.batch_id || 0,
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, "notices"), payload);
    toast.success("Notice created");
    return { id: ref.id, ...payload };
  } catch (e) {
    toast.error("Failed to create notice");
    throw e;
  }
}

export async function updateNotice(_token: string, id: string, data: UpdateNoticeData): Promise<void> {
  try {
    await updateDoc(doc(db, "notices", id), { ...data });
  } catch (e) {
    toast.error("Failed to update notice");
    throw e;
  }
}

export async function deleteNotice(_token: string, id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "notices", id));
  } catch (e) {
    toast.error("Failed to delete notice");
    throw e;
  }
}
