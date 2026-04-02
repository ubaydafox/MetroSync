"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import {
  FaBell,
  FaPlus,
  FaTrash,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { useState } from "react";

export default function NotificationsPage() {
  const { user } = useGlobal();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "Assignment Deadline Extended",
      message: "CSE101 Assignment 1 deadline has been extended to next Monday.",
      type: "info",
      course: "CSE101",
      date: "2025-01-22",
      author: "Dr. Rahman Ahmed",
    },
    {
      id: 2,
      title: "Class Canceled",
      message:
        "Tomorrow's Database Management class is canceled due to teacher unavailability.",
      type: "warning",
      course: "CSE301",
      date: "2025-01-21",
      author: "Prof. Ali Hassan",
    },
    {
      id: 3,
      title: "Exam Schedule Released",
      message:
        "Mid-term exam schedule has been published. Check the schedule page.",
      type: "important",
      course: "General",
      date: "2025-01-20",
      author: "Academic Office",
    },
    {
      id: 4,
      title: "Lab Session Tomorrow",
      message: "Don't forget to bring your laptops for the practical session.",
      type: "info",
      course: "CSE201",
      date: "2025-01-19",
      author: "Dr. Sarah Khan",
    },
  ];

  const canPost =
    user?.role === "cr" || user?.role === "teacher" || user?.role === "hod";

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "important":
        return <FaExclamationCircle className="text-red-500" />;
      case "warning":
        return <FaExclamationCircle className="text-yellow-500" />;
      case "info":
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaCheckCircle className="text-green-500" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case "important":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-green-50 border-green-200";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Batch Notices</h1>
            <p className="text-gray-600 mt-1">
              {canPost
                ? "View and post batch notices"
                : "Stay updated with important announcements"}
            </p>
          </div>

          {canPost && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
            >
              <FaPlus /> Post Notice
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("important")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "important"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Important
            </button>
            <button
              onClick={() => setFilter("warning")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "warning"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Warnings
            </button>
            <button
              onClick={() => setFilter("info")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "info"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Info
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${getTypeBg(
                notification.type
              )} hover:shadow-xl transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-white shadow-sm">
                    {getTypeIcon(notification.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {notification.title}
                      </h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        {notification.course}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{notification.message}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>By {notification.author}</span>
                      <span>•</span>
                      <span>{notification.date}</span>
                    </div>
                  </div>
                </div>

                {canPost && (
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4">
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No notifications
            </h3>
            <p className="text-gray-600">You&apos;re all caught up!</p>
          </div>
        )}
      </div>

      {/* Add Notice Modal */}
      {showAddModal && canPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Post Notice
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="important">Important</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course (Optional)
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">General (All Batch)</option>
                  <option>CSE101 - Introduction to Programming</option>
                  <option>CSE201 - Data Structures</option>
                  <option>CSE301 - Database Management</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Class Rescheduled"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter notice details..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Post Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
