"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Department, getAllDepartments } from "@/services/department";

import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { apiFetch } from "@/utils/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiFetch(`auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.json();
        const errorMsg = errorText.error || "Unknown error";
        console.log(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      const { token, user } = await res.json();
      if (!token) {
        toast.error("Login failed");
        throw new Error("Login failed");
      }

      // Store token
      localStorage.setItem("token", token);

      // Set Cookies
      // "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Strict; Secure`,
      

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "",
        department: user.department || "",
      };

      setUser(userData);
      
      router.push('/dashboard');
      // location.reload();
    } catch (error) {
      console.error("Login error:", error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = React.useCallback(async () => {
    setLoading(true);
    try {
      await apiFetch(`auth/logout/`, { method: "POST" });
      // Also sign out from Firebase
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

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await apiFetch(`user/getUser/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          throw new Error("Authentication failed");
        }

        const { user: userData } = await res.json();

        const userObject = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role || "",
          department: userData.department || "",
        };

        setUser(userObject);
      } catch (error) {
        console.error("Auth check failed:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [logout]);

  // Fetch departments on component mount
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await getAllDepartments();
        // Sort departments
        const sortedDepartments = res.sort((a: Department, b: Department) => a.id - b.id);
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