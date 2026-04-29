"use client";

import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import {
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaBell,
  FaIdBadge,
  FaUserGraduate,
  FaBullhorn,
  FaCheck,
  FaCheckCircle,
  FaUndo,
} from "react-icons/fa";
import { getStudentDashboardData, StudentDashboardData, PendingTask } from "@/services/stat";
import { markTaskDone, unmarkTaskDone, getCompletedTaskIds } from "@/services/task";
import { useGlobal } from "@/app/context/GlobalContext";
import { toast } from "react-toastify";

const EmptyState = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
  <div className="text-center py-10 px-4">
    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary/50 text-2xl">
      {icon}
    </div>
    <p className="font-semibold text-(--text)/70 mb-1">{title}</p>
    <p className="text-sm text-(--text)/50">{subtitle}</p>
  </div>
);

// ─── Next Class Countdown ──────────────────────────────────────────────────────
function getCountdown(timeStr: string): string {
  const [hourStr, minStr] = timeStr.split(":");
  const now = new Date();
  const classTime = new Date();
  classTime.setHours(Number(hourStr), Number(minStr), 0, 0);
  const diffMs = classTime.getTime() - now.getTime();
  if (diffMs <= 0) return "In progress";
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `Starts in ${diffMins}m`;
  const h = Math.floor(diffMins / 60);
  const m = diffMins % 60;
  return `Starts in ${h}h ${m > 0 ? `${m}m` : ""}`;
}

