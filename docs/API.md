# API Specification - WLD → GASH Swap MiniApp

## Overview

This document provides detailed specifications for all API endpoints in the WLD → GASH Swap MiniApp. All endpoints follow RESTful conventions and return JSON responses.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.vercel.app/api`

## Authentication

All protected endpoints require a valid Supabase JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Rate Limiting

- **Swap endpoints**: 5 requests per user per hour
- **Rate endpoints**: 100 requests per user per minute
- **History endpoints**: 50 requests per user per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1640995200
```

## Error Handling

All endpoints return consistent error responses:

```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

### Common Error Codes

- `INVALID_INPUT` - Request validation failed
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `UNAUTHORIZED` - Authentication required
- `INSUFFICIENT_BALANCE` - Not enough WLD balance
- `SWAP_FAILED` - Transaction processing failed
- `INTERNAL_ERROR` - Server error

## Endpoints

### POST /api/swap

Process a WLD to GASH swap transaction.

**Authentication**: Required

**Request Body**:

```typescript
{
  amount: number; // WLD amount to swap (0.001 - 1000)
  userNullifier: string; // World ID nullifier hash
  expectedRate: number; // Expected exchange rate for validation
}
```

**Validation Rules**:

- `amount`: Must be between 0.001 and 1000 WLD
- `userNullifier`: Must be valid World ID nullifier
- `expectedRate`: Must be within 5% of current rate

**Success Response** (200):

```typescript
{
  success: true;
  data: {
    transactionId: string; // Unique transaction identifier
    wldAmount: number; // WLD amount swapped
    gashReceived: number; // GASH tokens received
    bonus: number; // Bonus GASH amount
    exchangeRate: number; // Actual exchange rate used
    totalGash: number; // User's total GASH balance
    timestamp: string; // ISO 8601 timestamp
    transactionHash: string; // Mock transaction hash
  }
}
```

**Error Responses**:

- `400` - Invalid input parameters
- `429` - Rate limit exceeded
- `500` - Swap processing failed

**Example Request**:

```bash
curl -X POST /api/swap \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "amount": 100,
    "userNullifier": "0x1234...",
    "expectedRate": 0.0001
  }'
```

### GET /api/rate

Get current WLD to GASH exchange rate and bonus information.

**Authentication**: Optional

**Query Parameters**:

```typescript
{
  amount?: number;  // Calculate total for specific amount
}
```

**Success Response** (200):

```typescript
{
  success: true;
  data: {
    rate: number;               // Base exchange rate (1 WLD = X GASH)
    bonusPercentage: number;    // Bonus percentage (0.01 = 1%)
    timestamp: string;          // Rate timestamp
    validUntil: string;         // Rate expiration time
    calculation?: {             // If amount provided
      wldAmount: number;
      baseGash: number;
      bonusGash: number;
      totalGash: number;
    }
  }
}
```

**Caching**: 30 seconds

**Example Request**:

```bash
curl /api/rate?amount=100
```

### GET /api/history

Get user's transaction history and portfolio summary.

**Authentication**: Required

**Query Parameters**:

```typescript
{
  limit?: number;     // Number of transactions (default: 20, max: 100)
  offset?: number;    // Pagination offset (default: 0)
  status?: string;    // Filter by status: 'completed' | 'failed'
}
```

**Success Response** (200):

```typescript
{
  success: true;
  data: {
    portfolio: {
      totalGash: number; // Total GASH balance
      totalUsdValue: number; // USD value of holdings
      totalSwaps: number; // Number of completed swaps
      totalWldSwapped: number; // Total WLD swapped
    }
    transactions: Array<{
      id: string;
      wldAmount: number;
      gashReceived: number;
      bonus: number;
      exchangeRate: number;
      status: "completed" | "failed";
      timestamp: string;
      transactionHash: string;
    }>;
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    }
  }
}
```

**Example Request**:

```bash
curl /api/history?limit=10&offset=0 \
  -H "Authorization: Bearer <token>"
