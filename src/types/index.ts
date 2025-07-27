// Core domain types
export interface User {
  id: string;
  worldId: string;
  walletAddress?: string;
  wldBalance: number;
  gashBalance: number;
  totalSwaps: number;
  firstSwapCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SwapRequest {
  userId: string;
  amountWLD: number;
  expectedGASH: number;
  bonusEligible: boolean;
  bonusAmount?: number;
}

export interface SwapResponse {
  txHash: string;
  gashReceived: number;
  bonusReceived: number;
  timestamp: string;
  rate: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'swap';
  amountWLD: number;
  amountGASH: number;
  bonusGASH: number;
  rate: number;
  txHash: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

export interface ConversionRate {
  rate: number;
  updatedAt: string;
  source: 'mock' | 'oracle';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SwapApiResponse extends ApiResponse<SwapResponse> {}
export interface RateApiResponse extends ApiResponse<ConversionRate> {}
export interface UserApiResponse extends ApiResponse<User> {}
export interface TransactionsApiResponse extends ApiResponse<Transaction[]> {}

// Component prop types
export interface SwapFormProps {
  user: User;
  rate: ConversionRate;
  onSwap: (request: SwapRequest) => Promise<void>;
  isLoading?: boolean;
}

export interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export interface WalletInfoProps {
  user: User;
  className?: string;
}

export interface VaultCardProps {
  gashBalance: number;
  usdValue: number;
  className?: string;
}

// Store types
export interface AppState {
  user: User | null;
  rate: ConversionRate | null;
  transactions: Transaction[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AppActions {
  setUser: (user: User | null) => void;
  setRate: (rate: ConversionRate) => void;
  addTransaction: (transaction: Transaction) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Worldcoin types
export interface WorldIDVerification {
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  verification_level: 'orb' | 'device';
}

export interface WorldIDResponse {
  success: boolean;
  verification?: WorldIDVerification;
  error?: string;
}

// Utility types
export type SwapStatus =
  | 'idle'
  | 'validating'
  | 'confirming'
  | 'processing'
  | 'success'
  | 'error';

export interface SwapValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AppConfig {
  mockMode: boolean;
  wldToGashRate: number;
  firstSwapBonus: number;
  minSwapAmount: number;
  maxDailySwaps: number;
  rateLimitWindow: number;
}

// Error types
export class SwapError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SwapError';
  }
}

export class RateLimitError extends SwapError {
  constructor(
    message: string,
    public retryAfter?: number
  ) {
    super(message, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends SwapError {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}