function ClassCountdownBadge({ startTime }: { startTime: string }) {
  const [label, setLabel] = useState(() => getCountdown(startTime));

  useEffect(() => {
    const interval = setInterval(() => setLabel(getCountdown(startTime)), 60000);
    return () => clearInterval(interval);
  }, [startTime]);

  const isLive = label === "In progress";
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        isLive
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      }`}
    >
      {isLive ? "🟢 Live" : `⏱ ${label}`}
    </span>
  );
}

// ─── Task Card ─────────────────────────────────────────────────────────────────
const priorityConfig = {
  high:   { color: "border-red-400",    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",    label: "High" },
  medium: { color: "border-yellow-400", badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", label: "Medium" },
  low:    { color: "border-green-400",  badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", label: "Low" },
};

function TaskCard({
  task,
  done,
  onToggle,
}: {
  task: PendingTask;
  done: boolean;
  onToggle: (id: number, done: boolean) => void;
}) {
  const [toggling, setToggling] = useState(false);
  const cfg = priorityConfig[task.priority];

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(task.id, done);
    setToggling(false);
  };

  return (
    <div
      className={`border-l-4 ${cfg.color} rounded-xl p-4 transition-all duration-300 ${
        done
          ? "bg-background-light/40 opacity-70"
          : "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors disabled:cursor-wait ${
            done
              ? "bg-green-500 border-green-500 text-white"
              : "border-(--primary)/40 hover:border-green-400"
          }`}
          title={done ? "Mark as pending" : "Mark as done"}
        >
          {toggling ? (
            <div className="w-2.5 h-2.5 rounded-full border-2 border-current animate-spin" />
          ) : done ? (
            <FaCheck className="text-xs" />
          ) : null}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className={`font-semibold text-sm text-(--text) ${done ? "line-through opacity-60" : ""}`}>
              {task.title}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>{cfg.label}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-(--text)/60 flex-wrap">
            <span className="bg-background px-2 py-0.5 rounded-full">{task.course}</span>
            <span className="flex items-center gap-1">
              <FaClock className="text-xs" /> Due {task.due_date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { user, departments } = useGlobal();
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudentDashboardData("");
        setDashboardData(data);

        // Load which tasks are already done for this user
        if (data.pending_tasks.length > 0) {
          const ids = await getCompletedTaskIds(data.pending_tasks.map((t) => t.id));
          setCompletedTaskIds(ids);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleTaskToggle = useCallback(async (taskId: number, currentlyDone: boolean) => {
    try {
      if (currentlyDone) {
        await unmarkTaskDone(taskId);
        setCompletedTaskIds((prev) => { const s = new Set(prev); s.delete(taskId); return s; });
        toast.info("Task marked as pending");
      } else {
        await markTaskDone(taskId);
        setCompletedTaskIds((prev) => new Set(prev).add(taskId));
        toast.success("Task marked as done! 🎉");
      }
    } catch {
      toast.error("Failed to update task status");
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4" />
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

  const { stats, today_classes, pending_tasks, recent_notices } = dashboardData;
  const deptName = departments.find(d => d.id === Number(user?.department))?.name || user?.department_name || "—";
  const isToday = new Date().getDay() >= 0 && new Date().getDay() <= 4; // Sun-Thu

  const doneTasks = pending_tasks.filter((t) => completedTaskIds.has(t.id));
  const pendingOnly = pending_tasks.filter((t) => !completedTaskIds.has(t.id));

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto">

        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋
              </h1>
              <p className="text-blue-100 text-sm">Here&apos;s what&apos;s happening with your studies today</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Courses",   value: stats.courses,           icon: <FaBook />,        color: "blue",   border: "border-blue-500" },
            { label: "Today's Classes", value: stats.upcoming_classes,  icon: <FaCalendarAlt />, color: "green",  border: "border-green-500" },
            { label: "Pending Tasks",   value: pendingOnly.length,      icon: <FaClock />,       color: "orange", border: "border-orange-500" },
            { label: "Notices",         value: stats.unread_notices,    icon: <FaBell />,        color: "purple", border: "border-purple-500" },
          ].map(({ label, value, icon, color, border }) => (
            <div key={label} className={`bg-background rounded-2xl shadow-lg p-5 border-l-4 ${border} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-(--text)/60 text-xs font-medium">{label}</p>
                  <h3 className="text-3xl font-bold text-(--text) mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400 text-xl`}>
                  {icon}
                </div>
              </div>
            </div>
          ))}
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
                  Notices {user?.role === "cr" && <span className="ml-1 text-yellow-500">✎</span>}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Today's Schedule with Countdown */}
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
                {today_classes.map((cls) => {
                  const startTime = cls.time.split("–")[0].trim();
                  return (
                    <div
                      key={cls.id}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start">
                        <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 mr-4">
                          <FaBook className="text-blue-600 dark:text-blue-400 text-lg" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-(--text)">{cls.title}</h3>
                            {/* Next class countdown badge */}
                            <ClassCountdownBadge startTime={startTime} />
                          </div>
                          <div className="mt-1 flex flex-wrap gap-2 text-sm text-(--text)/70">
                            <span className="flex items-center gap-1.5 bg-background px-3 py-1 rounded-full">
                              <FaClock className="text-xs" /> {cls.time}
                            </span>
                            <span className="bg-background px-3 py-1 rounded-full">{cls.room}</span>
                            <span className="bg-background px-3 py-1 rounded-full">{cls.instructor}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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

        {/* Task List with Mark as Done */}
        {pending_tasks.length > 0 && (
          <div className="bg-background rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-(--text) flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <FaCheckCircle className="text-orange-600 dark:text-orange-400" />
                </div>
                My Tasks
                {doneTasks.length > 0 && (
                  <span className="text-sm font-normal text-(--text)/50 ml-1">
                    ({doneTasks.length}/{pending_tasks.length} done)
                  </span>
                )}
              </h2>
              {doneTasks.length > 0 && (
                <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <FaUndo /> {doneTasks.length} completed
                </span>
              )}
            </div>

            <div className="space-y-3">
              {/* Pending first */}
              {pendingOnly.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  done={false}
                  onToggle={handleTaskToggle}
                />
              ))}
              {/* Completed at bottom */}
              {doneTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  done={true}
                  onToggle={handleTaskToggle}
                />
              ))}
            </div>

            {pendingOnly.length === 0 && (
              <div className="mt-4 text-center py-4">
                <p className="text-green-600 dark:text-green-400 font-semibold">🎉 All tasks completed!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
