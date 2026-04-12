"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  FaCog,
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

  const { user, logout } = useGlobal();
  const currentUserRole = user?.role;

  // Links based on user role
  const links = [
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
    {
      title: "Batch Notices",
      path: "/dashboard/notices",
      icon: <FaBell className="text-lg" />,
      roles: ["student", "cr", "teacher", "hod"],
    },
    {
      title: "Class Representatives",
      path: "/dashboard/manage-cr",
      icon: <FaUsers className="text-lg" />,
      roles: ["hod"],
    },
    {
      title: "Teachers",
      path: "/dashboard/manage-teachers",
      icon: <FaUserTie className="text-lg" />,
      roles: ["hod", "admin"],
    },
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
    {
      title: "Profile",
      path: "/dashboard/profile",
      icon: <FaUser className="text-lg" />,
      roles: ["student", "teacher", "cr", "hod", "admin"],
    },
    {
      title: "Settings",
      path: "/dashboard/settings",
      icon: <FaCog className="text-lg" />,
      roles: ["student", "teacher", "cr", "hod", "admin"],
    },
  ];

  const filteredLinks = links.filter((link) =>
    link.roles.includes(currentUserRole || "")
  );

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const navLinkClass = (path: string) =>
    `flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${
      isActive(path)
        ? "bg-primary text-white shadow-md shadow-primary/30"
        : "hover:bg-primary/10 text-(--text) hover:text-primary"
    }`;

  const LinkItem = ({ link }: { link: (typeof links)[0]; onClick?: () => void }) => (
    <li key={link.path}>
      <Link
        href={link.path}
        onClick={() => setIsMobileOpen(false)}
        className={`flex items-center ${
          isCollapsed ? "justify-center" : "justify-start"
        } py-3 px-4 rounded-xl transition-all duration-200 ${
          isActive(link.path)
            ? "bg-primary text-white shadow-md shadow-primary/30"
            : "hover:bg-primary/10 text-(--text) hover:text-primary"
        }`}
        title={isCollapsed ? link.title : undefined}
      >
        <span className={isCollapsed ? "text-xl" : "mr-3 text-[1.05rem]"}>
          {link.icon}
        </span>
        {!isCollapsed && (
          <span className="font-medium text-sm">{link.title}</span>
        )}
        {!isCollapsed && isActive(link.path) && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
        )}
      </Link>
    </li>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 lg:hidden z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md bg-primary text-white shadow-lg"
        >
          {isMobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col h-screen bg-background shadow-lg transition-all duration-300 ${
          isCollapsed ? "w-[4.5rem]" : "w-64"
        } z-40`}
      >
        {/* Logo */}
        <div
          className={`flex items-center p-4 border-b border-(--primary)/10 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain rounded-md"
            />
            {!isCollapsed && (
              <span className="font-bold text-(--text)">MetroSync</span>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded-md hover:bg-primary/10 text-primary"
            >
              <FaBars />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-2 overflow-y-auto">
          <nav>
            <ul className="space-y-1">
              {filteredLinks.map((link) => (
                <LinkItem key={link.path} link={link} />
              ))}
            </ul>
          </nav>
        </div>

        {/* Toggle and Logout */}
        <div className="py-4 px-2 border-t border-(--primary)/10 space-y-1">
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-full flex justify-center p-3 rounded-xl hover:bg-primary/10 text-primary transition-colors"
              title="Expand"
            >
              <FaBars />
            </button>
          )}
          <button
            onClick={() => logout()}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center" : "justify-start"
            } py-3 px-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <span className={isCollapsed ? "text-xl" : "mr-3"}>
              <FaSignOutAlt />
            </span>
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full bg-background shadow-lg transition-all duration-300 w-64 z-40 flex flex-col transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-(--primary)/10">
          <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain rounded-md"
            />
            <span className="font-bold text-(--text)">MetroSync</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-md hover:bg-primary/10 text-primary"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-2 overflow-y-auto">
          <nav>
            <ul className="space-y-1">
              {filteredLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={navLinkClass(link.path)}
                  >
                    <span className="mr-3 text-[1.05rem]">{link.icon}</span>
                    <span className="font-medium text-sm">{link.title}</span>
                    {isActive(link.path) && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout */}
        <div className="py-4 px-2 border-t border-(--primary)/10">
          <button
            onClick={() => { logout(); setIsMobileOpen(false); }}
            className="w-full flex items-center justify-start py-3 px-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors"
          >
            <span className="mr-3"><FaSignOutAlt /></span>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
