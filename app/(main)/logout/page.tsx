"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { useGlobal } from "@/app/context/GlobalContext";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useGlobal();

  useEffect(() => {
    // Clear authentication status
    localStorage.clear();

    // Logout and sign out from Firebase
    logout();
    signOut(auth).catch((error) => {
      console.error("Firebase sign-out error:", error);
    });

    // Redirect to home page after a short delay
    const timeout = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router, logout]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background-light)]">
      <div className="p-8 max-w-md w-full bg-background rounded-xl shadow-lg border border-(--primary)/10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-(--text) mb-4">
            Logging out...
          </h1>
          <p className="text-(--text)/70 mb-6">
            You are being logged out of MetroSync.
          </p>
          <div className="relative h-1 bg-background-light/50 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-1 bg-primary rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this to globals.css:
// @keyframes progress {
//   0% { width: 0%; }
//   100% { width: 100%; }
// }
// .animate-progress {
//   animation: progress 2s ease-in-out;
// }
