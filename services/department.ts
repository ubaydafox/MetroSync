import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface Department {
  id: number;
  name: string;
  short_name: string;
  description?: string;
  hod?: string;
  teachers?: number;
  students?: number;
  courses?: number;
}

export interface CreateDepartmentData {
  name: string;
  short_name: string;
  description?: string;
  hod?: number;
}

export interface UpdateDepartmentData {
  name?: string;
  short_name?: string;
  description?: string;
  hod?: number;
}

export const getAllDepartments = async (): Promise<Department[]> => {
  const res = await apiFetch(`department/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch departments");
  }
  const data = await res.json();
  // Handle both array response and object response with departments array
  return Array.isArray(data) ? data : data.departments || [];
};

export const getDepartments = async (token: string): Promise<Department[]> => {
  const res = await apiFetch(`departments/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to fetch departments");
    throw new Error("Failed to fetch departments");
  }
  const data = await res.json();
  // Handle both array response and object response with departments array
  return Array.isArray(data) ? data : data.departments || [];
};

export const createDepartment = async (
  token: string,
  data: CreateDepartmentData
): Promise<Department> => {
  const res = await apiFetch(`departments/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to add department");
    throw new Error("Failed to add department");
  }
  const result = await res.json();
  // Handle response that wraps department in an object
  return result.department || result;
};

export const updateDepartment = async (
  token: string,
  id: number,
  data: UpdateDepartmentData
): Promise<Department> => {
  const res = await apiFetch(`departments/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to update department");
    throw new Error("Failed to update department");
  }
  const result = await res.json();
  // Handle response that wraps department in an object
  return result.department || result;
};

export const deleteDepartment = async (
  token: string,
  id: number
): Promise<void> => {
  const res = await apiFetch(`departments/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to delete department");
    throw new Error("Failed to delete department");
  }
};
