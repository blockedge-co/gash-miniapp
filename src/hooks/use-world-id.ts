import { useCallback } from 'react';
import { useAppStore } from '@/stores/app-store';
import { User } from '@/types';

export const useWorldId = () => {
  const { setUser, setLoading, setError } = useAppStore(state => ({
    setUser: state.setUser,
    setLoading: state.setLoading,
    setError: state.setError,
  }));

  // Mock authentication for development
  const mockAuthenticate = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create mock user
      const mockUser: User = {
        id: 'mock-user-123',
        worldId: 'mock-world-id-456',
        wldBalance: 1000,
        gashBalance: 500,
        totalSwaps: 0,
        firstSwapCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(mockUser);
      return { success: true, user: mockUser };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Authentication failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError]);

  // Real World ID verification (to be implemented)
  const verifyWorldId = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Implement real World ID verification
      // This would integrate with World ID SDK
      console.warn('Real World ID verification not yet implemented');
      setError('Real World ID verification not yet implemented');
      return { success: false, error: 'Not implemented' };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    mockAuthenticate,
    verifyWorldId,
    isDevelopment:
      process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
  };
};
