import { createAuthClient } from "better-auth/react";

import { env } from "@/env/client";

const baseURL =
  import.meta.env.SSR ? env.VITE_BASE_URL : globalThis.location.origin;

export const authClient = createAuthClient({ baseURL });
