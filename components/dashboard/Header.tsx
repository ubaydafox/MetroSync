import { useGlobal } from "@/app/context/GlobalContext";
import React from "react";
import {  FaSearch } from "react-icons/fa";

export default function Header() {
  const { user } = useGlobal();

  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-(--text) hidden sm:block">
          Dashboard
        </h2>

        <div className="relative hidden md:block w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 overflow-hidden rounded-full bg-primary/20 flex items-center justify-center">
              {
                <span className="font-medium text-primary">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              }
            </div>
            <span className="hidden md:inline text-sm font-medium text-(--text)">
              {user?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
