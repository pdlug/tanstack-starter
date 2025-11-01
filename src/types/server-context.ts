import type { DB } from "@/db/db";
import type { MaybeAuthSession } from "@/types/auth";

// Server request context type that matches the module augmentation in start.tsx
export type ServerRequestContext = Readonly<{
  env: Env;
  executionCtx: ExecutionContext;
  authSession?: MaybeAuthSession;
  db?: DB;
}>;

// Type guard to assert context has the expected shape
export function isServerContext(
  context: unknown,
): context is ServerRequestContext {
  return (
    typeof context === "object" &&
    context !== null &&
    "env" in context &&
    typeof (context as ServerRequestContext).env === "object"
  );
}
