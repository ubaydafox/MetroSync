"use client";

import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { useGlobal } from "../context/GlobalContext";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import HODDashboard from "@/components/dashboard/HODDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
  const { user } = useGlobal();

  // Loading state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-(--text)/70 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render dashboard based on user role
  switch (user.role) {
    case "student":
    case "cr": // CR uses student dashboard with additional features
      return <StudentDashboard />;
    
    case "teacher":
      return <TeacherDashboard />;
    
    case "hod":
      return <HODDashboard />;
    
    case "admin":
      return <AdminDashboard />;
    
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-pink-100">
          <div className="text-center bg-background rounded-2xl shadow-lg p-8">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-(--text) mb-2">Invalid Role</h2>
            <p className="text-(--text)/70">Your account role is not recognized. Please contact support.</p>
          </div>
        </div>
      );
  }
}
