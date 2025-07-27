# TypeScript Type Definitions - WLD → GASH Swap MiniApp

## Overview

This document provides comprehensive TypeScript type definitions for the WLD → GASH Swap MiniApp. These types ensure type safety across the entire application and provide clear contracts between components, API endpoints, and data structures.

## Core Types

### Authentication Types

```typescript
// src/types/auth.ts

export interface WorldIDProof {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: "orb" | "device";
  credential_type: "orb" | "device";
}

export interface User {
  id: string;
  nullifier: string;
  totalGash: number;
  joinedAt: string;
  lastSwapAt: string | null;
  swapCount: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  theme: "dark" | "light";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  signIn: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}
```

### Swap Types

```typescript
// src/types/swap.ts

export interface SwapRequest {
  amount: number;
  userNullifier: string;
  expectedRate: number;
}

export interface SwapResponse {
  success: boolean;
  data?: SwapResult;
  error?: ApiError;
}

export interface SwapResult {
  transactionId: string;
  wldAmount: number;
  gashReceived: number;
  bonus: number;
  exchangeRate: number;
  totalGash: number;
  timestamp: string;
  transactionHash: string;
}

export interface ExchangeRate {
  rate: number;
  bonusPercentage: number;
  timestamp: string;
  validUntil: string;
  calculation?: RateCalculation;
}

export interface RateCalculation {
  wldAmount: number;
  baseGash: number;
  bonusGash: number;
  totalGash: number;
}

export interface SwapState {
  amount: string;
  isLoading: boolean;
  currentRate: ExchangeRate | null;
  lastSwap: SwapResult | null;
  error: string | null;
}

export interface SwapActions {
  setAmount: (amount: string) => void;
  fetchRate: (amount?: number) => Promise<void>;
  executeSwap: (request: SwapRequest) => Promise<SwapResult>;
  clearError: () => void;
  reset: () => void;
}

export type SwapStatus = "idle" | "loading" | "success" | "error";
```

### Transaction Types

```typescript
// src/types/transaction.ts

export interface Transaction {
  id: string;
  wldAmount: number;
  gashReceived: number;
  bonus: number;
  exchangeRate: number;
  status: TransactionStatus;
  timestamp: string;
  transactionHash: string;
}

export type TransactionStatus = "pending" | "completed" | "failed";

export interface TransactionHistory {
  portfolio: Portfolio;
  transactions: Transaction[];
  pagination: PaginationInfo;
}

export interface Portfolio {
  totalGash: number;
  totalUsdValue: number;
  totalSwaps: number;
  totalWldSwapped: number;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface HistoryFilters {
  status?: TransactionStatus;
  limit?: number;
  offset?: number;
}
```

### API Types

```typescript
// src/types/api.ts

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface RateLimitHeaders {
  limit: number;
  remaining: number;
  reset: number;
}

export interface HealthCheck {
  status: "healthy" | "degraded" | "down";
  timestamp: string;
  version: string;
  services: ServiceStatus;
}

export interface ServiceStatus {
  database: "healthy" | "degraded" | "down";
  worldcoin: "healthy" | "degraded" | "down";
}

// API Endpoint Types
export namespace API {
  export namespace Swap {
    export type Request = SwapRequest;
    export type Response = ApiResponse<SwapResult>;
  }

  export namespace Rate {
    export interface Request {
      amount?: number;
    }
    export type Response = ApiResponse<ExchangeRate>;
  }

  export namespace History {
    export type Request = HistoryFilters;
    export type Response = ApiResponse<TransactionHistory>;
  }

  export namespace User {
    export namespace Profile {
      export type Response = ApiResponse<User>;
    }

    export namespace Preferences {
      export type Request = Partial<UserPreferences>;
      export type Response = ApiResponse<{ preferences: UserPreferences }>;
    }
  }
}
```

### Database Types

```typescript
// src/types/database.ts

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      transactions: {
        Row: TransactionRow;
        Insert: TransactionInsert;
        Update: TransactionUpdate;
      };
      rate_limits: {
        Row: RateLimitRow;
        Insert: RateLimitInsert;
        Update: RateLimitUpdate;
      };
    };
  };
}

export interface UserRow {
  id: string;
  nullifier: string;
  total_gash: number;
  created_at: string;
  updated_at: string;
  preferences: UserPreferences;
}

export interface UserInsert {
  nullifier: string;
  total_gash?: number;
  preferences?: UserPreferences;
}

export interface UserUpdate {
  total_gash?: number;
  updated_at?: string;
  preferences?: UserPreferences;
}

export interface TransactionRow {
  id: string;
  user_id: string;
  wld_amount: number;
  gash_received: number;
  bonus: number;
  exchange_rate: number;
  status: TransactionStatus;
  transaction_hash: string;
  created_at: string;
}

export interface TransactionInsert {
  user_id: string;
  wld_amount: number;
  gash_received: number;
  bonus: number;
  exchange_rate: number;
  status?: TransactionStatus;
  transaction_hash: string;
}

export interface TransactionUpdate {
  status?: TransactionStatus;
  transaction_hash?: string;
}

export interface RateLimitRow {
  id: string;
  user_id: string;
  action: string;
  count: number;
  window_start: string;
}

export interface RateLimitInsert {
  user_id: string;
  action: string;
  count?: number;
  window_start?: string;
}

export interface RateLimitUpdate {
  count?: number;
  window_start?: string;
}
```

### UI Component Types

```typescript
// src/types/ui.ts

export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export interface InputProps {
  type?: "text" | "number" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
}

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white";
  className?: string;
}
```

### Component-Specific Types

