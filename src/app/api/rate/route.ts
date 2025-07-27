import { NextRequest, NextResponse } from 'next/server';
import type { ConversionRate, ApiResponse } from '@/types';

// Mock rate cache
let cachedRate: ConversionRate | null = null;
let lastUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();

    // Check if we need to update the rate
    if (!cachedRate || now - lastUpdate > CACHE_DURATION) {
      // Simulate rate fetching with small variations
      const baseRate = 10; // 1 WLD = 10 GASH
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const currentRate = Math.max(baseRate + variation, 8); // Minimum rate of 8

      cachedRate = {
        rate: Math.round(currentRate * 100) / 100, // Round to 2 decimals
        updatedAt: new Date().toISOString(),
        source: 'mock',
      };

      lastUpdate = now;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return NextResponse.json({
      success: true,
      data: cachedRate,
      message: 'Rate fetched successfully',
    } as ApiResponse<ConversionRate>);
  } catch (error) {
    console.error('Rate API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conversion rate',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

// Rate limiting for rate requests
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100;

  const userLimit = rateLimitMap.get(ip) || {
    count: 0,
    resetTime: now + windowMs,
  };

  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + windowMs;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  rateLimitMap.set(ip, userLimit);
  return true;
}

export async function HEAD(request: NextRequest) {
  // Health check endpoint
  return new NextResponse(null, { status: 200 });
}
