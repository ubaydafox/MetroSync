"use client";

import { getHODDashboardData } from "@/services/stat";
import React, { useEffect } from "react";
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
} from "react-icons/fa";

export default function HODDashboard() {


  const [hodDashboardData, setHODDashboardData] = React.useState({
    stats: {
      totalCourses: 0,
      totalTeachers: 0,
      totalStudents: 0,
      activeSemesters: 0,
    },
    recentCourses: [
      {
        id: 1,
        name: "Loading...",
        code: "Loading...",
        teacher: "Loading...",
        students: 0,
        semester: "Loading...",
      },
    ],
    teachers: [
      {
        id: 1,
        name: "Loading...",
        department: "Loading...",
        courses: 0,
        status: "Loading...",
      },
    ],
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-(--text) mb-2">
            HOD Dashboard
          </h1>
          <p className="text-(--text)/70">Manage your department efficiently</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Courses Card */}
          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">
                  Total Courses
                </p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">
                  {hodDashboardData.stats.totalCourses}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FaBook className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>

          {/* Total Teachers Card */}
          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">
                  Total Teachers
                </p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">
                  {hodDashboardData.stats.totalTeachers}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <FaChalkboardTeacher className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </div>

          {/* Total Students Card */}
          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">
                  Total Students
                </p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">
                  {hodDashboardData.stats.totalStudents}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <FaUserGraduate className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
            </div>
          </div>

          {/* Active Semesters Card */}
          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">
                  Active Semesters
                </p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">
                  {hodDashboardData.stats.activeSemesters}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <FaCalendarAlt className="text-orange-600 dark:text-orange-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-(--text) mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors mb-3">
                  <FaPlus className="text-blue-600 dark:text-blue-400 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">
                  Add Course
                </span>
              </div>
            </button>

            <button className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors mb-3">
                  <FaUserTie className="text-green-600 dark:text-green-400 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">
                  Add Teacher
                </span>
              </div>
            </button>

            <button className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors mb-3">
                  <FaUserCheck className="text-purple-600 dark:text-purple-400 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">
                  Add CR
                </span>
              </div>
            </button>

            <button className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors mb-3">
                  <FaCalendarAlt className="text-orange-600 dark:text-orange-400 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">
                  Manage Schedule
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content - Full Width Layout */}
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
              <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {hodDashboardData.recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-(--text) text-lg">
                        {course.name}
                      </h3>
                      <p className="text-(--text)/70 text-sm mt-1">
                        Code: {course.code} | Teacher: {course.teacher}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-(--text)/70">
                        <span className="bg-background px-3 py-1 rounded-full">
                          {course.students} Students
                        </span>
                        <span className="bg-background px-3 py-1 rounded-full">
                          {course.semester}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                        <FaEye />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              <button className="text-green-600 hover:text-green-700 font-medium transition-colors">
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {hodDashboardData.teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-5 border border-green-100 dark:border-green-800/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-(--text) text-lg">
                        {teacher.name}
                      </h3>
                      <p className="text-(--text)/70 text-sm mt-1">
                        {teacher.department}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-(--text)/70">
                        <span className="bg-background px-3 py-1 rounded-full">
                          {teacher.courses} Courses
                        </span>
                        <span className="bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-3 py-1 rounded-full">
                          {teacher.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                        <FaEye />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
