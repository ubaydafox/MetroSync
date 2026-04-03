"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { useParams } from "next/navigation";
import {
  FaBook,
  FaUsers,
  FaPlus,
  FaTrash,
  FaEdit,
  FaFileUpload,
  FaBell,
  FaTasks,
  FaChalkboardTeacher,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import {
  getCourseMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  Material,
} from "@/services/material";
import {
  getCourseTasks,
  createTask,
  updateTask,
  deleteTask,
  Task,
} from "@/services/task";
import {
  getCourseNotices,
  createCourseNotice,
  updateCourseNotice,
  deleteCourseNotice,
  CourseNotice,
} from "@/services/courseNotice";
import {
  getCourseStudents,
  addStudentToCourse,
  removeStudentFromCourse,
  Student,
} from "@/services/student";
import { getCourseById, CourseDetails } from "@/services/course";
import { toast } from "react-toastify";

export default function CourseDetailsPage() {
  const { user } = useGlobal();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingNotice, setEditingNotice] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingTask, setEditingTask] = useState<any>(null);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState("");

  const [notices, setNotices] = useState<CourseNotice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [noticesError, setNoticesError] = useState("");

  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState("");

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState("");

  // Form states for materials
  const [materialForm, setMaterialForm] = useState({
    title: "",
    type: "",
    link: "",
  });

  // Form states for tasks
  const [taskForm, setTaskForm] = useState({
    title: "",
    type: "",
    due_date: "",
    points: "",
    description: "",
  });

  // Form states for notices
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    message: "",
  });

  // Form states for students
  const [studentForm, setStudentForm] = useState({
    roll: "",
  });

  // Fetch course details on component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setCourseLoading(true);
        setCourseError(""); // Clear previous errors
        const token = localStorage.getItem("token");
        if (!token || !params.courseId) return;

        const data = await getCourseById(token, params.courseId as string);
        setCourse(data);
      } catch (err) {
        setCourseError("Failed to load course details");
        console.error(err);
      } finally {
        setCourseLoading(false);
      }
    };

    fetchCourse();
  }, [params.courseId]);

  // Fetch materials on component mount
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setError(""); // Clear previous errors
        const token = localStorage.getItem("token");
        if (!token || !params.courseId) return;

        const data = await getCourseMaterials(token, params.courseId as string);
        console.log("Materials data:", data); // Debug log
        setMaterials(data);
      } catch (err) {
        setError("Failed to load materials");
        console.error("Materials error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [params.courseId]);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setTasksLoading(true);
        setTasksError(""); // Clear previous errors
        const token = localStorage.getItem("token");
        if (!token || !params.courseId) return;

        const data = await getCourseTasks(token, params.courseId as string);
        console.log("Tasks data:", data); // Debug log
        setTasks(data);
      } catch (err) {
        setTasksError("Failed to load tasks");
        console.error("Tasks error:", err);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, [params.courseId]);

  // Fetch notices on component mount
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setNoticesLoading(true);
        setNoticesError(""); // Clear previous errors
        const token = localStorage.getItem("token");
        if (!token || !params.courseId) return;

        const data = await getCourseNotices(token, params.courseId as string);
        setNotices(data);
      } catch (err) {
        setNoticesError("Failed to load notices");
        console.error(err);
      } finally {
        setNoticesLoading(false);
      }
    };

    fetchNotices();
  }, [params.courseId]);

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setStudentsLoading(true);
        setStudentsError(""); // Clear previous errors
        const token = localStorage.getItem("token");
        if (!token || !params.courseId) return;

        const data = await getCourseStudents(token, params.courseId as string);
        setStudents(data);
      } catch (err) {
        setStudentsError("Failed to load students");
        console.error(err);
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
  }, [params.courseId]);

  const canManage = user?.role === "teacher" || user?.role === "hod";

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Remove this student from the course?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await removeStudentFromCourse(token, params.courseId as string, id);
      setStudents(students.filter((s) => s.id !== id));
      toast.success("Student removed successfully!");
    } catch (err) {
      toast.error("Failed to remove student");
      console.error(err);
    }
  };

  const handleAddStudent = async () => {
    if (!studentForm.roll) {
      toast.warn("Please enter student roll number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const newStudent = await addStudentToCourse(token, {
        roll: studentForm.roll,
        course: parseInt(params.courseId as string),
      });

      setStudents([...students, newStudent]);
      setShowAddStudent(false);
      setStudentForm({ roll: "" });
      toast.success("Student added successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleDeleteMaterial = async (id: number) => {
    if (!confirm("Delete this material?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await deleteMaterial(token, params.courseId as string, id);
      setMaterials(materials.filter((m) => m.id !== id));
      toast.success("Material deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete material");
      console.error(err);
    }
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setMaterialForm({
      title: material.title,
      type: material.type,
      link: material.link,
    });
  };

  const handleAddMaterial = async () => {
    if (!materialForm.title || !materialForm.type || !materialForm.link) {
      toast.warn("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const newMaterial = await createMaterial(token, {
        ...materialForm,
        course: parseInt(params.courseId as string),
      });

      setMaterials([...materials, newMaterial]);
      setShowAddMaterial(false);
      setMaterialForm({ title: "", type: "", link: "" });
      toast.success("Material added successfully!");
    } catch (err) {
      toast.error("Failed to add material");
      console.error(err);
    }
  };

  const handleUpdateMaterial = async () => {
    if (!materialForm.title || !materialForm.type || !materialForm.link) {
      toast.warn("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token || !editingMaterial) return;

      const updated = await updateMaterial(
        token,
        params.courseId as string,
        editingMaterial.id,
        materialForm
      );

      setMaterials(
        materials.map((m) => (m.id === editingMaterial.id ? updated : m))
      );
      setEditingMaterial(null);
      setMaterialForm({ title: "", type: "", link: "" });
      toast.success("Material updated successfully!");
    } catch (err) {
      toast.error("Failed to update material");
      console.error(err);
    }
  };

  const handleDeleteNotice = async (id: number) => {
    if (!confirm("Delete this notice?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await deleteCourseNotice(token, params.courseId as string, id);
      setNotices(notices.filter((n) => n.id !== id));
      toast.success("Notice deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete notice");
      console.error(err);
    }
  };

  const handleEditNotice = (notice: CourseNotice) => {
    setEditingNotice(notice);
    setNoticeForm({
      title: notice.title,
      message: notice.message,
    });
  };

  const handleAddNotice = async () => {
    if (!noticeForm.title || !noticeForm.message) {
      toast.warn("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const newNotice = await createCourseNotice(token, {
        ...noticeForm,
        course: parseInt(params.courseId as string),
      });

      setNotices([...notices, newNotice]);
      setShowAddNotice(false);
      setNoticeForm({ title: "", message: "" });
      toast.success("Notice posted successfully!");
    } catch (err) {
      toast.error("Failed to post notice");
      console.error(err);
    }
  };

  const handleUpdateNotice = async () => {
    if (!noticeForm.title || !noticeForm.message) {
      toast.warn("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token || !editingNotice) return;

      const updated = await updateCourseNotice(
        token,
        params.courseId as string,
        editingNotice.id,
        noticeForm
      );

      setNotices(notices.map((n) => (n.id === editingNotice.id ? updated : n)));
      setEditingNotice(null);
      setNoticeForm({ title: "", message: "" });
      toast.success("Notice updated successfully!");
    } catch (err) {
      toast.error("Failed to update notice");
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Delete this task?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await deleteTask(token, params.courseId as string, id);
      setTasks(tasks.filter((t) => t.id !== id));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error(err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      type: task.type,
      due_date: task.due_date,
      points: task.points.toString(),
      description: task.description,
    });
  };

  const handleAddTask = async () => {
    if (
      !taskForm.title ||
      !taskForm.type ||
      !taskForm.due_date ||
      !taskForm.points
    ) {
      toast.warn("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const newTask = await createTask(token, {
        ...taskForm,
        points: parseInt(taskForm.points),
        course: parseInt(params.courseId as string),
      });

      setTasks([...tasks, newTask]);
      setShowAddTask(false);
      setTaskForm({
        title: "",
        type: "",
        due_date: "",
        points: "",
        description: "",
      });
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Failed to create task");
      console.error(err);
    }
  };

  const handleUpdateTask = async () => {
    if (
      !taskForm.title ||
      !taskForm.type ||
      !taskForm.due_date ||
      !taskForm.points
    ) {
      toast.warn("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token || !editingTask) return;

      const updated = await updateTask(
        token,
        params.courseId as string,
        editingTask.id,
        {
          ...taskForm,
          points: parseInt(taskForm.points),
        }
      );

      setTasks(tasks.map((t) => (t.id === editingTask.id ? updated : t)));
      setEditingTask(null);
      setTaskForm({
        title: "",
        type: "",
        due_date: "",
        points: "",
        description: "",
      });
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error("Failed to update task");
      console.error(err);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaBook /> },
    { id: "materials", label: "Materials", icon: <FaFileUpload /> },
    { id: "tasks", label: "Tasks", icon: <FaTasks /> },
    { id: "notices", label: "Notices", icon: <FaBell /> },
    { id: "students", label: "Students", icon: <FaUsers /> },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Course Header */}
        {courseLoading ? (
          <div className="bg-background rounded-2xl shadow-lg p-6 mb-6">
            <div className="animate-pulse">
              <div className="h-8 bg-background-light/50 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-background-light/50 rounded w-1/4"></div>
            </div>
          </div>
        ) : courseError ? (
          <div className="bg-background rounded-2xl shadow-lg p-6 mb-6">
            <div className="text-red-600">{courseError}</div>
          </div>
        ) : course ? (
          <div className="bg-background rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-blue-100">
                  <FaBook className="text-blue-600 text-3xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-(--text)">
                    {course.name}
                  </h1>
                  <p className="text-(--text)/70 mt-1">
                    {course.code} • {course.credits} Credits
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-(--text)/70">
                <FaChalkboardTeacher className="text-blue-500" />
                <span>{course.teacher_name}</span>
              </div>
              <div className="flex items-center gap-2 text-(--text)/70">
                <FaUsers className="text-purple-500" />
                <span>{course.student_count} Students</span>
              </div>
              <div className="flex items-center gap-2 text-(--text)/70">
                <FaTasks className="text-orange-500" />
                <span>{course.task_count} Tasks</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Navigation Tabs */}
        <div className="bg-background rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-background-light text-(--text)/80 hover:bg-background-light/50"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {courseLoading ? (
                <div className="bg-background rounded-2xl shadow-lg p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-background-light/50 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-background-light/50 rounded w-3/4 mb-6"></div>
                  </div>
                </div>
              ) : course ? (
                <>
                  <div className="bg-background rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-(--text) mb-4">
                      Course Overview
                    </h2>
                    <p className="text-(--text)/70 mb-6">{course.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <h3 className="font-semibold text-(--text) mb-2">
                          Course Information
                        </h3>
                        <div className="space-y-2 text-sm text-(--text)/70">
                          <p>
                            <strong>Code:</strong> {course.code}
                          </p>
                          <p>
                            <strong>Credits:</strong> {course.credits}
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                        <h3 className="font-semibold text-(--text) mb-2">
                          Quick Stats
                        </h3>
                        <div className="space-y-2 text-sm text-(--text)/70">
                          <p>
                            <strong>Enrolled Students:</strong>{" "}
                            {course.student_count}
                          </p>
                          <p>
                            <strong>Course Materials:</strong>{" "}
                            {course.material_count}
                          </p>
                          <p>
                            <strong>Active Tasks:</strong>{" "}
                            {course.active_task_count}
                          </p>
                          <p>
                            <strong>Recent Notices:</strong>{" "}
                            {course.notice_count}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-background rounded-2xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-(--text) mb-4">
                        Recent Materials
                      </h3>
                      <div className="space-y-3">
                        {loading ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          </div>
                        ) : materials.length === 0 ? (
                          <p className="text-(--text)/60 text-sm">
                            No materials yet
                          </p>
                        ) : (
                          materials.slice(0, 3).map((material) => (
                            <div
                              key={material.id}
                              className="bg-background-light rounded-lg p-3"
                            >
                              <p className="font-medium text-(--text) text-sm">
                                {material.title}
                              </p>
                              <p className="text-xs text-(--text)/60">
                                {new Date(material.date).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-background rounded-2xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-(--text) mb-4">
                        Upcoming Tasks
                      </h3>
                      <div className="space-y-3">
                        {tasksLoading ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                          </div>
                        ) : tasks.length === 0 ? (
                          <p className="text-(--text)/60 text-sm">No tasks yet</p>
                        ) : (
                          tasks.slice(0, 3).map((task) => (
                            <div
                              key={task.id}
                              className="bg-background-light rounded-lg p-3"
                            >
                              <p className="font-medium text-(--text) text-sm">
                                {task.title}
                              </p>
                              <p className="text-xs text-(--text)/60">
                                Due:{" "}
                                {new Date(task.due_date).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === "materials" && (
            <div className="bg-background rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-(--text)">
                  Course Materials
                </h2>
                {canManage && (
                  <button
                    onClick={() => setShowAddMaterial(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlus /> Upload Material
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-(--text)/70 mt-4">Loading materials...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-600">{error}</div>
                ) : materials.length === 0 ? (
                  <div className="text-center py-8 text-(--text)/60">
                    No materials available
                  </div>
                ) : (
                  materials.map((material) => (
                    <div
                      key={material.id}
                      className="bg-background-light rounded-xl p-5 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 rounded-lg bg-blue-100">
                            <FaFileUpload className="text-blue-600 text-xl" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-(--text) text-lg">
                              {material.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-(--text)/70 mt-2">
                              <span>{material.type}</span>
                              <span>•</span>
                              <span>Uploaded by {material.uploaded_by}</span>
                              <span>•</span>
                              <span>
                                {new Date(material.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={material.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FaExternalLinkAlt /> Open
                          </a>
                          {canManage && (
                            <>
                              <button
                                onClick={() => handleEditMaterial(material)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteMaterial(material.id)
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div className="bg-background rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-(--text)">
                  Course Tasks
                </h2>
                {canManage && (
                  <button
                    onClick={() => setShowAddTask(true)}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <FaPlus /> Create Task
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {tasksLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="text-(--text)/70 mt-4">Loading tasks...</p>
                  </div>
                ) : tasksError ? (
                  <div className="text-center py-8 text-red-600">
                    {tasksError}
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8 text-(--text)/60">
                    No tasks available
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-background-light rounded-xl p-5 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className={`p-3 rounded-lg ${
                              task.type === "assignment"
                                ? "bg-orange-100"
                                : task.type === "quiz"
                                ? "bg-purple-100"
                                : "bg-green-100"
                            }`}
                          >
                            <FaTasks
                              className={`text-xl ${
                                task.type === "assignment"
                                  ? "text-orange-600"
                                  : task.type === "quiz"
                                  ? "text-purple-600"
                                  : "text-green-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-(--text) text-lg">
                                {task.title}
                              </h3>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                                {task.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-(--text)/70 mt-2">
                              <span>
                                Due:{" "}
                                {new Date(task.due_date).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>{task.points} points</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {canManage && (
                            <>
                              <button
                                onClick={() => handleEditTask(task)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Notices Tab */}
          {activeTab === "notices" && (
            <div className="bg-background rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-(--text)">
                  Course Notices
                </h2>
                {canManage && (
                  <button
                    onClick={() => setShowAddNotice(true)}
                    className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <FaPlus /> Post Notice
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {noticesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
                    <p className="text-(--text)/70 mt-4">Loading notices...</p>
                  </div>
                ) : noticesError ? (
                  <div className="text-center py-8 text-red-600">
                    {noticesError}
                  </div>
                ) : notices.length === 0 ? (
                  <div className="text-center py-8 text-(--text)/60">
                    No notices available
                  </div>
                ) : (
                  notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="bg-yellow-50 rounded-xl p-5 border-l-4 border-yellow-500 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-(--text) text-lg mb-2">
                            {notice.title}
                          </h3>
                          <p className="text-(--text)/70 mb-3">{notice.message}</p>
                          <div className="flex items-center gap-4 text-sm text-(--text)/60">
                            <span>By {notice.author}</span>
                            <span>•</span>
                            <span>
                              {new Date(notice.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {canManage && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditNotice(notice)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(notice.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="bg-background rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-(--text)">
                  Enrolled Students
                </h2>
                {canManage && (
                  <button
                    onClick={() => setShowAddStudent(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <FaPlus /> Add Student
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentsLoading ? (
                  <div className="col-span-2 text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-(--text)/70 mt-4">Loading students...</p>
                  </div>
                ) : studentsError ? (
                  <div className="col-span-2 text-center py-8 text-red-600">
                    {studentsError}
                  </div>
                ) : students.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-(--text)/60">
                    No students enrolled
                  </div>
                ) : (
                  students.map((student) => (
                    <div
                      key={student.id}
                      className="bg-purple-50 rounded-xl p-5 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-(--text)">
                              {student.name}
                            </h3>
                            <p className="text-sm text-(--text)/70">
                              {student.roll}
                            </p>
                            <p className="text-xs text-(--text)/60">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        {canManage && (
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">
              Add Student
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Student Roll Number"
                value={studentForm.roll}
                onChange={(e) => setStudentForm({ roll: e.target.value })}
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddStudent(false);
                    setStudentForm({ roll: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Material Modal */}
      {showAddMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">
              Add Material
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={materialForm.title}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={materialForm.type}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="PDF">PDF</option>
                <option value="Document">Document</option>
                <option value="Presentation">Presentation</option>
                <option value="Video">Video</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="url"
                placeholder="Material Link (Google Drive, Docs, etc.)"
                value={materialForm.link}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, link: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddMaterial(false);
                    setMaterialForm({ title: "", type: "", link: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMaterial}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Material
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Material Modal */}
      {editingMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">
              Edit Material
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={materialForm.title}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={materialForm.type}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="PDF">PDF</option>
                <option value="Document">Document</option>
                <option value="Presentation">Presentation</option>
                <option value="Video">Video</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="url"
                placeholder="Material Link (Google Drive, Docs, etc.)"
                value={materialForm.link}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, link: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingMaterial(null);
                    setMaterialForm({ title: "", type: "", link: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMaterial}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Material
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Notice Modal */}
      {showAddNotice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">
              Post Notice
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Notice Title"
                value={noticeForm.title}
                onChange={(e) =>
                  setNoticeForm({ ...noticeForm, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
              <textarea
                placeholder="Notice Content"
                rows={4}
                value={noticeForm.message}
                onChange={(e) =>
                  setNoticeForm({ ...noticeForm, message: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-yellow-500"
              ></textarea>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddNotice(false);
                    setNoticeForm({ title: "", message: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNotice}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Post Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {editingNotice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">
              Edit Notice
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Notice Title"
                value={noticeForm.title}
                onChange={(e) =>
                  setNoticeForm({ ...noticeForm, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
              <textarea
                placeholder="Notice Content"
                rows={4}
                value={noticeForm.message}
                onChange={(e) =>
                  setNoticeForm({ ...noticeForm, message: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-yellow-500"
              ></textarea>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingNotice(null);
                    setNoticeForm({ title: "", message: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateNotice}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Update Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">
              Create Task
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <select
                value={taskForm.type}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Type</option>
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="lab">Lab</option>
                <option value="project">Project</option>
              </select>
              <input
                type="date"
                value={taskForm.due_date}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, due_date: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="Points"
                value={taskForm.points}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, points: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <textarea
                placeholder="Task Description"
                rows={3}
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-orange-500"
              ></textarea>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddTask(false);
                    setTaskForm({
                      title: "",
                      type: "",
                      due_date: "",
                      points: "",
                      description: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">Edit Task</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <select
                value={taskForm.type}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Type</option>
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="lab">Lab</option>
                <option value="project">Project</option>
              </select>
              <input
                type="date"
                value={taskForm.due_date}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, due_date: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="Points"
                value={taskForm.points}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, points: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <textarea
                placeholder="Task Description"
                rows={3}
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-orange-500"
              ></textarea>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setTaskForm({
                      title: "",
                      type: "",
                      due_date: "",
                      points: "",
                      description: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTask}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Update Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
