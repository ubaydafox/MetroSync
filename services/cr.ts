import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface CR {
  id: number;
  name: string;
  email: string;
  batch: string;
  roll: string;
  students: number;
}

export interface CreateCRData {
  roll: string;
}

export interface UpdateCRData {
  roll: string;
}

// Get all CRs
export async function getCRs(token: string): Promise<CR[]> {
  const response = await apiFetch(`crs/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to fetch CRs");
    throw new Error("Failed to fetch CRs");
  }

  const data = await response.json();
  // Handle both array response and object response with crs array
  return Array.isArray(data) ? data : data.crs || [];
}

// Create a new CR
export async function createCR(token: string, data: CreateCRData): Promise<CR> {
  const response = await apiFetch(`crs/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to create CR");
    throw new Error("Failed to create CR");
  }

  const result = await response.json();
  // Handle response that wraps CR in an object
  return result.cr || result;
}

// Update a CR
export async function updateCR(
  token: string,
  id: number,
  data: UpdateCRData
): Promise<CR> {
  const response = await apiFetch(`crs/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to update CR");
    throw new Error("Failed to update CR");
  }

  const result = await response.json();
  // Handle response that wraps CR in an object
  return result.cr || result;
}

// Delete a CR
export async function deleteCR(token: string, id: number): Promise<void> {
  const response = await apiFetch(`crs/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to delete CR");
    throw new Error("Failed to delete CR");
  }
}
