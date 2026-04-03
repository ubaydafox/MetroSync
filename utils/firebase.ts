import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDL18HIx3cs2m91zGPW850DeBHg7L9A9X8",
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || "metrosync-bac14.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "metrosync-bac14",
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || "metrosync-bac14.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || "272572513538",
  appId: process.env.NEXT_PUBLIC_APP_ID || "1:272572513538:web:360e1ae69ea89ea746d61b",
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID || "G-DVDJMXN8PP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;