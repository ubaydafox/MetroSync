import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

/**
 * Initialize Firebase using the singleton pattern.
 *
 * getApps().length check prevents "FirebaseApp named '[DEFAULT]' already exists"
 * errors in Next.js hot-reload dev environments and React Strict Mode.
 *
 * NOTE: NEXT_PUBLIC_* variables are embedded at build time.
 *       They MUST be set in Vercel → Project Settings → Environment Variables
 *       before deploying. They are intentionally absent from .env.local which
 *       is git-ignored and never sent to Vercel.
 */
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize services
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;