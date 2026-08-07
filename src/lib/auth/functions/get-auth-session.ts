import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";

import { resolveAuthSession } from "@/lib/auth/auth";

export const getAuthSession = createServerFn({ method: "GET" }).handler(() =>
  resolveAuthSession(env, getRequestHeaders()),
);
