"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import {
  FaBell, FaPlus, FaTrash, FaExclamationCircle, FaInfoCircle, FaCheckCircle, FaSearch,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { getNotices, createNotice, deleteNotice, Notice } from "@/services/notice";
import { getBatches, Batch } from "@/services/batch";
import { getSchedulesByTeacher } from "@/services/schedule";
import { getTeachers } from "@/services/teacher";
import { toast } from "react-toastify";

const PAGE_SIZE = 8;

// Custom delete confirmation
function DeleteModal({ notice, onConfirm, onCancel }: { notice: Notice; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30"><FaTrash className="text-red-600" /></div>
          <h2 className="text-lg font-bold text-(--text)">Delete Notice</h2>
        </div>
        <p className="text-(--text)/70 text-sm mb-2">Are you sure you want to delete:</p>
        <p className="font-medium text-sm bg-background-light/60 rounded-lg px-3 py-2 mb-6 text-(--text)">&ldquo;{notice.title}&rdquo;</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-(--primary)/30 rounded-xl hover:bg-background-light text-(--text)/70 text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { user } = useGlobal();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teacherBatches, setTeacherBatches] = useState<Batch[]>([]);
  const [formData, setFormData] = useState({
    type: "info" as "info" | "warning" | "important",
    course: "",
    title: "",
    message: "",
    batch_id: 0,
  });

  const canPost = user?.role === "cr" || user?.role === "teacher" || user?.role === "hod";

  // Fetch notices based on role
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const token = "";
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
      } catch (e) {
        toast.error("Failed to load notices");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetch();
  }, [user]);

  // Teacher: load their batches
  useEffect(() => {
    if (user?.role !== "teacher") return;
    (async () => {
      try {
        const token = "";
        const teachers = await getTeachers(token);
        const me = teachers.find(t => t.email === user.email);
        if (!me) return;
        const schedules = await getSchedulesByTeacher(me.id);
        const allBatches = await getBatches(token);
        const myBatchIds = [...new Set(schedules.map(s => s.batch_id))];
        setTeacherBatches(allBatches.filter(b => myBatchIds.includes(b.id)));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user]);

  const handlePost = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    try {
      const deptId = user?.department ? Number(user.department) : 0;
      const newNotice = await createNotice("", {
        ...formData,
        author: user?.name || "Unknown",
        author_role: user?.role || "",
        department_id: deptId > 0 ? deptId : 0,
      });
      setNotices(prev => [newNotice, ...prev]);
      setFormData({ type: "info", course: "", title: "", message: "", batch_id: 0 });
      setShowAddModal(false);
      toast.success("Notice posted!");
    } catch (e) {
      toast.error("Failed to post notice");
      console.error(e);
    }
  };

  // Issue 6 — ownership check
  const canDeleteNotice = (notice: Notice) =>
    user?.role === "hod" ||
    user?.role === "admin" ||
    (canPost && notice.author_uid === user?.id);

  const handleDelete = async (id: string) => {
    try {
      await deleteNotice("", id);
      setNotices(prev => prev.filter(n => n.id !== id));
      toast.success("Notice deleted");
    } catch (e) {
      toast.error("Failed to delete notice");
      console.error(e);
    } finally {
      setDeleteTarget(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "important": return <FaExclamationCircle className="text-red-500" />;
      case "warning":   return <FaExclamationCircle className="text-yellow-500" />;
      case "info":      return <FaInfoCircle className="text-blue-500" />;
      default:          return <FaCheckCircle className="text-green-500" />;
    }
  };

  const getTypeBorder = (type: string) => {
    switch (type) {
      case "important": return "border-l-4 border-red-400";
      case "warning":   return "border-l-4 border-yellow-400";
      case "info":      return "border-l-4 border-blue-400";
      default:          return "border-l-4 border-green-400";
    }
  };

  const filtered = notices
    .filter(n => filter === "all" || n.type === filter)
    .filter(n =>
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      n.author.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-(--text)">Batch Notices</h1>
            <p className="text-(--text)/60 mt-1">
              {canPost ? "Post and manage batch notices" : "Stay updated with important announcements"}
            </p>
          </div>
          {canPost && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg font-medium"
            >
              <FaPlus /> Post Notice
            </button>
          )}
        </div>

        {/* Search + Filter */}
        <div className="bg-background rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Type filter */}
            <div className="flex flex-wrap gap-2">
              {["all", "important", "warning", "info"].map(f => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                    filter === f
                      ? f === "important" ? "bg-red-600 text-white"
                        : f === "warning" ? "bg-yellow-500 text-white"
                        : f === "info" ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-white"
                      : "bg-background-light text-(--text)/70 hover:bg-slate-200 dark:hover:bg-slate-700/40"
                  }`}
                >
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs ml-auto">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text)/40 text-sm" />
              <input
                type="text"
                placeholder="Search notices..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-(--primary)/20 rounded-xl text-sm bg-background-light/60 text-(--text) focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Notices List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-(--text)/60">Loading notices...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="bg-background rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
              <FaBell className="text-4xl text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-(--text) mb-2">
              {search ? `No results for &quot;${search}&quot;` : "No notices yet"}
            </h3>
            <p className="text-(--text)/60 text-sm">
              {canPost ? "Be the first to post a notice for your batch" : "Check back later for announcements"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginated.map(notice => (
              <div
                key={notice.id}
                className={`bg-background rounded-2xl shadow-md hover:shadow-lg ${getTypeBorder(notice.type)} transition-all duration-200 p-6`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-3 rounded-xl bg-background-light/60 shrink-0">
                      {getTypeIcon(notice.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base font-bold text-(--text) truncate">{notice.title}</h3>
                        {notice.course && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-background-light text-(--text)/70">
                            {notice.course}
                          </span>
                        )}
                        {notice.batch_id && notice.batch_id > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            Batch #{notice.batch_id}
                          </span>
                        )}
                      </div>
                      <p className="text-(--text)/70 text-sm line-clamp-2 mb-3">{notice.message}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-(--text)/50">
                        <span>By <span className="font-medium text-(--text)/70">{notice.author}</span></span>
                        {notice.author_role && <span className="capitalize bg-background-light px-2 py-0.5 rounded-full">{notice.author_role}</span>}
                        <span>•</span>
                        <span>{notice.date}</span>
                      </div>
                    </div>
                  </div>
                  {canDeleteNotice(notice) && (
                    <button
                      onClick={() => setDeleteTarget(notice)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-background shadow border border-(--primary)/20 text-(--text)/70 disabled:opacity-40 hover:bg-primary/10 transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                  p === currentPage
                    ? "bg-primary text-white shadow-sm"
                    : "bg-background border border-(--primary)/20 text-(--text)/70 hover:bg-primary/10"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-background shadow border border-(--primary)/20 text-(--text)/70 disabled:opacity-40 hover:bg-primary/10 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Add Notice Modal */}
      {showAddModal && canPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-2xl font-bold text-(--text)">Post Notice</h2>

            <div>
              <label className="block text-sm font-medium text-(--text)/70 mb-1.5">Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as "info" | "warning" | "important" })}
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-xl bg-background text-(--text) focus:ring-2 focus:ring-primary/30"
              >
                <option value="info">ℹ️ Info</option>
                <option value="warning">⚠️ Warning</option>
                <option value="important">🚨 Important</option>
              </select>
            </div>

            {user?.role === "teacher" && teacherBatches.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-(--text)/70 mb-1.5">Target Batch</label>
                <select
                  value={formData.batch_id}
                  onChange={e => setFormData({ ...formData, batch_id: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-xl bg-background text-(--text) focus:ring-2 focus:ring-primary/30"
                >
                  <option value={0}>All Batches (General)</option>
                  {teacherBatches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-(--text)/70 mb-1.5">Course (optional)</label>
              <input
                type="text"
                placeholder="e.g. CSE101"
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-xl bg-background text-(--text) focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text)/70 mb-1.5">Title *</label>
              <input
                type="text"
                placeholder="Notice title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-xl bg-background text-(--text) focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text)/70 mb-1.5">Message *</label>
              <textarea
                rows={4}
                placeholder="Write your notice here..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-xl bg-background text-(--text) focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setShowAddModal(false); setFormData({ type: "info", course: "", title: "", message: "", batch_id: 0 }); }}
                className="flex-1 px-4 py-2.5 border border-(--primary)/30 rounded-xl hover:bg-background-light transition-colors text-(--text)/70"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Post Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteModal
          notice={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
