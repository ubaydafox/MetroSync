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
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import {
  subscribeToNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  Notice,
} from "@/services/notice";
import { getBatches, Batch } from "@/services/batch";
import { getSchedulesByTeacher } from "@/services/schedule";
import { getTeachers } from "@/services/teacher";
import { toast } from "react-toastify";

// ─── Custom Delete Confirmation Modal ─────────────────────────────────────────
function DeleteModal({
  notice,
  onConfirm,
  onCancel,
}: {
  notice: Notice;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
            <FaTrash className="text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-(--text)">Delete Notice</h2>
        </div>
        <p className="text-(--text)/70 text-sm mb-2">
          Are you sure you want to delete this notice?
        </p>
        <p className="text-(--text) font-medium text-sm bg-background-light/60 rounded-lg px-3 py-2 mb-6">
          &ldquo;{notice.title}&rdquo;
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-(--primary)/30 rounded-xl hover:bg-background-light transition-colors text-(--text)/70 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Notice Form Modal ─────────────────────────────────────────────────────────
function NoticeFormModal({
  mode,
  formData,
  onFormChange,
  onSubmit,
  onClose,
  teacherBatches,
  userRole,
}: {
  mode: "add" | "edit";
  formData: { type: "info" | "warning" | "important"; course: string; title: string; message: string; batch_id: number };
  onFormChange: (data: typeof formData) => void;
  onSubmit: () => void;
  onClose: () => void;
  teacherBatches: Batch[];
  userRole?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-(--text)">
            {mode === "add" ? "Post Notice" : "Edit Notice"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-background-light transition-colors text-(--text)/60"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-(--text)/80 mb-2">Notice Type</label>
            <select
              value={formData.type}
              onChange={(e) => onFormChange({ ...formData, type: e.target.value as "info" | "warning" | "important" })}
              className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 bg-background text-(--text)"
            >
              <option value="info">ℹ️ Info</option>
              <option value="warning">⚠️ Warning</option>
              <option value="important">🔴 Important</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--text)/80 mb-2">Course (Optional)</label>
            <input
              type="text"
              placeholder="e.g., CSE101 or leave blank for General"
              value={formData.course}
              onChange={(e) => onFormChange({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 bg-background text-(--text)"
            />
          </div>

          {/* Batch selector for teachers */}
          {userRole === "teacher" && teacherBatches.length > 0 && mode === "add" && (
            <div>
              <label className="block text-sm font-medium text-(--text)/80 mb-2">Target Batch</label>
              <select
                value={formData.batch_id}
                onChange={(e) => onFormChange({ ...formData, batch_id: Number(e.target.value) })}
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
            <label className="block text-sm font-medium text-(--text)/80 mb-2">Title</label>
            <input
              type="text"
              placeholder="e.g., Class Rescheduled"
              value={formData.title}
              onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 bg-background text-(--text)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--text)/80 mb-2">Message</label>
            <textarea
              rows={4}
              placeholder="Enter notice details..."
              value={formData.message}
              onChange={(e) => onFormChange({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 bg-background text-(--text) resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light text-(--text)/70"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!formData.title || !formData.message}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-background-light/80 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {mode === "add" ? "Post Notice" : "Update Notice"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function NoticesPage() {
  const { user } = useGlobal();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [teacherBatches, setTeacherBatches] = useState<Batch[]>([]);
  const [formData, setFormData] = useState({
    type: "info" as "info" | "warning" | "important",
    course: "",
    title: "",
    message: "",
    batch_id: 0,
  });
  const [notices, setNotices] = useState<Notice[]>([]);

  // Real-time notices subscription (Issue 5 + Feature: real-time)
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const options =
      user.role === "student" || user.role === "cr"
        ? { batchId: Number(user.batch) || undefined }
        : user.role === "hod"
        ? { departmentId: Number(user.department) || undefined }
        : {};

    const unsub = subscribeToNotices(
      (data) => { setNotices(data); setLoading(false); },
      options
    );

    return () => unsub();
  }, [user]);

  // For teachers: fetch the batches they teach
  useEffect(() => {
    if (user?.role !== "teacher") return;
    (async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const teachers = await getTeachers(token);
        const me = teachers.find((t) => t.email === user.email);
        if (!me) return;
        const schedules = await getSchedulesByTeacher(me.id);
        const allBatches = await getBatches(token);
        const myBatchIds = [...new Set(schedules.map((s) => s.batch_id))];
        setTeacherBatches(allBatches.filter((b) => myBatchIds.includes(b.id)));
      } catch (err) {
        console.error("Failed to fetch teacher batches:", err);
      }
    })();
  }, [user]);

  const canManage = user?.role === "cr" || user?.role === "teacher" || user?.role === "hod";

  // Issue 6: Ownership check — only the author or HOD/admin can edit/delete
  const canEditNotice = (notice: Notice) =>
    user?.role === "hod" ||
    user?.role === "admin" ||
    (canManage && notice.author_uid === user?.id);

  // Feature: keyword search filter
  const filteredNotices = notices.filter((n) => {
    const matchesType = filter === "all" || n.type === filter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.message.toLowerCase().includes(q) ||
      n.author.toLowerCase().includes(q) ||
      (n.course || "").toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const resetForm = () =>
    setFormData({ type: "info", course: "", title: "", message: "", batch_id: 0 });

  const handleAddNotice = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const deptId = user?.department ? Number(user.department) : 0;
      await createNotice(token, {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        course: formData.course || "General",
        author: user?.name || "Teacher",
        author_uid: user?.id || "",
        author_role: user?.role || "",
        department_id: deptId > 0 ? deptId : 0,
        batch_id: formData.batch_id || 0,
      });
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error("Error creating notice:", err);
    }
  };

  const handleEditNotice = async () => {
    if (!selectedNotice) return;
    try {
      const token = localStorage.getItem("token") || "";
      await updateNotice(token, selectedNotice.id, {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        course: formData.course,
      });
      toast.success("Notice updated");
      setShowEditModal(false);
      setSelectedNotice(null);
      resetForm();
    } catch (err) {
      console.error("Error updating notice:", err);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      const token = localStorage.getItem("token") || "";
      await deleteNotice(token, deleteTarget.id);
      toast.success("Notice deleted");
    } catch (err) {
      console.error("Error deleting notice:", err);
    } finally {
      setDeleteTarget(null);
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
      case "important": return <FaExclamationCircle className="text-red-500" />;
      case "warning":   return <FaExclamationCircle className="text-yellow-500" />;
      case "info":      return <FaInfoCircle className="text-blue-500" />;
      default:          return <FaCheckCircle className="text-green-500" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case "important": return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50";
      case "warning":   return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50";
      case "info":      return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50";
      default:          return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4" />
          <p className="text-(--text)/70 font-medium">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-(--text)">Batch Notices</h1>
            <p className="text-(--text)/70 mt-1">
              {canManage ? "View and manage batch notices" : "Stay updated with important announcements"}
            </p>
          </div>
          {canManage && (
            <button
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
            >
              <FaPlus /> Post Notice
            </button>
          )}
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-background rounded-2xl shadow-lg p-4 mb-6 space-y-3">
          {/* Keyword Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text)/40 text-sm" />
            <input
              type="text"
              placeholder="Search notices by title, message, course or author…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-background-light/50 border border-(--primary)/20 rounded-xl text-(--text) text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text)/40 hover:text-(--text)/70"
              >
                <FaTimes className="text-sm" />
              </button>
            )}
          </div>

          {/* Type Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all",       label: "All",       active: "bg-blue-600 text-white" },
              { value: "important", label: "Important", active: "bg-red-600 text-white" },
              { value: "warning",   label: "Warning",   active: "bg-yellow-600 text-white" },
              { value: "info",      label: "Info",      active: "bg-blue-600 text-white" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  filter === f.value
                    ? f.active
                    : "bg-background-light text-(--text)/80 hover:bg-background-light/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-background rounded-2xl shadow-lg p-6 border-l-4 ${getTypeBg(notice.type)} hover:shadow-xl transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-background shadow-sm mt-0.5">
                    {getTypeIcon(notice.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-(--text)">{notice.title}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-background-light/50 text-(--text)/80">
                        {notice.course || "General"}
                      </span>
                    </div>
                    <p className="text-(--text)/70 mb-3">{notice.message}</p>
                    <div className="flex items-center gap-4 text-sm text-(--text)/60">
                      <span>By {notice.author}</span>
                      <span>•</span>
                      <span>{notice.date}</span>
                    </div>
                  </div>
                </div>

                {/* Issue 6: Only show edit/delete if user owns the notice */}
                {canEditNotice(notice) && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(notice)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit notice"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(notice)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete notice"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredNotices.length === 0 && (
          <div className="bg-background rounded-2xl shadow-lg p-12 text-center">
            <FaBell className="text-6xl text-(--text)/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-(--text) mb-2">
              {searchQuery ? "No notices match your search" : "No notices"}
            </h3>
            <p className="text-(--text)/70">
              {searchQuery ? `Try different keywords` : "You're all caught up!"}
            </p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && canManage && (
        <NoticeFormModal
          mode="add"
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleAddNotice}
          onClose={() => { setShowAddModal(false); resetForm(); }}
          teacherBatches={teacherBatches}
          userRole={user?.role}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedNotice && (
        <NoticeFormModal
          mode="edit"
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleEditNotice}
          onClose={() => { setShowEditModal(false); setSelectedNotice(null); resetForm(); }}
          teacherBatches={teacherBatches}
          userRole={user?.role}
        />
      )}

      {/* Custom Delete Confirmation Modal (replaces confirm()) */}
      {deleteTarget && (
        <DeleteModal
          notice={deleteTarget}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
