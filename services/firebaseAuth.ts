import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, googleProvider, db } from "@/utils/firebase";

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<{
  firebaseUser: FirebaseUser;
  backendToken?: string;
  needsOnboarding?: boolean;
}> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser: FirebaseUser = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      emailVerified: result.user.emailVerified,
    };

    // Check if user profile exists in Firestore
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Check if onboarding is complete (has department set)
      if (userData.department) {
        return {
          firebaseUser,
          needsOnboarding: false,
        };
      } else {
        return {
          firebaseUser,
          needsOnboarding: true,
        };
      }
    } else {
      // User doesn't exist in Firestore — create a stub and send to onboarding
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || "",
        role: "student",
        createdAt: serverTimestamp(),
      });
      return {
        firebaseUser,
        needsOnboarding: true,
      };
    }
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string) => {
  if (!auth) {
    throw new Error("Firebase is not configured. Please set up Firebase environment variables.");
  }
  try {
    return await firebaseSendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const firebaseUser: FirebaseUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      };
      callback(firebaseUser);
    } else {
      callback(null);
    }
  });
};

// Complete onboarding — write full profile to Firestore
export const completeOnboarding = async (
  firebaseUser: FirebaseUser,
  onboardingData: {
    department: string;
    name?: string;
    batch?: string;
    roll?: string;
  }
): Promise<{ token: string; user: BackendUser }> => {
  try {
    const userDocRef = doc(db, "users", firebaseUser.uid);

    const profileData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: onboardingData.name || firebaseUser.displayName || "",
      photoURL: firebaseUser.photoURL || "",
      role: "student",
      department: onboardingData.department,
      batch: onboardingData.batch || "",
      roll: onboardingData.roll || "",
      updatedAt: serverTimestamp(),
    };

    await setDoc(userDocRef, profileData, { merge: true });

    // Use Firebase ID token as the session token
    const idToken = await auth.currentUser!.getIdToken();
    localStorage.setItem("token", idToken);

    const user: BackendUser = {
      id: firebaseUser.uid,
      name: profileData.name,
      email: profileData.email || "",
      role: profileData.role,
      department: profileData.department,
    };

    return { token: idToken, user };
  } catch (error) {
    console.error("Onboarding error:", error);
    throw error;
  }
};
