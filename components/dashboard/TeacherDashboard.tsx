"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaUserGraduate,
} from "react-icons/fa";
import { getTeacherDashboardData, TeacherDashboardData } from "@/services/stat";

export default function TeacherDashboard() {
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTeacherDashboardData("");
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-(--text)/70 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-background rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-(--text) mb-2">Error Loading Dashboard</h2>
          <p className="text-(--text)/70 mb-4">{error || "Failed to load dashboard data"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, my_courses, upcoming_classes } = dashboardData;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-(--text) mb-2">
            Teacher Dashboard
          </h1>
          <p className="text-(--text)/70">Manage your courses and students</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">My Courses</p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">
                  {stats.total_courses}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <FaBook className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">
                  Total Students
                </p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">
                  {stats.total_students}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <FaUserGraduate className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">
                  Today&apos;s Classes
                </p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">
                  {stats.upcoming_classes}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <FaCalendarAlt className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-(--text) mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/dashboard/courses"
              className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors mb-3">
                  <FaBook className="text-blue-600 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">
                  My Courses
                </span>
              </div>
            </Link>

            <Link
              href="/dashboard/schedule"
              className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors mb-3">
                  <FaCalendarAlt className="text-purple-600 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">
                  Schedule
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Courses */}
          <div className="bg-background rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-(--text) flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FaBook className="text-blue-600" />
                </div>
                My Courses
              </h2>
              <Link
                href="/dashboard/courses"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              {my_courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-(--text) text-lg">
                        {course.name}
                      </h3>
                      <p className="text-sm text-(--text)/70 mt-1">
                        {course.code} - Section {course.section}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <span className="bg-background px-3 py-1 rounded-full text-(--text)/70">
                          <FaUserGraduate className="inline mr-1" />{" "}
                          {course.students} students
                        </span>
                        <span className="bg-background px-3 py-1 rounded-full text-(--text)/70">
                          <FaClock className="inline mr-1" /> {course.next_class}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Classes */}
          <div className="bg-background rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-(--text) flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <FaCalendarAlt className="text-purple-600" />
                </div>
                Today&apos;s Classes
              </h2>
            </div>

            <div className="space-y-4">
              {upcoming_classes.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="p-3 rounded-xl bg-purple-100 mr-4">
                      <FaBook className="text-purple-600 text-lg" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-(--text)">
                        {cls.course} - Section {cls.section}
                      </h3>
                      <p className="text-sm text-(--text)/70 mt-1">
                        Topic: {cls.topic}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-sm text-(--text)/70">
                        <span className="bg-background px-3 py-1 rounded-full">
                          <FaClock className="inline mr-1" /> {cls.time}
                        </span>
                        <span className="bg-background px-3 py-1 rounded-full">
                          {cls.room}
                        </span>
                      </div>
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
