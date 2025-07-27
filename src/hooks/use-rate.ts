import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { ConversionRate, ApiResponse } from '@/types';
import { useAppActions } from '@/stores/app-store';

export function useRate() {
  const { setRate, setError } = useAppActions();

  const query = useQuery({
    queryKey: ['rate'],
    queryFn: async (): Promise<ConversionRate> => {
      const response = await fetch('/api/rate');
      const data: ApiResponse<ConversionRate> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to fetch rate');
      }

      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Handle success/error with useEffect
  useEffect(() => {
    if (query.data) {
      setRate(query.data);
      setError(null);
    }
  }, [query.data, setRate, setError]);

  useEffect(() => {
    if (query.error) {
      setError(query.error.message || 'Failed to fetch conversion rate');
    }
  }, [query.error, setError]);

  return {
    rate: query.data,
    isLoading: query.isLoading,
    error: query.error?.message,
    refetch: query.refetch,
  };
}
