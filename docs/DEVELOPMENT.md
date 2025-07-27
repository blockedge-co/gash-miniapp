# Development Workflow & Best Practices - WLD → GASH Swap MiniApp

## Overview

This document outlines the development workflow, coding standards, and best practices for the WLD → GASH Swap MiniApp project. Following these guidelines ensures consistent code quality, maintainability, and team collaboration.

## Development Environment Setup

### Prerequisites

```bash
# Required versions
Node.js >= 18.0.0
npm >= 9.0.0 (or yarn >= 1.22.0, pnpm >= 8.0.0)
Git >= 2.30.0
```

### Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd gash-miniapp

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Configure environment variables
# Edit .env.local with your values:
# - NEXT_PUBLIC_WORLDCOIN_APP_ID
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY

# 5. Setup database
npm run db:setup

# 6. Start development server
npm run dev
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "db:setup": "supabase db reset",
    "db:migrate": "supabase db push",
    "db:generate-types": "supabase gen types typescript --local > src/types/database.ts",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky install"
  }
}
```

## Git Workflow

### Branch Strategy

```
main
├── develop
│   ├── feature/swap-form-validation
│   ├── feature/worldcoin-integration
│   ├── feature/transaction-history
│   └── hotfix/rate-calculation-bug
└── release/v1.0.0
```

### Branch Naming Convention

```bash
# Feature branches
feature/description-of-feature
feature/swap-confirmation-modal
feature/rate-limiting-implementation

# Bug fixes
bugfix/description-of-bug
bugfix/modal-close-button-issue

# Hotfixes
hotfix/critical-security-fix

# Release branches
release/v1.0.0
release/v1.1.0
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

# Examples
feat(swap): add swap confirmation modal
fix(auth): resolve World ID authentication timeout
docs(api): update swap endpoint documentation
style(ui): improve button hover animations
refactor(store): simplify swap state management
test(swap): add unit tests for rate calculation
chore(deps): update dependencies to latest versions
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Pull Request Process

1. **Create Feature Branch**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Development**

   - Write code following coding standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Pre-commit Checks**

   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run format:check
   ```

4. **Create Pull Request**

   - Use PR template
   - Include screenshots for UI changes
   - Link related issues
   - Request appropriate reviewers

5. **Code Review**

   - Address reviewer feedback
   - Ensure CI passes
   - Squash commits if needed

6. **Merge**
   - Use "Squash and merge" for feature branches
   - Delete feature branch after merge

## Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Use explicit types
interface SwapFormData {
  amount: number;
  userNullifier: string;
}

// ❌ Bad: Avoid 'any' type
const handleSubmit = (data: any) => { ... }

// ✅ Good: Use type guards
const isValidAmount = (amount: unknown): amount is number => {
  return typeof amount === 'number' && amount > 0;
};

// ✅ Good: Use const assertions for immutable data
const SWAP_LIMITS = {
  MIN_AMOUNT: 0.001,
  MAX_AMOUNT: 1000,
} as const;

// ✅ Good: Use utility types
type PartialSwapData = Partial<SwapFormData>;
type RequiredSwapData = Required<SwapFormData>;
```

### React Component Guidelines

```tsx
// ✅ Good: Functional components with TypeScript
interface ButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

// ✅ Good: Use custom hooks for logic
const useSwapForm = () => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      await swapTokens(parseFloat(amount));
    } finally {
      setIsLoading(false);
    }
  }, [amount]);

  return { amount, setAmount, handleSubmit, isLoading };
};

// ✅ Good: Memoize expensive calculations
const SwapPreview = memo(({ amount, rate }: SwapPreviewProps) => {
  const calculation = useMemo(() => {
    return calculateSwapAmount(amount, rate);
  }, [amount, rate]);

  return <div>{calculation.total} GASH</div>;
});
```

### CSS/Styling Guidelines

```css
/* ✅ Good: Use CSS custom properties */
.button {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-6);
}

/* ✅ Good: Mobile-first responsive design */
.container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* ✅ Good: Use semantic class names */
.swap-form__input {
}
.swap-form__button {
}
.swap-form__error {
}

/* ❌ Bad: Avoid utility-only classes in CSS files */
.mt-4 {
  margin-top: 1rem;
} /* Use Tailwind instead */
```

### File Organization

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   └── index.ts        # Export all UI components
│   ├── swap/               # Feature-specific components
│   └── layout/             # Layout components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and configurations
├── store/                  # State management
├── types/                  # TypeScript type definitions
└── utils/                  # Pure utility functions
```

### Import/Export Guidelines

```typescript
// ✅ Good: Use named exports for components
export const Button: React.FC<ButtonProps> = ({ ... }) => { ... };

// ✅ Good: Use default exports for pages
const SwapPage = () => { ... };
export default SwapPage;

// ✅ Good: Organize imports
// 1. React and external libraries
import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';

// 2. Internal imports (absolute paths)
import { Button } from '@/components/ui';
import { useSwap } from '@/hooks/useSwap';
import { SwapRequest } from '@/types/swap';

// 3. Relative imports
import './SwapForm.css';

// ✅ Good: Use index files for clean imports
// components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
```

## Testing Strategy

### Unit Testing

```typescript
// Example: Component testing with React Testing Library
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
```

### API Testing

```typescript
// Example: API route testing
import { createMocks } from "node-mocks-http";
import handler from "@/pages/api/swap";

