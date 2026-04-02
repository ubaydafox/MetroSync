import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { apiFetch } from "@/utils/api";
import { auth, googleProvider } from "@/utils/firebase";

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

    // Check if user exists in backend
    const checkResponse = await apiFetch(`auth/check-user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
      }),
    });

    if (checkResponse.ok) {
      const userData = await checkResponse.json();

      if (userData.exists) {
        // User exists, get token
        const tokenResponse = await apiFetch(`auth/firebase-login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebase_uid: firebaseUser.uid,
            email: firebaseUser.email,
          }),
        });

        if (tokenResponse.ok) {
          const { token, user } = await tokenResponse.json();
          return {
            firebaseUser,
            backendToken: token,
            needsOnboarding: false,
          };
        }
      } else {
        // User doesn't exist, needs onboarding
        return {
          firebaseUser,
          needsOnboarding: true,
        };
      }
    }

    throw new Error("Failed to check user status");
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

// Complete onboarding
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
    const response = await apiFetch(`auth/firebase-signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: onboardingData.name || firebaseUser.displayName,
        department: onboardingData.department,
        batch: onboardingData.batch,
        roll: onboardingData.roll,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to complete onboarding");
    }

    const { token, user } = await response.json();
    return { token, user };
  } catch (error) {
    console.error("Onboarding error:", error);
    throw error;
  }
};
