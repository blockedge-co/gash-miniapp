'use client';

import { useWorldId } from '@/hooks/use-world-id';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useIsAuthenticated } from '@/stores/app-store';

export default function OnboardingPage() {
  const { mockAuthenticate, verifyWorldId, isDevelopment } = useWorldId();
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleWorldIdConnect = async () => {
    // TODO: Implement real World ID connection
    const result = await verifyWorldId();
    if (result.success) {
      router.push('/dashboard');
    }
  };

  const handleDevBypass = async () => {
    const result = await mockAuthenticate();
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gradient-gold mb-4">
          Welcome to GASH Swap
        </h1>
        <p className="text-light-600 mb-6">
          Swap your Worldcoin (WLD) for synthetic gold-backed tokens (GASH)
        </p>
        <div className="space-y-4">
          <button className="btn-gold w-full" onClick={handleWorldIdConnect}>
            Connect with World ID
          </button>

          {isDevelopment && (
            <button className="btn-secondary w-full" onClick={handleDevBypass}>
              Dev Bypass (Mock Authentication)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
