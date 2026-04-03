import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  teacher_id: number;
  teacher_name: string;
  batch_id: number;
  department_id: number;
  department: string;
  room: string;
  description: string;
  student_count: number;
  material_count: number;
  task_count: number;
  notice_count: number;
  active_task_count: number;
}

export interface CreateCourseData {
  code: string;
  name: string;
  credits?: number;
  teacher_id?: number;
  teacher?: number;
  batch_id?: number;
  department_id?: number;
  description?: string;
}

export interface UpdateCourseData {
  code?: string;
  name?: string;
  credits?: number;
  teacher_id?: number;
  teacher?: number;
  batch_id?: number;
  description?: string;
}

// Get all courses
export async function getCourses(_token: string): Promise<Course[]> {
  const snap = await getDocs(collection(db, "courses"));
  return snap.docs.map((d) => d.data() as Course).sort((a, b) => a.id - b.id);
}

// Get courses by batch
export async function getCoursesByBatch(_token: string, batchId: number): Promise<Course[]> {
  const snap = await getDocs(query(collection(db, "courses"), where("batch_id", "==", batchId)));
  return snap.docs.map((d) => d.data() as Course);
}

// Get courses by department
export async function getCoursesByDepartment(_token: string, deptId: number): Promise<Course[]> {
  const snap = await getDocs(query(collection(db, "courses"), where("department_id", "==", deptId)));
  return snap.docs.map((d) => d.data() as Course);
}

// Get a single course by id
export async function getCourse(_token: string, courseId: string | number): Promise<Course> {
  const snap = await getDocs(query(collection(db, "courses"), where("id", "==", Number(courseId))));
  if (snap.empty) throw new Error("Course not found");
  return snap.docs[0].data() as Course;
}

// Create a new course
export async function createCourse(_token: string, data: CreateCourseData): Promise<Course> {
  try {
    const allSnap = await getDocs(collection(db, "courses"));
    const nextId = allSnap.size + 1;
    const newCourse: Course = {
      id: nextId,
      code: data.code,
      name: data.name,
      credits: data.credits || 3,
      teacher_id: data.teacher_id || 0,
      teacher_name: "",
      batch_id: data.batch_id || 0,
      department_id: data.department_id || 0,
      department: "",
      room: "",
      description: "",
      student_count: 0,
      material_count: 0,
      task_count: 0,
      notice_count: 0,
      active_task_count: 0,
    };
    await addDoc(collection(db, "courses"), newCourse);
    toast.success("Course created successfully");
    return newCourse;
  } catch (e) {
    toast.error("Failed to create course");
    throw e;
  }
}

// Update a course
export async function updateCourse(_token: string, courseId: string | number, data: UpdateCourseData): Promise<Course> {
  const snap = await getDocs(query(collection(db, "courses"), where("id", "==", Number(courseId))));
  if (snap.empty) throw new Error("Course not found");
  await updateDoc(snap.docs[0].ref, { ...data });
  return { ...snap.docs[0].data(), ...data } as Course;
}

// Delete a course
export async function deleteCourse(_token: string, courseId: string | number): Promise<void> {
  const snap = await getDocs(query(collection(db, "courses"), where("id", "==", Number(courseId))));
  if (!snap.empty) await deleteDoc(snap.docs[0].ref);
}

// Alias for CourseDetails (same shape as Course)
export type CourseDetails = Course;

// Alias for getCourse — used by the course details page
export const getCourseById = getCourse;
