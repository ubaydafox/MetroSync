"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { FaCalendar, FaClock, FaMapMarkerAlt, FaBook, FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  createSchedule, updateSchedule, deleteSchedule, Schedule,
  subscribeToSchedules, subscribeToSchedulesByBatch,
  subscribeToSchedulesByDepartment, subscribeToSchedulesByTeacher,
  checkScheduleConflicts, ConflictResult
} from "@/services/schedule";
import { getCourses, Course } from "@/services/course";
import { getBatches, Batch } from "@/services/batch";
import { getTeachers, Teacher } from "@/services/teacher";
import { toast } from "react-toastify";

const DAY_COLORS: Record<string, { border: string; bg: string; icon: string; active: string }> = {
  Sunday:    { border: "border-rose-500",   bg: "bg-rose-100 dark:bg-rose-900/30",   icon: "text-rose-600 dark:text-rose-400",   active: "bg-rose-600 text-white" },
  Monday:    { border: "border-blue-500",   bg: "bg-blue-100 dark:bg-blue-900/30",   icon: "text-blue-600 dark:text-blue-400",   active: "bg-blue-600 text-white" },
  Tuesday:   { border: "border-teal-500",   bg: "bg-teal-100 dark:bg-teal-900/30",   icon: "text-teal-600 dark:text-teal-400",   active: "bg-teal-600 text-white" },
  Wednesday: { border: "border-violet-500", bg: "bg-violet-100 dark:bg-violet-900/30", icon: "text-violet-600 dark:text-violet-400", active: "bg-violet-600 text-white" },
  Thursday:  { border: "border-amber-500",  bg: "bg-amber-100 dark:bg-amber-900/30",  icon: "text-amber-600 dark:text-amber-400",  active: "bg-amber-600 text-white" },
  Friday:    { border: "border-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", icon: "text-emerald-600 dark:text-emerald-400", active: "bg-emerald-600 text-white" },
  Saturday:  { border: "border-pink-500",   bg: "bg-pink-100 dark:bg-pink-900/30",   icon: "text-pink-600 dark:text-pink-400",   active: "bg-pink-600 text-white" },
  default:   { border: "border-slate-400",  bg: "bg-slate-100 dark:bg-slate-800/30", icon: "text-slate-600 dark:text-slate-400", active: "bg-slate-600 text-white" },
};

const PAGE_SIZE = 8;

