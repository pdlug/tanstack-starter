import { createAuthClient } from "better-auth/react";

import { env } from "@/env/client";

function getBaseURL() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (globalThis.window === undefined) {
    return env.VITE_BASE_URL;
  }
  return globalThis.location.origin;
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});
