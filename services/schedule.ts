import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";

// ─── Time overlap helper ───────────────────────────────────────────────────────
/**
 * Returns true if [startA, endA) overlaps with [startB, endB).
 * Times are "HH:MM" or "HH:MM:SS" strings (24-hour).
 */
function timesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  // Normalise to "HH:MM" for comparison
  const norm = (t: string) => t.substring(0, 5);
  return norm(startA) < norm(endB) && norm(endA) > norm(startB);
}

// ─── Conflict types ────────────────────────────────────────────────────────────
export interface ConflictResult {
  type: "room" | "teacher" | "batch";
  message: string;
  conflictingSchedule: Schedule;
}

/**
 * Check for scheduling conflicts before creating or updating a schedule.
 *
 * @param data     The candidate slot (day, start_time, end_time, teacher_id, batch_id, room)
 * @param excludeId  If editing, pass the schedule's own ID so it doesn't conflict with itself
 * @returns        Array of ConflictResult — empty means no conflicts
 */
export async function checkScheduleConflicts(
  data: {
    day: string;
    start_time: string;
    end_time: string;
    teacher_id: number;
    batch_id: number;
    room: string;
  },
  excludeId?: number
): Promise<ConflictResult[]> {
  // Fetch all schedules for the same day (server-side filter, avoids full scan)
  const dayLower = data.day.toLowerCase();
  const snap = await getDocs(
    query(collection(db, "schedules"), where("day", "==", dayLower))
  );

  const conflicts: ConflictResult[] = [];

  for (const docSnap of snap.docs) {
    const s = docSnap.data() as Schedule;

    // Skip self when editing
    if (excludeId !== undefined && s.id === excludeId) continue;

    // Check time overlap for this slot
    if (!timesOverlap(data.start_time, data.end_time, s.start_time, s.end_time)) continue;

    // 1. Room conflict (case-insensitive, trimmed)
    if (
      s.room.trim().toLowerCase() === data.room.trim().toLowerCase()
    ) {
      conflicts.push({
        type: "room",
        message: `Room "${data.room}" is already booked on ${s.day.charAt(0).toUpperCase() + s.day.slice(1)} from ${s.start_time.substring(0, 5)}–${s.end_time.substring(0, 5)} for "${s.course_name}" (${s.batch_name}).`,
        conflictingSchedule: s,
      });
    }

    // 2. Teacher conflict
    if (s.teacher_id === data.teacher_id) {
      conflicts.push({
        type: "teacher",
        message: `${s.teacher_name} is already teaching "${s.course_name}" on ${s.day.charAt(0).toUpperCase() + s.day.slice(1)} from ${s.start_time.substring(0, 5)}–${s.end_time.substring(0, 5)}.`,
        conflictingSchedule: s,
      });
    }

    // 3. Batch conflict
    if (s.batch_id === data.batch_id) {
      conflicts.push({
        type: "batch",
        message: `${s.batch_name} already has "${s.course_name}" on ${s.day.charAt(0).toUpperCase() + s.day.slice(1)} from ${s.start_time.substring(0, 5)}–${s.end_time.substring(0, 5)}.`,
        conflictingSchedule: s,
      });
    }
  }

  return conflicts;
}


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