// ─── Conflict Warning Banner ───────────────────────────────────────────────────
function ConflictWarning({ conflicts }: { conflicts: ConflictResult[] }) {
  if (conflicts.length === 0) return null;
  const icons: Record<ConflictResult["type"], string> = {
    room: "🏛",
    teacher: "👨‍🏫",
    batch: "🎓",
  };
  return (
    <div className="mt-4 rounded-xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4 space-y-2">
      <p className="text-sm font-bold text-red-700 dark:text-red-400">⚠️ Scheduling Conflict Detected</p>
      {conflicts.map((c, i) => (
        <p key={i} className="text-xs text-red-600 dark:text-red-300 flex gap-2">
          <span>{icons[c.type]}</span>
          <span>{c.message}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteScheduleModal({ onConfirm, onCancel, item }: { onConfirm: () => void; onCancel: () => void; item: string }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 text-lg">🗑</div>
          <h2 className="text-lg font-bold text-(--text)">Delete Schedule</h2>
        </div>
        <p className="text-(--text)/70 text-sm mb-2">Are you sure you want to delete this class?</p>
        <p className="font-medium text-sm bg-background-light/60 rounded-lg px-3 py-2 mb-6 text-(--text)">{item}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-(--primary)/30 rounded-xl hover:bg-background-light text-(--text)/70 text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium">Delete</button>
        </div>
      </div>
    </div>
  );
}

function ScheduleContent() {
  const { user } = useGlobal();
  const searchParams = useSearchParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rawSchedule, setRawSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [conflicts, setConflicts] = useState<ConflictResult[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; label: string } | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const [scheduleForm, setScheduleForm] = useState({
    course: "",
    batch: "",
    teacher: "",
    day: "",
    start_time: "",
    end_time: "",
    room: ""
  });

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

  // Read URL query params from smart search
  useEffect(() => {
    const dayParam = searchParams.get("day");
    const qParam = searchParams.get("q");
    if (dayParam && days.includes(dayParam)) {
      setSelectedDay(dayParam);
    }
    if (qParam) {
      setSearchQuery(qParam.toLowerCase());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Subscribe to schedules in real-time based on role
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    // Unsubscribe any previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    const onData = (data: Schedule[]) => {
      setRawSchedule(data);
      setLoading(false);
    };

    const onErr = (err: unknown) => {
      console.error(err);
      setError("Failed to load schedules");
      setLoading(false);
    };

    let unsub: (() => void) | null = null;

    if (user.role === "admin") {
      unsub = subscribeToSchedules(onData);
    } else if (user.role === "hod") {
      const deptId = Number(user.department);
      if (!isNaN(deptId) && deptId > 0) {
        unsub = subscribeToSchedulesByDepartment(deptId, onData);
      } else {
        unsub = subscribeToSchedules(onData);
      }
    } else if (user.role === "student" || user.role === "cr") {
      const batchId = Number(user.batch);
      if (!isNaN(batchId) && batchId > 0) {
        unsub = subscribeToSchedulesByBatch(batchId, onData);
      } else {
        unsub = subscribeToSchedules(onData);
      }
    } else if (user.role === "teacher") {
      // Resolve teacher ID by email first (one-time), then subscribe
      const token = localStorage.getItem("token") || "";
      getTeachers(token).then((list) => {
        const me = list.find((t) => t.email === user.email);
        if (me) {
          const innerUnsub = subscribeToSchedulesByTeacher(me.id, onData);
          unsubscribeRef.current = innerUnsub;
        } else {
          onData([]);
        }
      }).catch(onErr);
      return; // teacher path sets unsubscribeRef inside async block
    } else {
      onData([]);
    }

    if (unsub) unsubscribeRef.current = unsub;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user]);

  // Fetch courses for HOD
  useEffect(() => {
    const fetchCourses = async () => {
      if (user?.role !== "hod") return;
      
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        setLoadingCourses(true);
        const data = await getCourses(token);
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [user]);

  // Fetch batches for HOD
  useEffect(() => {
    const fetchBatches = async () => {
      if (user?.role !== "hod") return;
      
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        setLoadingBatches(true);
        const data = await getBatches(token);
        setBatches(data);
      } catch (err) {
        console.error('Failed to load batches', err);
      } finally {
        setLoadingBatches(false);
      }
    };

    fetchBatches();
  }, [user]);

  // Fetch teachers for HOD
  useEffect(() => {
    const fetchTeachers = async () => {
      if (user?.role !== "hod") return;
      
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        setLoadingTeachers(true);
        const data = await getTeachers(token);
        setTeachers(data);
      } catch (err) {
        console.error('Failed to load teachers', err);
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, [user]);

  const handleAddSchedule = async () => {
    if (!scheduleForm.course || !scheduleForm.batch || !scheduleForm.teacher ||
        !scheduleForm.day || !scheduleForm.start_time || !scheduleForm.end_time ||
        !scheduleForm.room) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user?.department) {
      toast.error("Department information not found");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const departmentId = parseInt(user.department);
      const selectedCourse = courses.find(c => c.id === parseInt(scheduleForm.course));
      const selectedBatch  = batches.find(b => b.id === parseInt(scheduleForm.batch));
      const selectedTeacher = teachers.find(t => t.id === parseInt(scheduleForm.teacher));
      const departmentName = user.department_name || user.department;

      // ─── Conflict check BEFORE saving ─────────────────────────────────────
      const found = await checkScheduleConflicts({
        day:        scheduleForm.day,
        start_time: scheduleForm.start_time + ":00",
        end_time:   scheduleForm.end_time + ":00",
        teacher_id: parseInt(scheduleForm.teacher),
        batch_id:   parseInt(scheduleForm.batch),
        room:       scheduleForm.room,
      });

      if (found.length > 0) {
        setConflicts(found);
        return; // Stop — show conflicts in the modal
      }
      setConflicts([]);
      // ──────────────────────────────────────────────────────────────────────

      const newSchedule = await createSchedule(token, {
        course:          parseInt(scheduleForm.course),
        course_name:     selectedCourse?.name || "",
        course_code:     selectedCourse?.code || "",
        batch:           parseInt(scheduleForm.batch),
        batch_name:      selectedBatch?.name || "",
        teacher:         parseInt(scheduleForm.teacher),
        teacher_name:    selectedTeacher?.name || "",
        day:             scheduleForm.day.toLowerCase(),
        start_time:      scheduleForm.start_time + ":00",
        end_time:        scheduleForm.end_time + ":00",
        room:            scheduleForm.room,
        department:      departmentId,
        department_name: departmentName
      });

      setRawSchedule([...rawSchedule, newSchedule]);
      setShowAddModal(false);
      setConflicts([]);
      setScheduleForm({ course: "", batch: "", teacher: "", day: "", start_time: "", end_time: "", room: "" });
      toast.success("Schedule added successfully!");
    } catch (err) {
      toast.error("Failed to add schedule");
      console.error(err);
    }
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setScheduleForm({
      course: "",
      batch: "",
      teacher: "",
      day: schedule.day.charAt(0).toUpperCase() + schedule.day.slice(1),
      start_time: schedule.start_time.substring(0, 5), // Convert HH:MM:SS to HH:MM for time input
      end_time: schedule.end_time.substring(0, 5), // Convert HH:MM:SS to HH:MM for time input
      room: schedule.room
    });
    setShowEditModal(true);
  };

  const handleUpdateSchedule = async () => {
    if (!editingSchedule) return;
    if (!user?.department) { toast.error("Department information not found"); return; }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const departmentId   = parseInt(user.department);
      const selectedCourse = courses.find(c => c.id === parseInt(scheduleForm.course));
      const selectedBatch  = batches.find(b => b.id === parseInt(scheduleForm.batch));
      const selectedTeacher = teachers.find(t => t.id === parseInt(scheduleForm.teacher));
      const departmentName  = user.department_name || user.department;

      // Resolve final values (fall back to existing if not changed in form)
      const finalTeacherId = scheduleForm.teacher ? parseInt(scheduleForm.teacher) : editingSchedule.teacher_id;
      const finalBatchId   = scheduleForm.batch   ? parseInt(scheduleForm.batch)   : editingSchedule.batch_id;
      const finalDay       = scheduleForm.day   || editingSchedule.day;
      const finalStart     = scheduleForm.start_time ? scheduleForm.start_time + ":00" : editingSchedule.start_time;
      const finalEnd       = scheduleForm.end_time   ? scheduleForm.end_time   + ":00" : editingSchedule.end_time;
      const finalRoom      = scheduleForm.room || editingSchedule.room;

      // ─── Conflict check BEFORE saving (exclude self) ──────────────────────
      const found = await checkScheduleConflicts(
        {
          day:        finalDay,
          start_time: finalStart,
          end_time:   finalEnd,
          teacher_id: finalTeacherId,
          batch_id:   finalBatchId,
          room:       finalRoom,
        },
        editingSchedule.id  // exclude self so it doesn't flag its own slot
      );

      if (found.length > 0) {
        setConflicts(found);
        return;
      }
      setConflicts([]);
      // ──────────────────────────────────────────────────────────────────────

      const updated = await updateSchedule(token, editingSchedule.id, {
        day:        finalDay.toLowerCase(),
        start_time: finalStart,
        end_time:   finalEnd,
        room:       finalRoom,
        ...(scheduleForm.course && {
          course:      parseInt(scheduleForm.course),
          course_name: selectedCourse?.name,
          course_code: selectedCourse?.code
        }),
        ...(scheduleForm.batch && {
          batch:      parseInt(scheduleForm.batch),
          batch_name: selectedBatch?.name
        }),
        ...(scheduleForm.teacher && {
          teacher:      parseInt(scheduleForm.teacher),
          teacher_name: selectedTeacher?.name
        }),
        department:      departmentId,
        department_name: departmentName
      });

      setRawSchedule(rawSchedule.map(s => s.id === editingSchedule.id ? updated : s));
      setShowEditModal(false);
      setEditingSchedule(null);
      setConflicts([]);
      setScheduleForm({ course: "", batch: "", teacher: "", day: "", start_time: "", end_time: "", room: "" });
      toast.success("Schedule updated successfully!");
    } catch (err) {
      toast.error("Failed to update schedule");
      console.error(err);
    }
  };

  const handleDeleteSchedule = async (id: number, label: string) => {
    setDeleteTarget({ id, label });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await deleteSchedule(token, deleteTarget.id);
      setRawSchedule(rawSchedule.filter(s => s.id !== deleteTarget.id));
      toast.success("Schedule deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete schedule");
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  // Format time from 24h to 12h format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Transform data to match component format
  const schedule = rawSchedule.map(item => ({
    id: item.id,
    day: item.day ? item.day.charAt(0).toUpperCase() + item.day.slice(1) : 'Unknown',
    time: `${formatTime(item.start_time)} - ${formatTime(item.end_time)}`,
    course: item.course_code || 'N/A',
    courseName: item.course_name || 'Unknown Course',
    room: item.room || 'TBA',
    teacher: item.teacher_name || 'TBA',
    batch: item.batch_name || 'TBA'
  }));

  const filteredSchedule = (() => {
    let result = selectedDay === "all" ? schedule : schedule.filter(item => item.day === selectedDay);
    if (searchQuery) {
      result = result.filter(item =>
        item.courseName.toLowerCase().includes(searchQuery) ||
        item.course.toLowerCase().includes(searchQuery) ||
        item.teacher.toLowerCase().includes(searchQuery) ||
        item.batch.toLowerCase().includes(searchQuery) ||
        item.room.toLowerCase().includes(searchQuery)
      );
    }
    return result;
  })();

  const totalPages = Math.ceil(filteredSchedule.length / PAGE_SIZE);
  const paginatedSchedule = filteredSchedule.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const canManage = user?.role === "hod";

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-(--text)/70 font-medium">Loading schedules...</p>
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
          <h2 className="text-2xl font-bold text-(--text) mb-2">Error Loading Schedules</h2>
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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-(--text)">Class Schedule</h1>
            <p className="text-(--text)/70 mt-1">
              {canManage ? "Manage department class schedules" : "Your weekly class schedule"}
            </p>
          </div>

          {canManage && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
            >
              <FaPlus /> Add Class
            </button>
          )}
        </div>

        {/* Search + Filter row */}
        <div className="bg-background rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Day filter chips */}
            <div className="flex flex-wrap gap-2 flex-1">
              <button
                onClick={() => { setSelectedDay("all"); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedDay === "all"
                    ? "bg-slate-700 text-white shadow-sm"
                    : "bg-background-light text-(--text)/70 hover:bg-slate-200 dark:hover:bg-slate-700/40"
                }`}
              >
                All Days
              </button>
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => { setSelectedDay(day); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedDay === day
                      ? `${DAY_COLORS[day]?.active ?? "bg-blue-600 text-white"} shadow-sm`
                      : "bg-background-light text-(--text)/70 hover:bg-slate-200 dark:hover:bg-slate-700/40"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Inline search */}
            <div className="relative w-full sm:w-56">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text)/40 text-sm" />
              <input
                type="text"
                placeholder="Search class, teacher..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value.toLowerCase()); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-(--primary)/20 rounded-xl text-sm bg-background-light/60 text-(--text) focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedSchedule.map((item) => {
            const rawItem = rawSchedule.find(s => s.id === item.id);
            const dayColor = DAY_COLORS[item.day] ?? DAY_COLORS.default;
            return (
            <div key={item.id} className={`bg-background rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 ${dayColor.border}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${dayColor.bg}`}>
                  <FaBook className={`${dayColor.icon} text-xl`} />
                </div>
                <div className="flex items-center gap-2">
                  {/* Batch pill */}
                  {item.batch && item.batch !== 'TBA' && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${dayColor.bg} ${dayColor.icon}`}>
                      {item.batch}
                    </span>
                  )}
                  {canManage && rawItem && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditSchedule(rawItem)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(item.id, `${item.courseName} — ${item.day} ${item.time}`)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-(--text)">{item.courseName}</h3>
              </div>
              <p className={`${dayColor.icon} font-semibold mb-4 text-sm`}>{item.course !== "none" ? item.course : "Extra Curricular"}</p>

              <div className="space-y-2 text-sm text-(--text)/70">
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-(--text)/50" />
                  <span>{item.day}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-(--text)/50" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-(--text)/50" />
                  <span>{item.room}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-(--primary)/10">
                <p className="text-sm text-(--text)/70">
                  <span className="font-medium">Teacher:</span> {item.teacher}
                </p>
              </div>
            </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredSchedule.length === 0 && (
          <div className="bg-background rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
              <FaCalendar className="text-4xl text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-(--text) mb-2">No classes found</h3>
            <p className="text-(--text)/60 mb-4">
              {searchQuery
                ? `No results for "${searchQuery}"  — try a different keyword`
                : selectedDay === "all"
                ? canManage
                  ? "Start by adding your first class below"
                  : "No schedule has been published for your batch yet"
                : `No classes scheduled on ${selectedDay}`}
            </p>
            {canManage && !searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                + Add First Class
              </button>
            )}
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

      {/* Add Class Modal - HOD Only */}
      {showAddModal && canManage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-(--text) mb-6">Add Class Schedule</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Course *</label>
                <select 
                  value={scheduleForm.course}
                  onChange={(e) => setScheduleForm({...scheduleForm, course: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-(--text)"
                  disabled={loadingCourses}
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Batch *</label>
                <select 
                  value={scheduleForm.batch}
                  onChange={(e) => setScheduleForm({...scheduleForm, batch: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-(--text)"
                  disabled={loadingBatches}
                >
                  <option value="">Select Batch</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name} - {batch.year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Teacher *</label>
                <select 
                  value={scheduleForm.teacher}
                  onChange={(e) => setScheduleForm({...scheduleForm, teacher: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-(--text)"
                  disabled={loadingTeachers}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Day *</label>
                <select 
                  value={scheduleForm.day}
                  onChange={(e) => setScheduleForm({...scheduleForm, day: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-(--text)"
                >
                  <option value="">Select Day</option>
                  {days.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-(--text)/80 mb-2">Start Time *</label>
                  <input 
                    type="time" 
                    value={scheduleForm.start_time}
                    onChange={(e) => setScheduleForm({...scheduleForm, start_time: e.target.value})}
                    className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-(--text)" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--text)/80 mb-2">End Time *</label>
                  <input 
                    type="time" 
                    value={scheduleForm.end_time}
                    onChange={(e) => setScheduleForm({...scheduleForm, end_time: e.target.value})}
                    className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-(--text)" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Room *</label>
                <input 
                  type="text" 
                  placeholder="e.g., Room 301, Lab A" 
                  value={scheduleForm.room}
                  onChange={(e) => setScheduleForm({...scheduleForm, room: e.target.value})}
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>

            {/* Conflict Warning */}
            <ConflictWarning conflicts={conflicts} />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setConflicts([]);
                  setScheduleForm({ course: "", batch: "", teacher: "", day: "", start_time: "", end_time: "", room: "" });
                }}
                className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSchedule}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {conflicts.length > 0 ? "Check Again" : "Add Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal - HOD Only */}
      {showEditModal && canManage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-(--text) mb-6">Edit Class Schedule</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Course</label>
                <select 
                  value={scheduleForm.course}
                  onChange={(e) => setScheduleForm({...scheduleForm, course: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-(--text)"
                  disabled={loadingCourses}
                >
                  <option value="">Keep Current Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Batch</label>
                <select 
                  value={scheduleForm.batch}
                  onChange={(e) => setScheduleForm({...scheduleForm, batch: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-(--text)"
                  disabled={loadingBatches}
                >
                  <option value="">Keep Current Batch</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name} - {batch.year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Teacher</label>
                <select 
                  value={scheduleForm.teacher}
                  onChange={(e) => setScheduleForm({...scheduleForm, teacher: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-(--text)"
                  disabled={loadingTeachers}
                >
                  <option value="">Keep Current Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Day *</label>
                <select 
                  value={scheduleForm.day}
                  onChange={(e) => setScheduleForm({...scheduleForm, day: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-(--text)"
                >
                  <option value="">Select Day</option>
                  {days.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-(--text)/80 mb-2">Start Time *</label>
                  <input 
                    type="time" 
                    value={scheduleForm.start_time}
                    onChange={(e) => setScheduleForm({...scheduleForm, start_time: e.target.value})}
                    className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-(--text)" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--text)/80 mb-2">End Time *</label>
                  <input 
                    type="time" 
                    value={scheduleForm.end_time}
                    onChange={(e) => setScheduleForm({...scheduleForm, end_time: e.target.value})}
                    className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-(--text)" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Room *</label>
                <input 
                  type="text" 
                  placeholder="e.g., Room 301, Lab A" 
                  value={scheduleForm.room}
                  onChange={(e) => setScheduleForm({...scheduleForm, room: e.target.value})}
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>

            {/* Conflict Warning */}
            <ConflictWarning conflicts={conflicts} />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSchedule(null);
                  setConflicts([]);
                  setScheduleForm({ course: "", batch: "", teacher: "", day: "", start_time: "", end_time: "", room: "" });
                }}
                className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSchedule}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {conflicts.length > 0 ? "Check Again" : "Update Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteScheduleModal
          item={deleteTarget.label}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-transparent">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-(--text)/70 font-medium">Loading schedules...</p>
          </div>
        </div>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}
