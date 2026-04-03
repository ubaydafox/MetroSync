import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface CourseNotice {
  id: number;
  title: string;
  message: string;
  author: string;
  date: string;
  course_id: number;
}

export interface CreateCourseNoticeData {
  title: string;
  message: string;
  course: number;
  author?: string;
}

export interface UpdateCourseNoticeData {
  title: string;
  message: string;
}

export async function getCourseNotices(_token: string, courseId: string): Promise<CourseNotice[]> {
  try {
    const snap = await getDocs(query(collection(db, "course_notices"), where("course_id", "==", Number(courseId))));
    return snap.docs.map((d) => d.data() as CourseNotice).sort((a, b) => b.id - a.id);
  } catch (e) {
    toast.error("Failed to fetch course notices");
    throw e;
  }
}

export async function createCourseNotice(_token: string, data: CreateCourseNoticeData): Promise<CourseNotice> {
  try {
    const snap = await getDocs(collection(db, "course_notices"));
    const nextId = snap.size + 1;
    const now = new Date().toISOString().split("T")[0];
    const newNotice: CourseNotice = {
      id: nextId,
      title: data.title,
      message: data.message,
      author: data.author || "Teacher",
      date: now,
      course_id: data.course,
    };
    await setDoc(doc(db, "course_notices", `cn_${nextId}`), newNotice);
    toast.success("Notice posted");
    return newNotice;
  } catch (e) {
    toast.error("Failed to create course notice");
    throw e;
  }
}

export async function updateCourseNotice(_token: string, courseId: string, noticeId: number, data: UpdateCourseNoticeData): Promise<CourseNotice> {
  try {
    const ref = doc(db, "course_notices", `cn_${noticeId}`);
    await updateDoc(ref, { ...data });
    const snap = await getDocs(query(collection(db, "course_notices"), where("id", "==", noticeId)));
    return snap.docs[0].data() as CourseNotice;
  } catch (e) {
    toast.error("Failed to update course notice");
    throw e;
  }
}

export async function deleteCourseNotice(_token: string, courseId: string, noticeId: number): Promise<void> {
  try {
    await deleteDoc(doc(db, "course_notices", `cn_${noticeId}`));
  } catch (e) {
    toast.error("Failed to delete course notice");
    throw e;
  }
}
