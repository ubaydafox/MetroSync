import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface Schedule {
  id: number;
  start_time: string;
  end_time: string;
  day: string;
  course_id: number;
  course_name: string;
  course_code: string;
  teacher_id: number;
  teacher_name: string;
  batch_id: number;
  batch_name: string;
  department_id: number;
  department_name: string;
  room: string;
}

export interface CreateScheduleData {
  start_time: string;
  end_time: string;
  day: string;
  course: number;
  course_name: string;
  course_code: string;
  teacher: number;
  teacher_name: string;
  batch: number;
  batch_name: string;
  department: number;
  department_name: string;
  room: string;
}

export interface UpdateScheduleData {
  start_time?: string;
  end_time?: string;
  day?: string;
  course?: number;
  course_name?: string;
  course_code?: string;
  teacher?: number;
  teacher_name?: string;
  batch?: number;
  batch_name?: string;
  department?: number;
  department_name?: string;
  room?: string;
}

const docToSchedule = (snap: QuerySnapshot<DocumentData>): Schedule[] =>
  snap.docs.map((d) => d.data() as Schedule).sort((a, b) => a.id - b.id);

export const getSchedules = async (_token: string): Promise<Schedule[]> => {
  try {
    const snap = await getDocs(collection(db, "schedules"));
    return docToSchedule(snap);
  } catch (e) {
    toast.error("Failed to fetch schedules");
    throw e;
  }
};

export const getSchedulesByBatch = async (batchId: number): Promise<Schedule[]> => {
  const snap = await getDocs(query(collection(db, "schedules"), where("batch_id", "==", batchId)));
  return docToSchedule(snap);
};

export const getSchedulesByDepartment = async (deptId: number): Promise<Schedule[]> => {
  const snap = await getDocs(query(collection(db, "schedules"), where("department_id", "==", deptId)));
  return docToSchedule(snap);
};

export const getSchedulesByTeacher = async (teacherId: number): Promise<Schedule[]> => {
  const snap = await getDocs(query(collection(db, "schedules"), where("teacher_id", "==", teacherId)));
  return docToSchedule(snap);
};

// ─── Real-time listeners ───────────────────────────────────────────────────────

/**
 * Subscribe to all schedules (admin / HOD fallback).
 * Returns an unsubscribe function.
 */
export const subscribeToSchedules = (
  callback: (schedules: Schedule[]) => void
): (() => void) => {
  return onSnapshot(collection(db, "schedules"), (snap) => {
    const schedules = snap.docs.map((d) => d.data() as Schedule).sort((a, b) => a.id - b.id);
    callback(schedules);
  });
};

/**
 * Subscribe to schedules for a specific batch (students / CR).
 */
export const subscribeToSchedulesByBatch = (
  batchId: number,
  callback: (schedules: Schedule[]) => void
): (() => void) => {
  const q = query(collection(db, "schedules"), where("batch_id", "==", batchId));
  return onSnapshot(q, (snap) => {
    const schedules = snap.docs.map((d) => d.data() as Schedule).sort((a, b) => a.id - b.id);
    callback(schedules);
  });
};

/**
 * Subscribe to schedules for a specific department (HOD).
 */
export const subscribeToSchedulesByDepartment = (
  deptId: number,
  callback: (schedules: Schedule[]) => void
): (() => void) => {
  const q = query(collection(db, "schedules"), where("department_id", "==", deptId));
  return onSnapshot(q, (snap) => {
    const schedules = snap.docs.map((d) => d.data() as Schedule).sort((a, b) => a.id - b.id);
    callback(schedules);
  });
};

/**
 * Subscribe to schedules for a specific teacher.
 */
export const subscribeToSchedulesByTeacher = (
  teacherId: number,
  callback: (schedules: Schedule[]) => void
): (() => void) => {
  const q = query(collection(db, "schedules"), where("teacher_id", "==", teacherId));
  return onSnapshot(q, (snap) => {
    const schedules = snap.docs.map((d) => d.data() as Schedule).sort((a, b) => a.id - b.id);
    callback(schedules);
  });
};

// ─── Write operations (HOD only) ──────────────────────────────────────────────

export const createSchedule = async (_token: string, data: CreateScheduleData): Promise<Schedule> => {
  try {
    const snap = await getDocs(collection(db, "schedules"));
    const nextId = snap.size + 1;
    const newSchedule: Schedule = {
      id: nextId,
      start_time: data.start_time,
      end_time: data.end_time,
      day: data.day,
      course_id: data.course,
      course_name: data.course_name,
      course_code: data.course_code,
      teacher_id: data.teacher,
      teacher_name: data.teacher_name,
      batch_id: data.batch,
      batch_name: data.batch_name,
      department_id: data.department,
      department_name: data.department_name,
      room: data.room,
    };
    await setDoc(doc(db, "schedules", `schedule_${nextId}`), newSchedule);
    return newSchedule;
  } catch (e) {
    toast.error("Failed to create schedule");
    throw e;
  }
};

export const updateSchedule = async (_token: string, id: number, data: UpdateScheduleData): Promise<Schedule> => {
  try {
    const ref = doc(db, "schedules", `schedule_${id}`);
    await updateDoc(ref, { ...data });
    const snap = await getDocs(query(collection(db, "schedules"), where("id", "==", id)));
    return snap.docs[0].data() as Schedule;
  } catch (e) {
    toast.error("Failed to update schedule");
    throw e;
  }
};

export const deleteSchedule = async (_token: string, id: number): Promise<void> => {
  try {
    await deleteDoc(doc(db, "schedules", `schedule_${id}`));
  } catch (e) {
    toast.error("Failed to delete schedule");
    throw e;
  }
};
