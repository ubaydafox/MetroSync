"use client";

import { getHODDashboardData } from "@/services/stat";
import React, { useEffect } from "react";
import Link from "next/link";
import {
  FaBook,
  FaCalendarAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaPlus,
  FaEdit,
  FaEye,
  FaUserCheck,
  FaBullhorn,
} from "react-icons/fa";
import { useGlobal } from "@/app/context/GlobalContext";

const EmptyState = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
  <div className="text-center py-10 px-4">
    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary/50 text-2xl">
      {icon}
    </div>
    <p className="font-semibold text-(--text)/70 mb-1">{title}</p>
    <p className="text-sm text-(--text)/50">{subtitle}</p>
  </div>
);

export default function HODDashboard() {
  const { user } = useGlobal();

  const [hodDashboardData, setHODDashboardData] = React.useState({
    stats: { totalCourses: 0, totalTeachers: 0, totalStudents: 0, activeSemesters: 0 },
    recentCourses: [{ id: 1, name: "Loading...", code: "...", teacher: "...", students: 0, semester: "..." }],
    teachers: [{ id: 1, name: "Loading...", department: "...", courses: 0, status: "..." }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHODDashboardData("");
        setHODDashboardData(data);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto">

        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold mb-1">
            HOD Dashboard 🏛️
          </h1>
          <p className="text-indigo-100 text-sm">
            {user?.department_name || "Manage your department efficiently"}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">Total Courses</p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">{hodDashboardData.stats.totalCourses}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FaBook className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">Total Teachers</p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">{hodDashboardData.stats.totalTeachers}</h3>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <FaChalkboardTeacher className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">Total Students</p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">{hodDashboardData.stats.totalStudents}</h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <FaUserGraduate className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">Active Semesters</p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">{hodDashboardData.stats.activeSemesters}</h3>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <FaCalendarAlt className="text-orange-600 dark:text-orange-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions — all linked now */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-(--text) mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/courses" className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors mb-3">
                  <FaPlus className="text-blue-600 dark:text-blue-400 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">Add Course</span>
              </div>
            </Link>

            <Link href="/dashboard/manage-teachers" className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors mb-3">
                  <FaUserTie className="text-green-600 dark:text-green-400 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">Add Teacher</span>
              </div>
            </Link>

            <Link href="/dashboard/manage-cr" className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors mb-3">
                  <FaUserCheck className="text-purple-600 dark:text-purple-400 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">Manage CRs</span>
              </div>
            </Link>

            <Link href="/dashboard/schedule" className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors mb-3">
                  <FaCalendarAlt className="text-orange-600 dark:text-orange-400 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">Manage Schedule</span>
              </div>
            </Link>

            <Link href="/dashboard/notices" className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition-colors mb-3">
                  <FaBullhorn className="text-yellow-600 dark:text-yellow-400 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">Post Notice</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Recent Courses */}
          <div className="bg-background rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-(--text) flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FaBook className="text-blue-600 dark:text-blue-400" />
                </div>
                Course Management
              </h2>
              <Link href="/dashboard/courses" className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm">
                View All →
              </Link>
            </div>

            {hodDashboardData.recentCourses.filter(c => c.name !== "Loading...").length > 0 ? (
              <div className="space-y-4">
                {hodDashboardData.recentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-(--text)">{course.name}</h3>
                        <p className="text-(--text)/70 text-sm mt-1">
                          {course.code} · Teacher: {course.teacher}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-(--text)/70">
                          <span className="bg-background px-3 py-1 rounded-full">{course.students} Students</span>
                          <span className="bg-background px-3 py-1 rounded-full">{course.semester}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><FaEye /></button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"><FaEdit /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<FaBook />} title="No courses yet" subtitle="Add courses to get started" />
            )}
          </div>

          {/* Teachers Management */}
          <div className="bg-background rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-(--text) flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <FaChalkboardTeacher className="text-green-600 dark:text-green-400" />
                </div>
                Teacher Management
              </h2>
              <Link href="/dashboard/manage-teachers" className="text-green-600 hover:text-green-700 font-medium transition-colors text-sm">
                View All →
              </Link>
            </div>

            {hodDashboardData.teachers.filter(t => t.name !== "Loading...").length > 0 ? (
              <div className="space-y-4">
                {hodDashboardData.teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-5 border border-green-100 dark:border-green-800/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-(--text)">{teacher.name}</h3>
                        <p className="text-(--text)/70 text-sm mt-1">{teacher.department}</p>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-(--text)/70">
                          <span className="bg-background px-3 py-1 rounded-full">{teacher.courses} Courses</span>
                          <span className="bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-3 py-1 rounded-full">{teacher.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><FaEye /></button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"><FaEdit /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<FaChalkboardTeacher />} title="No teachers yet" subtitle="Add teachers from the Teachers management page" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
