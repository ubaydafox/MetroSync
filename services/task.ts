import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface Task {
  id: number;
  title: string;
  type: string;
  due_date: string;
  points: number;
  description: string;
  course: number;
  created_by: string;
  created_at: string;
}

export interface CreateTaskData {
  title: string;
  type: string;
  due_date: string;
  points: number;
  description: string;
  course: number;
}

export interface UpdateTaskData {
  title: string;
  type: string;
  due_date: string;
  points: number;
  description: string;
}

// Get all tasks for a specific course
export async function getCourseTasks(
  token: string,
  courseId: string
): Promise<Task[]> {
  const response = await apiFetch(`courses/${courseId}/tasks/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to fetch tasks");
    throw new Error("Failed to fetch tasks");
  }

  const data = await response.json();
  // Handle both array response and object with tasks property
  return Array.isArray(data) ? data : (data.tasks || []);
}

// Create a new task
export async function createTask(
  token: string,
  data: CreateTaskData
): Promise<Task> {
  const response = await apiFetch(`courses/${data.course}/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to create task");
    throw new Error("Failed to create task");
  }

  return response.json();
}

// Update a task
export async function updateTask(
  token: string,
  courseId: string,
  taskId: number,
  data: UpdateTaskData
): Promise<Task> {
  const response = await apiFetch(`courses/${courseId}/tasks/${taskId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to update task");
    throw new Error("Failed to update task");
  }

  return response.json();
}

// Delete a task
export async function deleteTask(
  token: string,
  courseId: string,
  taskId: number
): Promise<void> {
  const response = await apiFetch(`courses/${courseId}/tasks/${taskId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to delete task");
    throw new Error("Failed to delete task");
  }
}
