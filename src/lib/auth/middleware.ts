import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";

import { resolveAuthSession } from "@/lib/auth/auth";
import { UnauthorizedError } from "@/lib/errors";

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const authSession = await resolveAuthSession(env, getRequestHeaders());
    if (!authSession) {
      throw new UnauthorizedError("Authentication required");
    }

    return next({ context: { authSession } });
  },
);
