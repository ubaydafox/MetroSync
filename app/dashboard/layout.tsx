"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useGlobal } from "@/app/context/GlobalContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // Fix: use Firebase-backed auth state from context, not a raw localStorage string.
  // GlobalContext.loading is true until onAuthStateChanged resolves, preventing a
  // flash-redirect on page reload while Firebase restores the session.
  const { isAuthenticated, loading } = useGlobal();

  useEffect(() => {
    // Only redirect once Firebase has confirmed there is no active session.
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Show a full-screen loader while Firebase is restoring the session.
  // This prevents the dashboard from briefly flashing before the redirect.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-light)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600 mx-auto mb-4" />
          <p className="text-(--text)/60 text-sm font-medium">Restoring session…</p>
        </div>
      </div>
    );
  }

  // If not authenticated after loading, render nothing (redirect is in flight).
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[var(--background-light)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Content Area - scrollable */}
        <main className="flex-1 overflow-y-auto pb-10">{children}</main>
      </div>
    </div>
  );
}
