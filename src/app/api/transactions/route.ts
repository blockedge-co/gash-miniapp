import { NextRequest, NextResponse } from 'next/server';
import type { Transaction, ApiResponse } from '@/types';

// Mock data for development (in a real app, this would come from a database)
const mockTransactions = new Map<string, Transaction[]>();

// Helper function to get user transactions
function getUserTransactions(userId: string): Transaction[] {
  return mockTransactions.get(userId) || [];
}

// Helper function to add a transaction
function addTransaction(userId: string, transaction: Transaction) {
  const userTransactions = getUserTransactions(userId);
  userTransactions.push(transaction);
  mockTransactions.set(userId, userTransactions);
}

// Export for external use
export { addTransaction };

// Mock data initialization for demo purposes
function initializeMockData() {
  // Only initialize once
  if (mockTransactions.size > 0) return;

  // Add some sample transactions for demo
  const sampleTransactions: Transaction[] = [
    {
      id: 'tx1',
      userId: 'user1',
      type: 'swap',
      amountWLD: 10,
      amountGASH: 100,
      bonusGASH: 5,
      rate: 10,
      txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      status: 'completed',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: 'tx2',
      userId: 'user1',
      type: 'swap',
      amountWLD: 5,
      amountGASH: 50,
      bonusGASH: 0,
      rate: 10,
      txHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
      status: 'completed',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
    {
      id: 'tx3',
      userId: 'user1',
      type: 'swap',
      amountWLD: 15,
      amountGASH: 150,
      bonusGASH: 7.5,
      rate: 10,
      txHash: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
      status: 'completed',
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    },
  ];

  mockTransactions.set('user1', sampleTransactions);
}

initializeMockData();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required',
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    const transactions = getUserTransactions(userId);

    return NextResponse.json({
      success: true,
      data: transactions,
      message: 'Transactions retrieved successfully',
    } as ApiResponse<Transaction[]>);
  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
