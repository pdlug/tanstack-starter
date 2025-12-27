import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

import type { DB } from "@/db/db";
import type { MaybeAuthSession } from "@/types/auth";

declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: {
        env: Env;
        executionCtx: ExecutionContext;
        authSession?: MaybeAuthSession;
        db?: DB;
      };
    };
  }
}

const startHandler = createStartHandler(defaultStreamHandler);

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
