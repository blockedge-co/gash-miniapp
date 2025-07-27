# Component Specifications - WLD → GASH Swap MiniApp

## Overview

This document provides detailed specifications for all React components in the WLD → GASH Swap MiniApp. Each component is designed to be reusable, accessible, and follows consistent design patterns.

## Design System

### Color Palette

```css
:root {
  /* Primary Colors */
  --color-primary: #ffd700; /* Gold */
  --color-primary-dark: #b8860b; /* Dark Gold */
  --color-primary-light: #ffef94; /* Light Gold */

  /* Background Colors */
  --color-bg-primary: #0a0a0a; /* Deep Black */
  --color-bg-secondary: #1a1a1a; /* Dark Gray */
  --color-bg-tertiary: #2a2a2a; /* Medium Gray */

  /* Text Colors */
  --color-text-primary: #ffffff; /* White */
  --color-text-secondary: #b0b0b0; /* Light Gray */
  --color-text-muted: #808080; /* Gray */

  /* Status Colors */
  --color-success: #10b981; /* Green */
  --color-error: #ef4444; /* Red */
  --color-warning: #f59e0b; /* Orange */
  --color-info: #3b82f6; /* Blue */
}
```

### Typography Scale

```css
/* Font Sizes */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing Scale

```css
/* Spacing */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
```

## Base UI Components

### Button Component

**File**: `src/components/ui/Button.tsx`

**Purpose**: Reusable button component with multiple variants and states.

**Props**:

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}
```

**Variants**:

- `primary`: Gold background with black text
- `secondary`: Dark background with gold border
- `outline`: Transparent background with gold border
- `ghost`: Transparent background, no border

**States**:

- Default
- Hover (brightness increase)
- Active (scale down slightly)
- Disabled (opacity 50%)
- Loading (spinner animation)

**Usage Example**:

```tsx
<Button variant="primary" size="lg" loading={isLoading} onClick={handleSwap}>
  Swap Tokens
</Button>
```

### Input Component

**File**: `src/components/ui/Input.tsx`

**Purpose**: Form input component with validation and error states.

**Props**:

```typescript
interface InputProps {
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
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  autoFocus?: boolean;
}
```

**Features**:

- Floating label animation
- Error state with red border and message
- Prefix/suffix support for icons or text
- Number input with validation
- Auto-formatting for token amounts

**Usage Example**:

```tsx
<Input
  type="number"
  label="WLD Amount"
  value={amount}
  onChange={setAmount}
  placeholder="0.00"
  suffix="WLD"
  error={validationError}
  min={0.001}
  max={1000}
  step={0.001}
/>
```

### Modal Component

**File**: `src/components/ui/Modal.tsx`

**Purpose**: Overlay modal component for confirmations and detailed views.

**Props**:

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}
```

**Features**:

- Backdrop blur effect
- Smooth slide-up animation
- Keyboard navigation (ESC to close)
- Focus management
- Responsive sizing

**Usage Example**:

```tsx
<Modal
  isOpen={showConfirmation}
  onClose={() => setShowConfirmation(false)}
  title="Confirm Swap"
  size="md"
>
  <SwapConfirmation {...confirmationProps} />
</Modal>
```

### Card Component

**File**: `src/components/ui/Card.tsx`

**Purpose**: Container component with consistent styling and spacing.

**Props**:

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  hover?: boolean;
  onClick?: () => void;
}
```

**Features**:

- Gradient border effect
- Hover animations
- Responsive padding
- Glass morphism effect

**Usage Example**:

```tsx
<Card padding="lg" shadow="md" hover>
  <HoldingsCard portfolio={portfolio} />
</Card>
```

### LoadingSpinner Component

**File**: `src/components/ui/LoadingSpinner.tsx`

**Purpose**: Animated loading indicator with gold theme.

**Props**:

```typescript
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white";
  className?: string;
  text?: string;
}
```

**Animation**: Rotating gold ring with pulsing effect

**Usage Example**:

```tsx
<LoadingSpinner size="lg" text="Processing swap..." />
```

