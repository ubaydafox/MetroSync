import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where, getDoc } from "firebase/firestore";
import { db, auth } from "@/utils/firebase";
import { toast } from "react-toastify";

export interface Task {
  id: number;
  title: string;
  type: string;
  due_date: string;
  points: number;
  description: string;
  course_id: number;
  created_by: string;
  created_at: string;
}

export interface CreateTaskData {
  title: string;
  type: string;
  due_date: string;
  points: number;
  description: string;
  course: number;
}

export interface UpdateTaskData {
  title: string;
  type: string;
  due_date: string;
  points: number;
  description: string;
}

export async function getCourseTasks(_token: string, courseId: string): Promise<Task[]> {
  try {
    const snap = await getDocs(query(collection(db, "tasks"), where("course_id", "==", Number(courseId))));
    return snap.docs.map((d) => d.data() as Task).sort((a, b) => a.id - b.id);
  } catch (e) {
    toast.error("Failed to fetch tasks");
    throw e;
  }
}

export async function createTask(_token: string, data: CreateTaskData): Promise<Task> {
  try {
    const snap = await getDocs(collection(db, "tasks"));
    const nextId = snap.size + 1;
    const now = new Date().toISOString().split("T")[0];
    const newTask: Task = {
      id: nextId,
      title: data.title,
      type: data.type,
      due_date: data.due_date,
      points: data.points,
      description: data.description,
      course_id: data.course,
      created_by: "Teacher",
      created_at: now,
    };
    await setDoc(doc(db, "tasks", `task_${nextId}`), newTask);
    toast.success("Task created");
    return newTask;
  } catch (e) {
    toast.error("Failed to create task");
    throw e;
  }
}

export async function updateTask(_token: string, courseId: string, taskId: number, data: UpdateTaskData): Promise<Task> {
  try {
    const ref = doc(db, "tasks", `task_${taskId}`);
    await updateDoc(ref, { ...data });
    const snap = await getDocs(query(collection(db, "tasks"), where("id", "==", taskId)));
    return snap.docs[0].data() as Task;
  } catch (e) {
    toast.error("Failed to update task");
    throw e;
  }
}

export async function deleteTask(_token: string, courseId: string, taskId: number): Promise<void> {
  try {
    await deleteDoc(doc(db, "tasks", `task_${taskId}`));
  } catch (e) {
    toast.error("Failed to delete task");
    throw e;
  }
}

/**
 * Mark a task as done for the current user.
 * Writes to /task_completions/{uid}_{taskId} so it's per-user and doesn't
 * mutate the shared task document.
 */
export async function markTaskDone(taskId: number): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");
  const completionId = `${uid}_${taskId}`;
  await setDoc(doc(db, "task_completions", completionId), {
    uid,
    taskId,
    completedAt: new Date().toISOString(),
  });
}

export async function unmarkTaskDone(taskId: number): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");
  await deleteDoc(doc(db, "task_completions", `${uid}_${taskId}`));
}

export async function isTaskDone(taskId: number): Promise<boolean> {
  const uid = auth.currentUser?.uid;
  if (!uid) return false;
  const snap = await getDoc(doc(db, "task_completions", `${uid}_${taskId}`));
  return snap.exists();
}

/**
 * Get all completed task IDs for the current user from a list of task IDs.
 */
export async function getCompletedTaskIds(taskIds: number[]): Promise<Set<number>> {
  const uid = auth.currentUser?.uid;
  if (!uid || taskIds.length === 0) return new Set();
  const completed = new Set<number>();
  await Promise.all(
    taskIds.map(async (id) => {
      const snap = await getDoc(doc(db, "task_completions", `${uid}_${id}`));
      if (snap.exists()) completed.add(id);
    })
  );
  return completed;
}

