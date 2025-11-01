import "@/types/tanstack-start";

import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

const startHandler = createStartHandler(defaultStreamHandler);

// Note: ServerEntry type from @tanstack/react-start/server-entry is available
// but incompatible with Cloudflare Workers signature (Request, Env, ExecutionContext)
// vs TanStack's expected signature (Request, opts?). Type assertion needed because
// module augmentation doesn't fully propagate to this context.
export default {
  fetch(
    request: Readonly<Request>,
    env: Readonly<Env>,
    executionContext: Readonly<ExecutionContext>,
  ) {
    // Type assertion needed to bridge Cloudflare Workers and TanStack Start types
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return startHandler(request, {
      context: {
        env,
        executionCtx: executionContext,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  },
};
