"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import {
  FaBell,
  FaPlus,
  FaTrash,
  FaEdit,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  Notice,
} from "@/services/notice";
import { getBatches, Batch } from "@/services/batch";
import { getSchedulesByTeacher } from "@/services/schedule";
import { getTeachers } from "@/services/teacher";
import { toast } from "react-toastify";

export default function NoticesPage() {
  const { user } = useGlobal();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherBatches, setTeacherBatches] = useState<Batch[]>([]);
  const [formData, setFormData] = useState({
    type: "info" as "info" | "warning" | "important",
    course: "",
    title: "",
    message: "",
    batch_id: 0,
  });

  const [notices, setNotices] = useState<Notice[]>([]);

  // Fetch notices filtered by role
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token") || "";

        let data: Notice[] = [];
        if (user?.role === "student" || user?.role === "cr") {
          const batchId = Number(user.batch);
          data = await getNotices(token, undefined, batchId > 0 ? batchId : undefined);
        } else if (user?.role === "hod") {
          const deptId = Number(user.department);
          data = await getNotices(token, deptId > 0 ? deptId : undefined);
        } else {
          data = await getNotices(token);
        }
        setNotices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch notices");
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [user]);

  // For teachers — fetch the batches they teach so they can target notices
  useEffect(() => {
    if (user?.role !== "teacher") return;
    const fetchTeacherBatches = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const teachers = await getTeachers(token);
        const me = teachers.find((t) => t.email === user.email);
        if (!me) return;
        const schedules = await getSchedulesByTeacher(me.id);
        const allBatches = await getBatches(token);
        const myBatchIds = [...new Set(schedules.map((s) => s.batch_id))];
        const myBatches = allBatches.filter((b) => myBatchIds.includes(b.id));
        setTeacherBatches(myBatches);
      } catch (err) {
        console.error("Failed to fetch teacher batches:", err);
      }
    };
    fetchTeacherBatches();
  }, [user]);

  const canManage =
    user?.role === "cr" || user?.role === "teacher" || user?.role === "hod";

  const filteredNotifications =
    filter === "all" ? notices : notices.filter((n) => n.type === filter);

  const handleAddNotice = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const deptId = user?.department ? Number(user.department) : 0;

      const newNotice = await createNotice(token, {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        course: formData.course || "General",
        author: user?.name || "Teacher",
        author_role: user?.role || "",
        department_id: deptId > 0 ? deptId : 0,
        batch_id: formData.batch_id || 0,
      });

      setNotices([newNotice, ...notices]);
      setShowAddModal(false);
      setFormData({ type: "info", course: "", title: "", message: "", batch_id: 0 });
    } catch (err) {
      console.error("Error creating notice:", err);
      toast.error("Failed to create notice. Please try again.");
    }
  };

  const handleEditNotice = async () => {
    if (!selectedNotice) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const updatedNotice = await updateNotice(token, selectedNotice.id, {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        course: formData.course,
      });

      setNotices(
        notices.map((n) => (n.id === selectedNotice.id ? updatedNotice : n))
      );
      setShowEditModal(false);
      setSelectedNotice(null);
      setFormData({ type: "info", course: "", title: "", message: "", batch_id: 0 });
    } catch (err) {
      console.error("Error updating notice:", err);
      toast.error("Failed to update notice. Please try again.");
    }
  };

  const handleDeleteNotice = async (id: number) => {
    if (!confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      await deleteNotice(token, id);
      setNotices(notices.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting notice:", err);
      toast.error("Failed to delete notice. Please try again.");
    }
  };

  const openEditModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setFormData({
      type: notice.type,
      course: notice.course,
      title: notice.title,
      message: notice.message,
      batch_id: notice.batch_id || 0,
    });
    setShowEditModal(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "important":
        return <FaExclamationCircle className="text-red-500" />;
      case "warning":
        return <FaExclamationCircle className="text-yellow-500" />;
      case "info":
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaCheckCircle className="text-green-500" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case "important":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50";
      case "info":
        return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50";
      default:
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-(--text)/70 font-medium">Loading notices...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent p-6">
        <div className="bg-background rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-(--text) mb-2">
            Error Loading Notices
          </h2>
          <p className="text-(--text)/70 mb-4">{error}</p>
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

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-(--text)">Batch Notices</h1>
            <p className="text-(--text)/70 mt-1">
              {canManage
                ? "View and manage batch notices"
                : "Stay updated with important announcements"}
            </p>
          </div>

          {canManage && (
            <button
              onClick={() => {
                setFormData({
                  type: "info",
                  course: "",
                  title: "",
                  message: "",
                  batch_id: 0,
                });
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
            >
              <FaPlus /> Post Notice
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="bg-background rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-background-light text-(--text)/80 hover:bg-background-light/50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("important")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "important"
                  ? "bg-red-600 text-white"
                  : "bg-background-light text-(--text)/80 hover:bg-background-light/50"
              }`}
            >
              Important
            </button>
            <button
              onClick={() => setFilter("warning")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "warning"
                  ? "bg-yellow-600 text-white"
                  : "bg-background-light text-(--text)/80 hover:bg-background-light/50"
              }`}
            >
              Warnings
            </button>
            <button
              onClick={() => setFilter("info")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "info"
                  ? "bg-blue-600 text-white"
                  : "bg-background-light text-(--text)/80 hover:bg-background-light/50"
              }`}
            >
              Info
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-background rounded-2xl shadow-lg p-6 border-l-4 ${getTypeBg(
                notification.type
              )} hover:shadow-xl transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-background shadow-sm">
                    {getTypeIcon(notification.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-(--text)">
                        {notification.title}
                      </h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-background-light/50 text-(--text)/80">
                        {notification.course}
                      </span>
                    </div>

                    <p className="text-(--text)/70 mb-3">{notification.message}</p>

                    <div className="flex items-center gap-4 text-sm text-(--text)/60">
                      <span>By {notification.author}</span>
                      <span>•</span>
                      <span>{notification.date}</span>
                    </div>
                  </div>
                </div>

                {canManage && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(notification)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="bg-background rounded-2xl shadow-lg p-12 text-center">
            <FaBell className="text-6xl text-(--text)/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-(--text) mb-2">
              No notifications
            </h3>
            <p className="text-(--text)/70">You&apos;re all caught up!</p>
          </div>
        )}
      </div>

      {/* Add Notice Modal */}
      {showAddModal && canManage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">
              Post Notice
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Notice Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "info" | "warning" | "important",
                    })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="important">Important</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Course (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., CSE101 or leave blank for General"
                  value={formData.course}
                  onChange={(e) =>
                    setFormData({ ...formData, course: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Show batch selector only for teachers */}
              {user?.role === "teacher" && teacherBatches.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-(--text)/80 mb-2">
                    Target Batch
                  </label>
                  <select
                    value={formData.batch_id}
                    onChange={(e) =>
                      setFormData({ ...formData, batch_id: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 bg-background text-(--text)"
                  >
                    <option value={0}>All Batches (General)</option>
                    {teacherBatches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Class Rescheduled"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter notice details..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    type: "info",
                    course: "",
                    title: "",
                    message: "",
                    batch_id: 0,
                  });
                }}
                className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNotice}
                disabled={!formData.title || !formData.message}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-background-light/80 disabled:cursor-not-allowed"
              >
                Post Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {showEditModal && canManage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">
              Edit Notice
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Notice Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "info" | "warning" | "important",
                    })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="important">Important</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Course
                </label>
                <input
                  type="text"
                  placeholder="e.g., CSE101 or General"
                  value={formData.course}
                  onChange={(e) =>
                    setFormData({ ...formData, course: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Class Rescheduled"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter notice details..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedNotice(null);
                  setFormData({
                    type: "info",
                    course: "",
                    title: "",
                    message: "",
                    batch_id: 0,
                  });
                }}
                className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
              >
                Cancel
              </button>
              <button
                onClick={handleEditNotice}
                disabled={!formData.title || !formData.message}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-background-light/80 disabled:cursor-not-allowed"
              >
                Update Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
