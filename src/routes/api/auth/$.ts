import { createFileRoute } from "@tanstack/react-router";

import { getAuth } from "@/lib/auth/auth";

function handleAuthRequest({
  request,
  context,
}: Readonly<{ request: Request; context: { env: Env } }>) {
  return getAuth(context.env).handler(request);
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: handleAuthRequest,
      POST: handleAuthRequest,
    },
  },
});
