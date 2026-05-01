"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "@/services/firebaseAuth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(email);
      toast.success(
        "Password reset email sent. Check your inbox and follow the instructions."
      );
      router.push("/login");
    } catch (error: unknown) {
      console.error("Reset password failed:", error);
      const message =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Failed to send password reset email. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[var(--primary-light)]/5 blur-3xl"></div>
        </div>

        <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-lg p-8 relative z-10 border border-(--primary)/10">
          <div className="text-center mb-8">
            <div className="inline-block p-2 rounded-full bg-linear-to-r from-[var(--primary)]/20 to-[var(--primary-light)]/20 backdrop-blur-sm mb-4">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                ?
              </div>
            </div>
            <h2 className="text-2xl font-bold text-(--text)">Forgot Password</h2>
            <p className="text-sm text-(--text)/70 mt-1">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-(--text)/70 mb-2">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 bg-background/50 backdrop-blur-sm transition-all duration-300"
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-primary hover:bg-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-(--text)/70">
            Remember your password?{' '}
            <Link href="/login" className="text-primary font-medium hover:text-[var(--primary-light)]">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
