import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { db, auth } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UpdateProfileData {
  name: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

// Update user profile name in Firestore
export const updateProfile = async (_token: string, data: UpdateProfileData): Promise<{ message: string; user: UserProfile }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not authenticated");
    const ref = doc(db, "users", currentUser.uid);
    await updateDoc(ref, { name: data.name });
    toast.success("Profile updated");
    return { message: "Profile updated", user: { id: currentUser.uid, name: data.name, email: currentUser.email || "", role: "" } };
  } catch (e) {
    toast.error("Failed to update profile");
    throw e;
  }
};

// Change password via Firebase Auth
export const changePassword = async (_token: string, data: ChangePasswordData): Promise<{ message: string }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) throw new Error("Not authenticated");
    const credential = EmailAuthProvider.credential(currentUser.email, data.current_password);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, data.new_password);
    toast.success("Password changed successfully");
    return { message: "Password changed" };
  } catch (e: unknown) {
    const msg = (e instanceof Error) ? e.message : "Failed to change password";
    toast.error(msg);
    throw e;
  }
};

// Get all HOD users from Firestore
export const getHODs = async (_token: string): Promise<UserProfile[]> => {
  try {
    const snap = await getDocs(query(collection(db, "users"), where("role", "==", "hod")));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UserProfile);
  } catch (e) {
    toast.error("Failed to fetch HODs");
    throw e;
  }
};
