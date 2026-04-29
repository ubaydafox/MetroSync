"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import { Department, getAllDepartments } from "@/services/department";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  department_name?: string;
  batch?: string;
  batch_name?: string;
  roll?: string;
  photoURL?: string;
};

interface GlobalContextType {
  user: User | null;
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};

// Issue 4: Extracted helper — no more duplicate mapping blocks
function mapUserData(uid: string, data: Record<string, unknown>): User {
  return {
    id: uid,
    name: (data.name as string) || "",
    email: (data.email as string) || "",
    role: (data.role as string) || "student",
    department: (data.department as string) || "",
    department_name: (data.department_name as string) || "",
    batch: (data.batch as string) || "",
    batch_name: (data.batch_name as string) || "",
    roll: (data.roll as string) || "",
    photoURL: (data.photoURL as string) || "",
  };
}

const firebaseErrorMessages: Record<string, string> = {
  "auth/invalid-credential": "Wrong email or password. Please try again.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled. Contact support.",
  "auth/too-many-requests": "Too many failed attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Issue 2: refreshUser re-fetches Firestore profile without a page reload
  const refreshUser = useCallback(async () => {
    if (!auth || !db) return; // Firebase not initialized (env vars missing)
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        setUser(mapUserData(firebaseUser.uid, userDoc.data()));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, []);

  // Login with email/password via Firebase Auth
  const login = async (email: string, password: string) => {
    if (!auth || !db) {
      toast.error("Firebase is not configured. Contact your administrator.");
      return Promise.reject(new Error("Firebase not initialized"));
    }
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;

      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error("User profile not found. Please register first.");
      }

      setUser(mapUserData(firebaseUser.uid, userDoc.data()));

      // Store Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      localStorage.setItem("token", idToken);

      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Login error:", error);
      let message = "Login failed. Please try again.";
      if (error && typeof error === "object" && "code" in error) {
        const code = (error as { code: string }).code;
        message = firebaseErrorMessages[code] ?? message;
      } else if (error instanceof Error && !error.message.startsWith("Firebase:")) {
        message = error.message;
      }
      toast.error(message);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  // Logout — sign out from Firebase and clear local state
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (auth) await firebaseSignOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      router.push("/login");
      setLoading(false);
    }
  }, [router]);

  // Listen to Firebase Auth state changes to restore session on refresh
  useEffect(() => {
    // If Firebase isn't initialized (env vars missing), just mark loading done.
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            // Only set user if onboarding is complete (has department)
            if (data.department) {
              setUser(mapUserData(firebaseUser.uid, data));
            }
          }
        } catch (error) {
          console.error("Auth state restore error:", error);
        }
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch departments from Firestore on mount
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await getAllDepartments();
        const sortedDepartments = res.sort(
          (a: Department, b: Department) => a.id - b.id
        );
        setDepartments(sortedDepartments);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    }
    fetchDepartments();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        loading,
        departments,
        setDepartments,
        setLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;