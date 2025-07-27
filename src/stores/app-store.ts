import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  AppState,
  AppActions,
  User,
  ConversionRate,
  Transaction,
} from '@/types';

interface AppStore extends AppState, AppActions {}

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      rate: null,
      transactions: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User | null) =>
        set(
          state => ({
            ...state,
            user,
            isAuthenticated: !!user,
          }),
          false,
          'setUser'
        ),

      setRate: (rate: ConversionRate) =>
        set(
          state => ({
            ...state,
            rate,
          }),
          false,
          'setRate'
        ),

      addTransaction: (transaction: Transaction) =>
        set(
          state => ({
            ...state,
            transactions: [transaction, ...state.transactions],
          }),
          false,
          'addTransaction'
        ),

      setTransactions: (transactions: Transaction[]) =>
        set(
          state => ({
            ...state,
            transactions,
          }),
          false,
          'setTransactions'
        ),

      setLoading: (isLoading: boolean) =>
        set(
          state => ({
            ...state,
            isLoading,
          }),
          false,
          'setLoading'
        ),

      setError: (error: string | null) =>
        set(
          state => ({
            ...state,
            error,
          }),
          false,
          'setError'
        ),

      reset: () =>
        set(
          {
            user: null,
            rate: null,
            transactions: [],
            isAuthenticated: false,
            isLoading: false,
            error: null,
          },
          false,
          'reset'
        ),
    }),
    {
      name: 'gash-app-store',
    }
  )
);

// Selectors for better performance
export const useUser = () => useAppStore(state => state.user);
export const useRate = () => useAppStore(state => state.rate);
export const useTransactions = () => useAppStore(state => state.transactions);
export const useIsAuthenticated = () =>
  useAppStore(state => state.isAuthenticated);
export const useIsLoading = () => useAppStore(state => state.isLoading);
export const useError = () => useAppStore(state => state.error);

// Action selectors
export const useAppActions = () =>
  useAppStore(state => ({
    setUser: state.setUser,
    setRate: state.setRate,
    addTransaction: state.addTransaction,
    setTransactions: state.setTransactions,
    setLoading: state.setLoading,
    setError: state.setError,
    reset: state.reset,
  }));
