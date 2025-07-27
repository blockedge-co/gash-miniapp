# World ID Integration with Dev Bypass - Testing Plan

## Overview

This document outlines the testing plan for verifying the World ID integration with development bypass feature.

## Test Cases

### 1. Dev Bypass Button Visibility

**Objective**: Verify that the Dev Bypass button only appears in development mode

**Test Steps**:

1. Start the application in development mode (`npm run dev`)
2. Navigate to the onboarding page (`/onboarding`)
3. Check that both "Connect with World ID" and "Dev Bypass (Mock Authentication)" buttons are visible
4. Set `NEXT_PUBLIC_MOCK_MODE=false` in environment variables
5. Restart the application
6. Navigate to the onboarding page
7. Check that only "Connect with World ID" button is visible

**Expected Results**:

- In development mode (NEXT_PUBLIC_MOCK_MODE=true): Both buttons should be visible
- In production mode (NEXT_PUBLIC_MOCK_MODE=false): Only World ID button should be visible

### 2. Mock Authentication Flow

**Objective**: Verify that the Dev Bypass button correctly authenticates users in development mode

**Test Steps**:

1. Ensure application is in development mode
2. Navigate to the onboarding page
3. Click the "Dev Bypass (Mock Authentication)" button
4. Observe loading state during authentication
5. Verify redirection to dashboard page (`/dashboard`)
6. Check that user data is properly set in the app store
7. Verify that the AuthGuard allows access to the dashboard

**Expected Results**:

- User should be redirected to dashboard after clicking Dev Bypass
- App store should contain mock user data
- AuthGuard should allow access to authenticated users
- Loading state should be displayed during authentication

### 3. AuthGuard Protection

**Objective**: Verify that the AuthGuard properly protects the dashboard page

**Test Steps**:

1. Clear application state/storage
2. Navigate directly to the dashboard page (`/dashboard`)
3. Verify redirection to onboarding page
4. Complete authentication via Dev Bypass
5. Navigate directly to dashboard page
6. Verify access is granted

**Expected Results**:

- Unauthenticated users should be redirected to onboarding
- Authenticated users should have access to dashboard

### 4. Real World ID Button (Placeholder)

**Objective**: Verify that the real World ID button exists and shows appropriate messaging

**Test Steps**:

1. Navigate to the onboarding page
2. Click the "Connect with World ID" button
3. Observe error message about unimplemented feature

**Expected Results**:

- Button should be present
- Should show appropriate error message about unimplemented feature

## Manual Testing Instructions

### Setting up Development Environment

1. Ensure `.env.local` file exists with `NEXT_PUBLIC_MOCK_MODE=true`
2. Run `npm run dev` to start the development server
3. Open browser to `http://localhost:3000`

### Testing Dev Bypass Flow

1. Open the application in a browser
2. You should be redirected to `/onboarding`
3. Verify both buttons are visible
4. Click "Dev Bypass (Mock Authentication)"
5. Observe loading spinner for ~1 second
6. Verify redirection to `/dashboard`
7. Check that dashboard displays mock user data

### Testing AuthGuard

1. Clear browser storage (localStorage, sessionStorage)
2. Navigate directly to `http://localhost:3000/dashboard`
3. Verify redirection to `/onboarding`
4. Complete Dev Bypass authentication
5. Navigate directly to `/dashboard`
6. Verify access is granted

## Automated Testing Considerations

- Add unit tests for the `useWorldId` hook
- Add integration tests for the onboarding flow
- Add tests for the AuthGuard component
- Test both development and production modes

## Edge Cases to Consider

- What happens if mock authentication fails?
- How does the system handle rapid button clicks?
- What happens if the user navigates away during authentication?
- How does the system handle browser refresh after authentication?
