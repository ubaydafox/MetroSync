"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import Link from "next/link";
import { FaBook, FaPlus, FaEdit, FaTrash, FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getCourses, createCourse, updateCourse, deleteCourse, Course } from "@/services/course";
import { getTeachers, Teacher } from "@/services/teacher";
import { toast } from "react-toastify";

export default function CoursesPage() {
  const { user } = useGlobal();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: "", name: "", credits: "", teacher: "", description: "" });
  const [editCourse, setEditCourse] = useState({ id: 0, code: "", name: "", credits: "", teacher: "", teacherName: "", description: "" });
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherSearchAdd, setTeacherSearchAdd] = useState("");
  const [teacherSearchEdit, setTeacherSearchEdit] = useState("");

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const data = await getCourses(token);
        setCourses(data);
        setError(null);
      } catch (err) {
        setError('Failed to load courses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const data = await getTeachers(token);
        setTeachers(data);
      } catch (err) {
        console.error('Failed to load teachers', err);
      }
    };

    fetchTeachers();
  }, []);

  const handleAddCourse = async () => {
    if (!newCourse.code || !newCourse.name || !newCourse.credits) {
      toast.warn("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const createdCourse = await createCourse(token, {
        code: newCourse.code,
        name: newCourse.name,
        credits: parseInt(newCourse.credits),
        teacher: newCourse.teacher ? parseInt(newCourse.teacher) : undefined,
        description: newCourse.description || undefined
      });

      setCourses([...courses, createdCourse]);
      setShowAddModal(false);
      setNewCourse({ code: "", name: "", credits: "", teacher: "", description: "" });
      setTeacherSearchAdd("");
      toast.success("Course created successfully!");
    } catch (err) {
      toast.error("Failed to create course");
      console.error(err);
    }
  };

  const handleEditClick = (e: React.MouseEvent, course: Course) => {
    e.preventDefault(); // Prevent navigation to course details
    e.stopPropagation(); // Stop event bubbling
    setEditCourse({
      id: course.id,
      code: course.code,
      name: course.name,
      credits: course.credits.toString(),
      teacher: "", // Will be set when teacher is selected
      teacherName: course.teacher_name,
      description: ""
    });
    setTeacherSearchEdit(course.teacher_name);
    setShowEditModal(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, course: Course) => {
    e.preventDefault(); // Prevent navigation to course details
    e.stopPropagation(); // Stop event bubbling
    setDeletingCourse(course);
    setShowDeleteModal(true);
  };

  const handleUpdateCourse = async () => {
    if (!editCourse.code || !editCourse.name || !editCourse.credits) {
      toast.warn("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const updated = await updateCourse(token, editCourse.id, {
        code: editCourse.code,
        name: editCourse.name,
        credits: parseInt(editCourse.credits),
        teacher: editCourse.teacher ? parseInt(editCourse.teacher) : undefined,
        description: editCourse.description || undefined
      });

      setCourses(courses.map(c => c.id === editCourse.id ? updated : c));
      setShowEditModal(false);
      setEditCourse({ id: 0, code: "", name: "", credits: "", teacher: "", teacherName: "", description: "" });
      setTeacherSearchEdit("");
      toast.success("Course updated successfully!");
    } catch (err) {
      toast.error("Failed to update course");
      console.error(err);
    }
  };


  const handleConfirmDelete = async () => {
    if (!deletingCourse) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await deleteCourse(token, deletingCourse.id);
      setCourses(courses.filter(c => c.id !== deletingCourse.id));
      setShowDeleteModal(false);
      setDeletingCourse(null);
      toast.success("Course deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete course");
      console.error(err);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Courses</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {user?.role === "hod" ? "Manage Courses" : user?.role === "teacher" ? "My Courses" : "Enrolled Courses"}
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.role === "hod" ? "Add, edit and manage all department courses" : 
               user?.role === "teacher" ? "Courses you are teaching" : 
               "Your enrolled courses for this semester"}
            </p>
          </div>

          {user?.role === "hod" && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <FaPlus /> Add Course
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-t-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <FaBook className="text-blue-600 text-2xl" />
                  </div>
                  {user?.role === "hod" && (
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => handleEditClick(e, course)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit course"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClick(e, course)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete course"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{course.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <span className="font-semibold text-blue-600">{course.code}</span>
                  <span>•</span>
                  <span>{course.credits} Credits</span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaChalkboardTeacher className="text-gray-400" />
                    <span>{course.teacher_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-gray-400" />
                    <span>{course.student_count} students</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Add Course Modal - HOD Only */}
      {showAddModal && user?.role === "hod" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Course</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g., CSE401"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineering"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                <input
                  type="number"
                  placeholder="e.g., 3"
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({...newCourse, credits: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Teacher (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search teacher by name..."
                    value={teacherSearchAdd}
                    onChange={(e) => setTeacherSearchAdd(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {teacherSearchAdd && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {teachers
                        .filter(t => t.name.toLowerCase().includes(teacherSearchAdd.toLowerCase()))
                        .map(teacher => (
                          <button
                            key={teacher.id}
                            type="button"
                            onClick={() => {
                              setNewCourse({...newCourse, teacher: teacher.id.toString()});
                              setTeacherSearchAdd(teacher.name);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors"
                          >
                            <p className="font-medium text-gray-800">{teacher.name}</p>
                            <p className="text-xs text-gray-500">{teacher.email}</p>
                          </button>
                        ))}
                      {teachers.filter(t => t.name.toLowerCase().includes(teacherSearchAdd.toLowerCase())).length === 0 && (
                        <div className="px-4 py-2 text-gray-500 text-sm">No teachers found</div>
                      )}
                    </div>
                  )}
                </div>
                {newCourse.teacher && (
                  <p className="text-xs text-green-600 mt-1">✓ Teacher selected</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Course description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCourse({ code: "", name: "", credits: "", teacher: "", description: "" });
                  setTeacherSearchAdd("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal - HOD Only */}
      {showEditModal && user?.role === "hod" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Course</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g., CSE401"
                  value={editCourse.code}
                  onChange={(e) => setEditCourse({...editCourse, code: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineering"
                  value={editCourse.name}
                  onChange={(e) => setEditCourse({...editCourse, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                <input
                  type="number"
                  placeholder="e.g., 3"
                  value={editCourse.credits}
                  onChange={(e) => setEditCourse({...editCourse, credits: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Teacher</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search teacher by name..."
                    value={teacherSearchEdit}
                    onChange={(e) => setTeacherSearchEdit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {teacherSearchEdit && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {teachers
                        .filter(t => t.name.toLowerCase().includes(teacherSearchEdit.toLowerCase()))
                        .map(teacher => (
                          <button
                            key={teacher.id}
                            type="button"
                            onClick={() => {
                              setEditCourse({...editCourse, teacher: teacher.id.toString(), teacherName: teacher.name});
                              setTeacherSearchEdit(teacher.name);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors"
                          >
                            <p className="font-medium text-gray-800">{teacher.name}</p>
                            <p className="text-xs text-gray-500">{teacher.email}</p>
                          </button>
                        ))}
                      {teachers.filter(t => t.name.toLowerCase().includes(teacherSearchEdit.toLowerCase())).length === 0 && (
                        <div className="px-4 py-2 text-gray-500 text-sm">No teachers found</div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Current: {editCourse.teacherName || "Not assigned"}
                  {editCourse.teacher && editCourse.teacher !== editCourse.teacherName && " → Will be updated"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Course description"
                  value={editCourse.description}
                  onChange={(e) => setEditCourse({...editCourse, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditCourse({ id: 0, code: "", name: "", credits: "", teacher: "", teacherName: "", description: "" });
                  setTeacherSearchEdit("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCourse}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - HOD Only */}
      {showDeleteModal && deletingCourse && user?.role === "hod" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Delete Course?</h2>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete <strong>{deletingCourse.name}</strong> ({deletingCourse.code})?
            </p>
            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone. All associated materials, tasks, and notices will be deleted.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingCourse(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
