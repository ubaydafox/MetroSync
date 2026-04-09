import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
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

export const getSchedules = async (_token: string): Promise<Schedule[]> => {
  try {
    const snap = await getDocs(collection(db, "schedules"));
    return snap.docs.map((d) => d.data() as Schedule).sort((a, b) => a.id - b.id);
  } catch (e) {
    toast.error("Failed to fetch schedules");
    throw e;
  }
};

export const getSchedulesByBatch = async (batchId: number): Promise<Schedule[]> => {
  const snap = await getDocs(query(collection(db, "schedules"), where("batch_id", "==", batchId)));
  return snap.docs.map((d) => d.data() as Schedule).sort((a, b) => a.id - b.id);
};

export const getSchedulesByDepartment = async (deptId: number): Promise<Schedule[]> => {
  const snap = await getDocs(query(collection(db, "schedules"), where("department_id", "==", deptId)));
  return snap.docs.map((d) => d.data() as Schedule).sort((a, b) => a.id - b.id);
};

export const getSchedulesByTeacher = async (teacherId: number): Promise<Schedule[]> => {
  const snap = await getDocs(query(collection(db, "schedules"), where("teacher_id", "==", teacherId)));
  return snap.docs.map((d) => d.data() as Schedule).sort((a, b) => a.id - b.id);
};

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
