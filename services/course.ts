import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  teacher_name: string;
  student_count: number;
  schedule: string;
}

export interface CourseDetails {
  id: number;
  code: string;
  name: string;
  credits: number;
  teacher: string;
  teacher_name: string;
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
  credits: number;
  teacher?: number;
  batch?: number;
  department?: number;
  room?: string;
  description?: string;
}

export interface UpdateCourseData {
  code?: string;
  name?: string;
  credits?: number;
  teacher?: number;
  room?: string;
  description?: string;
}

export const getCourses = async (token: string): Promise<Course[]> => {
  const res = await apiFetch(`courses/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to fetch courses");
    throw new Error("Failed to fetch courses");
  }

  const data = await res.json();
  // Handle both direct array and object with courses property
  return Array.isArray(data) ? data : data.courses || [];
};

export const getCourseById = async (
  token: string,
  courseId: string
): Promise<CourseDetails> => {
  const res = await apiFetch(`courses/${courseId}/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to fetch course details");
    throw new Error("Failed to fetch course details");
  }

  const course = await res.json();
  return course;
};

export const createCourse = async (
  token: string,
  data: CreateCourseData
): Promise<Course> => {
  const res = await apiFetch(`courses/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to create course");
    throw new Error("Failed to create course");
  }

  const responseData = await res.json();
  // Handle nested response structure: {message: "...", course: {...}}
  return responseData.course || responseData;
};

export const updateCourse = async (
  token: string,
  courseId: number,
  data: UpdateCourseData
): Promise<Course> => {
  const res = await apiFetch(`courses/${courseId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to update course");
    throw new Error("Failed to update course");
  }

  const responseData = await res.json();
  // Handle nested response structure: {message: "...", course: {...}}
  return responseData.course || responseData;
};

export const deleteCourse = async (
  token: string,
  courseId: number
): Promise<void> => {
  const res = await apiFetch(`courses/${courseId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to delete course");
    throw new Error("Failed to delete course");
  }
};
