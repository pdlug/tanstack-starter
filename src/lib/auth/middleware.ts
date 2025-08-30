import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { auth } from "@/lib/auth/auth";

// Session middleware: retrieves auth session from request headers
export const sessionMiddleware = createMiddleware().server(async ({ next }) => {
  const request = getRequest();

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return next({
    context: {
      authSession: session,
    },
  });
});

// Server function middleware: ensures a session exists for function execution
export const authMiddleware = createMiddleware({ type: "function" })
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    if (!context.authSession) {
      throw new Error("Unauthorized: Authentication required");
    }

    return next({
      context: {
        authSession: context.authSession,
      },
    });
  });
