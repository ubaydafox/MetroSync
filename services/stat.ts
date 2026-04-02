import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";

export interface StudentStats {
  courses: number;
  upcoming_classes: number;
  pending_tasks: number;
  unread_notices: number;
}

export interface TodayClass {
  id: number;
  title: string;
  time: string;
  room: string;
  instructor: string;
  course_code?: string;
}

export interface PendingTask {
  id: number;
  title: string;
  due_date: string;
  course: string;
  priority: "high" | "medium" | "low";
}

export interface StudentDashboardData {
  stats: StudentStats;
  today_classes: TodayClass[];
  pending_tasks: PendingTask[];
  recent_notices: Array<{
    id: number;
    title: string;
    date: string;
    course: string;
  }>;
}

export interface TeacherStats {
  total_courses: number;
  total_students: number;
  upcoming_classes: number;
}

export interface TeacherCourse {
  id: number;
  name: string;
  code: string;
  students: number;
  section: string;
  next_class: string;
}

export interface TeacherClass {
  id: number;
  course: string;
  section: string;
  time: string;
  room: string;
  topic: string;
}

export interface TeacherDashboardData {
  stats: TeacherStats;
  my_courses: TeacherCourse[];
  upcoming_classes: TeacherClass[];
}

export const getStudentDashboardData = async (
  token: string
): Promise<StudentDashboardData> => {
  const res = await apiFetch(`student/dashboard/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    toast.error(
      (await res.json()).error || "Failed to fetch student dashboard data"
    );
    throw new Error("Failed to fetch student dashboard data");
  }
  const result = await res.json();
  return result;
};

export const getTeacherDashboardData = async (
  token: string
): Promise<TeacherDashboardData> => {
  const res = await apiFetch(`teacher/dashboard/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    toast.error(
      (await res.json()).error || "Failed to fetch teacher dashboard data"
    );
    throw new Error("Failed to fetch teacher dashboard data");
  }
  const result = await res.json();
  return result;
};

export const getHODDashboardData = async (token: string) => {
  const res = await apiFetch(`hod/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    toast.error((await res.json()).error || "Failed to fetch stats");
    throw new Error("Failed to fetch stats");
  }
  const result = await res.json();
  return result;
};

export interface AdminStats {
  total_departments: number;
  total_hods: number;
  total_users: number;
  total_batches: number;
}

export interface AdminDepartment {
  id: number;
  name: string;
  short_name: string;
  hod_name: string;
  teacher_count: number;
  student_count: number;
  status: string;
}

export interface AdminHOD {
  id: number;
  name: string;
  department_name: string;
  email: string;
  status: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  departments: AdminDepartment[];
  hods: AdminHOD[];
}

export const getAdminDashboardData = async (
  token: string
): Promise<AdminDashboardData> => {
  const res = await apiFetch(`admin/dashboard/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    toast.error(
      (await res.json()).error || "Failed to fetch admin dashboard data"
    );
    throw new Error("Failed to fetch admin dashboard data");
  }
  const result = await res.json();
  return result;
};
