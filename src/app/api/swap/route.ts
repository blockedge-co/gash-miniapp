import { NextRequest, NextResponse } from 'next/server';
import type { SwapRequest, SwapResponse, ApiResponse } from '@/types';
import { addTransaction } from '../transactions/route';

// Mock data for development
const mockUsers = new Map();
const mockTransactions = new Map();

export async function POST(request: NextRequest) {
  try {
    const body: SwapRequest = await request.json();
    const { userId, amountWLD, expectedGASH, bonusEligible } = body;

    // Validate request
    if (!userId || !amountWLD || amountWLD <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request parameters',
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Check minimum amount
    if (amountWLD < 0.1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Minimum swap amount is 0.1 WLD',
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Mock rate limiting check
    const userSwaps = mockUsers.get(userId) || {
      count: 0,
      lastReset: Date.now(),
    };
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (now - userSwaps.lastReset > oneHour) {
      userSwaps.count = 0;
      userSwaps.lastReset = now;
    }

    if (userSwaps.count >= 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'Daily swap limit exceeded (5 swaps per day)',
        } as ApiResponse<never>,
        { status: 429 }
      );
    }

    // Mock swap processing
    const rate = 10; // 1 WLD = 10 GASH
    const baseGASH = amountWLD * rate;
    const bonusAmount = bonusEligible ? baseGASH * 0.05 : 0; // 5% bonus
    const totalGASH = baseGASH + bonusAmount;

    // Generate mock transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const timestamp = new Date().toISOString();

    // Update user swap count
    userSwaps.count += 1;
    mockUsers.set(userId, userSwaps);

    // Store transaction
    const transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type: 'swap' as const,
      amountWLD,
      amountGASH: baseGASH,
      bonusGASH: bonusAmount,
      rate,
      txHash,
      status: 'completed' as const,
      timestamp,
    };

    mockTransactions.set(transaction.id, transaction);

    // Add to the transaction store for the new API
    addTransaction(userId, transaction);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response: SwapResponse = {
      txHash,
      gashReceived: totalGASH,
      bonusReceived: bonusAmount,
      timestamp,
      rate,
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: 'Swap completed successfully',
    } as ApiResponse<SwapResponse>);
  } catch (error) {
    console.error('Swap API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
