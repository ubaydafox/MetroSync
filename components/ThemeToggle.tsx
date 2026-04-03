"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="fixed bottom-6 right-6 z-[9999] p-3 rounded-full bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 hover:bg-[var(--primary-light)] transition-all duration-300 transform hover:scale-110 flex items-center justify-center border border-white/10"
      aria-label="Toggle Dark Mode"
    >
      {currentTheme === "dark" ? <FiSun size={24} /> : <FiMoon size={24} />}
    </button>
  );
}
