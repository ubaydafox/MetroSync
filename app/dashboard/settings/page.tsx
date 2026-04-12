"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  FaPalette,
  FaBell,
  FaMoon,
  FaSun,
  FaDesktop,
  FaCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const { user } = useGlobal();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [notifPrefs, setNotifPrefs] = useState({
    scheduleUpdates: true,
    newNotices: true,
    systemAlerts: false,
  });

  // resolvedTheme is undefined during SSR; use it to guard client-only UI
  const isClient = resolvedTheme !== undefined;

  const handleSaveNotifications = () => {
    localStorage.setItem("notifPrefs", JSON.stringify(notifPrefs));
    toast.success("Notification preferences saved!");
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: <FaSun className="text-yellow-500" /> },
    { value: "dark",  label: "Dark",  icon: <FaMoon className="text-indigo-400" /> },
    { value: "system", label: "System", icon: <FaDesktop className="text-gray-500" /> },
  ];

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-(--text)">Settings</h1>
          <p className="text-(--text)/60 mt-1">Customize your MetroSync experience</p>
        </div>

        {/* Theme */}
        <div className="bg-background rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-(--text) flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <FaPalette className="text-purple-600 dark:text-purple-400" />
            </div>
            Appearance
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {isClient && themeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  theme === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-background-light hover:border-primary/30"
                }`}
              >
                <div className="text-2xl">{opt.icon}</div>
                <span className="text-sm font-medium text-(--text)">{opt.label}</span>
                {theme === opt.value && (
                  <FaCheck className="text-primary text-xs" />
                )}
              </button>
            ))}
          </div>
          {isClient && (
            <p className="text-xs text-(--text)/50 mt-3">
              Currently: <span className="font-medium capitalize">{resolvedTheme}</span> mode
            </p>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-background rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-(--text) flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <FaBell className="text-blue-600 dark:text-blue-400" />
            </div>
            Notification Preferences
          </h2>
          <div className="space-y-4">
            {[
              { key: "scheduleUpdates", label: "Schedule Updates", desc: "Get notified when the class schedule changes" },
              { key: "newNotices", label: "New Notices", desc: "Get notified when a new notice is posted" },
              { key: "systemAlerts", label: "System Alerts", desc: "Platform maintenance and update alerts" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-background-light/50">
                <div>
                  <p className="font-medium text-(--text) text-sm">{label}</p>
                  <p className="text-xs text-(--text)/60 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifPrefs(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    notifPrefs[key as keyof typeof notifPrefs] ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      notifPrefs[key as keyof typeof notifPrefs] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveNotifications}
            className="mt-5 w-full py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-colors"
          >
            Save Preferences
          </button>
        </div>

        {/* Account Info */}
        <div className="bg-background rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-(--text) mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-(--text)/80">
              <span className="text-(--text)/60">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between text-(--text)/80">
              <span className="text-(--text)/60">Role</span>
              <span className="font-medium capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between text-(--text)/80">
              <span className="text-(--text)/60">Status</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
