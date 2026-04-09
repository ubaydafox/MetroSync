import { useGlobal } from "@/app/context/GlobalContext";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { user } = useGlobal();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Just redirect to dashboard or handle search via query params
      router.push(`/dashboard?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-background shadow-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-(--text) hidden sm:block">
          Dashboard
        </h2>

        <form onSubmit={handleSearch} className="relative hidden md:block w-64">
          <button type="submit" className="absolute inset-y-0 left-0 flex items-center pl-3 hover:text-primary transition-colors cursor-pointer">
            <FaSearch className="text-(--text)/50 hover:text-primary" />
          </button>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-(--primary)/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
        </form>

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
