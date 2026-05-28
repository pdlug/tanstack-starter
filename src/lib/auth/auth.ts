import "@tanstack/react-start/server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { connectToDB } from "@/db/db";
import { resolveServerEnv } from "@/env/server";
import type { AuthSession } from "@/types/auth";

type AuthInstance = ReturnType<typeof createAuthInstance>;

function createAuthInstance(
  env: Env,
  runtimeEnv: ReturnType<typeof resolveServerEnv>,
) {
  return betterAuth({
    baseURL: runtimeEnv.BETTER_AUTH_URL ?? runtimeEnv.VITE_BASE_URL,
    secret: runtimeEnv.BETTER_AUTH_SECRET,
    emailAndPassword: { enabled: true },
    database: drizzleAdapter(connectToDB(env.DB), { provider: "sqlite" }),
    plugins: [tanstackStartCookies()],
  });
}

const authInstances = new Map<string, AuthInstance>();

export function getAuth(env: Env): AuthInstance {
  const runtimeEnv = resolveServerEnv(env);
  const cacheKey = `${runtimeEnv.BETTER_AUTH_SECRET}:${runtimeEnv.BETTER_AUTH_URL ?? runtimeEnv.VITE_BASE_URL}`;

  const cached = authInstances.get(cacheKey);
  if (cached) return cached;

  const instance = createAuthInstance(env, runtimeEnv);
  // eslint-disable-next-line functional/immutable-data -- module-level memoization cache
  authInstances.set(cacheKey, instance);
  return instance;
}

export async function resolveAuthSession(
  env: Env,
  headers: Headers,
): Promise<AuthSession | undefined> {
  try {
    const session = await getAuth(env).api.getSession({ headers });
    if (!session) return;
    return {
      user: { ...session.user, image: session.user.image ?? undefined },
    };
  } catch (error) {
    console.error("[auth] Session resolution failed", error);
    return;
  }
}
