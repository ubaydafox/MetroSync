import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { GoogleAuthProvider } from 'firebase/auth';

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
 * IMPORTANT — Why the guard exists:
 *
 * Next.js App Router evaluates ALL imported modules (including those inside
 * "use client" components) on the Node.js server during static page generation.
 * Without the guard below, initializeApp() is called with apiKey = undefined,
 * causing Firebase to throw auth/invalid-api-key and crash the Vercel build.
 *
 * NEXT_PUBLIC_* variables are embedded into the bundle AT BUILD TIME.
 * You MUST add them in Vercel → Project → Settings → Environment Variables
 * BEFORE the build runs. They are gitignored and never sent to Vercel
 * automatically.
 *
 * When the env vars ARE present (normal production build), firebaseConfig.apiKey
 * is a real string, the guard passes, and everything works normally.
 *
 * When they are ABSENT (build without env vars configured), the guard prevents
 * the crash and returns null stubs so the build succeeds. The deployed app will
 * not function until a new build is triggered WITH the env vars set.
 */
let _app: FirebaseApp | null = null;

if (firebaseConfig.apiKey) {
  _app = getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nullStub: any = null;

export const auth    = _app ? getAuth(_app)      : nullStub;
export const db      = _app ? getFirestore(_app) : nullStub;
export const storage = _app ? getStorage(_app)   : nullStub;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default _app;