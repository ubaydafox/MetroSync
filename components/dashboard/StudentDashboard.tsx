"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaBell,
} from "react-icons/fa";
import { getStudentDashboardData, StudentDashboardData } from "@/services/stat";

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudentDashboardData("");
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
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error || "Failed to load dashboard data"}</p>
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

  const { stats, today_classes, recent_notices } = dashboardData;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your studies today
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Courses Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Courses
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.courses}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <FaBook className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Today's Classes Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Today&apos;s Classes
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.upcoming_classes}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <FaCalendarAlt className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Unread Notices Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Unread Notices
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.unread_notices}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <FaBell className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/courses"
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors mb-3">
                  <FaBook className="text-blue-600 text-lg" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  My Courses
                </span>
              </div>
            </Link>

            <Link
              href="/dashboard/schedule"
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors mb-3">
                  <FaCalendarAlt className="text-green-600 text-lg" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Schedule
                </span>
              </div>
            </Link>

            <Link
              href="/dashboard/notices"
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors mb-3">
                  <FaBell className="text-purple-600 text-lg" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Notices
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FaClock className="text-blue-600" />
                </div>
                Today&apos;s Schedule
              </h2>
              <a
                href="/dashboard/schedule"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View all →
              </a>
            </div>

            {today_classes.length > 0 ? (
              <div className="space-y-4">
                {today_classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-xl bg-blue-100 mr-4">
                        <FaBook className="text-blue-600 text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {cls.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                          <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                            <FaClock className="text-xs" /> {cls.time}
                          </span>
                          <span className="bg-white px-3 py-1 rounded-full">
                            {cls.room}
                          </span>
                          <span className="bg-white px-3 py-1 rounded-full">
                            {cls.instructor}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-gray-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FaCalendarAlt className="text-gray-400 text-xl" />
                </div>
                <p className="text-gray-500">No classes scheduled for today</p>
              </div>
            )}
          </div>

          {/* Recent Notices */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <FaBell className="text-purple-600" />
                </div>
                Recent Notices
              </h2>
              <a
                href="/dashboard/notices"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                View all →
              </a>
            </div>

            <div className="space-y-4">
              {recent_notices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="p-3 rounded-xl bg-purple-100 mr-4">
                      <FaBell className="text-purple-600 text-lg" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {notice.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="bg-white px-3 py-1 rounded-full">
                          {notice.course}
                        </span>
                        <span className="text-gray-500">{notice.date}</span>
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