```

### GET /api/user/profile

Get user profile and account information.

**Authentication**: Required

**Success Response** (200):

```typescript
{
  success: true;
  data: {
    id: string;
    nullifier: string;
    totalGash: number;
    joinedAt: string;
    lastSwapAt: string;
    swapCount: number;
    preferences: {
      notifications: boolean;
      theme: "dark" | "light";
    }
  }
}
```

### PUT /api/user/preferences

Update user preferences.

**Authentication**: Required

**Request Body**:

```typescript
{
  notifications?: boolean;
  theme?: 'dark' | 'light';
}
```

**Success Response** (200):

```typescript
{
  success: true;
  data: {
    preferences: {
      notifications: boolean;
      theme: "dark" | "light";
    }
  }
}
```

### GET /api/health

Health check endpoint for monitoring.

**Authentication**: None

**Success Response** (200):

```typescript
{
  status: "healthy";
  timestamp: string;
  version: string;
  services: {
    database: "healthy" | "degraded" | "down";
    worldcoin: "healthy" | "degraded" | "down";
  }
}
```

## WebSocket Events (Future Enhancement)

For real-time updates, the following WebSocket events will be supported:

### Client → Server Events

```typescript
// Subscribe to rate updates
{
  type: "subscribe_rates";
  data: {
  }
}

// Subscribe to transaction updates
{
  type: "subscribe_transactions";
  data: {
    userNullifier: string;
  }
}
```

### Server → Client Events

```typescript
// Rate update
{
  type: "rate_update";
  data: {
    rate: number;
    bonusPercentage: number;
    timestamp: string;
  }
}

// Transaction status update
{
  type: "transaction_update";
  data: {
    transactionId: string;
    status: "pending" | "completed" | "failed";
    timestamp: string;
  }
}
```

## SDK Integration

### Worldcoin MiniApp SDK

The API integrates with Worldcoin MiniApp SDK for authentication:

```typescript
// Authentication flow
const authResult = await miniKit.signIn();
if (authResult.success) {
  // Use authResult.token for API calls
  const response = await fetch("/api/swap", {
    headers: {
      Authorization: `Bearer ${authResult.token}`,
    },
  });
}
```

### Payment Integration (Future)

```typescript
// Future on-chain payment integration
const paymentResult = await miniKit.pay({
  to: GASH_CONTRACT_ADDRESS,
  value: amount.toString(),
  reference: transactionId,
});
```

## Testing

### Mock Data

For development and testing, the API provides mock data:

```typescript
// Mock exchange rates
const MOCK_RATES = {
  base: 0.0001, // 1 WLD = 0.0001 GASH
  bonus: 0.01, // 1% bonus
  volatility: 0.05, // ±5% rate variation
};

// Mock transaction processing
const processMockSwap = async (amount: number) => {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 95% success rate
  if (Math.random() < 0.95) {
    return { success: true, transactionHash: generateMockHash() };
  } else {
    throw new Error("Mock swap failed");
  }
};
```

### Test Endpoints

Development environment includes test endpoints:

- `POST /api/test/reset-user` - Reset user data
- `POST /api/test/set-rate` - Override exchange rate
- `POST /api/test/simulate-error` - Trigger specific errors

## Performance Considerations

### Caching Strategy

- **Rate data**: 30-second cache with stale-while-revalidate
- **User data**: 5-minute cache with invalidation on updates
- **Transaction history**: 1-minute cache per user

### Database Optimization

- **Indexes**: Created on frequently queried fields
- **Connection pooling**: Supabase handles connection management
- **Query optimization**: Efficient pagination and filtering

### Rate Limiting Implementation

```typescript
// Rate limiting with sliding window
const checkRateLimit = async (userId: string, action: string) => {
  const window = 3600; // 1 hour
  const limit = action === "swap" ? 5 : 100;

  const count = await redis.incr(`rate_limit:${userId}:${action}`);
  if (count === 1) {
    await redis.expire(`rate_limit:${userId}:${action}`, window);
  }

  return count <= limit;
};
```

## Security Considerations

### Input Validation

All inputs are validated using Zod schemas:

```typescript
const swapSchema = z.object({
  amount: z.number().min(0.001).max(1000),
  userNullifier: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  expectedRate: z.number().positive(),
});
```

### SQL Injection Prevention

- **Parameterized queries**: All database queries use parameters
- **ORM protection**: Supabase client handles query sanitization
- **Input sanitization**: All user inputs are sanitized

### Authentication Security

- **JWT validation**: All tokens verified with Supabase
- **Nullifier verification**: World ID nullifiers validated
- **Session management**: Secure session handling

---

This API specification provides a complete reference for implementing and integrating with the WLD → GASH Swap MiniApp backend services.
