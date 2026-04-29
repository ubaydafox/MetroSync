import {
  collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp, getCountFromServer
} from "firebase/firestore";
import { db, firebaseConfig } from "@/utils/firebase";
import { toast } from "react-toastify";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

export interface Teacher {
  id: number;
  name: string;
  email: string;
  courses: string[];
  students: number;
  department_id?: number;
  department?: string;
}

export interface CreateTeacherData {
  name: string;
  email: string;
  department_id?: number;
}

export interface UpdateTeacherData {
  name?: string;
  email?: string;
}

// Get all teachers (or filter by department)
export async function getTeachers(_token: string, departmentId?: number): Promise<Teacher[]> {
  try {
    const q = departmentId
      ? query(collection(db, "teachers"), where("department_id", "==", departmentId))
      : collection(db, "teachers");
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Teacher).sort((a, b) => a.id - b.id);
  } catch (e) {
    toast.error("Failed to fetch teachers");
    throw e;
  }
}

// Create a new teacher
export async function createTeacher(_token: string, data: CreateTeacherData): Promise<Teacher> {
  try {
    // Fix: Use getCountFromServer() for an atomic server-side count,
    // which is safer than getDocs().size (avoids loading all docs into memory).
    // For true collision safety a transaction or addDoc() should be used,
    // but this matches the existing ID-naming scheme (teacher_N).
    const countSnap = await getCountFromServer(collection(db, "teachers"));
    const nextId = countSnap.data().count + 1;
    
    // 1. Generate random password
    const tempPassword = Math.random().toString(36).slice(-8);

    // 2. Create Firebase Auth user using secondary app (to avoid logging out admin)
    const apps = getApps();
    let secondaryApp = apps.find(app => app.name === "SecondaryApp");
    if (!secondaryApp) {
      secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
    }
    const secondaryAuth = getAuth(secondaryApp);
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, tempPassword);
    const firebaseUser = userCredential.user;
    await updateProfile(firebaseUser, { displayName: data.name });

    // 3. Save to global 'users' collection with role 'teacher'
    await setDoc(doc(db, "users", firebaseUser.uid), {
      uid: firebaseUser.uid,
      name: data.name,
      email: data.email,
      role: "teacher",
      department: data.department_id ? data.department_id.toString() : "",
      createdAt: serverTimestamp(),
    });

    // 4. Save to 'teachers' collection
    const newTeacher: Teacher = {
      id: nextId,
      name: data.name,
      email: data.email,
      courses: [],
      students: 0,
      department_id: data.department_id,
    };
    await setDoc(doc(db, "teachers", `teacher_${nextId}`), newTeacher);

    // 5. Trigger email sending
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, password: tempPassword, name: data.name })
    });
    
    // 6. Sign out secondary app
    await signOut(secondaryAuth);

    return newTeacher;
  } catch (e) {
    toast.error("Failed to create teacher");
    throw e;
  }
}

// Update a teacher
export async function updateTeacher(_token: string, id: number, data: UpdateTeacherData): Promise<Teacher> {
  try {
    const ref = doc(db, "teachers", `teacher_${id}`);
    await updateDoc(ref, { ...data });
    const snap = await getDocs(query(collection(db, "teachers"), where("id", "==", id)));
    return snap.docs[0].data() as Teacher;
  } catch (e) {
    toast.error("Failed to update teacher");
    throw e;
  }
}

// Delete a teacher
export async function deleteTeacher(_token: string, id: number): Promise<void> {
  try {
    await deleteDoc(doc(db, "teachers", `teacher_${id}`));
  } catch (e) {
    toast.error("Failed to delete teacher");
    throw e;
  }
}
