"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import {
  FaBuilding,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserTie,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  Department,
} from "@/services/department";
import { toast } from "react-toastify";

export default function ManageDepartmentsPage() {
  const { user } = useGlobal();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({
    name: "",
    short_name: "",
    description: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    short_name: "",
    description: "",
  });

  // Check user role
  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const [departments, setDepartments] = useState<Department[]>([]);

  // Fetch departments from backend
  useEffect(() => {
    if (user?.role !== "admin") return;

    const fetchDepartments = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const data = await getDepartments(token);
        setDepartments(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch departments"
        );
        console.error("Error fetching departments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [user]);

  const handleEditClick = (dept: Department) => {
    setSelectedDepartment(dept);
    setEditForm({
      name: dept.name,
      short_name: dept.short_name,
      description: dept.description || "",
    });
    setShowEditModal(true);
  };

  const handleAddDepartment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      if (!addForm.name || !addForm.short_name) {
        toast.warn("Please fill in all required fields");
        return;
      }

      const newDepartment = await createDepartment(token, {
        name: addForm.name,
        short_name: addForm.short_name,
        description: addForm.description,
      });

      setDepartments([...departments, newDepartment]);
      setShowAddModal(false);
      setAddForm({ name: "", short_name: "", description: "" });
    } catch (err) {
      console.error("Error creating department:", err);
      toast.error("Failed to add department. Please try again.");
    }
  };

  const handleUpdateDepartment = async () => {
    if (!selectedDepartment) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const updatedDepartment = await updateDepartment(
        token,
        selectedDepartment.id,
        {
          name: editForm.name,
          short_name: editForm.short_name,
          description: editForm.description,
        }
      );

      setDepartments(
        departments.map((d) =>
          d.id === selectedDepartment.id ? updatedDepartment : d
        )
      );
      setShowEditModal(false);
      setSelectedDepartment(null);
      setEditForm({ name: "", short_name: "", description: "" });
    } catch (err) {
      console.error("Error updating department:", err);
      toast.error("Failed to update department. Please try again.");
    }
  };

  const handleDeleteDepartment = async (id: number, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete ${name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      await deleteDepartment(token, id);
      setDepartments(departments.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Error deleting department:", err);
      toast.error("Failed to delete department. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-(--text)/70 font-medium">Loading departments...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-background rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-(--text) mb-2">
            Error Loading Departments
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-(--text)">
              Manage Departments
            </h1>
            <p className="text-(--text)/70 mt-1">
              Create and manage university departments
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
          >
            <FaPlus /> Add Department
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-background rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-t-4 border-blue-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-100">
                  <FaBuilding className="text-blue-600 text-2xl" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(dept)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-(--text) mb-1">
                {dept.name}
              </h3>
              <p className="text-sm font-medium text-blue-600 mb-4">
                {dept.short_name}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-(--text)/70">
                  <FaUserTie className="text-(--text)/50" />
                  <span>HOD: {dept.hod}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-background-light rounded-lg p-2">
                  <FaChalkboardTeacher className="text-green-600 mx-auto mb-1" />
                  <p className="font-bold text-(--text)">{dept.teachers}</p>
                  <p className="text-xs text-(--text)/70">Teachers</p>
                </div>
                <div className="bg-background-light rounded-lg p-2">
                  <FaUsers className="text-purple-600 mx-auto mb-1" />
                  <p className="font-bold text-(--text)">{dept.students}</p>
                  <p className="text-xs text-(--text)/70">Students</p>
                </div>
                <div className="bg-background-light rounded-lg p-2">
                  <FaBuilding className="text-orange-600 mx-auto mb-1" />
                  <p className="font-bold text-(--text)">{dept.courses}</p>
                  <p className="text-xs text-(--text)/70">Courses</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">
              Add New Department
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Computer Science & Engineering"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm({ ...addForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Short Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., CSE"
                  value={addForm.short_name}
                  onChange={(e) =>
                    setAddForm({ ...addForm, short_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Enter department description"
                  rows={3}
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm({ ...addForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm({ name: "", short_name: "", description: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-(--primary)/30 text-(--text)/80 rounded-lg hover:bg-background-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDepartment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Department
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">
              Edit Department
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  placeholder="Department Name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Short Name
                </label>
                <input
                  type="text"
                  placeholder="Short Name"
                  value={editForm.short_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, short_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Description"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedDepartment(null);
                    setEditForm({ name: "", short_name: "", description: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-(--primary)/30 text-(--text)/80 rounded-lg hover:bg-background-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateDepartment}
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
