"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { FaUserTie, FaPlus, FaEdit, FaTrash, FaEnvelope, FaBuilding } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHODs, createHOD, updateHOD, deleteHOD, HOD } from "@/services/hod";
import { getDepartments, Department } from "@/services/department";
import { getTeachers, Teacher } from "@/services/teacher";
import { toast } from "react-toastify";

export default function ManageHODsPage() {
  const { user } = useGlobal();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHOD, setSelectedHOD] = useState<HOD | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({ teacher_id: "", department_id: "" });
  const [editForm, setEditForm] = useState({ teacher_id: "", department_id: "" });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Check user role
  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const [hods, setHODs] = useState<HOD[]>([]);

  // Fetch HODs, teachers, and departments from backend
  useEffect(() => {
    if (user?.role !== "admin") return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        
        const [hodsData, teachersData, departmentsData] = await Promise.all([
          getHODs(token),
          getTeachers(token),
          getDepartments(token)
        ]);
        
        setHODs(hodsData);
        setTeachers(teachersData);
        setDepartments(departmentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleEditClick = (hod: HOD) => {
    setSelectedHOD(hod);
    // Find the teacher and department IDs based on names
    const teacher = teachers.find(t => t.name === hod.name);
    const dept = departments.find(d => d.name === hod.department);
    
    setEditForm({
      teacher_id: teacher?.id.toString() || "",
      department_id: dept?.id.toString() || ""
    });
    setShowEditModal(true);
  };

  const handleAddHOD = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      if (!addForm.teacher_id || !addForm.department_id) {
        toast.warn("Please select both teacher and department");
        return;
      }

      const newHOD = await createHOD(token, {
        teacher_id: parseInt(addForm.teacher_id),
        department_id: parseInt(addForm.department_id)
      });

      setHODs([...hods, newHOD]);
      setShowAddModal(false);
      setAddForm({ teacher_id: "", department_id: "" });
    } catch (err) {
      console.error("Error creating HOD:", err);
      toast.error("Failed to assign HOD. Please try again.");
    }
  };

  const handleUpdateHOD = async () => {
    if (!selectedHOD) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const updatedHOD = await updateHOD(token, selectedHOD.id, {
        teacher_id: parseInt(editForm.teacher_id),
        department_id: parseInt(editForm.department_id)
      });

      setHODs(hods.map(h => 
        h.id === selectedHOD.id ? updatedHOD : h
      ));
      setShowEditModal(false);
      setSelectedHOD(null);
      setEditForm({ teacher_id: "", department_id: "" });
    } catch (err) {
      console.error("Error updating HOD:", err);
      toast.error("Failed to update HOD. Please try again.");
    }
  };

  const handleDeleteHOD = async (id: number, name: string, department: string) => {
    if (!confirm(`Are you sure you want to remove ${name} as HOD of ${department}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      await deleteHOD(token, id);
      setHODs(hods.filter(h => h.id !== id));
    } catch (err) {
      console.error("Error deleting HOD:", err);
      toast.error("Failed to remove HOD. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-(--text)/70 font-medium">Loading HODs...</p>
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
          <h2 className="text-2xl font-bold text-(--text) mb-2">Error Loading HODs</h2>
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
            <h1 className="text-3xl font-bold text-(--text)">Manage HODs</h1>
            <p className="text-(--text)/70 mt-1">Assign and manage department heads</p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg"
          >
            <FaPlus /> Assign HOD
          </button>
        </div>

        {hods.length === 0 ? (
          <div className="bg-background rounded-2xl shadow-lg p-12 text-center">
            <FaUserTie className="text-6xl text-(--text)/40 mx-auto mb-4" />
            <p className="text-(--text)/60 text-lg">No HODs found. Assign a teacher as HOD to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hods.map((hod) => (
              <div key={hod.id} className="bg-background rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-t-4 border-green-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-100">
                    <FaUserTie className="text-green-600 text-2xl" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditClick(hod)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteHOD(hod.id, hod.name, hod.department)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

              <h3 className="text-xl font-bold text-(--text) mb-2">{hod.name}</h3>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-(--text)/70">
                  <FaBuilding className="text-(--text)/50" />
                  <span className="font-medium">{hod.department}</span>
                </div>
                <div className="flex items-center gap-2 text-(--text)/70">
                  <FaEnvelope className="text-(--text)/50" />
                  <span className="truncate">{hod.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-sm pt-4 border-t border-(--primary)/10">
                <div>
                  <p className="font-bold text-(--text)">{hod.teachers || 0}</p>
                  <p className="text-xs text-(--text)/70">Teachers</p>
                </div>
                <div>
                  <p className="font-bold text-(--text)">{hod.students || 0}</p>
                  <p className="text-xs text-(--text)/70">Students</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">Assign HOD</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Select Teacher</label>
                <select 
                  value={addForm.teacher_id}
                  onChange={(e) => setAddForm({...addForm, teacher_id: e.target.value})}
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Select Department</label>
                <select 
                  value={addForm.department_id}
                  onChange={(e) => setAddForm({...addForm, department_id: e.target.value})}
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm({ teacher_id: "", department_id: "" });
                  }} 
                  className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddHOD}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Assign HOD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedHOD && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">Edit HOD</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Select Teacher</label>
                <select 
                  value={editForm.teacher_id}
                  onChange={(e) => setEditForm({...editForm, teacher_id: e.target.value})}
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">Select Department</label>
                <select 
                  value={editForm.department_id}
                  onChange={(e) => setEditForm({...editForm, department_id: e.target.value})}
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedHOD(null);
                    setEditForm({ teacher_id: "", department_id: "" });
                  }} 
                  className="flex-1 px-4 py-2 border border-(--primary)/30 rounded-lg hover:bg-background-light transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateHOD}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update HOD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
