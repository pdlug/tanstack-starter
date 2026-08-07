import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

import { getAuth } from "@/lib/auth/auth";

function handleAuthRequest({ request }: Readonly<{ request: Request }>) {
  return getAuth(env).handler(request);
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: handleAuthRequest,
      POST: handleAuthRequest,
    },
  },
});
