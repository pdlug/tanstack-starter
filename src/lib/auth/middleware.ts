import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "@/lib/auth/auth";

// Global middleware that fetches session once for all routes
export const sessionMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const { headers } = getWebRequest();
    const session = await auth.api.getSession({
      headers,
    });

    return next({
      context: {
        authSession: session,
      },
    });
  },
);

// Lightweight middleware that requires authentication (reuses existing session)
export const authMiddleware = createMiddleware({ type: "function" })
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    // Session was already fetched by sessionMiddleware dependency
    if (!context.authSession) {
      throw new Error("Unauthorized: Authentication required");
    }

    return next({
      context: {
        authSession: context.authSession,
      },
    });
  });
