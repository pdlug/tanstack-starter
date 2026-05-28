import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

/**
 * CLI-only auth configuration for schema generation.
 *
 * Used by @better-auth/cli to generate database schemas without requiring
 * runtime environment variables or Cloudflare bindings. Keep this in sync
 * with src/lib/auth/auth.ts's plugin and database-provider configuration.
 */
export const auth = betterAuth({
  secret: "cli-only-schema-generation-placeholder-secret",
  emailAndPassword: { enabled: true },
  database: drizzleAdapter({}, { provider: "sqlite" }),
});
