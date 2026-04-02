"use client";

import { completeOnboarding, FirebaseUser } from "@/services/firebaseAuth";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  FaUser,
  FaGraduationCap,
  FaArrowLeft,
  FaIdCard,
  FaUsers,
} from "react-icons/fa";
import { useGlobal } from "@/app/context/GlobalContext";
import { Batch } from "@/services/batch";

interface OnboardingProps {
  firebaseUser: FirebaseUser;
}

export default function Onboarding({ firebaseUser }: OnboardingProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: firebaseUser.displayName || "",
    department: "",
    batch: "",
    roll: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { departments } = useGlobal();
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);

  // Fetch batches when department changes
  useEffect(() => {
    const fetchBatches = async () => {
      if (!formData.department) {
        setFilteredBatches([]);
        return;
      }

      setLoadingBatches(true);
      try {
        // Fetch batches from public endpoint with department filter
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
          }/public/batches/?department_id=${formData.department}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch batches");
        }

        const data = await response.json();
        setFilteredBatches(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching batches:", error);
        setFilteredBatches([]);
        toast.error("Failed to load batches. Please try again.");
      } finally {
        setLoadingBatches(false);
      }
    };

    fetchBatches();
  }, [formData.department]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { token } = await completeOnboarding(firebaseUser, {
        name: formData.name,
        department: formData.department,
        batch: formData.batch,
        roll: formData.roll,
      });

      // Store token and user data
      localStorage.setItem("token", token);

      toast.success(
        "Welcome to MetroSync! Your account has been created successfully."
      );
      router.push("/dashboard");
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(
        error.message || "Failed to complete setup. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[var(--primary-light)]/5 blur-3xl"></div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 relative z-10 border border-(--primary)/10">
          {/* Back Button */}
          <button
            onClick={() => router.push("/login")}
            className="flex items-center text-primary hover:text-[var(--primary-light)] transition-colors mb-4"
          >
            <FaArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </button>

          <div className="text-center mb-8">
            <div className="inline-block p-2 rounded-full bg-linear-to-r from-[var(--primary)]/20 to-[var(--primary-light)]/20 backdrop-blur-sm mb-4">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                E
              </div>
            </div>
            <h2 className="text-2xl font-bold text-(--text)">
              Complete Your Profile
            </h2>
            <p className="text-sm text-(--text)/70 mt-1">
              Welcome {firebaseUser.displayName}! Just a few more details to get
              started.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-(--text)/70 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-primary/60" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-white/50 backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-(--text)/70 mb-2"
              >
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGraduationCap className="h-5 w-5 text-primary/60" />
                </div>
                <select
                  id="department"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-white/50 backdrop-blur-sm transition-all duration-300 appearance-none"
                >
                  <option value="" disabled>
                    Select your department
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Batch */}
            <div>
              <label
                htmlFor="batch"
                className="block text-sm font-medium text-(--text)/70 mb-2"
              >
                Batch
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUsers className="h-5 w-5 text-primary/60" />
                </div>
                <select
                  id="batch"
                  name="batch"
                  required
                  value={formData.batch}
                  onChange={handleChange}
                  disabled={!formData.department || loadingBatches}
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-white/50 backdrop-blur-sm transition-all duration-300 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    {loadingBatches
                      ? "Loading batches..."
                      : formData.department
                      ? "Select your batch"
                      : "Select department first"}
                  </option>
                  {filteredBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name} ({batch.year})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label
                htmlFor="roll"
                className="block text-sm font-medium text-(--text)/70 mb-2"
              >
                Roll Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIdCard className="h-5 w-5 text-primary/60" />
                </div>
                <input
                  id="roll"
                  name="roll"
                  type="text"
                  required
                  value={formData.roll}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-white/50 backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter your roll number"
                />
              </div>
            </div>

            {/* Agreement */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary border-[var(--primary)]/20 rounded focus:ring-[var(--primary)]/20"
                />
              </div>
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-(--text)/70"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:text-[var(--primary-light)] transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:text-[var(--primary-light)] transition-colors"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-primary hover:bg-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Setting up your account...
                  </span>
                ) : (
                  "Complete Setup"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-(--text)/60">
              By completing your profile, you agree to our{" "}
              <Link
                href="/terms"
                className="underline hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
