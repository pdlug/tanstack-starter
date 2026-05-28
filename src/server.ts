import "@/types/server-context";

import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

const startHandler = createStartHandler(defaultStreamHandler);

export default {
  fetch: (
    request: Readonly<Request>,
    env: Readonly<Env>,
    executionContext: Readonly<ExecutionContext>,
  ) => startHandler(request, { context: { env, executionContext } }),
};
