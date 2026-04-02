import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface Schedule {
  id: number;
  start_time: string;
  end_time: string;
  day: string;
  course_name: string;
  course_code: string;
  teacher_name: string;
  batch_name: string;
  department_name: string;
  room: string;
}

export interface CreateScheduleData {
  start_time: string;
  end_time: string;
  day: string;
  course: number;
  teacher: number;
  batch: number;
  department: number;
  room: string;
}

export interface UpdateScheduleData {
  start_time?: string;
  end_time?: string;
  day?: string;
  course?: number;
  teacher?: number;
  batch?: number;
  department?: number;
  room?: string;
}

export const getSchedules = async (token: string): Promise<Schedule[]> => {
  const res = await apiFetch(`schedules/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to fetch schedules");
    throw new Error("Failed to fetch schedules");
  }

  const data = await res.json();
  // Handle both direct array and object with schedules property
  return Array.isArray(data) ? data : data.schedules || [];
};

export const createSchedule = async (
  token: string,
  data: CreateScheduleData
): Promise<Schedule> => {
  const res = await apiFetch(`schedules/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to create schedule");
    throw new Error("Failed to create schedule");
  }

  const responseData = await res.json();
  // Handle nested response structure: {message: "...", schedule: {...}}
  return responseData.schedule || responseData;
};

export const updateSchedule = async (
  token: string,
  id: number,
  data: UpdateScheduleData
): Promise<Schedule> => {
  const res = await apiFetch(`schedules/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to update schedule");
    throw new Error("Failed to update schedule");
  }

  const responseData = await res.json();
  // Handle nested response structure: {message: "...", schedule: {...}}
  return responseData.schedule || responseData;
};

export const deleteSchedule = async (
  token: string,
  id: number
): Promise<void> => {
  const res = await apiFetch(`schedules/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to delete schedule");
    throw new Error("Failed to delete schedule");
  }
};
