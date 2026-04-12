import { useGlobal } from "@/app/context/GlobalContext";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const KEYWORDS: Array<{ terms: string[]; path: string }> = [
  { terms: ["schedule", "class", "timetable", "routine", "classes"], path: "/dashboard/schedule" },
  { terms: ["notice", "notices", "announcement", "announcements", "notification", "notifications"], path: "/dashboard/notices" },
  { terms: ["course", "courses", "subject", "subjects"], path: "/dashboard/courses" },
  { terms: ["profile", "account", "settings"], path: "/dashboard/profile" },
  { terms: ["batch", "batches"], path: "/dashboard/manage-batches" },
  { terms: ["teacher", "teachers", "faculty"], path: "/dashboard/manage-teachers" },
  { terms: ["department", "departments"], path: "/dashboard/manage-departments" },
];

export default function Header() {
  const { user } = useGlobal();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<{ label: string; path: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const buildSuggestions = (value: string) => {
    if (!value.trim()) return [];

    const lower = value.toLowerCase().trim();
    const results: { label: string; path: string }[] = [];

    // 1. Match day names → schedule?day=xxx
    const matchedDay = DAYS.find((d) => d.startsWith(lower) || lower.includes(d));
    if (matchedDay) {
      results.push({
        label: `📅 Schedule – ${matchedDay.charAt(0).toUpperCase() + matchedDay.slice(1)}`,
        path: `/dashboard/schedule?day=${matchedDay.charAt(0).toUpperCase() + matchedDay.slice(1)}`,
      });
    }

    // 2. Match keyword routes
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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const s = buildSuggestions(value);
    setSuggestions(s);
    setShowSuggestions(s.length > 0);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const lower = searchTerm.toLowerCase().trim();

    // 1. Day match
    const matchedDay = DAYS.find((d) => d.startsWith(lower) || lower.includes(d));
    if (matchedDay) {
      router.push(`/dashboard/schedule?day=${matchedDay.charAt(0).toUpperCase() + matchedDay.slice(1)}`);
      setShowSuggestions(false);
      setSearchTerm("");
      return;
    }

    // 2. Keyword match
    for (const kw of KEYWORDS) {
      if (kw.terms.some((t) => t.startsWith(lower) || lower.includes(t))) {
        router.push(kw.path);
        setShowSuggestions(false);
        setSearchTerm("");
        return;
      }
    }

    // 3. Fallback — schedule with query param (teacher/course name search)
    router.push(`/dashboard/schedule?q=${encodeURIComponent(searchTerm)}`);
    setShowSuggestions(false);
    setSearchTerm("");
  };

  const handleSuggestionClick = (path: string) => {
    router.push(path);
    setShowSuggestions(false);
    setSearchTerm("");
  };

  return (
    <header className="bg-background shadow-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-(--text) hidden sm:block">
          Dashboard
        </h2>

        <div className="relative hidden md:block w-64">
          <form onSubmit={handleSearch} className="relative">
            <button type="submit" className="absolute inset-y-0 left-0 flex items-center pl-3 hover:text-primary transition-colors cursor-pointer">
              <FaSearch className="text-(--text)/50 hover:text-primary" />
            </button>
            <input
              type="text"
              placeholder="Search schedule, notices, day..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="pl-10 pr-4 py-2 w-full border border-(--primary)/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-background text-(--text)"
            />
          </form>

          {/* Smart Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-(--primary)/20 rounded-lg shadow-xl z-50 overflow-hidden">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onMouseDown={() => handleSuggestionClick(s.path)}
                  className="w-full text-left px-4 py-2.5 text-sm text-(--text)/80 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard/profile" className="flex items-center gap-2 hover:bg-background-light p-2 rounded-lg transition-colors cursor-pointer">
            <div className="relative w-8 h-8 overflow-hidden rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-medium text-primary">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="hidden md:inline text-sm font-medium text-(--text)">
              {user?.name}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
