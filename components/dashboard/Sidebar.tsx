"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBook,
  FaCalendarAlt,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUsers,
  FaUserTie,
  FaBuilding,
} from "react-icons/fa";
import { useGlobal } from "@/app/context/GlobalContext";

interface SidebarProps {
  userRole?: "student" | "teacher" | "cr" | "hod" | "admin";
}
//eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Sidebar({ userRole = "student" }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { user } = useGlobal();

  // Use user.role from global context if available, otherwise fall back to prop
  const currentUserRole = user?.role;

  console.log(currentUserRole);

  // Links based on user role
  const links = [
    // Common for all roles
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <FaHome className="text-lg" />,
      roles: ["student", "teacher", "cr", "hod", "admin"],
    },
    {
      title: "Schedule",
      path: "/dashboard/schedule",
      icon: <FaCalendarAlt className="text-lg" />,
      roles: ["student", "cr", "hod", "teacher"],
    },

    {
      title: "Courses",
      path: "/dashboard/courses",
      icon: <FaBook className="text-lg" />,
      roles: ["student", "cr", "teacher", "hod"],
    },

    // Student & CR specific links
    {
      title: "Batch Notices",
      path: "/dashboard/notices",
      icon: <FaBell className="text-lg" />,
      roles: ["student", "cr"],
    },

    // Teacher specific links

    // HOD specific links
    {
      title: "Class Representatives",
      path: "/dashboard/manage-cr",
      icon: <FaUsers className="text-lg" />,
      roles: ["hod"],
    },

    // HOD and Admin links
        {
      title: "Teachers",
      path: "/dashboard/manage-teachers",
      icon: <FaUserTie className="text-lg" />,
      roles: ["hod", "admin"],
    },

    // Admin specific links
    {
      title: "Batches",
      path: "/dashboard/manage-batches",
      icon: <FaUsers className="text-lg" />,
      roles: ["admin"],
    },
    {
      title: "Departments",
      path: "/dashboard/manage-departments",
      icon: <FaBuilding className="text-lg" />,
      roles: ["admin"],
    },
    {
      title: "HOD Management",
      path: "/dashboard/manage-hods",
      icon: <FaUserTie className="text-lg" />,
      roles: ["admin"],
    },

    // Common profile link
    {
      title: "Profile",
      path: "/dashboard/profile",
      icon: <FaUser className="text-lg" />,
      roles: ["student", "teacher", "cr", "hod", "admin"],
    },
  ];

  const filteredLinks = links.filter((link) =>
    link.roles.includes(currentUserRole || "")
  );

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 lg:hidden z-50">
        <button
          onClick={handleMobileToggle}
          className="p-2 rounded-md bg-primary text-white shadow-lg"
        >
          {isMobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:block h-screen bg-background shadow-lg transition-all duration-300 ${
          isCollapsed ? "w-17.5" : "w-64"
        } z-40`}
      >
        {/* Logo */}
        <div
          className={`flex items-center p-4 border-b border-(--primary)/10 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
            <img src="/favicon.ico" alt="Logo" className="w-8 h-8 object-contain rounded-md" />
            {!isCollapsed && (
              <span className="font-bold text-(--text)">MetroSync</span>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={handleToggle}
              className="p-1 rounded-md hover:bg-primary/10 text-primary"
            >
              <FaBars />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="grow py-4 px-2 overflow-y-auto">
          <nav>
            <ul className="space-y-1">
              {filteredLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className={`flex items-center ${
                      isCollapsed ? "justify-center" : "justify-start"
                    } py-3 px-4 rounded-md transition-colors ${
                      pathname === link.path
                        ? "bg-primary text-white"
                        : "hover:bg-primary/10 text-(--text)"
                    }`}
                  >
                    <span className={isCollapsed ? "text-xl" : "mr-3"}>
                      {link.icon}
                    </span>
                    {!isCollapsed && <span>{link.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Toggle and Logout */}
        <div className="py-4 px-2 border-t border-(--primary)/10">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleToggle}
                className="p-2 rounded-md hover:bg-primary/10 text-primary"
              >
                <FaBars />
              </button>
              <Link
                href="/logout"
                className="p-2 rounded-md hover:bg-red-50 text-red-500"
              >
                <FaSignOutAlt />
              </Link>
            </div>
          ) : (
            <Link
              href="/logout"
              className="flex items-center justify-start py-3 px-4 rounded-md hover:bg-red-50 text-red-500 transition-colors"
            >
              <span className="mr-3">
                <FaSignOutAlt />
              </span>
              <span>Logout</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full bg-background shadow-lg transition-all duration-300 w-64 z-40 transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-(--primary)/10">
          <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
            <img src="/favicon.ico" alt="Logo" className="w-8 h-8 object-contain rounded-md" />
            <span className="font-bold text-(--text)">MetroSync</span>
          </Link>

          <button
            onClick={handleMobileToggle}
            className="p-1 rounded-md hover:bg-primary/10 text-primary"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="grow py-4 px-2 overflow-y-auto">
          <nav>
            <ul className="space-y-1">
              {filteredLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    onClick={handleMobileToggle}
                    className={`flex items-center justify-start py-3 px-4 rounded-md transition-colors ${
                      pathname === link.path
                        ? "bg-primary text-white"
                        : "hover:bg-primary/10 text-(--text)"
                    }`}
                  >
                    <span className="mr-3">{link.icon}</span>
                    <span>{link.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout */}
        <div className="py-4 px-2 border-t border-(--primary)/10">
          <Link
            href="/logout"
            className="flex items-center justify-start py-3 px-4 rounded-md hover:bg-red-50 text-red-500 transition-colors"
          >
            <span className="mr-3">
              <FaSignOutAlt />
            </span>
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={handleMobileToggle}
        />
      )}
    </>
  );
}
