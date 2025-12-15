# Authentication Middleware

This project uses Better Auth with TanStack Start middleware.

## Architecture

The middleware is designed for efficiency:

- **Global session fetching**: `sessionRequestMiddleware` runs as request middleware (configured in `src/start.tsx`) and fetches the session **once per request**, exposing it as `context.authSession`.
- **Lightweight auth checking**: `authMiddleware` is function middleware used on protected server functions. It only validates the already-fetched session.

## Available Middleware

### `sessionRequestMiddleware` (request)

Fetches the Better Auth session and provides it as context. Runs automatically on all requests.

### `authMiddleware` (function)

Requires authentication. Throws `UnauthorizedError` if no valid session exists. Does **not** re-fetch the session.

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

For routes or functions that don't require auth, use the global session context:

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

## Notes

- Loaders and server functions can read `context.authSession` without additional calls.
- The `getAuthSession` server function in `src/lib/auth/functions/get-auth-session.ts` is used in the root route to hydrate client-side router context.