## Layout Components

### Header Component

**File**: `src/components/layout/Header.tsx`

**Purpose**: Top navigation bar with title and user info.

**Props**:

```typescript
interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}
```

**Features**:

- Back navigation button
- Centered title
- Action buttons on the right
- Sticky positioning

**Usage Example**:

```tsx
<Header
  title="Swap"
  showBack
  onBack={() => router.back()}
  actions={<UserMenu />}
/>
```

### BottomNavigation Component

**File**: `src/components/layout/BottomNav.tsx`

**Purpose**: Bottom tab navigation for main app sections.

**Props**:

```typescript
interface BottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  className?: string;
}
```

**Navigation Items**:

- Swap (home icon)
- Vault (safe icon)
- History (clock icon)

**Features**:

- Active state highlighting
- Smooth transitions
- Badge support for notifications

**Usage Example**:

```tsx
<BottomNavigation
  currentPath="/dashboard"
  onNavigate={(path) => router.push(path)}
/>
```

## Swap Components

### SwapForm Component

**File**: `src/components/swap/SwapForm.tsx`

**Purpose**: Main swap interface with amount input and rate display.

**Props**:

```typescript
interface SwapFormProps {
  onSubmit: (amount: number) => void;
  isLoading: boolean;
  currentRate: ExchangeRate | null;
  error?: string;
  maxAmount?: number;
}
```

**Features**:

- Real-time rate updates
- Amount validation
- Max button for full balance
- Swap preview calculation
- Error handling

**Layout**:

```
┌─────────────────────────┐
│ WLD Amount Input        │
├─────────────────────────┤
│ Current Rate Display    │
├─────────────────────────┤
│ Swap Preview           │
│ • Base GASH: X.XX      │
│ • Bonus: X.XX          │
│ • Total: X.XX          │
├─────────────────────────┤
│ [Swap Tokens] Button   │
└─────────────────────────┘
```

### SwapConfirmation Component

**File**: `src/components/swap/SwapConfirmation.tsx`

**Purpose**: Modal confirmation dialog showing swap details.

**Props**:

```typescript
interface SwapConfirmationProps {
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
```

**Layout**:

```
┌─────────────────────────┐
│ Swap Summary           │
├─────────────────────────┤
│ Amount: 100 WLD        │
│ Rate: 1 WLD = 0.0001   │
│ Bonus: 0.00001 GASH    │
│ Total: 0.01001 GASH    │
├─────────────────────────┤
│ [Cancel] [Confirm]     │
└─────────────────────────┘
```

### SwapSuccess Component

**File**: `src/components/swap/SwapSuccess.tsx`

**Purpose**: Success modal with transaction details and actions.

**Props**:

```typescript
interface SwapSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  result: SwapResult;
}
```

**Features**:

- Success animation
- Transaction hash display
- Copy to clipboard functionality
- View on blockchain link
- Continue button

### SwapError Component

**File**: `src/components/swap/SwapError.tsx`

**Purpose**: Error modal with retry functionality.

**Props**:

```typescript
interface SwapErrorProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  error: string;
}
```

**Features**:

- Error icon animation
- Clear error message
- Retry button
- Support contact link

### RateDisplay Component

**File**: `src/components/swap/RateDisplay.tsx`

**Purpose**: Real-time exchange rate display with updates.

**Props**:

```typescript
interface RateDisplayProps {
  rate: ExchangeRate | null;
  amount?: number;
  isLoading: boolean;
  showBonus?: boolean;
}
```

**Features**:

- Live rate updates
- Bonus percentage display
- Rate validity indicator
- Loading skeleton

## History Components

### TransactionList Component

**File**: `src/components/history/TransactionList.tsx`

**Purpose**: Scrollable list of user transactions with pagination.

**Props**:

```typescript
interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
}
```

**Features**:

- Infinite scroll
- Pull-to-refresh
- Empty state
- Loading skeletons
- Transaction status indicators

### TransactionItem Component

**File**: `src/components/history/TransactionItem.tsx`

**Purpose**: Individual transaction row with details.

