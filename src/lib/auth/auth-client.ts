import { createAuthClient } from "better-auth/react";

function getBaseURL() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (globalThis.window === undefined) {
    return "http://localhost:3000";
  }
  return globalThis.location.origin;
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});
