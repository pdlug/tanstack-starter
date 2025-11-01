import "@/types/tanstack-start";

import { createMiddleware } from "@tanstack/react-start";

import { getAuth } from "@/lib/auth/auth";
import { MissingContextError, UnauthorizedError } from "@/lib/errors";
import {
  isServerContext,
  type ServerRequestContext,
} from "@/types/server-context";

export const sessionRequestMiddleware = createMiddleware({
  type: "request",
}).server(async ({ request, context, next }) => {
  if (!isServerContext(context)) {
    throw new MissingContextError("Failed to access Cloudflare bindings");
  }
  const context_ = context as ServerRequestContext;

  const auth = getAuth(context_.env);
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return next({
    context: {
      authSession: session ?? undefined,
    },
  });
});

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next, context }) => {
    if (!isServerContext(context)) {
      throw new UnauthorizedError("Authentication required");
    }
    const context_ = context as ServerRequestContext;
    if (!context_.authSession) {
      throw new UnauthorizedError("Authentication required");
    }

    return next({
      context: {
        authSession: context_.authSession,
      },
    });
  },
);
