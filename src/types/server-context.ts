export type ServerRequestContext = Readonly<{
  env: Env;
  executionContext: ExecutionContext;
}>;

declare module "@tanstack/router-core" {
  interface Register {
    server: {
      requestContext: ServerRequestContext;
    };
  }
}
