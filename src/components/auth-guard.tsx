'use client';

import { useIsAuthenticated } from '@/stores/app-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    // Redirect to onboarding if not authenticated
    if (!isAuthenticated) {
      router.push('/onboarding');
    }
  }, [isAuthenticated, router]);

  // Show children only if authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return <>{children}</>;
}
