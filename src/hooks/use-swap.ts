import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SwapRequest, SwapResponse, ApiResponse } from '@/types';
import { useAppActions } from '@/stores/app-store';

interface UseSwapOptions {
  onSuccess?: (data: SwapResponse) => void;
  onError?: (error: string) => void;
}

export function useSwap(options: UseSwapOptions = {}) {
  const queryClient = useQueryClient();
  const { addTransaction, setError } = useAppActions();

  const mutation = useMutation({
    mutationFn: async (request: SwapRequest): Promise<SwapResponse> => {
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data: ApiResponse<SwapResponse> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Swap failed');
      }

      return data.data;
    },
    onSuccess: (data, variables) => {
      // Add transaction to store
      const transaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: variables.userId,
        type: 'swap' as const,
        amountWLD: variables.amountWLD,
        amountGASH: data.gashReceived - data.bonusReceived,
        bonusGASH: data.bonusReceived,
        rate: data.rate,
        txHash: data.txHash,
        status: 'completed' as const,
        timestamp: data.timestamp,
      };

      addTransaction(transaction);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      // Clear any previous errors
      setError(null);

      // Call success callback
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Swap failed';
      setError(errorMessage);
      options.onError?.(errorMessage);
    },
  });

  return {
    swap: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error?.message,
    data: mutation.data,
    reset: mutation.reset,
  };
}
