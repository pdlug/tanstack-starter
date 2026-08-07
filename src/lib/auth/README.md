# Authentication

This project uses Better Auth with TanStack Start.

## Session resolution

`resolveAuthSession(env, headers)` (in `auth.ts`) is the single entry point for
reading a session. It calls Better Auth's `getSession`, normalizes the result,
and returns `AuthSession | undefined`. Both consumers below build on it:

- **`getAuthSession`** (`functions/get-auth-session.ts`) — a server function the
  root route calls in `beforeLoad` to hydrate the client-side router context.
- **`authMiddleware`** (`middleware.ts`) — function middleware for protected
  server functions. It resolves the session and throws `UnauthorizedError` when
  none exists, then exposes a guaranteed `context.authSession`.

## Usage

### Required authentication

```typescript
import { authMiddleware } from "@/lib/auth/middleware";

const protectedServerFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // authMiddleware guarantees context.authSession is present
    console.log("User ID:", context.authSession.user.id);
  });
```

### Optional authentication

Without `authMiddleware`, `context.authSession` is not populated — resolve the
session explicitly instead:

```typescript
import { getRequestHeaders } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";

import { resolveAuthSession } from "@/lib/auth/auth";

const publicServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await resolveAuthSession(env, getRequestHeaders());
  return { greeting: session ? `Hello ${session.user.email}` : "Hello" };
});
```

## Notes

- Each `authMiddleware`-protected server function resolves the session
  independently. Better Auth caches the underlying lookup per instance; enable
  `session.cookieCache` in `auth.ts` if you need to eliminate repeated reads.
- Routes that must be authenticated live under `src/routes/_authed/`, whose
  layout redirects unauthenticated visitors to `/sign-in`.
