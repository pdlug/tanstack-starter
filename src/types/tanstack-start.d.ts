import type { DB } from "../db/db";
import type { MaybeAuthSession } from "./auth";

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

declare module "@tanstack/react-router" {
  interface Register {
    router: {
      context: {
        authSession: MaybeAuthSession;
        env?: Env;
      };
    };
  }
}
