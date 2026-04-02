import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface Student {
  id: number;
  name: string;
  roll: string;
  email: string;
}

export interface CreateStudentData {
  roll: string;
  course: number;
}

export interface UpdateStudentData {
  // Reserved for future updates
}

// Get all students enrolled in a course
export const getCourseStudents = async (
  token: string,
  courseId: string
): Promise<Student[]> => {
  const response = await apiFetch(`courses/${courseId}/students/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.error || "Failed to fetch students");
    throw new Error(errorData.error || "Failed to fetch students");
  }

  const data = await response.json();
  return data.students || [];
};

// Add a student to a course
export const addStudentToCourse = async (
  token: string,
  data: CreateStudentData
): Promise<Student> => {
  const response = await apiFetch(`courses/${data.course}/students/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to add student");
    throw new Error("Failed to add student");
  }

  const responseData = await response.json();
  return responseData.student || responseData;
};

// Remove a student from a course
export const removeStudentFromCourse = async (
  token: string,
  courseId: string,
  studentId: number
): Promise<void> => {
  const response = await apiFetch(
    `courses/${courseId}/students/${studentId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.error || "Failed to remove student");
    throw new Error(errorData.error || "Failed to remove student");
  }
};
