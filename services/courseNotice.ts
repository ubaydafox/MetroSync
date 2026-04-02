import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface CourseNotice {
  id: number;
  title: string;
  message: string;
  author: string;
  date: string;
  course: number;
}

export interface CreateCourseNoticeData {
  title: string;
  message: string;
  course: number;
}

export interface UpdateCourseNoticeData {
  title: string;
  message: string;
}

// Get all notices for a specific course
export async function getCourseNotices(
  token: string,
  courseId: string
): Promise<CourseNotice[]> {
  const response = await apiFetch(`courses/${courseId}/notices/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    toast.error(
      (await response.json()).error || "Failed to fetch course notices"
    );
    throw new Error("Failed to fetch course notices");
  }

  const data = await response.json();
  return data.notices || [];
}

// Create a new course notice
export async function createCourseNotice(
  token: string,
  data: CreateCourseNoticeData
): Promise<CourseNotice> {
  const response = await apiFetch(`courses/${data.course}/notices/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error(
      (await response.json()).error || "Failed to create course notice"
    );
    throw new Error("Failed to create course notice");
  }

  const responseData = await response.json();
  return responseData.notice || responseData;
}

// Update a course notice
export async function updateCourseNotice(
  token: string,
  courseId: string,
  noticeId: number,
  data: UpdateCourseNoticeData
): Promise<CourseNotice> {
  const response = await apiFetch(`courses/${courseId}/notices/${noticeId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error(
      (await response.json()).error || "Failed to update course notice"
    );
    throw new Error("Failed to update course notice");
  }

  const responseData = await response.json();
  return responseData.notice || responseData;
}

// Delete a course notice
export async function deleteCourseNotice(
  token: string,
  courseId: string,
  noticeId: number
): Promise<void> {
  const response = await apiFetch(`courses/${courseId}/notices/${noticeId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    toast.error(
      (await response.json()).error || "Failed to delete course notice"
    );
    throw new Error("Failed to delete course notice");
  }
}