**Props**:

```typescript
interface TransactionItemProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
  showDetails?: boolean;
}
```

**Layout**:

```
┌─────────────────────────┐
│ GASH: 100.00      [✓]  │
│ TxHash: 0x1234...      │
│ WLD: 1.00              │
│ 2024-01-15             │
└─────────────────────────┘
```

### HoldingsCard Component

**File**: `src/components/history/HoldingsCard.tsx`

**Purpose**: Portfolio summary card with total holdings.

**Props**:

```typescript
interface HoldingsCardProps {
  portfolio: Portfolio;
  isLoading: boolean;
  showChart?: boolean;
}
```

**Features**:

- Total GASH balance
- USD value conversion
- Percentage change
- Mini chart (optional)
- Gold-themed styling

## Authentication Components

### WorldIDConnect Component

**File**: `src/components/auth/WorldIDConnect.tsx`

**Purpose**: World ID authentication button and flow.

**Props**:

```typescript
interface WorldIDConnectProps {
  onSuccess: (result: AuthResult) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
  className?: string;
}
```

**Features**:

- World ID SDK integration
- Loading states
- Error handling
- Verification level display

### AuthGuard Component

**File**: `src/components/auth/AuthGuard.tsx`

**Purpose**: Route protection component requiring authentication.

**Props**:

```typescript
interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}
```

**Features**:

- Authentication check
- Automatic redirects
- Loading states
- Custom fallback UI

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 640px) {
  /* sm */
}
@media (min-width: 768px) {
  /* md */
}
@media (min-width: 1024px) {
  /* lg */
}
@media (min-width: 1280px) {
  /* xl */
}
```

### Mobile Optimizations

- Touch-friendly button sizes (min 44px)
- Swipe gestures for navigation
- Optimized keyboard handling
- Safe area insets for notched devices

## Accessibility

### ARIA Labels

All interactive components include proper ARIA labels:

```tsx
<button
  aria-label="Swap WLD for GASH tokens"
  aria-describedby="swap-description"
  disabled={isLoading}
>
  {isLoading ? "Processing..." : "Swap Tokens"}
</button>
```

### Keyboard Navigation

- Tab order management
- Enter/Space key handling
- Escape key for modals
- Arrow keys for lists

### Screen Reader Support

- Semantic HTML structure
- Live regions for dynamic content
- Descriptive text for complex interactions

## Animation Guidelines

### Micro-interactions

```css
/* Button hover */
.button:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Loading spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Success animation */
@keyframes success-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
```

### Page Transitions

- Slide animations between pages
- Fade transitions for modals
- Stagger animations for lists

## Performance Considerations

### Code Splitting

```tsx
// Lazy load heavy components
const SwapChart = lazy(() => import("./SwapChart"));

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <SwapChart />
</Suspense>;
```

### Memoization

```tsx
// Memo for expensive calculations
const SwapPreview = memo(({ amount, rate }) => {
  const calculation = useMemo(
    () => calculateSwapAmount(amount, rate),
    [amount, rate]
  );

  return <div>{calculation}</div>;
});
```

### Image Optimization

```tsx
// Next.js Image component
<Image
  src="/icons/gash-logo.png"
  alt="GASH Token"
  width={32}
  height={32}
  priority={true}
/>
```

## Testing Strategy

### Component Testing

```tsx
// Example test for Button component
describe("Button", () => {
  it("renders with correct variant styles", () => {
    render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gold");
  });

  it("handles loading state", () => {
    render(<Button loading>Test</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
```

### Integration Testing

```tsx
// Example test for SwapForm
describe("SwapForm", () => {
  it("submits swap with valid amount", async () => {
    const onSubmit = jest.fn();
    render(<SwapForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("WLD Amount"), "100");
    await user.click(screen.getByRole("button", { name: /swap/i }));

    expect(onSubmit).toHaveBeenCalledWith(100);
  });
});
```

---

This component specification provides a comprehensive guide for implementing consistent, accessible, and performant UI components for the WLD → GASH Swap MiniApp.
