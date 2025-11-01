import "@/types/tanstack-start";

import { createMiddleware } from "@tanstack/react-start";

import { connectToDB } from "@/db/db";
import { MissingContextError } from "@/lib/errors";
import {
  isServerContext,
  type ServerRequestContext,
} from "@/types/server-context";

// Server function middleware: attaches a db connection to function context
export const dbMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next, context }) => {
    if (!isServerContext(context)) {
      throw new MissingContextError("Database bindings are not available");
    }
    const context_ = context as ServerRequestContext;
    const db = connectToDB(context_.env.DB);

    return next({
      context: {
        db,
      },
    });
  },
);