```typescript
// src/types/components.ts

export interface SwapFormProps {
  onSubmit: (amount: number) => void;
  isLoading: boolean;
  currentRate: ExchangeRate | null;
  error?: string;
}

export interface SwapConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  swapDetails: {
    amount: number;
    rate: number;
    bonus: number;
    total: number;
  };
  isLoading: boolean;
}

export interface SwapSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  result: SwapResult;
}

export interface SwapErrorProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  error: string;
}

export interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface TransactionItemProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
}

export interface HoldingsCardProps {
  portfolio: Portfolio;
  isLoading: boolean;
}

export interface RateDisplayProps {
  rate: ExchangeRate | null;
  amount?: number;
  isLoading: boolean;
}

export interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}
```

### Hook Types

```typescript
// src/types/hooks.ts

export interface UseSwapReturn {
  // State
  amount: string;
  isLoading: boolean;
  currentRate: ExchangeRate | null;
  lastSwap: SwapResult | null;
  error: string | null;

  // Actions
  setAmount: (amount: string) => void;
  fetchRate: (amount?: number) => Promise<void>;
  executeSwap: (amount: number) => Promise<SwapResult>;
  clearError: () => void;
  reset: () => void;
}

export interface UseAuthReturn {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signIn: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface UseHistoryReturn {
  // State
  transactions: Transaction[];
  portfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;

  // Actions
  fetchHistory: (filters?: HistoryFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface UseRateReturn {
  // State
  rate: ExchangeRate | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;

  // Actions
  fetchRate: (amount?: number) => Promise<void>;
  subscribeToUpdates: () => () => void;
}
```

### Store Types

```typescript
// src/types/store.ts

export interface AuthStore extends AuthState, AuthActions {}

export interface SwapStore extends SwapState, SwapActions {}

export interface UIStore {
  // Modal states
  modals: {
    swapConfirmation: boolean;
    swapSuccess: boolean;
    swapError: boolean;
  };

  // Loading states
  loading: {
    global: boolean;
    swap: boolean;
    rate: boolean;
    history: boolean;
  };

  // Toast notifications
  toasts: Toast[];

  // Actions
  openModal: (modal: keyof UIStore["modals"]) => void;
  closeModal: (modal: keyof UIStore["modals"]) => void;
  setLoading: (key: keyof UIStore["loading"], value: boolean) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}
```

### Utility Types

```typescript
// src/types/utils.ts

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ValueOf<T> = T[keyof T];

export type ArrayElement<T> = T extends (infer U)[] ? U : never;

export type PromiseType<T> = T extends Promise<infer U> ? U : T;

export type NonEmptyArray<T> = [T, ...T[]];

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface TimestampedEntity {
  createdAt: string;
  updatedAt: string;
}

export interface SortOptions<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

export interface FilterOptions<T> {
  [K in keyof T]?: T[K] | T[K][];
}
```

### Validation Types

```typescript
// src/types/validation.ts

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface SwapValidation {
  amount: ValidationResult;
  rate: ValidationResult;
  overall: ValidationResult;
}

export interface FormValidation<T> {
  [K in keyof T]: ValidationResult;
}

export type ValidatorFunction<T> = (value: T) => ValidationResult;

export interface ValidationRules {
  swap: {
    minAmount: number;
    maxAmount: number;
    maxDecimals: number;
    rateTolerancePercent: number;
  };
  user: {
    nullifierPattern: RegExp;
    maxTransactionsPerHour: number;
  };
}
```

### Environment Types

```typescript
// src/types/env.ts

export interface EnvironmentVariables {
  // Public variables
  NEXT_PUBLIC_WORLDCOIN_APP_ID: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_APP_ENV: "development" | "staging" | "production";

  // Server-only variables
  SUPABASE_SERVICE_ROLE_KEY: string;
  WORLDCOIN_APP_SECRET: string;
  RATE_LIMIT_REDIS_URL?: string;
}

export interface AppConfig {
  worldcoin: {
    appId: string;
    environment: "staging" | "production";
  };
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  swap: {
    minAmount: number;
    maxAmount: number;
    baseRate: number;
    bonusPercentage: number;
    rateValidityMinutes: number;
  };
  rateLimit: {
    swapPerHour: number;
    ratePerMinute: number;
    historyPerMinute: number;
  };
}
```

## Type Guards

```typescript
// src/types/guards.ts

export const isUser = (value: any): value is User => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.id === "string" &&
    typeof value.nullifier === "string" &&
    typeof value.totalGash === "number"
  );
};

export const isTransaction = (value: any): value is Transaction => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.id === "string" &&
    typeof value.wldAmount === "number" &&
    typeof value.gashReceived === "number" &&
    ["pending", "completed", "failed"].includes(value.status)
  );
};

export const isApiError = (value: any): value is ApiError => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.code === "string" &&
    typeof value.message === "string"
  );
};

export const isSwapResult = (value: any): value is SwapResult => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.transactionId === "string" &&
    typeof value.wldAmount === "number" &&
    typeof value.gashReceived === "number"
  );
};
```

## Usage Examples

### Component with Props

```typescript
import { SwapFormProps } from "@/types/components";

const SwapForm: React.FC<SwapFormProps> = ({
  onSubmit,
  isLoading,
  currentRate,
  error,
}) => {
  // Component implementation
};
```

### API Call with Types

```typescript
import { API } from "@/types/api";

const swapTokens = async (
  request: API.Swap.Request
): Promise<API.Swap.Response> => {
  const response = await fetch("/api/swap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  return response.json();
};
```

### Store Usage

```typescript
import { useSwapStore } from "@/store/swapStore";

const SwapComponent = () => {
  const { amount, setAmount, executeSwap, isLoading, error } = useSwapStore();

  // Component logic
};
```

---

These type definitions provide comprehensive type safety across the entire WLD → GASH Swap MiniApp, ensuring consistent interfaces and reducing runtime errors.
