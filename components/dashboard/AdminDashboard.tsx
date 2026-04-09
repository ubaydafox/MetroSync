"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaBuilding, 
  FaUserTie, 
  FaUsers,
  FaPlus,
  FaEdit,
  FaEye,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { getAdminDashboardData, AdminDashboardData } from '@/services/stat';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboardData("");
        setDashboardData(data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-(--text)/70 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error || "Failed to load data"}</p>
        </div>
      </div>
    );
  }

  const { stats, departments, hods } = dashboardData;

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-(--text) mb-2">Admin Dashboard</h1>
          <p className="text-(--text)/70">System-wide management and oversight</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">Departments</p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">{stats.total_departments}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FaBuilding className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">HODs</p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">{stats.total_hods}</h3>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <FaUserTie className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">Total Users</p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">{stats.total_users}</h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <FaUsers className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text)/60 text-sm font-medium">Total Batches</p>
                <h3 className="text-3xl font-bold text-(--text) mt-1">{stats.total_batches}</h3>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <FaUsers className="text-orange-600 dark:text-orange-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-(--text) mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/manage-departments">
              <div className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors mb-3">
                    <FaPlus className="text-blue-600 dark:text-blue-400 text-lg" />
                  </div>
                  <span className="text-sm font-medium text-(--text)/80">Add Department</span>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/manage-hods">
              <div className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors mb-3">
                    <FaUserTie className="text-green-600 dark:text-green-400 text-lg" />
                  </div>
                  <span className="text-sm font-medium text-(--text)/80">Assign HOD</span>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/manage-batches">
              <div className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors mb-3">
                    <FaUsers className="text-orange-600 dark:text-orange-400 text-lg" />
                  </div>
                  <span className="text-sm font-medium text-(--text)/80">Manage Batches</span>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/manage-departments">
              <div className="bg-background rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors mb-3">
                    <FaBuilding className="text-purple-600 dark:text-purple-400 text-lg" />
                  </div>
                  <span className="text-sm font-medium text-(--text)/80">Departments</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Departments */}
          <div className="bg-background rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-(--text) flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FaBuilding className="text-blue-600 dark:text-blue-400" />
                </div>
                Departments
              </h2>
              <Link href="/dashboard/manage-departments" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                View all →
              </Link>
            </div>
            
            <div className="space-y-4">
              {departments.map(dept => (
                <div key={dept.id} className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-(--text) text-lg">{dept.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dept.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}>
                          {dept.status === 'active' ? <FaCheckCircle className="inline mr-1" /> : <FaExclamationTriangle className="inline mr-1" />}
                          {dept.status}
                        </span>
                      </div>
                      <p className="text-sm text-(--text)/70 mt-1">HOD: {dept.hod_name}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <span className="bg-background px-3 py-1 rounded-full text-(--text)/70">
                          {dept.teacher_count} teachers
                        </span>
                        <span className="bg-background px-3 py-1 rounded-full text-(--text)/70">
                          {dept.student_count} students
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                        <FaEye />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HOD Management */}
          <div className="bg-background rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-(--text) flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <FaUserTie className="text-green-600 dark:text-green-400" />
                </div>
                HOD Management
              </h2>
              <Link href="/dashboard/manage-hod" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                View all →
              </Link>
            </div>
            
            <div className="space-y-4">
              {hods.map(hod => (
                <div key={hod.id} className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-5 border border-green-100 dark:border-green-800/30 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-(--text) text-lg">{hod.name}</h3>
                      <p className="text-sm text-(--text)/70 mt-1">{hod.department_name}</p>
                      <p className="text-xs text-(--text)/60 mt-2">{hod.email}</p>
                      <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                        hod.status === 'active' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                          : 'bg-background-light text-(--text)/80'
                      }`}>
                        {hod.status === 'active' && <FaCheckCircle className="inline mr-1" />}
                        {hod.status}
                      </span>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                        <FaEye />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
