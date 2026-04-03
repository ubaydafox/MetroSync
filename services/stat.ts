/**
 * services/stat.ts — Firestore-backed dashboard data
 *
 * Replaces all REST API calls with Firestore queries.
 * All functions derive stats from the seeded collections.
 */

import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/utils/firebase";

// ─── Type Definitions (preserved from original) ───────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns today's day name in lowercase, matching seed data format */
function todayDayName(): string {
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][
    new Date().getDay()
  ];
}

/** Get current user's Firestore profile */
async function getCurrentUserProfile() {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;
  const snap = await getDoc(doc(db, "users", firebaseUser.uid));
  return snap.exists() ? snap.data() : null;
}

/** Task priority based on due date proximity */
function taskPriority(dueDate: string): "high" | "medium" | "low" {
  const days = Math.ceil(
    (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 2) return "high";
  if (days <= 7) return "medium";
  return "low";
}

// ─── Student Dashboard ────────────────────────────────────────────────────────

export const getStudentDashboardData = async (
  _token: string
): Promise<StudentDashboardData> => {
  const profile = await getCurrentUserProfile();

  // Determine batch_id from user profile
  const batchId = profile?.batch ? Number(profile.batch) : null;
  const today = todayDayName();

  // 1. Courses enrolled in this batch
  let courseIds: number[] = [];
  let courseNames: Record<number, string> = {};
  if (batchId) {
    const coursesSnap = await getDocs(
      query(collection(db, "courses"), where("batch_id", "==", batchId))
    );
    courseIds = coursesSnap.docs.map((d) => d.data().id as number);
    coursesSnap.docs.forEach((d) => {
      const data = d.data();
      courseNames[data.id as number] = data.code as string;
    });
  }

  // 2. Today's schedule for this batch (filter day in JS to avoid composite index)
  let todayClasses: TodayClass[] = [];
  if (batchId) {
    const schedSnap = await getDocs(
      query(collection(db, "schedules"), where("batch_id", "==", batchId))
    );
    todayClasses = schedSnap.docs
      .map((d) => d.data())
      .filter((s) => s.day === today)
      .map((s) => ({
        id: s.id as number,
        title: s.course_name as string,
        time: `${s.start_time} – ${s.end_time}`,
        room: s.room as string,
        instructor: s.teacher_name as string,
        course_code: s.course_code as string,
      }));
  }

  // 3. Pending tasks (due in the future) for this batch's courses
  let pendingTasks: PendingTask[] = [];
  if (courseIds.length > 0) {
    const tasksSnap = await getDocs(collection(db, "tasks"));
    const now = new Date().toISOString().split("T")[0];
    pendingTasks = tasksSnap.docs
      .map((d) => d.data())
      .filter((t) => courseIds.includes(t.course_id as number) && t.due_date >= now)
      .map((t) => ({
        id: t.id as number,
        title: t.title as string,
        due_date: t.due_date as string,
        course: courseNames[t.course_id as number] || `Course ${t.course_id}`,
        priority: taskPriority(t.due_date as string),
      }))
      .sort((a, b) => a.due_date.localeCompare(b.due_date))
      .slice(0, 5);
  }

  // 4. Recent notices
  const noticesSnap = await getDocs(collection(db, "notices"));
  const recentNotices = noticesSnap.docs
    .map((d) => d.data())
    .sort((a, b) => (b.date as string).localeCompare(a.date as string))
    .slice(0, 4)
    .map((n) => ({
      id: n.id as number,
      title: n.title as string,
      date: n.date as string,
      course: (n.course as string) || "General",
    }));

  return {
    stats: {
      courses: courseIds.length,
      upcoming_classes: todayClasses.length,
      pending_tasks: pendingTasks.length,
      unread_notices: recentNotices.length,
    },
    today_classes: todayClasses,
    pending_tasks: pendingTasks,
    recent_notices: recentNotices,
  };
};

// ─── Teacher Dashboard ────────────────────────────────────────────────────────

export const getTeacherDashboardData = async (
  _token: string
): Promise<TeacherDashboardData> => {
  const profile = await getCurrentUserProfile();
  const today = todayDayName();

  // Find teacher record by email
  let teacherId: number | null = null;
  if (profile?.email) {
    const teacherSnap = await getDocs(
      query(collection(db, "teachers"), where("email", "==", profile.email))
    );
    if (!teacherSnap.empty) {
      teacherId = teacherSnap.docs[0].data().id as number;
    }
  }

  // Courses taught by this teacher
  let myCourses: TeacherCourse[] = [];
  let courseIds: number[] = [];
  if (teacherId !== null) {
    const coursesSnap = await getDocs(
      query(collection(db, "courses"), where("teacher_id", "==", teacherId))
    );
    courseIds = coursesSnap.docs.map((d) => d.data().id as number);
    myCourses = coursesSnap.docs.map((d) => {
      const c = d.data();
      return {
        id: c.id as number,
        name: c.name as string,
        code: c.code as string,
        students: c.student_count as number,
        section: c.department as string,
        next_class: "Check schedule",
      };
    });
  }

  // Today's classes for this teacher (filter day in JS to avoid composite index)
  let upcomingClasses: TeacherClass[] = [];
  if (teacherId !== null) {
    const schedSnap = await getDocs(
      query(collection(db, "schedules"), where("teacher_id", "==", teacherId))
    );
    upcomingClasses = schedSnap.docs
      .map((d) => d.data())
      .filter((s) => s.day === today)
      .map((s) => ({
        id: s.id as number,
        course: s.course_name as string,
        section: s.batch_name as string,
        time: `${s.start_time} – ${s.end_time}`,
        room: s.room as string,
        topic: s.course_code as string,
      }));
  }

  const totalStudents = myCourses.reduce((sum, c) => sum + c.students, 0);

  return {
    stats: {
      total_courses: myCourses.length,
      total_students: totalStudents,
      upcoming_classes: upcomingClasses.length,
    },
    my_courses: myCourses,
    upcoming_classes: upcomingClasses,
  };
};

// ─── HOD Dashboard ────────────────────────────────────────────────────────────

export const getHODDashboardData = async (_token: string) => {
  const profile = await getCurrentUserProfile();
  const deptId = profile?.department ? Number(profile.department) : null;

  let dept = null;
  let teachers: unknown[] = [];
  let courses: unknown[] = [];

  if (deptId) {
    const deptSnap = await getDoc(doc(db, "departments", `dept_${deptId}`));
    dept = deptSnap.exists() ? deptSnap.data() : null;

    const [teacherSnap, courseSnap] = await Promise.all([
      getDocs(query(collection(db, "teachers"), where("department_id", "==", deptId))),
      getDocs(query(collection(db, "courses"), where("department_id", "==", deptId))),
    ]);
    teachers = teacherSnap.docs.map((d) => d.data());
    courses = courseSnap.docs.map((d) => d.data());
  }

  return {
    department: dept,
    stats: {
      teachers: teachers.length,
      courses: courses.length,
    },
    teachers,
    courses,
  };
};

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export const getAdminDashboardData = async (
  _token: string
): Promise<AdminDashboardData> => {
  const [deptSnap, hodSnap, userSnap, batchSnap, teacherSnap] =
    await Promise.all([
      getDocs(collection(db, "departments")),
      getDocs(collection(db, "hods")),
      getDocs(collection(db, "users")),
      getDocs(collection(db, "batches")),
      getDocs(collection(db, "teachers")),
    ]);

  const depts = deptSnap.docs.map((d) => d.data());
  const hods = hodSnap.docs.map((d) => d.data());
  const teachers = teacherSnap.docs.map((d) => d.data());

  // Build teacher count per department
  const teacherCountByDept: Record<number, number> = {};
  teachers.forEach((t) => {
    const did = t.department_id as number;
    teacherCountByDept[did] = (teacherCountByDept[did] || 0) + 1;
  });

  // Build HOD name per department
  const hodByDept: Record<number, string> = {};
  hods.forEach((h) => {
    hodByDept[h.department_id as number] = h.name as string;
  });

  const adminDepts: AdminDepartment[] = depts.map((d) => ({
    id: d.id as number,
    name: d.name as string,
    short_name: d.short_name as string,
    hod_name: hodByDept[d.id as number] || "Not assigned",
    teacher_count: teacherCountByDept[d.id as number] || 0,
    student_count: 0, // Can be computed from batch.students if needed
    status: "active",
  }));

  const adminHods: AdminHOD[] = hods.map((h) => {
    const dept = depts.find((d) => d.id === h.department_id);
    return {
      id: h.id as number,
      name: h.name as string,
      department_name: dept ? (dept.name as string) : (h.department as string),
      email: h.email as string,
      status: "active",
    };
  });

  return {
    stats: {
      total_departments: deptSnap.size,
      total_hods: hodSnap.size,
      total_users: userSnap.size,
      total_batches: batchSnap.size,
    },
    departments: adminDepts,
    hods: adminHods,
  };
};
