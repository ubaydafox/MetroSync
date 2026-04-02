import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface Batch {
  id: number;
  name: string;
  year: number;
  department: string;
  department_id?: number;
  students: number;
  created_at: string;
}

export interface CreateBatchData {
  name: string;
  year: number;
  department_id: number;
}

export interface UpdateBatchData {
  name?: string;
  year?: number;
  department_id?: number;
}

// Get all batches
export async function getBatches(token: string): Promise<Batch[]> {
  const response = await apiFetch(`batches/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to fetch batches");
    throw new Error("Failed to fetch batches");
  }

  const data = await response.json();
  // Handle both array response and object response with batches array
  return Array.isArray(data) ? data : data.batches || [];
}

// Create a new batch
export async function createBatch(
  token: string,
  data: CreateBatchData
): Promise<Batch> {
  const response = await apiFetch(`batches/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to create batch");
    throw new Error("Failed to create batch");
  }

  const result = await response.json();
  // Handle response that wraps batch in an object
  return result.batch || result;
}

// Update a batch
export async function updateBatch(
  token: string,
  id: number,
  data: UpdateBatchData
): Promise<Batch> {
  const response = await apiFetch(`batches/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to update batch");
    throw new Error("Failed to update batch");
  }

  const result = await response.json();
  // Handle response that wraps batch in an object
  return result.batch || result;
}

// Delete a batch
export async function deleteBatch(token: string, id: number): Promise<void> {
  const response = await apiFetch(`batches/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to delete batch");
    throw new Error("Failed to delete batch");
  }
}
