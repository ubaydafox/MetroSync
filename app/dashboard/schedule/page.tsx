"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { FaCalendar, FaClock, FaMapMarkerAlt, FaBook, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, Schedule } from "@/services/schedule";
import { getCourses, Course } from "@/services/course";
import { getBatches, Batch } from "@/services/batch";
import { getTeachers, Teacher } from "@/services/teacher";
import { toast } from "react-toastify";

export default function SchedulePage() {
  const { user } = useGlobal();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("all");
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

  // Fetch schedules from backend
  useEffect(() => {
    const fetchSchedules = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const data = await getSchedules(token);
        setRawSchedule(data);
        setError(null);
      } catch (err) {
        setError('Failed to load schedules');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

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

      // Get department ID - assuming user.department is the department name
      const departmentId = parseInt(user.department); // Adjust this if department is stored differently

      const newSchedule = await createSchedule(token, {
        course: parseInt(scheduleForm.course),
        batch: parseInt(scheduleForm.batch),
        teacher: parseInt(scheduleForm.teacher),
        day: scheduleForm.day.toLowerCase(),
        start_time: scheduleForm.start_time + ':00', // Add seconds for HH:MM:SS format
        end_time: scheduleForm.end_time + ':00', // Add seconds for HH:MM:SS format
        room: scheduleForm.room,
        department: departmentId
      });

      setRawSchedule([...rawSchedule, newSchedule]);
      setShowAddModal(false);
      setScheduleForm({
        course: "",
        batch: "",
        teacher: "",
        day: "",
        start_time: "",
        end_time: "",
        room: ""
      });
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

    if (!user?.department) {
      toast.error("Department information not found");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const departmentId = parseInt(user.department);

      const updated = await updateSchedule(token, editingSchedule.id, {
        day: scheduleForm.day.toLowerCase(),
        start_time: scheduleForm.start_time + ':00', // Add seconds for HH:MM:SS format
        end_time: scheduleForm.end_time + ':00', // Add seconds for HH:MM:SS format
        room: scheduleForm.room,
        ...(scheduleForm.course && { course: parseInt(scheduleForm.course) }),
        ...(scheduleForm.batch && { batch: parseInt(scheduleForm.batch) }),
        ...(scheduleForm.teacher && { teacher: parseInt(scheduleForm.teacher) }),
        department: departmentId
      });

      setRawSchedule(rawSchedule.map(s => s.id === editingSchedule.id ? updated : s));
      setShowEditModal(false);
      setEditingSchedule(null);
      setScheduleForm({
        course: "",
        batch: "",
        teacher: "",
        day: "",
        start_time: "",
        end_time: "",
        room: ""
      });
      toast.success("Schedule updated successfully!");
    } catch (err) {
      toast.error("Failed to update schedule");
      console.error(err);
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!confirm("Delete this schedule?")) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await deleteSchedule(token, id);
      setRawSchedule(rawSchedule.filter(s => s.id !== id));
      toast.success("Schedule deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete schedule");
      console.error(err);
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

  const filteredSchedule = selectedDay === "all" 
    ? schedule 
    : schedule.filter(item => item.day === selectedDay);

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

        {/* Day Filter */}
        <div className="bg-background rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDay("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDay === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-background-light text-(--text)/80 hover:bg-background-light/50"
              }`}
            >
              All Days
            </button>
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedDay === day 
                    ? "bg-blue-600 text-white" 
                    : "bg-background-light text-(--text)/80 hover:bg-background-light/50"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedule.map((item) => {
            const rawItem = rawSchedule.find(s => s.id === item.id);
            return (
            <div key={item.id} className="bg-background rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-100">
                  <FaBook className="text-blue-600 text-xl" />
                </div>
                {canManage && rawItem && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditSchedule(rawItem)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteSchedule(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-(--text)">{item.courseName}</h3>
              </div>
              <p className="text-blue-600 font-semibold mb-4">{item.course !== "none" ? item.course : "Extra Curricular"}</p>

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

              <div className="mt-4 pt-4 border-t border-(--primary)/10 space-y-1">
                <p className="text-sm text-(--text)/70">
                  <span className="font-medium">Teacher:</span> {item.teacher}
                </p>
                <p className="text-sm text-(--text)/70">
                  <span className="font-medium">Batch:</span> {item.batch}
                </p>
              </div>
            </div>
            );
          })}
        </div>

        {filteredSchedule.length === 0 && (
          <div className="bg-background rounded-2xl shadow-lg p-12 text-center">
            <FaCalendar className="text-6xl text-(--text)/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-(--text) mb-2">No classes scheduled</h3>
            <p className="text-(--text)/70">
              {selectedDay === "all" ? "No classes found" : `No classes on ${selectedDay}`}
            </p>
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
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--text)/80 mb-2">End Time *</label>
                  <input 
                    type="time" 
                    value={scheduleForm.end_time}
                    onChange={(e) => setScheduleForm({...scheduleForm, end_time: e.target.value})}
                    className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500" 
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

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setScheduleForm({
                    course: "",
                    batch: "",
                    teacher: "",
                    day: "",
                    start_time: "",
                    end_time: "",
                    room: ""
                  });
                }} 
                className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddSchedule}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Schedule
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
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--text)/80 mb-2">End Time *</label>
                  <input 
                    type="time" 
                    value={scheduleForm.end_time}
                    onChange={(e) => setScheduleForm({...scheduleForm, end_time: e.target.value})}
                    className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500" 
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

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSchedule(null);
                  setScheduleForm({
                    course: "",
                    batch: "",
                    teacher: "",
                    day: "",
                    start_time: "",
                    end_time: "",
                    room: ""
                  });
                }} 
                className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateSchedule}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
