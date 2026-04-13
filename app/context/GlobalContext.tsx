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
};

interface GlobalContextType {
  user: User | null;
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Login with email/password via Firebase Auth
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;

      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error("User profile not found. Please register first.");
      }

      const data = userDoc.data();
      const userData: User = {
        id: firebaseUser.uid,
        name: data.name || firebaseUser.displayName || "",
        email: data.email || firebaseUser.email || "",
        role: data.role || "student",
        department: data.department || "",
        department_name: data.department_name || "",
        batch: data.batch || "",
        batch_name: data.batch_name || "",
        roll: data.roll || "",
      };

      setUser(userData);

      // Store Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      localStorage.setItem("token", idToken);

      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Login error:", error);
      const firebaseErrorMessages: Record<string, string> = {
        "auth/invalid-credential": "Wrong email or password. Please try again.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/user-disabled": "This account has been disabled. Contact support.",
        "auth/too-many-requests": "Too many failed attempts. Please try again later.",
        "auth/network-request-failed": "Network error. Check your connection and try again.",
      };
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
      await firebaseSignOut(auth);
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            // Only set user if onboarding is complete (has department)
            if (data.department) {
              setUser({
                id: firebaseUser.uid,
                name: data.name || firebaseUser.displayName || "",
                email: data.email || firebaseUser.email || "",
                role: data.role || "student",
                department: data.department || "",
                department_name: data.department_name || "",
                batch: data.batch || "",
                batch_name: data.batch_name || "",
                roll: data.roll || "",
              });
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