import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import { User } from "@/types";

// Register a new user with email/password + save profile to Firestore
export const Register = async (data: User): Promise<string> => {
  const { name, email, password, department, batch, roll } = data;

  // 1. Create Firebase Auth account
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = credential.user;

  // 2. Update Firebase Auth display name
  await updateProfile(firebaseUser, { displayName: name });

  // 3. Save user profile in Firestore
  await setDoc(doc(db, "users", firebaseUser.uid), {
    uid: firebaseUser.uid,
    name,
    email,
    role: "student",
    department: department || "",
    batch: batch || "",
    roll: roll || "",
    createdAt: serverTimestamp(),
  });

  return "Account created successfully.";
};
