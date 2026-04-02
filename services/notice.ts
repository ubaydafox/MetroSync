import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface Notice {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "important";
  course: string;
  date: string;
  author: string;
}

export interface CreateNoticeData {
  title: string;
  message: string;
  type: "info" | "warning" | "important";
  course?: string;
}

export interface UpdateNoticeData {
  title?: string;
  message?: string;
  type?: "info" | "warning" | "important";
  course?: string;
}

// Get all notices
export async function getNotices(token: string): Promise<Notice[]> {
  const response = await apiFetch(`notices/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to fetch notices");
    throw new Error("Failed to fetch notices");
  }

  return response.json();
}

// Create a new notice
export async function createNotice(
  token: string,
  data: CreateNoticeData
): Promise<Notice> {
  const response = await apiFetch(`notices/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to create notice");
    throw new Error("Failed to create notice");
  }

  return response.json();
}

// Update a notice
export async function updateNotice(
  token: string,
  id: number,
  data: UpdateNoticeData
): Promise<Notice> {
  const response = await apiFetch(`notices/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to update notice");
    throw new Error("Failed to update notice");
  }

  return response.json();
}

// Delete a notice
export async function deleteNotice(token: string, id: number): Promise<void> {
  const response = await apiFetch(`notices/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to delete notice");
    throw new Error("Failed to delete notice");
  }
}
