import "@tanstack/react-start/server-only";

import type { BetterAuthPlugin } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { connectToDB } from "@/db/db";
import { resolveServerEnv } from "@/env/server";

// Cache variables must be mutable for singleton pattern
// eslint-disable-next-line functional/no-let
let cachedAuth: ReturnType<typeof createAuthInstance> | undefined;
// eslint-disable-next-line functional/no-let
let cachedEnvKey: string | undefined;

function createAuthInstance(
  env: Env,
  runtimeEnv: ReturnType<typeof resolveServerEnv>,
) {
  const cookiesPlugin = tanstackStartCookies() as unknown as BetterAuthPlugin;

  return betterAuth({
    baseURL: runtimeEnv.BETTER_AUTH_URL ?? runtimeEnv.VITE_BASE_URL,
    secret: runtimeEnv.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
    },
    database: drizzleAdapter(connectToDB(env.DB), {
      provider: "sqlite",
    }),
    plugins: [cookiesPlugin],
  });
}

export function getAuth(env: Env) {
  const runtimeEnv = resolveServerEnv(env);
  const envKey = `${runtimeEnv.BETTER_AUTH_SECRET}:${runtimeEnv.BETTER_AUTH_URL ?? runtimeEnv.VITE_BASE_URL}`;

  if (!cachedAuth || cachedEnvKey !== envKey) {
    cachedAuth = createAuthInstance(env, runtimeEnv);
    cachedEnvKey = envKey;
  }

  return cachedAuth;
}
