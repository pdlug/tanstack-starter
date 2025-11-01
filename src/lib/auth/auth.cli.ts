import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import type { DB } from "@/db/db";

/**
 * CLI-only auth configuration for schema generation
 *
 * This config is used by @better-auth/cli to generate database schemas
 * without requiring runtime environment variables or Cloudflare types.
 *
 * Keep this in sync with src/lib/auth.ts structure but without runtime dependencies.
 */
export const auth = betterAuth({
  secret: "development",
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(undefined as unknown as DB, {
    provider: "sqlite",
  }),
  plugins: [], // No runtime plugins needed for schema generation
});
