import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { SwapValidation, AppConfig } from '@/types';

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format numbers for display
export function formatNumber(
  value: number,
  options: {
    decimals?: number;
    currency?: string;
    compact?: boolean;
  } = {}
): string {
  const { decimals = 2, currency, compact = false } = options;

  if (compact && value >= 1000) {
    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    });
    return formatter.format(value);
  }

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    ...(currency && { style: 'currency', currency }),
  });

  return formatter.format(value);
}

// Format WLD amounts
export function formatWLD(amount: number): string {
  return `${formatNumber(amount, { decimals: 4 })} WLD`;
}

// Format GASH amounts
export function formatGASH(amount: number): string {
  return `${formatNumber(amount, { decimals: 2 })} GASH`;
}

// Format USD amounts
export function formatUSD(amount: number): string {
  return formatNumber(amount, { currency: 'USD' });
}

// Validate swap amount
export function validateSwapAmount(
  amount: number,
  userBalance: number,
  config: AppConfig
): SwapValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if amount is positive
  if (amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  // Check minimum amount
  if (amount < config.minSwapAmount) {
    errors.push(`Minimum swap amount is ${formatWLD(config.minSwapAmount)}`);
  }

  // Check user balance
  if (amount > userBalance) {
    errors.push('Insufficient WLD balance');
  }

  // Warning for large amounts
  if (amount > userBalance * 0.8) {
    warnings.push('You are swapping a large portion of your balance');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Calculate GASH amount from WLD
export function calculateGASH(
  wldAmount: number,
  rate: number,
  bonusPercent: number = 0
): {
  baseAmount: number;
  bonusAmount: number;
  totalAmount: number;
} {
  const baseAmount = wldAmount * rate;
  const bonusAmount = bonusPercent > 0 ? (baseAmount * bonusPercent) / 100 : 0;
  const totalAmount = baseAmount + bonusAmount;

  return {
    baseAmount,
    bonusAmount,
    totalAmount,
  };
}

// Truncate transaction hash for display
export function truncateHash(hash: string, length: number = 8): string {
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

// Format relative time
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString();
}

// Generate mock transaction hash
export function generateMockTxHash(): string {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Sleep utility for demos
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get app configuration from environment
export function getAppConfig(): AppConfig {
  return {
    mockMode: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
    wldToGashRate: Number(process.env.NEXT_PUBLIC_WLD_TO_GASH_RATE) || 10,
    firstSwapBonus: Number(process.env.NEXT_PUBLIC_FIRST_SWAP_BONUS) || 5,
    minSwapAmount: 0.1,
    maxDailySwaps: 5,
    rateLimitWindow: Number(process.env.RATE_LIMIT_WINDOW_MS) || 3600000,
  };
}

// Copy to clipboard utility
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Check if running in mobile browser
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Check if running in World App
export function isWorldApp(): boolean {
  if (typeof window === 'undefined') return false;
  return /WorldApp/i.test(navigator.userAgent);
}
