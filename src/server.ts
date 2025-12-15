import "@/types/tanstack-start";

import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

const startHandler = createStartHandler(defaultStreamHandler);

// Type assertion bridges Cloudflare Workers and TanStack Start signatures.
// Cloudflare Workers: (Request, Env, ExecutionContext)
// TanStack Start: (Request, { context })
// Module augmentation in @/types/tanstack-start extends the context type,
// but doesn't fully propagate here, requiring this assertion.
type StartHandlerOptions = Parameters<typeof startHandler>[1];

export default {
  fetch(
    request: Readonly<Request>,
    env: Readonly<Env>,
    executionContext: Readonly<ExecutionContext>,
  ) {
    return startHandler(request, {
      context: { env, executionCtx: executionContext },
    } as unknown as StartHandlerOptions);
  },
};
