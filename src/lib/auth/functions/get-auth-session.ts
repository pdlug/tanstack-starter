import "@/types/tanstack-start";

import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { getAuth } from "@/lib/auth/auth";
import { MissingContextError } from "@/lib/errors";
import {
  isServerContext,
  type ServerRequestContext,
} from "@/types/server-context";

export const getAuthSession = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    if (!isServerContext(context)) {
      throw new MissingContextError("Failed to resolve Cloudflare bindings");
    }
    const context_ = context as ServerRequestContext;

    if (context_.authSession) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session: context_.authSession.session as any,
        user: context_.authSession.user,
      };
    }

    const request = getRequest();
    const auth = getAuth(context_.env);
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) return;
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session: session.session as any,
      user: session.user,
    };
  },
);
