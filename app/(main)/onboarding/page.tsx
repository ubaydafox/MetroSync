"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChange, FirebaseUser } from '@/services/firebaseAuth';
import Onboarding from './Onboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        // No Firebase user, redirect to login
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
          <p className="mt-4 text-(--text)/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null; // Will redirect to login
  }

  return <Onboarding firebaseUser={firebaseUser} />;
}