"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaBell,
  FaIdBadge,
  FaUserGraduate,
  FaBullhorn,
} from "react-icons/fa";
import { getStudentDashboardData, StudentDashboardData } from "@/services/stat";
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

export default function StudentDashboard() {
  const { user, departments } = useGlobal();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-(--text)/70 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent p-6">
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

  const { stats, today_classes, recent_notices } = dashboardData;

  const deptName = departments.find(d => d.id === Number(user?.department))?.name || user?.department_name || "—";
  const isToday = new Date().getDay() >= 0 && new Date().getDay() <= 4; // Sun-Thu

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto">

        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋
              </h1>
              <p className="text-blue-100 text-sm">
                Here&apos;s what&apos;s happening with your studies today
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {user?.batch_name && (
                <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <FaUserGraduate className="text-xs" /> {user.batch_name}
                </span>
              )}
              {user?.roll && (
                <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <FaIdBadge className="text-xs" /> {user.roll}
                </span>
              )}
              {user?.role === "cr" && (
                <span className="flex items-center gap-1.5 bg-yellow-400/30 px-3 py-1.5 rounded-full">
                  ⭐ Class Representative
                </span>
              )}
            </div>
          </div>
          {deptName && deptName !== "—" && (
            <p className="mt-3 text-blue-200 text-xs">📍 {deptName}</p>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">Total Courses</p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">{stats.courses}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FaBook className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">Today&apos;s Classes</p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">{stats.upcoming_classes}</h3>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <FaCalendarAlt className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">Unread Notices</p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">{stats.unread_notices}</h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <FaBell className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-(--text) mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/dashboard/courses" className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors mb-3">
                  <FaBook className="text-blue-600 dark:text-blue-400 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">My Courses</span>
              </div>
            </Link>

            <Link href="/dashboard/schedule" className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors mb-3">
                  <FaCalendarAlt className="text-green-600 dark:text-green-400 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">Schedule</span>
              </div>
            </Link>

            <Link href="/dashboard/notices" className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors mb-3">
                  <FaBell className="text-purple-600 dark:text-purple-400 text-lg" />
                </div>
                <span className="text-sm font-medium text-(--text)/80">
                  Notices
                  {user?.role === "cr" && <span className="ml-1 text-yellow-500">✎</span>}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div className="bg-background rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-(--text) flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FaClock className="text-blue-600 dark:text-blue-400" />
                </div>
                Today&apos;s Schedule
              </h2>
              <Link href="/dashboard/schedule" className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm">
                View all →
              </Link>
            </div>

            {today_classes.length > 0 ? (
              <div className="space-y-4">
                {today_classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 mr-4">
                        <FaBook className="text-blue-600 dark:text-blue-400 text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-(--text)">{cls.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-(--text)/70">
                          <span className="flex items-center gap-1.5 bg-background px-3 py-1 rounded-full">
                            <FaClock className="text-xs" /> {cls.time}
                          </span>
                          <span className="bg-background px-3 py-1 rounded-full">{cls.room}</span>
                          <span className="bg-background px-3 py-1 rounded-full">{cls.instructor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FaCalendarAlt />}
                title={isToday ? "No classes today" : "Weekend — no classes"}
                subtitle="Enjoy your free time or check the full schedule"
              />
            )}
          </div>

          {/* Recent Notices */}
          <div className="bg-background rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-(--text) flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <FaBell className="text-purple-600 dark:text-purple-400" />
                </div>
                Recent Notices
              </h2>
              <Link href="/dashboard/notices" className="text-purple-600 hover:text-purple-700 font-medium transition-colors text-sm">
                View all →
              </Link>
            </div>

            {recent_notices.length > 0 ? (
              <div className="space-y-4">
                {recent_notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl p-5 border border-purple-100 dark:border-purple-800/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start">
                      <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 mr-4">
                        <FaBell className="text-purple-600 dark:text-purple-400 text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-(--text)">{notice.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-(--text)/70">
                          <span className="bg-background px-3 py-1 rounded-full">{notice.course}</span>
                          <span className="text-(--text)/60">{notice.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FaBullhorn />}
                title="No notices yet"
                subtitle="Your teacher or HOD hasn't posted any notices"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
