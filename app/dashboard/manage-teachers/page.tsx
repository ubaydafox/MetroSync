"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { FaUserTie, FaPlus, FaEdit, FaTrash, FaEnvelope } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTeachers, createTeacher, updateTeacher, deleteTeacher, Teacher } from "@/services/teacher";
import { toast } from "react-toastify";

export default function ManageTeachersPage() {
  const { user } = useGlobal();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({ name: "", email: "" });
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Check user role
  useEffect(() => {
    if (user?.role !== "hod" && user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Fetch teachers from Firestore
  useEffect(() => {
    if (user?.role !== "hod" && user?.role !== "admin") return;
    
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTeachers("", user.department ? Number(user.department) : undefined);
        setTeachers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch teachers");
        console.error("Error fetching teachers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [user]);

  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditForm({
      name: teacher.name,
      email: teacher.email,
    });
    setShowEditModal(true);
  };

  const handleAddTeacher = async () => {
    try {
      if (!addForm.name || !addForm.email) {
        toast.warn("Please fill in all fields");
        return;
      }

      const newTeacher = await createTeacher("", {
        name: addForm.name,
        email: addForm.email,
        department_id: user?.department ? Number(user.department) : undefined,
      });

      setTeachers([...teachers, newTeacher]);
      setShowAddModal(false);
      setAddForm({ name: "", email: "" });
      toast.success("Teacher added successfully");
    } catch (err) {
      console.error("Error creating teacher:", err);
      toast.error("Failed to add teacher. Please try again.");
    }
  };

  const handleUpdateTeacher = async () => {
    if (!selectedTeacher) return;
    
    try {
      const updatedTeacher = await updateTeacher("", selectedTeacher.id, {
        name: editForm.name,
        email: editForm.email,
      });

      setTeachers(teachers.map(t => 
        t.id === selectedTeacher.id ? updatedTeacher : t
      ));
      setShowEditModal(false);
      setSelectedTeacher(null);
      setEditForm({ name: "", email: "" });
      toast.success("Teacher updated");
    } catch (err) {
      console.error("Error updating teacher:", err);
      toast.error("Failed to update teacher. Please try again.");
    }
  };

  const handleDeleteTeacher = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the department?`)) {
      return;
    }
    try {
      await deleteTeacher("", id);
      setTeachers(teachers.filter(t => t.id !== id));
      toast.success("Teacher removed");
    } catch (err) {
      console.error("Error deleting teacher:", err);
      toast.error("Failed to delete teacher. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-(--text)/70 font-medium">Loading teachers...</p>
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
          <h2 className="text-2xl font-bold text-(--text) mb-2">Error Loading Teachers</h2>
          <p className="text-(--text)/70 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
            <h1 className="text-3xl font-bold text-(--text)">Manage Teachers</h1>
            <p className="text-(--text)/70 mt-1">Assign and manage department teachers</p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg"
          >
            <FaPlus /> Assign Teacher
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-background rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                  <FaUserTie className="text-green-600 dark:text-green-400 text-2xl" />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClick(teacher)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-(--text) mb-2">{teacher.name}</h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-(--text)/70">
                  <FaEnvelope className="text-(--text)/50" />
                  <span className="truncate">{teacher.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">Assign Teacher</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Teacher Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Dr. Rahman Ahmed" 
                  value={addForm.name}
                  onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-(--text)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="e.g., rahman@university.edu" 
                  value={addForm.email}
                  onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-(--text)"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm({ name: "", email: "" });
                  }} 
                  className="flex-1 px-4 py-2 border border-(--primary)/30 text-(--text)/80 rounded-lg hover:bg-background-light transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddTeacher}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">Edit Teacher</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Teacher Name</label>
                <input 
                  type="text" 
                  placeholder="Teacher Name" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-(--text)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-(--text)"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTeacher(null);
                    setEditForm({ name: "", email: "" });
                  }} 
                  className="flex-1 px-4 py-2 border border-(--primary)/30 text-(--text)/80 rounded-lg hover:bg-background-light transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateTeacher}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
