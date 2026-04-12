"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const KEYWORDS: Array<{ terms: string[]; path: string }> = [
  { terms: ["schedule", "class", "timetable", "routine", "classes"], path: "/dashboard/schedule" },
  { terms: ["notice", "notices", "announcement", "announcements", "notification", "notifications"], path: "/dashboard/notices" },
  { terms: ["course", "courses", "subject", "subjects"], path: "/dashboard/courses" },
  { terms: ["profile", "account"], path: "/dashboard/profile" },
  { terms: ["settings"], path: "/dashboard/settings" },
  { terms: ["batch", "batches"], path: "/dashboard/manage-batches" },
  { terms: ["teacher", "teachers", "faculty"], path: "/dashboard/manage-teachers" },
  { terms: ["department", "departments"], path: "/dashboard/manage-departments" },
];

function buildSuggestions(value: string) {
  if (!value.trim()) return [];
  const lower = value.toLowerCase().trim();
  const results: { label: string; path: string }[] = [];

  const matchedDay = DAYS.find((d) => d.startsWith(lower) || lower.includes(d));
  if (matchedDay) {
    results.push({
      label: `📅 Schedule – ${matchedDay.charAt(0).toUpperCase() + matchedDay.slice(1)}`,
      path: `/dashboard/schedule?day=${matchedDay.charAt(0).toUpperCase() + matchedDay.slice(1)}`,
    });
  }

  for (const kw of KEYWORDS) {
    if (kw.terms.some((t) => t.startsWith(lower) || lower.includes(t))) {
      const label = kw.path.split("/").pop() ?? kw.path;
      results.push({
        label: `🔍 Go to ${label.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
        path: kw.path,
      });
      break;
    }
  }

  return results.slice(0, 5);
}

export default function Header() {
  const { user } = useGlobal();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<{ label: string; path: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const s = buildSuggestions(value);
    setSuggestions(s);
    setShowSuggestions(s.length > 0);
  };

  const doSearch = (term: string) => {
    if (!term.trim()) return;
    const lower = term.toLowerCase().trim();

    const matchedDay = DAYS.find((d) => d.startsWith(lower) || lower.includes(d));
    if (matchedDay) {
      router.push(`/dashboard/schedule?day=${matchedDay.charAt(0).toUpperCase() + matchedDay.slice(1)}`);
      setSearchTerm(""); setShowSuggestions(false); setMobileSearchOpen(false);
      return;
    }

    for (const kw of KEYWORDS) {
      if (kw.terms.some((t) => t.startsWith(lower) || lower.includes(t))) {
        router.push(kw.path);
        setSearchTerm(""); setShowSuggestions(false); setMobileSearchOpen(false);
        return;
      }
    }

    router.push(`/dashboard/schedule?q=${encodeURIComponent(term)}`);
    setSearchTerm(""); setShowSuggestions(false); setMobileSearchOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); doSearch(searchTerm); };

  const SearchBox = ({ className = "" }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch}>
        <button type="submit" className="absolute inset-y-0 left-0 flex items-center pl-3 hover:text-primary transition-colors cursor-pointer">
          <FaSearch className="text-(--text)/40 hover:text-primary text-sm" />
        </button>
        <input
          type="text"
          placeholder="Search schedule, notices, day..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className="pl-9 pr-4 py-2 w-full border border-(--primary)/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-background-light/60 text-(--text) placeholder:text-(--text)/40"
        />
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-(--primary)/20 rounded-xl shadow-xl z-50 overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={() => { router.push(s.path); setShowSuggestions(false); setSearchTerm(""); }}
              className="w-full text-left px-4 py-2.5 text-sm text-(--text)/80 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-background shadow-sm py-3 px-4 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        {/* Left: page label - hidden on mobile (space for sidebar toggle) */}
        <h2 className="text-lg font-semibold text-(--text) hidden sm:block ml-0 lg:ml-0 pl-8 lg:pl-0">
          Dashboard
        </h2>

        {/* Desktop search */}
        <SearchBox className="hidden md:block w-72" />

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile search toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-background-light text-(--text)/60 hover:text-primary transition-colors"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            {mobileSearchOpen ? <FaTimes /> : <FaSearch />}
          </button>

          {/* Avatar / profile link */}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 hover:bg-background-light/80 p-2 rounded-xl transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-sm">
              <span className="font-bold text-white text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-(--text) leading-tight">{user?.name}</p>
              <p className="text-xs text-(--text)/50 capitalize leading-tight">{user?.role}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile expanded search */}
      {mobileSearchOpen && (
        <div className="md:hidden mt-3">
          <SearchBox className="w-full" />
        </div>
      )}
    </header>
  );
}
