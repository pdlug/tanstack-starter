import "@/types/tanstack-start";

import { createFileRoute } from "@tanstack/react-router";

import { getAuth } from "@/lib/auth/auth";
import { MissingContextError } from "@/lib/errors";
import {
  isServerContext,
  type ServerRequestContext,
} from "@/types/server-context";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request, context }) => {
        if (!isServerContext(context)) {
          throw new MissingContextError("Cloudflare bindings unavailable");
        }
        const context_ = context as ServerRequestContext;
        const auth = getAuth(context_.env);
        return auth.handler(request);
      },
      POST: ({ request, context }) => {
        if (!isServerContext(context)) {
          throw new MissingContextError("Cloudflare bindings unavailable");
        }
        const context_ = context as ServerRequestContext;
        const auth = getAuth(context_.env);
        return auth.handler(request);
      },
    },
  },
});
