import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { resolveAuthSession } from "@/lib/auth/auth";

export const getAuthSession = createServerFn({ method: "GET" }).handler(
  ({ context }) => resolveAuthSession(context.env, getRequestHeaders()),
);
