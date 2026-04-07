"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { FaUsers, FaPlus, FaEdit, FaTrash, FaEnvelope, FaGraduationCap } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCRs, createCR, updateCR, deleteCR, CR } from "@/services/cr";
import { toast } from "react-toastify";

export default function ManageCRPage() {
  const { user } = useGlobal();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCR, setSelectedCR] = useState<CR | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addRoll, setAddRoll] = useState("");
  const [editRoll, setEditRoll] = useState("");
  const [crs, setCRs] = useState<CR[]>([]);

  // Check user role
  useEffect(() => {
    if (user?.role !== "hod") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Fetch CRs from backend
  useEffect(() => {
    if (user?.role !== "hod") return;

    const fetchCRs = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const data = await getCRs(token);
        setCRs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch CRs");
        console.error("Error fetching CRs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCRs();
  }, [user]);

  const handleEditClick = (cr: CR) => {
    setSelectedCR(cr);
    setEditRoll(cr.roll);
    setShowEditModal(true);
  };

  const handleAddCR = async () => {
    if (!addRoll.trim()) {
      toast.warn("Please enter a registration number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const newCR = await createCR(token, { roll: addRoll });
      setCRs([...crs, newCR]);
      setShowAddModal(false);
      setAddRoll("");
    } catch (err) {
      console.error("Error creating CR:", err);
      toast.error("Failed to assign CR. Please try again.");
    }
  };

  const handleUpdateCR = async () => {
    if (!selectedCR || !editRoll.trim()) {
      toast.warn("Please enter a registration number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const updatedCR = await updateCR(token, selectedCR.id, { roll: editRoll });
      setCRs(crs.map(c => 
        c.id === selectedCR.id ? updatedCR : c
      ));
      setShowEditModal(false);
      setSelectedCR(null);
      setEditRoll("");
    } catch (err) {
      console.error("Error updating CR:", err);
      toast.error("Failed to update CR. Please try again.");
    }
  };

  const handleDeleteCR = async (id: number, name: string, batch: string) => {
    if (!confirm(`Are you sure you want to remove ${name} as CR of Batch ${batch}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      await deleteCR(token, id);
      setCRs(crs.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting CR:", err);
      toast.error("Failed to remove CR. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-(--text)/70 font-medium">Loading CRs...</p>
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
          <h2 className="text-2xl font-bold text-(--text) mb-2">Error Loading CRs</h2>
          <p className="text-(--text)/70 mb-4">{error}</p>
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
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-(--text)">Class Representatives</h1>
            <p className="text-(--text)/70 mt-1">Manage batch CRs and their responsibilities</p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all shadow-lg"
          >
            <FaPlus /> Assign CR
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crs.map((cr) => (
            <div key={cr.id} className="bg-background rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <FaUsers className="text-purple-600 text-2xl" />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClick(cr)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteCR(cr.id, cr.name, cr.batch)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-(--text) mb-2">{cr.name}</h3>
              <p className="text-sm font-medium text-purple-600 mb-4">
                Batch {cr.batch}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-(--text)/70">
                  <FaGraduationCap className="text-(--text)/50" />
                  <span>{cr.roll}</span>
                </div>
                <div className="flex items-center gap-2 text-(--text)/70">
                  <FaEnvelope className="text-(--text)/50" />
                  <span className="truncate">{cr.email}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-(--primary)/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-(--text)/70">Batch Students</span>
                  <span className="font-bold text-(--text)">{cr.students}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">Assign Class Representative</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  Student Registration Number
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., 0562310005101012" 
                  value={addRoll}
                  onChange={(e) => setAddRoll(e.target.value)}
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-(--text)/60 mt-1">
                  Enter the registration number of the student to assign as CR
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setAddRoll("");
                  }} 
                  className="flex-1 px-4 py-2 border border-(--primary)/30 text-(--text)/80 rounded-lg hover:bg-background-light transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddCR}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit CR Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-(--text) mb-6">Change Class Representative</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/80 mb-2">
                  New Student Registration Number
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., CSE-2022-078" 
                  value={editRoll}
                  onChange={(e) => setEditRoll(e.target.value)}
                  className="w-full px-4 py-2 border border-(--primary)/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-(--text)/60 mt-1">
                  Current CR: {selectedCR?.name} ({selectedCR?.roll})
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCR(null);
                    setEditRoll("");
                  }} 
                  className="flex-1 px-4 py-2 border border-(--primary)/30 text-(--text)/80 rounded-lg hover:bg-background-light transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateCR}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