describe("/api/swap", () => {
  it("processes valid swap request", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        amount: 100,
        userNullifier: "0x1234...",
        expectedRate: 0.0001,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.transactionId).toBeDefined();
  });
});
```

### E2E Testing

```typescript
// Example: Playwright E2E test
import { test, expect } from "@playwright/test";

test("complete swap flow", async ({ page }) => {
  await page.goto("/");

  // Authenticate with World ID (mocked)
  await page.click('[data-testid="worldid-connect"]');
  await page.waitForSelector('[data-testid="swap-form"]');

  // Enter swap amount
  await page.fill('[data-testid="amount-input"]', "100");

  // Submit swap
  await page.click('[data-testid="swap-button"]');

  // Confirm swap
  await page.click('[data-testid="confirm-swap"]');

  // Verify success
  await expect(page.locator('[data-testid="swap-success"]')).toBeVisible();
});
```

### Test Coverage Requirements

- **Unit Tests**: 80% minimum coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Happy path and error scenarios

## Code Quality Tools

### ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/exhaustive-deps": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Husky Pre-commit Hooks

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run type-check
npm run test --passWithNoTests
npm run format:check
```

## Performance Guidelines

### Bundle Optimization

```typescript
// ✅ Good: Dynamic imports for code splitting
const SwapChart = dynamic(() => import("./SwapChart"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// ✅ Good: Lazy load heavy components
const HeavyComponent = lazy(() => import("./HeavyComponent"));

// ✅ Good: Use Next.js Image optimization
import Image from "next/image";

<Image src="/logo.png" alt="Logo" width={100} height={100} priority={true} />;
```

### React Performance

```typescript
// ✅ Good: Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ Good: Memoize callback functions
const handleClick = useCallback(() => {
  onItemClick(item.id);
}, [item.id, onItemClick]);

// ✅ Good: Use React.memo for pure components
const ListItem = memo(({ item, onClick }) => {
  return <div onClick={() => onClick(item.id)}>{item.name}</div>;
});
```

### Database Performance

```typescript
// ✅ Good: Use database indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

// ✅ Good: Implement pagination
const getTransactions = async (userId: string, limit = 20, offset = 0) => {
  return supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
};
```

## Security Best Practices

### Input Validation

```typescript
// ✅ Good: Use Zod for validation
import { z } from "zod";

const swapSchema = z.object({
  amount: z.number().min(0.001).max(1000),
  userNullifier: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  expectedRate: z.number().positive(),
});

// Validate in API routes
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const validatedData = swapSchema.parse(req.body);
    // Process validated data
  } catch (error) {
    return res.status(400).json({ error: "Invalid input" });
  }
}
```

### Environment Variables

```typescript
// ✅ Good: Validate environment variables
const envSchema = z.object({
  NEXT_PUBLIC_WORLDCOIN_APP_ID: z.string(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
});

const env = envSchema.parse(process.env);
```

### Rate Limiting

```typescript
// ✅ Good: Implement rate limiting
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: "Too many swap requests, please try again later.",
});
```

## Deployment Process

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Performance testing completed
- [ ] Security scan passed

### Deployment Steps

```bash
# 1. Build and test
npm run build
npm run test

# 2. Deploy to staging
vercel --target staging

# 3. Run E2E tests on staging
npm run test:e2e -- --config=staging

# 4. Deploy to production
vercel --prod

# 5. Monitor deployment
# Check logs and metrics
```

### Rollback Procedure

```bash
# 1. Identify last known good deployment
vercel ls

# 2. Rollback to previous version
vercel rollback <deployment-url>

# 3. Verify rollback
# Test critical functionality
```

## Monitoring and Debugging

### Error Tracking

```typescript
// ✅ Good: Use error boundaries
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### Logging

```typescript
// ✅ Good: Structured logging
const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: "info", message, ...meta }));
  },
  error: (message: string, error?: Error, meta?: object) => {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        error: error?.message,
        stack: error?.stack,
        ...meta,
      })
    );
  },
};

// Usage
logger.info("Swap initiated", { userId, amount });
logger.error("Swap failed", error, { userId, amount });
```

## Documentation Standards

### Code Documentation

````typescript
/**
 * Calculates the total GASH amount including bonus for a WLD swap
 *
 * @param wldAmount - The amount of WLD tokens to swap
 * @param exchangeRate - Current WLD to GASH exchange rate
 * @param bonusPercentage - Bonus percentage (0.01 = 1%)
 * @returns Object containing base amount, bonus, and total GASH
 *
 * @example
 * ```typescript
 * const result = calculateSwapAmount(100, 0.0001, 0.01);
 * console.log(result.total); // 0.0101
 * ```
 */
const calculateSwapAmount = (
  wldAmount: number,
  exchangeRate: number,
  bonusPercentage: number
): SwapCalculation => {
  // Implementation
};
````

### README Updates

Keep README.md updated with:

- Project description
- Setup instructions
- Available scripts
- Environment variables
- Deployment instructions

---

Following these development practices ensures high-quality, maintainable code and smooth team collaboration for the WLD → GASH Swap MiniApp project.
