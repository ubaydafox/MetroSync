import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface UpdateProfileData {
  name: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

// Update user profile (name)
export const updateProfile = async (
  token: string,
  data: UpdateProfileData
): Promise<{ message: string; user: any }> => {
  const res = await apiFetch(`user/update-profile/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed to update profile" }));
    toast.error(errorData.error || "Failed to update profile");
    throw new Error(errorData.error || "Failed to update profile");
  }

  return res.json();
};

// Change password
export const changePassword = async (
  token: string,
  data: ChangePasswordData
): Promise<{ message: string }> => {
  const res = await apiFetch(`user/change-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed to change password" }));
    toast.error(errorData.error || "Failed to change password");
    throw new Error(errorData.error || "Failed to change password");
  }

  return res.json();
};

// Get all HOD users
export const getHODs = async (token: string): Promise<User[]> => {
  const res = await apiFetch(`users/?role=hod`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to fetch HODs");
    throw new Error("Failed to fetch HODs");
  }

  const data = await res.json();
  // Handle both array response and object response with users array
  return Array.isArray(data) ? data : data.users || [];
};
