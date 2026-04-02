import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface HOD {
  id: number;
  name: string;
  email: string;
  department: string;
  teachers?: number;
  students?: number;
}

export interface CreateHODData {
  teacher_id: number;
  department_id: number;
}

export interface UpdateHODData {
  teacher_id?: number;
  department_id?: number;
}

// Get all HODs
export async function getHODs(token: string): Promise<HOD[]> {
  const response = await apiFetch(`hods/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to fetch HODs");
    throw new Error("Failed to fetch HODs");
  }

  const data = await response.json();
  // Handle both array response and object response with hods array
  return Array.isArray(data) ? data : data.hods || [];
}

// Create a new HOD
export async function createHOD(
  token: string,
  data: CreateHODData
): Promise<HOD> {
  const response = await apiFetch(`hods/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to create HOD");
    throw new Error("Failed to create HOD");
  }

  const result = await response.json();
  // Handle response that wraps HOD in an object
  return result.hod || result;
}

// Update a HOD
export async function updateHOD(
  token: string,
  id: number,
  data: UpdateHODData
): Promise<HOD> {
  const response = await apiFetch(`hods/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to update HOD");
    throw new Error("Failed to update HOD");
  }

  const result = await response.json();
  // Handle response that wraps HOD in an object
  return result.hod || result;
}

// Delete a HOD
export async function deleteHOD(token: string, id: number): Promise<void> {
  const response = await apiFetch(`hods/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to delete HOD");
    throw new Error("Failed to delete HOD");
  }
}
