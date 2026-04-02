import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface Teacher {
  id: number;
  name: string;
  email: string;
  courses: string[];
  students: number;
}

export interface CreateTeacherData {
  name: string;
  email: string;
}

export interface UpdateTeacherData {
  name?: string;
  email?: string;
}

// Get all teachers
export async function getTeachers(token: string): Promise<Teacher[]> {
  const response = await apiFetch(`teachers/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to fetch teachers");
    throw new Error("Failed to fetch teachers");
  }

  const data = await response.json();
  // Handle both array response and object response with teachers array
  return Array.isArray(data) ? data : data.teachers || [];
}

// Create a new teacher
export async function createTeacher(
  token: string,
  data: CreateTeacherData
): Promise<Teacher> {
  const response = await apiFetch(`teachers/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to create teacher");
    throw new Error("Failed to create teacher");
  }

  const result = await response.json();
  // Handle response that wraps teacher in an object
  return result.teacher || result;
}

// Update a teacher
export async function updateTeacher(
  token: string,
  id: number,
  data: UpdateTeacherData
): Promise<Teacher> {
  const response = await apiFetch(`teachers/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to update teacher");
    throw new Error("Failed to update teacher");
  }

  const result = await response.json();
  // Handle response that wraps teacher in an object
  return result.teacher || result;
}

// Delete a teacher
export async function deleteTeacher(token: string, id: number): Promise<void> {
  const response = await apiFetch(`teachers/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to delete teacher");
    throw new Error("Failed to delete teacher");
  }
}
