"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import {
  FaUser, FaEnvelope, FaBuilding, FaUserTag, FaEdit, FaSave, FaTimes,
  FaLock, FaUserGraduate, FaIdBadge,
} from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import {
  getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword,
} from "firebase/auth";

export default function ProfilePage() {
  const { user, departments } = useGlobal();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const deptName =
    departments.find(d => d.id === Number(user?.department))?.name ||
    user?.department_name ||
    "Not Assigned";

  const handleSave = async () => {
    if (!formData.name.trim()) { toast.error("Name cannot be empty"); return; }
    setSaving(true);
    try {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Not authenticated");
      await updateDoc(doc(db, "users", uid), { name: formData.name });
      toast.success("Profile updated!");
      setIsEditing(false);
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill all fields"); return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match"); return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters"); return;
    }
    setSaving(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) throw new Error("Not authenticated");
      const credential = EmailAuthProvider.credential(currentUser.email, passwordData.currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordData.newPassword);
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsChangingPassword(false);
    } catch (e) {
      if (e instanceof Error && e.message.includes("wrong-password")) {
        toast.error("Current password is incorrect");
      } else {
        toast.error(e instanceof Error ? e.message : "Failed to change password");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-(--text)">My Profile</h1>
            <p className="text-(--text)/60 mt-1">Manage your account information</p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 border border-(--primary)/30 rounded-xl hover:bg-background-light transition-colors text-(--text)/70"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60"
                >
                  <FaSave /> {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-background rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

          <div className="px-8 pb-8">
            <div className="flex items-end -mt-14 mb-6">
              <div className="w-28 h-28 rounded-full bg-background p-2 shadow-xl">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              <div className="ml-5 mb-1">
                <h2 className="text-2xl font-bold text-(--text)">{user?.name}</h2>
                <p className="text-(--text)/60 capitalize text-sm">{user?.role}</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-(--text)/70 mb-2">
                  <FaUser className="text-blue-500" /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-(--primary)/30 rounded-xl focus:ring-2 focus:ring-blue-500 bg-background text-(--text)"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-background-light/60 rounded-xl text-(--text)">{user?.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-(--text)/70 mb-2">
                  <FaEnvelope className="text-green-500" /> Email
                </label>
                <p className="px-4 py-2.5 bg-background-light/60 rounded-xl text-(--text)/80">{user?.email}</p>
                <p className="text-xs text-(--text)/40 mt-1">Email cannot be changed</p>
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-(--text)/70 mb-2">
                  <FaUserTag className="text-purple-500" /> Role
                </label>
                <p className="px-4 py-2.5 bg-background-light/60 rounded-xl text-(--text) capitalize">{user?.role}</p>
              </div>

              {/* Department */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-(--text)/70 mb-2">
                  <FaBuilding className="text-orange-500" /> Department
                </label>
                <p className="px-4 py-2.5 bg-background-light/60 rounded-xl text-(--text)">{deptName}</p>
              </div>

              {/* Batch (students/CR only) */}
              {(user?.role === "student" || user?.role === "cr") && user?.batch_name && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-(--text)/70 mb-2">
                    <FaUserGraduate className="text-teal-500" /> Batch
                  </label>
                  <p className="px-4 py-2.5 bg-background-light/60 rounded-xl text-(--text)">{user.batch_name}</p>
                </div>
              )}

              {/* Roll (students/CR only) */}
              {(user?.role === "student" || user?.role === "cr") && user?.roll && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-(--text)/70 mb-2">
                    <FaIdBadge className="text-rose-500" /> Roll Number
                  </label>
                  <p className="px-4 py-2.5 bg-background-light/60 rounded-xl text-(--text)">{user.roll}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-background rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-(--text) mb-4">Account Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-(--text)/60">Account Type</span>
              <span className="font-medium text-(--text) capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-(--text)/60">Status</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-background rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-(--text) flex items-center gap-2">
              <FaLock className="text-slate-500" /> Password &amp; Security
            </h3>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm"
              >
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--text)/70 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-(--primary)/30 rounded-xl bg-background text-(--text) focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text)/70 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-(--primary)/30 rounded-xl bg-background text-(--text) focus:ring-2 focus:ring-blue-500"
                  placeholder="Min. 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text)/70 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-(--primary)/30 rounded-xl bg-background text-(--text) focus:ring-2 focus:ring-blue-500"
                  placeholder="Re-enter new password"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setIsChangingPassword(false); setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}
                  className="flex-1 px-4 py-2.5 border border-(--primary)/30 rounded-xl hover:bg-background-light transition-colors text-(--text)/70"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-60"
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-(--text)/60 text-sm">
              Keep your account secure by regularly updating your password.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
