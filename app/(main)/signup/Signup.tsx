"use client";

import { Register } from "@/services/auth";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
  FaUsers,
  FaIdCard,
} from "react-icons/fa";
import { signInWithGoogle } from "@/services/firebaseAuth";
import { FcGoogle } from "react-icons/fc";
import { useGlobal } from "@/app/context/GlobalContext";
import { Batch, getBatchesByDepartment } from "@/services/batch";

export default function Signup() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    batch: "",
    roll: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        const batches = await getBatchesByDepartment(Number(formData.department));
        setFilteredBatches(batches);
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password" || name === "confirmPassword") {
      if (name === "password") {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const isValidLength = value.length >= 8;

        if (!hasUpperCase) {
          setPasswordError(
            "Password must contain at least one uppercase letter"
          );
        } else if (!hasLowerCase) {
          setPasswordError(
            "Password must contain at least one lowercase letter"
          );
        } else if (!hasNumber) {
          setPasswordError("Password must contain at least one number");
        } else if (!hasSpecialChar) {
          setPasswordError(
            "Password must contain at least one special character"
          );
        } else if (!isValidLength) {
          setPasswordError("Password must be at least 8 characters long");
        } else {
          setPasswordError("");
        }
      } else {
        const isMatching = value === formData.password;
        if (isMatching) {
          setPasswordMatchError("");
        } else {
          setPasswordMatchError("Passwords do not match");
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { confirmPassword, ...data } = formData;

    if (data.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (!data.batch) {
      toast.error("Please select a batch");
      return;
    }

    if (!data.roll) {
      toast.error("Please enter your roll number");
      return;
    }

    setIsLoading(true);

    try {
      await Register(data);
      toast.success("Account created successfully. Please log in.");
      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const { needsOnboarding } = await signInWithGoogle();

      if (needsOnboarding) {
        // Redirect to onboarding
        router.push("/onboarding");
      } else {
        // User already exists, redirect to dashboard
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Google sign-up error:", error);
      toast.error(error.message || "Google sign-up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 relative">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[var(--primary-light)]/5 blur-3xl"></div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 relative z-10 border border-(--primary)/10">
          <div className="text-center mb-6">
            <div className="inline-block p-2 rounded-full bg-linear-to-r from-[var(--primary)]/20 to-[var(--primary-light)]/20 backdrop-blur-sm mb-4">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                E
              </div>
            </div>
            <h2 className="text-2xl font-bold text-(--text)">
              Create Your Account
            </h2>
            <p className="text-sm text-(--text)/70 mt-1">
              Join MetroSync and enhance your academic experience
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  placeholder="Your Full Name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-(--text)/70 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-primary/60" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-white/50 backdrop-blur-sm transition-all duration-300"
                  placeholder="[EMAIL_ADDRESS]"
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
                    Select department
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-(--text)/70 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-primary/60" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-white/50 backdrop-blur-sm transition-all duration-300"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-primary/60 hover:text-primary focus:outline-none"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
              <p className="mt-1 text-xs text-(--text)/60">
                Password must be at least 8 characters with uppercase,
                lowercase, number, and special character.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-(--text)/70 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-primary/60" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-white/50 backdrop-blur-sm transition-all duration-300"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-primary/60 hover:text-primary focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {passwordMatchError && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordMatchError}
                </p>
              )}
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
                disabled={isLoading || !!passwordError || !!passwordMatchError}
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
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--primary)]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-(--text)/70">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Google Sign Up Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-[var(--primary)]/20 rounded-md text-(--text) bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FcGoogle className="h-5 w-5 mr-3" />
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
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
                    Processing...
                  </span>
                ) : (
                  "Continue with Google"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-(--text)/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-[var(--primary-light)] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
