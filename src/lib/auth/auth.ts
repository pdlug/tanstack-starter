import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

import { connectToDB } from "@/db/db";
import { getBindings } from "@/utils/bindings";

/**
 * Better Auth configuration for runtime use
 *
 * Note: Keep auth.cli.ts in sync with this config structure
 * for CLI schema generation compatibility.
 */
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(connectToDB(getBindings().DB), {
    provider: "sqlite",
  }),
  plugins: [reactStartCookies()],
});
