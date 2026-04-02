"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { FaGraduationCap, FaPlus, FaEdit, FaTrash, FaBuilding, FaUsers, FaCalendar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBatches, createBatch, updateBatch, deleteBatch, Batch } from "@/services/batch";
import { getDepartments, Department } from "@/services/department";
import { toast } from "react-toastify";

export default function ManageBatchesPage() {
  const { user } = useGlobal();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({
    name: "",
    year: new Date().getFullYear().toString(),
    department_id: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    year: "",
    department_id: "",
  });
  const [batches, setBatches] = useState<Batch[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Check user role
  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Fetch batches and departments from backend
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

        const [batchesData, departmentsData] = await Promise.all([
          getBatches(token),
          getDepartments(token)
        ]);

        setBatches(batchesData);
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

  const handleEditClick = (batch: Batch) => {
    setSelectedBatch(batch);
    setEditForm({
      name: batch.name,
      year: batch.year.toString(),
      department_id: batch.department_id ? batch.department_id.toString() : "",
    });
    setShowEditModal(true);
  };

  const handleAddBatch = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      if (!addForm.name || !addForm.year || !addForm.department_id) {
        toast.warn("Please fill in all required fields");
        return;
      }

      const newBatch = await createBatch(token, {
        name: addForm.name,
        year: parseInt(addForm.year),
        department_id: parseInt(addForm.department_id),
      });

      setBatches([...batches, newBatch]);
      setShowAddModal(false);
      setAddForm({ name: "", year: new Date().getFullYear().toString(), department_id: "" });
      toast.success("Batch created successfully!");
    } catch (err) {
      console.error("Error creating batch:", err);
      toast.error("Failed to create batch. Please try again.");
    }
  };

  const handleUpdateBatch = async () => {
    if (!selectedBatch) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const updatedBatch = await updateBatch(token, selectedBatch.id, {
        name: editForm.name,
        year: parseInt(editForm.year),
        department_id: parseInt(editForm.department_id),
      });

      setBatches(batches.map(b => b.id === selectedBatch.id ? updatedBatch : b));
      setShowEditModal(false);
      setSelectedBatch(null);
      setEditForm({ name: "", year: "", department_id: "" });
      toast.success("Batch updated successfully!");
    } catch (err) {
      console.error("Error updating batch:", err);
      toast.error("Failed to update batch. Please try again.");
    }
  };

  const handleDeleteBatch = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete batch ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      await deleteBatch(token, id);
      setBatches(batches.filter(b => b.id !== id));
      toast.success("Batch deleted successfully!");
    } catch (err) {
      console.error("Error deleting batch:", err);
      toast.error("Failed to delete batch. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading batches...</p>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Batches</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
            <h1 className="text-3xl font-bold text-gray-800">Manage Batches</h1>
            <p className="text-gray-600 mt-1">Create and manage student batches</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all shadow-lg"
          >
            <FaPlus /> Add Batch
          </button>
        </div>

        {batches.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No batches found. Create a batch to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-t-4 border-purple-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-100">
                    <FaGraduationCap className="text-purple-600 text-2xl" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(batch)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteBatch(batch.id, batch.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{batch.name}</h3>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaBuilding className="text-gray-400" />
                    <span>{batch.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendar className="text-gray-400" />
                    <span>Year {batch.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUsers className="text-gray-400" />
                    <span>{batch.students} students</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(batch.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Batch</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch Name</label>
                <input
                  type="text"
                  placeholder="e.g., Batch 2024"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  placeholder="e.g., 2024"
                  value={addForm.year}
                  onChange={(e) => setAddForm({ ...addForm, year: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={addForm.department_id}
                  onChange={(e) => setAddForm({ ...addForm, department_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.short_name})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm({ name: "", year: new Date().getFullYear().toString(), department_id: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBatch}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add Batch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Batch Modal */}
      {showEditModal && selectedBatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Batch</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch Name</label>
                <input
                  type="text"
                  placeholder="Batch Name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  placeholder="Year"
                  value={editForm.year}
                  onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={editForm.department_id}
                  onChange={(e) => setEditForm({ ...editForm, department_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.short_name})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedBatch(null);
                    setEditForm({ name: "", year: "", department_id: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBatch}
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
