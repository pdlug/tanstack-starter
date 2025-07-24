# Authentication Middleware

This project uses TanStack Start middleware for authentication with Better Auth.

## Architecture

The middleware is designed for efficiency:

- **Global Session Fetching**: `sessionMiddleware` runs globally and fetches the session ONCE per request
- **Lightweight Auth Checking**: `requireAuthMiddleware` just validates the already-fetched session

## Available Middleware

### `sessionMiddleware` (Global)

Fetches the Better Auth session and provides it as context. Runs automatically on all routes.

### `requireAuthMiddleware` / `authMiddleware`

Lightweight middleware that requires authentication. Throws an error if no valid session exists. Does NOT re-fetch the session.

## Usage Examples

### Required Authentication

```typescript
import { authMiddleware } from "@/lib/auth/middleware";

const protectedServerFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // context.authSession is guaranteed to exist
    console.log("User ID:", context.authSession.user.id);
    // ... your logic
  });
```

### Optional Authentication

For routes that don't require auth, just use the global session context:

```typescript
const publicServerFn = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  if (context.authSession) {
    console.log("Logged in user:", context.authSession.user.id);
  } else {
    console.log("Anonymous user");
  }
  // ... your logic
});
```

## Performance Benefits

- ✅ Session decoded **once per request** (global middleware)
- ✅ Auth checks are lightweight validation only
- ✅ No duplicate session fetching on protected routes
- ✅ Automatic session context on ALL server functions

## Type Safety Benefits

- ✅ **`authMiddleware`**: TypeScript guarantees `context.authSession` is non-null
- ✅ **`sessionMiddleware`**: TypeScript correctly shows `context.authSession` can be null
- ✅ **Global middleware**: All routes get session context automatically
- ✅ **No type assertions needed**: Middleware handles type narrowing

## Global Middleware

Global middleware automatically provides session context to all server functions via `src/global-middleware.ts`. Protected routes add `authMiddleware` for validation only.
