import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface Student {
  id: string;
  name: string;
  roll: string;
  email: string;
  batch?: string;
  batch_id?: number;
  department_id?: number;
}

export interface CreateStudentData {
  roll: string;
  course: number;
}

// Get students enrolled in a batch (proxy for course students)
export const getCourseStudents = async (_token: string, courseId: string): Promise<Student[]> => {
  try {
    // Get the course to find batch_id
    const courseSnap = await getDocs(query(collection(db, "courses"), where("id", "==", Number(courseId))));
    if (courseSnap.empty) return [];
    const course = courseSnap.docs[0].data();

    // Get users in that batch
    const usersSnap = await getDocs(query(collection(db, "users"), where("batch", "==", String(course.batch_id))));
    return usersSnap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name || "",
        roll: data.roll || "",
        email: data.email || "",
        batch: data.batch || "",
        batch_id: Number(data.batch) || 0,
        department_id: Number(data.department) || 0,
      };
    });
  } catch (e) {
    toast.error("Failed to fetch students");
    throw e;
  }
};

// Add student — in this Firebase-only architecture, students register themselves
// This is kept for API compatibility but is a no-op
export const addStudentToCourse = async (_token: string, _data: CreateStudentData): Promise<Student> => {
  toast.info("Students self-enroll by registering with their batch ID.");
  return { id: "", name: "", roll: "", email: "" };
};

// Remove student — no-op in self-enroll architecture
export const removeStudentFromCourse = async (_token: string, _courseId: string, _studentId: number): Promise<void> => {
  toast.info("Students manage their own enrollment.");
};
