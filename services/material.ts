import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface Material {
  id: number;
  title: string;
  type: string;
  link: string;
  uploaded_by: string;
  date: string;
  course: number;
}

export interface CreateMaterialData {
  title: string;
  type: string;
  link: string;
  course: number;
}

export interface UpdateMaterialData {
  title: string;
  type: string;
  link: string;
}

// Get all materials for a specific course
export async function getCourseMaterials(
  token: string,
  courseId: string
): Promise<Material[]> {
  const response = await apiFetch(`courses/${courseId}/materials/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to fetch materials");
    throw new Error("Failed to fetch materials");
  }

  const data = await response.json();
  // Handle both array response and object with materials property
  return Array.isArray(data) ? data : (data.materials || []);
}

// Create a new material
export async function createMaterial(
  token: string,
  data: CreateMaterialData
): Promise<Material> {
  const response = await apiFetch(`courses/${data.course}/materials/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to create material");
    throw new Error("Failed to create material");
  }

  return response.json();
}

// Update a material
export async function updateMaterial(
  token: string,
  courseId: string,
  materialId: number,
  data: UpdateMaterialData
): Promise<Material> {
  const response = await apiFetch(
    `courses/${courseId}/materials/${materialId}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to update material");
    throw new Error("Failed to update material");
  }

  return response.json();
}

// Delete a material
export async function deleteMaterial(
  token: string,
  courseId: string,
  materialId: number
): Promise<void> {
  const response = await apiFetch(
    `courses/${courseId}/materials/${materialId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    toast.error((await response.json()).error || "Failed to delete material");
    throw new Error("Failed to delete material");
  }
}
