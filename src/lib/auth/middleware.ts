import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { getAuth } from "@/lib/auth/auth";
import { MissingContextError, UnauthorizedError } from "@/lib/errors";
import {
  isServerContext,
  type ServerRequestContext,
} from "@/types/server-context";

const SESSION_LOOKUP_BYPASS_PATHS = new Set<string>([
  "/api/auth",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

const SESSION_LOOKUP_BYPASS_PREFIXES: readonly string[] = [
  "/api/auth/",
  "/assets/",
];
const STATIC_FILE_PATH_PATTERN = /\/[^/?]+\.[a-z\d]+$/iu;

export function shouldSkipSessionLookup(pathname: string): boolean {
  if (SESSION_LOOKUP_BYPASS_PATHS.has(pathname)) return true;
  if (
    SESSION_LOOKUP_BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return true;
  }

  return STATIC_FILE_PATH_PATTERN.test(pathname);
}

export const sessionRequestMiddleware = createMiddleware({
  type: "request",
}).server(async ({ context, next, pathname }) => {
  if (!isServerContext(context)) {
    throw new MissingContextError("Failed to access Cloudflare bindings");
  }

  if (shouldSkipSessionLookup(pathname)) {
    return next({
      context: {
        authSession: undefined,
      },
    });
  }

  const context_ = context as ServerRequestContext;

  try {
    const auth = getAuth(context_.env);
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    });

    return await next({
      context: {
        authSession: session ?? undefined,
      },
    });
  } catch (error) {
    // Better Auth may throw errors without proper status codes
    // Log and continue without session rather than crashing
    console.error("[sessionMiddleware] Auth error:", error);
    return next({
      context: {
        authSession: undefined,
      },
    });
  }
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
