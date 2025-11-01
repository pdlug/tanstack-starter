import { z } from "zod";

const ServerEnvSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url().optional(),
  VITE_BASE_URL: z.url().default("http://localhost:3000"),
});

export type ServerEnv = Readonly<z.infer<typeof ServerEnvSchema>>;

export function resolveServerEnv(bindings: Readonly<Env>): ServerEnv {
  return ServerEnvSchema.parse({
    BETTER_AUTH_SECRET: bindings.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: bindings.BETTER_AUTH_URL,
    VITE_BASE_URL: bindings.VITE_BASE_URL,
  });
}
