import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { getAuth } from "@/lib/auth/auth";
import { MissingContextError } from "@/lib/errors";
import type { AuthSession } from "@/types/auth";
import {
  isServerContext,
  type ServerRequestContext,
} from "@/types/server-context";

function normalizeAuthSession(
  session: Readonly<{ user: Readonly<{ id: string; email?: string }> }>,
): AuthSession {
  const { id, email } = session.user;
  return {
    user: email === undefined ? { id } : { id, email },
  };
}

export const getAuthSession = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    if (!isServerContext(context)) {
      throw new MissingContextError("Failed to resolve Cloudflare bindings");
    }
    const context_ = context as ServerRequestContext;

    if (context_.authSession) {
      return normalizeAuthSession(context_.authSession);
    }

    try {
      const auth = getAuth(context_.env);
      const session = await auth.api.getSession({
        headers: getRequestHeaders(),
      });

      if (!session) return;
      return normalizeAuthSession(session);
    } catch (error) {
      // Better Auth may throw errors without proper status codes
      console.error("[getAuthSession] Auth error:", error);
      return;
    }
  },
);
